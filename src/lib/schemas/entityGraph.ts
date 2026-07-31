// src/lib/schemas/entityGraph.ts — JVTO Evidence Correlation Schema
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\entityGraph.ts) on 2026-04-29 as part of AEO/GEO port.
// Correlates historical artifacts, police credentials, medical licensing, and crew identity
// into a machine-readable entity graph for E-E-A-T / GEO / AEO signals.
//
// Integration with live's existing schema infrastructure:
// - ORG_ID = `${BASE_URL}/#organization` matches live's `ORG_ID` from src/lib/seo/jsonld/builders.ts.
// - Live's Organization schema is DB-driven via getOrganizationProfile() + buildOrganizationJsonLd();
//   we DO NOT re-export ORGANIZATION_SCHEMA here from the static constant below.
//   ORGANIZATION_SCHEMA in this file is the rewrite's hardcoded version, kept as fallback / reference.
//   Per cluster_role_contracts handoff matrix: page-level @id refs ('@id': ORG_ID) still resolve correctly
//   because live's per-page Org injection uses the same @id.

import { AGGREGATE_RATING } from '@/lib/jvtoReviews';

const BASE_URL = 'https://javavolcano-touroperator.com';
const ORG_ID   = `${BASE_URL}/#organization`;
const AGUNG_ID = `${BASE_URL}/#agung-sambuko`;
const DOCTOR_ID = `${BASE_URL}/#dr-ahmad-irwandanu`;
const CLINIC_ID = `${BASE_URL}/#klinik-bakti-husada`;

