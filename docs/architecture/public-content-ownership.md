# Public Content Ownership (SSOT migration — architecture decisions)

> Status: **active program** (started 2026-08-04). Source blueprint:
> `JVTO_WEB_SSOT_TECHNICAL_EXECUTION_BLUEPRINT.md` (owner-supplied), baseline commit `a7892e66`.
> Companion ledger: [public-content-migration-status.md](public-content-migration-status.md).

## Goal

`jvto-web/content/` becomes the single source of truth (SSOT) for **evergreen public knowledge**;
PostgreSQL (via Prisma) remains the source only for **dynamic/transactional data**. Migration is
incremental, route-by-route, with rollback (revert the route's cutover commit).

## Architecture decisions (fixed)

| ID | Decision |
|---|---|
| AD-01 | `content/` owns: Policy, Travel Guide + their FAQ, Why JVTO, Our Story, Community Standards, Verify JVTO narrative, public team bios, stable destination guidance, Blog (after cutover). |
| AD-02 | DB/Prisma owns: packages, prices, availability, bookings, payments, users/auth, customer records, operational status (volcanic etc.). Prisma is a data-access layer, not a content source. |
| AD-03 | Stable cross-page facts live once in JSON under `content/entities/` (org, credentials, people, partners, review-platform summaries with `verifiedAt`). |
| AD-04 | Markdown = narrative pages; JSON = facts + structured blocks; TSX = layout/interaction; DB = dynamic. |
| AD-05 | No new content framework. Only `gray-matter`, `zod`, `tsx` (dev) + the existing remark/rehype + `MarkdownRenderer`/`MarkdownRendererTravelGuide`. |
| AD-06 | URLs unchanged; canonical derived from `route` + production origin; help host stays noindex. |
| AD-07 | `meta.title` renders the only `<h1>`; Markdown bodies start at `##`. |
| AD-08 | Visible FAQ HTML and `FAQPage` JSON-LD come from the same FAQ object (`faqKey`). |
| AD-09 | `/knowledge/jvto.json` static route handler = convenience feed only. |
| AD-10 | A migrated route reads only `content/`; no fallback to `content_pages`; table dropped only at zero references (Package 10, owner-gated). |
| AD-11 | Source migration first, redesign later (Package 11). |

## The actual current resolution model (verified 2026-08-04 — corrects the blueprint)

There are **two separate precedence chains**, and `content_pages` (DB) is the **lowest tier in both**:

**FAQ** (`src/lib/content/resolveFaqs.ts:74`):
`cms-seed (SEED_COVERED_ROUTES)` → `narrative_claims (DB)` → `canonical hardcoded` → `content_pages content.faq`.

**Body/SEO** (`src/lib/publicContent/getPublicPageSnapshot.ts:166`):
seed-covered routes are snapshot/seed-authoritative (DB can never override); non-covered routes prefer
a live complete `content_pages` row at **runtime** only, and are snapshot-only at build. Snapshots =
`{ ...manualPageSnapshots, ...seedPageSnapshots }` (seed wins).

Consequences:

- For the ~50 seed-covered routes the DB is already bypassed — the migration mostly **consolidates
  file-based sources** (`src/data/cms` seed, `pageSnapshots.ts`, `policy-bundle`, OKF agent-guides)
  into one `content/` plane, rather than extracting from a database.
- **Travel-guide is dual-path:** `[slug]` (snapshot chain) vs **14 individual folder pages** whose body
  already comes from OKF `AGENT_GUIDES` (`src/lib/content/agentGuides.ts` ← `src/data/okf`) and which
  call `getContentPage()` only for SEO overrides. `how-booking-works` and `payment-and-deposit` are
  live pages (not redirects).
- **Sitemap** (`src/app/sitemap.ts` + per-cluster `sitemap.data.ts`) hardcodes route lists;
  `content_pages` supplies only fallback `lastModified` dates (`sitemap-utils.ts`). Package 07 removes
  that fallback — it does not "move the sitemap off the DB".
- **Robots** is `src/app/robots.ts` (dynamic route), not `public/robots.txt`.
- **`/policy/booking-payment-cancellation`** already sources its binding copy from
  `src/data/policy-bundle/` (`getPolicyNotes` / `getCustomerCopy` / `getPolicyEvidenceText` in
  `src/lib/policy-bundle.ts`) and skips the snapshot body for that slug.
- **`team/[slug]`** params come from `crew_members` (DB) and **`destinations/[slug]`** from
  `destinations` (DB) — Package 06 migrates only static narrative, never these params.
- **Schema injection is per-page** (`PageJsonLdCombined` + per-page `extraSchemas`), not global layout.
  Known latent bug: the Ijen `MedicalWebPage` `reviewedBy → /#dr-ahmad-irwandanu` is a dangling `@id`
  on `/travel-guide/ijen-health-screening` (DOCTOR_SCHEMA is injected on the homepage, not there) —
  fix during Package 04.
- **Known AD-08 gap to close (Package 05):** `why-jvto/[slug]` emits FAQ JSON-LD from the resolved
  source but renders the visible FAQ from `content.faq`.
- **Dead module:** `src/lib/ssot/getContentPage.ts` (zero importers) — **removed in Package 09** (2026-08-09; the active reader is `@/lib/content/getContentPage`).

## Guardrails that keep the facts lock intact

- `content/` is **outside** the CI `src/data` drift gate (by design — it is repo-owned, not synced),
  but it **must not escape the canonical-facts lock**: `scripts/validate-content-drift.mjs` scans
  `content/` (added in Package 01) so `docs/CANONICAL_FACTS.md` rules (founding 2015 / no 2016 /
  mandatory Ijen health / Lifetime Package Credit / canonical review counts / website-only booking)
  apply to every file that lands there.
- `content:*` scripts (this program) are distinct from the pre-existing `validate:*` namespace
  (`validate:content` = the drift scanner).
- Entity JSON copies **approved values only** (from `docs/CANONICAL_FACTS.md` + current effective
  sources). Conflicting values are listed and blocked in the ledger — never auto-chosen.

## Program sequence

00 audit/ledger → 01 loader+gates → 02 entities → 03 Policy → 04 Travel Guide → 05 Why JVTO →
06 Verify/Team/Destinations → 07 SEO/sitemap/feed → 08 Blog → 09 retire old readers →
10 DB retirement (owner-gated) → 11 design refactor. One package per PR; never skip ahead.
