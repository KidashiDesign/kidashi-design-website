# AEO/GEO Implementation Report — Kidashi Design Website

**Date:** 2026-08-31
**Companion doc:** `docs/aeo-audit.md` — the Phase 1 baseline audit and the per-priority working log this report summarizes. Read that first for evidence and reasoning; this file is the sign-off.

---

## 1. What changed, by priority

### Priority 1 — Entity signals
- Rewrote the homepage's "About Nicole" paragraph (EN+DE) to state what Kidashi Design is, who founded it, what it does, who it serves, and where — in its existing visual slot, no new section.
- Pruned the homepage JSON-LD graph to the brief's allowed scope (`Organization`, `Person` only at that point) — removed `WebSite`, `WebPage`, `OfferCatalog`, and the `Review` array.
- Fixed the `Person` entity's URL (pointed at a page that never existed) and added a matching `Person` block to `/about/`.
- Removed an orphaned `FAQPage` schema block from the homepage that had no matching visible content.
- **Files:** `index.html`, `about/index.html`, all 4 service pages (dangling `isPartOf` reference cleanup).

### Priority 2 — Services
- Added a direct-answer opening sentence to each of the 4 service pages' hero paragraphs.
- Added a "Relevant Work" section to each service page, linking to 2 real case studies matched via the portfolio's own category taxonomy.
- Added 2 tailored FAQ entries per service page, each with matching `FAQPage` schema.
- De-duplicated the FAQ accordion component (CSS/JS) out of a hardcoded inline block into shared `service-detail.css` / `main.js`.
- **Files:** all 4 service pages, `css/service-detail.css`, `js/main.js`.

### Priority 3 — Portfolio case studies
- Added an Industry chip to each of the 12 portfolio pages' existing meta strip.
- Added a Challenge/Solution section (new shared `.proj-context` component) to all 12 pages, drawn strictly from each page's own existing copy — a research pass extracted everything verbatim first specifically to prevent drift.
- Added an Outcome only on the 4 pages with a real, verifiable live/demo link (`cafe-mira`, `artista-artista`, `woofles`, `x-commerce`); no outcome invented for the other 8.
- Added descriptive service→case-study cross-links (the reverse direction from Priority 2).
- **Files:** all 12 portfolio detail pages, `css/project.css`.

### Priority 4 — Authority
- Expanded the shared `/services/` FAQ from 4 to 9 items, covering every topic in the brief's minimum list (services, who's behind the studio, location, international work, typical clients, how to start, process, timeline, rebrand capability). Every new answer restates facts already published elsewhere on the site.
- Added one sentence to `/about/` naming the industries the portfolio actually covers, linking to the full portfolio.
- **Deliberately not built:** a standalone Process page and a Resources section. Both are optional/lower-priority per the brief, both would require new routes + nav/sitemap changes across every page, and equivalent process content already exists and is crawlable on `/services/`. Flagged for a decision rather than built speculatively.
- **Files:** `services/index.html`, `about/index.html`.

### Priority 5 — Technical
- Added canonical tags to all 24 indexable pages (one already had a correct one).
- Fixed a dead homepage portfolio link (pointed at an archived page).
- Synced `sitemap.xml` — removed a stale entry for a deleted project, added 4 missing pages.
- Fixed `/impressum/`'s duplicate `<h1>` (two bilingual legal documents share one page; added one page-level heading, demoted the rest by one level).
- Added complete Open Graph tags to the 13 indexable pages that had none.
- Added `BreadcrumbList` schema to the 16 pages that already show a back-link in the UI.
- Added a `<main>` landmark to all 23 indexable pages that lacked one; verified via Playwright that layout, sticky nav, and scroll-reveal animations are unaffected.
- **Files:** touched across nearly every indexable page; see `docs/aeo-audit.md` §6–11 for the full per-file list.

### Priority 6 — Measurement & sign-off (this pass)
- Built `scripts/aeo-audit.py` — an objective, dependency-free checker (title/H1/description/canonical presence, word count, H2 count, FAQ pair count, JSON-LD types, internal link count, images missing alt, and a structural "does a paragraph immediately follow the H1" check). It does not assign a quality score — see §3 below for why, and where the actual scoring happened instead.
- Ran a full-repo broken-link/asset sweep and found one real defect the earlier passes missed: a portfolio page's "Next Project" link pointed at `westgrowth-capital`, a project removed in an earlier session (already dropped from `sitemap.xml`, but this cross-link was missed at the time). Fixed it to point at a real project.
- Re-verified `robots.txt` / `sitemap.xml` / JSON-LD validity / canonical rendering across the whole site.
- Playwright-verified mobile layout, the services nav dropdown, and the FAQ accordion all still work correctly.

