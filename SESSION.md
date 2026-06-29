# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-06-28

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `KidashiDesign/kidashi-design-website` |
| Branch (aktiv) | `main` |
| Deploy | GitHub Pages → `https://kidashidesign.github.io/kidashi-design-website/` |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| GitHub Pages | `https://kidashidesign.github.io/kidashi-design-website/` |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |

---

## 🚨 DEPLOY-INFO

**Kein Hostinger-Hoster** — die Seite läuft ausschließlich über **GitHub Pages**.
Deploy läuft automatisch via GitHub Actions `pages-build-deployment` bei jedem Push auf `main`.

**Beim Sessionstart prüfen:**
1. Letzten `pages-build-deployment`-Run auf `main` checken → grün = live
2. Der Workflow `Deploy to Hostinger` (deploy.yml) schlägt immer fehl — das ist OK, kein Hoster vorhanden, FTP-Secrets nicht gesetzt. Ignorieren.

**Live-URL:** `https://kidashidesign.github.io/kidashi-design-website/`

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
1. **`__bundler_thumbnail` SVG entfernen** → ersetzen durch `<div id="__bundler_thumbnail" style="background:FARBE;"></div>`
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
--section-pad: clamp(80px, 10vw, 140px)
```

---

## About 3D Tilt Card — Technische Details (NEU 2026-06-28)

Beide Seiten (`index.html` + `about/index.html`) verwenden jetzt dieselbe interaktive Card-Komponente.

```html
<!-- Vanilla-Port der Aceternity 3D Card -->
<section class="about3d">
  <div class="container">
    <div class="about3d__stage reveal">
      <div class="about3d__card" data-tilt>
        <div class="about3d__media" data-tilt-z="40">
          <img class="about3d__img" src="images/portrait.jpg" ...>
        </div>
        <div class="about3d__content">
          <span class="eyebrow" data-tilt-z="50">About Nicole</span>
          <h2 class="about3d__title" data-tilt-z="70">Hi. I'm Nicole.</h2>
          <p class="about3d__text" data-tilt-z="30">...</p>
          <div class="about3d__foot">
            <ul class="about3d__points" data-tilt-z="20">...</ul>
            <a href="about/" class="btn btn--outline-dark about3d__btn" data-tilt-z="60">Get to Know Me</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**JS-Handler:** in `main.js` → `[data-tilt]` + `[data-tilt-z]`
- Tilt initialisiert nur auf `(hover: hover) and (pointer: fine)` Geräten
- Respektiert `prefers-reduced-motion`
- `data-tilt-z="N"` → Elemente heben sich beim Hover um N px in Z-Tiefe

**Portrait:** `transform: scale(1.3)` + `object-fit: cover` → grauer Bildrand nie sichtbar

---

## Nav-Farbsystem

| Klasse | Verwendung | Textfarbe |
|--------|-----------|-----------|
| `class="nav nav--light"` | index.html, about, services, contact, gallery, portfolio/index | Dunkel |
| `class="nav"` | alle 13 Projekt-Detailseiten | Weiß (cream) |
| `.scrolled` (JS-Toggle) | Alle Seiten beim Scrollen | Frosted-Glass dunkel |
| `.over-light` (JS-Toggle) | Landingpage über hellen Sektionen | Dunkel |

---

## Dateistruktur (wichtigste Dateien)

```
/
├── index.html                    # Landingpage (nav--light, Fluid-Canvas-Hero, About3D-Card)
├── about/index.html              # About-Seite (About3D-Card als Hero)
├── css/
│   ├── style.css                 # Globales CSS + Tokens
│   └── project.css               # Portfolio-Detailseiten CSS
├── js/
│   ├── main.js                   # Nav, Cursor, Tilt-Handler, Scramble, Reveal
│   └── portrait-3d.js            # Älterer separater Portrait-Tilt (nur Bild, nicht Card)
├── fonts/                        # MangoGrotesque TTF (font-display:swap)
├── images/
│   ├── kidashi-design-nicole-szatkowski-about-me-portrait-austria-tbilisi.jpg
│   ├── gallery/                  # 35 Galerie-Bilder
│   └── portfolio/                # Projektbilder
├── portfolio/
│   ├── index.html
│   ├── xp-days/                  # Animation + 12 Assets
│   ├── wh4/                      # Animation
│   ├── rohyma-jet/               # Animation + 1 Asset
│   ├── tm-studio/                # Animation + 6 Assets
│   ├── galerie-kronsbein/        # Animation + Phone-Mockup
│   ├── selvoma/                  # Animation
│   ├── hideout-georgia/          # 2 Assets
│   └── studio995/                # 2 Assets
├── CLAUDE.md                     # Code-Review-Standard (Pflichtformat)
├── robots.txt
└── sitemap.xml
```

