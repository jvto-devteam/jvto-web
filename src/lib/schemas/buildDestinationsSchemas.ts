// src/lib/schemas/buildDestinationsSchemas.ts — Schema builders for /destinations cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — port pattern from rewrite's
// e:\test-2-2026\app\destinations\[slug]\page.tsx inline schemas.
//
// Per cluster_role_contracts.md Cluster 7: BreadcrumbList universal MH; per-destination
// reverse-lookup ItemList(tours-including) un-orphans the cluster; travel-guide handoff
// for Ijen / Bromo / Tumpak Sewu cross-cluster connections.
import type { ToursByDestinationItem } from '@/lib/queries/toursByDestination';

const BASE_URL = 'https://javavolcano-touroperator.com';

// Wiki: feat(schema) 58e2642 — TouristAttraction + BreadcrumbList for all 5 destinations.
// Geo coordinates from AllTrails GPX bbox centers per destination wiki pages.
const TOURIST_ATTRACTION_DATA: Record<string, {
  name: string;
  alternateName: string[];
  description: string;
  lat: string;
  lng: string;
  locality: string;
  amenityFeatures?: Array<{ name: string; value: boolean }>;
}> = {
  'ijen-crater': {
    name: 'Kawah Ijen',
    alternateName: ['Ijen Crater', 'Kawah Ijen Volcano'],
    description: "Active stratovolcano at 2,386 m with the world's largest acidic crater lake and the pre-dawn blue fire phenomenon. Night hike from Paltuding trailhead (~3 km). BBKSDA East Java regulatory authority. Health-certificate coordination required when BBKSDA SE.1658/KSA.9/2024 access rules apply.",
    lat: '-8.0635', lng: '114.2362', locality: 'Banyuwangi',
    amenityFeatures: [
      { name: 'Gas masks provided', value: true },
      { name: 'Trekking poles provided', value: true },
      { name: 'Health screening coordination', value: true },
    ],
  },
  'mount-bromo': {
    name: 'Mount Bromo',
    alternateName: ['Gunung Bromo', 'Bromo Volcano'],
    description: 'Active stratovolcano at 2,329 m in the Tengger caldera, Probolinggo, East Java. Famous for the Penanjakan sunrise viewpoint (2,770 m), sea-of-sand caldera floor traversed by 4WD jeep, and active smoking crater. Part of Bromo Tengger Semeru National Park.',
    lat: '-7.9308', lng: '112.9581', locality: 'Probolinggo',
    amenityFeatures: [
      { name: 'Private 4WD jeep included', value: true },
      { name: 'Sunrise viewpoint access', value: true },
    ],
  },
  'tumpak-sewu-waterfall': {
    name: 'Tumpak Sewu Waterfall',
    alternateName: ['Coban Sewu', 'Tumpak Sewu'],
    description: 'Multi-tiered curtain waterfall (~120 m) in Lumajang, East Java. Accessible via jungle trail descending into the canyon. Optional swim at the base. Often combined with Ijen and Bromo tours.',
    lat: '-8.2311', lng: '112.9189', locality: 'Lumajang',
  },
  'madakaripura-waterfall': {
    name: 'Madakaripura Waterfall',
    alternateName: ['Air Terjun Madakaripura'],
    description: "Java's tallest waterfall in a narrow canyon gorge in Probolinggo. A 45-minute river-crossing trek through the gorge leads to the main fall. Guests get wet — rain poncho recommended.",
    lat: '-7.8490', lng: '113.0137', locality: 'Probolinggo',
  },
  'papuma-beach': {
    name: 'Papuma Beach',
    alternateName: ['Tanjung Papuma'],
    description: 'White-sand beach with dramatic coastal rock formations and a headland viewpoint in Jember, East Java. Relatively uncrowded. Included in extended Bali-origin itineraries.',
    lat: '-8.4300', lng: '113.5551', locality: 'Jember',
  },
};

/**
 * TouristAttraction schema for destination pages.
 * Wiki: feat(schema) 2026-05-18 — commit 58e2642.
 */
export function buildTouristAttractionSchema(destinationSlug: string): object | null {
  const data = TOURIST_ATTRACTION_DATA[destinationSlug];
  if (!data) return null;
  const attraction: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${BASE_URL}/destinations/${destinationSlug}#attraction`,
    name: data.name,
    alternateName: data.alternateName,
    url: `${BASE_URL}/destinations/${destinationSlug}`,
    description: data.description,
    geo: { '@type': 'GeoCoordinates', latitude: data.lat, longitude: data.lng },
    address: { '@type': 'PostalAddress', addressLocality: data.locality, addressRegion: 'Jawa Timur', addressCountry: 'ID' },
    touristType: 'International independent travellers',
    isAccessibleForFree: false,
    containedInPlace: { '@type': 'AdministrativeArea', name: 'East Java, Indonesia' },
    provider: { '@type': 'TravelAgency', name: 'Java Volcano Tour Operator', url: BASE_URL, identifier: '1102230032918' },
  };
  if (data.amenityFeatures) {
    attraction.amenityFeature = data.amenityFeatures.map(f => ({
      '@type': 'LocationFeatureSpecification', name: f.name, value: f.value,
    }));
  }
  return attraction;
}

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
