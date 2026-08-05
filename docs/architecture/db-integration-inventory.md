# JVTO Database Model / Read / Write / Integration Inventory

> **Milestone 0 baseline artifact — READ-ONLY, produced with NO database connection.**
> No `DATABASE_URL` was set and no production credentials were used or requested. Every claim
> below is derived **statically** from `prisma/schema.prisma` and a code scan of `src/` +
> `services/`. Values that can only come from a live database (row counts, triggers, views,
> real null density, migration state, backup proof) are **explicitly deferred to owner
> DB-access discovery in §7** — they are not guessed here.
>
> **Grounding:** `docs/architecture/JVTO_TECHNICAL_PROJECT_HANDOFF.md` §3.5 (DB baseline),
> §13.1 (data classes), §14 (DB transformation strategy), §26 (known unknowns); and
> `prisma/schema.prisma` (1,952 lines). Satisfies the handoff §28 / §3.5 requirement for a
> "database model/read/write/integration inventory without mutation."
>
> Method note: the naive `prisma.<model>` grep was corrected to **exclude the generated
> client** at `src/generated/prisma` (the Prisma generator output — `generator client { output
> = "../src/generated/prisma" }`), which otherwise inflated counts massively (e.g. false
> `prisma.user.aggregate` ×106 from the generated dts). All read/write counts below are
> post-exclusion.

---

## 0. Headline numbers (all auto-derived)

| Metric | Value | Source |
|---|---:|---|
| **Prisma models** | **106** | `grep -c '^model ' prisma/schema.prisma` |
| Enums | 4 | `policy_document_type`, `source_enum`, `asset_type`, `destination_asset_type` |
| Scalar fields — optional (`?`) | 733 | schema scan |
| Scalar fields — required | 221 | schema scan |
| Scalar fields — array (`[]`) | 19 | schema scan |
| `@relation` directives | 137 | schema scan |
| Foreign-key fields (`fields: [...]`) | 128 | schema scan |
| `onDelete: Cascade` / `NoAction` | 77 / 34 | schema scan |
| `deleted_at` soft-delete columns | 71 models | schema scan |
| Declared `@@index` / `@@unique` | 51 / 14 | schema scan |
| Models flagged "has comments in the database" | 63 | introspection markers |
| Models flagged "contains check constraints" | 14 | introspection markers |
| Direct `prisma.<model>.<op>` call sites (excl. generated) | 133 across 66 files | code scan |
| Prisma `$transaction` uses | 2 (1 file) | code scan |
| Raw SQL (`$queryRaw`) | 2 (2 files); **zero** `*Unsafe` / `$executeRaw*` | code scan |
| `prisma/migrations/` directory | **absent** — schema is maintained via `prisma db pull` | filesystem |

