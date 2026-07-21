# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-07-21

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `claude/session-uvyxdk` |
| Deploy | FTP → Hostinger (**aktuell defekt**, siehe unten) + GitHub Pages (Preview) + **Cloudflare Pages** (neu, `https://kidashi-design-website.pages.dev/`) |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| Live-URL | `https://www.kidashidesign.com` (Hostinger, Deploy aktuell rot) |
| Neue Live-URL (Nicole, seit 21.07.) | `https://kidashi-design-website.pages.dev/` — Cloudflare Pages. **Nicht erreichbar aus der Sandbox** (Proxy/Netzwerkrichtlinie blockt `pages.dev`, 403 sowohl via curl als auch WebFetch). Keine Cloudflare-Config im Repo gefunden (kein `wrangler.toml`, kein `.github/workflows` dafür) → vermutlich über Cloudflare-eigene GitHub-App direkt an einen Branch gekoppelt (wahrscheinlich `main`), nicht über ein Repo-File steuerbar. **Noch ungeklärt: welchen Branch Cloudflare Pages genau beobachtet** — mit Nicole klären. |
| Referenz/Staging-URL (Nicole) | `https://workspace.kidashidesign.com` — **nicht erreichbar aus der Sandbox** (Proxy blockt, 403, auch via Chromium direkt: `ERR_TUNNEL_CONNECTION_FAILED`) |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |

---

## 🚨 KRITISCH: Hostinger FTP-Deploy ist seit mind. 16.07. defekt (Stand 21.07.)

**Root Cause bestätigt (Job-Logs geprüft):** `Deploy via FTP`-Step scheitert mit `mirror: Not connected`.
Im Log erscheinen `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` als **leer** — die GitHub-Secrets fehlen
oder sind falsch benannt/leer. Mind. 3 aufeinanderfolgende Runs auf `main` fehlgeschlagen (16.07., 17.07., 19.07.).

**Konsequenz:** `www.kidashidesign.com` (Hostinger) liefert seit dem möglicherweise veralteten Code aus —
z. B. noch die alte Google-Fonts-CDN-Einbindung, obwohl der Code in `main` bereits gefixt ist (siehe unten).
Für Nicoles DSGVO-Ziel (deutsche Kunden) ist das der eigentliche Blocker, nicht der Code.

**Ich kann das nicht selbst fixen** (kein Zugriff auf GitHub-Repo-Secrets). Nicole muss:
1. GitHub → Repo Settings → Secrets and variables → Actions
2. Prüfen/neu setzen: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (aktuelle Hostinger-FTP-Zugangsdaten)
3. Danach Workflow-Re-Run auslösen lassen (`mcp__github__actions_get` / rerun) und Live-Seite verifizieren

**Offen seit 21.07., noch nicht behoben — bei jedem Sessionstart erneut prüfen, ob das erledigt wurde.**

---

## 🚨 DEPLOY-PFLICHT — bei jeder neuen Session als ERSTES prüfen

Deploy läuft automatisch via GitHub Actions Workflow `.github/workflows/deploy.yml` per FTP bei jedem Push auf `main`.

**Status per 2026-07-02: 🔴 Deploy schlägt fehl.**
Geprüft für mehrere aufeinanderfolgende Commits (`98f5340`, `37fe1c93`) — Workflow läuft nur ~20 Sekunden und bricht ab mit:
```
env: FTP_SERVER: (leer)  FTP_USERNAME: (leer)  FTP_PASSWORD: (leer)
mirror: Not connected
##[error]Process completed with exit code 1.
```
**Root Cause:** Die drei GitHub Secrets sind nicht gesetzt. Das ist kein Code-Problem — ein `rerun_failed_jobs` würde identisch fehlschlagen. **Nicht sinnlos rerunnen.**

**Beim Sessionstart immer prüfen:**
1. Letzten Workflow-Run auf `main` checken → `mcp__github__actions_list` (list_workflow_runs)
2. Wenn "Deploy to Hostinger" = `failure` → sofort melden (siehe Abschnitt oben — bekannter, noch offener Bug)
3. Secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (GitHub Repo Settings → Secrets)
4. Zusätzlich: Cloudflare Pages (`kidashi-design-website.pages.dev`) prüfen/im Blick behalten — Details oben.

