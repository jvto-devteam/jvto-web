// src/lib/schemas/buildCrewSchemas.ts — "Personality Economy" named guide schemas.
// These 4 guides have curated specialty knowsAbout[] signals for AI search entity matching.
// Hardcoded (not DB-driven) — specialty signals require editorial curation, not a DB row.
// Generic crew Person schemas (DB-driven, 11 members) → entityGraph.ts buildCrewPersonSchema().
//
// AEO/GEO moat: "who is the best photography guide for Ijen crater?" →
// Only JVTO has a structured Person entity with knowsAbout: Blue Fire Photography.
// Competitors relying on anonymous staff cannot replicate identity-anchored entities.
//
// @id registry entries (added to cluster_role_contracts.md @id Registry):
//   ${BASE_URL}/#crew-anj, /#crew-guf, /#crew-ren, /#crew-prs

const BASE_URL = 'https://javavolcano-touroperator.com';
const ORG_ID = `${BASE_URL}/#organization`;

export interface NamedGuidePersona {
  code: string;
  name: string;
  jobTitle: string;
  photoUrl: string | null;
  knowsAbout: string[];
  knowsLanguage: string[];
  description: string;
  sameAs?: string[];
}

// Verify each knowsAbout entry directly with the named guide before production.
export const NAMED_GUIDE_PERSONAS: NamedGuidePersona[] = [
  {
    code: 'anj',
    name: 'Anjas',
    jobTitle: 'Senior Ijen Photography Guide',
    photoUrl: null,
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
    code: 'guf',
    name: 'Gufron',
    jobTitle: 'Bromo & Tengger Specialist Guide',
    photoUrl: null,
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
    code: 'ren',
    name: 'Rendi',
    jobTitle: 'Multi-Destination Senior Guide',
    photoUrl: null,
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
  {
    code: 'prs',
    name: 'Pras',
    jobTitle: 'Ijen Guide & East Java Logistics Specialist',
    photoUrl: null,
    description:
      'Ijen guide and logistics specialist managing the Surabaya–Malang–Bromo–Ijen circuit. Deep familiarity with cross-terrain vehicle planning, guest pickup coordination, and contingency routing for East Java tours.',
    knowsAbout: [
      'Surabaya–Malang–Bromo–Ijen Tour Circuit Route Planning',
      'Cross-Terrain Vehicle and Convoy Safety Management',
      'Guest Pickup and Transfer Coordination from Surabaya and Malang',
      'Emergency and Contingency Route Planning for Volcanic Areas',
      'HPWKI-Licensed Ijen Crater Trail Operations',
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
    worksFor: { '@id': ORG_ID },
    employmentType: 'FULL_TIME',
    knowsAbout: guide.knowsAbout,
    knowsLanguage: guide.knowsLanguage.map((lang) => ({
      '@type': 'Language',
      name: lang,
    })),
    // KTA credential without identifier — update with actual KTA card numbers per guide.
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'KTA (Kartu Tanda Anggota) — HPWKI Guide Licence',
      credentialCategory: 'Indonesian Tour Guide Licence — Ijen Volcano',
      recognizedBy: {
        '@type': 'Organization',
        name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
        description: 'Ijen volcano guide association supervised by BBKSDA Jawa Timur.',
      },
    },
    ...(guide.photoUrl
      ? { image: { '@type': 'ImageObject', url: guide.photoUrl, caption: guide.name } }
      : {}),
    ...(guide.sameAs?.length ? { sameAs: guide.sameAs } : {}),
  };
}

export function buildAllNamedGuideSchemas() {
  return NAMED_GUIDE_PERSONAS.map(buildNamedGuidePersonaSchema);
}

/** ItemList of 4 named guides — signals our-team page is the canonical specialty index. */
export function buildNamedGuideItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/why-jvto/our-team#named-guides`,
    name: 'JVTO Named Guide Specialists — Specialty Knowledge Index',
    description:
      'Four named JVTO guides with documented specialty knowledge areas for East Java volcano tourism, each anchored by a unique @id entity.',
    numberOfItems: NAMED_GUIDE_PERSONAS.length,
    itemListElement: NAMED_GUIDE_PERSONAS.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@id': `${BASE_URL}/#crew-${g.code}`,
        '@type': 'Person',
        name: g.name,
      },
    })),
  };
}
