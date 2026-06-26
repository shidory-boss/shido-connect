// Kill switch — se désinstalle sur tous les appareils existants
// Ordre important : unregister AVANT navigate pour éviter toute boucle
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', async () => {
  // 1. Vider tous les caches
  const keys = await caches.keys()
  await Promise.all(keys.map(k => caches.delete(k)))
  // 2. Se désinscrire AVANT de recharger (empêche toute ré-installation)
  await self.registration.unregister()
  // 3. Recharger les clients — à ce stade le SW n'est plus inscrit
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach(client => client.navigate(client.url))
})
