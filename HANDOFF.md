# Handoff — Kidashi Design Website
Aktualisiert: 2026-06-24

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `KidashiDesign/kidashi-design-website` |
| Stack | Statisches HTML / CSS / JS — kein Build-Tool, kein Framework |
| Live-URL | `https://www.kidashidesign.com` |
| Preview | `https://kidashidesign.github.io/kidashi-design-website/` |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |
| Deploy | GitHub Actions → FTP → Hostinger bei Push auf `main` |
| Branch (Session) | `claude/optimistic-franklin-rpxcj4` (alle Änderungen per PR auf `main` gemergt) |

---

## Deploy-Checkliste (bei neuer Session als Erstes)

1. Letzten Workflow-Run prüfen: `mcp__github__actions_list`
2. Wenn **Deploy to Hostinger** = `failure` → sofort melden + `rerun_failed_jobs`
3. Benötigte GitHub Secrets (`Settings → Secrets → Actions`):
   - `FTP_SERVER` · `FTP_USERNAME` · `FTP_PASSWORD`
   - Werte aus Hostinger hPanel → Hosting → FTP-Konten
4. **GitHub Pages kann grün sein, Hostinger trotzdem rot** — Nicole nutzt immer `www.kidashidesign.com`

---

## Vertraulichkeitsregeln (immer einhalten)

- Kein KI-Workflow auf der öffentlichen Seite sichtbar (Nicole = echter Mensch, zertifizierter Designer)
- Name „Gianluca Crepaldi" wird nicht genannt — nur „Freelance-Collaboration mit einem Esports-Event-Veranstalter"
- Projekt **Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- Keine privaten Kontaktdaten von Kunden sichtbar
- `nicole@kidashidesign.com` nur als HTML-Kommentar, nie auf der Seite

---

## CSS Design Tokens

```css
--font-h:    'Mango Grotesque'          /* Headlines — selbst-gehosted TTF */
--font-b:    'Jost'                     /* Body/UI — Google Fonts non-blocking */
--dark:      #0A0A0B
--bg:        #F7F3EE                    /* heller Seitenhintergrund */
--bg2:       #EDE9E2                    /* leicht dunkler (about-content etc.) */
--cream:     #F7F3EE
--sand:      rgba(10,10,11,0.22)
--muted:     rgba(10,10,11,0.45)
--primary:   #FFBC95                    /* Orange/Salmon */
--secondary: #2E54FE                    /* Blau */
--accent:    #FFF083                    /* Gelb */
--nav-h:     72px / 60px (≤768px)
--gutter:    clamp(24px, 5vw, 80px)
--section-pad: clamp(80px, 10vw, 140px)
```

---

## Dateistruktur

```
/
├── index.html                     # Landingpage
├── css/
│   ├── style.css                  # Globales CSS + alle Tokens (kein @import!)
│   └── project.css                # Portfolio-Detailseiten
├── js/main.js                     # Nav, Cursor, alle Animationen
├── fonts/                         # MangoGrotesque-Bold.ttf + MangoGrotesque-Light.ttf
├── images/
│   ├── portfolio/                 # Projektbilder
│   └── gallery/                   # 35 Galerie-Bilder
├── about/index.html
├── services/index.html
├── contact/index.html
├── portfolio/
│   ├── index.html                 # Portfolio-Übersicht (nav--light, Raster)
│   ├── xp-days/                   # Animation + 12 Assets
│   ├── tm-studio/                 # Animation + 6 Assets
│   ├── galerie-kronsbein/         # Animation + Phone-Mockup
│   ├── rohyma-jet/                # Animation
│   ├── selvoma/                   # Animation
│   ├── wh4/                       # Animation
│   ├── hideout-georgia/           # 2 Assets
│   └── studio995/                 # 2 Assets
├── gallery/index.html
├── impressum/index.html
├── datenschutz/index.html
├── CLAUDE.md                      # Code-Review-Standard (Pflicht-Format)
├── SESSION.md                     # Ältere Session-Notizen
├── robots.txt
└── sitemap.xml                    # 21 URLs
```

---

## Nav-Farbsystem

| Klasse | Seiten | Textfarbe |
|--------|--------|-----------|
| `class="nav"` | Landingpage + alle 13 Projekt-Detailseiten | Weiß |
| `class="nav nav--light"` | portfolio, about, services, contact, gallery | Dunkel |
| `.scrolled` (JS-Toggle) | alle Seiten beim Scrollen | Frosted-Glass dunkel |
| `.over-light` (JS-Toggle) | Landingpage über hellen Sektionen | Dunkel |

