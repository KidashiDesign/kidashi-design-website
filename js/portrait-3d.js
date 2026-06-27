/* ============================================================
   KIDASHI DESIGN — portrait-3d.js
   3D hover / float effect for portrait images.
   Usage: attach class "portrait-3d" to the wrapper div.
   ============================================================ */

(function () {
  'use strict';

  const MAX_TILT   = 6;       /* max degrees in any direction */
  const LERP_SPEED = 0.08;    /* 0–1: lower = smoother lag */
  const FLOAT_AMP  = 10;      /* px float amplitude */
  const FLOAT_SPEED = 0.0008; /* radians/ms */

  /* ── Lerp helper ── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Init one portrait card ── */
  function initPortrait(wrapper) {
    const img = wrapper.querySelector('img');
    if (!img) return;

    /* Wrap img in a scene + card for perspective/3D layers */
    const scene = document.createElement('div');
    scene.className = 'p3d-scene';

    const card = document.createElement('div');
    card.className = 'p3d-card';

    const glare = document.createElement('div');
    glare.className = 'p3d-glare';

    /* Move img into card */
    wrapper.insertBefore(scene, img);
    scene.appendChild(card);
    card.appendChild(img);
    card.appendChild(glare);

    /* State */
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let hovered = false;
    let rafId = null;
    let startTime = performance.now();

    /* ── Main RAF loop ── */
    function tick(now) {
      const elapsed = now - startTime;

      /* Float oscillation */
      const floatY   = Math.sin(elapsed * FLOAT_SPEED) * FLOAT_AMP;
      const floatRot = Math.sin(elapsed * FLOAT_SPEED * 0.6) * 1.2;

      /* Smooth tilt toward target */
      currentRX = lerp(currentRX, targetRX, LERP_SPEED);
      currentRY = lerp(currentRY, targetRY, LERP_SPEED);

      /* Apply transform */
      const translateY = hovered ? 0 : floatY;
      const extraRot   = hovered ? 0 : floatRot;

      card.style.transform =
        `translate3d(0, ${translateY}px, 0) ` +
        `rotateX(${currentRX}deg) ` +
        `rotateY(${currentRY + extraRot}deg) ` +
        `scale(${hovered ? 1.015 : 1})`;

      /* Glare position — follows mouse tilt */
      const glareX = 50 + currentRY * 2;
      const glareY = 50 - currentRX * 2;
      glare.style.background =
        `radial-gradient(circle at ${glareX}% ${glareY}%, ` +
        `rgba(255,255,255,${hovered ? 0.14 : 0.04}) 0%, transparent 65%)`;

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    /* ── Mouse interaction ── */
    scene.addEventListener('mouseenter', () => { hovered = true; });

    scene.addEventListener('mousemove', (e) => {
      const rect = scene.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const nx   = (e.clientX - cx) / (rect.width  / 2); /* -1 to 1 */
      const ny   = (e.clientY - cy) / (rect.height / 2); /* -1 to 1 */

      targetRY =  nx * MAX_TILT;
      targetRX = -ny * MAX_TILT;

    });

    scene.addEventListener('mouseleave', () => {
      hovered = false;
      targetRX = 0;
      targetRY = 0;
    });

    /* ── Touch / gyroscope ── */
    scene.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return;
      const rect = scene.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const nx   = (e.touches[0].clientX - cx) / (rect.width  / 2);
      const ny   = (e.touches[0].clientY - cy) / (rect.height / 2);
      targetRY =  nx * MAX_TILT * 0.6;
      targetRX = -ny * MAX_TILT * 0.6;
    }, { passive: true });

    scene.addEventListener('touchend', () => {
      targetRX = 0;
      targetRY = 0;
    }, { passive: true });

    /* Device orientation (gyroscope) — mobile */
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        targetRY = Math.max(-MAX_TILT, Math.min(MAX_TILT, e.gamma * 0.4));
        targetRX = Math.max(-MAX_TILT, Math.min(MAX_TILT, (e.beta - 45) * 0.3));
      }, { passive: true });
    }
  }

  /* ── Boot: run after DOM ready ── */
  function boot() {
    document.querySelectorAll('.portrait-3d').forEach(initPortrait);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
