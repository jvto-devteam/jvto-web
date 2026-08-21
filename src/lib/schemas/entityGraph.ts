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
//
// 2026-08-20 — content-source-of-truth migration: editorial fact values (organization
// slogan/description/award, founder bio + credential names, doctor/clinic description +
// credential names, BBKSDA regulation prose, DefinedTerm names/descriptions) now live in
// jvto-ekosistem 1-knowledge-and-evidence-core/organization-identity/entity-graph-schema-facts.json
// and are read via getEntityGraphFacts() below. Every export that carried editorial prose is now
// a pure build*(facts?) function: it merges the caller-supplied `facts` slice (sourced from
// getEntityGraphFacts()) over a FALLBACK_*_FACTS constant holding the exact original literal
// values, so the emitted JSON-LD is byte-identical whenever ekosistem is unreachable. JSON-LD
// scaffolding (@context/@type/@id, cross-reference wiring, SHA-256 hash identifiers) stays as
// code — only prose/name/description/date values were extracted. ORGANIZATION_HAS_CREDENTIAL is
// the one exception: it is NOT migrated (stays a static constant) because its only consumer
// (src/lib/seo/jsonld/builders.ts's attachOrgCredentials, invoked from buildOrganizationJsonLd)
// is synchronous and used sitewide across ~15+ pages outside this migration's audited consumer
// set — forcing it async would ripple far beyond entityGraph.ts's own consumers. See the report
// for the full reasoning.

import type {
  DefinedTerm,
  EducationalOccupationalCredential,
  GovernmentService,
  MedicalBusiness,
  Person,
  Physician,
  TravelAgency,
  WithContext,
} from 'schema-dts';
import { EXTERNAL_ENTITIES, entityRef } from './externalEntities';
import { getEcosystemEntityGraphFacts } from '@/lib/ecosystemContent/entityGraphFacts';

/**
 * `EducationalOccupationalCredential` + `dateIssued`.
 *
 * schema.org does NOT define `dateIssued` on EducationalOccupationalCredential (it exists
 * only on `Ticket`); schema-dts correctly rejects it. The property is retained verbatim
 * because removing it would change the emitted JSON-LD, which is out of scope for the
 * type-annotation pass — but it is inert for consumers and should be migrated to
 * `datePublished` / `validFrom` in a follow-up content change. Flagged in the task report.
 */
type IssuedCredential = EducationalOccupationalCredential & { dateIssued?: string };

const BASE_URL = 'https://javavolcano-touroperator.com';
const ORG_ID   = `${BASE_URL}/#organization`;
const AGUNG_ID = `${BASE_URL}/#agung-sambuko`;
const DOCTOR_ID = `${BASE_URL}/#dr-ahmad-irwandanu`;
const CLINIC_ID = `${BASE_URL}/#klinik-bakti-husada`;

// ── ekosistem facts shape + fetcher ──────────────────────────────────────────

export interface EntityGraphFacts {
  organizationReference?: {
    slogan?: string;
    description?: string;
    award?: string[];
  };
  founder?: {
    imageCaptions?: { portrait?: string; uniform?: string };
    worksForGovDescription?: string;
    knowsAbout?: string[];
    subjectOfNewsDescription?: string;
    subjectOfBookDescription?: string;
    hasCredential?: {
      sprinPolpar?: { name?: string; credentialCategory?: string };
      sprinWalTravel?: { name?: string; credentialCategory?: string };
      hpwkiGuide?: { name?: string; credentialCategory?: string };
    };
  };
  doctor?: {
    jobTitle?: string;
    clinic?: { name?: string; medicalSpecialty?: string; description?: string };
    hasCredential?: {
      sip?: { name?: string; credentialCategory?: string; description?: string };
      kki?: { name?: string; credentialCategory?: string };
    };
  };
  bbksdaRegulation?: {
    name?: string;
    description?: string;
    serviceOutputName?: string;
    areaServedName?: string;
  };
  definedTerms?: Partial<Record<DefinedTermKey, DefinedTermFacts>>;
}

type DefinedTermKey =
  | 'NIB' | 'TDUP' | 'HPWKI' | 'KTA' | 'POLPAR' | 'BBKSDA' | 'SE1658'
  | 'ISIC' | 'INDECON' | 'JVTO_TRAVEL_CREDIT' | 'JVTO_FOC_SCHEME';

interface DefinedTermFacts {
  name?: string;
  description?: string;
  termSetName?: string;
  termSetUrl?: string;
  termSetSameAs?: string;
}

