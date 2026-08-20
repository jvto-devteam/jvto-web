// src/lib/schemas/buildWhyJvtoSchemas.ts — Schema builders for /why-jvto cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildWhyJvtoSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 3: WebPage + BreadcrumbList per page; FAQPage from narrative_claims;
// hub adds mainEntity ItemList(sub-pages); /reviews adds per-review Review nodes.
// 2026-08-20: the standalone AggregateRating node this file used to add on /reviews
// (buildWhyJvtoReviewsAggregateRatingSchema, fed from getPublicAggregateRating()) is
// deleted per the schema-rendering-consolidation design's Bagian 1 — the rating is now
// an inline property of the Organization node, assembled once in jvto-ekosistem and
// already reaching this page via PageJsonLdCombined's ecosystem branch.
import type {
  BreadcrumbList,
  ItemList,
  ListItem,
  WebPage,
  WithContext,
} from 'schema-dts';

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

