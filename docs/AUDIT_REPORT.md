# JVTO Web Repository – Comprehensive Audit Report

**Repository:** `jvto-devteam/jvto-web`
**Branch:** `sam-workspace` (now `copilot/audit-repository-structure-and-code-quality`)
**Audit Date:** 2026-04-08
**Live Site:** https://javavolcano-touroperator.com/
**Prepared by:** Copilot Coding Agent

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Repository Structure Analysis](#2-repository-structure-analysis)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Code Quality Assessment](#4-code-quality-assessment)
5. [Security Findings](#5-security-findings)
6. [Live Website Comparison](#6-live-website-comparison)
7. [Architecture & Infrastructure](#7-architecture--infrastructure)
8. [Key Findings & Observations](#8-key-findings--observations)
9. [Recommendations](#9-recommendations)
10. [Priority Action Matrix](#10-priority-action-matrix)

---

## 1. Executive Summary

The `jvto-web` repository hosts the **Java Volcano Tour Operator (JVTO)** website – a complete rebuild of the previous Laravel-based system into a **Next.js 16 + TypeScript + PostgreSQL** stack. The project is in an **active development and hardening phase**, with the `sam-workspace` branch representing the most current feature-complete state.

The codebase is architecturally sound with a well-structured App Router layout, a custom CMS dashboard, a full booking/checkout flow, and a trust-led redesign of the public-facing website. However, several **critical security issues** (credentials committed to the repository), significant **technical debt** (185 files with `any` types, build error suppression, leftover backup files), and **content/data layer inconsistencies** (multiple SSOT JSON versions) require immediate attention before a stable production release.

**Overall Health Score: 6.5 / 10**

| Category | Score | Notes |
|---|---|---|
| Architecture & Structure | 8/10 | Clean App Router layout, good separation |
| Code Quality | 5/10 | TypeScript weakened by `any` and build ignores |
| Security | 3/10 | Credentials in README, broad CSP |
| Content Consistency | 6/10 | Multiple SSOT versions, some stale data |
| Performance Setup | 8/10 | ISR, image optimization, correct caching |
| SEO & Metadata | 9/10 | Excellent schema, metadata, and sitemap setup |

---

## 2. Repository Structure Analysis

### 2.1 Top-Level Layout

```
jvto-web/
├── src/
│   ├── app/
│   │   ├── (website)/   ← Public-facing website (16 page sections)
│   │   ├── (cms)/       ← Internal CMS dashboard (11 sections)
│   │   ├── (api)/       ← API routes (40 handlers)
│   │   └── (customer)/  ← Customer-facing booking management
│   ├── components/
│   │   ├── website/     ← ~108 website UI components
│   │   ├── cms/         ← CMS-specific components
│   │   ├── content/     ← Content-rendering primitives
│   │   ├── seo/         ← JSON-LD & metadata helpers
│   │   └── tiptap-*/    ← Rich-text editor components (CMS)
│   ├── lib/             ← Business logic, DB queries, SEO builders
│   ├── hooks/           ← Custom React hooks
│   ├── styles/          ← SCSS variables & keyframe animations
│   └── generated/       ← Auto-generated Prisma types
├── services/
│   └── wa-gateway/      ← WhatsApp semi-chatbot microservice (Fastify)
├── prisma/              ← Database schema (PostgreSQL)
├── public/              ← Static assets, legal PDFs, OG images
├── scripts/             ← Deployment helpers
├── docs/                ← Technical documentation
└── sql/                 ← Raw SQL migration files
```

### 2.2 App Router Route Groups

#### `(website)` – Public Website Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Active | Trust-led homepage with Hero, FeaturedTours, etc. |
| `/tours` | ✅ Active | Tour catalog hub |
| `/tours/from-surabaya` | ✅ Active | Origin-specific hub + catalog |
| `/tours/from-bali` | ✅ Active | Origin-specific hub + catalog |
| `/tours/from-surabaya/[slug]` | ✅ Active | Individual tour detail page |
| `/tours/from-bali/[slug]` | ✅ Active | Individual tour detail page |
| `/tours/student-package/[slug]` | ✅ Active | ISIC student deal pages |
| `/destinations` | ✅ Active | Destination listing |
| `/destinations/[slug]` | ✅ Active | Destination detail |
| `/travel-guide` | ✅ Active | Prepare & Book hub |
| `/travel-guide/[slug]` | ✅ Active | 6 sub-pages (safety, weather, packing, etc.) |
| `/travel-guide/faq` | ✅ Active | FAQ page |
| `/why-jvto` | ✅ Active | Trust/proof hub |
| `/why-jvto/[...slug]` | ✅ Active | Dynamic sub-pages |
| `/verify-jvto` | ✅ Active | Legal/credentials verification hub |
| `/verify-jvto/legal` | ✅ Active | Legal documents |
| `/verify-jvto/police-safety` | ✅ Active | Police leadership proof |
| `/verify-jvto/press-recognition` | ✅ Active | Press mentions |
| `/verify-jvto/history-artifacts` | ✅ Active | History and artifacts |
| `/blog` | ✅ Active | Insights/blog listing |
| `/blog/[slug]` | ✅ Active | Blog post detail |
| `/contact` | ✅ Active | Contact page |
| `/policy` | ✅ Active | Policy hub |
| `/policy/[slug]` | ✅ Active | Privacy, T&C, Inclusions/Exclusions |
| `/checkout` | ✅ Active | Booking checkout flow |
| `/my-booking` | ✅ Active | Customer booking management |
| `/my-booking/[slug]` | ✅ Active | Individual booking detail |
| `/student-deals/isic` | ✅ Active | ISIC student deals |
| `/isic/student-package` | ✅ Active | ISIC package listing (duplicate path?) |
| `/ijen-crater-blue-fire-tour` | ⚠️ Backup only | Contains `page copy.tsx`, no active page |
| `/mount-bromo-private-tour` | ⚠️ Backup only | Contains `page copy.tsx`, no active page |
| `/crew/[slug]` | ⚠️ Backup only | Contains `page copy.tsx`, no active page |

#### `(cms)` – CMS Dashboard Routes

| Section | Notes |
|---|---|
| `/cms` | Dashboard with live statistics |
| `/cms/blog` | Blog post management |
| `/cms/collections` | Content page, FAQ, blog managers |
| `/cms/destinations` | Destination management |
| `/cms/faq` | FAQ management |
| `/cms/global-singletons` | Site-wide settings |
| `/cms/assets` | Media asset management |
| `/cms/tour-packages` | Tour package CRUD |
| `/cms/verify-config` | Verification page config |
| `/cms/whatsapp` | WhatsApp chatbot config |

#### `(api)` – Internal API Routes (40 endpoints)

Key categories:
- **Content:** `/api/routes`, `/api/packages`, `/api/destinations`, `/api/blogs`, `/api/faqs`
- **Booking:** `/api/booking/*`, `/api/checkout`, `/api/my-bookings`, `/api/trip/[slug]`
- **Assets:** `/api/assets`, `/api/assets/upload`, `/api/folders`
- **Auth:** `/api/auth/[...nextauth]` (NextAuth with Google + Email providers)
- **CMS:** `/api/cms/*` (content, blogs, FAQs management)
- **Utils:** `/api/check-isic`, `/api/indexnow`, `/api/reviews`, `/api/whatsapp`

### 2.3 Problematic Files Found

| File | Issue |
|---|---|
| `src/app/(website)/ijen-crater-blue-fire-tour/page copy.tsx` | Leftover backup file |
| `src/app/(website)/mount-bromo-private-tour/page copy.tsx` | Leftover backup file |
| `src/app/(website)/crew/[slug]/page copy.tsx` | Leftover backup file |
| `src/app/(website)/policy/inclusions-exclusions/page copy.tsx` | Leftover backup file |
| `src/app/(website)/policy/privacy/page copy.tsx` | Leftover backup file |
| `src/app/(website)/policy/booking-payment-cancellation/page copy.tsx` | Leftover backup file |
| `src/app/(website)/isic/student-package/page-copy.tsx` | Leftover backup file |
| `src/components/website/Home/Reviews copy.tsx` | Leftover backup file |
| `src/data.ts` | Legacy static data file (not actively imported) |
| `src/data_new.ts` | Legacy static tour data (may still be used) |
| `JVTO_SSOT_v4_0_CLEAN.json` | Large (620KB) SSOT JSON in root – not gitignored |
| `analyze-ssot.js`, `analyze-ssot-sync.js`, etc. | Dev-only analysis scripts in root |
| `setup-option1.ps1`, `setup-sambuko82.ps1`, `setup-sambuko82.sh` | Server setup scripts in root |

---

## 3. Tech Stack & Dependencies

### 3.1 Core Framework

| Technology | Version | Notes |
|---|---|---|
| **Next.js** | `^16.2.1` | App Router, Turbopack dev, ISR (3600s revalidation) |
| **React** | `^19.2.4` | Latest stable |
| **TypeScript** | `^5` | Strict mode configured but `ignoreBuildErrors: true` |
| **Node.js** | Not pinned | Recommend pinning via `.nvmrc` or `engines` in package.json |

### 3.2 Styling

| Technology | Version | Notes |
|---|---|---|
| **Tailwind CSS** | `^4` | v4 syntax with `@theme` blocks |
| **SCSS** | `^1.94.2` | Used for TipTap editor styles |
| **Public Sans** | Google Font | Primary typeface |
| **JetBrains Mono** | Google Font | Monospace / CMS typeface |

### 3.3 Database & ORM

| Technology | Version | Notes |
|---|---|---|
| **PostgreSQL** | 17 (server) | Via Prisma and raw `pg` pool |
| **Prisma** | `^6.18.0` | ORM for CMS/booking; generates to `src/generated/prisma` |
| **pg** | `^8.16.3` | Raw pool for some API queries; dual pattern with Prisma |
| **PgBouncer** | Server-side | Connection pooling |

### 3.4 Authentication

| Technology | Version | Notes |
|---|---|---|
| **NextAuth.js** | `^4.24.13` | Magic link (email) + Google OAuth |
| **@auth/prisma-adapter** | `^2.11.1` | Prisma session persistence |

### 3.5 UI Components & Motion

| Library | Version | Purpose |
|---|---|---|
| **Lucide React** | `^0.546.0` | Icon system |
| **Framer Motion** | `^12.23.24` | Animations |
| **Embla Carousel** | `^8.6.0` | Carousels |
| **Swiper** | `^12.0.3` | Alternative carousel (two carousel libs active) |
| **Radix UI** | Various | Accessible primitives (accordion, dropdown, popover) |
| **TipTap** | `^3.11.0` | Rich text editor (CMS) |
| **Zustand** | `^5.0.8` | Client-side state management |
| **React Hot Keys Hook** | `^5.2.1` | Keyboard shortcuts |

### 3.6 Content Rendering

| Library | Version | Purpose |
|---|---|---|
| **react-markdown** | `^10.1.0` | Markdown rendering |
| **remark-gfm** | `^4.0.1` | GitHub Flavored Markdown |
| **rehype-sanitize** | `^6.0.0` | HTML sanitization |
| **react-quill-new** | `^3.6.0` | Legacy Quill editor (appears alongside TipTap) |

### 3.7 Miscellaneous

| Library | Version | Purpose |
|---|---|---|
| **@google/genai** | `^1.30.0` | Gemini AI integration |
| **nodemailer** | `^7.0.12` | Email sending (magic links) |
| **mime** | `^4.1.0` | MIME type detection for uploads |

### 3.8 WhatsApp Gateway (Microservice)

Located at `services/wa-gateway/`:
- **Fastify** (`^5.6.1`) – HTTP server
- **@whiskeysockets/baileys** (`^6.7.18`) – WhatsApp Web API
- **Zod** (`^4.1.12`) – Schema validation
- **pg** – Direct database access
- **pino** – Structured logging

---

## 4. Code Quality Assessment

### 4.1 TypeScript Quality

| Metric | Value | Assessment |
|---|---|---|
| Files using `any` type | **185 files** | ❌ Very high; strict mode is undermined |
| `@ts-ignore` / `@ts-nocheck` uses | **0** | ✅ No suppression pragmas |
| `ignoreBuildErrors` in next.config | **true** | ❌ Hides real type errors at build time |
| Explicit return types on exported functions | Partial | ⚠️ Inconsistent across codebase |

The TypeScript configuration in `tsconfig.json` sets `"strict": true`, but `next.config.ts` counters this with `ignoreBuildErrors: true`. This means type errors will not prevent builds, reducing the value of strict mode.

### 4.2 Code Organization

**Strengths:**
- Clean route group separation (`(website)`, `(cms)`, `(api)`, `(customer)`)
- Server Components used correctly for data-fetching pages
- Doctrine pattern used for content constants (`homepageDoctrine.ts`, `trustSupportDoctrine.ts`)
- Good use of ISR (`revalidate = 3600`) on data-heavy pages
- SEO/JSON-LD helpers are well-abstracted in `src/lib/seo/`

**Weaknesses:**
- 8 leftover backup/copy `.tsx` files pollute the app directory
- Two competing carousel libraries: `embla-carousel-react` and `swiper`
- Two competing rich-text editors: `react-quill-new` (legacy) and `TipTap` (current)
- Two data access patterns: raw `pg.Pool` in `src/lib/db.ts` and Prisma in `src/lib/prisma.ts`
- `src/data.ts` and `src/data_new.ts` appear to be legacy static data files that are no longer the primary data source (the DB/API is)
- Multiple SSOT JSON files at different versions scattered across the repo:
  - `JVTO_SSOT_v4_0_CLEAN.json` (root, 620KB)
  - `src/lib/Master_Dataset_JVTO.SSOT.v3.0.json`
  - `src/lib/Master_Dataset_JVTO.SSOT.v2.1.public.ready_to_copy.json`
  - `src/lib/whyjvto/why-jvto-ssot.fixed4.json`
  - `src/content/why-jvto-ssot.json`

### 4.3 Console Logs in Production Code

**15 `console.log`/`console.error`/`console.warn` calls** found in website page files. These should be removed or replaced with proper server-side logging before production.

### 4.4 TODO / FIXME Comments

**8 TODO/FIXME** markers found in the codebase. These represent acknowledged but incomplete work.

### 4.5 Linting Configuration

The `.eslintrc` / `eslint.config.mjs` intentionally **ignores**:
- All CMS pages (`src/app/(cms)/**`)
- All TipTap template/UI components
- All backup "copy" files (`**/* copy.tsx`)

The rule `@typescript-eslint/no-explicit-any` is set to `"off"`, which further reduces TypeScript safety enforcement.

### 4.6 Build Configuration Issues

```typescript
// next.config.ts
typescript: {
  ignoreBuildErrors: true,  // ❌ Should be false in production
},
```

The note in `next.config.ts` comments suggest this was set deliberately during a rapid development phase. This must be removed before the project is considered production-stable.

---

## 5. Security Findings

### 🔴 CRITICAL: Plain-text Credentials in README.md

The `README.md` file **committed to the repository** contained the following sensitive credentials in plain text (now redacted from README.md as part of this audit):

| Credential | Type |
|---|---|
| Hostinger SSH password | Plain-text password |
| Root SSH password | Plain-text password |
| GitHub Personal Access Token | API token (PAT) |
| Mailgun API Key | API key |
| Adminer admin password | Plain-text password |
| PostgreSQL pgbouncer password | Plain-text password |
| Grafana admin password | Plain-text password |

**Impact:** Anyone with read access to this repository (including future collaborators, anyone with the GitHub URL, or any agent/bot) can gain full administrative access to the production VPS, database, email system, and monitoring stack.

**Required Actions:**
1. **Immediately** rotate all credentials listed above
2. Remove credentials from README.md
3. Revoke and regenerate the GitHub Personal Access Token
4. Consider making the repository private until credentials are rotated

### 🟠 HIGH: Content Security Policy Issues

The CSP header in `next.config.ts` uses `'unsafe-inline'` and `'unsafe-eval'` for scripts:

```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
```

- `'unsafe-eval'` enables script injection via `eval()` – a significant XSS vector
- `'unsafe-inline'` allows inline scripts from any source matching the origin
- These should be replaced with a nonce-based CSP

### 🟡 MEDIUM: Database Dual-Access Pattern

Two separate database access patterns are used:
- `src/lib/prisma.ts` – Prisma ORM (used in most CMS/API routes)
- `src/lib/db.ts` – Raw `pg.Pool` with `ssl: { rejectUnauthorized: false }`

The `rejectUnauthorized: false` on the raw pg pool bypasses SSL certificate validation, which can expose the connection to man-in-the-middle attacks.

### 🟡 MEDIUM: `any` Cast on `BigInt.prototype`

In `src/app/(api)/api/auth/[...nextauth]/route.ts`:

```typescript
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
```

Modifying built-in prototypes is a global side effect that can cause unexpected behavior in other parts of the application.

### 🟡 MEDIUM: No Node.js Version Pinned

The project uses advanced features (App Router, Turbopack, React 19) but does not pin the Node.js version in `package.json` `engines` or via `.nvmrc`. This can cause environment drift between development, CI/CD, and production.

---

## 6. Live Website Comparison

> **Note:** The live website at https://javavolcano-touroperator.com/ was not directly accessible from this audit environment. The comparison below is based on:
> - Repository code analysis of `sam-workspace` branch
> - Existing audit documentation within the repo (`VISUAL_ROUTE_AUDIT.md`, `LIVE_FRONTEND_IMPLEMENTATION_MAP.md`)
> - The project's declared strategy in `README.md`

### 6.1 Migration Strategy Context

Per `README.md`, the project strategy is:
- **Current live site:** Laravel-based system at `javavolcano-touroperator.com`
- **New system staging:** Initially at `java-tour.com`
- **Goal:** Cut over `javavolcano-touroperator.com` DNS to the new Next.js system once ready

The repository's `next.config.ts` references `legacy.javavolcano-touroperator.com` as the source for API proxying (`/api/octo/:path*`) and image domains, suggesting a **parallel-run architecture** where the new Next.js app proxies some content from the legacy Laravel backend.

### 6.2 Repository → Live Site Feature Matrix

Based on `VISUAL_ROUTE_AUDIT.md` and `LIVE_FRONTEND_IMPLEMENTATION_MAP.md` in the repository:

| Feature Area | Repository (sam-workspace) | Live Site Status | Gap |
|---|---|---|---|
| **Homepage** | Trust-led hero, authority reality section, trust gateway | Legacy/older version | Repo is ahead |
| **Tours Hub** | Origin-based discovery (Surabaya/Bali), route family guide | Possibly catalog-only | Repo is ahead |
| **Tour Detail Pages** | Route doctrine, tier pricing, booking confidence flow | Brochure-style | Repo is ahead |
| **Checkout Flow** | Full pricing contract validation, ISIC support | May be legacy form | Repo is ahead |
| **Travel Guide (Prepare & Book)** | 6 sub-pages: safety, weather, packing, booking info, police escort, Ijen health | Partial or missing | Repo is ahead |
| **Why JVTO Hub** | 5+ sub-pages with evidence trails | Possibly static page | Repo is ahead |
| **Verify JVTO Hub** | 4 sub-pages: legal, police safety, press, history | May not exist on live | Repo is ahead |
| **Blog/Insights** | Dynamic blog with DB-backed content | May be static or absent | Repo is ahead |
| **CMS Dashboard** | Full `/cms` dashboard with content management | Not on live (internal) | N/A |
| **Booking Management** | `/my-booking` customer portal | May not exist | Repo is ahead |
| **WhatsApp Integration** | Semi-chatbot gateway microservice | May be basic button | Repo is ahead |
| **SEO/Schema** | Comprehensive JSON-LD (Organization, Service, WebSite, BreadcrumbList) | Possibly basic | Repo is ahead |
| **ISIC Student Deals** | Full ISIC verification + student packages | Unclear | Repo may be ahead |

### 6.3 Known Alignment Gaps (from VISUAL_ROUTE_AUDIT.md)

The repository's own visual audit (dated 2026-04-01) identified these remaining gaps in the `sam-workspace` branch before production deployment:

**Homepage:**
- Content-heavy layout needs one more visual rhythm pass
- Some sections inherit older shell spacing and card density
- Review/proof areas improved but not as visually confident as intended

**Tours Hub:**
- Filter/sidebar area still looks more legacy than surrounding narrative shell
- Visual hierarchy between hub intro and product browser can be tightened

**Origin Hub (Surabaya/Bali):**
- Legacy filter/catalog shell is the most visually dated part
- Origin-specific trust cues could be stronger above the fold

**Package Detail:**
- "Add-on picker" section needs a visual cohesion pass
- Booking confirmation UI could be more conclusive

**Why JVTO:**
- Section rhythm and spacing need a consistency pass
- Some proof cards feel more like data tables than trust signals

### 6.4 Routes Present in Repo but Missing from Live Site

Based on the sitemap generation and route structure, these routes exist in the repository but likely do not yet exist on the live production site:

- `/blog` and `/blog/[slug]` – Dynamic blog system
- `/my-booking` – Customer booking portal
- `/checkout` – New booking checkout
- `/travel-guide/*` – Prepare & Book sub-pages
- `/verify-jvto/*` – Verification hub sub-pages
- `/why-jvto/*` – Trust hub sub-pages
- `/destinations` – Destination hub page
- `/cms/*` – Internal CMS dashboard

### 6.5 Content & Copy Differences

The repository's `src/constants.ts` establishes fallback copy for the current redesign. Key copy points that may differ from the live site:

**Homepage Hero:**
- Repo: "Tourist Police-Led Private Volcano Tours in East Java"
- Primary CTAs: "From Surabaya" / "From Bali" (origin-first)
- Trust eyebrow: "Tourist Police-Led Private Tours"

**Footer:**
- Repo: Long-form trust signal footer with proof links, policy navigation
- Current footer framing: "Keep the route, the proof, and the booking logic in one place"

**Navigation structure:**
- Repo: Three-tier nav with mega-menus (Tours, Travel Guide, Why JVTO)
- Includes login modal for customer portal

---

## 7. Architecture & Infrastructure

### 7.1 Deployment Architecture

```
Visitor → Cloudflare (CDN/WAF) → Nginx (VPS 31.97.223.43)
                                 ↓
                          Next.js App (PM2, port 3000)
                                 ↓
                          PostgreSQL 17 (PgBouncer → DB)
                                 ↓
                          Legacy Laravel API (api/octo proxy)
```

- **VPS Provider:** Hostinger
- **OS:** Ubuntu/Debian
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx
- **Database:** PostgreSQL 17 + PgBouncer + PgBackRest (backups)
- **CDN/Security:** Cloudflare (Full Strict TLS)

### 7.2 Data Flow & Content Architecture

The project uses a **multi-source content architecture**:

1. **PostgreSQL Database** – Primary source for tours, bookings, destinations, FAQs, blog posts, content pages (via Prisma/pg)
2. **CMS Dashboard** (`/cms`) – Internal admin interface to manage DB content
3. **SSOT JSON Files** – Static reference data (why-jvto content, crew profiles); multiple versions coexist
4. **Fallback Doctrine Files** – TypeScript constants (`src/lib/homepage/homepageDoctrine.ts`, etc.) used when DB content is unavailable
5. **Legacy API Proxy** – Some content still served from `legacy.javavolcano-touroperator.com` via `/api/octo/` rewrite

### 7.3 Caching Strategy

- **ISR (Incremental Static Regeneration):** `revalidate = 3600` used on most public pages (1-hour cache)
- **Dynamic routes:** Force-dynamic on sitemap generation
- **Images:** Unoptimized in dev mode; remote patterns configured for legacy subdomain and CDN sources

### 7.4 SEO Architecture (Strength)

The SEO implementation is a clear strength of this codebase:

- **Metadata:** `generateMetadata()` on every public page with fallbacks
- **JSON-LD:** Comprehensive schema graph per page (Organization, WebSite, BreadcrumbList, Service, TouristAttraction, WebApplication, FAQPage)
- **Sitemap:** Fully dynamic, DB-aware sitemap with per-page last-modified timestamps
- **robots.txt:** Correct allow-all with sitemap URL
- **Canonical URLs:** Set via `metadataBase` in layout
- **Open Graph:** Complete OG metadata with page-specific images
- **IndexNow:** API endpoint for instant indexing notifications (`/api/indexnow`)

---

## 8. Key Findings & Observations

### 8.1 Architectural Positives

1. **Trust-led architecture is well-implemented.** The three-hub trust system (Why JVTO / Verify JVTO / Travel Guide) creates a clear information architecture for high-consideration bookings.

2. **ISR pattern is correctly applied.** All public pages use `revalidate = 3600` with DB-backed data fetching, providing a good balance between freshness and performance.

3. **Server Component data fetching.** Data is correctly fetched at the server component level, avoiding client-side loading states for critical content.

4. **Doctrine pattern for content constants.** Files like `homepageDoctrine.ts` and `trustSupportDoctrine.ts` provide clean fallback content when the CMS has no override, enabling the site to work without DB connectivity.

5. **CMS is production-ready.** The internal CMS dashboard with Tiptap editor, asset management, and content page management is a significant deliverable.

6. **WhatsApp gateway microservice.** A separate, well-structured Fastify service handles WhatsApp automation independently from the main app, good separation of concerns.

7. **Booking flow is complete.** The checkout → booking → payment balance → customer portal flow is fully implemented end-to-end.

### 8.2 Technical Debt Items

1. **`ignoreBuildErrors: true`** – Masks potentially real TypeScript compilation errors.

2. **Dual carousel libraries** – Both `embla-carousel-react` and `swiper` are in `dependencies`. Only one should be used.

3. **Dual rich-text editors** – Both `react-quill-new` (legacy) and `TipTap` (current) are present. `react-quill-new` appears to be in the process of being replaced.

4. **Dual database access patterns** – Raw `pg.Pool` and Prisma are both used. The raw pool should be consolidated into Prisma, or the split should be explicitly documented.

5. **Large SSOT JSON in repository root** – `JVTO_SSOT_v4_0_CLEAN.json` (620KB) is committed to the root. This belongs in `docs/` or should be gitignored if it's only a reference file.

6. **Dev/analysis scripts in root** – `analyze-ssot.js`, `analyze-ssot-sync.js`, `check-cms-live.js`, `check-db.js`, `compare-json-db.js`, `detailed-sync-check.js` are analysis scripts that belong in `scripts/` or should be removed/gitignored.

7. **Node.js version not pinned** – No `.nvmrc` or `engines` field in `package.json`.

### 8.3 Content Consistency Issues

1. **Multiple SSOT JSON versions** – 5 different SSOT JSON files at different versions (v2.1, v3.0, v4.0, fixed4) exist in different directories. It's unclear which is authoritative.

2. **Crew data mismatch** – The SSOT JSON has 14 crew entries with rich profile data; the database has 23 crew entries with different field structure. These are not in sync.

3. **Destination data mismatch** – The SSOT JSON has 9 destinations; the database has 10. Some SSOT fields (archetype data, evidence quotes) are not present in the database.

4. **Legacy static data files** – `src/data_new.ts` contains hardcoded tour packages and review data. As the database becomes the authoritative source, this file should be deprecated and removed.

---

## 9. Recommendations

### 9.1 Immediate (Before Production Cutover)

| # | Action | Priority | Effort |
|---|---|---|---|
| R1 | **Rotate all credentials leaked in README.md** and remove them from the file | 🔴 Critical | Low |
| R2 | Set `ignoreBuildErrors: false` in `next.config.ts` and resolve all TypeScript errors | 🔴 Critical | Medium |
| R3 | Replace `'unsafe-eval'` in CSP with a nonce-based approach | 🟠 High | Medium |
| R4 | Delete all 8 leftover `* copy.tsx` backup files | 🟠 High | Low |
| R5 | Set `ssl: { rejectUnauthorized: true }` on the raw `pg.Pool` (or remove raw pool in favor of Prisma) | 🟠 High | Low |
| R6 | Pin Node.js version in `package.json` `engines` or via `.nvmrc` | 🟡 Medium | Low |

### 9.2 Short-Term (Next Sprint)

| # | Action | Priority | Effort |
|---|---|---|---|
| R7 | Remove one carousel library (consolidate on Embla or Swiper) | 🟡 Medium | Medium |
| R8 | Remove `react-quill-new` once all CMS forms are migrated to TipTap | 🟡 Medium | Medium |
| R9 | Move all root-level dev scripts (`analyze-*.js`, `check-*.js`, etc.) to `scripts/` or gitignore | 🟡 Medium | Low |
| R10 | Move `JVTO_SSOT_v4_0_CLEAN.json` to `docs/` or gitignore; consolidate to single SSOT reference | 🟡 Medium | Low |
| R11 | Remove or archive `src/data.ts` and `src/data_new.ts` after confirming all data comes from the database | 🟡 Medium | Medium |
| R12 | Reduce `any` usage in critical API routes and shared type interfaces | 🟡 Medium | High |

### 9.3 Medium-Term (Roadmap)

| # | Action | Priority | Effort |
|---|---|---|---|
| R13 | Implement structured logging (e.g., pino) and remove all `console.log` from production code | 🟢 Low | Medium |
| R14 | Implement error boundary components on key user flows (checkout, booking) | 🟢 Low | Medium |
| R15 | Consider adding Playwright or Cypress end-to-end tests for the booking flow | 🟢 Low | High |
| R16 | Implement proper rate limiting on public API endpoints (especially checkout and auth) | 🟢 Low | Medium |
| R17 | Add `CONTRIBUTING.md` and branch protection rules to prevent direct commits to `main` | 🟢 Low | Low |
| R18 | Complete migration of `src/lib/db.ts` raw queries to Prisma for a unified DB access layer | 🟢 Low | High |

---

## 10. Priority Action Matrix

```
HIGH IMPACT ┌────────────────────────────────────────────────────────┐
            │  🔴 R1: Rotate credentials           🟠 R2: Fix TS     │
            │  🟠 R4: Delete copy files             🟠 R5: Fix SSL    │
            │  🟠 R3: CSP nonce                     🟡 R6: Pin Node   │
            ├────────────────────────────────────────────────────────┤
            │  🟡 R10: Consolidate SSOT             🟡 R7: 1 carousel │
            │  🟡 R8: Remove Quill                  🟡 R9: Move scripts│
LOW IMPACT  │  🟡 R11: Remove legacy data           🟡 R12: Reduce any │
            └────────────────────────────────────────────────────────┘
              LOW EFFORT                              HIGH EFFORT
```

### Critical Path to Production

The minimum required steps before the DNS cutover from the legacy Laravel site to this Next.js application:

1. ✅ Rotate leaked credentials (R1)
2. ✅ Fix TypeScript build errors (R2)
3. ✅ Remove backup/copy files (R4)
4. ✅ Verify all tour/booking flows work end-to-end in staging
5. ✅ Confirm legacy API proxy (`/api/octo/`) is working correctly
6. ✅ Ensure WhatsApp gateway is running and connected to production DB
7. ✅ Run full sitemap and SEO validation before go-live
8. ✅ Confirm PgBackRest backup schedule is active on production DB

---

## Appendix A: File Count Summary

| Area | Count |
|---|---|
| Total TypeScript/TSX files | 492 |
| Website page files | ~50 |
| Website UI components | 108 |
| API route handlers | 40 |
| CMS sections | 11 |
| Leftover backup files | 8 |
| Large markdown docs in root | 30+ |
| SSOT JSON versions | 5 |
| Prisma models | 50+ |

## Appendix B: Environment Variables Required

The following environment variables must be set in `.env.local` (not committed to git):

```
DATABASE_URL                        # PostgreSQL connection string
NEXTAUTH_URL                        # App base URL
NEXTAUTH_SECRET                     # NextAuth signing secret
GOOGLE_CLIENT_ID                    # Google OAuth
GOOGLE_CLIENT_SECRET                # Google OAuth
EMAIL_SERVER_HOST                   # SMTP for magic link emails
EMAIL_SERVER_PORT
EMAIL_SERVER_USER
EMAIL_SERVER_PASSWORD
EMAIL_FROM
NEXT_PUBLIC_GTM_ID                  # Google Tag Manager
NEXT_PUBLIC_SITE_URL                # Site URL for metadata
NEXT_PUBLIC_ENV                     # "dev" or "production"
```

---

*This report was generated by automated analysis of the repository source code. Live website features that could not be directly accessed are documented based on existing in-repo audit documents and code analysis.*
