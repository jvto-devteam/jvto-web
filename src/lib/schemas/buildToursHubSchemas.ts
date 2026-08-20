// src/lib/schemas/buildToursHubSchemas.ts — Server-side schema builders for /tours, /tours/from-bali, /tours/from-surabaya.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildToursHubSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// These three hub pages share AEO/GEO requirements per cluster_role_contracts.md Cluster 1 / Tours hub:
// CollectionPage + ItemList(TouristTrip) + BreadcrumbList + FAQPage.
//
// 2026-08-20: the standalone AggregateRating cross-ref to Organization that used to live
// here (buildToursHubAggregateRatingSchema, fed from getPublicAggregateRating()) is
// deleted per the schema-rendering-consolidation design's Bagian 1 — the rating is now
// an inline property of the Organization node itself, assembled once in jvto-ekosistem
// (build-organization.mjs) and read on these 3 pages via getOrganizationProfile() +
// toOrganizationReferenceOnly() (src/lib/seo/jsonld/builders.ts), which now carries
// `aggregateRating` through when it strips the node to a bare reference.
//
// Decoupled from rewrite's Tour type: caller passes pre-computed `url` (relative path) so live's existing
// URL builder convention is preserved. Caller is responsible for filtering tours by origin where needed.
import type {
  FAQPage,
  WithContext,
} from 'schema-dts';

import { getToursHubQaPairs, type QaPair } from '@/lib/tourFaqs';

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