---

## Hero — Fluid Canvas (Landingpage)

```html
<section class="hero2" id="hero2">
  <div class="hero2__sticky">
    <div class="hero2__bg" aria-hidden="true">
      <canvas id="fluid-canvas"></canvas>
    </div>
    <h1 class="hero2__h1" ...>
      <span class="hero2__static">I MAKE WORK THAT <span class="hero2__static-break">MATTERS TO</span></span>
      <span class="hero2__cycle" id="heroCycle"
            data-scramble-words='["YOU","THE PLANET","THE ALGORITHM","YOUR COMPANY","YOUR FUTURE","YOUR SUCCESS"]'>YOU</span>
    </h1>
    ...
  </div>
</section>
```

- Fluid-Partikel-Canvas im Hintergrund (kein Blob-System mehr)
- Headline-Wort wechselt per **Scramble-Decrypt-Animation** (kein Gooey-Morph mehr auf Homepage)

---

## Gooey Text Morph (Unterseiten)

```html
<!-- Unterseiten: about, contact, services, portfolio, gallery -->
<h1>The <span class="gooey-word"
  data-gooey-texts='["Designer","Strategist","Creator","Visionary"]'>Designer</span> Behind</h1>
```

**JS:** `initGooeyText(host, texts, morphTime, cooldownTime)`
**SVG-Filter:** `#gooey-threshold` — `feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"`

---

## CSS-Muster — Projekt-Hero-Varianten

```
/* Standard */          <section class="proj-hero">
/* Animation/Video */   <section class="proj-hero proj-hero--video" style="background:#HEX;">
/* Phone-Mockup */      <section class="proj-hero proj-hero--phone">
```

---

## Was diese Session (2026-06-28) gemacht wurde

```
227bc01  Add interactive 3D tilt portrait card to home & about
```

- About-Teaser (index) + About-Hero (about/) durch **About3D-Card** ersetzt
- Vanilla-Port der Aceternity 3D Card (kein React)
- Headline: „Hi. I'm Nicole." | Fließtext gekürzt | Stichpunkte links, Button rechts
- Portrait 130% gezoomt → kein grauer Rand
- Tilt nur auf Hover-Geräten + respektiert prefers-reduced-motion
- GitHub Pages deploy: ✅ grün, live

---

## Offene Aufgaben / Pending

| # | Task | Status |
|---|------|--------|
| 1 | Portfolio-Bilder für leere Projekte | ❌ Warten auf Nicole |
| 2 | artista-magazin, mystic-drops, piano-post, seestern, westgrowth-capital | ❌ Nur `.gitkeep` |

---

## Portfolio-Seiten (alle 13 Detailseiten)

`xp-days` · `wh4` · `rohyma-jet` · `tm-studio` · `galerie-kronsbein` · `seestern` · `westgrowth-capital` · `hideout-georgia` · `selvoma` · `mystic-drops` · `artista-magazin` · `piano-post` · `studio995`

**Animationen vorhanden:** xp-days · wh4 · rohyma-jet · tm-studio · galerie-kronsbein · selvoma
**Bilder vorhanden:** xp-days (12), tm-studio (6), hideout-georgia (2), studio995 (2), rohyma-jet (1)
**Bilder fehlen:** artista-magazin, galerie-kronsbein, mystic-drops, piano-post, seestern, westgrowth-capital

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo KidashiDesign/kidashi-design-website, Branch main.
Statisches HTML/CSS/JS, kein Framework. Deploy → GitHub Pages (kein Hostinger).
Bitte lies SESSION.md im Root für alle Details.
```
