from pathlib import Path
from html import escape
import json
from urllib.parse import urlsplit, quote

ROOT = Path(__file__).resolve().parent
VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4'
CONTENTS_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4'
POSTER = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg'
from curriculum import PAGES, DESCRIPTIONS, adapt_curriculum
pages = PAGES
script = '''const storage={get(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const video=document.querySelector('video'), toggle=document.querySelector('.video-toggle');
let userManuallyPaused=false;
if(video){
  video.muted=true;video.defaultMuted=true;video.playsInline=true;
  video.play().catch(()=>{});
  function videoLabel(){
    if(!toggle)return;
    toggle.textContent=video.paused?'▷':'Ⅱ';
    toggle.setAttribute('aria-label',video.paused?'Putar latar video':'Jeda latar video');
  }
  video.addEventListener('play',videoLabel);
  video.addEventListener('pause',videoLabel);
  videoLabel();
  if(toggle){
    toggle.addEventListener('click',()=>{
      if(video.paused){
        userManuallyPaused=false;
        video.play().catch(()=>{});
      }else{
        userManuallyPaused=true;
        video.pause();
      }
    });
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      video.pause();
    }else if(!userManuallyPaused){
      video.play().catch(()=>{});
    }
  });
}
const page=document.body.dataset.page;const completed=storage.get('kasirkita-completed');document.querySelectorAll('[data-progress]').forEach(e=>e.textContent=completed.length+' dari 4 modul selesai');document.querySelectorAll('.track i').forEach(e=>e.style.width=completed.length/4*100+'%');
const done=document.querySelector('.complete');function renderDone(){if(done){const yes=completed.includes(page);done.classList.toggle('done',yes);done.textContent=yes?'✓ Modul selesai — batalkan':'Tandai modul selesai  ✓';done.setAttribute('aria-pressed',yes)}}renderDone();if(done)done.onclick=()=>{const i=completed.indexOf(page);if(i<0)completed.push(page);else completed.splice(i,1);storage.set('kasirkita-completed',completed);renderDone();document.querySelectorAll('[data-progress]').forEach(e=>e.textContent=completed.length+' dari 4 modul selesai');document.querySelectorAll('.track i').forEach(e=>e.style.width=completed.length/4*100+'%')};
document.querySelectorAll('.checklist input').forEach((el,i)=>{const key=page+'-checks';el.checked=storage.get(key).includes(i);el.onchange=()=>{let v=storage.get(key).filter(x=>x!==i);if(el.checked)v.push(i);storage.set(key,v)}});
document.querySelectorAll('.copy').forEach(b=>{const label=b.textContent;b.onclick=async()=>{try{await navigator.clipboard.writeText(b.parentElement.nextElementSibling.textContent);b.textContent='Tersalin ✓'}catch{b.textContent='Pilih kode untuk menyalin'}setTimeout(()=>b.textContent=label,2200)}});'''
def table(head, rows):
    return '<div class="table-wrap"><table><thead><tr>'+''.join('<th>'+x+'</th>' for x in head)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+x+'</td>' for x in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def code(s, name='Contoh implementasi'):
    return '<div class="codebar"><span>'+name+'</span><button class="copy">Salin kode</button></div><pre><code>'+escape(s.strip())+'</code></pre>'
def cards(items):
    return '<div class="cards">'+''.join('<div class="card"><h3>'+a+'</h3><p>'+b+'</p></div>' for a,b in items)+'</div>'
def call(s): return '<div class="callout">'+s+'</div>'
def checks(items): return '<div class="checklist">'+''.join('<label><input type="checkbox"><span>'+x+'</span></label>' for x in items)+'</div>'
def flow(items): return '<div class="diagram"><div class="flow">'+ '<span class="connector">→</span>'.join('<div class="node'+(' gold' if i==len(items)-1 else '')+'">'+x+'</div>' for i,x in enumerate(items))+'</div></div>'
def entities(items,rel): return '<div class="diagram"><div class="entities">'+''.join('<div class="entity"><b>'+a+'</b><span>'+b.replace('\n','<br>')+'</span></div>' for a,b in items)+'</div><div class="relations">'+rel+'</div></div>'
def header(active, brand_only=False):
    if brand_only:
        return header(active).split('<input class="navtoggle"', 1)[0] + "</header>"
    navigation = [('index.html','Beranda'),('project.html','Persiapan'),('analisis.html','Dokumen After'),('daftarModul.html','Modul'),('dokumentasi-lib.html','Dokumentasi lib.h')]
    return '''<a class="skip" href="#main">Lewati navigasi</a><header class="bar"><a class="brand" href="index.html" aria-label="Hello Project beranda"><svg viewBox="0 0 23 17" aria-hidden="true"><path d="M8.15 .9H4.55L.5 9.3h3.6Z"/><path d="M17 0h-3.6L6.15 16.4h3.6Z"/><path d="M22.9 0h-3.6L15 7.6h3.6Z"/><path d="M22.6 6.9H19l-4.95 9.5h3.6Z"/></svg>Hello Project</a><input class="navtoggle" type="checkbox" id="nav-open" aria-label="Buka menu navigasi"><label class="burger" for="nav-open" aria-hidden="true">☰</label><div class="navpanel"><nav class="menu" aria-label="Navigasi utama">'''+''.join(f'<a href="{url}" '+('class="active" aria-current="page"' if active==url else '')+f'>{label}</a>' for url,label in navigation)+'''</nav><a class="pill" href="daftarModul.html">Mulai belajar <span aria-hidden="true">↗</span></a></div></header>'''
def shell(body,active='index.html',title='Dari ide, jadi aplikasi.',home=False):
    return '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="description" content="Tutorial KasirKita: bangun aplikasi kasir desktop IntelliJ dengan file processing dari dokumen persiapan hingga lib.h dan UI ASCII art."><title>'+title+' — Hello Project</title><link rel="stylesheet" href="assets/css/site.css?v=20261016-clean"></head><body class="'+('home' if home else 'docs')+'" data-page="'+active+'"><video class="art" autoplay muted loop playsinline preload="metadata" aria-hidden="true" poster="'+POSTER+'" src="'+VIDEO+'"></video><div class="veil"></div>'+header(active, brand_only=True)+body+'<button class="video-toggle" aria-label="Jeda latar video">Ⅱ</button><footer class="foot"><span>Hello Project <span class="footer-tagline">/ Belajar dengan membangun.</span></span><span>PROJECT GUIDE · VOL. 01 &nbsp; © 2026</span></footer><script>'+script+'</script></body></html>'

