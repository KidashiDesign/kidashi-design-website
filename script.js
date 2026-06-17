/* =====================================================
   KIDASHI DESIGN — Earth Edition JS
   Parallax · Horizontal Scroll · Reveal · i18n
   ===================================================== */

/* ---- i18n ---- */
let lang = localStorage.getItem('kidashi-lang') || 'en';

const T = {
  en: {
    'nav-about':    'About',
    'nav-services': 'Services',
    'nav-portfolio':'Portfolio',
    'nav-gallery':  'Gallery',
    'nav-contact':  'Contact',
    'hero-eye':     'Freelance Graphic Designer — Working Worldwide',
    'hero-line1':   'Websites',
    'hero-line2':   'That Actually',
    'hero-line3':   'Work.',
    'hero-sub':     "I'm Nicole — a certified graphic designer with 5+ years of experience, helping small businesses and brands launch fast, modern websites that stay true to their voice.",
    'hero-cta1':    'See My Work',
    'hero-cta2':    'Start Your Project',
    'scroll-label': 'Scroll',
    'about-eye':    'About Nicole',
    'about-title':  'Hi, I\'m Nicole — the Person Behind Every Project.',
    'about-text':   "I'm a certified graphic designer (Mediengestalterin, Digital & Print) with over 5 years of experience in web design, branding, and visual communication. Currently working as a digital nomad based in Tbilisi, Georgia, I bring the same hands-on, personal approach to every client, wherever they are in the world. From the first sketch to the final launch, you're working directly with me — your single point of contact throughout.",
    'fact1-num':    '5+',
    'fact1-lbl':    'Years of Experience',
    'fact2-num':    'IHK',
    'fact2-lbl':    'Certified Media Designer',
    'fact3-num':    '1:1',
    'fact3-lbl':    'Worldwide, One Direct Contact',
    'about-cta':    'Get to Know Me →',
    'svc-eye':      'What I Offer',
    'svc-title1':   'Web Design at the Core —',
    'svc-title2':   'With Everything Else You Need.',
    'svc-sub':      'Web design is where I focus most — but many clients also work with me on branding, print, or social media, all handled personally.',
    'svc-1-title':  'Web Design',
    'svc-1-desc':   'Custom website design & development, mobile-responsive layouts, SEO-friendly structure.',
    'svc-2-title':  'Brand Identity',
    'svc-2-desc':   'Logo design, color palette & typography system, brand guidelines.',
    'svc-3-title':  'Print',
    'svc-3-desc':   'Business cards, flyers, brochures, packaging, editorial layouts.',
    'svc-4-title':  'Social Media',
    'svc-4-desc':   'Content calendars, post templates, profile & cover design.',
    'svc-link':     'Learn More',
    'port-eye':     'Portfolio',
    'port-title':   'Selected Work',
    'port-sub':     'From esports platforms to private jet charters — a range of projects across web, brand, and print.',
    'port-link':    'View All Projects',
    'gall-eye':     'Beyond Design',
    'gall-title':   'Mixed Media Art,\nShaped by Travel.',
    'gall-sub':     'Alongside my design work, I create mixed media art collages — process-driven pieces shaped by the places I\'ve lived and traveled through.',
    'gall-link':    'View Full Gallery →',
    'cta-title':    'Let\'s Start Something Great Together.',
    'cta-sub':      'Got a project in mind? I personally read and respond to every message, usually within 1–2 business days.',
    'cta-btn':      'Get in Touch',
    'contact-eye':  'Get in Touch',
    'contact-title':'Let\'s Start Something\nGreat Together.',
    'contact-sub':  'Fill out the form or reach out directly — I personally read and respond to every message.',
    'c-email':      'Email',
    'c-email-v':    'nicole@kidashidesign.com',
    'c-loc':        'Location',
    'c-loc-v':      'Tbilisi, Georgia (Worldwide)',
    'c-avail':      'Availability',
    'c-avail-v':    'Open for New Projects',
    'l-name':       'Your Name',
    'l-email':      'Email Address',
    'l-type':       'Project Type',
    'l-msg':        'Message',
    'ph-name':      'Jane Doe',
    'ph-email':     'jane@example.com',
    'ph-msg':       'Tell me about your project...',
    'opt-web':      'Web Design',
    'opt-brand':    'Brand Identity',
    'opt-print':    'Print',
    'opt-social':   'Social Media Management',
    'opt-other':    'Other',
    'btn-send':     'Send Message',
    'footer-copy':  '© 2026 Kidashi Design · Nicole Szatkowski',
    'footer-imp':   'Imprint',
    'footer-priv':  'Privacy',
  },
  de: {
    'nav-about':    'Über mich',
    'nav-services': 'Leistungen',
    'nav-portfolio':'Portfolio',
    'nav-gallery':  'Galerie',
    'nav-contact':  'Kontakt',
    'hero-eye':     'Freiberufliche Grafikdesignerin — Weltweit tätig',
    'hero-line1':   'Websites,',
    'hero-line2':   'die wirklich',
    'hero-line3':   'funktionieren.',
    'hero-sub':     'Ich bin Nicole — eine zertifizierte Grafikdesignerin mit über 5 Jahren Erfahrung. Ich helfe kleinen Unternehmen dabei, schnelle, moderne Websites zu launchen, die ihrer eigenen Stimme treu bleiben.',
    'hero-cta1':    'Meine Arbeiten',
    'hero-cta2':    'Projekt starten',
    'scroll-label': 'Scrollen',
    'about-eye':    'Über Nicole',
    'about-title':  'Hi, ich bin Nicole — die Person hinter jedem Projekt.',
    'about-text':   'Ich bin zertifizierte Mediengestalterin (Digital & Print) mit über 5 Jahren Erfahrung in Webdesign, Branding und visueller Kommunikation. Aktuell arbeite ich als digitale Nomadin von Tbilisi, Georgien aus — und bringe denselben persönlichen Ansatz in jedes Projekt, egal wo du dich befindest. Vom ersten Entwurf bis zum finalen Launch bist du direkt mit mir im Kontakt.',
    'fact1-num':    '5+',
    'fact1-lbl':    'Jahre Erfahrung',
    'fact2-num':    'IHK',
    'fact2-lbl':    'Zertifizierte Mediengestalterin',
    'fact3-num':    '1:1',
    'fact3-lbl':    'Weltweit, ein direkter Ansprechpartner',
    'about-cta':    'Lern mich kennen →',
    'svc-eye':      'Was ich anbiete',
    'svc-title1':   'Webdesign im Zentrum —',
    'svc-title2':   'Mit allem Drumherum, das du brauchst.',
    'svc-sub':      'Webdesign ist mein Schwerpunkt — viele Kund:innen arbeiten aber auch mit mir an Branding, Print oder Social Media, alles persönlich betreut.',
    'svc-1-title':  'Webdesign',
    'svc-1-desc':   'Individuelles Website-Design & Entwicklung, mobil-responsive Layouts, SEO-freundliche Struktur.',
    'svc-2-title':  'Brand Identity',
    'svc-2-desc':   'Logo-Design, Farbpalette & Typografie-System, Markenrichtlinien.',
    'svc-3-title':  'Print',
    'svc-3-desc':   'Visitenkarten, Flyer, Broschüren, Verpackungen, redaktionelle Layouts.',
    'svc-4-title':  'Social Media',
    'svc-4-desc':   'Redaktionspläne, Post-Vorlagen, Profil- & Titelbild-Gestaltung.',
    'svc-link':     'Mehr erfahren',
    'port-eye':     'Portfolio',
    'port-title':   'Ausgewählte Projekte',
    'port-sub':     'Von Esports-Plattformen bis hin zu Privatjet-Chartern — Projekte aus Webdesign, Branding und Print.',
    'port-link':    'Alle Projekte ansehen',
    'gall-eye':     'Jenseits vom Design',
    'gall-title':   'Mixed-Media-Kunst,\nprägt vom Reisen.',
    'gall-sub':     'Neben meiner Designarbeit entstehen Mixed-Media-Collagen — prozessorientierte Werke, geprägt von den Orten, an denen ich gelebt habe.',
    'gall-link':    'Zur Galerie →',
    'cta-title':    'Lass uns gemeinsam etwas Großartiges schaffen.',
    'cta-sub':      'Hast du ein Projekt im Kopf? Ich lese und beantworte jede Nachricht persönlich, meist innerhalb von 1–2 Werktagen.',
    'cta-btn':      'Kontakt aufnehmen',
    'contact-eye':  'Kontakt',
    'contact-title':'Lass uns gemeinsam\netwas Großartiges schaffen.',
    'contact-sub':  'Füll das Formular aus oder schreib mir direkt — ich lese und beantworte jede Nachricht persönlich.',
    'c-email':      'E-Mail',
    'c-email-v':    'nicole@kidashidesign.com',
    'c-loc':        'Standort',
    'c-loc-v':      'Tbilisi, Georgien (Weltweit)',
    'c-avail':      'Verfügbarkeit',
    'c-avail-v':    'Für neue Projekte offen',
    'l-name':       'Dein Name',
    'l-email':      'E-Mail Adresse',
    'l-type':       'Projektart',
    'l-msg':        'Nachricht',
    'ph-name':      'Max Mustermann',
    'ph-email':     'max@beispiel.de',
    'ph-msg':       'Erzähl mir von deinem Projekt...',
    'opt-web':      'Webdesign',
    'opt-brand':    'Brand Identity',
    'opt-print':    'Print',
    'opt-social':   'Social Media Management',
    'opt-other':    'Sonstiges',
    'btn-send':     'Nachricht senden',
    'footer-copy':  '© 2026 Kidashi Design · Nicole Szatkowski',
    'footer-imp':   'Impressum',
    'footer-priv':  'Datenschutz',
  }
};

