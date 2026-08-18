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
  /** Badge label shown under the answer in the client UI; ignored by schema. */
  uiMeta?: string;
  /** Route for the badge link; renders badge as <Link> when present. */
  uiLink?: string;
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

export interface ReviewProfileLite {
  platform: string;
  rating: number | null;
  reviewCount: number | null;
}

function buildReviewSummaryAnswer(reviewProfiles: ReviewProfileLite[]): string {
  const withCounts = reviewProfiles.filter(
    (p): p is ReviewProfileLite & { rating: number; reviewCount: number } =>
      typeof p.rating === 'number' && typeof p.reviewCount === 'number',
  );
  if (!withCounts.length) {
    return (
      `JVTO's reviews are independently verifiable across Trustpilot, Google Maps, and TripAdvisor. ` +
      `Reviews consistently cite Mr. Sam's police-safety background, guide professionalism, and the all-inclusive no-hidden-cost model. ` +
      `All review profiles link to the original platform so you can verify authenticity.`
    );
  }
  const totalReviews = withCounts.reduce((sum, p) => sum + p.reviewCount, 0);
  const averageRating =
    Math.round(
      (withCounts.reduce((sum, p) => sum + p.rating, 0) / withCounts.length) * 10,
    ) / 10;
  const breakdown = withCounts
    .map((p) => `${p.platform} (${p.reviewCount})`)
    .join(', ');
  return (
    `JVTO holds ${averageRating} ★ across ${totalReviews} verified reviews on ${breakdown}. ` +
    `Reviews consistently cite Mr. Sam's police-safety background, guide professionalism, and the all-inclusive no-hidden-cost model. ` +
    `All review profiles link to the original platform so you can verify authenticity.`
  );
}

/**
 * Returns the canonical Q&A pairs for a tour spine page.
 * These four pairs bridge schema to copy and route to verify / why-jvto / travel-guide / policy clusters.
 * The Ijen-specific question is included only when tour.ijenRelevant.
 *
 * `reviewProfiles`, when passed, replaces the hardcoded review-count answer with live
 * per-platform figures (same ekosistem record as TrustBar/getEcosystemReviewProfiles) —
 * prevents this copy from drifting the way the old hand-copied numbers did.
 */
export function getTourSpineQaPairs(
  tour: TourFaqSeed,
  reviewProfiles: ReviewProfileLite[] = [],
): QaPair[] {
  const pairs: QaPair[] = [
    {
      question: 'What exactly is covered in the all-inclusive price?',
      answer:
        `Every JVTO booking covers: private transport throughout, accommodation with breakfast, all park and crater entrance fees, ` +
        `a HPWKI-licensed guide, unlimited mineral water, and a JVTO travel T-shirt. ` +
        `Bromo packages additionally include the mandatory 4WD jeep for caldera access. ` +
        `Ijen packages include the professional gas mask required under BBKSDA SE.1658 regulations. ` +
        `There are no surprise "local payments" — every cost is itemised in your booking confirmation.`,
      uiMeta: 'See inclusions & exclusions',
      uiLink: '/policy/booking-payment-cancellation',
    },
    {
      question: 'Is JVTO a licensed Indonesian tour operator?',
      answer:
        `Yes. JVTO operates as PT Java Volcano Rendezvous, AHU-registered February 2023, with NIB ${NIB_NUMBER} ` +
        `(KBLI 79121 / 79911 — Travel Agency / Tour Operator) and HPWKI Ijen guide-association membership. ` +
        `Every credential is verifiable on Indonesian government registries.`,
      uiMeta: 'Verify on /verify-jvto/legal',
      uiLink: '/verify-jvto/legal',
    },
    {
      question: 'Do you offer student discounts through ISIC?',
      answer:
        `JVTO is a verified ISIC partner (Provider ID 259268). Valid ISIC cardholders receive a student rate on Ijen and Bromo tour packages. ` +
        `Show your ISIC card when booking; the student rate is confirmed in your booking summary before deposit. ` +
        `Verification: isic.org/discounts/?providerId=259268.`,
      uiMeta: 'See ISIC student packages',
      uiLink: '/isic/student-package',
    },
    {
      question: 'Who runs my tour?',
      answer:
        `JVTO is founded by Bripka Agung Sambuko (Mr. Sam) — an active Tourist Police officer (POLPAR) under Indonesia's Ditpamobvit, ` +
        `also serving as HPWKI Pengawas. On-trip guides are HPWKI-licensed (KTA card) with annual BBKSDA-supervised volcanic-safety training. ` +
        `No anonymous freelancers.`,
      uiMeta: 'See our team + KTA cards',
      uiLink: '/why-jvto/our-team',
    },
    {
      question: 'Is JVTO an eco-responsible operator?',
      answer:
        `JVTO holds Spotlight Network membership in INDECON (Indonesian Ecotourism Network), the national ecotourism advocacy body. ` +
        `All Ijen and Bromo operations follow BBKSDA Leave No Trace protocols; guides are HPWKI-certified in BBKSDA environmental compliance. ` +
        `No off-trail access, no wildlife interference, and responsible waste-management standards on every trip.`,
      uiMeta: 'INDECON Spotlight: indecon.id/spotlight-networks/java-volcano-tour-operator',
    },
  ];
  if (tour.ijenRelevant) {
    pairs.push({
      question: 'What is the Ijen health screening you mention?',
      answer:
        `BBKSDA Jawa Timur circular SE.1658/KSA.9/2024 requires Kawah Ijen visitors to present a clinic-issued certificate confirming ` +
        `blood pressure and SpO₂ are within safe limits before crater entry. JVTO coordinates the screening with Dr. Ahmad Irwandanu at ` +
        `Klinik Bakti Husada, Bondowoso — his licence is publicly verifiable on satusehat.kemkes.go.id.`,
      uiMeta: 'See health screening guide',
      uiLink: '/travel-guide/ijen-health-screening',
    });
  }
  pairs.push(
    {
      question: 'What happens if I need to cancel?',
      answer:
        `Cancellations made ≥48 hours before Day 1 receive 100% Travel Credit — non-expiring, transferable to any traveler, denominated in IDR, ` +
        `with no rebooking fee. Within 48 hours, the deposit is forfeited. Force-majeure closures (e.g., volcanic alert) are handled under ` +
        `a separate weather-and-closures protocol — JVTO will arrange an alternative activity or issue a partial refund for the affected portion.`,
      uiMeta: 'See cancellation policy',
      uiLink: '/policy/booking-payment-cancellation',
    },
    {
      question: 'What if the volcano closes on my trip date?',
      answer:
        `Volcanic alert level changes and BBKSDA closures are outside any operator's control. When a closure affects your confirmed dates, ` +
        `JVTO will first arrange an alternative route or activity of equal standard. If no suitable alternative is available, ` +
        `a partial refund for the affected portion applies. We monitor PVMBG alerts and notify guests proactively; our weather-and-closures policy documents the full SOP.`,
      uiMeta: 'See weather & closures policy',
      uiLink: '/travel-guide/weather-and-closures',
    },
    {
      question: 'What do past guests say about JVTO?',
      answer: buildReviewSummaryAnswer(reviewProfiles),
      uiMeta: 'Read verified reviews',
      uiLink: '/why-jvto/reviews',
    },
  );
  return pairs;
}
