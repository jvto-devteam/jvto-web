// src/lib/content/resolveFaqs.ts
// Created 2026-04-29 (AEO/GEO port Phase 5) — deterministic FAQ source resolution.
//
// Precedence (highest → lowest):
//   1. narrative_claims (DB, primary_page-wired) — canonical brand voice, AEO-tuned
//   2. canonical hardcoded Q&A files (HOMEPAGE_FAQS, LEGAL_FAQS, etc.) — static AEO content not yet in DB
//   3. CMS content.faq — admin-managed fallback
//
// Single FAQPage per page rule: pages with a higher-precedence source MUST suppress lower-precedence
// FAQPage emissions (especially the CMS one auto-injected by PageJsonLdCombined).
import { getNarrativeClaimsByPage } from '@/lib/queries/narrativeClaims';
import { HOMEPAGE_FAQS } from '@/lib/homepageFaqs';
import {
  LEGAL_FAQS,
  POLICE_SAFETY_FAQS,
  PRESS_RECOGNITION_FAQS,
  VERIFY_HUB_FAQS,
} from '@/lib/verifyFaqs';
import { BEST_TIME_FAQS } from '@/lib/travelGuideBestTimeFaqs';
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
 * Hardcoded canonical FAQ registry. Adding a new canonical Q&A file = one entry here.
 * Each value is a thunk so files load lazily (avoids unused-import warnings on routes that don't need them).
 */
const CANONICAL_FAQ_REGISTRY: Record<string, () => QaPair[]> = {
  '/': () => HOMEPAGE_FAQS,
  '/verify-jvto': () => VERIFY_HUB_FAQS,
  '/verify-jvto/legal': () => LEGAL_FAQS,
  '/verify-jvto/police-safety': () => POLICE_SAFETY_FAQS,
  '/verify-jvto/press-recognition': () => PRESS_RECOGNITION_FAQS,
  '/travel-guide/best-time-to-visit': () => BEST_TIME_FAQS,
  // /markets/singapore and /markets/malaysia are intentionally NOT registered here —
  // those routes source their FAQ set directly from jvto-ekosistem's rendered market
  // content (content.faqs, via ecosystemContent/markets.ts) and build their FAQPage
  // JSON-LD inline in page.tsx, bypassing this resolver entirely.
};

/** Returns canonical FAQ for a route, or empty array if none registered. */
function getCanonicalForRoute(route: string): QaPair[] {
  const factory = CANONICAL_FAQ_REGISTRY[route];
  return factory ? factory() : [];
}

/**
 * Resolve the canonical FAQ source for a route.
 * Centralises the precedence rule so every page-level builder agrees.
 */
export async function resolveFaqsForPage(route: string): Promise<FaqResolution> {
  // 1. narrative_claims wired to this primary_page?
  const claims = await getNarrativeClaimsByPage(route);
  const usableClaims = claims.filter((c) => c.pillar && c.core_claim);
  if (usableClaims.length) {
    return {
      source: 'narrative_claims',
      faqs: usableClaims.map((c) => ({
        question: c.pillar as string,
        answer: c.core_claim as string,
      })),
      suppressCmsFaq: true,
      origin: `narrative_claims (${usableClaims.length} rows wired to primary_page='${route}')`,
    };
  }

  // 2. Hardcoded canonical Q&A registered for this route?
  const canonical = getCanonicalForRoute(route);
  if (canonical.length) {
    return {
      source: 'canonical',
      faqs: canonical,
      suppressCmsFaq: true,
      origin: `canonical hardcoded registry (${canonical.length} Q&A)`,
    };
  }

  // 3. Fallback: let CMS FAQ from content.faq render via PageJsonLdCombined as-is.
  return {
    source: 'cms',
    faqs: [],
    suppressCmsFaq: false,
    origin: 'CMS content.faq (fallback)',
  };
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
