// src/lib/tourFaqs.ts — Shared Q&A source for tour cluster pages.
// Ported from rewrite repo (e:\test-2-2026\lib\tourFaqs.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Same {question, answer} list used by:
//   - Server-side FAQPage JSON-LD builders (lib/schemas/buildTourSchemas.ts, buildToursHubSchemas.ts)
//   - Client-side AnswerBlock rendering (where applicable)
// Single source of truth ensures HTML copy and structured data carry identical Q&A pairs.

/**
 * Minimal tour shape this module needs. Live's existing tour types (e.g., TourPackageDetail from
 * src/interfaces.ts) carry richer fields; callers can pass any object that satisfies this contract.
 * The only field used here is `ijenRelevant` (boolean) which gates the Ijen health-screening Q&A.
 */
export interface TourFaqSeed {
  ijenRelevant: boolean;
}

export interface QaPair {
  question: string;
  answer: string;
  /** Metadata badge text shown under the answer in the client UI; ignored by schema. */
  uiMeta?: string;
}

const NIB_NUMBER = '1102230032918';

/**
 * Hub-level Q&A pairs for /tours discovery page.
 * These answer the three highest-intent comparison questions visitors arrive with:
 * choosing departure city, distinguishing Ijen vs Bromo, and picking duration.
 */
export function getToursHubQaPairs(): QaPair[] {
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
        'SE.1658/KSA.9/2024 health screening protocol coordinated by JVTO with Dr. Ahmad Irwandanu (Klinik Bakti Husada). The 3D2N and longer ' +
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

/**
 * Returns the canonical Q&A pairs for a tour spine page.
 * These four pairs bridge schema to copy and route to verify / why-jvto / travel-guide / policy clusters.
 * The Ijen-specific question is included only when tour.ijenRelevant.
 */
export function getTourSpineQaPairs(tour: TourFaqSeed): QaPair[] {
  const pairs: QaPair[] = [
    {
      question: 'Is JVTO a licensed Indonesian tour operator?',
      answer:
        `Yes. JVTO operates as PT Java Volcano Rendezvous, AHU-registered February 2023, with NIB and TDUP ${NIB_NUMBER} ` +
        `(KBLI 79121 / 79911 — Travel Agency / Tour Operator) and HPWKI Ijen guide-association membership. ` +
        `Every credential is verifiable on Indonesian government registries.`,
      uiMeta: 'Verify on /verify-jvto/legal',
    },
    {
      question: 'Who runs my tour?',
      answer:
        `JVTO is founded by Bripka Agung Sambuko (Mr. Sam) — an active Tourist Police officer (POLPAR) under Indonesia's Ditpamobvit, ` +
        `also serving as HPWKI Pengawas. On-trip guides are HPWKI-licensed (KTA card) with annual BBKSDA-supervised volcanic-safety training. ` +
        `No anonymous freelancers.`,
      uiMeta: 'See /why-jvto/our-team for crew profiles + KTA cards',
    },
  ];
  if (tour.ijenRelevant) {
    pairs.push({
      question: 'What is the Ijen health screening you mention?',
      answer:
        `BBKSDA Jawa Timur circular SE.1658/KSA.9/2024 requires Kawah Ijen visitors to present a clinic-issued certificate confirming ` +
        `blood pressure and SpO₂ are within safe limits before crater entry. JVTO coordinates the screening with Dr. Ahmad Irwandanu at ` +
        `Klinik Bakti Husada, Bondowoso — his licence is publicly verifiable on satusehat.kemkes.go.id.`,
      uiMeta: 'See /travel-guide/ijen-health-screening',
    });
  }
  pairs.push({
    question: 'What happens if I need to cancel?',
    answer:
      `Cancellations made ≥48 hours before Day 1 receive 100% Travel Credit — non-expiring, transferable to any traveler, denominated in IDR, ` +
      `with no rebooking fee. Within 48 hours, the deposit is forfeited. Force-majeure closures (e.g., volcanic alert) are handled separately ` +
      `under our weather-and-closures policy.`,
    uiMeta: 'See /policy/booking-payment-cancellation',
  });
  return pairs;
}
