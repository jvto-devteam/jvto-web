// src/lib/schemas/buildWhyJvtoSchemas.ts — Schema builders for /why-jvto cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildWhyJvtoSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 3: WebPage + BreadcrumbList per page; FAQPage from narrative_claims;
// hub adds mainEntity ItemList(sub-pages); /reviews adds AggregateRating.
import type {
  AggregateRating,
  BreadcrumbList,
  ItemList,
  ListItem,
  Review,
  WebPage,
  WithContext,
} from 'schema-dts';

import { BEST_RATING, WORST_RATING } from '@/lib/publicContent/getAggregateRating';
import type { ReviewForSchema } from '@/lib/queries/schemaReviews';

const BASE_URL = 'https://javavolcano-touroperator.com';

interface WhyPageArgs {
  /** Path segment after /why-jvto/ — '' for hub, 'our-story' / 'our-team' / etc for sub-pages. */
  subpath: '' | 'our-story' | 'our-team' | 'the-jvto-difference' | 'community-standards' | 'reviews';
  pageName: string;
  description: string;
}

function pageUrl(subpath: WhyPageArgs['subpath']): string {
  return subpath ? `${BASE_URL}/why-jvto/${subpath}` : `${BASE_URL}/why-jvto`;
}

export function buildWhyJvtoWebPageSchema({ subpath, pageName, description }: WhyPageArgs): WithContext<WebPage> {
  const url = pageUrl(subpath);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: pageName,
    description,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
    about: { '@id': `${BASE_URL}/#organization` },
  };
}

export function buildWhyJvtoBreadcrumbSchema({ subpath, pageName }: WhyPageArgs): WithContext<BreadcrumbList> {
  const items: ListItem[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Why JVTO', item: `${BASE_URL}/why-jvto` },
  ];
  if (subpath) {
    items.push({ '@type': 'ListItem', position: 3, name: pageName, item: pageUrl(subpath) });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Hub-level ItemList of /why-jvto sub-pages — orchestrates discovery from hub to detail pages.
 */
export function buildWhyJvtoHubItemListSchema(): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/why-jvto#sub-pages`,
    name: 'Why JVTO — Detail Pages',
    numberOfItems: 5,
    itemListElement: [
      { '@type': 'ListItem', position: 1, url: `${BASE_URL}/why-jvto/the-jvto-difference`, name: 'The JVTO Difference' },
      { '@type': 'ListItem', position: 2, url: `${BASE_URL}/why-jvto/our-story`, name: 'Our Story — Founder & Origins' },
      { '@type': 'ListItem', position: 3, url: `${BASE_URL}/why-jvto/our-team`, name: 'Our Team — KTA-Licensed Crew' },
      { '@type': 'ListItem', position: 4, url: `${BASE_URL}/why-jvto/community-standards`, name: 'Community Standards' },
      { '@type': 'ListItem', position: 5, url: `${BASE_URL}/why-jvto/reviews`, name: 'Reviews — Multi-Platform' },
    ],
  };
}

/**
 * Individual @type:Review nodes for /why-jvto/reviews — one node per DB review row.
 * Returns a flat array spread individually into the caller's extraSchemas; not wrapped in @graph.
 * itemReviewed cross-refs Organization @id (globally injected); url omitted when null.
 */
export function buildIndividualReviewSchemas(reviews: ReviewForSchema[]): WithContext<Review>[] {
  return reviews
    .filter((r): r is ReviewForSchema & { star: number } => r.star != null)
    .map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${BASE_URL}/#review-${r.id}`,
    author: {
      '@type': 'Person',
      name: r.customer_name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.star),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: r.review,
    datePublished: r.date.toISOString().split('T')[0],
    ...(r.url || r.url_reference ? { url: (r.url || r.url_reference) as string } : {}),
    itemReviewed: { '@id': `${BASE_URL}/#organization` },
    publisher: {
      '@type': 'Organization',
      name: r.platform,
    },
  }));
}

/**
 * AggregateRating standalone for /why-jvto/reviews — reinforces the operator-level
 * rating at reviews page level. itemReviewed cross-refs the Organization @id.
 *
 * `liveStats` MUST come from `getPublicAggregateRating()` (Google Maps only — the
 * one figure allowed to be presented as the JVTO rating). No hardcoded fallback:
 * returns null when no source can answer, and the caller omits the node.
 */
export function buildWhyJvtoReviewsAggregateRatingSchema(
  liveStats?: { rating: number; count: number } | null,
): WithContext<AggregateRating> | null {
  if (!liveStats) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': `${BASE_URL}/why-jvto/reviews#aggregate-rating`,
    itemReviewed: { '@id': `${BASE_URL}/#organization` },
    ratingValue: String(liveStats.rating),
    // schema.org types reviewCount as Integer; emitted as a numeric string (unchanged
    // runtime output) — the assertion narrows `string` to the numeric-string form.
    reviewCount: String(liveStats.count) as `${number}`,
    bestRating: String(BEST_RATING),
    worstRating: String(WORST_RATING),
  };
}
