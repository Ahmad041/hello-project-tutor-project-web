const ICON_PLAY = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
const ICON_PAUSE = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
const ICON_ARROW_RIGHT = '<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

const bgVideo = document.querySelector('.module-video');
const toggle = document.querySelector('.module-video-toggle');
if (bgVideo && toggle) {
  bgVideo.muted = true;
  bgVideo.play().catch(() => {});
  function updateLabel() {
    toggle.innerHTML = bgVideo.paused
      ? `<span>Putar video</span>${ICON_PLAY}`
      : `<span>Jeda video</span>${ICON_PAUSE}`;
    toggle.setAttribute('aria-label', bgVideo.paused ? 'Putar video latar' : 'Jeda video latar');
  }
  bgVideo.addEventListener('play', updateLabel);
  bgVideo.addEventListener('pause', updateLabel);
  toggle.addEventListener('click', () => {
    if (bgVideo.paused) bgVideo.play().catch(() => {});
    else bgVideo.pause();
  });
  updateLabel();
}

document.querySelectorAll('.module-callout').forEach(link => {
  const line = document.querySelector(`[data-line="${link.dataset.module}"]`);
  if (line) {
    const update = () => line.classList.toggle('active', link.matches(':hover, :focus-visible'));
    ['mouseenter', 'mouseleave', 'focus', 'blur'].forEach(event => link.addEventListener(event, update));
  }
});

// Transisi ke daftar isi menggunakan daftarModulToisi.mp4
(() => {
  const callouts = document.querySelectorAll('.module-callout');
  if (!callouts.length || typeof HTMLDialogElement === 'undefined') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'opening-dialog';
  dialog.setAttribute('aria-label', 'Video transisi modul ke daftar isi');

  const transVideo = document.createElement('video');
  transVideo.src = 'assets/video/daftarModulToisi.mp4';
  transVideo.preload = 'none';
  transVideo.playsInline = true;
  transVideo.controls = false;
  transVideo.setAttribute('aria-label', 'Transisi ke Daftar Isi');

  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'opening-skip';
  skip.innerHTML = `<span>Lewati transisi</span>${ICON_ARROW_RIGHT}`;

  dialog.append(transVideo, skip);
  document.body.append(dialog);

  let active = false;
  let leaving = false;
  let targetUrl = '';

  const next = () => {
    if (!active || leaving) return;
    leaving = true;
    transVideo.pause();
    window.location.assign(targetUrl);
  };

  transVideo.addEventListener('ended', next);
  transVideo.addEventListener('error', next);
  skip.addEventListener('click', next);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    next();
  });

  callouts.forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (active) return;
      active = true;
      targetUrl = link.href;

      bgVideo?.pause();
      document.body.classList.add('opening-playing');
      dialog.showModal();
      skip.focus();

      transVideo.play().catch(() => {
        transVideo.muted = true;
        transVideo.play().catch(next);
      });
    });
  });

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    active = false;
    leaving = false;
    targetUrl = '';
    transVideo.pause();
    transVideo.currentTime = 0;
    try { dialog.close(); } catch (_) {}
    document.body.classList.remove('opening-playing');
    bgVideo?.play().catch(() => {});
  });
})();
