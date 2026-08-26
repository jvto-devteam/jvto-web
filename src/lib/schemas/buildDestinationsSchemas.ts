// src/lib/schemas/buildDestinationsSchemas.ts — Schema builders for /destinations cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — port pattern from rewrite's
// e:\test-2-2026\app\destinations\[slug]\page.tsx inline schemas.
//
// Per cluster_role_contracts.md Cluster 7: BreadcrumbList universal MH; per-destination
// reverse-lookup ItemList(tours-including) un-orphans the cluster; travel-guide handoff
// for Ijen / Bromo / Tumpak Sewu cross-cluster connections.
import type {
  ItemList,
  MonetaryAmount,
  TouristAttractionLeaf,
  WebPage,
  WithContext,
} from 'schema-dts';

import type { ToursByDestinationItem } from '@/lib/queries/toursByDestination';

const BASE_URL = 'https://javavolcano-touroperator.com';

// Ekosistem-only (single-content-source consolidation, 2026-08-20): TOURIST_ATTRACTION_DATA
// used to be a hardcoded slug-keyed map — a second, unsynchronised copy of facts that mostly
// already exist elsewhere in ekosistem's destination-knowledge/<slug>.content.json:
//   - lat/lng            -> derived live from `route_bbox` center (same GPX bbox the wiki
//                            comment below describes; `deriveRouteStats().bbox` on the page
//                            already exposes this — see destinations/[slug]/page.tsx).
//   - locality            -> `hub_region` (verified identical to the old hardcoded locality
//                            for all 5 destinations: Banyuwangi/Probolinggo/Lumajang/Jember).
//   - elevationMasl        -> `altitude` (verified identical: 2386 / 2329).
// name/alternateName/description/additionalProps/amenityFeatures/estimatedCost genuinely did
// NOT already exist in ekosistem in matching form (the record's own `name`/`description` are
// different editorial content, e.g. "Ijen Crater" vs the schema's "Kawah Ijen") — those moved
// to a new `tourist_attraction_facts` field on the 5 destination-knowledge content.json files.
// FALLBACK_* below hold the exact original literal/computed values as a last resort.
//
// Wiki: feat(schema) 58e2642 — TouristAttraction + BreadcrumbList for all 5 destinations.
// Geo coordinates from AllTrails GPX bbox centers per destination wiki pages.
type TouristAttractionFacts = {
  name: string;
  alternateName: string[];
  description: string;
  amenityFeatures?: Array<{ name: string; value: boolean }>;
  // Quantitative structured facts (wiki-sourced) — surfaced as schema.org
  // additionalProperty / estimatedCost so AI engines can quote trail difficulty and
  // entry cost directly instead of parsing prose.
  additionalProps?: Array<{ name: string; value: string; unitText?: string }>;
  estimatedCost?: { currency: string; value: string; name?: string };
};

