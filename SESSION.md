# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-07-12

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `KidashiDesign/kidashi-design-website` |
| Branch (aktiv) | `main` |
| Deploy | FTP → Hostinger (echte Live-Seite) + GitHub Pages (Preview) |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| Live-URL | `https://www.kidashidesign.com` |
| GitHub Pages | `https://kidashidesign.github.io/kidashi-design-website/` |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |

---

## 🚨 DEPLOY-PFLICHT — bei jeder neuen Session als ERSTES prüfen

Die echte Live-Seite liegt auf **Hostinger** (nicht GitHub Pages).
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
1. Letzten Workflow-Run auf `main` checken → `mcp__github__actions_get` mit `get_workflow_run` (NICHT `list_workflow_runs` — das liefert bei diesem Repo einen übergroßen Payload, der das Context-Limit sprengt; IDs stattdessen über `mcp__github__get_commit` → `check_suite`/PR-Historie ermitteln, oder gezielt nach der bekannten Run-ID fragen)
2. Wenn „Deploy to Hostinger" = `failure` mit obigem Log-Muster → das ist der bekannte Secrets-Fehler, direkt melden, **nicht** reflexartig rerunnen
3. Secrets die gesetzt sein müssen (GitHub Repo Settings → Secrets → Actions):
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
4. Fix liegt einzig bei Nicole: Werte aus Hostinger hPanel → Hosting → FTP-Konten in **https://github.com/KidashiDesign/kidashi-design-website/settings/secrets/actions** eintragen

**Merke:** GitHub Pages Deploy kann grün sein, aber Hostinger trotzdem rot — Nicole schaut immer auf www.kidashidesign.com, nicht auf github.io!

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Kein KI-Workflow sichtbar** auf der öffentlichen Seite (Nicole = echter Mensch, zertifizierter Designer)
- **Esports-Projekt** → nur als „Freelance-Collaboration mit einem Esports-Event-Veranstalter" erwähnen, nie Kundenname
- **Projekt Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- Keine privaten Kontaktdaten von Kunden sichtbar
- Kontakt-E-Mail nur als HTML-Kommentar, nie direkt auf der Seite
- PR-Beschreibungen und Commit-Messages: **keine** AI-Zuschreibungen im sichtbaren Seiten-Content (Commit-Trailer mit Co-Authored-By sind ok, das ist Git-Metadata, keine Seite)

---

## CSS Design Tokens (aus `css/style.css`, `:root`)

```css
--bg:          #F7F3EE
--bg2:         #EDE9E2
--dark:        #0A0A0B
--primary:     #FFBC95   /* Pfirsich/Orange — NICHT Blau! */
--secondary:   #2E54FE   /* CI-Blau — bewusst NICHT mehr in Buttons/Hovers verwendet, siehe unten */
--accent:      #FFF083   /* Gelb */
--pastel-blue: #8BE2E9   /* NEU (2026-07-02) — ersetzt CI-Blau als Hover-/Akzentfarbe */
--text:        #0A0A0B
--muted:       rgba(10,10,11,0.45)
--cream:       #F7F3EE
--font-h:     'Mango Grotesque'   /* Headlines, self-hosted TTF/WOFF2 */
--font-b:     'Jost'               /* Body/UI, self-hosted + Google Fonts fallback */
--nav-h:       72px
--gutter:      clamp(24px, 5vw, 80px)
--container:   1280px
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

## Nav-Farbsystem

| Klasse | Verwendung | Textfarbe |
|--------|-----------|-----------|
| `class="nav"` | Landingpage + alle Projekt-Detailseiten | Weiß (cream) |
| `class="nav nav--light"` | portfolio/index, about, services, contact, gallery | Dunkel |
| `.scrolled` (JS-Toggle) | Alle Seiten beim Scrollen | Frosted-Glass dunkel |

Wichtig: `.nav { position:fixed; top:0; }` liegt **transparent über dem Hero** bis gescrollt wird — Content im Hero darf am oberen Rand nicht zu hell/kontrastreich sein, sonst "verdeckt" er optisch das Logo/die Nav-Links (siehe Seestern-Fix unten).

---

## Portfolio-Animationen — zwei verschiedene Formate im Repo

**Wichtig für neue Agenten:** Es gibt zwei völlig unterschiedliche Bauweisen für `*-animation.html`-Dateien im Portfolio-Ordner. Vor dem Bearbeiten immer den Dateikopf prüfen, welches Format vorliegt.

### Format A — DC-Runtime-Bundle-Export (älteres Format, mehrere Projekte)
- `<script type="__bundler/manifest">` — Base64-kodierte Bilddaten (groß, nicht anfassen)
- `<script type="__bundler/template">` — JSON-kodiertes HTML+CSS+JS
- **Braucht React von `https://unpkg.com/react@...`** zur Laufzeit → in Sandbox-Umgebungen ohne Internet-Zugriff auf unpkg.com **nicht renderbar** (`[bundle] error`), auf der echten Live-Seite lädt es normal
- Kritisch beim Bearbeiten: Template-JSON immer mit `json.JSONDecoder().raw_decode()` lesen (nie Regex!). Nach `json.dumps()` **alle** `/` durch `\/` ersetzen (nicht nur `</script>`) — sonst bricht der HTML-Parser den Script-Tag ab
- `?tile=1`-Query-Param-Konvention: Bundle-Skript am Dateianfang blendet Text-Elemente aus, wenn die Animation als kleine Portfolio-Kachel eingebettet wird (`text,tspan{display:none}` + class-basierte Heuristik für „title"/„label" etc.)

