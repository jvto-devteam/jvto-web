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

import type { ResolvedFaq } from '@/lib/tourFaqResolution';

// Must match the origin the PDP uses for its other @ids (#webpage, #breadcrumb,
// #product, #tour), which is env-driven. A hardcoded literal here would put the
// FAQPage on a different origin than the rest of the graph on any deployment
// where NEXT_PUBLIC_SITE_URL differs.
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://javavolcano-touroperator.com';

/**
 * Minimal tour shape this module needs. Live's pages should adapt their Prisma `packages` row
 * (or composite type from `getWebPackageDetailBySlug`) to this shape.
 *
 * `ijenRelevant` was inherited from tourFaqs.TourFaqSeed until T05B; it is declared inline now
 * that the FAQ spine no longer lives in this repo. It remains THE Ijen gate for the whole page —
 * the schema augment, the FAQ payload and the requirements accordion all read this one value.
 */
export interface TourDetailSeed {
  /** True for any tour touching Kawah Ijen. Derived once per page by adaptToTourDetailSeed. */
  ijenRelevant: boolean;
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
 * FAQPage built from the ONE array the page also renders (backlog T05B).
 *
 * It used to concatenate three sources — the local spine, narrative-claim pillars, and package
 * FAQs — while the page rendered only the first. That made the schema assert content no reader
 * ever saw: 905 of 1162 Question nodes site-wide had no on-page counterpart, 779 of them on
 * these 17 tour pages. Pillars are taxonomy labels ("Safety-led"), not questions, so they were
 * never legitimate Question.name values.
 *
 * Now the caller resolves the visible list once via resolveVisibleTourFaqs() and passes it here
 * unchanged. If a Q&A is in this node it is on the page, across both visible surfaces (the Quick
 * Answers cluster and the Ijen requirements accordion).
 *
 * The `@id` is safe against the ekosistem dangling-reference audit: a top-level node registers
 * its @id as *defined*, and definitions aggregate across every <script> block on the page, so it
 * counts even though this FAQPage ships in its own tag. The one hazard is a duplicate — dedupe
 * runs per <JsonLd> call, so nothing else on these routes may emit `#faq`.
 */
export function buildTourFaqSchema({
  route,
  visibleFaqs,
}: {
  /** Absolute path of the page, e.g. "/tours/from-bali/bromo-ijen-3d2n". */
  route: string;
  visibleFaqs: readonly ResolvedFaq[];
}): WithContext<FAQPage> | null {
  if (visibleFaqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BASE_URL}${route}#faq`,
    mainEntity: visibleFaqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
