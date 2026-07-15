# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-07-15

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `claude/portfolio-animations-mobile-z12e04` |
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

## CSS Design Tokens (aus `css/style.css`)

```css
--font-h: 'Mango Grotesque'      /* Headlines */
--font-b: 'Jost'                  /* Body/UI */
--dark:   #0A0A0B
--cream:  #F7F3EE
--bg:     #FAF9F5 (heller Hintergrund)
--bg2:    #F3EFE8
--sand:   #E8E2D9
--primary: #2E54FE (Blau)
--accent:  #FFBC95 (Orange)
--muted:   rgba(10,10,11,0.45)
--nav-h:   4rem (Nav-Höhe)
--gutter:  clamp(1.5rem, 5vw, 5rem)
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
│   ├── style.css                 # Globales CSS + Tokens
│   └── project.css               # Portfolio-Detailseiten CSS
├── js/main.js                    # Nav-Scroll, Cursor, Animationen
├── portfolio/
│   ├── index.html                # Portfolio-Übersicht (nav--light, 4-col grid)
│   └── xp-days/
│       ├── index.html            # XP-Days Detailseite
│       └── xp-days-animation.html  # Selbst-enthaltene Animation (805KB, alle Bilder als Data-URI eingebettet)
├── images/portfolio/xp-days/    # 12 JPEG-Assets vorhanden
├── CLAUDE.md                     # Code-Review-Standard (Pflichtformat)
├── robots.txt
└── sitemap.xml                   # 21 URLs
```

---

## Session 2026-07-15 — Portfolio-Animationen Mobile-Fixes

**Branch:** `claude/portfolio-animations-mobile-z12e04` (gepusht, noch kein PR eröffnet)
**Auftrag:** Portfolio-Animationen auf Mobile optimieren — Ziel: Animationen vollständig anzeigen ohne Anschneiden, Layout auf allen 13 Projekt-Detailseiten geprüft.

### Gefundene & behobene Bugs (4 Commits)

1. **Rohyma-Jet-Animation croppte auf Mobile** (`portfolio/rohyma-jet/rohyma-jet-animation.html`)
   Eigene (nicht-Stage-basierte) Komponente skalierte den festen 1920×1080-Canvas mit
   `Math.max(innerWidth/1920, innerHeight/1080)` = Cover-Fit → schnitt auf jedem
   Nicht-16:9-Viewport (jedes Handy-Hochformat) Ränder ab.
   **Fix:** `Math.max` → `Math.min` (Contain-Fit, kommt 2× vor: Kommentar + tatsächlicher Code).

2. **Video-Hero-Breakpoint zu eng** (`css/project.css`, `.proj-hero--video .proj-hero__video-wrap`)
   16:9-`aspect-ratio`-Regel galt nur bis `max-width:600px`. Zwischen 600–900px (große
   Phones/kleine Tablets im Querformat) blieb `height:100svh` aktiv → Container passte
   nicht mehr zum 16:9-Ursprungsformat. Breakpoint auf 900px erweitert.

3. **XP-Days-Animation: falscher Maßstab** (`portfolio/xp-days/xp-days-animation.html`,
   gzip-komprimierte Stage-Komponente, UUID `a81fe188`)
   `measure()` zog weiterhin `barH = 44` (Reserve für die längst entfernte Scrubber-Leiste)
   von `clientHeight` ab, bevor der Fit-Faktor berechnet wurde → Animation wurde auf Mobile
   minimal zu klein skaliert (unnötiger schwarzer Rand). `barH`-Subtraktion entfernt.

4. **Titel überlappt "Visual Coming Soon"-Platzhalter auf 8 Detailseiten**
   (artista-magazin, galerie-kronsbein, hideout-georgia, mystic-drops, piano-post,
   selvoma, studio995, westgrowth-capital)
   Platzhaltertext war zentriert über die volle `100svh`-Hero-Höhe absolut positioniert,
   während Titel + Meta-Strip unten verankert sind (`justify-content:flex-end`). Bricht
   der Titel auf schmalen Viewports zweizeilig um (z.B. "Westgrowth Capital"), wächst er
   so weit nach oben, dass er den Platzhalter überlagert.
   **Fix:** Inline-Style → neue Klasse `.proj-hero__placeholder` in `css/project.css`,
   ab `max-width:900px` komplett ausgeblendet (rein dekorativ, auf Desktop unverändert
   sichtbar).

### Geprüft, aber unauffällig
- **xp-days Stage-Komponente:** nutzt bereits `ResizeObserver` + `Math.min(clientWidth/w, clientHeight/h)` = korrekter Contain-Fit (abgesehen vom barH-Bug oben).
- **wh4, tm-studio:** komplett fluid mit `clamp()`/`vmin`, kein fixer Canvas → kein Crop-Risiko.
- **seestern:** eigene handgeschriebene Animation (kein Figma-Bundle-Export), ebenfalls fluid mit `clamp()`/`vw`/`vh`.
- **Portfolio-Grid-Tile-Crop** (`portfolio-card__anim`, 16:9→4:3 auf der Landingpage): bewusstes Cover-Thumbnail-Design, mathematisch identisches Seitenverhältnis wie das Iframe selbst → von den Fixes nicht betroffen.

