const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const UatEngine = require('../assets/js/uat-engine.js');

test('UatEngine contains exactly 18 official scenarios matching Lampiran C PDF', () => {
  assert.equal(UatEngine.SCENARIOS.length, 18, 'Must have exactly 18 scenarios');
  
  const expectedIds = [
    'MS002', 'MS003', 'MS001',
    'PRD002', 'PRD003', 'PRD004', 'PRD005', 'PRD001',
    'PRD010', 'PRD011', 'PRD012', 'PRD013',
    'PRD006', 'PRD007', 'PRD008', 'PRD009', 'PRD014', 'PRD015'
  ];
  
  expectedIds.forEach(id => {
    const sc = UatEngine.SCENARIOS.find(s => s.id === id);
    assert.ok(sc, `Scenario ${id} should exist`);
    assert.equal(sc.tester, 'RPN & SDA', `Scenario ${id} tester should be RPN & SDA`);
  });
});

test('UatEngine enforces Negative-First Gatekeeper on Login Admin (MS001 blocked until MS002 and MS003 pass)', () => {
  const session = UatEngine.createSession();
  
  // Try positive MS001 first -> MUST BE BLOCKED
  const blockedRes = session.executeScenario('MS001');
  assert.equal(blockedRes.success, false);
  assert.equal(blockedRes.blocked, true, 'MS001 must be blocked while negative cases are pending');
  assert.match(blockedRes.message, /terkunci/i);

  // Execute Negative MS002 (Password Salah)
  const ms002Res = session.executeScenario('MS002');
  assert.equal(ms002Res.success, true);
  assert.equal(ms002Res.feedback, 'Username atau password salah');

  // Still blocked because MS003 is not passed yet
  const stillBlockedRes = session.executeScenario('MS001');
  assert.equal(stillBlockedRes.blocked, true);

  // Execute Negative MS003 (Akun Tidak Ada)
  const ms003Res = session.executeScenario('MS003');
  assert.equal(ms003Res.success, true);
  assert.equal(ms003Res.feedback, 'Akun tidak ditemukan');

  // Now MS001 is unlocked!
  assert.equal(session.isPositiveUnlocked('login'), true);
  const ms001Res = session.executeScenario('MS001');
  assert.equal(ms001Res.success, true);
  assert.match(ms001Res.feedback, /berhasil/i);
});

test('UatEngine validates Product Add validation rules and prevents duplicate codes', () => {
  const session = UatEngine.createSession();

  // PRD002: Kode duplikat
  const prd002 = session.executeScenario('PRD002', { code: 'PRD-0001' });
  assert.equal(prd002.success, true);
  assert.equal(prd002.feedback, 'Kode produk sudah digunakan');

  // PRD003: Nama kosong
  const prd003 = session.executeScenario('PRD003', { name: '' });
  assert.equal(prd003.success, true);
  assert.equal(prd003.feedback, 'Nama produk wajib diisi');

  // PRD004: Harga negatif
  const prd004 = session.executeScenario('PRD004', { price: '-5000' });
  assert.equal(prd004.success, true);
  assert.equal(prd004.feedback, 'Harga harus lebih dari 0');

  // PRD005: Harga teks bukan angka
  const prd005 = session.executeScenario('PRD005', { price: 'delapan belas ribu' });
  assert.equal(prd005.success, true);
  assert.equal(prd005.feedback, 'Harga harus berupa angka');

  // All 4 negative pass -> PRD001 unlocked!
  assert.equal(session.isPositiveUnlocked('product_add'), true);
  const prd001 = session.executeScenario('PRD001', {
    code: 'PRD-0001',
    name: 'Minyak Goreng 1L',
    category: 'Sembako',
    price: 18000,
    stock: 25,
    unit: 'Botol',
    desc: 'Minyak goreng kemasan 1 liter',
    status: 'Aktif'
  });
  assert.equal(prd001.success, true);
  assert.equal(prd001.feedback, 'Produk berhasil ditambahkan');
});

test('UatEngine supports session reset and restoration from localStorage array', () => {
  const session = UatEngine.createSession(['MS002', 'MS003']);
  assert.equal(session.isScenarioPassed('MS002'), true);
  assert.equal(session.isScenarioPassed('MS003'), true);
  assert.equal(session.isScenarioPassed('MS001'), false);
  assert.equal(session.isPositiveUnlocked('login'), true);

  session.reset();
  assert.equal(session.isScenarioPassed('MS002'), false);
  assert.equal(session.isPositiveUnlocked('login'), false);
});

test('game/uat.html and uat-game.js conform to Dokumen User Testing (UT) specification and Image 2 columns', () => {
  const fs = require('fs');
  const htmlPath = path.join(__dirname, '..', 'game', 'uat.html');
  const jsPath = path.join(__dirname, '..', 'assets', 'js', 'uat-game.js');
  const cssPath = path.join(__dirname, '..', 'assets', 'css', 'uat-game.css');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Assert Title & Headers reflect User Testing (UT)
  assert.match(html, /<title>User Testing \(UT\) Bug Hunter Simulator/i);
  assert.match(html, /<h3>DOKUMEN USER TESTING \(UT\)<\/h3>/i);
  assert.match(html, /<span class="tag">Simulator UT<\/span>/i);

  // Assert the 9 table columns matching Image 2
  const requiredColumns = [
    'NO',
    'NO FUNGSI',
    'DESKRIPSI FUNGSIONAL',
    'KASUS UJI',
    'PROSEDUR &amp; KASUS UJI',
    'HASIL YANG DIHARAPKAN',
    'HASIL TESTER',
    'TANGGAL TESTING',
    'KETERANGAN'
  ];
  requiredColumns.forEach(col => {
    assert.ok(html.includes(col), `uat.html table head must include column "${col}"`);
  });

  // Assert category banners present in js
  const requiredBanners = [
    'LOGIN ADMIN (LG / MS)',
    'TAMBAH DATA PRODUK (PRD)',
    'LIHAT DATA PRODUK (PRD)',
    'EDIT & HAPUS DATA PRODUK (PRD)'
  ];
  requiredBanners.forEach(b => {
    assert.ok(js.includes(b), `uat-game.js must include category banner "${b}"`);
  });

  // Assert CSS includes styling for category banner and badges
  assert.match(css, /\.ut-category-banner td/);
  assert.match(css, /\.ut-badge-case\.normal/);
  assert.match(css, /\.ut-badge-case\.error/);
});

