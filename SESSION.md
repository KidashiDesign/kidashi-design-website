# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-06-29

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `KidashiDesign/kidashi-design-website` |
| Branch (aktiv) | `main` |
| Deploy | GitHub Pages automatisch bei Push auf `main` |
| Stack | Statisches HTML/CSS/JS — kein Build-Tool, kein Framework |
| Live-URL | `https://kidashidesign.github.io/kidashi-design-website/` |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |

---

## 🚨 DEPLOY-INFO

**Kein Hostinger-Hoster.** Nur GitHub Pages.
Der Workflow `Deploy to Hostinger` (deploy.yml) schlägt immer fehl — FTP-Secrets nicht gesetzt. Ignorieren.

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Kein KI-Workflow sichtbar** auf der Seite (Nicole = echter Mensch, zertifizierter Designer)
- **Kein Name „Gianluca Crepaldi"** — nur „Freelance-Collaboration mit einem Esports-Event-Veranstalter"
- **Projekt Wiedmann & Winz** → komplett ausgeschlossen
- Keine privaten Kundenkontaktdaten öffentlich sichtbar
- `nicole@kidashidesign.com` nur als HTML-Kommentar, nie auf der Seite

---

## 🎨 Design-Tokens (CSS Custom Properties)

```css
--primary:      #FFBC95
--dark:         #0A0A0B
--cream:        #F7F3EE
--ease:         cubic-bezier(0.25, 0.46, 0.45, 0.94)
--gutter:       clamp(24px, 5vw, 80px)
--section-pad:  clamp(80px, 10vw, 140px)
```

---

## 📁 Dateistruktur (relevante Verzeichnisse)

```
/
├── index.html                    ← Landingpage
├── about/index.html              ← About-Seite (ZoomParallax Hero)
├── gallery/index.html            ← Galerie-Seite
├── portfolio/
│   ├── index.html                ← Portfolio-Übersicht (Kacheln)
│   ├── art-gerecht-modular/      ← NEU — cinematic hero animation
│   ├── xp-days/
│   ├── rohyma-jet/
│   ├── tm-studio/
│   ├── galerie-kronsbein/
│   ├── selvoma/
│   └── ...weitere Projekte
├── css/style.css                 ← Haupt-Stylesheet
├── js/main.js                    ← Haupt-JS (scroll, cursor, nav, ZoomParallax)
├── fonts/                        ← Mango Grotesque WOFF2 (6 Schnitte)
├── images/
│   ├── about/                    ← 8 Reisefotos (WebP, q95/lossless)
│   ├── artgerecht/               ← Art Gerecht Assets (WebP)
│   └── gallery/                  ← Collagen (WebP q82)
```

---

## ✅ Was in dieser Session gebaut wurde (2026-06-29)

### 1. Gallery Teaser Kacheln (index.html)
- Overlapping Collage Card Deck — 7 Karten, überlappend mit Rotation
- Desktop: zentriert, 260px Breite, -100px Overlap
- Mobile: linksbündig, Karten laufen aus dem Rand
- Hover: `lift + scale` nur auf Desktop (`@media (hover: hover) and (pointer: fine)`)

### 2. Performance-Optimierung
- Alle 6 TTF-Fonts → WOFF2 (~68% kleiner)
- 7 Gallery-Teaser-Bilder → WebP q82
- `@font-face` mit `font-display: swap`
- JS defer, toten Script-Tag entfernt

### 3. Gallery-Beschreibungstext (beide Seiten)
- `index.html` + `gallery/index.html` aktualisiert:
  > "Collages born from the places I've lived and traveld by— Germany, Georgia, Thailand, Vietnam, the Himalayas …"

### 4. ZoomParallax Hero — About-Seite
**Dateien:** `about/index.html`, `css/style.css`, `js/main.js`

