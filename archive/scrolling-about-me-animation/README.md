# Scrolling About Me Animation (archiviert)

Dies ist die alte Scroll-Zoom-Animation der Reisefotos ("Scrolling About Me Animation",
ZoomParallax-Sektion: Himalaya, Dschungel, Thailand, Indien etc.) auf der About-Me-Seite,
bei der die einzelnen Bilder beim Scrollen reingezoomt wurden — bevor sie am 30.06.2026
durch die mausgesteuerte Floating-Animation (`.about-hero-float`) ersetzt wurde.

**Keywords:** Scrolling About Me Animation, Reisefoto-Zoom-Parallax, Bilder werden beim
Scrollen gezoomt, Wander-/Reisebilder-Sektion, `.zp` Sektion.

## Inhalt
- `about-section.html` — `<section class="zp">` Markup mit den 7 Reisefotos
- `style.css` — komplettes `.zp` / `.zp__*` CSS (inkl. Mobile- und reduced-motion-Varianten)
- `main.js` — die Scroll-Zoom-Logik (IIFE, hört auf `scroll`, skaliert Bilder per `--zp-scale-end`)

## Herkunft
Die 3D-Tilt-Card (`about3d`) als Hero bleibt unverändert bestehen — nur diese
ZoomParallax-Reisefoto-Sektion direkt darunter wurde ersetzt.
Letzter Live-Stand vor dem Tausch: Branch `main`, Commit `8659bf2`.
Ersetzt durch die `about-hero-float`-Sektion (Floating-Animation mit Portrait + Badges).

## Wiederherstellung
Falls die alte Reisefoto-Zoom-Animation wieder gewünscht ist:
1. `about-section.html` zurück in `about/index.html` einfügen (an Stelle von `.about-hero-float`)
2. CSS aus `style.css` zurück in `css/style.css` kopieren
3. JS aus `main.js` zurück in `js/main.js` kopieren
