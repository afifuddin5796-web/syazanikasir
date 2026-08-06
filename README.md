# 🛒 SembakoKasir - Offline Pro (PWA)

**SembakoKasir Offline Pro** adalah aplikasi Kasir (Point of Sale) berbasis Web & PWA yang dirancang khusus untuk toko kelontong, sembako, dan UMKM. Aplikasi ini bekerja **100% secara offline** di dalam browser tanpa memerlukan server backend atau database eksternal.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4.svg)

---

## ✨ Fitur Utama

- 🖥️ **Kasir & Transaksi Real-time**: Input barang via barcode scanner kamera HP/Webcam atau input manual untuk produk kiloan.
- 📦 **Manajemen Stok & Database Produk**: Kelola stok barang master, harga, hingga upload foto kemasan produk UMKM.
- 📊 **Laporan Keuangan & Ekspor Excel**: Rekap riwayat transaksi harian, mingguan, hingga bulanan, serta unduh laporan langsung ke format `.xlsx` (Excel).
- 🖨️ **Cetak Struk & Kirim WA**: Cetak struk ke printer thermal Bluetooth/USB, simpan sebagai gambar PNG, atau kirim rincian belanjaan via WhatsApp.
- ⚡ **PWA & Offline-First**: Dapat di-install sebagai aplikasi desktop/Android via PWABuilder dan diakses tanpa koneksi internet (*zero data usage*).

---

## 🚀 Struktur File Repository

```text
├── index.html       # Kode utama aplikasi (UI & Logika JavaScript)
├── manifest.json    # Konfigurasi Web App Manifest untuk PWA
├── sw.js            # Service Worker untuk fitur caching offline
└── README.md        # Dokumentasi proyek
