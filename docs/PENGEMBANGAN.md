# Pengembangan

## Arsitektur
Seluruh aplikasi ada di `index.html` (HTML, CSS, JavaScript tanpa framework dan tanpa proses build). Keadaan aplikasi disimpan di variabel global (`D` peta dan bendung, `PT` petak, `JR` jaringan, `C` tanaman, `KP` koefisien, `INFO` info dasar). Fungsi `BK()` menyusun seluruh keadaan menjadi cadangan JSON, dan penyimpanan otomatis menulisnya ke IndexedDB tiap beberapa detik bila ada perubahan.

Peta digambar sebagai SVG (viewBox 600x420) dari koordinat yang diproyeksikan sederhana (lintang bujur ke bidang datar) saat impor.

## Rencana pengembangan
1. **Satu pengguna, banyak perangkat**: sinkronisasi lewat Supabase (PostgreSQL + PostGIS) dan login per peran (admin, pengamat, juru).
2. **Peta dasar**: lapisan citra satelit atau OpenStreetMap dengan Leaflet/MapLibre (perlu hosting sendiri agar bisa memuat tile).
3. **Pecah `index.html`** menjadi modul (Vite) bila fitur makin banyak.
4. Impor langsung lembar 07 (pembagian air) dan data survei IKSI.
5. Notifikasi saat debit bendung kritis (WhatsApp atau Telegram lewat server kecil).
6. Ekspor laporan ke Excel dan PDF.

## Uji
`npm test` memuat halaman di jsdom lalu menguji impor KML, Excel, dan cadangan JSON. Tambahkan uji baru di `tests/`.

## Rilis
Naikkan `VERSI` di `sw.js`, commit, push ke `main`. GitHub Actions menayangkan otomatis.
