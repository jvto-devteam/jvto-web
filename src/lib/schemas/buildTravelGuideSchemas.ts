// src/lib/schemas/buildTravelGuideSchemas.ts — Schema builders for /travel-guide cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildTravelGuideSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 5: WebPage + BreadcrumbList per page; FAQPage where role demands.
// Special case /ijen-health-screening (Phase 4.6 augment 2026-04-29): MedicalWebPage + HowTo + DOCTOR + BBKSDA + SE1658 cross-refs.
import type {
  ItemList,
  WithContext,
} from 'schema-dts';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * Hub-level ItemList of the live travel-guide sub-pages, semantically grouped via name prefixes
 * so AI engines can extract the discovery hierarchy (Plan & Prepare, Safety & Health, etc.).
 */
export function buildTgHubItemListSchema(): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/travel-guide#sub-pages`,
    name: 'JVTO Travel Guide — Pre-Trip Knowledge Base',
    numberOfItems: 9,
    itemListElement: [
      { '@type': 'ListItem', position: 1, url: `${BASE_URL}/travel-guide/faq`, name: 'FAQ — Common questions' },
      { '@type': 'ListItem', position: 2, url: `${BASE_URL}/travel-guide/booking-information`, name: 'Booking Information — How to book' },
      { '@type': 'ListItem', position: 3, url: `${BASE_URL}/travel-guide/best-time-to-visit`, name: 'Best Time to Visit — Seasonal planning (Bromo, Ijen, Tumpak Sewu)' },
      { '@type': 'ListItem', position: 4, url: `${BASE_URL}/travel-guide/ijen-health-screening`, name: 'Ijen Health Screening — SE.1658 protocol' },
      { '@type': 'ListItem', position: 5, url: `${BASE_URL}/travel-guide/safety-on-tours`, name: 'Safety on Tours — Police-led model' },
      { '@type': 'ListItem', position: 6, url: `${BASE_URL}/travel-guide/weather-and-closures`, name: 'Weather & Closures — Volcanic alert SOP' },
      { '@type': 'ListItem', position: 7, url: `${BASE_URL}/travel-guide/packing-and-fitness`, name: 'Packing & Fitness — Self-assessment' },
      { '@type': 'ListItem', position: 8, url: `${BASE_URL}/travel-guide/police-escort-for-groups`, name: 'Police Escort for Groups — POLPAR coordination' },
      { '@type': 'ListItem', position: 9, url: `${BASE_URL}/travel-guide`, name: 'Travel Guide Hub' },
    ],
  };
}
