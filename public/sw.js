// Oria Care — Service Worker v3
// Offline cache + Push notifications

const CACHE_NAME = 'oria-care-v3'
const OFFLINE_URL = '/'

const CACHE_URLS = [
  '/',
  '/home',
  '/booking',
  '/queue',
  '/records',
  '/offline.html',
]

// ── Install : précache shell ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(CACHE_URLS.filter(u => u !== '/offline.html')).catch(() => {})
    ).then(() => self.skipWaiting())
  )
})

// ── Activate : purge anciens caches ──────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// ── Fetch : cache-first pour assets, network-first pour API ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Ignorer schemes non-cachables (chrome-extension, data, blob…)
  if (!url.protocol.startsWith('http')) return
  // Ignorer requêtes non-GET et API
  if (event.request.method !== 'GET') return
  if (url.pathname.startsWith('/api/') || (url.hostname === 'localhost' && url.port === '8001')) return

  // Assets statiques : cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone))
        return res
      }))
    )
    return
  }

  // Pages Next.js : network-first avec fallback cache
  event.respondWith(
    fetch(event.request).then(res => {
      const clone = res.clone()
      caches.open(CACHE_NAME).then(c => c.put(event.request, clone))
      return res
    }).catch(() =>
      caches.match(event.request).then(cached => cached || caches.match(OFFLINE_URL))
    )
  )
})

// ── Push notifications ────────────────────────────────
self.addEventListener('push', event => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch { data = { body: event.data?.text() || '' } }

  const title = data.title || 'Oria Care'
  const options = {
    body:    data.body || data.message || "Vous avez une notification",
    icon:    '/icons/icon-192x192.png',
    badge:   '/icons/icon-192x192.png',
    tag:     data.tag || 'shido-notif',
    requireInteraction: !!data.requireInteraction,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/notifications' },
    actions: data.actions || [
      { action: 'open',    title: 'Voir' },
      { action: 'dismiss', title: 'Fermer' },
    ],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// ── Notification click ────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  if (event.action === 'dismiss') return
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const existing = cls.find(c => c.url.includes(self.registration.scope))
      if (existing) { existing.focus(); existing.navigate(url) }
      else clients.openWindow(url)
    })
  )
})
