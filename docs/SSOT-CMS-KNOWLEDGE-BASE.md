# JVTO SSOT + CMS — Knowledge Base

> Durable reference for the "one SSOT, one CMS" consolidation. This is the map that
> plan execution relies on — **update it as each workstream lands**, don't let it
> drift. Companion to [CANONICAL_FACTS.md](./CANONICAL_FACTS.md) (the facts veto) and
> [CONTRIBUTING.md](./CONTRIBUTING.md) (branch governance).
>
> Last verified: 2026-07-31 (read-only audit + OKF pipeline built same day).

---

## 1. Estate map (repos + roles)

| Repo | Role | Sync direction |
|---|---|---|
| **jvto-web** (this) | Canonical site (Next.js 16) + the ONE app the CMS lives in | — |
| **llm-wiki** | Narrative / policy / trust SSOT; compiles bundles | **one-way → jvto-web `src/data/*`** (read-only in web, CI-enforced) |
| **jvto-itinerary-core** | Pure data/rule engine (e.g. `evaluateCancellation`) | consumed as data |
| **knowledge-catalog-jvto-bootstrap (OKF)** | Curated public-facts graph; downstream of llm-wiki, upstream of the website (`okf/jvto/CLAUDE.md`: "source knowledge + evidence → OKF graph → the website"). `docs/CANONICAL_FACTS.md` itself was adjudicated from this catalog. | **llm-wiki → OKF → jvto-web `src/data/okf/*`** (read-only in web, CI-enforced via `npm run sync:okf` + `validate:okf`, 2026-07-31) |
| **jvto-new-on-design-system** | Static design/handoff prototype | manual mirror |
| **jvto-unified-cms-bootstrap** | Governance/control-plane scaffold; its `cms_*`/`integration_*` migrations landed in jvto_dev but are **orphaned from jvto-web code**. Also the source for `src/data/cms/*` (CMS seed) via `npm run sync:cms-seed` — not CI-wired, so that data is only refreshed manually. | none (parked) for `cms_*`/`integration_*`; manual pull for CMS seed |
| **jvto-data-core** | Stale one-shot ETL | dropped |

**Environments:** prod = self-hosted VPS/pm2 from branch **`live`** (`javavolcano-touroperator.com`). Develop = **`main`** → auto-deploy to `/var/www/jvto-help` (pm2 `jvto-help`, `help.javavolcano-touroperator.com`). **`main` and `live` are unrelated git histories** (production cutover paused). No SSH access from the agent — only GitHub + Adminer HTTPS.

---

## 2. jvto-web architecture (the parts that matter)

- **SSOT tables** (jvto_dev Postgres, Prisma **introspected** — no in-repo migrations, additive-only):
  - `content_pages(route, lang, seo jsonb, content jsonb, @@unique[route,lang])`
  - `narrative_claims(pillar → Q, core_claim → A, primary_page → route)`
  - plus `packages`, `destinations`, `faqs`, `policy_documents`, `crew_members`, `reviews`, `site_identity`.
