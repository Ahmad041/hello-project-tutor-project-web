const { test } = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../assets/js/erd-engine.js');

test('engine defines exactly 5 progressive levels with distinct PDM schemas', () => {
  assert.equal(engine.LEVELS.length, 5);
  assert.deepEqual(engine.LEVELS.map(l => l.level), [1, 2, 3, 4, 5]);

  // Check that every level has unique entity names and structures
  const l1Entities = Object.keys(engine.LEVELS[0].entities);
  assert.deepEqual(l1Entities, ['KATEGORI', 'PRODUK']);

  const l2Entities = Object.keys(engine.LEVELS[1].entities);
  assert.deepEqual(l2Entities, ['PELANGGAN', 'KARTU_MEMBER']);

  const l3Entities = Object.keys(engine.LEVELS[2].entities);
  assert.deepEqual(l3Entities, ['SUPPLIER', 'FAKTUR_BELI', 'DETAIL_PASOKAN']);

  const l4Entities = Object.keys(engine.LEVELS[3].entities);
  assert.deepEqual(l4Entities, ['CUSTOMER', 'SALE', 'ITEM', 'PRODUCT']);

  const l5Entities = Object.keys(engine.LEVELS[4].entities);
  assert.deepEqual(l5Entities, ['CATEGORY', 'PRODUCT', 'CUSTOMER', 'SALE', 'ITEM']);
});

test('level 1: PDM Toko Kelontong validates KATEGORI.id_kategori -> PRODUK.id_kategori', () => {
  const l1 = engine.LEVELS[0];
  assert.equal(l1.relations.length, 1);

  // Missing
  const emptyRes = engine.validate([], 1);
  assert.equal(emptyRes.ok, false);
  assert.equal(emptyRes.totalExpected, 1);

  // Correct cable
  const correct = [{ from: 'KATEGORI.id_kategori', to: 'PRODUK.id_kategori' }];
  const val = engine.validate(correct, 1);
  assert.equal(val.ok, true);
  assert.equal(val.connectedCount, 1);

  const sim = engine.simulate(correct, 1);
  assert.equal(sim.ok, true);
  assert.match(sim.message, /Level 1/);
});

test('level 2: PDM Membership validates PELANGGAN.id_pelanggan -> KARTU_MEMBER.id_pelanggan', () => {
  const correct = [{ from: 'PELANGGAN.id_pelanggan', to: 'KARTU_MEMBER.id_pelanggan' }];
  const val = engine.validate(correct, 2);
  assert.equal(val.ok, true);
  assert.equal(val.connectedCount, 1);

  const sim = engine.simulate(correct, 2);
  assert.equal(sim.ok, true);
  assert.match(sim.message, /Level 2/);
  assert.equal(sim.summary.card, 'MBR-9901');
});

test('level 3: PDM Pengadaan Distributor validates SUPPLIER -> FAKTUR_BELI -> DETAIL_PASOKAN', () => {
  const correct = [
    { from: 'SUPPLIER.id_supplier', to: 'FAKTUR_BELI.id_supplier' },
    { from: 'FAKTUR_BELI.id_faktur_beli', to: 'DETAIL_PASOKAN.id_faktur_beli' }
  ];
  const val = engine.validate(correct, 3);
  assert.equal(val.ok, true);
  assert.equal(val.totalExpected, 2);
  assert.equal(val.connectedCount, 2);

  const sim = engine.simulate(correct, 3);
  assert.equal(sim.ok, true);
  assert.match(sim.message, /Level 3/);
  assert.equal(sim.summary.supplier, 'PT Sinar Abadi (SUP-01)');
});

test('level 4: PDM Kasir Normalisasi 3NF validates 3 relations', () => {
  const correct = [
    { from: 'CUSTOMER.id_customer', to: 'SALE.id_customer' },
    { from: 'SALE.id_sale', to: 'ITEM.id_sale' },
    { from: 'PRODUCT.id_product', to: 'ITEM.id_product' }
  ];
  const val = engine.validate(correct, 4);
  assert.equal(val.ok, true);
  assert.equal(val.totalExpected, 3);
  assert.equal(val.connectedCount, 3);

  const sim = engine.simulate(correct, 4);
  assert.equal(sim.ok, true);
  assert.match(sim.message, /Level 4/);
  assert.equal(sim.summary.total, 45000);
});

test('level 5: PDM KasirKita Lengkap validates 4 relations', () => {
  const correct = [
    { from: 'CATEGORY.id_category', to: 'PRODUCT.id_category' },
    { from: 'CUSTOMER.id_customer', to: 'SALE.id_customer' },
    { from: 'PRODUCT.id_product', to: 'ITEM.id_product' },
    { from: 'SALE.id_sale', to: 'ITEM.id_sale' }
  ];
  const val = engine.validate(correct, 5);
  assert.equal(val.ok, true);
  assert.equal(val.totalExpected, 4);
  assert.equal(val.connectedCount, 4);

  const sim = engine.simulate(correct, 5);
  assert.equal(sim.ok, true);
  assert.match(sim.message, /Level 5/);
  assert.equal(sim.summary.total, 24000);
});

test('supports connecting cables in reverse direction on any level', () => {
  const reversedL1 = [{ from: 'PRODUK.id_kategori', to: 'KATEGORI.id_kategori' }];
  const res = engine.validate(reversedL1, 1);
  assert.equal(res.ok, true);
});

test('detects circular connection on the same entity', () => {
  const circular = [{ from: 'PRODUK.id_produk', to: 'PRODUK.id_kategori' }];
  const result = engine.validate(circular, 1);
  assert.equal(result.ok, false);
  assert.match(result.issues[0], /Kabel melingkar/);
});

test('detects data type mismatch between connected fields', () => {
  // PRODUK.harga is INTEGER, KATEGORI.nama_kategori is VARCHAR(50)
  const mismatch = [{ from: 'PRODUK.harga', to: 'KATEGORI.nama_kategori' }];
  const result = engine.validate(mismatch, 1);
  assert.equal(result.ok, false);
  assert.match(result.issues[0], /Tipe data tidak cocok/);
});
