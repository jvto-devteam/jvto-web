// src/app/(api)/api/build-info/route.ts
//
// Deploy-verification endpoint (PACKAGE 05b, 2026-08-04). deploy.yml exports
// APP_COMMIT_SHA before `npm run build` and restarts PM2 with --update-env,
// then polls this endpoint and fails the workflow when the reported SHA does
// not match the pushed commit — closing the "green run but stale box" gap
// documented in CLAUDE.md (no health/version endpoint existed).
//
// Response is intentionally minimal: commit SHA + environment labels only.
// No secrets, no env dump, no request echo.
import { NextResponse } from "next/server";
import { BASE_URL, isIndexableDeployment } from "@/lib/site";

// Always evaluated at request time — the SHA must reflect the running
// process env, never a value frozen into a static render at build time.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      commitSha: process.env.APP_COMMIT_SHA ?? "unknown",
      environment: isIndexableDeployment() ? "production" : "preview",
      siteOrigin: BASE_URL,
      nodeEnv: process.env.NODE_ENV ?? "unknown",
    },
    {
      headers: {
        // Never cache: PM2/nginx/CDN layers must not serve a pre-deploy SHA.
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
