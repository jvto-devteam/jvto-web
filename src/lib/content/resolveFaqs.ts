// src/lib/content/resolveFaqs.ts
//
// buildResolvedFaqSchema() stays: markets/*/page.tsx (ecosystemContent/markets.ts)
// still uses it to format an already-resolved {source, faqs} object into a
// FAQPage JSON-LD node.
//
// resolveFaqsForPage() — the Prisma narrative_claims / hardcoded-registry
// precedence resolver this file used to also export — was retired 2026-08-18
// as part of the single-content-source (ekosistem-only) consolidation. Its
// last 6 callers (homepage + 5 verify-jvto pages) all had ecosystem source
// files with real FAQ content, and PageJsonLdCombined's ecosystem-first
// branch was already silently superseding this resolver's output on every
// one of them (confirmed by diffing live JSON-LD against each source) — so
// removing it changes nothing observable, only deletes now-dead Prisma
// reads and three hardcoded FAQ-array files (homepageFaqs.ts, verifyFaqs.ts,
// travelGuideBestTimeFaqs.ts, all deleted alongside this change).
import type { QaPair } from '@/lib/tourFaqs';

const BASE_URL = 'https://javavolcano-touroperator.com';

export type FaqSource = 'narrative_claims' | 'canonical' | 'cms' | 'none';

export interface FaqResolution {
  /** Which source supplied the resolved FAQs. */
  source: FaqSource;
  /** Resolved {question, answer} pairs (empty when source='none'). */
  faqs: QaPair[];
  /** Indicates whether CMS-FAQ injection should be suppressed by the page. True when source overrides CMS. */
  suppressCmsFaq: boolean;
  /** Human-readable origin description for telemetry/debugging. */
  origin: string;
}

/**
 * Build a FAQPage JSON-LD node from resolved FAQs. Returns null when source is 'cms' or 'none' —
 * those rely on PageJsonLdCombined's built-in buildFaqJsonLdFromContent injection.
 */
export function buildResolvedFaqSchema(
  resolution: FaqResolution,
  route: string,
): Record<string, unknown> | null {
  if (!resolution.faqs.length) return null;
  const pageUrl = route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: resolution.faqs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
}
