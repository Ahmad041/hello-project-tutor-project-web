/**
 * step-nav.js — KasirKita Floating Minimal Step Navigator (HUD)
 * Memberikan navigasi cepat, indikator langkah aktif, pintasan keyboard,
 * serta sinkronisasi progres buka-kunci langkah ke localStorage untuk Daftar Isi.
 */
(() => {
  const storySteps = Array.from(document.querySelectorAll('.story-step'));
  const archSteps = Array.from(document.querySelectorAll('article.arch-card[id]'));
  const hasStoryHud = storySteps.length >= 2;
  const steps = hasStoryHud ? storySteps : archSteps;
  if (steps.length < 2) return;

  const totalSteps = steps.length;
  let activeIndex = 0;

  function detectModuleId() {
    const pathname = (window.location.pathname || '').toLowerCase();
    if (/(?:^|\/)(?:project|modul01)\.html$/.test(pathname)) return 'm1';
    if (/(?:^|\/)analisis\.html$/.test(pathname)) return 'm2';
    if (/(?:^|\/)teknis\.html$/.test(pathname)) return 'm3';
    if (/(?:^|\/)testing\.html$/.test(pathname)) return 'm4';
    return '';
  }

  const moduleId = detectModuleId();

  function syncUnlockProgress(idx) {
    if (!moduleId || idx < 0) return;
    const key = `kasirkita-unlock-${moduleId}`;
    try {
      const existingUnlocked = parseInt(localStorage.getItem(key) || '0', 10) || 0;
      const nextUnlock = Math.max(existingUnlocked, idx + 2);
      localStorage.setItem(key, String(Math.min(totalSteps, nextUnlock)));
    } catch (_) {}
  }

  function syncFromHash() {
    const hashId = (window.location.hash || '').replace(/^#/, '');
    if (!hashId) {
      syncUnlockProgress(0);
      return;
    }
    const hashIdx = steps.findIndex(s => s.id === hashId);
    syncUnlockProgress(hashIdx >= 0 ? hashIdx : 0);
  }

  // Selalu sinkronkan progres baca pada halaman materi (baik HUD aktif maupun mode Scroll-Craft arch-card)
  syncFromHash();
  window.addEventListener('hashchange', syncFromHash);

  if (!hasStoryHud) {
    if ('IntersectionObserver' in window) {
      const archObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = steps.indexOf(entry.target);
              if (idx !== -1) {
                activeIndex = idx;
                syncUnlockProgress(idx);
              }
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      steps.forEach(s => archObserver.observe(s));
    }
    return;
  }

  // Buat kontainer HUD untuk halaman berbasis .story-step
  const hud = document.createElement('nav');
  hud.className = 'floating-step-hud';
  hud.id = 'floatingStepHud';
  hud.setAttribute('aria-label', 'Navigasi cepat materi modul');

  hud.innerHTML = `
    <div class="step-hud-controls">
      <button class="step-hud-btn" id="stepPrevBtn" type="button" title="Langkah sebelumnya (Shortcut: K atau ↑)" aria-label="Langkah sebelumnya"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></button>
      <button class="step-hud-trigger" id="stepTriggerBtn" type="button" aria-expanded="false" aria-controls="stepFlyoutMenu" title="Klik untuk membuka daftar lompat langkah modul">
        <span class="step-hud-icon"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></span>
        <span class="step-hud-label">Langkah <strong id="stepActiveNum">01</strong> / <span>${String(totalSteps).padStart(2, '0')}</span></span>
        <span class="step-hud-arrow"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg></span>
      </button>
      <button class="step-hud-btn" id="stepNextBtn" type="button" title="Langkah berikutnya (Shortcut: J atau ↓)" aria-label="Langkah berikutnya"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></button>
    </div>
    
    <div class="step-flyout-menu" id="stepFlyoutMenu" hidden>
      <div class="step-flyout-header">
        <span>LOMPAT KE LANGKAH</span>
        <button class="step-flyout-close" id="stepCloseBtn" type="button" aria-label="Tutup menu"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
      </div>
      <ul class="step-flyout-list">
        ${steps.map((s, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const title = s.dataset.storyTitle || s.querySelector('h2, h3')?.textContent || `Langkah ${num}`;
          return `
            <li>
              <a href="#${s.id}" class="step-flyout-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <span class="step-item-num">${num}</span>
                <span class="step-item-title">${title}</span>
              </a>
            </li>
          `;
        }).join('')}
      </ul>
      <div class="step-flyout-footer">
        <a href="#main" class="step-back-top"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg><span>Kembali ke atas modul</span></a>
      </div>
    </div>
  `;

  document.body.appendChild(hud);

  const prevBtn = hud.querySelector('#stepPrevBtn');
  const nextBtn = hud.querySelector('#stepNextBtn');
  const triggerBtn = hud.querySelector('#stepTriggerBtn');
  const flyout = hud.querySelector('#stepFlyoutMenu');
  const closeBtn = hud.querySelector('#stepCloseBtn');
  const activeNum = hud.querySelector('#stepActiveNum');
  const flyoutItems = Array.from(hud.querySelectorAll('.step-flyout-item'));

  function updateActive(idx) {
    if (idx < 0 || idx >= totalSteps) return;
    activeIndex = idx;
    activeNum.textContent = String(idx + 1).padStart(2, '0');
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === totalSteps - 1;

    flyoutItems.forEach((item, i) => {
      item.classList.toggle('active', i === idx);
    });
    syncUnlockProgress(idx);
  }

  function scrollToStep(idx) {
    if (idx < 0 || idx >= totalSteps) return;
    const target = steps[idx];
    if (target) {
      closeMenu();
      updateActive(idx);

      // Hitung koordinat elemen dengan offset nyaman
      const rect = target.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      const targetTop = Math.max(0, absoluteTop - 70);

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {}

      if (history.pushState && target.id) {
        history.pushState(null, '', '#' + target.id);
      }
    }
  }

  function openMenu() {
    flyout.removeAttribute('hidden');
    triggerBtn.setAttribute('aria-expanded', 'true');
    hud.classList.add('is-open');
  }

  function closeMenu() {
    flyout.setAttribute('hidden', '');
    triggerBtn.setAttribute('aria-expanded', 'false');
    hud.classList.remove('is-open');
  }

  function toggleMenu() {
    if (hud.classList.contains('is-open') && !flyout.hasAttribute('hidden')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToStep(activeIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToStep(activeIndex + 1);
  });

  flyoutItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(item.dataset.index, 10);
      scrollToStep(idx);
    });
  });

  const backToTop = hud.querySelector('.step-back-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateActive(0);
      closeMenu();
      if (history.pushState) {
        history.pushState(null, '', '#main');
      }
    });
  }

  // Tutup menu jika klik di luar
  document.addEventListener('click', (e) => {
    if (!hud.contains(e.target)) {
      closeMenu();
    }
  });

  // IntersectionObserver untuk melacak langkah aktif saat scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = steps.indexOf(entry.target);
          if (idx !== -1) {
            updateActive(idx);
          }
        }
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  steps.forEach(s => observer.observe(s));

  // Keyboard shortcut: J / K
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.key === 'j' || (e.altKey && e.key === 'ArrowDown')) {
      if (activeIndex < totalSteps - 1) {
        scrollToStep(activeIndex + 1);
      }
    } else if (e.key === 'k' || (e.altKey && e.key === 'ArrowUp')) {
      if (activeIndex > 0) {
        scrollToStep(activeIndex - 1);
      }
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  });

  updateActive(0);
})();
