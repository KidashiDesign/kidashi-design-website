# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-07-22

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

⚠️ **Variablen-Namen sind kontraintuitiv:** `--primary` ist Pfirsich/Orange, `--secondary` ist das Blau.
Beim Zitieren von Hex-Werten immer den tatsächlichen CSS-Wert in `css/style.css` prüfen, nicht aus dem
Variablennamen raten.

**Nicole möchte das CI-Blau (`--secondary` #2E54FE) nicht mehr sichtbar in Buttons/Hover-States** — wirkt
irritierend auf sie. Für Blau-Akzente stattdessen `--pastel-blue` (#8BE2E9) verwenden.

---

## Button-System — Liquid-Glass-Pills

`.btn` + Modifier (`.btn--primary`, `.btn--outline`, `.btn--outline-dark`) sind Glasmorphismus-Pills:
- `border-radius:999px`, `backdrop-filter:blur(26px) saturate(2)`, sehr transparenter Hintergrund
- `::before` = diagonaler Reflexions-Sweep, `::after` = Spiegel-Sheen + leichter Zweifarben-Wash
  (Pfirsich→Pastellblau), beide `z-index:-1` (funktioniert nur wegen `isolation:isolate` +
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
`impressum` sowie Portfolio-Detailseiten: `art-gerecht-modular` · `galerie-kronsbein` ·
`hideout-georgia` · `rohyma-jet` · `seestern` · `selvoma` · `studio995` · `tm-studio` · `xp-days`.

---

## Schnellstart für neuen Chat

```
Ich arbeite am Repo kidashidesign/kidashi-design-website, immer direkt auf main
(siehe CLAUDE.md → Git-Workflow, kein Feature-Branch-Modell mehr). Statisches
HTML/CSS/JS. Lies SESSION.md im Root für den letzten Stand.
```
