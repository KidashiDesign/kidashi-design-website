# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-06-23

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `claude/optimistic-franklin-rpxcj4` |
| PR | https://github.com/KidashiDesign/kidashi-design-website/pull/19 |
| Deploy | FTP → Hostinger (echte Live-Seite) + GitHub Pages (Preview) |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| Live-URL | `https://www.kidashidesign.com` |
| GitHub Pages | `https://kidashidesign.github.io/kidashi-design-website/` |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |

---

## 🚨 DEPLOY-PFLICHT — bei jeder neuen Session als ERSTES prüfen

Die echte Live-Seite liegt auf **Hostinger** (nicht GitHub Pages).
Deploy läuft automatisch via GitHub Actions Workflow `.github/workflows/deploy.yml` per FTP bei jedem Push auf `main`.

**Beim Sessionstart immer prüfen:**
1. Letzten Workflow-Run auf `main` checken → `mcp__github__actions_list` (list_workflow_runs)
2. Wenn "Deploy to Hostinger" = `failure` → sofort melden und `rerun_failed_jobs` auslösen
3. Secrets die dafür gesetzt sein müssen (in GitHub Repo Settings → Secrets):
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
4. Wenn Secrets fehlen → Nicole auffordern sie in https://github.com/KidashiDesign/kidashi-design-website/settings/secrets/actions einzutragen (Werte aus Hostinger hPanel → Hosting → FTP-Konten)

**Merke:** GitHub Pages Deploy kann grün sein, aber Hostinger trotzdem rot — Nicole schaut immer auf www.kidashidesign.com, nicht auf github.io!

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Kein KI-Workflow sichtbar** auf der öffentlichen Seite (Nicole = echter Mensch, zertifizierter Designer)
- **Kein Name „Gianluca Crepaldi"** — nur „Freelance-Collaboration mit einem Esports-Event-Veranstalter"
- **Projekt Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- Keine privaten Kontaktdaten von Kunden sichtbar
- `nicole@kidashidesign.com` nur als HTML-Kommentar, nie auf der Seite

---

## 🔧 Dauerhafte Animations-Regeln (IMMER bei jedem Upload anwenden)

Bei **jeder** hochgeladenen Bundle-Animation automatisch ohne Erinnerung:
1. **`__bundler_thumbnail` SVG entfernen** → ersetzen durch `<div id="__bundler_thumbnail" style="background:FARBE;"></div>` (nur plain Hintergrundfarbe)
2. **Ladeoptimierung** → `loading="lazy"` auf alle Iframes (außer Hero auf Detailseite: `loading="eager"`)
3. **Steuerelemente prüfen** → PlaybackBar, Pause-Button, Fullscreen-Button entfernen falls vorhanden
4. **Tile-Script prüfen** → falls nicht vorhanden, `?tile=1`-Script ergänzen

---

## CSS Design Tokens (aus `css/style.css`)

```css
--font-h: 'Mango Grotesque'      /* Headlines */
--font-b: 'Jost'                  /* Body/UI */
--dark:   #0A0A0B
--cream:  #F7F3EE
--bg:     #F7F3EE (heller Hintergrund)
--bg2:    #EDE9E2
--sand:   rgba(10,10,11,0.22)
--primary: #FFBC95 (Orange/Salmon)
--secondary: #2E54FE (Blau)
--accent:  #FFF083 (Gelb)
--muted:   rgba(10,10,11,0.45)
--nav-h:   72px (Desktop) / 60px (Mobile)
--gutter:  clamp(24px, 5vw, 80px)
--section-pad: clamp(80px, 10vw, 140px) | mobile 480px: clamp(48px, 12vw, 80px)
```

---

## Mobile Typography (nach 2026-06-23 Optimierung)

```css
/* Basis (alle Breakpoints) */
h1: clamp(1.9rem, 5vw, 5rem)
h2: clamp(2rem, 4.5vw, 4.6rem)

/* ≤ 768px */
h1: clamp(2.4rem, 7.5vw, 3.2rem)   /* war: 1.7rem */
h2: clamp(2rem, 6.5vw, 2.8rem)     /* war: 1.4rem */
h3: clamp(1.4rem, 5vw, 2rem)

/* ≤ 480px */
h1: clamp(2.2rem, 8vw, 2.8rem)     /* war: 1.5rem */
h2: clamp(1.8rem, 7vw, 2.4rem)     /* war: 1.25rem */
h3: clamp(1.3rem, 5.5vw, 1.8rem)

/* Hero H1 mobil */
.hero2__static/.hero2__cycle: clamp(3.4rem, 15vw, 7rem)  /* war: 2.8rem/14vw */
```

