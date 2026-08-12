// src/lib/schemas/buildWhyJvtoSchemas.ts — Schema builders for /why-jvto cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildWhyJvtoSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 3: WebPage + BreadcrumbList per page; FAQPage from narrative_claims;
// hub adds mainEntity ItemList(sub-pages); /reviews adds AggregateRating.
import { AGGREGATE_RATING } from '@/lib/jvtoReviews';
import type { NarrativeClaim } from '@/lib/queries/narrativeClaims';
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

export function buildWhyJvtoWebPageSchema({ subpath, pageName, description }: WhyPageArgs) {
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

export function buildWhyJvtoBreadcrumbSchema({ subpath, pageName }: WhyPageArgs) {
  const items = [
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
 * FAQPage from narrative_claims wired to a why-jvto page (primary_page = '/why-jvto/...').
 * Empty input → returns null (no schema injection). Each claim's pillar = Question, core_claim = Answer.
 */
export function buildWhyJvtoFaqSchema(claims: NarrativeClaim[], subpath: WhyPageArgs['subpath']) {
  const usable = claims.filter((c) => c.pillar && c.core_claim);
  if (!usable.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl(subpath)}#faq`,
    mainEntity: usable.map((c) => ({
      '@type': 'Question',
      name: c.pillar as string,
      acceptedAnswer: { '@type': 'Answer', text: c.core_claim as string },
    })),
  };
}

/**
 * Hub-level ItemList of /why-jvto sub-pages — orchestrates discovery from hub to detail pages.
 */
export function buildWhyJvtoHubItemListSchema() {
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
export function buildIndividualReviewSchemas(reviews: ReviewForSchema[]): Record<string, unknown>[] {
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
 * Hub-level ItemList of all 9 narrative claims as mainEntity for /why-jvto WebPage.
 * Signals to AI that the hub page IS the authoritative index of all JVTO trust pillars.
 * Each claim links to its primary_page where the evidence is concentrated.
 */
export function buildNarrativeClaimsItemList(
  // Only these two fields feed the ItemList. The hub (its only caller) now
  // supplies them from content/entities/narrative-claims.json — never the DB.
  claims: Array<Pick<NarrativeClaim, "pillar" | "primary_page">>,
) {
  const usable = claims.filter((c) => c.pillar);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/why-jvto#narrative-claims`,
    name: 'JVTO Trust Pillars — 9 Verifiable Claims',
    description:
      'Nine canonical narrative claims that define the operational identity of PT Java Volcano Rendezvous (NIB 1102230032918, trading as Java Volcano Tour Operator), each with a dedicated evidence page for independent verification.',
    mainEntityOfPage: { '@id': `${BASE_URL}/why-jvto#webpage` },
    numberOfItems: usable.length,
    itemListElement: usable.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.pillar as string,
      url: c.primary_page ? `${BASE_URL}${c.primary_page}` : `${BASE_URL}/why-jvto`,
    })),
  };
}

/**
 * AggregateRating standalone for /why-jvto/reviews — reinforces the operator-level rating at reviews page level.
 * itemReviewed cross-refs Organization @id; same data as ORG schema's aggregateRating (jvtoReviews.ts canonical).
 */
export function buildWhyJvtoReviewsAggregateRatingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': `${BASE_URL}/why-jvto/reviews#aggregate-rating`,
    itemReviewed: { '@id': `${BASE_URL}/#organization` },
    ratingValue: String(AGGREGATE_RATING.ratingValue),
    reviewCount: String(AGGREGATE_RATING.reviewCount),
    bestRating: String(AGGREGATE_RATING.bestRating),
    worstRating: String(AGGREGATE_RATING.worstRating),
  };
}
