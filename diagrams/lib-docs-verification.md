# Pemeriksaan dokumentasi lib.h

Tanggal: 14 Oktober 2026. Cakupan: `dokumentasi-lib.html`, stylesheet dan script dokumentasi, serta tautan dari website. File `lib.h` asli tidak diubah.

## Hasil teknis

- PASS: `python -B build.py` menghasilkan dokumentasi 18 fungsi; daftar nama cocok dengan definisi pada `files/lib.h`.
- PASS: `node --check assets/js/lib-docs.js` dan parsing Python berhasil.
- PASS: pemeriksaan seluruh tautan lokal, file CSS/JS, ID unik, dan anchor HTML berhasil.
- PASS: 22 artikel sidebar dibuka melalui browser; artikel terlihat sesuai hash dan tidak ada error console.
- PASS: pencarian `border` menghasilkan 3 referensi; pencarian tanpa kecocokan memberi pesan; hapus pencarian mengembalikan daftar.
- PASS: tombol salin menghasilkan teks kode di clipboard; contoh signature borderDoubleLine sesuai file asli.
- PASS: tautan daftar isi Signature, Parameter, Perilaku, Contoh penggunaan, dan Catatan implementasi mengubah hash dan mempertahankan artikel yang benar.
- PASS: menu ponsel membuka navigasi; pencarian scanInputMoney memberi 1 hasil; klik hasil menutup menu; Escape menutup menu dan mengembalikan fokus ke tombolnya.
- PASS: skip link mempertahankan artikel gotoxy dan menargetkan main content.
- PASS: tidak ada overflow dokumen pada viewport 360, 390, 768, 1024, dan 1440px; blok kode boleh digulir secara internal.
- PASS: unduhan browser menghasilkan lib.h dengan SHA-256 yang sama dengan file sumber.
- PASS: alur daftar modul → daftar isi modul 3 → isi lib.h → panel materi → dokumentasi berhasil dijalankan di browser.
- PASS: seluruh konten tersedia di HTML statis; tombol salin ditambahkan oleh JavaScript, dan fallback noscript menjelaskan pencarian.

## Delivery gate antislop

| Item | Status dan bukti |
| --- | --- |
| R-01 | PASS: tidak memakai gradient/glow pada dokumentasi. |
| R-02 | PASS: teks dokumentasi memakai kalimat biasa tanpa em dash. |
| R-03 | PASS: pengukuran browser pada lima viewport tidak menemukan overflow halaman. |
| R-04 | PASS: kontrol berlabel teks; tidak menambahkan ikon generik. |
| R-05 | PASS: isi mengikuti signature, parameter, perilaku, contoh, dan catatan implementasi; tidak memakai layout promosi. |
| R-06 | PASS: monospace khusus kode dan identifier lib.h; teks utama memakai font sistem untuk membaca. |
| R-07 | PASS: tidak ada grid/dot/blueprint dekoratif. |
| R-08 | PASS: kontrol dokumentasi tidak menggunakan panah dekoratif. |
| R-09 | PASS: tidak memakai capsule badge atau label promosi. |
| R-10 | PASS: tidak memakai glassmorphism; header/sidebar memakai warna solid. |
| R-11 | PASS: tombol radius 4–6px dan blok kode 8px; tidak semua kontrol dibuat pill. |
| R-12 | PASS: tidak menambahkan shadow pada komponen. |
| R-13 | PASS: tidak memakai glow. |
| R-14 | PASS: fungsi dipresentasikan sebagai artikel referensi, bukan kartu fitur. |
| R-15 | PASS: kontrol menyebut tindakan: Cari fungsi, Salin kode, Menu dokumentasi, Unduh lib.h. |
| R-16 | PASS: tidak menambahkan copy pemasaran atau klaim AI. |
| R-17 | PASS: 18 fungsi dan 8 konstanta berasal dari file pengguna; tidak ada statistik produk. |
| R-18 | PASS: tidak ada testimonial. |
| R-19 | PASS: hanya transisi hover sederhana; tidak ada animasi masuk, parallax, atau bounce. |
| R-20 | PASS: kategori, contoh KasirKita, parameter, dan catatan masalah bersumber dari lib.h pengguna. |
| R-21 | PASS: warna gelap mengikuti website Hello Project yang sudah ada. |
| R-22 | PASS: tidak membuat ilustrasi generik. |
| R-23 | PASS: navigasi dokumentasi diminta pengguna; tidak membuat logo, avatar, atau klaim baru. |
| R-24 | PASS: pemeriksaan file dan anchor seluruh tautan lokal berhasil. |
| R-25 | PASS: rasio minimum kombinasi teks/panel dokumentasi 9.84:1, dihitung dengan luminance sRGB. |
| R-26 | PASS: navigasi fungsi, pencarian, salin, menu ponsel, daftar isi artikel, dan unduhan diuji di browser. |
| R-27 | PASS: pesan hasil kosong, feedback clipboard, dan halaman referensi tidak ditemukan tersedia; konten statis tidak membutuhkan state loading jaringan. |
| R-28 | PASS: tidak ada FAQ pengisi. |
| R-29 | PASS: dua warna permukaan, warna teks, satu aksen navigasi biru; emas hanya menandai catatan implementasi. |
| R-30 | PASS: memakai pola navigasi dokumentasi yang diminta, dengan identitas Hello Project dan referensi C sendiri. |
| R-31 | PASS: sidebar untuk mencari API, kolom tengah untuk membaca, daftar isi kanan untuk menelusuri artikel, kode monospace untuk signature. |
| R-32 | PASS: focus-visible, skip link, Ctrl/⌘ K, Escape, dan pengelolaan fokus menu tersedia; skip link dan Escape diuji. |
| R-33 | PASS: halaman, CSS, dan JS ditulis sebagai source; make_lib_docs.py merupakan sumber generator dokumentasi yang dipanggil build proyek. |
| R-34 | PASS: tidak ada theme toggle; hanya satu tema mengikuti project. |
| R-35 | PASS: generator dijalankan, dokumentasi dibuka di browser, kontrol dan navigasi diuji, screenshot desktop/ponsel diperiksa. |
| R-36 | PASS: tidak membuat klaim keamanan, compliance, atau performa. |
| R-37 | PASS: arah pengguna ialah dokumentasi seperti Tailwind; ENERGY 1 / RHYTHM 2 / MOTION 1 dinyatakan sebelum implementasi. |
| R-38 | PASS: perilaku fungsi berasal dari source; contoh ditandai sebagai latihan, bukan fitur kasir yang selesai. |
| Liveliness | PASS: judul fungsi menjadi fokus, jarak memisahkan bagian API, warna aktif menuntun navigasi, identifier lib.h menjadi motif. |
| C-1 | PASS: setiap keputusan layout memiliki tujuan baca atau navigasi yang dijelaskan pada R-31. |
| C-2 | PASS: kontrol dokumentasi memiliki perilaku nyata sesuai R-26. |
| C-3 | PASS: artikel disusun dari isi library; tidak menambahkan bagian promosi. |
| C-4 | PASS: lima breakpoint dan menu keyboard/ponsel diuji; konten HTML statis tetap tersedia. |
| C-5 | PASS: tidak ada testimonial, statistik, atau klaim produk yang dibuat-buat. |

## Batas verifikasi

Contoh C belum diuji kompilasi karena GCC tidak tersedia di lingkungan pengerjaan. Dokumentasi menjelaskan kesalahan pada library asli dan menandai contoh input yang memerlukan koreksi. Audit ini memverifikasi website dokumentasi, bukan menyatakan library C asli telah lulus pengujian.
