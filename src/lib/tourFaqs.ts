// src/lib/tourFaqs.ts — Q&A shapes and the /tours hub fallback pairs.
//
// SCOPE NARROWED BY T05B (2026-09-11). This file used to own the tour-detail FAQ spine:
// nine hand-written pairs carrying a hardcoded NIB, an ISIC provider id, a BBKSDA circular
// number, doctor and hotel names, and a review summary that averaged ratings across platforms
// unweighted — which contradicted the owner decision of 2026-08-15 that the public rating is
// the Google Maps figure and never a blend.
//
// All of that now lives in jvto-ekosistem and arrives pre-resolved through
// @/lib/ecosystemContent/tourSpineFaq. This file is no longer a source of truth for any fact;
// it holds the shared QaPair shape and the /tours hub fallback, nothing more.
//
// The hub pairs below are a FALLBACK only: /tours passes ekosistem's pc.hubFaqPairs when it has
// them (see (website)/tours/page.tsx), and these are used solely when it does not. Migrating the
// hub to the same canonical route is out of T05B's scope.

export interface QaPair {
  question: string;
  answer: string;
  /** Badge label shown under the answer in the client UI; ignored by schema. */
  uiMeta?: string;
  /** Route for the badge link; renders badge as <Link> when present. */
  uiLink?: string;
}

/**
 * Hub-level Q&A pairs for /tours discovery page.
 * These answer the three highest-intent comparison questions visitors arrive with:
 * choosing departure city, distinguishing Ijen vs Bromo, and picking duration.
 */
export function getToursHubQaPairs(pairs?: QaPair[]): QaPair[] {
  if (pairs && pairs.length > 0) return pairs;
  return [
    {
      question: 'Should I depart from Bali or Surabaya?',
      answer:
        'Surabaya is the default starting point — direct overland access to Bromo (~3 hrs) and Ijen (~5 hrs) with no ferry. Bali departures add ' +
        'the Gilimanuk–Ketapang ferry (45 min each way) plus 1–2 extra hours overland; choose Bali only if you are already vacationing there. ' +
        'Both options run on JVTO private vehicles with no shared transport at any point.',
      uiMeta: 'See /tours/from-bali vs /tours/from-surabaya',
    },
    {
      question: 'Which tours include Ijen Blue Fire vs Bromo only?',
      answer:
        'Bromo-only tours are the 1D1N and 2D1N options — no health screening required. Ijen tours start at 2D1N and trigger the BBKSDA ' +
        'SE.35/K2/BIDTEK.1/KSA/1/2024 health screening protocol coordinated by JVTO with Dr. Ahmad Irwandanu, who attends your hotel in Bondowoso. The 3D2N and longer ' +
        'routes typically combine both volcanoes plus Madakaripura or Tumpak Sewu waterfalls.',
      uiMeta: 'See /travel-guide/ijen-health-screening for the regulatory chain',
    },
    {
      question: 'What is the shortest and longest tour available?',
      answer:
        'Shortest: 1-day Bromo Sunrise (bromo-1d1n) — midnight pickup, return same evening. Longest: 6-day full East Java circuit covering ' +
        'Ijen + Papuma Beach + Tumpak Sewu + Bromo + Malang. The 3D2N format is the most-booked balance of coverage and pace; 4D3N adds ' +
        'either rest time or a waterfall extension.',
      uiMeta: 'Compare via tour cards on this page',
    },
  ];
}