home='''<main class="hero" id="main"><div class="eyebrow"><span class="dot"></span> IDE NYATA. LANGKAH TERARAH.</div><h1>Dari ide, jadi aplikasi.<br><span>Satu langkah lebih dekat.</span></h1><p>Bangun aplikasi kasir pertamamu dari nol.<br>Dari membuat dokumen sampai merangkai UI ASCII art.</p><a class="cta" href="daftarModul.html">Mulai perjalananmu <span class="arrow" aria-hidden="true">→</span></a><div class="meta"><span>4 modul terstruktur</span><span>Untuk pemula</span><span>Belajar mandiri</span></div><ul class="feats">'''+''.join(f'<li><a href="{u}"><b aria-hidden="true">›</b>{t}</a></li>' for u,t in [('daftarisi.html','Definisi & Activity Plan'),('daftarisi-2.html','Dokumen desain & laporan'),('daftarisi-3.html','Kenali lib.h'),('daftarisi-4.html','Buat UI ASCII art')])+'''</ul><span class="rule" aria-hidden="true"></span></main>'''
home = home[:home.index('<ul class="feats">')] + '</main>'
home += '<script src="assets/js/opening.js" defer></script>'
(ROOT/'index.html').write_text(shell(home,home=True),encoding='utf-8')
content={}
content['project.html']=[
('kenalan','Kenali project-mu', '<p><strong>KasirKita</strong> adalah aplikasi point of sale desktop untuk toko alat tulis yang dibangun menggunakan <strong>IntelliJ IDEA</strong> dengan penyimpanan <strong>file processing (.txt)</strong>. Pemilik mengelola katalog dan stok, sementara kasir mencatat penjualan tunai. Hasil akhirnya adalah program desktop console mandiri dengan pencetakan nota dan laporan penjualan harian.</p>'+cards([('Masalah yang diselesaikan','Pencatatan manual membuat stok sulit dipercaya dan penjumlahan nota rentan salah.'),('Hasil yang akan dibangun','Kasir memilih produk, menerima pembayaran, mencetak nota, dan melihat stok berkurang secara otomatis pada berkas data.')])+call('<strong>Prasyarat:</strong> sediakan IDE IntelliJ IDEA, compiler C/C++ atau JDK, pemahaman dasar logika pemrograman, operasi file processing (baca/tulis teks terstruktur), serta console Windows. Estimasi belajar 8–12 jam, bergantung pengalaman.')),
('platform','Mengapa Desktop & File Processing?',table(['Aspek','Desktop + File Processing (IntelliJ)','Web & Database Server'],[['Akses','Dijalankan langsung di komputer kasir toko via terminal / IntelliJ','Dibuka melalui browser; memerlukan web server lokal/cloud'],['Penyimpanan','Berkas lokal terstruktur (.txt): katalog.txt, penjualan.txt','Database server (memerlukan instalasi SQL/DBMS terpisah)'],['Konektivitas','100% offline; mandiri tanpa internet atau server eksternal','Bergantung jaringan lokal/internet ke server database'],['Keandalan','Cepat, ringan, portabel, tanpa dependensi server luar','Perlu pemeliharaan port, koneksi jaringan, dan service database'],['Pencetakan','Cetak nota langsung ke printer POS atau preview console','Melalui dialog cetak browser']])+call('Project ini <strong>standalone</strong>: beroperasi mandiri di komputer kasir tanpa ketergantungan server luar. Semua data transaksi dicatat secara persisten ke dalam berkas teks lokal.')),
('scope','Tetapkan batas pekerjaan',cards([('Termasuk dalam tutorial','Katalog produk dan kategori; pelanggan opsional; stok awal; keranjang; checkout tunai; nota; laporan harian; pemrosesan file teks; pengujian dan dokumentasi.'),('Di luar cakupan','Multi-cabang, pajak, diskon, retur, pembelian ke pemasok, sinkronisasi cloud, pembayaran digital, serta sistem autentikasi bertingkat.')])+call('Aplikasi dijalankan langsung di lingkungan lokal komputer. Peran pemilik/kasir menjelaskan alur proses bisnis aplikasi; pembatasan akses hak istimewa pengguna belum diimplementasikan.')),
('data','Pisahkan master dan transaksi',table(['Jenis','Data','Contoh & aturan'],[['Master','Kategori','ATK; nama kategori unik'],['Master','Produk','P001 · Buku A5 · Rp12.000 · stok 20'],['Master','Pelanggan','C001 · Rani · telepon opsional; pembeli umum tidak perlu didaftarkan'],['Transaksi','Penjualan','Waktu, pelanggan opsional, pembayaran tunai'],['Transaksi','Detail penjualan','Produk, kuantitas, harga saat dijual; satu nota dapat memuat banyak item']])+ '<h3>Skenario yang digunakan sepanjang tutorial</h3><p>Rani membeli 2 Buku A5 dengan harga Rp12.000 per buku. Total Rp24.000, dibayar Rp30.000, kembalian Rp6.000. Stok buku berubah dari 20 menjadi 18. Angka ini menjadi acuan desain dan pengujian.</p>'),
('langkah','Langkah pertama & hasil modul', '<ol><li>Tulis satu paragraf masalah toko dan siapa penggunanya.</li><li>Salin batas scope di atas ke dokumen kebutuhan.</li><li>Siapkan tiga produk contoh dengan harga dan stok dalam bilangan bulat.</li><li>Pastikan pemilik toko memahami skenario penjualan sebelum mendesain database.</li></ol>'+checks(['Saya bisa menjelaskan tujuan dan batas project.','Saya dapat membedakan master dengan transaksi.','Saya memiliki contoh input serta hasil checkout yang diharapkan.']))]
content['analisis.html']=[
('probis','Proses bisnis penjualan','<p>Kasir membuka katalog, memilih barang dan jumlah, lalu menerima uang tunai. Sistem memeriksa stok dan pembayaran sebelum menyimpan nota. Pemilik membaca rekap untuk mencocokkan uang masuk.</p>'+flow(['Mulai<br>Pilih produk','Isi keranjang','Validasi stok<br>& pembayaran','Simpan penjualan<br>Kurangi stok','Cetak nota<br>Selesai'])+call('<strong>Cabang keputusan:</strong> jika stok kurang, kembali ke keranjang. Jika pembayaran kurang, kembali ke pembayaran. Jika penyimpanan gagal, lakukan rollback dan tampilkan pesan gagal; nota hanya dibuat setelah commit berhasil. Tidak ada stok yang dikurangi saat sekadar menambah keranjang.')),
('erd','ERD awal · sebelum normalisasi','<p>Mulai dari bentuk nota kertas. Relasi konseptualnya: satu pelanggan dapat memiliki banyak nota; setiap nota berisi banyak produk. Penyimpanan awal berikut belum normal karena item disimpan sebagai daftar berulang.</p>'+entities([('PELANGGAN','id_pelanggan\nnama\ntelepon'),('NOTA_AWAL','id_nota\nwaktu\nid_pelanggan\nnama_pelanggan\nitems[]: produk, kategori,\nharga, qty\ndibayar'),('PRODUK','id_produk\nnama_produk\nnama_kategori\nharga\nstok')],'PELANGGAN 1 ─── 0..N NOTA_AWAL<br>NOTA_AWAL N ─── M PRODUK (melalui items[])')+call('Masalah: nama pelanggan dan kategori berulang; mengganti nama memerlukan banyak pembaruan. Array item menyulitkan query jumlah barang terjual. Ini model awal untuk dianalisis, bukan skema yang dipakai aplikasi.')),
('normalisasi','PDM · normalisasi hingga 3NF',table(['Tahap','Perubahan','Alasan'],[['1NF','Pisahkan items[] menjadi baris sale_items','Satu nilai per kolom; tidak ada kelompok berulang'],['2NF','Pindahkan nama/harga produk ke products; header nota ke sales','Atribut item bergantung pada seluruh pasangan id_sale + id_product'],['3NF','Pisahkan categories dan customers','Nama kategori/pelanggan bergantung pada identitasnya sendiri']])+ '<h3>Model fisik setelah normalisasi</h3>'+entities([('categories','PK id_category INTEGER\nname TEXT UNIQUE'),('products','PK id_product INTEGER\nFK id_category INTEGER\nsku TEXT UNIQUE\nname TEXT\nprice INTEGER\nstock INTEGER'),('customers','PK id_customer INTEGER\nname TEXT\nphone TEXT NULL'),('sales','PK id_sale INTEGER\nFK id_customer NULL\ncreated_at TEXT\npaid INTEGER'),('sale_items','PK/FK id_sale INTEGER\nPK/FK id_product INTEGER\nquantity INTEGER\nunit_price INTEGER')],'categories 1 → N products · customers 0..1 ← N sales<br>sales 1 → N sale_items · products 1 → N sale_items')+'<p>Semua harga dalam rupiah bulat. <code>unit_price</code> adalah fakta harga pada saat transaksi, sehingga perubahan harga katalog tidak mengubah histori nota. Foreign key mencegah referensi ke data yang tidak ada.</p>'),
('denormalisasi','Denormalisasi yang terkontrol','<p>Untuk mempercepat daftar nota, tambahkan <code>sales.total INTEGER</code>. Nilainya sama dengan <code>SUM(quantity × unit_price)</code>. Ini satu-satunya nilai turunan yang disimpan; kembalian tetap dihitung dari <code>paid − total</code>.</p>'+flow(['sale_items<br>quantity × unit_price','SUM per sale_id','sales.total<br>snapshot tersimpan'])+call('Skema akhir = PDM 3NF di atas + kolom <code>sales.total</code>. Hitung total di server dari harga database dan simpan bersama item dalam satu transaksi. Nota bersifat immutable; koreksi histori dan retur berada di luar scope. Jangan percaya total atau harga dari browser.')),
('dfd','DFD · aliran data','<h3>Level 0 — konteks</h3>'+flow(['Kasir<br>item & pembayaran →','0. KasirKita<br>← nota / pesan validasi','Pemilik<br>← laporan; master →'])+'<p>Kasir mengirim pilihan produk, jumlah, dan pembayaran. Sistem mengembalikan katalog dan nota. Pemilik mengirim perubahan master serta permintaan laporan; sistem mengembalikan konfirmasi dan ringkasan.</p><h3>Level 1 — dekomposisi</h3>'+table(['Proses','Masukan → proses → keluaran','Penyimpanan'],[['1.0 Kelola master','Pemilik → data katalog/pelanggan → konfirmasi','D1: categories, products, customers'],['2.0 Proses penjualan','Kasir → item & uang → nota atau kesalahan; membaca D1','D1: update stok; D2: sales & sale_items'],['3.0 Susun laporan','Pemilik → tanggal → omzet & transaksi; membaca D2','D2: hanya baca']])+call('DFD menunjukkan perpindahan data, bukan urutan eksekusi. D1 dan D2 adalah kelompok penyimpanan logis; rincian tabelnya mengikuti PDM.')),
('fitur','Fitur & kriteria selesai',table(['Fitur','Kriteria penerimaan'],[['Katalog','Cari nama/SKU; tambah/edit produk; kategori valid; harga dan stok tidak negatif'],['Pelanggan','Tambah pelanggan; boleh checkout sebagai pembeli umum'],['Keranjang','Ubah jumlah atau hapus item; tidak menerima jumlah nol/negatif'],['Checkout','Stok cukup; uang cukup; satu transaksi database atomik'],['Nota','Tampilkan nomor, waktu, item, total, bayar, kembali; tombol cetak'],['Laporan','Filter tanggal lokal; tampilkan total penjualan serta jumlah nota']])+checks(['Saya bisa menelusuri penjualan dari input hingga penyimpanan.','ERD awal, PDM akhir, dan DFD saya memakai nama data yang konsisten.','Saya memahami alasan total disimpan dan harga transaksi tidak ikut berubah.']))]
fields=[('categories',[('id_category','INTEGER','PK; otomatis','1'),('name','TEXT','NOT NULL, UNIQUE','ATK')]),('products',[('id_product','INTEGER','PK; otomatis','1'),('id_category','INTEGER','NOT NULL, FK categories.id_category','1'),('sku','TEXT','NOT NULL, UNIQUE','P001'),('name','TEXT','NOT NULL','Buku A5'),('price','INTEGER','NOT NULL; ≥ 0, rupiah','12000'),('stock','INTEGER','NOT NULL; ≥ 0','20')]),('customers',[('id_customer','INTEGER','PK; otomatis','1'),('name','TEXT','NOT NULL','Rani'),('phone','TEXT','NULL diperbolehkan','081234567890')]),('sales',[('id_sale','INTEGER','PK; otomatis; nomor nota','1'),('id_customer','INTEGER','NULL atau FK customers.id_customer','1'),('created_at','TEXT','NOT NULL; ISO-8601 UTC','2026-09-30T03:00:00.000Z'),('paid','INTEGER','NOT NULL; ≥ total','30000'),('total','INTEGER','NOT NULL; ≥ 0; denormalisasi','24000')]),('sale_items',[('id_sale','INTEGER','PK gabungan; FK sales.id_sale','1'),('id_product','INTEGER','PK gabungan; FK products.id_product','1'),('quantity','INTEGER','NOT NULL; > 0','2'),('unit_price','INTEGER','NOT NULL; ≥ 0; snapshot rupiah','12000')])]
schema='''PRAGMA foreign_keys = ON;
CREATE TABLE categories (id_category INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE products (
 id_product INTEGER PRIMARY KEY, id_category INTEGER NOT NULL REFERENCES categories(id_category),
 sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
 price INTEGER NOT NULL CHECK(price >= 0), stock INTEGER NOT NULL CHECK(stock >= 0)
);
CREATE TABLE customers (id_customer INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT);
CREATE TABLE sales (
 id_sale INTEGER PRIMARY KEY, id_customer INTEGER REFERENCES customers(id_customer),
 created_at TEXT NOT NULL,
 total INTEGER NOT NULL CHECK(total >= 0), paid INTEGER NOT NULL CHECK(paid >= total)
);
CREATE TABLE sale_items (
 id_sale INTEGER NOT NULL REFERENCES sales(id_sale),
 id_product INTEGER NOT NULL REFERENCES products(id_product),
 quantity INTEGER NOT NULL CHECK(quantity > 0),
 unit_price INTEGER NOT NULL CHECK(unit_price >= 0),
 PRIMARY KEY (id_sale, id_product)
);
CREATE INDEX sales_created_at_idx ON sales(created_at);
INSERT INTO categories(name) VALUES ('ATK');
INSERT INTO products(id_category,sku,name,price,stock)
VALUES (1,'P001','Buku A5',12000,20);
INSERT INTO customers(name,phone) VALUES ('Rani',NULL);'''
content['teknis.html']=[
('arsitektur','Arsitektur program','<p>Gunakan tiga lapisan sederhana agar antarmuka, aturan bisnis, dan penyimpanan dapat diuji terpisah.</p>'+flow(['Browser<br>HTML · CSS · JavaScript','HTTP JSON<br>Node.js + Express','SQL<br>SQLite satu file'])+table(['Lapisan','Pilihan','Tanggung jawab'],[['Presentasi','HTML, CSS, JavaScript native','Form produk, keranjang, nota, dan fetch API'],['Server','Node.js 24+ dengan node:sqlite; Express 5','Validasi input, checkout, laporan, static files'],['Database','SQLite melalui DatabaseSync','Foreign key, constraints, transaksi atomik'],['Pengujian','node:test dan browser','Unit aturan bisnis; integrasi database; alur pengguna']])+call('Ini pilihan stack untuk project latihan. DatabaseSync sesuai untuk beban lokal kecil. Tutorial tidak mencakup optimasi layanan dengan banyak pengguna bersamaan.')),
('atribut','Kamus data · seluruh atribut','<p>PK = primary key, FK = foreign key. SQLite memakai afinitas tipe; server tetap wajib memvalidasi bilangan bulat aman, teks kosong, serta rentang nilai.</p>'+''.join('<h3>'+name+'</h3>'+table(['Field','Tipe','Aturan','Contoh'],rows) for name,rows in fields)+call('Hapus kategori/produk yang sudah direferensikan ditolak oleh foreign key. Tidak ada endpoint hapus nota. Input produk yang sama di keranjang digabung menjadi satu baris sebelum checkout.')),
('folder','Struktur folder proyek',code('''kasirkita/
├── package.json          # Dependensi dan perintah npm
├── public/               # Aset yang boleh diakses browser
│   ├── index.html        # Katalog dan keranjang
│   ├── app.js            # DOM, state keranjang, fetch
│   └── style.css         # Tampilan dan aturan cetak
├── src/
│   ├── server.js         # Express, middleware, route
│   ├── db.js             # Koneksi dan foreign_keys=ON
│   ├── routes/           # Endpoint produk, pelanggan, nota
│   └── services/         # Validasi dan transaksi checkout
├── db/
│   ├── schema.sql        # Tabel, indeks, dan seed awal
│   └── kasir.sqlite      # Data lokal; jangan commit
├── tests/                # Unit dan integrasi
└── docs/                 # Diagram, laporan, bukti uji''','Struktur target')+'<p>Database berada di luar <code>public/</code>, sehingga file transaksi tidak dilayani sebagai aset statis. Tambahkan <code>node_modules/</code> dan <code>db/*.sqlite*</code> ke <code>.gitignore</code>.</p>'),
('setup','Langkah 1 · siapkan fondasi',code('''mkdir kasirkita
cd kasirkita
npm init -y
npm pkg set type=module
npm install express@5
npm pkg set scripts.start="node src/server.js"
npm pkg set scripts.test="node --test"''','Terminal')+'<p>Buat direktori sesuai struktur, lalu simpan skema berikut sebagai <code>db/schema.sql</code>. Jalankan seed hanya sekali pada database baru.</p>'+code(schema,'db/schema.sql')+'<a class="pill" href="schema.sql" download>Unduh schema.sql ↓</a>'+code('''import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
export const db = new DatabaseSync('db/kasir.sqlite');
db.exec('PRAGMA foreign_keys = ON');
if (!db.prepare("SELECT name FROM sqlite_master WHERE name='products'").get()) {
  db.exec(readFileSync('db/schema.sql', 'utf8'));
}''','src/db.js')),
('api','Langkah 2 · kontrak API',table(['Metode & endpoint','Input','Hasil'],[['GET /api/products?q=','Nama atau SKU opsional','200; array produk'],['POST /api/products','id_category, sku, name, price, stock','201; produk dibuat'],['PATCH /api/products/:id_product','Field produk yang diperbolehkan','200; produk diperbarui'],['GET /api/categories','—','200; daftar kategori'],['POST /api/categories','name','201; kategori baru'],['GET /api/customers','—','200; daftar pelanggan'],['POST /api/customers','name, phone opsional','201; pelanggan baru'],['POST /api/sales','items [{id_product, quantity}], paid, id_customer opsional','201; id_sale, total, paid, change'],['GET /api/sales/:id_sale','ID nota','200; header dan detail nota'],['GET /api/reports?date=YYYY-MM-DD','Tanggal Asia/Jakarta','200; jumlah nota dan omzet']])+call('Standarkan respons gagal: <code>{"error":"Stok tidak cukup"}</code>. Gunakan 400 untuk input tidak valid, 404 untuk data tidak ditemukan, 409 untuk konflik stok/SKU, dan 500 untuk kegagalan internal. Gunakan parameter SQL, bukan penggabungan string input.')+code('''import express from 'express';
import { db } from './db.js';
const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(express.static('public'));
app.get('/api/products', (req, res) => {
  const q = '%' + String(req.query.q ?? '') + '%';
  res.json(db.prepare(
    'SELECT * FROM products WHERE name LIKE ? OR sku LIKE ?'
  ).all(q, q));
});
app.listen(3000, '127.0.0.1', () => console.log('http://127.0.0.1:3000'));
''','src/server.js · server awal yang dapat dijalankan')+'<p>Jalankan <code>npm start</code>, buka <code>http://127.0.0.1:3000/api/products</code>, dan pastikan Buku A5 muncul. Tambahkan route lain mengikuti kontrak di atas; contoh server awal baru menyediakan pembacaan katalog.</p>'),
('checkout','Langkah 3 · bangun checkout atomik','<ol><li>Validasi items tidak kosong, ID dan quantity bilangan bulat positif, paid bilangan bulat aman, dan pelanggan valid jika diisi.</li><li>Gabungkan id_product yang sama. Mulai <code>BEGIN IMMEDIATE</code>.</li><li>Baca produk dari database, cek stok, dan hitung total dengan harga database. Tolak overflow bilangan aman.</li><li>Tolak uang kurang. Simpan sales dengan timestamp UTC, lalu sale_items dengan snapshot unit_price.</li><li>Kurangi stok menggunakan update bersyarat <code>WHERE stock &gt;= ?</code>; setiap update harus memengaruhi satu baris.</li><li>Commit, kemudian kirim nota. Pada kesalahan apa pun, rollback seluruh transaksi.</li></ol>'+code('''BEGIN IMMEDIATE;
-- Contoh seed: 2 Buku A5 @ Rp12.000; dibayar Rp30.000.
-- Aplikasi wajib memvalidasi stok, pelanggan, dan uang sebelum INSERT.
INSERT INTO sales(id_customer,created_at,total,paid)
VALUES (1,strftime('%Y-%m-%dT%H:%M:%fZ','now'),24000,30000);
-- Ambil ID INSERT dari driver sebelum query berikutnya.
-- :id_sale adalah placeholder parameter dari server.
INSERT INTO sale_items(id_sale,id_product,quantity,unit_price)
VALUES (:id_sale,1,2,12000);
UPDATE products SET stock=stock-2 WHERE id_product=1 AND stock>=2;
-- Jika changes != 1: ROLLBACK, jangan COMMIT.
COMMIT;''','Pola transaksi · ilustrasi, bukan skrip siap eksekusi')+call('Nonaktifkan tombol bayar saat permintaan berjalan. Jangan mengulang POST otomatis setelah jaringan putus: hasil commit mungkin sudah tersimpan. Untuk versi produksi, tambahkan idempotency key yang unik.')),
('antarmuka','Langkah 4 · hubungkan antarmuka & laporan','<ol><li>Ambil katalog dengan fetch; tampilkan nama, harga, stok, dan tombol tambah menggunakan <code>textContent</code>.</li><li>Simpan keranjang sebagai array product_id dan quantity. Tampilkan subtotal sebagai perkiraan; server menjadi sumber nilai akhir.</li><li>Kirim payload checkout tanpa harga/total. Tampilkan error dekat form dan pertahankan keranjang jika gagal.</li><li>Setelah sukses, kosongkan keranjang, muat ulang stok, lalu ambil nota dari endpoint berdasarkan ID.</li><li>Buat tampilan nota dengan tombol <code>window.print()</code> dan CSS <code>@media print</code> untuk menyembunyikan navigasi.</li><li>Laporan memakai rentang UTC dari tanggal lokal: 30 September Jakarta berarti 29 September 17:00Z hingga 30 September 17:00Z, batas akhir eksklusif.</li></ol>'+code('''SELECT COUNT(*) AS jumlah_nota, COALESCE(SUM(total),0) AS omzet
FROM sales WHERE created_at >= ? AND created_at < ?;''','Query laporan · parameter timestamp ISO UTC')+checks(['Katalog dari database tampil di browser.','Checkout memvalidasi stok dan pembayaran di server.','Nota lama tetap benar setelah harga produk berubah.','Laporan menggunakan batas tanggal Asia/Jakarta.']))]
content['testing.html']=[
('strategi','Uji perilaku, bukan sekadar halaman','<p>Gunakan database latihan terpisah dan reset seed sebelum setiap skenario. Prioritas tertinggi adalah uang, stok, dan konsistensi transaksi. Hasil yang diharapkan harus ditentukan sebelum pengujian dijalankan.</p>'+cards([('Unit & integrasi','Unit: validasi quantity, pembayaran, perhitungan. Integrasi: route dengan database sementara, constraint, serta rollback.'),('End-to-end & penerimaan','Jalankan alur sebagai kasir di browser. Cocokkan nota dengan database, lalu minta calon pengguna mencoba skenario toko.')])+call('Status kasus di bawah adalah <strong>Belum dijalankan</strong>. Ini rencana pengujian aplikasi yang dibangun pembaca, bukan klaim bahwa implementasi aplikasi kasir sudah lulus.')),
('kasus','Matriks kasus pengujian',table(['ID / level','Skenario & langkah','Hasil yang diharapkan'],[['T01 · E2E','Reset stok 20; beli 2 @12.000; bayar 30.000','Total 24.000; kembali 6.000; stok 18; 1 nota dan 1 detail'],['T02 · Integrasi','Stok 1; kirim quantity 2 langsung ke API','409; tidak ada nota; stok tetap 1'],['T03 · Unit/API','quantity 0, -1, 1.5, string, atau items kosong','400; tidak ada perubahan database'],['T04 · Integrasi','Total 24.000; bayar 20.000','400; stok dan jumlah nota tetap'],['T05 · Integrasi','Paksa kegagalan INSERT detail setelah header','500; header, detail, dan stok seluruhnya rollback'],['T06 · Integrasi','Dua checkout berebut satu stok terakhir','Hanya satu sukses; stok 0; tidak negatif'],['T07 · Regresi','Ubah harga produk menjadi 15.000 setelah T01','Nota T01 tetap memakai 12.000 dan total 24.000'],['T08 · API','SKU duplikat; category_id tidak ada; harga negatif','Ditolak; data sebelumnya tidak berubah'],['T09 · Laporan','Nota tepat awal hari dan tepat awal hari berikutnya','Yang pertama termasuk, yang kedua tidak'],['T10 · UI','Lebar 360px; keyboard Tab; cetak nota','Form dapat diakses; fokus jelas; nota tanpa navigasi'],['T11 · API','Kirim harga/total palsu dari browser','Server mengabaikannya; memakai harga database'],['T12 · API','product_id sama muncul dua kali; pelanggan kosong','Kuantitas digabung; customer_id NULL; total benar']])+'<h3>Cara menjalankan</h3><ol><li>Siapkan database sementara baru untuk setiap test integrasi.</li><li>Jalankan <code>npm test</code> untuk test otomatis yang telah ditulis.</li><li>Jalankan <code>npm start</code> dan kerjakan T01 serta T10 secara manual.</li><li>Catat hasil aktual, tangkapan layar, dan query pembuktian. Jika gagal, perbaiki lalu jalankan ulang kasus serta regresi terkait.</li></ol>'),
('bukti','Contoh pemeriksaan konsistensi',code('''-- Harus tidak mengembalikan baris: total header != total detail.
SELECT s.id, s.total, COALESCE(SUM(i.quantity*i.unit_price),0) AS detail_total
FROM sales s LEFT JOIN sale_items i ON i.sale_id=s.id
GROUP BY s.id
HAVING s.total != COALESCE(SUM(i.quantity*i.unit_price),0);

-- Harus kosong.
SELECT * FROM products WHERE stock < 0;
PRAGMA foreign_key_check;''','Query audit setelah pengujian')+call('Query audit melengkapi pengujian, bukan menggantikannya. Kegagalan atomisitas perlu diuji dengan menyuntikkan error di dalam transaksi dan membandingkan keadaan sebelum/sesudah.')),
('laporan','Format laporan project','<p>Gunakan Markdown untuk sumber, ekspor PDF untuk pengumpulan. Simpan sebagai <code>docs/laporan-v1.0.md</code>. Tulis istilah, nama tabel, dan nomor diagram secara konsisten.</p>'+table(['Bab','Isi wajib'],[['Sampul & kontrol versi','Nama project, penulis, tanggal, versi, riwayat perubahan'],['1. Pendahuluan','Masalah, tujuan, pengguna, scope dan batasan'],['2. Analisis bisnis','Probis, flowchart, kebutuhan fungsional, kriteria penerimaan'],['3. Perancangan data','ERD awal, tahap normalisasi, PDM akhir, denormalisasi, kamus data'],['4. Implementasi','Stack, folder, instalasi, API, aturan transaksi, screenshot fitur'],['5. Pengujian','Lingkungan, seed, kasus uji, hasil aktual, bukti, status, defect'],['6. Penutup','Hasil terhadap scope, keterbatasan, pengembangan berikutnya'],['Lampiran','DDL, contoh payload, daftar referensi, petunjuk menjalankan']])+code('''# Laporan KasirKita
Penulis: [nama] | Versi: 1.0 | Tanggal: [YYYY-MM-DD]

## Ringkasan
[Masalah, tujuan, cakupan, dan hasil aktual]

## Lingkungan
- OS: [...]
- Node.js / Express / SQLite: [versi yang digunakan]
- Browser: [...]
- Commit / versi aplikasi: [...]

## Hasil uji
| ID | Prasyarat | Langkah | Ekspektasi | Aktual | Status | Bukti |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Stok 20 | Beli 2, bayar 30000 | Stok 18, kembali 6000 | ... | Belum diuji | ... |

## Defect
ID: BUG-001
Terkait kasus: [...]
Keparahan: [kritis/tinggi/sedang/rendah]
Langkah reproduksi: [...]
Hasil aktual dan harapan: [...]
Perbaikan / bukti uji ulang: [...]

## Kesimpulan & keterbatasan
[Fitur yang benar-benar selesai, kegagalan terbuka, langkah berikutnya]''','Template laporan · salin dan lengkapi')),
('selesai','Checklist sebelum diserahkan',checks(['Seluruh kasus kritis uang, stok, dan rollback telah lulus dengan bukti.','Diagram, tabel, nama field, dan implementasi telah dicocokkan.','README menjelaskan instalasi, seed, npm start, dan npm test.','Laporan berisi hasil aktual, versi lingkungan, serta daftar bug terbuka.','Database pribadi dan data sensitif tidak ikut dikumpulkan.','Project dapat dijalankan kembali dari folder baru mengikuti README.'])+call('<strong>Langkah berikutnya:</strong> setelah baseline ini selesai, rancang autentikasi, retur dengan jejak audit, dan backup database sebagai iterasi terpisah. Jangan memperluas scope sebelum alur utama lolos uji.'))]
business_flow='''<div class="diagram"><svg viewBox="0 0 720 330" role="img" aria-label="Flowchart checkout: pilih produk, validasi stok dan uang, simpan atomik, cetak nota; validasi gagal kembali ke input" style="display:block;min-width:570px;width:100%;font:12px Sora, sans-serif"><defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#9db6d4"/></marker></defs><g fill="none" stroke="#9db6d4" marker-end="url(#arr)"><path d="M110 65H150"/><path d="M280 65H330"/><path d="M450 65H490"/><path d="M610 65H645V160H550"/><path d="M390 110V135H215V95"/><path d="M550 110V125H290V95"/><path d="M420 190H290"/><path d="M160 190H115V267H160"/><path d="M420 225V267H290"/></g><g fill="#0e1a2b" stroke="#7f99b9"><rect x="10" y="40" width="100" height="50" rx="25"/><rect x="150" y="35" width="130" height="60" rx="6"/><path d="M390 20L450 65L390 110L330 65Z"/><path d="M550 20L610 65L550 110L490 65Z"/><rect x="420" y="160" width="130" height="65" rx="6"/><rect x="160" y="165" width="130" height="50" rx="6"/><rect x="160" y="245" width="130" height="45" rx="23"/></g><g fill="#dbe7f8" text-anchor="middle"><text x="60" y="69">Mulai</text><text x="215" y="61">Pilih produk</text><text x="215" y="79">& isi pembayaran</text><text x="390" y="62">Stok</text><text x="390" y="78">cukup?</text><text x="550" y="62">Uang</text><text x="550" y="78">cukup?</text><text x="485" y="184">Simpan nota</text><text x="485" y="204">& kurangi stok</text><text x="225" y="195">Cetak nota</text><text x="225" y="273">Selesai</text></g><g fill="#b6c7dc" font-size="10"><text x="460" y="57">Ya</text><text x="620" y="57">Ya</text><text x="340" y="129">Tidak</text><text x="460" y="120">Tidak</text><text x="320" y="182">Commit</text><text x="316" y="284">Gagal → rollback & pesan error</text></g></svg></div>'''
content['analisis.html'][0]=('probis','Proses bisnis penjualan','<p>Kasir memilih produk dan menerima uang tunai. Sistem memeriksa stok serta pembayaran sebelum menyimpan nota dan memperbarui stok dalam satu transaksi.</p>'+business_flow+call('Jika stok atau uang tidak cukup, kembali ke input. Jika penyimpanan gagal, rollback seluruh perubahan dan tampilkan pesan gagal. Nota hanya dicetak setelah commit berhasil.'))
from c_content import adapt
adapt(content, table, code, cards, call, checks, flow, schema)
from text_storage_content import adapt_txt
adapt_txt(content, table, code, cards, call, checks, flow, entities, fields)
from make_diagrams import generate as generate_diagrams
stories = json.loads((ROOT/'stories.json').read_text(encoding='utf-8'))
adapt_curriculum(content, stories, table, code, call, checks)
drawings = generate_diagrams()
import os
import subprocess
archify_cli = Path(os.environ.get('ARCHIFY_CLI', Path.home()/'.codex/skills/archify/bin/archify.mjs'))
if not archify_cli.is_file():
    raise RuntimeError('Archify CLI tidak tersedia; atur ARCHIFY_CLI untuk regenerasi SDLC.')
