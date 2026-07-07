# IMPLEMENTATION_LOG.md

> Append-only record of the design⇄repo analysis engagement (task: "analyze design + repo, build
> mapping, generate implementation plan, execute"). Branch: `claude/google-drive-zip-download-anvtq8`.

---

## 2026-07-07 — Phase 1: Reconnaissance

- Downloaded `new one.zip` from Google Drive (20,580,057 B, 177 files) → integrity OK.
- **Key discovery:** the ZIP is a **duplicate of `docs/design-reference/`** already in the repo.
  Evidence: `jvto-system.css` **byte-identical** (1330 lines); 11/12 sampled files md5-identical
  (all HTML pages, `CLAUDE.md`, `_parts/chrome.json`, `uploads/homepage.md`); only
  `uploads/trust-signals.md` differs = **CRLF/LF line-endings** (same review data).
- **Design system already ported:** tokens live in `src/app/(website)/website.css` `@theme`
  (comment: *"SSOT … extracted from docs/design-reference/jvto-system.css"*), consumed across
  **56 files / 722 occurrences**; homepage `page.tsx` composes the `Home/*` suite **1:1** with the
  design section order.
- **Facts already adjudicated & correct:** `docs/CANONICAL_FACTS.md` names the ZIP and locks
  `foundingDate=2015` (design's "EST 2016" = drift), MANDATORY Ijen health, reviews 4.8/51·4.9/123·
  4.95/21·195. `src/lib/site-config.ts` has `foundingDate:"2015-01-01"` + derived `BRAND_EST_TAG`.
- **`uploads/DESIGN (1).md`** (lime `#A0CC3D` / Rubik / `#FAFBF4`) identified as an **abandoned brief**,
  NOT the shipped system.
- Conclusion → this is a **verification + documentation + gap-audit** task, not a re-skin. Plan
  approved on that basis.

## 2026-07-07 — Phase 2: Documentation (primary deliverable)

Created `docs/_design-port/` with five documents:
- `DESIGN_BASELINE.md` — design system extracted from `jvto-system.css` + chrome + page HTML.
- `REPO_BASELINE.md` — Next 16 / Tailwind v4 `@theme` SSOT, chrome/homepage mapping, schema layer,
  facts SSOT, route map, conventions.
- `MAPPING_MATRIX.md` — (A) design→repo status table, (B) conflict register with resolution rule.
- `IMPLEMENTATION_PLAN.md` — prioritized/effort-sized backlog of genuine gaps only.
- `IMPLEMENTATION_LOG.md` — this file.

## 2026-07-07 — Phase 2: Adoption + drift audit

- **Adoption:** 56 files use `jvto-*` v2 tokens; 50 reference legacy tokens (`jvto-green/dark/light/
  text`) — legacy is **intentionally retained** per `website.css`, not drift.
- **Drift scan (live `src`):** no `EST 2016`, `Incorporated 2016`, `4.9/112`, `47 reviews`,
  `30% deposit`, `groups of 6`, `Trip.com`, or Banyuwangi-HQ. (`Banyuwangi` hits = legitimate Kawah
  Ijen geography.) Chrome facts-correct (`Navbar` derived `BRAND_EST_TAG`; `Footer` Bondowoso/NIB/
  Trustpilot 4.8·TripAdvisor 4.95).
- **Genuine findings → backlog** (not auto-applied; see IMPLEMENTATION_PLAN.md):
  - **B-D1 / T1 (P1):** tour-route duplication — `tour-from-*` + `tours-from-*` + `tours/from-*`
    all render full pages (no redirect). Owner decision on canonical + redirects.
  - **B-D2 / T2 (P2):** `verify-jvto/*` dark sections use `bg-slate-950/900/800` + gradients
    (48 occ.) instead of `jvto-navy`. Needs visual QA before swap.
  - **B-D3 / T3 (P2):** `Home/Testimonials.tsx`, `Home/LevelSelector.tsx` possibly orphaned.
- **Decision:** no speculative code changes applied. Per the approved plan boundary — *bounded,
  reversible; don't overwrite correct work; don't invent work* — each backlog item is either
  hard-to-reverse (deleting live routes) or requires visual sign-off (trust-page palette). P0 was
  empty; there was nothing safe-and-unambiguous to fix.

## 2026-07-07 — Verification

- **Change set:** docs-only. `git status` → sole entry `docs/_design-port/` (5 new markdown files).
  No `.ts/.tsx/.css/.json` touched.
- **`npm run validate:content` → PASS** — 46 hits across 19 buckets = committed baseline exactly
  (all pre-existing legacy hits in `src/services/mockData.ts` + `public/llms-full.txt`). The new
  docs are outside the validator's scanned surface (`src/`, root `*-config.json`, `public/llms*.txt`,
  `docs/CANONICAL_FACTS.md`), so they add **zero** hits despite deliberately quoting forbidden
  example strings.
- **`npx tsc --noEmit`** — surfaces one **pre-existing** `tsconfig.json` deprecation (TS5107,
  `moduleResolution=node10`) in this container's newer TS patch. Unrelated to this change:
  `tsconfig.json` is untouched and the diff adds no TypeScript. No regression is possible from a
  docs-only change.
- **`npm run lint` / `npm run build`** — not run: markdown under `docs/_design-port/` is outside the
  ESLint inputs and the Next build path, so they are definitionally unaffected by this diff; `build`
  additionally needs live DB env and would validate nothing about a documentation-only change.

**Outcome:** Design⇄repo mapping documented with evidence; migration verified substantially complete
and facts-correct; a short, honest backlog captured for owner-gated follow-up. No production code
altered.

---

## 2026-07-07 — Post-PR-review correction round (PR #90)

**Trigger:** CI check `verify` failed on PR #90, and an automated Codex review left a specific inline
finding on `MAPPING_MATRIX.md`. Investigated both.

### CI failure — diagnosed, NOT a defect in this PR's diff
- Job log root cause: the `verify` workflow's *"Sync bundles and check for drift"* step re-runs
  `sync:packages`/`sync:trust`/`sync:blog`/`sync:policy-bundle` against a freshly-checked-out
  `sambuko82/llm-wiki@master` (the content producer repo) and fails if the result differs from
  what's committed in `src/data/{package-readiness,trust-bundle,blog,policy-bundle}`. It found a
  real diff — i.e. `main`'s committed bundles are stale relative to `llm-wiki@master`.
- **This is pre-existing and repo-wide, not caused by this PR.** This PR's diff touches only
  `docs/_design-port/*.md` — zero files under `src/data/`. Confirmed via `mcp__github__list_pull_requests`:
  **PR #88** ("chore(sync): update llm-wiki artifacts (main)", opened 2026-07-07T05:43:17Z — ~11h
  before PR #90 — by an automation account, `repository_dispatch`-triggered) is already open
  specifically to land this same sync. Any PR opened against `main` right now would hit the same
  `verify` failure until #88 (or an equivalent sync) merges.
- **Noted but not investigated further:** the sync diff's `aeo-snippets.json` hunk replaces several
  specific, verifiable claim tldrs (named credentials, named founder, numeric ratings) with more
  generic summary statements. Not this PR's concern to adjudicate, but flagged in case it's an
  unintended side effect of the llm-wiki pipeline rather than an intentional content decision.
- A second, non-fatal `##[warning]` also appeared in the same job (post-cleanup step): `fatal: No
  url found for submodule path '.claude/worktrees/confident-nobel-b033af' in .gitmodules`. Exit code
  128 on a cleanup step, not the job's actual failure cause (which was the sync-drift `exit 1`
  earlier in the log) — likely a stray gitlink entry from a past worktree session. Not investigated
  further; does not block this PR.
