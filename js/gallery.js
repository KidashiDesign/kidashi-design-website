/* ============================================================
   GALLERY PAGE — Custom Cursor · Lightbox
   ============================================================ */

(function () {
  'use strict';

  /* ── Custom cursor ── */
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let hoverInterval = null;
    const shapes = ['✦', '☽', '✧'];
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

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        cursor.dataset.shape = shapes[shapeIdx];
        hoverInterval = setInterval(() => {
          shapeIdx = (shapeIdx + 1) % shapes.length;
          cursor.dataset.shape = shapes[shapeIdx];
        }, 800);
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        cursor.dataset.shape = '';
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
