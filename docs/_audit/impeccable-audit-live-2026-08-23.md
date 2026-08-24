# Impeccable Technical Audit — `live` @ `2b90a51`

Run with the Impeccable design skill v4.1.1 (`/impeccable audit`), vendored at
`.claude/skills/impeccable/`. Date: 2026-08-23.

> **Read the Method & Limits section before acting on any score.** Two of five dimensions could not be
> measured in this environment, and one whole class of detector output turned out to be an artifact of a
> stale document rather than a defect in the code. Both are stated plainly below rather than smoothed over.

---

## Implementation Integrity Verdict

**FAIL.**

`DESIGN.md` and `DESIGN.json` at the repo root describe a design system this codebase does not implement,
and has not implemented for some time. They document a **V1 "Field Operator's Clipboard"** system:

```yaml
colors:
  phosphor-green: "#9fce33"
  obsidian: "#1a1a1a"
typography:  { display: { fontFamily: "'Inter', sans-serif", fontWeight: 900 } }
rounded:     { sm: "4px", full: "9999px" }
```

The shipped system in `src/app/(website)/website.css` is **V2** — a different palette, a different type
stack, and a radius scale an order of magnitude larger:

```css
--color-jvto-navy: #0D1B2A;      --color-jvto-orange: #E8650A;
--font-display: var(--font-raleway), Georgia, serif;
--radius-jvto-lg: 28px;          --radius-jvto-xl: 40px;
```

This is not merely stale documentation. `DESIGN.md`'s own **"Don't" list forbids what `live` actually
ships**:

| `DESIGN.md` rule | What `live` does |
|---|---|
| *"Don't style like a backpacker listing… orange CTAs are exactly what this system rejects"* | `--color-jvto-orange: #E8650A` is the primary CTA color |
| *"Don't round cards or panels beyond `rounded-sm`"* | `--radius-jvto-lg: 28px`, `--radius-jvto-xl: 40px` |
| *"Do use `bg-jvto-green` (`#9fce33`)"* | No such token exists anywhere in the codebase |
| *"Don't use `border-left`/`border-right` greater than 1px as a colored stripe"* | **8 verified occurrences** (see P1-2) |

Any tool, contributor, or agent that reads `DESIGN.md` to learn this project's design language will be
taught the wrong product. That is the finding. Everything in the Theming section below is downstream of it.

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | **2**/4 | Solid semantic foundation, but zero a11y tooling and verified focus-indicator loss in two form controls |
| 2 | Performance | **2**/4 | *Provisional — no runtime measurement possible.* One layout-property transition; CSP allows `unsafe-eval` |
| 3 | Theming | **1**/4 | Three competing token systems; six utility families referenced but defined nowhere — including in the root layout |
| 4 | Responsive Design | **not scored** | No rendered measurement was possible in this environment. See Method & Limits |
| 5 | Implementation Integrity | **1**/4 | Documented design system and shipped design system are different products |
| **Total** | | **6/16** | **Poor — major overhaul** (equivalent band on the standard /20 scale) |

The total is reported out of **16, not 20**, because Responsive Design was not measured. Inventing a score
for an unmeasured dimension would make the number look more complete than the evidence behind it.

---

## Executive Summary

- **Audit Health Score: 6/16** (Poor — major overhaul)
- **Issues: 1 P0 · 5 P1 · 4 P2 · 2 P3**
- The single highest-value fix is not in `src/` at all: regenerate `DESIGN.md` from live code.

**Top findings**

1. **[P0]** `DESIGN.md` documents a superseded design system and actively contradicts shipped code.
2. **[P1]** The public site's root layout wrapper styles itself with three utility classes that resolve to
   nothing — `src/app/(website)/layout.tsx:80`.
3. **[P1]** `/blog` builds its entire card system from undefined utilities; its cards render unstyled.
4. **[P1]** Two form controls remove the focus outline without providing a replacement indicator.
5. **[P1]** No accessibility tooling of any kind, and CI's Lint and Typecheck gates are both
   `continue-on-error: true`.

