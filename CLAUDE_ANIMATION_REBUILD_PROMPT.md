# Prompt: Bundler-Animationen in lesbares HTML/CSS umbauen

Diesen Prompt 1:1 an Claude (Claude Code) geben, pro Animation einmal (oder mit der
Dateiliste als Batch-Auftrag).

---

## Kontext

Im Repo `kidashi-design-website` liegen mehrere Portfolio-Animationen, die aus einem
proprietären "Omelette/DC-Bundler"-Export stammen. Erkennungsmerkmal: die Datei enthält
`<script type="__bundler/manifest">`, ein riesiges JSON/Base64-Blob (oft 1–5 MB), ein
`#__bundler_thumbnail`-Fallback-SVG, und `<x-import>`/`<x-dc>`-Custom-Elements. Der Code
ist NICHT von Hand lesbar oder wartbar.

Betroffene Dateien (Stand heute):

| Datei | Größe | Sichtbarer Inhalt laut Fallback-SVG |
|---|---|---|
| `portfolio/tm-studio/tm-studio-animation.html` | ~3,5 MB | "TM"-Monogramm, warme Kreise (Beige/Terracotta/Blau) |
| `portfolio/rohyma-jet/rohyma-jet-animation.html` | ~1,9 MB | "RJ" / "ROHYMA JET", dunkel + Gold |
| `portfolio/xp-days/xp-days-animation.html` | ~0,8 MB | "XP"-Badge, dunkelgrün + Neongrün |
| `portfolio/art-gerecht-modular/artgerecht-01-intro.html` | ~1,1 MB | "AGM", dunkelbraun |
| `portfolio/art-gerecht-modular/artgerecht-02-modular-reveal.html` | ~1,0 MB | Modular-Reveal-Szene |
| `portfolio/art-gerecht-modular/artgerecht-03-agm-reveal.html` | ~5,7 MB | AGM-Reveal-Szene |
| `portfolio/art-gerecht-modular/artgerecht-04-zoom-blur.html` | ~1,1 MB | Zoom/Blur-Übergang |
| `portfolio/art-gerecht-modular/artgerecht-05-brochure-mockup.html` | ~0,25 MB | Broschüren-Mockup-Bild |
| `portfolio/art-gerecht-modular/artgerecht-06-bumper.html` | ~1,3 MB | Abspann/Bumper |
| `portfolio/seestern/seestern-animation.html` | ~22 KB | (kein Bundler-Blob — bereits schlank, ggf. schon lesbar) |

Jede dieser Dateien wird per `<iframe>` in eine `.proj-hero__video-frame` (Vollbild-Hero
auf der Detailseite) und/oder als `?tile=1` in eine `.portfolio-item__anim`-Kachel in
`portfolio/index.html` eingebettet. Referenz-Muster steht in `SESSION.md` im Repo-Root.

## Ziel

Für **eine konkrete Datei** (wird beim Aufruf genannt) soll eine **visuell identische**
Ersatz-Animation gebaut werden, aber:

1. **Reines, lesbares HTML/CSS** (plus minimal Vanilla-JS nur wenn für Sequencing
   nötig, z. B. Klassenwechsel per `setTimeout`/`requestAnimationFrame`) — kein Bundler,
   kein Base64-Blob, keine Custom Elements, keine externen Abhängigkeiten.
2. **CSS-Animationen/Transitions** (`@keyframes`, `transform`, `opacity`, `filter`)
   statt eines proprietären Renderers.
3. **Randlos/responsive**: füllt den Container zu 100% Breite/Höhe auf allen
   Breakpoints (Desktop, Tablet, Mobile) — `object-fit: cover`-Verhalten, kein
   Letterboxing, keine feste 1920×1080-Leinwand mit `transform:scale()`.
4. **Gleiche Bildsprache/Farben/Timing** wie im Original (so gut wie aus dem
   Fallback-SVG, Dateiname und Kontext erkennbar — bei Unsicherheit: Rückfrage an
   Nicole statt Raten).
