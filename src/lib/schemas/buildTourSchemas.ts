// src/lib/schemas/buildTourSchemas.ts — Server-side schema builders for tour detail pages.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildTourSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Used by `(website)/tours/from-{bali,surabaya}/[slug]/page.tsx` so both routes inject identical
// AEO/GEO signal density (TouristTrip + DefinedTerm cross-refs + HowTo itinerary + FAQPage).
//
// Decoupled from rewrite's specific types: caller adapts its Prisma `packages` query result
// to the minimal seed contracts below. This keeps the schema builder portable across stacks.
import { getTourSpineQaPairs, type TourFaqSeed } from '@/lib/tourFaqs';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * Minimal tour shape this module needs. Live's pages should adapt their Prisma `packages` row
 * (or composite type from `getWebPackageDetailBySlug`) to this shape.
 */
export interface TourDetailSeed extends TourFaqSeed {
  name: string;
  shortDesc: string;
  image: string;
  priceFrom: number;
  /** Duration like "3D2N" — first numeric used to compute ISO totalTime PnD. */
  duration: string;
  /** Origin city for description string — e.g., "Surabaya" or "Bali". */
  origin: string;
  inclusions: string[];
  /** Day-by-day itinerary for HowTo schema. Empty array → HowTo skipped. */
  itinerary: Array<{
    title?: string;
    day?: string;
    summary?: string;
  }>;
}

/**
 * Optional DB-enriched fields. When live page fetches package detail via Prisma, map these fields.
 * If null, builder falls back to TourDetailSeed equivalents where applicable.
 */
export interface PackageDbDataSeed {
  ai_summary?: string | null;
  suitable_for?: string | null;
  aggregate_rating_value?: number | null;
  aggregate_rating_count?: number | null;
}

export interface FullPackageDbDataSeed {
  destinations: Array<{ name: string; slug: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

/** Minimal narrative-claim shape (matches live's narrative_claims table after Phase 3 Prisma model add). */
export interface NarrativeClaimLite {
  id: string;
  pillar: string;
  core_claim: string;
}

interface BuildArgs {
  tour: TourDetailSeed;
  dbData: PackageDbDataSeed | null;
  fullData: FullPackageDbDataSeed | null;
  routePrefix: 'tours/from-bali' | 'tours/from-surabaya';
  bareSlug: string;
}

// Map tour properties → relevant DEFINED_TERMS @ids that AI/AEO graphs should associate with this trip.
// All tours mention NIB+TDUP+HPWKI (operator-level). Ijen tours add KTA+BBKSDA+SE1658 (regulatory chain).
// POLPAR mentioned for any tour (founder is active POLPAR officer). Refs are stable @ids
// declared in lib/schemas/entityGraph.ts and globally injected via (website)/layout.tsx.
function buildMentions(tour: TourDetailSeed) {
  const mentions: { '@id': string }[] = [
    { '@id': `${BASE_URL}/#term-nib` },
    { '@id': `${BASE_URL}/#term-tdup` },
    { '@id': `${BASE_URL}/#term-hpwki` },
    { '@id': `${BASE_URL}/#term-polpar` },
  ];
  if (tour.ijenRelevant) {
    mentions.push(
      { '@id': `${BASE_URL}/#term-kta` },
      { '@id': `${BASE_URL}/#term-bbksda` },
      { '@id': `${BASE_URL}/#term-se1658` },
    );
  }
  return mentions;
}

export function buildTourTouristTripSchema({ tour, dbData, fullData, routePrefix, bareSlug }: BuildArgs) {
  const tourUrl = `${BASE_URL}/${routePrefix}/${bareSlug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${BASE_URL}/#tour-${routePrefix.replace(/\//g, '-')}-${bareSlug}`,
    url: tourUrl,
    name: tour.name,
    description: dbData?.ai_summary ?? tour.shortDesc,
    image: tour.image,
    touristType: dbData?.suitable_for ?? 'Adventure travelers',
    provider: { '@id': `${BASE_URL}/#organization` },
    // Founder cross-ref reinforces police-led safety story at the trip level.
    subjectOf: { '@id': `${BASE_URL}/#agung-sambuko` },
    // Cross-reference globally-injected DefinedTerms — gives AI a stable entity graph
    // anchoring this trip to NIB/TDUP/HPWKI/POLPAR (always) and KTA/BBKSDA/SE1658 (Ijen).
    mentions: buildMentions(tour),
    ...(fullData?.destinations.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: fullData.destinations.length,
            itemListElement: fullData.destinations.map((d, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: d.name,
              url: `${BASE_URL}/destinations/${d.slug}`,
            })),
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: tour.priceFrom,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}/#organization` },
    },
    ...(dbData?.aggregate_rating_value && dbData.aggregate_rating_count && dbData.aggregate_rating_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: dbData.aggregate_rating_value,
            reviewCount: dbData.aggregate_rating_count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

// HowTo schema: itinerary execution as ordered steps. AI engines treat HowTo as
// structured procedural answer surface; very valuable for "what does day X of {tour} look like" queries.
export function buildTourHowToSchema({ tour, routePrefix, bareSlug }: BuildArgs) {
  if (!tour.itinerary?.length) return null;
  const tourUrl = `${BASE_URL}/${routePrefix}/${bareSlug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${tourUrl}#howto`,
    name: `How to do the ${tour.name} itinerary`,
    description: `Day-by-day execution plan for the ${tour.duration} ${tour.name} private tour from ${tour.origin}.`,
    totalTime: `P${tour.duration.match(/\d+/)?.[0] ?? '1'}D`,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'IDR',
      value: tour.priceFrom,
    },
    supply: tour.inclusions.map((item) => ({ '@type': 'HowToSupply', name: item })),
    step: tour.itinerary.map((day, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: day.title ?? day.day ?? `Day ${i + 1}`,
      text: day.summary ?? '',
      url: `${tourUrl}#day-${i + 1}`,
    })),
  };
}

