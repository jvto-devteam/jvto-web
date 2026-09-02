# Ekosistem Content Consumption

Last updated: 2026-08-15 (Task 5.3, data-source-consolidation plan)

> Batas antara *runtime dependency* dan *deployment dependency* — dan kenapa co-location di
> VPS bukan syarat arsitektur — ada di
> [`repo-correlation-and-vps-boundary.md`](./repo-correlation-and-vps-boundary.md).

`jvto-ekosistem` is now the preferred runtime source for these public website surfaces:

- JSON-LD page graph through `GET /api/schema/page?route=...`, consumed by `src/components/seo/PageJsonLdCombined.tsx`.
- Public organization profile data, consumed first from the ekosistem Organization/TravelAgency node by `src/lib/publicContent/getPublicOrganizationProfile.ts`, then falling back to Prisma/snapshot.
- `/llms.txt`, rendered entirely from ekosistem SSOT (see `public/llms.txt`'s own header) — no Trust Bundle fallback remains.
- ~~`/trust`, `TrustFaqBlock`, and `TrustClaimBlock`, via `src/lib/ecosystemContent/trustClaims.ts`.~~ **Removed.** Verified 2026-09-02: there is no `/trust` route, no `TrustFaqBlock`/`TrustClaimBlock` component, and no `trustClaims.ts` anywhere in the tree. Trust content now surfaces through the `verify-jvto` and `why-jvto` clusters instead. Kept struck through rather than deleted so the next reader knows the route was retired, not overlooked.
- Travel Guide `answerFirst` copy, consumed from `GET /api/website/page?route=...` by route-level Travel Guide pages.

The ekosistem fetch path is intentionally fail-open: unavailable, non-JSON, or non-text responses return `null`/empty and preserve the existing local website behavior. This keeps page rendering stable while the ekosistem API deploy catches up.

## `llm-wiki` direct sync — retired

`src/lib/trust-bundle.ts`, `src/data/trust-bundle/`, and `scripts/sync-trust-bundle.mjs` (the direct `llm-wiki` → `jvto-web` sync, and the `sync:trust` script) were removed in Task 5.3 of the data-source-consolidation plan. That note used to add that the `/trust` route's remaining schema-shaping needs were relocated to `src/lib/trust-bundle-schema.ts`. **That file does not exist** (verified 2026-09-02), and neither does the `/trust` route it served — both went with the route's removal. Nothing in this repo reads directly from `llm-wiki` anymore — see the root `README.md`'s content-sources note for the current chain (`llm-wiki` → `jvto-ekosistem` → `jvto-web`).

`llm-wiki` still feeds `jvto-web` indirectly through other synced bundles not covered by this task:

- Package-readiness helpers via `sync:packages`. (`sync:policy` was named here too, but no such script exists in `package.json` — verified 2026-09-02.)
- The blog sync (`sync:blog`), which copies published posts from `llm-wiki` into `src/data/blog/`. **That target directory does not exist**, and its only consumer, `src/lib/blog.ts`, was deleted in the ekosistem migration — `src/lib/ecosystemContent/blog.ts:14-16` records the replacement. `ci.yml:60-66` already dropped it from CI because it fails outright.

Do not remove `sync:packages` or its CI drift gate until its consumers have been migrated and verified separately. `sync:blog` no longer has a consumer to protect; retiring it is a separate, safe decision.
