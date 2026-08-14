# Ekosistem Content Consumption

Last updated: 2026-08-14

`jvto-ekosistem` is now the preferred runtime source for these public website surfaces:

- JSON-LD page graph through `GET /api/schema/page?route=...`, consumed by `src/components/seo/PageJsonLdCombined.tsx`.
- Public organization profile data, consumed first from the ekosistem Organization/TravelAgency node by `src/lib/publicContent/getPublicOrganizationProfile.ts`, then falling back to Prisma/snapshot.
- `/llms.txt`, consumed first from `https://ekosistem.javavolcano-touroperator.com/llms.txt`, then falling back to the legacy Trust Bundle renderer.
- Travel Guide `answerFirst` copy, consumed from `GET /api/website/page?route=...` by route-level Travel Guide pages.

The ekosistem fetch path is intentionally fail-open: unavailable, non-JSON, or non-text responses return `null` and preserve the existing local website behavior. This keeps page rendering stable while the ekosistem API deploy catches up.

## `llm-wiki` Still In Use

`llm-wiki` is not fully retired. It still feeds these website areas through the existing synced bundles:

- `/trust`, via `src/app/(website)/trust/page.tsx`.
- `TrustFaqBlock`, via `src/components/trust/TrustFaqBlock.tsx`.
- `TrustClaimBlock`, via `src/components/trust/TrustClaimBlock.tsx`.
- Route registry trust metadata, via `src/lib/registry/pages.ts`.
- Policy bundle consumers such as checkout, customer booking, policy schema helpers, and package-readiness helpers.
- Trust Bundle fallback for `/llms.txt` when ekosistem is unavailable.

Do not remove `sync:trust`, `sync:policy`, `sync:packages`, or their CI drift gates until each consumer has been migrated and verified separately.
