# Format data yang bisa diimpor

## 1. KMZ atau KML (Google Earth) — tab Setelan
- Folder dibaca satu per satu. Pada tiap folder pilih akan dijadikan apa: daerah irigasi, petak tersier (poligon), saluran primer, sekunder, tersier, kuarter, pembuang (garis), bendung, atau bangunan (titik).
- Nama folder dipakai untuk menebak jenis (mis. "Petak Tersier", "Saluran Sekunder", "Bendung", "Gorong-gorong").
- Luas petak diambil dari data tambahan `Luas` bila ada, jika tidak dihitung dari poligon. Panjang saluran dihitung dari garis.
- Impor ini **mengganti** peta dan data jaringan yang ada. Satukan beberapa file di Google Earth lebih dulu.

### Pembacaan otomatis gaya Google Earth (bawaan)
Dicentang bawaan di Setelan. Aturan yang dipakai (bisa diperbaiki per kelompok sebelum mengimpor):
- **Titik** dari nama: `Bd` atau Bendung = bendung; `BU` = bangunan ukur; `bok` atau box = box tersier; `BP` atau bagi = bangunan bagi; `BT` atau sadap = bangunan sadap; `pelimpah`; `ujung` = diabaikan (hanya penanda ujung saluran); `suplisi` = suplesi. Bila nama tidak jelas dipakai ikon (pushpin kuning = bendung, telepon = ukur, kotak = box, donat = bagi).
- **Garis** dari nama (`Sec` sekunder, primer, tersier, kuarter, pembuang), bila tidak ada dari **warna garis** (tebakan awal: kuning sekunder, merah primer, hijau tersier, tanpa warna kuarter). Periksa pilihannya sebelum mengimpor, cukup sekali untuk semua file.
- **Poligon** pada folder `areal`/`petak` = petak tersier.
- **Nama daerah irigasi** = nama folder paling atas di tiap file, supaya sama dengan nama DI di laporan Excel.

## 2. GeoJSON — tab Data
Poligon menjadi daerah irigasi, garis menjadi saluran, titik menjadi bendung. Nama dari properti `nama` atau `name`.

## 3. Excel laporan 10 harian (formulir 05a dan 06) — tab Data
Dikenali otomatis bila ada lembar bernama `5a ...` dan/atau `06 ...`.
- Lembar 05a: realisasi tanaman per petak tersier per Juru Pengairan (kolom padi per fase, tebu, palawija).
- Lembar 06: pengukuran debit per bendung dan tempat pengukuran (debit harian 10 hari, rencana, rata-rata).
- Wilayah = nama Juru Pengairan. Petak yang namanya cocok dengan data peta diperbarui, selebihnya ditambahkan.
- Lembar 07 dan "5 - O auto" (hasil hitungan) tidak diimpor.

## 4. Excel atau JSON umum — tab Data
Pilih lembar (atau bagian JSON), baris judul, jenis data, lalu cocokkan kolom. Jenis data: petak tersier, bendung, bangunan atau saluran, laporan tanaman, debit bendung. Baris Jumlah/Total dilewati, sel daerah irigasi yang digabung diisi ke bawah.

## 5. CSV laporan tanaman
Kolom berurutan: `di, musim, padi, jagung, palawija` (luas ha, baris pertama judul). Lihat `data/contoh/`.

## 6. JSON aplikasi survei aset
Berkas dengan bagian `bangunan` dan `saluran` (kolom `k_aset`, `n_aset`, `nomenklatur`, `p` berupa GeoJSON, `dimensi`). Kode aset yang dikenali: B01 bendung, F41 petak, P01 bagi, P02 bagi sadap, P03 sadap, P21 dan P22 box, C01 pengukur debit, C03 gorong-gorong, C06 jembatan, C07 terjunan, C08 pelimpah samping, C09 tempat cuci, C10 tempat mandi hewan, S01 sampai S16 saluran.