### Offen für nächste Session
- Live/Preview auf echtem Mobilgerät gegentesten (Sandbox hat keinen Netzwerkzugriff, Bundle-Runtime lädt lokal nicht vollständig — `[bundle] error` beim lokalen Testen ist erwartbar und kein echter Bug).
- Ggf. PR für `claude/portfolio-animations-mobile-z12e04` öffnen (bisher nur gepusht, PR-Erstellung nicht angefragt).
- Playwright ist im Sandbox-Image vorhanden, aber `NODE_PATH=/opt/node22/lib/node_modules` muss gesetzt werden (globales npm-Modul, nicht lokal installiert). Chromium-Pfad: `/opt/pw-browsers/chromium`.

---

## Was diese Session gemacht wurde

### Commits (neueste zuerst)
```
28e37de  Simplify video hero CSS: remove redundant declarations
8fc9b08  Full-screen animation hero, hide playback bar, light nav
5007615  Add CLAUDE.md: code review standard
47c173c  Replace XP-Days animation (self-contained, images inlined)
a7c147e  Embed XP-Days animation as 16:9 video hero
2cd9bf5  Add animated hero to XP-Days project page
6865735  Fix nav text color on all 13 project pages → white
a50ea5c  Fix portfolio index preview images
3f73dae  Fix next-project images
4effc6c  Add robots.txt + sitemap.xml
```

### Technische Details — XP-Days Animation
- `xp-days-animation.html` = Claude Design Export (Bundle-Format)
- Bundle-Struktur: `<script type="__bundler/manifest">` JSON mit 22 Einträgen (3 JS/JSX, 19 fonts)
- Bilder (logo, logoWhite, banner, cup, gewinnspiel) als base64 Data-URIs in UUID `ca7c7755`
- PlaybackBar (Scrubber) entfernt: UUID `a81fe188` (animations.jsx gzip) wurde gepacht
- Python-Patch-Methode: `base64.b64decode → gzip.decompress → str.replace → gzip.compress → base64.b64encode`

### CSS-Muster — Projekt-Hero-Varianten
```css
/* Standard-Hero (Bild-Hintergrund, dunkle Überlagerung) */
<section class="proj-hero">

/* Video/Animation-Hero (Vollbild-Iframe) */
<section class="proj-hero proj-hero--video" style="background:#06120D;">
  <div class="proj-hero__eyebrow"> <!-- absolut über dem Video -->
  <div class="proj-hero--video .proj-hero__video-wrap"> <!-- height: 100svh -->
    <iframe class="proj-hero__video-frame" ...>
  </div>
  <div class="proj-hero__content"> <!-- fließt nach dem Video -->
```

---

## Code-Review-Standard (`CLAUDE.md`)

Bei jeder Fehleranalyse:
1. Kritische Fehler (Security/Crash) zuerst
2. Zeile · Erklärung · Fix für jeden Fehler
3. Optimierungen mit Aufwand / Nutzen-Rating
4. Gesamtbewertung 1–10 + Top 3 Maßnahmen
5. Vorher / Nachher-Beispiele

Slash-Kommandos: `/simplify` = Vereinfachung, `/code-review` = Fehlersuche

---

## Offene Aufgaben / Pending

| # | Task | Status |
|---|------|--------|
| 1 | PR #1 mergen für Live-Deployment → https://github.com/KidashiDesign/kidashi-design-website/pull/1 | ❌ Offen |
| 2 | Portfolio-Bilder für 8 leere Projekte | ❌ Warten auf Nicole |
| 3 | artista-magazin, galerie-kronsbein, mystic-drops, piano-post, seestern, selvoma, westgrowth-capital, wh4 | ❌ Nur `.gitkeep` |

---

## Portfolio-Seiten (alle 13 Detailseiten)

`xp-days` · `wh4` · `rohyma-jet` · `tm-studio` · `galerie-kronsbein` · `seestern` · `westgrowth-capital` · `hideout-georgia` · `selvoma` · `mystic-drops` · `artista-magazin` · `piano-post` · `studio995`

**Bilder vorhanden:** xp-days (12), tm-studio (6), hideout-georgia (2), studio995 (2), rohyma-jet (1)
**Bilder fehlen:** artista-magazin, galerie-kronsbein, mystic-drops, piano-post, seestern, selvoma, westgrowth-capital, wh4

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
claude/epic-curie-r5ed0o. Statisches HTML/CSS/JS, GitHub Pages.
Lies SESSION.md im Root für alle Infos.
```