### Format B — Native, dependency-freie Animation (`portfolio/seestern/seestern-animation.html`)
- Komplett selbst gebaut (Sonnet 5, 2026-07-02), keine externen Libraries, keine CDN-Abhängigkeit
- 4 Szenen (Start-Reveal, Hero-Strip mit 5 Foto-Panels, rotierendes Badge, SVG-SMIL-Endscreen), per JS-Sequencer mit Cross-Fade durchgeschaltet
- Unterstützt dieselbe `?tile=1`-Konvention wie Format A (eigenes Snippet, gleiche CSS-Heuristik)
- Assets als externe WebP-Dateien (`images/portfolio/seestern/*.webp`), nicht base64-inline — dadurch **21,5 MB → 0,99 MB** kleiner als ein Bundle-Export derselben Quellen wäre
- Bevorzugtes Format für neue Animationen: kein CDN-Risiko, kleiner, in Sandbox-Umgebungen vollständig testbar

---

## Was in dieser Session gemacht wurde (2026-07-02)

### 1. Kritischer Merge-Konflikt gelöst: `claude/epic-curie-r5ed0o` vs. `main`
`main` hatte sich seit einer alten Branch-Abspaltung um **~90 unabhängige Commits** weiterentwickelt (About-Redesign, Testimonials, Homepage-Partikel, Portfolio-Glow-Effekt), inklusive einer **eigenen, älteren Seestern-Animation** (Format A, DC-Runtime-Bundle). Die neue, native Seestern-Animation (Format B) wurde zugunsten der Nutzer-Entscheidung übernommen, alle anderen main-Commits blieben erhalten. **Lektion:** vor jedem Merge nach `main` immer `git log --oneline origin/main..HEAD` UND umgekehrt prüfen — Branches können in Sandbox-Sessions unbemerkt stark auseinanderlaufen.

### 2. Contact-Seite: Morph-Effekt (anime.js v4)
`js/anime.js` lokal gevendort (kein CDN). SVG-Polygon-Morph läuft dezent grau, leicht versetzt hinter der H1.

### 3. Button-System komplett neu: Liquid-Glass-Pills
Siehe eigener Abschnitt oben. Mehrere Iterationen: erst Basis-Glaseffekt, dann CI-Blau raus (→ `--pastel-blue`), dann Schatten/Transparenz/Übergangsgeschwindigkeit feinjustiert, dann Verlauf/Spiegelung in dunklen Bereichen ausgebaut.

