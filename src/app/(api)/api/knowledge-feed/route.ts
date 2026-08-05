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
import { NextResponse } from "next/server";
import { getPublicKnowledgeManifest } from "@/lib/publicContent/publicKnowledge";

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
