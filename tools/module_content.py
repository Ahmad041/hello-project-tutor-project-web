"""Materi empat modul, disusun dari sumber dan template pengguna."""
from diagram_specs import data_model

def finalize(content, stories, table, code, call, checks):
    def step(anchor,title,explanation,action,body,analogy):
        stories[anchor]=dict(title=title,explanation=explanation,action=action,analogy=analogy)
        return anchor,title,body
    docs='<p><a class="pill" href="dokumentasi-lib.html">Buka dokumentasi lib.h</a></p>'
    features=call('<strong>Validasi wajib pada setiap fitur.</strong> Periksa tipe data, input kosong, panjang teks, rentang angka, ID ganda, dan referensi data. Tampilkan pesan kesalahan yang bisa dipahami; jangan menyimpan perubahan sebelum input valid. Validasi keyboard saja belum menggantikan pemeriksaan nilai dan aturan bisnis.')
    entities_attributes = [
        ('CATEGORY', 'Kategori Barang', [
            ('id_category', 'VARCHAR(20)', 'char[21]', 'Kunci utama (ID kategori unik)'),
            ('name', 'VARCHAR(64)', 'char[65]', 'Nama kelompok / rak barang'),
        ]),
        ('PRODUCT', 'Produk Dagangan', [
            ('id_product', 'VARCHAR(20)', 'char[21]', 'Kunci utama (ID produk unik)'),
            ('sku', 'VARCHAR(32)', 'char[33]', 'Kode barcode unik produk'),
            ('name', 'VARCHAR(128)', 'char[129]', 'Nama lengkap barang'),
            ('price', 'INTEGER', 'int', 'Harga satuan barang (rupiah bulat)'),
            ('stock', 'INTEGER', 'int', 'Jumlah sisa persediaan'),
        ]),
        ('CUSTOMER', 'Data Pelanggan', [
            ('id_customer', 'VARCHAR(20)', 'char[21]', 'Kunci utama (ID pelanggan unik)'),
            ('name', 'VARCHAR(128)', 'char[129]', 'Nama lengkap pembeli'),
            ('phone', 'VARCHAR(32)', 'char[33]', 'Nomor WhatsApp / telepon'),
        ]),
        ('SALE', 'Nota Penjualan', [
            ('id_sale', 'VARCHAR(20)', 'char[21]', 'Kunci utama (Nomor transaksi nota)'),
            ('created_at', 'VARCHAR(20)', 'char[21]', 'Waktu transaksi dibuat'),
            ('paid', 'INTEGER', 'int', 'Nominal uang pembayaran'),
            ('total', 'INTEGER', 'int', 'Total nominal belanja transaksi'),
        ]),
        ('ITEM', 'Detail Item Belanja', [
            ('quantity', 'INTEGER', 'int', 'Jumlah barang yang dibeli (> 0)'),
            ('unit_price', 'INTEGER', 'int', 'Harga satuan saat transaksi berlangsung'),
        ]),
    ]
    entity_tables_html = ''.join(
        f'<h3>Tabel Entitas {ent} ({label})</h3>' +
        table(['Atribut', 'Tipe model', 'Representasi C', 'Keterangan'], rows)
        for ent, label, rows in entities_attributes
    )

    boxes_interactive_widget = (
        '<section class="boxes-analogy-container" aria-label="Simulasi Kotak Kardus 3D Master dan Transaksi">'
        '<div class="boxes-showcase-hero">'
        '<div class="boxes-stage-open3d">'
        '<div class="boxes-3d-scene-container" id="boxes-3d-viewport" aria-label="Lingkungan 3D Interaktif WebGL Three.js">'
        '<div class="boxes-3d-hud">'
        '<div class="hud-top-left"><span class="hud-tag">🎮 3D WebGL</span><span class="hud-help">Drag putar · Scroll zoom · Klik bola</span></div>'
        '<div class="hud-controls">'
        '<button type="button" class="hud-btn" data-action="3d-reset-cam" title="Reset Posisi Kamera">🔄 Reset</button>'
        '<button type="button" class="hud-btn" data-action="3d-autorotate" title="Putar Kamera Otomatis">✨ Putar</button>'
        '<button type="button" class="hud-btn" data-action="3d-focus-trx" title="Fokus ke Kotak Transaksi">🎯 Transaksi</button>'
        '</div>'
        '</div>'
        '<div class="hud-tooltip" id="hud-3d-tooltip"></div>'
        '</div>'
        '<details class="boxes-accessible-deck"><summary><span>📊</span> Mode Kartu 2D Sinkron (Aksesibilitas / Uji Relasi)</summary>'
        '<div class="boxes-stage-grid">'
        '<div class="cardboard-box-open3d box-master box-master-category">'
        '<div class="box-badge-row"><span class="box-stamp-tag">MASTER</span><span class="box-nature-badge nature-static">JARANG BERUBAH</span></div>'
        '<div class="box-title-label">🏷️ Kategori Barang</div>'
        '<div class="box-3d-visual">'
        '<svg class="box-svg" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        '<defs><filter id="sh-m-cat" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>'
        '<linearGradient id="fl-m-cat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ab7138"/><stop offset="100%" stop-color="#754417"/></linearGradient>'
        '<linearGradient id="fr-m-cat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cf934e"/><stop offset="100%" stop-color="#9c6427"/></linearGradient>'
        '<linearGradient id="floor-m-cat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3d2008"/><stop offset="100%" stop-color="#5a3311"/></linearGradient>'
        '<linearGradient id="inl-m-cat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#241003"/><stop offset="100%" stop-color="#3d1d07"/></linearGradient>'
        '<linearGradient id="inr-m-cat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3a1c07"/><stop offset="100%" stop-color="#562e10"/></linearGradient>'
        '<linearGradient id="fbl-m-cat" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#8e5723"/><stop offset="100%" stop-color="#ad743a"/></linearGradient>'
        '<linearGradient id="fbr-m-cat" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#a66f35"/><stop offset="100%" stop-color="#c98d4d"/></linearGradient>'
        '<linearGradient id="ffl-m-cat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b57b3d"/><stop offset="100%" stop-color="#8a521e"/></linearGradient>'
        '<linearGradient id="ffr-m-cat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d89b57"/><stop offset="100%" stop-color="#a86d2f"/></linearGradient></defs>'
        '<ellipse cx="120" cy="175" rx="86" ry="20" fill="rgba(25, 18, 10, 0.35)" filter="url(#sh-m-cat)"/>'
        '<polygon points="46,80 28,54 105,14 120,38" fill="url(#fbl-m-cat)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="120,38 135,14 212,54 194,80" fill="url(#fbr-m-cat)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="46,80 120,38 120,95 60,125" fill="url(#inl-m-cat)"/>'
        '<polygon points="120,38 194,80 180,125 120,95" fill="url(#inr-m-cat)"/>'
        '<polygon points="120,95 180,125 120,155 60,125" fill="url(#floor-m-cat)"/>'
        '<polygon points="46,80 120,120 120,186 46,146" fill="url(#fl-m-cat)"/>'
        '<polygon points="120,120 194,80 194,146 120,186" fill="url(#fr-m-cat)"/>'
        '<polygon points="46,80 30,108 107,150 120,120" fill="url(#ffl-m-cat)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polygon points="120,120 133,150 210,108 194,80" fill="url(#ffr-m-cat)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polyline points="46,80 120,120 194,80" fill="none" stroke="#fce4c4" stroke-width="1.4" stroke-linecap="round"/>'
        '</svg>'
        '<div class="box-cavity-balls cavity-category" aria-label="Bola Master Kategori"></div>'
        '</div></div>'
        '<div class="cardboard-box-open3d box-master box-master-product">'
        '<div class="box-badge-row"><span class="box-stamp-tag">MASTER</span><span class="box-nature-badge nature-static">JARANG BERUBAH</span></div>'
        '<div class="box-title-label">📦 Barang Dagangan</div>'
        '<div class="box-3d-visual">'
        '<svg class="box-svg" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        '<defs><filter id="sh-m-prod" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>'
        '<linearGradient id="fl-m-prod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ab7138"/><stop offset="100%" stop-color="#754417"/></linearGradient>'
        '<linearGradient id="fr-m-prod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cf934e"/><stop offset="100%" stop-color="#9c6427"/></linearGradient>'
        '<linearGradient id="floor-m-prod" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3d2008"/><stop offset="100%" stop-color="#5a3311"/></linearGradient>'
        '<linearGradient id="inl-m-prod" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#241003"/><stop offset="100%" stop-color="#3d1d07"/></linearGradient>'
        '<linearGradient id="inr-m-prod" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3a1c07"/><stop offset="100%" stop-color="#562e10"/></linearGradient>'
        '<linearGradient id="fbl-m-prod" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#8e5723"/><stop offset="100%" stop-color="#ad743a"/></linearGradient>'
        '<linearGradient id="fbr-m-prod" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#a66f35"/><stop offset="100%" stop-color="#c98d4d"/></linearGradient>'
        '<linearGradient id="ffl-m-prod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b57b3d"/><stop offset="100%" stop-color="#8a521e"/></linearGradient>'
        '<linearGradient id="ffr-m-prod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d89b57"/><stop offset="100%" stop-color="#a86d2f"/></linearGradient></defs>'
        '<ellipse cx="120" cy="175" rx="86" ry="20" fill="rgba(25, 18, 10, 0.35)" filter="url(#sh-m-prod)"/>'
        '<polygon points="46,80 28,54 105,14 120,38" fill="url(#fbl-m-prod)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="120,38 135,14 212,54 194,80" fill="url(#fbr-m-prod)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="46,80 120,38 120,95 60,125" fill="url(#inl-m-prod)"/>'
        '<polygon points="120,38 194,80 180,125 120,95" fill="url(#inr-m-prod)"/>'
        '<polygon points="120,95 180,125 120,155 60,125" fill="url(#floor-m-prod)"/>'
        '<polygon points="46,80 120,120 120,186 46,146" fill="url(#fl-m-prod)"/>'
        '<polygon points="120,120 194,80 194,146 120,186" fill="url(#fr-m-prod)"/>'
        '<polygon points="46,80 30,108 107,150 120,120" fill="url(#ffl-m-prod)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polygon points="120,120 133,150 210,108 194,80" fill="url(#ffr-m-prod)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polyline points="46,80 120,120 194,80" fill="none" stroke="#fce4c4" stroke-width="1.4" stroke-linecap="round"/>'
        '</svg>'
        '<div class="box-cavity-balls cavity-product" aria-label="Bola Master Produk"></div>'
        '</div></div>'
        '<div class="cardboard-box-open3d box-master box-master-customer">'
        '<div class="box-badge-row"><span class="box-stamp-tag">MASTER</span><span class="box-nature-badge nature-static">JARANG BERUBAH</span></div>'
        '<div class="box-title-label">👤 Pelanggan Toko</div>'
        '<div class="box-3d-visual">'
        '<svg class="box-svg" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        '<defs><filter id="sh-m-cust" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>'
        '<linearGradient id="fl-m-cust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ab7138"/><stop offset="100%" stop-color="#754417"/></linearGradient>'
        '<linearGradient id="fr-m-cust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cf934e"/><stop offset="100%" stop-color="#9c6427"/></linearGradient>'
        '<linearGradient id="floor-m-cust" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3d2008"/><stop offset="100%" stop-color="#5a3311"/></linearGradient>'
        '<linearGradient id="inl-m-cust" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#241003"/><stop offset="100%" stop-color="#3d1d07"/></linearGradient>'
        '<linearGradient id="inr-m-cust" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3a1c07"/><stop offset="100%" stop-color="#562e10"/></linearGradient>'
        '<linearGradient id="fbl-m-cust" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#8e5723"/><stop offset="100%" stop-color="#ad743a"/></linearGradient>'
        '<linearGradient id="fbr-m-cust" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#a66f35"/><stop offset="100%" stop-color="#c98d4d"/></linearGradient>'
        '<linearGradient id="ffl-m-cust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b57b3d"/><stop offset="100%" stop-color="#8a521e"/></linearGradient>'
        '<linearGradient id="ffr-m-cust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d89b57"/><stop offset="100%" stop-color="#a86d2f"/></linearGradient></defs>'
        '<ellipse cx="120" cy="175" rx="86" ry="20" fill="rgba(25, 18, 10, 0.35)" filter="url(#sh-m-cust)"/>'
        '<polygon points="46,80 28,54 105,14 120,38" fill="url(#fbl-m-cust)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="120,38 135,14 212,54 194,80" fill="url(#fbr-m-cust)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="46,80 120,38 120,95 60,125" fill="url(#inl-m-cust)"/>'
        '<polygon points="120,38 194,80 180,125 120,95" fill="url(#inr-m-cust)"/>'
        '<polygon points="120,95 180,125 120,155 60,125" fill="url(#floor-m-cust)"/>'
        '<polygon points="46,80 120,120 120,186 46,146" fill="url(#fl-m-cust)"/>'
        '<polygon points="120,120 194,80 194,146 120,186" fill="url(#fr-m-cust)"/>'
        '<polygon points="46,80 30,108 107,150 120,120" fill="url(#ffl-m-cust)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polygon points="120,120 133,150 210,108 194,80" fill="url(#ffr-m-cust)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polyline points="46,80 120,120 194,80" fill="none" stroke="#fce4c4" stroke-width="1.4" stroke-linecap="round"/>'
        '</svg>'
        '<div class="box-cavity-balls cavity-customer" aria-label="Bola Master Pelanggan"></div>'
        '</div></div>'
        '<div class="cardboard-box-open3d box-transaction">'
        '<div class="box-badge-row"><span class="box-stamp-tag">TRANSAKSI</span><span class="box-nature-badge nature-dynamic">⚡ BERUBAH-UBAH</span></div>'
        '<div class="box-title-label">🧾 Keranjang Penjualan</div>'
        '<div class="box-3d-visual">'
        '<svg class="box-svg" viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        '<defs><filter id="sh-m-trx" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>'
        '<linearGradient id="fl-m-trx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b87834"/><stop offset="100%" stop-color="#7a4616"/></linearGradient>'
        '<linearGradient id="fr-m-trx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d9974b"/><stop offset="100%" stop-color="#a06626"/></linearGradient>'
        '<linearGradient id="floor-m-trx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#422208"/><stop offset="100%" stop-color="#613611"/></linearGradient>'
        '<linearGradient id="inl-m-trx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2a1204"/><stop offset="100%" stop-color="#441f08"/></linearGradient>'
        '<linearGradient id="inr-m-trx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#401d06"/><stop offset="100%" stop-color="#5a2f0e"/></linearGradient>'
        '<linearGradient id="fbl-m-trx" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#995e24"/><stop offset="100%" stop-color="#b87b3b"/></linearGradient>'
        '<linearGradient id="fbr-m-trx" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#b07536"/><stop offset="100%" stop-color="#d49450"/></linearGradient>'
        '<linearGradient id="ffl-m-trx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#be803e"/><stop offset="100%" stop-color="#93571f"/></linearGradient>'
        '<linearGradient id="ffr-m-trx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0a158"/><stop offset="100%" stop-color="#af7130"/></linearGradient></defs>'
        '<ellipse cx="120" cy="175" rx="86" ry="20" fill="rgba(25, 18, 10, 0.35)" filter="url(#sh-m-trx)"/>'
        '<polygon points="46,80 28,54 105,14 120,38" fill="url(#fbl-m-trx)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="120,38 135,14 212,54 194,80" fill="url(#fbr-m-trx)" stroke="#dfb27e" stroke-width="0.8"/>'
        '<polygon points="46,80 120,38 120,95 60,125" fill="url(#inl-m-trx)"/>'
        '<polygon points="120,38 194,80 180,125 120,95" fill="url(#inr-m-trx)"/>'
        '<polygon points="120,95 180,125 120,155 60,125" fill="url(#floor-m-trx)"/>'
        '<polygon points="46,80 120,120 120,186 46,146" fill="url(#fl-m-trx)"/>'
        '<polygon points="120,120 194,80 194,146 120,186" fill="url(#fr-m-trx)"/>'
        '<polygon points="46,80 30,108 107,150 120,120" fill="url(#ffl-m-trx)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polygon points="120,120 133,150 210,108 194,80" fill="url(#ffr-m-trx)" stroke="#e5bd8b" stroke-width="0.8"/>'
        '<polyline points="46,80 120,120 194,80" fill="none" stroke="#fce4c4" stroke-width="1.4" stroke-linecap="round"/>'
        '</svg>'
        '<div class="box-cavity-balls empty-zone cavity-transaction" aria-label="Isi Kardus Transaksi"></div>'
        '</div></div>'
        '</div></details></div>'
        '<div class="boxes-hero-content-panel">'
        '<div class="hero-box-eyebrow">PANDUAN VISUAL KASIRKITA</div>'
        '<h2 class="hero-box-title">Judul: Master &amp; Transaksi</h2>'
        '<div class="hero-box-desc-block">'
        '<p class="hero-box-paragraph master-highlight">'
        '<strong>1. Kotak Master (Kategori, Barang, Pelanggan):</strong><br>'
        'Fungsinya adalah menyimpan kartu acuan paten toko. Sifatnya <strong>datanya jarang berubah</strong> dan menjadi sumber kebenaran utama. Barang dari kotak master <strong>bisa dimasukkan ke dalam kotak master juga</strong> (relasi master ke master, seperti bola Kategori yang dimasukkan ke Kotak Barang untuk memberi label kategori).'
        '</p>'
        '<p class="hero-box-paragraph trans-highlight">'
        '<strong>2. Kotak Transaksi (Penjualan / Nota Kasir):</strong><br>'
        'Fungsinya adalah menampung struk/nota belanja. Sifatnya <strong>isi datanya pasti berubah-ubah dan bertambah terus</strong> (<em>append-only</em>). Setiap detik kasir melayani pembeli, keranjang belanja berganti, jam transaksi bergerak, dan nominal belanja dihitung ulang dengan mencocokkan kode barang ke master.'
        '</p>'
        '</div>'
        '<div class="digital-receipt" aria-live="polite"></div>'
        '<div class="boxes-feedback-log status-ok" aria-live="polite"><span>⚡</span><div>Siap! Klik bola kategori untuk menghubungkan antar-master, atau klik bola produk untuk mulai transaksi.</div></div>'
        '<div class="boxes-action-bar">'
        '<button type="button" class="primary" data-action="boxes-next-trx"><span>⚡</span> Transaksi Baru (Data Berubah-Ubah!)</button>'
        '<button type="button" data-action="boxes-link-master"><span>🏷️</span> Masukkan Kategori ➔ Barang</button>'
        '<button type="button" data-action="boxes-reset"><span>✕</span> Kosongkan Transaksi</button>'
        '</div>'
        '<p style="margin-top:16px; margin-bottom:0;"><a class="pill" href="game/boxes-analogy.html" target="_blank" rel="noopener">Buka simulasi 3D kotak kardus dalam layar penuh ↗</a></p>'
        '</div>'
        '</div>'
        '</section>'
    )

    data_explanation_html = (
        '<h3>Penjelasan Konsep: Empat Kotak di Meja Kasir</h3>'
        '<p>Bayangkan kamu punya empat buah kotak di mejamu: tiga <strong>"Kotak Master (Kategori, Barang, Pelanggan)"</strong> dan satu <strong>"Kotak Transaksi (Penjualan / Nota Belanja)"</strong>.</p>'
        '<div class="cards">'
        '<div class="card">'
        '<h3>1. Kotak-Kotak Master (Entitas Master)</h3>'
        '<p><strong>Fungsi:</strong> Kotak ini berisi tumpukan kartu katalog paten: Kode Kategori, Kode Barang, Nama Barang, Harga Satuan, dan Profil Pelanggan.<br><br>'
        '<strong>Sifat Data:</strong> Kotak master ini <strong>datanya jarang berubah</strong>. Kamu hanya memasukkan kartu baru ketika ada produk baru dari distributor, atau mengganti kartu jika harga resmi naik. Kartu di kotak ini adalah <strong>sumber kebenaran utama</strong> (<em>single source of truth</em>).<br><br>'
        '<strong>Bisa Masuk Antar-Master:</strong> Barang dari kotak master <strong>bisa dimasukkan ke dalam kotak master juga</strong>! Contohnya, kartu Kategori <code>Alat Tulis (K01)</code> dimasukkan ke dalam Kotak Barang untuk melabeli <code>Buku Tulis A5 (P001)</code>. Hubungan master-ke-master ini sah dan sering digunakan dalam database.<br><br>'
        '<strong>Penerapan di C:</strong> Kotak ini disimpan di file master seperti <code>data/kategori.txt</code> dan <code>data/produk.txt</code> dengan struct seperti <code>CategoryMaster</code> dan <code>ProductMaster</code>.</p>'
        '</div>'
        '<div class="card">'
        '<h3>2. Kotak Transaksi (Entitas Transaksi)</h3>'
        '<p><strong>Fungsi:</strong> Kotak ini adalah tempat penampungan nota atau struk belanja dari pelanggan setiap kali terjadi penjualan.<br><br>'
        '<strong>Sifat Data:</strong> Kotak ini <strong>isi datanya PASTI BERUBAH-UBAH dan bertambah terus</strong>. Setiap kali ada yang beli, kasir menulis nota baru lalu menjatuhkannya ke dalam kotak ini sepanjang hari (bertambah terus / <em>append-only</em>). Nomor nota melonjak, barang belanja berganti, dan nominal pembayaran berubah.<br><br>'
        '<strong>Cara Kerja Relasi:</strong> Di lembar nota pesanan, kamu <strong>tidak perlu menulis nama barang atau harganya secara panjang lebar berulang kali</strong>. Cukup menulis <code>"Kode Barang: P001, Jumlah Beli: 2"</code>. Ketika harus menghitung total bayar, kasir memegang nota tersebut lalu mencari kartu <code>"P001"</code> di Kotak Barang untuk melihat harganya.<br><br>'
        '<strong>Penerapan di C:</strong> File <code>transaksi.dat</code> (atau <code>data/penjualan.txt</code>). Isinya adalah tumpukan data <code>struct SaleTransaction</code> yang disimpan dengan mode append (<code>fopen("transaksi.dat", "ab")</code> atau <code>"a"</code>), lalu menggunakan <em>looping</em> untuk mencocokkan kode barang di transaksi dengan master agar bisa mencetak total harga.</p>'
        '</div>'
        '</div>'
        '<h3>Tabel Perbandingan: Master vs Transaksi</h3>'
        + table(
            ['Aspek Pembeda', 'Entitas Master (Kategori, Barang, Pelanggan)', 'Entitas Transaksi (Penjualan & Nota Belanja)'],
            [
                ['Definisi', 'Data acuan dasar yang dipakai berulang kali sebagai patokan.', 'Catatan histori peristiwa/kejadian bisnis pada waktu tertentu.'],
                ['Sifat Perubahan Isi', 'Jarang Berubah (statis, hanya saat pembaruan katalog).', 'Pasti Berubah-Ubah (sangat dinamis, setiap kali ada pembeli).'],
                ['Hubungan Antar-Kotak', 'Bisa masuk ke sesama master (contoh: Kategori ➔ Barang).', 'Meminjam referensi ID dari kotak master untuk nota belanja.'],
                ['Contoh di KasirKita', 'CATEGORY, PRODUCT, CUSTOMER', 'SALE (Header Nota), ITEM (Detail Belanja)'],
                ['Aktor Pengubah', 'Pemilik toko / admin pengelola katalog barang.', 'Kasir yang melayani pembeli di meja kasir.'],
                ['Peran Kunci', 'Menyediakan Primary Key (PK) seperti id_category, id_product.', 'Menyimpan Foreign Key (FK) yang merujuk ke PK Master.'],
                ['Operasi File di C', 'Dibaca berulang kali ("r" / "rb"); diperbarui jika stok berkurang.', 'Ditambah di akhir file ("a" / "ab") secara terus-menerus.'],
                ['Jika File Kosong', 'Aplikasi macet/tidak bisa jualan karena katalog kosong.', 'Aplikasi normal (berarti belum ada penjualan hari ini).']
            ]
        )
        + call('<strong>Inti Pemahaman Analogi:</strong><br>Perbedaan utama bukan semata larangan fisik, melainkan <strong>dinamika stabilitas data</strong>. Data Master disiapkan sebagai fondasi acuan yang jarang berubah (bahkan sesama master bisa saling terhubung seperti Kategori ke Barang), sedangkan Data Transaksi isinya selalu bergerak, berubah, dan bertambah seiring kasir melayani transaksi.')
        + '<h3>Pola Kode C: Struktur Data & Looping Pencocokan</h3>'
        + code('''// 1. DATA MASTER: Disimpan di data/ (Jarang Berubah)
typedef struct {
    char id_category[21];  // K01 (Primary Key Kategori)
    char name[64];         // Alat Tulis
} CategoryMaster;

typedef struct {
    char id_product[21];   // P001 (Primary Key Produk)
    char id_category[21];  // K01 (Foreign Key merujuk Master Kategori: Master ke Master!)
    char name[128];        // Buku Tulis A5
    int price;             // 12000
    int stock;             // 20
} ProductMaster;

typedef struct {
    char id_customer[21];  // C001 (Primary Key Pelanggan)
    char name[128];        // Rani
    char phone[32];        // 0812345678
} CustomerMaster;

// 2. DATA TRANSAKSI: Disimpan di data/penjualan.txt (Mode Append "a" - Pasti Berubah-Ubah)
typedef struct {
    char id_sale[21];      // N001 (Nomor Struk - berubah setiap transaksi)
    char id_customer[21];  // C001 (Foreign Key merujuk Pelanggan)
    char id_product[21];   // P001 (Foreign Key merujuk Produk Master)
    int quantity;          // Berubah sesuai belanjaan pembeli
    int unit_price;        // Harga snapshot saat transaksi
    char timestamp[25];    // Waktu transaksi yang selalu berubah
} SaleTransaction;

// Program C mencocokkan kode barang transaksi dengan data di master:
int hitungSubtotal(SaleTransaction trx, ProductMaster katalog[], int jumlahProduk) {
    for (int i = 0; i < jumlahProduk; i++) {
        if (strcmp(trx.id_product, katalog[i].id_product) == 0) {
            return trx.quantity * katalog[i].price; // Cocokkan harga dari master!
        }
    }
    return 0; // Tidak ditemukan di katalog master
}''', 'Pola C · Master vs Transaksi')
        + '<h3>Skenario yang Digunakan Sepanjang Tutorial</h3>'
        + '<p>Rani membeli 2 Buku A5 seharga Rp12.000 per buku. Total Rp24.000, dibayar Rp30.000, kembalian Rp6.000. Stok buku di Kotak Master berkurang dari 20 menjadi 18, dan satu lembar nota baru tersimpan di Kotak Transaksi.</p>'
    )

    master_transaksi_mode_switcher = (
        '<div class="representation-mode-bar" role="region" aria-label="Pilihan Representasi Master & Transaksi 2D / 3D">'
        '<div class="mode-bar-header">'
        '<div class="mode-bar-tag"><span class="dot"></span> REPRESENTASI DATA KASIRKITA</div>'
        '<h3>Pilih Mode Simulasi: Mode 2D vs Mode 3D</h3>'
        '<p>Pahami perbedaan mendasar antara data acuan (<strong>Master</strong>) dan data pencatatan peristiwa (<strong>Transaksi</strong>) melalui simulasi interaktif:</p>'
        '</div>'
        '<div class="mode-switch-actions">'
        '<a href="game/boxes-2d.html" class="mode-switch-btn" title="Buka mode 2D simulasi kotak kardus interaktif">'
        '<span class="btn-icon">📦🎨</span>'
        '<div class="btn-body">'
        '<strong>Mode 2D</strong>'
        '<small>Simulasi Interaktif Vektor 2D · Ringan &amp; Cepat</small>'
        '</div>'
        '<span class="btn-badge highlight">Buka mode 2D ↗</span>'
        '</a>'
        '<a href="game/boxes-analogy.html" class="mode-switch-btn mode-switch-3d" title="Buka mode 3D simulasi kotak kardus WebGL di halaman terpisah">'
        '<span class="btn-icon">📦✨</span>'
        '<div class="btn-body">'
        '<strong>Mode 3D</strong>'
        '<small>Simulasi Tiga Dimensi WebGL · Orbit Kamera &amp; Fisika</small>'
        '</div>'
        '<span class="btn-badge highlight">Buka mode 3D ↗</span>'
        '</a>'
        '</div>'
        '</div>'
    )

    content['project.html']=[
        step('tema','Tentukan tema project','Mulai dari masalah nyata. KasirKita membantu toko alat tulis mencatat produk, penjualan, dan nota.','Tuliskan masalah, pengguna, dan hasil yang dibutuhkan.',
             '<p>Pilih tema yang dapat diamati: toko, perpustakaan, atau administrasi kursus. Untuk latihan ini gunakan KasirKita: satu toko alat tulis dengan pemilik dan kasir. Rumuskan masalah, pengguna, tujuan, dan contoh kejadian sebelum memilih teknologi.</p>'+table(['Bagian','Contoh KasirKita'],[['Masalah','Stok dan nota manual sulit dicocokkan'],['Pengguna','Kasir dan pemilik'],['Tujuan','Mencatat barang serta penjualan dengan hasil yang dapat diperiksa'],['Contoh','2 Buku A5 @12.000, bayar 30.000: total 24.000, kembali 6.000']]),'Seperti memilih tujuan perjalanan sebelum menentukan kendaraan.'),
        step('platform','Bedakan desktop dan website','Program latihan berjalan di console Windows; website Hello Project menjadi buku panduannya.','Pilih platform dan jelaskan alasannya.',
             table(['Aspek','Desktop / console','Website'],[['Cara akses','Executable pada komputer pengguna','Halaman melalui browser'],['Antarmuka','Jendela atau console terminal','HTML/CSS dan interaksi browser'],['Pembaruan','Distribusi program ke perangkat','Pembaruan aplikasi/server'],['Koneksi','Dapat bekerja lokal','Bergantung arsitektur; website juga dapat dijalankan lokal']])+call('KasirKita yang diajarkan adalah program C console Windows dengan lib.h. Website ini menyampaikan materi, bukan aplikasi kasirnya.'),'Buku di meja dan buku yang dibuka lewat browser sama-sama menyampaikan isi dengan cara berbeda.'),
        step('standalone','Standalone atau terintegrasi?','Tentukan apakah program bekerja sendiri atau bertukar data dengan sistem lain.','Catat sistem lain yang diperlukan, atau nyatakan tidak ada.',
             '<p>Standalone berarti alur utama berdiri sendiri dengan data lokal. Terintegrasi berarti ada pertukaran data dengan layanan lain, misalnya payment gateway atau inventori pusat. Standalone tidak selalu berarti tidak pernah memakai internet.</p><p>Latihan KasirKita berdiri sendiri: satu proses aktif, penyimpanan TXT lokal, pembayaran tunai, dan tidak ada integrasi pihak luar.</p>','Warung mandiri dapat mencatat sendiri; jaringan toko berbagi catatan antar-cabang.'),
        step('scope','Tentukan scope','Scope membatasi apa yang akan dikerjakan dan apa yang ditunda.','Tuliskan fitur wajib dan fitur di luar versi pertama.',
             table(['Termasuk','Di luar latihan'],[['Master kategori, produk, pelanggan','Multi-cabang dan sinkronisasi cloud'],['Penjualan tunai, nota, rekap','Payment gateway, pajak, retur'],['UI console dan validasi','Autentikasi produksi']])+features,'Daftar pesanan membantu menghindari pekerjaan yang terus bertambah.'),
        step('data','Pisahkan master dan transaksi',
             'Master adalah data acuan yang jarang berubah dan bisa masuk antar-master; transaksi adalah pencatatan kejadian yang isi datanya pasti berubah-ubah.',
             'Pahami perbedaan sifat master (statis) dan transaksi (dinamis) di bawah, atau buka simulasi 3D interaktif untuk mencoba langsung.',
             master_transaksi_mode_switcher + data_explanation_html,
             'Empat kotak di meja: kotak kategori, barang, dan pelanggan adalah master yang datanya jarang berubah; kotak transaksi berisi nota belanja yang isinya pasti berubah-ubah setiap menit.'),
        step('atribut','Temukan atribut dari kebutuhan','Cari data yang diperlukan dari formulir, nota, laporan, dan aturan bisnis.','Tentukan tipe dan validasi untuk setiap field produk.',
             '<p>Mulai dari kebutuhan pengguna, bukan menambah kolom tanpa tujuan. Periksa contoh dokumen dan formulir toko untuk menemukan data apa yang harus masuk, disimpan, dan keluar. Atribut dikelompokkan dalam tabel entitas mandiri. Pada tahap identifikasi awal ini, kita hanya mendata atribut alami masing-masing entitas tanpa Foreign Key (relasi antar-entitas akan dibentuk nanti saat perancangan relasi dan normalisasi).</p>'
             + entity_tables_html
             + call('<strong>Sederhana di C:</strong> Gunakan <code>int</code> untuk bilangan bulat (harga, stok, jumlah, bayar) dan array karakter <code>char[N]</code> untuk teks dengan satu slot ekstra terminator NUL <code>\\0</code>. Semua ID memakai <code>char[21]</code> untuk menampung teks hingga 20 karakter. Validasi string juga menolak delimiter | dan newline bila disimpan pada format TXT.'),
             'Seperti menentukan kotak-kotak isian yang benar pada formulir pendaftaran sebelum menghubungkannya.'),
        step('probis','Pahami dan gunakan Probis','Probis menghubungkan aktivitas nyata menjadi input, proses, dan output yang bernilai.','Tuliskan satu proses penjualan dengan aktor, input, aktivitas, dan output.',
             '<p>Proses Bisnis adalah sekumpulan aktivitas terstruktur yang saling berhubungan untuk mengubah input menjadi output demi tujuan organisasi. Probis mencegah aplikasi salah sasaran, membantu menemukan entitas/atribut, serta menjadi dasar kondisi dan percabangan program.</p>'+table(['Komponen','KasirKita'],[['Aktor','Kasir melayani; pemilik mengelola master dan rekap'],['Input','Produk, jumlah pembelian, uang pembayaran'],['Aktivitas','Hitung total, validasi, simpan transaksi dan stok'],['Output','Nota atau pesan kesalahan; rekap penjualan']])+'<h4>As-is dan to-be</h4><p>As-is: kasir menulis nota dan mengurangi stok secara manual. To-be: program membantu menghitung, memeriksa input, menyimpan transaksi, dan menampilkan nota. Dokumen Probis menjadi acuan kebutuhan serta pengujian, bukan sekadar gambar.</p>'+features+'<h4>Flowchart checkout</h4><!--diagram:flowchart-checkout--><h4>ERD awal</h4><!--diagram:erd-awal--><h4>PDM setelah normalisasi</h4><!--diagram:pdm-normalisasi--><h4>PDM setelah denormalisasi</h4><!--diagram:pdm-denormalisasi--><h4>DFD · aliran data</h4><div class="diagram">'+dfd()+'</div>',
             'Seperti resep: siapa yang memasak, bahan yang masuk, langkah kerja, dan makanan yang dihasilkan.'),
        step('activity-plan','Susun Activity Plan','AP merencanakan kegiatan, penanggung jawab, waktu, hasil, dan status project.','Isi AP berdasarkan jadwal timmu sendiri.',
             '<p>Gunakan Activity Plan sebelum coding dan perbarui selama pengerjaan. Pecah kegiatan menjadi pekerjaan yang dapat diperiksa; bandingkan jadwal rencana dengan pelaksanaan. Template AP tersedia untuk diunduh.</p>'+table(['Kegiatan','PIC','Waktu rencana','Hasil','Status'],[['Kebutuhan dan Probis','[nama]','[tanggal]','Scope, atribut, diagram','Belum dimulai'],['Mempelajari lib.h','[nama]','[tanggal]','Latihan fungsi','Belum dimulai'],['Membuat UI ASCII art','[nama]','[tanggal]','File teks dan layar C','Belum dimulai'],['Testing dan dokumen akhir','[nama]','[tanggal]','Bukti, Product Documentation, User Guide','Belum dimulai']])+checks(['Tema, platform, integrasi, dan scope ditentukan.','Master, transaksi, atribut, dan validasi konsisten.','Probis serta AP siap menjadi acuan.']),
             'Seperti jadwal kerja toko yang menetapkan pekerjaan, petugas, dan waktu.')
    ]
    stories['sdlc']=dict(title='Lihat perjalanan SDLC',explanation='SDLC menggambarkan siklus pengembangan project, bukan urutan membaca modul. Tahap pengujian bisa mengembalikan pekerjaan ke implementasi.',analogy='Seperti merancang, membuat, mencoba, dan merawat sebuah rak.',action='Temukan jalur perbaikan dari pengujian kembali ke implementasi.')
    content['analisis.html']=[
        step('user-testing','Kerjakan user testing','Uji penggunaan nyata dan catat hasil aktual dari orang yang menjalankan program.','Buat satu kasus normal dan satu kasus input salah.',
             '<p>Identifikasi penguji dan lingkungan, siapkan data awal, tuliskan langkah serta ekspektasi, lalu jalankan program. Isi hasil test, tester, tanggal, bukti, dan keterangan sesuai kejadian. Jika gagal, tulis defect dan uji ulang setelah perbaikan.</p>'+table(['Kasus','Langkah','Ekspektasi','Hasil aktual'],[['Normal','Beli 2 buku @12.000, bayar 30.000','Total 24.000, kembali 6.000','Belum diuji'],['Input salah','Masukkan qty huruf atau negatif','Ditolak, pesan jelas, data tidak berubah','Belum diuji'],['Simpan gagal','Coba saat file tidak dapat ditulis','Tidak menyatakan sukses atau membuat nota baru','Belum diuji']])+call('Jangan mengisi Diterima atau Lulus sebelum percobaan benar-benar dijalankan. Contoh PDF merupakan referensi format, bukan bukti KasirKita telah lulus.'),'Seperti meminta pelanggan mencoba meja kasir sebelum digunakan rutin.'),
        step('proposal','Susun proposal project','Proposal menjelaskan masalah, tujuan, solusi, dan rencana kegiatan agar project dapat dipahami.','Tulis latar belakang dan tujuan yang dapat diperiksa.',
             table(['Bagian','Isi'],[['Identitas','Judul, tim, versi, tanggal'],['Latar belakang','Masalah toko dan dampaknya'],['Tujuan dan manfaat','Hasil yang ditargetkan dan pengguna'],['Scope dan solusi','Fitur serta batasan; C console standalone'],['Rencana kegiatan','Metode, Activity Plan, sumber daya'],['Hasil yang ditargetkan','Program, dokumen, dan bukti testing']])+ '<p>Materi ini panduan umum; belum ada template proposal khusus. Proposal dapat disiapkan sejak awal dan diperbarui untuk penyerahan. Bedakan target dalam proposal dari hasil aktual pada dokumentasi produk.</p>',
             'Seperti menjelaskan alasan dan rencana sebelum menjalankan kegiatan toko.'),
        step('product-documentation','Lengkapi Product Documentation','Dokumentasi produk menjelaskan apa yang dibangun, bagaimana dirancang, dan hasil pengujiannya.','Cocokkan isi dokumen dengan versi program yang benar-benar dibuat.',
             table(['Bagian template','Isi yang dilengkapi'],[['Product Identification / Revision History','Nama produk, pemilik, tanggal, versi, penulis'],['Introduction','Nama, deskripsi, tujuan, stakeholders'],['Development Process','As-is/to-be, scope, kebutuhan pengguna, use case, workflow, metodologi, AP'],['Development and Operational Architecture','Kebutuhan lingkungan pengembangan dan penggunaan'],['Design','PDM dan UI/UX yang sesuai program'],['Testing','Skenario, hasil aktual, kegagalan dan tindak lanjut'],['Technical Documentation','Definisi menu/fungsi, pengguna, data, fungsi C, software dan lisensi'],['Appendix A / B','User Requirement Definition dan Testing Scenario']])+call('Template menyebut API dan DBMS. Untuk latihan C/TXT tanpa API/DBMS, tulis Tidak digunakan dan jelaskan fungsi C serta format file. Contoh klaim performa atau keamanan pada template bukan hasil atau kewajiban yang otomatis berlaku bagi KasirKita.'),
             'Seperti catatan pembuatan dan pemeriksaan sebuah alat.'),
        step('user-guide','Buat User Guide','User Guide membantu pengguna menjalankan tugas tanpa membaca source code.','Tulis langkah penggunaan satu menu disertai hasil dan cara memperbaiki kesalahan.',
             table(['Bagian template','Isi KasirKita'],[['Identitas dan Introduction','Nama produk, versi, tanggal, tujuan panduan'],['Resource Requirements','Software, hardware, dan jaringan; jelaskan standalone'],['Installation and Setup','Folder, executable, lokasi data, cara menjalankan'],['Menu and How to Use','Struktur menu, pengguna, langkah, input, hasil, screenshot'],['Troubleshooting and FAQs','File hilang, input tidak valid, console terlalu kecil, solusi'],['Revision History','Versi, tanggal, perubahan, penulis']])+call('Gunakan bahasa pengguna, bukan jargon implementasi. Screenshot dan langkah harus mengikuti program versi yang didokumentasikan.')+checks(['Testing memiliki hasil aktual dan bukti.','Proposal membedakan rencana dari pencapaian.','Product Documentation mengikuti template pengguna.','User Guide bisa diikuti pengguna lain.']),
             'Seperti petunjuk pemakaian alat yang bisa diikuti tanpa pembuatnya.')
    ]
    library={a:(a,h,b) for a,h,b in content['teknis.html']}
    stories['lib-review']['explanation']='Koreksi salinan header sebelum compile pertama, lalu periksa batas input dan pembacaan file.'
    stories['lib-review']['action']='Ganti blok BACKSPACE pada empat fungsi input di salinan include/lib.h.'
    folder=step('folder','Siapkan struktur folder','Pisahkan file C, header library, ASCII art, dan executable.','Simpan lib.h di include dan main.c di src.',code('''kasirkita/
├── include/lib.h
├── src/main.c
├── assets/ascii/judul.txt
├── build/latihan.exe
└── docs/''','Struktur latihan')+ '<p>Gunakan satu file C pada latihan awal karena lib.h berisi definisi fungsi. Jalankan executable dari root project agar path assets/ascii/judul.txt dapat ditemukan.</p>', 'Seperti menyediakan rak berbeda untuk alat dan bahan.')
    setup=library['lib-setup']
    stories['lib-setup']['action']='Simpan src/main.c dan include/lib.h, lalu compile dari root project.'
    setup_body=setup[2].replace('pada folder latihan yang sama','pada folder include dan src sesuai struktur latihan').replace('gcc -std=c17 -Wall -Wextra main.c -o latihan.exe','New-Item -ItemType Directory -Force build\ngcc -std=c17 -Wall -Wextra -Iinclude src/main.c -o build/latihan.exe').replace('.\\latihan.exe','.\\build\\latihan.exe')
    setup_body='<p><strong>Sebelum compile pertama:</strong> unduh lib.h asli, buat salinan di include/lib.h, lalu terapkan koreksi BACKSPACE pada empat fungsi input di <a href="#lib-review">pemeriksaan library</a>. Semua definisi dalam header ikut dikompilasi meskipun fungsi tersebut belum dipanggil.</p>'+setup_body
    setup_body=setup_body.replace('New-Item -ItemType Directory -Force build', 'gcc --version\nNew-Item -ItemType Directory -Force build').replace('-o build/latihan.exe','-o build/latihan.exe -luser32').replace('PowerShell · pada folder latihan','PowerShell · dari root kasirkita')
    setup_body+='<p>Prasyarat: Windows, editor teks, dasar variabel/fungsi C, dan GCC Windows (MinGW-w64) yang dapat dipanggil dari PowerShell. Jika gcc tidak dikenali, periksa pemasangan compiler dan PATH lalu buka terminal baru. Opsi -Iinclude mencari header; -luser32 menghubungkan fungsi Windows yang digunakan library.</p><p><strong>Hasil yang diharapkan:</strong> teks Halo dari lib.h muncul pada (2, 2), program menunggu satu tombol, lalu keluar. Jalankan executable hanya setelah compile berhasil; jika gagal, periksa pesan compiler agar tidak menjalankan executable lama.</p><p><a href="https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-keybd_event" target="_blank" rel="noopener">Referensi Windows: kebutuhan User32</a></p>'
    placements={
        'lib-position':'Letakkan perintah berikut di dalam main, menggantikan pemanggilan gotoPrintString pada latihan pertama. Pertahankan includes, getch() dan return 0. KASIRKITA mulai di (4, 3), label di (4, 5), dan penanda di (3, 5).',
        'lib-border':'Letakkan perintah berikut di dalam main sebelum getch(), menggantikan latihan posisi. Pertahankan includes dan return 0; panggil showCursor() setelah getch() sebelum keluar. Periksa bingkai dari (2, 1) sampai (62, 16) dan judul di (5, 3).',
        'lib-input':'Gunakan salinan header yang sudah dikoreksi pada pemeriksaan library. Letakkan deklarasi dan perintah berikut di dalam main sebelum getch(), menggantikan latihan bingkai. Pertahankan includes dan return 0. Contoh ini membaca nama serta jumlah, belum menyimpan transaksi.'
    }
    for anchor,note in placements.items():
        a,h,b=library[anchor]
        library[anchor]=(a,h,'<p>'+note+'</p>'+b)
    a,h,b=library['lib-input']
    library[a]=(a,h,b.replace('langkah berikutnya','langkah pemeriksaan sebelumnya')+'<p><strong>Coba:</strong> ketik BukuX, tekan BACKSPACE sekali, lalu ENTER; buffer nama harus berisi Buku. Masukkan 2 untuk jumlah, lalu coba 0: pesan Jumlah harus lebih dari nol harus terlihat. Helper angka menghasilkan int; contoh dibatasi tiga digit (0–999). Data model memakai int untuk angka, sehingga scanner ini membaca angka bulat dengan sederhana.</p>')

    a,h,b=library['lib-review']
    b='<p><strong>Kerjakan sebelum compile pertama.</strong> Empat lokasi berada pada scanInputString, scanInputText, scanInputPassword, dan scanInputNumber. Di setiap cabang BACKSPACE, ganti blok if (i &gt; 0) yang berisi text[i] = "" dengan pola lengkap di bawah; jangan menyisipkannya sebagai blok tambahan.</p>'+b
    b=b.replace('Kurangi i lalu tulis text[i] = \\0 sebagai karakter NUL',"Kurangi i lalu tulis <code>text[i] = '\\0';</code> sebagai karakter NUL")
    b+='<p>Koreksi BACKSPACE menghilangkan kesalahan assignment tersebut, tetapi tidak menjamin seluruh fungsi sudah benar. Untuk latihan input, periksa juga batas buffer dan perilaku ESC pada tabel. Untuk file TXT, gunakan <a href="testing.html#ascii-c">pengganti PrintTxt lengkap di modul 4</a>. Rincian tersedia pada <a href="dokumentasi-lib.html#perbaikan-status">catatan dokumentasi library</a>.</p>'
    library[a]=(a,h,b)
    content['teknis.html']=[folder,library['lib-intro'],library['lib-review'],(setup[0],setup[1],setup_body),library['lib-position'],library['lib-border'],library['lib-input']]
    art_example=code('''+------------------------------+
|          KASIRKITA           |
|       TOKO ALAT TULIS        |
+------------------------------+''','assets/ascii/judul.txt')
    content['testing.html']=[
        step('ui-sketch','Siapkan gambar untuk ASCII art','Pilih gambar sederhana yang tetap terbaca saat diubah menjadi karakter.','Pilih satu gambar dengan bentuk dan kontras yang jelas.',docs+'<p>Gunakan gambar milikmu sendiri atau yang boleh dipakai. Bentuk sederhana lebih mudah dibaca di console. Tentukan area tampilan: contoh latihan console 80 kolom × 25 baris, dengan ruang untuk judul dan menu.</p>','Seperti membuat papan nama yang harus terbaca dari jauh.'),
        step('ascii-convert','Ubah gambar menjadi ASCII art','Gunakan converter untuk menghasilkan teks dari gambar.','Atur hasil agar muat dalam lebar terminal.',
             '<p><a class="pill" href="https://www.asciiart.eu/image-to-ascii" target="_blank" rel="noopener noreferrer">Buka Image to ASCII</a></p><ol><li>Pilih gambar melalui area upload.</li><li>Sesuaikan Characters untuk detail dan lebar hasil.</li><li>Atur brightness dan contrast sampai objek terlihat.</li><li>Periksa preview; kurangi detail jika hasil terlalu lebar.</li><li>Gunakan Copy to Clipboard atau ekspor Txt. Simpan sebagai assets/ascii/judul.txt, bukan PNG.</li></ol><p>ASCII gradient dapat diubah untuk karakter yang dipakai. Untuk console latihan pilih karakter ASCII biasa, gunakan font monospace, dan jangan menghapus spasi pada hasil.</p>'+art_example,
             'Seperti menyusun gambar dari titik dan huruf pada kertas petak.'),
        step('ascii-c','Letakkan ASCII art di program C','PrintTxt menampilkan baris teks mulai dari koordinat yang dipilih.','Panggil PrintTxt untuk judul.txt dari root project.',
             '<p>Pada salinan include/lib.h, ganti seluruh fungsi PrintTxt lama dengan fungsi berikut. Jangan menambah definisi kedua dan jangan menempelkannya ke main.c. Lihat juga <a href="dokumentasi-lib.html#PrintTxt">dokumentasi PrintTxt</a>.</p>'+code('''void PrintTxt(int x, int y, char txtFile[100]) {
    char text[255];
    int baris = 0;
    FILE *file = fopen(txtFile, "r");
    if (file == NULL) {
        gotoPrintString(x, y, "File ASCII art tidak dapat dibuka.");
        return;
    }
    while (fgets(text, sizeof(text), file) != NULL) {
        gotoxy(x, y + baris);
        printf("%s", text);
        ++baris;
    }
    fclose(file);
}''','Pengganti lengkap PrintTxt · salinan include/lib.h')+'<p>Simpan contoh lengkap berikut sebagai src/main.c. Header salinan juga harus sudah mendapat koreksi dari <a href="teknis.html#lib-review">modul 3</a>. Compile ulang dengan perintah di <a href="teknis.html#lib-setup">pemasangan library</a>.</p>'+code('''#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <conio.h>
#include <wchar.h>
#include <ctype.h>
#include "lib.h"

int main(void) {
    hideCursor();
    PrintTxt(4, 2, "assets/ascii/judul.txt");
    gotoxy(4, 10);
    printf("Tekan tombol untuk keluar.");
    getch();
    showCursor();
    return 0;
}''','src/main.c · contoh lengkap')+call('Path relatif dihitung dari direktori kerja, bukan lokasi file .c atau .exe. Jalankan .\\build\\latihan.exe dari root project. PrintTxt membaca buffer 255 byte; jaga setiap baris ASCII art di bawah 254 byte. Pastikan x + lebar dan y + tinggi muat dalam console.')+'<p>Hasil yang diharapkan: empat baris judul contoh mulai di (4, 2), pesan keluar di (4, 10), lalu satu tombol menutup program. Untuk uji file hilang, ubah nama judul.txt sementara; setelah percobaan, pulihkan namanya. Catat pesan yang benar-benar muncul.</p><p>Jika ASCII art lebih dari 7 baris, pindahkan pesan keluar ke baris yang tidak bertumpuk. Jangan memakai trim yang menghapus spasi kiri; spasi membentuk gambar.</p>'+'<div class="download-card uat-sim-card" style="margin-top:16px;border-color:rgba(168,85,247,0.4);background:linear-gradient(135deg,rgba(13,23,37,0.9),rgba(147,51,234,0.12));"><div><span class="download-label" style="background:#7c3aed;color:#fff;">STAGING ASCII ART & CONSOLE · FULLSCREEN</span><h3 style="color:#d8b4fe;">ASCII Art Stager di Terminal Studio</h3><p>Uji penempatan ASCII Art banner toko KasirKita di koordinat console 80×25. Pratinjau susunan header, box border, dan menu tombol sebelum dipindahkan ke file <code>main.c</code>.</p></div><a class="pill" href="game/terminal-studio.html#stager" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;font-weight:700;">🎨 Buka ASCII Art Stager ↗</a></div>',
             'Koordinat adalah alamat kotak tempat gambar ditempel.'),
        step('ascii-check','Periksa hasil tampilannya','Uji file, ukuran, posisi, dan keterbacaan sebelum memakai art pada layar utama.','Coba file hilang dan console berbeda ukuran.',
             checks(['ASCII art tersimpan sebagai TXT dan spasinya utuh.','File dapat ditemukan dari direktori kerja.','Koordinat dan ukuran gambar muat dalam console.','Font monospace dipakai dan baris tidak terpotong.','File hilang menghasilkan pesan terkontrol.','Screenshot dan hasil aktual dicatat dalam user testing.']),
             'Seperti mengecek papan nama sebelum dipasang di toko.')
    ]
    def append(page,anchor,extra):
        for i,(a,h,b) in enumerate(content[page]):
            if a==anchor:
                content[page][i]=(a,h,b+extra)
                return
        raise ValueError(anchor)
    append('project.html','activity-plan','<p><strong>Hasil modul 1:</strong> satu dokumen persiapan berisi masalah dan scope, tabel Probis (aktor, input, aktivitas, output, fitur), daftar atribut beserta validasinya, serta AP dengan PIC dan tanggal rencana yang nyata. Periksa satu alur penjualan dari kebutuhan sampai hasil yang diharapkan bersama pengajar.</p>')
    a,h,b=content['analisis.html'][0]
    content['analisis.html'][0]=(a,h,'<p><strong>Kapan dikerjakan?</strong> Siapkan kasus uji dan kerangka dokumen sekarang. Setelah latihan program tersedia, kembali ke modul ini untuk menjalankan uji, mengisi hasil aktual, dan mengambil screenshot. Nomor modul mengelompokkan materi; hasil testing mengikuti waktu pelaksanaan.</p>'+b+table(['Kasus','Kondisi awal','Pemeriksaan sesudah uji'],[['Normal','Produk P001: stok 20, harga 12.000; jumlah 2, bayar 30.000','Target: stok 18; SALE dan ITEM cocok dengan nota, kembali 6.000'],['Input salah','Catat isi record dan stok sebelum uji','Target: record dan stok tidak berubah'],['Simpan gagal','Gunakan salinan data latihan; catat record/stok, lalu buat lokasi simpan tidak dapat ditulis','Target: tidak ada nota sukses atau penyimpanan sebagian; bandingkan SALE, ITEM, dan stok, catat kegagalan aktual']])+'<p>Kasus checkout adalah rancangan uji untuk program yang dibuat bersama pengajar. Latihan satu file C pada modul 3–4 belum mengimplementasikan checkout. Jika fiturnya belum tersedia, tulis Belum dapat diuji beserta alasannya. Pulihkan izin/lokasi file setelah uji pada data salinan.</p>')
    append('analisis.html','product-documentation','<p><strong>Contoh isi teknis:</strong> fungsi PrintTxt membaca assets/ascii/judul.txt relatif terhadap direktori kerja; salinan fungsi memeriksa hasil fopen sebelum fgets. Sertakan versi source, rancangan layar, dan hasil uji file hilang setelah percobaan dilakukan.</p>')
    append('analisis.html','user-guide','<p><strong>Contoh petunjuk pengguna untuk kejadian yang sama:</strong> buka PowerShell di folder kasirkita, jalankan .\\build\\latihan.exe. Jika judul tidak tampil dan muncul pesan file tidak dapat dibuka, periksa assets/ascii/judul.txt serta folder tempat program dijalankan. Pengguna tidak perlu membaca implementasi PrintTxt.</p><p><strong>Hasil modul 2:</strong> proposal, Product Documentation, dan User Guide yang merujuk versi yang sama, beserta catatan testing. Pada tahap persiapan, kerangka dan kasus uji cukup; setelah program dicoba, lengkapi hasil aktual, bukti, defect, serta hasil uji ulang tanpa mengarang status lulus.</p>')
    append('teknis.html','lib-input','<p><strong>Hasil modul 3:</strong> folder latihan berisi satu main.c, salinan lib.h dengan catatan koreksi, aset TXT, dan executable yang dihasilkan compile berhasil. Perlihatkan teks pada koordinat yang dipilih serta catat hasil percobaan BACKSPACE dan jumlah nol.</p>')
    append('testing.html','ascii-check','<p><strong>Hasil modul 4:</strong> assets/ascii/judul.txt, src/main.c pemanggil, dan screenshot console dengan judul serta pesan keluar yang tidak bertumpuk. Catat direktori kerja, ukuran console, dan hasil aktual percobaan file hilang untuk dimasukkan ke dokumen testing.</p>')

