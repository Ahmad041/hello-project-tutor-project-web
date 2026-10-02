# Hello Project — KasirKita

Website tutorial berbahasa Indonesia untuk project kasir C17 berbasis terminal dengan penyimpanan TXT. Website terdiri dari lima halaman HTML dengan CSS eksternal dan JavaScript inline; tidak memerlukan framework atau build saat digunakan. Bahasa website berbeda dengan bahasa project yang diajarkan.

## Membuka website

Buka `index.html` langsung, atau jalankan dari folder ini:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Buka http://127.0.0.1:8000. Server lokal direkomendasikan untuk clipboard dan progres browser yang konsisten.

## Halaman

- `index.html`: landing page.
- `project.html`: definisi, scope, platform, dan data.
- `analisis.html`: flowchart, ERD, normalisasi, PDM, DFD, dan fitur.
- `teknis.html`: arsitektur C, struct/atribut, folder, format TXT, kontrak fungsi, kompilasi, dan contoh BAT.
- `testing.html`: kasus uji, audit, format laporan, dan checklist.

Generator lokal (tidak disertakan di repository) ada di `build.py`; penyesuaian materi C di `c_content.py` dan materi penyimpanan TXT di `text_storage_content.py`. Jalankan `python build.py` untuk memperbarui HTML. Python hanya diperlukan untuk regenerasi, bukan menjalankan website.

## Menghubungkan file download

Enam kartu download tersedia di bagian materi terkait. Isi `downloads.json` dengan path relatif file asli atau URL HTTPS, lalu jalankan `python build.py` kembali. Contoh nilai: `files/probis.pdf`, `files/atribut.drawio`, `files/struktur.zip`, atau URL unduhan AP. Nama dan ekstensi file bebas, asalkan path sesuai file yang disediakan.

Kunci konfigurasi: `probis`, `ap`, `atribut`, `struktur`, `testing`, dan `laporan`. Nilai konfigurasi kosong atau file lokal yang tidak ditemukan menghasilkan tombol nonaktif bertuliskan “File belum tersedia”. File lokal memakai atribut HTML `download`; URL eksternal dibuka di tab baru karena unduhan lintas domain dikendalikan server penyedia.

Untuk pengecekan sementara, keenam tombol mengunduh file dummy `files/document .txt` yang disediakan pengguna (nama file mengandung spasi sebelum `.txt`). File ini masih kosong dan tetap dapat diunduh. Ganti masing-masing path konfigurasi setelah dokumen asli tersedia.

## Diagram pembelajaran

- `diagrams/project-workflow.html`: alur interaktif yang dihasilkan CLI Archify dari `diagrams/project-workflow.json`, dimuat pada halaman Project.
- `diagrams/flowchart-checkout.html`, `erd-awal.html`, `pdm-normalisasi.html`, `pdm-denormalisasi.html`, dan `sdlc.html`: diagram HTML/SVG dengan panduan Diagram Design, ditampilkan pada halaman Analisis.
- `make_diagrams.py`: sumber generator diagram statis. Otomatis dipanggil oleh `build.py`.
- `diagrams/style-guide.md`: palet dan tipografi yang diambil dari desain website pengguna.

Provenance: [Archify](https://github.com/tt-a1i/archify) dan [Diagram Design](https://github.com/cathrynlavery/diagram-design). Archify menggunakan skill lokal versi 2.17.0-dev.1; CSS hasil delivery telah dipisahkan ke assets/css/; generator website tidak merender ulang viewer Archify. Diagram Design memakai skill lokal versi 2.6. PDM menggambarkan record TXT dan tipe C, tanpa mengasumsikan database SQL.

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
Semua halaman menggunakan link stylesheet; tidak ada blok `<style>` internal.
JavaScript viewer/progres tetap dapat mengubah properti dinamis (zoom, posisi, dan lebar progres).
