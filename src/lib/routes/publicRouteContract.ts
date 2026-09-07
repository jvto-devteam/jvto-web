/**
 * Public route contract — T01, 2026-09-06.
 *
 * The authority on which routes are public/indexable, who owns their content,
 * and which artifacts they are expected to have. This is the comparand for
 * sitemap.xml; route-output-index.json is NOT (248 of its 299 entries are
 * review/crew detail routes, so it measures artifacts, not publication).
 *
 * Static routes are duplicated here from the sitemap.data.ts files by owner
 * decision 2026-09-06 (foundation-only: no sitemap file is edited). They were
 * extracted mechanically, not retyped, and the duplication is guarded —
 * scripts/validate-public-route-contract.mjs re-extracts the url("/path")
 * literals on every run and fails on any divergence in either direction.
 *
 * This file imports nothing, so anything can load it.
 */

/**
 * T01 deliberately did not declare these. T02 did, on 2026-09-07.
 *
 * The union keeps "unconfirmed" because `schemaOwner` still carries it (see
 * SchemaOwner below) and because a future family added without measurement
 * must have a value that `--strict-expectations` can reject. No artifact
 * expectation carries it any more; a test asserts that in both directions.
 *
 * How each declared value was obtained, since the distinction is the whole
 * point of the field:
 *
 *   - Twelve families were derived from per-family coverage of
 *     route-output-index.json measured 2026-09-07. Every one of them was
 *     unanimous — 100% or 0%, never mixed — so the declaration records an
 *     observed invariant rather than a majority vote. The fraction is written
 *     into each family's comment so a later reader can tell a measured
 *     declaration from an asserted one without re-measuring.
 *
 *   - The two web-owned families (destination-detail, entity-static) were NOT
 *     derived from the manifest. Reading 0% coverage and declaring `false`
 *     would freeze a possible generator gap as "correct" — the exact mistake
 *     T01 refused to make. They were verified from live production markup
 *     instead (Rule 8): /destinations/mount-bromo and /entity each serve two
 *     application/ld+json blocks with no ekosistem schema-output behind them,
 *     so jvto-web genuinely assembles their schema. /travel-guide/faq was
 *     sampled as the control — it has an ekosistem schema-output and also
 *     serves JSON-LD, so the sample distinguishes the two cases rather than
 *     confirming one.
 *
 * Full evidence: docs/audit/VERIFIED_FACTS.md.
 */
export type ArtifactExpectation = boolean | "unconfirmed";

/**
 * Which repo assembles the JSON-LD for a route.
 *
 * T02 examined this on 2026-09-07 and deliberately left every family
 * "unconfirmed". The tempting derivation — schemaOutputExpected ? ekosistem :
 * web — is wrong: PageJsonLdCombined injects Organization, WebSite, WebPage and
 * BreadcrumbList from jvto-web on EVERY page, so a route that has an ekosistem
 * schema-output file still carries web-assembled nodes. Ownership is genuinely
 * split per node, not per route, and resolving it is what T03
 * (schema-route-groups.json), T06 (entity graph composition) and T07
 * (breadcrumb ownership) exist to do.
 *
 * Leaving it blocks nothing: --strict-expectations checks only the two artifact
 * fields, and no classification in T02's reconciler reads schemaOwner.
 */
export type SchemaOwner = "jvto-web" | "jvto-ekosistem" | "unconfirmed";

export type RouteSourceKey =
  | "reviewIds"
  | "crewCodes"
  | "destinationSlugs"
  | "tourSlugsFromBali"
  | "tourSlugsFromSurabaya"
  | "blogRoutes";

type BaseContract = {
  readonly id: string;
  readonly group: string;
  readonly contentOwner: "jvto-web" | "jvto-ekosistem";
  readonly renderOwner: "jvto-web";
  readonly schemaOwner: SchemaOwner;
  readonly sitemapExpected: boolean;
  readonly websiteOutputExpected: ArtifactExpectation;
  readonly schemaOutputExpected: ArtifactExpectation;
  readonly expectedStatus: 200;
};

export type RouteFamilyContract =
  | (BaseContract & { readonly kind: "static"; readonly routes: readonly string[] })
  | (BaseContract & {
      readonly kind: "dynamic";
      readonly pattern: string;
      readonly source: RouteSourceKey;
      /** "id" joins prefix and record; "route" means the source already yields full routes. */
      readonly expansion: "id" | "route";
      readonly prefix: string;
    });

