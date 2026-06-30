/* ── Zoom Parallax — About page travel hero ── */
(function () {
  const section = document.querySelector('.zp');
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = section.querySelectorAll('.zp__item');
  if (!items.length) return;

  /* Read the target scale from the inline CSS custom property */
  const scaleEnds = Array.from(items).map(el =>
    parseFloat(getComputedStyle(el).getPropertyValue('--zp-scale-end')) || 4
  );

  function onScroll() {
    const rect   = section.getBoundingClientRect();
    const total  = section.offsetHeight - window.innerHeight;
    /* progress: 0 (section top hits viewport top) → 1 (section bottom hits viewport bottom) */
    const progress = Math.max(0, Math.min(1, -rect.top / total));

    items.forEach((item, i) => {
      const scale = 1 + (scaleEnds[i] - 1) * progress;
      item.style.transform = `scale(${scale})`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* init */
})();
