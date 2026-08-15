const CACHE_NAME = 'syazanikasir-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './vendor/tailwind.min.css',
  './vendor/html2canvas.min.js',
  './vendor/html5-qrcode.min.js',
  './vendor/xlsx.full.min.js',
  './vendor/localforage.min.js',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-72x72.png',
  './icon-96x96.png',
  './icon-128x128.png',
  './icon-144x144.png',
  './icon-152x152.png',
  './icon-192x192.png',
  './icon-384x384.png',
  './icon-512x512.png'
];

// Install: cache the app shell. Semua aset di atas sekarang file lokal
// (bukan CDN luar), jadi addAll tidak akan gagal gara-gara koneksi internet.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch((err) => console.error('SW install gagal cache aset:', err))
  );
});

// Activate: bersihkan cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first untuk semua aset app shell -> aplikasi tetap jalan tanpa internet.
// Untuk permintaan navigasi (buka halaman), kalau tidak ada di cache & offline,
// tetap kembalikan index.html supaya app shell selalu muncul (bukan pesan "offline" browser).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
