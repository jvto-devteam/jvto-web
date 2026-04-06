# DB Mirror Access Guide

## Purpose

This file explains the simplest and safest way to access `DB mirror` for mapping, auditing, and future planning work.

Scope:
- connection pattern
- recommended tools
- read-only first workflow
- first queries to run

This is not a frontend guide.

## Connection Basics

The workspace uses PostgreSQL via `DATABASE_URL`.

Known server reference from the workspace:
- host: `31.97.223.43`
- port: `5432`
- provider: `postgresql`

References:
- [schema.prisma](/f:/New%20folder/DOWNLOADS/jvto-web/prisma/schema.prisma)
- [prisma.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/prisma.ts)
- [WORKSPACE_HANDOFF.md](/f:/New%20folder/DOWNLOADS/jvto-web/WORKSPACE_HANDOFF.md)

Connection format:

```text
postgresql://USER:PASSWORD@31.97.223.43:5432/DBNAME?schema=public
```

If you already have the actual `DATABASE_URL`, use that exact value. Do not invent a new connection string.

## Recommended Access Methods

### 1. DBeaver or TablePlus

Best for:
- schema browsing
- relation mapping
- row counts
- sample payload checks
- manual content inspection

Use this when:
- you want to understand DB capability quickly
- you want visual inspection without writing code

### 2. psql

Best for:
- fast verification
- read-only schema inspection
- counts and sample rows

Example:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@31.97.223.43:5432/DBNAME?schema=public"
psql $env:DATABASE_URL
```

### 3. Prisma Studio

Best for:
- browsing content-oriented tables
- checking JSON fields
- inspecting singleton tables

Example:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@31.97.223.43:5432/DBNAME?schema=public"
npx prisma studio
```

Useful tables for Prisma Studio:
- `content_pages`
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`
- `blogs`
- `web_metadata`
- `assets`

## Most Stable Technical Suggestion

Direct access to `31.97.223.43:5432` has been historically intermittent from local machines.

The safer method is SSH tunneling if SSH access is available.

Example:

```powershell
ssh -L 5433:127.0.0.1:5432 root@31.97.223.43
```

Then connect locally through the tunnel:

```text
postgresql://USER:PASSWORD@127.0.0.1:5433/DBNAME?schema=public
```

Why this is better:
- avoids direct raw remote port access from local tools
- usually more stable
- easier to reuse across DBeaver, psql, Prisma Studio

## Read-Only First Rule

For schema mapping and AI-assisted planning:
- start read-only
- do not mutate tables first
- inspect shape before proposing extensions

What to verify first:
- tables exist
- approximate row counts
- sample row shape
- key foreign-key relationships
- JSON payload structure for content/singleton tables

## First Read-Only Queries

### 1. Confirm key tables exist

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'content_pages',
    'category_faqs',
    'faqs',
    'blogs',
    'blog_categories',
    'web_metadata',
    'assets',
    'folders',
    'bookings',
    'booking_payment_histories',
    'booking_whatsapp_logs',
    'booking_itineraries',
    'booking_logistics',
    'booking_hotels',
    'booking_crew_members',
    'reviews',
    'site_identity',
    'organization_profile'
  )
order by table_name;
```

### 2. Row counts for core domains

```sql
select 'content_pages' as table_name, count(*) from content_pages
union all
select 'category_faqs', count(*) from category_faqs
union all
select 'faqs', count(*) from faqs
union all
select 'blogs', count(*) from blogs
union all
select 'assets', count(*) from assets
union all
select 'bookings', count(*) from bookings
union all
select 'reviews', count(*) from reviews
union all
select 'site_identity', count(*) from site_identity
union all
select 'organization_profile', count(*) from organization_profile;
```

### 3. Sample content-page payload

```sql
select route, lang, is_active, seo, content
from content_pages
order by updated_at desc
limit 5;
```

### 4. Sample FAQ payload

```sql
select f.id, c.slug as category_slug, f.question, f.is_published, f.sort_order
from faqs f
left join category_faqs c on c.id = f.category_id
order by c.slug, f.sort_order, f.id
limit 20;
```

### 5. Sample identity/profile payload

```sql
select *
from site_identity
limit 3;

select *
from organization_profile
limit 3;
```

### 6. Booking / CRM / portal sample shape

```sql
select id, booking_code, customer_id, package_id, booking_status, trip_status, payment_status, start_date, end_date
from bookings
order by id desc
limit 20;
```

### 7. Review / trust sample shape

```sql
select id, customer_name, platform, star, package_id, booking_id, date
from reviews
order by id desc
limit 20;
```

## Domain-Oriented Audit Order

Use this order. It reduces drift.

1. Content / CMS
- `content_pages`
- `blogs`
- `blog_categories`
- `web_metadata`
- `assets`
- `folders`

2. Trust / support
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`
- `reviews`

3. Commercial package system
- `packages`
- `package_prices`
- `price_tiers`
- `destinations`

4. CRM / customer / payment
- `User`
- `bookings`
- `booking_payment_histories`
- `booking_whatsapp_logs`
- `feedback`

5. Post-booking trip ops
- `booking_itineraries`
- `booking_logistics`
- `booking_hotels`
- `booking_hotel_rooms`
- `booking_hotel_meals`
- `booking_crew_members`
- `booking_vehicle_units`

## Best AI Context To Give

If an AI chat needs to analyze DB mirror, the minimum useful context is:

- active repo is `jvto-web`
- DB is PostgreSQL
- connection is via `DATABASE_URL`
- host reference is `31.97.223.43:5432`
- final architecture is `one frontend codebase + DB mirror`
- task is schema mapping / future capability assessment
- scope includes:
  - CMS
  - lightweight CRM
  - post-booking customer portal
  - ads / marketing support

Do not start with:
- homepage redesign
- frontend polish
- old repo comparison

Start with:
- [schema.prisma](/f:/New%20folder/DOWNLOADS/jvto-web/prisma/schema.prisma)
- table domains
- read-only DB inspection

## Practical Recommendation

If you want a reliable workflow:

1. Open SSH tunnel.
2. Use DBeaver for mapping and relation inspection.
3. Use `psql` for exact read-only checks.
4. Use Prisma Studio for singleton/content table browsing.
5. Only after structure is clear, ask AI to propose schema extensions.

That sequence is the least wasteful.
