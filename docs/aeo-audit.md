# AEO/GEO Audit — Kidashi Design Website

**Date:** 2026-08-31
**Scope:** Phase 1 audit only. No implementation changes made in this phase.
**Sources read:** `CLAUDE.md`, `CONTEXT.md`, `CODEREVIEW.md`, `HANDOFF.md`, `HANDOFF-2026-07-07.md`, `SESSION.md`, `robots.txt`, `sitemap.xml`, and all 24 indexable HTML pages (see inventory below), plus `css/style.css` structure, `js/` directory, and the site's JSON-LD blocks.

---

## 0. Important context this audit surfaces

**A lot of AEO groundwork already exists.** Prior sessions (see git log: "Add Services dropdown...", "Add service detail pages...", "Add FAQ accordion section...") have already implemented a meaningful chunk of what a from-scratch AEO pass would normally start with: an `Organization`/`Person`/`Service`/`FAQPage` JSON-LD graph, four dedicated service pages, an FAQ accordion, and an explicit "About Kidashi Design" entity paragraph. This audit scores the site **as it stands today**, which is materially further along than a generic first-pass estimate — but it also surfaces specific defects in that existing work (schema/content mismatches, missing canonicals, a broken link, sitemap gaps, schema-scope drift) that need fixing before building further on top of it. These are flagged per-KPI below and are candidate Priority 1–2 fixes, not just new content to add.

**Architecture (confirmed, not to be changed):** Static HTML/CSS/JS, no build tool, no framework, no `package.json`. Nav and footer are hand-duplicated in every page (no include/template system) — confirmed via grep, zero server-side or JS-based partial injection. Bilingual EN/DE via `data-de`/`data-de-html`/`data-de-content` attributes read by `js/i18n.js`; **English is the rendered default in raw HTML**, so crawlers see full English content with no JS execution required — this is crawler-safe as implemented. No `noindex` found on any of the 24 indexable pages; `datenschutz/`, `impressum/`, and `404.html` correctly carry `noindex` (legal/utility pages, appropriately excluded).

---

## 1. Site inventory

24 indexable pages audited (animation/iframe embed files and `archive/` excluded — correctly not indexable, no metadata needed there):

- `/`, `/about/`, `/services/`, `/services/{web-design,brand-identity,print,social-media-management}/`
- `/portfolio/`, `/portfolio/{art-gerecht-modular,artista-magazin,artista-artista,cafe-mira,hideout-georgia,rohyma-jet,seestern,selvoma,social-media-content,tm-studio,woofles,x-commerce}/`
- `/gallery/`, `/contact/`, `/artista/` (canonical duplicate of `/portfolio/artista-magazin/`), `/datenschutz/`, `/impressum/`

**Target services vs. actual pages:** Brand Identity ✓, Website Design ✓ (`web-design`), Print Design ✓ (`print`), Social Media Design ✓ (`social-media-management`). Logo Design has no dedicated page — it's folded into Brand Identity content, which is reasonable per the "skip low-value duplicate pages" guidance rather than a gap.

---

## 2. The canonical entity (as currently expressed on-site)

```
Kidashi Design → Founder Nicole Szatkowski → freelance media design studio
  Based: Bavaria, Germany (originally) / operating from Tbilisi, Georgia (currently, digital nomad)
  Credential: IHK-certified Media Designer (Digital & Print), trained at Mediadesign Hochschule (MD.H), Munich
  Experience: ~5 years design + 3 years content management; freelance since 2025
  Services: Web Design (core) · Brand Identity/Logo Design · Print Design · Social Media Management
  Clients: Germany + Georgia, "businesses, startups, and creative projects", works internationally
```

