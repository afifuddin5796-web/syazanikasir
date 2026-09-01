const CACHE_NAME = 'syazanikasir-cache-v9';
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

// Install: cache tiap file SATU-SATU (bukan addAll), supaya kalau satu file
// gagal diambil (koneksi lambat/putus saat instalasi), file-file lain tetap
// berhasil disimpan. addAll() lama bersifat "semua-atau-tidak-sama-sekali":
// satu kegagalan bikin SEMUA file gagal ke-cache tanpa ada peringatan jelas,
// dan itulah penyebab database produk sempat hilang saat offline.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => {
            console.error('Gagal cache:', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
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