**Recommended next step:** run `/impeccable document` to regenerate `DESIGN.md` from the live V2 tokens
*before* anything else. Until that lands, every design-system check in this repo measures against fiction.

---

## Detailed Findings by Severity

### [P0-1] `DESIGN.md` / `DESIGN.json` document a design system that no longer exists

- **Location**: `DESIGN.md`, `DESIGN.json` (repo root)
- **Category**: Implementation Integrity
- **Evidence**: Running the bundled detector twice over the same source, with the only difference being
  whether `DESIGN.md` is loaded as context:

  | Detector mode | Findings |
  |---|---|
  | `--no-design-system` | **10** |
  | default (loads `DESIGN.md`) | **1012** |

  Breakdown of the 1002 additional findings: 636 `design-system-font-size`, 199 `design-system-font`,
  149 `design-system-color`, 18 `design-system-radius`.

  **These 1002 are not 1002 separate defects.** They are one root cause with 1002 symptoms: every literal
  value in the codebase is "off-ramp" because the ramp being compared against belongs to a system that was
  deleted. Filing them as individual issues would be a false-positive cascade, and this audit explicitly
  declines to do so.
- **Impact**: Contributors and AI agents reading `DESIGN.md` build against a palette, type stack, and radius
  scale that were removed. It is worse than no documentation, because it is confidently wrong. It also makes
  the detector's design-system rules unusable — the one automated design gate available to this repo.
- **Recommendation**: Regenerate from live code. Do not hand-edit.
- **Suggested command**: `/impeccable document`

### [P1-1] Root website layout styles itself with undefined utility classes

- **Location**: `src/app/(website)/layout.tsx:80`
- **Category**: Theming
- **Evidence**:
  ```tsx
  <div className="bg-background-light dark:bg-background-dark text-ink-neutral-700 dark:text-ink-neutral-300">
  ```
  None of `bg-background-light`, `background-dark`, `ink-neutral-*` is defined in any `@theme` block —
  verified against both `src/app/(website)/website.css` and `src/app/globals.css` (0 matching token
  definitions for each).
- **Impact**: Tailwind v4 emits no CSS for an undefined utility. The wrapper element that surrounds **every
  public page** therefore sets neither a background nor a base text color; both fall through to browser
  defaults. The site currently looks correct only because descendant components re-declare their own
  colors — the base layer is inert, and any page that relies on inheritance will render on white with
  near-black text regardless of design intent.
- **Recommendation**: Either define these tokens in `website.css`'s `@theme`, or replace them with the
  existing V2 equivalents (`bg-jvto-off`, `text-jvto-muted`). Prefer the latter — the site already has
  tokens for exactly this job.
- **Suggested command**: `/impeccable extract`

### [P1-2] Eight violations of the project's own documented border rule

- **Location**:
  - `src/app/(website)/verify-jvto/legal/page.tsx:521` — `borderLeft: "3px solid …"`
  - `src/app/(website)/verify-jvto/police-safety/page.tsx:408` — `border-l-4`
  - `src/app/(website)/verify-jvto/press-recognition/page.tsx:346` — `border-l-4`
  - `src/app/(website)/policy/sidebar.tsx:69` — `border-l-4`
  - `src/app/(website)/travel-guide/sidebar.tsx:112` — `border-l-4`
  - `src/app/(website)/blog/why-not-unlicensed-ijen-operator/page.tsx:425,524` — `border-l-4`
  - `src/app/(website)/why-jvto/whyJvtoTokens.ts:145` — `border-left: 3px solid var(--jw-lime)`
  - `src/components/content/MarkdownRenderer.tsx:133` — `border-left: 3px solid var(--color-jvto-lime)`
