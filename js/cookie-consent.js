!function () {
  "use strict";
  var STORAGE_KEY = "kd-cookie-consent";
  var GA_ID = "G-HVYN8BLVD1";

  function readConsent() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === "granted" || v === "denied" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function enableAnalytics() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag("consent", "update", {
      analytics_storage: "granted"
    });
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function banner() {
    return document.getElementById("kdCookieBanner");
  }

  function showBanner() {
    var el = banner();
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(function () { el.classList.add("cookie-banner--visible"); });
  }

  function hideBanner() {
    var el = banner();
    if (!el) return;
    el.classList.remove("cookie-banner--visible");
    setTimeout(function () { el.hidden = true; }, 300);
  }

  function init() {
    var consent = readConsent();
    if (consent === "granted") {
      enableAnalytics();
    } else if (consent === null) {
      showBanner();
    }

    var el = banner();
    if (!el) return;

    el.addEventListener("click", function (e) {
      var acceptBtn = e.target.closest && e.target.closest("[data-cookie-accept]");
      var rejectBtn = e.target.closest && e.target.closest("[data-cookie-reject]");
      if (acceptBtn) {
        writeConsent("granted");
        enableAnalytics();
        hideBanner();
      } else if (rejectBtn) {
        writeConsent("denied");
        hideBanner();
      }
    });

    document.addEventListener("click", function (e) {
      var reopen = e.target.closest && e.target.closest("[data-cookie-settings]");
      if (reopen) {
        e.preventDefault();
        showBanner();
      }
    });
  }

  window.dataLayer = window.dataLayer || [];
  function gtagDefault() { dataLayer.push(arguments); }
  gtagDefault("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  "loading" === document.readyState
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
}();