// ── Organization (JVTO / PT Java Volcano Rendezvous) ─────────────────────────
// Hardcoded fallback. Live's primary Organization injection happens per-page via PageJsonLdCombined
// (DB-driven via getOrganizationProfile + buildOrganizationJsonLd). Same @id, so cross-page refs resolve.
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': ORG_ID,
  name: 'Java Volcano Tour Operator',
  legalName: 'PT Java Volcano Rendezvous',
  taxID: '1102230032918',
  url: `${BASE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${BASE_URL}/assets/img/jvto-color.png` },
  image: `${BASE_URL}/assets/img/hero/home.webp`,
  foundingDate: '2015',
  slogan: 'Private volcano tours with police-led safety. Ijen, Bromo, Tumpak Sewu.',
  description:
    'Registered Indonesian tour operator (PT Java Volcano Rendezvous, NIB 1102230032918) offering private volcano tours in East Java. Founded by an active Tourist Police officer. HPWKI member with BBKSDA-verified safety training.',
  telephone: '+6282244788833',
  email: 'hello@javavolcano-touroperator.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Khairil Anwar No.102 A',
    addressLocality: 'Bondowoso',
    addressRegion: 'Jawa Timur',
    postalCode: '68214',
    addressCountry: 'ID',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -7.9151, longitude: 113.8232 },
  founder: { '@id': AGUNG_ID },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: String(AGGREGATE_RATING.ratingValue),
    reviewCount: String(AGGREGATE_RATING.reviewCount),
    bestRating: String(AGGREGATE_RATING.bestRating),
    worstRating: String(AGGREGATE_RATING.worstRating),
  },

  // Historical artifacts — proves operational continuity since 2015
  award: [
    'Booking.com Guest Review Award 2015 — Ijen Bondowoso Homestay (Score 9.4/10)',
    'Stefan Loose Reiseführer Indonesien — Editorial Feature (page 287)',
  ],

  // Verified credentials (legal + association).
  // Each identifier is an array pairing the registration number (where applicable) with the
  // SHA-256 forensic anchor of the source document (published in public/llms.txt) as a
  // PropertyValue — machine-verifiable authenticity proof against "ghost operator" fraud.
  // Hashes: wiki/credentials/legal-licenses.md §SHA-256 Forensic Anchors.
  // NOTE: this constant is reference-only (see file header). The LIVE Organization node is
  // DB-driven via buildOrganizationJsonLd(); to render these hashes in production the same
  // hasCredential.identifier PropertyValues must be mirrored into the org `schema_json` DB
  // column (owner/DB task — not editable from application code).
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'NIB (Nomor Induk Berusaha)',
      identifier: [
        { '@type': 'PropertyValue', propertyID: 'NIB', value: '1102230032918' },
        { '@type': 'PropertyValue', propertyID: 'SHA-256', name: 'NIB document SHA-256', value: 'fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7' },
      ],
      url: `${BASE_URL}/legal/NIB-1102230032918.pdf`,
      credentialCategory: 'Indonesian Business Registration',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Kementerian Investasi / BKPM Indonesia',
      },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'TDUP (Tanda Daftar Usaha Pariwisata)',
      identifier: [
        { '@type': 'PropertyValue', propertyID: 'TDUP', value: '1102230032918' },
        { '@type': 'PropertyValue', propertyID: 'SHA-256', name: 'TDUP document SHA-256', value: '27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3' },
      ],
      dateIssued: '2023-02-11',
      url: `${BASE_URL}/legal/TDUP-1102230032918.pdf`,
      credentialCategory: 'Indonesian Tourism Business Licence',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Kementerian Pariwisata dan Ekonomi Kreatif',
      },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'HPWKI Membership (Himpunan Pelaku Wisata Khusus Ijen)',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'SHA-256',
        name: 'HPWKI approval letter SHA-256',
        value: 'ca1fb1a48b550a7748d400f165899f12a356e6941aacdde9c043427698aaf63b',
      },
      url: `${BASE_URL}/legal/HPWKI-approval.pdf`,
      credentialCategory: 'Volcanic Tourism Association — BBKSDA supervised',
      recognizedBy: {
        '@type': 'Organization',
        name: 'HPWKI — supervised by BBKSDA Jawa Timur',
        sameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
      },
    },
  ],

  // Association memberships
  memberOf: [
    {
      '@type': 'Organization',
      name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
      description: 'Ijen volcano guide association; members receive annual BBKSDA safety training on volcanic gas protocols.',
      sameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
    },
    {
      '@type': 'Organization',
      name: 'INDECON (Indonesian Ecotourism Network)',
      sameAs: 'https://www.indecon.id/spotlight-networks/java-volcano-tour-operator',
    },
    {
      '@type': 'Organization',
      name: 'ISIC (International Student Identity Card)',
      sameAs: 'https://www.isic.org/discounts/?providerId=259268',
    },
  ],

  // Third-party press and editorial coverage
  subjectOf: [
    {
      '@type': 'NewsArticle',
      headline: 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin',
      datePublished: '2021-03-14',
      url: 'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
      publisher: { '@type': 'Organization', name: 'Detik.com', url: 'https://detik.com' },
      about: { '@id': AGUNG_ID },
      image: `${BASE_URL}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png`,
    },
    {
      '@type': 'NewsArticle',
      headline: 'Polpar Dibentuk untuk Mendukung Ijen Geopark',
      url: 'https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark',
      publisher: { '@type': 'Organization', name: 'Radar Jember / Jawa Pos' },
      about: { '@type': 'Organization', name: 'Tourist Police Unit, Bondowoso' },
      image: `${BASE_URL}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png`,
    },
    {
      '@type': 'Book',
      name: 'Stefan Loose Reiseführer Indonesien: mit Reiseatlas',
      isbn: '9783770167654',
      inLanguage: 'de',
      url: 'https://www.tripplanner.at/en/product-page/stefan-loose-reisef%C3%BChrer-indonesien',
      description: 'German-language travel guide; independently features Ijen Bondowoso Homestay (JVTO) on page 287 — non-paid editorial listing. Publication year and edition are not asserted.',
      image: `${BASE_URL}/history/stefan-loose-ijen-bondowoso-page.png`,
    },
  ],

  // External platform verification + social profiles (wiki canonical: credentials/trust-signals §social, 2026-05-17)
  sameAs: [
    'https://www.trustpilot.com/review/javavolcano-touroperator.com',
    'https://www.google.com/maps?cid=1266403973589689021',
    'https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html',
    'https://www.getyourguide.com/java-volcano-tour-operator-s260697/',
    'https://www.isic.org/discounts/?providerId=259268',
    'https://www.indecon.id/spotlight-networks/java-volcano-tour-operator',
    'https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==',
    'https://www.facebook.com/javavolcanotours/',
    'https://www.instagram.com/javavolcanotouroperator/',
    'https://twitter.com/jvto_tours',
  ],
};

