const CACHE_NAME = 'pesaje-kevo-v1';
const urlsToCache = [
  './index.html',  // <-- ¡AQUÍ ESTABA EL ERROR! 
  './manifest.json',
  './icono-192x192.png',
  './icono-512x512.png'
];

// Instala el Service Worker y guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Intercepta las peticiones para que funcione sin internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devuelve la versión guardada si no hay internet
        }
        return fetch(event.request);
      })
  );
});
