# Kidashi Design Website — Project Context

**Last Updated:** 2026-06-28  
**Repository:** KidashiDesign/kidashi-design-website  
**Live Site:** https://www.kidashidesign.com  
**Deploy:** GitHub Actions → FTP → Hostinger (on `main` push)

---

## Project Overview

Static portfolio website for **Nicole Szatkowski**, IHK-certified graphic designer. No framework, no build tool — pure HTML/CSS/JavaScript.

- **Owner:** Nicole Szatkowski (szatkowski.nicole@hotmail.de)
- **Role:** Full-stack design + development (personal portfolio)
- **Git Branches:** Develop on feature branches, PR to `main` with squash merge
- **Active Dev Branch:** `claude/charming-faraday-0qs3ov` (for future sessions)

---

## Current Tech Stack

| Layer | Tech | Details |
|-------|------|---------|
| **HTML** | Static | No templating. 22+ pages, hand-coded. |
| **CSS** | Vanilla + Custom Props | Design tokens: `--primary`, `--bg`, `--dark`, `--muted`, `--section-pad`, etc. |
| **JS** | Vanilla ES6+ | No build step. 3 main modules: `main.js`, `fluid-particles.js`, `portrait-3d.js` |
| **Fonts** | MangoGrotesque (TTF) + Jost (Google Fonts) | Self-hosted + non-blocking Google import. |
| **Animations** | requestAnimationFrame, CSS transforms | No libraries. 3D transforms, perspective, parallax. |
| **Observers** | IntersectionObserver, custom RAF loops | For scroll reveals, reveal delays, parallax. |

---

## Key Features (Current Session)

### 1. Hero H1 Scramble Decrypt Animation
- **Words:** YOU / THE PLANET / THE ALGORITHM / YOUR COMPANY / YOUR FUTURE / YOUR SUCCESS
- **Timing:** 700ms scramble + 700ms reveal + 2s hold + 2.5s pause = ~5.2s per cycle
- **Char Pool:** `0123456789!@#$%^&*<>{}|\/~+-=_` (no emoji chars for mobile safety)
- **Styling:** Original H1 font/color/size preserved (no style overrides)
- **Code:** `js/main.js` lines ~630–720

### 2. Fluid Particle Canvas
- **Location:** Hero `<canvas id="fluid-canvas">` (parent-scoped, not full window)
- **Mobile:** 200 particles, 150px blast radius, 60px interaction distance
- **Desktop:** 100 particles, 300px blast radius, 100px interaction distance
- **Code:** `js/fluid-particles.js` (standalone class)

### 3. 3D Portrait Hover
- **Applied:** `/index.html` (about-teaser) + `/about/index.html` (about-hero)
- **Max Tilt:** 6° in any direction
- **Float:** 0 to +10px downward only (prevents top clipping on scroll)
- **Glare:** 13% opacity, follows tilt direction
- **Image Zoom:** 140% width, `object-fit: cover`, `object-position: left top` (hides right black bar)
- **No Shadow:** Removed for cleaner look
- **Code:** `js/portrait-3d.js` + CSS classes `.p3d-scene`, `.p3d-card`, `.p3d-glare`

### 4. Services Process Scroll (Mobile)
- **Before:** Mobile → static vertical list
- **Now:** Same scroll-driven animation as desktop (all devices)
- **Code:** `js/main.js` lines ~498–565 (removed `isMobile` branch)

### 5. Static Headlines Everywhere
- All H2/H3/H4 are now plain text (no cycling, no scramble)
- Only H1 on Hero has animation
- **Pages affected:** About, Services, Portfolio, Gallery, Contact

---

## CSS Design Tokens

```css
--primary: #FFBC95         /* Brand accent (warm peach) */
--bg: #F7F3EE              /* Light cream background */
--bg2: #FDFBF8             /* Slightly darker cream */
--dark: #0A0A0B            /* Deep black text */
--text: var(--dark)        /* Alias for dark */
--muted: rgba(..., 0.55)   /* Secondary text */
--cream: #F7F3EE           /* Light text on dark bg */
--sand: rgba(196, 173, 148, 0.18)  /* Border color */
--terra: (earth orange)    /* Link color */
--ease: cubic-bezier(0.25, 0.46, 0.45, 0.94)  /* Standard easing */
--section-pad: clamp(48px, 8vw, 80px)  /* Responsive padding */
--gutter: clamp(16px, 3vw, 40px)  /* Responsive padding */
--nav-h: 80px              /* Nav height */
--container: 1200px        /* Max container width */
```

---

## Responsive Breakpoints

| Breakpoint | Usage |
|-----------|-------|
| **768px** | Tablet → Mobile transition (nav stacks, grids to 1-col, etc.) |
| **480px** | Small phone optimizations |
| **1024px** | Tablet-specific tweaks (display cards collapse, etc.) |

