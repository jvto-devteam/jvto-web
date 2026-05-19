// src/lib/schemas/buildDestinationsSchemas.ts — Schema builders for /destinations cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — port pattern from rewrite's
// e:\test-2-2026\app\destinations\[slug]\page.tsx inline schemas.
//
// Per cluster_role_contracts.md Cluster 7: BreadcrumbList universal MH; per-destination
// reverse-lookup ItemList(tours-including) un-orphans the cluster; travel-guide handoff
// for Ijen / Bromo / Tumpak Sewu cross-cluster connections.
import type { ToursByDestinationItem } from '@/lib/queries/toursByDestination';
import type { DestinationDetail } from '@/interfaces';

const BASE_URL = 'https://javavolcano-touroperator.com';

const DESTINATION_GEO: Record<string, { lat: number; lng: number; hazardousSubstance?: string }> = {
  'ijen-crater':            { lat: -8.0584, lng: 114.2420, hazardousSubstance: 'Sulfur dioxide (SO₂) up to 50,000 ppm' },
  'mount-bromo':            { lat: -7.9425, lng: 112.9531 },
  'madakaripura-waterfall': { lat: -7.9136, lng: 113.0472 },
  'tumpak-sewu-waterfall':  { lat: -8.2342, lng: 112.9158 },
  'papuma-beach':           { lat: -8.2780, lng: 113.6283 },
};

/**
 * GeoCoordinates + optional hazardousSubstance stub for each destination.
 * Emitted as a standalone Place node (distinct @id) so it doesn't collide with
 * the TouristAttraction node already stored in DB schema_json.
 */
export function buildDestinationGeoSchema({
  destinationSlug,
  destinationName,
}: {
  destinationSlug: string;
  destinationName: string;
}) {
  const geo = DESTINATION_GEO[destinationSlug];
  if (!geo) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${BASE_URL}/destinations/${destinationSlug}#place-geo`,
    name: destinationName,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    },
    ...(geo.hazardousSubstance ? { hazardousSubstance: geo.hazardousSubstance } : {}),
  };
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

/**
 * TouristAttraction node for /destinations/{slug}.
 * Built from live DestinationDetail fields so it stays current with the DB,
 * rather than relying on schema_json (which was missing this node for ijen-crater).
 */
export function buildTouristAttractionSchema(
  data: DestinationDetail,
  slug: string,
) {
  const pageUrl = `${BASE_URL}/destinations/${slug}`;
  const imageUrl = data.banner?.url
    ? data.banner.url.startsWith('http') ? data.banner.url : `${BASE_URL}${data.banner.url}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': pageUrl,
    name: data.name,
    description: data.seo_description?.trim() || data.summary || data.highlight || data.description,
    url: pageUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    },
    ...(data.tags?.length ? { keywords: data.tags.join(', ') } : {}),
    isAccessibleForFree: !data.permit_required,
    touristType: ['Adventure travelers', 'Hikers', 'Photographers'],
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: data.region || data.province || 'East Java',
      containedInPlace: { '@type': 'Country', name: 'Indonesia' },
    },
  };
}

/**
 * FAQPage for /destinations/{slug}.
 * Derives Q&A pairs from structured fields (permit, guide, difficulty, gear).
 * Skips any item where the answer field is empty/null.
 */
export function buildDestinationFaqSchema(data: DestinationDetail, slug: string) {
  const pairs: Array<{ q: string; a: string }> = [];

  if (data.permit_details?.trim()) {
    pairs.push({
      q: `Is a permit or health certificate required to visit ${data.name}?`,
      a: data.permit_details.trim(),
    });
  }

  if (data.physical_requirements?.trim()) {
    pairs.push({
      q: `How physically demanding is the ${data.name} trek?`,
      a: `${data.difficulty_level ? `Difficulty: ${data.difficulty_level}. ` : ''}${data.physical_requirements.trim()}`,
    });
  }

  if (data.required_gear?.length) {
    pairs.push({
      q: `What gear and equipment do I need for ${data.name}?`,
      a: data.required_gear.join(', ') + '.',
    });
  }

  if (data.tips_for_visitors?.trim()) {
    pairs.push({
      q: `What should I know before visiting ${data.name}?`,
      a: data.tips_for_visitors.trim(),
    });
  }

  if (!pairs.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/destinations/${slug}#faq`,
    mainEntity: pairs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