- **Category**: Implementation Integrity
- **Evidence**: Detector rule `side-tab`, confirmed in the `--no-design-system` run (i.e. these are real
  regardless of the stale-doc problem). `DESIGN.md` independently forbids the same pattern.
- **Impact**: The detector's description — *"the most recognizable tell of AI-generated UIs"* — matters
  more than usual for this specific product. `PRODUCT.md` states visitors *"arrive skeptical — is this
  operator real and capable?"*. A visual signature that reads as machine-generated template works directly
  against the one thing this site sells.
- **Recommendation**: Replace with full 1px borders, a background tint, or a leading icon. `MarkdownRenderer`
  and `whyJvtoTokens` are the highest-leverage two — they propagate to every rendered article.
- **Suggested command**: `/impeccable polish`

### [P1-3] `/blog` renders its card system from undefined utilities

- **Location**: `src/app/(website)/blog/page.tsx:49, 81, 95, 107, 128`
- **Category**: Theming
- **Evidence**: line 95 alone stacks six undefined classes:
  ```
  bg-background-dark  shadow-card  hover:shadow-cardHover
  border-ink-neutral-200  dark:border-ink-neutral-700  hover:border-primary
  ```
- **Impact**: Blog cards have no shadow, no resting border color, and no hover border transition. The
  `hover:-translate-y-1` on the same element still fires, so cards lift on hover with no accompanying
  elevation — motion that signals interactivity while the visual affordance it was paired with is absent.
- **Recommendation**: Map to shipped tokens: `shadow-jvto-soft`, `hover:shadow-jvto-card-hover`,
  `border-jvto-border`, `hover:border-jvto-orange`.
- **Suggested command**: `/impeccable polish`

### [P1-4] Focus indicator removed with no replacement in two form controls

- **Location**:
  - `src/components/form/SearchableSelect.tsx:197` — `focus:outline-none` with no `focus:ring-*`
  - `src/components/website/BookingForm.tsx:176` — `focus:outline-none` with no `focus:ring-*`
- **Category**: Accessibility
- **WCAG**: 2.4.7 Focus Visible (Level AA)
- **Impact**: Keyboard and switch users lose all indication of position on these controls.
  `BookingForm.tsx:176` is the passenger-count field inside the booking flow — the failure sits directly on
  the revenue path, not on a peripheral page.
- **Note**: The codebase is otherwise disciplined here — the other four `focus:outline-none` uses each pair
  with an explicit `focus:ring`. These two are isolated misses, not a pattern.
- **Recommendation**: Add `focus:ring-2 focus:ring-jvto-orange` (or the token the surrounding cluster uses).
- **Suggested command**: `/impeccable harden`

### [P1-5] No accessibility tooling, and CI's quality gates do not block

- **Location**: `package.json` (scripts), `eslint.config.mjs`, `.github/workflows/ci.yml:51-53, 68-69`
- **Category**: Accessibility
- **Evidence**: No `eslint-plugin-jsx-a11y`, no axe, no pa11y, no Lighthouse CI, no Prettier. `playwright`
  is a devDependency with no config, no test directory, and no spec file. All 13 `package.json` scripts are
  SEO/schema/content-integrity; none is a design, a11y, or visual gate. In CI:
  ```yaml
  - name: Lint (non-blocking)
    continue-on-error: true
  - name: Typecheck (non-blocking)
    continue-on-error: true
  ```
- **Impact**: Nothing mechanically prevents any finding in this report from recurring. The two findings above
  (P1-1, P1-3) are exactly the class a linter catches for free — undefined utility classes are detectable
  statically, and they reached production.
- **Recommendation**: Add `eslint-plugin-jsx-a11y` and enable the Impeccable detector hook
  (`/impeccable hooks on`). Treat un-blocking CI's Lint gate as a separate, tracked debt item — the existing
  `continue-on-error` is documented as deliberate ("live carries pre-existing debt"), so flipping it needs
  the backlog cleared first.
- **Suggested command**: `/impeccable harden`