---

## Nav-Farbsystem

| Klasse | Verwendung | Textfarbe |
|--------|-----------|-----------|
| `class="nav"` | Landingpage + alle 13 Projekt-Detailseiten | Weiß (cream) |
| `class="nav nav--light"` | portfolio/index.html, about, services, contact, gallery | Dunkel |
| `.scrolled` (JS-Toggle) | Alle Seiten beim Scrollen | Frosted-Glass dunkel |
| `.over-light` (JS-Toggle) | Landingpage über hellen Sektionen | Dunkel |

---

## Dateistruktur (wichtigste Dateien)

```
/
├── index.html                    # Landingpage (nav class="nav")
├── css/
│   ├── style.css                 # Globales CSS + Tokens (KEIN @import mehr!)
│   └── project.css               # Portfolio-Detailseiten CSS
├── js/main.js                    # Nav-Scroll, Cursor, Animationen, Gooey-Morph
├── fonts/                        # MangoGrotesque TTF (~51KB/Datei, font-display:swap)
├── portfolio/
│   ├── index.html                # Portfolio-Übersicht (nav--light, 4-col grid)
│   ├── xp-days/                  # Animation + 12 JPEG-Assets
│   ├── tm-studio/                # Animation + 6 Assets
│   ├── galerie-kronsbein/        # Animation + Phone-Mockup (galerie-kronsbein-phone.html)
│   ├── rohyma-jet/               # Animation + 1 Asset
│   ├── selvoma/                  # Animation (selvoma-animation.html)
│   ├── wh4/                      # Animation
│   ├── hideout-georgia/          # 2 Assets
│   └── studio995/                # 2 Assets
├── images/portfolio/             # Projektbilder
├── images/gallery/               # 35 Galerie-Bilder
├── CLAUDE.md                     # Code-Review-Standard (Pflichtformat)
├── robots.txt
└── sitemap.xml                   # 21 URLs
```

---

## Gooey Text Morph — Technische Details

```html
<!-- Inline gooey (About, Contact, Services, Portfolio, Gallery) -->
<h1>The <span class="gooey-word"
  data-gooey-texts='["Designer","Strategist","Creator","Visionary"]'>Designer</span> Behind</h1>

<!-- Hero cycle (Landingpage) -->
<span class="hero2__cycle" id="heroCycle"
  data-gooey-texts='["YOU","THE PLANET","THE COMMUNITY","YOUR COMPANY","THE ALGORYTHM"]'
  data-gooey-morph="1.2" data-gooey-cooldown="2"></span>
```

**JS-Initialisierung:** `initGooeyText(host, texts, morphTime, cooldownTime)`
- Misst max. Textbreite aller Words per Probe-Span → `filterEl.style.minWidth` → kein Layout-Shift
- Hero cycle: Sonderfall (block/absolute positioning) → kein minWidth gesetzt
- SVG-Filter: `#gooey-threshold` mit `feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"`
- Klasse `.is-morphing` nur während Morph-Phase aktiv → scharfer Text in Ruhephase

**CSS (gooey):**
```css
.gooey-filter { display: inline-grid; grid-template-columns: max-content;
                line-height: inherit; vertical-align: baseline; }
.gooey-t1, .gooey-t2 { grid-area: 1/1; line-height: inherit; letter-spacing: inherit; }
```

---

## CSS-Muster — Projekt-Hero-Varianten

```css
/* Standard-Hero (Bild-Hintergrund, dunkle Überlagerung) */
<section class="proj-hero">

/* Video/Animation-Hero (Vollbild-Iframe, Desktop) */
<section class="proj-hero proj-hero--video" style="background:#06120D;">
  <div class="proj-hero__back--top">  <!-- absolut, Desktop-Back-Link -->
  <div class="proj-hero__video-wrap"> <!-- height: 100svh -->
    <iframe class="proj-hero__video-frame" loading="eager" ...>
  </div>
  <div class="proj-hero__content"> <!-- fließt nach dem Video -->

/* Mobile: video → aspect-ratio:1/1 (Quadrat) */
/* GK Phone-Mockup: proj-hero--phone Klasse + iframe zur galerie-kronsbein-phone.html -->
```

