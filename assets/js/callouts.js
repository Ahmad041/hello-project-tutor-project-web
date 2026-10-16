const map = document.querySelector('.callout-map');
if (map) {
  const target = map.querySelector('.target-dot');
  const group = map.querySelector('.callout-lines g');
  const links = [...map.querySelectorAll('.map-callout')];
  const replayBtn = document.querySelector('.replay-boot');

  const paths = links.map(link => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    group.append(path);
    const highlight = () => path.classList.add('active');
    const reset = () => path.classList.remove('active');
    link.addEventListener('mouseenter', highlight);
    link.addEventListener('mouseleave', reset);
    link.addEventListener('focus', highlight);
    link.addEventListener('blur', reset);
    return path;
  });

  // Spark circles for the traveling nanite effect
  const sparks = links.map(() => {
    const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    spark.setAttribute('r', '5');
    spark.setAttribute('class', 'callout-spark');
    spark.style.opacity = '0';
    group.append(spark);
    return spark;
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

  if ('ResizeObserver' in window) new ResizeObserver(drawConnections).observe(map);
  window.addEventListener('resize', drawConnections);
  document.fonts.ready.then(drawConnections);
  drawConnections();
}