def dfd():
    return '''<svg viewBox="0 0 1100 400" role="img" aria-label="DFD KasirKita: kasir dan pemilik bertukar data dengan proses master, penjualan, serta laporan. Data disimpan pada record TXT."><defs><marker id="dfd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 1L7 4L0 7" fill="#b2c1d5"/></marker></defs><g fill="none" stroke="#b2c1d5" marker-end="url(#dfd-arrow)"><path d="M210 180H390"/><path d="M570 120H770"/><path d="M770 220H570"/><path d="M390 245H210"/></g><g fill="#0d1725" stroke="#34465e"><rect x="30" y="120" width="180" height="150" rx="6"/><rect x="390" y="60" width="180" height="240" rx="30"/><path d="M770 70H1030M790 70V290M770 290H1030"/></g><g fill="#edf3fc" font-size="16" text-anchor="middle"><text x="120" y="165">Kasir / Pemilik</text><text x="480" y="108">KasirKita</text><text x="480" y="165">1. Kelola master</text><text x="480" y="200">2. Penjualan</text><text x="480" y="235">3. Laporan</text><text x="910" y="130">D1: CATEGORY,</text><text x="910" y="165">PRODUCT, CUSTOMER</text><text x="910" y="220">D2: SALE, ITEM</text></g><g fill="#b2c1d5" font-size="13"><text x="230" y="163">master, item, uang</text><text x="220" y="275">nota, laporan, error</text><text x="610" y="103">simpan data</text><text x="610" y="247">baca data</text></g></svg>'''
