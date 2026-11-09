# Hello Project — KasirKita

Website tutorial berbahasa Indonesia untuk project kasir C17 berbasis terminal dengan penyimpanan TXT. Website terdiri dari lima halaman HTML dengan CSS eksternal dan JavaScript inline; tidak memerlukan framework atau build saat digunakan. Bahasa website berbeda dengan bahasa project yang diajarkan.

## Membuka website

Buka `index.html` langsung, atau jalankan dari folder ini:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Buka http://127.0.0.1:8000. Server lokal direkomendasikan untuk clipboard dan progres browser yang konsisten.

## Alur belajar dan halaman

Beranda (`index.html`) → video opening → daftar modul (`daftarModul.html`) → daftar isi modul → isi modul.

- Modul 1 — Dokumen Persiapan: `daftarisi.html` → `project.html`, SDLC, tema, desktop/website, standalone, scope, master/transaksi, atribut, Probis, dan Activity Plan.
- Modul 2 — Pengujian & Dokumentasi: `daftarisi-2.html` → `analisis.html`, user testing (dokumen before sidang), proposal, Product Documentation, dan User Guide.
- Modul 3 — Penggunaan lib.h: `daftarisi-3.html` → `teknis.html`, struktur folder, pemasangan, fungsi posisi/border/input, dan pemeriksaan library.
- Modul 4 — UI/UX menggunakan lib.h: `daftarisi-4.html` → `testing.html`, konversi gambar melalui ASCIIArt.eu, ekspor TXT, dan penempatan ASCII art di C.

Nama `testing.html` dipertahankan untuk kompatibilitas path; isinya kini modul UI ASCII art. Dokumen testing fungsional (User Testing / Before Sidang) dan laporan berada di modul 2.

`dokumentasi-lib.html` adalah referensi terpisah untuk seluruh fungsi `files/lib.h`, konstanta keyboard, instalasi, contoh menu, dan catatan perbaikan file asli. Sidebar dapat dicari; setiap fungsi memiliki deep link, parameter, perilaku, contoh kode yang bisa disalin, dan daftar isi artikel. Layout dokumentasi mengutamakan keterbacaan dengan pola navigasi referensi seperti Tailwind CSS. CSS dan JavaScript terpisah di `assets/css/lib-docs.css` dan `assets/js/lib-docs.js`. Sumber konten ada di `make_lib_docs.py`, yang juga dipanggil oleh `build.py`. Halaman tetap menyediakan semua konten saat JavaScript tidak tersedia.

Generator lokal ada di `build.py`; materi akhir diatur oleh `module_content.py` setelah adaptasi C dan TXT. Jalankan `python -B build.py` untuk memperbarui halaman, kartu modul, daftar isi, diagram SVG/Mermaid, dokumentasi lib.h, dan viewer SDLC. Regenerasi SDLC memerlukan Node serta CLI Archify: secara default skill lokal di `~/.codex/skills/archify/bin/archify.mjs`; atur `ARCHIFY_CLI` untuk lokasi lain. HTML hasilnya tetap berjalan tanpa Python atau Node.

File `files/lib.h` merupakan library asli pengguna untuk console Windows. Materi menjelaskan koreksi yang diperlukan pada fungsi input dan PrintTxt; file asli tidak diubah. Contoh menu belum merupakan aplikasi kasir lengkap.

## Menghubungkan file download

Lima kartu download dokumen tersedia: AP, User Testing, Product Documentation, User Guide, dan lib.h. Isi `downloads.json` dengan path relatif file asli atau URL HTTPS, lalu jalankan build kembali.

Kunci konfigurasi: `ap`, `testing`, `product_documentation`, `user_guide`, dan `lib`. File lokal kosong atau tidak ditemukan tidak ditawarkan sebagai dokumen asli. File lokal memakai atribut HTML `download`; URL eksternal dibuka di tab baru.

AP memakai Excel pengguna, User Testing memakai contoh PDF, Product Documentation dan User Guide memakai dua template Word di folder `files`. File dummy tidak lagi ditautkan. Proposal memakai panduan umum tanpa unduhan template yang belum tersedia.

## Diagram pembelajaran

