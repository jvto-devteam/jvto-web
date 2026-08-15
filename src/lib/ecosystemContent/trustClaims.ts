// src/lib/ecosystemContent/trustClaims.ts
//
// Fetches the trust-claims bundle (the 9 canonical C1-C9 claims, their AEO
// one-liner snippets, and the FAQ derived from them) from jvto-ekosistem's
// 1-knowledge-and-evidence-core/credentials-and-public-evidence/trust-claims.json.
// Same local-read + HTTP-fallback two-tier pattern as ecosystemContent/markets.ts
// (getEcosystemMarket) and ecosystemContent/verifyEvidence.ts
// (getEcosystemVerifyEvidenceDocs) — see those files for the established
// readLocal/fetchRemote convention.
//
// Replaces the trustClaims/trustAeoSnippets/trustFaqItems exports of
// src/lib/trust-bundle.ts (src/data/trust-bundle/claims.json,
// aeo-snippets.json, faq.json) for this task's two consumers:
// components/trust/TrustClaimBlock.tsx and components/trust/TrustFaqBlock.tsx.
// trust-bundle.ts's other exports (organizationSchema, faqPageSchema,
// touristTripSchema, trustManifest) are out of scope here — trust/page.tsx
// keeps importing those from "@/lib/trust-bundle" directly.
//
// Do not hand-edit the ekosistem trust-claims.json. Fix data in llm-wiki
// registries, re-run the compiler there, then re-sync ekosistem's copy.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;

const SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/trust-claims.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

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

export type TrustClaimsBundle = {
  claims: TrustClaim[];
  aeoSnippets: TrustAeoSnippet[];
  faq: TrustFaqItem[];
};

type TrustClaimsRoot = {
  _comment?: string;
  claims?: TrustClaim[];
  aeoSnippets?: TrustAeoSnippet[];
  faq?: TrustFaqItem[];
};

const EMPTY_BUNDLE: TrustClaimsBundle = { claims: [], aeoSnippets: [], faq: [] };

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<TrustClaimsRoot | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as TrustClaimsRoot;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<TrustClaimsRoot | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-trust-claims"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as TrustClaimsRoot;
  } catch {
    return null;
  }
}

function toBundle(root: TrustClaimsRoot | null): TrustClaimsBundle {
  if (!root) return EMPTY_BUNDLE;
  return {
    claims: root.claims ?? [],
    aeoSnippets: root.aeoSnippets ?? [],
    faq: root.faq ?? [],
  };
}

/**
 * The trust-claims bundle (9 canonical claims C1-C9, AEO snippets, FAQ) for
 * the /trust page. Local sibling-directory read first (dev, same-server
 * deploys), HTTP fetch to the ekosistem origin as fallback. Returns an empty
 * bundle ({ claims: [], aeoSnippets: [], faq: [] }) if neither source is
 * reachable — callers render an empty section rather than throwing.
 */
export async function getEcosystemTrustClaims(): Promise<TrustClaimsBundle> {
  const local = await readLocal();
  if (local) return toBundle(local);

  const remote = await fetchRemote();
  return toBundle(remote);
}