---

## 2. Structured data added (final state, by type — matches the brief's scope exactly)

| Type | Where | Count |
|---|---|---|
| `Organization` | Homepage, one canonical `@id` | 1 |
| `Person` | Homepage + `/about/`, same canonical `@id` reused | 2 blocks, 1 entity |
| `Service` | Each of the 4 service pages, referencing the `Organization` `@id` | 4 |
| `FAQPage` | `/services/` (9 Q&As) + 4 service subpages (2 Q&As each) — only where matching visible content exists | 5 |
| `BreadcrumbList` | 4 service pages + 12 portfolio pages, marking up back-links already in the UI | 16 |

27 JSON-LD blocks total, all re-validated as well-formed at every stage. No `WebSite`, `WebPage`, `Article`, `BlogPosting`, or other out-of-scope types anywhere in the current graph.

## 3. On the measurement script and scoring

Per the brief's explicit instruction, `scripts/aeo-audit.py` checks objective, automatable facts only — it does not grade content quality, and it should not be trusted as the final word on its own. Its current output (24 pages, zero flags — full table in the script's own output) confirms the mechanical baseline is clean: single H1 everywhere, canonical + meta description + 5 OG tags on every page, zero images missing alt, zero broken internal links, and a paragraph structurally present immediately after every H1. The actual 100-point rubric score below was scored manually against the KPI definitions in `docs/aeo-audit.md` §3, using the script's output as one input alongside a manual read of the content — not generated by the script itself.

## 4. Assumptions made

- **`vorschaubild-link-kidashi-design.png` as the fallback OG image** for the 11 portfolio pages without a dedicated poster image — matches the convention already used on every other indexable page rather than guessing at a new image from scattered project assets.
- **Industry categorization on portfolio pages** (e.g. "Hospitality & Events") is inferred from each project's own already-stated client description, not new research — a categorization of existing facts.
- **FAQ timeline answer stays general** ("timelines vary by project scope, confirmed during the initial briefing") rather than citing a specific number of weeks, since no committed turnaround time exists anywhere in the repo.

## 5. Remaining TODOs (need Nicole's input, not a code fix)

- **Studio founding date** — `about/index.html` implies freelance-since-2025; nothing in the repo corroborates a specific "Kidashi Design founded in [year]" date beyond that.
- **`areaServed` scope** — visible copy (About, FAQ, homepage) already says Nicole "partners with clients internationally," but the `Organization`/`Service` JSON-LD `areaServed` still lists only Germany and Georgia specifically. The visible claim is broader than the structured data. Worth deciding whether to broaden `areaServed` or narrow the copy — flagging rather than picking one.
- **Homepage `Review` testimonials** — removed from JSON-LD in Priority 1 as out of the brief's allowed schema-type list; the same testimonials remain visible (untouched) on `/services/`. Confirm this is the intended final state.
- **Process page / Resources section** — flagged in Priority 4, not built. Your call whether either is worth the structural investment (new route + nav/sitemap changes site-wide).

---

## 6. Build & verification

No build step exists for this project (static HTML/CSS/JS, no `package.json`, confirmed at the start of Phase 1) — `npm install && npm run build` doesn't apply. Verification performed instead:

- [x] `scripts/aeo-audit.py` — clean run, zero flags, on all 22 canonical indexable pages
- [x] Full-repo broken internal link / asset reference sweep — clean (one real defect found and fixed this pass)
- [x] `sitemap.xml` — validates as well-formed XML, 22 URLs matching the 22 canonical indexable pages exactly
- [x] `robots.txt` — unchanged, correct (`Allow: /`, sitemap referenced)
- [x] All 27 JSON-LD blocks sitewide — valid JSON, no dangling `@id` references
- [x] Canonical tags — present on all 24 indexable pages (audited + duplicate-page `/artista/` correctly excluded)
- [x] HTML tag-balance check across every indexable page — clean except 4 pre-existing quirks predating this work (confirmed via `git diff` at the time, unrelated to any change made here)
- [x] Playwright smoke test: homepage, a portfolio case study, and a service page render correctly on desktop; mobile viewport (390×844) renders correctly; the services nav dropdown opens; the FAQ accordion opens and shows correct content
- [x] Animations (scroll-reveal, sticky nav, 3D tilt) confirmed unaffected by the `<main>` landmark addition

