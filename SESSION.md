# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-06-29

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `claude/kidashi-design-website-1j16mj` |
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
1. Letzten Workflow-Run auf `main` checken → `mcp__github__actions_list`
2. Wenn "Deploy to Hostinger" = `failure` → sofort melden und `rerun_failed_jobs` auslösen

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Kein KI-Workflow sichtbar** auf der öffentlichen Seite (Nicole = echter Mensch, zertifizierter Designer)
- **Kein Name „Gianluca Crepaldi"** — nur „Freelance-Collaboration mit einem Esports-Event-Veranstalter"
- **Projekt Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- Keine privaten Kontaktdaten von Kunden sichtbar
- `nicole@kidashidesign.com` nur als HTML-Kommentar, nie auf der Seite
- Nicole ist **in Georgien steueransässig**, in Deutschland vollständig abgemeldet → keine deutschen Behörden in Impressum/Datenschutz erwähnen

---

## CSS Design Tokens (aus `css/style.css`)

```css
--font-h: 'Mango Grotesque'      /* Headlines */
--font-b: 'Jost'                  /* Body/UI */
--dark:   #0A0A0B
--cream:  #F7F3EE
--bg:     #FAF9F5
--bg2:    #F3EFE8
--sand:   #E8E2D9
--primary: #2E54FE (Blau)
--accent:  #FFBC95 (Orange)
--muted:   rgba(10,10,11,0.45)
--nav-h:   4rem
--gutter:  clamp(1.5rem, 5vw, 5rem)
```

---

## Nav-Farbsystem

| Klasse | Verwendung | Textfarbe |
|--------|-----------|-----------|
| `class="nav"` | Landingpage + alle Projekt-Detailseiten | Weiß (cream) |
| `class="nav nav--light"` | portfolio/index, about, services, contact, gallery | Dunkel |
| `.scrolled` (JS-Toggle) | Alle Seiten beim Scrollen | Frosted-Glass dunkel |

---

## 🔴 PRIORITÄT 1 — NÄCHSTE SESSION: Google Fonts → Self-Hosted

Nicole hat diese TTF-Dateien in `fonts/` auf `main` hochgeladen:
- `fonts/Jost-VariableFont_wght.ttf` — Variable Font, alle Weights 100–900
- `fonts/Jost-Italic-VariableFont_wght.ttf` — Variable Font Italic

**4 Schritte zum Umstellen:**

**Schritt 1 — `@font-face` in `css/style.css` ergänzen** (ganz oben):
```css
@font-face {
  font-family: 'Jost';
  src: url('../fonts/Jost-VariableFont_wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Jost';
  src: url('../fonts/Jost-Italic-VariableFont_wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}
```

**Schritt 2 — Google Fonts CDN aus ALLEN HTML-Seiten entfernen:**
Diese 4 Zeilen (Varianten je nach Pfadtiefe) in jeder HTML-Datei löschen:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Jost..." as="style" onload="this.rel='stylesheet'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Jost..." rel="stylesheet"></noscript>
```
Betrifft: `index.html`, `about/`, `services/`, `contact/`, `portfolio/index.html`, `gallery/`, `datenschutz/`, `impressum/`, und alle 13 Portfolio-Detailseiten.

**Schritt 3 — Cookie-Banner-Text updaten** (`js/main.js` ~Zeile 820):
```
VORHER: "...We use Google Fonts (font data loaded from Google servers) and our hosting provider..."
NACHHER: "...Our hosting provider stores standard server logs (IP address, timestamp) for security purposes..."
```

**Schritt 4 — Datenschutz updaten** (`datenschutz/index.html`):
Abschnitt `<h2>Google Fonts</h2>` komplett entfernen (Schrift ist jetzt lokal, kein Datentransfer mehr).

---

## Dateistruktur

```
/
├── index.html                    # Landingpage (JSON-LD Schema vorhanden)
├── css/
│   ├── style.css                 # Globales CSS + Tokens + Cookie-Banner CSS
│   └── project.css               # Portfolio-Detailseiten CSS
├── js/main.js                    # Nav, Cursor, Cookie-Banner, ZP-Animation, Footer-GDPR
├── fonts/
│   ├── MangoGrotesque-*.woff2    # Headline-Font (self-hosted ✓)
│   ├── Jost-VariableFont_wght.ttf        # Body-Font — hochgeladen, noch NICHT eingebunden
│   └── Jost-Italic-VariableFont_wght.ttf # Body-Font Italic — hochgeladen, noch NICHT eingebunden
├── portfolio/
│   ├── index.html
│   ├── art-gerecht-modular/ · xp-days/ · tm-studio/ · galerie-kronsbein/
│   ├── rohyma-jet/ · hideout-georgia/ · studio995/ · selvoma/
│   ├── seestern/ · mystic-drops/ · artista-magazin/ · piano-post/
│   └── westgrowth-capital/
├── about/ · services/ · contact/ · gallery/
├── datenschutz/ · impressum/
├── sitemap.xml                   # 19 URLs, lastmod 2026-06-29
└── robots.txt
```

---

## Was heute gemacht wurde (2026-06-29)

### PR #49 — ZP-Animation + TM Studio (gemergt)
- About Me ZP: Bilder zentriert + vergrößert, himalaya-mountains (z-index:10) über jungle-rest gelegt
- Alle 7 Alt-Texte auf tatsächlichen Bildinhalt korrigiert
- TM Studio Animation: Reihenfolge Logo → Visitenkarten → Banner

### PR #50 — DSGVO / Cookie-Banner (gemergt)
- Cookie/Privacy-Notice-Banner (JS-injiziert via main.js, localStorage, alle Seiten)
- Kontaktformular: Datenschutzhinweis unter Submit-Button
- Footer-Newsletter: GDPR-Micro-Notice per JS auf allen Seiten
- Datenschutzseite: Abschnitte Kontaktformular, Newsletter, Hosting, Google Fonts, Rechte (Art. 15–22)
- Impressum: E-Mail-only (kein Telefon), IHK, BayLDA-Referenz entfernt (Georgia)
- Sitemap: datenschutz/impressum raus (noindex), art-gerecht-modular rein, lastmod
- JSON-LD ProfessionalService + Person Schema auf index.html

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
claude/kidashi-design-website-1j16mj. Statisches HTML/CSS/JS, Hostinger-Deploy.
Lies SESSION.md im Root. Priorität: Jost-Font auf self-hosted TTF umstellen
(alle Details in SESSION.md unter "PRIORITÄT 1").
```
