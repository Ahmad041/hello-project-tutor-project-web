"""Materi project C; website tetap berupa HTML statis."""
def adapt(content, table, code, cards, call, checks, flow, schema):
    content['project.html'][0] = ('kenalan', 'Kenali project C-mu',
        '<p><strong>KasirKita</strong> adalah aplikasi kasir standalone yang ditulis dalam <strong>bahasa C17</strong> dan dijalankan melalui terminal di komputer toko alat tulis. Pengguna mengelola produk, mencatat penjualan tunai, menampilkan nota, dan membaca laporan harian.</p>'
        + cards([('Masalah yang diselesaikan', 'Pencatatan manual menyulitkan pengecekan stok dan perhitungan nota.'), ('Hasil akhir', 'Program executable lokal, database SQLite, nota teks, serta laporan project.')])
        + call('<strong>Prasyarat:</strong> variabel, percabangan, perulangan, fungsi, array, pointer, struct, dan operasi file dasar dalam C. Siapkan compiler GCC yang mendukung C17 serta library dan header SQLite. Website ini adalah media tutorial; aplikasi yang dibangun berjalan di terminal.'))
    content['project.html'][1] = ('platform', 'Desktop atau web?', table(['Aspek', 'Desktop C — tutorial ini', 'Versi web — perbandingan'], [
        ['Antarmuka', 'Menu teks melalui terminal', 'Halaman dalam browser'], ['Eksekusi', 'Executable hasil kompilasi di komputer pengguna', 'Browser mengakses aplikasi pada server'], ['Penyimpanan', 'File SQLite lokal melalui API C', 'Database di server'], ['Koneksi', 'Tidak memerlukan internet saat digunakan', 'Memerlukan koneksi ke server lokal atau internet'], ['Distribusi', 'Build sesuai OS dan arsitektur target', 'Deploy aplikasi pada server']]) + call('Standalone untuk satu toko dan satu operator aktif. Tidak memakai server HTTP, payment gateway, atau integrasi marketplace. Versi GUI desktop dan versi web tidak dibangun dalam tutorial ini.'))
    content['project.html'][2] = ('scope', 'Tetapkan batas pekerjaan', cards([
        ('Termasuk', 'Menu terminal, master kategori/produk/pelanggan, stok awal, keranjang, checkout tunai, nota teks, laporan harian, penyimpanan SQLite, testing, dan dokumentasi.'),
        ('Di luar cakupan', 'GUI, aplikasi web, jaringan multi-user, autentikasi produksi, multi-cabang, pajak, diskon, retur, pembelian pemasok, dan pembayaran digital.')]) + call('Pemilik dan kasir adalah peran dalam analisis bisnis. Program latihan belum membatasi akses menu berdasarkan akun.'))
    content['teknis.html'] = [
        ('arsitektur', 'Arsitektur program C', '<p>Pisahkan menu, aturan bisnis, dan akses database. Program ini memakai C17, compiler GCC, standard library C, serta SQLite C API.</p>' + flow(['Terminal<br>menu & input', 'Fungsi C<br>validasi & checkout', 'SQLite C API<br>file database lokal']) + table(['Komponen', 'Teknologi', 'Tugas'], [
            ['Antarmuka', 'stdio.h; fgets', 'Baca baris input dan tampilkan menu/nota'], ['Model', 'struct, array, stdint.h', 'Representasi produk, keranjang, dan uang rupiah'], ['Aturan bisnis', 'Fungsi C terpisah', 'Validasi kuantitas, stok, dan pembayaran'], ['Penyimpanan', 'sqlite3.h + library SQLite', 'Prepared statement, foreign key, transaksi'], ['Testing', 'assert.h + database sementara', 'Unit fungsi dan integrasi database']]) + call('SQLite adalah pustaka tambahan, bukan bagian standard library C. Tidak ada proses server database terpisah. Header dan library harus cocok dengan compiler serta arsitektur yang digunakan.')),
        next(item for item in content['teknis.html'] if item[0] == 'atribut'),
        ('folder', 'Struktur folder project C', code('''kasirkita/
├── include/
│   ├── models.h        # Struct dan batas kapasitas
│   ├── input.h         # Deklarasi pembacaan input
│   ├── checkout.h      # Kontrak fungsi bisnis
│   └── repository.h    # Kontrak akses database
├── src/
│   ├── main.c          # Entry point dan loop menu
│   ├── input.c         # Parsing dan validasi input
│   ├── checkout.c      # Perhitungan dan transaksi
│   └── repository.c    # Implementasi SQLite C API
├── db/
│   ├── schema.sql      # Skema dan seed, dijalankan sekali
│   └── kasir.sqlite    # Database lokal
├── tests/
│   └── test_checkout.c # Unit test checkout
├── output/             # Nota teks dan laporan
├── build/              # Executable hasil kompilasi
└── docs/               # Probis, AP, testing, laporan''', 'Struktur target') + '<p>File <code>.h</code> berisi deklarasi dan include guard; file <code>.c</code> berisi implementasi. Jangan meng-include file .c. Abaikan <code>build/</code>, database pribadi, dan nota pengguna dalam version control.</p>'),
        ('setup', 'Langkah 1 · kompilasi program pertama', '<p>Periksa compiler dengan <code>gcc --version</code>. Buat folder <code>src</code>, <code>include</code>, <code>build</code>, <code>db</code>, <code>tests</code>, dan <code>output</code>. Simpan contoh berikut di src/main.c.</p>' + code('''#include <stdio.h>
#include <string.h>

int main(void) {
    char input[32];
    for (;;) {
        puts("\\nKasirKita — C17\\n1. Katalog\\n0. Keluar");
        if (fgets(input, sizeof input, stdin) == NULL) break;
        if (strchr(input, '\\n') == NULL && !feof(stdin)) {
            int ch;
            while ((ch = getchar()) != '\\n' && ch != EOF) {}
            puts("Input terlalu panjang.");
            continue;
        }
        input[strcspn(input, "\\r\\n")] = '\\0';
        if (strcmp(input, "0") == 0) break;
        if (strcmp(input, "1") == 0) puts("Katalog belum dihubungkan.");
        else puts("Pilih 0 atau 1.");
    }
    return 0;
}''', 'src/main.c · fondasi menu') + code('''gcc -std=c17 -Wall -Wextra -Wpedantic src/main.c -o build/kasirkita.exe
# Jalankan di PowerShell Windows:
.\\build\\kasirkita.exe
# Linux/macOS: gunakan output build/kasirkita, lalu ./build/kasirkita''', 'Terminal') + call('Contoh ini memverifikasi loop menu dan input; fitur katalog belum diimplementasikan. Tambahkan fitur satu per satu mengikuti langkah berikutnya. Jangan memakai gets atau fflush(stdin).')),
        ('model', 'Langkah 2 · struct dan validasi input', code('''#ifndef MODELS_H
#define MODELS_H
#define MAX_CART_ITEMS 100
typedef struct {
    int id_product;
    char sku[32];
    char name[128];
    int price; /* rupiah bulat */
    int stock;
} Product;
typedef struct {
    int id_product;
    int quantity;
} CartItem;
#endif''', 'include/models.h') + '<ol><li>Baca input dengan fgets. Tolak baris yang melebihi kapasitas, lalu buang sisanya hingga newline/EOF.</li><li>Ubah angka dengan atoi atau strtol: periksa minimal satu digit terbaca, dan tolak karakter sisa selain whitespace.</li><li>Batasi kuantitas &gt; 0, harga/stok &ge; 0, dan maksimum 100 produk berbeda dalam keranjang. Gabungkan ID produk yang sama.</li><li>Periksa overflow sebelum perkalian dan penjumlahan. Pakai int untuk rupiah, bukan float.</li><li>Salin teks dengan batas kapasitas dan pastikan terminator NUL. Jangan menerima nama kosong.</li></ol>'),
        ('database', 'Langkah 3 · sambungkan database', '<p>Simpan skema berikut sebagai <code>db/schema.sql</code>. Buat database baru dan jalankan skema satu kali menggunakan sqlite3_exec setelah membaca file SQL ke buffer bertanda NUL. Pada pembukaan berikutnya, jangan menjalankan seed ulang.</p>' + code(schema, 'db/schema.sql') + '<a class="pill" href="schema.sql" download>Unduh schema.sql ↓</a>' + code('''#include <stdio.h>
#include <sqlite3.h>

int main(void) {
    sqlite3 *db = NULL;
    if (sqlite3_open("db/kasir.sqlite", &db) != SQLITE_OK) {
        fprintf(stderr, "Gagal membuka database.\\n");
        sqlite3_close(db);
        return 1;
    }
    if (sqlite3_exec(db, "PRAGMA foreign_keys=ON;", NULL, NULL, NULL)
        != SQLITE_OK) {
        fprintf(stderr, "%s\\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }
    puts("Koneksi database siap; jalankan skema hanya pada database baru.");
    sqlite3_close(db);
    return 0;
}''', 'Contoh koneksi mandiri · coba sebagai src/db_demo.c') + code('''gcc -std=c17 -Wall -Wextra -Wpedantic src/db_demo.c -o build/db_demo.exe -lsqlite3''', 'Build dengan SQLite terpasang') + call('Perintah ini memerlukan sqlite3.h dan library dalam jalur pencarian compiler. Jika berada di folder khusus, tambahkan -I untuk header dan -L untuk library. Contoh koneksi berdiri sendiri; jangan menautkan dua file yang sama-sama mendefinisikan main.') + '<p>Query berparameter memakai <code>sqlite3_prepare_v2 → sqlite3_bind_* → sqlite3_step → sqlite3_finalize</code>. Gunakan SQLITE_TRANSIENT saat mengikat buffer teks sementara. Periksa semua kode hasil, tutup statement pada setiap jalur keluar, dan gunakan sqlite3_column_int untuk nilai uang.</p>'),
        ('fungsi', 'Langkah 4 · kontrak fungsi dan menu', table(['Menu / fungsi', 'Masukan', 'Hasil'], [
            ['Kelola kategori / category_add', 'Nama tidak kosong, unik', 'Kategori tersimpan atau pesan gagal'], ['Katalog / product_list', 'Nama atau SKU opsional', 'Daftar produk di terminal'], ['Produk / product_save', 'Kategori, SKU, nama, harga, stok', 'Tambah/edit; validasi dan FK dipenuhi'], ['Pelanggan / customer_add', 'Nama, telepon opsional', 'ID pelanggan; pembeli umum tanpa ID'], ['Keranjang / cart_add', 'ID produk dan jumlah', 'Item digabung; kapasitas tidak terlampaui'], ['Checkout / checkout_save', 'Array item, bayar, pelanggan opsional', 'ID nota, total, kembalian atau kode error'], ['Nota / receipt_show', 'ID penjualan', 'Header dan detail transaksi'], ['Laporan / report_daily', 'Tanggal lokal YYYY-MM-DD', 'Jumlah nota dan omzet']]) + '<p>Pisahkan status seperti OK, INVALID_INPUT, NOT_FOUND, INSUFFICIENT_STOCK, dan DB_ERROR. Fungsi bisnis mengembalikan status; main.c menentukan pesan serta menu berikutnya. Harga transaksi selalu dibaca dari database, bukan dari nilai sementara di keranjang.</p>'),
        ('checkout', 'Langkah 5 · transaksi checkout', '<ol><li>Validasi array keranjang, kapasitas, ID, jumlah, dan pembayaran. Mulai BEGIN IMMEDIATE; jika gagal, jangan lanjut.</li><li>Baca setiap produk dan harga terkini menggunakan prepared statement. Periksa stok serta overflow quantity × price dan akumulasi total.</li><li>Jika uang kurang, rollback. Jika pelanggan dipilih, pastikan ID valid; untuk pembeli umum bind NULL.</li><li>INSERT sales, ambil sqlite3_last_insert_rowid, lalu INSERT setiap sale_items dengan snapshot unit_price.</li><li>Kurangi stok dengan UPDATE products SET stock=stock-? WHERE id_product=? AND stock&gt;=?; sqlite3_changes harus 1.</li><li>Finalize statement, COMMIT, dan periksa keberhasilannya. Pada kegagalan sebelum commit sukses, rollback dan tampilkan error.</li><li>Tampilkan nota setelah commit sukses. Gagal ekspor nota tidak membatalkan transaksi; sediakan cetak ulang berdasarkan ID.</li></ol>' + call('Total denormalisasi dan detail disimpan dalam transaksi database yang sama. Jangan menyimpan nota baru atau mengurangi stok di luar transaksi. Skenario acuan: 2 × Rp12.000, bayar Rp30.000, kembali Rp6.000, stok 20 → 18.')),
        ('output', 'Langkah 6 · nota dan laporan', '<ol><li>Ambil nota berdasarkan ID; format angka int menggunakan penentu format %d.</li><li>Tampilkan nota di terminal. Untuk ekspor, buat output/nota-ID.txt dengan fopen, cek hasil fprintf serta fclose, lalu laporkan kegagalan jika ada.</li><li>Simpan waktu transaksi sebagai ISO-8601 UTC dari waktu sistem; periksa kegagalan fungsi waktu.</li><li>Untuk laporan Asia/Jakarta, ubah awal hari lokal menjadi UTC dengan offset +07:00. Akhir hari berikutnya menjadi batas eksklusif; tangani pergantian bulan/tahun.</li><li>Bind rentang timestamp pada query laporan berikut.</li></ol>' + code('''SELECT COUNT(*) AS jumlah_nota, COALESCE(SUM(total),0) AS omzet
FROM sales WHERE created_at >= ? AND created_at < ?;''', 'Query laporan harian') + checks(['Program berhasil dikompilasi tanpa warning.','Input salah tidak membuat program crash atau loop tanpa akhir.','Checkout menyimpan nota, detail, dan stok secara atomik.','Data tetap tersedia setelah program ditutup dan dibuka lagi.']))]

    # Selaraskan materi bisnis dan testing yang tetap relevan dengan implementasi C.
    replacements = {
        'browser': 'terminal', 'Browser': 'Terminal', 'server': 'program C',
        'endpoint': 'fungsi', 'API': 'fungsi C', 'route': 'fungsi',
        '200;': 'sukses;', '409;': 'INSUFFICIENT_STOCK;', '400;': 'INVALID_INPUT;', '500;': 'DB_ERROR;',
        'Nonaktifkan tombol bayar': 'Cegah checkout ulang',
        'Form dapat diakses; fokus jelas; nota tanpa navigasi': 'Menu terbaca; input valid; nota teks sesuai transaksi',
        'Lebar 360px; keyboard Tab; cetak nota': 'Masukkan huruf, baris terlalu panjang, EOF; ekspor nota',
        'kirim quantity 2 langsung ke fungsi C': 'panggil checkout dengan quantity 2',
        'node:test': 'assert.h', 'npm test': 'executable pengujian', 'npm start': 'executable kasir',
        'Node.js / Express / SQLite': 'GCC / C17 / SQLite',
        'README menjelaskan instalasi, seed, executable kasir, dan executable pengujian.': 'README menjelaskan compiler, dependensi SQLite, seed, build, dan cara menjalankan test.',
        'tombol cetak': 'ekspor nota teks', 'Cetak nota melalui dialog cetak terminal': 'Ekspor nota sebagai file teks',
    }
    for page in ['analisis.html', 'testing.html']:
        content[page] = [(a,h,replace_all(b,replacements)) for a,h,b in content[page]]
    content['testing.html'][0] = ('strategi', 'Uji program C dari input hingga file', '<p>Gunakan database sementara terpisah untuk setiap kasus. Uji fungsi perhitungan terlebih dahulu, kemudian integrasi SQLite, dan terakhir menu terminal. Kasus di bawah adalah rencana, belum hasil pengujian aplikasi pembaca.</p>' + cards([('Unit', 'assert.h untuk validasi angka, perhitungan rupiah, overflow, serta batas array.'), ('Integrasi & manual', 'Rollback SQLite, persistensi setelah restart, menu terminal, dan kegagalan ekspor file.')]) + call('Build dengan -Wall -Wextra -Wpedantic. Bila toolchain mendukung, gunakan AddressSanitizer dan UndefinedBehaviorSanitizer pada build pengujian untuk membantu menemukan akses memori salah.'))
    a,h,b = content['testing.html'][1]
    b = b.split('<h3>Cara menjalankan</h3>')[0]
    content['testing.html'][1] = (a,h,b + '<h3>Cara menjalankan</h3><ol><li>Siapkan database sementara dengan seed baru; jangan memakai data transaksi nyata.</li><li>Kompilasi tests/test_checkout.c bersama modul yang diuji tanpa src/main.c. Tautkan SQLite jika test memakai repository.</li><li>Jalankan executable test; semua assert harus lolos dan proses berakhir dengan kode 0.</li><li>Jalankan program kasir untuk skenario menu manual; catat hasil aktual dan file bukti.</li><li>Uji input panjang, EOF, ID tidak ada, overflow, database terkunci, serta folder output yang tidak dapat ditulis.</li></ol>' + code('''gcc -std=c17 -Wall -Wextra -Wpedantic -Iinclude tests/test_checkout.c src/checkout.c src/repository.c -o build/test_checkout.exe -lsqlite3
.\\build\\test_checkout.exe''', 'Contoh build test setelah modul selesai'))
    a,h,b = content['testing.html'][3]
    content['testing.html'][3] = (a,h,b.replace('kontrak fungsi C', 'kontrak fungsi').replace('fungsi C, aturan transaksi', 'fungsi C, aturan transaksi').replace('contoh payload', 'contoh input terminal'))

def replace_all(text, mapping):
    for old,new in mapping.items(): text=text.replace(old,new)
    return text
