// ShidoConnect — Service Worker Push Notifications
// Capte les notifications push même quand la PWA est fermée

self.addEventListener('push', function (event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text() || '' }; }

  const title   = data.title || 'Clinique — Votre tour approche';
  const options = {
    body:  data.body || data.message || 'Revenez à la clinique, c\'est bientôt votre tour !',
    icon:  '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag:   'queue-notification',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    data: { url: data.url || '/file' },
    actions: [
      { action: 'open',    title: 'Voir ma position' },
      { action: 'dismiss', title: 'OK, j\'arrive'    },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/file';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
