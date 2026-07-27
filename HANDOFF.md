# Handoff — Kidashi Design Website

**Last Updated:** 2026-07-02
**Session:** Claude Sonnet 5 — Merge resolution, button system redesign, Seestern & About-page fixes
**Status:** All work merged to `main` via PRs #58–#63. Hostinger FTP deploy is currently **red** (missing secrets, not a code issue — see SESSION.md).

> This file is a narrative deep-dive into the most recent session. For the always-current checklist (deploy status, open tasks, CSS token reference), read **SESSION.md** first — it's the file every session is instructed to read.

---

## Session Summary

This session started as a simple "merge" request but grew into a large, iterative round of feedback-driven refinement across the button system, the Seestern portfolio animation, and the About page. The single most consequential event was discovering that the branch this session started from (`claude/epic-curie-r5ed0o`) had gone stale relative to `main`, which had received ~90 independent commits (including its own, different Seestern animation) from other sessions in the meantime. That had to be reconciled before any of the newer work could safely ship — see "Merge Conflict Resolution" below before touching branch strategy again.

---

## Merge Conflict Resolution — read this before assuming branch state

`main` and `claude/epic-curie-r5ed0o` had diverged by ~90 commits. `main` had its own DC-Runtime-bundle-format Seestern animation (requires `unpkg.com/react` at runtime); this session's branch had a newly-built, dependency-free native Seestern animation. Per the repo owner's decision, the native version replaced main's, while every other independent `main` commit (About redesign, testimonials, homepage particles, portfolio glow effect, etc.) was preserved via a real merge (not a force-push).

**Practical takeaway for future sessions:** before merging any feature branch into `main`, always run `git log --oneline origin/main..HEAD` and the reverse (`git log --oneline HEAD..origin/main`) to check for divergence — don't assume the branch you were handed is up to date with `main`. If both sides have unique commits touching the same files, resolve conflicts file-by-file rather than blindly taking "ours" or "theirs" — check what each side actually changed (in this case, `main`'s changes to shared hero markup turned out to be a legitimate site-wide convention update that was worth keeping, layered on top of the Seestern-specific content decision).

---

## Major Work This Session

### 1. Contact Page — Glass Morph Background (anime.js v4)
**Files:** `js/anime.esm.min.js` (vendored, no CDN), `contact/index.html`, `css/style.css`
A subtle, continuously-morphing SVG polygon sits behind the H1, offset slightly, in muted grey — implements a user-supplied anime.js v4 snippet (`svg.morphTo`) almost verbatim, scoped to the contact page only.