export function buildTourBreadcrumbSchema({ tour, routePrefix, bareSlug }: BuildArgs) {
  const cityLabel = routePrefix === 'tours/from-bali' ? 'From Bali' : 'From Surabaya';
  const cityHubUrl = `${BASE_URL}/${routePrefix}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: `${BASE_URL}/tours` },
      { '@type': 'ListItem', position: 3, name: cityLabel, item: cityHubUrl },
      { '@type': 'ListItem', position: 4, name: tour.name, item: `${BASE_URL}/${routePrefix}/${bareSlug}` },
    ],
  };
}

/**
 * FAQPage composed from three sources, in priority order so AI-extracted answers favor the most-curated content:
 *   1. Tour spine Q&A pairs (canonical, hand-written; identical to AnswerBlock copy on the page).
 *   2. Narrative claims relevant to the tour (filtered by tour properties — see tour-relevance rules).
 *   3. Published package_faqs from DB (caller filters is_published = true).
 *
 * Returns null only if all three sources are empty (extremely rare — spine Q&A always non-empty).
 */
export function buildTourFaqSchema({
  tour,
  fullData,
  narrativeClaims,
}: {
  tour: TourDetailSeed;
  fullData: FullPackageDbDataSeed | null;
  narrativeClaims: NarrativeClaimLite[];
}) {
  const spinePairs = getTourSpineQaPairs(tour);
  const claimPairs = narrativeClaims.map((c) => ({ question: c.pillar, answer: c.core_claim }));
  const dbPairs = (fullData?.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer }));
  const all = [...spinePairs, ...claimPairs, ...dbPairs];
  if (!all.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
}

/**
 * Picks narrative_claims relevant to the tour from the global C1–C9 set.
 *   - Always include: C1 (Safety-led), C2 (Private tours), C3 (All-inclusive), C5 (Proof-first), C7 (Our Team)
 *   - Ijen tours: add C4 (Ijen Health Screening)
 * Caller passes `getAllNarrativeClaims()` result; this function filters in-memory (no DB).
 */
export function pickTourRelevantClaims(
  tour: TourFaqSeed,
  allClaims: NarrativeClaimLite[],
): NarrativeClaimLite[] {
  const relevantIds = new Set(['C1', 'C2', 'C3', 'C5', 'C7']);
  if (tour.ijenRelevant) relevantIds.add('C4');
  return allClaims.filter((c) => relevantIds.has(c.id));
}
