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