delivery = subprocess.run(['node', str(archify_cli), 'deliver', 'workflow', str(ROOT/'diagrams/sdlc.json'), str(ROOT/'diagrams/sdlc.html'), '--quality', 'showcase', '--json'], capture_output=True, text=True, encoding='utf-8', check=True)
(ROOT/'diagrams/sdlc-delivery.json').write_text(delivery.stdout, encoding='utf-8')
def diagram_figure(slug):
    return '<figure class="learning-diagram"><div class="diagram-scroll">'+drawings[slug]+'</div><figcaption><a href="diagrams/'+slug+'.html" target="_blank" rel="noopener">Buka diagram ukuran penuh ↗</a></figcaption></figure>'
from make_diagrams import source_panel
for page in content:
    for i, (anchor, heading, body) in enumerate(content[page]):
        for slug in drawings:
            panel = source_panel(slug).replace('href="'+slug+'.mmd"', 'href="diagrams/'+slug+'.mmd"')
            body = body.replace('<!--diagram:'+slug+'-->', diagram_figure(slug)+panel)
        content[page][i] = (anchor, heading, body)
content['project.html'].insert(0,('sdlc','Gambaran SDLC', '<p>SDLC adalah siklus pengembangan project, bukan urutan membaca modul. Gunakan zoom atau pilih simpul untuk menelusuri tahapan dan jalur perbaikan.</p><iframe class="workflow-viewer" src="diagrams/sdlc.html" title="SDLC KasirKita — Archify" loading="lazy"></iframe><p><a class="pill" href="diagrams/sdlc.html" target="_blank" rel="noopener">Buka SDLC ukuran penuh</a> <a class="pill" href="diagrams/sdlc.json" download>Unduh source JSON Archify</a></p><p class="viewer-note">Isi berbahasa Indonesia; kontrol bawaan viewer Archify berbahasa Inggris.</p>'))
home = home.replace('Bangun aplikasi kasir pertamamu dari nol.', 'Pelajari dokumen project dan UI console C.').replace('Untuk pemula', 'C17 · Terminal')
home = home.replace('Definisi & Activity Plan','Dokumen Persiapan').replace('Dokumen desain & laporan','Dokumen After').replace('Kenali lib.h','Penggunaan lib.h').replace('Buat UI ASCII art','UI/UX dengan lib.h')
(ROOT/'index.html').write_text(shell(home,home=True).replace('aplikasi kasir web', 'aplikasi kasir bahasa C'),encoding='utf-8')
downloads = json.loads((ROOT / 'downloads.json').read_text(encoding='utf-8'))
download_slots = {
    'ap': ('project.html', 'activity-plan', 'Activity Plan (AP)', 'Dokumen Activity Plan (AP) untuk merencanakan kegiatan project.'),
    'lib': ('teknis.html', 'lib-intro', 'Library lib.h', 'Header C berisi fungsi bantuan untuk tampilan dan input console Windows.'),
    'testing': ('analisis.html', 'user-testing', 'Contoh User Testing', 'Referensi format untuk mencatat hasil pengujian.'),
    'product_documentation': ('analisis.html', 'product-documentation', 'Product Documentation', 'Template dokumentasi produk yang diberikan pengguna.'),
    'user_guide': ('analisis.html', 'user-guide', 'User Guide', 'Template User Manual yang diberikan pengguna.'),
}
for key, (page, section, title, description) in download_slots.items():
    source = downloads.get(key, '').strip()
    href = ''
    remote = False
    if source:
        parsed = urlsplit(source)
        if parsed.scheme in ('http', 'https') and parsed.netloc:
            href, remote = source, True
        elif not parsed.scheme and not parsed.netloc:
            target = (ROOT / source).resolve()
            if target.is_relative_to(ROOT) and target.is_file() and target.stat().st_size > 0:
                href = quote(target.relative_to(ROOT).as_posix())
    action = ('<a class="pill download-button" href="'+escape(href, quote=True)+'" '+
              ('target="_blank" rel="noopener noreferrer"' if remote else 'download')+
              '>Unduh '+escape(title)+' <span aria-hidden="true">↓</span></a>') if href else \
             '<button class="pill download-button" disabled>File belum tersedia</button>'
    note = '<small>Link unduhan dibuka di tab baru.</small>' if remote else ''
    block = '<div class="download-card"><div><span class="download-label">BAHAN DOWNLOAD</span><h3>'+title+'</h3><p>'+description+'</p>'+note+'</div>'+action+'</div>'
    if key == 'testing':
        sim_block = (
            '<div class="download-card uat-sim-card" style="margin-top:14px;border-color:rgba(56,189,248,0.4);background:linear-gradient(135deg,rgba(13,23,37,0.9),rgba(2,132,199,0.12));">'
            '<div><span class="download-label" style="background:#0284c7;color:#fff;">LATIHAN INTERAKTIF · FULLSCREEN</span>'
            '<h3 style="color:#ebd1a1;">UAT Bug Hunter Simulator</h3>'
            '<p>Praktikkan langsung 18 skenario pengujian Lampiran C. Bobol form dengan kasus negatif terlebih dahulu untuk membuka akses data valid!</p></div>'
            '<a class="pill" href="game/uat.html" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;font-weight:700;">'
            '🎮 Buka Simulator Pengujian ↗</a></div>'
        )
        block = block + sim_block
    for i, (anchor, heading, body) in enumerate(content[page]):
        if anchor == section:
            content[page][i] = (anchor, heading, block + body)
            break

