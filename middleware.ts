import { NextRequest, NextResponse } from 'next/server'

// ── Rate limiting (mémoire par instance worker) ──────────────────────────────
const rateLimitStore = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT   = 600   // requêtes max (PWA charge ~40 assets/page)
const RATE_WINDOW  = 60_000 // par minute (ms)

// ── Patterns d'attaque à bloquer immédiatement ────────────────────────────────
const ATTACK_PATTERNS = [
  // Traversée de répertoire
  /\.\.[\/\\]/,
  // Injection SQL
  /(\bunion\b.+\bselect\b|\bdrop\s+table\b|\binsert\s+into\b|\bdelete\s+from\b|\bexec\s*\(|\bxp_cmdshell\b)/i,
  // Injection de commandes
  /(\beval\s*\(|base64_decode\s*\(|system\s*\(|passthru\s*\(|shell_exec\s*\()/i,
  // XSS
  /(<script[\s>]|javascript\s*:|vbscript\s*:|on\w+\s*=)/i,
  // Fichiers sensibles
  /\/(\.git|\.env|\.htaccess|wp-admin|wp-login|phpmyadmin|adminer|xmlrpc|\.ssh|proc\/self)/i,
  // Extensions dangereuses
  /\.(php|asp|aspx|jsp|cgi|sh|bash|py|pl|rb)\b/i,
]

// ── User-agents de scanners et bots malveillants ──────────────────────────────
const BLOCKED_UA = [
  /sqlmap/i, /nikto/i, /masscan/i, /nmap/i, /zgrab/i,
  /dirbuster/i, /gobuster/i, /wfuzz/i, /hydra/i, /medusa/i,
  /acunetix/i, /burpsuite/i, /w3af/i, /havij/i, /openvas/i,
  /python-requests\/[0-1]\./i, /curl\/[0-6]\./i,
]

function getIP(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const fullPath = pathname + search
  const ua = request.headers.get('user-agent') || ''
  const ip = getIP(request)

  // 1. Bloquer les scanners connus
  if (BLOCKED_UA.some(p => p.test(ua))) {
    return new NextResponse(null, { status: 403 })
  }

  // 2. Bloquer les patterns d'attaque dans l'URL
  if (ATTACK_PATTERNS.some(p => p.test(fullPath))) {
    return new NextResponse(null, { status: 403 })
  }

  // 3. Rate limiting par IP
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.reset) {
    rateLimitStore.set(ip, { count: 1, reset: now + RATE_WINDOW })
  } else {
    record.count++
    if (record.count > RATE_LIMIT) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'text/plain',
        },
      })
    }
  }

  // Nettoyage mémoire si trop d'entrées
  if (rateLimitStore.size > 5_000) {
    for (const [k, v] of rateLimitStore) {
      if (now > v.reset) rateLimitStore.delete(k)
    }
  }

  const res = NextResponse.next()

  // 4. Headers supplémentaires sur chaque réponse
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')

  return res
}

export const config = {
  matcher: [
    // Toutes les routes sauf assets statiques Next.js
    '/((?!_next/static|_next/image|favicon.ico|icons/|images/|manifest.json|sw.js|workbox-).*)',
  ],
}
