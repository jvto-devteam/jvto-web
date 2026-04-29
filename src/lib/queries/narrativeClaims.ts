// src/lib/queries/narrativeClaims.ts — Prisma-based queries for narrative_claims table.
// Ported from rewrite repo (e:\test-2-2026\lib\queries\narrativeClaims.ts) on 2026-04-29 as part of AEO/GEO port.
//
// Returns shape compatible with `NarrativeClaimLite` from src/lib/schemas/buildTourSchemas.ts
// (id + pillar + core_claim subset). Full row also available for callers that need mechanism /
// evidence_hooks / nlp_variants / evidence_slugs / primary_page.
//
// 9 canonical narrative claims (C1–C9) wired to specific primary_page values per cluster_role_contracts.md.
import { prisma } from '@/lib/prisma';

/** Full narrative_claim row, mirrors rewrite's interface. mechanism/evidence_hooks/nlp_variants are jsonb in DB. */
export interface NarrativeClaim {
  id: string;
  pillar: string | null;
  core_claim: string | null;
  mechanism: unknown;
  evidence_hooks: unknown;
  nlp_variants: unknown;
  evidence_slugs: string[];
  primary_page: string | null;
}

/** Returns all narrative claims (C1–C9) ordered by id ascending. Cached at request level by Next 16 fetch cache. */
export async function getAllNarrativeClaims(): Promise<NarrativeClaim[]> {
  const rows = await prisma.narrative_claims.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      pillar: true,
      core_claim: true,
      mechanism: true,
      evidence_hooks: true,
      nlp_variants: true,
      evidence_slugs: true,
      primary_page: true,
    },
  });
  return rows as NarrativeClaim[];
}

/**
 * Returns narrative claims wired to a specific primary_page (e.g., '/verify-jvto', '/why-jvto/our-team').
 * Used per-cluster to render FAQPage schema from canonical claims.
 */
export async function getNarrativeClaimsByPage(page: string): Promise<NarrativeClaim[]> {
  const rows = await prisma.narrative_claims.findMany({
    where: { primary_page: page },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      pillar: true,
      core_claim: true,
      mechanism: true,
      evidence_hooks: true,
      nlp_variants: true,
      evidence_slugs: true,
      primary_page: true,
    },
  });
  return rows as NarrativeClaim[];
}

/**
 * Convenience helper: returns claims as plain {question, answer} pairs for FAQPage composition.
 * Filters out rows where pillar or core_claim is null.
 */
export async function getNarrativeClaimsAsFaq(): Promise<{ question: string; answer: string }[]> {
  const claims = await getAllNarrativeClaims();
  return claims
    .filter((c) => c.pillar && c.core_claim)
    .map((c) => ({ question: c.pillar as string, answer: c.core_claim as string }));
}