---

## Dauerhafte Animations-Regeln (bei jedem Asset-Upload anwenden)

1. **`__bundler_thumbnail` SVG entfernen** → nur `<div id="__bundler_thumbnail" style="background:#FARBE;"></div>`
2. **`?tile=1`-Script** am Anfang von `<head>` einfügen (Text-Overlays im Kachel-Modus verstecken)
3. **Steuerelemente entfernen** → Scrubber, Pause-Button, Fullscreen-Button
4. **Iframes** → `loading="lazy"` (Übersicht-Kacheln) / `loading="eager"` (Detailseite Hero)

Tile-Script Muster:
```html
<script>
(function(){
  if(!location.search.includes('tile'))return;
  var css='text,tspan{display:none!important}[class*="text"],[class*="title"]{visibility:hidden!important}';
  function inject(){var s=document.createElement('style');s.textContent=css;(document.head||document.documentElement).appendChild(s);}
  inject();document.addEventListener('DOMContentLoaded',inject);setTimeout(inject,500);setTimeout(inject,1500);
})();
</script>
```

---

## Word-Cycle / Gooey-Morph

```html
<!-- Inline-Wort (About, Contact, Services, Portfolio, Gallery) -->
<h1>The <span class="gooey-word"
  data-gooey-texts='["Designer","Strategist","Creator","Visionary"]'>Designer</span> Behind</h1>

<!-- Hero-Cycle (Landingpage) -->
<span class="hero2__cycle" id="heroCycle"
  data-gooey-texts='["YOU","THE PLANET","THE COMMUNITY","YOUR COMPANY","THE ALGORYTHM"]'
  data-gooey-morph="1.2" data-gooey-cooldown="2"></span>
```

**Wichtig:** Seit dieser Session läuft der Morph-Effekt als **reiner Opacity-Crossfade** (kein SVG-feColorMatrix-Filter mehr). Das war nötig, weil der Filter nach dem Font-Swap zu Flackern führte. Der `gooey-word`-Selector und `data-gooey-texts`-Attribut bleiben gleich, nur die Render-Methode ist jetzt `t1.style.opacity / t2.style.opacity`.

---

## Scroll-Animationen (js/main.js)

| System | Auslöser | Effekt |
|--------|---------|--------|
| `.reveal` + IntersectionObserver | 10% sichtbar, 50px bottom-margin | `opacity: 0 + translateY(30px)` → sichtbar; Delays via `data-delay="100/200/300"` |
| `.about-hero__portrait.reveal` | wie `.reveal` | `translateX(80px) scale(0.92)` → none; auf ≤1024px: `translateY(50px)` |
| H3 Parallax | Scroll-RAF | `±14px translateY` um Viewport-Mitte; **ausgeschlossen**: `.footer`, `.cs-section` |
| ContainerScroll | Scroll-RAF (scroll-driven) | 5 Prozessschritte in 3D-Tablet; Mobile (≤768px): einzeln per IntersectionObserver |
| DisplayCards | IntersectionObserver | Gestapelte Karten, sequenziell (`dc-card--3/2/1`) mit 480ms Versatz |
| H2 | — | Scramble-Animation **entfernt** (war störend) |

---

## About-Seite — Animations-Details

**Portrait** (`.about-hero__portrait.reveal`):
- Wrapper: `overflow: hidden; border-radius: clamp(12px, 2vw, 20px)`
- Initial: `transform: translateX(80px) scale(0.92); opacity: 0`
- Sichtbar: `transform: none; opacity: 1` — Spring-Easing `cubic-bezier(0.16,1,0.3,1)`
- Bild: startet bei `scale(1.08)` → `scale(1)` (0.2s Verzögerung, 1.1s Dauer)
- ≤1024px: Portrait fliegt von unten (`translateY(50px) scale(0.96)`)

**Sidebar-Cards** (`.sidebar-block`):
- `background: var(--bg); border-radius: 14px; border: 1px solid rgba(10,10,11,0.1); box-shadow: 0 2px 16px rgba(10,10,11,0.05)`
- Hover: `box-shadow: 0 8px 28px rgba(10,10,11,0.10)`
- Stagger via `data-delay="0/100/200/300"` (bestehende `.reveal`-Klassen)
- `.sidebar-block.reveal` erbt + `box-shadow 0.3s` für saubere Hover-Transition

---

