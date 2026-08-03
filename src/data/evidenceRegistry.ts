// src/data/evidenceRegistry.ts
// JVTO Evidence Registry — compiled from llm-wiki credentials + trust-signals + press sources.
// Generated: 2026-05-27 (Cowork compile from E:\Users\JAVA VOLCANO\llm-wiki).
// Source pages: wiki/credentials/legal-licenses, trust-signals, police-integration,
// medical-screening, press-coverage, people/agung-sambuko, people/dr-ahmad-irwandanu.
//
// Purpose: single source for /verify-jvto pages, ForensicGallery component,
// AuthorityShield component, and any trust-block placement throughout the site.
//
// Each item is anchored to canonical wiki source and (where applicable) SHA-256 verified.
// Claim mapping: C1-C9 per wiki/website/aeo-claims.md.

export type EvidenceCategory =
  | 'legal'
  | 'police'
  | 'medical'
  | 'history'
  | 'partners'
  | 'press'
  | 'reviews';

export type ClaimId = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9';

export type Placement =
  | 'homepage'
  | 'why-jvto'
  | 'verify-jvto'
  | 'package'
  | 'team'
  | 'checkout'
  | 'travel-guide';

export interface EvidenceItem {
  /** Stable unique ID, kebab-case. */
  id: string;
  /** Forensic category — drives gallery grouping at /verify-jvto. */
  category: EvidenceCategory;
  /** Display title (public-facing). */
  title: string;
  /** Public-facing one-line description / wording for UI. */
  description: string;
  /** Document identifier (e.g., NIB number, KTA code). */
  identifier?: string;
  /** Issue / publication / award date (ISO). */
  issuedDate?: string;
  /** Issuing authority. */
  authority?: string;
  /** SHA-256 hash of canonical source PDF/document — for tamper-evident verification. */
  sha256?: string;
  /** Asset URL (PDF / image). Live URLs on javavolcano-touroperator.com. */
  fileUrl?: string;
  /** Optimized preview image URL (WebP / PNG). */
  previewUrl?: string;
  /** External verification URL (registry portal, press article, partner page). */
  externalUrl?: string;
  /** Claims this evidence supports (C1-C9). */
  claimSupports: ClaimId[];
  /** Wiki source page slug for trace-back. */
  sourcePage: string;
  /** Recommended placements throughout the site. */
  bestPlacement: Placement[];
  /** Costly-signal weight: how hard is this for an illegitimate operator to fake. 1-5. */
  costlySignalWeight: 1 | 2 | 3 | 4 | 5;
  /** True if evidence is currently disputed / under reconciliation — render with caveat. */
  underReconciliation?: boolean;
  /** Notes for downstream UI logic (caveats, voice constraints). */
  notes?: string;
}

