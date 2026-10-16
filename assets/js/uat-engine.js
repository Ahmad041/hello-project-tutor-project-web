/**
 * UatEngine - Pure testing logic and scenario registry for KasirKita UAT Simulator
 * Based on Lampiran C. User Acceptance Testing (CONTOH USER TESTING-95-100.pdf)
 * Universal Module Definition (UMD) for Node.js test runner and browser runtime.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.UatEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Master Scenarios Registry (18 Test Scenarios directly from PDF)
  const SCENARIOS = [
    // --- GRP 1: LOGIN ADMIN ---
    {
      id: 'MS002',
      group: 'login',
      type: 'negative',
      funcName: 'Login Admin',
      testType: 'Data Salah (Password Salah)',
      procedure: '1) Input Username: admin01\n2) Input Password: adminSalah\n3) Klik tombol Masuk',
      expected: 'Sistem menampilkan pesan "Username atau password salah" dan tetap di halaman Login.',
      expectedMessage: 'Username atau password salah',
      payload: { username: 'admin01', password: 'adminSalah' },
      tester: 'RPN & SDA'
    },
    {
      id: 'MS003',
      group: 'login',
      type: 'negative',
      funcName: 'Login Admin',
      testType: 'Data Salah (Akun Tidak Ada)',
      procedure: '1) Input Username: userTidakAda\n2) Input Password: admin2026\n3) Klik tombol Masuk',
      expected: 'Sistem menampilkan pesan "Akun tidak ditemukan" dan tetap di halaman Login.',
      expectedMessage: 'Akun tidak ditemukan',
      payload: { username: 'userTidakAda', password: 'admin2026' },
      tester: 'RPN & SDA'
    },
    {
      id: 'MS001',
      group: 'login',
      type: 'positive',
      funcName: 'Login Admin',
      testType: 'Data Benar (Login Sukses)',
      procedure: '1) Input Username: admin01\n2) Input Password: admin2026\n3) Klik tombol Masuk',
      expected: 'Sistem berhasil login dan masuk ke halaman Dashboard Admin.',
      expectedMessage: 'Login berhasil! Selamat datang Admin.',
      payload: { username: 'admin01', password: 'admin2026' },
      tester: 'RPN & SDA'
    },

    // --- GRP 2: TAMBAH DATA PRODUK ---
    {
      id: 'PRD002',
      group: 'product_add',
      type: 'negative',
      funcName: 'Tambah Data Produk',
      testType: 'Data Salah (Kode Duplikat)',
      procedure: '1) Input Kode: PRD-0001 (sudah ada di katalog)\n2) Input Nama: Minyak Goreng 2L\n3) Harga: 35000, Stok: 10\n4) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Kode produk sudah digunakan" dan data tidak tersimpan.',
      expectedMessage: 'Kode produk sudah digunakan',
      payload: {
        code: 'PRD-0001',
        name: 'Minyak Goreng 2L',
        category: 'Sembako',
        price: '35000',
        stock: '10',
        unit: 'Botol',
        desc: 'Minyak goreng kemasan 2 liter',
        status: 'Aktif'
      },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD003',
      group: 'product_add',
      type: 'negative',
      funcName: 'Tambah Data Produk',
      testType: 'Data Salah (Nama Kosong)',
      procedure: '1) Input Kode: PRD-0100\n2) Input Nama: "" (dikosongkan)\n3) Harga: 18000, Stok: 25\n4) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Nama produk wajib diisi" dan data tidak tersimpan.',
      expectedMessage: 'Nama produk wajib diisi',
      payload: {
        code: 'PRD-0100',
        name: '',
        category: 'Sembako',
        price: '18000',
        stock: '25',
        unit: 'Botol',
        desc: 'Minyak goreng kemasan 1 liter',
        status: 'Aktif'
      },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD004',
      group: 'product_add',
      type: 'negative',
      funcName: 'Tambah Data Produk',
      testType: 'Data Salah (Harga Negatif)',
      procedure: '1) Input Kode: PRD-0099\n2) Input Nama: Teh Celup\n3) Input Harga: -5000\n4) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Harga harus lebih dari 0" dan data tidak tersimpan.',
      expectedMessage: 'Harga harus lebih dari 0',
      payload: {
        code: 'PRD-0099',
        name: 'Teh Celup',
        category: 'Minuman',
        price: '-5000',
        stock: '10',
        unit: 'Box',
        desc: 'Teh celup isi 25 pcs',
        status: 'Aktif'
      },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD005',
      group: 'product_add',
      type: 'negative',
      funcName: 'Tambah Data Produk',
      testType: 'Data Salah (Harga Bukan Angka)',
      procedure: '1) Input Kode: PRD-0101\n2) Input Nama: Kopi Bubuk 200g\n3) Input Harga: "delapan belas ribu"\n4) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Harga harus berupa angka" dan data tidak tersimpan.',
      expectedMessage: 'Harga harus berupa angka',
      payload: {
        code: 'PRD-0101',
        name: 'Kopi Bubuk 200g',
        category: 'Minuman',
        price: 'delapan belas ribu',
        stock: '15',
        unit: 'Pack',
        desc: 'Kopi bubuk kemasan 200 gram',
        status: 'Aktif'
      },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD001',
      group: 'product_add',
      type: 'positive',
      funcName: 'Tambah Data Produk',
      testType: 'Data Benar (Tambah Sukses)',
      procedure: '1) Input Kode: PRD-0001\n2) Input Nama: Minyak Goreng 1L\n3) Harga: 18000, Stok: 25\n4) Klik Simpan',
      expected: 'Sistem menampilkan notifikasi "Produk berhasil ditambahkan" dan data tampil pada daftar produk.',
      expectedMessage: 'Produk berhasil ditambahkan',
      payload: {
        code: 'PRD-0001',
        name: 'Minyak Goreng 1L',
        category: 'Sembako',
        price: '18000',
        stock: '25',
        unit: 'Botol',
        desc: 'Minyak goreng kemasan 1 liter',
        status: 'Aktif'
      },
      tester: 'RPN & SDA'
    },

    // --- GRP 3: LIHAT DATA PRODUK (LIST & DETAIL) ---
    {
      id: 'PRD010',
      group: 'product_view',
      type: 'negative',
      funcName: 'Lihat Data Produk (List)',
      testType: 'Data Salah (Tidak Ada Data)',
      procedure: '1) Simulasikan kondisi database kosong\n2) Buka menu Produk',
      expected: 'Sistem menampilkan informasi "Belum ada data produk" dan halaman tidak error.',
      expectedMessage: 'Belum ada data produk',
      payload: { action: 'view_empty_list' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD011',
      group: 'product_view',
      type: 'negative',
      funcName: 'Lihat Data Produk (Detail)',
      testType: 'Data Salah (Tidak Ditemukan)',
      procedure: '1) Buka menu Produk\n2) Cari/akses detail produk Kode = "PRD-8888"',
      expected: 'Sistem menampilkan pesan "Data tidak ditemukan" dan tidak crash.',
      expectedMessage: 'Data tidak ditemukan',
      payload: { code: 'PRD-8888' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD012',
      group: 'product_view',
      type: 'positive',
      funcName: 'Lihat Data Produk (List)',
      testType: 'Data Benar (Tampil di Daftar)',
      procedure: '1) Buka menu Produk saat produk PRD-0001 sudah tersimpan',
      expected: 'Sistem menampilkan daftar produk, termasuk Kode Produk = "PRD-0001", Nama Produk = "Minyak Goreng 1L", Kategori = "Sembako", Harga = "18000", Stok = "25".',
      expectedMessage: 'Daftar produk ditampilkan lengkap',
      payload: { action: 'view_catalog' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD013',
      group: 'product_view',
      type: 'positive',
      funcName: 'Lihat Data Produk (Detail)',
      testType: 'Data Benar (Detail Lengkap)',
      procedure: '1) Klik Detail pada produk Kode Produk = "PRD-0001"',
      expected: 'Sistem menampilkan detail lengkap sesuai data tersimpan.',
      expectedMessage: 'Detail produk PRD-0001 ditampilkan',
      payload: { code: 'PRD-0001' },
      tester: 'RPN & SDA'
    },

    // --- GRP 4: EDIT & HAPUS DATA PRODUK ---
    {
      id: 'PRD006',
      group: 'product_edit_delete',
      type: 'negative',
      funcName: 'Edit Data Produk',
      testType: 'Data Salah (Harga = 0)',
      procedure: '1) Klik Edit pada PRD-0001\n2) Ubah Harga = "0"\n3) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Harga harus lebih dari 0" dan data tidak berubah.',
      expectedMessage: 'Harga harus lebih dari 0',
      payload: { code: 'PRD-0001', price: '0' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD007',
      group: 'product_edit_delete',
      type: 'negative',
      funcName: 'Edit Data Produk',
      testType: 'Data Salah (Stok Bukan Angka)',
      procedure: '1) Klik Edit pada PRD-0001\n2) Ubah Stok = "dua puluh"\n3) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Stok harus berupa angka" dan data tidak berubah.',
      expectedMessage: 'Stok harus berupa angka',
      payload: { code: 'PRD-0001', stock: 'dua puluh' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD008',
      group: 'product_edit_delete',
      type: 'negative',
      funcName: 'Edit Data Produk',
      testType: 'Data Salah (Nama Kosong)',
      procedure: '1) Klik Edit pada PRD-0001\n2) Ubah Nama Produk = ""\n3) Klik Simpan',
      expected: 'Sistem menampilkan validasi "Nama produk wajib diisi" dan data tidak berubah.',
      expectedMessage: 'Nama produk wajib diisi',
      payload: { code: 'PRD-0001', name: '' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD009',
      group: 'product_edit_delete',
      type: 'negative',
      funcName: 'Hapus Data Produk',
      testType: 'Data Salah (Data Tidak Ada)',
      procedure: '1) Cari produk dengan Kode Produk = "PRD-9999"\n2) Klik Hapus jika tersedia',
      expected: 'Sistem menampilkan pesan "Data produk tidak ditemukan" atau tombol hapus tidak bisa digunakan.',
      expectedMessage: 'Data produk tidak ditemukan',
      payload: { code: 'PRD-9999' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD014',
      group: 'product_edit_delete',
      type: 'positive',
      funcName: 'Edit Data Produk',
      testType: 'Data Benar (Update Sukses)',
      procedure: '1) Klik Edit pada PRD-0001\n2) Ubah Harga = "18500", Stok = "30"\n3) Klik Simpan',
      expected: 'Sistem menampilkan notifikasi "Produk berhasil diperbarui" dan data berubah sesuai input.',
      expectedMessage: 'Produk berhasil diperbarui',
      payload: { code: 'PRD-0001', price: '18500', stock: '30' },
      tester: 'RPN & SDA'
    },
    {
      id: 'PRD015',
      group: 'product_edit_delete',
      type: 'positive',
      funcName: 'Hapus Data Produk',
      testType: 'Data Benar (Hapus Sukses)',
      procedure: '1) Klik Hapus pada produk PRD-0001\n2) Pada konfirmasi dialog, klik Ya',
      expected: 'Sistem menampilkan notifikasi "Produk berhasil dihapus" dan data tidak tampil lagi di daftar.',
      expectedMessage: 'Produk berhasil dihapus',
      payload: { code: 'PRD-0001', confirm: true },
      tester: 'RPN & SDA'
    }
  ];

  // Group definitions for progressive level gating
  const GROUPS = [
    {
      id: 'login',
      name: 'Level 1: Gerbang Login Admin',
      description: 'Verifikasi keamanan kredensial akun admin sebelum masuk ke sistem.',
      icon: '🔐'
    },
    {
      id: 'product_add',
      name: 'Level 2: Pertahanan Form Produk',
      description: 'Patahkan form input produk dengan validasi ketat sebelum menambah data valid.',
      icon: '📦'
    },
    {
      id: 'product_view',
      name: 'Level 3: Verifikasi Katalog & Detail',
      description: 'Uji batas tampilan tabel saat katalog kosong dan saat mencari kode fiktif.',
      icon: '📋'
    },
    {
      id: 'product_edit_delete',
      name: 'Level 4: Operasi Siklus Hidup (Edit & Hapus)',
      description: 'Uji batas perubahan nilai nol, tipe data stok, dan penghapusan data.',
      icon: '⚙️'
    }
  ];

  // Creates a clean test session state
  function createSession(savedProgress = null) {
    const passedMap = {};
    if (savedProgress && Array.isArray(savedProgress)) {
      savedProgress.forEach(id => { passedMap[id] = true; });
    }

    // Default mock database state
    let state = {
      isLoggedIn: false,
      currentUser: null,
      passedScenarios: passedMap,
      products: [
        {
          code: 'PRD-0001',
          name: 'Minyak Goreng 1L',
          category: 'Sembako',
          price: 18000,
          stock: 25,
          unit: 'Botol',
          desc: 'Minyak goreng kemasan 1 liter',
          status: 'Aktif'
        }
      ]
    };

    return {
      getState: () => ({ ...state }),
      getPassedList: () => Object.keys(state.passedScenarios),
      isScenarioPassed: (id) => !!state.passedScenarios[id],
      isGroupUnlocked: (groupId) => isGroupUnlocked(groupId, state.passedScenarios),
      isPositiveUnlocked: (groupId) => isPositiveUnlocked(groupId, state.passedScenarios),
      executeScenario: (scenarioId, inputPayload) => {
        return executeScenario(state, scenarioId, inputPayload);
      },
      reset: () => {
        state = {
          isLoggedIn: false,
          currentUser: null,
          passedScenarios: {},
          products: [
            {
              code: 'PRD-0001',
              name: 'Minyak Goreng 1L',
              category: 'Sembako',
              price: 18000,
              stock: 25,
              unit: 'Botol',
              desc: 'Minyak goreng kemasan 1 liter',
              status: 'Aktif'
            }
          ]
        };
      }
    };
  }

  // Check if a group is unlocked based on previous groups completion
  function isGroupUnlocked(groupId, passedScenarios) {
    const groupIndex = GROUPS.findIndex(g => g.id === groupId);
    if (groupIndex <= 0) return true; // Level 1 is always unlocked

    const prevGroup = GROUPS[groupIndex - 1];
    const prevScenarios = SCENARIOS.filter(s => s.group === prevGroup.id);
    return prevScenarios.every(s => passedScenarios[s.id]);
  }

  // Check if the positive scenario in a group is unlocked (all negatives in group must pass first!)
  function isPositiveUnlocked(groupId, passedScenarios) {
    const negativeScenariosInGroup = SCENARIOS.filter(s => s.group === groupId && s.type === 'negative');
    return negativeScenariosInGroup.every(s => passedScenarios[s.id]);
  }

  // Core Evaluation Logic
  function executeScenario(state, scenarioId, inputPayload) {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return { success: false, error: `Skenario ${scenarioId} tidak ditemukan.` };
    }

    // Gatekeeper Check: Positive requires all negatives in group to pass
    if (scenario.type === 'positive' && !isPositiveUnlocked(scenario.group, state.passedScenarios)) {
      return {
        success: false,
        blocked: true,
        scenarioId,
        message: 'Akses terkunci! Anda wajib menyelesaikan seluruh kasus negatif (uji kesalahan & validasi) sebelum mencoba skenario positif ini.'
      };
    }

    let match = false;
    let feedback = '';
    const payload = inputPayload || scenario.payload;

    // --- EVALUASI BERDASARKAN ID SKENARIO ---
    switch (scenarioId) {
      case 'MS002': { // Password Salah
        const u = (payload.username || '').trim();
        const p = payload.password || '';
        if (u === 'admin01' && p === 'adminSalah') {
          match = true;
          feedback = 'Username atau password salah';
        } else if (p !== 'admin2026') {
          match = true;
          feedback = 'Username atau password salah';
        }
        break;
      }

      case 'MS003': { // Akun Tidak Ada
        const u = (payload.username || '').trim();
        if (u === 'userTidakAda' || (u !== 'admin01' && u !== '')) {
          match = true;
          feedback = 'Akun tidak ditemukan';
        }
        break;
      }

      case 'MS001': { // Login Sukses
        const u = (payload.username || '').trim();
        const p = payload.password || '';
        if (u === 'admin01' && p === 'admin2026') {
          match = true;
          state.isLoggedIn = true;
          state.currentUser = 'admin01';
          feedback = 'Login berhasil! Selamat datang Admin.';
        }
        break;
      }

      case 'PRD002': { // Kode Duplikat
        const code = (payload.code || '').trim();
        const exists = state.products.some(pr => pr.code.toUpperCase() === code.toUpperCase());
        if (exists || code === 'PRD-0001') {
          match = true;
          feedback = 'Kode produk sudah digunakan';
        }
        break;
      }

      case 'PRD003': { // Nama Kosong
        const name = (payload.name || '').trim();
        if (!name) {
          match = true;
          feedback = 'Nama produk wajib diisi';
        }
        break;
      }

      case 'PRD004': { // Harga Negatif
        const rawPrice = String(payload.price || '').trim();
        const pVal = Number(rawPrice);
        if (!isNaN(pVal) && pVal <= 0) {
          match = true;
          feedback = 'Harga harus lebih dari 0';
        }
        break;
      }

      case 'PRD005': { // Harga Bukan Angka
        const rawPrice = String(payload.price || '').trim();
        if (isNaN(Number(rawPrice)) || rawPrice === 'delapan belas ribu') {
          match = true;
          feedback = 'Harga harus berupa angka';
        }
        break;
      }

      case 'PRD001': { // Tambah Sukses
        const code = (payload.code || '').trim();
        const name = (payload.name || '').trim();
        const price = Number(payload.price);
        const stock = Number(payload.stock);

        if (code && name && !isNaN(price) && price > 0 && !isNaN(stock) && stock >= 0) {
          match = true;
          // Pastikan tidak duplikat di state
          state.products = state.products.filter(p => p.code !== code);
          state.products.push({
            code,
            name,
            category: payload.category || 'Sembako',
            price,
            stock,
            unit: payload.unit || 'Botol',
            desc: payload.desc || '',
            status: payload.status || 'Aktif'
          });
          feedback = 'Produk berhasil ditambahkan';
        }
        break;
      }

      case 'PRD010': { // Lihat List saat Kosong
        match = true;
        feedback = 'Belum ada data produk';
        break;
      }

      case 'PRD011': { // Detail fiktif
        const code = (payload.code || '').trim();
        if (code === 'PRD-8888' || !state.products.some(p => p.code === code)) {
          match = true;
          feedback = 'Data tidak ditemukan';
        }
        break;
      }

      case 'PRD012': { // List Katalog Sukses
        match = true;
        feedback = 'Daftar produk ditampilkan lengkap';
        break;
      }

      case 'PRD013': { // Detail Produk Tersimpan Sukses
        const code = (payload.code || '').trim() || 'PRD-0001';
        const found = state.products.find(p => p.code === code);
        if (found) {
          match = true;
          feedback = `Detail produk ${code} ditampilkan (${found.name}, Rp${found.price})`;
        }
        break;
      }

      case 'PRD006': { // Edit Harga = 0
        const rawPrice = String(payload.price || '').trim();
        if (rawPrice === '0' || Number(rawPrice) === 0) {
          match = true;
          feedback = 'Harga harus lebih dari 0';
        }
        break;
      }

      case 'PRD007': { // Edit Stok Bukan Angka
        const rawStock = String(payload.stock || '').trim();
        if (isNaN(Number(rawStock)) || rawStock === 'dua puluh') {
          match = true;
          feedback = 'Stok harus berupa angka';
        }
        break;
      }

      case 'PRD008': { // Edit Nama Kosong
        const name = (payload.name || '').trim();
        if (!name) {
          match = true;
          feedback = 'Nama produk wajib diisi';
        }
        break;
      }

      case 'PRD009': { // Hapus Kode Fiktif
        const code = (payload.code || '').trim();
        if (code === 'PRD-9999' || !state.products.some(p => p.code === code)) {
          match = true;
          feedback = 'Data produk tidak ditemukan';
        }
        break;
      }

      case 'PRD014': { // Edit Sukses
        const code = (payload.code || '').trim() || 'PRD-0001';
        const prod = state.products.find(p => p.code === code);
        if (prod) {
          if (payload.price) prod.price = Number(payload.price);
          if (payload.stock) prod.stock = Number(payload.stock);
          match = true;
          feedback = 'Produk berhasil diperbarui';
        }
        break;
      }

      case 'PRD015': { // Hapus Sukses
        const code = (payload.code || '').trim() || 'PRD-0001';
        if (payload.confirm) {
          state.products = state.products.filter(p => p.code !== code);
          match = true;
          feedback = 'Produk berhasil dihapus';
        }
        break;
      }
    }

    if (match) {
      state.passedScenarios[scenarioId] = true;
      return {
        success: true,
        scenarioId,
        feedback,
        expectedMessage: scenario.expectedMessage,
        isPositive: scenario.type === 'positive',
        group: scenario.group,
        totalPassed: Object.keys(state.passedScenarios).length,
        totalScenarios: SCENARIOS.length
      };
    } else {
      return {
        success: false,
        scenarioId,
        feedback: feedback || 'Respons sistem tidak sesuai dengan kriteria uji.',
        expectedMessage: scenario.expectedMessage
      };
    }
  }

  return {
    SCENARIOS,
    GROUPS,
    createSession,
    isGroupUnlocked,
    isPositiveUnlocked
  };
}));
