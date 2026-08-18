/* ============================================================
   GALLERY PAGE — Hero Collage Intro animation + Lightbox
   Animation ported directly from Hero Collage Intro.dc.html
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════
     HERO COLLAGE INTRO — dc.html rAF animation
     · staggered assemble-in (i * 0.2s delay, 1.7s ease)
     · ambient sinusoidal drift per image
     · pointer parallax with alternating depth
     · global cinematic zoom-out settle over 4.5s
  ══════════════════════════════════════════════════ */
  const hero  = document.getElementById('ghero');
  if (hero) {
    const imgs  = Array.from(hero.querySelectorAll('[data-img]'));
    const scrim = hero.querySelector('[data-scrim]');
    let start = performance.now();
    const p = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      p.tx = (e.clientX - r.left) / r.width  - 0.5;
      p.ty = (e.clientY - r.top)  / r.height - 0.5;
    };
    const onLeave = () => { p.tx = 0; p.ty = 0; };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);

    /* Initial scrim opacity (medium = 0.45) */
    if (scrim) scrim.style.opacity = '0.45';

    let raf;
    const tick = (now) => {
      const t = (now - start) / 1000;

      /* Smooth pointer lerp */
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;

      /* Cinematic settle: gentle zoom-out over the first 4.5s */
      const settle  = Math.min(1, t / 4.5);
      const settleE = 1 - Math.pow(1 - settle, 3);
      const globalScale = 1.07 - 0.07 * settleE;

      const n = imgs.length;
      for (let i = 0; i < n; i++) {
        const el = imgs[i];

        /* Staggered assemble-in */
        const delay = i * 0.2;
        let pr = (t - delay) / 1.7;
        pr = pr < 0 ? 0 : pr > 1 ? 1 : pr;
        const pe = 1 - Math.pow(1 - pr, 3);           /* cubic ease-out */
        const dir = i % 2 === 0 ? 1 : -1;
        const introY = (1 - pe) * 70 * dir;

        /* Seamless ambient parallax drift */
        const period = 9 + i * 1.3;
        const phase  = i * 1.7;
        const driftY = Math.sin((t / period) * Math.PI * 2 + phase) * 3.0;
        const driftX = Math.cos((t / (period * 1.35)) * Math.PI * 2 + phase) * 1.1;

        /* Pointer parallax — alternating depth per layer */
        const depth = 7 + (i % 2) * 6;
        const px = -p.x * depth;
        const py = -p.y * depth;

        const scale = (1.12 * globalScale).toFixed(4);
        el.style.opacity   = pe.toFixed(3);
        el.style.transform =
          'translate3d(calc(' + driftX.toFixed(3) + '% + ' + px.toFixed(2) + 'px), calc(' +
          driftY.toFixed(3) + '% + ' + introY.toFixed(2) + 'px + ' + py.toFixed(2) + 'px), 0) scale(' + scale + ')';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* Pause when tab is hidden */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        start = performance.now() - start; /* maintain elapsed */
        start = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
  }

  /* ══════════════════════════════════════════════════
     LIGHTBOX
  ══════════════════════════════════════════════════ */
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg    = lightbox.querySelector('.lightbox__img');
  const lbLabel  = lightbox.querySelector('.lightbox__label');
  const lbClose  = lightbox.querySelector('.lightbox__close');
  const lbPrev   = lightbox.querySelector('.lightbox__prev');
  const lbNext   = lightbox.querySelector('.lightbox__next');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');

  const items = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
  let current = 0;

  function open(idx) {
    current = idx;
    const item = items[current];
    lbImg.src = item.dataset.src;
    lbImg.alt = item.dataset.label || '';
    lbLabel.textContent = item.dataset.label || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  function navigate(dir) {
    current = (current + dir + items.length) % items.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      const item = items[current];
      lbImg.src = item.dataset.src;
      lbImg.alt = item.dataset.label || '';
      lbLabel.textContent = item.dataset.label || '';
      lbImg.style.opacity = '1';
    }, 150);
  }

  lbImg.style.transition = 'opacity 0.15s';
  items.forEach((item, idx) => item.addEventListener('click', () => open(idx)));
  lbClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  lbPrev.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) navigate(delta < 0 ? 1 : -1);
  }, { passive: true });

})();
