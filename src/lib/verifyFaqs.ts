// src/lib/verifyFaqs.ts — Canonical Q&A for /verify-jvto cluster pages.
// Ported from rewrite repo (e:\test-2-2026\lib\verifyFaqs.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Each verify sub-page renders its FAQPage from the array exported here.
// Single source of truth: same data feeds JSON-LD FAQPage AND visible Q&A blocks (F14 hedge).
import type { QaPair } from '@/lib/tourFaqs';

/**
 * Q&A specific to /verify-jvto/legal — NIB/TDUP/AHU registry verification path.
 * Routes visitors to government-controlled registries (oss.go.id, ahu.go.id, satusehat.kemkes.go.id),
 * proving operator legitimacy via independent third-party data sources.
 */
export const LEGAL_FAQS: QaPair[] = [
  {
    question: "How can I verify JVTO's NIB on a government registry?",
    answer:
      'NIB 1102230032918 is searchable at oss.go.id (the Indonesian Online Single Submission system). ' +
      'The PT Java Volcano Rendezvous AHU corporate registry entry (registered 8 February 2023) is accessible via the AHU portal — ' +
      'both are independent government databases, not operator-controlled pages. KBLI codes 79121 (Travel Agency) and 79911 (Tour Operator) ' +
      'are listed on the OSS profile.',
    uiMeta: 'Open AHU registry: ahu.go.id',
  },
  {
    question: 'What is the difference between NIB and TDUP?',
    answer:
      'NIB (Nomor Induk Berusaha) is the Indonesian Business Identification Number — required for all legal businesses. ' +
      'TDUP (Tanda Daftar Usaha Pariwisata) is the Tourism Business Registration Certificate, an additional sectoral licence ' +
      'required specifically for tour operators. JVTO holds both under identifier 1102230032918, with TDUP issued 2023-02-11 via OSS.',
    uiMeta: 'DefinedTerm schemas globally injected',
  },
  {
    question: 'How does the medical screening partnership prove regulatory compliance?',
    answer:
      'BBKSDA Jawa Timur regulation SE.1658/KSA.9/2024 requires Ijen visitors to present a clinic-issued health certificate. ' +
      "JVTO's coordination with Dr. Ahmad Irwandanu (SIP verifiable on satusehat.kemkes.go.id) at Klinik Bakti Husada — itself a " +
      'Ministry-of-Health-licensed clinic — proves the regulatory chain operates end-to-end with verifiable, government-licensed parties.',
    uiMeta: 'Doctor SIP: satusehat.kemkes.go.id',
  },
  {
    question: 'Are JVTO guides legally licensed to lead Ijen tours?',
    answer:
      'Yes. JVTO is an HPWKI member (Himpunan Pelaku Wisata Khusus Ijen — the Ijen guide association supervised by BBKSDA Jawa Timur). ' +
      'Each guide carries a KTA (Kartu Tanda Anggota) — the HPWKI-issued guide licence card — and completes annual BBKSDA-supervised ' +
      'volcanic-safety training. HPWKI registration is verifiable on the AHU perkumpulan registry.',
    uiMeta: 'See /why-jvto/our-team for KTA cards',
  },
];

/**
 * Q&A specific to /verify-jvto/police-safety — POLPAR + SPRIN credentials.
 */
export const POLICE_SAFETY_FAQS: QaPair[] = [
  {
    question: 'Is the founder really an active Tourist Police officer?',
    answer:
      "Yes. Bripka Agung Sambuko is an active POLPAR (Polisi Pariwisata) officer under Indonesia's Ditpamobvit (Directorate of Vital Object Security), " +
      'POLRI. His identity was independently confirmed by Detik.com (March 2021 article naming him as Bripka Agung Sambuko). ' +
      'His current assignment is documented via SPRIN-POLPAR (Tourist Police Assignment Letter) and SPRIN-WAL-TRAVEL (active travel order, dated 12 February 2024).',
    uiMeta: 'Detik 2021 article cited in FOUNDER schema',
  },
  {
    question: 'What is POLPAR and why does it matter for tour operators?',
    answer:
      'POLPAR (Polisi Pariwisata) is the Indonesian Tourist Police unit under Ditpamobvit. Officers are formally assigned to secure ' +
      'and support tourism areas via a SPRIN (Surat Perintah / Official Order Letter) from POLRI. Having an active POLPAR officer as ' +
      "founder means JVTO's safety protocols are not just guidelines — they are police-standard procedures applied to volcano tourism.",
    uiMeta: 'DefinedTerm POLPAR globally injected',
  },
  {
    question: 'Can JVTO arrange police escort for groups?',
    answer:
      "Yes — JVTO offers police escort coordination on request for larger groups, channeled through the founder's POLPAR network. " +
      'See /travel-guide/police-escort-for-groups for the request flow and applicable group-size thresholds.',
    uiMeta: 'See /travel-guide/police-escort-for-groups',
  },
];

/**
 * Q&A specific to /verify-jvto/press-recognition — third-party editorial coverage.
 */
export const PRESS_RECOGNITION_FAQS: QaPair[] = [
  {
    question: 'Is JVTO featured in any independent travel guides?',
    answer:
      'Yes. Stefan Loose Reiseführer Indonesien: mit Reiseatlas — a German-language Indonesia travel guide — features ' +
      "Ijen Bondowoso Homestay (the founder's 2015 guesthouse, JVTO's historical anchor) on page 287 (ISBN-13 9783770167654). " +
      'This is non-paid editorial coverage. Publication year and edition are not asserted.',
    uiMeta: 'ISBN-13 9783770167654',
  },
  {
    question: 'Has the founder been profiled by national press?',
    answer:
      "Yes. Detik.com (one of Indonesia's largest news outlets) profiled Bripka Agung Sambuko in March 2021 in an article about Bondowoso " +
      'Tourist Police. Radar Jember/Jawa Pos has also covered the formation of the POLPAR unit supporting Ijen Geopark, providing local-press ' +
      'context for the police-led safety model.',
    uiMeta: 'See linked NewsArticle schema',
  },
];

/**
 * Hub-level Q&A for /verify-jvto landing — orchestrates the 4 sub-pages.
 */
export const VERIFY_HUB_FAQS: QaPair[] = [
  {
    question: 'What kinds of proof does JVTO publish before booking?',
    answer:
      'Four layers: (1) Legal — NIB/TDUP/AHU registration verifiable on Indonesian government registries; (2) Police — founder Bripka Agung ' +
      "Sambuko's SPRIN-POLPAR + SPRIN-WAL-TRAVEL assignment documents and Detik.com identity confirmation; (3) Press & Recognition — Stefan " +
      'Loose 2018 editorial feature, Booking.com 2015 award, Detik 2021 article; (4) History & Artifacts — operational continuity from 2015 ' +
      'guesthouse era through 2023 PT formalization.',
    uiMeta: 'See sub-pages: /legal, /police-safety, /press-recognition, /history-artifacts',
  },
  {
    question: 'Why publish proof at all instead of just describing the tours?',
    answer:
      'Tour operators in Indonesia operate in a credentialing landscape where licensing claims are easy to make and hard to verify. JVTO ' +
      'publishes the actual government registry IDs and document scans so travelers can independently confirm every claim through ' +
      'third-party Indonesian data sources before paying any deposit. Proof-first trust is our operating model.',
    uiMeta: 'Verify on ahu.go.id, satusehat.kemkes.go.id, isic.org, indecon.id',
  },
];