// ── Agung Sambuko — Founder & Active Tourist Police Officer ───────────────────
// Evidence chain: SPRIN-POLPAR + SPRIN-WAL-TRAVEL-2024 → Ditpamobvit
//                 Detik.com "Bripka Agung Sambuko" → identity confirmation
//                 HPWKI supervisor → BBKSDA training chain
export const FOUNDER_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': AGUNG_ID,
  name: 'Agung Sambuko',
  alternateName: ['Mr. Sam', 'Bripka Agung Sambuko'],
  jobTitle: 'Active Tourist Police Officer, Ditpamobvit East Java',
  description:
    'Bripka Agung Sambuko is an active officer of the Indonesian Tourist Police ' +
    '(Ditpamobvit, East Java) and founder of PT Java Volcano Rendezvous. ' +
    'Police credentials (SPRIN POLPAR + SPRIN WAL-TRAVEL 2024) and independent ' +
    'press coverage (Detik.com 2021-03-14, Radar Jember 2021) verify identity ' +
    'and active deployment.',
  image: [
    {
      '@type': 'ImageObject',
      url: `${BASE_URL}/founder/agung_sambuko.jpg`,
      caption: 'Agung Sambuko, Founder of Java Volcano Tour Operator',
    },
    {
      '@type': 'ImageObject',
      url: `${BASE_URL}/founder/mr-sam-tourist-police-portrait.png`,
      caption: 'Agung Sambuko (Bripka) in official Tourist Police uniform, Bondowoso',
    },
  ],
  worksFor: [
    { '@id': ORG_ID },
    {
      '@type': 'GovernmentOrganization',
      name: 'Direktorat Pengamanan Objek Vital (Ditpamobvit) — Indonesian National Police',
      url: 'https://polri.go.id',
      description: 'Tourist Police directorate responsible for securing vital tourism objects in Indonesia.',
    },
  ],
  memberOf: {
    '@type': 'Organization',
    name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
    description: 'Ijen volcano guide association supervised by BBKSDA Jawa Timur (Ministry of Environment). HPWKI members receive annual training on volcanic gas protocols and evacuation procedures.',
    sameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
  },
  // Police credentials — verifiable government documents.
  // identifier carries the SHA-256 forensic anchor of each source document (published in
  // public/llms.txt) as a PropertyValue — machine-verifiable proof the credential file is
  // authentic and unaltered, defending against "ghost operator" impersonation.
  // Hashes: wiki/credentials/legal-licenses.md §SHA-256 Forensic Anchors.
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'SPRIN POLPAR (Tourist Police Assignment Letter)',
      credentialCategory: 'Law Enforcement — Tourist Police Assignment',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'SHA-256',
        name: 'SPRIN POLPAR document SHA-256',
        value: '03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab',
      },
      url: `${BASE_URL}/legal/SPRIN-POLPAR.pdf`,
      image: `${BASE_URL}/legal/SPRIN-POLPAR.webp`,
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Indonesian National Police (POLRI)',
        url: 'https://polri.go.id',
      },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'SPRIN WAL-TRAVEL (Active Travel Order, February 2024)',
      dateIssued: '2024-02-12',
      credentialCategory: 'Law Enforcement — Active Travel Authorization',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'SHA-256',
        name: 'SPRIN WAL-TRAVEL 2024-02-12 document SHA-256',
        value: '179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3',
      },
      url: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp`,
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Indonesian National Police (POLRI)',
      },
    },
  ],
  // Detik.com article names him as "Bripka Agung Sambuko" — identity confirmation from national press
  sameAs: [
    'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
  ],
  knowsAbout: [
    'East Java Volcano Tourism Safety',
    'Ijen Crater Operations and BBKSDA Regulations',
    'Mount Bromo Tourist Access Management',
    'Indonesian Tourist Police Protocols',
    'HPWKI Volcanic Safety Standards',
    'SE.1658/KSA.9/2024 — Ijen Health Certificate Regulation',
  ],
  // Historical + media context — bidirectional entity linking
  subjectOf: [
    {
      '@type': 'NewsArticle',
      headline: 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin',
      datePublished: '2021-03-14',
      url: 'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
      publisher: { '@type': 'Organization', name: 'Detik.com', url: 'https://detik.com' },
      description: 'National press article naming "Bripka Agung Sambuko" as Tourist Police, Bondowoso — third-party identity confirmation.',
    },
    {
      '@type': 'Book',
      name: 'Stefan Loose Reiseführer Indonesien: mit Reiseatlas',
      isbn: '9783770167654',
      inLanguage: 'de',
      description: 'German travel guide independently referencing tours arranged by Agung at Ijen Bondowoso Homestay on page 287 (non-paid editorial). Publication year and edition are not asserted.',
      image: `${BASE_URL}/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg`,
    },
  ],
};

// ── Dr. Ahmad Irwandanu — Licensed Physician (Ijen Health Screening) ──────────
// Evidence chain: SIP → satusehat.kemkes.go.id (live verification)
//                 KKI → kki.go.id (Indonesian Medical Council)
//                 WorksFor → Klinik Bakti Husada → licensed by Kemenkes
export const DOCTOR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  '@id': DOCTOR_ID,
  name: 'Dr. Ahmad Irwandanu',
  jobTitle: 'Licensed General Practitioner',
  worksFor: {
    '@type': 'MedicalBusiness',
    '@id': CLINIC_ID,
    name: 'Klinik Bakti Husada',
    medicalSpecialty: 'General Practice',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bondowoso',
      addressRegion: 'Jawa Timur',
      addressCountry: 'ID',
    },
    isAcceptingNewPatients: true,
    description: 'Ministry of Health-licensed clinic coordinating Ijen health screening for JVTO guests. Issues health certificates compliant with BBKSDA SE.1658/KSA.9/2024.',
  },
  // Both credentials publicly verifiable online
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'SIP (Surat Izin Praktik) — Medical Practice Licence',
      credentialCategory: 'Indonesian Medical Practice Licence',
      url: 'https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Kementerian Kesehatan Republik Indonesia (Ministry of Health)',
        url: 'https://kemkes.go.id',
      },
      description: 'Publicly verifiable at satusehat.kemkes.go.id — the Indonesian national health registry.',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'KKI Registration (Konsil Kedokteran Indonesia)',
      credentialCategory: 'Indonesian Medical Council Registration',
      url: 'https://kki.go.id/cekdokter/form',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Konsil Kedokteran Indonesia (Indonesian Medical Council)',
        url: 'https://kki.go.id',
      },
    },
  ],
};

// ── BBKSDA Regulation — SE.1658/KSA.9/2024 ───────────────────────────────────
// Regulatory chain: BBKSDA issues regulation → requires health cert → JVTO coordinates → Dr. Ahmad issues cert
export const BBKSDA_REGULATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentService',
  name: 'Ijen Crater Access — Health Certificate Requirement',
  description:
    'Under SE.1658/KSA.9/2024 issued by BBKSDA Jawa Timur, visitors to Kawah Ijen must present a health certificate from a licensed clinic confirming blood pressure and oxygen saturation readings are within safe limits.',
  provider: {
    '@type': 'GovernmentOrganization',
    name: 'BBKSDA Jawa Timur (Balai Besar Konservasi Sumber Daya Alam)',
    description: 'Indonesian Ministry of Environment body responsible for Ijen Crater nature reserve management.',
  },
  serviceOutput: {
    '@type': 'DigitalDocument',
    name: 'Health Certificate for Ijen Crater Access (Surat Keterangan Sehat)',
    url: 'https://javavolcano-touroperator.com/screening/print-surat-sehat-preview.png',
  },
  image: 'https://javavolcano-touroperator.com/screening/bbksda/bbksda-ticket-terms-screenshot.jpeg',
  areaServed: { '@type': 'Place', name: 'Kawah Ijen (Ijen Crater)', geo: { '@type': 'GeoCoordinates', latitude: -8.0581, longitude: 114.2425 } },
};

// ── DefinedTerm glossary — machine-readable definitions for key JVTO terms ───
// Globally injected via (website)/layout.tsx so every page has stable @id refs to all 9 terms
// (7 standard regulatory + 2 brand-custom JVTO operational policies).
// Per-page enrichment (mentioning a term in copy) cross-references via @id, no re-inject needed.
export const DEFINED_TERMS = {
  NIB: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-nib`,
    name: 'NIB (Nomor Induk Berusaha)',
    termCode: '1102230032918',
    description:
      'Indonesian Business Identification Number. Mandatory registration for all legal businesses in Indonesia, issued via the OSS Online Single Submission system. JVTO NIB: 1102230032918.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Indonesian Business Registration System (OSS)',
      url: 'https://oss.go.id',
    },
  },
  TDUP: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-tdup`,
    name: 'TDUP (Tanda Daftar Usaha Pariwisata)',
    termCode: '1102230032918',
    description:
      'Tourism Business Registration Certificate. The mandatory operating licence for tour operators in Indonesia, issued by the Kementerian Pariwisata dan Ekonomi Kreatif via OSS. JVTO TDUP issued 2023-02-11.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Indonesian Tourism Licensing System',
      url: 'https://oss.go.id',
    },
  },
  HPWKI: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-hpwki`,
    name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
    description:
      'Ijen Volcano Tourism Association. Supervised by BBKSDA Jawa Timur (Ministry of Environment). HPWKI members receive annual training on volcanic gas protocols, emergency evacuation, and BBKSDA compliance. Membership is required to operate guided tours on Kawah Ijen.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Indonesian Ecotourism Associations',
      sameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
    },
  },
  KTA: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-kta`,
    name: 'KTA (Kartu Tanda Anggota)',
    description:
      'HPWKI Guide Licence Card. Issued to verified Ijen volcano guides who have completed BBKSDA-supervised safety training. Required for any guide accompanying tourists to Kawah Ijen. Each card carries a unique identifier number.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'HPWKI Guide Certification System',
    },
  },
  POLPAR: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-polpar`,
    name: 'POLPAR (Polisi Pariwisata / Tourist Police)',
    description:
      'Indonesian Tourist Police unit under Ditpamobvit (Directorate of Vital Object Security), Indonesian National Police (POLRI). POLPAR officers are assigned to secure and support tourism areas. Assignment requires a SPRIN (Surat Perintah / Official Order Letter) from POLRI.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Indonesian National Police Specializations',
      url: 'https://polri.go.id',
    },
  },
  BBKSDA: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-bbksda`,
    name: 'BBKSDA (Balai Besar Konservasi Sumber Daya Alam)',
    description:
      'Large-Scale Natural Resource Conservation Agency under the Indonesian Ministry of Environment and Forestry. BBKSDA Jawa Timur manages Kawah Ijen nature reserve and issues access regulations including SE.1658/KSA.9/2024 (health certificate requirement).',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Indonesian Ministry of Environment Bodies',
      url: 'https://www.menlhk.go.id',
    },
  },
  SE1658: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-se1658`,
    name: 'SE.1658/KSA.9/2024',
    description:
      'BBKSDA Jawa Timur circular letter SE.1658/KSA.9/2024. Requires all Kawah Ijen visitors to present a health certificate from a licensed clinic confirming blood pressure and SpO₂ readings are within safe limits before entering the crater area.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'BBKSDA Jawa Timur Regulatory Circulars',
    },
  },
  ISIC: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-isic`,
    name: 'ISIC (International Student Identity Card)',
    description:
      'Global student membership card accepted at 150,000+ discounts in 130+ countries. ' +
      'JVTO is a registered ISIC provider (Provider ID 259268) — Ijen and Bromo tour packages are available at student rates to valid ISIC cardholders. ' +
      'Verifiable at isic.org/discounts/?providerId=259268.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'ISIC Global Student Discount Network',
      url: 'https://www.isic.org',
    },
  },
  INDECON: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-indecon`,
    name: 'INDECON (Indonesian Ecotourism Network)',
    description:
      'Indonesian Ecotourism Network — national advocacy body for responsible tourism and nature conservation. ' +
      'JVTO holds Spotlight Network membership, recognized for responsible volcanic tourism practices at Kawah Ijen and Mount Bromo. ' +
      'Verifiable at indecon.id/spotlight-networks/java-volcano-tour-operator.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Indonesian Ecotourism Organizations',
      sameAs: 'https://www.indecon.id',
    },
  },
  // JVTO-defined operational terms — differentiators not regulated externally.
  // Custom-named DefinedTerms anchor brand-specific concepts in the entity graph so AI engines
  // can extract "what is JVTO Package Credit?" and "what is JVTO FOC Scheme?" with structured answers.
  JVTO_TRAVEL_CREDIT: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-jvto-travel-credit`,
    name: 'JVTO Package Credit',
    description:
      'JVTO operational policy: when a booking is cancelled at least 48 hours before Day 1, the entire amount paid is converted to a Package Credit. ' +
      'Non-expiring (no validity window), transferable to any traveler at no additional cost, denominated in IDR (no FX risk to guest), with zero rebooking fee. ' +
      'Differentiator vs industry-standard expiring vouchers. Force-majeure closures fall under the same policy.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'JVTO Operational Policy Pack v5',
      url: `${BASE_URL}/policy/booking-payment-cancellation`,
    },
  },
  JVTO_FOC_SCHEME: {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/#term-jvto-foc-scheme`,
    name: 'JVTO FOC Scheme',
    description:
      'JVTO Free-of-Charge group-discount scheme: 18 paying pax → 1 free, 35 paying pax → 2 free, 50 paying pax → 3 free. Applies on a single booking ' +
      'across the same trip dates. Transparent published thresholds (no negotiation), automated at checkout. Designed for student trips, ' +
      'corporate retreats, and family-cluster bookings.',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'JVTO Operational Policy Pack v5',
      url: `${BASE_URL}/policy/booking-payment-cancellation`,
    },
  },
} as const;

