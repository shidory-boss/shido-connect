// Kill switch — se désinstalle sur tous les appareils existants
// et force le rechargement vers la version fraîche de Vercel
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', async () => {
  const keys = await caches.keys()
  await Promise.all(keys.map(k => caches.delete(k)))
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach(client => client.navigate(client.url))
  await self.registration.unregister()
})