### [P2-1] Three parallel token systems define the same colors differently

- **Location**: `src/app/(website)/website.css` (`@theme`), `src/app/(website)/why-jvto/whyJvtoTokens.ts`
  (`.jw-*`), `DESIGN.json`
- **Category**: Theming
- **Evidence**: `--jw-muted: #6B7280` vs `--color-jvto-muted: #4B5563` — the same semantic role, two
  different values, two contrast ratios. `whyJvtoTokens.ts` also hardcodes `'Raleway', 'Segoe UI'` as literal
  family names instead of `var(--font-raleway)`, so the `/why-jvto` cluster depends on font name-matching
  rather than the `next/font` loader contract.
- **Impact**: A token change in `website.css` silently fails to reach `/why-jvto`. The two muted greys are
  visibly different and land on different sides of contrast thresholds.
- **Recommendation**: Fold `.jw-*` into the `@theme` block; delete the parallel set.
- **Suggested command**: `/impeccable extract`

### [P2-2] Token adoption is roughly 3:1 against arbitrary values

- **Location**: repo-wide; 43 `.tsx` files contain raw 6-digit hex literals
- **Category**: Theming
- **Evidence**: 1428 `*-jvto-*` utility uses vs **463** arbitrary-value hex classes (`[#xxxxxx]`).
- **Impact**: About a quarter of all color decisions bypass the token layer, so a palette change requires a
  manual sweep of 43 files.
- **Recommendation**: Sweep the arbitrary values into tokens, highest-traffic components first.
- **Suggested command**: `/impeccable colorize`

### [P2-3] Tokens define no spacing scale and no type scale

- **Location**: `src/app/(website)/website.css` `@theme`
- **Category**: Theming
- **Evidence**: The `@theme` block defines colors, four radii, two shadows, and three font families. There is
  no `--spacing-*` and no `--text-*` step.
- **Impact**: Every size in the codebase is an ad-hoc Tailwind utility or a `clamp()` literal, which is the
  mechanical reason 636 font-size values are off-ramp. Vertical rhythm cannot be enforced because no rhythm
  is defined.
- **Recommendation**: Define both scales during `/impeccable document`, then migrate incrementally.
- **Suggested command**: `/impeccable typeset`

### [P2-4] Around 17 declared dependencies have no import statement anywhere

- **Location**: `package.json` `dependencies` (54 total)
- **Category**: Performance (supply chain / maintenance)
- **Evidence**: 19 of 54 have zero import statements across `src/`, `scripts/`, and `prisma/`. Two are
  legitimate indirect requirements and **must not be removed**: `@prisma/client` (peer of the generated
  client, which is imported as `@/generated/prisma`) and `react-dom`. The remaining ~17 include
  `framer-motion`, `embla-carousel-react`, `leaflet`, `react-leaflet`, `react-quill-new`, `zustand`,
  `clsx`, `tailwind-merge`, `@radix-ui/react-accordion`, `@google/genai`.
- **Correction on a common assumption**: this is **not** a page-weight problem. Un-imported packages are
  never bundled by Next, so end users download nothing extra. The cost is install time, audit surface, and
  the misleading signal that this project uses Framer Motion and two mapping libraries when it uses neither.
- **Impact**: Misleads anyone reasoning about the stack — including this audit's own first pass, which
  wrongly assumed two carousel libraries were shipping to users until the import check disproved it.
- **Recommendation**: Remove in one PR, then verify with a full `npm run build` against a working database.
  Do **not** remove blind — treat the list as candidates, not conclusions.
- **Suggested command**: `/impeccable optimize`

### [P3-1] One layout-property transition

- **Location**: `src/components/website/WhyJvtoInteractive.tsx:176` —
  `transition: max-height, padding-bottom`
- **Category**: Performance
- **Impact**: Animating `max-height` and `padding-bottom` forces layout on every frame of the accordion
  open/close. On one accordion this is minor; it is listed because `DESIGN.md` names it a rule and because
  it is the only motion finding in the entire codebase.
