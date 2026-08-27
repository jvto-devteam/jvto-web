// src/lib/schemas/externalEntities.ts
//
// Third-party organizations JVTO's schema graph references repeatedly across
// entityGraph.ts — press outlets, government bodies, professional
// associations. Each gets exactly ONE full definition here with a stable
// `@id`; every repeat mention in the graph references that `@id` via
// entityRef() instead of inlining a fresh `{"@type":"Organization", name:...}`
// copy — the same define-once-reference-by-@id pattern DEFINED_TERMS already
// uses in entityGraph.ts for regulatory terms.
//
// Audit finding (2026-08-18): 389 of 431 third-party organization mentions
// across the site's rendered JSON-LD had no `@id` — so a crawler saw
// "Detik.com" on a crew page and "Detik.com" on /verify-jvto as two
// unrelated anonymous nodes — and 263 had no `sameAs`, so even a single
// mention never resolved to the real-world organization. This file fixes
// both: every entity below carries a stable `@id`, and `sameAs` is filled in
// wherever an official URL could be verified (never guessed — an entity with
// no verified URL ships without `sameAs` rather than a fabricated one).
//
// Verification note: government-body websites below (BKPM, Kemenparekraf,
// BBKSDA Jawa Timur) were confirmed live via web search 2026-08-18, since
// several have moved domains in recent years. Everything else was already a
// live URL elsewhere in entityGraph.ts before this file existed.

const BASE_URL = 'https://javavolcano-touroperator.com';

// @id scheme note (2026-08-21): these were `${BASE_URL}/#org-*` — a homepage
// fragment — while jvto-ekosistem's external-entities.json, the SSOT for the
// same organisations, used `${BASE_URL}/entity/#org-*`. Both shipped on the
// same rendered page, so HPWKI (and every other shared entity) appeared to a
// crawler as two unrelated nodes: exactly the fragmentation this file was
// created to end, reintroduced by having two sources. Aligned to the
// ekosistem scheme, and /entity now resolves and defines each one.