### 2. Button System — Liquid-Glass Pills (multiple iterations)
**Files:** `css/style.css` (`BUTTONS` section)
Replaced the old flat/outline `.btn` system with a glassmorphism pill design, iterated several times based on live feedback:
- Backdrop blur + saturate, layered box-shadow (rim highlight + outer drop shadow)
- `::before` diagonal reflection sweep, `::after` bottom mirror-sheen with a very faint two-color (peach + pastel-blue) wash — both `z-index:-1`, rely on `.btn { position:relative; isolation:isolate; }` to paint behind the label text but above the tint
- **CI blue (`--secondary` #2E54FE) removed entirely from the button system** — the owner found it "irritating." Replaced with a new brand color, `--pastel-blue: #8BE2E9`, used consistently as the hover tint across `.btn--primary`, `.btn--outline`, `.btn--outline-dark`, `.btn--ghost*`
- `.btn--outline` (used on dark hero backgrounds) got its own richer, more graduated reflection gradient — glass reflections read strongest against dark surfaces, so this variant deliberately diverges from the shared base sweep
- Hover transition intentionally slow (0.55s, not the site's usual 0.3s) per explicit feedback that it felt too abrupt
- **Rule: button text stays light in dark-background variants at all times**, even on hover — do not flip to dark text for contrast reasons without checking with the owner first (this was tried once for a related dark card and explicitly reverted)

### 3. Services Page — Core Service Card Hover Bug
**File:** `css/style.css` (`SERVICES PAGE` section)
`.service-full-card--core:hover` still used the old CI blue. Fixing the color alone didn't fix the *feel* — the hover transition was snapping instantly with zero animation despite a `transition` declaration being present. Root cause: the `.reveal` class (used site-wide for scroll-in animations) has the exact same selector specificity (`0,1,0`) as `.service-full-card--core`, and its `transition: opacity ..., transform ...` declaration — appearing later in the cascade — was **silently replacing the entire transition list**, background included, since CSS `transition` shorthand rules don't merge across selectors of equal specificity; the last one wins outright.
**Fix pattern to reuse:** a compound selector `.service-full-card--core.reveal { transition: opacity ..., transform ..., background ...; }` with higher specificity (`0,2,0`) that re-declares every transition the element needs. **When any hover animation seems to have "no transition" despite CSS being correct, check `getComputedStyle(el).transitionProperty` in the browser before assuming the CSS is wrong — a same-specificity class declared later in the file is a common silent culprit.**

### 4. About Page — Several Independent Fixes
**Files:** `about/index.html`, `css/style.css`, `js/main.js`
- Shortened the "My Path" intro paragraph; removed the "Ajaska GmbH" former-employer mention from both the paragraph and the Experience sidebar bullet (owner-requested, no company names)
- Removed the floating "Education / Based in" text badges and the vertical "Kidashi Design · 2026" label from the travel-photo parallax scene — it's photos-only now, no overlay chrome
- **Found and fixed a real CSS bug while doing the above:** the grain-texture SVG overlay (`.about-float-grain`) had `position:absolute; inset:0` but no explicit `width`/`height`. Per the CSS replaced-element sizing algorithm, an `<svg>` with `inset:0` and no intrinsic or explicit size falls back to the browser default replaced-element size (300×150px) rather than stretching to fill its container — this rendered as a small, oddly-textured rectangle instead of covering the scene. **Fix pattern to reuse:** `inset:0` alone does not reliably stretch `<svg>`/`<img>`/`<canvas>` — always pair it with explicit `width:100%; height:100%;` for replaced elements.
- The photo collage sat inside a `.about-float-scene` capped at 960px/70vh, which — nested inside the wider `.container` and the full-bleed dark `.about-hero-float` section — read as a visibly smaller, lighter "boxed" area against the section's pure-black background. Enlarged the container and scene caps (1560px / 1480px / 82vh) so photos fill much more of the dark section; the boxed look is gone.
- The mouse-tracking glow effect on the four "My Path" sidebar cards (Education/Experience/Services/Currently Based) computed its hue from live mouse X position with a wide spread, meaning the "brand color" glow actually swept through most of the color wheel depending on where the cursor was. For these brand-owned cards specifically, hue/saturation/lightness are now locked to the exact CD color values (`CI_COLOR_MAP` in `js/main.js`, scoped to `.sidebar-block`) — no more off-brand drift. The portfolio grid's per-project glow colors (a different, intentional design — each project tile gets a color matching *that* project's own identity) were left untouched.

### 5. Portfolio
- Homepage "Selected Work" grid had 3 tiles in a 2-column layout, leaving an orphaned half-empty row. Added Seestern as a 4th tile.
- Art Gerecht Modular's portfolio grid tile had a completely unstyled `<div class="portfolio-item__info">` (title + category text) permanently visible over the animation — no other tile has this pattern, and the animation itself already has its own `tile-mode` that hides its internal logo. Removed the stray overlay div.

### 6. Seestern Animation — Native Format, Multiple Fixes
**File:** `portfolio/seestern/seestern-animation.html` (see SESSION.md for the two-animation-format explainer — this one is dependency-free, not a DC-Runtime bundle)
- **Hero-strip edge flicker, root-caused and fixed:** the 5-panel accordion only animated panel *height* (width stayed fixed via `flex:1 1 0`). Since the images used `object-fit:cover` at `width:100%; height:100%` of their (height-animating) parent, the browser recomputed the crop window every single frame — and because the source photos (especially the water-reflections one) have bright highlights near their edges, the recrop caused a visible flash sweeping in/out at the panel's left/right edges as the crop boundary crossed those hotspots. **Fix pattern to reuse:** when animating a container's size with `object-fit:cover` content inside, decouple the image's own layout size from the animated dimension — here, the image height is set once via JS to the panel's peak (100%) pixel height and kept fixed; only `transform: translateY(-50%) scale()` animates. The crop window is now computed once and never shifts horizontally.
- Hero-strip row stretched taller (54vh/560px cap, up from 44vh/480px) with more top padding, per feedback and to keep clear of the transparent nav overlay.
- Endscreen: removed all brand text entirely (was "Seestern" / "Britzer Garten" in custom fonts). Recentered the logo mark — and every effect built around its old off-center anchor point (radiant rays, breathing halo, energy rings, glint sweep, sparkles, gradients) — from y=430 to y=540 in the 1920×1080 viewBox, landing on an exact horizontal + vertical center (verified via `getBoundingClientRect()`, 0px offset both axes).

---

## Sandbox / Verification Notes for Future Sessions

- This environment has **no outbound access to `unpkg.com` or `fonts.googleapis.com`** — that's expected, not a bug in the code. It means DC-Runtime-bundle-format animations (see SESSION.md) can't be fully rendered here; native-format animations (like the rebuilt Seestern one) can be.
- Local preview server: use `nohup python3 -m http.server 8199 --bind 127.0.0.1 --directory <repo> > /tmp/srv.log 2>&1 & disown` — a plain `&` background without `nohup`/`disown` gets killed on the next tool call in this sandbox.
- Playwright: `npm install --no-save playwright-core`; Chromium is preinstalled at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` — never run `playwright install`.
- Always `pkill -f http.server` and remove `node_modules`/`package.json`/`package-lock.json` before committing — they're not meant to ship.

---

## CSS Design Tokens (see SESSION.md for the full, corrected list)

The most important thing to know: **`--primary` is peach/orange (#FFBC95), `--secondary` is the CI blue (#2E54FE)** — the names are not intuitive, don't guess a hex value from the variable name. A new `--pastel-blue` (#8BE2E9) was added this session and is now the preferred blue accent everywhere the owner would previously have seen `--secondary`.

---

## Git Workflow (as actually used this session)

- **Base branch:** `main` (production, auto-deploys via FTP on push — currently broken, see SESSION.md)
- **Working branch:** `claude/session-md-mcesc8`
- **Merge strategy:** real merges (not squash) for the initial `main` ↔ `epic-curie-r5ed0o` reconciliation to preserve both histories; regular PR + merge for everything after
- Six PRs this session: #58 (Seestern rebuild + logo fonts), #59 (contact morph), #60 (merge resolution + fixes), #61 (button glass v1 + CI blue removal), #62 (button glass v2 refinements), #63 (Seestern/services/portfolio/about fixes)

---

## Open Items

See SESSION.md's "Offene Aufgaben" table — it's the single source of truth for open tasks and is kept current each session. As of this handoff: Hostinger FTP secrets still missing (blocks live deploy), several portfolio projects still waiting on assets from Nicole, testimonials/GA4 pending owner input.

---

## Contact & Support

**Site:** https://www.kidashidesign.com
**Repo:** KidashiDesign/kidashi-design-website
**Owner:** Nicole Szatkowski (szatkowski.nicole@hotmail.de)