### 4. Services-Seite: CORE-SERVICE-Hover-Bug
`.service-full-card--core:hover` nutzte noch CI-Blau. **Zusätzlicher, nicht offensichtlicher Bug:** `.reveal` (Scroll-Einblend-Klasse, gleiche Selektor-Spezifität `0,1,0`, aber später in der Cascade) überschrieb die `transition`-Deklaration der Karte komplett → Hintergrundfarbe wechselte beim Hover ohne jede Animation. Fix: höher-spezifischer Compound-Selektor `.service-full-card--core.reveal`, der alle drei nötigen Transitions (opacity/transform von `.reveal` + background) neu deklariert. **Lektion für neue Agenten:** Wenn eine `transition`/Hover-Animation trotz korrektem CSS nicht greift, immer `getComputedStyle(el).transitionProperty` im Browser prüfen — eine andere gleich-spezifische Klasse kann die komplette `transition`-Shorthand stillschweigend überschreiben.

### 5. About-Me-Seite — mehrere Fixes
- „My Path"-Text gekürzt, Erwähnung von „Ajaska GmbH" (ehemaliger Arbeitgeber) komplett entfernt (Fließtext + Sidebar)
- Reisefoto-„Floating Scene": Text-Badges (Education/Based-in) und vertikales Label entfernt — nur noch Fotos sichtbar
- **Bug gefunden und gefixt:** `.about-float-grain`-SVG-Overlay hatte kein explizites `width`/`height` und fiel bei `position:absolute; inset:0` auf die Browser-Default-Ersatzgröße für Replaced Elements (300×150px) zurück, statt die volle Szene zu füllen — sichtbar als kleines texturiertes Rechteck. Fix: `width:100%; height:100%;` explizit ergänzen. **Lektion:** `inset:0` allein reicht bei `<svg>`/`<img>`/`<canvas>` ohne eigene intrinsische Maße nicht zum Strecken — explizite width/height nötig.
- Sichtbarer „Kasten" um die Foto-Collage entfernt: `.about-float-scene` war auf 960px/70vh begrenzt und wirkte gegen den schwarzen Hero-Hintergrund wie ein separater, hellerer Kasten. Container + Szene auf 1560px/1480px/82vh vergrößert.
- Hover-Glow der 4 Sidebar-Karten (Education/Experience/Services/Currently Based): war an die Mausposition gekoppelt und driftete durchs Farbspektrum (`js/main.js`, `glowColorMap`). Für diese markeneigenen Karten jetzt auf exakte CD-Farben fixiert (`CI_COLOR_MAP` in `js/main.js`, gescoped auf `.sidebar-block`). Portfolio-Kacheln (eigene CI-Farbe pro fremdem Projekt) bewusst unverändert gelassen.

### 6. Portfolio-Übersicht
- Homepage-Grid „Selected Work": 4. Kachel (Seestern) ergänzt, füllt das vorher unvollständige 2×2-Layout
- Art Gerecht Modular: ungestyltes `<div class="portfolio-item__info">` (permanent sichtbarer Text-Overlay ohne jedes CSS) entfernt — die Animation selbst hat bereits einen eigenen `tile-mode`, der ihr Logo ausblendet

### 7. Seestern-Animation — mehrere Detail-Fixes
- **Hero-Strip-„Blitzer" behoben:** Nur die Panel-**Höhe** wurde animiert (Breite blieb fix), wodurch `object-fit:cover` bei jedem Frame den Bildausschnitt neu berechnete — das ließ helle Bildstellen (v.a. Wasserreflexionen) kurz an den linken/rechten Rändern aufblitzen. Fix: Bildhöhe wird einmalig per JS auf die Panel-Peak-Höhe (100%) fixiert, animiert wird nur noch `translateY(-50%) scale()` — der horizontale Bildausschnitt bleibt dadurch für die gesamte Animation stabil. **Lektion:** Bei `object-fit:cover` in einem Container, dessen Größe sich animiert ändert, wird der Crop **jeden Frame neu berechnet** — für stabile Bildausschnitte die Bildgröße von der animierten Dimension entkoppeln (fixe Pixelgröße + Transform statt Prozent-Vererbung).
- Hero-Strip-Reihe vertikal gestreckt (54vh/560px max statt 44vh/480px) und mit mehr Top-Padding versehen, damit Panels nicht ans transparente Hauptmenü stoßen
- Endscreen: kompletten Markentext entfernt, Bildmarke inkl. aller zugehöriger Effekte (Strahlen, Halo, Energie-Ringe, Glint, Sparkles) von y=430 auf y=540 verschoben — jetzt exakt horizontal **und** vertikal zentriert im 1920×1080-Frame (0px Abweichung per `getBoundingClientRect()` verifiziert)