descriptions = DESCRIPTIONS
module_page = (ROOT/'daftarModul.html').read_text(encoding='utf-8')
import re
module_summaries = ['Tema, Probis, atribut, dan Activity Plan.', 'User testing, proposal, dan panduan produk.', 'Pasang dan gunakan library console.', 'Ubah gambar ke teks dan tampilkan di C.']
for i, (_, num, label) in enumerate(pages):
    pattern = r'(<span class="module-copy"><strong>)[^<]*(</strong><span>)[^<]*(</span></span>)'
    matches = list(re.finditer(pattern, module_page))
    match = matches[i]
    replacement = match[1]+escape(label)+match[2]+module_summaries[i]+match[3]
    module_page = module_page[:match.start()]+replacement+module_page[match.end():]
(ROOT/'daftarModul.html').write_text(module_page, encoding='utf-8')
lesson_pages = {('project.html', 'probis'): 'probis.html'}
def material_href(url, anchor):
    return lesson_pages.get((url, anchor), url+'#'+anchor)

probis_anchor, probis_heading, probis_body = next(item for item in content['project.html'] if item[0] == 'probis')
probis_body = probis_body.replace('<h4>', '<h2>').replace('</h4>', '</h2>')
from make_checkout_game import render as render_checkout_game
game_prompt = '<section class="story-action" id="game-checkout"><h2>Latihan flowchart checkout</h2><p>Perbaiki simbol dan sambungan, lalu jalankan empat skenario untuk melihat akibat pilihanmu. Pilihan terakhir tersimpan di browser ini.</p><a class="pill" href="game/checkout.html">Buka game checkout →</a></section>'
probis_body = probis_body.replace('<h2>Flowchart checkout</h2>', game_prompt+'<h2 id="checkout-reference">Flowchart checkout · referensi</h2>')
erd_game_prompt = '<section class="story-action" id="game-erd"><h2>Latihan kabel relasi ERD & PDM</h2><p>Hubungkan kabel virtual dari Primary Key ke Foreign Key, lalu jalankan simulasi transaksi toko Rani. Tersedia 5 level interaktif dengan skema berbeda.</p><a class="pill" href="game/erd-wires.html">Buka game kabel ERD & PDM ↗</a></section>'
probis_body = probis_body.replace('<h2>PDM setelah normalisasi</h2>', erd_game_prompt+'<h2>PDM setelah normalisasi</h2>')
game_dir = ROOT/'game'