/**
 * Single fetch of jvto-ekosistem's entity-graph-schema-facts.json (local sibling-dir
 * read first, HTTP fallback — see @/lib/ecosystemContent/entityGraphFacts). Call this
 * ONCE per page (alongside other Promise.all ekosistem reads) and pass the relevant
 * slice into each build*() function below; every build*() function itself stays pure
 * and synchronous, merging over its FALLBACK_*_FACTS constant.
 */
export async function getEntityGraphFacts(): Promise<EntityGraphFacts | null> {
  return getEcosystemEntityGraphFacts<EntityGraphFacts>();
}

// Shared export: the Organization credentials array (NIB/TDUP/HPWKI, each carrying a
// SHA-256 forensic-anchor PropertyValue). buildOrganizationJsonLd() attaches this to the
// live-rendered Organization node regardless of whether that node comes from the DB
// schema_json column or the static snapshot fallback — so the hashes render in production
// without any DB/SQL step. Single source of truth for the credentials list; also referenced
// as ORGANIZATION_SCHEMA.hasCredential below.
//
// NOT migrated to ekosistem (see file-header note, 2026-08-20): its only consumer is
// src/lib/seo/jsonld/builders.ts's attachOrgCredentials(), a synchronous helper invoked
// from buildOrganizationJsonLd() across ~15+ pages far outside this task's audited
// consumer list. Equivalent data already exists in ekosistem's
// organization-identity/organization.json `hasCredential` array — nothing reads it yet;
// consolidating the two is a follow-up, not attempted here to avoid an async ripple
// through untouched pages.
//
// Verified credentials (legal + association).
// Each identifier is an array pairing the registration number (where applicable) with the
// SHA-256 forensic anchor of the source document (published in public/llms.txt) as a
// PropertyValue — machine-verifiable authenticity proof against "ghost operator" fraud.
// Hashes: wiki/credentials/legal-licenses.md §SHA-256 Forensic Anchors.
// NOTE: ORGANIZATION_SCHEMA is reference-only (see file header). The LIVE Organization node is
// DB-driven via buildOrganizationJsonLd(); to render these hashes in production the same
// hasCredential.identifier PropertyValues must be mirrored into the org `schema_json` DB
// column (owner/DB task — not editable from application code).
export const ORGANIZATION_HAS_CREDENTIAL: IssuedCredential[] = [
  {
    '@type': 'EducationalOccupationalCredential',
    name: 'NIB (Nomor Induk Berusaha)',
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'NIB', value: '1102230032918' },
      { '@type': 'PropertyValue', propertyID: 'SHA-256', name: 'NIB document SHA-256', value: 'fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7' },
    ],
    url: `${BASE_URL}/legal/NIB-1102230032918.pdf`,
    credentialCategory: 'Indonesian Business Registration',
    recognizedBy: EXTERNAL_ENTITIES.bkpm,
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
    recognizedBy: EXTERNAL_ENTITIES.kemenparekraf,
  },
  {
    '@type': 'EducationalOccupationalCredential',
    name: 'HPWKI Membership (Himpunan Pelaku Wisata Khusus Ijen)',
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'SHA-256',
      name: 'HPWKI approval letter SHA-256',
      value: 'dbb57389b62b1554e4d66ccd82c6888dd4c31cb0f85619601a9befb786ac32c3',
    },
    url: `${BASE_URL}/legal/HPWKI-approval.pdf`,
    credentialCategory: 'Volcanic Tourism Association — BBKSDA supervised',
    recognizedBy: entityRef('hpwki'),
  },
];

// ── Organization (JVTO / PT Java Volcano Rendezvous) ─────────────────────────
// Hardcoded fallback. Live's primary Organization injection happens per-page via PageJsonLdCombined
// (DB-driven via getOrganizationProfile + buildOrganizationJsonLd). Same @id, so cross-page refs resolve.
// Reference-only export: no consumer imports ORGANIZATION_SCHEMA / buildOrganizationReferenceSchema
// today (confirmed 2026-08-20 — grep across src/ finds zero importers besides this file).
const FALLBACK_ORGANIZATION_REFERENCE_FACTS = {
  slogan: 'Private volcano tours with police-led safety. Ijen, Bromo, Tumpak Sewu.',
  description:
    'Registered Indonesian tour operator (PT Java Volcano Rendezvous, NIB 1102230032918) offering private volcano tours in East Java. Founded by an active Tourist Police officer. HPWKI member with BBKSDA-verified safety training.',
  award: [
    'Booking.com Guest Review Award 2015 — Ijen Bondowoso Homestay (Score 9.4/10)',
    'Stefan Loose Reiseführer Indonesien — Editorial Feature (4th Edition, 2018)',
  ],
};

