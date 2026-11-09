/**
 * KasirKita - Anatomy Scrollytelling Engine
 * Lightweight Vanilla JS (< 200 lines, Zero External Dependencies)
 * Handles surgical component-level scrollytelling and manual stepper controls for technical SVG diagrams.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class AnatomyScroll {
    constructor(container) {
      this.container = container;
      this.steps = parseInt(container.getAttribute('data-steps') || '3', 10);
      this.currentStep = 1;
      this.userInteracted = false;
      this.interactionTimeout = null;

      this.prevBtn = container.querySelector('[data-step-prev]');
      this.nextBtn = container.querySelector('[data-step-next]');
      this.stepBtns = container.querySelectorAll('[data-step-btn]');
      this.stepDisplay = container.querySelector('[data-step-display]');

      this.init();
    }

    init() {
      this.bindButtons();
      this.setupObserver();
      this.applyStep(prefersReducedMotion ? this.steps : 1);
    }

    bindButtons() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.pauseAutoScroll();
          this.applyStep(this.currentStep - 1);
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.pauseAutoScroll();
          this.applyStep(this.currentStep + 1);
        });
      }

      this.stepBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetStep = parseInt(btn.getAttribute('data-step-btn'), 10);
          if (!isNaN(targetStep)) {
            this.pauseAutoScroll();
            this.applyStep(targetStep);
          }
        });
      });
    }

    pauseAutoScroll() {
      this.userInteracted = true;
      if (this.interactionTimeout) clearTimeout(this.interactionTimeout);
      this.interactionTimeout = setTimeout(() => {
        this.userInteracted = false;
      }, 4000);
    }

    setupObserver() {
      if (prefersReducedMotion) return;

      let ticking = false;

      const handleScroll = () => {
        if (this.userInteracted) return;

        const rect = this.container.getBoundingClientRect();
        const vh = window.innerHeight;

        // Container is entering / passing the central scanning zone
        if (rect.top < vh * 0.8 && rect.bottom > vh * 0.2) {
          const totalDistance = vh * 0.6 + rect.height;
          const currentProgress = (vh * 0.8 - rect.top) / totalDistance;
          const clamped = Math.max(0, Math.min(1, currentProgress));

          // Calculate step index
          let step = Math.floor(clamped * this.steps) + 1;
          if (step > this.steps) step = this.steps;

          if (step !== this.currentStep) {
            this.applyStep(step);
          }
        }
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    applyStep(step) {
      this.currentStep = Math.max(1, Math.min(step, this.steps));
      this.container.setAttribute('data-active-step', this.currentStep);

      // 1. Update Stepper Buttons state
      this.stepBtns.forEach((btn) => {
        const btnStep = parseInt(btn.getAttribute('data-step-btn'), 10);
        if (btnStep === this.currentStep) {
          btn.classList.add('bg-blue-600', 'text-white', 'dark:bg-sky-500', 'dark:text-zinc-950', 'font-bold');
          btn.classList.remove('text-zinc-600', 'dark:text-zinc-400', 'hover:bg-zinc-200', 'dark:hover:bg-white/10');
          btn.setAttribute('aria-current', 'step');
        } else {
          btn.classList.remove('bg-blue-600', 'text-white', 'dark:bg-sky-500', 'dark:text-zinc-950', 'font-bold');
          btn.classList.add('text-zinc-600', 'dark:text-zinc-400', 'hover:bg-zinc-200', 'dark:hover:bg-white/10');
          btn.removeAttribute('aria-current');
        }
      });

      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentStep <= 1;
        this.prevBtn.classList.toggle('opacity-40', this.currentStep <= 1);
        this.prevBtn.classList.toggle('cursor-not-allowed', this.currentStep <= 1);
      }

      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentStep >= this.steps;
        this.nextBtn.classList.toggle('opacity-40', this.currentStep >= this.steps);
        this.nextBtn.classList.toggle('cursor-not-allowed', this.currentStep >= this.steps);
      }

      if (this.stepDisplay) {
        this.stepDisplay.textContent = `Tahap ${this.currentStep} / ${this.steps}`;
      }

      // 2. Direct SVG group styling for instantaneous feedback
      const svgSteps = this.container.querySelectorAll('[data-step]');
      svgSteps.forEach((el) => {
        const elStep = parseInt(el.getAttribute('data-step'), 10);
        if (elStep === this.currentStep) {
          el.style.opacity = '1';
          el.style.transition = 'opacity 300ms ease, filter 300ms ease, transform 300ms ease';
          el.style.filter = 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.45))';
          el.classList.add('is-active-step');
        } else {
          el.style.opacity = '0.35';
          el.style.transition = 'opacity 300ms ease, filter 300ms ease, transform 300ms ease';
          el.style.filter = 'none';
          el.classList.remove('is-active-step');
        }
      });

      // 3. Highlight corresponding Callout Item
      const calloutItems = this.container.querySelectorAll('.anatomy-callout-item');
      calloutItems.forEach((item, idx) => {
        const itemStep = parseInt(item.getAttribute('data-callout-step') || (idx + 1), 10);
        if (itemStep === this.currentStep) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });

      // 4. Dispatch custom event for diagram-specific SVG hooks
      const event = new CustomEvent('anatomy:stepchange', {
        detail: { step: this.currentStep, totalSteps: this.steps },
        bubbles: true
      });
      this.container.dispatchEvent(event);
    }
  }

  // Reading Progress Bar Controller
  function initProgressBar() {
    const progressBar = document.querySelector('[data-sc-progress]');
    if (!progressBar) return;

    let ticking = false;
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / docHeight));
      progressBar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  // Global Theme Switcher Binder
  function initThemeToggle() {
    const btnLight = document.getElementById('theme-btn-light');
    const btnDark = document.getElementById('theme-btn-dark');
    if (!btnLight || !btnDark) return;

    function updateButtons(isDark) {
      if (isDark) {
        btnDark.classList.add('bg-zinc-800', 'text-white', 'shadow-sm');
        btnDark.classList.remove('text-zinc-400');
        btnLight.classList.remove('bg-zinc-200', 'text-zinc-900', 'shadow-sm');
        btnLight.classList.add('text-zinc-400');
      } else {
        btnLight.classList.add('bg-zinc-200', 'text-zinc-900', 'shadow-sm');
        btnLight.classList.remove('text-zinc-600');
        btnDark.classList.remove('bg-zinc-800', 'text-white', 'shadow-sm');
        btnDark.classList.add('text-zinc-600');
      }
    }

    function setTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('kasirkita-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('kasirkita-theme', 'light');
      }
      updateButtons(isDark);
    }

    const isInitialDark = document.documentElement.classList.contains('dark');
    updateButtons(isInitialDark);

    btnLight.addEventListener('click', () => setTheme(false));
    btnDark.addEventListener('click', () => setTheme(true));
  }

  // Auto-mount on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initProgressBar();
      initThemeToggle();
      document.querySelectorAll('[data-anatomy-scroll]').forEach((el) => new AnatomyScroll(el));
    });
  } else {
    initProgressBar();
    initThemeToggle();
    document.querySelectorAll('[data-anatomy-scroll]').forEach((el) => new AnatomyScroll(el));
  }
})();
