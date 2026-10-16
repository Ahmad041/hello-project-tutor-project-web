# Verifikasi empat modul — 14 Oktober 2026

## Build dan sumber

- PASS: `python -B build.py` menghasilkan halaman, kartu modul, daftar isi, SVG/Mermaid, dokumentasi lib.h, dan SDLC Archify.
- PASS: empat source `.mmd` berhasil diparse dan dirender menjadi SVG menggunakan Mermaid 11 dalam browser; tidak ada error console pada halaman pemeriksaan.
- PASS: model bersama `diagram_specs.py` menyediakan node, atribut, relasi, bentuk, dan cabang untuk SVG serta Mermaid. Seluruh PK/FK model bertipe VARCHAR(20); tipe C dalam kamus adalah char[21].
- PASS: flowchart memiliki terminator, proses, diamond, dan paralelogram; setiap keputusan memiliki Ya/Tidak. Jalur gagal kembali ke input dan tidak menampilkan nota sukses.
- PASS: source Mermaid tersalin dari panel Probis ke clipboard. Empat panel source dan unduhan .mmd tersedia pada modul 1 serta halaman diagram mandiri.
- PASS: tautan lokal, file unduhan, dan anchor seluruh halaman utama valid. Tidak ada ID HTML ganda.
- PASS: unduhan dokumen terpasang pada modul yang sesuai; file dummy tidak ditautkan sebagai dokumen.
- PASS: URL video daftar isi tetap `hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4`; script opening masih memakai video lokal asli.
- PASS: lib.h sama dengan salinan asli pengguna, SHA-256 `521fe9ac3d70f85365be662a3d840adda4e4ad18dd72679877b85896b0f9d1f1`.

## Archify

- PASS: validate/deliver workflow v2 dengan quality showcase: 9/9 pemeriksaan, 0 error, 0 warning.
- PASS: hash spesifikasi dan artifact cocok dengan receipt lokal `sdlc-delivery.json`.
- PASS: viewer diperiksa melalui browser pada 1440×900, 1600×1000, 1920×1080, dan 2048×1320. Scroll width/height tidak melebihi viewport pada keempat ukuran.
- PASS: screenshot flowchart dan PDM diperiksa; tipe VARCHAR, kardinalitas, serta memiliki/dimiliki terbaca. Viewer SDLC diperiksa dalam tema gelap dan terang.
- Status perceptual visual review: passed melalui inspeksi screenshot. Ukuran dicatat melalui CUA; perintah `visual-check` otomatis Archify tidak dijalankan.

## Browser dan materi

- PASS: empat modul tidak mengalami overflow pada 390×844. Jumlah langkah: 9 / 4 / 7 / 4.
- PASS: panel materi Probis terbuka pada ponsel tanpa overflow halaman; diagram dan kode menggunakan wadah yang dapat digulir.
- PASS: kartu modul memakai judul Dokumen Persiapan, Dokumen After, Penggunaan lib.h, dan UI/UX menggunakan lib.h.
- PASS: kartu modul 1 membuka daftar isi yang sesuai; tautan Probis membuka section yang tepat.
- PASS: SDLC berada di awal modul 1 dan dijelaskan sebagai siklus project, bukan urutan membaca modul.
- PASS: Product Documentation dan User Guide mengikuti struktur template pengguna; hasil testing contoh berstatus Belum diuji.

## Delivery gate desain

- Hard gate PASS: tidak ada statistik/testimonial baru, tautan lokal valid, tombol source berfungsi, diagram dan halaman diperiksa di browser, serta fokus keyboard memakai style yang sudah tersedia.
- Purpose gate PASS: jenis bentuk menjelaskan fungsi flowchart; mask label menjaga keterbacaan hubungan. Tidak menambahkan ilustrasi, glow, animasi masuk, atau dekorasi pada diagram statis. Viewer Archify memakai runtime bawaan sesuai permintaan pengguna.
- Liveliness PASS: identitas navy/putih/emas dari style guide dipertahankan; data dan narasi KasirKita spesifik; judul serta hierarki section menjadi fokus. Penggunaan antislop tetap selama pengerjaan, mengikuti preferensi sesi.
- Craftsmanship PASS: isi mengikuti dokumen pengguna, SVG dan Mermaid berasal dari model bersama, template serta library asli tidak diubah, dan generator mempertahankan perubahan saat build ulang.

## Batas verifikasi

Contoh program C adalah materi pembelajaran dan belum dikompilasi karena GCC tidak tersedia. Perubahan ini tidak membuat aplikasi kasir lengkap dan tidak memperbaiki file lib.h asli. Materi menandai koreksi yang diperlukan pada salinan latihan sebelum menggunakan input dan PrintTxt.
