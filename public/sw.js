const VERSION = '1774227094';
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.matchAll({type:'window'})).then(clients => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
});
self.addEventListener('fetch', e => {
  // Pass everything through - no caching
  e.respondWith(fetch(e.request));
});