- **Resolver:** `src/lib/content/resolvePageContent.ts` → per-route composition + an `atoms[]` ownership map (`source` / `owner` / `editable`). This is the closest thing to a field-ownership manifest and it is computed **in code at request time** (not a DB table).
- **FAQ precedence:** `src/lib/content/resolveFaqs.ts` → **cms-seed (`SEED_COVERED_ROUTES`) › narrative_claims › canonical hardcoded (`CANONICAL_FAQ_REGISTRY`) › CMS `content.faq`**; single-FAQPage enforced via `suppressCmsFaq`.
- **Schema injection:** `src/components/seo/PageJsonLdCombined.tsx` (Organization + WebSite + WebPage + BreadcrumbList + FAQ + per-page extras).
- **Block model (already exists):** `content.sections[].blocks[]`, rendered by `src/components/content/BlocksRenderer.tsx`. Block types: `markdown`, `image`, `grid` (card grid), `crew_grid`. Edited via `src/components/cms/SectionsBlockEditor.tsx` — draft isolation (`content._draft`), version history (`content._history`, bounded 5), facts-lock-gated Publish, `revalidatePath`.
- **Snapshot-vs-DB split** (`src/lib/publicContent/getPublicPageSnapshot.ts`): `allowDatabaseFallback` omitted → **true at runtime** (prefers the live `content_pages` row); explicit `false` → **snapshot-only** (never touches DB — build-deterministic). Snapshots live in `src/lib/publicContent/pageSnapshots.ts` + generated `generated/*.json`.
- **Facts-lock:** `docs/CANONICAL_FACTS.md` (adjudication) + `scripts/validate-content-drift.mjs` (denylist scanner; baseline `scripts/content-drift-baseline.json` = **48 hits / 18 buckets**; `--stdin` draft mode; excludes `generated/`, `src/generated/`). Runtime gate = `src/app/(api)/api/content-validate/route.ts`.
- **Auth:** NextAuth (Google SSO + Email magic-link, DB sessions). `src/lib/auth.ts` → `ADMIN_EMAILS` from env `CMS_ADMIN_EMAILS` (comma-sep, lowercased, **fail-closed**), `requireAdmin()`. `(cms)/layout.tsx` gates all `/cms/**` server-side. `src/middleware.ts` is a soft cookie gate and **excludes `/api`**.
- **Deploy:** `.github/workflows/deploy.yml` (push `main` → SSH → force-reset `/var/www/jvto-help` → build → `pm2 restart --update-env`). Hardened 2026-07-21 (#105).

---

## 3. Canonical facts (locked — see `docs/CANONICAL_FACTS.md`)

Founding **2015** (never 2016/19/20/23; PT-formal 2023 is legal-context only) · blue fire = natural phenomenon, "cannot be guaranteed" · Ijen health screening **MANDATORY** (BBKSDA SE.1658/KSA.9/2024) · deposit **20%**, close-departure 14d → 100%, cancellation = **100% Lifetime Package Credit** (not cash) · reviews **Trustpilot 4.8/51 · Google 4.9/123 · TripAdvisor 4.95/21 · 4.8/195** (forbidden: 112, 4.9/112, 47, 92, 5.0/5) · IDR-only prices · email primary `hello@…` (gmail secondary) · HQ Jl. Khairil Anwar No.102A, Bondowoso 68214 · NIB/TDUP **1102230032918**, AHU-0023020 · Kawah Ijen 2,386m, Bromo 2,329m · runtime SSOT = `site-config.ts` · no new `*-config.json`.

---

## 4. Duplicate-source map (fact → canonical owner → redundant copies)

> The core consolidation debt: `site-config.ts` is the *declared* runtime SSOT but a **near-orphan**. `jvtoReviews.ts` is the one fact family that is centralized-and-consumed → **the model to replicate**.

| Fact | Canonical owner (keep) | Redundant copies (should import, not re-inline) |
|---|---|---|
| Founding 2015 | `src/lib/site-config.ts:9` (+ derived `:173,176`) | `entityGraph.ts:35` (hardcoded), `generateFaqSchema.ts:89`, `verify-jvto/page.tsx:533`, `organizationSnapshot.ts:8`, tours pages, `marketContent.ts`. Drift residue: `OurStoryPage.tsx:96` ("2019") |
| Reviews / ratings | `src/lib/jvtoReviews.ts:21-64` (consumed by `entityGraph.ts:51`) | literals in tours pages, `marketContent.ts`, `pageSnapshots.ts`; **stale evasion** `tours/student-package/[slug]/page.tsx:290-291` (`4.9`/`112`) |
| Deposit / thresholds | `src/lib/site-config.ts:127-136` (**zero importers**) | `data.ts`, `data/knowledge.ts`, `faq-data.ts`, tours pages |
| Cancellation / Package Credit | `src/lib/site-config.ts:132` + synced `src/data/policy-bundle/*` | `data.ts`, `data/knowledge.ts`, `homepageFaqs.ts`, `faq-data.ts`, `agentGuides.ts`, `entityGraph DEFINED_TERMS`; **stale "Travel Credit"** in `generated/dbPageSnapshots.json` + `faqSnapshots.json` |
| NIB / contact / legal | `src/lib/site-config.ts:3-25` + `evidenceRegistry.ts` | `data.ts`, `data/knowledge.ts`, `verifyFaqs.ts`, `marketContent.ts`, `entityGraph`, `legal.ts` |

---

## 5. CMS surface map (KEEP / STUB / DEAD)

Authoritative menu = `src/app/(cms)/cms/_components/CmsSidebar.tsx` `navItems`. **Menu ≠ filesystem** — several links 404, and two real editors are orphaned off-menu.

- **KEEP — real editor + write API + `requireAdmin`:** Pages (SSOT) console (`cms/pages` + `[...route]`), Content Pages (`/api/content-pages`), Narrative Claims (`/api/narrative-claims`).
- **KEEP — real, but write API UNGUARDED (security fix needed):** Tour Packages (`/api/packages`), Destinations (`/api/destinations`), Policy Documents (`/api/policy-documents`), Media Assets (`/api/assets`), Site Identity (`/api/site-identity`).
- **ORPHANED real editors (exist on disk, NOT in menu):** `/cms/faq` (`/api/faqs`), `/cms/blog` (`/api/blogs`) — the `faq-manager`/`blog-manager` stubs should point here.
- **STUB / DEAD:** dead 404 links = `whatsapp`, `activities`, `travel-guides`, `isic-offerings`, `team-members`, `partnerships`, `ui-blocks`; dead redirect stubs = `collections/faq-manager`, `collections/blog-manager`; fake singletons (in-memory Zustand, no persist) = `global-singletons/global-seo`, `/navigation`; mock data = dashboard `cms/page.tsx`, `verify-config`.

---

## 6. Render-path + content-shape per page family

| Family | Runtime source | Content shape |
|---|---|---|
| homepage `/`, all `verify-jvto/*`, `/contact` | **DB-backed at runtime** (SEO/h1; body = React) | seo/h1 only |
| pilot `why-jvto/community-standards` | **DB-backed** (pilot) | `sections` block model |
| why-jvto hub, other `why-jvto/[slug]` | **snapshot-only** | `sections` |
| `travel-guide/[slug]`, `policy/[slug]` | **snapshot-only** | flat `body_md` |
| `tours*`, `destinations/[slug]` | **live DB via Prisma helpers** (`get*`) | DB rows |
| `markets/*` | **static code** (`marketContent.ts`) | constant object |

Two content shapes to reconcile in the CMS: **`sections` block model** vs flat **`body_md`**.

---

## 7. Known traps / gotchas

- **Publish gate fails closed but SILENTLY** if the validator path breaks (returns empty violations — indistinguishable from a real block). Hardened by importing the validator as a module (W1).
- **`generated/*.json` snapshots are excluded from the drift validator** yet ship stale "Travel Credit" naming and back many snapshot-only pages.
- **Unguarded `/api/*` write routes are internet-reachable** (middleware excludes `/api`) — anyone with the URL can write/delete FAQs, destinations, policy docs, blogs, site identity until `requireAdmin` is added.
- `content-drift-baseline.json` references some moved paths (`src/data_new.ts`, `src/services/mockData.ts`) — verify during source-dedup.
- Deploy false-success bug is fixed (#105) — but only for `jvto-help`; `live` uses a separate `deploy.yml` and is a disjoint history.

---

## 8. Status ledger

- **DONE (verified):** #101 founding 2015 · #102 facts-locked-web skill + `--stdin` · #103 Travel→Package rename · #104 SSOT + Route Content Console v1 · #105 deploy hardening · #106 block-model pilot.
- **PENDING owner action:** set `CMS_ADMIN_EMAILS` in the jvto-help VPS env, then `pm2 restart jvto-help --update-env`.
- **NEXT (this consolidation):** W0 knowledge doc → W1 CMS safe + usable (gate hardening, API auth, menu clean-core) → W2 widen block editing → W3 collapse duplicate sources → W4 field-ownership (lightweight).
- **PARKED:** `main → live` production cutover (disjoint histories); `cms_*`/`integration_*` DB control-plane (orphaned, zero code refs).
