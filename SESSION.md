# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-07-01

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `main` |
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

## Was in dieser Session gemacht wurde (2026-07-01)

### A11y + Hardening: Testimonials & Floating-Szene ✅
- `prefers-reduced-motion` respektiert: Floating-Szene (About), Testimonial-Drag-Transitions (Home + Services)
- Avatar-Bild-ID vor Interpolation in `pravatar.cc`-URL sanitized
- `loading="lazy"` + `decoding="async"` bei Testimonial-Avataren ergänzt
- Commit `99943a7`

### Testimonials: Homepage-Sektion entfernt ✅
- Komplette Testimonials-Section (inkl. Drag-to-Shuffle-Script) von `index.html` entfernt
- Bleibt unverändert auf `services/index.html`
- Commit `09a4689`

### Glow-Card-Effekt (Mouse-Tracking-Spotlight) ✅
- Neuer `[data-glow]`-CSS/JS-Mechanismus: radialer Spotlight-Rahmen folgt der Maus, Hue verschiebt sich mit horizontaler Position
- Farb-Mapping: `blue` (#2E54FE-Bereich), `orange` (Accent), `purple`, `green`, `red`
- Eingesetzt auf: allen 16 Portfolio-Kacheln (`portfolio/index.html`) + den 4 "My Path"-Sidebar-Karten auf `about/index.html` (Education/Experience/Services/Currently Based)
- Selektor bewusst generisch gehalten (`[data-glow]`, nicht `.portfolio-item[data-glow]`), damit er auf beliebige Elemente anwendbar ist
- Commits `eff6637`, `a608b06`

### Seestern Britzer Garten — Animation gebaut & eingebunden ✅
- 4 vom Kunden gelieferte DC-Runtime-Exports (Start-Animation, Hero-Strip, Rotating Badge, Endscreen) zu **einer** Sequenz kombiniert: Start (Foto-Reveal ~4s) → Strip mit 5 Panels + rotierendem Badge (~11s) → Endscreen (~4.6s) → Loop
- Bilder von PNG auf WebP komprimiert (Originale bis zu 10MB/Bild → kombiniertes Bundle ~1.5MB, in Linie mit bestehenden Animationen)
- Neue Datei: `portfolio/seestern/seestern-animation.html`
- Eingebunden in Portfolio-Kachel + Projekt-Hero (`portfolio/seestern/index.html`) — dabei 2 fehlende `</div>` im bestehenden Hero-Markup mitgefixt
- Respektiert `prefers-reduced-motion` (zeigt dann nur den statischen Endscreen)
- Commit `a608b06`
- **Getestet mit Playwright** (unpkg.com für React/Babel ist in dieser Sandbox durch Org-Policy blockiert → lokal mit `page.route()` gemockt, um die DC-Runtime zu verifizieren. Auf der echten Live-Seite lädt React normal von unpkg.com.)

---

## DC Runtime Animation Bundles — erweiterte Hinweise

Mehrere DC-Runtime-Bundles lassen sich zu einer neuen Sequenz kombinieren:
1. `__bundler/template` jedes Bundles einzeln als JSON dekodieren (`json.loads`, nie Regex)
2. Bilder/Fonts/JS-Assets aus allen Quell-Manifesten in ein gemeinsames Manifest mergen (Duplikate wie `dc-runtime.js`/`gsap.js` nur einmal übernehmen — Hash-Vergleich zeigt, ob mehrere Bundles dieselbe Library referenzieren)
3. Eigenes kombiniertes Template schreiben: mehrere „Szenen"-`<div>`s absolut gestapelt, per `ref`-Callback + direkter DOM-Style-Manipulation ein-/ausblenden (kein Verlass auf unbekannte `{{ }}`-Bedingungslogik)
4. **Kritisch:** nach `json.dumps(template)` alle `/` durch `/` ersetzen (nicht nur `</script>`!) — das Original-Tool escaped pauschal jeden Slash im Template-JSON, sonst bricht der HTML-Parser das Script-Tag ab
5. Große Quellbilder (>1MB) vor dem Einbetten mit Pillow auf WebP komprimieren (`quality=82-88`, `method=6`), sonst wird das Bundle unnötig groß

---

## Offene Aufgaben

| # | Task | Status |
|---|------|--------|
| 1 | **Hostinger Deploy schlägt fehl** (FTP-Secrets fehlen: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`) | 🔴 Blockiert Live-Deploy seit mehreren Sessions — Inhaberin muss Secrets in GitHub Repo Settings → Secrets → Actions eintragen |
| 2 | Testimonials: echte Kundenstimmen + Fotos (aktuell nur auf Services-Seite, Platzhalter-Daten) | ⏳ Warten auf Inhaberin |
| 3 | Google Analytics GA4 | ⏳ Warten auf Measurement-ID |
| 4 | Seestern: Bilder für Portfolio-Detailseite (Merch/Print-Fotos) fehlen noch, nur Hero-Animation vorhanden | ⏳ Warten auf Inhaberin |

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
main. Statisches HTML/CSS/JS, Hostinger-Deploy (aktuell rot, Secrets fehlen).
Lies SESSION.md im Root für alle Infos.
```
