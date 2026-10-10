# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-10-10

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `kidashidesign/kidashi-design-website` |
| Branch (aktiv) | `main` — **ab sofort wird IMMER direkt auf `main` gearbeitet**, siehe `CLAUDE.md` → „Git-Workflow". Keine Feature-Branches mehr außer auf explizite Nachfrage. |
| Deploy | FTP → Hostinger via `.github/workflows/deploy.yml`, Push auf `main` = Live-Deploy. (Status der letzten Sessions: FTP-Secrets teils leer/defekt — bei Sessionstart Workflow-Run prüfen, siehe unten.) |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| Live-URL | `https://www.kidashidesign.com` (Hostinger) |
| Inhaberin | Nicole Szatkowski — Kidashi Design, Tbilisi (GMT+4) |

---

## ⚠️ WICHTIGSTE REGEL: Git-Workflow

**Alle Änderungen werden direkt auf `main` committet und gepusht.** Kein Arbeiten auf separaten
Feature-Branches mehr (führte wiederholt dazu, dass Änderungen verloren gingen bzw. nicht auf `main`
landeten). Vor jedem Push: `git fetch origin main` / `git pull origin main`, um Konflikte oder das
versehentliche Mitziehen alter/unerwünschter Commits zu vermeiden. Diese Regel steht dauerhaft in
`CLAUDE.md` und gilt für jede neue Session.

**Falls doch mal auf einem Feature-Branch gearbeitet wurde** (z. B. weil eine Session so gestartet ist):
beim Zusammenführen auf `main` bevorzugt **cherry-pick des relevanten Commits** statt vollem `git merge`,
falls der Branch von einem alten `main`-Stand abzweigte — sonst können versehentlich bereits gelöschte
Dateien (alte Fonts, doppelte Bilder etc.) zurückkommen. Danach `git diff --stat origin/main HEAD` prüfen,
dass nur die erwarteten Dateien geändert wurden, bevor gepusht wird.

---

## 🚨 DEPLOY-PFLICHT — bei jeder neuen Session als ERSTES prüfen

Deploy läuft automatisch via GitHub Actions Workflow `.github/workflows/deploy.yml` per FTP bei jedem
Push auf `main`. In früheren Sessions (Stand Juli 2026) schlug der Workflow wiederholt fehl, weil die
GitHub Secrets `FTP_SERVER` / `FTP_USERNAME` / `FTP_PASSWORD` leer waren (`mirror: Not connected`).

**Beim Sessionstart immer prüfen:**
1. Letzten Workflow-Run auf `main` checken (GitHub Actions).
2. Wenn „Deploy to Hostinger" = `failure` → Nicole Bescheid geben, Ursache i. d. R. fehlende/falsche
   FTP-Secrets in Repo Settings → Secrets and variables → Actions. **Ich kann das nicht selbst fixen**
   (kein Zugriff auf Repo-Secrets).
3. Nicht sinnlos rerunnen, wenn die Secrets bekanntermaßen leer sind — identischer Fehler garantiert.

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Kein KI-Workflow sichtbar** auf der öffentlichen Seite (Nicole = echter Mensch, zertifizierter Designer)
- **Esports-Projekt** → nur als „Freelance-Collaboration mit einem Esports-Event-Veranstalter" erwähnen, nie Kundenname
- **Projekt Wiedmann & Winz** → komplett aus Portfolio ausgeschlossen
- Keine privaten Kontaktdaten von Kunden sichtbar
- Kontakt-E-Mail nur als HTML-Kommentar, nie direkt auf der Seite
- PR-Beschreibungen und Commit-Messages: **keine** AI-Zuschreibungen im sichtbaren Seiten-Content
- Branch-Namen (falls doch mal nötig): kein `claude/`-Prefix, stattdessen `feature/`, `fix/`, `update/`
- Keine persönlichen Daten der Inhaberin/Kunden in Commit-Messages, PR-Titeln oder Branches

---

## Letzte Session (2026-10-10): Projektseiten — Texte geprüft, Abschnitt „About this project“

**Auftrag:** Alle Texte der 12 Portfolio-Projektseiten auf Korrektheit prüfen, korrigieren und für Suchmaschinen/KI-Suche ergänzen.

**Umsetzung:**
- Korrekturen in EN-Quelle und `data-de`-Texten: deutsche Anführungszeichen („…“), fehlende Kommas, einheitliche Begriffe (Webdesign, Logodesign, Markenrichtlinien, Editorial Design), amerikanische Schreibweise (color, optimized), Gender-Stil `Kund:innen`, Rohyma-Jet-Titel/Meta an den sichtbaren Inhalt angeglichen.
- Neuer Abschnitt `.proj-about` („About this project“ / „Über das Projekt“) auf allen 12 Projektseiten, direkt vor `<!-- NEXT PROJECT -->`: Kurzbeschreibung + 3 Q&As + passendes `FAQPage`-JSON-LD (Texte im JSON-LD = sichtbare Texte, damit `build-de.py` sie übersetzt). Styles am Ende von `css/project.css`. Alle Aussagen stammen aus den bereits veröffentlichten Seitentexten.
- Portfolio-Übersicht: jede Projekt-Kachel hat einen unsichtbaren Link-Text (`.visually-hidden`, Klasse am Ende von `css/style.css`); Titel und Meta-Beschreibung geschärft.
- Danach `python3 scripts/build-de.py --lastmod <Datum>` ausgeführt (de/ + Sitemap neu erzeugt).

