// src/lib/schemas/buildTravelGuideSchemas.ts — Schema builders for /travel-guide cluster.
// Ported from rewrite repo (e:\test-2-2026\lib\schemas\buildTravelGuideSchemas.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Per cluster_role_contracts.md Cluster 5: WebPage + BreadcrumbList per page; FAQPage where role demands.
// Special case /ijen-health-screening (Phase 4.6 augment 2026-04-29): MedicalWebPage + HowTo + DOCTOR + BBKSDA + SE1658 cross-refs.
import type {
  BreadcrumbList,
  FAQPage,
  HowTo,
  ItemList,
  ListItem,
  MedicalSpecialty,
  MedicalWebPage,
  WebPage,
  WithContext,
} from 'schema-dts';

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

export function buildTgWebPageSchema({ subpath, pageName, description }: TgPageArgs): WithContext<WebPage> {
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

export function buildTgBreadcrumbSchema({ subpath, pageName }: TgPageArgs): WithContext<BreadcrumbList> {
  const items: ListItem[] = [
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
export function buildTgFaqSchema(claims: NarrativeClaim[], subpath: string): WithContext<FAQPage> | null {
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
export function buildIjenHealthMedicalWebPageSchema(): WithContext<MedicalWebPage> {
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
      // schema.org types `relevantSpecialty` as the MedicalSpecialty enumeration
      // (spec-correct value: 'PrimaryCare'), not free text. The human-readable string is
      // preserved verbatim so the emitted JSON-LD is unchanged; flagged in the task report.
      relevantSpecialty: 'General Practice' as unknown as MedicalSpecialty,
    },
    reviewedBy: { '@id': `${BASE_URL}/#dr-ahmad-irwandanu` },
    mentions: [
      { '@id': `${BASE_URL}/#term-bbksda` },
      { '@id': `${BASE_URL}/#term-se1658` },
    ],
  };
}

/**
 * HowTo for /travel-guide/ijen-health-screening — 4-step screening workflow as ordered HowToStep.
 * AI engines treat HowTo as authoritative procedural knowledge for AEO answer extraction.
 */
export function buildIjenHealthHowToSchema(): WithContext<HowTo> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${BASE_URL}/travel-guide/ijen-health-screening#howto`,
    name: 'How JVTO coordinates the Ijen Crater health screening',
    description:
      'Four-step procedure JVTO follows via the Ijen Digital Health Security System to comply with BBKSDA SE.1658/KSA.9/2024 health screening requirement before Ijen Crater entry.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Hotel Visit',
        text:
          'A nurse visits the guest\'s hotel the evening before the Ijen hike, in the Bondowoso or Banyuwangi area — no travel to a clinic is required.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Vitals Check',
        text:
          'Vitals — SpO₂ (blood oxygen saturation), blood pressure, heart rate, and respiratory history — are checked at the guest\'s accommodation to assess ' +
          'readiness for the 2,386 m altitude and sulfur-gas exposure typical at Ijen Crater.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Digital Certificate Issued',
        text:
          'For cleared guests, a BSrE-signed (Balai Sertifikasi Elektronik / BSSN) digital health certificate is issued via the Ijen Digital Health Security System (health.mountijen.com).',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Checkpoint Verification',
        text:
          'At the Paltuding trailhead, BBKSDA checkpoint staff check the certificate before permitting crater-zone access.',
      },
    ],
  };
}

/**
 * Hub-level ItemList of the live travel-guide sub-pages, semantically grouped via name prefixes
 * so AI engines can extract the discovery hierarchy (Plan & Prepare, Safety & Health, etc.).
 */
export function buildTgHubItemListSchema(): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/travel-guide#sub-pages`,
    name: 'JVTO Travel Guide — Pre-Trip Knowledge Base',
    numberOfItems: 9,
    itemListElement: [
      { '@type': 'ListItem', position: 1, url: `${BASE_URL}/travel-guide/faq`, name: 'FAQ — Common questions' },
      { '@type': 'ListItem', position: 2, url: `${BASE_URL}/travel-guide/booking-information`, name: 'Booking Information — How to book' },
      { '@type': 'ListItem', position: 3, url: `${BASE_URL}/travel-guide/best-time-to-visit`, name: 'Best Time to Visit — Seasonal planning (Bromo, Ijen, Tumpak Sewu)' },
      { '@type': 'ListItem', position: 4, url: `${BASE_URL}/travel-guide/ijen-health-screening`, name: 'Ijen Health Screening — SE.1658 protocol' },
      { '@type': 'ListItem', position: 5, url: `${BASE_URL}/travel-guide/safety-on-tours`, name: 'Safety on Tours — Police-led model' },
      { '@type': 'ListItem', position: 6, url: `${BASE_URL}/travel-guide/weather-and-closures`, name: 'Weather & Closures — Volcanic alert SOP' },
      { '@type': 'ListItem', position: 7, url: `${BASE_URL}/travel-guide/packing-and-fitness`, name: 'Packing & Fitness — Self-assessment' },
      { '@type': 'ListItem', position: 8, url: `${BASE_URL}/travel-guide/police-escort-for-groups`, name: 'Police Escort for Groups — POLPAR coordination' },
      { '@type': 'ListItem', position: 9, url: `${BASE_URL}/travel-guide`, name: 'Travel Guide Hub' },
    ],
  };
}
