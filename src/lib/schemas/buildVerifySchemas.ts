// src/lib/schemas/buildVerifySchemas.ts — Schema builders for /verify-jvto cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildVerifySchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 4: WebPage + BreadcrumbList + FAQPage + DigitalDocument chain
// + cross-refs to globally-injected ORG / FOUNDER / DEFINED_TERMS / DOCTOR (where relevant).
//
// Editorial facts (document names, dates, URLs, publisher names, ISBN, headlines, award
// descriptions) are sourced from ekosistem's `pageContent.schemaFacts` for each route and
// passed into the builder functions below. Structural JSON-LD scaffolding (@context, @type,
// @id patterns, about/mentions/recognizedBy wiring) stays hardcoded here since @id values are
// referenced by other nodes and must remain stable. FALLBACK_*_FACTS below hold the exact
// original literal values, used whenever ekosistem doesn't supply `schemaFacts`.
import { buildDoctorSchema } from '@/lib/schemas/entityGraph';

const BASE_URL = 'https://javavolcano-touroperator.com';

/**
 * Editorial facts for /verify-jvto/legal DigitalDocument chain (NIB + TDUP + HPWKI).
 * Mirrors ekosistem's `pageContent.schemaFacts` shape for legal.source.json.
 */
export const FALLBACK_LEGAL_FACTS = {
  nibDocument: {
    name: 'JVTO NIB Document (Nomor Induk Berusaha)',
    url: `${BASE_URL}/legal/NIB-1102230032918.pdf`,
    publisherName: 'OSS Indonesia (Online Single Submission)',
    publisherUrl: 'https://oss.go.id',
  },
  tdupDocument: {
    name: 'JVTO TDUP Document (Tanda Daftar Usaha Pariwisata)',
    url: `${BASE_URL}/legal/TDUP-1102230032918.pdf`,
    dateCreated: '2023-02-11',
    publisherName: 'Kementerian Pariwisata dan Ekonomi Kreatif',
  },
  hpwkiDocument: {
    name: 'JVTO HPWKI Approval Document (Himpunan Pelaku Wisata Khusus Ijen)',
    url: `${BASE_URL}/legal/HPWKI-approval.pdf`,
    publisherName: 'HPWKI (BBKSDA Jawa Timur supervised)',
    publisherSameAs:
      'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
  },
};

type LegalFacts = typeof FALLBACK_LEGAL_FACTS;

/**
 * DigitalDocument chain for /verify-jvto/legal — NIB + TDUP + HPWKI as scannable evidence.
 * Each links to actual PDF asset; describes credential type + issuing authority.
 * AI engines treat DigitalDocument as authoritative proof artifacts.
 */
export function buildLegalDigitalDocuments(facts?: {
  nibDocument?: Partial<LegalFacts['nibDocument']>;
  tdupDocument?: Partial<LegalFacts['tdupDocument']>;
  hpwkiDocument?: Partial<LegalFacts['hpwkiDocument']>;
}) {
  const nib = { ...FALLBACK_LEGAL_FACTS.nibDocument, ...facts?.nibDocument };
  const tdup = { ...FALLBACK_LEGAL_FACTS.tdupDocument, ...facts?.tdupDocument };
  const hpwki = { ...FALLBACK_LEGAL_FACTS.hpwkiDocument, ...facts?.hpwkiDocument };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      '@id': `${BASE_URL}/verify-jvto/legal#nib-document`,
      name: nib.name,
      url: nib.url,
      encodingFormat: 'application/pdf',
      about: { '@id': `${BASE_URL}/#term-nib` },
      publisher: {
        '@type': 'GovernmentOrganization',
        name: nib.publisherName,
        url: nib.publisherUrl,
      },
      inLanguage: 'id',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      '@id': `${BASE_URL}/verify-jvto/legal#tdup-document`,
      name: tdup.name,
      url: tdup.url,
      encodingFormat: 'application/pdf',
      dateCreated: tdup.dateCreated,
      about: { '@id': `${BASE_URL}/#term-tdup` },
      publisher: {
        '@type': 'GovernmentOrganization',
        name: tdup.publisherName,
      },
      inLanguage: 'id',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      '@id': `${BASE_URL}/verify-jvto/legal#hpwki-document`,
      name: hpwki.name,
      url: hpwki.url,
      encodingFormat: 'application/pdf',
      about: { '@id': `${BASE_URL}/#term-hpwki` },
      publisher: {
        '@type': 'Organization',
        name: hpwki.publisherName,
        sameAs: hpwki.publisherSameAs,
      },
      inLanguage: 'id',
    },
  ];
}

/**
 * Editorial facts for /verify-jvto/police-safety DigitalDocument chain
 * (SPRIN-POLPAR + SPRIN-WAL-TRAVEL). Mirrors ekosistem's `pageContent.schemaFacts`
 * shape for police-safety.source.json.
 */