---

## Performance-Stand (nach 2026-06-23 Optimierung)

- **Google Fonts**: Non-blocking `rel="preload" onload` in allen 21 HTML-Seiten
- **MangoGrotesque**: Preload-Hints in index.html (Bold+Regular), about/portfolio/services/contact (Light+Bold)
- **CSS @import**: entfernt aus style.css (war render-blocking + doppelt geladen)
- **Bilder**: alle `loading="lazy" decoding="async"` (außer Hero-iframes: `loading="eager"`)
- **Fonts**: `font-display: swap` auf allen @font-face Deklarationen
- **JS**: main.js am Ende von `<body>` — nicht render-blocking

---

## Was diese Session (2026-06-23) gemacht wurde

### Commits (neueste zuerst)
```
0988f8e  Mobile UX: larger headings, gooey word-spacing fix, faster font loading
8049627  Fix empty gaps around heading animations
534248e  ContainerScroll: remove bezel/caption, center text, larger fonts, per-step scroll animation
c7bbb4e  Merge main into feature branch; resolve JS conflict
bec3b6b  Redesign footer across all pages — 4-column layout with social icons
7d378ac  Fix gooey sharpness, DisplayCards sequential reveal, ContainerScroll redesign
22765ff  Add 3D container scroll to My Process section on services page
f617646  Add gooey text morphing to all main H1 headings
d10a116  Add DisplayCards stacked widget to "What I Offer" section
65473da  Cursor: fix stuttering by moving DOM queries from pointermove into rAF
cdd6fba  GK mobile: bigger mockup, lightweight phone HTML, remove loading box from animation tiles
abb0225  Mobile & desktop animation layout fixes
8d8caa3  Fix: back link visible on desktop/tablet for all detail pages
```

### Features dieser Session
- **DisplayCards** ("What I Offer"): gestapelte Karten, sequenziell enthüllt, Desktop Hover fächert auf
- **Gooey Text Morph**: alle H1-Headings morphen ein Schlüsselwort (About/Contact/Services/Portfolio/Gallery)
- **ContainerScroll**: 3D-Tablet-Mockup auf Services-Seite, scroll-driven, Mobile stacked
- **Footer-Redesign**: 4-Spalten (Newsletter, Quick Links, Contact, Follow Me) + Social Icons
- **Galerie Kronsbein**: Desktop-Animation + Phone-Mockup-Hero auf Mobile
- **Selvoma Animation**: selvoma-animation.html hinzugefügt
- **Mobile Optimierung**: alle h1/h2 deutlich größer, section-pad reduziert, project.css Titel größer
- **Performance**: @import entfernt, Fonts non-blocking, Preload-Hints

---

## Offene Aufgaben / Pending

| # | Task | Status |
|---|------|--------|
| 1 | PR #19 mergen → https://github.com/KidashiDesign/kidashi-design-website/pull/19 | ⏳ Offen |
| 2 | Portfolio-Bilder für leere Projekte | ❌ Warten auf Nicole |
| 3 | artista-magazin, mystic-drops, piano-post, seestern, westgrowth-capital | ❌ Nur `.gitkeep` |

---

## Portfolio-Seiten (alle 13 Detailseiten)

`xp-days` · `wh4` · `rohyma-jet` · `tm-studio` · `galerie-kronsbein` · `seestern` · `westgrowth-capital` · `hideout-georgia` · `selvoma` · `mystic-drops` · `artista-magazin` · `piano-post` · `studio995`

**Animationen vorhanden:** xp-days · wh4 · rohyma-jet · tm-studio · galerie-kronsbein · selvoma
**Bilder vorhanden:** xp-days (12), tm-studio (6), hideout-georgia (2), studio995 (2), rohyma-jet (1)
**Bilder fehlen:** artista-magazin, galerie-kronsbein, mystic-drops, piano-post, seestern, westgrowth-capital

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
claude/optimistic-franklin-rpxcj4 (PR #19).
Statisches HTML/CSS/JS, Deploy → Hostinger via FTP auf main.
Lies SESSION.md im Root für alle Infos.
```
