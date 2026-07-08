import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_AVION_API_URL || 'http://localhost:8001'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let name = process.env.NEXT_PUBLIC_CLINIC_NAME || 'ShidoConnect'
  let shortName = process.env.NEXT_PUBLIC_CLINIC_NAME || 'ShidoConnect'
  let themeColor = '#1D9E75'

  try {
    const res = await fetch(`${BASE}/api/v1/pwa/config/public`, { next: { revalidate: 60 } })
    if (res.ok) {
      const cfg = await res.json()
      name      = cfg.clinic_name  || cfg.pwa_name || name
      shortName = cfg.pwa_name     || cfg.short_name || name.slice(0, 12)
      themeColor = cfg.accent_color || cfg.primary_color || themeColor
    }
  } catch {}

  return {
    name,
    short_name: shortName,
    description: 'Votre clinique dans votre poche — RDV, file d\'attente, dossier patient',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: themeColor,
    orientation: 'portrait',
    lang: 'fr',
    categories: ['health', 'medical'],
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Prendre un RDV',   url: '/booking',   icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }] },
      { name: "File d'attente",   url: '/queue',     icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }] },
      { name: 'Mon dossier',      url: '/records',   icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }] },
    ],
  }
}
