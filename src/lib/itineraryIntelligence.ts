// src/lib/itineraryIntelligence.ts — typed reader for the synced jvto-itinerary-core
// intelligence bundle (src/data/itinerary-intelligence/, populated by
// `npm run sync:itinerary` / .github/workflows/sync-itinerary-core.yml).
//
// Consumption point #1 (geo-feed → destination lat/lng + hazardousSubstance) is
// wired directly in src/lib/schemas/buildDestinationsSchemas.ts.
// Consumption points #2/#3 (operational events, standard-route-truth) are
// registered here as typed readers only — no UI/schema call site yet. Wire them
// up when a concrete feature needs them; don't force usage prematurely.
//
// IMPORTANT — graceful absence: the data directory does not exist until the first
// sync runs (see scripts/sync-itinerary-intelligence.mjs / the sync-itinerary-core
// workflow). Every reader below returns `null` (or `[]` for list readers) when a
// file is missing or fails to parse — never throws. Callers MUST fall back to
// their own DB/static values; this module is a pure enrichment source, never a
// hard dependency.
//
// Runtime note: this module does plain node:fs reads gated by existsSync, not
// static JSON imports — a static `import x from '@/data/.../geo-feed.json'`
// would fail to resolve (webpack/TS) whenever the file hasn't been synced yet,
// which defeats the whole point of graceful absence. Paths are resolved from
// `process.cwd()`, which Next.js sets to the project root for dev/build/start.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'src', 'data', 'itinerary-intelligence');

function readJsonSafe<T>(relPath: string): T | null {
  const abs = join(DATA_DIR, relPath);
  if (!existsSync(abs)) return null;
  try {
    return JSON.parse(readFileSync(abs, 'utf8')) as T;
  } catch (err) {
    console.warn(`[itineraryIntelligence] failed to parse ${relPath}: ${(err as Error).message}`);
    return null;
  }
}

// ── types (minimal typed surface over the producer's agent-contract) ─────────

export interface IntelligenceManifest {
  schema_version: number;
  source_mode?: string;
  generated_at?: string;
  [key: string]: unknown;
}

export interface GeoFeedSchemaOrgGeo {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export interface GeoFeedSchemaOrg {
  '@type': string;
  name: string;
  url: string | null;
  geo: GeoFeedSchemaOrgGeo;
  hazardousSubstance?: string;
}

export interface GeoFeedDestination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  geo_confidence?: string;
  geo_source?: string;
  schema_org: GeoFeedSchemaOrg;
}

export interface GeoFeedRouteNode {
  name: string;
  lat: number;
  lng: number;
  sequence: number;
  geo_confidence?: string;
}

export interface GeoFeedRoute {
  package_id: string;
  nodes: GeoFeedRouteNode[];
}

export interface GeoFeed {
  id: string;
  label?: string;
  status?: string;
  confidence?: string;
  generated_at?: string;
  destinations: GeoFeedDestination[];
  routes: GeoFeedRoute[];
  missing_coordinates?: Array<{ context: string; ref: string; reason: string }>;
}

export interface OperationalEvent {
  id: string;
  label?: string;
  status?: string;
  confidence?: string;
  event_type?: string;
  applies_when?: string[];
  typical_sequence?: string[];
  [key: string]: unknown;
}

export interface DestinationOverlay {
  destination: string;
  profile_ref?: string;
  operational_overlay?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface StandardRouteTruth {
  schema_version: number;
  purpose?: string;
  classification_taxonomy?: unknown;
  classification_tally?: unknown;
  packages: unknown[];
  gaps?: unknown[];
}

// ── manifest / availability ───────────────────────────────────────────────────

/**
 * Whether the itinerary-intelligence bundle has been synced at all. Use this to
 * gate any UI/feature that would otherwise render an empty state — schema
 * consumption (buildDestinationsSchemas.ts) does NOT need to check this itself,
 * since every reader below already degrades to null/[] on its own.
 */
export function getItineraryIntelligenceManifest(): IntelligenceManifest | null {
  return readJsonSafe<IntelligenceManifest>('manifest.json');
}

export function isItineraryIntelligenceAvailable(): boolean {
  return getItineraryIntelligenceManifest() !== null;
}

// ── geo-feed (consumption point #1 — wired in buildDestinationsSchemas.ts) ────

let geoFeedCache: GeoFeed | null | undefined;

export function getGeoFeed(): GeoFeed | null {
  if (geoFeedCache === undefined) {
    geoFeedCache = readJsonSafe<GeoFeed>('geo-feed.json');
  }
  return geoFeedCache;
}

/**
 * Look up a geo-feed destination entry by its jvto-web destination page path,
 * e.g. `/destinations/ijen-crater`. Returns undefined when the feed is absent
 * or has no entry for that url — callers fall back to their own data.
 */
export function getGeoFeedDestinationByUrl(destinationUrl: string): GeoFeedDestination | undefined {
  const feed = getGeoFeed();
  if (!feed) return undefined;
  return feed.destinations.find((d) => d.schema_org?.url === destinationUrl);
}

/**
 * Convenience wrapper: look up by bare destination slug (e.g. `ijen-crater`),
 * matching the `/destinations/{slug}` shape used across src/lib/schemas.
 */
export function getGeoFeedDestinationBySlug(destinationSlug: string): GeoFeedDestination | undefined {
  return getGeoFeedDestinationByUrl(`/destinations/${destinationSlug}`);
}

// ── operational events (consumption point #2 — reader only, no call site yet) ─

let operationalEventsCache: OperationalEvent[] | null | undefined;

export function getOperationalEvents(): OperationalEvent[] {
  if (operationalEventsCache === undefined) {
    operationalEventsCache = readJsonSafe<OperationalEvent[]>('07-operational-events.json');
  }
  return operationalEventsCache ?? [];
}

// ── destination operational overlays (reader only, no call site yet) ─────────

let destinationOverlaysCache: DestinationOverlay[] | null | undefined;

export function getDestinationOverlays(): DestinationOverlay[] {
  if (destinationOverlaysCache === undefined) {
    destinationOverlaysCache = readJsonSafe<DestinationOverlay[]>(
      'agent-contract/destination-operational-overlays.json',
    );
  }
  return destinationOverlaysCache ?? [];
}

export function getDestinationOverlay(destinationId: string): DestinationOverlay | undefined {
  return getDestinationOverlays().find((o) => o.destination === destinationId);
}

// ── standard route truth (consumption point #3 — reader only, no call site yet) ─

let standardRouteTruthCache: StandardRouteTruth | null | undefined;

export function getStandardRouteTruth(): StandardRouteTruth | null {
  if (standardRouteTruthCache === undefined) {
    standardRouteTruthCache = readJsonSafe<StandardRouteTruth>(
      'agent-contract/standard-route-truth.json',
    );
  }
  return standardRouteTruthCache;
}
