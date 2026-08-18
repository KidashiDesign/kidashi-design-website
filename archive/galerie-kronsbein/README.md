# Galerie Kronsbein (archiviert)

Das Kundenprojekt „Galerie Kronsbein" (Logo-Redesign & Brand Identity für eine
Galerie für zeitgenössische Kunst) wurde am 18.08.2026 vollständig aus der
Live-Website entfernt und hierher archiviert. Die Projektseite ist nicht mehr
öffentlich erreichbar und taucht weder im Portfolio-Grid noch in der Sitemap auf.

**Keywords:** Galerie Kronsbein, Kronsbein, Logo Redesign, Brand Identity,
Portfolio-Kachel mit Scroll-Animation der Website-Slides, `--gk` Tile.

## Inhalt
- `index.html` — komplette Projekt-Detailseite (`/portfolio/galerie-kronsbein/`)
- `galerie-kronsbein-animation.html` — Scroll-Animation, wurde als Kachel-Iframe
  in der Portfolio-Übersicht und als Hero auf der Detailseite eingebunden
- `assets/` — alle Projektbilder (Cards, Interior-/Ausstellungs-Shots, Background)

## Herkunft
Letzter Live-Stand vor der Archivierung: Branch `main`, Commit `bedd518`.

Mit entfernt wurden:
- Portfolio-Kachel in `portfolio/index.html` (ersetzt durch Archiv-Kommentar)
- Sitemap-Eintrag in `sitemap.xml`
- CSS-Regeln `.portfolio-item__anim--gk` (`css/style.css`) sowie
  `.portfolio-gk-phone` / `.portfolio-gk-desktop` (`css/style.css`, `css/stylebkb.css`)
- Der „Next project"-Verweis auf `portfolio/rohyma-jet/index.html` zeigt jetzt
  direkt auf X-Commerce (vorher: Rohyma Jet → Galerie Kronsbein → X-Commerce)

## Wiederherstellung
1. Ordner zurück nach `portfolio/galerie-kronsbein/` verschieben (ohne diese README)
2. Kachel in `portfolio/index.html` an Stelle des Archiv-Kommentars wieder einfügen
3. CSS-Regeln aus der Commit-Historie zurückholen
4. Sitemap-Eintrag ergänzen und die `proj-next`-Kette wieder auf
   Rohyma Jet → Galerie Kronsbein → X-Commerce umstellen
