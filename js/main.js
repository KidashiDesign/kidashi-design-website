/* ============================================================
   KIDASHI DESIGN — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

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