---

## Was in dieser Session gemacht wurde (2026-07-12)

**Branch-Hinweis:** Diese Session lief auf `claude/kidashi-design-session-suhse0`, war beim Start aber 116 Commits hinter `main` (alter Stand vom 21.06., keine eigene unmerged Arbeit) — Branch wurde per `git checkout -B <branch> origin/main` neu von `main` aufgesetzt, bevor irgendetwas geändert wurde. **Lektion:** Bei Sessionstart immer `git log HEAD..origin/main --oneline | wc -l` prüfen, bevor man SESSION.md oder Code als aktuell annimmt — der lokale Branch kann massiv veraltet sein, auch wenn `git status` „clean" meldet.

### Hideout Georgia Animation — Timing- und Asset-Bug behoben
Nicole meldete: Übergänge zwischen den Szenen passen nicht (manche zu kurz, manche zu lang angezeigt), und die „Farbanimation" (Ambient-Loop-Hintergrund) wird nicht richtig angezeigt.

Dritte Bauweise für `*-animation.html` im Repo (weder Format A noch B oben): `hideout-georgia-animation.html` ist ein reiner Sequencer, der 4 **separate** Szenen-HTML-Dateien (`hideout-georgia-intro/logo/slide/outro.html`) nacheinander in ein Iframe lädt/crossfaded, plus eine permanent laufende, nie neu geladene Ambient-Loop-Iframe (`hideout-georgia-loop.html`) im Hintergrund, die nur während der 0.9s-Crossfades kurz durchscheint.

1. **Timing-Fix** (`hideout-georgia-animation.html`, `ORDER`-Array): Die konfigurierten Anzeigedauern waren nicht an die tatsächliche CSS-Keyframe-Länge jeder Szene gekoppelt. `logo` war nach 9.45s inhaltlich fertig, lief aber 13.0s (3.55s toter Leerlauf), `outro` war nach 4.6s fertig, lief aber 6.5s (1.9s Leerlauf) — `intro` (7.6s) und `slide` (7.8s) waren dagegen schon fast exakt getroffen. Dadurch wirkte der Rhythmus ungleichmäßig. Fix: alle vier Szenen auf einen einheitlichen ~0.45s-Puffer nach Animationsende umgerechnet → `logo: 13.0→9.9`, `outro: 6.5→5.1`, `intro`/`slide` unverändert. Mit Playwright verifiziert (MutationObserver auf `.scene.is-active`-Wechsel, echte Transition-Zeitstempel geloggt statt nominale `waitForTimeout`-Werte zu vertrauen — Screenshot-I/O-Overhead verfälscht sonst die gemessene Zeit um mehrere Sekunden).
2. **Farbanimation-Bug** (`hideout-georgia-loop.html`): Die vier Quellbilder `images/portfolio/hideout-georgia/anim/loop-col-0…3.webp` haben **in den Bild-Assets selbst** einen fehlerhaften flachen Farbblock über den obersten ~44% der Bildhöhe (kein Bildinhalt dort — Export-Defekt, vermutlich aus dem ursprünglichen Design-Tool). Da die Spalten schmal/hoch sind (Box-Seitenverhältnis < Bild-Seitenverhältnis), konnte `object-fit:cover` diesen Bereich nie wegschneiden — er wurde bei jedem Szenen-Crossfade als sichtbarer Farbbalken oben im Frame eingeblendet. Fix: `object-fit:cover` entfernt, Bildgröße/-position jetzt manuell in JS berechnet (`CROP_TOP = 0.45`-Konstante), sodass gezielt nur der untere, echte Fotoanteil gerendert wird. Mit Playwright verifiziert (Canvas-Pixel-Scan fand die Farb/Foto-Kante bei exakt ~44.1% Bildhöhe in allen 4 Assets; Vorher/Nachher-Screenshots bestätigen den Fix).

