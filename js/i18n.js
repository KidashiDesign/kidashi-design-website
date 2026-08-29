/*
 * Kidashi Design — EN/DE language switcher.
 *
 * Pattern: the English copy stays the authored HTML content. A German
 * variant is added as a data attribute on the same element:
 *
 *   <p data-de="Deutscher Text">English text</p>
 *   <h1 data-de-html="Deutsch <em>mit</em> Markup">English <em>with</em> markup</h1>
 *   <input placeholder="Name" data-de-placeholder="Name">
 *   <meta name="description" content="..." data-de-content="...">
 *
 * Switching language swaps textContent/innerHTML/attributes in place —
 * no page reload, no separate /de/ URLs. The original English value is
 * cached on first switch (data-en / data-en-html / data-en-<attr>) so
 * toggling back is lossless even though only German is authored inline.
 */
(function () {
	'use strict';

	var STORAGE_KEY = 'kd-lang';
	var ATTRS = ['placeholder', 'content', 'alt', 'aria-label', 'title', 'value', 'scramble-words', 'data-label'];

	function getStoredLang() {
		try {
			var saved = localStorage.getItem(STORAGE_KEY);
			if (saved === 'de' || saved === 'en') return saved;
		} catch (e) { /* localStorage unavailable (private mode, etc.) */ }
		return null;
	}

	function detectLang() {
		var stored = getStoredLang();
		if (stored) return stored;
		var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
		return nav.indexOf('de') === 0 ? 'de' : 'en';
	}

	function applyLang(lang) {
		var isDe = lang === 'de';

		document.documentElement.setAttribute('lang', lang);
		document.documentElement.setAttribute('data-lang', lang);

		var textEls = document.querySelectorAll('[data-de]');
		for (var i = 0; i < textEls.length; i++) {
			var el = textEls[i];
			if (!el.hasAttribute('data-en')) {
				el.setAttribute('data-en', el.textContent);
			}
			el.textContent = isDe ? el.getAttribute('data-de') : el.getAttribute('data-en');
		}

		var htmlEls = document.querySelectorAll('[data-de-html]');
		for (var j = 0; j < htmlEls.length; j++) {
			var elh = htmlEls[j];
			if (!elh.hasAttribute('data-en-html')) {
				elh.setAttribute('data-en-html', elh.innerHTML);
			}
			elh.innerHTML = isDe ? elh.getAttribute('data-de-html') : elh.getAttribute('data-en-html');
		}

		for (var a = 0; a < ATTRS.length; a++) {
			var attr = ATTRS[a];
			var deKey = 'data-de-' + attr;
			var selector = '[' + deKey + ']';
			var attrEls = document.querySelectorAll(selector);
			for (var k = 0; k < attrEls.length; k++) {
				var elA = attrEls[k];
				var enKey = 'data-en-' + attr;
				if (!elA.hasAttribute(enKey)) {
					elA.setAttribute(enKey, elA.getAttribute(attr) || '');
				}
				elA.setAttribute(attr, isDe ? elA.getAttribute(deKey) : elA.getAttribute(enKey));
			}
		}

		var btns = document.querySelectorAll('[data-lang-btn]');
		for (var b = 0; b < btns.length; b++) {
			var active = btns[b].getAttribute('data-lang-btn') === lang;
			btns[b].classList.toggle('active', active);
			btns[b].setAttribute('aria-pressed', active ? 'true' : 'false');
		}

		try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

		// Lets page-specific scripts that render their own markup (e.g. the
		// testimonials carousel, built entirely from a JS array) re-render
		// in the newly selected language.
		document.dispatchEvent(new CustomEvent('kd:langchange', { detail: { lang: lang } }));
	}

	function init() {
		applyLang(detectLang());

		document.addEventListener('click', function (e) {
			var btn = e.target.closest && e.target.closest('[data-lang-btn]');
			if (!btn) return;
			applyLang(btn.getAttribute('data-lang-btn'));
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Exposed so scripts that inject markup after the initial pass (e.g. the
	// cookie banner in main.js, built with createElement after this script
	// already ran) can re-run translation on just-added nodes.
	window.KD_I18N = {
		applyLang: applyLang,
		getLang: function () {
			return document.documentElement.getAttribute('data-lang') || detectLang();
		}
	};
})();
