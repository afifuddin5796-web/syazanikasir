// Service worker: membuat aplikasi bisa dibuka tanpa sinyal setelah kunjungan pertama.
// Naikkan nomor VERSI setiap kali index.html diubah agar pengguna mendapat pembaruan.
const VERSI = 'irigasi-v7';
const ASET = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'vendor/jszip.min.js', 'vendor/xlsx.full.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(ASET)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSI).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    // tampilkan dari cache dulu, perbarui di latar belakang
    e.respondWith(caches.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok) caches.open(VERSI).then(c => c.put(r, res.clone())); return res; }).catch(() => hit);
      return hit || net;
    }));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(u.host)) {
    e.respondWith(caches.open(VERSI).then(c => c.match(r).then(hit => hit || fetch(r).then(res => { c.put(r, res.clone()); return res; }).catch(() => hit))));
  }
});
