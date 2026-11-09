/**
 * UatGame - Controller and UI/UX animator for UAT Bug Hunter Simulator
 * Handles fullscreen mock sandbox, flying data packet animations, audio feedback, and Lampiran C table stamping.
 */
(function () {
  'use strict';

  const engine = window.UatEngine;
  if (!engine) {
    console.error('UatEngine tidak ditemukan! Pastikan assets/js/uat-engine.js dimuat sebelum uat-game.js');
    return;
  }

  const STORAGE_KEY = 'kasirkita-uat-progress';
  const savedProgress = loadProgress();
  const session = engine.createSession(savedProgress);

  // Audio System using Web Audio API
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.15, vol = 0.08) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  function soundInject() {
    playTone(520, 'sine', 0.08, 0.06);
    setTimeout(() => playTone(650, 'sine', 0.1, 0.06), 40);
  }

  function soundNegativeCaught() {
    playTone(392.00, 'triangle', 0.15, 0.1); // G4
    setTimeout(() => playTone(329.63, 'triangle', 0.25, 0.1), 90); // E4
  }

  function soundPositivePassed() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.18, 0.09), idx * 75);
    });
  }

  function soundImpact() {
    playTone(880, 'sine', 0.12, 0.12);
    setTimeout(() => playTone(1174.66, 'sine', 0.18, 0.12), 60);
  }

  // State
  let currentGroup = 'login';
  let activeScenarioId = 'MS002';

  // DOM Elements
  const levelTabs = document.querySelectorAll('.uat-level-tab');
  const questBadge = document.getElementById('questBadge');
  const questTitle = document.getElementById('questTitle');
  const questDesc = document.getElementById('questDesc');
  const btnInject = document.getElementById('btnInject');
  const questCard = document.getElementById('questCard');
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  const btnReset = document.getElementById('btnReset');

  // Screens
  const screenLogin = document.getElementById('screenLogin');
  const screenProduct = document.getElementById('screenProduct');
  const screenCatalog = document.getElementById('screenCatalog');
  const mockUrl = document.getElementById('mockUrl');

  // Login inputs
  const loginForm = document.getElementById('loginForm');
  const inputUsername = document.getElementById('inputUsername');
  const inputPassword = document.getElementById('inputPassword');
  const loginAlert = document.getElementById('loginAlert');

  // Product inputs
  const productForm = document.getElementById('productForm');
  const inputProdCode = document.getElementById('prodCode');
  const inputProdName = document.getElementById('prodName');
  const inputProdCat = document.getElementById('prodCat');
  const inputProdPrice = document.getElementById('prodPrice');
  const inputProdStock = document.getElementById('prodStock');
  const inputProdUnit = document.getElementById('prodUnit');
  const inputProdStatus = document.getElementById('prodStatus');
  const productAlert = document.getElementById('productAlert');
  const errProdCode = document.getElementById('errProdCode');
  const errProdName = document.getElementById('errProdName');
  const errProdPrice = document.getElementById('errProdPrice');
  const errProdStock = document.getElementById('errProdStock');

  // Catalog Screen Elements
  const catalogListAlert = document.getElementById('catalogListAlert');
  const catalogTableBody = document.getElementById('catalogTableBody');
  const btnTriggerEmpty = document.getElementById('btnTriggerEmpty');
  const btnTriggerDetailFiktif = document.getElementById('btnTriggerDetailFiktif');
  const btnTriggerViewCatalog = document.getElementById('btnTriggerViewCatalog');
  const btnTriggerViewDetail = document.getElementById('btnTriggerViewDetail');

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (_) {
      return [];
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session.getPassedList()));
    } catch (_) {}
  }

  // Initialize UI
  function init() {
    renderTableRows();
    updateProgressDisplay();
    setupEventListeners();
    selectGroup('login');
  }

  function updateProgressDisplay() {
    const passed = session.getPassedList();
    const total = engine.SCENARIOS.length;
    if (progressText) progressText.textContent = `${passed.length} / ${total} Selesai`;
    if (progressFill) progressFill.style.width = `${(passed.length / total) * 100}%`;

    // Update level tabs lock status
    levelTabs.forEach(tab => {
      const gId = tab.dataset.group;
      const unlocked = session.isGroupUnlocked(gId);
      tab.classList.toggle('locked', !unlocked);
      tab.title = unlocked ? 'Tersedia' : 'Selesaikan level sebelumnya untuk membuka';
    });
  }

  function selectGroup(groupId) {
    if (!session.isGroupUnlocked(groupId)) {
      alert('Level ini terkunci! Selesaikan seluruh misi pada level sebelumnya.');
      return;
    }
    currentGroup = groupId;

    levelTabs.forEach(t => t.classList.toggle('active', t.dataset.group === groupId));

    // Show appropriate mock screen
    if (groupId === 'login') {
      screenLogin.style.display = 'block';
      screenProduct.style.display = 'none';
      screenCatalog.style.display = 'none';
      mockUrl.textContent = 'https://kasirkita.local/admin/login';
    } else if (groupId === 'product_add' || groupId === 'product_edit_delete') {
      screenLogin.style.display = 'none';
      screenProduct.style.display = 'block';
      screenCatalog.style.display = 'none';
      mockUrl.textContent = 'https://kasirkita.local/admin/produk/form';
    } else if (groupId === 'product_view') {
      screenLogin.style.display = 'none';
      screenProduct.style.display = 'none';
      screenCatalog.style.display = 'block';
      mockUrl.textContent = 'https://kasirkita.local/admin/produk';
      renderCatalogRows();
    }

    // Pick first unpassed scenario in group, or default to first
    const groupScenarios = engine.SCENARIOS.filter(s => s.group === groupId);
    const firstPending = groupScenarios.find(s => !session.isScenarioPassed(s.id)) || groupScenarios[0];
    selectScenario(firstPending.id);
  }

  function selectScenario(scenarioId) {
    activeScenarioId = scenarioId;
    const scenario = engine.SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    // Highlight target row in Lampiran C table
    document.querySelectorAll('.uat-table tr').forEach(r => r.classList.remove('active-target'));
    const targetRow = document.getElementById(`row-${scenarioId}`);
    if (targetRow) {
      targetRow.classList.add('active-target');
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update quest card info
    const isPassed = session.isScenarioPassed(scenarioId);
    const isPositive = scenario.type === 'positive';
    const isPositiveUnlocked = session.isPositiveUnlocked(scenario.group);

    questCard.classList.toggle('quest-positive', isPositive);
    questBadge.textContent = isPositive ? 'Kasus Positif (Happy Path)' : 'Kasus Negatif (Uji Validasi)';
    questTitle.textContent = `${scenario.id} — ${scenario.testType}`;

    let desc = scenario.procedure.replace(/\n/g, ' · ');
    if (isPassed) {
      desc = `✓ SUDAH TERVERIFIKASI LULUS: "${scenario.expectedMessage}"`;
    } else if (isPositive && !isPositiveUnlocked) {
      desc = `🔒 TERKUNCI: Selesaikan seluruh kasus negatif di level ini untuk membuka pengujian sukses ini!`;
    }
    questDesc.textContent = desc;

    btnInject.className = isPositive ? 'uat-btn-inject btn-positive' : 'uat-btn-inject';
    btnInject.innerHTML = `<span>⚡</span> Suntik Skenario ${scenario.id}`;

    if (isPositive && !isPositiveUnlocked) {
      btnInject.style.opacity = '0.4';
      btnInject.style.pointerEvents = 'none';
    } else {
      btnInject.style.opacity = '1';
      btnInject.style.pointerEvents = 'auto';
    }

    clearFormErrors();
  }

  function clearFormErrors() {
    if (loginAlert) {
      loginAlert.className = 'uat-alert';
      loginAlert.textContent = '';
      loginAlert.style.display = 'none';
    }
    if (productAlert) {
      productAlert.className = 'uat-alert';
      productAlert.textContent = '';
      productAlert.style.display = 'none';
    }
    [errProdCode, errProdName, errProdPrice, errProdStock].forEach(el => {
      if (el) {
        el.style.display = 'none';
        el.parentElement.classList.remove('has-error');
      }
    });
  }

  // Quick Inject Payload into form inputs
  function injectCurrentScenario() {
    const scenario = engine.SCENARIOS.find(s => s.id === activeScenarioId);
    if (!scenario) return;

    soundInject();
    clearFormErrors();
    const p = scenario.payload;

    if (scenario.group === 'login') {
      inputUsername.value = p.username || '';
      inputPassword.value = p.password || '';
      inputUsername.focus();
    } else if (scenario.group === 'product_add' || scenario.group === 'product_edit_delete') {
      if (p.code !== undefined) inputProdCode.value = p.code;
      if (p.name !== undefined) inputProdName.value = p.name;
      if (p.category !== undefined) inputProdCat.value = p.category;
      if (p.price !== undefined) inputProdPrice.value = p.price;
      if (p.stock !== undefined) inputProdStock.value = p.stock;
      if (p.unit !== undefined) inputProdUnit.value = p.unit;
      if (p.status !== undefined) inputProdStatus.value = p.status;
      inputProdName.focus();
    }
  }

  // Trigger Flying Data Packet Animation from source element to table row
  function triggerFlyingPacket(sourceEl, targetRowId, scenarioId, statusText) {
    const targetRow = document.getElementById(targetRowId);
    if (!targetRow || !sourceEl) return;

    const srcRect = sourceEl.getBoundingClientRect();
    const destRect = targetRow.getBoundingClientRect();

    const startX = srcRect.left + srcRect.width / 2;
    const startY = srcRect.top + srcRect.height / 2;
    const endX = destRect.left + 80;
    const endY = destRect.top + destRect.height / 2;

    const packet = document.createElement('div');
    packet.className = 'flying-packet';
    packet.innerHTML = `<span>⚡</span> <span>${scenarioId}: ${statusText}</span>`;
    packet.style.left = `${startX}px`;
    packet.style.top = `${startY}px`;
    document.body.appendChild(packet);

    // Trigger animation to destination
    requestAnimationFrame(() => {
      packet.style.left = `${endX}px`;
      packet.style.top = `${endY}px`;
      packet.style.transform = 'translate(-50%, -50%) scale(1.1)';
    });

    // Impact
    setTimeout(() => {
      soundImpact();
      packet.style.opacity = '0';
      packet.style.transform = 'translate(-50%, -50%) scale(1.3)';
      setTimeout(() => packet.remove(), 250);

      // Flash target row and update text
      targetRow.classList.add('row-impact');
      targetRow.classList.add('row-passed');
      setTimeout(() => targetRow.classList.remove('row-impact'), 1000);

      const statusCell = targetRow.querySelector('.col-status');
      if (statusCell) {
        statusCell.innerHTML = `<span class="uat-badge-status pass">✓ LULUS</span>`;
      }
      const actualCell = targetRow.querySelector('.col-tester-result') || targetRow.querySelector('.col-actual');
      if (actualCell) {
        const scenario = engine.SCENARIOS.find(s => s.id === scenarioId);
        actualCell.textContent = '✓ ' + scenario.expectedMessage;
        actualCell.style.color = '#34d399';
      }
      const dateCell = targetRow.querySelector('.col-date');
      if (dateCell) {
        dateCell.textContent = '16/10/2026';
        dateCell.style.color = '#cbd5e1';
      }

      saveProgress();
      updateProgressDisplay();

      // Auto advance to next scenario
      advanceScenarioAfterPass(scenarioId);
    }, 650);
  }

  function advanceScenarioAfterPass(scenarioId) {
    const groupScenarios = engine.SCENARIOS.filter(s => s.group === currentGroup);
    const nextPending = groupScenarios.find(s => !session.isScenarioPassed(s.id));

    if (nextPending) {
      setTimeout(() => selectScenario(nextPending.id), 800);
    } else {
      // Group complete! Check if next group unlocked
      const gIdx = engine.GROUPS.findIndex(g => g.id === currentGroup);
      if (gIdx < engine.GROUPS.length - 1) {
        const nextG = engine.GROUPS[gIdx + 1];
        setTimeout(() => {
          alert(`🎉 Selamat! Level ${gIdx + 1} tuntas. Membuka ${nextG.name}!`);
          selectGroup(nextG.id);
        }, 800);
      } else {
        setTimeout(() => {
          alert('🏆 LUAR BIASA! Seluruh 18 Misi User Testing (UT) KasirKita Lulus 100%! Sistem siap rilis ke Toko Rani.');
        }, 800);
      }
    }
  }

  // Handle Login Submission
  function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    clearFormErrors();

    const u = inputUsername.value;
    const p = inputPassword.value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    const result = session.executeScenario(activeScenarioId, { username: u, password: p });

    if (!result.success) {
      if (result.blocked) {
        loginAlert.className = 'uat-alert alert-error';
        loginAlert.textContent = `🔒 ${result.message}`;
        loginAlert.style.display = 'block';
        return;
      }
      loginAlert.className = 'uat-alert alert-error';
      loginAlert.textContent = `❌ Uji coba belum sesuai: "${result.feedback}". Klik [⚡ Suntik Skenario] untuk mencoba skenario yang tepat.`;
      loginAlert.style.display = 'block';
      return;
    }

    // Success matching scenario!
    if (result.isPositive) {
      soundPositivePassed();
      loginAlert.className = 'uat-alert alert-success';
      loginAlert.textContent = `✓ ${result.feedback}`;
      loginAlert.style.display = 'block';
      triggerFlyingPacket(submitBtn, `row-${result.scenarioId}`, result.scenarioId, 'LOGIN SUKSES');
    } else {
      soundNegativeCaught();
      loginAlert.className = 'uat-alert alert-error';
      loginAlert.textContent = `Peringatan: ${result.feedback}`;
      loginAlert.style.display = 'block';
      triggerFlyingPacket(loginAlert, `row-${result.scenarioId}`, result.scenarioId, 'VALIDASI TERBUKTI');
    }
  }

  // Handle Product Form Submission
  function handleProductSubmit(e) {
    if (e) e.preventDefault();
    clearFormErrors();

    const payload = {
      code: inputProdCode.value,
      name: inputProdName.value,
      category: inputProdCat.value,
      price: inputProdPrice.value,
      stock: inputProdStock.value,
      unit: inputProdUnit.value,
      desc: '',
      status: inputProdStatus.value
    };

    const submitBtn = productForm.querySelector('button[type="submit"]');
    const result = session.executeScenario(activeScenarioId, payload);

    if (!result.success) {
      if (result.blocked) {
        productAlert.className = 'uat-alert alert-error';
        productAlert.textContent = `🔒 ${result.message}`;
        productAlert.style.display = 'block';
        return;
      }
      productAlert.className = 'uat-alert alert-error';
      productAlert.textContent = `❌ ${result.feedback}`;
      productAlert.style.display = 'block';
      return;
    }

    // Show contextual validation on field
    if (!result.isPositive) {
      soundNegativeCaught();
      let targetSource = submitBtn;

      if (result.scenarioId === 'PRD002') {
        errProdCode.textContent = result.feedback;
        errProdCode.style.display = 'block';
        errProdCode.parentElement.classList.add('has-error');
        targetSource = errProdCode;
      } else if (result.scenarioId === 'PRD003' || result.scenarioId === 'PRD008') {
        errProdName.textContent = result.feedback;
        errProdName.style.display = 'block';
        errProdName.parentElement.classList.add('has-error');
        targetSource = errProdName;
      } else if (result.scenarioId === 'PRD004' || result.scenarioId === 'PRD005' || result.scenarioId === 'PRD006') {
        errProdPrice.textContent = result.feedback;
        errProdPrice.style.display = 'block';
        errProdPrice.parentElement.classList.add('has-error');
        targetSource = errProdPrice;
      } else if (result.scenarioId === 'PRD007') {
        errProdStock.textContent = result.feedback;
        errProdStock.style.display = 'block';
        errProdStock.parentElement.classList.add('has-error');
        targetSource = errProdStock;
      }

      productAlert.className = 'uat-alert alert-error';
      productAlert.textContent = `Validasi Aktif: ${result.feedback}`;
      productAlert.style.display = 'block';

      triggerFlyingPacket(targetSource, `row-${result.scenarioId}`, result.scenarioId, 'VALIDASI TERBUKTI');
    } else {
      soundPositivePassed();
      productAlert.className = 'uat-alert alert-success';
      productAlert.textContent = `✓ ${result.feedback}`;
      productAlert.style.display = 'block';
      triggerFlyingPacket(submitBtn, `row-${result.scenarioId}`, result.scenarioId, 'PRODUK TERSIMPAN');
    }
  }

  // Handle Catalog Actions
  function handleCatalogAction(scenarioId, btn) {
    const result = session.executeScenario(scenarioId);
    if (!result.success) {
      if (result.blocked) alert(result.message);
      return;
    }

    if (result.isPositive) {
      soundPositivePassed();
      catalogListAlert.className = 'uat-alert alert-success';
      catalogListAlert.textContent = `✓ ${result.feedback}`;
      catalogListAlert.style.display = 'block';
      renderCatalogRows();
    } else {
      soundNegativeCaught();
      catalogListAlert.className = 'uat-alert alert-error';
      catalogListAlert.textContent = `Sistem: ${result.feedback}`;
      catalogListAlert.style.display = 'block';
    }

    triggerFlyingPacket(btn, `row-${scenarioId}`, scenarioId, 'TERVERIFIKASI');
  }

  function renderCatalogRows() {
    if (!catalogTableBody) return;
    const st = session.getState();
    catalogTableBody.innerHTML = '';
    st.products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.code}</strong></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>Rp${p.price.toLocaleString('id-ID')}</td>
        <td>${p.stock}</td>
        <td><span style="color:#10b981">● ${p.status}</span></td>
      `;
      catalogTableBody.appendChild(tr);
    });
  }

  const CATEGORY_BANNERS = [
    { group: 'login', title: 'LOGIN ADMIN (LG / MS)' },
    { group: 'product_add', title: 'TAMBAH DATA PRODUK (PRD)' },
    { group: 'product_view', title: 'LIHAT DATA PRODUK (PRD)' },
    { group: 'product_edit_delete', title: 'EDIT & HAPUS DATA PRODUK (PRD)' }
  ];

  function formatProcedure(procText) {
    if (!procText) return '-';
    return procText.split('\n').map(line => {
      const trimmed = line.trim();
      return `<div class="ut-proc-step">${trimmed}</div>`;
    }).join('');
  }

  // Render Official Table Rows based on Dokumen User Testing (UT)
  function renderTableRows() {
    const tbody = document.getElementById('uatTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let globalIndex = 1;

    CATEGORY_BANNERS.forEach(cat => {
      // Category banner row spanning all 9 columns matching Image 2
      const bannerTr = document.createElement('tr');
      bannerTr.className = 'ut-category-banner';
      bannerTr.title = `Kategori: ${cat.title} (Klik untuk beralih level)`;
      bannerTr.innerHTML = `
        <td colspan="9">
          <strong>${cat.title}</strong>
        </td>
      `;
      bannerTr.onclick = () => {
        selectGroup(cat.group);
      };
      tbody.appendChild(bannerTr);

      // Scenarios in this category
      const groupScenarios = engine.SCENARIOS.filter(s => s.group === cat.group);
      groupScenarios.forEach(sc => {
        const isPassed = session.isScenarioPassed(sc.id);
        const tr = document.createElement('tr');
        tr.id = `row-${sc.id}`;
        tr.className = isPassed ? 'row-passed' : '';
        tr.style.cursor = 'pointer';

        tr.onclick = () => {
          selectGroup(sc.group);
          selectScenario(sc.id);
        };

        const caseBadge = sc.type === 'positive'
          ? '<span class="ut-badge-case normal">Normal</span>'
          : '<span class="ut-badge-case error">Error</span>';

        tr.innerHTML = `
          <td style="font-weight:700;color:#94a3b8;text-align:center;">${globalIndex++}</td>
          <td style="font-family:monospace;font-weight:700;color:var(--accent-cyan);text-align:center;">${sc.id}</td>
          <td><strong style="color:#f8fafc;">${sc.funcName}</strong></td>
          <td style="text-align:center;">${caseBadge}</td>
          <td>
            <div class="ut-proc-container">${formatProcedure(sc.procedure)}</div>
          </td>
          <td>
            <div class="ut-expected">${sc.expected}</div>
          </td>
          <td class="col-tester-result" style="color:${isPassed ? '#34d399' : '#64748b'};font-weight:600;">
            ${isPassed ? '✓ ' + sc.expectedMessage : 'Belum diuji'}
          </td>
          <td class="col-date" style="font-size:10.5px;color:${isPassed ? '#cbd5e1' : '#64748b'};text-align:center;">
            ${isPassed ? '16/10/2026' : '-'}
          </td>
          <td class="col-status" style="text-align:center;">
            <span class="uat-badge-status ${isPassed ? 'pass' : 'pending'}">${isPassed ? '✓ LULUS' : 'PENDING'}</span>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  function setupEventListeners() {
    levelTabs.forEach(t => {
      t.onclick = () => selectGroup(t.dataset.group);
    });

    if (btnInject) {
      btnInject.onclick = injectCurrentScenario;
    }

    if (loginForm) {
      loginForm.onsubmit = handleLoginSubmit;
    }

    if (productForm) {
      productForm.onsubmit = handleProductSubmit;
    }

    if (btnTriggerEmpty) {
      btnTriggerEmpty.onclick = () => handleCatalogAction('PRD010', btnTriggerEmpty);
    }
    if (btnTriggerDetailFiktif) {
      btnTriggerDetailFiktif.onclick = () => handleCatalogAction('PRD011', btnTriggerDetailFiktif);
    }
    if (btnTriggerViewCatalog) {
      btnTriggerViewCatalog.onclick = () => handleCatalogAction('PRD012', btnTriggerViewCatalog);
    }
    if (btnTriggerViewDetail) {
      btnTriggerViewDetail.onclick = () => handleCatalogAction('PRD013', btnTriggerViewDetail);
    }

    if (btnReset) {
      btnReset.onclick = () => {
        if (confirm('Ulangi seluruh progres pengujian User Testing (UT) dari awal?')) {
          session.reset();
          localStorage.removeItem(STORAGE_KEY);
          renderTableRows();
          updateProgressDisplay();
          selectGroup('login');
        }
      };
    }
  }

  document.addEventListener('DOMContentLoaded', init);
}());
