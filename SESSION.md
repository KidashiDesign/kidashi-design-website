# Session Handoff — Kidashi Design Website
Aktualisiert: 2026-07-01

---

## Projekt-Grundlagen

| Key | Value |
|-----|-------|
| Repo | `KidashiDesign/kidashi-design-website` |
| Deploy-Branch | `main` → FTP → Hostinger (Live: https://www.kidashidesign.com) |
| Stack | Statisches HTML/CSS/JS, kein Build-Tool, kein Framework |
| Zeitzone Inhaberin | GMT+4 (Tbilisi) |

---

## 🚨 Deploy-Status beim Sessionstart IMMER als Erstes prüfen

```
mcp__github__actions_list → list_workflow_runs → deploy.yml → branch: main
```

**Der Deploy schlägt aktuell fehl** (`mirror: Not connected`) weil die FTP-Secrets im Repo nicht gesetzt sind.

**Inhaberin muss einmalig diese 3 Secrets setzen:**
`GitHub → KidashiDesign/kidashi-design-website → Settings → Secrets and variables → Actions`

| Secret | Wert kommt aus |
|--------|---------------|
| `FTP_SERVER` | Hostinger hPanel → Hosting → FTP-Konten |
| `FTP_USERNAME` | Hostinger hPanel → Hosting → FTP-Konten |
| `FTP_PASSWORD` | Hostinger hPanel → Hosting → FTP-Konten |

Der Workflow prüft ab sofort ob die Secrets fehlen und gibt eine klare Fehlermeldung aus (statt des kryptischen `mirror: Not connected`).

---

## ⚠️ Vertraulichkeitsregeln (IMMER einhalten)

- **Projekt Wiedmann & Winz** → vollständig aus Portfolio ausgeschlossen
- **Esports-Projekt** → nur als „Freelance-Collaboration mit einem Esports-Event-Veranstalter" erwähnen
- Keine privaten Kontaktdaten von Kunden sichtbar
- PR-Beschreibungen und Commit-Messages: **keine** AI-Zuschreibungen

---

## CSS Design Tokens (aus `css/style.css`)

```css
--font-h:   'Mango Grotesque'   /* Headlines */
--font-b:   'Jost'              /* Body/UI */
--dark:     #0A0A0B
--cream:    #F7F3EE
--bg:       #FAF9F5
--primary:  #2E54FE             /* Blau */
--accent:   #FFBC95             /* Orange-Peach */
--nav-h:    4rem
--section-pad: clamp(5rem, 10vh, 8rem)
```

---

## Nav-Farbsystem

| Klasse | Seiten | Textfarbe |
|--------|--------|-----------|
| `class="nav"` | index, alle Portfolio-Detailseiten | Weiß (cream) |
| `class="nav nav--light"` | portfolio/index, about, services, contact, gallery | Dunkel |
| `.scrolled` (JS-Toggle) | alle Seiten beim Scrollen | Frosted-Glass dunkel |

---

## DC Runtime Animation Bundles — Kritisch

Die `*-animation.html`-Dateien im Portfolio sind DC Runtime Bundles:
- `<script type="__bundler/manifest">` — Base64 Bilddaten (niemals anfassen)
- `<script type="__bundler/template">` — JSON-kodiertes HTML+CSS+JS

**Beim Bearbeiten:**
1. Template mit `json.JSONDecoder().raw_decode()` lesen (kein Regex!)
2. Nach `json.dumps()` zwingend `</` → `<\/` ersetzen
3. Niemals direktes Regex auf den Template-JSON-Block anwenden

---

## Aktuelle Dateistruktur (nach dieser Session)

```
/
├── index.html                  # Landingpage — Testimonials entfernt
├── css/style.css               # Global CSS + Tokens
├── js/main.js                  # Nav, Cursor, Cookie, Footer-GDPR, Parallax
├── about/index.html            # Floating-Scene: 7 Reisefotos, keine Text-Overlays
├── services/index.html         # Testimonials-Karten noch vorhanden
├── portfolio/
│   ├── index.html              # Grid — ohne Westgrow Capital + Hideout Georgia
│   ├── galerie-kronsbein/
│   ├── seestern/               # proj-next → mystic-drops (Kette repariert)
│   ├── selvoma/
│   ├── mystic-drops/
│   ├── artista-magazin/
│   ├── piano-post/
│   ├── rohyma-jet/
│   ├── tm-studio/
│   ├── studio995/
│   ├── xp-days/
│   ├── wh4/
│   └── art-gerecht-modular/
│   # HINWEIS: westgrowth-capital/ + hideout-georgia/ Ordner existieren
│   # noch im Repo aber sind nicht mehr verlinkt — können gelöscht werden
├── images/about/               # 7 Reisefoto-WebPs (himalaya, jungle etc.)
├── archive/
│   └── scrolling-about-me-animation/  # Alte ZoomParallax-Sektion archiviert
└── .github/workflows/deploy.yml       # FTP-Secret-Check ergänzt
```

---

## Was in dieser Session gemacht wurde (2026-07-01)

### About-Seite: Floating Scene komplett neu ✅ (auf main, PR #56 + #57)
- Alte ZoomParallax-Sektion archiviert unter `archive/scrolling-about-me-animation/`
- Neue Mouse-Parallax Floating-Scene (`.about-hero-float`) gebaut
- Portrait ersetzt durch 7-Foto-Collage — jedes Foto eigene `data-depth`-Ebene
- Text-Overlays entfernt: Badges (Education, Based in) + vertikales Label
- Radiale Verläufe: Ellipsen von ~50% auf 120–130%, flüssigerer Übergang
- Mobile (768px): 3 kleinste Fotos ausgeblendet, 4 verbleibende neu positioniert

### Homepage: Testimonials entfernt ✅ (auf Branch)
- `<section class="testimonials">` + Inline-Script (130 Zeilen) entfernt
- CSS bleibt (wird auf `services/index.html` noch verwendet)

### Portfolio: 2 Referenzen entfernt ✅ (auf Branch)
- Westgrow Capital aus Portfolio-Grid entfernt
- Hideout Georgia aus Portfolio-Grid entfernt
- `proj-next`-Kette repariert: Seestern → Mystic Drops
- Ordner `westgrowth-capital/` + `hideout-georgia/` noch im Repo, können gelöscht werden

### Deploy-Workflow: Secret-Check ergänzt ✅ (auf Branch)
- Klare Fehlermeldung wenn FTP-Secrets fehlen statt kryptischem `mirror: Not connected`

---

## Offener Branch — noch nicht auf main

**Branch:** `claude/handoff-me-blade-9b9vyt` (4 Commits vor main)

Enthält:
1. Homepage Testimonials entfernt
2. About-Seite Text-Overlays entfernt  
3. About radiale Verläufe vergrößert
4. Portfolio Westgrow Capital + Hideout Georgia entfernt
5. Deploy Secret-Check

**Nächster Agent:** Einfach "merge" sagen → PR erstellen + auf main mergen.

---

## Offene Aufgaben

| # | Task | Status |
|---|------|--------|
| 1 | FTP-Secrets in GitHub Repo Settings setzen | ⚠️ Inhaberin muss das tun |
| 2 | `westgrowth-capital/` + `hideout-georgia/` Ordner löschen | ⏳ Optional |
| 3 | Testimonials auf `services/index.html` — echte Kundenstimmen + Fotos | ⏳ Warten auf Inhaberin |
| 4 | Branch mergen | Nächster Agent: "merge" sagen |
