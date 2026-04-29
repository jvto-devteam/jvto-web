// src/lib/homepageFaqs.ts — Canonical Q&A pairs for the homepage.
// Ported from rewrite repo (e:\test-2-2026\lib\homepageFaqs.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Same {question, answer} list used by both:
//   - Server-side FAQPage JSON-LD builder (lib/schemas/buildHomepageSchemas.ts)
//   - Client-side rendering (where applicable)
// Single source of truth (F14 hedge: AI engines weighting natural language vs schema both get same content).
import type { QaPair } from '@/lib/tourFaqs';

export const HOMEPAGE_FAQS: QaPair[] = [
  {
    question: 'Is JVTO a legitimate company?',
    answer:
      'Yes. JVTO operates under PT Java Volcano Rendezvous (AHU-registered February 2023, NIB and TDUP 1102230032918) and uses a publicly ' +
      'verifiable business identity. We also maintain a dedicated proof library so travelers can review our trust layers before paying a deposit.',
  },
  {
    question: 'Are all your tours private?',
    answer:
      'Yes. All JVTO tours are private by default. You will have your own vehicle, your own driver, and your own guide or team, without being ' +
      'mixed into a shared group. This is a deliberate operational choice — private execution is what enables our safety standards.',
  },
  {
    question: 'Is the Ijen health screening included?',
    answer:
      'Yes. For routes that include Ijen, JVTO coordinates the BBKSDA SE.1658/KSA.9/2024 health screening with Dr. Ahmad Irwandanu at ' +
      'Klinik Bakti Husada (Bondowoso) — his SIP licence is publicly verifiable on satusehat.kemkes.go.id. Guests do not have to navigate the process alone.',
  },
  {
    question: 'What happens if weather or volcanic conditions change the plan?',
    answer:
      'Safety comes first. If access conditions change, JVTO uses an alternative-route approach and communicates clearly. Force-majeure ' +
      'closures are handled under our travel-credit policy: 100% Travel Credit (non-expiring, transferable, IDR-denominated, no rebooking fee).',
  },
  {
    question: 'How can I verify JVTO before booking?',
    answer:
      'You can review our legal, police, medical, press, and history-artifact proof through the /verify-jvto cluster before you make any payment. ' +
      'Every credential is verifiable on Indonesian government registries (ahu.go.id, satusehat.kemkes.go.id, polri.go.id) — not just on our own site.',
  },
  {
    question: 'Why should I trust JVTO with my deposit?',
    answer:
      "JVTO operates with a 'Trust First' philosophy. We are a legally registered PT (Perseroan Terbatas) in Indonesia, founded by Bripka Agung " +
      'Sambuko — an active Tourist Police officer (POLPAR) under Indonesia\'s Ditpamobvit. We provide our NIB (Business Identification Number: ' +
      '1102230032918) and legal documents upfront so you can verify us through official government channels before paying a single dollar.',
  },
  {
    question: 'How do you ensure safety at Ijen Crater?',
    answer:
      'Safety is our core product. When BBKSDA access rules require it (SE.1658/KSA.9/2024), JVTO coordinates the health certificate process ' +
      '(surat sehat) with licensed medical partners. We provide professional-grade gas masks and a team trained in volcanic risk management. ' +
      "Our founder's background in the Tourist Police means our safety protocols are not just 'guidelines' — they are police-standard procedures.",
  },
  {
    question: 'Are your tours truly private?',
    answer:
      "We do not operate 'shared' tours where you are mixed with strangers. Every JVTO booking gets its own dedicated vehicle, driver, and " +
      'guide. This ensures we can maintain strict safety standards and provide a personalized experience that shared tours simply cannot match.',
  },
  {
    question: 'What happens if my trip is cancelled?',
    answer:
      'We maintain a transparent cancellation policy. Cancellations made ≥48 hours before Day 1 receive 100% Travel Credit — non-expiring, ' +
      'transferable to any traveler, denominated in IDR, with no rebooking fee. Our legal registration ensures you have recourse that ' +
      "'freelance' guides cannot offer.",
  },
];
