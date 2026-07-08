const CACHE_VERSION = 'sc-v1'
const STATIC_CACHE  = `${CACHE_VERSION}-static`
const API_CACHE     = `${CACHE_VERSION}-api`

// Ressources critiques à précacher
const PRECACHE = [
  '/',
  '/home',
  '/booking',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// ── Install : précache ressources statiques ──────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      cache.addAll(PRECACHE.map(url => new Request(url, { cache: 'reload' })))
        .catch(() => {})
    )
  )
})

// ── Activate : nettoyage des anciens caches ──────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE && k !== API_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch : stratégie par type de ressource ──────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // API ShidoMedical → Network-first, cache 5min en fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithCache(request, API_CACHE, 300))
    return
  }

  // Assets statiques → Cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|woff2?|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Pages HTML → Network-first avec fallback offline
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOfflineFallback(request))
    return
  }

  event.respondWith(networkFirst(request))
})

// ── Stratégies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('', { status: 503 })
  }
}

async function networkFirst(request) {
  try {
    return await fetch(request)
  } catch {
    const cached = await caches.match(request)
    return cached || new Response('', { status: 503 })
  }
}

async function networkFirstWithCache(request, cacheName, maxAgeSeconds) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      const headers = new Headers(response.headers)
      headers.set('sw-cached-at', Date.now().toString())
      const toCache = new Response(await response.clone().arrayBuffer(), { status: response.status, headers })
      cache.put(request, toCache)
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) {
      const cachedAt = Number(cached.headers.get('sw-cached-at') || 0)
      if (Date.now() - cachedAt < maxAgeSeconds * 1000) return cached
    }
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response(
      '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Hors ligne</title><style>body{font-family:Nunito,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f0faf6;color:#0f172a}h1{font-size:24px;font-weight:900}p{color:#64748b}</style></head><body><div style="font-size:64px">📡</div><h1>Vous êtes hors ligne</h1><p>Vérifiez votre connexion et réessayez.</p><button onclick="location.reload()" style="margin-top:24px;padding:14px 32px;border-radius:14px;background:#1D9E75;color:#fff;border:none;font-size:15px;font-weight:800;cursor:pointer">Réessayer</button></body></html>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  const data  = event.data?.json() || {}
  const title = data.title  || 'ShidoConnect'
  const body  = data.body   || 'Vous avez un nouveau message'
  const icon  = data.icon   || '/icons/icon-192x192.png'
  const url   = data.url    || '/home'

  event.waitUntil(
    self.registration.showNotification(title, {
      body, icon,
      badge: '/icons/icon-192x192.png',
      data: { url },
      vibrate: [200, 100, 200],
      tag: data.tag || 'shido-notif',
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/home'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes(url))
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})
