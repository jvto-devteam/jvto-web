# JVTO Drift Audit — 2026-09-05

Audit ini memakai:

- `jvto-devteam/jvto-web` branch `live`
- `jvto-devteam/jvto-ekosistem` branch `main`
- `https://javavolcano-touroperator.com/sitemap.xml`
- baseline `live_html_url_audit_2026-08-30(1).csv`
- baseline `repo_snapshot.csv` 2026-08-30

Limitasi: audit live dilakukan pada HTML response mentah. Audit ini tidak menguji browser-rendered DOM, Google Search Console, deployment ID, atau Core Web Vitals.

## 1. Executive Status

| Area | Status |
|---|---|
| Sitemap live | 302 URL |
| URL baru vs baseline | 6 |
| URL hilang vs baseline | 0 |
| Non-200 URL | 0 |
| Missing title | 0 |
| Missing meta description | 0 |
| Missing canonical | 0 |
| H1 kosong | 0 |
| H1 multiple | 0 |
| Missing OG image | 0 |
| Missing Twitter image | 0 |
| Missing JSON-LD | 0 |
| JSON-LD invalid | 0 |
| Existing URL dengan perubahan `jsonld_types` | 296 |

Kesimpulan teknis: crawl dasar live membaik dan tidak menunjukkan field kosong pada title, meta description, canonical, H1, OG image, Twitter image, atau JSON-LD. Drift terbesar minggu ini bukan field kosong, tetapi perubahan lapisan JSON-LD dan mismatch antara `route-output-index` ekosistem dengan sitemap live.

## 2. Repo Snapshot Drift

| Repo | Branch | Baseline 2026-08-30 | Current 2026-09-05 | Current commit message |
|---|---|---|---|---|
| `jvto-devteam/jvto-web` | `live` | `99673b2f03676b255454688c3bca06092caddc0f` | `b266a55d6ff33ee3e162487f44f50708566ccb06` | `Merge branch 'live' of https://github.com/jvto-devteam/jvto-web into live` |
| `jvto-devteam/jvto-ekosistem` | `main` | `fceb97d2b7ce0a20f9c67d3c7b2c74d4a7c2bfeb` | `3f4fc35839d54afd12ddb1f064a32df59e4e824e` | `chore(booking-sync): sync booking data 2026-09-05T04:59:52Z` |

## 3. Sitemap Group Summary

| Group | URL count | Non-200 | Missing title/meta/canonical/H1/OG/Twitter/JSON-LD |
|---|---:|---:|---:|
| `why-jvto/reviews-detail` | 228 | 0 | 0 |
| `tours/from-surabaya-detail` | 13 | 0 | 0 |
| `travel-guide/detail` | 11 | 0 | 0 |
| `why-jvto/crew-detail` | 11 | 0 | 0 |
| `why-jvto` | 6 | 0 | 0 |
| `destinations/detail` | 5 | 0 | 0 |
| `tours/from-bali-detail` | 4 | 0 | 0 |
| `verify-jvto/detail` | 4 | 0 | 0 |
| `blog/detail` | 3 | 0 | 0 |
| `policy/detail` | 3 | 0 | 0 |
| `tours` | 3 | 0 | 0 |
| `markets/detail` | 2 | 0 | 0 |
| `blog` | 1 | 0 | 0 |
| `contact` | 1 | 0 | 0 |
| `destinations` | 1 | 0 | 0 |
| `entity` | 1 | 0 | 0 |
| `home` | 1 | 0 | 0 |
| `isic` | 1 | 0 | 0 |
| `policy` | 1 | 0 | 0 |
| `travel-guide` | 1 | 0 | 0 |
| `verify-jvto` | 1 | 0 | 0 |

## 4. URL Drift

| Type | Count | URLs |
|---|---:|---|
| New in sitemap | 6 | `/why-jvto/reviews/327`, `/why-jvto/reviews/328`, `/why-jvto/reviews/329`, `/why-jvto/reviews/330`, `/why-jvto/reviews/331`, `/why-jvto/reviews/332` |
| Removed from sitemap | 0 | - |