**Offen / Hinweise:**
- `hideout-georgia` wurde auf Wunsch der Inhaberin komplett entfernt (Seite, Bilder, Sitemap, Audit-Liste); die alte Adresse liefert jetzt 404.
- `artista-magazin` (inkl. Duplikat `/artista/`) auf Wunsch der Inhaberin komplett entfernt, solange das Projekt auf Eis liegt (Seite, Sitemap, Audit-Liste); Wiederherstellung über die Git-Historie.
- Rohyma Jet: Website rohyma-jet.com (von der Inhaberin gestaltet und in Wix umgesetzt) ist jetzt in Titel, Meta, Statement, Prozess (4. Schritt), FAQ, Link und Kachel der Übersicht aufgenommen.
- Projekte aus 2021–2023 bleiben mit ihrem Zeitraum und „Kidashi Design“ stehen (Entscheidung der Inhaberin: es ist ihre Arbeit, auch vor der Gründung).
- Rohyma Jet: frühere Meta nannte „Wix“ und „Photoshop“ (Webdesign); sichtbarer Inhalt beschreibt nur Logo/CI — Meta wurde angeglichen, bei Webdesign-Anteil bitte ergänzen.

---

## Letzte Session (2026-07-22): Logo & Zeitzone in die Navbar-Pille integriert

**Auftrag:** Logo, Hauptmenü (Home/Services/…) und die Zeitzonen-Anzeige (Uhrzeit/Tbilisi/GMT+4) sollten
zu EINER zusammenhängenden Glass-Dock-Navbar-Pille verschmolzen werden (vorher: Logo links + Menü-Pille
mittig + Zeitzone rechts als getrennte Elemente).

**Umsetzung:**
- Neuer Wrapper `.nav__dock` um `.nav__logo`, `.nav__links` und `.nav__location` auf **allen 17 Seiten**
  (Startseite, alle Unterseiten, alle Portfolio-Detailseiten).
- `css/style.css`: Die Desktop-Glass-Pille (`border-radius:999px`, `backdrop-filter`, Schatten) sitzt jetzt
  auf `.nav__dock` statt nur auf `.nav__links`. Logo leicht verkleinert (`.nav__dock .nav__logo-k/-d`),
  Zeitzone bekommt einen dezenten linken Trenner (`border-left`) statt eigenem `margin-right`.
- Mobile (≤768px) unverändert: `.nav__links`/`.nav__location` bleiben per Media Query ausgeblendet, Burger-Menü
  funktioniert wie zuvor (kein struktureller Eingriff nötig, JS greift nur über Klassenselektoren zu).
- Verifiziert mit Playwright (headless Chromium, `/opt/pw-browsers/`) auf Desktop (dunkle Hero-Nav +
  helle `nav--light` Unterseiten-Nav) und Mobile (390×844) — Screenshots geprüft, sieht korrekt aus.

**Git-Historie dieser Änderung:** Ursprünglich auf einem vom Aufgaben-Setup vorgegebenen Branch
(`claude/logo-timezone-navbar-yzm7pk`) entwickelt und commited. Danach auf Nicoles Wunsch **nachträglich
per Cherry-Pick sauber auf `main` gebracht** (Commit `0e696f6`), weil ein normaler `git merge` alte,
längst gelöschte Dateien (Jost/OpenSans-Fontdateien, doppelte Galerie-Bilder) aus der alten
Branch-Historie wieder eingeführt hätte — bewusst vermieden.

