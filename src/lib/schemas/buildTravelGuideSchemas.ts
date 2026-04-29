// src/lib/schemas/buildTravelGuideSchemas.ts — Schema builders for /travel-guide cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildTravelGuideSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 5: WebPage + BreadcrumbList per page; FAQPage where role demands.
// Special case /ijen-health-screening (Phase 4.6 augment 2026-04-29): MedicalWebPage + HowTo + DOCTOR + BBKSDA + SE1658 cross-refs.
import type { NarrativeClaim } from '@/lib/queries/narrativeClaims';

const BASE_URL = 'https://javavolcano-touroperator.com';

interface TgPageArgs {
  /** Path segment after /travel-guide/ — '' for hub, 'faq' / 'ijen-health-screening' / etc for sub-pages. */
  subpath: string;
  pageName: string;
  description: string;
}

function pageUrl(subpath: string): string {
  return subpath ? `${BASE_URL}/travel-guide/${subpath}` : `${BASE_URL}/travel-guide`;
}

export function buildTgWebPageSchema({ subpath, pageName, description }: TgPageArgs) {
  const url = pageUrl(subpath);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: pageName,
    description,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
  };
}

export function buildTgBreadcrumbSchema({ subpath, pageName }: TgPageArgs) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Travel Guide', item: `${BASE_URL}/travel-guide` },
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

/**
 * FAQPage from narrative_claims wired to a travel-guide page (primary_page='/travel-guide/...').
 * Empty input → returns null (no schema injection). Mirrors why-jvto pattern.
 */
export function buildTgFaqSchema(claims: NarrativeClaim[], subpath: string) {
  const usable = claims.filter((c) => c.pillar && c.core_claim);
  if (!usable.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl(subpath)}#faq`,
    mainEntity: usable.map((c) => ({
      '@type': 'Question',
      name: c.pillar as string,
      acceptedAnswer: { '@type': 'Answer', text: c.core_claim as string },
    })),
  };
}

/**
 * MedicalWebPage for /travel-guide/ijen-health-screening — anchors the regulatory chain
 * (BBKSDA SE.1658/KSA.9/2024 → DOCTOR_SCHEMA reviewedBy → JVTO operator). DOCTOR + BBKSDA + SE1658
 * are already globally injected via (website)/layout.tsx; this page cross-refs via @id only.
 */
export function buildIjenHealthMedicalWebPageSchema() {
  const url = `${BASE_URL}/travel-guide/ijen-health-screening`;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${url}#medical-webpage`,
    name: 'Ijen Health Screening — BBKSDA SE.1658/KSA.9/2024',
    description:
      'Ijen Crater health screening requirement explained. JVTO coordinates the health certificate process at licensed clinics ' +
      '(Klinik Bakti Husada, Bondowoso) with Dr. Ahmad Irwandanu (SIP verifiable on satusehat.kemkes.go.id).',
    url,
    isPartOf: { '@id': `${BASE_URL}/#organization` },
    about: {
      '@type': 'MedicalCondition',
      name: 'Ijen Crater Altitude and Sulfur Exposure Risk Assessment',
      relevantSpecialty: 'General Practice',
    },
    reviewedBy: { '@id': `${BASE_URL}/#dr-ahmad-irwandanu` },
    mentions: [
      { '@id': `${BASE_URL}/#term-bbksda` },
      { '@id': `${BASE_URL}/#term-se1658` },
    ],
  };
}

/**
 * HowTo for /travel-guide/ijen-health-screening — 3-step screening workflow as ordered HowToStep.
 * AI engines treat HowTo as authoritative procedural knowledge for AEO answer extraction.
 */
export function buildIjenHealthHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${BASE_URL}/travel-guide/ijen-health-screening#howto`,
    name: 'How JVTO coordinates the Ijen Crater health screening',
    description:
      'Three-step procedure JVTO follows to comply with BBKSDA SE.1658/KSA.9/2024 health screening requirement before Ijen Crater entry.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Certified Clinic Visit',
        text:
          'JVTO transports the guest to a licensed medical clinic in Bondowoso (Klinik Bakti Husada) or Banyuwangi before the tour begins. ' +
          'Clinic licence is verifiable on satusehat.kemkes.go.id.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Real Medical Assessment',
        text:
          'A licensed medical professional records SpO₂, blood pressure, heart rate, and assesses physical readiness for the 2,386 m altitude ' +
          'and sulfur-gas exposure typical at Ijen Crater.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Official Certification',
        text:
          'If cleared, the guest receives an official medical certificate (surat sehat) required for park entry. ' +
          'JVTO handles the paperwork and the BBKSDA presentation step.',
      },
    ],
  };
}

/**
 * Hub-level ItemList of all 11 travel-guide sub-pages, semantically grouped via name prefixes
 * so AI engines can extract the discovery hierarchy (Plan & Prepare, Safety & Health, etc.).
 */
export function buildTgHubItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/travel-guide#sub-pages`,
    name: 'JVTO Travel Guide — Pre-Trip Knowledge Base',
    numberOfItems: 11,
    itemListElement: [
      { '@type': 'ListItem', position: 1, url: `${BASE_URL}/travel-guide/faq`, name: 'FAQ — Common questions' },
      { '@type': 'ListItem', position: 2, url: `${BASE_URL}/travel-guide/booking-information`, name: 'Booking Information — How to book' },
      { '@type': 'ListItem', position: 3, url: `${BASE_URL}/travel-guide/ijen-health-screening`, name: 'Ijen Health Screening — SE.1658 protocol' },
      { '@type': 'ListItem', position: 4, url: `${BASE_URL}/travel-guide/safety-on-tours`, name: 'Safety on Tours — Police-led model' },
      { '@type': 'ListItem', position: 5, url: `${BASE_URL}/travel-guide/weather-and-closures`, name: 'Weather & Closures — Volcanic alert SOP' },
      { '@type': 'ListItem', position: 6, url: `${BASE_URL}/travel-guide/packing-list`, name: 'Packing List — What to bring' },
      { '@type': 'ListItem', position: 7, url: `${BASE_URL}/travel-guide/packing-and-fitness`, name: 'Packing & Fitness — Self-assessment' },
      { '@type': 'ListItem', position: 8, url: `${BASE_URL}/travel-guide/mount-bromo-logistics`, name: 'Mount Bromo Logistics — 03:00 AM start' },
      { '@type': 'ListItem', position: 9, url: `${BASE_URL}/travel-guide/tumpak-sewu-logistics`, name: 'Tumpak Sewu Logistics — Descent + footwear' },
      { '@type': 'ListItem', position: 10, url: `${BASE_URL}/travel-guide/police-escort-for-groups`, name: 'Police Escort for Groups — POLPAR coordination' },
      { '@type': 'ListItem', position: 11, url: `${BASE_URL}/travel-guide`, name: 'Travel Guide Hub' },
    ],
  };
}