---

## File Architecture

### Root Structure
```
/
├── index.html              (Hero + About Teaser + Services + Portfolio + Gallery + CTA)
├── about/index.html        (About Hero + Content + Values)
├── services/index.html     (Process Scroll + Services Grid + Display Cards)
├── portfolio/index.html    (Portfolio Grid + Filtering)
├── gallery/index.html      (Gallery Grid + Lightbox)
├── contact/index.html      (Contact Form + Info)
├── css/
│   └── style.css          (7000+ lines: layout, animations, responsive, tokens)
├── js/
│   ├── main.js            (2000+ lines: nav, cursor, gooey, scroll handlers, forms)
│   ├── fluid-particles.js (250 lines: canvas particle class)
│   └── portrait-3d.js     (160 lines: 3D portrait wrapper + interaction)
├── images/                (Portfolio, gallery, portraits)
├── fonts/                 (MangoGrotesque TTF)
├── HANDOFF.md             (Session summary)
└── CONTEXT.md             (This file)
```

### Key CSS Classes

**Hero Section:**
- `.hero2` — main container (sticky on desktop)
- `.hero2__cycle` — animated H1 span (scramble target)
- `.hero2__static` / `.hero2__static-break` — static text parts
- `.hero2__sub-row` — tagline row
- `.hero2__bg` — background (contains canvas now)

**Portrait:**
- `.about-teaser__portrait` — home page portrait container
- `.about-hero__portrait` — about page portrait
- `.portrait-3d` — marker class for JS init
- `.p3d-scene` / `.p3d-card` / `.p3d-glare` — 3D effect wrappers (auto-created by JS)

**Process Scroll:**
- `.cs-outer` / `.cs-sticky` — scroll container + sticky element
- `.cs-device` / `.cs-device__screen` — device shell + screen
- `.cs-steps` / `.cs-step` — step list + individual step
- `.step-in` — active step class (added by JS on intersection)

**Display Cards (Services):**
- `.dc-wrap` / `.dc-stack` — container + card stack
- `.dc-card` / `.dc-card--1`, `--2`, `--3` — individual cards (back, middle, front)
- `.dc-in` — revealed state (added by JS on scroll)

---

## JavaScript Modules

### `main.js` (~2000 lines)

**Custom Cursor (lines 1–120):**
- Follows mouse/touch
- Scales on hover
- Glyphs rotate: `✦✧✶✷✴` (desktop-only)

**Hero Scramble Animation (lines 630–720):**
- Two-phase: scramble (700ms) → reveal (700ms)
- Char pool: `0123456789!@#$%^&*<>{}|\/~+-=_`
- Loops through 6 words with 2.5s pause

**Hero Scroll Reveals (lines 202–226):**
- H2 "A Visual Designer" slides in from sides on scroll
- Used for `.hero2__reveal-h2` text

**Services Process Scroll (lines 498–565):**
- Desktop: scroll-driven, one step at a time
- Mobile: same as desktop (no longer static)
- Lerps card tilt, header drift, step opacity

**Display Card Stack (lines 567–583):**
- Waits for intersection, then staggered reveals
- 480ms delay between card 1 → 2 → 3
- `.dc-in` class triggers CSS animation

**Gooey Word Cycling (lines 122–200):**
- Auto-init on `[data-gooey-texts]` elements
- **Note:** Currently removed from all headline spans (only used in old code)

**Scroll Listeners:**
- Nav scroll shadow (`.scrolled` class)
- Gallery parallax
- Footer CTA parallax
- H3 parallax drift

---

### `fluid-particles.js` (~250 lines)

**Class:** `FluidParticles`

**Constructor Options:**
```javascript
new FluidParticles('#fluid-canvas', {
  particleDensity: 100,              // Desktop default
  particleSize: 1,
  particleColor: '#333333',          // Base color
  activeColor: '#FFBC95',            // On hover
  maxBlastRadius: 300,               // Click blast
  hoverDelay: 100,                   // Before blast triggers
  interactionDistance: 100,          // Hover repulsion range
})
```

**Key Methods:**
- `destroy()` — cleanup (removes event listeners, cancels RAF)

**Features:**
- Uses parent element bounds (not window)
- Responsive density on mobile
- Mouse coords via `getBoundingClientRect()`
- Touch + click support

---

### `portrait-3d.js` (~160 lines)

**Class:** None (IIFE that auto-initializes on `.portrait-3d` elements)

