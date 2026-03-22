// Unregister this service worker and clear all caches
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async (event) => {
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))),
      // Claim clients
      self.clients.claim(),
    ])
  );
});