- **Recommendation**: `grid-template-rows: 0fr → 1fr` gives the same effect without layout work.
- **Suggested command**: `/impeccable animate`

### [P3-2] Design atlas references a script that does not exist

- **Location**: `docs/design_atlas/page_inventory.md:3`
- **Category**: Implementation Integrity
- **Evidence**: Instructs `node scripts/generate-design-atlas.mjs`; that file is not present on `live`. The
  inventory also maps components that were removed (`Home/Features.tsx`, `Home/Reviews.tsx`,
  `FAQSection.tsx`, `FeaturedToursClient.tsx`).
- **Impact**: The atlas cannot be regenerated and its contents can no longer be trusted — the same failure
  mode as `DESIGN.md`, one directory over.
- **Recommendation**: Restore the script or retire the atlas. Do not leave it half-alive.
- **Suggested command**: `/impeccable document`

---

## Patterns & Systemic Issues

1. **Documentation rots faster than code, and nothing detects it.** `DESIGN.md`, `DESIGN.json`, and
   `docs/design_atlas/` all describe a version of this site that no longer exists. Three independent
   artifacts, one shared failure: no mechanism ties them to the code they describe.

2. **Undefined utility classes reach production.** Six families (`bg-background-light`, `background-dark`,
   `ink-neutral-*`, `shadow-card`, `shadow-cardHover`, `border-primary`) are referenced across 3–5 files
   each and defined in zero. Tailwind v4 fails silently on these, and with Lint non-blocking in CI, nothing
   catches them. This is the clearest argument in the report for a blocking static gate.

3. **One shared primitive for 53 routes.** `src/components/website/UI/Button.tsx` is the only component in
   `UI/`. Card, Badge, Input, Heading, and Section are re-implemented inline per page, which is why page
   files reach 2093 lines (`TourDetail.tsx`), 1270 (`verify-jvto/page.tsx`), and 1182
   (`checkout/CheckoutInner.tsx`). Every inline re-implementation is a fresh opportunity for the drift
   catalogued above.

4. **Focus styling is inconsistent by cluster, not by accident.** `TourDetail.tsx` uses
   `focus:ring-jvto-lime`; `BookingForm.tsx:77` uses `focus:ring-green-500`; `SearchableSelect.tsx:168`
   uses `focus:ring-blue-500`. Three focus colors, only one of them a project token.

---

## Positive Findings

These are load-bearing and should be protected in any refactor:

- **Semantic HTML is genuinely good.** Zero `<img>` without `alt`. Zero `onClick` handlers on `<div>` or
  `<span>` — every interactive element is a real button or link. 69 `aria-label` uses. A proper
  `<main id="main-content">` landmark with a skip link in `src/app/(website)/layout.tsx:97`. This is a
  stronger baseline than most codebases of this size and it was clearly deliberate.
- **The V2 token set is thoughtfully built** where it is used. `website.css` ships AA-passing "ink partner"
  variants (`--color-jvto-orange-ink: #B64400` alongside `--color-jvto-orange: #E8650A`) — evidence that
  contrast was reasoned about at the token layer, not retrofitted.
- **Fonts are correctly loaded** as variable fonts via `next/font/google` with `display: swap`, and an
  in-file comment records a previous bug where they were declared but never loaded. Someone found and fixed
  a real problem and left a note for the next person.
- **Motion is restrained.** One layout-property transition in the entire codebase, and no JS animation
  library actually in use.
- **CI already enforces content integrity** — schema validation, route validation, package-readiness, and
  bundle-drift checks all block. The gate discipline exists; it simply has not been extended to design.

---

## Recommended Actions

In priority order:

1. **[P0] `/impeccable document`** — Regenerate `DESIGN.md` and its sidecar from the live V2 tokens in
   `website.css`. Nothing else in this list can be verified mechanically until this lands, because every
   design-system check currently measures against a deleted system. Define the missing spacing and type
   scales in the same pass (P2-3).
