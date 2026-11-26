(() => {
  const link = document.querySelector('.hero a.cta');
  if (!link || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'opening-dialog';
  dialog.setAttribute('aria-label', 'Video pembuka Hello Project');
  const video = document.createElement('video');
  video.src = 'assets/video/openingHelloProjectPanjang.mp4';
  video.poster = 'assets/images/opening_poster.jpg';
  video.preload = 'metadata';
  video.playsInline = true;
  video.controls = false;
  video.setAttribute('aria-label', 'Opening Hello Project');
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'opening-skip';
  skip.innerHTML = '<span>Lewati intro</span><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
  dialog.append(video, skip);
  document.body.append(dialog);
  let active = false;
  let leaving = false;
  const next = () => {
    if (!active || leaving) return;
    leaving = true;
    video.pause();
    window.location.assign(link.href);
  };
  const preloadVideo = () => {
    video.preload = 'auto';
  };
  ['mouseenter', 'focus', 'touchstart'].forEach(event => {
    link.addEventListener(event, preloadVideo, { once: true, passive: true });
  });
  video.addEventListener('ended', next);
  video.addEventListener('error', next);
  skip.addEventListener('click', next);
  dialog.addEventListener('cancel', event => { event.preventDefault(); next(); });
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (active) return;
    active = true;
    document.querySelector('video.art')?.pause();
    document.body.classList.add('opening-playing');
    dialog.showModal();
    skip.focus();
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(next);
    });
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    active = false;
    leaving = false;
    video.pause();
    video.currentTime = 0;
    dialog.close();
    document.body.classList.remove('opening-playing');
    document.querySelector('video.art')?.play().catch(() => {});
  });
})();
