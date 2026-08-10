// src/lib/schemas/buildDestinationsSchemas.ts — Schema builders for /destinations cluster.
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — port pattern from rewrite's
// e:\test-2-2026\app\destinations\[slug]\page.tsx inline schemas.
//
// PACKAGE 06 (2026-08-06): the per-destination TouristAttraction facts + the
// travel-guide handoff target now come from the static-content SSOT
// (content/pages/destinations/<slug>.json), passed in by the page. The former
// hardcoded TOURIST_ATTRACTION_DATA / DESTINATION_TO_TRAVEL_GUIDE maps are gone.
// Only the geo coordinates stay data-sourced: the synced geo-feed override wins,
// otherwise the DB lat/lng passed by the page is used.
//
// Per cluster_role_contracts.md Cluster 7: BreadcrumbList universal MH; per-destination
// reverse-lookup ItemList(tours-including) un-orphans the cluster; travel-guide handoff
// for Ijen / Bromo / Tumpak Sewu cross-cluster connections.
import type { ToursByDestinationItem } from '@/lib/queries/toursByDestination';
import { getGeoFeedDestinationBySlug } from '@/lib/itineraryIntelligence';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * The `attraction` section object from content/pages/destinations/<slug>.json.
 * Loose extra keys on the section are ignored; only these fields feed the schema.
 */
export interface ContentAttraction {
  attraction_name: string;
  alternate_names: string[];
  body_md: string;
  additional_properties?: Array<{ name: string; value: string; unitText?: string }>;
  amenity_features?: Array<{ name: string; value: boolean }>;
  estimated_cost?: { currency: string; value: string; name?: string };
}

/**
 * TouristAttraction schema for destination pages.
 * Wiki: feat(schema) 2026-05-18 — commit 58e2642.
 *
 * Facts (name / alternateName / description / additionalProperty / amenityFeature /
 * estimatedCost) come from the content `attraction` section. Coordinates: the synced
 * geo-feed (jvto-itinerary-core, src/data/itinerary-intelligence/geo-feed.json) wins
 * when it carries an entry for this destination's `/destinations/{slug}` url — its
 * lat/lng (TomTom-verified where available) and hazardousSubstance (currently Ijen
 * only) take precedence; otherwise the DB lat/lng passed in `coords` is used.
 * getGeoFeedDestinationBySlug() degrades to `undefined` (never throws) when the
 * intelligence bundle hasn't been synced, so unsynced environments fall back cleanly.
 *
 * geo.elevation is deliberately NOT emitted (facts-lock: never surface the DB altitude
 * for Ijen; the published crater-lake elevation lives in additional_properties).
 */
export function buildTouristAttractionSchema(
  slug: string,
  attraction: ContentAttraction,
  coords: { lat?: string | number | null; lng?: string | number | null },
): object | null {
  if (!attraction) return null;

  const geoFeedEntry = getGeoFeedDestinationBySlug(slug);
  const rawLat = geoFeedEntry ? geoFeedEntry.lat : coords.lat;
  const rawLng = geoFeedEntry ? geoFeedEntry.lng : coords.lng;
  const hasGeo =
    rawLat != null && rawLng != null && String(rawLat) !== '' && String(rawLng) !== '';
  // No static/DB equivalent exists for hazardousSubstance yet — the geo-feed is the
  // only source, so absence (unsynced bundle, or a destination the feed doesn't flag)
  // simply omits the field, matching pre-pipeline behavior exactly.
  const hazardousSubstance = geoFeedEntry?.schema_org?.hazardousSubstance;

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${BASE_URL}/destinations/${slug}#attraction`,
    name: attraction.attraction_name,
    alternateName: attraction.alternate_names,
    url: `${BASE_URL}/destinations/${slug}`,
    description: attraction.body_md,
    ...(hasGeo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: String(rawLat),
            longitude: String(rawLng),
          },
        }
      : {}),
    address: { '@type': 'PostalAddress', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
    touristType: 'International independent travellers',
    isAccessibleForFree: false,
    containedInPlace: { '@type': 'AdministrativeArea', name: 'East Java, Indonesia' },
    // provider not valid on TouristAttraction (Place subtype). Link via subjectOf to Organization.
    subjectOf: { '@id': `${BASE_URL}/#organization` },
  };

  if (hazardousSubstance) {
    node.hazardousSubstance = hazardousSubstance;
  }
  // Quantitative facts → additionalProperty (PropertyValue). Lets AI engines quote
  // trail difficulty / elevation / timing directly for "is Bromo safe / how long is
  // the Ijen hike" style queries. unitText carried where the value is a measurement.
  if (attraction.additional_properties?.length) {
    node.additionalProperty = attraction.additional_properties.map((p) => ({
      '@type': 'PropertyValue',
      name: p.name,
      value: p.value,
      ...(p.unitText ? { unitText: p.unitText } : {}),
    }));
  }
  // Entry fee → estimatedCost (MonetaryAmount). Only emitted where the content carries
  // a figure (Bromo park entrance); omitted rather than invented for others.
  if (attraction.estimated_cost) {
    node.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: attraction.estimated_cost.currency,
      value: attraction.estimated_cost.value,
      ...(attraction.estimated_cost.name ? { name: attraction.estimated_cost.name } : {}),
    };
  }
  if (attraction.amenity_features?.length) {
    node.amenityFeature = attraction.amenity_features.map((f) => ({
      '@type': 'LocationFeatureSpecification',
      name: f.name,
      value: f.value,
    }));
  }
  return node;
}

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
 * Cross-cluster handoff: if the destination content declares a related travel-guide
 * page (its `handoff.travel_guide.href`), emit a WebPage cross-ref so AI engines can
 * discover the destination → travel-guide link as a graph edge. Returns null when the
 * content carries no handoff link.
 */
export function buildDestinationTravelGuideHandoffSchema({
  slug,
  name,
  href,
}: {
  slug: string;
  name: string;
  href: string | null;
}) {
  if (!href) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/destinations/${slug}#related-travel-guide`,
    url: `${BASE_URL}${href}`,
    name: `Travel Guide for ${name}`,
    isPartOf: { '@id': `${BASE_URL}/destinations/${slug}` },
  };
}