function applyLang(l) {
  lang = l;
  const tr = T[l];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!tr[key]) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = tr[key];
    } else if (el.tagName === 'OPTION') {
      el.textContent = tr[key];
    } else {
      el.textContent = tr[key];
    }
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  document.documentElement.lang = l;
  localStorage.setItem('kidashi-lang', l);
  // update hero lines which use newline
  document.querySelectorAll('[data-i18n-nl]').forEach(el => {
    const key = el.getAttribute('data-i18n-nl');
    if (tr[key]) el.innerHTML = tr[key].replace(/\n/g, '<br>');
  });
}

/* ---- Nav ---- */
const navEl = document.querySelector('.nav');
const allSections = document.querySelectorAll('section[id]');

function onScroll() {
  const y = window.scrollY;
  navEl.classList.toggle('scrolled', y > 60);
  let cur = '';
  allSections.forEach(s => { if (y >= s.offsetTop - 150) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));

  // Parallax
  requestAnimationFrame(doParallax);
}

/* ---- Parallax ---- */
function doParallax() {
  const y = window.scrollY;
  // hero image
  const heroImg = document.querySelector('.hero-img-wrap');
  if (heroImg) heroImg.style.transform = `translateY(${y * 0.22}px)`;
}

/* ---- Mobile menu ---- */
const ham = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
function toggleMobile() {
  ham.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}

