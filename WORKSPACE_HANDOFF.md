# Workspace Handoff

## Active Project

- Active repo: `jvto-web`
- Branch: `sam-workspace`
- Base commit before current local edits: `2379de7604d56f81969f3b60061a34a48109a81f`
- Final target model: `one frontend codebase + DB mirror`

## What This Workspace Is For

- This repo is the active frontend candidate that should replace the current JVTO production frontend.
- The intended runtime data source is `DB mirror`, not the old live database.
- Local strategy work has been extracted into frontend logic/fallbacks or already written into `DB mirror`.

## What Has Already Been Implemented

- Homepage reworked into trust-led route entry.
- Tours hubs reworked into origin/family discovery.
- Package detail doctrine added.
- Pax-tier pricing added.
- Checkout pricing write-through validation added.
- Trust cluster split into `why-jvto`, `verify-jvto`, and `travel-guide`.
- `why-jvto` dynamic subroutes expanded to support multi-segment trust pages.
- Static/fallback support added for FAQ and `why-jvto` SSOT content.

## Source Of Truth Model

- Frontend logic/UI/metadata/schema lives in this repo.
- DB-owned content for trust/support SEO, `why-jvto` SSOT pages, FAQ categories/questions, `site_identity`, and `organization_profile` was synced to `DB mirror` on `2026-04-06`.

## Key Files To Read First

- `src/lib/homepage/homepageDoctrine.ts`
- `src/lib/trust/trustSupportDoctrine.ts`
- `src/lib/packages/packageDoctrine.ts`
- `src/lib/packages/priceTiers.ts`
- `src/lib/packages/checkoutPricingContract.ts`
- `src/lib/content/pinnedContentOverrides.ts`
- `src/lib/content/whyJvtoSsotFallback.ts`
- `src/app/(website)/page.tsx`
- `src/app/(website)/why-jvto/[...slug]/page.tsx`
- `src/app/(website)/travel-guide/faq/page.tsx`

## Current Technical Reality

- Local build works.
- Direct local access to `DB mirror` at `31.97.223.43:5432` has been historically intermittent, but a successful write sync was executed on `2026-04-06`.
- Because of that, several routes still use controlled fallback content during local build.
- The correct next direction is:
  - keep `jvto-web` as the only active frontend repo
  - verify runtime against mirror after frontend changes

## Important Constraint

- Do not restart from `JVTO-Why-JVTO-Next15`, `remix-why-jvto`, or `jvto-web-baseline-20260401`.
- Those are not active implementation workspaces.
- This repo is the active workspace.
