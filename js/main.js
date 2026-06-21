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

    /* Pointer tracking */
    window.addEventListener('pointermove', e => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) { seen = true; cursor.style.opacity = '1'; }
      /* Auto-detect dark/light bg under cursor */
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const lum = getBgLuminance(el);
        cursor.style.color = lum < 0.35 ? '#F7F3EE' : '#0A0A0B';
      }
      /* Hover detection */
      const hovered = !!(el && el.closest && el.closest('a, button, .gallery-item, .portfolio-item, .portfolio-card, .service-card, .filter-btn, [role="button"], [data-cursor="hover"]'));
      setHover(hovered);
    }, { passive: true });

    /* rAF lerp loop */
    (function loop() {
      pos.x += (target.x - pos.x) * SMOOTHING;
      pos.y += (target.y - pos.y) * SMOOTHING;
      cursor.style.transform = `translate3d(${pos.x.toFixed(2)}px,${pos.y.toFixed(2)}px,0) translate(-50%,-50%)`;
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

  /* ── Hero 2 — cycling word + reactive gradient + magnifier ── */
  const hero2 = document.getElementById('hero2');
  if (hero2) {
    const heroCycleEl = document.getElementById('heroCycle');
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%&*?§$+=/~^<>';
    const SYMS  = '!@#%&*§$+=~^<>|/\\[]{}±≠°';
    const rand  = () => CHARS[Math.floor(Math.random() * CHARS.length)];
    const rsym  = () => SYMS[Math.floor(Math.random() * SYMS.length)];

    /* ── Cycling word ── */
    const REAL_WORDS = ['YOU', 'THE PLANET', 'THE COMMUNITY', 'YOUR COMPANY', 'THE ALGORYTHM'];
    let wordIdx = 0, realCount = 0;
    let onWordReady = null;

    function randSymWord() {
      const len = Math.floor(Math.random() * 6) + 4;
      return Array.from({ length: len }, rsym).join('');
    }

    function nextWord() {
      /* 1 symbol word after every 3 real words */
      if (realCount > 0 && realCount % 3 === 0) {
        realCount = 0;
        return randSymWord();
      }
      realCount++;
      return REAL_WORDS[wordIdx++ % REAL_WORDS.length];
    }

    function scrambleTo(word, onDone) {
      if (!heroCycleEl) { if (onDone) onDone(); return; }
      heroCycleEl.innerHTML = word.split('').map(ch =>
        ch === ' ' ? ' ' : `<span class="cy-ch" data-c="${ch}">${rand()}</span>`
      ).join('');
      const spans = Array.from(heroCycleEl.querySelectorAll('.cy-ch'));
      let raf = null;
      (function sc() { spans.forEach(s => { s.textContent = rand(); }); raf = requestAnimationFrame(sc); })();
      /* Short scramble, then flash all chars at once */
      setTimeout(() => {
        cancelAnimationFrame(raf);
        heroCycleEl.style.transition = 'opacity 0.1s ease';
        heroCycleEl.style.opacity = '0.3';
        setTimeout(() => {
          spans.forEach(s => { s.textContent = s.dataset.c; });
          heroCycleEl.style.opacity = '1';
          setTimeout(() => { heroCycleEl.style.transition = ''; if (onDone) onDone(); }, 110);
        }, 70);
      }, 320);
    }

    function cycle() {
      scrambleTo(nextWord(), () => {
        if (onWordReady) onWordReady();
        setTimeout(cycle, 2500);
      });
    }

    /* Start first word immediately */
    scrambleTo(REAL_WORDS[wordIdx++ % REAL_WORDS.length], () => {
      if (onWordReady) onWordReady();
      setTimeout(cycle, 2500);
    });

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
  const mobileMonth = document.getElementById('mobileMonth');
  const mobileDay   = document.getElementById('mobileDay');
  const mobileTime  = document.getElementById('mobileTime');
  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function updateClock() {
    const now = new Date(Date.now() + 4 * 3600000);
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    if (navTime)     navTime.textContent     = `${hh}:${mm}`;
    if (mobileTime)  mobileTime.textContent  = `${hh}:${mm}:${ss}`;
    if (mobileMonth) mobileMonth.textContent = MONTHS[now.getUTCMonth()];
    if (mobileDay)   mobileDay.textContent   = DAYS[now.getUTCDay()];
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

  /* ── H2 Scramble-Reveal ── */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#%&*?§$+=/~^<>';
  const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  document.querySelectorAll('h2.reveal').forEach(h2 => {
    const original = h2.textContent;
    let scrambleRaf = null;
    let revealed = false;

    /* Wrap each character in a span for per-char reveal */
    h2.innerHTML = original.split('').map((ch, i) =>
      ch === ' ' ? ' ' : `<span data-char="${ch}" style="opacity:0">${rand()}</span>`
    ).join('');
    const spans = Array.from(h2.querySelectorAll('span[data-char]'));

    function scramble() {
      spans.forEach(s => { if (!s.dataset.done) s.textContent = rand(); });
      scrambleRaf = requestAnimationFrame(scramble);
    }

    function reveal() {
      if (revealed) return;
      revealed = true;
      cancelAnimationFrame(scrambleRaf);

      /* Fade spans to visible first, then decode left→right */
      spans.forEach(s => { s.style.transition = 'opacity 0.25s'; s.style.opacity = '1'; });

      let i = 0;
      const step = () => {
        if (i >= spans.length) return;
        const s = spans[i];
        let flips = 0;
        const flip = setInterval(() => {
          s.textContent = flips < 6 ? rand() : s.dataset.char;
          flips++;
          if (flips > 7) { clearInterval(flip); s.dataset.done = '1'; step(); }
        }, 62);
        i++;
        if (i % 2 !== 0) step(); /* reveal 2 chars at once */
      };
      /* slight stagger before starting */
      setTimeout(step, 200);
    }

    /* Two observers: low threshold starts scramble, high threshold triggers reveal */
    const startObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !revealed) { scramble(); startObs.unobserve(h2); }
      });
    }, { threshold: 0.05 });

    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { reveal(); revealObs.unobserve(h2); }
      });
    }, { threshold: 0.55 });

    startObs.observe(h2);
    revealObs.observe(h2);
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

  /* ── Nav: switch to dark text when scrolling over light sections ── */
  /* Skipped on project detail pages (.proj-hero present) — nav stays white there */
  const navEl = document.querySelector('.nav');
  if (navEl && !document.querySelector('.proj-hero')) {
    const navH = navEl.offsetHeight;
    const lightSections = document.querySelectorAll('.about-teaser, .portfolio-teaser, .services-section, section:not(.hero2):not(.services-dark):not(.gallery-teaser):not(.cta-footer):not(.footer)');
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

});
