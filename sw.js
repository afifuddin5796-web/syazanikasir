// NAIKKAN angka versi ini setiap kali kamu mengubah index.html / aset lain,
// supaya cache lama (termasuk cache yang salah) otomatis dibuang.
const CACHE_NAME = 'syazanikasir-cache-v2';

// Aset lokal (harus benar-benar ada di repo)
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
];

// Library CDN yang dipakai index.html (URL harus SAMA persis dengan di index.html)
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://unpkg.com/html5-qrcode',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://unpkg.com/localforage/dist/localforage.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Satu per satu, supaya kalau ada 1 file gagal, install SW tidak ikut gagal.
      await Promise.all(LOCAL_ASSETS.map((url) =>
        cache.add(url).catch((err) => console.warn('Gagal cache lokal:', url, err))
      ));
      await Promise.all(CDN_ASSETS.map((url) =>
        fetch(url, { mode: 'no-cors' })
          .then((res) => cache.put(url, res))
          .catch((err) => console.warn('Gagal cache CDN:', url, err))
      ));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Halaman utama: NETWORK-FIRST (ambil versi terbaru kalau online,
  // pakai cache hanya kalau offline). Ini yang mencegah aplikasi
  // "nyangkut" di versi lama/salah seperti kejadian sebelumnya.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Aset lain: cache-first, lalu simpan hasil jaringan.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
