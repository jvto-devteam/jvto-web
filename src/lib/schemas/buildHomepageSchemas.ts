// src/lib/schemas/buildHomepageSchemas.ts — Server-side schema builders for the homepage spine.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildHomepageSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 2 / Homepage MH:
// WebSite + WebPage + FAQPage + AggregateRating + BreadcrumbList. FOUNDER + DOCTOR + BBKSDA + 9 DefinedTerms
// already injected globally via (website)/layout.tsx. Organization injected per-page via PageJsonLdCombined.
import { BEST_RATING, WORST_RATING } from '@/lib/publicContent/getAggregateRating';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * WebSite — discovery anchor with sitelinks search box potential.
 * potentialAction declares a SearchAction so AI/Google can surface a search interface;
 * we route it to /tours since that is the discovery hub for our content.
 */
export function buildHomepageWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Java Volcano Tour Operator',
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/tours?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * WebPage — homepage as a node in the entity graph; mainEntity points to the Organization.
 * isPartOf cross-refs the WebSite. about + primaryImageOfPage strengthen content topicality.
 */
export function buildHomepageWebPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/#webpage`,
    url: `${BASE_URL}/`,
    name: 'Java Volcano Tour Operator — Police-Led Private East Java Volcano Tours',
    description:
      'Private, all-inclusive volcano tours to Mount Bromo, Ijen Crater, and Tumpak Sewu by PT Java Volcano Rendezvous (NIB 1102230032918). ' +
      'Founded by an active Tourist Police officer; HPWKI-licensed guides with annual BBKSDA volcanic-safety training.',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    mainEntity: { '@id': `${BASE_URL}/#organization` },
    about: { '@id': `${BASE_URL}/#organization` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/assets/img/hero/home.webp`,
    },
  };
}

export function buildHomepageBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }],
  };
}

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
