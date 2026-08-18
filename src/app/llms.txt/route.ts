// /llms.txt — AI-crawler entity dossier.
// Ekosistem-only: see src/lib/llms-txt.ts for the degraded-response fallback
// used when jvto-ekosistem is unreachable.

import { buildLlmsTxt } from "@/lib/llms-txt";

export const revalidate = 60;
// Matches robots.ts, which allows every AI-training crawler (GPTBot, CCBot,
// ClaudeBot, Google-Extended, Bytespider, etc.) — ai-train=yes so the header
// doesn't contradict what the site actually permits. Owner decision 2026-08-18.
const CONTENT_SIGNAL = "search=yes,ai-train=yes,use=reference";

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Signal": CONTENT_SIGNAL,
    },
  });
}
