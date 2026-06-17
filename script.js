/* =====================================================
   KIDASHI DESIGN — JavaScript
   ===================================================== */

let currentLang = 'de';

const t = {
  de: {
    'nav-about':'Über mich','nav-services':'Leistungen','nav-portfolio':'Portfolio','nav-gallery':'Galerie','nav-contact':'Kontakt',
    'hero-label':'UI/UX & Webdesign Freelancerin','hero-title-1':'Design,','hero-title-2':'das bewegt.',
    'hero-sub':'Ich gestalte digitale Erlebnisse, die begeistern — von der ersten Idee bis zum fertigen Produkt.',
    'hero-cta-1':'Projekte ansehen','hero-cta-2':'Kontakt aufnehmen','scroll-text':'Scrollen',
    'about-label':'Über mich','about-title-1':'Hinter dem','about-title-2':'Design',
    'about-name':'Nicole Szatkowski','about-role':'UI/UX & Webdesign Freelancerin',
    'about-bio':'Hallo, ich bin Nicole — Designerin mit einem Auge für Details und einem Herz für nutzerzentriertes Design. Mit Kidashi Design bringe ich Kreativität und Funktionalität zusammen, um digitale Produkte zu schaffen, die Menschen wirklich bewegen.',
    'stat-1-num':'5+','stat-1-label':'Jahre Erfahrung','stat-2-num':'50+','stat-2-label':'Projekte abgeschlossen','stat-3-num':'20+','stat-3-label':'Zufriedene Kunden',
    'tools-label':'Tools & Technologien',
    'services-label':'Leistungen','services-title-1':'Was ich','services-title-2':'anbiete',
    'svc-1-title':'UI/UX Design','svc-1-desc':'Nutzerfreundliche Interfaces und durchdachte User Journeys — von Wireframes bis zum finalen Prototyp.',
    'svc-2-title':'Webdesign','svc-2-desc':'Moderne, responsive Websites, die auf allen Geräten brillieren und Besucher begeistern.',
    'svc-3-title':'Branding & Identity','svc-3-desc':'Visuelle Identitäten, die Marken unverwechselbar machen — Logos, Farbwelten, Designsysteme.',
    'svc-4-title':'Prototyping','svc-4-desc':'Interaktive Prototypen zum Testen und Validieren von Ideen, bevor sie in die Entwicklung gehen.',
    'portfolio-label':'Portfolio','portfolio-title-1':'Ausgewählte','portfolio-title-2':'Projekte',
    'filter-all':'Alle','filter-uiux':'UI/UX','filter-web':'Webdesign','filter-brand':'Branding',
    'proj-1-tag':'UI/UX Design','proj-1-title':'Finance Dashboard','proj-1-link':'Ansehen',
    'proj-2-tag':'Webdesign','proj-2-title':'Studio Portfolio','proj-2-link':'Ansehen',
    'proj-3-tag':'Branding','proj-3-title':'Brand Identity','proj-3-link':'Ansehen',
    'proj-4-tag':'UI/UX Design','proj-4-title':'Mobile Banking App','proj-4-link':'Ansehen',
    'proj-5-tag':'Webdesign','proj-5-title':'E-Commerce Platform','proj-5-link':'Ansehen',
    'proj-6-tag':'Branding','proj-6-title':'Startup Identity','proj-6-link':'Ansehen',
    'gallery-label':'Galerie','gallery-title-1':'Einblicke in','gallery-title-2':'meine Arbeit',
    'gi-1':'Sketches & Wireframes','gi-2':'Interface Details','gi-3':'Typografie-Experimente',
    'gi-4':'Motion & Microinteractions','gi-5':'Color Explorations','gi-6':'Final Deliverables',
    'contact-label':'Kontakt','contact-title-1':'Lass uns','contact-title-2':'reden',
    'contact-heading':'Hast du ein Projekt?',
    'contact-sub':'Du hast ein Projekt? Eine Idee? Lass uns gemeinsam etwas Besonderes schaffen.',
    'contact-email':'E-Mail','contact-loc':'Standort','contact-loc-val':'Deutschland',
    'contact-avail':'Verfügbarkeit','contact-avail-val':'Für neue Projekte offen',
    'label-name':'Dein Name','label-email':'E-Mail Adresse','label-project':'Dein Projekt','label-msg':'Nachricht',
    'btn-send':'Nachricht senden →',
    'footer-copy':'© 2026 Kidashi Design · Nicole Szatkowski','footer-imprint':'Impressum','footer-privacy':'Datenschutz',
  },
  en: {
    'nav-about':'About','nav-services':'Services','nav-portfolio':'Portfolio','nav-gallery':'Gallery','nav-contact':'Contact',
    'hero-label':'UI/UX & Web Design Freelancer','hero-title-1':'Design','hero-title-2':'that moves.',
    'hero-sub':'I craft digital experiences that inspire — from the first idea to the finished product.',
    'hero-cta-1':'View projects','hero-cta-2':'Get in touch','scroll-text':'Scroll',
    'about-label':'About me','about-title-1':'The mind','about-title-2':'behind',
    'about-name':'Nicole Szatkowski','about-role':'UI/UX & Web Design Freelancer',
    'about-bio':"Hi, I'm Nicole — a designer with an eye for detail and a passion for user-centered design. With Kidashi Design, I bring creativity and functionality together to create digital products that truly move people.",
    'stat-1-num':'5+','stat-1-label':'Years of experience','stat-2-num':'50+','stat-2-label':'Projects completed','stat-3-num':'20+','stat-3-label':'Happy clients',
    'tools-label':'Tools & Technologies',
    'services-label':'Services','services-title-1':'What I','services-title-2':'offer',
    'svc-1-title':'UI/UX Design','svc-1-desc':'User-friendly interfaces and thoughtful user journeys — from wireframes to final prototype.',
    'svc-2-title':'Web Design','svc-2-desc':'Modern, responsive websites that shine on all devices and delight visitors.',
    'svc-3-title':'Branding & Identity','svc-3-desc':'Visual identities that make brands unmistakable — logos, color worlds, design systems.',
    'svc-4-title':'Prototyping','svc-4-desc':'Interactive prototypes for testing and validating ideas before development begins.',
    'portfolio-label':'Portfolio','portfolio-title-1':'Selected','portfolio-title-2':'Projects',
    'filter-all':'All','filter-uiux':'UI/UX','filter-web':'Web Design','filter-brand':'Branding',
    'proj-1-tag':'UI/UX Design','proj-1-title':'Finance Dashboard','proj-1-link':'View',
    'proj-2-tag':'Web Design','proj-2-title':'Studio Portfolio','proj-2-link':'View',
    'proj-3-tag':'Branding','proj-3-title':'Brand Identity','proj-3-link':'View',
    'proj-4-tag':'UI/UX Design','proj-4-title':'Mobile Banking App','proj-4-link':'View',
    'proj-5-tag':'Web Design','proj-5-title':'E-Commerce Platform','proj-5-link':'View',
    'proj-6-tag':'Branding','proj-6-title':'Startup Identity','proj-6-link':'View',
    'gallery-label':'Gallery','gallery-title-1':'Glimpses of','gallery-title-2':'my work',
    'gi-1':'Sketches & Wireframes','gi-2':'Interface Details','gi-3':'Typography Experiments',
    'gi-4':'Motion & Microinteractions','gi-5':'Color Explorations','gi-6':'Final Deliverables',
    'contact-label':'Contact','contact-title-1':"Let's",'contact-title-2':'talk',
    'contact-heading':'Got a project?',
    'contact-sub':"Got a project? An idea? Let's create something extraordinary together.",
    'contact-email':'Email','contact-loc':'Location','contact-loc-val':'Germany',
    'contact-avail':'Availability','contact-avail-val':'Open for new projects',
    'label-name':'Your name','label-email':'Email address','label-project':'Your project','label-msg':'Message',
    'btn-send':'Send message →',
    'footer-copy':'© 2026 Kidashi Design · Nicole Szatkowski','footer-imprint':'Imprint','footer-privacy':'Privacy Policy',
  }
};

