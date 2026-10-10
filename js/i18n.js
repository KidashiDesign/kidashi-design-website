/*
 * Sprachlogik für kidashidesign.com
 *
 * 1) Seiten mit festen Sprach-URLs (englisch unter /…, deutsch unter /de/…):
 *    Erkennbar am <link rel="alternate" hreflang="de">. Hier wird kein Text
 *    getauscht. Der Umschalter ist ein normaler Link. Besucher mit deutscher
 *    Browsersprache (oder gespeicherter Wahl "de") werden auf einer
 *    englischen Seite einmalig auf die deutsche Fassung geleitet.
 *    Suchmaschinen-Crawler sehen beide Sprachen als eigene Seiten.
 *
 * 2) Alle übrigen Seiten (Impressum, Datenschutz, 404, …): wie bisher werden
 *    die Texte per data-de* im Browser getauscht.
 */
(function () {
  "use strict";

  var KEY = "kd-lang";
  var ATTRS = ["placeholder", "content", "alt", "aria-label", "title", "value", "data-label"];
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === "de" || v === "en") return v;
    } catch (e) {}
    return null;
  }

  function save(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function preferred() {
    var s = stored();
    if (s) return s;
    var nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    return nav.indexOf("de") === 0 ? "de" : "en";
  }

  var deTwin = document.querySelector('link[rel="alternate"][hreflang="de"]');

  /* ---------- 1) feste Sprach-URLs ---------- */
  if (deTwin) {
    var current = root.getAttribute("lang") === "de" ? "de" : "en";
    root.setAttribute("data-lang", current);

    // Wahl des Besuchers merken, bevor der Link geöffnet wird
    document.addEventListener("click", function (ev) {
      var link = ev.target.closest && ev.target.closest("[data-lang-btn]");
      if (link) save(link.getAttribute("data-lang-btn"));
    }, true);

    // Einmalige Weiterleitung englisch -> deutsch (nur Pfad, nie die Domain)
    if (current === "en" && preferred() === "de") {
      try {
        var target = new URL(deTwin.href, location.href).pathname;
        if (target && target !== location.pathname) {
          location.replace(target + location.search + location.hash);
        }
      } catch (e) {}
    }
    window.KD_I18N = {
      applyLang: function () {},
      getLang: function () { return current; }
    };
    return;
  }

  /* ---------- 2) Seiten ohne eigene Sprach-URLs ---------- */
  function applyLang(lang) {
    var de = lang === "de";
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);

    var i, el, nodes;
    nodes = document.querySelectorAll("[data-de]");
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
      el.textContent = de ? el.getAttribute("data-de") : el.getAttribute("data-en");
    }

    nodes = document.querySelectorAll("[data-de-html]");
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (!el.hasAttribute("data-en-html")) el.setAttribute("data-en-html", el.innerHTML);
      el.innerHTML = de ? el.getAttribute("data-de-html") : el.getAttribute("data-en-html");
    }

    nodes = document.querySelectorAll("[data-de-scramble-words]");
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (!el.hasAttribute("data-en-scramble-words")) {
        el.setAttribute("data-en-scramble-words", el.getAttribute("data-scramble-words") || "");
      }
      el.setAttribute("data-scramble-words",
        de ? el.getAttribute("data-de-scramble-words") : el.getAttribute("data-en-scramble-words"));
    }

    for (var a = 0; a < ATTRS.length; a++) {
      var attr = ATTRS[a], deAttr = "data-de-" + attr, enAttr = "data-en-" + attr;
      nodes = document.querySelectorAll("[" + deAttr + "]");
      for (i = 0; i < nodes.length; i++) {
        el = nodes[i];
        if (!el.hasAttribute(enAttr)) el.setAttribute(enAttr, el.getAttribute(attr) || "");
        el.setAttribute(attr, de ? el.getAttribute(deAttr) : el.getAttribute(enAttr));
      }
    }

    nodes = document.querySelectorAll("[data-lang-btn]");
    for (i = 0; i < nodes.length; i++) {
      var on = nodes[i].getAttribute("data-lang-btn") === lang;
      nodes[i].classList.toggle("active", on);
      nodes[i].setAttribute("aria-pressed", on ? "true" : "false");
    }

    save(lang);
    document.dispatchEvent(new CustomEvent("kd:langchange", { detail: { lang: lang } }));
  }

  function init() {
    applyLang(preferred());
    document.addEventListener("click", function (ev) {
      var btn = ev.target.closest && ev.target.closest("[data-lang-btn]");
      if (btn) applyLang(btn.getAttribute("data-lang-btn"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.KD_I18N = {
    applyLang: applyLang,
    getLang: function () { return root.getAttribute("data-lang") || preferred(); }
  };
})();
