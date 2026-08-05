# Domain Ownership Matrix (repo-grounded)

> **Milestone 0 baseline artifact** grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](JVTO_TECHNICAL_PROJECT_HANDOFF.md) §6 (domain ownership
> matrix), §4 (binding principles P-01..P-09), §13 (data classes). This adapts the handoff's
> generic §6 matrix to **concrete files and Prisma models in this repo**. Companion:
> [producer-artifact-classification.md](producer-artifact-classification.md),
> [public-content-ownership.md](public-content-ownership.md) (AD-01..AD-11). Branch
> `claude/reconcile-live-into-main`. Every path grep-confirmed; no facts invented.

**Rule (P-01):** one declared authority per domain — not one store for the company. "SSOT" is
per-domain. Public evergreen narrative = Git (`content/`, P-02); transactional state = PostgreSQL/
provider (P-03); generated outputs are never authorities (P-05).

## Matrix

| Domain | Authority (real store / path) | Primary consumers | Forbidden ownership | Repo evidence (file / model) |
|---|---|---|---|---|
| **Public knowledge** | Git — `content/pages/**`, `content/faqs/**` (+ shared facts in `content/entities/**`) | `(website)/policy/*`, `travel-guide/[slug]`, `why-jvto/*`; search/schema builders; `/llms.txt`; AI content copilot | Booking state, PII, prices-as-authority | `src/lib/static-content/loadStaticPage.ts`, `listStaticPages.ts`, `migratedRoutes.ts`; `content/pages/{policy,travel-guide,why-jvto}` |
| **Evidence registry** | Git metadata — `src/data/evidenceRegistry.ts`, `content/entities/credentials.json` (raw evidence stays upstream/protected) | Verify pages, `buildVerifySchemas.ts`, reviewers | Raw secrets, medical documents, guest screening results (Restricted, §13.1/§13.3) | `src/data/evidenceRegistry.ts`, `content/entities/credentials.json`, `content/entities/partners.json` |
| **Product catalog** | PostgreSQL — `packages` (+ add-ons, hotels) | Web tour pages, quote, booking, partners | Long-form policy duplicates; static Markdown as catalog authority | `prisma/schema.prisma` (`packages`), `src/lib/packages/getWebPackageDetail.ts` / `getWebPackagesList.ts`; SSG fallback `generated/packageDetailSnapshots.json` |
| **Pricing** | PostgreSQL — package pricing rows (target: versioned price rules, Milestone 3) | Quote, checkout, invoice | Static Markdown/JSON prices as authority; cached/ISR price as final (AD-02, P-06) | `prisma/schema.prisma` pricing fields; `src/data/package-readiness/package-pricing.json` = **readiness signal only**, not authority |
| **Availability** | Operational/booking DB (fresh read; target Milestone 3) | Checkout, sales, ops | Cached page/ISR value as authority (P-06) | `prisma/schema.prisma` booking tables; no static availability file (correct) |
| **Itinerary intelligence** | Approved deterministic release — `src/data/itinerary-core/*.json` via controlled interface | `src/lib/itineraryIntelligence.ts`, `buildDestinationsSchemas.ts`, `entityRegistry.ts` | Live booking state, PII | `src/data/itinerary-core/{activities-master,destinations-master,package-route-map}.json`; `scripts/validate-itinerary-intelligence.mjs`, `sync-itinerary-core.yml` (§15 retained) |
| **Booking** | PostgreSQL (target: immutable agreement snapshot, P-04/Milestone 4) | Guest dashboard, ops, payment, comms | Mutable public policy copy inside booking | `prisma/schema.prisma` booking/traveler models; `(customer)` route group |
| **Payment** | Provider events (Xendit) + internal ledger (target Milestone 4) | Booking confirm, receipt, finance | Marketing copy; manually overwritten totals | `prisma/schema.prisma` payment models; Xendit webhook route (`src/app/(api)/…`); env-configured provider |
| **Journey readiness** | PostgreSQL tasks/state (target: `JourneyTask`, Milestone 5) | Guest, ops, comms | Public evidence; free-text readiness | `prisma/schema.prisma` (booking/journey fields); not yet a dedicated `journey_tasks` table (§14.3 target) |
| **Crew assignment** | PostgreSQL — `crew_members` (+ assignment) | Ops; `team/[slug]` params; `getActiveCrewMembers()` | Public biography narrative (that is public-knowledge) | `prisma/schema.prisma` (`crew_members`, `kta_id`), `src/lib/…/crewMembers.ts`, `buildCrewPersonSchema()` |
| **Communications** | Versioned templates + domain data (target Milestone 6) | Email (Mailgun/Nodemailer), WhatsApp | Independent policy/price/requirement facts | Mailgun/Nodemailer config; WhatsApp gateway = handoff §26 discovery (unverified) |
| **Analytics** | Domain-event projection (target: outbox, §7.7/Milestone 1) | Owner, marketing, ops | Transactional authority | No `domain_outbox`/`audit_log` yet (§14.3 target); Milestone 1 |
| **AI runtime** | Controlled decision envelopes (§12.2, target) | Public advisor / sales / ops / content copilots | Raw repo/DB/vector output; fact/price/booking mutation (P-07) | Crawler policy `src/app/robots.ts`; `/llms.txt`, `public/llms-full.txt` as read surfaces; no envelope layer built yet |

## Cross-cutting authority notes (repo-specific)

- **Public knowledge is dual-plane today.** Target authority `content/` (P-02) is live for policy,
  travel-guide Path A, and why-jvto; the remainder is still served by legacy public sources
  (`src/data/{trust-bundle,policy-bundle,blog,okf}`, `src/data/cms` seed, `pageSnapshots.ts`,
  `content_pages`/`narrative_claims` DB, `Master_Dataset_JVTO.SSOT.v3.0.json`). See
  [legacy-freeze-list.md](legacy-freeze-list.md). Enforcement that a migrated route cannot regain a
  legacy source: `scripts/validate-static-route-ownership.mjs` (blocking in `ci.yml` `verify`).
- **Prisma is a data-access layer, not a content source** (AD-02). `content_pages` and
  `narrative_claims` currently hold public narrative → classified legacy in the classification doc;
  they retire per AD-10 (Package 09/10, owner-gated). Dynamic reviews (`/why-jvto/reviews[/id]`) and
  tour/destination `[slug]` params legitimately stay DB.
- **Operational vs public split for volcanic status.** `public/ops/volcanic-status.json` is public
  operational status (operational-intelligence), bot-maintained — the one data-only artifact allowed
  onto `live` without a PR (`docs/CONTRIBUTING.md` §2.2, `update-volcanic-status.yml`).
- **Producers are upstream** (handoff cross-repo map): `sambuko82/llm-wiki` compiles trust-bundle /
  policy-bundle / blog / package-readiness; `sambuko82/knowledge-catalog-jvto-bootstrap` builds OKF.
  jvto-web is a read-only consumer under `src/data/`; the `verify` drift gate keeps `main` in sync.
- **Forbidden-ownership violations are CI-caught** where a guard exists: canonical-facts drift
  (`scripts/validate-content-drift.mjs`, scans `content/` too), static-route ownership
  (`validate-static-route-ownership.mjs`), OKF divergence (`validate-okf-consumption.mjs`). Domains
  without an observable guard (availability freshness, envelope boundaries) are Milestone 1+ targets —
  per §27, "monitor without an observable signal is not accepted".
