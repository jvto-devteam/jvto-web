import { getPublicPageSnapshotUpdatedAt } from "@/lib/publicContent/pageSnapshots";
import { loadStaticPage } from "@/lib/static-content";

export type LastModifiedMap = Map<string, Date>;

/**
 * PACKAGE 07 (2026-08-09) — the sitemap's `lastmod` no longer reads `content_pages` (Prisma).
 *
 * Resolution order, all filesystem/static (no DB, no network):
 *   1. content/ SSOT record  → `meta.lastReviewed`
 *   2. public page snapshot  → `meta.updatedAt ?? meta.generatedAt`
 *   3. STATIC_ROUTE_LASTMOD  → explicit date for routes still owned by TSX/lib code
 *
 * Route enumeration is unchanged — SITEMAP_LASTMOD_ROUTES below is the same list this
 * module was already given, moved here only so the parity gate can assert against it.
 */

/**
 * Routes owned by TSX/lib code that have neither a content record nor a page snapshot.
 *
 * Why this tier exists: `/markets/*` were the ONLY sitemap routes still resolved by the
 * removed `content_pages` tier. Without an explicit date they would fall through to the
 * caller's `fallback`, which is the current request time (`src/app/sitemap.ts` is
 * `force-dynamic`) — republishing those pages as "modified" on every fetch, the same
 * unstable crawl signal that was fixed for `/blog`. The date is the last commit that
 * changed the market copy (`marketContent.ts` / `marketFaqs.ts` / the two market pages).
 * Replace an entry with a content record when that cluster migrates to `content/`.
 */
const STATIC_ROUTE_LASTMOD: Record<string, string> = {
  "/markets/singapore": "2026-07-08",
  "/markets/malaysia": "2026-07-08",
};

/** The routes whose lastmod the sitemap resolves. Enumeration unchanged by Package 07. */
export const SITEMAP_LASTMOD_ROUTES: readonly string[] = [
  "/",
  "/contact",
  "/destinations",
  "/isic/student-package",
  "/tours",
  "/tours/from-surabaya",
  "/tours/from-bali",
  "/travel-guide",
  "/travel-guide/faq",
  "/travel-guide/safety-on-tours",
  "/travel-guide/weather-and-closures",
  "/travel-guide/packing-and-fitness",
  "/travel-guide/booking-information",
  "/travel-guide/police-escort-for-groups",
  "/travel-guide/ijen-health-screening",
  "/policy",
  "/policy/privacy",
  "/policy/inclusions-exclusions",
  "/policy/booking-payment-cancellation",
  "/why-jvto",
  "/why-jvto/the-jvto-difference",
  "/why-jvto/reviews",
  "/why-jvto/our-story",
  "/why-jvto/our-team",
  "/why-jvto/community-standards",
  "/verify-jvto",
  "/verify-jvto/legal",
  "/verify-jvto/press-recognition",
  "/verify-jvto/history-artifacts",
  "/verify-jvto/police-safety",
  "/markets/singapore",
  "/markets/malaysia",
];

/**
 * Resolve each route's lastmod from the static sources above. Synchronous and DB-free:
 * a route with no resolvable date is simply absent from the map, and `getLastModified`
 * then applies the caller's fallback.
 */
export function getSitemapLastModifiedMap(
  routes: readonly string[] = SITEMAP_LASTMOD_ROUTES,
): LastModifiedMap {
  const entries: Array<[string, Date]> = [];

  for (const route of routes) {
    // 1. content/ SSOT (fs only)
    const staticPage = loadStaticPage(route);
    if (staticPage?.meta.status === "published") {
      entries.push([route, new Date(`${staticPage.meta.lastReviewed}T00:00:00Z`)]);
      continue;
    }
    // 2. committed public page snapshot
    const updatedAt = getPublicPageSnapshotUpdatedAt(route);
    if (updatedAt) {
      entries.push([route, new Date(updatedAt)]);
      continue;
    }
    // 3. explicit static date for TSX/lib-owned routes
    const staticDate = STATIC_ROUTE_LASTMOD[route];
    if (staticDate) entries.push([route, new Date(`${staticDate}T00:00:00Z`)]);
  }

  return new Map(entries);
}

export function getLastModified(
  map: LastModifiedMap,
  route: string,
  fallback: Date,
): Date {
  return map.get(route) ?? fallback;
}
