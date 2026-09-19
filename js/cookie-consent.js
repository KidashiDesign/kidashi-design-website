!function () {
  "use strict";
  var STORAGE_KEY = "kd-cookie-consent";
  var GA_ID = "G-HVYN8BLVD1";
  var analyticsScriptLoaded = false;

  function readConsent() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed.analytics === "boolean") {
        return { necessary: true, analytics: parsed.analytics };
      }
    } catch (e) {}
    // Legacy value from before granular settings existed.
    if (raw === "granted") return { necessary: true, analytics: true };
    if (raw === "denied") return { necessary: true, analytics: false };
    return null;
  }

  function writeConsent(consent) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch (e) {}
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push(arguments);
  }

  function setAnalyticsConsent(granted) {
    window.gtag = window.gtag || gtag;
    gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
  }

  function enableAnalytics() {
    setAnalyticsConsent(true);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
    if (!analyticsScriptLoaded) {
      analyticsScriptLoaded = true;
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
      document.head.appendChild(s);
    }
  }

  function applyConsent(consent) {
    if (consent && consent.analytics) {
      enableAnalytics();
    } else {
      setAnalyticsConsent(false);
    }
  }

  function banner() { return document.getElementById("kdCookieBanner"); }
  function essentialsPanel() { return document.getElementById("kdCookieEssentials"); }
  function settingsPanel() { return document.getElementById("kdCookieSettings"); }
  function analyticsToggle() { return document.getElementById("kdCookieToggleAnalytics"); }

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
    setTimeout(function () {
      el.hidden = true;
      var ess = essentialsPanel(); if (ess) ess.hidden = true;
      var set = settingsPanel(); if (set) set.hidden = true;
    }, 300);
  }

  function toggleEssentials() {
    var set = settingsPanel(); if (set) set.hidden = true;
    var ess = essentialsPanel();
    if (ess) ess.hidden = !ess.hidden;
  }

  function toggleSettings() {
    var ess = essentialsPanel(); if (ess) ess.hidden = true;
    var set = settingsPanel();
    if (!set) return;
    if (set.hidden) prefillSettings();
    set.hidden = !set.hidden;
  }

  function openSettingsDirect() {
    var ess = essentialsPanel(); if (ess) ess.hidden = true;
    var set = settingsPanel();
    if (!set) return;
    prefillSettings();
    set.hidden = false;
  }

  function prefillSettings() {
    var toggle = analyticsToggle();
    if (!toggle) return;
    var current = readConsent();
    toggle.checked = !!(current && current.analytics);
  }

  function init() {
    var consent = readConsent();
    applyConsent(consent);
    if (!consent) showBanner();

    var el = banner();
    if (!el) return;

    el.addEventListener("click", function (e) {
      var t = e.target;
      var acceptBtn = t.closest && t.closest("[data-cookie-accept]");
      var essentialBtn = t.closest && t.closest("[data-cookie-essential]");
      var essentialConfirmBtn = t.closest && t.closest("[data-cookie-essential-confirm]");
      var manageBtn = t.closest && t.closest("[data-cookie-manage]");
      var saveBtn = t.closest && t.closest("[data-cookie-save]");

      if (acceptBtn) {
        var consent = { necessary: true, analytics: true };
        writeConsent(consent);
        applyConsent(consent);
        hideBanner();
      } else if (essentialConfirmBtn) {
        var consent = { necessary: true, analytics: false };
        writeConsent(consent);
        applyConsent(consent);
        hideBanner();
      } else if (essentialBtn) {
        toggleEssentials();
      } else if (manageBtn) {
        toggleSettings();
      } else if (saveBtn) {
        var toggle = analyticsToggle();
        var consent = { necessary: true, analytics: !!(toggle && toggle.checked) };
        writeConsent(consent);
        applyConsent(consent);
        hideBanner();
      }
    });

    document.addEventListener("click", function (e) {
      var reopen = e.target.closest && e.target.closest("[data-cookie-settings]");
      if (reopen) {
        e.preventDefault();
        showBanner();
        openSettingsDirect();
      }
    });
  }

  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  "loading" === document.readyState
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
}();
