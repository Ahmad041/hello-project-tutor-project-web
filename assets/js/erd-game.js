(function () {
  'use strict';

  const engine = window.ErdEngine;
  if (!engine) {
    console.error('ErdEngine tidak ditemukan! Pastikan assets/js/erd-engine.js dimuat sebelum erd-game.js.');
    return;
  }

  // State Game
  let currentLevel = 1;
  let maxUnlockedLevel = 1;
  let connections = []; // Array<{id, from, to}> untuk level aktif
  let selectedOrigin = null; // String 'ENTITY.field' untuk click-to-connect
  let dragOrigin = null; // String 'ENTITY.field' saat dragging
  let dragCurrentPos = { x: 0, y: 0 };
  let audioCtx = null;
  let isSimulating = false;

  // Warna Kabel per Relasi / Fallback
  const CABLE_PALETTE = ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'];

  // Suara Sintetis Sederhana (Web Audio API)
  function playTone(freq, type = 'sine', duration = 0.15) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function soundPlug() {
    playTone(587.33, 'triangle', 0.1);
    setTimeout(() => playTone(880, 'triangle', 0.15), 60);
  }

  function soundUnplug() {
    playTone(220, 'sine', 0.12);
  }

  function soundSuccess() {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      setTimeout(() => playTone(f, 'triangle', 0.2), i * 90);
    });
  }

  function soundLevelUp() {
    [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
      setTimeout(() => playTone(f, 'triangle', 0.25), i * 80);
    });
  }

  function soundError() {
    playTone(180, 'sawtooth', 0.15);
    setTimeout(() => playTone(140, 'sawtooth', 0.2), 80);
  }

  // DOM Elements
  const arena = document.querySelector('.erd-arena');
  const svg = document.querySelector('.erd-wires-svg');
  const grid = document.querySelector('.erd-grid');
  const statusPill = document.querySelector('.erd-status-pill');
  const traceList = document.querySelector('.erd-trace-list');
  const receiptContainer = document.querySelector('#erd-receipt-container');
  const missionTitle = document.querySelector('.erd-mission-title');
  const missionBadge = document.querySelector('.erd-mission-badge');
  const missionText = document.querySelector('.erd-mission-text');
  const levelBtns = document.querySelectorAll('.erd-level-btn');

  if (!arena || !svg || !grid) return;

  // Baca Progress Level dari LocalStorage
  try {
    const savedLevel = parseInt(localStorage.getItem('kasirkita-erd-current-level'), 10);
    if (savedLevel >= 1 && savedLevel <= 5) currentLevel = savedLevel;

    const savedMax = parseInt(localStorage.getItem('kasirkita-erd-unlocked-level'), 10);
    if (savedMax >= 1 && savedMax <= 5) maxUnlockedLevel = savedMax;
  } catch (_) {}

  // Muat kabel untuk level aktif
  function loadLevelConnections(level) {
    try {
      const saved = localStorage.getItem(`kasirkita-erd-cables-l${level}`);
      if (saved) {
        connections = JSON.parse(saved) || [];
      } else {
        connections = [];
      }
    } catch (_) {
      connections = [];
    }
  }

  // Simpan kabel untuk level aktif
  function saveConnections() {
    try {
      localStorage.setItem(`kasirkita-erd-cables-l${currentLevel}`, JSON.stringify(connections));
      localStorage.setItem('kasirkita-erd-current-level', currentLevel.toString());
      localStorage.setItem('kasirkita-erd-unlocked-level', maxUnlockedLevel.toString());
    } catch (_) {}
  }

  // Ambil koordinat tengah soket relatif terhadap arena
  function getSocketCenter(socketEl) {
    if (!socketEl) return null;
    const sRect = socketEl.getBoundingClientRect();
    const aRect = arena.getBoundingClientRect();
    return {
      x: sRect.left - aRect.left + sRect.width / 2,
      y: sRect.top - aRect.top + sRect.height / 2
    };
  }

  // SVG Icon Kunci: Kuning (PK), Abu-abu (FK), Biru (UK)
  function makeKeyIconSVG(color, title = '') {
    return `<svg class="erd-key-icon" viewBox="0 0 16 12" width="14" height="12" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" role="img" aria-label="${title}"><title>${title}</title><circle cx="4" cy="6" r="2.8"/><path d="M6.8 6h7.2 M10.5 6v3 M13 6v2.5"/></svg>`;
  }

  // Render Kartu Entitas PDM Secara Dinamis Sesuai Level
  function renderEntityCards(levelSpec) {
    grid.innerHTML = '';
    const entEntries = Object.entries(levelSpec.entities);
    const count = entEntries.length;

    // Tata letak kolom grid yang fleksibel sesuai jumlah entitas
    if (count === 2) {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
      grid.style.maxWidth = '780px';
    } else if (count === 3) {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(260px, 1fr))';
      grid.style.maxWidth = '1000px';
    } else if (count === 4) {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(240px, 1fr))';
      grid.style.maxWidth = '1100px';
    } else {
      grid.style.gridTemplateColumns = '1fr 1fr 1fr';
      grid.style.maxWidth = '1100px';
    }

    entEntries.forEach(([entName, entData]) => {
      const card = document.createElement('div');
      card.className = 'erd-card';
      card.setAttribute('data-entity', entName);

      const header = document.createElement('div');
      header.className = 'erd-card-header';
      header.style.borderLeft = `4px solid ${entData.color || '#38bdf8'}`;
      header.innerHTML = `
        <h4>${entName}</h4>
        <span class="erd-card-tag">${entData.subtitle || 'Tabel'}</span>
      `;
      card.appendChild(header);

      const ul = document.createElement('ul');
      ul.className = 'erd-fields';

      entData.fields.forEach(f => {
        const li = document.createElement('li');
        li.className = 'erd-field-row';

        const hasPK = f.key.includes('PK');
        const hasFK = f.key.includes('FK');
        const hasUK = f.key.includes('UK');

        let keyClass = '';
        if (hasPK && hasFK) keyClass = 'pk-fk';
        else if (hasPK) keyClass = 'pk';
        else if (hasFK) keyClass = 'fk';
        else if (hasUK) keyClass = 'uk';

        // Render Icon Kunci (Kuning: PK, Abu-abu: FK, Biru: UK)
        let keyIcons = '';
        if (hasPK) {
          keyIcons += makeKeyIconSVG('#fbbf24', 'Primary Key (PK)');
        }
        if (hasFK) {
          keyIcons += makeKeyIconSVG('#94a3b8', 'Foreign Key (FK)');
        }
        if (hasUK) {
          keyIcons += makeKeyIconSVG('#38bdf8', 'Unique Key (UK)');
        }

        // Socket Left untuk Foreign Key (Input Port)
        let inSocketHTML = '';
        if (hasFK) {
          inSocketHTML = `<button class="erd-socket in" data-socket="${entName}.${f.name}" title="${entName}.${f.name} (Foreign Key)" aria-label="Soket ${entName}.${f.name}"></button>`;
        }

        // Socket Right untuk Primary Key (Output Port)
        let outSocketHTML = '';
        if (hasPK) {
          outSocketHTML = `<button class="erd-socket out" data-socket="${entName}.${f.name}" title="${entName}.${f.name} (Primary Key)" aria-label="Soket ${entName}.${f.name}"></button>`;
        }

        const keyContent = f.key
          ? `<span class="erd-field-key ${keyClass}">${keyIcons}<span>${f.key}</span></span>`
          : `<span class="erd-field-key empty"></span>`;

        li.innerHTML = `
          ${inSocketHTML}
          ${keyContent}
          <span class="erd-field-name">${f.name}</span>
          <span class="erd-field-type">${f.type}</span>
          ${outSocketHTML}
        `;
        ul.appendChild(li);
      });

      card.appendChild(ul);
      grid.appendChild(card);
    });

    attachSocketListeners();
  }

  // Perbarui UI Sesuai Level Aktif
  function updateLevelUI() {
    const levelSpec = engine.LEVELS.find(l => l.level === currentLevel) || engine.LEVELS[0];

    // Update Header Misi
    if (missionTitle) missionTitle.innerHTML = `<span>🎯</span> ${levelSpec.name}`;
    if (missionBadge) missionBadge.textContent = levelSpec.badge;
    if (missionText) missionText.textContent = levelSpec.mission;

    // Update Tombol Navigasi Level
    levelBtns.forEach(btn => {
      const lvl = parseInt(btn.dataset.level, 10);
      btn.classList.toggle('active', lvl === currentLevel);
      btn.classList.toggle('completed', lvl < maxUnlockedLevel);
      btn.disabled = lvl > maxUnlockedLevel;
      if (lvl > maxUnlockedLevel) {
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      }
    });

    if (traceList) traceList.innerHTML = '';
    if (receiptContainer) receiptContainer.innerHTML = '';

    // Render PDM Khusus Level Ini
    renderEntityCards(levelSpec);
    renderCables();
  }

  // Render Seluruh Kabel SVG
  function renderCables() {
    const oldPaths = svg.querySelectorAll('.erd-cable, .erd-temp-cable, .erd-hit-area');
    oldPaths.forEach(p => p.remove());

    const val = engine.validate(connections, currentLevel);

    if (statusPill) {
      statusPill.textContent = `${val.connectedCount} dari ${val.totalExpected} Relasi PDM Level ${currentLevel}`;
      statusPill.classList.toggle('all-connected', val.ok);
    }

    document.querySelectorAll('.erd-socket').forEach(s => {
      s.classList.remove('connected');
    });

    connections.forEach((conn, idx) => {
      const fromEl = document.querySelector(`[data-socket="${conn.from}"]`);
      const toEl = document.querySelector(`[data-socket="${conn.to}"]`);

      if (!fromEl || !toEl) return;

      fromEl.classList.add('connected');
      toEl.classList.add('connected');

      const p1 = getSocketCenter(fromEl);
      const p2 = getSocketCenter(toEl);
      if (!p1 || !p2) return;

      const dx = Math.max(Math.abs(p2.x - p1.x) * 0.5, 45);
      const d = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;

      const match = engine.normalizeConnection(conn, currentLevel);
      const color = match ? CABLE_PALETTE[idx % CABLE_PALETTE.length] : '#ef4444';

      // Area klik transparan
      const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitPath.setAttribute('d', d);
      hitPath.setAttribute('fill', 'none');
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '18');
      hitPath.classList.add('erd-hit-area');
      hitPath.style.cursor = 'pointer';

      // Jalur visual kabel
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '3.5');
      path.setAttribute('data-cable-id', conn.id);
      path.classList.add('erd-cable');
      if (!match) {
        path.setAttribute('stroke-dasharray', '6 4');
      }

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${conn.from} ↔ ${conn.to} (Klik untuk mencabut kabel)`;
      path.appendChild(title);

      const removeHandler = (e) => {
        e.stopPropagation();
        removeConnection(conn.id);
      };
      hitPath.addEventListener('click', removeHandler);
      path.addEventListener('click', removeHandler);

      svg.appendChild(hitPath);
      svg.appendChild(path);
    });

    // Render kabel sementara saat dragging
    if (dragOrigin) {
      const fromEl = document.querySelector(`[data-socket="${dragOrigin}"]`);
      if (fromEl) {
        const p1 = getSocketCenter(fromEl);
        if (p1) {
          const dx = Math.max(Math.abs(dragCurrentPos.x - p1.x) * 0.5, 30);
          const d = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${dragCurrentPos.x - dx} ${dragCurrentPos.y}, ${dragCurrentPos.x} ${dragCurrentPos.y}`;
          
          const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          tempPath.setAttribute('d', d);
          tempPath.setAttribute('fill', 'none');
          tempPath.setAttribute('stroke', '#38bdf8');
          tempPath.setAttribute('stroke-width', '3');
          tempPath.classList.add('erd-cable', 'active-drag');
          svg.appendChild(tempPath);
        }
      }
    }
  }

  // Tambah Koneksi Baru
  function addConnection(from, to) {
    if (from === to) return false;

    const exists = connections.some(c => 
      (c.from === from && c.to === to) || (c.from === to && c.to === from)
    );
    if (exists) return false;

    connections = connections.filter(c => c.from !== from && c.to !== to);

    const newConn = {
      id: 'conn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      from,
      to
    };
    connections.push(newConn);
    saveConnections();
    soundPlug();
    renderCables();
    return true;
  }

  // Hapus Koneksi
  function removeConnection(id) {
    connections = connections.filter(c => c.id !== id);
    saveConnections();
    soundUnplug();
    renderCables();
  }

  // Pasang Listener Soket
  function attachSocketListeners() {
    const sockets = document.querySelectorAll('.erd-socket');

    sockets.forEach(sock => {
      const fieldPath = sock.dataset.socket;

      // 1. Click-to-Connect
      sock.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSimulating) return;

        if (!selectedOrigin) {
          selectedOrigin = fieldPath;
          sock.classList.add('active-origin');
          playTone(440, 'sine', 0.08);
        } else if (selectedOrigin === fieldPath) {
          sock.classList.remove('active-origin');
          selectedOrigin = null;
          soundUnplug();
        } else {
          const origEl = document.querySelector(`[data-socket="${selectedOrigin}"]`);
          if (origEl) origEl.classList.remove('active-origin');

          addConnection(selectedOrigin, fieldPath);
          selectedOrigin = null;
        }
      });

      // 2. Drag-to-Connect
      sock.addEventListener('pointerdown', (e) => {
        if (isSimulating) return;
        dragOrigin = fieldPath;
        sock.setPointerCapture(e.pointerId);
        
        const aRect = arena.getBoundingClientRect();
        dragCurrentPos = {
          x: e.clientX - aRect.left,
          y: e.clientY - aRect.top
        };
        renderCables();
      });

      sock.addEventListener('pointermove', (e) => {
        if (!dragOrigin) return;
        const aRect = arena.getBoundingClientRect();
        dragCurrentPos = {
          x: e.clientX - aRect.left,
          y: e.clientY - aRect.top
        };
        renderCables();
      });

      sock.addEventListener('pointerup', (e) => {
        if (!dragOrigin) return;
        sock.releasePointerCapture(e.pointerId);

        const targetEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.erd-socket');
        if (targetEl && targetEl.dataset.socket && targetEl.dataset.socket !== dragOrigin) {
          addConnection(dragOrigin, targetEl.dataset.socket);
        }

        dragOrigin = null;
        renderCables();
      });
    });

    arena.addEventListener('click', (e) => {
      if (!e.target.closest('.erd-socket') && selectedOrigin) {
        const origEl = document.querySelector(`[data-socket="${selectedOrigin}"]`);
        if (origEl) origEl.classList.remove('active-origin');
        selectedOrigin = null;
        renderCables();
      }
    });
  }

  // Animasi Partikel Pulsa Data
  function animatePulseAlongCable(cableKey, onComplete) {
    const conn = connections.find(c => {
      const m = engine.normalizeConnection(c, currentLevel);
      return m && m.id === cableKey;
    });

    if (!conn) {
      if (onComplete) onComplete();
      return;
    }

    const path = svg.querySelector(`[data-cable-id="${conn.id}"]`);
    if (!path) {
      if (onComplete) onComplete();
      return;
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '7');
    circle.setAttribute('class', 'erd-pulse');
    circle.style.setProperty('--pulse-color', '#38bdf8');
    svg.appendChild(circle);

    const length = path.getTotalLength();
    let start = null;
    const duration = 700;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      const t = progress;
      const pt = path.getPointAtLength(t * length);
      circle.setAttribute('cx', pt.x);
      circle.setAttribute('cy', pt.y);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        circle.remove();
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(step);
  }

  // Tampilkan Banner Next Level atau Victory
  function showLevelCompletion(nextLvl) {
    if (!receiptContainer) return;

    if (nextLvl <= 5) {
      const banner = document.createElement('div');
      banner.className = 'erd-next-level-box';
      banner.innerHTML = `
        <div>
          <strong style="color:#34d399; font-size:1rem;">🎉 Level ${currentLevel} Selesai!</strong>
          <div style="font-size:0.85rem; color:#cbd5e1; margin-top:0.2rem;">Relasi PDM berhasil dirangkai. Siap mencoba skema PDM di level berikutnya?</div>
        </div>
        <button type="button" class="erd-next-level-btn" id="btn-next-level">
          Lanjut ke Level ${nextLvl} →
        </button>
      `;
      receiptContainer.appendChild(banner);
      document.querySelector('#btn-next-level')?.addEventListener('click', () => {
        switchLevel(nextLvl);
      });
    } else {
      const victory = document.createElement('div');
      victory.className = 'erd-next-level-box';
      victory.style.borderColor = '#fbbf24';
      victory.style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(16, 185, 129, 0.15))';
      victory.innerHTML = `
        <div>
          <strong style="color:#fbbf24; font-size:1.1rem;">🏆 GRAND MASTER ARSITEKTUR KASIRKITA!</strong>
          <div style="font-size:0.85rem; color:#cbd5e1; margin-top:0.25rem;">
            Kamu telah menamatkan seluruh 5 skema PDM berbeda dari level 1 hingga level 5. Seluruh konsep kunci relasional telah kamu kuasai!
          </div>
        </div>
        <button type="button" class="erd-next-level-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706);" onclick="window.scrollTo({top:0, behavior:'smooth'})">
          Kembali ke Papan Utama ↑
        </button>
      `;
      receiptContainer.appendChild(victory);
    }
  }

  // Jalankan Simulasi Belanja
  function runSimulation() {
    if (isSimulating) return;
    isSimulating = true;

    if (traceList) traceList.innerHTML = '';
    if (receiptContainer) receiptContainer.innerHTML = '';

    const result = engine.simulate(connections, currentLevel);
    let currentStepIdx = 0;

    function nextStep() {
      if (currentStepIdx >= result.trace.length) {
        isSimulating = false;
        if (result.ok) {
          if (currentLevel < 5 && maxUnlockedLevel <= currentLevel) {
            maxUnlockedLevel = currentLevel + 1;
            saveConnections();
            soundLevelUp();
          } else {
            soundSuccess();
          }

          // Tampilkan kartu rangkuman simulasi sesuai data level
          if (receiptContainer && result.summary) {
            const s = result.summary;
            let rowsHTML = '';
            for (const [k, v] of Object.entries(s)) {
              if (k === 'header') continue;
              const formattedVal = typeof v === 'number' ? `Rp${v.toLocaleString('id-ID')}` : v;
              rowsHTML += `<div class="erd-receipt-line"><span>${k.toUpperCase()}</span><span>${formattedVal}</span></div>`;
            }

            receiptContainer.innerHTML = `
              <div class="erd-receipt-box">
                <h4>✓ ${s.header || 'HASIL SIMULASI PDM'}</h4>
                ${rowsHTML}
              </div>
            `;
          }

          showLevelCompletion(currentLevel + 1);
        } else {
          soundError();
        }
        return;
      }

      const st = result.trace[currentStepIdx];
      currentStepIdx++;

      document.querySelectorAll('.erd-card').forEach(c => c.classList.remove('highlight-pulse'));
      const card = document.querySelector(`[data-entity="${st.entity}"]`);
      if (card) {
        card.classList.add('highlight-pulse');
      }

      if (traceList) {
        const li = document.createElement('li');
        li.className = `erd-trace-item ${st.status === 'failed' ? 'failed' : 'success'}`;
        li.innerHTML = `
          <span class="erd-trace-badge">${st.entity}</span>
          <div>
            <strong>${st.title}</strong>
            <div>${st.detail}</div>
          </div>
        `;
        traceList.appendChild(li);
        li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      playTone(400 + currentStepIdx * 80, 'triangle', 0.1);

      if (st.cableId) {
        animatePulseAlongCable(st.cableId, () => {
          setTimeout(nextStep, 250);
        });
      } else {
        setTimeout(nextStep, 450);
      }
    }

    nextStep();
  }

  // Tombol Pemeriksaan Kabel
  function checkCables() {
    const val = engine.validate(connections, currentLevel);
    if (traceList) {
      traceList.innerHTML = '';
      if (val.ok) {
        soundSuccess();
        traceList.innerHTML = `
          <li class="erd-trace-item success">
            <span class="erd-trace-badge">SEMPURNA</span>
            <div><strong>Seluruh kabel relasi untuk PDM Level ${currentLevel} terpasang dengan tepat!</strong> Tekan tombol "Jalankan Simulasi Belanja" untuk melihat aliran datanya.</div>
          </li>
        `;
      } else {
        soundError();
        val.issues.forEach(iss => {
          const li = document.createElement('li');
          li.className = 'erd-trace-item failed';
          li.innerHTML = `<span class="erd-trace-badge">PERIKSA</span><div>${iss}</div>`;
          traceList.appendChild(li);
        });
        val.missing.forEach(m => {
          const li = document.createElement('li');
          li.className = 'erd-trace-item failed';
          li.innerHTML = `<span class="erd-trace-badge">BELUM TERPASANG</span><div>Relasi <strong>${m.name}</strong>: Hubungkan <code>${m.from}</code> ke <code>${m.to}</code>.</div>`;
          traceList.appendChild(li);
        });
      }
    }
  }

  // Tombol Petunjuk
  function giveHint() {
    const val = engine.validate(connections, currentLevel);
    document.querySelectorAll('.erd-socket').forEach(s => s.classList.remove('hint-target'));

    if (val.missing.length > 0) {
      const nextRel = val.missing[0];
      const fromEl = document.querySelector(`[data-socket="${nextRel.from}"]`);
      const toEl = document.querySelector(`[data-socket="${nextRel.to}"]`);

      if (fromEl) fromEl.classList.add('hint-target');
      if (toEl) toEl.classList.add('hint-target');

      playTone(600, 'sine', 0.2);

      if (traceList) {
        traceList.innerHTML = `
          <li class="erd-trace-item" style="border-left-color: #ec4899;">
            <span class="erd-trace-badge" style="background:#ec4899;">PETUNJUK LEVEL ${currentLevel}</span>
            <div>Hubungkan pin yang berkedip: <strong>${nextRel.from}</strong> ke <strong>${nextRel.to}</strong> (${nextRel.description}).</div>
          </li>
        `;
      }
    } else {
      if (traceList) {
        traceList.innerHTML = `
          <li class="erd-trace-item success">
            <span class="erd-trace-badge">LENGKAP</span>
            <div>Semua relasi yang dibutuhkan pada PDM Level ${currentLevel} sudah terhubung! Silakan jalankan simulasi belanja.</div>
          </li>
        `;
      }
    }
  }

  // Tombol Pasang Contoh Benar Sesuai Level
  function solveDemo() {
    const levelSpec = engine.LEVELS.find(l => l.level === currentLevel) || engine.LEVELS[0];
    connections = levelSpec.demoCables.map((c, i) => ({
      id: `demo_${currentLevel}_${i}_${Date.now()}`,
      from: c.from,
      to: c.to
    }));
    saveConnections();
    soundSuccess();
    renderCables();
    checkCables();
  }

  // Tombol Reset Kabel
  function resetAll() {
    connections = [];
    selectedOrigin = null;
    dragOrigin = null;
    saveConnections();
    soundUnplug();
    renderCables();
    if (traceList) traceList.innerHTML = '';
    if (receiptContainer) receiptContainer.innerHTML = '';
    document.querySelectorAll('.erd-card').forEach(c => c.classList.remove('highlight-pulse'));
  }

  // Ganti Level
  function switchLevel(newLevel) {
    if (newLevel < 1 || newLevel > 5) return;
    if (newLevel > maxUnlockedLevel) return;

    currentLevel = newLevel;
    loadLevelConnections(currentLevel);
    saveConnections();
    playTone(520, 'sine', 0.1);
    updateLevelUI();
  }

  // Pasang Event Tombol Level
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = parseInt(btn.dataset.level, 10);
      switchLevel(lvl);
    });
  });

  // Pasang Event Tombol Toolbar
  document.querySelector('[data-action="erd-check"]')?.addEventListener('click', checkCables);
  document.querySelector('[data-action="erd-sim"]')?.addEventListener('click', runSimulation);
  document.querySelector('[data-action="erd-hint"]')?.addEventListener('click', giveHint);
  document.querySelector('[data-action="erd-demo"]')?.addEventListener('click', solveDemo);
  document.querySelector('[data-action="erd-reset"]')?.addEventListener('click', resetAll);

  // Inisialisasi awal
  loadLevelConnections(currentLevel);
  updateLevelUI();

  window.addEventListener('resize', () => {
    requestAnimationFrame(renderCables);
  });
})();
