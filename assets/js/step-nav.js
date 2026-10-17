/**
 * step-nav.js — KasirKita Floating Minimal Step Navigator (HUD)
 * Memberikan navigasi cepat, indikator langkah aktif, dan pintasan keyboard
 * tanpa mengotori header modul dengan bar menu yang padat.
 */
(() => {
  const steps = Array.from(document.querySelectorAll('.story-step'));
  if (steps.length < 2) return;

  const totalSteps = steps.length;
  let activeIndex = 0;

  // Buat kontainer HUD
  const hud = document.createElement('nav');
  hud.className = 'floating-step-hud';
  hud.id = 'floatingStepHud';
  hud.setAttribute('aria-label', 'Navigasi cepat materi modul');

  hud.innerHTML = `
    <div class="step-hud-controls">
      <button class="step-hud-btn" id="stepPrevBtn" type="button" title="Langkah sebelumnya (Shortcut: K atau ↑)" aria-label="Langkah sebelumnya">‹</button>
      <button class="step-hud-trigger" id="stepTriggerBtn" type="button" aria-expanded="false" aria-controls="stepFlyoutMenu" title="Buka daftar langkah modul">
        <span class="step-hud-icon">☰</span>
        <span class="step-hud-label">Langkah <strong id="stepActiveNum">01</strong> / <span>${String(totalSteps).padStart(2, '0')}</span></span>
        <span class="step-hud-arrow">▴</span>
      </button>
      <button class="step-hud-btn" id="stepNextBtn" type="button" title="Langkah berikutnya (Shortcut: J atau ↓)" aria-label="Langkah berikutnya">›</button>
    </div>
    
    <div class="step-flyout-menu" id="stepFlyoutMenu" hidden>
      <div class="step-flyout-header">
        <span>LOMPAT KE LANGKAH</span>
        <button class="step-flyout-close" id="stepCloseBtn" type="button" aria-label="Tutup menu">✕</button>
      </div>
      <ul class="step-flyout-list">
        ${steps.map((s, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const title = s.dataset.storyTitle || s.querySelector('h2')?.textContent || `Langkah ${num}`;
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
        <a href="#main" class="step-back-top">↑ Kembali ke atas modul</a>
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
