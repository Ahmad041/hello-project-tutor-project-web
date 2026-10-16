// Native reusable fade-up; content stays visible without JavaScript.
function fadeUp(element, { delay = 0, duration = 0.7, y = 24, once = true } = {}) {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  element.style.setProperty('--fade-delay', `${delay}s`);
  element.style.setProperty('--fade-duration', `${duration}s`);
  element.style.setProperty('--fade-y', `${y}px`);
  element.classList.add('fade-up-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        element.classList.add('is-visible');
        if (once) observer.unobserve(element);
      } else if (!once) element.classList.remove('is-visible');
    });
  }, { threshold: 0.2 });
  observer.observe(element);
}
document.querySelectorAll('.automation-heading [data-fade-up]').forEach((word, index) => fadeUp(word, {delay: 0.15 + index * 0.08, y: 32}));
document.querySelectorAll('.automation-subtext[data-fade-up]').forEach(text => fadeUp(text, {delay: 0.9}));
