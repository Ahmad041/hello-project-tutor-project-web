const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

test('boxes analogy files exist and have clean separation between 2D concept and 3D simulation', () => {
  const cssFile = path.join(rootDir, 'assets/css/boxes-analogy.css');
  const jsFile = path.join(rootDir, 'assets/js/boxes-analogy.js');
  const gameFile = path.join(rootDir, 'game/boxes-analogy.html');
  const game2dFile = path.join(rootDir, 'game/boxes-2d.html');
  const projectHtml = path.join(rootDir, 'project.html');

  assert.ok(fs.existsSync(cssFile), 'assets/css/boxes-analogy.css must exist');
  assert.ok(fs.existsSync(jsFile), 'assets/js/boxes-analogy.js must exist');
  assert.ok(fs.existsSync(gameFile), 'game/boxes-analogy.html must exist');
  assert.ok(fs.existsSync(game2dFile), 'game/boxes-2d.html must exist');
  assert.ok(fs.existsSync(projectHtml), 'project.html must exist');

  // 1. project.html: Bagian Master & Transaksi (Step 06, id="data")
  const projectContent = fs.readFileSync(projectHtml, 'utf8');
  assert.match(projectContent, /id="data"/, 'project.html must contain data step for master and transaction');
  assert.match(projectContent, /Pisahkan master dan transaksi/, 'project.html must contain master & transaction title');
  assert.match(projectContent, /representation-mode-bar/, 'project.html must contain 2D/3D representation mode switcher');
  assert.match(projectContent, /Buka mode 2D/, 'project.html must have button Buka mode 2D');
  assert.match(projectContent, /Buka mode 3D/, 'project.html must have button Buka mode 3D');
  assert.match(projectContent, /game\/boxes-2d\.html/, 'project.html must link to game/boxes-2d.html for Mode 2D Simulator');
  assert.match(projectContent, /game\/boxes-analogy\.html/, 'project.html must link to game/boxes-analogy.html for Mode 3D');
  // project.html should NOT be spammed with 3D canvas viewport or OrbitControls scripts
  assert.doesNotMatch(projectContent, /boxes-3d-viewport/, 'project.html must not embed heavy 3D canvas inline');
  assert.doesNotMatch(projectContent, /assets\/js\/boxes-analogy\.js/, 'project.html must not load boxes-analogy.js directly');

  // 2. game/boxes-analogy.html: Halaman khusus 3D Simulasi Interaktif
  const gameContent = fs.readFileSync(gameFile, 'utf8');
  assert.match(gameContent, /boxes-3d-viewport/, 'game/boxes-analogy.html must contain 3D WebGL viewport');
  assert.match(gameContent, /jarang berubah/i, 'game/boxes-analogy.html must emphasize static master nature');
  assert.match(gameContent, /pasti berubah-ubah/i, 'game/boxes-analogy.html must emphasize dynamic transaction nature');
  assert.match(gameContent, /representation-mode-bar/, 'game/boxes-analogy.html must have representation mode bar');
  assert.match(gameContent, /Buka mode 2D/, 'game/boxes-analogy.html must contain button Buka mode 2D');
  assert.match(gameContent, /boxes-2d\.html/, 'game/boxes-analogy.html must link to boxes-2d.html');
  assert.match(gameContent, /\.\.\/project\.html#data/, 'game/boxes-analogy.html must link back to project.html#data');
  assert.doesNotMatch(gameContent, /probis\.html/, 'game/boxes-analogy.html must not reference probis.html');
  assert.doesNotMatch(gameContent, /boxes-accessible-deck/, 'game/boxes-analogy.html must not contain 2D card deck clutter');

  // 3. game/boxes-2d.html: Halaman khusus 2D Simulasi Vektor Interaktif
  const game2dContent = fs.readFileSync(game2dFile, 'utf8');
  assert.match(game2dContent, /cavity-category/, 'game/boxes-2d.html must contain category cavity');
  assert.match(game2dContent, /cavity-product/, 'game/boxes-2d.html must contain product cavity');
  assert.match(game2dContent, /cavity-customer/, 'game/boxes-2d.html must contain customer cavity');
  assert.match(game2dContent, /cavity-transaction/, 'game/boxes-2d.html must contain transaction cavity');
  assert.match(game2dContent, /digital-receipt/, 'game/boxes-2d.html must contain digital receipt');
  assert.match(game2dContent, /Buka mode 3D/, 'game/boxes-2d.html must contain button Buka mode 3D');
  assert.match(game2dContent, /boxes-analogy\.html/, 'game/boxes-2d.html must link to boxes-analogy.html (Mode 3D)');
  assert.match(game2dContent, /\.\.\/project\.html#data/, 'game/boxes-2d.html must link back to project.html#data');
  assert.doesNotMatch(game2dContent, /boxes-3d-viewport/, 'game/boxes-2d.html must not contain heavy 3D canvas viewport');
  assert.doesNotMatch(game2dContent, /probis\.html/, 'game/boxes-2d.html must not reference probis.html');

  // 3. probis.html: Harus bersih dari analogi kotak master & transaksi
  const probisHtml = path.join(rootDir, 'probis.html');
  assert.ok(fs.existsSync(probisHtml), 'probis.html must exist');
  const probisContent = fs.readFileSync(probisHtml, 'utf8');
  assert.doesNotMatch(probisContent, /representation-mode-bar/, 'probis.html must NOT contain master/transaksi mode switcher');
  assert.doesNotMatch(probisContent, /boxes-analogy\.html/, 'probis.html must NOT link to boxes analogy');

  // 4. daftarisi.html: Tidak boleh ada entri tambahan (tetap 9 langkah)
  const daftarisiHtml = path.join(rootDir, 'daftarisi.html');
  const daftarisiContent = fs.readFileSync(daftarisiHtml, 'utf8');
  assert.doesNotMatch(daftarisiContent, /boxes-analogy\.html/, 'daftarisi.html must not include separate entry for boxes analogy');

  // 5. boxes-analogy.js: Anti-clipping dan rasio canvas sprite dinamis
  const jsContent = fs.readFileSync(jsFile, 'utf8');
  assert.match(jsContent, /measureText/, 'boxes-analogy.js must measure text width to prevent sprite clipping');
  assert.match(jsContent, /aspectRatio/, 'boxes-analogy.js must compute aspect ratio to avoid distortion');
});

test('master and transaction rules: master-to-master relation and volatile transaction data', () => {
  // 1. Data Master: Jarang Berubah
  const MASTER_CATEGORIES = [
    { id: 'K01', name: 'Alat Tulis' },
    { id: 'K02', name: 'Makanan & Snack' }
  ];

  // Master ke Master: Produk dapat memasukkan Kategori ke dalamnya
  const MASTER_PRODUCTS = [
    { id: 'P001', id_category: 'K01', name: 'Buku Tulis A5', price: 12000 },
    { id: 'P002', id_category: 'K01', name: 'Pensil 2B', price: 3000 },
    { id: 'P003', id_category: 'K02', name: 'Roti Cokelat', price: 8000 }
  ];

  const MASTER_CUSTOMERS = [
    { id: 'C001', name: 'Rani' },
    { id: 'C002', name: 'Pak Budi' }
  ];

  // Verifikasi relasi Master ke Master (Kategori ke Produk)
  for (const prod of MASTER_PRODUCTS) {
    const cat = MASTER_CATEGORIES.find(c => c.id === prod.id_category);
    assert.ok(cat, `Product ${prod.id} must reference an existing category in master`);
  }

  // 2. Data Transaksi: Pasti Berubah-Ubah
  const transactions = [
    {
      id_sale: 'N001',
      customer: MASTER_CUSTOMERS[0], // Rani
      items: [
        { id_product: 'P001', qty: 2 },
        { id_product: 'P002', qty: 1 }
      ]
    },
    {
      id_sale: 'N002',
      customer: MASTER_CUSTOMERS[1], // Pak Budi
      items: [
        { id_product: 'P003', qty: 3 },
        { id_product: 'P002', qty: 2 }
      ]
    }
  ];

  // Hitung subtotal tiap transaksi dengan mencocokkan kode barang ke Master
  function calcTotal(trx) {
    return trx.items.reduce((sum, item) => {
      const p = MASTER_PRODUCTS.find(prod => prod.id === item.id_product);
      return sum + (p.price * item.qty);
    }, 0);
  }

  const totalN001 = calcTotal(transactions[0]);
  const totalN002 = calcTotal(transactions[1]);

  assert.equal(totalN001, 27000); // (2 * 12000) + (1 * 3000) = 27000
  assert.equal(totalN002, 30000); // (3 * 8000) + (2 * 3000) = 30000

  // Karakteristik: Isi transaksi pasti berubah-ubah di setiap peristiwa belanja
  assert.notEqual(transactions[0].id_sale, transactions[1].id_sale, 'Receipt numbers must differ');
  assert.notEqual(transactions[0].customer.id, transactions[1].customer.id, 'Customers can differ');
  assert.notEqual(totalN001, totalN002, 'Transaction totals must reflect varying cart content');

  // Karakteristik: Data master tetap stabil dan utuh
  assert.equal(MASTER_PRODUCTS.length, 3, 'Master products count remains stable');
  assert.equal(MASTER_CATEGORIES.length, 2, 'Master categories count remains stable');
});