- `diagrams/sdlc.html`: workflow SDLC interaktif hasil Archify dari `diagrams/sdlc.json`, ditempatkan di awal modul 1. Konten Indonesia; kontrol viewer bawaan Inggris.
- `diagrams/flowchart-checkout.html`, `erd-awal.html`, `pdm-normalisasi.html`, dan `pdm-denormalisasi.html`: referensi SVG dengan panduan Diagram Design, dimuat di bagian Probis modul 1.
- `diagram_specs.py` adalah sumber bersama untuk SVG dan `.mmd`; `make_diagrams.py` menghasilkan keduanya. Setiap diagram memiliki panel source, tombol salin, dan unduhan Mermaid.
- `diagrams/style-guide.md`: palet dan tipografi yang diambil dari desain website pengguna.

Provenance: [Archify](https://github.com/tt-a1i/archify) dan [Diagram Design](https://github.com/cathrynlavery/diagram-design). SDLC dihasilkan melalui validasi/delivery showcase Archify. PDM memakai VARCHAR(20) untuk ID/referensi dengan padanan C char[21]; rancangan latihan tetap menggunakan record TXT tanpa constraint SQL otomatis.

## File untuk GitHub

Push halaman HTML, folder `assets/`, folder `diagrams/`, folder `files/`, `downloads.json`, README, dan `.gitignore`. Generator Python hanya disimpan lokal dan diabaikan oleh Git. Di repository, materi dan link download dapat diedit langsung pada HTML; `downloads.json` hanya digunakan oleh generator lokal. Website statis dapat dipublikasikan melalui GitHub Pages tanpa menjalankan Python; gunakan direktori root sebagai sumber website. Cache Python dan hasil pemeriksaan lokal diabaikan melalui `.gitignore`.

Video dan poster memakai URL remote persis dari referensi desain. Font Sora variable memakai Google Fonts. Aset tersebut memerlukan jaringan; teks, diagram, dan navigasi tetap tersedia tanpa jaringan. Progres dan checklist disimpan di localStorage browser jika diizinkan.

Website ini adalah panduan pembelajaran; contoh C di modul teknis merupakan fondasi menu, bukan aplikasi kasir lengkap. Program target memakai `data/data.txt`, file sementara dan backup; `.bat` untuk compile/jalankan, bukan menyimpan data. Tidak ada dependensi database. Materi panjang memakai halaman yang dapat digulir, dengan gaya visual gelap dari referensi.

## Stylesheet eksternal

- `assets/css/site.css`: seluruh halaman tutorial dan landing page.
- `assets/css/diagrams.css`: halaman diagram statis.
- `assets/css/archify.css`: tampilan viewer alur interaktif.
- `assets/css/archify-fonts.css`: font yang digunakan viewer Archify.

Edit file CSS langsung; menjalankan `python -B build.py` tidak menimpa stylesheet.
Halaman tutorial dan diagram statis memakai stylesheet eksternal. Viewer Archify merupakan artifact mandiri dengan style/runtime bawaannya.
JavaScript viewer/progres tetap dapat mengubah properti dinamis (zoom, posisi, dan lebar progres).

## Mode membaca pemula

Empat modul memakai scrollytelling: setiap langkah berisi cerita singkat, analogi, dan tugas kecil. Rincian teknis, diagram, kode, dan unduhan ada di panel materi lengkap. `stories.json` menyimpan narasi untuk generator lokal; halaman hasil build tidak membutuhkan JSON ini saat dibuka. `assets/js/story.js` memperbarui penunjuk langkah saat menggulir. Semua materi tetap dapat dibaca tanpa JavaScript.


## Latihan flowchart checkout

`game/checkout.html` menyediakan latihan memilih simbol dan tujuan sambungan pada node tetap. Tantangan awal memiliki lima kesalahan. Pemain dapat memeriksa 19 aturan, meminta satu petunjuk, menjalankan empat skenario, dan menjawab alasan pada kasus simpan gagal. Pilihan tersimpan di localStorage bila tersedia; latihan tidak mengunci materi berikutnya.

`make_checkout_game.py` membangkitkan HTML dan spesifikasi game dari `diagram_specs.FLOW`, lalu dipanggil `build.py`. Mesin aturan dan simulasi di `assets/js/checkout-engine.js`, kontrol UI di `assets/js/checkout-game.js`. Halaman Probis menautkan game dari `probis.html#game-checkout`; tombol kembali membuka materi referensi Probis. Game menggunakan select dan button native untuk klik/sentuh/keyboard. Jalankan `node --test tests/checkout-engine.test.cjs` setelah build untuk menguji mesin terhadap spesifikasi HTML yang dihasilkan.