5. **Gleiche Einbettung**: Datei bleibt unter demselben Pfad/Dateinamen erreichbar
   und funktioniert weiterhin sowohl im Hero-Iframe als auch in der `?tile=1`-Kachel
   (also responsive für beide Kontexte, kein Fixed-Viewport-Code).
6. **Keine Kommentare/Dokumentation im Code**, außer wo eine Zeile für nicht
   offensichtliche Logik (z. B. Timing-Reihenfolge der Sequenz) wirklich nötig ist.

## Vorgehen

1. Lies die Original-Datei NICHT komplett ein (sie ist zu groß) — nutze stattdessen:
   - das `#__bundler_thumbnail`-SVG (zeigt Farben/Typografie/Grundlayout),
   - den Dateinamen/Ordnernamen (z. B. `04-zoom-blur` → Zoom+Blur-Übergang erwartet),
   - falls vorhanden: Screenshots oder eine kurze Beschreibung von Nicole, was die
     Animation zeigen/tun soll.
2. Baue eine neue, schlanke HTML-Datei mit `<style>`-Block (`@keyframes`) und ggf.
   einem kurzen `<script>`-Block für Sequenzsteuerung (Klassen togglen, `loop`).
3. Teste lokal (`python3 -m http.server` + Playwright-Core aus
   `/opt/pw-browsers/`) auf 3 Viewports: 390×844 (mobil), 820×1180 (tablet),
   1440×900 (desktop) — Screenshot + `getBoundingClientRect()`-Check, dass die
   Animation randlos füllt.
4. Ersetze die alte Datei nur nach Freigabe durch Nicole (Diff/Screenshot zeigen,
   nicht automatisch committen) — die alten Dateien sind Live-Content.

## Einschränkungen

- Keine Design-Änderungen "nebenbei" — nur das Rendering/den Code umbauen, nicht
  Layout/Farben/Botschaft neu erfinden.
- Kein Wiedmann & Winz, kein Gianluca Crepaldi als Name (siehe Vertraulichkeitsregeln
  in `SESSION.md`).
- Vor dem Commit: `git status` prüfen, nichts überschreiben, das nicht Teil dieser
  Aufgabe ist.

---

**Konkreter Auftrag für diesen Durchlauf:**
`portfolio/tm-studio/tm-studio-animation.html`

Baue diese Animation als lesbare HTML/CSS-Animation neu, gemäß allen Regeln oben.
Anhaltspunkte aus dem Fallback-SVG der Originaldatei (Farben/Motiv):
- Hintergrund: warmes Beige `#efe2c9`
- Kreis 1: Terracotta/Orange `#e0a566`, ca. 40% Deckkraft
- Kreis 2: gedecktes Blau/Grau `#8da6b6`, ca. 38% Deckkraft
- Dünner Kreis-Outline: dunkelbraun `#6b5644`, ca. 25% Deckkraft
- Zentrales Element: "TM"-Monogramm, kursive Serifenschrift (Georgia), dunkelbraun `#4a3b2e`

Vorschlag für die Sequenz (bei Unsicherheit mit Nicole abstimmen, nicht raten):
1. Hintergrund + beide Kreise faden/skalieren sanft ein (0 → 1 Opacity, leichtes
   Scale-up, z. B. 0.9 → 1).
2. "TM"-Monogramm faded/skaliert nach den Kreisen ein (leichter Versatz, z. B.
   200–400ms später).
3. Optional: dezente, endlose Loop-Bewegung der Kreise (langsames Pulsieren/Drift),
   damit die Animation nicht nach einem Durchlauf einfriert.

Ergebnis:
- Eine einzelne, schlanke HTML-Datei mit `<style>`-Block (`@keyframes`) und optional
  kurzem `<script>` nur falls für Sequencing nötig.
- Füllt den Container randlos auf allen 3 Test-Viewports (390×844, 820×1180, 1440×900).
- Nicht automatisch über die bestehende Datei schreiben — Ergebnis erst als Vorschau/Diff
  zeigen, Freigabe von Nicole abwarten, bevor `tm-studio-animation.html` ersetzt wird.
