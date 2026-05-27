// src/lib/schemas/buildCrewSchemas.ts — "Personality Economy" named guide schemas.
// These guides have curated specialty knowsAbout[] signals for AI search entity matching.
// Hardcoded (not DB-driven) — specialty signals require editorial curation, not a DB row.
//
// AEO/GEO moat: "who is the best photography guide for Ijen crater?" →
// Only JVTO has a structured Person entity with knowsAbout: Blue Fire Photography.
//
// IMPORTANT: code fields match crew_members.code in DB (full name, not abbreviation).
// This enables photo enrichment cross-reference in our-team/page.tsx.
//
// @id registry entries (cluster_role_contracts.md @id Registry):
//   Guides:  /#crew-anjas, /#crew-gufron, /#crew-rendi, /#crew-boy,
//            /#crew-kiki, /#crew-taufik, /#crew-fauzi
//   Drivers: /#crew-fredi, /#crew-joyo, /#crew-yandi, /#crew-holili,
//            /#crew-yusuf, /#crew-dika, /#crew-pras
//
// Updated 2026-05-27: Personas expanded from 3 photography-specialist guides to
// full 14-member crew (7 guides + 7 drivers) per JVTO Business Exposure Engine
// — every named JVTO crew is now a Micro-Entity with curated knowsAbout signals.
// Source: wiki/people/crew-registry.md + review-mention analysis in wiki/reviews/.

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
      'Volcanic SO2 Gas Safety and BBKSDA Gas Mask Protocols',
      'HPWKI-Licensed Ijen Crater Guide Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'gufron',
    name: 'Gufron',
    jobTitle: 'Bromo and Tengger Specialist Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.gufron.url,
    description:
      'Bromo and Tengger caldera specialist with experience optimizing 4WD jeep routes and multi-day Bromo-Ijen itineraries. KTA-licensed for Ijen crater operations with extensive Bromo sunrise logistics knowledge.',
    knowsAbout: [
      'Mount Bromo Sunrise Viewpoints and Tengger Caldera Navigation',
      'Bromo 4WD Jeep Route Optimization and Convoy Planning',
      'Multi-Day Bromo-Ijen Tour Logistics and Pacing',
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
  {
    code: 'boy',
    name: 'Boy (Ahboy)',
    jobTitle: 'Senior Ijen Crater Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.boy.url,
    description:
      'Most-reviewed JVTO guide across Trustpilot and Google (23+ guest reviews). Local Bondowoso resident specializing in Kawah Ijen crater guiding, blue fire ascents, and gas-mask safety coordination. KTA-licensed HPWKI member.',
    knowsAbout: [
      'Kawah Ijen Crater Senior Guiding and Pre-Dawn Ascents',
      'Ijen Blue Fire Viewing Strategy and Timing',
      'Gas Mask Equipment Coordination and Safety Briefings',
      'East Java Cultural Storytelling and Local History',
      'HPWKI-Licensed Ijen Crater Guide Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'kiki',
    name: 'Kiki',
    jobTitle: 'Photography-Centric Volcano Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.kiki.url,
    description:
      'JVTO guide specializing in guest photography and clear instructional guiding. 17+ reviews praise photo quality and instruction clarity across Ijen, Bromo, and Tumpak Sewu routes. KTA-licensed HPWKI member.',
    knowsAbout: [
      'Guest Photography Direction at Volcanic Locations',
      'Clear Instructional Guiding for First-Time Volcano Hikers',
      'Tumpak Sewu Waterfall Approach and Multi-Destination Routing',
      'Kawah Ijen Pre-Dawn Crater Operations',
      'HPWKI-Licensed Ijen Crater Guide Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'taufik',
    name: 'Taufik',
    jobTitle: 'Family-Inclusive Multi-Destination Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.taufik.url,
    description:
      'JVTO guide known for thorough pre-tour briefings and patient guiding of mixed-age groups including children and teens on Ijen and Bromo routes. KTA-licensed HPWKI member.',
    knowsAbout: [
      'Pre-Hike Safety Briefings and Itinerary Walkthroughs',
      'Mixed-Age Group Guiding (Family Tours with Children and Teens)',
      'Patient Pacing Coordination for First-Time Volcano Hikers',
      'East Java Multi-Day Tour Logistics',
      'HPWKI-Licensed Ijen Crater Guide Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'fauzi',
    name: 'Fauzi',
    jobTitle: 'Crowd-Avoidance and Attentive Coordination Guide',
    isGuide: true,
    photoUrl: CREW_PORTRAITS_BY_CODE.fauzi.url,
    description:
      'JVTO guide specializing in identifying low-crowd vantage points and attentive guest coordination during multi-stop East Java itineraries. KTA-licensed HPWKI member.',
    knowsAbout: [
      'Low-Crowd Viewpoint Routing at Mount Bromo and Mount Ijen',
      'Attentive Guest Coordination and Comfort Management',
      'Photo-Opportunity Scouting at Volcanic Sites',
      'Multi-Destination East Java Tour Operations',
      'HPWKI-Licensed Ijen Crater Guide Operations',
    ],
    knowsLanguage: ['Indonesian'],
  },
  {
    code: 'fredi',
    name: 'Fredi',
    jobTitle: 'East Java Long-Haul Tour Driver',
    isGuide: false,
    photoUrl: CREW_PORTRAITS_BY_CODE.fredi.url,
    description:
      'Most-reviewed JVTO driver (20+ guest reviews). Specializes in punctuality-critical East Java overland transfers including Surabaya-Bromo-Ijen circuits and Bali-origin border crossings. KTA-licensed.',
    knowsAbout: [
      'Punctuality-Critical Tour Driving Operations',
      'East Java Long-Haul Overland Logistics (Surabaya, Bromo, Ijen, Bali Ferry)',
      'Multi-Day Bromo-Ijen Convoy Driving',
      'Defensive Driving on Volcanic Mountain Routes',
      'Bali-Java Ferry Crossing Coordination (Gilimanuk-Ketapang)',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'joyo',
    name: 'Joyo',
    jobTitle: 'Precision Tour Driver',
    isGuide: false,
    photoUrl: CREW_PORTRAITS_BY_CODE.joyo.url,
    description:
      'Most-reviewed JVTO driver on Trustpilot (15 reviews on the platform). Specializes in efficient point-to-point driving while maintaining safety standards. KTA-licensed.',
    knowsAbout: [
      'Efficient Point-to-Point Tour Driving with Safety-First Operations',
      'East Java Mountain Road Defensive Driving',
      'Multi-Stop Itinerary Time-Management',
      'Volcanic Region Vehicle Operations',
      'Bromo-Ijen Circuit Driving',
    ],
    knowsLanguage: ['Indonesian'],
  },
  {
    code: 'yandi',
    name: 'Yandi',
    jobTitle: 'Senior Touring Driver - Briefings and Family Coordination',
    isGuide: false,
    photoUrl: CREW_PORTRAITS_BY_CODE.yandi.url,
    description:
      'JVTO senior driver specializing in pre-tour guest briefings and family-friendly driving coordination. 16+ guest reviews emphasize his briefings and reliability. KTA-licensed. Strategic pairing partner with Guide Rendi for family demographic per JVTO Dream Team framework.',
    knowsAbout: [
      'Pre-Tour Guest Briefings and Trip Walkthroughs',
      'Family-Friendly Tour Driving and Pacing',
      'Mixed-Age Group Travel Coordination',
      'East Java Multi-Day Tour Driving',
      'Bromo-Ijen-Tumpak Sewu Route Operations',
    ],
    knowsLanguage: ['Indonesian', 'English'],
  },
  {
    code: 'holili',
    name: 'Holili',
    jobTitle: 'Punctuality-First Tour Driver',
    isGuide: false,
    photoUrl: CREW_PORTRAITS_BY_CODE.holili.url,
    description:
      'JVTO driver consistently rated for punctuality and route optimization. Local Bondowoso resident with deep knowledge of Ijen access roads. KTA-licensed.',
    knowsAbout: [
      'Route Optimization and Arrival-Time Management',
      'Local Bondowoso-Ijen Access Road Operations',
      'Punctual Tour Driving Across Multi-Stop Itineraries',
      'Defensive Driving on East Java Mountain Routes',
      'Bromo-Ijen Circuit Driving',
    ],
    knowsLanguage: ['Indonesian'],
  },
  {
    code: 'yusuf',
    name: 'Yusuf',
    jobTitle: 'Professional Tour Driver',
    isGuide: false,
    photoUrl: null,
    description:
      'JVTO professional driver. Recent guest reviews (2026) emphasize punctuality, professionalism, and reliability across Surabaya-origin tour packages. KTA pending verification.',
    knowsAbout: [
      'Professional Tour Driving with Punctual Operations',
      'Surabaya-Origin East Java Tour Logistics',
      'Multi-Destination Volcanic Region Driving',
      'Bromo-Ijen Circuit Driving',
    ],
    knowsLanguage: ['Indonesian'],
  },
  {
    code: 'dika',
    name: 'Dika',
    jobTitle: 'Cultural Sharing Tour Driver',
    isGuide: false,
    photoUrl: null,
    description:
      'JVTO driver known for sharing local Indonesian context with international guests during long transits. Active driver in JVTO operational roster. KTA pending verification.',
    knowsAbout: [
      'Cultural Storytelling and Local Context Sharing During Transit',
      'Tour Driving for International Guests',
      'East Java Multi-Stop Tour Operations',
      'Bromo-Ijen Circuit Driving',
    ],
    knowsLanguage: ['Indonesian'],
  },
  {
    code: 'pras',
    name: 'Pras',
    jobTitle: 'English-Speaking Tour Driver',
    isGuide: false,
    photoUrl: null,
    description:
      'JVTO bilingual driver supporting English-speaking international guests across multi-day East Java tours. Active driver in operational roster, paired across Surabaya and Bali-origin packages. KTA pending verification.',
    knowsAbout: [
      'Bilingual Indonesian-English Tour Driving',
      'International Guest Support During Long-Haul Transits',
      'East Java Multi-Day Tour Operations',
      'Bromo-Ijen-Tumpak Sewu Route Driving',
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
    ...(guide.isGuide
      ? {
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            name: 'KTA (Kartu Tanda Anggota) - HPWKI Guide Licence',
            credentialCategory: 'Indonesian Tour Guide Licence - Ijen Volcano',
            // KTA card image URL from imageAssets.ts (null if guide not in CREW_CREDENTIALS_BY_CODE).
            ...(CREW_CREDENTIALS_BY_CODE[guide.code]
              ? {
                  image: {
                    '@type': 'ImageObject',
                    url: CREW_CREDENTIALS_BY_CODE[guide.code].url,
                    caption: CREW_CREDENTIALS_BY_CODE[guide.code].caption,
                  },
                }
              : {}),
            recognizedBy: {
              '@type': 'Organization',
              name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
              description: 'Ijen volcano guide association supervised by BBKSDA Jawa Timur.',
            },
          },
        }
      : {}),
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

/** ItemList of named guide personas - signals our-team page is the canonical specialty index. */
export function buildNamedGuideItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE_URL}/why-jvto/our-team#named-guides`,
    name: 'JVTO Named Guide Specialists - Specialty Knowledge Index',
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