export const FALLBACK_POLICE_SAFETY_FACTS = {
  sprinPolpar: {
    name: 'SPRIN-POLPAR (Tourist Police Assignment Letter)',
    url: `${BASE_URL}/legal/SPRIN-POLPAR.pdf`,
    publisherName: 'Indonesian National Police (POLRI)',
    publisherUrl: 'https://polri.go.id',
  },
  sprinWalTravel: {
    name: 'SPRIN-WAL-TRAVEL — traffic-escort order Sprin/70/II/HUK.6.6./2024, 12 February 2024',
    url: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp`,
    dateCreated: '2024-02-12',
    publisherName: 'Indonesian National Police (POLRI)',
  },
};

type PoliceSafetyFacts = typeof FALLBACK_POLICE_SAFETY_FACTS;

/**
 * DigitalDocument chain for /verify-jvto/police-safety — SPRIN-POLPAR + SPRIN-WAL-TRAVEL.
 * Both reference founder via about @id; both linked to POLRI as publisher.
 */
export function buildPoliceSafetyDigitalDocuments(facts?: {
  sprinPolpar?: Partial<PoliceSafetyFacts['sprinPolpar']>;
  sprinWalTravel?: Partial<PoliceSafetyFacts['sprinWalTravel']>;
}) {
  const polpar = { ...FALLBACK_POLICE_SAFETY_FACTS.sprinPolpar, ...facts?.sprinPolpar };
  const walTravel = { ...FALLBACK_POLICE_SAFETY_FACTS.sprinWalTravel, ...facts?.sprinWalTravel };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      '@id': `${BASE_URL}/verify-jvto/police-safety#sprin-polpar`,
      name: polpar.name,
      url: polpar.url,
      encodingFormat: 'application/pdf',
      about: { '@id': `${BASE_URL}/#agung-sambuko` },
      publisher: {
        '@type': 'GovernmentOrganization',
        name: polpar.publisherName,
        url: polpar.publisherUrl,
      },
      inLanguage: 'id',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      '@id': `${BASE_URL}/verify-jvto/police-safety#sprin-wal-travel`,
      name: walTravel.name,
      url: walTravel.url,
      dateCreated: walTravel.dateCreated,
      about: { '@id': `${BASE_URL}/#agung-sambuko` },
      publisher: {
        '@type': 'GovernmentOrganization',
        name: walTravel.publisherName,
      },
      inLanguage: 'id',
    },
  ];
}

/**
 * Re-export buildDoctorSchema for cross-cluster use on /verify-jvto/legal — proves regulatory
 * chain end-to-end. entityGraph.ts's facts fetch/merge happens in the calling page (same
 * pattern as buildLegalDigitalDocuments above) — this is a pure passthrough.
 */
export { buildDoctorSchema };

const PRESS_URL = `${BASE_URL}/verify-jvto/press-recognition`;

/**
 * Editorial facts for /verify-jvto/press-recognition third-party citation schemas.
 * Mirrors ekosistem's `pageContent.schemaFacts` shape for press-recognition.source.json.
 */
export const FALLBACK_PRESS_RECOGNITION_FACTS = {
  stefanLoose: {
    name: 'Indonesien (Stefan Loose Reiseführer)',
    isbn: '978-3-7701-7881-0',
    publisherName: 'DuMont Reiseverlag',
    publisherUrl: 'https://www.stefanloose.de',
    datePublished: '2018',
    image: `${BASE_URL}/history/stefan_loose_crop_enh.jpg`,
  },
  detik2021: {
    headline: 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin',
    datePublished: '2021-03-14',
    url: 'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
    publisherName: 'Detik.com',
    publisherUrl: 'https://www.detik.com',
    image: `${BASE_URL}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png`,
  },
  radarjember2021: {
    headline: 'Polpar Dibentuk untuk Mendukung Ijen Geopark',
    datePublished: '2021-03-24',
    url: 'https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark',
    publisherName: 'Radar Jember (Jawa Pos)',
    publisherUrl: 'https://radarjember.jawapos.com',
    image: `${BASE_URL}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png`,
  },
  bookingAward2015: {
    name: 'Booking.com Guest Review Award 2015',
    description:
      'Guest Review Award with score 9.4 / 10 issued to the guesthouse operated at Jl. Khairil Anwar 102A, Bondowoso — pre-incorporation proof of JVTO operational roots.',
    recognizedByName: 'Booking.com',
    recognizedByUrl: 'https://www.booking.com',
    imagePlaque: `${BASE_URL}/history/booking-2015-plaque.jpg`,
    imageShippingLabel: `${BASE_URL}/history/booking-2015-shipping-label.jpg`,
    additionalPropertyValue: 'Jl. Khairil Anwar 102A, Bondowoso',
    additionalPropertyDescription:
      'Original Booking.com award shipping label confirms delivery to Jl. Khairil Anwar 102A, Bondowoso — the same address registered under NIB 1102230032918 and current JVTO operational address. Establishes unbroken address continuity from 2015 guesthouse era to present.',
  },
};