export function buildOrganizationReferenceSchema(
  facts?: EntityGraphFacts['organizationReference'],
): WithContext<TravelAgency> {
  const f = { ...FALLBACK_ORGANIZATION_REFERENCE_FACTS, ...facts };

  return {
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
    slogan: f.slogan,
    description: f.description,
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
    // NO aggregateRating here — deliberately, for a different reason than before
    // 2026-08-20. This function has zero consumers (see the file header note above);
    // if it ever gains one, it must not hand-carry a rating figure. Owner decision
    // 2026-08-15 (never assert a hand-copied/stale rating) still stands — only WHERE
    // the live figure is assembled was reversed, not whether static code may invent
    // one. As of 2026-08-20 the single source of truth is jvto-ekosistem's
    // buildOrganizationNode() (scripts/lib/build-organization.mjs), which embeds
    // `aggregateRating` inline on the Organization node it renders into every route's
    // schema-output.json. jvto-web reads it off that node — via PageJsonLdCombined's
    // ecosystem branch for most routes, or via getOrganizationProfile() +
    // toOrganizationReferenceOnly() for the tours hub, which now both carry
    // `aggregateRating` through when they strip the node to a bare reference. The
    // three page-level standalone AggregateRating builders that used to read
    // getPublicAggregateRating() (buildHomepageAggregateRatingSchema,
    // buildToursHubAggregateRatingSchema, buildWhyJvtoReviewsAggregateRatingSchema)
    // are deleted — the rating is an inline Organization property now, not a
    // separate cross-referenced node.

    // Historical artifacts — proves operational continuity since 2015
    award: f.award,

    // Verified credentials (legal + association) — see ORGANIZATION_HAS_CREDENTIAL above.
    hasCredential: ORGANIZATION_HAS_CREDENTIAL,

    // Association memberships — canonical full definitions for HPWKI/INDECON/ISIC
    // live in externalEntities.ts; every other mention of these three in this
    // file references them by @id instead (see entityRef()).
    memberOf: [
      EXTERNAL_ENTITIES.hpwki,
      EXTERNAL_ENTITIES.indecon,
      EXTERNAL_ENTITIES.isic,
    ],

    // Third-party press and editorial coverage
    subjectOf: [
      {
        '@type': 'NewsArticle',
        headline: 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin',
        datePublished: '2021-03-14',
        url: 'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
        publisher: EXTERNAL_ENTITIES.detikcom,
        about: { '@id': AGUNG_ID },
        image: `${BASE_URL}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png`,
      },
      {
        '@type': 'NewsArticle',
        headline: 'Polpar Dibentuk untuk Mendukung Ijen Geopark',
        url: 'https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark',
        publisher: EXTERNAL_ENTITIES.radarJemberJawaPos,
        about: { '@type': 'Organization', name: 'Tourist Police Unit, Bondowoso' },
        image: `${BASE_URL}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png`,
      },
      {
        '@type': 'Book',
        name: 'Stefan Loose Reiseführer Indonesien',
        isbn: '978-3-7701-7881-0',
        datePublished: '2018-07-05',
        inLanguage: 'de',
        numberOfPages: 772,
        bookEdition: '4',
        publisher: EXTERNAL_ENTITIES.dumontReiseverlag,
        url: 'https://www.tripplanner.at/en/product-page/stefan-loose-reisef%C3%BChrer-indonesien',
        description: 'German-language travel guide; independently features Ijen Bondowoso Homestay (JVTO) — non-paid editorial listing.',
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
}

// ── Agung Sambuko — Founder & Active Tourist Police Officer ───────────────────
// Evidence chain: SPRIN-POLPAR + SPRIN-WAL-TRAVEL-2024 → POLPAR Bondowoso (Sprin/4954/XI/2020)
//                 Detik.com "Bripka Agung Sambuko" → identity confirmation
//                 HPWKI supervisor → BBKSDA training chain
const FALLBACK_FOUNDER_FACTS: Required<NonNullable<EntityGraphFacts['founder']>> = {
  imageCaptions: {
    portrait: 'Agung Sambuko, Founder of Java Volcano Tour Operator',
    uniform: 'Agung Sambuko (Bripka) in official Tourist Police uniform, Bondowoso',
  },
  worksForGovDescription: 'Tourist Police directorate responsible for securing vital tourism objects in Indonesia.',
  knowsAbout: [
    'East Java Volcano Tourism Safety',
    'Ijen Crater Operations and BBKSDA Regulations',
    'Mount Bromo Tourist Access Management',
    'Indonesian Tourist Police Protocols',
    'HPWKI Volcanic Safety Standards',
    'SE.1658/K2/BIDTEK.1/KSA/9/2024 — Ijen Health Certificate Regulation',
  ],
  subjectOfNewsDescription: 'National press article naming "Bripka Agung Sambuko" as Tourist Police, Bondowoso — third-party identity confirmation.',
  subjectOfBookDescription: 'German travel guide independently referencing tours arranged by Agung at Ijen Bondowoso Homestay (non-paid editorial).',
  hasCredential: {
    sprinPolpar: { name: 'SPRIN POLPAR (Tourist Police Assignment Letter)', credentialCategory: 'Law Enforcement — Tourist Police Assignment' },
    sprinWalTravel: { name: 'SPRIN WAL-TRAVEL — traffic-escort order Sprin/70/II/HUK.6.6./2024, 12 February 2024', credentialCategory: 'Law Enforcement — single-route traffic escort, Satlantas Polres Bondowoso' },
    hpwkiGuide: { name: 'HPWKI Certified Volcano Guide (Himpunan Pelaku Wisata Khusus Ijen)', credentialCategory: 'Professional Mountain Guiding Certification' },
  },
};

// Police credentials — verifiable government documents.
// identifier carries the SHA-256 forensic anchor of each source document (published in
// public/llms.txt) as a PropertyValue — machine-verifiable proof the credential file is
// authentic and unaltered, defending against "ghost operator" impersonation.
// Hashes: wiki/credentials/legal-licenses.md §SHA-256 Forensic Anchors.
function buildFounderHasCredential(facts: EntityGraphFacts['founder']): IssuedCredential[] {
  const hc = { ...FALLBACK_FOUNDER_FACTS.hasCredential, ...facts?.hasCredential };
  const sprinPolpar = { ...FALLBACK_FOUNDER_FACTS.hasCredential.sprinPolpar, ...hc.sprinPolpar };
  const sprinWalTravel = { ...FALLBACK_FOUNDER_FACTS.hasCredential.sprinWalTravel, ...hc.sprinWalTravel };
  const hpwkiGuide = { ...FALLBACK_FOUNDER_FACTS.hasCredential.hpwkiGuide, ...hc.hpwkiGuide };

  return [
    {
      '@type': 'EducationalOccupationalCredential',
      name: sprinPolpar.name,
      credentialCategory: sprinPolpar.credentialCategory,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'SHA-256',
        name: 'SPRIN POLPAR document SHA-256',
        value: '03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab',
      },
      url: `${BASE_URL}/legal/SPRIN-POLPAR.pdf`,
      image: `${BASE_URL}/legal/SPRIN-POLPAR.webp`,
      recognizedBy: EXTERNAL_ENTITIES.polri,
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: sprinWalTravel.name,
      dateIssued: '2024-02-12',
      credentialCategory: sprinWalTravel.credentialCategory,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'SHA-256',
        name: 'SPRIN WAL-TRAVEL 2024-02-12 document SHA-256',
        value: '179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3',
      },
      url: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp`,
      recognizedBy: entityRef('polri'),
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: hpwkiGuide.name,
      credentialCategory: hpwkiGuide.credentialCategory,
      recognizedBy: entityRef('hpwki'),
    },
  ];
}

export function buildFounderSchema(facts?: EntityGraphFacts['founder']): WithContext<Person> {
  const f = {
    ...FALLBACK_FOUNDER_FACTS,
    ...facts,
    imageCaptions: { ...FALLBACK_FOUNDER_FACTS.imageCaptions, ...facts?.imageCaptions },
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': AGUNG_ID,
    name: 'Agung Sambuko',
    alternateName: 'Mr. Sam',
    jobTitle: ['Founder', 'Active Tourist Police Officer'],
    image: [
      {
        '@type': 'ImageObject',
        url: `${BASE_URL}/founder/agung_sambuko.jpg`,
        caption: f.imageCaptions.portrait,
      },
      {
        '@type': 'ImageObject',
        url: `${BASE_URL}/founder/mr-sam-tourist-police-portrait.png`,
        caption: f.imageCaptions.uniform,
      },
    ],
    worksFor: [
      { '@id': ORG_ID },
      {
        '@type': 'GovernmentOrganization',
        name: 'Polisi Pariwisata (POLPAR) Bondowoso — Polres Bondowoso, Indonesian National Police',
        url: 'https://polri.go.id',
        description: f.worksForGovDescription,
      },
    ],
    memberOf: entityRef('hpwki'),
    // Police credentials — verifiable government documents.
    // identifier carries the SHA-256 forensic anchor of each source document (published in
    // public/llms.txt) as a PropertyValue — machine-verifiable proof the credential file is
    // authentic and unaltered, defending against "ghost operator" impersonation.
    // Hashes: wiki/credentials/legal-licenses.md §SHA-256 Forensic Anchors.
    hasCredential: buildFounderHasCredential(facts),
    // Detik.com article names him as "Bripka Agung Sambuko" — identity confirmation from national press
    sameAs: [
      'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
    ],
    knowsAbout: f.knowsAbout,
    // Historical + media context — bidirectional entity linking
    subjectOf: [
      {
        '@type': 'NewsArticle',
        headline: 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin',
        datePublished: '2021-03-14',
        url: 'https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin',
        publisher: entityRef('detikcom'),
        description: f.subjectOfNewsDescription,
      },
      {
        '@type': 'Book',
        name: 'Stefan Loose Reiseführer Indonesien',
        isbn: '978-3-7701-7881-0',
        datePublished: '2018-07-05',
        inLanguage: 'de',
        numberOfPages: 772,
        bookEdition: '4',
        publisher: entityRef('dumontReiseverlag'),
        description: f.subjectOfBookDescription,
        image: `${BASE_URL}/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg`,
      },
    ],
  };
}

// ── Dr. Ahmad Irwandanu — Licensed Physician (Ijen Health Screening) ──────────
// Evidence chain: SIP → satusehat.kemkes.go.id (live verification)
//                 KKI → kki.go.id (Indonesian Medical Council)
//                 WorksFor → Klinik Bakti Husada → licensed by Kemenkes
// NOTE on the intersection below: schema.org models `Physician` on the MedicalBusiness
// (Organization) branch, so the two Person-only properties this node uses — `jobTitle` and
// `worksFor` — are not valid on it per the spec (the spec-correct equivalents would be
// `practicesAt` / `parentOrganization`). Both values are factually correct and are already
// consumed by AI answer engines, so they are preserved verbatim rather than dropped; the
// explicit intersection keeps full type-checking on every other property instead of
// suppressing the whole node. Flagged in the task report for owner review — the proper fix
// is a `Person` node also typed `Physician` (`@type: ['Person','Physician']`), which
// schema-dts cannot express and which would change the emitted JSON-LD.
type DoctorSchema = WithContext<Physician> & {
  jobTitle: string;
  // The clinic node emits two properties schema.org does not define on MedicalBusiness:
  // `medicalSpecialty` (defined on MedicalOrganization / MedicalClinic — and here carrying
  // free text rather than the `MedicalSpecialty` enumeration, whose correct value would be
  // 'PrimaryCare') and `isAcceptingNewPatients` (defined on Physician). Both preserved
  // verbatim so the emitted JSON-LD is unchanged; flagged in the task report.
  worksFor: MedicalBusiness & {
    medicalSpecialty?: string;
    isAcceptingNewPatients?: boolean;
  };
};

const FALLBACK_DOCTOR_FACTS: Required<NonNullable<EntityGraphFacts['doctor']>> = {
  jobTitle: 'Licensed General Practitioner',
  clinic: {
    name: 'Klinik Bakti Husada',
    medicalSpecialty: 'General Practice',
    description: 'Ministry of Health-licensed clinic coordinating Ijen health screening for JVTO guests. Issues health certificates compliant with BBKSDA SE.1658/K2/BIDTEK.1/KSA/9/2024.',
  },
  hasCredential: {
    sip: {
      name: 'SIP (Surat Izin Praktik) — Medical Practice Licence',
      credentialCategory: 'Indonesian Medical Practice Licence',
      description: 'Publicly verifiable at satusehat.kemkes.go.id — the Indonesian national health registry.',
    },
    kki: {
      name: 'KKI Registration (Konsil Kedokteran Indonesia)',
      credentialCategory: 'Indonesian Medical Council Registration',
    },
  },
};

export function buildDoctorSchema(facts?: EntityGraphFacts['doctor']): DoctorSchema {
  const clinic = { ...FALLBACK_DOCTOR_FACTS.clinic, ...facts?.clinic };
  const sip = { ...FALLBACK_DOCTOR_FACTS.hasCredential.sip, ...facts?.hasCredential?.sip };
  const kki = { ...FALLBACK_DOCTOR_FACTS.hasCredential.kki, ...facts?.hasCredential?.kki };

  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': DOCTOR_ID,
    name: 'Dr. Ahmad Irwandanu',
    jobTitle: facts?.jobTitle ?? FALLBACK_DOCTOR_FACTS.jobTitle,
    worksFor: {
      '@type': 'MedicalBusiness',
      '@id': CLINIC_ID,
      name: clinic.name,
      medicalSpecialty: clinic.medicalSpecialty,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bondowoso',
        addressRegion: 'Jawa Timur',
        addressCountry: 'ID',
      },
      isAcceptingNewPatients: true,
      description: clinic.description,
    },
    // Both credentials publicly verifiable online
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: sip.name,
        credentialCategory: sip.credentialCategory,
        url: 'https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217',
        recognizedBy: EXTERNAL_ENTITIES.kemenkes,
        description: sip.description,
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: kki.name,
        credentialCategory: kki.credentialCategory,
        url: 'https://kki.go.id/cekdokter/form',
        recognizedBy: EXTERNAL_ENTITIES.kki,
      },
    ],
  };
}

// ── BBKSDA Regulation — SE.1658/K2/BIDTEK.1/KSA/9/2024 ───────────────────────────────────
// Regulatory chain: BBKSDA issues regulation → requires health cert → JVTO coordinates → Dr. Ahmad issues cert
const FALLBACK_BBKSDA_REGULATION_FACTS: Required<NonNullable<EntityGraphFacts['bbksdaRegulation']>> = {
  name: 'Ijen Crater Access — Health Certificate Requirement',
  description:
    'Under SE.1658/K2/BIDTEK.1/KSA/9/2024 issued by BBKSDA Jawa Timur, visitors to Kawah Ijen must present a health certificate from a licensed clinic confirming blood pressure and oxygen saturation readings are within safe limits.',
  serviceOutputName: 'Health Certificate for Ijen Crater Access (Surat Keterangan Sehat)',
  areaServedName: 'Kawah Ijen (Ijen Crater)',
};

export function buildBbksdaRegulationSchema(
  facts?: EntityGraphFacts['bbksdaRegulation'],
): WithContext<GovernmentService> {
  const f = { ...FALLBACK_BBKSDA_REGULATION_FACTS, ...facts };

  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: f.name,
    description: f.description,
    provider: EXTERNAL_ENTITIES.bbksdaJatim,
    serviceOutput: {
      '@type': 'DigitalDocument',
      name: f.serviceOutputName,
      url: 'https://javavolcano-touroperator.com/screening/print-surat-sehat-preview.png',
    },
    image: 'https://javavolcano-touroperator.com/screening/bbksda/bbksda-ticket-terms-screenshot.jpeg',
    areaServed: { '@type': 'Place', name: f.areaServedName, geo: { '@type': 'GeoCoordinates', latitude: -8.0581, longitude: 114.2425 } },
  };
}

// ── DefinedTerm glossary — machine-readable definitions for key JVTO terms ───
// Globally injected via (website)/layout.tsx so every page has stable @id refs to all 9 terms
// (7 standard regulatory + 2 brand-custom JVTO operational policies).
// Per-page enrichment (mentioning a term in copy) cross-references via @id, no re-inject needed.

/**
 * The `@id` values only — stable structural identifiers, NOT editorial content. Tour PDP
 * pages (tours/from-bali/[slug], tours/from-surabaya/[slug]) only ever cross-reference
 * DEFINED_TERMS.X["@id"] to build `mentions[]`; they never render the definition prose, so
 * they import this synchronous, ekosistem-independent map instead of calling
 * buildDefinedTerms() — no async fetch needed for an @id lookup.
 */
export const DEFINED_TERM_IDS = {
  NIB: `${BASE_URL}/#term-nib`,
  TDUP: `${BASE_URL}/#term-tdup`,
  HPWKI: `${BASE_URL}/#term-hpwki`,
  KTA: `${BASE_URL}/#term-kta`,
  POLPAR: `${BASE_URL}/#term-polpar`,
  BBKSDA: `${BASE_URL}/#term-bbksda`,
  SE1658: `${BASE_URL}/#term-se1658`,
  ISIC: `${BASE_URL}/#term-isic`,
  INDECON: `${BASE_URL}/#term-indecon`,
  JVTO_TRAVEL_CREDIT: `${BASE_URL}/#term-jvto-travel-credit`,
  JVTO_FOC_SCHEME: `${BASE_URL}/#term-jvto-foc-scheme`,
} as const satisfies Record<DefinedTermKey, string>;

const FALLBACK_DEFINED_TERMS_FACTS: Record<DefinedTermKey, Required<DefinedTermFacts>> = {
  NIB: {
    name: 'NIB (Nomor Induk Berusaha)',
    description:
      'Indonesian Business Identification Number. Mandatory registration for all legal businesses in Indonesia, issued via the OSS Online Single Submission system. JVTO NIB: 1102230032918.',
    termSetName: 'Indonesian Business Registration System (OSS)',
    termSetUrl: 'https://oss.go.id',
    termSetSameAs: '',
  },
  TDUP: {
    name: 'TDUP (Tanda Daftar Usaha Pariwisata)',
    description:
      'Tourism Business Registration Certificate. The mandatory operating licence for tour operators in Indonesia, issued by the Kementerian Pariwisata dan Ekonomi Kreatif via OSS. JVTO TDUP issued 2023-02-11.',
    termSetName: 'Indonesian Tourism Licensing System',
    termSetUrl: 'https://oss.go.id',
    termSetSameAs: '',
  },
  HPWKI: {
    name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
    description:
      'Ijen Volcano Tourism Association. Supervised by BBKSDA Jawa Timur (Ministry of Environment). HPWKI members receive annual training on volcanic gas protocols, emergency evacuation, and BBKSDA compliance. Membership is required to operate guided tours on Kawah Ijen.',
    termSetName: 'Indonesian Ecotourism Associations',
    termSetUrl: '',
    termSetSameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
  },
  KTA: {
    name: 'KTA (Kartu Tanda Anggota)',
    description:
      'HPWKI Guide Licence Card. Issued to verified Ijen volcano guides who have completed BBKSDA-supervised safety training. Required for any guide accompanying tourists to Kawah Ijen. Each card carries a unique identifier number.',
    termSetName: 'HPWKI Guide Certification System',
    termSetUrl: '',
    termSetSameAs: '',
  },
  POLPAR: {
    name: 'POLPAR (Polisi Pariwisata / Tourist Police)',
    description:
      'Indonesian Tourist Police unit under Polisi Pariwisata (POLPAR), Polres Bondowoso, Indonesian National Police (POLRI). POLPAR officers are assigned to secure and support tourism areas. Assignment requires a SPRIN (Surat Perintah / Official Order Letter) from POLRI.',
    termSetName: 'Indonesian National Police Specializations',
    termSetUrl: 'https://polri.go.id',
    termSetSameAs: '',
  },
  BBKSDA: {
    name: 'BBKSDA (Balai Besar Konservasi Sumber Daya Alam)',
    description:
      'Large-Scale Natural Resource Conservation Agency under the Indonesian Ministry of Environment and Forestry. BBKSDA Jawa Timur manages Kawah Ijen nature reserve and issues access regulations including SE.1658/K2/BIDTEK.1/KSA/9/2024 (health certificate requirement).',
    termSetName: 'Indonesian Ministry of Environment Bodies',
    termSetUrl: 'https://www.menlhk.go.id',
    termSetSameAs: '',
  },
  SE1658: {
    name: 'SE.1658/K2/BIDTEK.1/KSA/9/2024',
    description:
      'BBKSDA Jawa Timur circular letter SE.1658/K2/BIDTEK.1/KSA/9/2024. Requires all Kawah Ijen visitors to present a health certificate from a licensed clinic confirming blood pressure and SpO₂ readings are within safe limits before entering the crater area.',
    termSetName: 'BBKSDA Jawa Timur Regulatory Circulars',
    termSetUrl: '',
    termSetSameAs: '',
  },
  ISIC: {
    name: 'ISIC (International Student Identity Card)',
    description:
      'Global student membership card accepted at 150,000+ discounts in 130+ countries. ' +
      'JVTO is a verified ISIC partner (Provider ID 259268) — Ijen and Bromo tour packages are available at student rates to valid ISIC cardholders. ' +
      'Verifiable at isic.org/discounts/?providerId=259268.',
    termSetName: 'ISIC Global Student Discount Network',
    termSetUrl: 'https://www.isic.org',
    termSetSameAs: '',
  },
  INDECON: {
    name: 'INDECON (Indonesian Ecotourism Network)',
    description:
      'Indonesian Ecotourism Network — national advocacy body for responsible tourism and nature conservation. ' +
      'JVTO holds Spotlight Network membership, recognized for responsible volcanic tourism practices at Kawah Ijen and Mount Bromo. ' +
      'Verifiable at indecon.id/spotlight-networks/java-volcano-tour-operator.',
    termSetName: 'Indonesian Ecotourism Organizations',
    termSetUrl: '',
    termSetSameAs: 'https://www.indecon.id',
  },
  // JVTO-defined operational terms — differentiators not regulated externally.
  // Custom-named DefinedTerms anchor brand-specific concepts in the entity graph so AI engines
  // can extract "what is JVTO Travel Credit?" and "what is JVTO FOC Scheme?" with structured answers.
  JVTO_TRAVEL_CREDIT: {
    name: 'Lifetime Package Credit',
    description:
      'JVTO operational policy: for a full guest-initiated cancellation at least 48 hours before Day 1, 100% of the amount paid converts to Lifetime Package Credit — never cash. ' +
      'Non-expiring; locked to the same package, traveler count and price; cannot be split or changed to another package; transferable to another person once, with written authorisation. ' +
      'Differentiator vs industry-standard expiring vouchers. Force-majeure closures fall under the same policy.',
    termSetName: 'JVTO Operational Policy Pack v5',
    termSetUrl: '',
    termSetSameAs: '',
  },
  JVTO_FOC_SCHEME: {
    name: 'JVTO FOC Scheme',
    description:
      'JVTO Free-of-Charge group-discount scheme: 18 paying pax → 1 free, 35 paying pax → 2 free, 50 paying pax → 3 free. Applies on a single booking ' +
      'across the same trip dates. Transparent published thresholds (no negotiation), automated at checkout. Designed for student trips, ' +
      'corporate retreats, and family-cluster bookings.',
    termSetName: 'JVTO Operational Policy Pack v5',
    termSetUrl: '',
    termSetSameAs: '',
  },
};

// Term-set URL differs (JVTO policy page) for the two brand-custom terms — kept as code
// since it's a structural link, not prose.
const JVTO_POLICY_PACK_URL = `${BASE_URL}/policy/booking-payment-cancellation`;

/**
 * Builds the full DEFINED_TERMS map, merging ekosistem-sourced facts (per-term) over
 * FALLBACK_DEFINED_TERMS_FACTS. `@id`/`@type`/`termCode`/`inDefinedTermSet` scaffolding
 * stays as code. Typed via `satisfies` (matching the original) so the literal key/`@id`
 * types survive for DEFINED_TERM_IDS-style cross-references.
 */
export function buildDefinedTerms(
  facts?: EntityGraphFacts['definedTerms'],
) {
  const t = (key: DefinedTermKey): Required<DefinedTermFacts> => ({
    ...FALLBACK_DEFINED_TERMS_FACTS[key],
    ...facts?.[key],
  });

  const nib = t('NIB');
  const tdup = t('TDUP');
  const hpwki = t('HPWKI');
  const kta = t('KTA');
  const polpar = t('POLPAR');
  const bbksda = t('BBKSDA');
  const se1658 = t('SE1658');
  const isic = t('ISIC');
  const indecon = t('INDECON');
  const travelCredit = t('JVTO_TRAVEL_CREDIT');
  const focScheme = t('JVTO_FOC_SCHEME');

  return {
    NIB: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.NIB,
      name: nib.name,
      termCode: '1102230032918',
      description: nib.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: nib.termSetName, url: nib.termSetUrl },
    },
    TDUP: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.TDUP,
      name: tdup.name,
      termCode: '1102230032918',
      description: tdup.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: tdup.termSetName, url: tdup.termSetUrl },
    },
    HPWKI: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.HPWKI,
      name: hpwki.name,
      description: hpwki.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: hpwki.termSetName, sameAs: hpwki.termSetSameAs },
    },
    KTA: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.KTA,
      name: kta.name,
      description: kta.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: kta.termSetName },
    },
    POLPAR: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.POLPAR,
      name: polpar.name,
      description: polpar.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: polpar.termSetName, url: polpar.termSetUrl },
    },
    BBKSDA: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.BBKSDA,
      name: bbksda.name,
      description: bbksda.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: bbksda.termSetName, url: bbksda.termSetUrl },
    },
    SE1658: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.SE1658,
      name: se1658.name,
      description: se1658.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: se1658.termSetName },
    },
    ISIC: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.ISIC,
      name: isic.name,
      description: isic.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: isic.termSetName, url: isic.termSetUrl },
    },
    INDECON: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.INDECON,
      name: indecon.name,
      description: indecon.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: indecon.termSetName, sameAs: indecon.termSetSameAs },
    },
    JVTO_TRAVEL_CREDIT: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.JVTO_TRAVEL_CREDIT,
      name: travelCredit.name,
      description: travelCredit.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: travelCredit.termSetName, url: JVTO_POLICY_PACK_URL },
    },
    JVTO_FOC_SCHEME: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      '@id': DEFINED_TERM_IDS.JVTO_FOC_SCHEME,
      name: focScheme.name,
      description: focScheme.description,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: focScheme.termSetName, url: JVTO_POLICY_PACK_URL },
    },
  } as const satisfies Record<DefinedTermKey, WithContext<DefinedTerm>>;
}
