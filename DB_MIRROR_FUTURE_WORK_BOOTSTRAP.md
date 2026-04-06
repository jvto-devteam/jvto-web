# DB Mirror Future Work Bootstrap

## Purpose

Use this prompt when starting a new AI chat that should focus only on `DB mirror` structure, capabilities, and future extension paths.

The scope is **database mapping and forward planning**, not frontend redesign.

## Copy-Paste Prompt

```md
Active workspace is `jvto-web`.

Your task is not to redesign the frontend. Your task is to map, audit, and extend the `DB mirror` as the long-term structured source behind the new JVTO system.

Hard rules:
- Focus on `DB mirror` structure, ownership, and future capability only.
- Do not restart from old repos such as `JVTO-Why-JVTO-Next15`, `remix-why-jvto`, or `jvto-web-baseline-20260401`.
- Treat `jvto-web` only as:
  - the current consumer of the DB
  - a reference for what data is already used by runtime
- Do not drift into UI redesign, homepage rewrites, or generic product ideation.
- Work from schema reality first, then application usage, then future opportunities.

Current project model:
- final architecture = one frontend codebase + DB mirror
- DB mirror is the intended structured source for content, operational data, trust/support data, and future system growth
- several frontend-owned fallbacks were temporary implementation guards, not the intended final ownership model

Known DB-owned content already synced into DB mirror:
- `content_pages`
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`

Primary objective:
Map the current DB mirror into a practical capability model and identify what can be developed next with minimal architectural waste.

Main future capability areas to evaluate:
1. CMS
   Because there are already content/blog/metadata/assets structures.

2. Lightweight CRM
   Because there are already customers, bookings, payment history, WhatsApp logs, and review linkage.

3. Post-booking customer portal
   Because there are already bookings, itinerary, hotel, logistics, payment, and crew assignment structures.

4. Ads / marketing support
   Because the DB can already support:
   - landing pages
   - package feeds
   - conversion pages
   - audience logic
   - remarketing content structure

Required workflow:

Phase 1: DB mirror structure map
- Read `prisma/schema.prisma` first.
- Identify the real domains in the database:
  - content / CMS
  - commercial packages / pricing
  - bookings / payments
  - customers / CRM
  - itinerary / trip ops
  - crew / staffing
  - support / FAQ / policy
  - reviews / trust
  - media / assets
  - metadata / SEO / identity
- Build a domain map, not just a table list.

Phase 2: Runtime-consumer mapping
- Inspect how `jvto-web` currently consumes DB data.
- Identify which tables are already powering runtime.
- Distinguish:
  - already active in frontend/runtime
  - structurally available but not yet exploited
  - present but weak / incomplete / ambiguous

Phase 3: Capability assessment
- For each target area:
  - CMS
  - CRM ringan
  - customer portal pasca-booking
  - ads / marketing support
- Explain whether the DB mirror is already sufficient, partially sufficient, or insufficient.
- Name the exact supporting tables and missing pieces.

Phase 4: Gap and extension design
- Propose the smallest sensible extensions.
- Prefer:
  - new columns
  - linking tables
  - status fields
  - audit fields
  - derived views
  - lightweight admin ownership rules
- Avoid overengineering.

Phase 5: Execution-oriented output
- Produce:
  1. domain map
  2. feature readiness matrix
  3. table ownership map
  4. missing schema / contract list
  5. recommended next implementation order

Efficiency rules:
- Start from `prisma/schema.prisma`; do not browse random files first.
- If DB access is available, use read-only inspection queries first.
- If DB access is not available, continue with schema-based analysis and current consumer code.
- Do not repeatedly retry failing DB connections.
- Do not create large numbers of speculative documents.
- Keep the output actionable and architectural.

DB access rules:
- Prefer read-only analysis first.
- If direct DB access works, use it to verify:
  - table presence
  - row counts
  - important foreign key relationships
  - sample payload shapes
- Do not mutate tables unless explicitly asked.

Files to read first:
- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/lib/content/*`
- `src/lib/packages/*`
- `src/lib/trust/*`
- `src/app/(api)/api/**/*`
- `WORKSPACE_HANDOFF.md`

Expected answer style:
- technical
- structured
- focused on real schema and real extensibility
- no generic product brainstorming
```

