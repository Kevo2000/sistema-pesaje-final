const CACHE_NAME = 'pesaje-v4'; // Subimos a v4
const urlsToCache = [
  '/', // En Vercel, la raíz es tu app
  '/manifest.json',
  '/icono-192x192.png',
  '/icono-512x512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // EL TRUCO: Forzamos la recarga para evitar la redirección vacía de Vercel
        const requests = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché zombi:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    // ignoreSearch ignora si Vercel añade parámetros raros a la URL
    caches.match(event.request, { ignoreSearch: true })
      .then(response => {
        return response || fetch(event.request);
      }).catch(() => {
        // Si estás offline y pide cualquier página, devuelve la raíz guardada
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});
