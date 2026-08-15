# Ekosistem Content Consumption

Last updated: 2026-08-15 (Task 5.3, data-source-consolidation plan)

`jvto-ekosistem` is now the preferred runtime source for these public website surfaces:

- JSON-LD page graph through `GET /api/schema/page?route=...`, consumed by `src/components/seo/PageJsonLdCombined.tsx`.
- Public organization profile data, consumed first from the ekosistem Organization/TravelAgency node by `src/lib/publicContent/getPublicOrganizationProfile.ts`, then falling back to Prisma/snapshot.
- `/llms.txt`, rendered entirely from ekosistem SSOT (see `public/llms.txt`'s own header) — no Trust Bundle fallback remains.
- `/trust`, `TrustFaqBlock`, and `TrustClaimBlock`, consumed from ekosistem's `credentials-and-public-evidence/trust-claims.json` via `src/lib/ecosystemContent/trustClaims.ts` (`getEcosystemTrustClaims()`, local-read + HTTP-fallback).
- Travel Guide `answerFirst` copy, consumed from `GET /api/website/page?route=...` by route-level Travel Guide pages.

The ekosistem fetch path is intentionally fail-open: unavailable, non-JSON, or non-text responses return `null`/empty and preserve the existing local website behavior. This keeps page rendering stable while the ekosistem API deploy catches up.

## `llm-wiki` direct sync — retired

`src/lib/trust-bundle.ts`, `src/data/trust-bundle/`, and `scripts/sync-trust-bundle.mjs` (the direct `llm-wiki` → `jvto-web` sync, and the `sync:trust` script) were removed in Task 5.3 of the data-source-consolidation plan. The `/trust` route's remaining schema-shaping/pipeline-metadata needs (FAQPage JSON-LD, TouristTrip stubs, the compile-manifest byline) were relocated to `src/lib/trust-bundle-schema.ts`, a local file with no upstream sync of its own. Nothing in this repo reads directly from `llm-wiki` anymore — see the root `README.md`'s content-sources note for the current chain (`llm-wiki` → `jvto-ekosistem` → `jvto-web`).

`llm-wiki` still feeds `jvto-web` indirectly through other synced bundles not covered by this task:

- Policy bundle consumers such as checkout, customer booking, policy schema helpers, and package-readiness helpers (`sync:policy`, `sync:packages`).
- The blog sync (`sync:blog`), which copies published posts from `llm-wiki` into `src/data/blog/`.

Do not remove `sync:policy`, `sync:packages`, `sync:blog`, or their CI drift gates until each of those consumers has been migrated and verified separately.