- **Action taken:** none to `src/data/*` — out of scope, would duplicate/conflict with #88, and the
  AEO-snippet change deserves a human glance before merging. Surfaced to the user for a decision on
  whether to merge #88 to unblock CI.

### Codex review finding — CONFIRMED, deepened, docs corrected
- **Inline comment** on `MAPPING_MATRIX.md:22` (typography tokens row, marked DONE): correctly
  identified that `--font-jvto-display-loaded` / `--font-jvto-mono-loaded` are never assigned
  anywhere outside their own declaration in `website.css`, so the Raleway/JetBrains-Mono tokens fall
  back to unloaded font-family strings.
- **Verified independently:** repo-wide grep confirms zero assignments of either `-loaded` variable,
  and zero components consume the `font-jvto-display`/`font-jvto-mono` Tailwind utilities directly
  (~20+ components instead inline `style={{fontFamily:"Raleway, Inter, sans-serif"}}`, which
  degrades to Inter — the only font actually fetched, via `next/font/google` in `src/app/layout.tsx`).
- **Deepened finding (own investigation, not in the original comment):** root `DESIGN.md` (repo
  root, not part of the ZIP or `docs/design-reference/`) documents a **third design source** —
  "The Field Operator's Clipboard," Inter-only, phosphor-green `#9fce33` — that Phase 1
  reconnaissance missed entirely. `git blame`/`git log` trace: `DESIGN.md` landed in commit
  `50471f9` (2026-06-12) together with `website.css`'s `h1,h2{font-family:Inter}` override citing it
  by name; the `jvto-system.css` V2 tokens (navy/orange/lime, Raleway/JetBrains-Mono) landed later
  in commit `ec7108c` ("W3a — define global design tokens"), layered on top without removing the
  older override or loading the new fonts. So the "legacy tokens" this log's Phase-1 audit dismissed
  as generic neutrals are actually root-`DESIGN.md`'s own palette, and the typography question is a
  genuine unresolved two-source design conflict, not a simple oversight.
- **Docs corrected** (all four, same round): `MAPPING_MATRIX.md` (tokens row DONE→PARTIAL with full
  explanation; new conflict-register row B-S3; §C summary rewritten), `REPO_BASELINE.md` (§header
  + §2 token table annotated; legacy-token mischaracterization fixed), `DESIGN_BASELINE.md` (new
  §6c documenting root `DESIGN.md` as a third source), `IMPLEMENTATION_PLAN.md` (new T6, owner
  decision between loading the fonts vs. retiring the tokens).
- **Code NOT changed.** Wiring Raleway/JetBrains Mono would be a sitewide, highly visible typography
  change and directly contradicts root `DESIGN.md`'s explicit "no display serif, no mono" rule —
  this is a design-direction call for the owner, not a mechanical fix silently shippable under this
  PR's documentation-only scope.

### Verification (this round)
- `git status` confirms only the four `docs/_design-port/*.md` files modified — still no production
  code touched.
- `npx tsc --noEmit` — unchanged from the prior baseline (only the pre-existing `tsconfig.json`
  TS5107 deprecation; diff added no TypeScript).

**Outcome:** Two real findings handled appropriately — one fully corrected in-place (docs accuracy,
squarely in scope), one diagnosed-and-deferred with a clear recommendation (CI/content-sync, out of
this PR's scope, needs a merge decision only the owner should make), one flagged for an explicit
owner decision (typography direction — two committed design docs disagree with each other).