/* ---- Reveal on scroll ---- */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

/* ---- Hero title line animation ---- */
function initHeroTitle() {
  const lines = document.querySelectorAll('.hero-title-line');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), 300 + i * 150);
  });
}

/* ---- Gallery horizontal scroll (drag + nav) ---- */
function initGallery() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.style.userSelect = 'none';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  ['mouseleave','mouseup'].forEach(evt => track.addEventListener(evt, () => {
    isDown = false;
    track.style.userSelect = '';
  }));
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.3;
  });

  // Touch support
  let touchStartX = 0, touchScrollLeft = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = track.scrollLeft;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    const dx = e.touches[0].pageX - touchStartX;
    track.scrollLeft = touchScrollLeft - dx;
  }, { passive: true });

  // Nav buttons
  const cardWidth = 380 + 24;
  document.getElementById('gall-prev')?.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
  document.getElementById('gall-next')?.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  // Progress bar
  const fill = document.querySelector('.gallery-progress-fill');
  if (fill) {
    track.addEventListener('scroll', () => {
      const max = track.scrollWidth - track.clientWidth;
      fill.style.width = (track.scrollLeft / max * 100) + '%';
    }, { passive: true });
  }
}

/* ---- Counter animation ---- */
function animateCounters() {
  document.querySelectorAll('.about-fact-num[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let start = null;
    const duration = 1200;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (Number.isInteger(target) ? Math.floor(ease * target) : (ease * target).toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); counterObs.disconnect(); } });
}, { threshold: 0.5 });

/* ---- Form ---- */
function initForm() {
  const form = document.querySelector('.contact-form-el');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = lang === 'de' ? 'Gesendet ✓' : 'Sent ✓';
    btn.style.background = '#2C4A3A';
    setTimeout(() => { btn.textContent = T[lang]['btn-send']; btn.style.background = ''; form.reset(); }, 3500);
  });
}

/* ---- Smooth anchor scroll ---- */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      if (mobileNav?.classList.contains('open')) toggleMobile();
    });
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Language
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(lang);

  // Nav
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile
  ham?.addEventListener('click', toggleMobile);
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', toggleMobile));

  // Reveals
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  // Hero
  initHeroTitle();

  // Gallery
  initGallery();

  // Counters
  const factsEl = document.querySelector('.about-facts');
  if (factsEl) counterObs.observe(factsEl);

  // Form
  initForm();

  // Anchors
  initAnchors();
});
