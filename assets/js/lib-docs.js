(() => {
  const pages = [...document.querySelectorAll('.reference-page')];
  const navLinks = [...document.querySelectorAll('.nav-group a')];
  const sidebar = document.querySelector('.docs-sidebar');
  const menu = document.querySelector('.menu-toggle');
  const search = document.querySelector('#docs-search');
  const status = document.querySelector('#search-status');
  const toc = document.querySelector('.page-toc');
  const content = document.querySelector('#content');
  const versionSelect = document.querySelector('#lib-version-select');
  const navDownloadLib = document.querySelector('#nav-download-lib');
  const brandVersion = document.querySelector('.site-brand span');
  const LIB_VERSIONS = {
    standard: {
      href: 'files/lib.h',
      downloadText: 'Unduh lib.h',
      brandText: '/ lib.h'
    },
    beta: {
      href: 'files/lib-beta.h',
      downloadText: 'Unduh lib-beta.h',
      brandText: '/ lib-beta.h'
    }
  };
  let currentPage;
  let copyTimer;
  let sectionObserver;
  const previewTimers = {};

  document.body.classList.add('docs-ready');
  search.disabled = false;
  menu.hidden = false;
  document.querySelector('#search-help').textContent = 'Nama fungsi atau kegunaan. Ctrl / ⌘ K untuk mencari.';

  function getSelectedVersion() {
    return versionSelect && versionSelect.value === 'beta' ? 'beta' : 'standard';
  }

  function filterNav() {
    const query = search.value.trim().toLocaleLowerCase('id');
    const version = getSelectedVersion();
    let count = 0;
    navLinks.forEach(link => {
      const group = link.closest('.nav-group');
      const isBetaItem = link.dataset.libVersion === 'beta' || group?.dataset.libVersion === 'beta';
      const allowed = version === 'beta' || !isBetaItem;
      const matches = link.dataset.search.toLocaleLowerCase('id').includes(query);
      link.hidden = !allowed || !matches;
      if (!link.hidden) count++;
    });
    document.querySelectorAll('.nav-group').forEach(group => {
      if (version === 'standard' && group.dataset.libVersion === 'beta') {
        group.hidden = true;
        return;
      }
      group.hidden = ![...group.querySelectorAll('a')].some(link => !link.hidden);
    });
    status.textContent = query ? (count ? count + ' referensi ditemukan.' : 'Tidak ada hasil. Coba nama fungsi atau hapus pencarian.') : '';
  }

  function syncVersionUI() {
    const version = getSelectedVersion();
    const config = LIB_VERSIONS[version];
    if (navDownloadLib) {
      navDownloadLib.setAttribute('href', config.href);
      navDownloadLib.textContent = config.downloadText;
    }
    if (brandVersion) {
      brandVersion.textContent = config.brandText;
    }
    filterNav();
  }

  function closeMenu(returnFocus = false) {
    document.body.classList.remove('menu-open');
    menu.setAttribute('aria-expanded', 'false');
    content.inert = false;
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const opened = document.body.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', String(opened));
    content.inert = opened;
    if (opened) search.focus();
  });

  function navigate() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)) || 'mulai'; }
    catch { id = 'mulai'; }
    const target = document.getElementById(id);
    const page = id === 'content' ? currentPage || pages[0] : target?.closest('.reference-page');
    if (page && page.dataset.libVersion === 'beta' && versionSelect && versionSelect.value !== 'beta') {
      versionSelect.value = 'beta';
      syncVersionUI();
    }
    const changed = page !== currentPage;
    pages.forEach(item => { item.hidden = item !== page; });
    document.querySelector('.not-found').hidden = Boolean(page);
    navLinks.forEach(link => {
      if (page && link.hash === '#' + page.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    currentPage = page;
    closeMenu();
    toc.querySelector('nav').replaceChildren();
    toc.hidden = !page;
    sectionObserver?.disconnect();
    if (page) {
      document.title = page.dataset.title + ' | Hello Project';
      page.querySelectorAll('section').forEach(section => {
        const link = document.createElement('a');
        link.href = '#' + section.id;
        link.textContent = section.querySelector('h2').textContent;
        toc.querySelector('nav').append(link);
      });
      if ('IntersectionObserver' in window) {
        sectionObserver = new IntersectionObserver(entries => {
          const visible = entries.find(entry => entry.isIntersecting);
          if (!visible) return;
          toc.querySelectorAll('a').forEach(link => {
            if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }, { rootMargin: '-130px 0px -60% 0px' });
        page.querySelectorAll('section').forEach(section => sectionObserver.observe(section));
      }
      if (target === page) window.scrollTo({ top: 0 });
      else target.scrollIntoView({ block: 'start' });
    }
    if (changed) {
      stopPreviews();
      if (location.hash) content.focus({ preventScroll: true });
      if (page?.id === 'typeText' || page?.id === 'loadingBar') runPreview(page.id);
    }
  }

  function stopPreviews() {
    clearInterval(previewTimers.typeText);
    clearInterval(previewTimers.loadingBar);
    delete previewTimers.typeText;
    delete previewTimers.loadingBar;
  }

  function runPreview(kind) {
    const out = document.querySelector('[data-preview-output="' + kind + '"]');
    if (!out) return;
    clearInterval(previewTimers[kind]);
    if (kind === 'typeText') {
      const text = 'Selamat datang di KasirKita!';
      const hold = 20;
      let i = 0;
      out.textContent = '';
      previewTimers[kind] = setInterval(() => {
        if (i < text.length) out.textContent += text[i];
        i++;
        if (i > text.length + hold) { i = 0; out.textContent = ''; }
      }, 45);
    } else if (kind === 'loadingBar') {
      let step = 0;
      const render = s => '█'.repeat(s) + '░'.repeat(24 - s) + ' ' + String(Math.floor((s * 100) / 24)).padStart(3, ' ') + '%';
      out.textContent = render(0);
      previewTimers[kind] = setInterval(() => {
        step++;
        if (step <= 24) out.textContent = render(step);
        else if (step > 48) { step = 0; out.textContent = render(0); }
      }, 30);
    }
  }
  window.addEventListener('hashchange', navigate);

  search.addEventListener('input', filterNav);
  if (versionSelect) {
    versionSelect.addEventListener('change', () => {
      syncVersionUI();
      if (getSelectedVersion() === 'standard' && currentPage?.dataset.libVersion === 'beta') {
        if (location.hash !== '#mulai') location.hash = '#mulai';
        navigate();
      }
    });
  }
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (matchMedia('(max-width: 760px)').matches) {
        document.body.classList.add('menu-open');
        menu.setAttribute('aria-expanded', 'true');
        content.inert = true;
      }
      search.focus();
    }
    if (event.key === 'Escape') {
      if (document.body.classList.contains('menu-open')) closeMenu(true);
      else if (document.activeElement === search) {
        search.value = '';
        search.dispatchEvent(new Event('input'));
      }
    }
  });
  sidebar.addEventListener('click', event => {
    if (event.target.closest('a')) {
      closeMenu();
      if (matchMedia('(max-width: 760px)').matches) content.focus({ preventScroll: true });
    }
  });
  document.querySelectorAll('.code-block').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = 'Salin kode';
    button.addEventListener('click', async () => {
      const text = block.querySelector('code').textContent;
      const feedback = document.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(text);
        feedback.textContent = 'Kode tersalin.';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(block.querySelector('code'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        feedback.textContent = 'Kode dipilih. Tekan Ctrl / ⌘ C untuk menyalin.';
      }
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { feedback.textContent = ''; }, 3500);
    });
    block.querySelector('.code-label').append(button);
  });
  document.querySelectorAll('[data-run-preview]').forEach(btn => {
    btn.addEventListener('click', () => runPreview(btn.dataset.runPreview));
  });
  const COLOR_HEX = {
    COLOR_LIGHT_GREEN: '#a7f3d0',
    COLOR_LIGHT_CYAN: '#67e8f9',
    COLOR_LIGHT_YELLOW: '#fde047',
    COLOR_LIGHT_RED: '#fca5a5',
    COLOR_BRIGHT_WHITE: '#ffffff'
  };
  const typeColorSelect = document.querySelector('[data-preview-color="typeText"]');
  if (typeColorSelect) {
    typeColorSelect.addEventListener('change', () => {
      const name = typeColorSelect.value;
      const screen = document.querySelector('[data-preview="typeText"] .term-screen');
      const label = document.querySelector('[data-preview-label="typeText"]');
      if (screen && COLOR_HEX[name]) screen.style.color = COLOR_HEX[name];
      if (label) label.textContent = 'setColor(' + name + ', COLOR_BLACK); typeText(4, 2, "Selamat datang di KasirKita!", 45);';
      runPreview('typeText');
    });
  }
  navigate();
  syncVersionUI();
})();
