// /llms.txt — AI-crawler entity dossier.
// Ekosistem-only: see src/lib/llms-txt.ts for the degraded-response fallback
// used when jvto-ekosistem is unreachable.

import { buildLlmsTxt } from "@/lib/llms-txt";

export const revalidate = 60;
const CONTENT_SIGNAL = "search=yes,ai-train=no,use=reference";

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Signal": CONTENT_SIGNAL,
    },
  });
}