Vanilla-Port des React/Framer-Motion ZoomParallax-Komponenten:
- `position: sticky` Container (300vh)
- 7 Reisefotos, jedes mit `--zp-scale-end` (4–9)
- Scroll-Progress → `transform: scale()` via JS (`passive: true`)
- `prefers-reduced-motion`: statisches 3-Spalten-Grid
- Alle Bilder zentriert um Viewport-Mitte (50%/50%)

**Bilder in `images/about/` (alle WebP):**
| Datei | Position | scale-end | Qualität |
|-------|----------|-----------|----------|
| himalaya-mountains.webp | #1 | 4 | q95 |
| himalaya-pointing.webp | #2 — Ersatz f. Moped | 5 | q95 |
| jungle-rest.webp | #3 | 6 | q95 |
| prayer-flags-dharamshala.webp | #4 | 5 | q95 |
| forest-path.webp | #5 | 6 | q95 |
| boat-thailand.webp | #6 | 8 | q95 |
| chai-india.webp | #7 — letztes Bild | 9 | lossless |

> **Item #2 Desktop-Position:** `left: calc(50% + 18vw)` — bewusst weit rechts, damit beim Vollzoom (scale 9) nur Item #7 sichtbar ist.

### 5. Art Gerecht Modular — neues Portfolioprojekt
**Dateien:**
- `portfolio/art-gerecht-modular/art-gerecht-animation.html`
- `portfolio/art-gerecht-modular/index.html`
- `images/artgerecht/*.webp`
- `portfolio/index.html` — Kachel als erste im Grid ergänzt

**Animation (4 Phasen):**
1. Logo erscheint aus Unschärfe + 3D-Rotation (`agm-logo-reveal`)
2. Logo wandert nach oben (`agm-logo-to-top`)
3. Technische Zeichnung wird eingeblendet
4. 3D-Flyer (Vorder/Rückseite) dreht sich orbital (`agm-flyer-orbit`)

**Tile-Modus** (`?tile=1`): überspringt Intro, Flyer dreht sofort in Dauerschleife.

**Assets in `images/artgerecht/`:**
| Datei | Größe | Zweck |
|-------|-------|-------|
| agm-logo.webp | 16KB lossless | Logo |
| agm-drawing.webp | 40KB | Technische Zeichnung |
| agm-flyer-front.webp | 449KB | Flyer Vorderseite |
| agm-flyer-back.webp | 423KB | Flyer Rückseite |
| agm-texture.webp | 1.8MB | Betonhintergrund |

---

## 🔧 Dauerhafte Animations-Regeln (IMMER bei Upload anwenden)

Bei jeder hochgeladenen Bundle-Animation:
1. `__bundler_thumbnail` SVG → `<div id="__bundler_thumbnail" style="background:FARBE;"></div>`
2. `loading="lazy"` auf alle Iframes (Hero-Detailseite: `loading="eager"`)
3. PlaybackBar / Pause / Fullscreen entfernen falls vorhanden
4. `?tile=1`-Script prüfen und ggf. ergänzen

---

## 🗺 Portfolio-Übersicht (aktuell)

| Projekt | Ordner | Animation |
|---------|--------|-----------|
| Art Gerecht Modular | art-gerecht-modular/ | ✅ cinematic 4-phase |
| XP-Days | xp-days/ | ✅ iframe |
| Rohyma Jet | rohyma-jet/ | ✅ iframe |
| TM Studio | tm-studio/ | ✅ iframe |
| Galerie Kronsbein | galerie-kronsbein/ | ✅ iframe |
| Selvoma | selvoma/ | ✅ iframe |
| Seestern | seestern/ | statisch |
| Westgrowth Capital | westgrowth-capital/ | statisch |
| Hideout Georgia | hideout-georgia/ | statisch |
| Mystic Drops | mystic-drops/ | statisch |
| Artista Magazin | artista-magazin/ | statisch |
| Piano Post | piano-post/ | statisch |
| Studio995 | studio995/ | statisch |
| WH4 | wh4/ | archiviert |
| Wiedmann & Winz | — | **AUSGESCHLOSSEN** |