## ContainerScroll — Services-Seite

**HTML:** `#csOuter > .cs-sticky > .cs-layout > #csCard.cs-device > .cs-device__screen > .cs-steps > .cs-step`

**JS-Logik:**
- `csProgress()` = `-rect.top / (csOuter.offsetHeight - window.innerHeight)` → 0–1
- Karte: `rotateX(20° → 0°) scale(1.05 → 1)` über gesamt-Scroll
- Header: `translateY(0 → -60px)`
- Schritte: je 1/5 des Scroll-Wegs sichtbar, `fadeW = 0.04` Überblend-Fenster

**Wichtiger Fix (PR #22):** Schritt 2 sprang nach unten, weil `justify-content: center` mit unterschiedlich hohen Texten zu unterschiedlichem Vertikal-Offset führte. Behoben durch `justify-content: flex-start` + `padding-top: clamp(2rem, 7vh, 4.5rem)`.

---

## Performance-Stand

- Google Fonts: non-blocking (`rel="preload" onload`) in allen 21 HTML-Seiten
- MangoGrotesque: Preload-Hints in index.html (Bold + Regular), Unterseiten (Light + Bold)
- Kein CSS `@import` mehr in `style.css` (war render-blocking)
- Alle Bilder: `loading="lazy" decoding="async"` (außer Hero-Iframes: `loading="eager"`)
- `font-display: swap` auf allen `@font-face`
- `main.js` am Ende von `<body>`
- Scroll-Handler: RAF-throttled + `{ passive: true }`

---

## Was in dieser Session gemacht wurde (PRs #19 – #22)

| PR | Titel | Status |
|----|-------|--------|
| #19 | Performance & UX: Font loading, gooey morph, display cards | ⚠️ Offen (falsche Basis) |
| #20 | About animations, H1/H2/H3 effects, gooey fix, mobile H1 centering | ✅ Gemergt → main |
| #21 | Fix: cs-step content jump (Merge-Konflikt) | ❌ Geschlossen |
| #22 | Fix: cs-step content jump between steps | ✅ Gemergt → main |

**Änderungen im Einzelnen:**
- Gooey SVG-Morph entfernt → reiner Opacity-Crossfade (kein feColorMatrix mehr)
- Font-Timing-Bug behoben: Breiten-Messung erst nach `document.fonts.ready`
- H2 Scramble-Animation entfernt
- H3 Scroll-Parallax hinzugefügt (±14px, RAF-throttled)
- Hero-H1 auf Mobile/Tablet zentriert (`width: 100%; text-align: center`)
- About-Portrait: Fly-in von rechts + Zoom, abgerundete Ecken
- About-Sidebar: Card-Stil mit Stagger-Animation
- Portfolio-Tiles: tm-studio + selvoma Tile-Script ergänzt; wh4 + xp-days SVG-Thumbnail bereinigt
- ContainerScroll Schritt-2-Sprung behoben

---

## Offene Aufgaben

| # | Task | Status |
|---|------|--------|
| 1 | Portfolio-Bilder für leere Projekte | ❌ Warten auf Nicole |
| 2 | artista-magazin, mystic-drops, piano-post, seestern, westgrowth-capital | ❌ Nur `.gitkeep` |
| 3 | PR #19 schließen (Inhalt ist in PR #20 aufgegangen) | ⏳ Optional |

---

## Portfolio — Übersicht

| Projekt | Animation | Bilder | Notiz |
|---------|-----------|--------|-------|
| xp-days | ✅ | 12 | |
| tm-studio | ✅ | 6 | |
| galerie-kronsbein | ✅ | — | Phone-Mockup Hero auf Mobile |
| rohyma-jet | ✅ | 1 | |
| selvoma | ✅ | — | |
| wh4 | ✅ | — | |
| hideout-georgia | — | 2 | |
| studio995 | — | 2 | |
| artista-magazin | — | ❌ | Platzhalter |
| mystic-drops | — | ❌ | Platzhalter |
| piano-post | — | ❌ | Platzhalter |
| seestern | — | ❌ | Platzhalter |
| westgrowth-capital | — | ❌ | Platzhalter |

---

## Schnellstart für neue Session

```
Ich arbeite am Repo KidashiDesign/kidashi-design-website.
Alle letzten Änderungen sind auf main gemergt und live.
Stack: statisches HTML/CSS/JS, Deploy via GitHub Actions → FTP → Hostinger.
Lies HANDOFF.md im Root für alle technischen Details.
```