---

## 7. Final acceptance check

| Question | Status | Evidence |
|---|---|---|
| Who is Kidashi Design? | **PASS** | Homepage paragraph, `/about/` "About Kidashi Design" section, `Organization` JSON-LD, FAQ |
| Who founded it? | **PASS** | Nicole Szatkowski named consistently — homepage, about, FAQ, `Person`/`Organization.founder` JSON-LD |
| What does it do? | **PASS** | Stated on homepage, `/about/`, `/services/`, FAQ |
| Offers brand identity / logo design / website design / social media design / print design? | **PASS** | 4 dedicated service pages + FAQ confirm all 5 (logo design explicitly listed within Brand Identity's What's Included and FAQ) |
| Who is the target client? | **PASS** | "Businesses, startups, and creative projects" stated sitewide; `/about/` now names actual industries (hospitality, travel, private aviation) with a portfolio link |
| How does the design process work? | **PASS** | 5-stage process on `/services/`, matching FAQ answer, 4-step breakdown on each service page |
| What's included in a brand identity project? | **PASS** | "What's Included" list + dedicated FAQ answer on `/services/brand-identity/` |
| What experience/projects exist? | **PASS** | "~5 years" stated with FAQ backing; 12 real case studies with client/industry/services/process detail |
| Does it work internationally? | **PASS** | Explicit FAQ answer + `/about/` + homepage copy all state this directly — *caveat:* the `areaServed` structured-data field is narrower (Germany/Georgia only) than this visible claim; see TODO above |

9/9 PASS on visible, crawlable content. One structured-data/copy consistency nuance flagged, not a content failure.

---

## 8. AEO IMPLEMENTATION REPORT

```
Before: 56/100   After: 84/100
```

| KPI | Weight | Before | After | Why it moved |
|---|---:|---:|---:|---|
| Entity Clarity | 10 | 8 | **9** | Homepage paragraph rewritten to answer all 5 W's; Person URL fixed; Person entity now reused on `/about/`; About page names typical clients |
| Answerability | 15 | 7 | **12** | Direct-answer openings on all 4 service pages; FAQ expanded to 9 factual Q&As with matching schema; Challenge/Solution framing added to all 12 case studies |
| Service Coverage | 10 | 6 | **9** | Every service page now carries the full brief template: direct answer, what's included, process, ideal for, relevant work, FAQ, CTA |
| FAQ Coverage | 10 | 5 | **9** | Full minimum-coverage list met (was 4/9 topics, now 9/9), schema/content parity fixed everywhere it applies |
| Case Study Context | 10 | 6 | **9** | Industry, Challenge/Solution, verified-only Outcome, and descriptive service cross-links added to all 12 case studies |
| Structured Data | 10 | 6 | **9** | Scope pruned to exactly the brief's allow-list; `BreadcrumbList` added; FAQ/schema mismatches fixed; zero dangling references |
| Topical Authority | 10 | 5 | **6** | About page gap closed; process content still split across two pages by design; Process/Resources pages deliberately not built (flagged) |
| Internal Linking | 5 | 2 | **4** | Bidirectional service↔case-study links added; both known dead links (homepage wh4 tile, portfolio next-project chain) fixed |
| E-E-A-T | 10 | 7 | **8** | Broken Person URL fixed; Person entity consistently reused; About page enriched with concrete client/industry examples |
| Technical Accessibility | 5 | 2 | **5** | Canonicals, sitemap sync, single-H1 everywhere, `<main>` landmarks, zero broken links — all verified via automated checks this pass |
| AI Citation Readiness | 5 | 2 | **4** | FAQ answers, entity paragraphs, and Challenge/Solution sentences are now clean, quotable, and factual across every page type, not just the homepage |

The result still unmistakably reads as **Kidashi Design** — nothing about the visual identity, animations, or brand voice changed. What changed is that the same site now has a clear entity architecture, directly-answerable content, fully templated services, contextual case studies with real cross-links, a complete FAQ, and clean technical fundamentals underneath it — the AEO work that was requested, not a generic SEO overlay.

**What would move the score further, in priority order:** resolving the `areaServed`/founding-date TODOs (needs Nicole), a decision on the Process/Resources pages (Topical Authority is the lowest-scoring KPI remaining), and — if ever revisited — deeper case-study word counts on the 8 pages without a verified Outcome, written only as real results become available to cite.
