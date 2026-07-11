(function(){
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');

  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Cookie consent
  var banner = document.getElementById('cookieBanner');
  var consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    setTimeout(function(){ banner.classList.add('show'); }, 600);
  }
  document.getElementById('cookieAccept').addEventListener('click', function(){
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('show');
  });
  document.getElementById('cookieDecline').addEventListener('click', function(){
    localStorage.setItem('cookieConsent', 'declined');
    banner.classList.remove('show');
  });

  // Reservation form (placeholder — wire up to real backend/email service before launch)
  var form = document.getElementById('reserveForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    status.textContent = 'Danke! Wir melden uns innerhalb von 24 Stunden zur Bestätigung.';
    form.reset();
  });

  // Newsletter form (placeholder — wire up to real backend/email service before launch)
  var nl = document.getElementById('newsletterForm');
  nl.addEventListener('submit', function(e){
    e.preventDefault();
    nl.querySelector('input').value = '';
    nl.insertAdjacentHTML('beforeend', '<p style="width:100%;margin-top:.75rem;font-size:.85rem;">Danke fürs Anmelden! 🎉</p>');
  });
})();