type PressRecognitionFacts = typeof FALLBACK_PRESS_RECOGNITION_FACTS;

/**
 * Third-party citation schemas for /verify-jvto/press-recognition.
 * Each node stands alone via @id; PRESS_ORGANIZATION_SUBJECTS wires them back to /#organization via subjectOf.
 * Types: Book (Stefan Loose), NewsArticle ×2 (Detik + Radar Jember), Award (Booking.com 2015).
 */
export function buildPressRecognitionSchemas(facts?: {
  stefanLoose?: Partial<PressRecognitionFacts['stefanLoose']>;
  detik2021?: Partial<PressRecognitionFacts['detik2021']>;
  radarjember2021?: Partial<PressRecognitionFacts['radarjember2021']>;
  bookingAward2015?: Partial<PressRecognitionFacts['bookingAward2015']>;
}) {
  const stefanLoose = { ...FALLBACK_PRESS_RECOGNITION_FACTS.stefanLoose, ...facts?.stefanLoose };
  const detik2021 = { ...FALLBACK_PRESS_RECOGNITION_FACTS.detik2021, ...facts?.detik2021 };
  const radarjember2021 = {
    ...FALLBACK_PRESS_RECOGNITION_FACTS.radarjember2021,
    ...facts?.radarjember2021,
  };
  const bookingAward2015 = {
    ...FALLBACK_PRESS_RECOGNITION_FACTS.bookingAward2015,
    ...facts?.bookingAward2015,
  };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Book',
      '@id': `${PRESS_URL}#stefan-loose`,
      name: stefanLoose.name,
      isbn: stefanLoose.isbn,
      publisher: {
        '@type': 'Organization',
        name: stefanLoose.publisherName,
        url: stefanLoose.publisherUrl,
      },
      datePublished: stefanLoose.datePublished,
      inLanguage: 'de',
      about: { '@id': `${BASE_URL}/#organization` },
      mentions: [{ '@id': `${BASE_URL}/#agung-sambuko` }],
      image: stefanLoose.image,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      '@id': `${PRESS_URL}#detik-2021`,
      headline: detik2021.headline,
      datePublished: detik2021.datePublished,
      url: detik2021.url,
      publisher: {
        '@type': 'NewsMediaOrganization',
        name: detik2021.publisherName,
        url: detik2021.publisherUrl,
      },
      about: { '@id': `${BASE_URL}/#organization` },
      mentions: [{ '@id': `${BASE_URL}/#agung-sambuko` }],
      image: detik2021.image,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      '@id': `${PRESS_URL}#radarjember-2021`,
      headline: radarjember2021.headline,
      datePublished: radarjember2021.datePublished,
      url: radarjember2021.url,
      publisher: {
        '@type': 'NewsMediaOrganization',
        name: radarjember2021.publisherName,
        url: radarjember2021.publisherUrl,
      },
      about: { '@id': `${BASE_URL}/#organization` },
      mentions: [{ '@id': `${BASE_URL}/#agung-sambuko` }],
      image: radarjember2021.image,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Award',
      '@id': `${PRESS_URL}#booking-award-2015`,
      name: bookingAward2015.name,
      description: bookingAward2015.description,
      recognizedBy: {
        '@type': 'Organization',
        name: bookingAward2015.recognizedByName,
        url: bookingAward2015.recognizedByUrl,
      },
      about: { '@id': `${BASE_URL}/#organization` },
      // Both plaque + shipping label as evidence pair
      image: [bookingAward2015.imagePlaque, bookingAward2015.imageShippingLabel],
      // additionalProperty: shipping label proves address continuity (2015 delivery address = today's NIB address)
      additionalProperty: {
        '@type': 'PropertyValue',
        propertyID: 'address_continuity_proof',
        name: 'Address Continuity',
        value: bookingAward2015.additionalPropertyValue,
        description: bookingAward2015.additionalPropertyDescription,
      },
    },
  ];
}

/**
 * Partial Organization node declaring press items as subjectOf.
 * JSON-LD processors merge this with the global /#organization node from entityGraph.ts via @id.
 * Do NOT modify entityGraph.ts — this is the correct pattern for page-scoped additions.
 * Pure structural wiring (only @id references, no editorial content) — not sourced from ekosistem.
 */
export const PRESS_ORGANIZATION_SUBJECTS = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  subjectOf: [
    { '@id': `${PRESS_URL}#stefan-loose` },
    { '@id': `${PRESS_URL}#detik-2021` },
    { '@id': `${PRESS_URL}#radarjember-2021` },
    { '@id': `${PRESS_URL}#booking-award-2015` },
  ],
};