game_dir.mkdir(exist_ok=True)
game_body = render_checkout_game().replace('href="#checkout-reference"', 'href="../probis.html#checkout-reference"')
checkout_fullscreen_html = f'''<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="Game simulasi alur checkout KasirKita: perbaiki simbol flowchart dan sambungan logika transaksi Rani.">
  <title>Game Checkout Flowchart KasirKita — Hello Project</title>
  <link rel="stylesheet" href="../assets/css/site.css?v=20261016-clean">
  <link rel="stylesheet" href="../assets/css/uat-game.css">
  <style>
    html, body {{ width: 100%; height: 100%; overflow: hidden; background: #050c16; color: #edf3fc; font-family: 'Sora', sans-serif; }}
    .checkout-app {{ display: flex; flex-direction: column; width: 100vw; height: 100vh; padding: 12px 20px; gap: 12px; position: relative; z-index: 2; }}
    .checkout-topbar {{ display: flex; align-items: center; justify-content: space-between; height: 48px; padding: 0 16px; background: rgba(13, 23, 37, 0.85); backdrop-filter: blur(12px); border: 1px solid #1e314b; border-radius: 12px; flex-shrink: 0; }}
    .checkout-back-btn {{ display: inline-flex; align-items: center; gap: 8px; color: #ebd1a1; text-decoration: none; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(235, 209, 161, 0.25); background: rgba(235, 209, 161, 0.06); transition: all 0.2s ease; }}
    .checkout-back-btn:hover {{ background: rgba(235, 209, 161, 0.15); }}
    .checkout-badge {{ display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #f1f5f9; }}
    .checkout-badge .tag {{ background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 999px; }}
    .checkout-scroll-content {{ flex: 1; overflow-y: auto; padding-right: 8px; display: flex; flex-direction: column; gap: 14px; }}
    .checkout-scroll-content .checkout-game {{ margin: 0; }}
  </style>
</head>
<body>
  <video class="uat-bg-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true" src="../assets/video/daftarModul.mp4"></video>
  <div class="uat-veil"></div>

  <main class="checkout-app" id="main">
    <header class="checkout-topbar">
      <a class="checkout-back-btn" href="../probis.html#checkout-reference" aria-label="Kembali ke Modul 01">
        <span>←</span> Kembali ke Modul 01 (Probis)
      </a>
      <div class="checkout-badge">
        <span>KasirKita Flowchart Cockpit</span>
        <span class="tag">Simulator Checkout</span>
      </div>
      <div>
        <a class="checkout-back-btn" href="../probis.html#checkout-reference" style="font-size:12px;color:#94a3b8;border-color:rgba(255,255,255,0.1);">Materi Referensi ↗</a>
      </div>
    </header>

    <div class="checkout-scroll-content">
      {game_body}
    </div>
  </main>
</body>
</html>'''
checkout_fullscreen_html = checkout_fullscreen_html.replace('href="assets/', 'href="../assets/').replace('src="assets/', 'src="../assets/').replace('href="index.html"', 'href="../index.html"')
(game_dir/'checkout.html').write_text(checkout_fullscreen_html, encoding='utf-8')
probis_story = stories['probis']
lesson_navigation = '<nav class="lesson-nav" aria-label="Navigasi materi"><a class="pill" href="project.html#atribut">← Sebelumnya: Atribut</a><a class="pill" href="daftarisi.html">Daftar isi modul 01</a><a class="pill" href="project.html#activity-plan">Berikutnya: Activity Plan →</a></nav>'
probis_article = '<main class="article lesson-article" id="main"><div class="breadcrumb"><a href="daftarisi.html">Dokumen Persiapan</a> &nbsp; / &nbsp; Probis</div><div class="eyebrow"><span class="dot"></span> MODUL 01 · MATERI 08 DARI 09</div><h1>Proses Bisnis KasirKita</h1><p class="lead">'+probis_story['explanation']+'</p><section class="lesson-content" id="probis">'+probis_body+'</section><section class="story-action"><h2>Latihan Probis</h2><p>'+probis_story['action']+'</p><p>Hasil yang perlu ada: tabel aktor, input, aktivitas, output, dan fitur untuk satu penjualan. Gunakan contoh dua buku seharga Rp12.000, dibayar Rp30.000; jelaskan juga kondisi input tidak valid dan simpan gagal.</p></section>'+lesson_navigation+'</main>'
(ROOT/'probis.html').write_text(shell('<div class="layout module-content">'+probis_article+'</div>', 'probis.html', 'Proses Bisnis KasirKita'), encoding='utf-8')

