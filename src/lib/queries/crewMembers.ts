// src/lib/queries/crewMembers.ts — Prisma helper for active crew members.
// Created 2026-04-29 (AEO/GEO port Phase 4.5) — feeds buildCrewPersonSchema()
// for /why-jvto/our-team Person schema injection per cluster_role_contracts.md Cluster 3.
import { prisma } from '@/lib/prisma';
import { NAMED_GUIDE_PERSONAS } from '@/lib/schemas/buildCrewSchemas';
import { CREW_CREDENTIALS_BY_CODE } from '@/lib/imageAssets';

export interface ActiveCrewMember {
  code: string;
  name: string;
  type: string;
  photoUrl: string | null;
  socialInstagram?: string;
  socialFacebook?: string;
  ktaId?: string;
  ktaCardUrl?: string;
}

// KTA identifier lookup keyed by crew_members.code, sourced from OKF
// curation/approved/people.yaml (credential_state: confirmed). There is no
// kta_id column on crew_members in jvto_dev today — adding one requires a DB
// migration this environment can't perform (no DATABASE_URL/.env present).
// Until that migration lands, enrich DB rows in-process from the hardcoded
// NAMED_GUIDE_PERSONAS data instead of leaving hasCredential.identifier empty.
const KTA_ID_BY_CODE: Record<string, string> = Object.fromEntries(
  NAMED_GUIDE_PERSONAS.filter((p) => p.ktaId).map((p) => [p.code, p.ktaId as string]),
);

/**
 * Returns active crew (deleted_at IS NULL) shaped for `buildCrewPersonSchema()`.
 * Filters out rows missing a code (which is required as Person @id stable suffix).
 */
export async function getActiveCrewMembers(): Promise<ActiveCrewMember[]> {
  const rows = await prisma.crew_members.findMany({
    where: { deleted_at: null, code: { not: null } },
    orderBy: { id: 'asc' },
    select: {
      code: true,
      name: true,
      type: true,
      photo_url: true,
      instagram_url: true,
      facebook_url: true,
    },
  });

  return rows
    .filter((r) => r.code && r.name)
    .map((r) => ({
      code: r.code as string,
      name: r.name,
      type: r.type ?? 'crew',
      photoUrl: r.photo_url,
      ...(r.instagram_url ? { socialInstagram: r.instagram_url } : {}),
      ...(r.facebook_url ? { socialFacebook: r.facebook_url } : {}),
      ...(KTA_ID_BY_CODE[r.code as string] ? { ktaId: KTA_ID_BY_CODE[r.code as string] } : {}),
      ...(CREW_CREDENTIALS_BY_CODE[r.code as string]
        ? { ktaCardUrl: CREW_CREDENTIALS_BY_CODE[r.code as string].url }
        : {}),
    }));
}