**Merke:** GitHub Pages Deploy kann grün sein, aber Hostinger trotzdem rot.

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Kein KI-Workflow sichtbar** auf der öffentlichen Seite (Nicole = echter Mensch, zertifizierter Designer)
- **Esports-Projekt** → nur als „Freelance-Collaboration mit einem Esports-Event-Veranstalter" erwähnen, nie Kundenname
- **Projekt Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- Keine privaten Kontaktdaten von Kunden sichtbar
- Kontakt-E-Mail nur als HTML-Kommentar, nie direkt auf der Seite
- PR-Beschreibungen und Commit-Messages: **keine** AI-Zuschreibungen im sichtbaren Seiten-Content (Commit-Trailer mit Co-Authored-By sind ok, das ist Git-Metadata, keine Seite)

---

## ⚠️ WICHTIG: Dieser Branch war 135 Commits hinter `main`

`claude/fullscreen-animation-responsive-lxc04m` zweigte von einem alten Stand ab und hat eigene Commits
(u.a. Löschung von `portfolio/piano-post`, `portfolio/mystic-drops`, `portfolio/artista-magazin`).
`main` hat seitdem u.a. `portfolio/art-gerecht-modular` neu bekommen — das fehlte auf diesem Branch
komplett (deshalb "unsichtbar" für Nicole). **Nicht blind `main` mergen** (würde die bewusst gelöschten
Ordner zurückbringen) — bei Bedarf gezielt einzelne Ordner via `git checkout origin/main -- <pfad>` holen,
wie in dieser Session für `art-gerecht-modular` gemacht.

`portfolio/index.html` auf diesem Branch verlinkt noch tote Pfade zu `mystic-drops/`, `artista-magazin/`,
`piano-post/` (Ordner existieren nicht mehr) — nicht in dieser Session angefasst, aber bekannt.

---

## Diese Session: Art Gerecht Modular — Vollbild-Animation

**Auftrag:** Hero-Animation auf `portfolio/art-gerecht-modular/` soll auf Desktop/Tablet/Mobile randlos
(oben/unten/links/rechts) füllen, vorladen, und alle 6 Slides sollen als EINE flüssige Animation wirken.
Später erweitert: auch die Grid-Kachel in `portfolio/index.html` soll bildschirmfüllend sein.

### Bereits committed & gepusht (Commit `50814f4`)
1. `portfolio/art-gerecht-modular/` komplett von `origin/main` übernommen (existierte auf diesem Branch nicht).
2. **CSS-Bug gefunden & gefixt** (`css/project.css`): Mobile-Breakpoint (≤600px) zwang alle
   `.proj-hero--video` Hero-Animationen in eine 16:9-Box statt Vollbild. Neue Opt-in-Klasse
   `.proj-hero--video-fill` hinzugefügt (nur für dieses Projekt, andere Projekte unangetastet).
3. **Markup-Bug gefunden & gefixt** (`portfolio/art-gerecht-modular/index.html`): Loser
   `.proj-hero__back--top` Link (keine CSS-Regel existierte dafür!) stand im normalen Dokumentfluss
   vor dem Video-Wrapper und schob die Animation ~27px vom oberen Rand weg. Ersetzt durch das
   Standard-Muster `.proj-hero__eyebrow` (wie bei wh4, tm-studio, …) — jetzt `y:0` auf allen Breakpoints
   verifiziert (390×844 mobil, 820×1180 tablet, 1440×900 desktop, per Playwright computed-style-Check).
4. **Sequencer verbessert** (`artgerecht-animation.html`): Nächste Szene wird jetzt während der
   Haltezeit der aktuellen Szene bereits unsichtbar vorgeladen (statt nur `<link rel=prefetch>` +
   Reload im exakten Wechselmoment) → kein Blank-Flash mehr beim Crossfade. `.stage` von `100vh` auf
   `100%` (robuster in verschachtelten iframes). Crossfade-Dauer 0.7s → 0.9s.
5. Fehlende Grid-Kachel in `portfolio/index.html` ergänzt (Position zwischen Galerie Kronsbein und
   Seestern, gleiches Muster wie TM Studio: `<iframe ... ?tile=1>`).

Alles verifiziert per lokalem `python3 -m http.server` + Playwright-Core (headless Chromium aus
`/opt/pw-browsers/`) — Screenshots + `getBoundingClientRect()`/computed-style-Checks für 3 Viewports.

### 🔴 NICHT committed — laufende Untersuchung (Kachel-Ansicht füllt intern noch nicht randlos)

Nutzer meldete danach: Kachel-Ansicht UND Detailseite sollen "bildschirmfüllend" sein. Detailseite ist
strukturell bestätigt korrekt (Iframe-Box füllt exakt 100% × 100%). Kachel-Iframe-Box füllt ebenfalls
exakt die 4:3-Kachel (`.portfolio-item__anim` mit `width:133.4%; left:-16.7%`-Crop-Trick, bereits
vorhandenes CSS-Muster, unverändert korrekt).