export const evidenceRegistry: EvidenceItem[] = [
  // ─── LEGAL (E1) ────────────────────────────────────────────────────────
  {
    id: 'legal-nib-1102230032918',
    category: 'legal',
    title: 'NIB — Business Registration Number',
    description:
      'Nomor Induk Berusaha 1102230032918. Government-issued business registration verifiable via the OSS (Online Single Submission) portal.',
    identifier: '1102230032918',
    authority: 'Kementerian Investasi / BKPM (OSS Portal)',
    sha256: 'fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7',
    previewUrl: 'https://javavolcano-touroperator.com/legal/NIB-1102230032918-preview.png',
    externalUrl: 'https://oss.go.id',
    claimSupports: ['C5', 'C8'],
    sourcePage: 'credentials/legal-licenses',
    bestPlacement: ['homepage', 'verify-jvto', 'checkout'],
    costlySignalWeight: 5,
  },
  {
    id: 'legal-tdup-1102230032918',
    category: 'legal',
    title: 'TDUP — Tourism Business License',
    description:
      'Tanda Daftar Usaha Pariwisata 1102230032918. Tourism-specific operating license issued by Dinas Pariwisata Bondowoso.',
    identifier: '1102230032918',
    issuedDate: '2023-02-11',
    authority: 'Dinas Pariwisata Bondowoso (Sistem Tanda Daftar OSS)',
    sha256: '27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3',
    previewUrl: 'https://javavolcano-touroperator.com/legal/TDUP-1102230032918-preview.png',
    externalUrl: 'https://oss.go.id',
    claimSupports: ['C3', 'C5'],
    sourcePage: 'credentials/legal-licenses',
    bestPlacement: ['homepage', 'verify-jvto', 'checkout'],
    costlySignalWeight: 5,
  },
  {
    id: 'legal-ahu-0023020',
    category: 'legal',
    title: 'AHU Company Registry',
    description:
      'Company registry entry AHU-0023020 confirming PT Java Volcano Rendezvous as a registered Indonesian limited liability company.',
    identifier: 'AHU-0023020',
    authority: 'Kementerian Hukum dan HAM — Direktorat Jenderal AHU',
    externalUrl: 'https://ahu.go.id/pencarian/perseroan',
    claimSupports: ['C5'],
    sourcePage: 'credentials/legal-licenses',
    bestPlacement: ['verify-jvto'],
    costlySignalWeight: 4,
  },

  // ─── POLICE (E2) ───────────────────────────────────────────────────────
  {
    id: 'police-sprin-polpar',
    category: 'police',
    title: 'SPRIN POLPAR — Tourist Police Assignment Order',
    description:
      'Official Surat Perintah (assignment order) confirming founder Bripka Agung Sambuko as active Tourist Police officer under Ditpamobvit, East Java.',
    authority: 'Indonesian National Police (Polri) — Ditpamobvit East Java',
    sha256: '03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab',
    previewUrl: 'https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.png',
    claimSupports: ['C1', 'C5'],
    sourcePage: 'credentials/police-integration',
    bestPlacement: ['homepage', 'why-jvto', 'verify-jvto'],
    costlySignalWeight: 5,
    notes:
      'Costly signal — impersonating an Indonesian police officer is a criminal offense. Publishing this document carries enormous risk for a fraudster.',
  },
  {
    id: 'police-sprin-wal-travel-2024-02-12',
    category: 'police',
    title: 'SPRIN WAL-TRAVEL — Tourist Police Walkalong Order',
    description:
      'Travel-accompaniment order dated 2024-02-12 authorizing tourist police walkalong activities. Independent operational evidence beyond the standing assignment.',
    issuedDate: '2024-02-12',
    authority: 'Indonesian National Police (Polri) — Ditpamobvit East Java',
    sha256: '179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3',
    previewUrl: 'https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.png',
    claimSupports: ['C1', 'C5'],
    sourcePage: 'credentials/police-integration',
    bestPlacement: ['why-jvto', 'verify-jvto'],
    costlySignalWeight: 5,
  },

  // ─── MEDICAL (E3) ──────────────────────────────────────────────────────
  {
    id: 'medical-dr-irwandanu-sip',
    category: 'medical',
    title: 'Dr. Ahmad Irwandanu — Medical Practice License (SIP)',
    description:
      'Surat Izin Praktik issued by Kemenkes RI for Dr. Ahmad Irwandanu, the licensed physician coordinating the Ijen pre-hike health-screening workflow.',
    identifier: 'STR QN00001073380217',
    authority: 'Kemenkes RI · SatuSehat SDMK · KKI',
    externalUrl: 'https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217',
    claimSupports: ['C4', 'C5'],
    sourcePage: 'people/dr-ahmad-irwandanu',
    bestPlacement: ['why-jvto', 'verify-jvto', 'travel-guide'],
    costlySignalWeight: 5,
    notes:
      'Voice invariant: Ijen health screening is mandatory for every guest before crater entry; cite BBKSDA SE.1658/KSA.9/2024 as the supporting authority (adjudicated 2026-07-06 — not a conditional trigger).',
  },
  {
    id: 'medical-bbksda-se-1658',
    category: 'medical',
    title: 'BBKSDA SE.1658/KSA.9/2024 — Ijen Access Health Regulation',
    description:
      'Surat Edaran BBKSDA Jawa Timur establishing the mandatory health-screening requirement for every guest before Mount Ijen access. JVTO coordinates this workflow for all guests.',
    identifier: 'SE.1658/KSA.9/2024',
    authority: 'BBKSDA Jawa Timur',
    externalUrl: 'https://bbksdajatim.org',
    claimSupports: ['C4', 'C8'],
    sourcePage: 'credentials/medical-screening',
    bestPlacement: ['why-jvto', 'verify-jvto', 'travel-guide', 'package'],
    costlySignalWeight: 4,
  },

  // ─── PARTNERS (E8) ─────────────────────────────────────────────────────
  {
    id: 'partner-hpwki',
    category: 'partners',
    title: 'HPWKI — Ijen Specialist Guide Association',
    description:
      'Himpunan Pelaku Wisata Khusus Ijen (AHU-0001072.AH.01.07.TAHUN 2024). Membership requires BBKSDA-supervised volcanic safety training (SAR + first aid + disaster mitigation).',
    identifier: 'AHU-0001072.AH.01.07.TAHUN 2024',
    authority: 'State-Recognized association (AHU registry)',
    sha256: 'ca1fb1a48b550a7748d400f165899f12a356e6941aacdde9c043427698aaf63b',
    previewUrl: 'https://javavolcano-touroperator.com/legal/HPWKI-approval-preview.png',
    externalUrl:
      'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
    claimSupports: ['C8', 'C7', 'C1'],
    sourcePage: 'credentials/trust-signals',
    bestPlacement: ['why-jvto', 'verify-jvto', 'team'],
    costlySignalWeight: 4,
    notes:
      'Strategic value: proves guide competence is institutional, not self-reported. Cannot be purchased.',
  },
  {
    id: 'partner-indecon',
    category: 'partners',
    title: 'INDECON — Indonesian Ecotourism Network',
    description:
      'Live member of Indonesian Ecotourism Network. Validates community-based tourism and Local Boys employment policy.',
    authority: 'NGO — Indonesian Ecotourism Network',
    externalUrl: 'https://www.indecon.id/spotlight-networks/java-volcano-tour-operator',
    claimSupports: ['C8'],
    sourcePage: 'credentials/trust-signals',
    bestPlacement: ['verify-jvto'],
    costlySignalWeight: 3,
  },
  {
    id: 'partner-isic-259268',
    category: 'partners',
    title: 'ISIC — Official Student Pricing Provider',
    description:
      'Official ISIC provider (ID 259268). Student identity verified in real-time via Alive Verify API.',
    identifier: '259268',
    authority: 'UNESCO-endorsed ISIC',
    externalUrl: 'https://www.isic.org/discounts/?providerId=259268',
    claimSupports: ['C8'],
    sourcePage: 'credentials/trust-signals',
    bestPlacement: ['verify-jvto', 'package'],
    costlySignalWeight: 4,
  },

  // ─── HISTORY (CONTINUITY) ─────────────────────────────────────────────
  {
    id: 'history-booking-2015-award',
    category: 'history',
    title: 'Booking.com 2015 Guest Review Award — Ijen Bondowoso Homestay',
    description:
      'Guest Review Award (Score 9.4/10) plaque shipped to "Agung, Jl. Khairil Anwar No.102, Bondowoso" — same address as PT Java Volcano Rendezvous office today. Anchors operational continuity from 2015.',
    issuedDate: '2015',
    authority: 'Booking.com',
    fileUrl: 'https://javavolcano-touroperator.com/history/booking-2015-plaque.jpg',
    previewUrl: 'https://javavolcano-touroperator.com/history/booking-2015-plaque.jpg',
    claimSupports: ['C5', 'C9'],
    sourcePage: 'credentials/trust-signals',
    bestPlacement: ['why-jvto', 'verify-jvto'],
    costlySignalWeight: 3,
  },
  {
    id: 'history-booking-2015-shipping-label',
    category: 'history',
    title: 'Booking.com 2015 — Address Continuity Proof',
    description:
      'Shipping label from Booking.com award delivery confirming Jl. Khairil Anwar No.102, Bondowoso, as the operational address since 2015.',
    issuedDate: '2015',
    fileUrl: 'https://javavolcano-touroperator.com/history/booking-2015-shipping-label.jpg',
    previewUrl: 'https://javavolcano-touroperator.com/history/booking-2015-shipping-label.jpg',
    claimSupports: ['C5'],
    sourcePage: 'credentials/trust-signals',
    bestPlacement: ['verify-jvto'],
    costlySignalWeight: 4,
  },
  {
    id: 'history-stefan-loose-guidebook',
    category: 'history',
    title: 'Stefan Loose Reiseführer Indonesien — Editorial Feature',
    description:
      '"Agung" named as operator of Ijen Bondowoso Homestay on page 287 of the Stefan Loose Reiseführer Indonesien: mit Reiseatlas. Independent editorial mention — a German-language Indonesia guidebook.',
    identifier: 'ISBN-13 9783770167654',
    authority: 'Stefan Loose Reiseführer Indonesien: mit Reiseatlas',
    fileUrl: 'https://javavolcano-touroperator.com/history/stefan-loose-ijen-bondowoso-page.png',
    previewUrl: 'https://javavolcano-touroperator.com/history/stefan_loose_crop_enh.jpg',
    claimSupports: ['C9', 'C5'],
    sourcePage: 'credentials/press-coverage',
    bestPlacement: ['why-jvto', 'verify-jvto', 'homepage'],
    costlySignalWeight: 4,
    notes:
      'LOCKED BUSINESS ASSET (owner-approved 2026-05-27); ISBN/edition/year field superseded 2026-07-31 by cross-repo adjudication (llm-wiki DEC-001, 2026-06-25; OKF references/stefan-loose-indonesien-3770167651, last_verified 2026-06-26) — the previously-locked ISBN 978-3-7701-7881-0 / 4th Edition / 2018 was never independently evidenced by either source; both agree only on ISBN-13 9783770167654, page 287, with no year, publisher, or edition asserted. Schema mapping: use Book with isbn "9783770167654", inLanguage "de". Do not assert datePublished, bookEdition, publisher, or numberOfPages. Connect via Organization.subjectOf → Book.',
  },

  // ─── PRESS (E5 / C9) ───────────────────────────────────────────────────
  {
    id: 'press-detik-2021-03-14',
    category: 'press',
    title: 'Detik.com — Bondowoso Tourist Police Coverage',
    description:
      'Independent national-media article. Verbatim quote from Bripka Agung Sambuko during COVID-19 long-holiday weekend duty at Kawah Wurung.',
    issuedDate: '2021-03-14',
    authority: 'Detik.com',
    sha256: 'b257b75b3d2b9edebf07c9af89a6c6aa9a4e01d6a716ef3f7c4ca75deda64b77',
    externalUrl:
      'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
    previewUrl:
      'https://javavolcano-touroperator.com/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png',
    claimSupports: ['C1', 'C5', 'C9'],
    sourcePage: 'credentials/press-coverage',
    bestPlacement: ['verify-jvto', 'why-jvto'],
    costlySignalWeight: 4,
  },
  {
    id: 'press-radarjember-polpar-2021-03-24',
    category: 'press',
    title: 'Radar Jember — Polpar Formation for Ijen Geopark',
    description:
      'Regional press confirmation of Tourist Police unit formation specifically to support the Ijen Geopark initiative. Institutional-role verification, independent of operator self-attestation.',
    issuedDate: '2021-03-24',
    authority: 'Radar Jember / Jawa Pos',
    sha256: '2a60eb168274004283b2b9939ccbf5982c12a7db854fda014308a2494ee2abf4',
    externalUrl:
      'https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark',
    previewUrl:
      'https://javavolcano-touroperator.com/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png',
    claimSupports: ['C1', 'C5', 'C9'],
    sourcePage: 'credentials/press-coverage',
    bestPlacement: ['verify-jvto'],
    costlySignalWeight: 3,
  },
  {
    id: 'press-radarjember-bau-menyengat-2021-05-27',
    category: 'press',
    title: 'Radar Jember — Tourist Police Ijen Crater Patrol',
    description:
      'On-ground operational presence at Ijen crater monitoring sulfuric odor conditions and visitor safety.',
    issuedDate: '2021-05-27',
    authority: 'Radar Jember / Jawa Pos',
    externalUrl:
      'https://radarjember.jawapos.com/bondowoso/791103903/tak-seharusnya-bau-menyengat-itu-ada',
    claimSupports: ['C1', 'C9'],
    sourcePage: 'credentials/press-coverage',
    bestPlacement: ['verify-jvto'],
    costlySignalWeight: 3,
  },
  {
    id: 'press-bbksda-pelatihan-2024-05-24',
    category: 'press',
    title: 'BBKSDA Jatim — HPWKI Guide Training Report',
    description:
      'Official BBKSDA report covering guide training for HPWKI members: SAR + first aid + disaster mitigation. Validates HPWKI training chain.',
    issuedDate: '2024-05-24',
    authority: 'BBKSDA Jawa Timur (institutional)',
    externalUrl: 'https://bbksdajatim.org/pelatihan-pemandu-kawah-ijen/',
    previewUrl: 'https://javavolcano-touroperator.com/press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen.png',
    claimSupports: ['C1', 'C4', 'C5', 'C8'],
    sourcePage: 'credentials/press-coverage',
    bestPlacement: ['verify-jvto', 'why-jvto'],
    costlySignalWeight: 5,
  },

  // ─── REVIEWS (E5) ──────────────────────────────────────────────────────
  {
    id: 'reviews-google-maps',
    category: 'reviews',
    title: 'Google Maps Reviews — 4.9 from 123',
    description:
      'Google Maps live review profile. 123 reviews at 4.9/5 average (verified via Google Maps API 2026-05-26).',
    authority: 'Google',
    externalUrl: 'https://www.google.com/maps?cid=1266403973589689021',
    claimSupports: ['C6'],
    sourcePage: 'reviews/google-tripadvisor-2026',
    bestPlacement: ['homepage', 'why-jvto', 'verify-jvto', 'package'],
    costlySignalWeight: 4,
  },
  {
    id: 'reviews-trustpilot',
    category: 'reviews',
    title: 'Trustpilot Reviews — 4.8 from 51',
    description:
      'Trustpilot verified review profile. 51 reviews at 4.8/5 average (verified 2026-05-18).',
    authority: 'Trustpilot',
    externalUrl: 'https://trustpilot.com/review/javavolcano-touroperator.com',
    claimSupports: ['C6'],
    sourcePage: 'reviews/trustpilot-compilation',
    bestPlacement: ['homepage', 'why-jvto', 'verify-jvto', 'package'],
    costlySignalWeight: 4,
  },
  {
    id: 'reviews-tripadvisor',
    category: 'reviews',
    title: 'TripAdvisor Reviews — 4.95 from 21',
    description:
      'TripAdvisor live review profile. 21 reviews at 4.95/5 average (verified 2026-05-12).',
    authority: 'TripAdvisor',
    externalUrl:
      'https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html',
    claimSupports: ['C6'],
    sourcePage: 'reviews/google-tripadvisor-2026',
    bestPlacement: ['why-jvto', 'verify-jvto'],
    costlySignalWeight: 4,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

/** Filter evidence by category. */
export function evidenceByCategory(category: EvidenceCategory): EvidenceItem[] {
  return evidenceRegistry.filter((e) => e.category === category);
}

/** Filter evidence by supported claim. */
export function evidenceByClaim(claim: ClaimId): EvidenceItem[] {
  return evidenceRegistry.filter((e) => e.claimSupports.includes(claim));
}

/** Filter evidence by recommended placement. */
export function evidenceByPlacement(placement: Placement): EvidenceItem[] {
  return evidenceRegistry.filter((e) => e.bestPlacement.includes(placement));
}

/** Get the highest-weight evidence supporting a given claim (for hero/AuthorityShield). */
export function topEvidenceForClaim(claim: ClaimId): EvidenceItem | undefined {
  return evidenceByClaim(claim)
    .sort((a, b) => b.costlySignalWeight - a.costlySignalWeight)[0];
}

/** Aggregate stats for trust-hub UI. */
export function evidenceStats() {
  return {
    total: evidenceRegistry.length,
    withHash: evidenceRegistry.filter((e) => !!e.sha256).length,
    byCategory: {
      legal: evidenceByCategory('legal').length,
      police: evidenceByCategory('police').length,
      medical: evidenceByCategory('medical').length,
      history: evidenceByCategory('history').length,
      partners: evidenceByCategory('partners').length,
      press: evidenceByCategory('press').length,
      reviews: evidenceByCategory('reviews').length,
    },
    underReconciliation: evidenceRegistry.filter((e) => e.underReconciliation).length,
  };
}
