// src/lib/schemas/buildDestinationsSchemas.ts — Schema builders for /destinations cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — port pattern from rewrite's
// e:\test-2-2026\app\destinations\[slug]\page.tsx inline schemas.
//
// Per cluster_role_contracts.md Cluster 7: BreadcrumbList universal MH; per-destination
// reverse-lookup ItemList(tours-including) un-orphans the cluster; travel-guide handoff
// for Ijen / Bromo / Tumpak Sewu cross-cluster connections.
import type { ToursByDestinationItem } from '@/lib/queries/toursByDestination';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * Map of destination slug → travel-guide path for cross-cluster handoff.
 * Single source of truth — adding a new destination-to-guide link = one entry here.
 */
export const DESTINATION_TO_TRAVEL_GUIDE: Record<string, string | null> = {
  'ijen-crater': '/travel-guide/ijen-health-screening',
  'mount-bromo': '/travel-guide/mount-bromo-logistics',
  'tumpak-sewu-waterfall': '/travel-guide/tumpak-sewu-logistics',
  'madakaripura-waterfall': null,
  'papuma-beach': null,
};

/**
 * Reverse-lookup ItemList: "JVTO Tours including this destination". Un-orphans destination cluster
 * by giving AI engines a discoverable list of tours that visit this place. Each ListItem contains
 * a TouristTrip stub with name+url cross-ref.
 *
 * Returns null when there are zero tours (prevents emitting an empty ItemList).
 */
export function buildToursIncludingDestSchema({
  destinationSlug,
  destinationName,
  tours,
}: {
  destinationSlug: string;
  destinationName: string;
  tours: ToursByDestinationItem[];
}) {
  if (!tours.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/destinations/${destinationSlug}#tours-including`,
    name: `JVTO Tours including ${destinationName}`,
    numberOfItems: tours.length,
    itemListElement: tours
      .filter((t) => t.slug && t.name)
      .map((tour, i) => {
        // start_destination_id 3 = Bali, 4 = Surabaya per CLAUDE.md data convention.
        const fromCity = tour.start_destination_id === 3 ? 'from-bali' : 'from-surabaya';
        // Strip any path prefix from slug (Bali stores 'tours/from-bali/x', Surabaya stores bare 'x').
        const bareSlug = (tour.slug as string).replace(/^tours\/from-(bali|surabaya)\//, '');
        const url = `${BASE_URL}/tours/${fromCity}/${bareSlug}`;
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'TouristTrip',
            '@id': url,
            name: tour.name as string,
            url,
          },
        };
      }),
  };
}

/**
 * Cross-cluster handoff: if destination has a related travel-guide page, emit a WebPage cross-ref
 * so AI engines can discover the destination → travel-guide link as graph edge.
 */
export function buildDestinationTravelGuideHandoffSchema({
  destinationSlug,
  destinationName,
}: {
  destinationSlug: string;
  destinationName: string;
}) {
  const guidePath = DESTINATION_TO_TRAVEL_GUIDE[destinationSlug];
  if (!guidePath) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/destinations/${destinationSlug}#related-travel-guide`,
    url: `${BASE_URL}${guidePath}`,
    name: `Travel Guide for ${destinationName}`,
    isPartOf: { '@id': `${BASE_URL}/destinations/${destinationSlug}` },
  };
}
