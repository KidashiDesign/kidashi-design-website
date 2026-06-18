/* ============================================================
   GALLERY PAGE — Custom Cursor · Lightbox
   ============================================================ */

(function () {
  'use strict';

  /* SVG icon paths — simple flat style, viewBox 0 0 24 24 */
  const SHAPE_SVGS = [
    /* star */
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
    /* crescent moon */
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    /* sun */
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke-width="2" stroke="currentColor"/><line x1="12" y1="21" x2="12" y2="23" stroke-width="2" stroke="currentColor"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="2" stroke="currentColor"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="2" stroke="currentColor"/><line x1="1" y1="12" x2="3" y2="12" stroke-width="2" stroke="currentColor"/><line x1="21" y1="12" x2="23" y2="12" stroke-width="2" stroke="currentColor"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="2" stroke="currentColor"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="2" stroke="currentColor"/></svg>`,
    /* diamond */
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,12 12,22 2,12"/></svg>`,
    /* heart */
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  ];

  /* ── Custom cursor ── */
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    /* Inject inner elements */
    cursor.innerHTML = `<span class="cursor__dot"></span><span class="cursor__icon">${SHAPE_SVGS[0]}</span>`;
    const cursorIcon = cursor.querySelector('.cursor__icon');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let hoverInterval = null;
    let shapeIdx = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    (function loop() {
      curX += (mouseX - curX) * 0.14;
      curY += (mouseY - curY) * 0.14;
      cursor.style.transform = `translate(${curX - cursor.offsetWidth / 2}px, ${curY - cursor.offsetHeight / 2}px)`;
      requestAnimationFrame(loop);
    })();

    function setShape(idx) {
      cursorIcon.innerHTML = SHAPE_SVGS[idx];
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        setShape(shapeIdx);
        hoverInterval = setInterval(() => {
          shapeIdx = (shapeIdx + 1) % SHAPE_SVGS.length;
          setShape(shapeIdx);
        }, 800);
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        clearInterval(hoverInterval);
        hoverInterval = null;
      });
    });

    /* Lightbox buttons */
    document.querySelectorAll('.lightbox__close, .lightbox__prev, .lightbox__next, .lightbox__backdrop').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-lightbox'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-lightbox'));
    });
  }

  /* ── Lightbox ── */
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

  items.forEach((item, idx) => {
    item.addEventListener('click', () => open(idx));
    item.style.cursor = 'none';
  });

  lbClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  lbPrev.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  /* Touch swipe */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) navigate(delta < 0 ? 1 : -1);
  }, { passive: true });

})();
