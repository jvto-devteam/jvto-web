// src/lib/schemas/buildToursHubSchemas.ts — Server-side schema builders for /tours, /tours/from-bali, /tours/from-surabaya.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildToursHubSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// These three hub pages share AEO/GEO requirements per cluster_role_contracts.md Cluster 1 / Tours hub:
// CollectionPage + ItemList(TouristTrip) + BreadcrumbList + FAQPage + AggregateRating cross-ref to Organization.
//
// Decoupled from rewrite's Tour type: caller passes pre-computed `url` (relative path) so live's existing
// URL builder convention is preserved. Caller is responsible for filtering tours by origin where needed.
import type {
  AggregateRating,
  FAQPage,
  WithContext,
} from 'schema-dts';

import { BEST_RATING, WORST_RATING } from '@/lib/publicContent/getAggregateRating';
import { getToursHubQaPairs, type QaPair } from '@/lib/tourFaqs';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * Minimal tour shape this module needs. Caller (live's page handler) provides this via
 * adapter from its own typed objects (e.g., from Prisma `packages` query result).
 */
export interface TourHubSeed {
  name: string;
  shortDesc: string;
  image: string;
  priceFrom: number;
  /** Pre-computed relative URL path, e.g., "/tours/from-bali/bromo-ijen-3d2n". */
  url: string;
}

interface HubArgs {
  /** The tours to feature on this hub. /tours = all; /tours/from-bali = Bali-origin only; /tours/from-surabaya = Surabaya-origin only. */
  tours: TourHubSeed[];
  /** Slug suffix for the hub URL. '' = root /tours; 'from-bali' = /tours/from-bali; 'from-surabaya' = /tours/from-surabaya. */
  hubPath: '' | 'from-bali' | 'from-surabaya';
  /** Display name of the hub. */
  hubName: string;
  /** Hub-level description for AEO. */
  hubDescription: string;
}

function hubUrl(hubPath: HubArgs['hubPath']): string {
  return hubPath ? `${BASE_URL}/tours/${hubPath}` : `${BASE_URL}/tours`;
}

/**
 * Hub-level FAQPage. /tours uses the canonical 3 hub Q&A pairs (Bali vs Surabaya, Ijen vs Bromo, shortest vs longest).
 * Departure-city hubs (/tours/from-bali, /tours/from-surabaya) reuse the same hub Q&A — they remain valid comparison
 * questions for arriving visitors and reinforce the cluster's discovery role.
 *
 * `pairs`, when passed, overrides the hardcoded fallback in getToursHubQaPairs() with the
 * ekosistem-sourced content.payload.pageContent.hubFaqPairs (single-content-source consolidation).
 */
export function buildToursHubFaqSchema(pairs?: QaPair[]): WithContext<FAQPage> {
  const finalPairs = getToursHubQaPairs(pairs);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: finalPairs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
}

/**
 * Standalone AggregateRating that explicitly references the Organization via @id.
 *
 * `liveStats` MUST come from `getPublicAggregateRating()` (Google Maps only — the
 * one figure allowed to be presented as the JVTO rating). No hardcoded fallback:
 * returns null when no source can answer, and the caller omits the node.
 */
export function buildToursHubAggregateRatingSchema({
  hubPath,
  liveStats,
}: Pick<HubArgs, 'hubPath'> & { liveStats?: { rating: number; count: number } | null }): WithContext<AggregateRating> | null {
  if (!liveStats) return null;
  const url = hubUrl(hubPath);
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': `${url}#aggregate-rating`,
    itemReviewed: { '@id': `${BASE_URL}/#organization` },
    ratingValue: String(liveStats.rating),
    // schema.org types reviewCount as Integer; emitted as a numeric string (unchanged
    // runtime output) — the assertion narrows `string` to the numeric-string form.
    reviewCount: String(liveStats.count) as `${number}`,
    bestRating: String(BEST_RATING),
    worstRating: String(WORST_RATING),
  };
}