const FALLBACK_TOURIST_ATTRACTION_FACTS: Record<string, TouristAttractionFacts> = {
  'ijen-crater': {
    name: 'Kawah Ijen',
    alternateName: ['Ijen Crater', 'Kawah Ijen Volcano'],
    description: "Active stratovolcano at 2,386 m with the world's largest acidic crater lake and the pre-dawn blue fire phenomenon. Night hike from Paltuding trailhead (~3 km). BBKSDA East Java regulatory authority. Health-certificate coordination is mandatory for every guest under BBKSDA SE.35/K2/BIDTEK.1/KSA/1/2024.",
    additionalProps: [
      { name: 'Crater rim elevation', value: '2386', unitText: 'm' },
      { name: 'Trail distance (one-way)', value: '3', unitText: 'km' },
      { name: 'Ascent time', value: '90', unitText: 'min' },
      { name: 'Difficulty level', value: 'Strenuous — steep rocky night hike from Paltuding trailhead' },
      { name: 'Crater lake acidity', value: '≈ pH 0 (highest-volume acidic crater lake on Earth)' },
      { name: 'Blue fire', value: 'Pre-dawn sulfuric-gas phenomenon; weather- and gas-dependent, not guaranteed' },
      { name: 'Health certificate', value: 'Mandatory for every guest before crater entry (BBKSDA SE.35/K2/BIDTEK.1/KSA/1/2024)' },
      { name: 'Best time to visit', value: 'Dry season (April–October); midnight departure for the blue-fire window' },
    ],
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
    additionalProps: [
      { name: 'Summit elevation', value: '2329', unitText: 'm' },
      { name: 'Sunrise viewpoint elevation', value: '2770', unitText: 'm' },
      { name: 'Difficulty level', value: 'Easy to moderate — short crater-rim walk, 4WD jeep access to the caldera' },
      { name: '4WD jeep', value: 'Mandatory for Penanjakan viewpoint and Sea of Sand access (included in JVTO packages)' },
      { name: 'Health certificate', value: 'Not required (no sulfuric-gas exposure at tourist viewing points)' },
      { name: 'Best time to visit', value: 'Dry season (April–October); pre-dawn 03:00–05:00 for sunrise' },
    ],
    estimatedCost: { currency: 'IDR', value: '160000', name: 'Bromo Tengger Semeru National Park entrance (foreign visitor, per person)' },
    amenityFeatures: [
      { name: 'Private 4WD jeep included', value: true },
      { name: 'Sunrise viewpoint access', value: true },
    ],
  },
  'tumpak-sewu-waterfall': {
    name: 'Tumpak Sewu Waterfall',
    alternateName: ['Coban Sewu', 'Tumpak Sewu'],
    description: 'Multi-tiered curtain waterfall (~120 m) in Lumajang, East Java. Accessible via jungle trail descending into the canyon. Optional swim at the base. Often combined with Ijen and Bromo tours.',
  },
  'madakaripura-waterfall': {
    name: 'Madakaripura Waterfall',
    alternateName: ['Air Terjun Madakaripura'],
    description: "Java's tallest waterfall in a narrow canyon gorge in Probolinggo. A 45-minute river-crossing trek through the gorge leads to the main fall. Guests get wet — rain poncho recommended.",
  },
  'papuma-beach': {
    name: 'Papuma Beach',
    alternateName: ['Tanjung Papuma'],
    description: 'White-sand beach with dramatic coastal rock formations and a headland viewpoint in Jember, East Java. Relatively uncrowded. Included in extended Bali-origin itineraries.',
  },
};

// Last-resort geo/locality/elevation, used only when the live ekosistem-sourced values
// (route_bbox center / hub_region / altitude) are unavailable. elevationMasl is present
// only for the 2 slugs that carried it in the original hardcoded map (preserves identical
// JSON-LD output for the other 3 — their record does have an `altitude`, but never emitted
// it here, so we don't start emitting it now).
const FALLBACK_GEO: Record<string, { lat: string; lng: string; locality: string; elevationMasl?: number }> = {
  'ijen-crater': { lat: '-8.0635', lng: '114.2362', locality: 'Banyuwangi', elevationMasl: 2386 },
  'mount-bromo': { lat: '-7.9308', lng: '112.9581', locality: 'Probolinggo', elevationMasl: 2329 },
  'tumpak-sewu-waterfall': { lat: '-8.2311', lng: '112.9189', locality: 'Lumajang' },
  'madakaripura-waterfall': { lat: '-7.8490', lng: '113.0137', locality: 'Probolinggo' },
  'papuma-beach': { lat: '-8.4300', lng: '113.5551', locality: 'Jember' },
};

/** Center of a [minLng, minLat, maxLng, maxLat] bbox, 4-decimal degrees (matches wiki precision). */
function centerFromBbox(bbox?: number[] | null): { lat: string; lng: string } | null {
  if (!bbox || bbox.length !== 4) return null;
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return {
    lat: (((minLat as number) + (maxLat as number)) / 2).toFixed(4),
    lng: (((minLng as number) + (maxLng as number)) / 2).toFixed(4),
  };
}

/**
 * TouristAttraction node + `estimatedCost`.
 *
 * schema.org defines `estimatedCost` on HowTo / Trip, not on Place subtypes such as
 * TouristAttraction, so the Bromo park-entrance fee is emitted on a property the type does
 * not declare. Preserved verbatim (the value is correct and useful to AI answer engines);
 * flagged in the task report — the spec-correct home for it is an `Offer` / `priceRange`.
 */
type TouristAttractionNode = WithContext<TouristAttractionLeaf> & {
  estimatedCost?: MonetaryAmount;
};

