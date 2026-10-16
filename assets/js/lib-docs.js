(() => {
  const pages = [...document.querySelectorAll('.reference-page')];
  const navLinks = [...document.querySelectorAll('.nav-group a')];
  const sidebar = document.querySelector('.docs-sidebar');
  const menu = document.querySelector('.menu-toggle');
  const search = document.querySelector('#docs-search');
  const status = document.querySelector('#search-status');
  const toc = document.querySelector('.page-toc');
  const content = document.querySelector('#content');
  let currentPage;
  let copyTimer;
  let sectionObserver;

  document.body.classList.add('docs-ready');
  search.disabled = false;
  menu.hidden = false;
  document.querySelector('#search-help').textContent = 'Nama fungsi atau kegunaan. Ctrl / ⌘ K untuk mencari.';

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
    if (changed && location.hash) content.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', navigate);

  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('id');
    let count = 0;
    navLinks.forEach(link => {
      link.hidden = !link.dataset.search.toLocaleLowerCase('id').includes(query);
      if (!link.hidden) count++;
    });
    document.querySelectorAll('.nav-group').forEach(group => {
      group.hidden = ![...group.querySelectorAll('a')].some(link => !link.hidden);
    });
    status.textContent = query ? (count ? count + ' referensi ditemukan.' : 'Tidak ada hasil. Coba nama fungsi atau hapus pencarian.') : '';
  });
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
  navigate();
})();
