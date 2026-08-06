// src/app/(api)/api/knowledge-feed/route.ts
//
// Public Knowledge Feed (Milestone 2, handoff §16). A machine-readable projection of
// the `content/` Git SSOT — served from the compiled manifest
// (src/lib/publicContent/generated/public-knowledge.json, produced by
// scripts/compile-public-knowledge.ts). Every migrated public route with its canonical
// URL, metadata, declared schema types, and FAQ linkage.
//
// It records the EXACT SOURCE COMMIT of the running deployment: `sourceCommit` comes
// from APP_COMMIT_SHA (set by deploy.yml before the build and verified to equal the
// pushed commit), and `contentDigest` is the stable SHA-256 baked into the manifest.
// Together they let a consumer pin exactly which content commit produced the feed.
//
// No secrets, no env dump, no request echo.
//
// People projection: served ONLY through the canonical people reader
// (src/lib/people/canonicalPeople.ts), which is allowlist-projected and excludes
// crew.unpublished by construction — so yusuf/dika/pras and any doNotPublish field
// (evidence, reviewedDate, namingRule, …) can never reach the feed.
import { NextResponse } from "next/server";
import { getPublicKnowledgeManifest } from "@/lib/publicContent/publicKnowledge";
import {
  getPublicCrew,
  getCrewCounts,
  getPublicLeadership,
  getPublicMedicalPartner,
} from "@/lib/people/canonicalPeople";

/**
 * Public-crew-only projection for the feed: the minimal, already-allowlisted subset
 * (crew code/name/role, counts, leadership names+roles, medical partner name+jobTitle+role).
 * Reads exclusively via the canonical people accessors, so unpublished crew and any
 * doNotPublish field are structurally absent.
 */
function buildPeopleProjection() {
  const counts = getCrewCounts();
  const leadership = getPublicLeadership();
  const medical = getPublicMedicalPartner();
  return {
    crew: {
      counts,
      members: getPublicCrew().map((m) => ({ code: m.code, name: m.name, role: m.role })),
    },
    leadership: leadership.map((l) => ({ name: l.name, roles: l.roles ?? [] })),
    medicalPartner: medical?.name
      ? { name: medical.name, jobTitle: medical.jobTitle ?? null, role: medical.role ?? null }
      : null,
  };
}

// Evaluated at request time so `sourceCommit` reflects the running process env, never a
// value frozen into a static render at build time (same contract as /api/build-info).
export const dynamic = "force-dynamic";

export function GET() {
  const manifest = getPublicKnowledgeManifest();
  return NextResponse.json(
    {
      schemaVersion: manifest.schemaVersion,
      // Exact source commit of the deployed content (verified == pushed SHA by deploy.yml).
      sourceCommit: process.env.APP_COMMIT_SHA ?? "unknown",
      // Stable integrity digest of the compiled content itself (deploy-independent).
      contentDigest: manifest.contentDigest,
      generatedFrom: "content/ (Git SSOT via scripts/compile-public-knowledge.ts)",
      productionOrigin: manifest.productionOrigin,
      routeCount: manifest.counts.routes,
      entities: manifest.entities,
      // People trust graph — public crew only (unpublished + doNotPublish structurally absent).
      people: buildPeopleProjection(),
      routes: manifest.routes.map((r) => ({
        route: r.route,
        canonicalUrl: r.canonicalUrl,
        section: r.section,
        title: r.title,
        description: r.description,
        schemaTypes: r.schemaTypes,
        faqKey: r.faqKey,
        lastReviewed: r.lastReviewed,
      })),
    },
    {
      headers: {
        // Never cache a pre-deploy SHA across the PM2/nginx/CDN layers.
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