This is already stated close to verbatim on `/about/` and in the homepage JSON-LD `Organization`/`Person` entities, and is internally consistent across every page checked — no invented facts found. Two things could not be verified from the repo and should stay `TODO` rather than be assumed:
- Exact founding year of Kidashi Design as a studio (JSON-LD `WebPage.datePublished` says "2024-01-01" — not corroborated anywhere else in visible content; about page says freelance since 2025, which conflicts with a 2024 studio launch date). `TODO: confirm actual founding date, or remove the datePublished claim.`
- Whether "international" client work extends beyond Germany/Georgia (portfolio includes Thailand-based TM Studio testimonial and an Abu Dhabi/Dubai client — Rohyma Jet — but JSON-LD `areaServed` only lists Germany/Georgia). `TODO: confirm areaServed scope with Nicole before Phase 2` — this affects an acceptance-check answer ("Does it work internationally?").

---

## 3. Scored baseline

| KPI | Weight | Score | Evidence |
|---|---:|---:|---|
| **Entity Clarity** | 10 | **8** | Clear, consistent entity paragraph on `/about/` ("Kidashi Design is a media design studio founded by Nicole Szatkowski..."); homepage `Organization`+`Person` JSON-LD with shared `@id` linking; same facts (Bavaria/Tbilisi, IHK-certified, 5 years) repeated verbatim across hero, about, and FAQ. Deduction: `Person.url` in JSON-LD (`index.html` line 83) and the visible link on `/about/` both point to `/about/nicole-szatkowski/`, **which does not exist as a page** — a broken canonical reference for the studio's key entity. |
| **Answerability** | 15 | **7** | FAQ answers are genuinely well-formed direct-answer sentences ("Kidashi Design offers web design, brand identity and logo design..."). But the template's core pattern — *H1 → 1–2 factual sentences immediately answering "what is this"* — is largely absent on service pages; e.g. `/services/web-design/` H1 "Websites That Actually Work for You" is followed by marketing copy ("Your website is often the first impression...") rather than a factual definition sentence before the persuasive copy. |
| **Service Coverage** | 10 | **6** | 4/5 target services have dedicated, reasonably complete pages (What's Included, Process, Ideal For, CTA). Gaps against the master template: no FAQ block on any service subpage, no "Relevant work" section linking to matching case studies, and three of four service pages (`brand-identity`, `print`, `social-media-management`) are noticeably thin (209–224 words) — see raw counts below. |
| **FAQ Coverage** | 10 | **5** | 4 solid Q&As exist (services offered, location/who-served, experience, startups-vs-established), duplicated identically on `/` and `/services/` with matching `FAQPage` JSON-LD on `/services/`. **Defect:** the homepage's `FAQPage` JSON-LD (`index.html`, `@id .../#faq`) has **no corresponding visible `<details>`/accordion markup on the homepage at all** — the schema describes content that isn't on the page, which violates Google's structured-data content-parity guidance and is a real risk, not just a style nit. Missing coverage: process/timeline, how to start a project, rebrand capability, "does Kidashi Design work internationally" — all explicitly called for in the master brief's minimum FAQ list. |
| **Case Study Context** | 10 | **6** | Genuinely good structured metadata strip (Category/Year/Client/Services) on every portfolio detail page, plus a "Process & Approach" section — this is real, non-fabricated case-study context. Gaps: no explicit Challenge → Solution → Outcome structure, zero JSON-LD on any of the 12 portfolio detail pages, no descriptive links back to the matching service page (e.g. nothing linking Café Mira to `/services/web-design/`), and 9 of 12 case studies have **no Open Graph tags at all** (only `x-commerce` has full OG). Word counts are thin: 170–290 words per case study. |
| **Structured Data** | 10 | **6** | What exists is technically well-built (shared `@id` references, correct `Service`→`Organization` `provider` links). Two structural problems for Phase 2 to resolve: (1) **scope drift** — `index.html`'s JSON-LD graph includes `WebSite`, `WebPage`, `OfferCatalog`, and `Review` types, which fall outside this project's explicitly scoped allow-list (`Organization`/`ProfessionalService`, `Person`, `Service`, `FAQPage`, `BreadcrumbList` only per the task brief) — needs a decision on whether to prune or is treated as pre-existing/grandfathered; (2) the homepage FAQ/schema mismatch above; (3) zero schema on any portfolio page; (4) no `BreadcrumbList` anywhere, despite every service/portfolio detail page already having a "← Services" / "← Portfolio" back-link that's a natural breadcrumb candidate. |
| **Topical Authority** | 10 | **5** | `/about/` is thorough on Nicole's background/training/working style. No resources/knowledge-base section exists yet (optional per brief). "Process" content currently only exists embedded inside `/services/` (5-step version) and again, differently, per service page (4-step version) — two inconsistent process descriptions rather than one canonical one. |
| **Internal Linking** | 5 | **2** | Volume is fine (24–34 internal nav/footer links per page) but almost entirely chrome (nav/footer), not contextual. Zero descriptive service↔case-study cross-links found anywhere (no "View the brand identity case study" pattern exists yet). **Confirmed broken link:** homepage portfolio teaser (`index.html` line 474) links to `portfolio/wh4/` (aria-label "wh4 Advertising Agency"), which does not exist — the directory was archived (see `portfolio/index.html` line 135, "wh4 — archiviert") and the tile's own iframe already correctly points at `art-gerecht-modular` instead, so the `<a href>` is simply stale. |
| **E-E-A-T** | 10 | **7** | Real, attributed, non-fabricated testimonials with verifiable context (Patrick H. / wh4 Design; Mihail T. / TM Studio, Burapha Bike Festival). Verifiable credential (IHK certification, Mediadesign Hochschule Munich) stated consistently. One case study (`cafe-mira`) links to a live client site as proof of work — strong signal. Deduction: the broken `Person` URL (see Entity Clarity) undermines an otherwise solid signal, and Nicole's `Person` entity is never referenced (via `@id`) from `/about/` itself, where it would matter most. |
| **Technical Accessibility** | 5 | **2** | Alt text is clean (0 missing across all 24 pages bar one harmless empty JS-lightbox placeholder on `/gallery/`). Heading hierarchy is clean except `/impressum/`, which has **two `<h1>` tags** ("Legal Notice" and "Impressum"). The major gap: **canonical tags are missing on 23 of 24 pages** — only `/artista/` has one (correctly self-referencing `/portfolio/artista-magazin/`, its own duplicate). For a site with at least one known duplicate-content pair already, having no canonical convention anywhere else is a real technical gap. Sitemap gaps: `artista-artista`, `cafe-mira`, `hideout-georgia`, and `woofles` portfolio pages are indexable but **missing from `sitemap.xml`**; conversely `sitemap.xml` lists `portfolio/westgrowth-capital/`, which **no longer exists** (stale/orphaned entry — that project was intentionally removed per `HANDOFF-2026-07-07.md`). |
| **AI Citation Readiness** | 5 | **2** | The FAQ answers and the `/about/` entity paragraph are exactly the kind of clean, quotable, factual sentences an answer engine can lift directly — where they exist, they're good. But this pattern isn't extended to service or portfolio pages (mostly persuasive/marketing tone there), and the homepage FAQ schema/content mismatch specifically undermines citation reliability for the page most likely to be cited (the homepage). |
| **Total** | **100** | **56** | |

**Note on the brief's reference baseline of 68/100:** this audit's independently-scored 56/100 is evidence-based against the rubric above and should be treated as the authoritative current baseline, not the 68 mentioned in the task brief — the site has clearly had real AEO work land since that estimate (FAQ, service pages, entity schema all exist), but this audit also found concrete defects in that same work (the homepage FAQ/schema mismatch, missing canonicals, the broken `wh4` link, sitemap gaps, `Person` URL 404) that a purely feature-checklist view would miss. Net effect roughly balances out below the original estimate. Fixing the defects found here should be treated as part of Priority 1–2, not deferred.

---

## 4. Priority 1–2 candidate work (for the next phase, pending your go-ahead)

Not implementing yet — listing what Phase 2 would concretely touch, in priority order:

1. **Fix, don't just add** — before new content: reconcile the homepage FAQ/schema mismatch (either add the visible accordion to `/`, matching `/services/`, or drop the JSON-LD there), fix the broken `Person` URL (either build `/about/nicole-szatkowski/` or point the schema at `/about/`), fix the `portfolio/wh4/` dead link on the homepage, add canonical tags site-wide, fix `/impressum/`'s duplicate H1, and sync `sitemap.xml` (add the 4 missing pages, remove `westgrowth-capital`).
2. **Structured data scope decision:** confirm whether to prune `WebSite`/`WebPage`/`OfferCatalog`/`Review` from the homepage graph to match the brief's narrow allow-list, or keep them as already-shipped/out-of-scope-to-touch. Flagging this explicitly rather than deciding unilaterally, per the instruction to flag rather than justify scope additions.
3. Add a direct-answer sentence immediately after the H1 on each service page (currently jumps straight to marketing copy).
4. Add FAQ (native `<details>`/`<summary>` or match the existing accordion pattern) to each service page, and expand the shared FAQ set to cover process/timeline/rebrand/international-work questions.
5. Add `BreadcrumbList` schema to service and portfolio detail pages, reusing the back-links that already exist in the UI.
6. `TODO: business information required` — confirm founding-date and `areaServed` scope questions in Section 2 before encoding them further into schema.

---

## 5. What Phase 3+ will need (not started)

Portfolio case studies need Challenge/Solution/Outcome text (only where genuinely known — several already have enough narrative detail to extract this without inventing anything, e.g. Café Mira, Seestern) and descriptive cross-links to the matching service page. Deferred until Priority 1–2 is confirmed complete.

---

---

## 6. Priority 1 — implemented (2026-08-31)

- **Homepage entity paragraph** (`index.html`, `.about3d__text`, EN + DE): rewritten to lead with "Kidashi Design is the freelance design studio of Nicole Szatkowski..." and now answers all five questions from Section 3 (what/who/services/clients/where) in one on-brand paragraph, in its existing visual slot — no new section added.
- **Organization/Person JSON-LD pruned to the scoped allow-list.** Removed `WebSite`, `WebPage`, `OfferCatalog`, and the `Review` array from the homepage graph (none of those types are in the Section 6/7 allow-list); `Service` markup already lived correctly on each service page, so nothing was lost, only de-duplicated. Simplified `Organization.logo` to an inline `ImageObject` value instead of a separate top-level graph node.
- **Fixed the broken `Person` entity URL** — `Person.url` now points to `/about/` (real, canonical) instead of the non-existent `/about/nicole-szatkowski/`; the same dead link was also removed from the visible text on `/about/` (unlinked, kept as plain bold text rather than fabricating a target page).
- **`Person` schema added to `/about/`** with the same `@id`, per Section 6's "reused everywhere she's referenced."
- **Removed the now-dangling `isPartOf: {"@id": "#website"}`** from all four service pages' `Service` JSON-LD, since the `WebSite` node it pointed to no longer exists.
- Removed the homepage's orphaned `FAQPage` JSON-LD (no matching visible FAQ existed on `/`) rather than fabricate an accordion for it — `/services/` already carries the one real, matching FAQ implementation, so FAQ coverage isn't lost, just no longer double (and incorrectly) claimed on the homepage too.

All 6 touched JSON-LD blocks validated as well-formed JSON; no remaining references to the removed `#website`/`#webpage`/`OfferCatalog` nodes anywhere in the codebase (verified by grep).

**Not done in this pass (still open, tracked for Priority 2 / Technical phase):** canonical tags site-wide, the dead `portfolio/wh4/` homepage link, sitemap sync, `/impressum/`'s duplicate H1, and the founding-date/`areaServed` TODOs from Section 2.

**→ Priority 1 complete. Ready to proceed to Priority 2 (Services) on your go-ahead, or continue with Priority 1's leftover technical items first — your call.**