## 5. Route Output Index vs Sitemap

Current `route-output-index.json`:

| Metric | Count |
|---|---:|
| Total route output records | 298 |
| With `websiteOutput` | 51 |
| Without `websiteOutput` | 247 |
| With `schemaOutput` | 298 |

Mismatch:

| Direction | Count | Paths |
|---|---:|---|
| In sitemap, not in route-output-index | 6 | `/entity`, `/destinations/mount-bromo`, `/destinations/ijen-crater`, `/destinations/madakaripura-waterfall`, `/destinations/tumpak-sewu-waterfall`, `/destinations/papuma-beach` |
| In route-output-index, not in sitemap | 2 | `/why-jvto/reviews/333`, `/why-jvto/reviews/334` |

## 6. Field Drift

After normalizing common HTML entity differences (`&amp;`, apostrophe entity, whitespace), no material drift was found for:

- title
- meta description
- canonical
- H1 count
- H1 text
- OG image
- Twitter image
- HTTP status
- JSON-LD block count
- JSON-LD parse validity

The normalized compare still reports `jsonld_types` changed on 296 existing URLs. This should be treated as a schema-contract review item, not as an automatic rollback signal.

## 7. Repo-Template Conflicts Still Observable

| ID | Area | Current evidence | Priority |
|---|---|---|---|
| C001 | Tour FAQ source ownership | `src/lib/tourFaqs.ts` on `jvto-web/live` still contains canonical business/legal/safety facts such as `NIB_NUMBER = '1102230032918'` and Ijen health-screening text. | P1 |
| C002/C003 | Tour FAQ schema parity | `src/lib/schemas/buildTourSchemas.ts` still builds FAQ schema from `spinePairs`, `narrativeClaims`, and `fullData.faqs`. This can keep schema ahead of visible FAQ unless every emitted question is rendered or contractually schema-only. | P1 |
| C006 | `/entity` graph ownership | Live `/entity` has JSON-LD, but current type set does not include `WebSite`; page schema references `#website`/`#organization` via `isPartOf`/`about` without defining them in the same graph. | P1 |
| C008 | Breadcrumb schema risk | `src/components/website/Breadcrumbs.tsx` still defaults `emitSchema = true` and uses hardcoded `https://jvto.example.com` as schema base URL. | P1 |

## 8. Highest-Priority Fixes

1. Reconcile sitemap vs route-output-index first:
   - decide whether `/entity` and the 5 destination detail pages are intentionally web-only;
   - decide whether review pages `/333` and `/334` should enter sitemap now or stay excluded.
2. Review the global JSON-LD expansion:
   - verify that the new added types such as `AggregateRating`, `Review`, `Person`, `Rating`, `Question`, `Answer`, and `ListItem` are intentional per URL group;
   - check that every schema claim has a source owner and does not exceed visible content rules.
3. Move tour FAQ/legal/safety authority out of `jvto-web` hardcode path or document it as accepted temporary owner:
   - target conflict: `src/lib/tourFaqs.ts`;
   - acceptance check: web repo should consume canonical facts from ekosistem or the handoff must explicitly mark this as accepted risk.
4. Fix `/entity` schema graph contract:
   - add/compose JVTO `Organization` and `WebSite` references consistently, or define why `/entity` is intentionally third-party-only while still referencing `#organization` and `#website`.
5. Fix `Breadcrumbs.tsx` schema safety:
   - remove hardcoded `jvto.example.com`;
   - make schema emission opt-in or force all callers that use `PageJsonLdCombined` to pass `emitSchema={false}`.

## 9. Operational Next Step

Do not start with title/meta fixes this week. The live crawl shows those fields are present. Start with route-contract drift and schema-contract drift:

1. `route-output-index` vs sitemap reconciliation.
2. JSON-LD type expansion review by URL group.
3. Source ownership cleanup for tour FAQ/legal/safety facts.
4. `/entity` schema graph contract.
5. Breadcrumb schema hardcoded-base cleanup.
