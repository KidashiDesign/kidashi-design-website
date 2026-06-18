/* ============================================================
   KIDASHI DESIGN — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom cursor (desktop only) ── */
  const cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const SHAPE_SVGS = [
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke-width="2" stroke="currentColor"/><line x1="12" y1="21" x2="12" y2="23" stroke-width="2" stroke="currentColor"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="2" stroke="currentColor"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="2" stroke="currentColor"/><line x1="1" y1="12" x2="3" y2="12" stroke-width="2" stroke="currentColor"/><line x1="21" y1="12" x2="23" y2="12" stroke-width="2" stroke="currentColor"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="2" stroke="currentColor"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="2" stroke="currentColor"/></svg>`,
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,12 12,22 2,12"/></svg>`,
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
    ];

    cursor.innerHTML = `<span class="cursor__dot"></span><span class="cursor__icon">${SHAPE_SVGS[0]}</span>`;
    const cursorIcon = cursor.querySelector('.cursor__icon');

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let hoverInterval = null, shapeIdx = 0;

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    (function loop() {
      curX += (mouseX - curX) * 0.14;
      curY += (mouseY - curY) * 0.14;
      cursor.style.transform = `translate(${curX - cursor.offsetWidth / 2}px, ${curY - cursor.offsetHeight / 2}px)`;
      requestAnimationFrame(loop);
    })();

    function startHover() {
      cursor.classList.add('is-hovering');
      cursorIcon.innerHTML = SHAPE_SVGS[shapeIdx];
      hoverInterval = setInterval(() => {
        shapeIdx = (shapeIdx + 1) % SHAPE_SVGS.length;
        cursorIcon.innerHTML = SHAPE_SVGS[shapeIdx];
      }, 800);
    }
    function stopHover() {
      cursor.classList.remove('is-hovering');
      clearInterval(hoverInterval);
      hoverInterval = null;
    }

    /* Attach to all interactive elements */
    const hoverTargets = 'a, button, .gallery-item, .portfolio-item, .portfolio-card, .service-card, .filter-btn, [role="button"]';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', startHover);
      el.addEventListener('mouseleave', stopHover);
    });
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
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      if (open) {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    // Close on link click
    mobileNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

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

});