**Der eigentliche Rest-Bug liegt in den 6 Szenen-Dateien selbst** (`artgerecht-01…06`), die aus einem
proprietären "Omelette/DC-Bundler"-Export stammen (`<script type="__bundler/manifest">`, riesige
JSON-Blobs, `<x-import>`/`<x-dc>`-Custom-Elements, `#__bundler_thumbnail`-Fallback-SVG). Wichtiger
Fund in dieser Session: **Es wird NICHT extern von unpkg.com geladen** (frühere Annahme war falsch) —
der Renderer ist selbst-enthalten. Live-DOM-Inspektion (`artgerecht-02-modular-reveal.html`, lokal
über `http.server` + Playwright) zeigt:

```html
<svg width="1920" height="1080" style="transform: scale(0.237037); transform-origin: center center; ...">
  <foreignObject x="0" y="0" width="100%" height="100%">
    <div style="width:1920px; height:1080px; ...">…die eigentliche Szene…</div>
  </foreignObject>
</svg>
```

D.h. der interne Renderer zeichnet die Szene IMMER auf eine feste 1920×1080-Leinwand und skaliert sie
per CSS `transform: scale(x)` gleichmäßig (ein einzelner Skalierungsfaktor) so, dass sie in den
Container **passt** (contain/letterbox-Verhalten) — nicht **crop-fill/cover**. Das erzeugt genau die
schwarzen Balken oben/unten, die im Kachel-Screenshot sichtbar waren (Kachel-Seitenverhältnis ≠ 16:9
bei manchen Kachelgrößen/Slides). Das ist der wahrscheinliche Kern des User-Feedbacks.

**Bereits (unkommitiert!) geänderte, sichere Fixes an den 6 Szenen-Dateien** (nur die statischen
Fallback-`<svg>`-Elemente, NICHT der interne DC-Renderer/Manifest-Blob):
- `preserveAspectRatio="xMidYMid slice"` auf jedes Fallback-`<svg viewBox="0 0 100 100|1200 800">`
  ergänzt (betrifft `#__bundler_thumbnail`, den Platzhalter vor/bei Render-Fehler).
- `object-fit: contain` → `cover` in der `#__bundler_thumbnail svg` CSS-Regel (alle 6 Dateien).
- `artgerecht-05-brochure-mockup.html`: Template-HTML für das Mockup-Bild von
  `padding:24px; max-width:1500px; height:auto` (gerahmt/eingerückt) auf `position:absolute; inset:0;
  object-fit:cover` (randlos, croppt das Bild) umgestellt — **Achtung: das ist eine Design-Änderung**,
  das Broschüren-Mockup wird jetzt beschnitten statt komplett sichtbar mit Rand gezeigt. Mit Nicole
  ggf. gegenprüfen, ob das gewünscht ist.

**Diese Fallback-SVG-Fixes lösen NICHT das eigentliche `transform:scale()`-Letterboxing im echten
DC-Renderer** — das sitzt im großen `__bundler/manifest`-JSON-Blob (>1 MB pro Datei) und in einer
kompilierten JSX-Komponente, die nicht sicher von Hand editierbar ist, ohne das Bundle zu riskieren.

### Nächste Schritte (offen)
1. Entscheiden: Soll der `transform:scale()`-Letterbox-Mechanismus im DC-Renderer angegangen werden?
   Dafür müsste der genaue Skalierungscode im Manifest-Blob lokalisiert werden (z. B. Suche nach
   `"scale("`, `getBoundingClientRect`, `Math.min(` im dekodierten Manifest — noch nicht gemacht).
   Hohes Risiko, da die Datei nicht komplett lesbar/prüfbar ist (>1 MB, Base64/JSON-verschachtelt).
   Alternative: Nicole fragen, ob die Szenen im Ursprungstool (Omelette/DC) neu mit "Cover"-Skalierung
   statt "Contain" exportiert werden können — sauberer als Hex-Chirurgie am Bundle.
2. Die uncommitted Fallback-SVG-Fixes (siehe oben) noch reviewen/committen oder verwerfen.
3. Live-Referenz (`workspace.kidashidesign.com`) bleibt aus der Sandbox nicht erreichbar — jede
   visuelle Prüfung lief nur lokal via `http.server` + headless Chromium (kein Zugriff auf evtl.
   Deploy-spezifische Unterschiede).

