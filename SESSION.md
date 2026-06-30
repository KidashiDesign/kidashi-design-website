# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-06-30

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `claude/jost-font-self-hosted-mei2v7` |
| Deploy | FTP → Hostinger (echte Live-Seite) + GitHub Pages (Preview) |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| Live-URL | `https://www.kidashidesign.com` |
| GitHub Pages | `https://kidashidesign.github.io/kidashi-design-website/` |
| Zeitzone | GMT+4 |

---

## 🚨 DEPLOY-PFLICHT — bei jeder neuen Session als ERSTES prüfen

Die echte Live-Seite liegt auf **Hostinger** (nicht GitHub Pages).
Deploy läuft automatisch via GitHub Actions Workflow `.github/workflows/deploy.yml` per FTP bei jedem Push auf `main`.

**Beim Sessionstart immer prüfen:**
1. Letzten Workflow-Run auf `main` checken → `mcp__github__actions_list`
2. Wenn "Deploy to Hostinger" = `failure` → sofort melden und `rerun_failed_jobs` auslösen
3. Secrets die dafür gesetzt sein müssen (in GitHub Repo Settings → Secrets):
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
4. Wenn Secrets fehlen → Inhaberin auffordern sie in GitHub Repo Settings → Secrets einzutragen (Werte aus Hostinger hPanel → Hosting → FTP-Konten)

**Merke:** GitHub Pages Deploy kann grün sein, aber Hostinger trotzdem rot — Inhaberin schaut immer auf www.kidashidesign.com, nicht auf github.io!

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Projekt Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- **Esports-Projekt** → nur als „Freelance-Collaboration mit einem Esports-Event-Veranstalter" erwähnen, nie mit Kundennamen
- Keine privaten Kontaktdaten von Kunden sichtbar
- Kontakt-E-Mail nur als HTML-Kommentar, nie direkt auf der Seite

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

## Dateistruktur

```
/
├── index.html                    # Landingpage (JSON-LD Schema vorhanden)
├── css/
│   ├── style.css                 # Globales CSS + Tokens + Cookie-Banner CSS
│   └── project.css               # Portfolio-Detailseiten CSS
├── js/main.js                    # Nav, Cursor, Cookie-Banner, ZP-Animation, Footer-GDPR
├── fonts/
│   ├── MangoGrotesque-*.ttf      # Headline-Font (self-hosted ✓)
│   ├── Jost-Variable.ttf         # Body-Font (self-hosted ✓)
│   └── Jost-Italic-Variable.ttf  # Body-Font Italic (self-hosted ✓)
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

## Was zuletzt gemacht wurde (2026-06-30)

### Jost Font — Self-Hosted
- Google Fonts `@import` aus `css/style.css` entfernt
- `fonts/Jost-Variable.ttf` (132 KB) + `fonts/Jost-Italic-Variable.ttf` (142 KB) eingebunden
- Zwei `@font-face`-Regeln mit `font-weight: 100 900` und `font-display: swap`
- Google Fonts Preconnect-Links müssen noch aus allen HTML-Seiten entfernt werden

### TM Studio Animation — Error-Fix
- dc-runtime JS hatte `s.integrity` + `s.crossOrigin` beim dynamischen React-Laden von unpkg.com gesetzt
- SRI-Hash-Mismatch verursachte `window.React is not available yet` Error-Overlay
- Fix: integrity + crossOrigin aus `loadScript()` entfernt (gzip-Patch im eingebetteten Bundle)

---

## Offene Aufgaben

| # | Task | Status |
|---|------|--------|
| 1 | Google Fonts Preconnect-Links aus allen HTML-Seiten entfernen | ❌ Offen |
| 2 | Cookie-Banner-Text: Google Fonts Erwähnung entfernen (`js/main.js`) | ❌ Offen |
| 3 | Datenschutz: Google Fonts Abschnitt entfernen (`datenschutz/index.html`) | ❌ Offen |
| 4 | Testimonials: echte Kundenstimmen + Fotos eintragen | ❌ Warten auf Inhaberin |
| 5 | Google Analytics einbauen | ❌ Warten auf Measurement-ID |

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
claude/jost-font-self-hosted-mei2v7. Statisches HTML/CSS/JS, Hostinger-Deploy.
Lies SESSION.md im Root für alle Infos.
```
