const CACHE_NAME = 'pesaje-kevo-v3'; // Subimos la versión a v3
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icono-192x192.png',
  '/icono-512x512.png'
];

// Instala y fuerza a que tome el control INMEDIATAMENTE
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activa y ELIMINA cualquier rastro de las versiones viejas (v1 y v2)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta las peticiones (offline mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }).catch(() => {
        // Redundancia: si falla, intenta forzar la pantalla principal
        return caches.match('/');
      })
  );
});
