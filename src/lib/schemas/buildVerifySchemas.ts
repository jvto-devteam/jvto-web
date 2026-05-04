// src/lib/schemas/buildVerifySchemas.ts — Schema builders for /verify-jvto cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildVerifySchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 4: WebPage + BreadcrumbList + FAQPage + DigitalDocument chain
// + cross-refs to globally-injected ORG / FOUNDER / DEFINED_TERMS / DOCTOR (where relevant).
import { DOCTOR_SCHEMA } from '@/lib/schemas/entityGraph';
import type { QaPair } from '@/lib/tourFaqs';

const BASE_URL = 'https://javavolcano-touroperator.com';

interface VerifyPageArgs {
  /** Path segment after /verify-jvto/ — '' for hub, 'legal'/'police-safety'/etc for sub-pages. */
  subpath: '' | 'legal' | 'police-safety' | 'press-recognition' | 'history-artifacts';
  /** Page display name for breadcrumb. */
  pageName: string;
  /** WebPage description for AEO. */
  description: string;
  /** Cross-referenced DefinedTerm @ids that this page mentions (always-global, just rendered in copy). */
  mentionsTermIds?: string[];
}

function pageUrl(subpath: VerifyPageArgs['subpath']): string {
  return subpath ? `${BASE_URL}/verify-jvto/${subpath}` : `${BASE_URL}/verify-jvto`;
}

export function buildVerifyWebPageSchema({ subpath, pageName, description, mentionsTermIds }: VerifyPageArgs) {
  const url = pageUrl(subpath);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: pageName,
    description,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
    about: { '@id': `${BASE_URL}/#organization` },
    ...(mentionsTermIds?.length
      ? { mentions: mentionsTermIds.map((id) => ({ '@id': `${BASE_URL}/${id}` })) }
      : {}),
  };
}

export function buildVerifyBreadcrumbSchema({ subpath, pageName }: VerifyPageArgs) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Verify JVTO', item: `${BASE_URL}/verify-jvto` },
  ];
  if (subpath) {
    items.push({ '@type': 'ListItem', position: 3, name: pageName, item: pageUrl(subpath) });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function buildVerifyFaqSchema(faqs: QaPair[], subpath: VerifyPageArgs['subpath']) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl(subpath)}#faq`,
    mainEntity: faqs.map((p) => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer },
    })),
  };
}

/**
 * DigitalDocument chain for /verify-jvto/legal — NIB + TDUP + HPWKI as scannable evidence.
 * Each links to actual PDF asset; describes credential type + issuing authority.
 * AI engines treat DigitalDocument as authoritative proof artifacts.
 */
export const LEGAL_DIGITAL_DOCUMENTS = [
  {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    '@id': `${BASE_URL}/verify-jvto/legal#nib-document`,
    name: 'JVTO NIB Document (Nomor Induk Berusaha)',
    url: `${BASE_URL}/legal/NIB-1102230032918.pdf`,
    encodingFormat: 'application/pdf',
    about: { '@id': `${BASE_URL}/#term-nib` },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'OSS Indonesia (Online Single Submission)',
      url: 'https://oss.go.id',
    },
    inLanguage: 'id',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    '@id': `${BASE_URL}/verify-jvto/legal#tdup-document`,
    name: 'JVTO TDUP Document (Tanda Daftar Usaha Pariwisata)',
    url: `${BASE_URL}/legal/TDUP-1102230032918.pdf`,
    encodingFormat: 'application/pdf',
    dateCreated: '2023-02-11',
    about: { '@id': `${BASE_URL}/#term-tdup` },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Kementerian Pariwisata dan Ekonomi Kreatif',
    },
    inLanguage: 'id',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    '@id': `${BASE_URL}/verify-jvto/legal#hpwki-document`,
    name: 'JVTO HPWKI Approval Document (Himpunan Pelaku Wisata Khusus Ijen)',
    url: `${BASE_URL}/legal/HPWKI-approval.pdf`,
    encodingFormat: 'application/pdf',
    about: { '@id': `${BASE_URL}/#term-hpwki` },
    publisher: {
      '@type': 'Organization',
      name: 'HPWKI (BBKSDA Jawa Timur supervised)',
      sameAs:
        'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
    },
    inLanguage: 'id',
  },
];

