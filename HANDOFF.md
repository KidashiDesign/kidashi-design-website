# Handoff — Kidashi Design Website

**Last Updated:** 2026-07-19
**Session:** Claude Sonnet 5 — screen-filling hero/tile animations, deploy-failure diagnosis, Galerie-Kronsbein phone-mockup code review
**Status:** Fix pushed to `claude/lade-session-m3a916` (force-pushed, freshly rebuilt on current `main`). **No PR opened yet.** Hostinger FTP deploy is currently **red** — root cause confirmed this session: empty `FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD` secrets, not a code issue.

> This file is a narrative deep-dive into the most recent session. For the always-current checklist (deploy status, open tasks, CSS token reference), read **SESSION.md** first — it's the file every session is instructed to read.

---

## Session Summary

Started as a routine "load session" request, then covered three connected pieces of work: making the portfolio-tile and project-hero animations genuinely screen-filling on every device, diagnosing why the live site wasn't reflecting any of it, and reviewing the Galerie Kronsbein phone-mockup code on request. The middle part turned into a small archaeology exercise — `main` had moved on independently since the last session and had *reintroduced* the exact bug this session was fixing, which is why the user reported "I still don't see any changes" after the first round of edits.

---

## Part 1 — Making animations fill the viewport

**Ask:** portfolio tiles show the animation edge-to-edge, no empty borders; project-detail hero animations run as a full 100vw×100vh section with `object-fit: cover`-style behavior, correct on desktop/tablet/mobile.

Findings before touching anything:
- The portfolio-tile crop trick (`.portfolio-item__anim`, `width: 133.4%; left: -16.7%`, and a `--sq` variant at `177.8%/-38.9%`) was **already correct** — it's a ratio-based cover emulation for 16:9 content inside a fixed 4:3 (or 1:1) container, valid at any pixel size since it only depends on the CSS `aspect-ratio`. Left untouched, verified with Playwright instead of "fixed."
- `.portfolio-item__bg img` had **no sizing rule at all** — plain preview images weren't guaranteed to cover their tile. Added `width/height: 100%; object-fit: cover`.
- The project-hero video wrap (`.proj-hero--video .proj-hero__video-frame`) used plain `width:100%; height:100%` — fine at exactly 16:9 viewports, but stretches/distorts anywhere else. Replaced with a real CSS cover formula: `width: max(100%, 177.78svh); height: max(100svh, 56.25vw)`, centered via `transform: translate(-50%,-50%)`. This scales the native 1920×1080 (16:9) animation source up — never down, never distorted — to always cover `100vw × 100svh` regardless of device aspect ratio.
- A `@media (max-width:600px)` override was shrinking the hero to a fixed 16:9 letterboxed strip instead of full-screen. Removed.

Verified with headless Chromium (`/opt/pw-browsers/chromium`, reachable via `NODE_PATH=/opt/node22/lib/node_modules node -e "require('playwright')..."` — no project-local Playwright install exists) at 1440×900 / 768×1024 / 390×844. Bounding-box math confirmed full coverage in all three.

Pushed as commit `a568a0e` to `claude/lade-session-m3a916`. **No PR created — this is the mistake that caused Part 2.**

---

## Part 2 — "Ist es live?" → it wasn't, and then it still wasn't

First answer: no, only pushed to a branch, no PR, no merge — the Hostinger deploy only triggers on `main`.

User asked to check anyway. `mcp__github__actions_list` on `main` showed the latest "Deploy to Hostinger" run (`29566017317`, 2026-07-17) as `failure`. `get_job_logs` showed the actual cause:

```
env:
  FTP_SERVER: 
  FTP_USERNAME: 
  FTP_PASSWORD: 
...
mirror: Not connected
##[error]Process completed with exit code 1.
```

All three GitHub secrets are empty. This is an infra problem only Nicole can fix (repo Settings → Secrets → Actions, values from Hostinger hPanel → FTP accounts) — no amount of merging will make the site update until that's resolved.