### Test-Setup (für Fortsetzung)
```bash
cd /home/user/kidashi-design-website && python3 -m http.server 8123 &
# Playwright-Core Testskripte liegen im Scratchpad: .../scratchpad/pwtest/*.js
# Chromium-Binary: /opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

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

⚠️ **Variablen-Namen sind kontraintuitiv:** `--primary` ist Pfirsich/Orange, `--secondary` ist das Blau. Frühere SESSION.md-Versionen hatten das vertauscht — beim Zitieren von Hex-Werten immer den tatsächlichen CSS-Wert in `css/style.css` prüfen, nicht aus dem Variablennamen raten.

**Nicole möchte das CI-Blau (`--secondary` #2E54FE) nicht mehr sichtbar in Buttons/Hover-States** — sie empfindet es als irritierend. Wo Blau als Akzent gebraucht wird, `--pastel-blue` (#8BE2E9) verwenden, nicht `--secondary`.

---

## Button-System — Liquid-Glass-Pills (2026-07-02 komplett neu gebaut)

`.btn` + Modifier (`.btn--primary`, `.btn--outline`, `.btn--outline-dark`) sind jetzt Glasmorphismus-Pills:
- `border-radius:999px`, `backdrop-filter:blur(26px) saturate(2)`, sehr transparenter Hintergrund
- `::before` = diagonaler Reflexions-Sweep, `::after` = Spiegel-Sheen am unteren Rand + sehr leichter Zweifarben-Wash (Pfirsich→Pastellblau), beide `z-index:-1` (painten hinter dem Text, vor dem Hintergrund — funktioniert nur wegen `isolation:isolate` + `position:relative` auf `.btn`)
- `.btn--outline` (dunkle Sections, z.B. Hero) hat eine eigene, reichhaltigere Reflexions-Gradient-Überschreibung — Glaseffekt liest auf Dunkel am stärksten
- Hover-Übergang bewusst langsam: `0.55s` (nicht 0.3s) für ruhigeres Wirken
- Textfarbe in dunklen Bereichen bleibt **immer hell** (nie zu dunkel wechseln, auch nicht bei hellerem Hover-Hintergrund) — explizite Nicole-Vorgabe
- `.btn--ghost`/`.btn--ghost-light` sind aktuell **ungenutzt** (kein HTML referenziert sie), aber Teil des Systems — CI-Blau dort ebenfalls durch `--pastel-blue` ersetzt

---

## CSS-Muster — Projekt-Hero-Varianten

```html
<!-- Video/Animation-Hero (Vollbild-Iframe), Standardmuster -->
<section class="proj-hero proj-hero--video" style="background:#06120D;">
  <div class="proj-hero__eyebrow">
    <a href="../../portfolio/" class="proj-hero__back">← Portfolio</a>
    <span class="proj-hero__category">…</span>
  </div>
  <div class="proj-hero__video-wrap"> <!-- height: 100svh (Desktop/Tablet), 16:9-Box ab 600px Mobile -->
    <iframe class="proj-hero__video-frame" ...>
  </div>
  <div class="proj-hero__content">…</div>
</section>

<!-- Opt-in: randlos auf JEDEM Breakpoint (bisher nur art-gerecht-modular) -->
<section class="proj-hero proj-hero--video proj-hero--video-fill" ...>
```

---

## Verifikations-Setup für neue Agenten (Sandbox ohne echten Internet-Zugriff)

Bei jeder Fehleranalyse: 1) kritische Fehler zuerst, 2) Zeile·Erklärung·Fix pro Fehler,
3) Optimierungen mit Aufwand/Nutzen, 4) Gesamtbewertung 1–10 + Top 3, 5) Vorher/Nachher-Beispiele.
(Gilt für Reviews/Fehleranalysen — nicht für reine Implementierungsaufgaben wie diese Session.)

---

## Portfolio-Seiten auf diesem Branch

`xp-days` · `wh4` · `rohyma-jet` · `tm-studio` · `galerie-kronsbein` · `art-gerecht-modular` (NEU) ·
`seestern` · `westgrowth-capital` · `hideout-georgia` · `selvoma` · `studio995`

Fehlen (auf diesem Branch bewusst gelöscht, main hat sie evtl. noch): `mystic-drops`, `artista-magazin`,
`piano-post` — `portfolio/index.html` hat für diese noch tote Links.

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website auf Branch
claude/fullscreen-animation-responsive-lxc04m. Statisches HTML/CSS/JS.
Lies SESSION.md im Root — dort steht der offene Rest-Bug zur
Art-Gerecht-Modular-Animation (Kachel-Ansicht letterboxt noch wegen
transform:scale()-Contain-Verhalten im DC-Renderer-Bundle).
```
