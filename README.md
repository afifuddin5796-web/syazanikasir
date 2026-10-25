# Irigasi

Aplikasi web untuk petugas irigasi: **peta daerah irigasi**, **debit air tiap bendung**, **laporan tanaman**, serta perhitungan **LPR dan FPR** per petak tersier. Berjalan sepenuhnya di browser (tanpa server), bisa dipasang di HP sebagai aplikasi (PWA) dan dipakai tanpa sinyal.

## Fitur

Aplikasi **mulai kosong**. Data contoh bisa dimuat dari tab Data (hanya untuk mencoba) dan dihapus lagi dengan satu tombol.

- **Ringkasan**: jumlah bendung, petak, bangunan dan saluran, kondisi air, daftar bendung yang perlu perhatian.
- **Peta interaktif**: zoom (roda mouse, cubit di HP, tombol + dan -), geser, klik bendung, bangunan, saluran, atau petak untuk melihat detailnya. Label dan simbol kecil baru muncul saat diperbesar agar peta tidak penuh.
- **Peta** dengan simbol sesuai legenda irigasi (bendung, bang. sadap, bagi, bagi sadap, box tersier, alat ukur, gorong-gorong, terjunan, pelimpah, jembatan, dan lainnya), saluran pembawa dan pembuang, batas daerah irigasi, petak tersier berpola sawah dengan label (nama, luas baku, luas tanam).
- **Klik jalur dan petak**: klik garis saluran untuk panjang (km dan m), lokasi (desa, kecamatan, koordinat, tautan Google Maps dan Earth), bangunan di sepanjang jalur, pintu, hulu dan hilir, serta panjang dari titik hulu. Klik petak tersier untuk luas, lokasi, saluran dan bangunan di dalamnya, serta tombol ke hitungan LPR dan FPR. Jenis jaringan (teknis, semi teknis, sederhana) ditetapkan per daerah irigasi.
- **Debit**: catat debit (lt/dt) per bendung, grafik 14 hari, status cukup, waspada, kritis.
- **Tanaman**: laporan luas tanam per daerah irigasi dan musim (padi, jagung, palawija, tebu, lainnya).
- **LPR dan FPR** per petak tersier, dengan pencarian, filter, dan detail petak.
- **Wilayah DI**: pembagian wilayah per daerah irigasi (mis. per juru pengairan).
- **Tanya** (untuk juru): jawaban langsung untuk 6 pertanyaan: debit di DI atau bendung yang mengairi petak, daerah yang diairi, letak (desa dan kecamatan), panjang jaringan (seluruhnya atau jalur ke petak atau bangunan), kebutuhan air petak terpilih, dan DI yang dipegang tiap juru.
- **Pencarian** ke dam, petak tersier, bangunan sadap, bagi sadap, ukur, dan saluran primer, sekunder, tersier, kuarter.
- **Impor data**: KMZ/KML dari Google Earth (boleh ratusan file sekaligus; dibaca otomatis dari nama penanda, ikon, dan warna garis; nama folder paling atas = nama daerah irigasi), GeoJSON, Excel (termasuk formulir laporan 10 harian 05a dan 06), CSV, JSON aplikasi survei aset.
- **Penyimpanan otomatis** di perangkat (IndexedDB) dan **cadangan JSON** yang bisa diunduh dan dipulihkan.

Satuan: luas hektar (ha), debit liter per detik (lt/dt), panjang jaringan km dan m.

## Struktur repositori

```
index.html              seluruh aplikasi (HTML, CSS, JavaScript dalam satu berkas)
manifest.webmanifest    metadata PWA
sw.js                   service worker (mode offline)
icons/                  ikon aplikasi
vendor/                 library lokal: JSZip (baca KMZ), SheetJS (baca Excel)
data/contoh/            contoh data SINTETIS untuk mencoba impor
docs/                   dokumentasi format data dan pengembangan
tests/smoke.test.js     uji otomatis
.github/workflows/      deploy ke GitHub Pages dan uji otomatis (CI)
```

## Menjalankan di komputer

Cara paling mudah: klik dua kali `index.html` (fitur inti jalan; mode offline/PWA hanya aktif lewat `http` atau `https`).

Dengan server lokal (disarankan):

```bash
python3 -m http.server 8080      # lalu buka http://localhost:8080
# atau
npm run serve
```

## Menayangkan ke internet (pilih salah satu)

### A. GitHub Pages (otomatis dari repo ini)