// ── Crew Person schema generator ──────────────────────────────────────────────
// Proves: named individuals, employed (not freelance), KTA-certified, named in real reviews
export interface ForensicEvidence {
  claim: string;
  quote: string;
  source_author: string;
  source_platform: string;
}

export function buildCrewPersonSchema(member: {
  code: string;
  name: string;
  type: string;
  photoUrl: string | null;
  ktaId?: string;
  ktaCardUrl?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  forensicEvidence?: ForensicEvidence[];
}) {
  const sameAs: string[] = [];
  if (member.socialInstagram) sameAs.push(member.socialInstagram);
  if (member.socialFacebook) sameAs.push(member.socialFacebook);

  const reviews = (member.forensicEvidence ?? [])
    .filter((fe) => fe.quote)
    .map((fe) => ({
      '@type': 'Review',
      reviewBody: fe.quote,
      author: { '@type': 'Person', name: fe.source_author },
      publisher: { '@type': 'Organization', name: fe.source_platform },
    }));

  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#crew-${member.code}`,
    name: member.name,
    jobTitle: member.type === 'Guide' ? 'Licensed Tour Guide' : 'Professional Tour Driver',
    ...(member.photoUrl ? {
      image: { '@type': 'ImageObject', url: member.photoUrl, caption: member.name },
    } : {}),
    // worksFor JVTO proves non-freelance employment
    worksFor: {
      '@id': ORG_ID,
      '@type': 'TravelAgency',
      name: 'Java Volcano Tour Operator',
    },
    employmentType: 'FULL_TIME',
    // KTA credential — issued via HPWKI/local guide association
    ...(member.ktaId ? {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'KTA (Kartu Tanda Anggota) — Guide Licence',
        identifier: member.ktaId,
        credentialCategory: 'Indonesian Tour Guide Licence',
        ...(member.ktaCardUrl ? { url: member.ktaCardUrl } : {}),
        recognizedBy: {
          '@type': 'Organization',
          name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
        },
      },
    } : {}),
    // Social identity — verifiable real person, not anonymous
    ...(sameAs.length > 0 ? { sameAs } : {}),
    // Forensic quotes — named in real published reviews (proves real individual, not generic staff)
    ...(reviews.length > 0 ? {
      review: reviews.length === 1 ? reviews[0] : reviews,
    } : {}),
  };
}
