"""Dokumentasi yang mengikuti implementasi files/lib.h milik pengguna."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parent

# Parameter dan perilaku berikut merujuk file asli, termasuk keterbatasannya.
FUNCTIONS = [
    ('Posisi & teks', 'gotoxy', 'Memindahkan kursor ke kolom dan baris tertentu.',
     [('x', 'int', 'Kolom tujuan; 0 adalah kolom pertama.'), ('y', 'int', 'Baris tujuan; 0 adalah baris pertama.')],
     'gotoxy(4, 3);\nprintf("KASIRKITA");',
     'Memanggil SetConsoleCursorPosition dengan COORD. Fungsi tidak mencetak teks. Tulisan berikutnya dimulai pada posisi baru.',
     'Koordinat harus berada dalam buffer console. Nilai dikonversi ke field SHORT pada COORD; file asli tidak memeriksa rentang atau hasil Windows API.'),
    ('Posisi & teks', 'gotoPrintString', 'Menampilkan teks pada koordinat yang dipilih.',
     [('x, y', 'int', 'Kolom dan baris awal teks.'), ('text', 'char[255]', 'String bertanda akhir NUL yang akan dicetak.')],
     'gotoPrintString(4, 5, "Nama produk:");',
     'Memanggil gotoxy(x, y), lalu printf("%s", text). Penanda [255] pada parameter bukan pemeriksaan otomatis kapasitas string.',
     'Tidak ada pemotongan, wrapping terkontrol, atau pembersihan tulisan lama. Saat mengganti teks dengan teks lebih pendek, bersihkan area terlebih dahulu.'),
    ('Posisi & teks', 'gotoPrintChar', 'Menampilkan satu karakter pada posisi tertentu.',
     [('x, y', 'int', 'Kolom dan baris tujuan.'), ('dec', 'int', 'Nilai karakter yang dicetak melalui %c.')],
     "gotoPrintChar(4, 7, '>');\ngotoPrintChar(5, 7, '-');",
     'Memindahkan kursor, kemudian mencetak karakter melalui printf("%c", dec). Karakter ASCII seperti +, -, dan | bisa dipakai untuk bingkai.',
     'Kode byte non-ASCII bergantung pada code page dan font console. Angka 205 tidak menjamin simbol garis yang sama pada setiap terminal.'),
    ('Bingkai & area', 'borderLine', 'Menggambar bingkai dengan karakter garis tunggal.',
     [('x, y', 'int', 'Koordinat sudut kiri atas.'), ('lebar', 'int', 'Selisih kolom dari sisi kiri ke kanan.'), ('tinggi', 'int', 'Selisih baris dari sisi atas ke bawah.')],
     'borderLine(2, 1, 50, 12);\ngotoPrintString(5, 3, "Menu produk");',
     'Bingkai memiliki sisi kanan pada x + lebar dan sisi bawah pada y + tinggi. Untuk lebar 50, rentang keseluruhan adalah 51 kolom, termasuk dua sudut.',
     'Versi asli memakai 196/179 untuk garis, tetapi 201/187/200/188 untuk sudut. Pada code page yang sesuai, sudutnya berupa garis ganda sehingga tampilannya dapat bercampur.'),
    ('Bingkai & area', 'borderDoubleLine', 'Menggambar bingkai menggunakan karakter garis ganda.',
     [('x, y', 'int', 'Koordinat sudut kiri atas.'), ('lebar', 'int', 'Offset sisi kanan dari x.'), ('tinggi', 'int', 'Offset sisi bawah dari y.')],
     'borderDoubleLine(2, 1, 60, 18);\ngotoPrintString(6, 3, "K A S I R K I T A");',
     'Menggunakan 205 untuk garis horizontal, 186 untuk garis vertikal, dan empat kode sudut. Area isi berada di antara sisi-sisi bingkai.',
     'Ukuran harus positif dan muat di console. File asli tidak mengubah ukuran console dan tidak memeriksa hasil gotoxy.'),
    ('Bingkai & area', 'borderClear', 'Menghapus tepi bingkai dengan karakter spasi.',
     [('x, y', 'int', 'Sudut kiri atas bingkai yang akan dihapus.'), ('lebar, tinggi', 'int', 'Ukuran offset yang sama dengan saat menggambar bingkai.')],
     'borderDoubleLine(2, 1, 50, 12);\ngetch();\nborderClear(2, 1, 50, 12);',
     'Menambah lebar dan tinggi lokal sebanyak 1 agar sudut serta sisi terakhir ikut terhapus. Bagian dalam bingkai tidak dibersihkan.',
     'Untuk menghapus seluruh panel gunakan clearArea dengan ukuran 51 × 13 pada contoh ini. borderClear tidak menghapus teks di dalam panel.'),
    ('Bingkai & area', 'clearArea', 'Membersihkan suatu area persegi panjang.',
     [('x, y', 'int', 'Posisi sel pertama yang dibersihkan.'), ('width', 'int', 'Jumlah kolom, bukan offset sisi kanan.'), ('height', 'int', 'Jumlah baris yang dibersihkan.')],
     'clearArea(5, 16, 45, 2);\ngotoPrintString(5, 16, "Produk berhasil ditambahkan.");\nhideCursor();',
     'Memanggil hideCursor, menulis spasi sepanjang width pada tiap baris, lalu memanggil showCursor. Width 45 membersihkan x sampai x + 44.',
     'Kursor selalu ditampilkan kembali di akhir, meskipun sebelumnya disembunyikan. Panggil hideCursor kembali setelah clearArea untuk tampilan menu.'),
    ('Kursor & console', 'hideCursor', 'Menyembunyikan kursor saat menampilkan UI.', [],
     'hideCursor();\ngotoPrintString(4, 3, "Pilih menu dengan tombol panah.");',
     'Membaca CONSOLE_CURSOR_INFO dari output handle, mengubah bVisible menjadi FALSE, lalu menerapkan hasilnya.',
     'Tidak menonaktifkan input keyboard. Pasangkan dengan showCursor sebelum pengguna mengisi form dan sebelum keluar dari program.'),
    ('Kursor & console', 'showCursor', 'Menampilkan kembali kursor console.', [],
     'showCursor();\ngotoxy(16, 5);\ngetch();',
     'Mengubah bVisible menjadi TRUE melalui SetConsoleCursorInfo. Ukuran kursor dipertahankan dari konfigurasi yang dibaca.',
     'Tidak memindahkan kursor dan tidak membaca input. scanInputString serta helper input lainnya juga memanggil showCursor.'),
    ('Kursor & console', 'fullscreen', 'Memaksimalkan jendela dan mengirim kombinasi Alt+Enter.', [],
     'fullscreen();',
     'Memanggil ShowWindow(GetConsoleWindow(), SW_MAXIMIZE), lalu keybd_event untuk menekan dan melepas Alt serta Enter.',
     'Efeknya bergantung host console dan fokus keyboard. Jangan memanggilnya otomatis pada latihan pertama; pemaksimalan jendela tidak sama dengan jaminan fullscreen.'),
    ('Kursor & console', 'remove_scrollbar', 'Mencoba menyesuaikan buffer dengan ukuran jendela console.', [],
     'remove_scrollbar();',
     'Menghitung lebar/tinggi jendela dari srWindow, kemudian memanggil SetConsoleScreenBufferSize agar ukuran buffer mengikuti jendela.',
     'Dapat gagal menurut ukuran buffer, posisi jendela, dan terminal yang dipakai. File asli tidak memeriksa nilai balik API dan tidak menjamin scrollbar hilang.'),
    ('Kursor & console', 'setConsoleFont', 'Mencoba mengubah ukuran dan nama font console.',
     [('fontSize', 'int', 'Tinggi font yang ditulis ke dwFontSize.Y.'), ('fontName', 'const wchar_t *', 'Nama font wide string, misalnya L"Consolas".')],
     'setConsoleFont(20, L"Consolas");',
     'Membaca CONSOLE_FONT_INFOEX, mengatur dwFontSize.X menjadi 0, tinggi font, serta FaceName, lalu memanggil SetCurrentConsoleFontEx.',
     'wcscpy pada file asli tidak membatasi panjang fontName. Nama harus muat di FaceName; dukungan perubahan font berbeda menurut host console dan hasil API tidak diperiksa.'),
    ('File teks', 'PrintTxt', 'Menampilkan file teks baris demi baris sebagai ASCII art.',
     [('x, y', 'int', 'Posisi baris pertama.'), ('txtFile', 'char[100]', 'Path file relatif terhadap direktori kerja atau path absolut.')],
     '/* Setelah menambahkan pemeriksaan fopen pada salinan library. */\nPrintTxt(4, 2, "judul.txt");',
     'Membuka file dalam mode r, membaca melalui fgets dengan buffer 255 byte, lalu mencetak setiap potongan pada baris y + penambah.',
     'Jika fopen gagal, file asli tetap memanggil fgets dengan pointer NULL. Periksa file terlebih dahulu. Baris panjang dapat terpecah menjadi beberapa baris tampilan; file berisi tab/newline tidak diproses sebagai layout terkontrol.'),
    ('Input form', 'scanInputString', 'Membaca input teks dengan ENTER dan BACKSPACE.',
     [('x, y', 'int', 'Posisi awal kursor input.'), ('text', 'char[100]', 'Buffer hasil milik pemanggil.'), ('maxChar', 'int', 'Jumlah karakter maksimal, sisakan 1 byte untuk NUL.')],
     '/* Gunakan salinan library setelah koreksi input. */\nchar nama[100] = {0};\nscanInputString(18, 5, nama, 30);',
     'Membaca getch berulang. ENTER mengakhiri string dengan NUL. Karakter selain ENTER/BACKSPACE masuk ke buffer jika i < maxChar.',
     'ESC tidak membatalkan karena kondisi i < 0 tidak tercapai. BACKSPACE berisi text[i] = "" yang salah tipe. Tombol khusus/control juga belum difilter. maxChar harus lebih kecil dari kapasitas buffer aktual.'),
    ('Input form', 'scanInputText', 'Membatasi input ke huruf ASCII, spasi, dan karakter 0.',
     [('x, y', 'int', 'Kursor mulai pada x + 1, y.'), ('text', 'char[100]', 'Buffer string hasil.'), ('maxChar', 'int', 'Batas karakter; maksimal kapasitas buffer dikurangi 1.')],
     '/* Setelah koreksi BACKSPACE pada salinan library. */\nchar nama[100] = {0};\nscanInputText(18, 7, nama, 30);',
     'Kondisi asli menerima a-z, A-Z, SPACE, serta karakter \'0\'. Huruf beraksen, angka 1-9, dan tanda baca tidak diterima.',
     'Walaupun komentar file mengatakan hanya alphabet, karakter 0 tetap diizinkan oleh kode. BACKSPACE memiliki kesalahan yang sama dengan scanInputString. Fungsi ini bukan validator Unicode.'),
    ('Input form', 'scanInputPassword', 'Menerima teks sambil menampilkan tanda bintang.',
     [('x, y', 'int', 'Input ditampilkan mulai x + 1, y.'), ('text', 'char[100]', 'Buffer menyimpan karakter asli.'), ('maxChar', 'int', 'Batas panjang input; sisakan terminator NUL.')],
     '/* Setelah koreksi BACKSPACE pada salinan library. */\nchar password[100] = {0};\nscanInputPassword(18, 9, password, 30);',
     'Menerima huruf ASCII, angka, underscore, dan spasi. Karakter asli disimpan pada text, tetapi yang dicetak adalah *.',
     'Masking bukan enkripsi atau hashing. Buffer tetap berisi password asli. Fungsi ini juga memiliki kesalahan BACKSPACE; jangan memakai contoh sebagai sistem autentikasi lengkap.'),
    ('Input form', 'scanInputNumber', 'Membaca digit dan mengubahnya menjadi int.',
     [('x, y', 'int', 'Kursor awal x + 1, y.'), ('num', 'int *', 'Alamat variabel hasil, misalnya &stok.'), ('maxChar', 'int', 'Batas digit; buffer internal 50 byte.')],
     '/* Setelah koreksi BACKSPACE pada salinan library. */\nint stok = 0;\nscanInputNumber(18, 11, &stok, 3);\nif (stok <= 0) printf("Stok harus lebih dari nol.");',
     'Menerima 0-9, mengakhiri text saat ENTER, lalu menulis atoi(text) ke *num. Input kosong diproses oleh atoi sebagai 0.',
     'maxChar paling besar 49 untuk buffer internal, tetapi itu belum membatasi nilai agar muat di int. atoi tidak melaporkan error/overflow. Gunakan strtol dan pemeriksaan range pada versi yang diperbaiki.'),
    ('Input form', 'scanInputMoney', 'Menampilkan separator titik saat pengguna mengetik rupiah.',
     [('x, y', 'int', 'Posisi awal input.'), ('nilai', 'int *', 'Alamat hasil angka tanpa separator.'), ('min', 'int', 'Jumlah digit minimum sebelum ENTER diterima.'), ('max', 'int', 'Jumlah digit maksimum, bukan nilai rupiah maksimum.')],
     'int harga = 0;\nscanInputMoney(18, 13, &harga, 1, 6);\n/* Mengetik 12000 menampilkan 12.000; harga berisi 12000. */',
     'Digit disimpan tanpa titik pada input[225]. Teks ditampilkan ulang dengan kelompok tiga digit. ENTER diterima jika jumlah digit setidaknya min, lalu atoi mengubah buffer menjadi int.',
     'Gunakan 1 <= min <= max <= 224 dan batas digit lebih kecil sesuai rentang int. min=0 memungkinkan ENTER sebelum buffer terisi. getch disimpan ke char dan diteruskan ke isprint/isdigit; pada versi perbaikan gunakan int atau konversi unsigned char untuk ctype. Seluruh nilai tetap perlu divalidasi.'),
]

def paragraph(text):
    return '<p>' + escape(text) + '</p>'

def code(text, label='C'):
    return '<div class="code-block"><div class="code-label">'+escape(label)+'</div><pre tabindex="0"><code>'+escape(text)+'</code></pre></div>'

def section(slug, heading, body):
    return '<section id="'+slug+'"><h2>'+escape(heading)+'</h2>'+body+'</section>'

def article(slug, category, title, lead, body):
    return '<article class="reference-page" id="'+slug+'" data-title="'+escape(title, quote=True)+'"><p class="category">'+escape(category)+'</p><h1>'+escape(title)+'</h1><p class="lead">'+escape(lead)+'</p>'+body+'</article>'

def generate():
    source = (ROOT/'files/lib.h').read_text(encoding='utf-8')
    signatures = dict(re.findall(r'(void\s+(\w+)\s*\([^)]*\))\s*\{', source))
    by_name = {name: sig for sig, name in signatures.items()}
    actual_names = set(by_name)
    assert actual_names == {f[1] for f in FUNCTIONS}, 'Daftar fungsi tidak cocok dengan lib.h'
    includes = '''#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <conio.h>
#include <wchar.h>
#include <ctype.h>
#include "lib.h"

int main(void) {
    gotoPrintString(4, 3, "Halo, KasirKita!");
    getch();
    return 0;
}'''
    start = section('mulai-persyaratan', 'Persyaratan', paragraph('Library ini dibuat untuk console Windows. Siapkan compiler C untuk Windows yang menyediakan windows.h dan conio.h, misalnya MinGW-w64. Header asli memakai tipe dan fungsi dari header lain tanpa meng-include sendiri.'))
    start += section('mulai-pasang', 'Pasang lib.h', paragraph('Unduh file asli, lalu simpan main.c dan lib.h dalam satu folder. Contoh awal memakai satu translation unit karena lib.h berisi definisi fungsi dan belum memiliki include guard.')+'<a class="download" href="files/lib.h" download>Unduh lib.h asli</a>'+code(includes, 'main.c'))
    start += section('mulai-build', 'Compile dan jalankan', '<p>Sebelum compile pertama, koreksi empat cabang BACKSPACE pada salinan latihan menurut <a href="#perbaikan-backspace">catatan perbaikan</a>. Definisi fungsi input tetap ikut dikompilasi meskipun belum dipanggil.</p>'+code('gcc --version\ngcc -std=c17 -Wall -Wextra main.c -o latihan.exe -luser32\n.\\latihan.exe', 'PowerShell · contoh satu folder')+paragraph('Jalankan dari folder latihan yang berisi main.c dan salinan lib.h. Jika compiler gagal, jangan jalankan executable lama. Opsi -luser32 menghubungkan fungsi Windows dalam library. Untuk struktur include/src/build, ikuti perintah pada modul 3. Contoh C di dokumentasi belum dikompilasi di lingkungan ini.')+'<p><a href="teknis.html#lib-setup">Pemasangan modul 3</a> · <a href="https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-keybd_event" target="_blank" rel="noopener">Referensi User32</a></p>')
    start += section('mulai-koordinat', 'Cara membaca koordinat', paragraph('x adalah kolom dan y adalah baris, dimulai dari (0, 0) di pojok kiri atas. Ukuran dihitung dalam sel karakter. Setiap fungsi mengembalikan void; hasil Windows API belum diperiksa oleh library asli.')+code('gotoxy(4, 3);             // kolom 4, baris 3\nprintf("KasirKita");      // cetak dari posisi tersebut', 'Koordinat'))
    start += section('mulai-belajar', 'Hubungkan dengan modul', '<p><a href="teknis.html#lib-intro">Modul 3: mengenal lib.h</a> menjelaskan alatnya. <a href="testing.html#ui-sketch">Modul 4: UI ASCII art</a> merangkai alat tersebut menjadi menu dan form.</p>')
    articles = [article('mulai', 'Panduan awal', 'Dokumentasi lib.h', 'Referensi fungsi console Windows untuk membuat UI terminal dan ASCII art di project C.', start)]
    groups = {'Panduan awal': [('mulai', 'Mulai di sini', 'install compiler header Windows'), ('konstanta', 'Konstanta keyboard', 'ENTER ESC BACKSPACE SPACE UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW'), ('contoh-menu', 'Contoh menu', 'keyboard ASCII art')], 'Perawatan library': [('perbaikan', 'Catatan perbaikan', 'bug BACKSPACE fopen buffer include guard')]}
    for group, name, lead, params, example, behavior, note in FUNCTIONS:
        groups.setdefault(group, []).append((name, name+'()', lead))
        body = section(name+'-signature', 'Signature', code(by_name[name]+';', 'lib.h'))
        rows = ''.join('<tr><td><code>'+escape(a)+'</code></td><td><code>'+escape(t)+'</code></td><td>'+escape(d)+'</td></tr>' for a,t,d in params)
        parameters = '<div class="table-scroll" tabindex="0"><table><thead><tr><th>Parameter</th><th>Tipe</th><th>Penjelasan</th></tr></thead><tbody>'+rows+'</tbody></table></div>' if rows else paragraph('Tidak menerima parameter.')
        body += section(name+'-parameter', 'Parameter', parameters)
        body += section(name+'-perilaku', 'Perilaku', paragraph(behavior))
        body += section(name+'-contoh', 'Contoh penggunaan', code(example))
        body += section(name+'-catatan', 'Catatan implementasi', '<div class="implementation-note">'+paragraph(note)+'</div><p class="source-note">Dibaca dari <a href="files/lib.h">files/lib.h</a>. Return: <code>void</code>.</p>')
        articles.append(article(name, group, name+'()', lead, body))
    constants = re.findall(r'^#define\s+(\w+)\s+(\d+)', source, re.M)
    rows = ''.join('<tr><td><code>'+n+'</code></td><td>'+v+'</td></tr>' for n,v in constants)
    body = section('konstanta-nilai', 'Nilai dalam file asli', '<div class="table-scroll"><table><thead><tr><th>Konstanta</th><th>Nilai</th></tr></thead><tbody>'+rows+'</tbody></table></div>')
    body += section('konstanta-panah', 'Membaca tombol panah', paragraph('getch dapat mengirim awalan 0 atau 224 untuk tombol khusus. Baca kode kedua sebelum membandingkan UP_ARROW atau DOWN_ARROW; kode arah saja juga dapat bertepatan dengan karakter biasa.')+code('int key = getch();\nif (key == 0 || key == 224) {\n    key = getch();\n    if (key == UP_ARROW) { /* pindah ke atas */ }\n    else if (key == DOWN_ARROW) { /* pindah ke bawah */ }\n} else if (key == ENTER) {\n    /* buka pilihan */\n} else if (key == ESC) {\n    /* keluar */\n}'))
    articles.append(article('konstanta', 'Panduan awal', 'Konstanta keyboard', 'Nama tombol yang disediakan oleh lib.h dan cara membaca input khusus.', body))
    menu = includes[:includes.index('int main')] + '''int main(void) {
    int selected = 0;
    const char *items[] = {"Produk", "Penjualan", "Keluar"};
    system("cls");
    hideCursor();
    borderDoubleLine(2, 1, 56, 14);
    gotoPrintString(5, 3, "K A S I R K I T A");
    gotoPrintString(5, 5, "Panah: pilih | Enter: buka | Esc: keluar");
    for (;;) {
        for (int i = 0; i < 3; ++i) {
            gotoxy(5, 8 + i * 2);
            printf("%c %-12s", selected == i ? '>' : ' ', items[i]);
        }
        int key = getch();
        if (key == 0 || key == 224) {
            key = getch();
            if (key == UP_ARROW) selected = (selected + 2) % 3;
            else if (key == DOWN_ARROW) selected = (selected + 1) % 3;
            continue;
        }
        if (key == ESC || (key == ENTER && selected == 2)) break;
        if (key == ENTER) {
            clearArea(5, 14, 49, 1);
            gotoxy(5, 14);
            printf("Menu %s dipilih.", items[selected]);
            hideCursor();
        }
    }
    showCursor();
    gotoxy(0, 17);
    return 0;
}'''
    body = section('contoh-menu-layout', 'Rancangan tampilan', paragraph('Siapkan console minimal 60 kolom × 18 baris. Contoh membuat bingkai, judul, tiga pilihan, dan area pesan. Ini demo navigasi; fitur transaksi belum dihubungkan.')+code('+--------------------------------------------------------+\n| K A S I R K I T A                                      |\n| Panah: pilih | Enter: buka | Esc: keluar                |\n|                                                        |\n| > Produk                                               |\n|   Penjualan                                            |\n|   Keluar                                               |\n+--------------------------------------------------------+', 'Sketsa ASCII'))
    body += section('contoh-menu-kode', 'Kode lengkap', code(menu, 'main.c'))
    body += section('contoh-menu-lanjut', 'Latihan berikutnya', '<p>Tambahkan handler produk sesuai kamus atribut. Pelajari <a href="#scanInputString">scanInputString()</a> setelah mengoreksi fungsi input. Untuk memperkaya tampilan, ikuti <a href="testing.html#ascii-c">penempatan ASCII art pada modul 4</a>.</p>')
    articles.append(article('contoh-menu', 'Panduan awal', 'Contoh menu dengan lib.h', 'Gabungkan fungsi posisi, bingkai, dan input keyboard menjadi satu layar.', body))
    body = section('perbaikan-status', 'Status file asli', paragraph('Dokumentasi ini merujuk file pengguna yang tersedia untuk diunduh. File asli tidak diubah. Koreksi berikut adalah panduan untuk salinan latihan, bukan klaim bahwa library unduhan sudah diperbaiki.'))
    body += section('perbaikan-backspace', 'BACKSPACE dan ESC', paragraph('scanInputString, scanInputText, scanInputPassword, dan scanInputNumber berisi text[i] = "". Sisi kanan adalah pointer string, sementara sisi kiri char. Ganti cabang BACKSPACE pada keempat fungsi dengan pola berikut:')+code('if (ch == BACKSPACE) {\n    if (i > 0) {\n        --i;\n        text[i] = \'\\0\';\n        printf("\\b \\b");\n    }\n} else {\n    /* Pertahankan validasi karakter dan batas input di sini. */\n}')+paragraph('scanInputMoney memakai buffer berbeda dan tidak memiliki assignment tersebut. Pada scanInputString, i < 0 tidak pernah tercapai; jika ESC dimaksudkan membatalkan, tetapkan kontrak batal secara eksplisit, misalnya kosongkan text[0] dan keluar sebelum menerima karakter lain.'))
    body += section('perbaikan-file', 'Periksa pembukaan file', paragraph('PrintTxt harus memeriksa hasil fopen sebelum membaca. Contoh guard berikut ditempatkan langsung setelah fopen pada salinan fungsi:')+code('FILE *file = fopen(txtFile, "r");\nif (file == NULL) {\n    gotoPrintString(x, y, "File teks tidak dapat dibuka.");\n    return;\n}\n/* Baru lanjutkan fgets, lalu fclose. */'))
    body += section('perbaikan-batas', 'Batas buffer dan konversi angka', paragraph('Batas maxChar harus lebih kecil dari kapasitas buffer agar NUL muat. scanInputNumber memakai text[50]; scanInputMoney memakai input[225]. Batas digit saja belum menjamin angka muat dalam int. Untuk konversi yang diperbaiki, gunakan strtol, periksa errno, pointer akhir, dan rentang INT_MIN/INT_MAX. Untuk ctype, gunakan int yang valid atau unsigned char; jangan meneruskan char negatif.'))
    body += section('perbaikan-header', 'Header dan project banyak file', paragraph('Header asli belum memiliki include guard dan berisi definisi fungsi dengan linkage eksternal. Include berulang dapat menimbulkan redefinition; include dari beberapa file C dapat menimbulkan multiple definition saat link. Include guard hanya menyelesaikan pengulangan pada satu translation unit. Untuk project banyak file, pindahkan definisi ke lib.c dan sisakan prototipe serta konstanta di lib.h.'))
    body += section('perbaikan-console', 'Hasil Windows API', paragraph('Library asli belum memeriksa hasil GetConsoleCursorInfo, SetConsoleCursorPosition, dan pengaturan font/buffer. Saat memperbaiki library, periksa keberhasilan API sebelum memakai struktur yang diisi olehnya. Batasi penyalinan fontName ke FaceName. Uji border pada font/code page yang dipakai.'))
    articles.append(article('perbaikan', 'Perawatan library', 'Catatan perbaikan', 'Temuan yang terlihat langsung pada implementasi lib.h asli.', body))
    nav = ''
    for group in ['Panduan awal', 'Posisi & teks', 'Bingkai & area', 'Kursor & console', 'File teks', 'Input form', 'Perawatan library']:
        nav += '<div class="nav-group"><h2>'+escape(group)+'</h2>' + ''.join('<a href="#'+slug+'" data-search="'+escape(label+' '+keywords, quote=True)+'">'+escape(label)+'</a>' for slug,label,keywords in groups[group])+'</div>'
    html = '''<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Dokumentasi lib.h: fungsi, parameter, contoh C, dan catatan implementasi untuk console Windows."><title>Dokumentasi lib.h | Hello Project</title><link rel="stylesheet" href="assets/css/lib-docs.css"><script src="assets/js/lib-docs.js" defer></script></head>
<body><a class="skip-link" href="#content">Lewati navigasi</a>
<header class="docs-header"><a class="site-brand" href="index.html">Hello Project <span>/ lib.h</span></a><nav aria-label="Navigasi website"><a href="daftarModul.html">Modul</a><a href="files/lib.h" download>Unduh lib.h</a></nav><button class="menu-toggle" type="button" hidden aria-controls="docs-sidebar" aria-expanded="false">Menu dokumentasi</button></header>
<div class="docs-layout"><aside class="docs-sidebar" id="docs-sidebar" aria-label="Navigasi dokumentasi"><div class="search-wrap"><label for="docs-search">Cari fungsi</label><input type="search" id="docs-search" placeholder="gotoxy, border, input…" disabled aria-describedby="search-help"><p id="search-help">Nama fungsi atau kegunaan.</p><p id="search-status" role="status" aria-live="polite"></p></div><nav aria-label="Referensi lib.h">'''+nav+'''</nav><noscript><p>Semua referensi tersedia di halaman ini. Pencarian memerlukan JavaScript.</p></noscript></aside>
<main id="content" tabindex="-1">'''+''.join(articles)+'''<p class="not-found" hidden>Referensi tidak ditemukan. <a href="#mulai">Buka panduan awal</a>.</p><footer class="docs-footer">Hello Project · Referensi dari file lib.h pengguna · C / Windows</footer></main>
<aside class="page-toc" aria-label="Daftar isi artikel" hidden><p>Di halaman ini</p><nav></nav></aside></div><div class="copy-status" role="status" aria-live="polite"></div></body></html>'''
    (ROOT/'dokumentasi-lib.html').write_text(html, encoding='utf-8')
    return len(FUNCTIONS)

if __name__ == '__main__':
    print('Generated lib.h documentation:', generate(), 'functions')
