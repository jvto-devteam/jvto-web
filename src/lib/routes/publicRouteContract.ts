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
 * Values T01 deliberately does not declare. The spec's own example flags
 * destination-detail's schemaOutputExpected as needing product confirmation,
 * and filling these from today's manifest would freeze current drift as
 * "correct" and leave T02 with nothing to find. T02 declares them; until then
 * `--strict-expectations` fails on anything still unconfirmed.
 */
export type ArtifactExpectation = boolean | "unconfirmed";

/**
 * Which repo assembles the JSON-LD for a route. Carries "unconfirmed" for the
 * same reason as ArtifactExpectation: it is knowable only by reading each
 * route's schema composition, which is T02's job. Guessing it here would be an
 * invented value wearing a type that looks authoritative.
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
    routes: [
      "/",
      "/contact",
      "/isic/student-package",
      "/entity",
      "/markets/singapore",
      "/markets/malaysia",
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "unconfirmed",
    sitemapExpected: true,
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
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
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
    expectedStatus: 200,
  },
];
