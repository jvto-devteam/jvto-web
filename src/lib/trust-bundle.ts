// Trust Bundle v1 helper — typed re-export of the synced JSON artifacts.
// Source: llm-wiki/output/website/trust-bundle/, copied via `npm run sync:trust`.
//
// Do not hand-edit the JSON files under src/data/trust-bundle/.
// Fix data in llm-wiki registries, re-run the compiler there, then re-sync here.

import claimsJson from "@/data/trust-bundle/claims.json";
import faqJson from "@/data/trust-bundle/faq.json";
import aeoJson from "@/data/trust-bundle/aeo-snippets.json";
import manifestJson from "@/data/trust-bundle/_manifest.json";
import organizationJson from "@/data/trust-bundle/schema/organization.json";
import faqPageJson from "@/data/trust-bundle/schema/faq-page.json";
import touristTripJson from "@/data/trust-bundle/schema/tourist-trip.json";

export type TrustClaimEvidence = {
  id: string;
  type: string;
  source_file: string;
  description: string;
  proof_ids: string[];
};

export type TrustClaimNarrative = {
  ai_snippet: string;
  short: string;
  cs_reply: string;
};

export type TrustClaimDecision = {
  decision_id: string;
  topic: string;
  final_value: unknown;
  decided_at: string;
};

export type TrustClaim = {
  id: string;
  name: string;
  canonical_text: string;
  domain: string;
  category: string;
  last_verified: string;
  evidence: TrustClaimEvidence[];
  narrative: TrustClaimNarrative;
  decisions?: TrustClaimDecision[];
  tags?: string[];
};

export type TrustFaqItem = {
  question: string;
  answer: string;
  source_claim_id: string;
  target_pages: string[];
};

export type TrustAeoSnippet = {
  topic: string;
  tldr: string;
  claim_ids: string[];
  use_for: string[];
};

export type TrustManifest = {
  compiled_at: string;
  compiler_version: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  validation: Record<string, "pass" | "fail">;
  input_hashes: Record<string, string>;
};

type ClaimsRoot = { version: string; claims: TrustClaim[] };
type FaqRoot = { version: string; items: TrustFaqItem[] };
type AeoRoot = { version: string; snippets: TrustAeoSnippet[] };

export const trustClaims: TrustClaim[] = (claimsJson as ClaimsRoot).claims;
export const trustFaqItems: TrustFaqItem[] = (faqJson as FaqRoot).items;
export const trustAeoSnippets: TrustAeoSnippet[] = (aeoJson as AeoRoot).snippets;
export const trustManifest: TrustManifest = manifestJson as TrustManifest;

// JSON-LD schemas exported as opaque objects.
// - organizationSchema: export-only — NOT rendered anywhere. The existing
//   PageJsonLdCombined / entityGraph own the richer Organization emission, so
//   injecting this would duplicate it. Kept available for future use only.
// - faqPageSchema / touristTripSchema: may be injected by the /trust route
//   (src/app/(website)/trust/page.tsx) via PageJsonLdCombined extraSchemas,
//   with suppressCmsFaq set to avoid duplicate FAQPage. Do not inject these on
//   pages that already emit their own FAQPage / TouristTrip.
export const organizationSchema = organizationJson;
export const faqPageSchema = faqPageJson;
export const touristTripSchema = touristTripJson;