The schema is a **legacy introspection** (`db pull`), not a migration-authored schema: 63/106
models carry `db.Timestamp(6)` snake_case columns, DB-comment markers, and ~75% nullable scalar
columns — consistent with handoff §3.5 ("legacy columns and naming irregularities … use
expand–migrate–contract rather than a rewrite-in-place").

---

## 1. Model inventory (106 models, grouped by domain)

Each of the 106 models is assigned to exactly one primary domain. `booking_*` payment/finance
tables are counted under **Booking** with a Payment/Financial cross-flag; joins that bridge two
domains are noted.

### Booking / transactional — 21
`bookings`, `booking_addons`, `booking_crew_members`, `booking_crew_member_activities`,
`booking_destination_activities`, `booking_destination_schedules`, `booking_hotels`,
`booking_hotel_meals`, `booking_hotel_rooms`, `booking_itineraries`, `booking_logistics`,
`booking_other_activities`, `booking_police_escort`, `booking_tshirts`, `booking_vehicle_units`,
`booking_whatsapp_logs`, `booking_finances`⟨financial⟩, `booking_payment_terms`⟨payment/financial⟩,
`booking_payment_histories`⟨payment/financial⟩, `booking_reviews`⟨→reviews⟩,
`booking_review_crews`⟨→reviews/crew⟩.
Hub table `bookings` fans out to **20** child relations (schema lines 502–527).

### Payment — 1 (+3 booking-side)
`payment_methods`. Booking-side payment tables (`booking_payment_terms`,
`booking_payment_histories`, `booking_finances`) live in the Booking group above.
**Note:** actual payment *execution* is not in this DB — see §5 (legacy Laravel proxy).

### Product / catalog — 15
`packages`, `package_categories`, `package_addons`, `package_destinations`, `package_includes`,
`package_excludes`, `package_hotel_options`, `package_faqs`, `combined_packages`,
`combined_package_details`, `addons`, `item_includes`, `item_excludes`, `inclusion_rules`,
`durations`. (`package_images`, `package_assets` are homed under **Assets**.)
`packages` is the widest model (~60 columns incl. AEO arrays `perfect_for`, `health_requirements`,
`emergency_protocols`, `unique_selling_points`) + trigram GIN indexes on `name`/`slug`.

### Pricing — 4
`package_prices`, `price_tiers`, `currency_exchange_rates`, `discounts`.

### Availability / channel / rules — 4
`order_channels`, `channel_unavailable_ranges`, `crew_unavailabilities`, `transport_crew_rules`.

### Itinerary / activities / routes — 12
`routes`, `route_details`, `route_destinations`, `locations`, `package_itinerary_days`,
`package_itinerary_day_details`, `activities`, `activity_categories`, `activity_starts`,
`activity_ends`, `other_activities`, `destination_activities`.

### Crew — 5
`crew_members`, `crew_roles`, `crew_member_roles`, `crew_member_reviews`⟨review data⟩,
`crew_reviews`⟨review data⟩. (`crew_unavailabilities` is homed under **Availability**.)
`crew_members` carries `kta_id` (KTA credential) + `password`/`email` (crew login).

### Destination / lodging — 5
`destinations`, `destination_gears`, `hotels`, `room_types`, `room_configurations`.
(`destination_activities`→Itinerary, `destination_faqs`→Content, `destination_assets`→Assets.)
`destinations` is JSON-heavy (`schema_json`, `required_gear`, `safety_notes`,
`emergency_contacts`, …).

### Transport / vendors — 4
`vehicle_types`, `vehicle_units`, `vendors`, `vendor_categories`.

### Reviews / feedback / social proof — 2
`reviews` (multi-platform: Trustpilot/Google/TripAdvisor), `feedback`. The review **join** tables
are homed in their parent domains: `booking_reviews`/`booking_review_crews` → Booking;
`crew_reviews`/`crew_member_reviews` → Crew.

### Content / CMS — 16
`content_pages`, `page_contents`, `faqs`, `category_faqs`, `destination_faqs`, `blogs`,
`blog_categories`, `announcements`, `policy_documents`, `policies`, `site_identity`,
`organization_profile`, `web_metadata`, `knowledge_bases` (has `Unsupported("vector")` pgvector
embedding), `documents`, `document_categories`.

### Narrative-claims (AEO) — 1
`narrative_claims` (C1–C9 canonical claims, `primary_page`-wired; JSON `mechanism` /
`evidence_hooks` / `nlp_variants`, `text[]` `evidence_slugs`).

### EAV — 4
`eav_entity`, `eav_attribute`, `eav_value`, `eav_relation` (UUID-keyed, cascade-linked,
typed value columns + `value_json JsonB`).

### Users / auth — 5
`User` (`@@map("customers")`), `Account` (OAuth tokens), `Session`, `VerificationToken`,
`countries` (reference data / dial codes).

### Assets / media — 7
`assets`, `asset_tags`, `tags_assets`, `folders` (self-referential tree),
`package_assets`, `package_images`, `destination_assets`.

### Ops / volcanic — 0 dedicated models
**No `ops`/`volcanic-status` model exists in the schema.** Per repo docs, volcanic-status is a
`live`-branch bot **commit to content**, not a DB table. Operational config lives in `policies`
(cancellation/reschedule windows) and `transport_crew_rules`.

*Domain totals (disjoint — each model counted once, verified against `grep '^model '`):
Booking 21 + Payment 1 + Product 15 + Pricing 4 + Availability 4 + Itinerary 12 + Crew 5 +
Destination 5 + Transport 4 + Reviews 2 + Content 16 + Narrative 1 + EAV 4 + Users 5 + Assets 7
= **106** ✓. Cross-domain models (join/bridge tables) are annotated ⟨…⟩ but counted only in their
primary domain.*

---

## 2. Relation / foreign-key map (major clusters)

128 FK fields / 137 `@relation` directives. Cascade-heavy (77 `onDelete: Cascade`) around child
tables; `NoAction` (34) guards references from `bookings` to reference data. Major clusters:

| Hub | Fan-out (FK children point at hub) | Notable FK edges |
|---|---|---|
| **`bookings`** | 20 child relations (`booking_*`, `feedback`, `reviews`, `crew_member_reviews`) | → `User`(`customer_id`), `packages`, `durations`, `order_channels` (all `NoAction`, all **nullable**) |
| **`packages`** | 18 child/link relations | → `durations`, `order_channels`, `package_categories`, `destinations` ×2 (`start_/end_destination_id`, named relations) |
| **`destinations`** | 14 relations | ← `activities`, `hotels`, `package_destinations`, `route_destinations`, `destination_assets/faqs/gears` |
| **`hotels`** | 8 relations | → `destinations`; ← `room_types`, `room_configurations`, `booking_hotels`, `package_hotel_options` |
| **`crew_members`** | 6 relations | ← `booking_crew_members`, `crew_member_roles`, `crew_reviews`, `crew_unavailabilities` |
| **`order_channels`** | 5 relations | ← `bookings`, `packages`, `crew_roles`, `transport_crew_rules`, `channel_unavailable_ranges` |
| **`booking_payment_terms`** | — | **3 FKs** → `bookings`, `discounts`, `payment_methods` ×2 (named: deposit + outstanding method) |
| **`routes`** | 3 relations | ← `route_details`, `route_destinations`, `package_itinerary_days` |
| **`User`(customers)** | 3 relations | ← `Account`, `Session`, `bookings` (NextAuth adapter shape) |
| **EAV** | `eav_value`→(`eav_entity`,`eav_attribute`); `eav_relation`→`eav_entity` ×2 (from/to) | all `onDelete: Cascade`, UUID keys |
| **assets** | `asset_tags`→(`assets`,`tags_assets`); `package_assets`/`destination_assets`→`assets` | `folders` self-relation `FolderToFolder` |

Named / self relations to watch (they complicate query builders):
`packages_{start,end}_destination_idTodestinations`, `booking_payment_terms_{deposit,outstanding}
_payment_method_idTopayment_methods`, `package_itinerary_day_details_{from,to}_location`,
`folders.FolderToFolder`, `eav_relation_{from,to}_entity`.

---

## 3. Nullability profile

High-level split of scalar columns: **733 optional (`?`) vs 221 required vs 19 array** ⇒ roughly
**75% of scalar columns are nullable.** This is the fingerprint of a `db pull` legacy schema and
directly motivates handoff §14.1 step 5 ("row counts and orphan/null profiles") — *declared*
nullability is known; *actual* null density is a live-DB discovery (§7).

Notable nullable columns on **transactional** models (each a data-integrity risk to verify before
any expand–migrate–contract step):

| Model | Nullable columns that arguably should be NOT NULL |
|---|---|
| `bookings` | `customer_id?`, `package_id?`, `duration_id?`, `order_channel_id?`, `booking_code?`, `slug?` (unique but nullable) — the four FKs are all optional despite being the transactional spine |
| `booking_payment_terms` | `grandtotal?`, `total_payment?`, `balance?`, `deposit_amount?`, `full_payment_due_date?`, `deposit_payment_link?` |
| `booking_payment_histories` | `amount?`, `payment_method_id?`, `payment_date?`, `booking_id?` |
| `booking_finances` | `profit?`, `total_expense?`, `total_expense_crew/paid/debt?`, `booking_id?` |
| `reviews` | `star?`, `booking_id?`, `package_id?` (published-review provenance is optional) |
| `discounts` | `amount?`, `customer_id?`, `booking_id?`, `is_verified?`, `is_used?`, `verification_code?` |
| `crew_unavailabilities` | `crew_member_id?` (unavailability with no crew) |

Contrast: newer/hand-authored models (`content_pages`, `faqs`, `narrative_claims`,
`policy_documents`, `assets`, `eav_*`, `destination_gears`) use required fields + real defaults —
these are the modern islands in the legacy sea.

---

## 4. Read-path & write-path inventory

Scope: `src/**` + `services/**`, `*.ts`/`*.tsx`, **excluding `src/generated/prisma`**.

### 4a. Direct `prisma.<model>.<op>` calls — 133 sites / 66 files

| Operation | Sites | | Operation | Sites |
|---|---:|---|---|---:|
| `findMany` | 54 | | `delete` | 9 |
| `findUnique` | 20 | | `findFirst` | 8 |
| `create` | 15 | | `upsert` | 2 |
| `update` | 13 | | `deleteMany` | 1 |
| `count` | 11 | | **total** | **133** |

Distribution by area (files touching `prisma.`):
`src/app/(api)` **45**, `src/lib/publicContent` 6, `src/lib/queries` 5, `src/lib/packages` 2,
`src/lib/destinations` 2, `src/app/(website)` 2, `src/app/(cms)` 2, `src/lib/ssot` 1,
`src/lib/content` 1, `src/lib/jvtoReviews.ts` 1, `src/app/sitemap-utils.ts` 1.

### 4b. Prisma client + aliases

- **Single singleton:** `src/lib/prisma.ts` — instantiates `PrismaClient` from `@/generated/prisma`,
  applies the `BigInt.prototype.toJSON` monkey-patch, caches on `globalThis` in non-prod, and
  exports **both** `export const prisma` *and* `export default prisma`.
- **Import styles:** named `import { prisma } from '@/lib/prisma'` (~64 files); **default-import
  alias** `import prisma from '@/lib/prisma'` in **3 files** — `src/lib/content/getContentPage.ts`,
  `src/lib/ssot/getContentPage.ts`, `src/lib/publicContent/getPublicOrganizationProfile.ts`.
- **No re-binding aliases** (`const db = prisma`, `import { prisma as X }`) were found — the only
  alias is the default-export form above.
- NextAuth binds the same client into its adapter: `PrismaAdapter(prisma)` in `src/lib/auth.ts`.

### 4c. Repository / wrapper modules (centralized DB access under `src/lib/**`) — 18

These `get*/list*` helpers are the intended Server-Component data path (per CLAUDE.md "extract data
logic to a `src/lib/.../get*.ts` helper; don't `fetch(/api/...)` from a Server Component"):

`src/lib/content/getContentPage.ts`, `src/lib/ssot/getContentPage.ts`,
`src/lib/destinations/getWebDestinationDetail.ts`, `src/lib/destinations/getWebDestinationsList.ts`,
`src/lib/packages/getWebPackageDetail.ts`, `src/lib/packages/getWebPackagesList.ts`,
`src/lib/jvtoReviews.ts`, `src/lib/publicContent/{databasePackageDetail,databaseDestinationDetail,
faqSnapshot,getPublicOrganizationProfile,reviewApiSnapshot,reviewSnapshot}.ts`,
`src/lib/queries/{crewMembers,narrativeClaims,packageFaqs,schemaReviews,toursByDestination}.ts`.

### 4d. Write-path inventory — 25 route files, ~40 write ops

**All writes originate from `(api)` route handlers** (admin/CMS surface); no Server Component or
`src/lib` wrapper performs a write. Representative map (`model.op`):

| Route file | Writes |
|---|---|
| `src/app/(api)/api/assets/[id]/route.ts` | `assets.update`/`delete`, `tags_assets.create`, `asset_tags.upsert`/`deleteMany` (inside `$transaction`) |
| `src/app/(api)/api/assets/route.ts`, `.../assets/upload/route.ts` | `assets.create`, `assets.update` |
| `src/app/(api)/api/content-pages/route.ts` / `[id]` | `content_pages.upsert` / `update`,`delete` |
| `src/app/(api)/api/narrative-claims/route.ts` / `[id]` | `narrative_claims.create` / `update`,`delete` |
| `src/app/(api)/api/packages/route.ts` / `[id]` | `packages.create` / `update` |
| `src/app/(api)/api/destinations/route.ts` / `[id]` | `destinations.create` / `update` |
| `src/app/(api)/api/faqs`, `faq-categories`, `destination-faqs` | `faqs.*`, `category_faqs.create`, `destination_faqs.create`/`delete` |
| `src/app/(api)/api/blogs/route.ts` / `[id]` | `blogs.create` / `update`,`delete` |
| `src/app/(api)/api/policy-documents/route.ts` / `[id]` | `policy_documents.create` / `update`,`delete` |
| `src/app/(api)/api/site-identity/route.ts` | `site_identity.create`,`update` |
| `src/app/(api)/api/destination-assets`, `folders` | `*.create`/`update`/`delete` |

Notable: **no code path writes `bookings`, `booking_*`, `reviews`, `crew_members`, or
`discounts`** — those transactional tables are written by systems *outside* jvto-web (legacy
Laravel + wa-gateway; see §5). jvto-web's write surface is essentially the **content/CMS + media
admin**, plus NextAuth adapter writes to `User`/`Account`/`Session`/`VerificationToken`.

### 4e. Transactions & raw SQL

- **`$transaction` — 2 uses, both in `src/app/(api)/api/assets/[id]/route.ts`** (asset-tag
  reconciliation: delete-then-upsert tag links atomically). No other multi-statement transaction
  exists — booking/payment atomicity is **not** handled in this repo.
- **Raw SQL — 2 `$queryRaw` (tagged-template, parameterized), zero unsafe/execute variants:**
  `src/lib/packages/getWebPackageDetail.ts:100` and
  `src/lib/publicContent/databasePackageDetail.ts:97` — both read `destination_gears` "global
  gears". No `$queryRawUnsafe`, `$executeRaw`, or `$executeRawUnsafe` anywhere (injection surface
  is minimal).

---

## 5. Webhook / payment / integration dependencies

| Integration | Present in jvto-web? | Where / evidence | Finding |
|---|---|---|---|
| **Xendit (payments)** | **Not native.** UI copy only | `checkout/CheckoutInner.tsx` (labels "…via Xendit"); it reads `result.payment_link` and redirects | Xendit signature/retry/refund/reconciliation is **in the legacy backend**, not here → handoff §26 unknown |
| **Payment / checkout flow** | Thin **proxy to legacy Laravel** | `src/app/(api)/api/checkout/route.ts`, `checkout/bank-transfer/route.ts`, `booking/pay-balance/route.ts`, `booking/update-{pickup,drop,tshirt}/route.ts` all `fetch()` `NEXT_PUBLIC_LEGACY_URL` / `NEXT_PUBLIC_LEGACY_URL_DOMAIN` | Booking + payment authority lives in a **separate Laravel system on the same Postgres**; jvto-web forwards payloads server-to-server |
| **Payment webhook receiver** | **Absent** | No route under `(api)` matches `webhook`/`callback`/`xendit`/`notification` | jvto-web has **no** payment-confirmation webhook; confirmation is the legacy system's job. Verify idempotency/replay there (handoff §13.2, §26) |
| **Email (Mailgun/Nodemailer)** | Indirect only | `nodemailer@^7` in `package.json`; used via NextAuth `EmailProvider` SMTP in `src/lib/auth.ts` (`EMAIL_SERVER_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM`). **No Mailgun code, no direct `createTransport`/`sendMail`** | Only transactional email is NextAuth magic-link. The CLAUDE.md "Mailgun + Nodemailer" claim is **aspirational** for jvto-web (transactional mail likely legacy-side) |
| **Google Business Profile / `sync-google` reviews** | **Not present as a sync** | Only `site_identity.google_business_profile_url` stored via `src/app/(api)/api/site-identity/route.ts`. Review data comes from the `reviews` table + hand-run `scripts/export-public-review-*.mjs` snapshots | **No `sync-google` review-ingestion script exists in this repo.** Google reviews enter via the DB `reviews` table (populated elsewhere). Flag as external/legacy ingestion → §26 unknown |
| **WhatsApp (`services/wa-gateway`)** | Separate microservice | `services/wa-gateway/dist/*` — a **Fastify** service with its own token auth (`WA_GATEWAY_TOKEN`), **its own `DATABASE_URL`**, `ensureSchema()` (`db/schema`), a Baileys-style `whatsapp/socket`, and a ruleset JSON (`docs/whatsapp-jvto-semi-chatbot-templates.json`). DB table `booking_whatsapp_logs` records WA scheduling | jvto-web pages only emit `wa.me` deep links (Navbar/Footer/CTAs). The gateway is a **distinct deploy** sharing Postgres; its schema is **not** in `prisma/schema.prisma` → §26 unknown (provider contract, delivery semantics) |
| **NextAuth** | Native | `src/lib/auth.ts` (`authOptions`: `PrismaAdapter(prisma)`, Google + Email providers, `session.strategy = "database"`), route `src/app/(api)/api/auth/[...nextauth]/route.ts`, `src/middleware.ts`, admin allowlist `isAdminEmail()` via `CMS_ADMIN_EMAILS` (fail-closed) | Writes `User`/`Account`/`Session`/`VerificationToken`. Google OAuth `allowDangerousEmailAccountLinking: true` — note for security review |

**Webhook entry points under `src/app/(api)/`:** there are **no external-provider webhook
receivers**. The nearest "event-in" endpoints are operational: `revalidate/route.ts` (ISR
revalidation), `indexnow/route.ts` (IndexNow submit), `build-info/route.ts` (deploy-SHA probe).
Payment/booking events are **not** received by jvto-web.

---

## 6. PII / financial / medical data classification (→ handoff §13.1)

Handoff §13.1 classes: **Public / Internal / Confidential / Restricted** (§13.3 medical boundary).

| Class | Models / fields | Notes |
|---|---|---|
| **Public** | `packages`, `package_*`, `destinations`, `destination_*`, `reviews` (published), `faqs`, `category_faqs`, `content_pages`, `page_contents`, `blogs`, `policy_documents`, `site_identity`, `organization_profile`, `narrative_claims`, `web_metadata`, `assets`/`destination_assets`, `crew_members` **public bio subset** (`name`, `about_me`, `photo_url`, social URLs, `kta_id`) | CDN/public-cache allowed |
| **Internal** | `order_channels`, `crew_roles` (`rate_per_day`), `price_tiers`, `package_prices`, `currency_exchange_rates`, `vehicle_types`/`vehicle_units` (pricing), `vendors`/`vendor_categories`, `transport_crew_rules`, `inclusion_rules`, `channel_unavailable_ranges`, `policies`, `room_types.rate_idr`, `room_configurations` | Authenticated-staff only; commercial cost/rate data |
| **Confidential (customer PII + financial)** | `User`/customers (`name`,`email`,`phone`,`image`), `bookings` (`special_requirement`,`internal_note` + all `booking_*` children), `booking_logistics` (pickup address/detail), `booking_finances` (`profit`,`total_expense*`), `booking_payment_terms` (`grandtotal`,`balance`,`deposit_amount`,payment links), `booking_payment_histories` (`amount`,`reference`,`attachment`), `payment_methods.account_number`, `discounts` (`email`,`verification_code`), `feedback` (`comments`,`nps`), `crew_member_reviews`/`booking_reviews` (guest text) | Role-scoped, encrypted, audited (§13.2) |
| **Restricted (secrets / provider creds)** | `Account.access_token`/`refresh_token`/`id_token` (OAuth tokens, `@db.Text`), `Session.sessionToken`, `VerificationToken.token`, `order_channels.username`/`password`, `crew_members.password`, `discounts.verification_code`, `booking_payment_terms.{deposit,outstanding}_payment_link` | **Secrets-in-DB** — flag against handoff §13.2 "secrets outside Git" + rate-limit/replay controls |

**Financial-data flags:** `booking_finances`, `booking_payment_terms`, `booking_payment_histories`,
`package_prices`, `price_tiers`, `currency_exchange_rates`, `discounts`, `payment_methods`,
`room_types.rate_idr`, `crew_roles.rate_*`, `vehicle_types.price_*`. Per handoff §14.3, these are
the tables a future `payment_ledger` / `booking_agreement_snapshots` / `quote_snapshots` layer must
protect; current schema has **no immutable snapshot/ledger table** (handoff §14.3 gap, §27 risk
"product/policy updates rewrite old bookings").

**Medical / health (§13.3) — GOOD: none stored in this DB.** There is **no** surat-sehat / health-
screening / traveler-medical model or column. The only health field is `packages.health_requirements
String[]` — **public policy text**, not traveler data. Health-screening references in `src/` are
all **public content** (`IjenHealthScreeningSection.tsx`, `TermsPage.tsx`, `TourRequirements.tsx`,
`AuthorityShield.tsx`). The BSrE-signed surat-sehat evidence lives **upstream in llm-wiki**
(private source repo), correctly kept out of jvto-web per §13.3. **Discovery item:** confirm the
legacy Laravel DB and the wa-gateway DB likewise hold no traveler health records (out of this
repo's visibility).

---

## 7. Known unknowns (handoff §26) → required owner DB-access discovery

The following are the parts of handoff §3.5 / §14.1 that **cannot be produced without a live
database** and are therefore **deferred, not guessed**. Each is a required discovery output for the
owner (or an owner-supervised read-only session) once safe DB access exists:

| # | Discovery output (handoff ref) | Why it needs a live DB |
|---|---|---|
| D1 | **Exact row counts per model** (§14.1.5, §3.5) | Schema/code comments assert figures (e.g. "16 active + 12 soft-deleted packages", "153-item review feed", "14 crew") but these are **code claims, not DB-verified**. Real counts + orphan/null density require `SELECT count(*)` per table |
| D2 | **Triggers, views, check constraints, DB comments** (§14.1.4) | 14 models flagged "contains check constraints" and 63 "has comments in the database" in the introspection markers, but the **actual constraint/trigger/view DDL is not in `schema.prisma`**. Must `pg_dump --schema-only` / query `information_schema` |
| D3 | **Actual indexes vs declared** (§14.1) | 51 `@@index`/14 `@@unique` are declared; production may have added/dropped indexes out of band. Includes verifying the pgvector `knowledge_bases.embedding Unsupported("vector")` extension + GIN trigram indexes actually exist |
| D4 | **Production migration state / history** (§14.1.9) | **No `prisma/migrations/` directory** exists — schema is `db pull`-maintained, so there is no in-repo migration ledger. Need `_prisma_migrations` (if any) or the actual DDL-change history from prod |
| D5 | **Backup / restore proof** (§14.1.8, §13.2) | Cannot be evidenced from repo; owner must demonstrate a tested restore before any destructive change |
| D6 | **Real null / orphan profile** (§14.1.5) | §3 gives *declared* nullability (733 optional scalars); *actual* null density + FK orphans (e.g. `bookings` with null `customer_id`/`package_id`) need data queries |
| D7 | **Legacy Laravel DB schema + tables** the checkout proxy writes to (§26 "production-only behavior") | Booking/payment truth lives in a separate Laravel app on the same Postgres; its tables are invisible to `prisma/schema.prisma` |
| D8 | **wa-gateway's own `ensureSchema()` tables** (§26 WhatsApp contract) | The WhatsApp service creates/owns its own tables at runtime; not represented in the Prisma schema |
| D9 | **Payment-provider (Xendit) signature/retry/refund/reconciliation** (§26) | Not implemented in jvto-web; lives in legacy backend — contract + idempotency must be documented from that system |
| D10 | **Google-review ingestion source** feeding the `reviews` table (§26 partner contracts) | No in-repo sync; the writer of `reviews` rows is external |
| D11 | **Role/permission matrix** (§26) | Only `CMS_ADMIN_EMAILS` allowlist is visible; the full staff role model is not in this repo |

Per handoff §26, each of D1–D11 must be converted to a *verified fact*, *owner decision*, *bounded
risk*, *explicit non-goal*, or *implementation blocker* — none may remain a guess. This inventory
supplies everything derivable **without** DB access; D1–D11 are the residual that requires it.

---

*Generated as a Milestone 0 read-only baseline. No database was connected; no schema was mutated.
Traceability: all structural claims → `prisma/schema.prisma`; all code claims → cited `src/**` /
`services/**` paths; all requirements → `docs/architecture/JVTO_TECHNICAL_PROJECT_HANDOFF.md`
§3.5 / §13.1 / §14 / §26.*
