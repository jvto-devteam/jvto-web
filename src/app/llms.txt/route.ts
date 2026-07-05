// /llms.txt — AI-crawler entity dossier, auto-generated from the synced JVTO Trust Bundle.
// Replaces the previously hand-maintained static public/llms.txt so the file stays in
// sync with llm-wiki content (regenerates at build on every Trust Bundle sync).

import { buildLlmsTxt } from "@/lib/llms-txt";

// Emit as a static asset at build time (no per-request work; crawler-friendly).
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