**Status:** ✅ Auf `main` gepusht (`0e696f6`), sollte beim nächsten erfolgreichen FTP-Deploy live sein
(Deploy-Status separat prüfen, siehe „DEPLOY-PFLICHT" oben).

---

## Frühere Session: Art Gerecht Modular — Vollbild-Animation (auf Alt-Branch, NICHT in main)

Diese Arbeit lief auf einem stark veralteten Branch (`claude/fullscreen-animation-responsive-lxc04m`,
war 135 Commits hinter `main`) und wurde **nicht** nach `main` gemerged. Falls das Thema erneut aufkommt:

- Auftrag war: Hero-Animation auf `portfolio/art-gerecht-modular/` randlos auf allen Breakpoints,
  6 Slides als eine flüssige Animation.
- Gefundener Rest-Bug: Die 6 Szenen-Dateien (`artgerecht-01…06.html`, aus einem proprietären
  „Omelette/DC-Bundler"-Export) rendern intern immer auf eine feste 1920×1080-Leinwand und skalieren per
  `transform:scale()` im **contain/letterbox**-Verhalten (nicht cover) → schwarze Balken in der
  Kachel-Ansicht bei Nicht-16:9-Kacheln. Der Skalierungscode sitzt in einem >1 MB Manifest-JSON-Blob,
  nicht sicher von Hand editierbar.
- Empfehlung damals: Nicole fragen, ob die Szenen im Ursprungstool mit „Cover" statt „Contain" neu
  exportiert werden können — sauberer als Bundle-Chirurgie.
- Falls das erneut angegangen wird: **auf `main` neu aufsetzen**, nicht den alten Branch fortführen
  (der weicht inzwischen stark von `main` ab und hat u. a. andere Portfolio-Ordner bewusst gelöscht,
  die auf `main` noch existieren).

---

## CSS Design Tokens (aus `css/style.css`)

```css
--font-h: 'Mango Grotesque'      /* Headlines */
--font-b: 'Jost'                  /* Body/UI */
--bg:      #f0f1e9 (helles Grün-Creme)
--bg2:     #e1e4d6 (Salbei hell)
--dark:    #1b1e16 (tiefes Olivschwarz)
--text:    #1b1e16
--cream:   #F7F3EE
--primary:   #71805f (Olivgrün, Hauptakzent)
--secondary: #a9b497 (Salbei)
--accent:    #cbcfae (Pistazie hell)
--accent2:   #3d4732 (dunkles Waldgrün)
--muted:   rgba(10,10,11,0.45)
--nav-h:   72px
--gutter:  clamp(24px, 5vw, 80px)
```

**Farbpalette (Stand 2026-10-06): Grün-Olive** — Nicole hat die grüne Olivpalette bestätigt (nicht die gelblichere
Sand-Olive aus `css/stylebkb.css`). Pfirsich (#FFBC95), CI-Blau (#2E54FE), Gelb (#FFF083) und Pastellblau
(#8BE2E9) werden auf der Website **nicht mehr verwendet**.

⚠️ **Lesbarkeit:** `--secondary` (#a9b497) ist als Text auf hellem Grund zu schwach; dort `--primary` (große/fette
Elemente) oder `--accent2` (kleiner Text, Links) nehmen. `--accent` (#cbcfae) ist eine Hover-/Flächenfarbe bzw.
Text auf dunklem Grund. Glas-Buttons nutzen die Grüntöne direkt als `rgba(...)`
(203,207,174 / 113,128,95 / 61,71,50).

---

## Button-System — Liquid-Glass-Pills

`.btn` + Modifier (`.btn--primary`, `.btn--outline`, `.btn--outline-dark`) sind Glasmorphismus-Pills:
- `border-radius:999px`, `backdrop-filter:blur(26px) saturate(2)`, sehr transparenter Hintergrund
- `::before` = diagonaler Reflexions-Sweep, `::after` = Spiegel-Sheen + leichter Zweifarben-Wash
  (Sandgelb→Oliv), beide `z-index:-1` (funktioniert nur wegen `isolation:isolate` +
  `position:relative` auf `.btn`)
- `.btn--outline` (dunkle Sections, z. B. Hero) hat eigene, reichhaltigere Reflexions-Gradient
- Hover-Übergang bewusst langsam: `0.55s`
- Textfarbe in dunklen Bereichen bleibt **immer hell**, auch bei hellerem Hover-Hintergrund — explizite Vorgabe
- `.btn--ghost`/`.btn--ghost-light` aktuell ungenutzt, aber Teil des Systems

---

## Navbar — aktuelles Muster (Stand 2026-07-22)

```html
<nav class="nav [nav--light|nav--dark]">
  <div class="nav__inner">
    <div class="nav__dock">                 <!-- NEU: gemeinsame Glass-Pille -->
      <a href="…" class="nav__logo">…</a>
      <ul class="nav__links">…</ul>
      <div class="nav__location">…</div>
    </div>
    <button class="nav__burger">…</button>
  </div>
</nav>
```
Desktop (≥769px): `.nav__dock` trägt die Glass-Dock-Optik (Pille, Blur, Schatten). Mobile (≤768px):
`.nav__links`/`.nav__location` per Media Query ausgeblendet, nur Logo + Burger sichtbar.

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

## Portfolio-Seiten auf `main`

`index` · `services` · `about` · `portfolio` (Übersicht) · `gallery` · `contact` · `datenschutz` ·
`impressum` sowie Portfolio-Detailseiten: `art-gerecht-modular` ·
`rohyma-jet` · `seestern` · `selvoma` · `social-media-content` · `tm-studio` · `xp-days`.

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website, immer direkt auf main
(siehe CLAUDE.md → Git-Workflow, kein Feature-Branch-Modell mehr). Statisches
HTML/CSS/JS. Lies SESSION.md im Root für den letzten Stand.
```