/**
 * DigitalDocument chain for /verify-jvto/police-safety — SPRIN-POLPAR + SPRIN-WAL-TRAVEL.
 * Both reference founder via about @id; both linked to POLRI as publisher.
 */
export const POLICE_SAFETY_DIGITAL_DOCUMENTS = [
  {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    '@id': `${BASE_URL}/verify-jvto/police-safety#sprin-polpar`,
    name: 'SPRIN-POLPAR (Tourist Police Assignment Letter)',
    url: `${BASE_URL}/legal/SPRIN-POLPAR.pdf`,
    encodingFormat: 'application/pdf',
    about: { '@id': `${BASE_URL}/#agung-sambuko` },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Indonesian National Police (POLRI)',
      url: 'https://polri.go.id',
    },
    inLanguage: 'id',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    '@id': `${BASE_URL}/verify-jvto/police-safety#sprin-wal-travel`,
    name: 'SPRIN-WAL-TRAVEL (Active Travel Order, February 2024)',
    url: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp`,
    dateCreated: '2024-02-12',
    about: { '@id': `${BASE_URL}/#agung-sambuko` },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Indonesian National Police (POLRI)',
    },
    inLanguage: 'id',
  },
];

/**
 * Re-export DOCTOR_SCHEMA for cross-cluster use on /verify-jvto/legal — proves regulatory chain end-to-end.
 */
export { DOCTOR_SCHEMA };

const PRESS_URL = `${BASE_URL}/verify-jvto/press-recognition`;

/**
 * Third-party citation schemas for /verify-jvto/press-recognition.
 * Each node stands alone via @id; PRESS_ORGANIZATION_SUBJECTS wires them back to /#organization via subjectOf.
 * Types: Book (Stefan Loose), NewsArticle ×2 (Detik + Radar Jember), Award (Booking.com 2015).
 */
export const PRESS_RECOGNITION_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${PRESS_URL}#stefan-loose`,
    name: 'Indonesien (Stefan Loose Reiseführer)',
    isbn: '978-3-7701-7881-0',
    publisher: {
      '@type': 'Organization',
      name: 'DuMont Reiseverlag',
      url: 'https://www.stefanloose.de',
    },
    datePublished: '2018',
    inLanguage: 'de',
    about: { '@id': `${BASE_URL}/#organization` },
    mentions: [{ '@id': `${BASE_URL}/#agung-sambuko` }],
    image: `${BASE_URL}/history/stefan_loose_crop_enh.jpg`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${PRESS_URL}#detik-2021`,
    headline: 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin',
    datePublished: '2021-03-14',
    url: 'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Detik.com',
      url: 'https://www.detik.com',
    },
    about: { '@id': `${BASE_URL}/#organization` },
    mentions: [{ '@id': `${BASE_URL}/#agung-sambuko` }],
    image: `${BASE_URL}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${PRESS_URL}#radarjember-2021`,
    headline: 'Polpar Dibentuk untuk Mendukung Ijen Geopark',
    datePublished: '2021-03-24',
    url: 'https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark',
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Radar Jember (Jawa Pos)',
      url: 'https://radarjember.jawapos.com',
    },
    about: { '@id': `${BASE_URL}/#organization` },
    mentions: [{ '@id': `${BASE_URL}/#agung-sambuko` }],
    image: `${BASE_URL}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Award',
    '@id': `${PRESS_URL}#booking-award-2015`,
    name: 'Booking.com Guest Review Award 2015',
    description:
      'Guest Review Award with score 9.4 / 10 issued to the guesthouse operated at Jl. Khairil Anwar 102A, Bondowoso — pre-incorporation proof of JVTO operational roots.',
    recognizedBy: {
      '@type': 'Organization',
      name: 'Booking.com',
      url: 'https://www.booking.com',
    },
    about: { '@id': `${BASE_URL}/#organization` },
    image: `${BASE_URL}/history/booking-2015-plaque.jpg`,
  },
];

/**
 * Partial Organization node declaring press items as subjectOf.
 * JSON-LD processors merge this with the global /#organization node from entityGraph.ts via @id.
 * Do NOT modify entityGraph.ts — this is the correct pattern for page-scoped additions.
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