for idx,(url,num,label) in enumerate(pages):
    title,lead,time=descriptions[url]
    article='<main class="article" id="main"><div class="breadcrumb"><a href="index.html">Beranda</a> &nbsp; / &nbsp; KasirKita &nbsp; / &nbsp; Modul '+num+'</div><div class="eyebrow"><span class="dot"></span> MODUL '+num+' · '+label.upper()+'</div><h1>'+title+'</h1><p class="lead">'+lead+'</p><div class="chapter-meta"><span>◷ '+time+'</span><span>Level pemula</span><span>Project KasirKita</span></div>'
    article+='<p><a class="pill" href="'+('daftarisi.html' if idx == 0 else f'daftarisi-{idx+1}.html')+'">Daftar isi modul '+num+'</a></p>'
    article+='<div class="story-guide" aria-hidden="true"><span>PERJALANAN RANI</span><strong data-story-title>Mulai dari satu langkah kecil.</strong><span data-story-count>Gulir untuk mengikuti cerita ↓</span></div><div class="story-chapters">'
    for j,(id,heading,body) in enumerate(content[url]):
        story=stories[id]
        if (url,id) in lesson_pages:
            article+='<section class="story-step" id="'+id+'" data-story-title="'+escape(story['title'],quote=True)+'"><p class="story-kicker">LANGKAH '+f'{j+1:02}'+' / '+f'{len(content[url]):02}'+'</p><h2>'+story['title']+'</h2><p class="story-explanation">'+story['explanation']+'</p><p>Penjelasan, diagram, source Mermaid, dan latihan tersedia dalam halaman materi.</p><a class="pill" href="'+material_href(url,id)+'">Buka materi Probis →</a></section>'
            continue
        article+=f'<section class="story-step" id="{id}" data-story-title="{escape(story["title"], quote=True)}"><p class="story-kicker">LANGKAH {j+1:02} / {len(content[url]):02}</p><h2>{story["title"]}</h2><p class="story-explanation">{story["explanation"]}</p><div class="story-analogy"><span>BAYANGKAN BEGINI</span><p>{story["analogy"]}</p></div><div class="story-action"><strong>Coba sekarang</strong><p>{story["action"]}</p></div><details class="story-details"><summary>Lihat diagram, contoh, dan materi lengkap</summary><div class="story-reference"><h3>{heading}</h3>{body}</div></details></section>'
    article+='</div><script src="assets/js/story.js" defer></script><script src="assets/js/step-nav.js" defer></script>'
    prev=(('daftarisi.html' if idx == 1 else f'daftarisi-{idx}.html'), pages[idx-1][1], pages[idx-1][2]) if idx else ('daftarModul.html','','Daftar modul')
    nxt=(f'daftarisi-{idx+2}.html', pages[idx+1][1], pages[idx+1][2]) if idx<3 else ('daftarModul.html','','Kembali ke daftar modul')
    article+='<button class="cta complete" aria-pressed="false">Tandai modul selesai ✓</button><nav class="pagination" aria-label="Modul sebelum dan sesudah"><a href="'+prev[0]+'"><small>← SEBELUMNYA</small>'+prev[2]+'</a><a href="'+nxt[0]+'"><small>'+('BERIKUTNYA →' if idx<3 else 'PERJALANAN SELESAI ↗')+'</small>'+nxt[2]+'</a></nav></main>'
    (ROOT/url).write_text(shell('<div class="layout module-content">'+article+'</div>',url,label).replace('aplikasi kasir web', 'aplikasi kasir desktop IntelliJ'),encoding='utf-8')