1. Buat repositori baru di GitHub, misalnya `irigasi`, lalu unggah seluruh isi folder ini (cabang `main`).
2. Buka **Settings, Pages**, pada **Source** pilih **GitHub Actions**.
3. Setiap `git push` ke `main` akan menjalankan `pages.yml` dan menayangkan aplikasi di `https://NAMA-PENGGUNA.github.io/irigasi/`.

Catatan: GitHub Pages dari repositori *private* umumnya hanya tersedia di paket berbayar. Karena repositori ini hanya berisi kode (data ada di browser pengguna), repositori publik aman selama Anda tidak meng-commit data asli.

### B. Vercel, Netlify, atau Cloudflare Pages

Hubungkan repositori, **tanpa perintah build** dan **direktori output `/`** (situs statis). Cocok bila repositori ingin dibuat private.

## Google Earth dan Google Maps

- **Peta dasar** (tab Peta, pilihan *Peta dasar*): citra satelit (Esri) atau peta jalan (OpenStreetMap) diletakkan tepat di bawah peta aplikasi dan ikut ter-zoom. Butuh internet dan data berkoordinat dari KMZ atau JSON survei. Tersedia di versi yang dipasang di web sendiri (GitHub Pages dan sejenisnya). Tampilan di dalam claude.ai memblokir gambar dari luar, jadi tidak muncul di sana.
- **Ke Google Earth**: tab Data, *Ekspor peta ke Google Earth (KML)*. Hasilnya per daerah irigasi (bendung, bangunan, saluran, petak) lengkap dengan keterangan debit dan kebutuhan. Buka di Google Earth Pro atau web, atau impor ke Google My Maps.
- **Dari Google Earth**: simpan sebagai KMZ lalu impor di Setelan (alur digitasi di Google Earth lalu masuk aplikasi sudah didukung).
- **Tautan** *Google Maps* dan *Google Earth* tersedia pada detail bendung, bangunan, dan hasil pencarian letak.
- Google Maps tidak dipakai sebagai peta dasar langsung karena ketentuan Google mewajibkan Maps JavaScript API dengan kunci API dan penagihan. Esri dan OpenStreetMap punya ketentuan penggunaan sendiri (atribusi tampil di bawah peta). Untuk pemakaian berat atau resmi, periksa ketentuannya atau gunakan kunci API sendiri.

## Memasang di HP

Buka alamat aplikasi di Chrome (Android) lalu pilih **Tambahkan ke layar utama**, atau Safari (iPhone) lalu **Bagikan, Tambah ke Layar Utama**. Setelah kunjungan pertama, aplikasi bisa dibuka tanpa sinyal.

## Data dan privasi

- Semua data disimpan **di browser perangkat itu saja**. Tidak ada yang dikirim ke server.
- Karena itu data **tidak otomatis tersinkron antar perangkat**. Pindahkan lewat **Data, Unduh cadangan (JSON)** lalu **Pulihkan dari cadangan** di perangkat lain.
- Membersihkan data browser menghapus data aplikasi. **Unduh cadangan secara berkala.**
- **Jangan commit** data asli (cadangan JSON, Excel laporan, KMZ) ke repositori. Simpan di folder `data/privat/`, yang sudah diabaikan oleh `.gitignore`. Pastikan Anda berwenang membagikan data instansi.

## Catatan perhitungan LPR dan FPR

- LPR (ha palawija) = luas tanam x koefisien tanaman. FPR realisasi = debit terukur / LPR. Faktor K = FPR realisasi / FPR standar.
- Koefisien awal: padi tanaman 4, tebu muda 1,5, tebu tua 1, palawija 1 (dihitung dari laporan 10 harian UPTD), serta semai 1 dan olah lahan 6 (**perkiraan, belum terverifikasi**). Semua bisa diubah di tab LPR dan FPR. Sesuaikan dengan ketetapan Dinas atau UPTD sebelum dipakai untuk keputusan pembagian air.

## Pengembangan

```bash
npm install
npm test        # uji alur utama: muat halaman, impor KML, Excel, cadangan JSON
```

Setiap mengubah `index.html`, naikkan `VERSI` di `sw.js` agar pengguna mendapat pembaruan. Lihat `docs/PENGEMBANGAN.md` untuk arsitektur dan rencana pengembangan, dan `docs/FORMAT-DATA.md` untuk format impor.

## Lisensi

MIT (lihat `LICENSE`); ubah sesuai kebijakan instansi bila perlu. Library pihak ketiga di `vendor/`: [SheetJS](https://sheetjs.com) (Apache-2.0) dan [JSZip](https://stuk.github.io/jszip/) (MIT atau GPLv3). Berkas lisensinya disertakan.
