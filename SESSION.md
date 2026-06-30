# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-06-30

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `fix/tm-studio-animation-comments` |
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

## DC Runtime Animation Bundles — Wichtige Hinweise

Die Portfolio-Animationsdateien (`*-animation.html`) sind DC Runtime Bundles:
- `<script type="__bundler/manifest">` — Base64-kodierte Bilddaten (groß, nicht anfassen)
- `<script type="__bundler/template">` — JSON-kodiertes HTML+CSS+JS (hier werden Änderungen gemacht)

**Kritisch beim Bearbeiten:**
- Template-JSON immer mit `json.JSONDecoder().raw_decode()` lesen (nicht regex-basiert!)
- Nach `json.dumps()` zwingend `<\/` → `<\\u002F` ersetzen, sonst bricht der HTML-Parser den Script-Tag ab
- Niemals Python regex-Substitution direkt auf das Template-JSON anwenden

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

## Was in dieser Session gemacht wurde (2026-06-30)

### Jost Font — Self-Hosted ✅
- Google Fonts CDN-Links aus allen 23 HTML-Seiten entfernt
- `@font-face` mit Variable TTF in `css/style.css`
- Cookie-Banner-Text + Datenschutz-Seite aktualisiert

### Testimonials — Services & Homepage ✅
- Draggable Card-Stack auf `services/index.html` hinzugefügt
- Glassmorphism-Effekt (`backdrop-filter: blur`) auf beiden Seiten

### TM Studio Animation — Komplett-Fix ✅
- **Root cause:** Python-Skript hatte `</script>` im Template-JSON nicht als `</script>` escaped → HTML-Parser brach JSON nach 185 Zeichen ab → DC Runtime "Bundle unpack error"
- Template aus Original-Commit `08bbdb2` wiederhergestellt
- Animationsreihenfolge korrekt: **Logo (0–27%) → Visitenkarten (27–67%) → Banner (69–98%)**
- Commit `3e57575` auf `main`

### Selvoma Slideshow ✅
- `object-fit: contain` → Bilder vollständig sichtbar (kein Abschneiden)
- Border-radius: 26px → 12px
- Timing: 6s → 5s pro Slide
- Commit `5ce32c7` auf `main`

---

## Offene Aufgaben

| # | Task | Status |
|---|------|--------|
| 1 | Testimonials: echte Kundenstimmen + Fotos | ⏳ Warten auf Inhaberin |
| 2 | Google Analytics GA4 | ⏳ Warten auf Measurement-ID |
| 3 | Hostinger Deploy-Secrets prüfen (bei Sessionstart) | ⚠️ Immer checken |

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
fix/tm-studio-animation-comments. Statisches HTML/CSS/JS, Hostinger-Deploy.
Lies SESSION.md im Root für alle Infos.
```