**Then the user reported "I still don't see any changes,"** which prompted a second look — and turned up something more interesting than the FTP issue: **`main` had diverged since Part 1.** Another contributor (`thecimal`) had pushed independent work directly to `main`, including a Galerie-Kronsbein phone-mockup hero and — critically — **its own conflicting mobile CSS rule** for `.proj-hero--video .proj-hero__video-wrap` that reintroduced exactly the bug just fixed: first an `aspect-ratio: 16/9` override, then (higher specificity, so it actually won) an `aspect-ratio: 1/1` square crop, both firing at `max-width: 600px`. So even setting the merge/deploy issues aside, the fix from Part 1 had already been overwritten by someone else's regression before it could ever reach `main`.

### Reconciling the branch

`git rebase origin/main` failed immediately — the branch carried old, already-orphaned commits from a previous session (directory deletions like `portfolio/artista-magazin` that `main` had since handled differently), producing delete/modify conflicts unrelated to the current task. Aborted the rebase rather than fight it.

Instead: `git checkout -B claude/lade-session-m3a916 origin/main` — discarded the stale commit history (never merged, already superseded by `main`'s own version of the same work) and reapplied just the CSS fix cleanly on top of current `main`:
- Removed **both** conflicting mobile overrides (the 16:9 strip and the 1:1 square).
- Re-added the `max()`-based cover formula for `.proj-hero__video-frame`.
- Re-added `.portfolio-item__bg img { object-fit: cover }`.
- **Deliberately left Galerie Kronsbein's phone-mockup special case alone** — its own `.proj-hero--phone` logic is a legitimate design choice (a literal phone-frame illustration on mobile, not a bug), see Part 3.

Verified again with Playwright: `xp-days` hero covers fully at all three breakpoints; `galerie-kronsbein` correctly shows the desktop animation on desktop and the phone mockup on mobile (checked computed `display` on both elements).

Force-pushed (`--force-with-lease`) as commit `7439f17` — safe here because no PR existed yet and the discarded commits were exclusively this session's own prior, unmerged work.

**Still not live and still no PR** — that's the next thing to decide with the user.

---

## Part 3 — Galerie Kronsbein phone-mockup code review

User asked for an analysis of the phone-mockup special case referenced in Part 2's summary. Findings, formatted per `CLAUDE.md`'s review standard:

**Structure:** two iframes inside `.proj-hero__video-wrap` — a desktop background animation (`src` set directly in HTML, `loading="eager"`) and a phone-frame mockup iframe (`data-src`, not `src`; `loading="lazy"`). CSS toggles at `≤600px`: hides the desktop frame (`display:none!important`), shows the mockup (`display:flex`). An inline script at the end of `<body>` checks `matchMedia('(max-width:600px)')` **once, on page load**, and only then copies `data-src` into `src`.

**🔴 Race condition:** the `matchMedia` check never re-runs on resize/orientation change. Load the page on a tablet in landscape (>600px) → phone iframe never gets a `src`. Rotate to portrait (<600px) → CSS shows the mockup instantly, but it's empty — blank hero. Fix: add a `matchMedia(...).addEventListener('change', ...)` listener with an idempotency guard (`!el.src`).

**🟡 Performance:** the desktop animation's `src` is hardcoded in HTML with `loading="eager"` — `display:none` only hides rendering, not loading, so mobile visitors download and execute the full ~800 KB animation bundle they'll never see. Fix: same `data-src` deferred-load pattern as the phone iframe, chosen by `matchMedia` for whichever one is actually visible.

**🟢 Minor:** redundant double `aria-hidden`; breakpoint (`600px`) is consistent between the inline script and CSS, so no mismatch there.

**Score: 6/10.** Works in the common case (load once, no resize), breaks on the resize/rotation edge case, wastes mobile bandwidth. **Not yet fixed** — user was asked whether to implement both fixes; no answer yet at session end.

---

## Next Steps

- [ ] Nicole: set `FTP_SERVER` / `FTP_USERNAME` / `FTP_PASSWORD` in GitHub repo secrets (Hostinger hPanel → FTP accounts)
- [ ] Re-run the failed Hostinger workflow once secrets are set, to confirm the fix
- [ ] Open a PR for `claude/lade-session-m3a916` (contains the screen-fill animation fix) and merge it
- [ ] Decide on and implement the two Galerie-Kronsbein phone-mockup fixes (resize listener + deferred desktop-iframe load)
- [ ] Re-check the older pending items from before (empty portfolio image slots, etc.) — `main` has changed substantially since they were last reviewed, some may already be resolved by other contributors
