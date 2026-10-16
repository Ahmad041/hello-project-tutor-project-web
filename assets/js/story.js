const steps = [...document.querySelectorAll('.story-step')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const step = entry.target;
      document.querySelector('[data-story-title]:not(section)').textContent = step.dataset.storyTitle;
      document.querySelector('[data-story-count]').textContent = `Langkah ${steps.indexOf(step) + 1} dari ${steps.length}`;
      steps.forEach(item => item.classList.toggle('is-current', item === step));
    }
  }, {rootMargin: '-15% 0px -45% 0px', threshold: 0});
  steps.forEach(step => observer.observe(step));
}
