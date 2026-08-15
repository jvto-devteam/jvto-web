// src/lib/trust-bundle-schema.ts
//
// Local replacement for the schema-shaping exports that used to live in
// src/lib/trust-bundle.ts (removed in Task 5.3 of the data-source-consolidation
// plan, alongside scripts/sync-trust-bundle.mjs and src/data/trust-bundle/).
//
// Unlike trustClaims / trustAeoSnippets / trustFaqItems — which are genuine
// content migrated to jvto-ekosistem in Task 5.2 (see
// src/lib/ecosystemContent/trustClaims.ts) — everything here is either
// generic JSON-LD shaping logic or a static pipeline-metadata snapshot with
// no unique facts of its own, so it stays local rather than moving to
// jvto-ekosistem.

import type { TrustFaqItem } from "@/lib/ecosystemContent/trustClaims";

/**
 * Builds a schema.org FAQPage node from the /trust page's FAQ items.
 *
 * This used to be a static JSON file (src/data/trust-bundle/schema/faq-page.json)
 * compiled once from llm-wiki alongside — and duplicating — the same FAQ text as
 * faq.json. Building it here from the live `faq` items returned by
 * getEcosystemTrustClaims() (the same data TrustFaqBlock renders) means the
 * JSON-LD can never drift out of sync with the visible FAQ content.
 */
export function buildTrustFaqPageSchema(faqItems: TrustFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * TouristTrip stub nodes for the 5 core destinations, cross-linked from the
 * /trust page's JSON-LD graph. Relocated verbatim from the old trust-bundle
 * sync (src/data/trust-bundle/schema/tourist-trip.json) — plain name+url
 * pairs, not verifiable content that needs an ekosistem source of truth.
 * Keep these in sync by hand with the destination slugs/names in
 * src/lib/schemas/buildDestinationsSchemas.ts (TOURIST_ATTRACTION_DATA) if a
 * destination is ever renamed, added, or removed.
 */
export const touristTripSchema = [
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Kawah Ijen",
    url: "https://javavolcano-touroperator.com/destinations/ijen-crater",
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Mount Bromo",
    url: "https://javavolcano-touroperator.com/destinations/mount-bromo",
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Tumpak Sewu",
    url: "https://javavolcano-touroperator.com/destinations/tumpak-sewu-waterfall",
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Madakaripura",
    url: "https://javavolcano-touroperator.com/destinations/madakaripura-waterfall",
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Papuma Beach",
    url: "https://javavolcano-touroperator.com/destinations/papuma-beach",
  },
];

export type TrustManifest = {
  compiled_at: string;
  compiler_version: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  validation: Record<string, "pass" | "fail">;
  input_hashes: Record<string, string>;
};

/**
 * Snapshot of the last llm-wiki trust-bundle compile (2026-07-07, compiler
 * v0.1.0), relocated verbatim from src/data/trust-bundle/_manifest.json. This
 * is pipeline metadata about that compile run, not site content — it will
 * NOT update automatically now that the direct sync is retired (Task 5.3).
 * The /trust page uses it only for the "Trust Bundle · vX · Compiled ... from
 * N claims" byline; update it by hand if that byline needs to reflect a newer
 * compile.
 */
export const trustManifest: TrustManifest = {
  compiled_at: "2026-07-07T04:28:19+00:00",
  compiler_version: "0.1.0",
  inputs: {
    claims: 9,
    evidence: 18,
    entities: 50,
    decisions: 3,
    narratives: 9,
  },
  outputs: {
    claims: 9,
    schema_files: 3,
    faq_items: 9,
    aeo_snippets: 9,
  },
  validation: {
    F1: "pass",
    F2: "pass",
    F3: "pass",
    F4: "pass",
    F5: "pass",
    F6: "pass",
    F7: "pass",
    F8: "pass",
  },
  input_hashes: {
    "claim-registry.yml": "sha256:f3323f36bcd48b7f",
    "evidence-registry.yml": "sha256:29f779912fbbe35d",
    "entity-registry.yml": "sha256:5d123c0437b898ba",
    "decision-registry.yml": "sha256:7d0c7645156ed1a8",
    "conflict-log.md": "sha256:39ba3060c091ecb1",
    "aeo-claims.md": "sha256:4d400b163fce0f30",
  },
};
