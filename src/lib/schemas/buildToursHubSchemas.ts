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
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  ListItem,
  WithContext,
} from 'schema-dts';

import { AGGREGATE_RATING } from '@/lib/jvtoReviews';
import { getToursHubQaPairs } from '@/lib/tourFaqs';

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
 * CollectionPage wrapping an ItemList of TouristTrip items.
 * mainEntity points to the ItemList so AI engines extract the trip catalogue with the page as anchor.
 * isPartOf cross-refs the global Organization, anchoring the catalogue to the entity graph.
 */
export function buildToursHubCollectionPageSchema({ tours, hubPath, hubName, hubDescription }: HubArgs): WithContext<CollectionPage> {
  const url = hubUrl(hubPath);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: hubName,
    description: hubDescription,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
    about: { '@id': `${BASE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tours.length,
      itemListElement: tours.map((tour, i) => {
        const fullUrl = tour.url.startsWith('http') ? tour.url : `${BASE_URL}${tour.url}`;
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'TouristTrip',
            '@id': fullUrl,
            name: tour.name,
            description: tour.shortDesc,
            image: tour.image,
            url: fullUrl,
            provider: { '@id': `${BASE_URL}/#organization` },
            offers: {
              '@type': 'Offer',
              price: tour.priceFrom,
              priceCurrency: 'IDR',
              availability: 'https://schema.org/InStock',
            },
          },
        };
      }),
    },
  };
}

export function buildToursHubBreadcrumbSchema({ hubPath, hubName }: HubArgs): WithContext<BreadcrumbList> {
  const items: ListItem[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Tours', item: `${BASE_URL}/tours` },
  ];
  if (hubPath) {
    items.push({ '@type': 'ListItem', position: 3, name: hubName, item: hubUrl(hubPath) });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Hub-level FAQPage. /tours uses the canonical 3 hub Q&A pairs (Bali vs Surabaya, Ijen vs Bromo, shortest vs longest).
 * Departure-city hubs (/tours/from-bali, /tours/from-surabaya) reuse the same hub Q&A — they remain valid comparison
 * questions for arriving visitors and reinforce the cluster's discovery role.
 */
export function buildToursHubFaqSchema(): WithContext<FAQPage> {
  const pairs = getToursHubQaPairs();
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
}

/**
 * Standalone AggregateRating that explicitly references the Organization via @id.
 * Pass `liveStats` from `getGoogleReviewStats()` to override with live DB values.
 */
export function buildToursHubAggregateRatingSchema({
  hubPath,
  liveStats,
}: Pick<HubArgs, 'hubPath'> & { liveStats?: { rating: number; count: number } | null }): WithContext<AggregateRating> {
  const url = hubUrl(hubPath);
  const ratingValue = liveStats?.rating ?? AGGREGATE_RATING.ratingValue;
  const reviewCount = liveStats?.count ?? AGGREGATE_RATING.reviewCount;
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': `${url}#aggregate-rating`,
    itemReviewed: { '@id': `${BASE_URL}/#organization` },
    ratingValue: String(ratingValue),
    // schema.org types reviewCount as Integer; emitted as a numeric string (unchanged
    // runtime output) — the assertion narrows `string` to the numeric-string form.
    reviewCount: String(reviewCount) as `${number}`,
    bestRating: String(AGGREGATE_RATING.bestRating),
    worstRating: String(AGGREGATE_RATING.worstRating),
  };
}
