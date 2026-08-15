// src/lib/marketContent.ts — Content model + JSON-LD builder for /markets/* geographic landing pages.
//
// GEO/AEO geographic landing pages targeting Southeast-Asian source markets (GAP-09).
// Content is wiki-sourced and static (v1): flight schedules and market-specific meal SOPs are
// deferred to v2 per seo/seo-strategy.md §Geographic Landing Pages. All IDR prices are the
// canonical direct-template rates (per person, based on 2 travelers) already vetted in the
// production-ready wiki page output/website/pages/markets/taiwan.md.
//
// Review quotes are verbatim, country-tagged, and sourced from
// wiki/reviews/google-tripadvisor-2026.md — no invented testimonials.
import { ORG_ID, buildJavaIslandPlaceNode, JAVA_ISLAND_PLACE_ID } from '@/lib/seo/jsonld/builders';
import type { QaPair } from '@/lib/tourFaqs';
import { SINGAPORE_MARKET_FAQS, MALAYSIA_MARKET_FAQS } from '@/lib/marketFaqs';

const BASE_URL = 'https://javavolcano-touroperator.com';

export interface MarketPackage {
  name: string;
  /** Absolute site path to the tour-detail page, e.g. /tours/from-bali/bromo-ijen-3d2n */
  path: string;
  startFinish: string;
  duration: string;
  bestFor: string;
  /** Per person, based on 2 travelers, in IDR. */
  priceIdr: number;
  priceLabel: string;
}

export interface EntryChoice {
  flightPlan: string;
  start: string;
  why: string;
  route: string;
}

export interface MarketReview {
  quote: string;
  author: string;
  platform: string;
}

export interface TrustRow {
  signal: string;
  detail: string;
}

export interface MarketContent {
  key: 'singapore' | 'malaysia';
  country: string;
  demonym: string;
  route: string;
  title: string;
  description: string;
  h1: string;
  /** Optional local-language support line (Bahasa for Malaysia). */
  supportLine?: string;
  subheadline: string;
  credibilityLine: string;
  lead: string;
  entryHeading: string;
  entryChoices: EntryChoice[];
  entryNote: string;
  packagesHeading: string;
  packagesIntro: string;
  packages: MarketPackage[];
  inclusions: string[];
  notIncluded: string;
  logistics: QaPair[];
  trustRows: TrustRow[];
  reviewsHeading: string;
  reviews: MarketReview[];
  faqs: QaPair[];
  primaryCtas: { label: string; href: string }[];
  trustLinks: { label: string; href: string }[];
}

const SHARED_INCLUSIONS = [
  'Private air-conditioned vehicle for your group only — no public join-in van.',
  'English-speaking crew: driver-guide for small groups; driver plus escort guide for larger groups.',
  'Licensed local site guides at key locations.',
  'Entrance fees and national-park permits for the confirmed itinerary.',
  'Accommodation with breakfast on all overnight routes.',
  'Private Bromo 4WD jeep when Bromo is included.',
  'Gas mask and trekking poles for Ijen routes.',
  'Ijen health-certificate coordination — mandatory for every guest (BBKSDA SE.1658/KSA.9/2024).',
  'Java–Bali ferry ticket when a Bali crossing is part of the itinerary.',
  'Daily bottled mineral water in the vehicle, and an official e-voucher / invoice PDF after payment.',
];

const NOT_INCLUDED =
  'Not included by default: international/domestic flights, travel insurance, visa/e-VOA fees, tips, souvenirs, ' +
  'personal snacks and drinks, and anything not written on the official voucher.';

const SHARED_TRUST_LINKS = [
  { label: 'Verify legal documents', href: '/verify-jvto/legal' },
  { label: 'Police & safety credentials', href: '/verify-jvto/police-safety' },
  { label: 'Press recognition', href: '/verify-jvto/press-recognition' },
  { label: 'Guest reviews', href: '/why-jvto/reviews' },
  { label: 'Booking, payment & cancellation policy', href: '/policy/booking-payment-cancellation' },
];

