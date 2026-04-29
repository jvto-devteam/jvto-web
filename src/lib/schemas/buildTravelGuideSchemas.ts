// src/lib/schemas/buildTravelGuideSchemas.ts — Schema builders for /travel-guide cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildTravelGuideSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 5: WebPage + BreadcrumbList per page; FAQPage where role demands.
const BASE_URL = 'https://javavolcano-touroperator.com';

interface TgPageArgs {
  /** Path segment after /travel-guide/ — '' for hub, 'faq' / 'ijen-health-screening' / etc for sub-pages. */
  subpath: string;
  pageName: string;
  description: string;
}

function pageUrl(subpath: string): string {
  return subpath ? `${BASE_URL}/travel-guide/${subpath}` : `${BASE_URL}/travel-guide`;
}

export function buildTgWebPageSchema({ subpath, pageName, description }: TgPageArgs) {
  const url = pageUrl(subpath);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: pageName,
    description,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
  };
}

export function buildTgBreadcrumbSchema({ subpath, pageName }: TgPageArgs) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Travel Guide', item: `${BASE_URL}/travel-guide` },
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
 * Hub-level ItemList of all 11 travel-guide sub-pages, semantically grouped via name prefixes
 * so AI engines can extract the discovery hierarchy (Plan & Prepare, Safety & Health, etc.).
 */
export function buildTgHubItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/travel-guide#sub-pages`,
    name: 'JVTO Travel Guide — Pre-Trip Knowledge Base',
    numberOfItems: 11,
    itemListElement: [
      { '@type': 'ListItem', position: 1, url: `${BASE_URL}/travel-guide/faq`, name: 'FAQ — Common questions' },
      { '@type': 'ListItem', position: 2, url: `${BASE_URL}/travel-guide/booking-information`, name: 'Booking Information — How to book' },
      { '@type': 'ListItem', position: 3, url: `${BASE_URL}/travel-guide/ijen-health-screening`, name: 'Ijen Health Screening — SE.1658 protocol' },
      { '@type': 'ListItem', position: 4, url: `${BASE_URL}/travel-guide/safety-on-tours`, name: 'Safety on Tours — Police-led model' },
      { '@type': 'ListItem', position: 5, url: `${BASE_URL}/travel-guide/weather-and-closures`, name: 'Weather & Closures — Volcanic alert SOP' },
      { '@type': 'ListItem', position: 6, url: `${BASE_URL}/travel-guide/packing-list`, name: 'Packing List — What to bring' },
      { '@type': 'ListItem', position: 7, url: `${BASE_URL}/travel-guide/packing-and-fitness`, name: 'Packing & Fitness — Self-assessment' },
      { '@type': 'ListItem', position: 8, url: `${BASE_URL}/travel-guide/mount-bromo-logistics`, name: 'Mount Bromo Logistics — 03:00 AM start' },
      { '@type': 'ListItem', position: 9, url: `${BASE_URL}/travel-guide/tumpak-sewu-logistics`, name: 'Tumpak Sewu Logistics — Descent + footwear' },
      { '@type': 'ListItem', position: 10, url: `${BASE_URL}/travel-guide/police-escort-for-groups`, name: 'Police Escort for Groups — POLPAR coordination' },
      { '@type': 'ListItem', position: 11, url: `${BASE_URL}/travel-guide`, name: 'Travel Guide Hub' },
    ],
  };
}