/**
 * Every family carries contentOwner "jvto-ekosistem": CLAUDE.md states that the
 * database holds customer login and nothing else the site displays. renderOwner
 * is structurally always jvto-web — it owns every page.tsx.
 *
 * sitemapExpected is true throughout because each of these routes is emitted by
 * a hand-maintained sitemap.data.ts, and that hand-maintenance IS the intent.
 * A family that should NOT be in the sitemap does not belong in this file at
 * all: /my-booking/:slug is transactional, absent from the sitemap, and has no
 * generateStaticParams, so it is deliberately unlisted rather than declared
 * false. Declaring it would assert it is a public surface.
 */
export const PUBLIC_ROUTE_CONTRACT: readonly RouteFamilyContract[] = [
  // ── static families, one per sitemap.data.ts section ──────────────────────
  {
    id: "root-static",
    kind: "static",
    group: "root",
    // src/app/sitemap.data.ts
    // "/entity" was declared here until 2026-09-07. It is now its own family:
    // it is the one route of this six that ekosistem generates nothing for, and
    // a family-level boolean cannot say "five yes, one no". See entity-static.
    routes: [
      "/",
      "/contact",
      "/isic/student-package",
      "/markets/singapore",
      "/markets/malaysia",
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 5/5 schema, 5/5 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    // Split out of root-static 2026-09-07. Not an arbitrary regrouping: /entity
    // is the only route in that file with no ekosistem artifact of either kind,
    // and the T02 DoD forbids `if (route === "/entity")` in the validator, so
    // the exception has to be expressible as data. A family IS the unit of
    // "these routes behave the same", so the exception is this row.
    //
    // Precedent: T01 already split verify-jvto-static out of the why-jvto
    // sitemap file — the file boundary is not the group boundary.
    //
    // Declared false/false from live markup, not from the manifest's absence:
    // https://javavolcano-touroperator.com/entity serves 2 application/ld+json
    // blocks (GovernmentOrganization ×10, Organization ×6, Place, PostalAddress,
    // DigitalDocument) built by src/app/(website)/entity/page.tsx. Ekosistem
    // also holds no /entity source file at all. Web-owned, verified, not assumed.
    id: "entity-static",
    kind: "static",
    group: "entity",
    routes: ["/entity"],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    websiteOutputExpected: false,
    schemaOutputExpected: false,
    expectedStatus: 200,
  },
  {
    id: "why-jvto-static",
    kind: "static",
    group: "why-jvto",
    // src/app/(website)/why-jvto/sitemap.data.ts — the /why-jvto half
    routes: [
      "/why-jvto",
      "/why-jvto/the-jvto-difference",
      "/why-jvto/reviews",
      "/why-jvto/our-story",
      "/why-jvto/our-team",
      "/why-jvto/community-standards",
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 6/6 schema, 6/6 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "verify-jvto-static",
    kind: "static",
    group: "verify-jvto",
    // src/app/(website)/why-jvto/sitemap.data.ts — the /verify-jvto half.
    // Same file, different URL family: the file boundary is not the group boundary.
    routes: [
      "/verify-jvto",
      "/verify-jvto/legal",
      "/verify-jvto/press-recognition",
      "/verify-jvto/history-artifacts",
      "/verify-jvto/police-safety",
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 5/5 schema, 5/5 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "travel-guide-static",
    kind: "static",
    group: "travel-guide",
    // src/app/(website)/travel-guide/sitemap.data.ts — the /travel-guide half
    routes: [
      "/travel-guide",
      "/travel-guide/faq",
      "/travel-guide/safety-on-tours",
      "/travel-guide/weather-and-closures",
      "/travel-guide/packing-and-fitness",
      "/travel-guide/booking-information",
      "/travel-guide/best-time-to-visit",
      "/travel-guide/police-escort-for-groups",
      "/travel-guide/rijik-monthly-closure",
      "/travel-guide/ijen-health-screening",
      "/travel-guide/mount-bromo-logistics",
      "/travel-guide/tumpak-sewu-logistics",
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 12/12 schema, 12/12 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "policy-static",
    kind: "static",
    group: "policy",
    // src/app/(website)/travel-guide/sitemap.data.ts — the /policy half.
    // Policy routes live in the travel-guide sitemap file; there is no
    // policy/sitemap.data.ts to go looking for.
    routes: [
      "/policy",
      "/policy/booking-payment-cancellation",
      "/policy/inclusions-exclusions",
      "/policy/privacy",
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 4/4 schema, 4/4 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "destinations-index",
    kind: "static",
    group: "destinations",
    // src/app/(website)/destinations/sitemap.data.ts
    routes: ["/destinations"],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 1/1 schema, 1/1 website in route-output-index.json. Note the
    // contrast with destination-detail below — the hub has ekosistem artifacts,
    // the five detail pages have none. Same URL prefix, opposite ownership.
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "tours-index",
    kind: "static",
    group: "tours",
    // src/app/(website)/tours/sitemap.data.ts
    routes: ["/tours", "/tours/from-surabaya", "/tours/from-bali"],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 3/3 schema, 3/3 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "blog-index",
    kind: "static",
    group: "blog",
    // src/app/(website)/blog/sitemap.data.ts
    routes: ["/blog"],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 1/1 schema, 1/1 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },

  // ── dynamic families ──────────────────────────────────────────────────────
  {
    id: "review-detail",
    kind: "dynamic",
    pattern: "/why-jvto/reviews/:id",
    group: "why-jvto/reviews-detail",
    source: "reviewIds",
    expansion: "id",
    prefix: "/why-jvto/reviews",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 231/231 schema, 0/231 website in route-output-index.json.
    // The zero is unanimous across 231 records, which is what makes it a
    // declaration rather than a sample: review permalinks get schema output and
    // never website output.
    websiteOutputExpected: false,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "crew-detail",
    kind: "dynamic",
    pattern: "/why-jvto/our-team/:code",
    group: "why-jvto/our-team-detail",
    source: "crewCodes",
    expansion: "id",
    prefix: "/why-jvto/our-team",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 11/11 schema, 11/11 website in route-output-index.json.
    // Eleven is the published crew count — G2 excludes the 3 unpublished, and
    // the manifest agrees, so this floor doubles as a check on that rule.
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "destination-detail",
    kind: "dynamic",
    pattern: "/destinations/:slug",
    group: "destinations/detail",
    source: "destinationSlugs",
    expansion: "id",
    prefix: "/destinations",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // Declared false/false 2026-09-07 from LIVE MARKUP, not from the manifest.
    //
    // The manifest shows 0/5 for both artifacts, and the 2026-09-05 drift audit
    // reported these five as mismatches. Reading that zero and declaring false
    // would have frozen a possible generator gap as "correct" — and the doubt is
    // real, because ekosistem DOES hold the source content for all five
    // (destination-knowledge/*.content.json, schema_version
    // jvto/source/destination-detail/v1). Source present, output absent, is
    // exactly the shape of an unfinished generator.
    //
    // So it was checked against production instead:
    // /destinations/mount-bromo serves 2 application/ld+json blocks
    // (TouristTrip ×16, ListItem ×19, Organization ×2, WebSite) assembled by
    // src/app/(website)/destinations/[slug]/page.tsx via buildDestinationsSchemas.
    // The schema exists and jvto-web builds it. Absent from the manifest is the
    // correct state, not a gap.
    //
    // /travel-guide/faq was sampled as the control (has ekosistem schema-output,
    // also serves JSON-LD), so the sample separates the two cases instead of
    // confirming one. Flip this to true and T02 reports 5 MISSING_SCHEMA_OUTPUT
    // — that probe is in the plan's verification table as the standing evidence.
    websiteOutputExpected: false,
    schemaOutputExpected: false,
    expectedStatus: 200,
  },
  {
    id: "tour-detail-from-bali",
    kind: "dynamic",
    pattern: "/tours/from-bali/:slug",
    group: "tours/detail",
    source: "tourSlugsFromBali",
    expansion: "id",
    prefix: "/tours/from-bali",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 4/4 schema, 0/4 website in route-output-index.json
    websiteOutputExpected: false,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    id: "tour-detail-from-surabaya",
    kind: "dynamic",
    pattern: "/tours/from-surabaya/:slug",
    group: "tours/detail",
    source: "tourSlugsFromSurabaya",
    expansion: "id",
    prefix: "/tours/from-surabaya",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 13/13 schema, 0/13 website in route-output-index.json
    websiteOutputExpected: false,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
  {
    // getAllPublishedBlogRoutes yields whole routes, not slugs, and includes the
    // dedicated-page posts that getEcosystemBlogSlugs excludes for the build.
    // Hence expansion "route": prefix is recorded for documentation only.
    id: "blog-post",
    kind: "dynamic",
    pattern: "/blog/:slug",
    group: "blog/detail",
    source: "blogRoutes",
    expansion: "route",
    prefix: "/blog",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    // 2026-09-07: 3/3 schema, 3/3 website in route-output-index.json
    websiteOutputExpected: true,
    schemaOutputExpected: true,
    expectedStatus: 200,
  },
];
