const ICON_ARROW_UP_RIGHT = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
const ICON_LOCK = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const ICON_PLAY = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
const ICON_ROTATE_CCW = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';
const ICON_ARROW_RIGHT = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

function renderMarkup(el, html) {
  if (!el) return;
  if (!('innerHTML' in el)) el.textContent = html;
  el.innerHTML = html;
}

const map = document.querySelector('.callout-map');
if (map) {
  const target = map.querySelector('.target-dot');
  const calloutTarget = map.querySelector('.callout-target');
  const startBtn = map.querySelector('.callout-start-btn');
  const startIcon = startBtn?.querySelector('.start-icon');
  const startLabel = startBtn?.querySelector('.start-label');
  const lockHint = map.querySelector('.callout-lock-hint');
  const group = map.querySelector('.callout-lines g');
  const links = [...map.querySelectorAll('.map-callout')];
  const replayBtn = document.querySelector('.replay-boot');
  const bgVideo = document.querySelector('video.art');

  function getBaseModuleHref() {
    const rawHref = links[0]?.getAttribute('href') || links[0]?.href || '';
    return rawHref.split('#')[0];
  }

  function detectModuleId() {
    const firstHref = links[0]?.getAttribute('href') || '';
    const pathname = window.location.pathname || '';
    const source = `${firstHref} ${pathname}`.toLowerCase();
    if (/project\.html|modul01\.html|daftarisi\.html/.test(source)) return 'm1';
    if (/analisis\.html|daftarisi-2\.html/.test(source)) return 'm2';
    if (/teknis\.html|daftarisi-3\.html/.test(source)) return 'm3';
    if (/testing\.html|daftarisi-4\.html/.test(source)) return 'm4';
    return 'm1';
  }

  const moduleId = detectModuleId();
  const storageKey = `kasirkita-unlock-${moduleId}`;

  function getUnlockedCount() {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = parseInt(raw || '0', 10);
      if (Number.isNaN(parsed) || parsed < 0) return 0;
      return Math.min(links.length, parsed);
    } catch (_) {
      return 0;
    }
  }

  function setUnlockedCount(count) {
    const safeCount = Math.max(0, Math.min(links.length, count));
    try {
      localStorage.setItem(storageKey, String(safeCount));
    } catch (_) {}
    return safeCount;
  }

  const paths = links.map(link => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    group.append(path);
    const highlight = () => {
      if (!link.classList.contains('is-locked')) {
        path.classList.add('active');
      }
    };
    const reset = () => path.classList.remove('active');
    link.addEventListener('mouseenter', highlight);
    link.addEventListener('mouseleave', reset);
    link.addEventListener('focus', highlight);
    link.addEventListener('blur', reset);
    return path;
  });

  // Highlight all circuit paths when hovering/focusing center START button
  if (startBtn) {
    const highlightAll = () => paths.forEach(p => p.classList.add('active'));
    const resetAll = () => paths.forEach(p => p.classList.remove('active'));
    startBtn.addEventListener('mouseenter', highlightAll);
    startBtn.addEventListener('mouseleave', resetAll);
    startBtn.addEventListener('focus', highlightAll);
    startBtn.addEventListener('blur', resetAll);
  }

  // Spark circles for the traveling nanite effect
  const sparks = links.map(() => {
    const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    spark.setAttribute('r', '5');
    spark.setAttribute('class', 'callout-spark');
    spark.style.opacity = '0';
    group.append(spark);
    return spark;
  });

  // Progressive Lock Sync
  let attentionTimeout = null;

  function syncLockState() {
    const unlockedCount = getUnlockedCount();

    links.forEach((link, idx) => {
      const arrow = link.querySelector('.callout-arrow');
      if (idx < unlockedCount) {
        link.classList.remove('is-locked');
        link.classList.add('is-unlocked');
        link.removeAttribute('aria-disabled');
        renderMarkup(arrow, ICON_ARROW_UP_RIGHT);
      } else {
        link.classList.remove('is-unlocked');
        link.classList.add('is-locked');
        link.setAttribute('aria-disabled', 'true');
        renderMarkup(arrow, ICON_LOCK);
      }
    });

    if (startBtn) {
      const baseHref = getBaseModuleHref();
      if (unlockedCount === 0) {
        renderMarkup(startIcon, ICON_PLAY);
        if (startLabel) startLabel.textContent = 'START';
        startBtn.dataset.targetHref = baseHref;
        startBtn.setAttribute('aria-label', 'Mulai pelajari modul dari langkah pertama');
        if (lockHint && !calloutTarget?.classList.contains('is-attention')) {
          lockHint.textContent = 'Selesaikan berurutan';
        }
      } else if (unlockedCount >= links.length) {
        renderMarkup(startIcon, ICON_ROTATE_CCW);
        if (startLabel) startLabel.textContent = 'ULANGI MODUL';
        startBtn.dataset.targetHref = baseHref;
        startBtn.setAttribute('aria-label', 'Ulangi modul dari langkah pertama');
        if (lockHint && !calloutTarget?.classList.contains('is-attention')) {
          lockHint.textContent = 'Semua langkah terbuka';
        }
      } else {
        const resumeIdx = Math.min(unlockedCount - 1, links.length - 1);
        const stepNum = String(resumeIdx + 1).padStart(2, '0');
        renderMarkup(startIcon, ICON_PLAY);
        if (startLabel) startLabel.textContent = `LANJUTKAN (${stepNum})`;
        startBtn.dataset.targetHref = baseHref;
        startBtn.setAttribute('aria-label', `Lanjutkan materi ke langkah ${stepNum}`);
        if (lockHint && !calloutTarget?.classList.contains('is-attention')) {
          lockHint.textContent = `${unlockedCount}/${links.length} langkah terbuka`;
        }
      }
    }
  }

  // Transition video dialog (DaftarisiToMateri.mp4)
  let dialog = null;
  let transVideo = null;
  let skipBtn = null;
  let transActive = false;
  let transLeaving = false;
  let transTargetUrl = '';

  function finishTransition() {
    if (!transActive || transLeaving) return;
    transLeaving = true;
    if (transVideo) transVideo.pause();
    window.location.assign(transTargetUrl);
  }

  if (typeof HTMLDialogElement !== 'undefined') {
    dialog = document.createElement('dialog');
    dialog.className = 'opening-dialog';
    dialog.setAttribute('aria-label', 'Video transisi daftar isi ke materi');

    transVideo = document.createElement('video');
    transVideo.src = 'assets/video/DaftarisiToMateri.mp4';
    transVideo.preload = 'metadata';
    transVideo.playsInline = true;
    transVideo.controls = false;
    transVideo.setAttribute('aria-label', 'Transisi ke Materi Modul');

    skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'opening-skip';
    renderMarkup(skipBtn, `<span>Lewati transisi</span>${ICON_ARROW_RIGHT}`);

    dialog.append(transVideo, skipBtn);
    document.body.append(dialog);

    transVideo.addEventListener('ended', finishTransition);
    transVideo.addEventListener('error', finishTransition);
    skipBtn.addEventListener('click', finishTransition);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      finishTransition();
    });
  }

  function preloadTransitionVideo() {
    if (transVideo && transVideo.preload !== 'auto') {
      transVideo.preload = 'auto';
    }
  }

  function playTransitionAndNavigate(url) {
    if (!url) return;
    if (transActive) return;
    if (!dialog || !transVideo) {
      window.location.assign(url);
      return;
    }

    transActive = true;
    transLeaving = false;
    transTargetUrl = url;

    bgVideo?.pause();
    document.body.classList.add('opening-playing');
    try {
      dialog.showModal();
    } catch (_) {
      window.location.assign(url);
      return;
    }
    skipBtn?.focus();

    transVideo.currentTime = 0;
    transVideo.play().catch(() => {
      transVideo.muted = true;
      transVideo.play().catch(finishTransition);
    });
  }

  // Intent-based preloading only on START button
  if (startBtn) {
    ['mouseenter', 'focus', 'touchstart'].forEach(evt => {
      startBtn.addEventListener(evt, preloadTransitionVideo, { passive: true });
    });

    startBtn.addEventListener('click', () => {
      if (getUnlockedCount() === 0) {
        setUnlockedCount(1);
        syncLockState();
      }

      playTransitionAndNavigate(getBaseModuleHref());
    });
  }

  // Card interactions (locked feedback vs direct unlocked navigation without video transition)
  links.forEach((link, idx) => {
    link.addEventListener('click', event => {
      if (link.classList.contains('is-locked')) {
        event.preventDefault();
        if (attentionTimeout) clearTimeout(attentionTimeout);

        calloutTarget?.classList.add('is-attention');
        if (lockHint) {
          renderMarkup(lockHint, `${ICON_LOCK}<span>Terkunci: Klik START di tengah</span>`);
        }
        startBtn?.focus();

        attentionTimeout = setTimeout(() => {
          calloutTarget?.classList.remove('is-attention');
          attentionTimeout = null;
        }, 600);
        return;
      }

      // Unlocked card: unlock next step too and navigate directly without transition video
      const nextUnlock = Math.max(getUnlockedCount(), idx + 2);
      setUnlockedCount(nextUnlock);
      syncLockState();

      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      window.location.assign(link.href);
    });
  });

  window.addEventListener('pageshow', () => {
    transActive = false;
    transLeaving = false;
    transTargetUrl = '';
    if (transVideo) {
      transVideo.pause();
      try {
        transVideo.currentTime = 0;
      } catch (_) {}
    }
    if (dialog && dialog.open) {
      try {
        dialog.close();
      } catch (_) {}
    }
    document.body.classList.remove('opening-playing');
    bgVideo?.play().catch(() => {});
    syncLockState();
  });

  let booted = false;
  let animating = false;
  let animTimeouts = [];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawConnections() {
    const bounds = map.getBoundingClientRect();
    const point = target.getBoundingClientRect();
    const x = point.left + point.width / 2 - bounds.left;
    const y = point.top + point.height / 2 - bounds.top;

    links.forEach((link, i) => {
      const box = link.getBoundingClientRect();
      const fromX = (box.left > point.right ? box.left : box.right) - bounds.left;
      const fromY = box.top + box.height / 2 - bounds.top;
      const elbow = fromX + (x - fromX) * 0.48;
      paths[i].setAttribute('d', `M ${x} ${y} L ${elbow} ${fromY} H ${fromX}`);
    });

    if (!booted) {
      booted = true;
      runCircuitBoot();
    }
  }

  function runCircuitBoot(force = false) {
    if (prefersReduced) {
      map.classList.remove('is-booting');
      links.forEach(l => l.classList.remove('card-arrived'));
      return;
    }

    if (animating && !force) return;
    animating = true;

    // Cancel previous timeouts
    animTimeouts.forEach(t => clearTimeout(t));
    animTimeouts = [];

    // Force map to booting and remove card-arrived so cards vanish
    map.classList.add('is-booting');
    links.forEach(l => {
      l.classList.remove('card-arrived');
    });

    // Reset lines to fully hidden
    paths.forEach(p => {
      let len = 400;
      try { len = Math.ceil(p.getTotalLength()) || 400; } catch (_) {}
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    sparks.forEach(s => { s.style.opacity = '0'; });

    // Center pulse
    if (target) {
      target.classList.remove('pulse');
      void target.offsetWidth;
      target.classList.add('pulse');
    }

    // Pacing: 300ms core glow, then staggered spark launches
    paths.forEach((p, idx) => {
      let len = 400;
      try { len = Math.ceil(p.getTotalLength()) || 400; } catch (_) {}
      const spark = sparks[idx];

      const delay = 320 + idx * 90;
      const travelDuration = 420;

      const tId = setTimeout(() => {
        let start = null;
        spark.style.opacity = '1';

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / travelDuration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentDist = len * eased;

          p.style.strokeDashoffset = `${Math.max(0, len - currentDist)}`;

          try {
            const pt = p.getPointAtLength(currentDist);
            spark.setAttribute('cx', pt.x);
            spark.setAttribute('cy', pt.y);
          } catch (_) {}

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            spark.style.opacity = '0';
            p.style.strokeDasharray = '';
            p.style.strokeDashoffset = '';
            links[idx].classList.add('card-arrived');
          }
        }

        requestAnimationFrame(step);
      }, delay);
      animTimeouts.push(tId);
    });

    const totalDuration = 320 + links.length * 90 + 420 + 650;
    const finalTId = setTimeout(() => {
      map.classList.remove('is-booting');
      paths.forEach(p => {
        p.style.strokeDasharray = '';
        p.style.strokeDashoffset = '';
      });
      sparks.forEach(s => { s.style.opacity = '0'; });
      animating = false;
    }, totalDuration);
    animTimeouts.push(finalTId);
  }

  function renderCircuitFrame(timeMs) {
    map.classList.add('is-booting');

    if (target) {
      if (timeMs < 900) {
        const pulseProg = Math.min(timeMs / 900, 1);
        const s = 1 + 0.25 * Math.sin(pulseProg * Math.PI);
        target.style.transform = `scale(${s.toFixed(3)})`;
        target.style.outlineColor = pulseProg < 0.5 ? '#ebd1a1' : '#ffffff50';
      } else {
        target.style.transform = '';
        target.style.outlineColor = '';
      }
    }

    paths.forEach((p, idx) => {
      let len = 400;
      try { len = Math.ceil(p.getTotalLength()) || 400; } catch (_) {}
      const spark = sparks[idx];
      const link = links[idx];

      const delay = 320 + idx * 90;
      const travelDuration = 420;

      if (timeMs < delay) {
        p.setAttribute('stroke-dasharray', `${len}`);
        p.setAttribute('stroke-dashoffset', `${len}`);
        spark.style.opacity = '0';
        link.classList.remove('card-arrived');
      } else if (timeMs < delay + travelDuration) {
        const progress = (timeMs - delay) / travelDuration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentDist = len * eased;

        p.setAttribute('stroke-dasharray', `${len}`);
        p.setAttribute('stroke-dashoffset', `${Math.max(0, len - currentDist)}`);

        spark.style.opacity = '1';
        try {
          const pt = p.getPointAtLength(currentDist);
          spark.setAttribute('cx', pt.x);
          spark.setAttribute('cy', pt.y);
        } catch (_) {}

        link.classList.remove('card-arrived');
      } else {
        p.removeAttribute('stroke-dasharray');
        p.removeAttribute('stroke-dashoffset');
        spark.style.opacity = '0';
        link.classList.add('card-arrived');
      }
    });

    const totalDuration = 320 + links.length * 90 + 420 + 650;
    if (timeMs >= totalDuration) {
      map.classList.remove('is-booting');
    }
  }

  window.renderCircuitFrame = renderCircuitFrame;
  window.runCircuitBoot = runCircuitBoot;

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      runCircuitBoot(true);
    });
  }

  syncLockState();

  if ('ResizeObserver' in window) new ResizeObserver(drawConnections).observe(map);
  window.addEventListener('resize', drawConnections);
  document.fonts.ready.then(drawConnections);
  drawConnections();
}
