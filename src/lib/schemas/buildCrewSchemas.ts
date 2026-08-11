// src/lib/schemas/buildCrewSchemas.ts — "Personality Economy" named guide schemas.
// These guides have curated specialty knowsAbout[] signals for AI search entity matching.
// Hardcoded (not DB-driven) — specialty signals require editorial curation, not a DB row.
// Generic crew Person schemas (DB-driven, 11 members) → entityGraph.ts buildCrewPersonSchema().
//
// AEO/GEO moat: "who is the best photography guide for Ijen crater?" →
// Only JVTO has a structured Person entity with knowsAbout: Blue Fire Photography.
//
// IMPORTANT: code fields match crew_members.code in DB (full name, not abbreviation).
// This enables photo enrichment cross-reference in our-team/page.tsx.
//
// @id registry entries (cluster_role_contracts.md @id Registry):
//   ${BASE_URL}/#crew-anjas, /#crew-gufron, /#crew-rendi

import { CREW_PORTRAITS_BY_CODE, CREW_CREDENTIALS_BY_CODE } from '@/lib/imageAssets';

const BASE_URL = 'https://javavolcano-touroperator.com';
const ORG_ID = `${BASE_URL}/#organization`;

export interface NamedGuidePersona {
  /** Matches crew_members.code in DB — used as @id suffix and URL slug lookup. */
  code: string;
  name: string;
  jobTitle: string;
  isGuide: boolean;
  photoUrl: string | null;
  knowsAbout: string[];
  knowsLanguage: string[];
  description: string;
  sameAs?: string[];
}

// Verify each knowsAbout entry directly with the named guide before production.
export const NAMED_GUIDE_PERSONAS: NamedGuidePersona[] = [
  {
    code: 'anjas',
    name: 'Anjas',
    jobTitle: 'Senior Ijen Photography Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.anjas.url,
    description:
      'Senior Ijen specialist with deep expertise in pre-dawn crater ascents for photography clients. KTA-licensed HPWKI member, experienced in guiding long-exposure blue fire and astrophotography sessions at Kawah Ijen.',
    knowsAbout: [
      'Blue Fire (Api Biru) Photography at Kawah Ijen',
      'Astrophotography and Long-Exposure Crater Shots',
      'Kawah Ijen Night Trail Navigation (01:00 AM Ascent)',
      'Volcanic SO₂ Gas Safety and BBKSDA Gas Mask Protocols',
      'HPWKI-Licensed Ijen Crater Guide Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'gufron',
    name: 'Gufron',
    jobTitle: 'Bromo & Tengger Specialist Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.gufron.url,
    description:
      'Bromo and Tengger caldera specialist with experience optimizing 4WD jeep routes and multi-day Bromo–Ijen itineraries. KTA-licensed for Ijen crater operations with extensive Bromo sunrise logistics knowledge.',
    knowsAbout: [
      'Mount Bromo Sunrise Viewpoints and Tengger Caldera Navigation',
      'Bromo 4WD Jeep Route Optimization and Convoy Planning',
      'Multi-Day Bromo–Ijen Tour Logistics and Pacing',
      'East Java Volcanic Landscape Photography Guidance',
      'HPWKI-Licensed Ijen Crater Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'rendi',
    name: 'Rendi',
    jobTitle: 'Multi-Destination Senior Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.rendi.url,
    description:
      'Multi-destination senior guide covering Tumpak Sewu canyon descents, Ijen crater, and Bromo circuits. Specialist in group expedition coordination and long-haul East Java itineraries.',
    knowsAbout: [
      'Tumpak Sewu Waterfall Canyon Descent and Photography',
      'Multi-Day East Java Expedition Coordination (Ijen, Bromo, Tumpak Sewu)',
      'Group Safety Management on Volcanic and Canyon Terrain',
      'Papuma Coastal Route and East Java Extension Logistics',
      'HPWKI-Licensed Ijen Crater Night Hike Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
];

export function buildNamedGuidePersonaSchema(guide: NamedGuidePersona) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#crew-${guide.code}`,
    name: guide.name,
    jobTitle: guide.jobTitle,
    description: guide.description,
    url: `${BASE_URL}/team/${guide.code}`,
    worksFor: { '@id': ORG_ID },
    employmentType: 'FULL_TIME',
    knowsAbout: guide.knowsAbout,
    knowsLanguage: guide.knowsLanguage.map((lang) => ({
      '@type': 'Language',
      name: lang,
    })),
    // KTA credential only for licensed guides (not drivers).
    ...(guide.isGuide ? {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'KTA (Kartu Tanda Anggota) — HPWKI Guide Licence',
        credentialCategory: 'Indonesian Tour Guide Licence — Ijen Volcano',
        // KTA card image URL from imageAssets.ts (null if guide not in CREW_CREDENTIALS_BY_CODE).
        ...(CREW_CREDENTIALS_BY_CODE[guide.code]
          ? { image: { '@type': 'ImageObject', url: CREW_CREDENTIALS_BY_CODE[guide.code].url, caption: CREW_CREDENTIALS_BY_CODE[guide.code].caption } }
          : {}),
        recognizedBy: {
          '@type': 'Organization',
          name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
          description: 'Ijen volcano guide association supervised by BBKSDA Jawa Timur.',
        },
      },
    } : {}),
    ...(guide.photoUrl
      ? { image: { '@type': 'ImageObject', url: guide.photoUrl, caption: guide.name } }
      : {}),
    ...(guide.sameAs?.length ? { sameAs: guide.sameAs } : {}),
  };
}

export function buildAllNamedGuideSchemas() {
  return NAMED_GUIDE_PERSONAS.map(buildNamedGuidePersonaSchema);
}

/** Look up a named persona by code (= URL slug = crew_members.code). */
export function getPersonaByCode(code: string): NamedGuidePersona | undefined {
  return NAMED_GUIDE_PERSONAS.find((p) => p.code === code);
}

/** ItemList of named guide personas — signals our-team page is the canonical specialty index. */
export function buildNamedGuideItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/why-jvto/our-team#named-guides`,
    name: 'JVTO Named Guide Specialists — Specialty Knowledge Index',
    description:
      'Named JVTO guides and drivers with documented specialty knowledge areas for East Java volcano tourism, each anchored by a unique @id entity.',
    numberOfItems: NAMED_GUIDE_PERSONAS.length,
    itemListElement: NAMED_GUIDE_PERSONAS.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@id': `${BASE_URL}/#crew-${g.code}`,
        '@type': 'Person',
        name: g.name,
        url: `${BASE_URL}/team/${g.code}`,
      },
    })),
  };
}