for idx, (url, num, label) in enumerate(pages):
    contents_path = 'daftarisi.html' if idx == 0 else f'daftarisi-{idx+1}.html'
    links = ''.join(
        '<a class="map-callout" style="grid-column:'+str(1 if j % 2 == 0 else 3)+';grid-row:'+str(j//2+1)+'" href="'+material_href(url,anchor)+'"><span class="callout-number">'+f'{j+1:02}'+'</span><span>'+escape(stories[anchor]['title'])+'</span><span class="callout-arrow" aria-hidden="true">↗</span></a>'
        for j, (anchor, _, _) in enumerate(content[url])
    )
    rows = (len(content[url]) + 1) // 2
    contents_html = '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Daftar Isi Modul '+num+' — Hello Project</title><link rel="stylesheet" href="assets/css/automation.css"></head><body class="automation-page"><video class="art" autoplay muted loop playsinline preload="metadata" aria-hidden="true" src="'+VIDEO+'"></video><main><section class="automation-section contents-section"><header class="contents-header"><div class="contents-topbar"><a href="daftarModul.html">← DAFTAR MODUL</a><button class="replay-boot" type="button" aria-label="Putar ulang animasi sirkuit">Putar animasi ↺</button></div><h1>Modul '+num+' · '+escape(label)+'</h1><p>Pilih langkah untuk membuka materi modul ini.</p></header><nav class="callout-map is-booting" style="--contents-rows:'+str(rows)+'" aria-label="Daftar isi modul '+num+'"><svg class="callout-lines" aria-hidden="true"><g></g></svg><div class="callout-target" aria-hidden="true"><span class="target-dot"></span><span>MODUL '+num+'</span></div>'+links+'</nav></section></main><script src="assets/js/callouts.js" defer></script></body></html>'
    (ROOT/contents_path).write_text(contents_html.replace(VIDEO, CONTENTS_VIDEO), encoding='utf-8')
from make_lib_docs import generate as generate_lib_docs
print('Generated tutorial pages, module contents, static diagrams, and lib.h reference:', generate_lib_docs(), 'functions')