## 7. Cadangan JSON aplikasi ini
Dibuat lewat **Data, Unduh cadangan**. Kunci utama:

| Kunci | Isi |
|---|---|
| `app`, `versi`, `dibuat` | penanda berkas (`app` harus `irigasi`) |
| `D` | `bn` (bendung + `debit` [{t, v lt/dt}]), `di` (poligon), `sal` (garis), `salk` (jenis tiap garis) |
| `PT`, `WP` | petak tersier dan nomor wilayahnya |
| `JR` | bangunan dan saluran (jenis `k`, nama, DI, wilayah, induk, panjang m, dll.) |
| `WB` | wilayah tiap bendung |
| `C` | laporan tanaman (ha) |
| `KP` | koefisien LPR, FPR standar, efisiensi |
| `S`, `CT`, `INFO` | debit tambahan, catatan petugas, info dasar |

Satuan: luas ha, debit lt/dt, panjang m.

## 8. Desa dan kecamatan (untuk pertanyaan "di mana letaknya")
Ada tiga sumber, dipakai berurutan:
1. **Isian manual** per DI, bendung, bangunan, atau petak (tab Tanya, pertanyaan 3).
2. **Batas desa dan kecamatan dari KMZ**: pada tab Setelan pilih folder batas desa atau kecamatan sebagai *Batas desa* atau *Batas kecamatan*. Titik bangunan dan bendung dicocokkan ke poligon. Bila poligon desa punya data tambahan `Kecamatan`, kecamatan terisi otomatis.
3. **Laporan 05a**: baris `Ds. ...` di bawah tiap petak tersier menjadi daftar desa yang dilayani petak itu. Untuk mengisi kecamatannya, tulis daftar `Desa, Kecamatan` (satu per baris) di Setelan.

## 9. Keterkaitan jaringan (untuk panjang jalur hulu ke petak atau bangunan)
Dari JSON survei aset: saluran memuat `norec_hulu_sync` dan `norec_hilir_sync` (bangunan di ujung hulu dan hilir). Aplikasi menelusuri saluran ke hulu sampai titik awal dan menjumlahkan panjangnya. Petak dihubungkan ke saluran tersier lewat kode nomenklatur yang sama (misalnya `PT B.KG 2Ka` dan `ST B.KG 2Ka`). Jalur tidak bisa dihitung untuk data yang berasal dari Excel saja.

## 10. Koordinat asli dan proyeksi peta
Saat impor KMZ atau JSON survei, aplikasi menyimpan koordinat asli (bujur, lintang) semua titik, garis, dan poligon (`lo`, `la`, `salr`, `raw`) serta parameter proyeksi (`D.proj`). Ini dipakai untuk peta dasar, ekspor KML, dan tautan Google Maps atau Earth. Cadangan JSON lama (sebelum versi ini) tidak memuatnya, jadi impor ulang KMZ bila peta dasar atau ekspor KML kosong.

## 11. Jenis jaringan: teknis, semi teknis, sederhana
Data survei dan laporan tidak memuat klasifikasi ini, jadi aplikasi **memperkirakan per daerah irigasi** dari kelengkapan bangunan:
- **Teknis**: ada bendung, bangunan ukur cukup (minimal 3, atau minimal 20% dari jumlah bangunan bagi, sadap, dan box), dan ada saluran pembuang.
- **Semi teknis**: ada bendung dan minimal satu bangunan ukur.
- **Sederhana**: selain itu.

Ini perkiraan, bukan penetapan resmi. Klasifikasi resmi bisa ditetapkan manual di jendela detail jalur atau petak (tersimpan di perangkat dan ikut cadangan JSON, kunci `JT`).

## 12. Bangunan di sepanjang jalur
Dari koordinat: bangunan dan bendung dalam jarak 25 m dari garis saluran (atau di dalam atau sampai 25 m dari batas petak) dianggap berada di jalur atau petak itu. Pada data survei, bangunan hulu dan hilir diambil dari keterkaitan hulu-hilir.
