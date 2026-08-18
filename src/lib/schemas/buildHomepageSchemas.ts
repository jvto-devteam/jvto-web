// src/lib/schemas/buildHomepageSchemas.ts — Server-side schema builders for the homepage spine.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildHomepageSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 2 / Homepage MH:
// WebSite + WebPage + FAQPage + AggregateRating + BreadcrumbList. FOUNDER + DOCTOR + BBKSDA + 9 DefinedTerms
// already injected globally via (website)/layout.tsx. Organization injected per-page via PageJsonLdCombined.
import { BEST_RATING, WORST_RATING } from '@/lib/publicContent/getAggregateRating';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * Standalone AggregateRating cross-referenced to Organization — a page-level node
 * strengthens the AEO signal at the homepage.
 *
 * `liveStats` MUST come from `getPublicAggregateRating()` (Google Maps only — the
 * one figure allowed to be presented as the JVTO rating). There is deliberately no
 * hardcoded fallback: when no source can answer, this returns null and the caller
 * omits the node rather than serving search engines a number nobody can vouch for.
 */
export function buildHomepageAggregateRatingSchema(
  liveStats?: { rating: number; count: number } | null,
) {
  if (!liveStats) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': `${BASE_URL}/#aggregate-rating`,
    itemReviewed: { '@id': `${BASE_URL}/#organization` },
    ratingValue: String(liveStats.rating),
    reviewCount: String(liveStats.count),
    bestRating: String(BEST_RATING),
    worstRating: String(WORST_RATING),
  };
}