/**
 * TouristAttraction schema for destination pages.
 * Wiki: feat(schema) 2026-05-18 — commit 58e2642.
 *
 * `ecosystemData` is the already-fetched destination record (+ derived route bbox) from
 * destinations/[slug]/page.tsx — single-content-source migration, 2026-08-20. Nothing here
 * triggers a new fetch; geo/locality/elevation are read straight off what the page already
 * has, and `tourist_attraction_facts` (name/description/etc.) merges over the FALLBACK when
 * ekosistem hasn't been backfilled for a given destination yet.
 */
export function buildTouristAttractionSchema(
  destinationSlug: string,
  ecosystemData?: {
    altitude?: number | null;
    hub_region?: string | null;
    route_bbox?: number[] | null;
    tourist_attraction_facts?: Partial<TouristAttractionFacts> | null;
  } | null,
): TouristAttractionNode | null {
  const fallbackGeo = FALLBACK_GEO[destinationSlug];
  const fallbackFacts = FALLBACK_TOURIST_ATTRACTION_FACTS[destinationSlug];
  if (!fallbackGeo || !fallbackFacts) return null;

  const data: TouristAttractionFacts = { ...fallbackFacts, ...ecosystemData?.tourist_attraction_facts };
  const bboxCenter = centerFromBbox(ecosystemData?.route_bbox);
  const lat = bboxCenter?.lat ?? fallbackGeo.lat;
  const lng = bboxCenter?.lng ?? fallbackGeo.lng;
  const locality = ecosystemData?.hub_region ?? fallbackGeo.locality;
  // Only the 2 slugs that carried elevationMasl in the original hardcoded map emit geo.elevation
  // (preserves identical JSON-LD output for the other 3, whose record does have an `altitude`
  // but never surfaced it here).
  const elevationMasl = fallbackGeo.elevationMasl != null
    ? (ecosystemData?.altitude ?? fallbackGeo.elevationMasl)
    : undefined;

  const attraction: TouristAttractionNode = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${BASE_URL}/destinations/${destinationSlug}#attraction`,
    name: data.name,
    alternateName: data.alternateName,
    url: `${BASE_URL}/destinations/${destinationSlug}`,
    description: data.description,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
      // elevation in metres above sea level (schema.org GeoCoordinates.elevation)
      ...(elevationMasl ? { elevation: `${elevationMasl} m` } : {}),
    },
    address: { '@type': 'PostalAddress', addressLocality: locality, addressRegion: 'Jawa Timur', addressCountry: 'ID' },
    touristType: 'International independent travellers',
    isAccessibleForFree: false,
    containedInPlace: { '@type': 'AdministrativeArea', name: 'East Java, Indonesia' },
    // provider not valid on TouristAttraction (Place subtype). Link via subjectOf to Organization.
    subjectOf: { '@id': `${BASE_URL}/#organization` },
  };
  // Quantitative facts → additionalProperty (PropertyValue). Lets AI engines quote
  // trail difficulty / elevation / timing directly for "is Bromo safe / how long is
  // the Ijen hike" style queries. unitText carried where the value is a measurement.
  if (data.additionalProps?.length) {
    attraction.additionalProperty = data.additionalProps.map(p => ({
      '@type': 'PropertyValue',
      name: p.name,
      value: p.value,
      ...(p.unitText ? { unitText: p.unitText } : {}),
    }));
  }
  // Entry fee → estimatedCost (MonetaryAmount). Only emitted where a wiki-sourced
  // figure exists (Bromo park entrance); omitted rather than invented for others.
  if (data.estimatedCost) {
    attraction.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: data.estimatedCost.currency,
      value: data.estimatedCost.value,
      ...(data.estimatedCost.name ? { name: data.estimatedCost.name } : {}),
    };
  }
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
  // null = no dedicated travel-guide page for this destination; handoff schema is skipped.
  'mount-bromo': null,
  'tumpak-sewu-waterfall': null,
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
}): WithContext<ItemList> | null {
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
}): WithContext<WebPage> | null {
  const guidePath = DESTINATION_TO_TRAVEL_GUIDE[destinationSlug];
  if (!guidePath) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/destinations/${destinationSlug}#related-travel-guide`,
    url: `${BASE_URL}${guidePath}`,
    name: `Travel Guide for ${destinationName}`,
    isPartOf: { '@id': `${BASE_URL}/destinations/${destinationSlug}#attraction` },
  };
}
