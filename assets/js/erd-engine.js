(function (root) {
  'use strict';

  // Definisi PDM Spesifik & Berbeda Tiap Level (Level 1 - 5)
  const LEVELS = [
    // ==========================================
    // LEVEL 1: PDM TOKO KELONTONG (2 ENTITAS)
    // ==========================================
    {
      level: 1,
      name: 'Level 1: PDM Toko Kelontong',
      badge: 'Relasi 1:N Dasar',
      mission: 'Rani baru merintis toko kelontong. Ia hanya mencatat Kategori Barang dan Data Produk. Hubungkan Primary Key KATEGORI.id_kategori ke Foreign Key PRODUK.id_kategori agar produk tergolong dalam rak yang benar!',
      entities: {
        KATEGORI: {
          title: 'KATEGORI',
          subtitle: 'Rak / Kelompok Barang',
          color: '#f59e0b',
          fields: [
            { name: 'id_kategori', type: 'VARCHAR(10)', key: 'PK', label: 'ID Kategori' },
            { name: 'nama_kategori', type: 'VARCHAR(50)', key: '', label: 'Nama Kategori' }
          ]
        },
        PRODUK: {
          title: 'PRODUK',
          subtitle: 'Daftar Barang Dagangan',
          color: '#06b6d4',
          fields: [
            { name: 'id_produk', type: 'VARCHAR(10)', key: 'PK', label: 'ID Produk' },
            { name: 'id_kategori', type: 'VARCHAR(10)', key: 'FK', label: 'ID Kategori' },
            { name: 'nama_produk', type: 'VARCHAR(100)', key: '', label: 'Nama Barang' },
            { name: 'harga', type: 'INTEGER', key: '', label: 'Harga (Rp)' },
            { name: 'stok', type: 'INTEGER', key: '', label: 'Stok Toko' }
          ]
        }
      },
      relations: [
        {
          id: 'rel_kat_prod',
          from: 'KATEGORI.id_kategori',
          to: 'PRODUK.id_kategori',
          cardinality: '1:N',
          name: 'Kategori ke Produk',
          description: 'Satu kategori memayungi banyak produk barang dagangan.'
        }
      ],
      demoCables: [{ from: 'KATEGORI.id_kategori', to: 'PRODUK.id_kategori' }]
    },

    // ==========================================
    // LEVEL 2: PDM MEMBERSHIP & KARTU POIN (2 ENTITAS)
    // ==========================================
    {
      level: 2,
      name: 'Level 2: PDM Membership & Loyalitas',
      badge: 'Relasi 1:1 Identitas',
      mission: 'Toko Rani meluncurkan program Member Card. Setiap Pelanggan berhak memiliki 1 Kartu Member untuk menabung poin diskon. Hubungkan PELANGGAN.id_pelanggan ke KARTU_MEMBER.id_pelanggan!',
      entities: {
        PELANGGAN: {
          title: 'PELANGGAN',
          subtitle: 'Data Pribadi Pembeli',
          color: '#10b981',
          fields: [
            { name: 'id_pelanggan', type: 'VARCHAR(15)', key: 'PK', label: 'ID Pelanggan' },
            { name: 'nama_lengkap', type: 'VARCHAR(100)', key: '', label: 'Nama Lengkap' },
            { name: 'no_hp', type: 'VARCHAR(20)', key: '', label: 'Nomor WhatsApp' }
          ]
        },
        KARTU_MEMBER: {
          title: 'KARTU_MEMBER',
          subtitle: 'Poin & Status Diskon',
          color: '#8b5cf6',
          fields: [
            { name: 'id_kartu_member', type: 'VARCHAR(20)', key: 'PK', label: 'ID Kartu Member' },
            { name: 'id_pelanggan', type: 'VARCHAR(15)', key: 'FK', label: 'ID Pemilik' },
            { name: 'poin_belanja', type: 'INTEGER', key: '', label: 'Total Poin' },
            { name: 'tier', type: 'VARCHAR(15)', key: '', label: 'Gold / Silver' }
          ]
        }
      },
      relations: [
        {
          id: 'rel_pelanggan_member',
          from: 'PELANGGAN.id_pelanggan',
          to: 'KARTU_MEMBER.id_pelanggan',
          cardinality: '1:1',
          name: 'Pelanggan ke Kartu Member',
          description: 'Satu pelanggan terhubung ke satu kartu member unik.'
        }
      ],
      demoCables: [{ from: 'PELANGGAN.id_pelanggan', to: 'KARTU_MEMBER.id_pelanggan' }]
    },

    // ==========================================
    // LEVEL 3: PDM PENGADAAN & SUPPLIER (3 ENTITAS)
    // ==========================================
    {
      level: 3,
      name: 'Level 3: PDM Pengadaan Distributor',
      badge: 'Rantai Pasok (Supply Chain)',
      mission: 'Stok toko menipis! Rani kulakan pasokan ke Supplier distributor. Rangkai relasi dari SUPPLIER.id_supplier ke FAKTUR_BELI.id_supplier, lalu dari FAKTUR_BELI.id_faktur_beli ke DETAIL_PASOKAN.id_faktur_beli agar penerimaan dus barang tercatat rapi!',
      entities: {
        SUPPLIER: {
          title: 'SUPPLIER',
          subtitle: 'Distributor Pemasok',
          color: '#f59e0b',
          fields: [
            { name: 'id_supplier', type: 'VARCHAR(12)', key: 'PK', label: 'ID Supplier' },
            { name: 'nama_perusahaan', type: 'VARCHAR(100)', key: '', label: 'Nama PT Supplier' },
            { name: 'kota', type: 'VARCHAR(50)', key: '', label: 'Kota Gudang' }
          ]
        },
        FAKTUR_BELI: {
          title: 'FAKTUR_BELI',
          subtitle: 'Surat Pesanan Masuk',
          color: '#06b6d4',
          fields: [
            { name: 'id_faktur_beli', type: 'VARCHAR(20)', key: 'PK', label: 'ID Faktur Beli' },
            { name: 'id_supplier', type: 'VARCHAR(12)', key: 'FK', label: 'ID Supplier' },
            { name: 'tanggal_tiba', type: 'VARCHAR(20)', key: '', label: 'Tanggal Kirim' },
            { name: 'total_tagihan', type: 'INTEGER', key: '', label: 'Total Tagihan (Rp)' }
          ]
        },
        DETAIL_PASOKAN: {
          title: 'DETAIL_PASOKAN',
          subtitle: 'Rincian Muatan Barang',
          color: '#ec4899',
          fields: [
            { name: 'id_faktur_beli', type: 'VARCHAR(20)', key: 'PK, FK', label: 'ID Faktur Beli' },
            { name: 'id_detail_pasokan', type: 'VARCHAR(10)', key: 'PK', label: 'ID Detail' },
            { name: 'jumlah_dus', type: 'INTEGER', key: '', label: 'Jumlah Box' },
            { name: 'harga_kulak', type: 'INTEGER', key: '', label: 'Harga Modal (Rp)' }
          ]
        }
      },
      relations: [
        {
          id: 'rel_sup_faktur',
          from: 'SUPPLIER.id_supplier',
          to: 'FAKTUR_BELI.id_supplier',
          cardinality: '1:N',
          name: 'Supplier ke Faktur',
          description: 'Satu supplier dapat mengirim banyak faktur pembelian.'
        },
        {
          id: 'rel_faktur_detail',
          from: 'FAKTUR_BELI.id_faktur_beli',
          to: 'DETAIL_PASOKAN.id_faktur_beli',
          cardinality: '1:N',
          name: 'Faktur ke Detail Pasokan',
          description: 'Satu faktur memuat beberapa item muatan dus barang.'
        }
      ],
      demoCables: [
        { from: 'SUPPLIER.id_supplier', to: 'FAKTUR_BELI.id_supplier' },
        { from: 'FAKTUR_BELI.id_faktur_beli', to: 'DETAIL_PASOKAN.id_faktur_beli' }
      ]
    },

    // ==========================================
    // LEVEL 4: PDM KASIR NORMALISASI 3NF (4 ENTITAS)
    // ==========================================
    {
      level: 4,
      name: 'Level 4: PDM Kasir Normalisasi 3NF',
      badge: 'Relasi Many-to-Many',
      mission: 'Rancang struktur kasir 3NF murni tanpa redundansi data! Hubungkan CUSTOMER.id_customer ke SALE.id_customer, lalu hubungkan SALE.id_sale dan PRODUCT.id_product ke tabel perantara ITEM rincian belanja.',
      entities: {
        CUSTOMER: {
          title: 'CUSTOMER',
          subtitle: 'Data Pelanggan',
          color: '#10b981',
          fields: [
            { name: 'id_customer', type: 'VARCHAR(20)', key: 'PK', label: 'ID Pelanggan' },
            { name: 'name', type: 'VARCHAR(128)', key: '', label: 'Nama Pelanggan' },
            { name: 'phone', type: 'VARCHAR(32)', key: '', label: 'Nomor Telepon' }
          ]
        },
        SALE: {
          title: 'SALE',
          subtitle: 'Header Transaksi',
          color: '#8b5cf6',
          fields: [
            { name: 'id_sale', type: 'VARCHAR(20)', key: 'PK', label: 'ID Nota' },
            { name: 'id_customer', type: 'VARCHAR(20)', key: 'FK', label: 'ID Pelanggan' },
            { name: 'created_at', type: 'VARCHAR(20)', key: '', label: 'Waktu Transaksi' },
            { name: 'paid', type: 'INTEGER', key: '', label: 'Nominal Bayar (Rp)' }
          ]
        },
        ITEM: {
          title: 'ITEM',
          subtitle: 'Tabel Perantara Belanja',
          color: '#ec4899',
          fields: [
            { name: 'id_sale', type: 'VARCHAR(20)', key: 'PK, FK', label: 'ID Nota' },
            { name: 'id_product', type: 'VARCHAR(20)', key: 'PK, FK', label: 'ID Produk' },
            { name: 'quantity', type: 'INTEGER', key: '', label: 'Qty' },
            { name: 'unit_price', type: 'INTEGER', key: '', label: 'Harga Satuan (Rp)' }
          ]
        },
        PRODUCT: {
          title: 'PRODUCT',
          subtitle: 'Master Produk',
          color: '#06b6d4',
          fields: [
            { name: 'id_product', type: 'VARCHAR(20)', key: 'PK', label: 'ID Produk' },
            { name: 'name', type: 'VARCHAR(128)', key: '', label: 'Nama Produk' },
            { name: 'price', type: 'INTEGER', key: '', label: 'Harga Standar' },
            { name: 'stock', type: 'INTEGER', key: '', label: 'Sisa Stok' }
          ]
        }
      },
      relations: [
        {
          id: 'rel_cust_sale_4',
          from: 'CUSTOMER.id_customer',
          to: 'SALE.id_customer',
          cardinality: '0..1:N',
          name: 'Pelanggan ke Nota',
          description: 'Satu pelanggan bisa memiliki banyak nota.'
        },
        {
          id: 'rel_sale_item_4',
          from: 'SALE.id_sale',
          to: 'ITEM.id_sale',
          cardinality: '1:N',
          name: 'Nota ke Item Belanja',
          description: 'Satu nota memuat baris item barang.'
        },
        {
          id: 'rel_prod_item_4',
          from: 'PRODUCT.id_product',
          to: 'ITEM.id_product',
          cardinality: '1:N',
          name: 'Produk ke Item Belanja',
          description: 'Master produk dirujuk di baris item belanja.'
        }
      ],
      demoCables: [
        { from: 'CUSTOMER.id_customer', to: 'SALE.id_customer' },
        { from: 'SALE.id_sale', to: 'ITEM.id_sale' },
        { from: 'PRODUCT.id_product', to: 'ITEM.id_product' }
      ]
    },

    // ==========================================
    // LEVEL 5: PDM KASIRKITA LENGKAP & DENORMALISASI (5 ENTITAS)
    // ==========================================
    {
      level: 5,
      name: 'Level 5: Master Arsitektur KasirKita',
      badge: 'Full Production PDM',
      mission: 'Ujian Pamungkas Arsitek Database! Susun PDM produksi KasirKita secara menyeluruh: 5 entitas lengkap dari Kategori, Produk (dengan SKU unik), Pelanggan, Nota Penjualan (dengan kolom total denormalisasi), hingga Rincian Item belanja!',
      entities: {
        CATEGORY: {
          title: 'CATEGORY',
          subtitle: 'Pengelompokan Barang',
          color: '#f59e0b',
          fields: [
            { name: 'id_category', type: 'VARCHAR(20)', key: 'PK', label: 'ID Kategori' },
            { name: 'name', type: 'VARCHAR(64)', key: '', label: 'Nama Kategori' }
          ]
        },
        PRODUCT: {
          title: 'PRODUCT',
          subtitle: 'Master Data Barang Toko',
          color: '#06b6d4',
          fields: [
            { name: 'id_product', type: 'VARCHAR(20)', key: 'PK', label: 'ID Produk' },
            { name: 'id_category', type: 'VARCHAR(20)', key: 'FK', label: 'ID Kategori' },
            { name: 'sku', type: 'VARCHAR(32)', key: 'UK', label: 'Kode Barcode' },
            { name: 'name', type: 'VARCHAR(128)', key: '', label: 'Nama Produk' },
            { name: 'price', type: 'INTEGER', key: '', label: 'Harga Satuan (Rp)' },
            { name: 'stock', type: 'INTEGER', key: '', label: 'Sisa Stok' }
          ]
        },
        CUSTOMER: {
          title: 'CUSTOMER',
          subtitle: 'Master Data Pembeli',
          color: '#10b981',
          fields: [
            { name: 'id_customer', type: 'VARCHAR(20)', key: 'PK', label: 'ID Pelanggan' },
            { name: 'name', type: 'VARCHAR(128)', key: '', label: 'Nama Lengkap' },
            { name: 'phone', type: 'VARCHAR(32)', key: '', label: 'Nomor WhatsApp' }
          ]
        },
        SALE: {
          title: 'SALE',
          subtitle: 'Header Transaksi Nota',
          color: '#8b5cf6',
          fields: [
            { name: 'id_sale', type: 'VARCHAR(20)', key: 'PK', label: 'ID Nota' },
            { name: 'id_customer', type: 'VARCHAR(20)', key: 'FK', label: 'ID Pelanggan (Opsional)' },
            { name: 'created_at', type: 'VARCHAR(20)', key: '', label: 'Waktu Transaksi' },
            { name: 'paid', type: 'INTEGER', key: '', label: 'Nominal Bayar (Rp)' },
            { name: 'total', type: 'INTEGER', key: '', label: 'Total Belanja (Rp)' }
          ]
        },
        ITEM: {
          title: 'ITEM',
          subtitle: 'Tabel Perantara Rincian Belanja',
          color: '#ec4899',
          fields: [
            { name: 'id_sale', type: 'VARCHAR(20)', key: 'PK, FK', label: 'ID Nota' },
            { name: 'id_product', type: 'VARCHAR(20)', key: 'PK, FK', label: 'ID Produk' },
            { name: 'quantity', type: 'INTEGER', key: '', label: 'Jumlah Dibeli' },
            { name: 'unit_price', type: 'INTEGER', key: '', label: 'Harga Saat Beli (Rp)' }
          ]
        }
      },
      relations: [
        {
          id: 'rel_cat_prod_5',
          from: 'CATEGORY.id_category',
          to: 'PRODUCT.id_category',
          cardinality: '1:N',
          name: 'Kategori ke Produk',
          description: 'Satu kategori memayungi banyak produk barang dagangan toko.'
        },
        {
          id: 'rel_cust_sale_5',
          from: 'CUSTOMER.id_customer',
          to: 'SALE.id_customer',
          cardinality: '0..1:N',
          name: 'Pelanggan ke Nota Penjualan',
          description: 'Satu pelanggan bisa memiliki banyak nota pembelian.'
        },
        {
          id: 'rel_prod_item_5',
          from: 'PRODUCT.id_product',
          to: 'ITEM.id_product',
          cardinality: '1:N',
          name: 'Produk ke Item Belanja',
          description: 'Master produk dirujuk ke dalam baris rincian belanja di nota.'
        },
        {
          id: 'rel_sale_item_5',
          from: 'SALE.id_sale',
          to: 'ITEM.id_sale',
          cardinality: '1:N',
          name: 'Nota ke Item Belanja',
          description: 'Satu nota transaksi penjualan memuat banyak baris item belanja.'
        }
      ],
      demoCables: [
        { from: 'CATEGORY.id_category', to: 'PRODUCT.id_category' },
        { from: 'CUSTOMER.id_customer', to: 'SALE.id_customer' },
        { from: 'PRODUCT.id_product', to: 'ITEM.id_product' },
        { from: 'SALE.id_sale', to: 'ITEM.id_sale' }
      ]
    }
  ];

  /**
   * Menormalisasi pasangan koneksi kabel berdasarkan relasi level tertentu
   */
  function normalizeConnection(conn, levelNum = 5) {
    let from = conn.from;
    let to = conn.to;
    if (!from || !to) return null;

    const levelSpec = LEVELS.find(l => l.level === levelNum) || LEVELS[4];

    for (const rel of levelSpec.relations) {
      if (rel.from === from && rel.to === to) {
        return { ...rel, reversed: false, userFrom: from, userTo: to };
      }
      if (rel.from === to && rel.to === from) {
        return { ...rel, reversed: true, userFrom: from, userTo: to };
      }
    }
    return null;
  }

  /**
   * Memvalidasi kabel terhadap PDM level aktif
   */
  function validate(connections, levelNum = 5) {
    const levelSpec = LEVELS.find(l => l.level === levelNum) || LEVELS[4];

    const issues = [];
    const matchedRelations = new Set();
    const activeCables = [];

    for (const conn of connections) {
      const fromParts = conn.from.split('.');
      const toParts = conn.to.split('.');
      const fromEnt = fromParts[0];
      const fromField = fromParts[1];
      const toEnt = toParts[0];
      const toField = toParts[1];

      if (fromEnt === toEnt) {
        issues.push(`Kabel melingkar: ${conn.from} dan ${conn.to} berada di entitas yang sama (${fromEnt}). Relasi ERD menghubungkan dua entitas berbeda.`);
        continue;
      }

      const match = normalizeConnection(conn, levelNum);
      if (match) {
        matchedRelations.add(match.id);

        activeCables.push({
          from: conn.from,
          to: conn.to,
          relId: match.id,
          valid: true,
          label: `${match.name} (${match.cardinality})`
        });
      } else {
        const fMeta = levelSpec.entities[fromEnt]?.fields.find(f => f.name === fromField);
        const tMeta = levelSpec.entities[toEnt]?.fields.find(f => f.name === toField);

        if (fMeta && tMeta && fMeta.type !== tMeta.type) {
          issues.push(`Tipe data tidak cocok: ${conn.from} bertipe ${fMeta.type}, sedangkan ${conn.to} bertipe ${tMeta.type}. Relasi PK dan FK wajib memiliki tipe data identik.`);
        } else if ((!fMeta?.key.includes('PK') && !tMeta?.key.includes('PK')) && (!fMeta?.key.includes('FK') && !tMeta?.key.includes('FK'))) {
          issues.push(`Salah pasang: ${conn.from} ke ${conn.to} bukan relasi Primary Key (PK) ke Foreign Key (FK).`);
        } else {
          issues.push(`Relasi tidak tepat untuk Level ${levelNum}: ${conn.from} ke ${conn.to} tidak sesuai skema relasi yang diharapkan.`);
        }

        activeCables.push({
          from: conn.from,
          to: conn.to,
          valid: false,
          label: 'Salah Sambung'
        });
      }
    }

    const missing = [];
    for (const rel of levelSpec.relations) {
      if (!matchedRelations.has(rel.id)) {
        missing.push(rel);
      }
    }

    return {
      ok: missing.length === 0 && issues.length === 0,
      level: levelNum,
      levelSpec,
      totalExpected: levelSpec.relations.length,
      connectedCount: matchedRelations.size,
      missing,
      issues,
      activeCables
    };
  }

  /**
   * Menjalankan simulasi data belajar sesuai PDM level aktif
   */
  function simulate(connections, levelNum = 5) {
    const val = validate(connections, levelNum);
    const trace = [];
    const connectedMap = new Map();

    for (const conn of connections) {
      const match = normalizeConnection(conn, levelNum);
      if (match) {
        connectedMap.set(match.id, true);
      }
    }

    // ==================== LEVEL 1: PDM TOKO KELONTONG ====================
    if (levelNum === 1) {
      trace.push({
        step: 1,
        entity: 'KATEGORI',
        title: 'Membaca Master Kategori Toko',
        detail: 'Rani membuka master KATEGORI: "ATK" (id_kategori: "K01"). Mencari produk yang dinaungi...',
        status: 'success'
      });

      if (!connectedMap.has('rel_kat_prod')) {
        return {
          ok: false,
          level: 1,
          trace,
          failedAt: 'PRODUK',
          message: 'Kabel Kategori belum terpasang! Hubungkan KATEGORI.id_kategori (PK) ke PRODUK.id_kategori (FK).'
        };
      }

      trace.push({
        step: 2,
        entity: 'PRODUK',
        cableId: 'rel_kat_prod',
        title: 'Produk Terhubung Sempurna',
        detail: 'Sukses! Produk "Buku Tulis A5" (id_produk: "P001", Rp12.000, stok 20) kini resmi terdaftar di kategori ATK!',
        status: 'success'
      });

      return {
        ok: true,
        level: 1,
        trace,
        summary: {
          header: 'DATA TOKO KELONTONG',
          item1: 'Kategori: ATK (K01)',
          item2: 'Produk: Buku Tulis A5 (P001)',
          price: 12000,
          stock: 20
        },
        message: 'Luar biasa! Kamu menyelesaikan Level 1. PDM Toko Kelontong berhasil dirangkai!'
      };
    }

    // ==================== LEVEL 2: PDM MEMBERSHIP & LOYALITAS ====================
    if (levelNum === 2) {
      trace.push({
        step: 1,
        entity: 'PELANGGAN',
        title: 'Identifikasi Pelanggan Toko',
        detail: 'Pak Budi Santoso (id_pelanggan: "CUST-001", WA: 08123456789) mendaftar sebagai anggota tetap...',
        status: 'success'
      });

      if (!connectedMap.has('rel_pelanggan_member')) {
        return {
          ok: false,
          level: 2,
          trace,
          failedAt: 'KARTU_MEMBER',
          message: 'Kabel Pelanggan belum tersambung! Hubungkan PELANGGAN.id_pelanggan (PK) ke KARTU_MEMBER.id_pelanggan (FK).'
        };
      }

      trace.push({
        step: 2,
        entity: 'KARTU_MEMBER',
        cableId: 'rel_pelanggan_member',
        title: 'Kartu Member Aktif',
        detail: 'Sukses! Kartu Member (id_kartu_member: "MBR-9901") terhubung ke Pak Budi Santoso. Saldo poin: 150 Poin (Tier Gold)!',
        status: 'success'
      });

      return {
        ok: true,
        level: 2,
        trace,
        summary: {
          header: 'STATUS MEMBERSHIP',
          customer: 'Budi Santoso (CUST-001)',
          card: 'MBR-9901',
          tier: 'GOLD TIER (Diskon 5%)',
          points: 150
        },
        message: 'Hebat! Level 2 selesai. PDM Membership dan Kartu Poin terhubung secara relasional!'
      };
    }

    // ==================== LEVEL 3: PDM PENGADAAN & SUPPLIER ====================
    if (levelNum === 3) {
      trace.push({
        step: 1,
        entity: 'SUPPLIER',
        title: 'Membaca Data Distributor Pemasok',
        detail: 'Mengecek PT Sinar Abadi Distributor (id_supplier: "SUP-01", Gudang: Surabaya)...',
        status: 'success'
      });

      if (!connectedMap.has('rel_sup_faktur')) {
        return {
          ok: false,
          level: 3,
          trace,
          failedAt: 'FAKTUR_BELI',
          message: 'Kabel Supplier ke Faktur terputus! Hubungkan SUPPLIER.id_supplier (PK) ke FAKTUR_BELI.id_supplier (FK).'
        };
      }

      trace.push({
        step: 2,
        entity: 'FAKTUR_BELI',
        cableId: 'rel_sup_faktur',
        title: 'Faktur Pengiriman Masuk',
        detail: 'Faktur Pembelian "FB-2026-88" terbit. Total tagihan kulakan: Rp1.200.000.',
        status: 'success'
      });

      if (!connectedMap.has('rel_faktur_detail')) {
        return {
          ok: false,
          level: 3,
          trace,
          failedAt: 'DETAIL_PASOKAN',
          message: 'Kabel Faktur ke Detail Pasokan terputus! Hubungkan FAKTUR_BELI.id_faktur_beli (PK) ke DETAIL_PASOKAN.id_faktur_beli (FK).'
        };
      }

      trace.push({
        step: 3,
        entity: 'DETAIL_PASOKAN',
        cableId: 'rel_faktur_detail',
        title: 'Dus Barang Masuk ke Gudang',
        detail: 'Sukses! Masuk 10 Dus Buku Tulis (id_detail_pasokan: "D01") dengan harga modal Rp10.000/pcs. Data rantai pasok terhubung rapi!',
        status: 'success'
      });

      return {
        ok: true,
        level: 3,
        trace,
        summary: {
          header: 'SURAT JALAN / PENGADAAN BARANG',
          supplier: 'PT Sinar Abadi (SUP-01)',
          faktur: 'FB-2026-88',
          items: '10 Dus Buku Tulis (100 pcs)',
          total: 1200000
        },
        message: 'Keren! Level 3 tuntas. PDM Pengadaan Rantai Pasok berhasil kamu sambungkan!'
      };
    }

    // ==================== LEVEL 4: PDM KASIR NORMALISASI 3NF ====================
    if (levelNum === 4) {
      trace.push({
        step: 1,
        entity: 'CUSTOMER',
        title: 'Data Pembeli',
        detail: 'Pelanggan "Dewi Sartika" datang membawa 3 barang belanjaan...',
        status: 'success'
      });

      if (!connectedMap.has('rel_cust_sale_4')) {
        return {
          ok: false,
          level: 4,
          trace,
          failedAt: 'SALE',
          message: 'Kabel Pelanggan ke Nota belum terpasang! Hubungkan CUSTOMER.id_customer (PK) ke SALE.id_customer (FK).'
        };
      }

      trace.push({
        step: 2,
        entity: 'SALE',
        cableId: 'rel_cust_sale_4',
        title: 'Header Transaksi 3NF',
        detail: 'Nota penjualan "TRX-3NF-01" dibuat. Uang diterima: Rp50.000.',
        status: 'success'
      });

      if (!connectedMap.has('rel_sale_item_4')) {
        return {
          ok: false,
          level: 4,
          trace,
          failedAt: 'ITEM',
          message: 'Kabel Nota ke Item belum terpasang! Hubungkan SALE.id_sale (PK) ke ITEM.id_sale (FK).'
        };
      }

      if (!connectedMap.has('rel_prod_item_4')) {
        return {
          ok: false,
          level: 4,
          trace,
          failedAt: 'ITEM',
          message: 'Kabel Produk ke Item belum terpasang! Hubungkan PRODUCT.id_product (PK) ke ITEM.id_product (FK).'
        };
      }

      trace.push({
        step: 3,
        entity: 'ITEM',
        cableId: 'rel_prod_item_4',
        title: 'Tabel Perantara ITEM Bekerja Sempurna',
        detail: 'Sempurna! Tabel ITEM berhasil merangkai relasi M:N antara SALE ("TRX-3NF-01") dan PRODUCT ("P01"). 3 pcs @Rp15.000 = Rp45.000!',
        status: 'success'
      });

      return {
        ok: true,
        level: 4,
        trace,
        summary: {
          header: 'STRUK TRANSAKSI 3NF',
          receiptId: 'TRX-3NF-01',
          customer: 'Dewi Sartika',
          item: 'Pulpen Gel Hitam (3 pcs @15.000)',
          total: 45000,
          paid: 50000,
          change: 5000
        },
        message: 'Luar biasa! Level 4 terselesaikan. Kamu menguasai normalisasi 3NF dan tabel perantara!'
      };
    }

    // ==================== LEVEL 5: PDM KASIRKITA LENGKAP & DENORMALISASI ====================
    trace.push({
      step: 1,
      entity: 'CATEGORY',
      title: 'Pemeriksaan Kategori',
      detail: 'Rani memilih barang "Buku Tulis A5". Toko memeriksa kategori produk...',
      status: 'success'
    });

    if (!connectedMap.has('rel_cat_prod_5')) {
      return {
        ok: false,
        level: 5,
        trace,
        failedAt: 'PRODUCT',
        message: 'Kabel Kategori terputus! Hubungkan CATEGORY.id_category -> PRODUCT.id_category.'
      };
    }

    trace.push({
      step: 2,
      entity: 'PRODUCT',
      cableId: 'rel_cat_prod_5',
      title: 'Ambil Info Produk',
      detail: 'Data "Buku Tulis A5" ditemukan (SKU unik: SKU-B001, Harga: Rp12.000, Sisa Stok: 20 pcs). Pulsa data mengalir dari Kategori ke Master Produk.',
      status: 'success'
    });

    trace.push({
      step: 3,
      entity: 'CUSTOMER',
      title: 'Identifikasi Pembeli',
      detail: 'Pembeli tetap bernama "Budi Santoso" (C001, WA: 08123456789).',
      status: 'success'
    });

    if (!connectedMap.has('rel_cust_sale_5')) {
      return {
        ok: false,
        level: 5,
        trace,
        failedAt: 'SALE',
        message: 'Kabel Pelanggan terputus! Hubungkan CUSTOMER.id_customer -> SALE.id_customer.'
      };
    }

    trace.push({
      step: 4,
      entity: 'SALE',
      cableId: 'rel_cust_sale_5',
      title: 'Buat Nota Transaksi (SALE)',
      detail: 'Membuat nomor nota "TRX-2026-001". Uang bayar: Rp30.000.',
      status: 'success'
    });

    if (!connectedMap.has('rel_prod_item_5')) {
      return {
        ok: false,
        level: 5,
        trace,
        failedAt: 'ITEM',
        message: 'Kabel Produk ke Item terputus! Hubungkan PRODUCT.id_product -> ITEM.id_product.'
      };
    }

    if (!connectedMap.has('rel_sale_item_5')) {
      return {
        ok: false,
        level: 5,
        trace,
        failedAt: 'ITEM',
        message: 'Kabel Nota ke Item terputus! Hubungkan SALE.id_sale -> ITEM.id_sale.'
      };
    }

    trace.push({
      step: 5,
      entity: 'ITEM',
      cableId: 'rel_prod_item_5',
      title: 'Hitung Subtotal Rincian',
      detail: 'Barang: 2 pcs Buku Tulis A5 x Rp12.000 = Rp24.000. Data terhubung sempurna melalui kabel relasi ganda!',
      status: 'success'
    });

    trace.push({
      step: 6,
      entity: 'FINISH',
      title: 'Transaksi Sukses & Nota Tercetak',
      detail: 'Total: Rp24.000 | Tunai: Rp30.000 | Kembali: Rp6.000. Sisa stok Buku Tulis A5 berkurang menjadi 18. Seluruh 5 entitas PDM KasirKita berfungsi paripurna!',
      status: 'success'
    });

    return {
      ok: true,
      level: 5,
      trace,
      summary: {
        header: 'NOTA KASIRKITA RESMI',
        receiptId: 'TRX-2026-001',
        customer: 'Budi Santoso',
        item: 'Buku Tulis A5 (2 pcs)',
        total: 24000,
        paid: 30000,
        change: 6000
      },
      message: 'SELAMAT! Kamu berhasil menamatkan Level 5 dan menguasai seluruh arsitektur database relasional KasirKita!'
    };
  }

  const api = {
    LEVELS,
    normalizeConnection,
    validate,
    simulate
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ErdEngine = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
