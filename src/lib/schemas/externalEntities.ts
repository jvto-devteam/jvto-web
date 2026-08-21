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
    '@id': `${BASE_URL}/entity/#org-dumont-reiseverlag`,
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