## Efficient Access Guide For AI

Use this sequence. It avoids drift and repeated failed attempts.

1. Read [schema.prisma](/f:/New%20folder/DOWNLOADS/jvto-web/prisma/schema.prisma).
   This is the fastest reliable way to understand domain coverage.

2. Read [prisma.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/prisma.ts).
   This confirms how the app connects and which Prisma client is used.

3. Inspect current runtime consumers.
   Priority paths:
   - [src/lib/content](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content)
   - [src/lib/packages](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages)
   - [src/lib/trust](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/trust)
   - [src/app/(api)/api](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28api%29/api)

4. If DB mirror direct access is available, verify with small read-only queries only.
   Start with:
   - table existence
   - row counts
   - representative sample rows
   - key relationships

5. If DB access fails, stop retrying and continue with:
   - `schema.prisma`
   - current consumer code
   - already-synced DB-owned models

## Suggested Read-Only DB Verification Targets

Use these as the first verification surfaces:

- `content_pages`
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`
- `blogs`
- `blog_categories`
- `web_metadata`
- `assets`
- `folders`
- `bookings`
- `booking_payment_histories`
- `booking_whatsapp_logs`
- `booking_itineraries`
- `booking_logistics`
- `booking_hotels`
- `booking_crew_members`
- `reviews`
- `crew_reviews`

## How To Think About The Four Future Features

### 1. CMS

Likely backing structures already present:
- `content_pages`
- `blogs`
- `blog_categories`
- `web_metadata`
- `assets`
- `folders`
- `tags_assets`
- `site_identity`
- `organization_profile`

Questions the AI should answer:
- Is this enough for a page CMS?
- Is this enough for a blog CMS?
- What editorial workflow is missing?
- What asset taxonomy is missing?
- Is versioning or draft/publish state sufficient?

### 2. Lightweight CRM

Likely backing structures already present:
- `User`
- `bookings`
- `booking_payment_histories`
- `booking_whatsapp_logs`
- `reviews`
- `feedback`
- `order_channels`

Questions the AI should answer:
- Can we build a customer timeline from existing tables?
- Can we segment repeat customers, unpaid bookings, no-response customers?
- Is there enough event history for a usable CRM?
- What is missing: tags, lifecycle stage, source attribution, staff owner, notes, reminders?

### 3. Post-Booking Customer Portal

Likely backing structures already present:
- `bookings`
- `booking_itineraries`
- `booking_logistics`
- `booking_hotels`
- `booking_hotel_rooms`
- `booking_hotel_meals`
- `booking_payment_terms`
- `booking_payment_histories`
- `booking_vehicle_units`
- `booking_crew_members`
- `booking_destination_schedules`

Questions the AI should answer:
- Can an authenticated customer already see a complete trip record?
- Which fields are missing for a reliable portal?
- Which parts are operationally sensitive and should stay internal?
- What needs normalization for customer-safe display?

### 4. Ads / Marketing Support

Likely backing structures already present:
- `packages`
- `package_prices`
- `price_tiers`
- `destinations`
- `content_pages`
- `web_metadata`
- `assets`
- `reviews`
- `order_channels`

Questions the AI should answer:
- Can the DB generate landing page feeds cleanly?
- Can it support package catalog exports?
- Can it support conversion-specific page ownership?
- Can it support remarketing audiences from bookings / channels / destinations?
- What derived views or joins would make marketing faster?

## Expected Deliverables

The new chat should produce these, in order:

1. `DB domain map`
2. `feature readiness matrix`
3. `table-to-capability map`
4. `missing schema/extensions backlog`
5. `recommended build order`

## Anti-Drift Rules

The new chat must not:
- redesign the website
- re-debate the frontend strategy
- reopen old repo comparisons
- generate vague product ideas without naming tables
- recommend a CMS/CRM rewrite without first exhausting current schema potential

The new chat should:
- stay anchored to real tables
- name exact models
- separate `already possible now` from `needs schema extension`
- prefer small schema evolution over replacement
