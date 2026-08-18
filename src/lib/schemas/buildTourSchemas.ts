// src/lib/schemas/buildTourSchemas.ts — Server-side schema builders for tour detail pages.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildTourSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Used by `(website)/tours/from-{bali,surabaya}/[slug]/page.tsx` so both routes inject identical
// AEO/GEO signal density (TouristTrip + DefinedTerm cross-refs + HowTo itinerary + FAQPage).
//
// Decoupled from rewrite's specific types: caller adapts its Prisma `packages` query result
// to the minimal seed contracts below. This keeps the schema builder portable across stacks.
import type {
  FAQPage,
  WithContext,
} from 'schema-dts';

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
}): WithContext<FAQPage> | null {
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
