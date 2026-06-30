/* ============================================================
   KIDASHI DESIGN — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom cursor — ported from Custom Cursor.dc.html ── */
  const cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const GLYPHS = ['✦', '✧', '✶', '✷', '✴'];
    const CYCLE_MS = 1000;
    const SMOOTHING = 0.28;
    const SIZE = 30;

    /* Build DOM */
    cursor.innerHTML =
      `<div class="cursor__circle">
        <svg viewBox="0 0 100 100" width="${SIZE}" height="${SIZE}" style="overflow:visible">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="5"/>
        </svg>
      </div>
      <div class="cursor__glyphs">
        ${GLYPHS.map(g => `<span class="cursor__glyph">${g}</span>`).join('')}
      </div>`;

    const circleEl = cursor.querySelector('.cursor__circle');
    const glyphsEl = cursor.querySelector('.cursor__glyphs');
    const glyphs   = Array.from(cursor.querySelectorAll('.cursor__glyph'));

    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let target = { x: pos.x, y: pos.y };
    let isHover = false, glyphIdx = 0, cycleTimer = null, seen = false;
    let needsHoverCheck = false;

    /* Detect background luminance to auto-switch cursor color */
    function getBgLuminance(el) {
      let node = el;
      while (node && node !== document.body) {
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) {
          const [r, g, b] = [+m[1], +m[2], +m[3]];
          if (r + g + b > 0) {
            /* relative luminance */
            return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
          }
        }
        node = node.parentElement;
      }
      return 1; /* assume light if nothing found */
    }

    /* Pointer tracking — only update position; defer DOM queries to rAF */
    window.addEventListener('pointermove', e => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) { seen = true; cursor.style.opacity = '1'; }
      needsHoverCheck = true;
    }, { passive: true });

    /* rAF lerp loop — reads before writes to avoid layout thrash */
    (function loop() {
      /* Read phase: DOM queries before any style writes */
      let checkEl = null;
      if (needsHoverCheck) {
        needsHoverCheck = false;
        checkEl = document.elementFromPoint(target.x, target.y);
      }

      /* Write phase */
      pos.x += (target.x - pos.x) * SMOOTHING;
      pos.y += (target.y - pos.y) * SMOOTHING;
      cursor.style.transform = `translate3d(${pos.x.toFixed(2)}px,${pos.y.toFixed(2)}px,0) translate(-50%,-50%)`;

      if (checkEl) {
        const lum = getBgLuminance(checkEl);
        cursor.style.color = lum < 0.35 ? '#F7F3EE' : '#0A0A0B';
        const hovered = !!(checkEl.closest && checkEl.closest('a, button, .gallery-item, .portfolio-item, .portfolio-card, .service-card, .filter-btn, [role="button"], [data-cursor="hover"]'));
        setHover(hovered);
      }

      requestAnimationFrame(loop);
    })();

    function renderGlyph() {
      glyphs.forEach((g, i) => {
        if (i === glyphIdx) {
          g.classList.remove('exit');
          g.classList.add('active');
        } else {
          g.classList.remove('active');
          g.classList.add('exit');
        }
      });
    }

    function setHover(on) {
      if (on === isHover) return;
      isHover = on;
      if (on) {
        circleEl.style.opacity = '0';
        circleEl.style.transform = 'scale(0.35)';
        glyphsEl.style.opacity = '1';
        glyphIdx = 0;
        renderGlyph();
        clearInterval(cycleTimer);
        cycleTimer = setInterval(() => {
          glyphIdx = (glyphIdx + 1) % glyphs.length;
          renderGlyph();
        }, CYCLE_MS);
      } else {
        circleEl.style.opacity = '1';
        circleEl.style.transform = 'scale(1)';
        glyphsEl.style.opacity = '0';
        clearInterval(cycleTimer);
        glyphs.forEach(g => { g.classList.remove('active', 'exit'); });
      }
    }
  }

  /* ── Word-cycle crossfade engine ── */
  function initGooeyText(host, texts, morphTime, cooldownTime) {
    morphTime    = morphTime    || 1;
    cooldownTime = cooldownTime || 2.5;

    const filterEl = document.createElement('span');
    filterEl.className = 'gooey-filter';
    const t1 = document.createElement('span');
    t1.className = 'gooey-t1';
    const t2 = document.createElement('span');
    t2.className = 'gooey-t2';
    filterEl.appendChild(t1);
    filterEl.appendChild(t2);
    host.textContent = '';
    host.appendChild(filterEl);

    /* Lock container width to widest word so surrounding text never shifts.
       Must wait for fonts: probe with fallback font gives wrong metrics. */
    if (!host.closest('.hero2__cycle')) {
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(function() {
        requestAnimationFrame(function() {
          const probe = document.createElement('span');
          const cs = window.getComputedStyle(t1);
          probe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;white-space:nowrap;';
          probe.style.fontSize = cs.fontSize;
          probe.style.fontFamily = cs.fontFamily;
          probe.style.fontWeight = cs.fontWeight;
          probe.style.fontStyle = cs.fontStyle;
          probe.style.letterSpacing = cs.letterSpacing;
          document.body.appendChild(probe);
          let maxW = 0;
          texts.forEach(function(txt) {
            probe.textContent = txt;
            maxW = Math.max(maxW, probe.getBoundingClientRect().width);
          });
          document.body.removeChild(probe);
          if (maxW > 0) filterEl.style.minWidth = Math.ceil(maxW) + 'px';
        });
      });
    }

    let idx      = texts.length - 1;
    let prev     = Date.now();
    let morph    = 0;
    let cooldown = cooldownTime;

    t1.textContent = texts[idx % texts.length];
    t2.textContent = texts[(idx + 1) % texts.length];

    function setMorph(f) {
      t2.style.opacity = String(f);
      t1.style.opacity = String(1 - f);
    }

    function tick() {
      const now  = Date.now();
      const dt   = (now - prev) / 1000;
      prev = now;
      const shouldInc = cooldown > 0;
      cooldown -= dt;
      if (cooldown <= 0) {
        if (shouldInc) {
          idx = (idx + 1) % texts.length;
          t1.textContent = texts[idx % texts.length];
          t2.textContent = texts[(idx + 1) % texts.length];
        }
        morph -= cooldown;
        cooldown = 0;
        let f = morph / morphTime;
        if (f > 1) { cooldown = cooldownTime; f = 1; }
        setMorph(f);
      } else {
        morph = 0;
        t2.style.opacity = '1';
        t1.style.opacity = '0';
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── Hero 2 — reactive gradient + scroll reveals ── */
  const hero2 = document.getElementById('hero2');
  if (hero2) {

    /* Scroll-driven: H2 reveal slides in from sides */
    const revealLeft  = hero2.querySelector('.hero2__reveal-left');
    const revealRight = hero2.querySelector('.hero2__reveal-right');
    const revealH2    = hero2.querySelector('.hero2__reveal-h2');
    const heroInfo    = document.getElementById('heroInfo');

    function updateHero2() {
      const rect = hero2.getBoundingClientRect();
      const scrollable = hero2.offsetHeight - window.innerHeight;
      const progress   = Math.max(0, Math.min(1, -rect.top / scrollable));
      const h2p = Math.max(0, Math.min(1, (progress - 0.15) / 0.55));
      const h2e = 1 - Math.pow(1 - h2p, 3);
      const tx  = (1 - h2e) * 65;
      if (revealLeft)  revealLeft.style.transform  = `translateX(${-tx}vw)`;
      if (revealRight) revealRight.style.transform = `translateX(${tx}vw)`;
      if (revealH2)    revealH2.style.opacity      = String(h2e);
      if (heroInfo)    heroInfo.style.transform     = `translateY(${progress * 160}px)`;
    }
    window.addEventListener('scroll', updateHero2, { passive: true });
    updateHero2();

    /* Blob parallax — mouse + touch */
    const heroBg = hero2.querySelector('.hero2__bg');
    if (heroBg) {
      let bTx = 0, bTy = 0, bCx = 0, bCy = 0;
      const blobs = heroBg.querySelectorAll('.blob');
      const BLOB_AMP = 60;
      const onBlobMove = (e) => {
        bTx = e.clientX / window.innerWidth - 0.5;
        bTy = e.clientY / window.innerHeight - 0.5;
      };
      const onBlobTouch = (e) => {
        if (e.touches && e.touches[0]) {
          bTx = e.touches[0].clientX / window.innerWidth - 0.5;
          bTy = e.touches[0].clientY / window.innerHeight - 0.5;
        }
      };
      window.addEventListener('mousemove', onBlobMove, { passive: true });
      window.addEventListener('touchmove', onBlobTouch, { passive: true });
      (function blobLoop() {
        bCx += (bTx - bCx) * 0.045;
        bCy += (bTy - bCy) * 0.045;
        blobs.forEach((b) => {
          const d = parseFloat(b.dataset.depth) || 1;
          b.style.transform = `translate(-50%,-50%) translate3d(${(bCx * BLOB_AMP * d).toFixed(2)}px,${(bCy * BLOB_AMP * d).toFixed(2)}px,0)`;
        });
        requestAnimationFrame(blobLoop);
      })();
    }

  }

  /* ── Nav scroll ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger ── */
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.querySelector('.nav__mobile');
  if (burger && mobileNav) {
    function openMenu() {
      burger.classList.add('open');
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });
    const closeBtn = mobileNav.querySelector('.nav__mobile-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── Tbilisi clock (UTC+4) ── */
  const navTime    = document.getElementById('navTime');
  const mobileDate  = document.getElementById('mobileDate');
  const mobileTime  = document.getElementById('mobileTime');
  function updateClock() {
    const now = new Date(Date.now() + 4 * 3600000);
    const hh  = String(now.getUTCHours()).padStart(2, '0');
    const mm  = String(now.getUTCMinutes()).padStart(2, '0');
    const ss  = String(now.getUTCSeconds()).padStart(2, '0');
    const dd  = String(now.getUTCDate()).padStart(2, '0');
    const mo  = String(now.getUTCMonth() + 1).padStart(2, '0');
    const yy  = String(now.getUTCFullYear()).slice(-2);
    if (navTime)    navTime.textContent    = `${hh}:${mm}`;
    if (mobileTime) mobileTime.textContent = `${hh}:${mm}:${ss}`;
    if (mobileDate) mobileDate.textContent = `${yy}/${mo}/${dd}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ── Parallax hero ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const overlay = hero.querySelector('.hero__overlay');
      const content = hero.querySelector('.hero__content');
      if (overlay) overlay.style.opacity = Math.min(1, 0.6 + scrolled * 0.001);
      if (content) content.style.transform = `translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  }

  /* ── Parallax portrait ── */
  const portrait = document.querySelector('.about-teaser__portrait img, .about-hero__portrait img');
  if (portrait) {
    window.addEventListener('scroll', () => {
      const rect = portrait.closest('section, div').getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.08;
        portrait.style.transform = `translateY(${Math.min(offset, 60)}px)`;
      }
    }, { passive: true });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── About 3D tilt card (Aceternity-style, vanilla port) ── */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (tiltCards.length
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltCards.forEach(card => {
      const items = card.querySelectorAll('[data-tilt-z]');
      const setItems = (on) => {
        items.forEach(item => {
          const z = item.getAttribute('data-tilt-z') || 0;
          const x = item.getAttribute('data-tilt-x') || 0;
          const y = item.getAttribute('data-tilt-y') || 0;
          item.style.transform = on
            ? `translate3d(${x}px, ${y}px, ${z}px)`
            : 'translate3d(0, 0, 0)';
        });
      };
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = (e.clientX - r.left - r.width / 2) / 25;
        const ry = (e.clientY - r.top - r.height / 2) / 25;
        card.style.transform = `rotateY(${rx}deg) rotateX(${ry}deg)`;
      });
      card.addEventListener('mouseenter', () => setItems(true));
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        setItems(false);
      });
    });
  }

  /* ── Gallery float-in ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          galleryObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });
    galleryItems.forEach(item => galleryObserver.observe(item));
  }

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.stat__number[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1800;
          const start = performance.now();
          const isDecimal = String(target).includes('.');

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;
            el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ── Portfolio filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioSections = document.querySelectorAll('.portfolio-section');
  if (filterBtns.length && portfolioSections.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioSections.forEach(section => {
          if (filter === 'all' || section.dataset.category === filter) {
            section.classList.remove('hidden');
          } else {
            section.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── Active nav link ── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Simple active detection
    if (
      (currentPath === '/' || currentPath === '/index.html') && (href === '/' || href === '../' || href === './')
    ) {
      link.classList.add('active');
    } else if (href !== '/' && href !== '../' && href !== './' && currentPath.includes(href.replace('../', ''))) {
      link.classList.add('active');
    }
  });

  /* ── Featured project tile — update this one object to change the project shown ── */
  const FEATURED_PROJECT = {
    title:  'XP-Days Esports Platform',
    tag:    'Web Design',
    img:    'images/portfolio/xp-days/kidashi-design-xp-days-website-mockup.jpg',
    link:   'portfolio/xp-days/'
  };

  (function injectFeaturedProject() {
    const depth = (window.location.pathname.replace(/\/$/, '').match(/\//g) || []).length - 1;
    const prefix = depth <= 0 ? '' : depth === 1 ? '../' : '../../';
    document.querySelectorAll('.cta-footer__project').forEach(el => {
      el.href = prefix + FEATURED_PROJECT.link;
      el.innerHTML =
        `<img src="${prefix + FEATURED_PROJECT.img}" alt="${FEATURED_PROJECT.title}" loading="lazy" decoding="async">` +
        `<div class="cta-footer__project-info">` +
          `<span class="cta-footer__project-tag">${FEATURED_PROJECT.tag}</span>` +
          `<span class="cta-footer__project-title">${FEATURED_PROJECT.title}</span>` +
        `</div>`;
    });
  })();

  /* ── CTA Footer — auto-fit headline + scroll reveal + parallax ── */
  const ctaFooter = document.getElementById('ctaFooter');
  const ctaHeadline = document.getElementById('ctaHeadline');
  if (ctaFooter && ctaHeadline) {
    function fitCtaHeadline() {
      const container = ctaHeadline.parentElement;
      ctaHeadline.style.fontSize = '10vw';
      requestAnimationFrame(() => {
        const ratio = container.clientWidth / ctaHeadline.scrollWidth;
        ctaHeadline.style.fontSize = (10 * ratio * 0.995) + 'vw';
      });
    }
    fitCtaHeadline();
    window.addEventListener('resize', fitCtaHeadline);

    /* Scroll reveal via IntersectionObserver */
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) ctaFooter.classList.add('in-view');
    }, { threshold: 0.12 }).observe(ctaFooter);

    /* Parallax: headline drifts up slightly as you scroll through the section */
    window.addEventListener('scroll', () => {
      const rect = ctaFooter.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * -80;
      if (ctaFooter.classList.contains('in-view')) {
        ctaHeadline.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

  /* ── Container Scroll — 3D process reveal (services page) ── */
  const csOuter = document.getElementById('csOuter');
  if (csOuter) {
    const csCard   = document.getElementById('csCard');
    const csHeader = document.getElementById('csHeader');
    const csSteps  = Array.from(document.querySelectorAll('.cs-step'));
    const prefRM   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefRM) {
      csSteps.forEach(s => { s.style.opacity = '1'; s.style.transform = 'none'; });
    } else {
      /* Scroll-driven animation — all devices */
      if (csCard) csCard.style.transform = 'rotateX(20deg) scale(1.05)';

      function csProgress() {
        const rect  = csOuter.getBoundingClientRect();
        const extra = csOuter.offsetHeight - window.innerHeight;
        return Math.max(0, Math.min(1, -rect.top / Math.max(extra, 1)));
      }

      function csUpdate() {
        const p = csProgress();
        const n = csSteps.length;
        /* Card: 20° → 0° rotateX, 1.05 → 1 scale */
        if (csCard) csCard.style.transform = `rotateX(${20 * (1 - p)}deg) scale(${1.05 - 0.05 * p})`;
        /* Header: slides up as scroll progresses */
        if (csHeader) csHeader.style.transform = `translateY(${-60 * p}px)`;
        /* Steps: one visible at a time */
        const fadeW = 0.04;
        csSteps.forEach(function(step, i) {
          const segStart = i / n;
          const segEnd   = (i + 1) / n;
          let op = 0;
          if (i === 0 && p <= segStart) {
            op = 1; /* first step visible before animation begins */
          } else if (p >= segStart && p <= segEnd) {
            if (p < segStart + fadeW && i > 0) {
              op = (p - segStart) / fadeW; /* fade in */
            } else if (p > segEnd - fadeW && i < n - 1) {
              op = (segEnd - p) / fadeW; /* fade out */
            } else {
              op = 1;
            }
          }
          step.style.opacity = Math.max(0, Math.min(1, op));
          step.style.transform = 'none';
        });
      }

      let csRaf = null;
      window.addEventListener('scroll', function() {
        if (!csRaf) csRaf = requestAnimationFrame(function() { csUpdate(); csRaf = null; });
      }, { passive: true });
      csUpdate();
    }
  }

  /* ── DisplayCards — sequential reveal on all devices ── */
  const dcWrap = document.querySelector('.dc-wrap');
  if (dcWrap) {
    const dcCard3 = dcWrap.querySelector('.dc-card--3');
    const dcCard2 = dcWrap.querySelector('.dc-card--2');
    const dcCard1 = dcWrap.querySelector('.dc-card--1');
    const dcObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        dcObs.disconnect();
        if (dcCard3) dcCard3.classList.add('dc-in');
        if (dcCard2) setTimeout(function() { dcCard2.classList.add('dc-in'); }, 480);
        if (dcCard1) setTimeout(function() { dcCard1.classList.add('dc-in'); }, 960);
      }
    }, { threshold: 0.2 });
    dcObs.observe(dcWrap);
  }

  /* ── Nav: switch to dark text when scrolling over light sections ── */
  /* Skipped on project detail pages (.proj-hero present) — nav stays white there */
  const navEl = document.querySelector('.nav');
  if (navEl && !document.querySelector('.proj-hero')) {
    const navH = navEl.offsetHeight;
    const lightSections = document.querySelectorAll('.about3d, .about-teaser, .portfolio-teaser, .services-section, section:not(.hero2):not(.services-dark):not(.gallery-teaser):not(.cta-footer):not(.footer)');
    function updateNavColor() {
      if (!navEl.classList.contains('scrolled')) {
        let overLight = false;
        lightSections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          if (r.top <= navH && r.bottom >= 0) overLight = true;
        });
        navEl.classList.toggle('over-light', overLight);
      } else {
        navEl.classList.remove('over-light');
      }
    }
    window.addEventListener('scroll', updateNavColor, { passive: true });
    updateNavColor();
  }

  /* ── H3 parallax on scroll ── */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const h3s = Array.from(document.querySelectorAll('h3')).filter(function(el) {
      return !el.closest('.footer') && !el.closest('.cs-section');
    });
    if (!h3s.length) return;
    h3s.forEach(function(h3) { h3.style.willChange = 'transform'; });
    let h3Raf = false;
    function updateH3() {
      const vh = window.innerHeight;
      h3s.forEach(function(h3) {
        const rect = h3.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        if (h3.classList.contains('reveal') && !h3.classList.contains('visible')) return;
        const center = (rect.top + rect.height / 2) / vh;
        const offset = ((center - 0.5) * -28).toFixed(2);
        h3.style.transform = 'translateY(' + offset + 'px)';
      });
      h3Raf = false;
    }
    window.addEventListener('scroll', function() {
      if (!h3Raf) { h3Raf = true; requestAnimationFrame(updateH3); }
    }, { passive: true });
    updateH3();
  })();

  /* ── Auto-init gooey text on [data-gooey-texts] elements ── */
  document.querySelectorAll('[data-gooey-texts]').forEach(function (el) {
    try {
      const texts      = JSON.parse(el.dataset.gooeyTexts);
      const morphTime  = parseFloat(el.dataset.gooeyMorph)    || 1;
      const cooldown   = parseFloat(el.dataset.gooeyCooldown) || 2.5;
      initGooeyText(el, texts, morphTime, cooldown);
    } catch (e) {}
  });

  /* ── Hero Scramble Animation ── */
  (function() {
    const el = document.getElementById('heroCycle');
    if (!el || !el.dataset.scrambleWords) return;

    let words;
    try { words = JSON.parse(el.dataset.scrambleWords); } catch(e) { return; }
    if (!words.length) return;

    const CHAR_POOL    = '0123456789!@#$%^&*<>{}|\\/~+-=_';
    const SCRAMBLE_MS  = 700;
    const REVEAL_MS    = 700;
    const HOLD_MS      = 2000;
    const LOOP_PAUSE   = 2500;

    function randChar() {
      return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
    }

    function scrambleWord(word, onDone) {
      const len     = word.length;
      const start   = performance.now();
      let rafId;

      /* Phase 1: full scramble */
      function phase1(now) {
        const elapsed = now - start;
        if (elapsed >= SCRAMBLE_MS) {
          phase2(now);
          return;
        }
        let s = '';
        for (let i = 0; i < len; i++) {
          s += word[i] === ' ' ? ' ' : randChar();
        }
        el.textContent = s;
        rafId = requestAnimationFrame(phase1);
      }

      /* Phase 2: reveal left-to-right */
      function phase2(p2Start) {
        function frame(now) {
          const t        = Math.min(1, (now - p2Start) / REVEAL_MS);
          const revealed = Math.floor(t * len);
          let s = '';
          for (let i = 0; i < len; i++) {
            if (i < revealed) {
              s += word[i] === ' ' ? ' ' : word[i];
            } else {
              s += word[i] === ' ' ? ' ' : randChar();
            }
          }
          el.textContent = s;
          if (t < 1) {
            rafId = requestAnimationFrame(frame);
          } else {
            el.textContent = word;
            el.classList.remove('scrambling');
            onDone();
          }
        }
        rafId = requestAnimationFrame(frame);
      }

      el.classList.add('scrambling');

      rafId = requestAnimationFrame(phase1);
      return function() { cancelAnimationFrame(rafId); };
    }

    function resetStyle() {
      el.classList.remove('scrambling');
    }

    let wordIdx = 0;
    let cancelCurrent = null;

    function runNext() {
      if (cancelCurrent) { cancelCurrent(); cancelCurrent = null; }
      const word = words[wordIdx % words.length];
      wordIdx++;
      cancelCurrent = scrambleWord(word, function() {
        resetStyle();
        setTimeout(function() {
          setTimeout(runNext, LOOP_PAUSE);
        }, HOLD_MS);
      });
    }

    runNext();
  })();

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

  /* ── Footer newsletter form ── */
  window.footerFormSubmit = function(e, form) {
    e.preventDefault();
    var input  = form.querySelector('.footer__input');
    var thanks = form.querySelector('.footer__form-thanks');
    if (!input || !input.value) return;
    thanks.textContent = 'Thanks — you\'re in!';
    input.value = '';
    setTimeout(function() { thanks.textContent = ''; }, 4000);
  };

  /* ── Footer newsletter GDPR micro-notice (injected, applies to all pages) ── */
  const footerForm = document.querySelector('.footer__form');
  if (footerForm) {
    const privacyLink = document.querySelector('a[href*="datenschutz"]');
    const privacyHref = privacyLink ? privacyLink.href : '/datenschutz/';
    const gdprNote = document.createElement('p');
    gdprNote.className = 'footer__gdpr';
    gdprNote.innerHTML = `No tracking. Your email is used for project updates only. <a href="${privacyHref}">Privacy Policy</a>`;
    footerForm.appendChild(gdprNote);
  }

  /* ── Cookie / Privacy Notice Banner ── */
  (function () {
    if (localStorage.getItem('kidashi_consent')) return;

    const privacyLink = document.querySelector('a[href*="datenschutz"]');
    const privacyHref = privacyLink ? privacyLink.href : '/datenschutz/';

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Privacy notice');
    banner.innerHTML =
      `<p class="cookie-banner__text">This site sets no tracking cookies. Our hosting provider stores standard server logs (IP address, timestamp) for security purposes. <a href="${privacyHref}">Privacy Policy</a></p>` +
      `<div class="cookie-banner__actions"><button class="cookie-banner__btn" id="cookieAccept">Got it</button></div>`;

    document.body.appendChild(banner);
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('cookie-banner--visible')));

    document.getElementById('cookieAccept').addEventListener('click', function () {
      localStorage.setItem('kidashi_consent', '1');
      banner.classList.remove('cookie-banner--visible');
      setTimeout(function () { banner.remove(); }, 500);
    });
  })();

});
