// src/lib/marketFaqs.ts — /markets/* canonical Q&A, now a thin READER over the content/ SSOT.
//
// Milestone 2 (2026-08-09): the Q&A copy itself moved to the Git SSOT
// (`content/faqs/markets-singapore.json`, `content/faqs/markets-malaysia.json`), which the
// market route pages read directly via `loadStaticPage(route).faq` — one array feeds both the
// visible FAQ and the FAQPage JSON-LD (AD-08). No Q&A text lives in this file any more.
//
// The module is kept (rather than deleted) because `src/lib/content/resolveFaqs.ts`
// still registers these routes in CANONICAL_FAQ_REGISTRY, and `resolvePageContent.ts` reports
// FAQ provenance from that registry for the CMS. Re-exporting the content/ set keeps that
// introspection truthful instead of letting a second, drifting copy of the Q&A exist.
import { loadFaqSet } from '@/lib/static-content';
import type { QaPair } from '@/lib/tourFaqs';

/** Read one content/ FAQ set as QaPair[]; [] when the key has no file. */
function faqSetItems(key: string): QaPair[] {
  return (loadFaqSet(key)?.items ?? []) as QaPair[];
}

export const SINGAPORE_MARKET_FAQS: QaPair[] = faqSetItems('markets-singapore');

export const MALAYSIA_MARKET_FAQS: QaPair[] = faqSetItems('markets-malaysia');
