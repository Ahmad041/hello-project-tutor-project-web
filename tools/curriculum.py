"""Urutan belajar: dokumen, library console, lalu UI ASCII art."""

PAGES = [
    ('project.html', '01', 'Dokumen Persiapan'),
    ('analisis.html', '02', 'Dokumen After'),
    ('teknis.html', '03', 'Penggunaan lib.h'),
    ('testing.html', '04', 'UI/UX menggunakan lib.h'),
]

DESCRIPTIONS = {
    'project.html': ('Siapkan dokumen sebelum membuat program.', 'Pilih tema, tetapkan scope, temukan atribut, lalu susun Probis dan Activity Plan.', '± 60 menit'),
    'analisis.html': ('Dokumentasikan hasil dan cara penggunaan.', 'Kerjakan user testing, susun proposal, dan lengkapi Product Documentation serta User Guide.', '± 90 menit'),
    'teknis.html': ('Kenali alat untuk menggambar di terminal.', 'Pelajari fungsi lib.h, kebutuhan Windows, koordinat, border, kursor, dan input.', '± 60 menit'),
    'testing.html': ('Tempatkan ASCII art di program C.', 'Ubah gambar menjadi teks dengan ASCIIArt.eu, lalu tampilkan pada koordinat console menggunakan lib.h.', '± 60 menit'),
}

INCLUDES = '''#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <conio.h>
#include <wchar.h>
#include <ctype.h>
#include "lib.h"'''