export const SINGAPORE_MARKET: MarketContent = {
  key: 'singapore',
  country: 'Singapore',
  demonym: 'Singaporean',
  route: '/markets/singapore',
  title: 'Bromo & Ijen Tours for Singapore Travelers | Private East Java Volcano Tours | JVTO',
  description:
    'Private Bromo, Ijen, Tumpak Sewu and Papuma tours for Singapore travelers. Start from Bali or Surabaya, pay in IDR, verify JVTO licenses and reviews.',
  h1: 'Bromo & Ijen Private Tours for Singapore Travelers',
  subheadline:
    'Fly from Singapore to Bali or Surabaya, then cross East Java with a private JVTO crew. Premium logistics, a dedicated vehicle and guide, ferry crossings arranged, and written inclusions before you pay.',
  credibilityLine:
    'Licensed Indonesian tour operator · PT Java Volcano Rendezvous · NIB 1102230032918 · Trustpilot 4.8/5 (51) · Google 4.9/5 (123) · TripAdvisor 4.95/5 (21) · Founded 2015',
  lead:
    'Singapore travelers usually pair a Bali holiday with a private volcano extension — and want it organized, safe, and premium rather than a budget join-in group. ' +
    'JVTO runs private tours only: your own vehicle, your own driver and guide, pre-booked ferry crossings, and a written itinerary. Fly into Bali (DPS) for the easiest arrival and an overland extension, or Surabaya (SUB) for the shortest transfer to Bromo.',
  entryHeading: 'Best route from Singapore: Bali arrival or Surabaya arrival?',
  entryChoices: [
    {
      flightPlan: 'Singapore (SIN) → Bali / Denpasar (DPS)',
      start: 'Bali',
      why: 'Easiest arrival if your trip already includes Bali. Extend the beach holiday with a private overland volcano route.',
      route: '3D2N Bromo + Ijen (Bali return), or 4D Bali → Surabaya full circuit',
    },
    {
      flightPlan: 'Singapore (SIN) → Surabaya (SUB)',
      start: 'Surabaya',
      why: 'Shortest land transfer to Bromo and the cleanest East-Java-only loop.',
      route: '3D2N Ijen + Bromo + Madakaripura, or 4D Ijen + Papuma + Tumpak Sewu + Bromo',
    },
    {
      flightPlan: 'Singapore → Bali, depart from Surabaya',
      start: 'Bali start, Surabaya finish',
      why: 'Best for travelers who do not want to repeat the Bali–Java crossing.',
      route: 'Bali → Ijen → Papuma → Tumpak Sewu → Bromo → Surabaya',
    },
  ],
  entryNote:
    'Singapore has direct flights to both Denpasar and Surabaya. Confirm the exact airline schedule before buying non-refundable flights.',
  packagesHeading: 'Routes Singapore travelers usually compare',
  packagesIntro:
    'All prices are official JVTO direct rates in IDR per person (based on 2 travelers). OTA retail prices may differ because of platform markup. JVTO confirms the final price in writing before payment.',
  packages: [
    {
      name: '3 Day Bromo & Ijen Volcano Discovery',
      path: '/tours/from-bali/bromo-ijen-3d2n',
      startFinish: 'Bali → Bali',
      duration: '3D2N',
      bestFor: 'Bali holiday add-on',
      priceIdr: 4050000,
      priceLabel: 'IDR 4,050,000 / person (2 pax)',
    },
    {
      name: '3 Day Ijen, Bromo & Madakaripura',
      path: '/tours/from-bali/ijen-bromo-madakaripura-3d2n',
      startFinish: 'Bali → Surabaya',
      duration: '3D2N',
      bestFor: 'Bali arrival, Surabaya departure',
      priceIdr: 4050000,
      priceLabel: 'IDR 4,050,000 / person (2 pax)',
    },
    {
      name: '3 Day Ijen, Bromo & Madakaripura',
      path: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n',
      startFinish: 'Surabaya → Surabaya',
      duration: '3D2N',
      bestFor: 'Classic East Java loop',
      priceIdr: 3570000,
      priceLabel: 'IDR 3,570,000 / person (2 pax)',
    },
    {
      name: '4 Day Ijen, Papuma, Tumpak Sewu & Bromo',
      path: '/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-4d3n',
      startFinish: 'Bali → Surabaya',
      duration: '4D3N',
      bestFor: 'Full photo circuit, no backtracking',
      priceIdr: 4900000,
      priceLabel: 'IDR 4,900,000 / person (2 pax)',
    },
  ],
  inclusions: SHARED_INCLUSIONS,
  notIncluded: NOT_INCLUDED,
  logistics: [
    {
      question: 'Should I start from Bali or Surabaya?',
      answer:
        'Start from Bali if your easiest flight is SIN→DPS or Bali is already part of your holiday. Start from Surabaya for the shortest route to Bromo and a clean East-Java-only itinerary.',
    },
    {
      question: 'Can I end in Surabaya and fly home the same day?',
      answer:
        'Do not book a tight same-day connection after Bromo sunrise. Use a late flight only if JVTO confirms the timing is realistic, or stay one night in Surabaya.',
    },
    {
      question: 'Can I pay in SGD?',
      answer:
        'JVTO official pricing and accounting are in IDR. Cards, banks, or OTAs may display or settle in another currency, but JVTO’s direct quote is IDR-based.',
    },
  ],
  trustRows: [
    { signal: 'Registered legal company', detail: 'PT Java Volcano Rendezvous' },
    { signal: 'NIB / TDUP', detail: '1102230032918 — verifiable via OSS Indonesia' },
    { signal: 'Founder', detail: 'Bripka Agung Sambuko, active Tourist Police officer (Ditpamobvit)' },
    { signal: 'Reviews', detail: 'Trustpilot 4.8/5 (51), Google 4.9/5 (123), TripAdvisor 4.95/5 (21) — 195 total' },
    { signal: 'Ijen specialist credential', detail: 'HPWKI membership, BBKSDA-supervised safety training' },
    { signal: 'Student verification', detail: 'ISIC Provider ID 259268' },
  ],
  reviewsHeading: 'What Singapore travelers say',
  reviews: [
    {
      quote:
        'Ahboy was a phenomenal Ijen guide from start to end. Not only was he incredibly knowledgeable and went out of his way to make sure everything we needed was sorted out (safety, logistics, equipment), he also made sure to build a strong bond with each one of us.',
      author: 'Jason Li',
      platform: 'Trustpilot',
    },
    {
      quote:
        'Our tour guide (KiKi) and driver (Nur) was amazing. Communication was easy, instructions were clear, and they made the experience fun and safe. Kiki also took amazing photos for us.',
      author: 'Tan Yong Xue Jayden',
      platform: 'Trustpilot',
    },
    {
      quote: 'Driver Joy is very experienced and ensures the car safety of the passengers.',
      author: 'Eileen Chua',
      platform: 'Trustpilot',
    },
    {
      quote:
        'JVTO takes pride in assuring their customers. The driver Yandi and guide Boy were great. Yandi was helpful and kind through the whole tour.',
      author: 'Sisca',
      platform: 'Trustpilot',
    },
  ],
  faqs: SINGAPORE_MARKET_FAQS,
  primaryCtas: [
    { label: '3D2N Bromo & Ijen from Bali', href: '/tours/from-bali/bromo-ijen-3d2n' },
    { label: '3D2N Ijen, Bromo & Madakaripura from Surabaya', href: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n' },
    { label: 'See all Bali-origin tours', href: '/tours/from-bali' },
  ],
  trustLinks: SHARED_TRUST_LINKS,
};

export const MALAYSIA_MARKET: MarketContent = {
  key: 'malaysia',
  country: 'Malaysia',
  demonym: 'Malaysian',
  route: '/markets/malaysia',
  title: 'Bromo & Ijen Tours for Malaysia Travelers | Private East Java Volcano Tours | JVTO',
  description:
    'Private Bromo, Ijen, Tumpak Sewu and Papuma tours for Malaysia travelers. Start from Surabaya or Bali, pay in IDR, verify JVTO licenses and reviews.',
  h1: 'Bromo & Ijen Private Tours for Malaysia Travelers',
  supportLine:
    'Pakej peribadi ke Gunung Bromo, Kawah Ijen, Tumpak Sewu & Papuma — kenderaan sendiri, feri diuruskan, harga jelas, dan syarikat pelancongan yang boleh disahkan.',
  subheadline:
    'Fly from Malaysia to Bali or Surabaya, then let a private JVTO crew handle the whole East Java crossing — managed ferry, direct driver handovers, and one all-inclusive itinerary with no self-planning.',
  credibilityLine:
    'Licensed Indonesian tour operator · PT Java Volcano Rendezvous · NIB 1102230032918 · Trustpilot 4.8/5 (51) · Google 4.9/5 (123) · TripAdvisor 4.95/5 (21) · Founded 2015',
  lead:
    'Malaysian travelers want convenience: managed ferry crossings, direct driver handovers, and an all-inclusive package that removes cross-island planning. ' +
    'JVTO runs private tours only and books the Java–Bali ferry, permits, and hotels for you. AirAsia and other carriers connect Kuala Lumpur to both Denpasar (DPS) and Surabaya (SUB), so you can start in one and finish in the other without backtracking.',
  entryHeading: 'Best route from Malaysia: Bali arrival or Surabaya arrival?',
  entryChoices: [
    {
      flightPlan: 'Kuala Lumpur (KUL) → Surabaya (SUB)',
      start: 'Surabaya',
      why: 'Shortest land transfer to Bromo and Ijen; the simplest all-East-Java itinerary.',
      route: '3D2N Ijen + Bromo + Madakaripura, or 4D Ijen + Papuma + Tumpak Sewu + Bromo',
    },
    {
      flightPlan: 'Kuala Lumpur (KUL) → Bali / Denpasar (DPS)',
      start: 'Bali',
      why: 'Combine the volcanoes with a Bali stay; managed ferry crossing to Java.',
      route: '3D2N Bromo + Ijen (Bali return), or 4D Bali → Surabaya circuit',
    },
    {
      flightPlan: 'KL → Bali, depart from Surabaya (or the reverse)',
      start: 'One-way overland',
      why: 'Avoids repeating the Bali–Java crossing; JVTO handles the handover between islands.',
      route: 'Bali → Ijen → Papuma → Tumpak Sewu → Bromo → Surabaya',
    },
  ],
  entryNote:
    'AirAsia flies KUL to both Denpasar and Surabaya. Confirm the exact airline schedule before buying non-refundable flights.',
  packagesHeading: 'Routes Malaysian travelers usually compare',
  packagesIntro:
    'All prices are official JVTO direct rates in IDR per person (based on 2 travelers). OTA retail prices may differ because of platform markup. JVTO confirms the final price in writing before payment.',
  packages: [
    {
      name: '2 Day Ijen Blue Fire Expedition',
      path: '/tours/from-surabaya/ijen-2d1n',
      startFinish: 'Surabaya → Surabaya',
      duration: '2D1N',
      bestFor: 'Short trip, Ijen-focused',
      priceIdr: 2300000,
      priceLabel: 'IDR 2,300,000 / person (2 pax)',
    },
    {
      name: '3 Day Ijen, Bromo & Madakaripura',
      path: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n',
      startFinish: 'Surabaya → Surabaya',
      duration: '3D2N',
      bestFor: 'Classic volcano + waterfall loop',
      priceIdr: 3570000,
      priceLabel: 'IDR 3,570,000 / person (2 pax)',
    },
    {
      name: '3 Day Bromo & Ijen Volcano Discovery',
      path: '/tours/from-bali/bromo-ijen-3d2n',
      startFinish: 'Bali → Bali',
      duration: '3D2N',
      bestFor: 'Bali holiday add-on',
      priceIdr: 4050000,
      priceLabel: 'IDR 4,050,000 / person (2 pax)',
    },
    {
      name: '4 Day Ijen, Papuma, Tumpak Sewu & Bromo',
      path: '/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n',
      startFinish: 'Surabaya → Surabaya',
      duration: '4D3N',
      bestFor: 'Full coast + waterfall + volcano circuit',
      priceIdr: 4550000,
      priceLabel: 'IDR 4,550,000 / person (2 pax)',
    },
  ],
  inclusions: SHARED_INCLUSIONS,
  notIncluded: NOT_INCLUDED,
  logistics: [
    {
      question: 'Do you manage the ferry and cross-island transfers?',
      answer:
        'Yes. JVTO pre-books the Java–Bali ferry, handles the vehicle crossing, and manages the driver handover so your journey between islands is a single managed transfer written into your e-voucher.',
    },
    {
      question: 'Is halal food available on tour?',
      answer:
        'East Java is a predominantly Muslim region, and most local restaurants and hotels used on JVTO routes serve halal food. Tell JVTO your dietary requirement on WhatsApp when booking so meal stops are planned accordingly.',
    },
    {
      question: 'Can I pay in MYR?',
      answer:
        'JVTO official pricing and accounting are in IDR. Cards, banks, or OTAs may display or settle in another currency, but JVTO’s direct quote is IDR-based.',
    },
  ],
  trustRows: [
    { signal: 'Registered legal company', detail: 'PT Java Volcano Rendezvous' },
    { signal: 'NIB / TDUP', detail: '1102230032918 — verifiable via OSS Indonesia' },
    { signal: 'Founder', detail: 'Bripka Agung Sambuko, active Tourist Police officer (Ditpamobvit)' },
    { signal: 'Reviews', detail: 'Trustpilot 4.8/5 (51), Google 4.9/5 (123), TripAdvisor 4.95/5 (21) — 195 total' },
    { signal: 'Ijen specialist credential', detail: 'HPWKI membership, BBKSDA-supervised safety training' },
    { signal: 'Student verification', detail: 'ISIC Provider ID 259268' },
  ],
  reviewsHeading: 'What Malaysian travelers say',
  reviews: [
    {
      quote:
        'Well organized from pick-up to send off. Great assistance from both Yandi and Boy. The visit to Mt Ijen, Mt Bromo and especially Madakaripura was well organized and a must see.',
      author: 'Nazeem Nasir',
      platform: 'Trustpilot',
    },
  ],
  faqs: MALAYSIA_MARKET_FAQS,
  primaryCtas: [
    { label: '3D2N Ijen, Bromo & Madakaripura from Surabaya', href: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n' },
    { label: '3D2N Bromo & Ijen from Bali', href: '/tours/from-bali/bromo-ijen-3d2n' },
    { label: 'See all Surabaya-origin tours', href: '/tours/from-surabaya' },
  ],
  trustLinks: SHARED_TRUST_LINKS,
};

export const MARKETS: Record<string, MarketContent> = {
  singapore: SINGAPORE_MARKET,
  malaysia: MALAYSIA_MARKET,
};

/**
 * Per-market JSON-LD extras: an ItemList of recommended TouristTrip packages, each carrying a
 * structured Offer (IDR price, per-person unit spec) so generative engines can quote
 * "3D2N Bromo Ijen from Bali price" directly. FAQPage is emitted separately by the page via the
 * canonical resolver (resolveFaqs.ts); WebPage + BreadcrumbList come from PageJsonLdCombined.
 */
export function buildMarketSchemas(content: MarketContent): Record<string, unknown>[] {
  const pageUrl = `${BASE_URL}${content.route}`;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#recommended-tours`,
    name: `Recommended JVTO volcano tours for ${content.country} travelers`,
    numberOfItems: content.packages.length,
    // GEO audit Priority 3 (2026-08-15): disambiguate "Java" (island vs
    // programming language) — these tours all take place on the island.
    mentions: { '@id': JAVA_ISLAND_PLACE_ID },
    itemListElement: content.packages.map((pkg, i) => {
      const url = `${BASE_URL}${pkg.path}`;
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristTrip',
          '@id': url,
          name: pkg.name,
          url,
          provider: { '@id': ORG_ID },
          offers: {
            '@type': 'Offer',
            url,
            price: String(pkg.priceIdr),
            priceCurrency: 'IDR',
            availability: 'https://schema.org/InStock',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: String(pkg.priceIdr),
              priceCurrency: 'IDR',
              referenceQuantity: { '@type': 'QuantitativeValue', value: '1', unitText: 'person' },
              description: 'Per person, based on 2 travelers',
            },
          },
        },
      };
    }),
  };
  return [itemList, buildJavaIslandPlaceNode()];
}