function applyLanguage(lang) {
  currentLang = lang;
  const tr = t[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (tr[key] !== undefined) el.textContent = tr[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
  localStorage.setItem('kidashi-lang', lang);
}

/* ---- Navigation ---- */
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ---- Mobile menu ---- */
const hamburger = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
function toggleMobile() {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}

/* ---- Scroll reveal ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

/* ---- Portfolio filter ---- */
function initFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = f === 'all' || card.dataset.category === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---- Gallery drag ---- */
function initGallery() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;
  let down = false, startX, left;
  track.addEventListener('mousedown', e => { down = true; startX = e.pageX - track.offsetLeft; left = track.scrollLeft; });
  track.addEventListener('mouseleave', () => { down = false; });
  track.addEventListener('mouseup',    () => { down = false; });
  track.addEventListener('mousemove',  e => { if (!down) return; e.preventDefault(); track.scrollLeft = left - (e.pageX - track.offsetLeft - startX) * 1.5; });
}

/* ---- Form ---- */
function initForm() {
  const form = document.querySelector('.contact-form-el');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = currentLang === 'de' ? 'Gesendet! ✓' : 'Sent! ✓';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3000);
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(localStorage.getItem('kidashi-lang') || 'de');

  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => applyLanguage(btn.dataset.lang)));
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  hamburger?.addEventListener('click', toggleMobile);
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', toggleMobile));

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  initFilter();
  initGallery();
  initForm();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});