def adapt_curriculum(content, stories, table, code, call, checks):
    def story(anchor, title, explanation, analogy, action):
        stories[anchor] = dict(title=title, explanation=explanation, analogy=analogy, action=action)

    original_technical = {a: (a, h, b) for a, h, b in content['teknis.html']}
    original_testing = list(content['testing.html'])
    content['project.html'].append(('activity-plan', 'AP · Activity Plan',
        '<p>Activity Plan adalah dokumen rencana kegiatan project. Tuliskan pekerjaan, penanggung jawab, waktu, hasil yang diserahkan, dan status. AP bukan kepanjangan dari arsitektur program.</p>'
        + table(['Kegiatan', 'Penanggung jawab', 'Waktu rencana', 'Hasil', 'Status'], [
            ['Definisi kebutuhan', '[nama]', '[tanggal]', 'Scope dan contoh transaksi', 'Belum dimulai'],
            ['Pembuatan dokumen', '[nama]', '[tanggal]', 'Probis, diagram, atribut, rencana testing', 'Belum dimulai'],
            ['Mempelajari lib.h', '[nama]', '[tanggal]', 'Catatan fungsi dan latihan console', 'Belum dimulai'],
            ['Membuat UI ASCII art', '[nama]', '[tanggal]', 'Menu dan form terminal', 'Belum dimulai'],
            ['Pengujian dan laporan', '[nama]', '[tanggal]', 'Hasil aktual, bukti, laporan', 'Belum dimulai']])
        + call('Isi tanggal berdasarkan jadwal tim sendiri. Perbarui status dan hasil aktual sepanjang pengerjaan.')))
    story('activity-plan', 'Susun Activity Plan', 'Tuliskan kegiatan yang akan dilakukan, siapa yang mengerjakan, kapan, dan dokumen atau program yang dihasilkan.', 'Seperti jadwal kerja toko: setiap pekerjaan punya petugas dan waktu.', 'Isi satu baris AP untuk kegiatan membuat UI.')

    content['analisis.html'].extend([original_technical['atribut'], original_technical['folder']])
    content['analisis.html'].extend(original_testing)
    content['analisis.html'].append(('review-docs', 'Periksa paket dokumen', checks([
        'Activity Plan memuat kegiatan, penanggung jawab, waktu, hasil, dan status.',
        'Probis, flowchart, ERD, PDM, DFD, dan fitur memakai nama data yang sama.',
        'Kamus atribut dan struktur file cocok dengan rancangan.',
        'Rencana testing memiliki langkah dan hasil yang diharapkan.',
        'Kerangka laporan membedakan rencana dari hasil aktual.'])))
    story('review-docs', 'Cocokkan semua dokumen', 'Sebelum membuat UI, periksa apakah field di form, nama data, dan kebutuhan fitur sudah dijelaskan di dokumen.', 'Seperti mengecek gambar bangunan sebelum mulai memasang batu.', 'Cocokkan field nama produk di kamus atribut dengan rancangan form.')
    stories['strategi']['explanation'] = 'Siapkan rencana pengujian di tahap dokumen. Kasus uji mencakup input, uang, stok, dan penyimpanan; hasil aktual diisi setelah program dibuat.'
    stories['kasus']['action'] = 'Tulis ekspektasi pembelian dua buku; biarkan hasil aktual berstatus belum diuji.'
    stories['bukti']['action'] = 'Tulis bukti yang akan dikumpulkan ketika kasus dijalankan: tangkapan layar dan file data.'
    stories['selesai']['title'] = 'Siapkan checklist penyerahan'
    stories['selesai']['explanation'] = 'Susun daftar file dan bukti yang harus ada saat project selesai. Pada tahap ini checklist masih menjadi rencana.'
    stories['selesai']['action'] = 'Tuliskan source, dokumen, dan bukti pengujian yang akan diserahkan.'

    content['teknis.html'] = [
        ('lib-intro', 'Apa isi lib.h?', '<p><code>lib.h</code> adalah header bantuan console Windows yang diberikan untuk latihan. File ini berisi definisi fungsi, bukan hanya deklarasi. Gunakan satu file C untuk latihan awal dan include header ini satu kali; project banyak file memerlukan pemisahan deklarasi dan implementasi.</p>'
            + table(['Kelompok', 'Fungsi', 'Kegunaan'], [
                ['Posisi dan teks', 'gotoxy, gotoPrintString, gotoPrintChar', 'Menempatkan teks atau karakter pada koordinat'],
                ['Bingkai', 'borderLine, borderDoubleLine, borderClear', 'Menggambar atau menghapus garis tepi'],
                ['Area dan kursor', 'clearArea, hideCursor, showCursor', 'Mengelola area tampilan dan kursor'],
                ['Teks dari file', 'PrintTxt', 'Menampilkan isi TXT per baris'],
                ['Input', 'scanInputString, scanInputText, scanInputPassword, scanInputNumber, scanInputMoney', 'Menerima input sesuai jenis field'],
                ['Console', 'fullscreen, remove_scrollbar, setConsoleFont', 'Pengaturan jendela dan font']])
            + call('Fungsi ini memakai Windows API. Efek font, fullscreen, dan karakter border dapat berbeda menurut terminal, font, serta code page.')),
        ('lib-setup', 'Siapkan header dan compiler', '<p>Simpan <code>main.c</code> dan <code>lib.h</code> pada folder latihan yang sama. Pakai GCC untuk Windows, misalnya MinGW-w64. Header standar dan Windows harus di-include sebelum <code>lib.h</code> karena file yang diberikan belum menyertakannya.</p>'
            + code(INCLUDES + '\n\nint main(void) {\n    gotoPrintString(2, 2, "Halo dari lib.h");\n    getch();\n    return 0;\n}', 'main.c · latihan pertama')
            + code('gcc -std=c17 -Wall -Wextra main.c -o latihan.exe\n.\\latihan.exe', 'PowerShell · pada folder latihan')
            + call('Kode contoh perlu dicoba di Windows. Library asli memiliki kesalahan pada fungsi input yang dibahas pada langkah pemeriksaan; jangan menyembunyikan peringatan compiler.')),
        ('lib-position', 'Koordinat dan teks', '<p>Koordinat <code>(x, y)</code> dihitung dalam sel karakter, dimulai dari <code>(0, 0)</code> di pojok kiri atas. x bergerak ke kanan; y bergerak ke bawah. <code>gotoPrintString</code> mencetak teks setelah memindahkan kursor, sedangkan <code>gotoPrintChar</code> mencetak satu karakter.</p>'
            + code('gotoxy(4, 3);\nprintf("KASIRKITA");\ngotoPrintString(4, 5, "Nama produk:");\ngotoPrintChar(3, 5, \'>\');', 'Latihan posisi')
            + call('Pastikan koordinat dan panjang teks muat di jendela console. Teks panjang tidak otomatis dipotong oleh library.')),
        ('lib-border', 'Bingkai, area, dan kursor', '<p><code>borderLine(x, y, lebar, tinggi)</code> dan <code>borderDoubleLine</code> menggambar bingkai hingga koordinat <code>x + lebar</code> dan <code>y + tinggi</code>. <code>borderClear</code> menghapus tepinya; <code>clearArea</code> mengisi area dengan spasi.</p>'
            + code('hideCursor();\nborderDoubleLine(2, 1, 60, 15);\ngotoPrintString(5, 3, "Menu utama");\nclearArea(5, 12, 50, 1);\nhideCursor();', 'Latihan bingkai')
            + call('clearArea memanggil showCursor di akhir. Sembunyikan kursor kembali jika UI sedang menampilkan menu.')
            + '<div class="download-card uat-sim-card" style="margin-top:16px;border-color:rgba(16,185,129,0.4);background:linear-gradient(135deg,rgba(13,23,37,0.9),rgba(5,150,105,0.12));"><div><span class="download-label" style="background:#059669;color:#fff;">SIMULATOR RETRO CONSOLE · FULLSCREEN</span><h3 style="color:#6ee7b7;">Terminal Studio 80×25</h3><p>Uji fungsi koordinat <code>gotoxy</code>, <code>borderLine</code>, dan <code>borderDoubleLine</code> langsung di atas grid layar C console. Klik atau drag pada kanvas retro, lalu copy kode C yang dihasilkan otomatis ke IntelliJ!</p></div><a class="pill" href="game/terminal-studio.html" style="background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;font-weight:700;">💻 Buka Terminal Studio 80×25 ↗</a></div>'),
        ('lib-input', 'Kenali fungsi input', table(['Fungsi', 'Argumen hasil', 'Batas yang harus dijaga'], [
            ['scanInputString / Text / Password', 'char buffer[] dan maxChar', 'maxChar paling besar kapasitas buffer dikurangi 1 untuk NUL'],
            ['scanInputNumber', 'int *num dan maxChar', 'Buffer internal 50 byte; jumlah digit dan nilai int harus diperiksa'],
            ['scanInputMoney', 'int *nilai, min, max', 'min/max berarti jumlah digit, bukan batas nilai rupiah']])
            + code('/* Coba setelah koreksi fungsi input pada langkah berikutnya. */\nchar nama[100] = {0};\nint jumlah = 0;\nscanInputString(18, 5, nama, 30);\nscanInputNumber(18, 7, &jumlah, 3);\nif (jumlah <= 0) gotoPrintString(4, 11, "Jumlah harus lebih dari nol.");', 'Contoh pemanggilan input')
            + call('Masking password dengan * hanya menyamarkan tampilan. atoi tidak melaporkan overflow; validasi angka dan nilai kosong tetap menjadi tanggung jawab program.')),
        ('lib-review', 'Periksa library sebelum dipakai', '<p>File unduhan tetap merupakan file asli pengguna. Catat dan perbaiki masalah berikut pada salinan latihan sebelum memakai fungsi input:</p>'
            + table(['Lokasi', 'Masalah', 'Tindakan'], [
                ['Empat fungsi input · BACKSPACE', 'text[i] = "" memberikan pointer string ke char', 'Kurangi i lalu tulis text[i] = \\0 sebagai karakter NUL'],
                ['scanInputString · ESC', 'Kondisi i &lt; 0 tidak tercapai', 'Tetapkan perilaku batal; contoh: kosongkan buffer lalu keluar'],
                ['PrintTxt', 'fopen gagal belum diperiksa sebelum fgets', 'Periksa file != NULL sebelum membaca'],
                ['Semua fungsi input', 'Batas buffer tidak dibuktikan dari maxChar', 'Batasi karakter dan sisakan ruang terminator'],
                ['setConsoleFont', 'wcscpy tidak membatasi panjang nama font', 'Batasi nama font sesuai kapasitas FaceName']])
            + code("if (ch == BACKSPACE && i > 0) {\n    --i;\n    text[i] = '\\0';\n    printf(\"\\b \\b\");\n}", 'Pola BACKSPACE · gunakan pada keempat fungsi input')
            + checks(['Saya tahu fungsi posisi, bingkai, area, dan input.', 'Saya menyiapkan header yang diperlukan sebelum lib.h.', 'Saya sudah mencatat koreksi input pada salinan latihan.', 'Saya membatasi koordinat dan kapasitas buffer.'])),
    ]

    ascii_title = '+--------------------------------------+\n|              KASIRKITA               |\n|          TOKO ALAT TULIS              |\n+--------------------------------------+'
    demo = INCLUDES + '''

int main(void) {
    int pilihan = 0;
    const char *menu[] = {"Produk", "Penjualan", "Laporan", "Keluar"};
    system("cls");
    hideCursor();
    borderDoubleLine(2, 1, 60, 18);
    gotoPrintString(6, 3, "K A S I R K I T A");
    gotoPrintString(6, 5, "PANAH: pilih | ENTER: buka | ESC: keluar");
    for (;;) {
        for (int i = 0; i < 4; ++i) {
            gotoxy(6, 8 + i * 2);
            printf("%c %-12s", i == pilihan ? '>' : ' ', menu[i]);
        }
        int tombol = getch();
        if (tombol == 0 || tombol == 224) {
            tombol = getch();
            if (tombol == UP_ARROW) pilihan = (pilihan + 3) % 4;
            else if (tombol == DOWN_ARROW) pilihan = (pilihan + 1) % 4;
            continue;
        }
        if (tombol == ESC || (tombol == ENTER && pilihan == 3)) break;
        if (tombol == ENTER) {
            clearArea(6, 17, 50, 1);
            gotoxy(6, 17);
            printf("Menu %s dipilih.", menu[pilihan]);
            hideCursor();
        }
    }
    showCursor();
    gotoxy(0, 21);
    return 0;
}'''
    content['testing.html'] = [
        ('ui-sketch', 'Rancang layout dalam sel karakter', '<p>Gunakan kebutuhan dan atribut dari modul 1–2. Mulai dari sketsa 80 kolom × 25 baris: judul di atas, menu di tengah, dan pesan di bawah. Pada latihan awal menu hanya memberi pesan pilihan; logika kasir dihubungkan setelah UI bekerja.</p>'
            + code('+------------------------------------------------------------+\n| KASIRKITA                                                  |\n| PANAH: pilih | ENTER: buka | ESC: keluar                    |\n|                                                            |\n| > Produk                                                   |\n|   Penjualan                                                |\n|   Laporan                                                  |\n|   Keluar                                                   |\n|                                                            |\n| Pesan / status                                             |\n+------------------------------------------------------------+', 'Sketsa ASCII')
            + call('ASCII art memakai karakter seperti +, -, |, dan huruf. Border bawaan lib.h memakai kode karakter lain; tampilannya bergantung code page.')),
        ('ui-title', 'Buat judul ASCII art', '<p>Buat judul di file <code>judul.txt</code> menggunakan editor teks. Simpan karakter ASCII biasa agar mudah ditampilkan. Untuk awal gunakan pola berikut, lalu buat bentuk huruf sendiri.</p>'
            + code(ascii_title, 'judul.txt')
            + code('/* Pastikan PrintTxt sudah memeriksa hasil fopen. */\nPrintTxt(4, 2, "judul.txt");', 'Menampilkan judul dari file')
            + call('Letakkan judul.txt di direktori kerja saat program dijalankan. File yang tidak ditemukan harus menghasilkan pesan error, bukan diteruskan ke fgets.')),
        ('ui-frame', 'Tempatkan judul dan bingkai', '<p>Mulai dengan <code>system("cls")</code> pada console Windows, lalu gambar bingkai menggunakan <code>borderDoubleLine</code>. Tampilkan label melalui <code>gotoPrintString</code>. Untuk bingkai ASCII murni gunakan <code>gotoPrintChar</code> dengan +, -, dan |.</p>'
            + code("for (int x = 2; x <= 62; ++x) {\n    gotoPrintChar(x, 1, '-');\n    gotoPrintChar(x, 19, '-');\n}\nfor (int y = 2; y < 19; ++y) {\n    gotoPrintChar(2, y, '|');\n    gotoPrintChar(62, y, '|');\n}\ngotoPrintChar(2, 1, '+');\ngotoPrintChar(62, 1, '+');\ngotoPrintChar(2, 19, '+');\ngotoPrintChar(62, 19, '+');", 'Bingkai ASCII melalui lib.h')
            + '<div class="download-card uat-sim-card" style="margin-top:16px;border-color:rgba(168,85,247,0.4);background:linear-gradient(135deg,rgba(13,23,37,0.9),rgba(147,51,234,0.12));"><div><span class="download-label" style="background:#7c3aed;color:#fff;">STAGING ASCII ART & CONSOLE · FULLSCREEN</span><h3 style="color:#d8b4fe;">ASCII Art Stager di Terminal Studio</h3><p>Uji penempatan ASCII Art banner toko KasirKita di koordinat console 80×25. Pratinjau susunan header, box border, dan menu tombol sebelum dipindahkan ke file <code>main.c</code>.</p></div><a class="pill" href="game/terminal-studio.html#stager" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;font-weight:700;">🎨 Buka ASCII Art Stager ↗</a></div>'),
        ('ui-menu', 'Rangkai menu dengan tombol panah', '<p>Indeks pilihan berada di antara 0 dan 3. Tombol panah dari getch mengirim awalan 0 atau 224, kemudian kode arah; baca keduanya. ENTER membuka pilihan, ESC keluar. Contoh berikut menggambar ulang label menu tanpa membersihkan seluruh layar setiap kali tombol ditekan.</p>'
            + code(demo, 'main.c · demo menu lengkap')
            + call('Siapkan console minimal 64 kolom × 22 baris. Demo memakai helper posisi, border, dan area; fitur Produk, Penjualan, serta Laporan belum diimplementasikan.')),
        ('ui-form', 'Susun form sesuai kamus atribut', '<p>Form produk memakai SKU, nama, harga, dan stok sesuai dokumen modul 2. Pisahkan koordinat label, tempat input, serta area pesan. Jalankan contoh input setelah memperbaiki salinan lib.h sesuai modul 3.</p>'
            + code('char sku[100] = {0};\nchar nama[100] = {0};\nint stok = 0;\nclearArea(4, 7, 56, 10);\ngotoPrintString(5, 8, "SKU   :");\ngotoPrintString(5, 10, "Nama  :");\ngotoPrintString(5, 12, "Stok  :");\nscanInputString(14, 8, sku, 20);\nscanInputString(14, 10, nama, 30);\nscanInputNumber(14, 12, &stok, 3);\nif (sku[0] == \'\\0\' || nama[0] == \'\\0\') {\n    gotoPrintString(5, 16, "SKU dan nama wajib diisi.");\n}\nhideCursor();', 'Fragmen form produk · dipasang pada handler menu')
            + call('Fragmen ini melatih tampilan dan input, belum menyimpan produk. Batasi input latihan stok menjadi 3 digit; harga dan perhitungan uang memerlukan validasi range tersendiri.')),
        ('ui-check', 'Uji UI dan kumpulkan bukti', table(['Percobaan', 'Hasil yang diharapkan'], [
            ['Panah atas/bawah di ujung daftar', 'Pilihan berputar tanpa keluar dari indeks menu'],
            ['ENTER dan ESC', 'Pesan pilihan benar; keluar mengembalikan kursor'],
            ['Backspace, input kosong, input panjang', 'Setelah koreksi library: buffer valid dan pesan terlihat'],
            ['File judul tidak ada', 'Setelah koreksi PrintTxt: error terkontrol'],
            ['Ukuran terminal dan font berbeda', 'Label tidak bertumpuk; pakai bingkai ASCII bila glyph tidak sesuai']])
            + checks(['Judul dan bingkai terlihat utuh.', 'Menu dapat digunakan dengan keyboard.', 'Form memiliki label, batas input, dan pesan validasi.', 'Hasil aktual dan screenshot dimasukkan ke dokumen testing serta laporan modul 2.'])),
    ]
    entries = [
        ('lib-intro', 'Kenali isi lib.h', 'Library membantu menata tampilan dan input di console Windows.', 'Seperti kotak alat: pilih alat sesuai pekerjaan.', 'Cari fungsi untuk memindahkan kursor.'),
        ('lib-setup', 'Siapkan latihan pertama', 'Pasang header dan compiler sebelum memanggil fungsi library.', 'Siapkan meja dan alat sebelum merakit.', 'Simpan main.c di sebelah lib.h.'),
        ('lib-position', 'Atur posisi teks', 'Setiap teks ditempatkan pada kolom x dan baris y.', 'Seperti memilih kotak pada kertas petak.', 'Pindahkan tulisan dari (4, 3) ke (10, 5).'),
        ('lib-border', 'Kenali bingkai dan area', 'Gambar tepi, bersihkan area pesan, dan atur kursor.', 'Seperti menyiapkan papan pengumuman.', 'Gambar bingkai dan hapus satu baris pesan.'),
        ('lib-input', 'Pilih fungsi input', 'Sesuaikan input dengan field teks, angka, atau uang.', 'Seperti menyediakan kotak formulir yang berbeda.', 'Tentukan batas panjang nama produk.'),
        ('lib-review', 'Periksa sebelum memakai', 'Library asli perlu koreksi pada input dan pembacaan file sebelum latihan form.', 'Periksa alat sebelum dipakai bekerja.', 'Temukan cabang BACKSPACE dan perbaiki salinan latihan.'),
        ('ui-sketch', 'Gambar UI di kertas dulu', 'Tentukan posisi judul, menu, form, dan pesan dalam sel karakter.', 'Seperti menggambar denah meja kasir.', 'Buat sketsa terminal 80 kali 25 sel.'),
        ('ui-title', 'Buat judul ASCII art', 'Susun karakter menjadi judul dan simpan di file teks.', 'Seperti papan nama toko dari potongan huruf.', 'Buat judul.txt dan tentukan posisi tampilnya.'),
        ('ui-frame', 'Bangun bingkai tampilan', 'Gunakan fungsi lib.h untuk membatasi area UI dan menempatkan label.', 'Bingkai membantu memisahkan bagian papan pengumuman.', 'Buat border ASCII menggunakan +, -, dan |.'),
        ('ui-menu', 'Hidupkan menu keyboard', 'Tampilkan pilihan aktif lalu tangani panah, ENTER, dan ESC.', 'Seperti memindahkan penunjuk pada daftar pekerjaan.', 'Jalankan demo dan pilih setiap menu.'),
        ('ui-form', 'Tambahkan form produk', 'Gunakan atribut dari dokumen untuk menyusun label, input, dan validasi.', 'Form adalah kartu produk yang diisi di layar.', 'Coba nama kosong dan input melebihi batas.'),
        ('ui-check', 'Buktikan UI bekerja', 'Uji keyboard, layout, input, dan file judul; catat hasil aktual.', 'Seperti mencoba meja kasir sebelum toko dibuka.', 'Ambil screenshot dan isi dokumen testing.'),
    ]
    for entry in entries:
        story(*entry)
    for page, anchor in [('teknis.html', 'lib-intro'), ('testing.html', 'ui-sketch')]:
        for i, (key, heading, body) in enumerate(content[page]):
            if key == anchor:
                content[page][i] = (key, heading, '<p><a class="pill" href="dokumentasi-lib.html">Buka dokumentasi lib.h</a></p>' + body)
    from module_content import finalize
    finalize(content, stories, table, code, call, checks)
