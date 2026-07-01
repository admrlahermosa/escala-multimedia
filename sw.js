// Importar OneSignal SW
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE = 'escala-multimedia-v3';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // NUNCA interceptar estas URLs — dejar pasar directo a la red
  if(
    url.includes('supabase.co') ||
    url.includes('onesignal.com') ||
    url.includes('anthropic.com') ||
    url.includes('.netlify/functions') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.includes('cdn.onesignal.com')
  ){
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache first para los assets de la app
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