2. **[P1] `/impeccable extract`** — Define or replace the six undefined utility families (P1-1, P1-3) and
   fold `whyJvtoTokens.ts` into the `@theme` block (P2-1). Start with
   `src/app/(website)/layout.tsx:80` — it affects every public page.
3. **[P1] `/impeccable harden`** — Restore focus indicators on `BookingForm.tsx:176` and
   `SearchableSelect.tsx:197`, then add `eslint-plugin-jsx-a11y` and turn on the Impeccable detector hook
   (P1-4, P1-5).
4. **[P2] `/impeccable colorize`** — Sweep the 463 arbitrary hex classes into tokens, highest-traffic
   components first (P2-2).
5. **[P2] `/impeccable optimize`** — Verify and remove the ~17 unused dependencies, keeping
   `@prisma/client` and `react-dom` (P2-4).
6. **[P3] `/impeccable animate`** — Convert the `max-height` accordion transition to `grid-template-rows`
   (P3-1).
7. **[P3] `/impeccable polish`** — Final pass: replace the 8 `side-tab` borders (P1-2) and confirm the
   score has moved.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `/impeccable audit` after fixes to see your score improve.

---

## Method & Limits

**What was audited.** Commit `2b90a51` on `live`. The audit branch is byte-identical to `origin/live`
(`git rev-list --left-right --count origin/live...HEAD` → `0 0`), so the working tree *is* the target.

**Tooling.** Impeccable v4.1.1, upstream commit `56f44523f76efdcec813e67b38ee550e49b16f48`, vendored to
`.claude/skills/impeccable/`. The detector was run from the vendored copy, **not** via `npx impeccable` —
npm's `latest` is 3.6.0, older than the plugin, and its rule engine would disagree with the one bundled here.

**What could not be measured, and why.** A rendered browser pass was planned and did not happen:

- No `node_modules`, no `.env`/`.env.local`, and the database host `31.97.223.43:5432` is unreachable from
  the audit environment, so `npm run dev` cannot serve the DB-driven pages.
- The production deploy at `https://javavolcano-touroperator.com` **is** reachable (HTTP 200 via `curl`),
  but headless Chromium in this sandbox could not load it — `ERR_CERT_AUTHORITY_INVALID` against the egress
  proxy's CA, and `ERR_CONNECTION_RESET` on the target host. Installing the CA into the browser trust store
  was not possible here.

Consequently:

| Dimension | Basis |
|---|---|
| Accessibility | Static source analysis only. **Colour contrast was never measured** against rendered pixels; the score reflects semantics, focus handling, and tooling |
| Performance | Static only. No LCP, CLS, bundle size, or frame timing. Score marked provisional |
| Theming | Fully auditable statically — highest-confidence dimension in this report |
| Responsive | **Not scored.** Touch-target sizes, horizontal overflow, and breakpoint behaviour all require rendering |
| Implementation Integrity | Fully auditable statically |

**Screenshots were not captured** and `docs/_audit/screens/` is therefore absent, contrary to the original
plan. To complete the unmeasured dimensions, re-run `/impeccable audit` from an environment with either
database access or working browser egress.

**On false positives.** Two claims from this audit's own first pass were disproved during verification and
are recorded here rather than quietly dropped:

- *"Two carousel libraries and two mapping libraries ship to users"* — **wrong**. Neither
  `embla-carousel-react` nor the Leaflet/Mapbox pair is imported anywhere; they are unused declarations
  that never enter the bundle. Corrected in P2-4.
- *"Six `<Image>` components are missing `alt`"* — **wrong**, an artifact of line-based grep against
  multi-line JSX. A tag-aware re-check found **zero**. Recorded as a positive finding instead.

The 1002 `design-system-*` detector findings are likewise reported as **one** issue (P0-1), not 1002, for
the reason given there.
