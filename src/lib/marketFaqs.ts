// src/lib/marketFaqs.ts — Canonical Q&A pairs for /markets/* geographic landing pages.
// Registered in src/lib/content/resolveFaqs.ts (CANONICAL_FAQ_REGISTRY) so the single
// FAQPage-per-page resolver emits these as the canonical AEO source for each market route.
//
// Content sourced from wiki: seo/seo-strategy.md §Geographic Landing Pages, products/packages,
// destinations/kawah-ijen.md (Blue Fire conditional wording), credentials/legal-licenses.md.
// Answers are written as direct, quotable statements per AEO format rules.
import type { QaPair } from '@/lib/tourFaqs';

export const SINGAPORE_MARKET_FAQS: QaPair[] = [
  {
    question: 'Can Singaporeans book a private Bromo and Ijen tour from Bali?',
    answer:
      'Yes. JVTO runs private 3-day (3D2N) Bromo and Ijen tours that start and finish in Bali, as well as one-way Bali-to-Surabaya overland routes. ' +
      'Every tour is 100% private — your own air-conditioned vehicle, driver, and guide — with the Java–Bali ferry, park permits, Bromo 4WD jeep, and Ijen health-screening coordination included. No shared groups.',
  },
  {
    question: 'Should Singapore travelers start from Bali or Surabaya?',
    answer:
      'Start from Bali (DPS) if your trip already includes a Bali holiday or your easiest flight is SIN–Denpasar — the overland volcano route then extends your Bali stay. ' +
      'Start from Surabaya (SUB) if you want the shortest land transfer to Bromo and a clean East-Java-only loop. Singapore has direct flights to both airports.',
  },
  {
    question: 'Is the Java–Bali ferry crossing arranged for me?',
    answer:
      'Yes. On any route that crosses between Bali and Java, JVTO pre-arranges the ferry ticket and handles the vehicle crossing and driver handover, so you never queue or coordinate transfers yourself. It is written into your e-voucher before you pay.',
  },
  {
    question: 'How do Singapore travelers pay JVTO safely?',
    answer:
      'JVTO is a registered Indonesian company (PT Java Volcano Rendezvous, NIB 1102230032918) that confirms your package and IDR price in writing before any payment, then issues an official e-voucher / invoice PDF. ' +
      'JVTO never asks for your CVV, OTP, full card number, or banking password over chat. You can verify the company on Indonesian government registries before sending a deposit.',
  },
  {
    question: 'Will we definitely see the Ijen Blue Fire?',
    answer:
      'Not always. Blue Fire is a natural phenomenon subject to weather and gas activity, visible pre-dawn in suitable conditions only — it can never be promised in advance. JVTO plans around the viewing window and follows every BBKSDA safety decision at the crater.',
  },
  {
    question: 'Are JVTO tours private or shared?',
    answer:
      'Every JVTO tour is private. Your group has its own vehicle, driver, and guide from pickup to drop-off — you are never mixed into a join-in group. Singapore travelers who reviewed JVTO on Trustpilot specifically cited the safe, dedicated, personal service.',
  },
];

export const MALAYSIA_MARKET_FAQS: QaPair[] = [
  {
    question: 'Is there a private Bromo and Ijen tour from Bali or Surabaya for Malaysians?',
    answer:
      'Yes. JVTO offers private 3-day (3D2N) Bromo and Ijen tours from both Bali and Surabaya, plus longer Ijen–Papuma–Tumpak Sewu–Bromo circuits. ' +
      'All tours are fully private and all-inclusive: transport, driver, guide, accommodation with breakfast, park permits, Bromo 4WD jeep, Ijen gas masks, and the Java–Bali ferry when the route crosses islands.',
  },
  {
    question: 'Should Malaysian travelers fly to Bali (DPS) or Surabaya (SUB)?',
    answer:
      'Both work — AirAsia and other carriers fly from Kuala Lumpur to both Denpasar (DPS) and Surabaya (SUB). Choose Surabaya for the shortest transfer to Bromo and Ijen; choose Bali if you want to combine the volcanoes with a Bali stay. JVTO can start in one city and finish in the other so you avoid backtracking.',
  },
  {
    question: 'Does JVTO manage the ferry and cross-island transfers?',
    answer:
      'Yes. JVTO pre-books the Java–Bali ferry, handles the vehicle crossing, and manages the driver handover directly, so Malaysian travelers get a single managed journey with no self-planning between islands. Every transfer is written into your e-voucher.',
  },
  {
    question: 'Is halal food available on JVTO tours?',
    answer:
      'East Java is a predominantly Muslim region, and most local restaurants and hotels used on JVTO routes serve halal food. Tell JVTO your dietary requirement on WhatsApp when you book so meal stops are planned accordingly.',
  },
  {
    question: 'Will we definitely see the Ijen Blue Fire?',
    answer:
      'Not always. Blue Fire is a natural phenomenon subject to weather and gas activity, visible pre-dawn in suitable conditions only — it can never be promised in advance. JVTO plans around the window and follows all BBKSDA safety rules at the crater.',
  },
  {
    question: 'Are JVTO tours private, and is JVTO a registered operator?',
    answer:
      'Every JVTO tour is private — your own vehicle, driver, and guide, never a shared group. JVTO operates as PT Java Volcano Rendezvous (NIB / TDUP 1102230032918), founded by an active Tourist Police officer, with credentials verifiable on Indonesian government registries before you pay.',
  },
];
