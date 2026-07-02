// Service Worker básico para PWA
const CACHE = 'escala-v5';
const ASSETS = ['/escala-multimedia/', '/escala-multimedia/index.html', '/escala-multimedia/manifest.json', '/escala-multimedia/icon-192.png', '/escala-multimedia/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Nunca interceptar peticiones externas
  if(!url.includes('admrlahermosa.github.io')) return;
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