Commit `de61695` auf `claude/kidashi-design-session-suhse0` gepusht, **noch kein PR erstellt** (nicht explizit angefragt) und **noch nicht in `main` gemergt** — nächste Session sollte prüfen, ob das gemergt werden soll.

**Für neue Agenten, falls weitere Hideout-Georgia-Assets nötig werden:** Alle 4 `loop-col-*.webp`-Dateien haben denselben Asset-Defekt (Flat-Color-Band exakt bei ~44% der Höhe). Falls diese Bilder je neu exportiert werden, prüfen ob der Defekt in der Quelle behoben ist — dann wird `CROP_TOP` in `hideout-georgia-loop.html` obsolet/falsch und muss auf `0` bzw. entfernt werden.

---

## Verifikations-Setup für neue Agenten (Sandbox ohne echten Internet-Zugriff)

- Lokaler Server: `python3 -m http.server 8199 --bind 127.0.0.1 --directory /home/user/kidashi-design-website` **immer mit `nohup ... &` + `disown`** starten, sonst stirbt er beim nächsten Bash-Tool-Call (kein echtes Hintergrund-Prozess-Handling in einfachen `&`-Backgrounds dieser Sandbox)
- Playwright: `npm install --no-save playwright-core`, Chromium liegt vorinstalliert unter `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` — **nicht** `playwright install` ausführen
- `fonts.googleapis.com` und `unpkg.com` sind in dieser Sandbox **netzwerk-blockiert** — das ist normal und kein Bug in eigenem Code. Format-A-Animationen (DC-Runtime, siehe oben) können deshalb hier nicht vollständig gerendert/gescreenshottet werden.
- Nach jeder Playwright-Session: `pkill -f http.server`, `rm -rf node_modules package.json package-lock.json` vor dem Commit (sonst landen Test-Artefakte im Git-Diff)

---

## Offene Aufgaben

| # | Task | Status |
|---|------|--------|
| 1 | **Hostinger Deploy schlägt fehl** (FTP-Secrets fehlen) | 🔴 Blockiert Live-Deploy — Nicole muss Secrets eintragen, siehe oben |
| 2 | Testimonials: echte Kundenstimmen + Fotos (aktuell nur auf Services-Seite, Platzhalter-Daten) | ⏳ Warten auf Nicole |
| 3 | Google Analytics GA4 | ⏳ Warten auf Measurement-ID |
| 4 | Seestern: Bilder für Portfolio-Detailseite (Merch/Print-Fotos) fehlen noch, nur Hero-Animation vorhanden | ⏳ Warten auf Nicole |
| 5 | 8 Portfolio-Projekte ohne Bilder (artista-magazin, galerie-kronsbein, mystic-drops, piano-post, seestern-detail, selvoma, westgrowth-capital, wh4) | ⏳ Warten auf Nicole |
| 6 | Hideout-Georgia-Animation-Fix (Timing + Farbanimation, Commit `de61695`) in `main` mergen | ⏳ Branch `claude/kidashi-design-session-suhse0`, noch kein PR |

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo KidashiDesign/kidashi-design-website auf Branch
main. Statisches HTML/CSS/JS, Hostinger-Deploy aktuell rot (FTP-Secrets
fehlen, siehe SESSION.md → Deploy-Pflicht-Sektion, NICHT blind rerunnen).
Lies SESSION.md im Root für alle Infos, insbesondere die Abschnitte zu
CSS-Variablen-Namen (kontraintuitiv!) und den zwei Animations-Formaten
im Portfolio-Ordner.
```
