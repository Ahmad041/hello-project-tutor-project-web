"""Materi penyimpanan TXT untuk aplikasi C17 standalone."""
def adapt_txt(content, table, code, cards, call, checks, flow, entities, fields):
    def put(page, anchor, heading, body):
        items=content[page]
        for i,item in enumerate(items):
            if item[0]==anchor:
                items[i]=(anchor,heading,body)
                return
        items.append((anchor,heading,body))

    for page in content:
        content[page]=[(a,h,b.replace('database SQLite','file data TXT').replace('SQLite lokal melalui API C','File TXT lokal melalui stdio.h').replace('penyimpanan SQLite','penyimpanan TXT').replace('mendesain database','mendesain format file').replace('serta library dan header SQLite','tanpa library database tambahan')) for a,h,b in content[page]]
    put('analisis.html','probis','Proses bisnis penjualan',
        '<p>Kasir memilih produk, memasukkan jumlah, dan menerima uang tunai. Program memvalidasi input, menyiapkan perubahan di memori, lalu menyimpan satu snapshot data lengkap.</p>'
        + flow(['Pilih produk<br>& pembayaran','Stok dan uang<br>cukup?','Siapkan salinan<br>data di memori','Simpan snapshot<br>data.txt','Tampilkan nota'])
        + call('Jika stok/uang tidak cukup → kembali ke input. Jika penulisan gagal → jangan nyatakan penjualan berhasil; pertahankan versi data sebelumnya. Jika file utama tidak dapat dipulihkan, hentikan transaksi dan gunakan prosedur pemulihan.'))
    put('analisis.html','normalisasi','PDM · normalisasi hingga 3NF',
        '<p>ERD dan normalisasi tetap digunakan untuk merancang hubungan data meskipun program tidak memakai database SQL. Model fisik di bawah memetakan entitas ke jenis record dalam file teks.</p>'
        + table(['Tahap','Perubahan','Tujuan'],[['1NF','Pisahkan daftar item nota menjadi record ITEM','Satu nilai per field'],['2NF','Pisahkan header SALE dan master PRODUCT','Atribut bergantung pada kunci record'],['3NF','Pisahkan CATEGORY dan CUSTOMER','Nama kategori/pelanggan tidak diulang pada master/transaksi lain']])
        + entities([('CATEGORY','PK id_category : int\nname : char[64]'),('PRODUCT','PK id_product : int\nREF id_category\nsku : char[32]\nname : char[128]\nprice, stock : int'),('CUSTOMER','PK id_customer : int\nname : char[128]\nphone : char[32]'),('SALE','PK id_sale : int\nREF id_customer (0 = umum)\ncreated_at : char[20]\npaid : int'),('ITEM','PK id_sale + id_product\nREF id_sale, id_product\nquantity : int\nunit_price : int')], 'CATEGORY 1 → N PRODUCT · CUSTOMER 0..1 ← N SALE<br>SALE 1 → N ITEM · PRODUCT 1 → N ITEM')
        + call('PK = identitas unik; REF = referensi antar-record. File TXT tidak menegakkan constraint otomatis. Program C harus memeriksa keunikan ID, referensi, dan rentang angka saat membaca maupun menyimpan.'))
    put('analisis.html','denormalisasi','Denormalisasi yang terkontrol',
        '<p>Tambahkan <code>total</code> pada record SALE untuk menyimpan hasil penjumlahan quantity × unit_price. Nilainya diperiksa ulang saat file dibaca. Kembalian dihitung dari paid − total dan tidak disimpan.</p>'
        + flow(['ITEM<br>quantity × unit_price','Jumlahkan per sale_id','SALE.total<br>nilai tersimpan'])
        + call('unit_price menyimpan harga saat transaksi, sehingga nota lama tidak berubah saat harga master diedit. Seluruh record disimpan dalam satu data.txt untuk menghindari ketidaksesuaian akibat memperbarui beberapa file secara terpisah.'))
    put('analisis.html','dfd','DFD · aliran data',
        '<h3>Level 0 — konteks</h3>' + flow(['Kasir<br>item & pembayaran →','0. KasirKita C<br>← nota / pesan gagal','Pemilik<br>master →; ← laporan'])
        + '<h3>Level 1 — proses dan penyimpanan</h3>' + table(['Proses','Aliran data','Penyimpanan logis'],[['1.0 Kelola master','Pemilik → kategori/produk/pelanggan → validasi → konfirmasi','D1: record CATEGORY, PRODUCT, CUSTOMER'],['2.0 Penjualan','Kasir → keranjang & bayar; baca D1 → nota; ubah stok','D1 dan D2: SALE, ITEM'],['3.0 Laporan','Pemilik → tanggal; baca D2 → jumlah nota & omzet','D2: hanya baca']]) + call('D1 dan D2 berada dalam file fisik data/data.txt yang sama. File nota dalam output/ adalah hasil ekspor; bukan sumber data utama.'))
    put('analisis.html','fitur','Fitur & kriteria selesai',table(['Fitur','Kriteria penerimaan'],[['Master','Tambah/edit kategori, produk, pelanggan; tolak ID/SKU ganda dan referensi tidak ada'],['Keranjang','Tambah/ubah/hapus; gabungkan produk sama; tolak jumlah tidak valid'],['Checkout','Stok dan uang cukup; simpan sebelum mengonfirmasi sukses'],['Nota','Nomor, waktu, item, total, bayar, kembali; tampilkan dan ekspor TXT'],['Laporan','Filter tanggal; jumlah nota dan omzet benar'],['Persistensi','Muat ulang data setelah restart; tolak file rusak tanpa menimpanya']])+checks(['Saya memahami relasi record TXT.','Saya dapat membedakan file data utama, file sementara, dan backup.','Harga transaksi dan total tidak berubah ketika master diedit.']))

    put('teknis.html','arsitektur','Arsitektur program C dan TXT', '<p>Project memakai <strong>C17</strong>, compiler GCC, dan standard library C. Antarmuka berupa menu terminal. Data disimpan di <strong>data/data.txt</strong>; tidak membutuhkan server atau library database.</p>'+flow(['Terminal<br>fgets & printf','Fungsi C<br>struct & validasi','stdio.h<br>data/data.txt'])+table(['Bagian','Pilihan','Tugas'],[['Antarmuka','stdio.h','Menu, input baris, nota'],['Model','struct, array, int','Master dan transaksi di memori'],['Penyimpanan','fopen, fgets, fprintf, fclose','Baca dan tulis record teks'],['Build / launcher','build.bat, run.bat','Perintah Windows untuk compile/jalankan .exe'],['Testing','assert.h + fixture TXT','Validasi fungsi, format file, dan pemulihan']])+call('<strong>.txt menyimpan data; .bat menjalankan perintah.</strong> Jangan memasukkan data produk atau pelanggan sebagai perintah batch. Tutorial menggunakan satu proses aplikasi aktif dan data berukuran kecil.'))
    sizes={'sku':'char[32]','name':'char[128]','phone':'char[32]','created_at':'char[20]'}
    rows={
        'CATEGORY':[('id_category','int','Unik; > 0','1'),('name','char[64]','Tidak kosong; unik','ATK')],
        'PRODUCT':[('id_product','int','Unik; > 0','1'),('id_category','int','Referensi CATEGORY','1'),('sku','char[32]','Unik; tidak kosong','P001'),('name','char[128]','Tidak kosong','Buku A5'),('price','int','Rupiah bulat; ≥ 0','12000'),('stock','int','≥ 0','20')],
        'CUSTOMER':[('id_customer','int','Unik; > 0','1'),('name','char[128]','Tidak kosong','Rani'),('phone','char[32]','Opsional; token - berarti kosong','-')],
        'SALE':[('id_sale','int','Unik; > 0','1'),('id_customer','int','0 = pembeli umum; selain itu harus ada','1'),('created_at','char[20]','YYYY-MM-DDTHH:MM:SS; Asia/Jakarta','2026-10-01T10:00:00'),('paid','int','≥ total','30000'),('total','int','Jumlah detail; ≥ 0','24000')],
        'ITEM':[('id_sale','int','Referensi SALE; bagian kunci gabungan','1'),('id_product','int','Referensi PRODUCT; bagian kunci gabungan','1'),('quantity','int','> 0','2'),('unit_price','int','Snapshot rupiah; ≥ 0','12000')]
    }
    put('teknis.html','atribut','Kamus data · atribut record TXT','<p><strong>Panduan tipe data C:</strong> <code>int</code> untuk bilangan bulat; <code>char</code> untuk satu karakter; string disimpan sebagai <code>char[]</code>; <code>float</code> dan <code>double</code> untuk bilangan pecahan. C tidak memiliki tipe bawaan bernama <code>string</code>.</p><p>Project ini memakai <code>int</code> untuk bilangan bulat sederhana agar mudah dipahami pemula tanpa memerlukan library integer 64-bit yang rumit. Di diagram ditulis <strong>integer</strong> agar mudah dibaca. Harga dan total memakai bilangan bulat rupiah <code>int</code>, bukan float, agar tidak terkena pembulatan pecahan. Nomor telepon memakai string agar angka nol di depan tetap tersimpan.</p><p>Field diserialisasi sebagai teks; tipe berikut adalah representasi dalam C. Kapasitas char mencakup terminator NUL dan dihitung dalam byte, bukan jumlah karakter Unicode. Tolak delimiter | dan newline di dalam input teks.</p>'+''.join('<h3>'+name+'</h3>'+table(['Field','Tipe data / C','Aturan','Contoh'],[(field, ('Integer / int' if typ == 'int' else 'String / '+typ), rule, example) for field,typ,rule,example in r]) for name,r in rows.items())+call('Metadata format: baris pertama KASIRKITA|1 (versi format); baris terakhir END|N dengan N jumlah record CATEGORY/PRODUCT/CUSTOMER/SALE/ITEM. Batas latihan: 100 kategori, 1.000 produk, 1.000 pelanggan, 1.000 nota, 10.000 item. Tolak file yang melampaui kapasitas.'))

    put('teknis.html','folder','Struktur folder project C', code('''kasirkita/
├── include/             # Deklarasi fungsi dan struct (.h)
│   ├── models.h
│   ├── storage.h
│   └── checkout.h
├── src/                 # Implementasi (.c)
│   ├── main.c           # Loop menu terminal
│   ├── input.c          # Parsing dan validasi
│   ├── storage.c        # Baca/tulis snapshot TXT
│   └── checkout.c       # Perhitungan dan penjualan
├── data/
│   ├── data.txt         # Sumber data utama
│   ├── data.tmp         # Kandidat snapshot, bukan data aktif
│   └── data.bak         # Versi sebelumnya untuk pemulihan
├── output/              # Ekspor nota-ID.txt dan laporan.txt
├── tests/               # Unit test dan fixture TXT
├── build/               # Executable hasil compile
├── docs/                # Probis, AP, testing, laporan
├── build.bat            # Compile program di Windows
└── run.bat              # Jalankan dari direktori project''','Struktur target')+'<p>File .h memakai include guard. Jangan meng-include .c atau menyimpan pointer mentah ke file. Simpan data dengan format teks eksplisit agar dapat dibaca kembali lintas sesi.</p>')
    snapshot='''KASIRKITA|1
CATEGORY|1|ATK
PRODUCT|1|1|P001|Buku A5|12000|18
CUSTOMER|1|Rani|-
SALE|1|1|2026-10-01T10:00:00|30000|24000
ITEM|1|1|2|12000
END|5'''
    put('teknis.html','database','Langkah 3 · format penyimpanan TXT','<p>Satu baris adalah satu record; pemisah field berupa <code>|</code>. Urutan field mengikuti kamus data. Contoh ini adalah kondisi <strong>setelah</strong> penjualan dua buku; stok sudah 18.</p>'+code(snapshot,'data/data.txt · contoh format')+'<ol><li>Buka dengan fopen(path, "r"). File belum ada pada penggunaan pertama memerlukan inisialisasi eksplisit; file gagal dibuka karena izin bukan berarti data kosong.</li><li>Baca dengan fgets ke buffer 512 byte. Deteksi baris terpotong, bersihkan CR/LF, dan periksa header versi.</li><li>Pisahkan token, validasi jumlah field dan tipe record. Parse angka dengan strtoll dan pemeriksaan range/karakter sisa. Tidak ada field kosong: telepon kosong memakai -.</li><li>Muat ke struktur sementara yang dialokasikan di heap. Periksa kapasitas sebelum menambah elemen; jangan menaruh array transaksi besar di stack.</li><li>Sesudah semua baris terbaca, cek ferror dan fclose, END|N, tidak ada data setelah END, ID unik, referensi, total detail, stok, dan pembayaran.</li><li>Jika valid, aktifkan data di memori. Jika rusak, tampilkan nomor baris/alasan dan jangan menulis balik file tersebut.</li></ol>'+call('Seed awal tanpa penjualan: gunakan stok 20, hapus baris SALE dan ITEM, lalu ubah penutup menjadi END|3. ID baru dihitung dari maksimum ID aktif + 1, dengan pemeriksaan overflow.'))
    put('teknis.html','fungsi','Langkah 4 · kontrak fungsi program',table(['Fungsi','Tugas','Hasil'],[['load_data(path, out)','Parse ke struktur sementara dan validasi relasi','OK atau INVALID_FILE / IO_ERROR'],['product_save(state, product)','Validasi ID/kategori/SKU/harga/stok','Kandidat perubahan master'],['cart_add(cart, id, qty)','Gabungkan ID sama; cek batas dan overflow','Keranjang diperbarui'],['checkout_prepare(current, cart, paid, candidate)','Hitung dari harga master; salin state; kurangi stok kandidat','Kandidat penjualan atau error'],['save_data(path, candidate)','Tulis file sementara, validasi, backup, ganti file aktif','OK atau IO_ERROR / RECOVERY_REQUIRED'],['receipt_export(state, sale_id)','Ekspor nota transaksi yang sudah tersimpan','OK atau IO_ERROR; tidak membuat transaksi baru'],['report_daily(state, date)','Loop SALE; jumlahkan pada tanggal yang dipilih','Jumlah nota dan omzet']])+call('Mutasi master dan penjualan sama-sama melalui save_data. Jangan mengubah state aktif sebelum simpan berhasil. Semua alokasi memori harus diperiksa dan dibebaskan pada setiap jalur keluar.'))
    put('teknis.html','checkout','Langkah 5 · checkout dan penyimpanan aman','<ol><li>Validasi keranjang, pelanggan, stok, uang, dan overflow. Buat salinan state di heap, tambahkan SALE/ITEM, lalu kurangi stok pada salinan.</li><li>Tulis seluruh kandidat ke data/data.tmp menggunakan fopen(..., "w"). Periksa setiap fprintf, fflush, dan fclose; hasil gagal tidak boleh dilanjutkan sebagai sukses.</li><li>Baca ulang .tmp menggunakan parser yang sama dan pastikan seluruh relasi/total valid.</li><li>Jika data utama sudah ada dan valid, siapkan ruang untuk backup lama, kemudian rename data.txt menjadi data.bak. Periksa tiap operasi. Jangan menghapus satu-satunya salinan valid.</li><li>Rename data.tmp menjadi data.txt. Bila gagal setelah backup dibuat, coba kembalikan data.bak. Bila pemulihan gagal, hentikan perubahan dan tampilkan lokasi backup.</li><li>Setelah penggantian sukses, gunakan kandidat sebagai state aktif dan tampilkan nota. Jika ekspor nota gagal, transaksi tetap tersimpan dan nota dapat diekspor ulang.</li></ol>'+call('Ini pola pemulihan sederhana untuk satu proses, bukan jaminan transaksi atomik atau ketahanan mati listrik. C standard library tidak menjamin flush fisik ke disk; dua operasi rename menyisakan celah saat file utama belum ada. Jangan menjalankan dua instance bersamaan.')+'<h3>Pemulihan saat startup</h3><p>Jika data.txt valid, gunakan file itu. Jika hilang/rusak, hentikan transaksi dan tawarkan pemulihan dari data.bak yang telah lolos validasi; jangan mengganti data otomatis. data.tmp bukan bukti bahwa transaksi berhasil, sehingga tidak diaktifkan otomatis.</p>')
    put('teknis.html','output','Langkah 6 · nota, laporan, dan file BAT','<p>Simpan waktu lokal dengan format YYYY-MM-DDTHH:MM:SS menggunakan time, localtime, dan strftime; periksa hasilnya. Komputer tutorial disetel ke Asia/Jakarta. Filter laporan dengan 10 karakter tanggal setelah tanggal divalidasi. Simpan waktu transaksi lama tanpa mengubahnya.</p><p>Nota berasal dari SALE dan ITEM, bukan harga master terkini. Gunakan inttypes.h / PRId64 untuk menulis uang. Periksa fopen, fprintf, dan fclose saat ekspor.</p>'+code('''@echo off
cd /d "%~dp0"
if not exist build mkdir build
gcc -std=c17 -Wall -Wextra -Wpedantic -Iinclude src/main.c src/input.c src/storage.c src/checkout.c -o build/kasirkita.exe
if errorlevel 1 exit /b 1
echo Build berhasil.''','build.bat · setelah semua modul dibuat')+code('''@echo off
cd /d "%~dp0"
if not exist build\kasirkita.exe (
  echo Jalankan build.bat terlebih dahulu.
  exit /b 1
)
build\kasirkita.exe''','run.bat')+checks(['Program C berhasil dikompilasi.','File TXT dapat dimuat setelah restart.','File rusak ditolak tanpa ditimpa.','Simpan gagal tidak ditampilkan sebagai checkout sukses.']))
    content['testing.html']=[
        ('strategi','Uji program C dan file TXT','<p>Gunakan folder data sementara dan fixture yang disalin untuk setiap kasus. Pengujian tidak boleh mengubah data pengguna. Semua skenario berikut adalah rencana; belum merupakan hasil uji aplikasi yang dibangun pembaca.</p>'+cards([('Unit','Validasi input, hitungan uang, overflow, batas array, dan parser record.'),('Integrasi','Baca/tulis TXT, simpan gagal, backup, startup recovery, dan ekspor nota.')])+call('Aktifkan -Wall -Wextra -Wpedantic. Gunakan assert.h; bila compiler mendukung, jalankan build test dengan AddressSanitizer/UndefinedBehaviorSanitizer.')),
        ('kasus','Matriks kasus pengujian',table(['ID','Skenario','Hasil yang diharapkan'],[
            ['T01','Seed stok 20; beli 2 @12.000; bayar 30.000','Total 24.000; kembali 6.000; stok 18; data tetap benar setelah restart'],['T02','Stok 1; beli 2','Ditolak; file dan state aktif tidak berubah'],['T03','Qty 0/-1/1.5/huruf; EOF; input > kapasitas','Ditolak atau keluar terkontrol; tidak crash'],['T04','Bayar kurang dari total','Ditolak; tidak ada nota baru'],['T05','Gagalkan tulis/close file sementara melalui stub I/O','IO_ERROR; data utama dan state aktif tetap'],['T06','Gagalkan rename setelah backup dibuat','Coba pulihkan backup; jika gagal hentikan transaksi dan laporkan RECOVERY_REQUIRED'],['T07','Ubah harga master setelah T01','Nota lama tetap memakai harga 12.000'],['T08','File terpotong, header salah, ID ganda, referensi hilang','INVALID_FILE dengan alasan; file tidak ditimpa'],['T09','Tanggal 30/09 dan 01/10; filter 01/10','Hanya nota 01/10 yang dihitung'],['T10','Folder output tidak dapat ditulis','Ekspor gagal dilaporkan; transaksi tersimpan tidak diulang'],['T11','Qty/harga sangat besar; jumlah item melampaui batas','Overflow/kapasitas ditolak sebelum modifikasi'],['T12','File utama hilang; backup valid; tmp tersisa','Minta pemulihan backup; tmp tidak diaktifkan otomatis']])+'<h3>Cara menjalankan</h3><ol><li>Buat fixture data awal dan salin ke folder test terpisah.</li><li>Kompilasi test bersama modul input, storage, dan checkout; jangan sertakan main.c aplikasi.</li><li>Jalankan test assert; kode keluar harus 0. Jangan menambahkan -DNDEBUG pada build test.</li><li>Uji menu secara manual dan cocokkan file setelah restart.</li><li>Catat hasil aktual, bukti, bug, serta hasil uji ulang.</li></ol>'+code('''gcc -std=c17 -Wall -Wextra -Wpedantic -Iinclude tests/test_checkout.c src/input.c src/storage.c src/checkout.c -o build/test_checkout.exe
.\\build\\test_checkout.exe''','Build test setelah implementasi modul')),
        ('bukti','Audit konsistensi file','<ol><li>Cocokkan END|N dengan jumlah record yang dibaca.</li><li>Pastikan ID master/nota unik dan setiap referensi menunjuk record yang ada.</li><li>Pastikan setiap SALE memiliki minimal satu ITEM; pasangan sale_id/product_id unik.</li><li>Hitung ulang total detail dengan pemeriksaan overflow; cocokkan SALE.total dan paid ≥ total.</li><li>Pastikan stok ≥ 0 dan quantity &gt; 0.</li><li>Bandingkan salinan file utama sebelum/sesudah uji gagal; pastikan tidak ada penjualan parsial.</li></ol>'+call('Penanda END mendeteksi beberapa bentuk pemotongan, bukan checksum atau perlindungan terhadap semua perubahan file. Skenario kerusakan dan pemulihan tetap wajib diuji.')),
        ('laporan','Format laporan project C',table(['Bab','Isi wajib'],[['Identitas','Penulis, judul, tanggal, versi, riwayat perubahan'],['1. Definisi','Masalah, tujuan, desktop vs web, standalone, scope, master/transaksi'],['2. Probis','Flowchart, ERD awal, normalisasi, PDM record TXT, DFD, fitur'],['3. Activity Plan & implementasi','Rencana kegiatan, modul C, struct/atribut, format TXT, file .h/.c, build.bat dan run.bat'],['4. Testing','Compiler/OS, fixture, langkah, ekspektasi, aktual, status, bukti'],['5. Kesimpulan','Hasil aktual, batas satu proses, batas pemulihan, perbaikan berikutnya'],['Lampiran','Kode C, file TXT contoh nonpribadi, petunjuk build dan pemulihan']])+code('''# Laporan KasirKita C
Penulis: [...] | Versi: [...] | Tanggal: [...]
## Lingkungan
OS: [...] | GCC: [...] | Standar: C17 | Zona waktu: Asia/Jakarta
## Build dan jalankan
Perintah: [...] | Hasil compile: [...] | Peringatan: [...]
## Format data
Versi: KASIRKITA|1 | File: data/data.txt
## Hasil pengujian
| ID | Fixture | Langkah | Ekspektasi | Aktual | Status | Bukti |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | stok 20 | beli 2, bayar 30000 | stok 18, kembali 6000 | ... | Belum diuji | ... |
## Defect
ID: [...] | Keparahan: [...] | Reproduksi: [...]
Perbaikan dan uji ulang: [...]
## Kesimpulan
Fitur selesai: [...] | Keterbatasan dan bug terbuka: [...]''','Template laporan')),
        ('selesai','Checklist penyerahan',checks(['Source .c dan .h dapat dikompilasi dari folder baru.','README menjelaskan build.bat/run.bat dan format TXT.','Kasus uang, stok, file rusak, dan simpan gagal lulus dengan bukti.','Diagram dan atribut sesuai implementasi.','File contoh tidak berisi data pribadi.','Batas pemulihan dan satu proses dijelaskan dalam laporan.']))
    ]