**Behavior:**
- Wraps `<img>` in `.p3d-scene` → `.p3d-card` → `.p3d-glare`
- Lerp-based smooth motion (0.08 speed)
- Float: `(1 - Math.cos(elapsed * FLOAT_SPEED)) / 2 * FLOAT_AMP` → 0 to +10px downward
- Tilt: ±6° from center
- DeviceOrientation (gyro) on mobile
- Touch on mobile (60% tilt reduction vs desktop)

**CSS Classes Added by JS:**
- `.p3d-scene` — perspective container
- `.p3d-card` — 3D transform target (has `overflow: hidden`)
- `.p3d-glare` — radial gradient glow effect

---

## Common Issues & Solutions

### Portrait Top Clipping on Scroll
**Problem:** 3D tilt + `overflow: hidden` on outer container clipped top corners.  
**Solution:** Outer container uses `overflow: visible`, `.p3d-card` has `overflow: hidden` (clips image cleanly).  
**Float:** Changed from `sin()` (−10 to +10) to `(1−cos)/2` (0 to +10) downward only.

### Mobile Emoji in Scramble
**Problem:** Unicode stars `✦✧✶✷✴` render as colored emoji on iOS/Android.  
**Solution:** Removed from char pool. Desktop cursor retains stars (hover-only, never on mobile).

### H2/H3 Static Now
**Problem:** Previous gooey-word cycling was removed.  
**Solution:** All headlines are plain text. Only Hero H1 has scramble animation.

### Portrait 140% Width Black Edge
**Problem:** Image stretched to 140% to zoom in, but right edge shows black frame.  
**Solution:** `object-position: left top` crops right side. Zoom sufficient to hide edge completely.

---

## Deployment & CI/CD

**Trigger:** Push to `main`  
**Action:** GitHub Actions workflow  
**Steps:**
1. Build (if needed — none in this case)
2. Deploy via FTP to Hostinger
3. Purge cache (if configured)

**Hosting:** Hostinger (FTP)  
**Domain:** kidashidesign.com (via Hostinger DNS)

---

## Confidentiality & Branding Rules

**STRICT — Do not violate:**
- ❌ No AI workflow visible on public site (Nicole = real certified designer)
- ❌ Don't name "Gianluca Crepaldi" → say "Freelance collaboration with esports event organizer"
- ❌ Hide project "Wiedmann & Winz" completely (not in portfolio)
- ❌ No private customer contact data visible
- ❌ Email `nicole@kidashidesign.com` only in HTML comments, never visible on page

---

## Performance Considerations

1. **Canvas:** `parentElement.offsetWidth/Height` prevents rendering off-screen
2. **Animations:** All use `requestAnimationFrame` for 60fps
3. **Fonts:** MangoGrotesque preloaded, Jost loaded non-blocking
4. **Images:** `loading="lazy"` + `decoding="async"` where applicable
5. **3D Transforms:** `will-change: transform, box-shadow` on animated elements
6. **Pointer Events:** Canvas has `pointer-events: none` to not block nav clicks

---

## Next Session Checklist

- [ ] Verify all 48 commits are on `main` and live
- [ ] Test Hero scramble animation on mobile (no emoji)
- [ ] Check 3D portrait for clipping on scroll (should not occur now)
- [ ] Verify Services page has line break after period
- [ ] Confirm all gooey effects removed except Hero H1
- [ ] Test responsive spacing on mobile (should feel less tall)
- [ ] Validate particle canvas interaction on desktop/mobile

---

## Quick Start for Next Dev

1. **Clone & Install:**
   ```bash
   git clone https://github.com/KidashiDesign/kidashi-design-website.git
   cd kidashi-design-website
   git checkout main
   ```

2. **Dev Branch:**
   ```bash
   git checkout -b claude/feature-name
   ```

3. **Test Locally:**
   - No build step — just open `index.html` in browser
   - Test on mobile via DevTools or actual device

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Feature description"
   git push -u origin claude/feature-name
   ```

5. **Create PR:**
   - Use GitHub UI or `gh pr create`
   - Squash merge to `main` when approved

6. **Deploy:**
   - Push to `main` → GitHub Actions → live in ~2 min

---

## Files to Know

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Code review standards (German) + confidentiality rules |
| `HANDOFF.md` | Session summary + features implemented |
| `CONTEXT.md` | This file — for onboarding new sessions |
| `css/style.css` | All styling (7000+ lines, single file) |
| `js/main.js` | Main logic (2000+ lines, no tree shaking) |
| `index.html` | Homepage + hero section |

---

## Contact & Questions

**Owner:** Nicole Szatkowski  
**Email:** szatkowski.nicole@hotmail.de  
**Site:** https://www.kidashidesign.com  
**Repo:** https://github.com/KidashiDesign/kidashi-design-website

---

**This context file is designed to be loaded into a new Claude Code session for continuity. Read HANDOFF.md for a summary of the most recent session.**
