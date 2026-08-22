const CACHE = 'mbm-pwa-v3';
const CORE = ['/', '/index.html', '/admin.html', '/style.css', '/admin.css', '/admin-enhancements.css', '/catalog-shared.css', '/checkout.css', '/store-enhancements.css', '/products.js', '/catalog.js', '/app.js', '/admin.js', '/manifest.webmanifest', '/icon.svg', '/pwa-icon.png', '/offline.html'];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())
));

self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())
));

// A versao online sempre tem prioridade. O cache serve apenas quando nao houver internet.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  const sameOrigin = new URL(request.url).origin === self.location.origin;

  event.respondWith(
    fetch(request).then(response => {
      if (response.ok && sameOrigin) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match('/offline.html')))
  );
});