export const EXTERNAL_ENTITIES = {
  hpwki: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/entity/#org-hpwki`,
    name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
    description:
      'Ijen volcano guide association supervised by BBKSDA Jawa Timur (Ministry of Environment). Members receive annual training on volcanic gas protocols and evacuation procedures.',
    sameAs:
      'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
  },
  indecon: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/entity/#org-indecon`,
    name: 'INDECON (Indonesian Ecotourism Network)',
    sameAs: 'https://www.indecon.id/spotlight-networks/java-volcano-tour-operator',
  },
  isic: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/entity/#org-isic`,
    name: 'ISIC (International Student Identity Card)',
    sameAs: 'https://www.isic.org/discounts/?providerId=259268',
  },
  detikcom: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/entity/#org-detikcom`,
    name: 'Detik.com',
    url: 'https://detik.com',
    sameAs: 'https://detik.com',
  },
  radarJemberJawaPos: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/entity/#org-radar-jember`,
    name: 'Radar Jember / Jawa Pos',
    url: 'https://radarjember.jawapos.com',
    sameAs: 'https://radarjember.jawapos.com',
  },
  dumontReiseverlag: {
    '@type': 'Organization',
    // Must match the id the ekosistem entity registry defines for this record
    // (external-entities.json, key "dumont"). This read #org-dumont-reiseverlag,
    // so every publisher reference on / and /verify-jvto pointed at a node the
    // /entity page never emits.
    '@id': `${BASE_URL}/entity/#org-dumont`,
    name: 'DuMont Reiseverlag',
    // DuMont Reiseverlag is now an imprint of MairDumont — the current
    // official site of record for the brand.
    url: 'https://www.mairdumont.com',
    sameAs: 'https://www.mairdumont.com',
  },
  bkpm: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-bkpm`,
    name: 'Kementerian Investasi / BKPM Indonesia',
    url: 'https://www.bkpm.go.id',
    sameAs: 'https://www.bkpm.go.id',
  },
  // Issuer of both the NIB and the TDUP. Mirrors external-entities.json key
  // "oss-indonesia" — the @id must match that registry exactly, or the same
  // institution ships as two nodes on one page. sameAs verified 2026-08-27:
  // HTTP 200, title "OSS RBA - Sistem Perizinan Berusaha Terintegrasi Secara
  // Elektronik", which is the system PP 24/2018 names on the licence itself.
  ossIndonesia: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-oss-indonesia`,
    name: 'OSS Indonesia (Online Single Submission)',
    url: 'https://oss.go.id',
    sameAs: 'https://oss.go.id',
  },
  kemenparekraf: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-kemenparekraf`,
    name: 'Kementerian Pariwisata dan Ekonomi Kreatif',
    url: 'https://kemenparekraf.go.id',
    sameAs: 'https://kemenparekraf.go.id',
  },
  bbksdaJatim: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-bbksda-jatim`,
    name: 'BBKSDA Jawa Timur (Balai Besar Konservasi Sumber Daya Alam)',
    description:
      'Indonesian Ministry of Environment body responsible for Ijen Crater nature reserve management.',
    // bbksdajatim.org stopped resolving (verified 2026-08-21 with a control URL,
    // so this is a real outage rather than a bot block), and so did its ticket
    // subdomain. The Ministry of Forestry portal is where the TWA Kawah Ijen
    // rules and ticketing now live.
    url: 'https://ayoketamannasional.kehutanan.go.id/en/taman-wisata-alam/kawah-ijen',
    sameAs: 'https://ayoketamannasional.kehutanan.go.id/en/taman-wisata-alam/kawah-ijen',
  },
  // Mirrors external-entities.json key "polpar-bondowoso". The founder's
  // worksFor edge described this unit inline, so to a machine the unit on the
  // founder node and the one in the registry were two different organisations.
  polparBondowoso: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-polpar-bondowoso`,
    name: 'Polisi Pariwisata (POLPAR) Bondowoso — Polres Bondowoso, Indonesian National Police',
    url: 'https://polri.go.id',
  },
  polri: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-polri`,
    name: 'Indonesian National Police (POLRI)',
    url: 'https://polri.go.id',
    sameAs: 'https://polri.go.id',
  },
  kemenkes: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-kemenkes`,
    name: 'Kementerian Kesehatan Republik Indonesia (Ministry of Health)',
    url: 'https://kemkes.go.id',
    sameAs: 'https://kemkes.go.id',
  },
  kki: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-kki`,
    name: 'Konsil Kedokteran Indonesia (Indonesian Medical Council)',
    url: 'https://kki.go.id',
    sameAs: 'https://kki.go.id',
  },
  // The authority that actually issues a physician's SIP in Indonesia: the
  // kabupaten one-stop permit office. The published licence
  // (SIP 503.446/664/DRU/4/430.9.13/2026, 6 January 2026) is signed by its head.
  // The Ministry of Health appears on that document as the regulation-maker
  // (Permenkes 2052/Menkes/Per/X/2011) and as first carbon copy — not as issuer.
  // Mirrors external-entities.json key "dpmptsp-bondowoso".
  dpmptspBondowoso: {
    '@type': 'GovernmentOrganization',
    '@id': `${BASE_URL}/entity/#org-dpmptsp-bondowoso`,
    name: 'Dinas Penanaman Modal, PTSP dan Tenaga Kerja Kabupaten Bondowoso',
  },
} as const;

export type ExternalEntityKey = keyof typeof EXTERNAL_ENTITIES;

/**
 * A short `{"@id": ...}` reference to an already-defined external entity.
 * Use for every mention after the first full definition, so a repeated
 * organization never ships as a second anonymous copy.
 */
export function entityRef(key: ExternalEntityKey): { '@id': string } {
  return { '@id': EXTERNAL_ENTITIES[key]['@id'] };
}
