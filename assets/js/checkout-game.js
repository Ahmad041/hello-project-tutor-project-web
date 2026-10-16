(() => {
  'use strict';
  const game = document.querySelector('.checkout-game');
  if (!game) return;

  const spec = JSON.parse(document.querySelector('#checkout-spec').textContent);
  const key = 'kasirkita-checkout-v1';
  const status = game.querySelector('.checkout-status');
  const issuesList = game.querySelector('.checkout-issues');
  const traceList = game.querySelector('.checkout-trace');
  const resultMsg = game.querySelector('.checkout-result');
  const liveTracker = game.querySelector('.sim-live-status');
  const trackerText = game.querySelector('.tracker-text');
  const svg = game.querySelector('.checkout-svg-canvas');
  const wiresGroup = game.querySelector('.checkout-wires-group');
  const tokenGroup = game.querySelector('.checkout-token-group');

  const drawings = {
    end: '<rect x="2" y="4" width="76" height="32" rx="16"/>',
    step: '<rect x="2" y="4" width="76" height="32" rx="3"/>',
    decision: '<path d="M40 2L78 20L40 38L2 20Z"/>',
    io: '<path d="M14 4H78L66 36H2Z"/>'
  };

  const defaults = () => ({
    kinds: Object.fromEntries(spec.nodes.map(n => [n.id, n.kind])),
    edges: Object.fromEntries(spec.edges.map(e => [e.key, e.to]))
  });

  function challenge() {
    const a = defaults();
    a.kinds.valid = 'step';
    a.kinds.receipt = 'step';
    a.edges['valid:Tidak'] = 'save';
    a.edges['saved:Tidak'] = 'receipt';
    a.edges['error:Perbaiki / coba lagi'] = 'finish';
    return a;
  }

  function read() {
    return {
      kinds: Object.fromEntries([...game.querySelectorAll('[data-kind]')].map(s => [s.dataset.kind, s.value])),
      edges: Object.fromEntries([...game.querySelectorAll('[data-edge]')].map(s => [s.dataset.edge, s.value]))
    };
  }

  function updateShapeUI() {
    game.querySelectorAll('[data-kind]').forEach(select => {
      const nodeEl = select.closest('.checkout-node');
      if (!nodeEl) return;
      const val = select.value;
      
      // Update symbol SVG preview
      const preview = nodeEl.querySelector('.checkout-symbol');
      if (preview) {
        preview.innerHTML = '<svg viewBox="0 0 80 40" focusable="false">' + (drawings[val] || '') + '</svg>';
      }

      // Update button active state
      nodeEl.querySelectorAll('.btn-shape').forEach(btn => {
        const isMatch = btn.dataset.setShape === val;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      // Update node silhouette styling class
      nodeEl.classList.remove('shape-end', 'shape-step', 'shape-decision', 'shape-io');
      if (val) nodeEl.classList.add(`shape-${val}`);
    });
  }

  function clearResults() {
    issuesList.replaceChildren();
    traceList.replaceChildren();
    resultMsg.textContent = '';
    if (liveTracker) liveTracker.style.display = 'none';
    if (tokenGroup) tokenGroup.replaceChildren();
    game.querySelectorAll('.checkout-node').forEach(n => {
      n.classList.remove('checkout-visited', 'checkout-active');
    });
  }

  const canvasContainer = game.querySelector('.checkout-canvas-container');
  const canvasViewport = game.querySelector('.checkout-canvas-viewport');
  const zoomValBtn = game.querySelector('.btn-zoom-val');

  let zoomLevel = 1.0;
  const MIN_ZOOM = 0.6;
  const MAX_ZOOM = 1.3;
  const STEP = 0.1;

  function applyZoom(newZoom) {
    zoomLevel = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(newZoom * 10) / 10));
    if (canvasContainer) {
      canvasContainer.style.transform = `scale(${zoomLevel})`;
    }
    if (zoomValBtn) {
      zoomValBtn.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
    requestAnimationFrame(updateWires);
  }

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(read()));
    } catch {}
  }

  // Visual SVG curve generator connecting nodes
  function updateWires() {
    if (!svg || !wiresGroup) return;

    const container = svg.closest('.checkout-canvas-container') || svg.parentElement;
    const scale = zoomLevel || 1;
    const contRect = container.getBoundingClientRect();
    const w = Math.max(container.offsetWidth, 320);
    const h = Math.max(container.scrollHeight, 860);

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.width = `${w}px`;
    svg.style.height = `${h}px`;

    wiresGroup.replaceChildren();

    const answers = read();

    for (const edge of spec.edges) {
      const targetId = answers.edges[edge.key];
      if (!targetId) continue;

      const fromNode = game.querySelector(`[data-node="${edge.from}"]`);
      const toNode = game.querySelector(`[data-node="${targetId}"]`);
      if (!fromNode || !toNode) continue;

      const fRect = fromNode.getBoundingClientRect();
      const tRect = toNode.getBoundingClientRect();

      // Determine wire color & marker
      let wireType = 'next';
      let strokeColor = '#38bdf8';
      if (edge.label === 'Ya') {
        wireType = 'ya';
        strokeColor = '#10b981';
      } else if (edge.label === 'Tidak') {
        wireType = 'tidak';
        strokeColor = '#f43f5e';
      } else if (edge.label.includes('Perbaiki') || edge.label.includes('coba')) {
        wireType = 'retry';
        strokeColor = '#f59e0b';
      }

      let x1, y1, x2, y2, d;

      // Check spatial relationship relative to container (unscaled)
      const fx1 = (fRect.left - contRect.left) / scale;
      const fy1 = (fRect.top - contRect.top) / scale;
      const fw = fRect.width / scale;
      const fh = fRect.height / scale;

      const tx1 = (tRect.left - contRect.left) / scale;
      const ty1 = (tRect.top - contRect.top) / scale;
      const tw = tRect.width / scale;
      const th = tRect.height / scale;

      const isDownward = ty1 >= (fy1 + fh - 20);
      const isUpward = (ty1 + th) <= (fy1 + 20);

      if (edge.from === 'error' && targetId === 'input') {
        // Special case: Loop from error up to input
        x1 = fx1 + 10;
        y1 = fy1 + 30;
        x2 = tx1;
        y2 = ty1 + th * 0.5;
        const gutter = Math.max(16, fx1 - 36);
        d = `M ${x1} ${y1} H ${gutter} V ${y2} H ${x2}`;
      } else if (edge.from === 'valid' && targetId === 'error') {
        // Valid -> Error (branch left)
        x1 = fx1;
        y1 = fy1 + fh * 0.45;
        x2 = tx1 + tw;
        y2 = ty1 + th * 0.35;
        const midX = (x1 + x2) / 2;
        d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
      } else if (edge.from === 'saved' && targetId === 'error') {
        // Saved -> Error (branch left)
        x1 = fx1;
        y1 = fy1 + fh * 0.5;
        x2 = tx1 + tw;
        y2 = ty1 + th * 0.7;
        const midX = (x1 + x2) / 2;
        d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
      } else if (isDownward) {
        // Straight down or curved down
        x1 = fx1 + fw * 0.5;
        y1 = fy1 + fh;
        x2 = tx1 + tw * 0.5;
        y2 = ty1;
        const midY = (y1 + y2) / 2;
        d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      } else if (isUpward) {
        // Upward loop
        x1 = fx1;
        y1 = fy1 + fh * 0.5;
        x2 = tx1;
        y2 = ty1 + th * 0.5;
        const gutter = Math.max(16, Math.min(x1, x2) - 40);
        d = `M ${x1} ${y1} C ${gutter} ${y1}, ${gutter} ${y2}, ${x2} ${y2}`;
      } else {
        // Lateral / side-by-side
        if (fx1 > tx1) {
          x1 = fx1;
          y1 = fy1 + fh * 0.5;
          x2 = tx1 + tw;
          y2 = ty1 + th * 0.5;
        } else {
          x1 = fx1 + fw;
          y1 = fy1 + fh * 0.5;
          x2 = tx1;
          y2 = ty1 + th * 0.5;
        }
        const midX = (x1 + x2) / 2;
        d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('marker-end', `url(#arrow-${wireType})`);
      path.classList.add('pipeline-wire', `wire-${wireType}`);
      path.dataset.edgeKey = edge.key;

      if (edge.label === 'Tidak') {
        path.setAttribute('stroke-dasharray', '6 4');
      }

      wiresGroup.appendChild(path);
    }
  }

  function apply(a) {
    game.querySelectorAll('[data-kind]').forEach(s => {
      s.value = a.kinds?.[s.dataset.kind] || '';
    });
    game.querySelectorAll('[data-edge]').forEach(s => {
      s.value = a.edges?.[s.dataset.edge] || '';
    });
    updateShapeUI();
    clearResults();
    requestAnimationFrame(updateWires);
  }

  // Initialize state
  let initial = challenge();
  let restored = false;
  try {
    const old = JSON.parse(localStorage.getItem(key));
    if (old?.kinds && old?.edges) {
      initial = old;
      restored = true;
    }
  } catch {}

  apply(initial);
  status.textContent = restored
    ? 'Pilihan terakhir dipulihkan. Lanjutkan memperbaiki alur checkout.'
    : 'Ada lima aturan alur yang sengaja salah. Klik tombol bentuk atau sambungan keluar untuk memperbaikinya.';

  // Delegate shape button clicks
  game.addEventListener('click', event => {
    const btn = event.target.closest('.btn-shape');
    if (!btn) return;
    const nodeEl = btn.closest('.checkout-node');
    if (!nodeEl) return;
    const select = nodeEl.querySelector('[data-kind]');
    if (!select) return;

    select.value = btn.dataset.setShape;
    updateShapeUI();
    clearResults();
    save();
    requestAnimationFrame(updateWires);
    status.textContent = `Bentuk simbol ${nodeEl.querySelector('.node-title-text')?.textContent || ''} diubah.`;
  });

  // Delegate input / edge changes
  game.addEventListener('change', event => {
    if (event.target.matches('[data-kind], [data-edge]')) {
      updateShapeUI();
      clearResults();
      save();
      requestAnimationFrame(updateWires);
      status.textContent = 'Sambungan alur diperbarui. Periksa atau jalankan skenario untuk melihat alirannya.';
    }
  });

  // Simulation runner with step-by-step animation
  let isSimulating = false;
  async function runAnimatedSimulation(scenario) {
    if (isSimulating) return;
    isSimulating = true;
    clearResults();

    const sim = CheckoutEngine.simulate(spec, read(), scenario);
    const trace = sim.trace;

    if (liveTracker) {
      liveTracker.style.display = 'block';
    }

    const scenarioLabels = {
      normal: 'Skenario Normal · 2 Buku, Uang Cukup, Simpan Berhasil',
      invalid: 'Skenario Input Salah · Jumlah Huruf',
      money: 'Skenario Uang Kurang · Bayar Rp20.000 < Rp24.000',
      failed: 'Skenario Simpan Gagal · Disk Penuh / File Error'
    };

    status.textContent = `Memulai: ${scenarioLabels[scenario] || scenario}...`;

    for (let i = 0; i < trace.length; i++) {
      const nodeId = trace[i];
      const nodeEl = game.querySelector(`[data-node="${nodeId}"]`);
      const nodeSpec = spec.nodes.find(n => n.id === nodeId);
      const title = nodeSpec ? nodeSpec.title : nodeId;

      // Active state on current node
      game.querySelectorAll('.checkout-node').forEach(n => n.classList.remove('checkout-active'));
      if (nodeEl) {
        nodeEl.classList.add('checkout-visited', 'checkout-active');
      }

      // Add to trace list
      const li = document.createElement('li');
      li.innerHTML = `<span class="step-num">${i + 1}</span> <strong>${title}</strong>`;
      traceList.appendChild(li);

      // Educational status narration
      let msg = `Langkah ${i + 1}: ${title}`;
      if (nodeId === 'start') msg = 'Mulai checkout KasirKita...';
      else if (nodeId === 'input') msg = 'Kasir menginput barang, qty, dan pembayaran...';
      else if (nodeId === 'calculate') msg = 'Sistem menghitung total: 2 × Rp12.000 = Rp24.000...';
      else if (nodeId === 'valid') {
        msg = (scenario === 'normal' || scenario === 'failed')
          ? 'Validasi: Input angka & uang cukup ✓ (Cabang YA)'
          : 'Validasi: Input tidak memenuhi syarat ✗ (Cabang TIDAK)';
      } else if (nodeId === 'save') msg = 'Mencoba menyimpan data transaksi dan mengurangi stok...';
      else if (nodeId === 'saved') {
        msg = (scenario === 'failed')
          ? 'Pemeriksaan: File gagal ditulis! ✗ (Cabang TIDAK)'
          : 'Pemeriksaan: Transaksi berhasil ditulis! ✓ (Cabang YA)';
      } else if (nodeId === 'receipt') msg = 'Mencetak nota penjualan tersimpan...';
      else if (nodeId === 'finish') msg = 'Selesai: Transaksi selesai dengan sempurna.';
      else if (nodeId === 'error') msg = 'Penanganan Error: Tampilkan pesan gagal, kembali ke input untuk diperbaiki.';

      if (trackerText) trackerText.textContent = msg;
      status.textContent = msg;

      await new Promise(r => setTimeout(r, 480));
    }

    game.querySelectorAll('.checkout-node').forEach(n => n.classList.remove('checkout-active'));
    resultMsg.textContent = sim.message;
    resultMsg.className = 'checkout-result ' + (sim.ok ? 'result-success' : 'result-warning');
    status.textContent = sim.ok ? 'Simulasi selesai: Alur berhasil tuntas!' : 'Simulasi selesai: Alur berhenti sesuai kondisi skenario.';
    isSimulating = false;
  }

  // Button actions
  game.querySelectorAll('[data-checkout]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.checkout;
      if (action === 'reset' || action === 'blank') {
        apply(action === 'reset' ? challenge() : { kinds: {}, edges: {} });
        save();
        game.querySelectorAll('[name="checkout-answer"]').forEach(r => r.checked = false);
        const refRes = game.querySelector('.checkout-reflection-result');
        if (refRes) refRes.textContent = '';
        status.textContent = action === 'reset'
          ? 'Tantangan diulang. Ada lima aturan yang perlu diperbaiki.'
          : 'Semua simbol dan sambungan dikosongkan. Mulai menyusun dari langkah Mulai.';
      } else if (action === 'check' || action === 'hint') {
        const result = CheckoutEngine.validate(spec, read());
        issuesList.replaceChildren();
        const displayIssues = action === 'hint' ? result.issues.slice(0, 1) : result.issues;
        displayIssues.forEach(msg => {
          const li = document.createElement('li');
          li.textContent = msg;
          issuesList.appendChild(li);
        });
        status.textContent = result.issues.length
          ? `${result.total - result.issues.length} dari ${result.total} aturan sesuai. Perbaiki bagian berikut:`
          : 'Semua aturan alur sesuai (19/19)! Coba keempat skenario transaksi di bawah.';
      } else if (action === 'run') {
        const scenario = game.querySelector('#checkout-scenario')?.value || 'normal';
        runAnimatedSimulation(scenario);
      } else if (action === 'reflect') {
        const answer = game.querySelector('[name="checkout-answer"]:checked');
        const refRes = game.querySelector('.checkout-reflection-result');
        if (!refRes) return;
        if (!answer) {
          refRes.textContent = 'Pilih salah satu tindakan dan alasan terlebih dahulu.';
          refRes.className = 'checkout-reflection-result result-warning';
        } else if (answer.value === 'retry') {
          refRes.textContent = 'Benar! Uang cukup saja belum membuktikan data tersimpan. Harus menampilkan pesan kesalahan dan kembali ke input; nota hanya boleh muncul setelah simpan berhasil.';
          refRes.className = 'checkout-reflection-result result-success';
        } else {
          refRes.textContent = 'Periksa kembali syarat mutlak nota: transaksi harus benar-benar berhasil tersimpan ke storage. Input valid atau total terhitung saja belum cukup.';
          refRes.className = 'checkout-reflection-result result-warning';
        }
      }
    });
  });

  // Zoom control actions (+, -, reset, fit)
  game.addEventListener('click', event => {
    const zoomBtn = event.target.closest('[data-zoom]');
    if (!zoomBtn) return;
    const action = zoomBtn.dataset.zoom;
    if (action === 'in') {
      applyZoom(zoomLevel + STEP);
    } else if (action === 'out') {
      applyZoom(zoomLevel - STEP);
    } else if (action === 'reset') {
      applyZoom(1.0);
    } else if (action === 'fit') {
      if (canvasViewport && canvasContainer) {
        const vh = canvasViewport.clientHeight || 560;
        const ch = canvasContainer.scrollHeight || 1000;
        const fitScale = Math.min(1.0, Math.max(MIN_ZOOM, Math.floor((vh / ch) * 10) / 10));
        applyZoom(fitScale);
      } else {
        applyZoom(0.7);
      }
    }
  });

  // Redraw SVG wires whenever layout shifts
  window.addEventListener('resize', () => requestAnimationFrame(updateWires));
  setTimeout(updateWires, 100);
  setTimeout(updateWires, 500);
})();
