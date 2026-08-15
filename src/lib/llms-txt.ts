// /llms.txt is ekosistem-only. There is no local reconstruction fallback:
// production reads ekosistem via HTTP (getEcosystemLlmsTxt below), so a local
// Trust Bundle "fallback" would fail identically to the primary path during a
// real ekosistem outage — it provided zero actual resilience, just dead-weight
// duplicate code (same ekosistem/DB-only, source-unreachable-means-it-degrades
// pattern as Part 4's packages/destinations migration). On failure this
// degrades to a short, honestly-labeled plain-text notice instead of throwing
// an unhandled exception in the route handler or fabricating the full dossier.

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";

function ecosystemBaseUrl() {
  return (
    process.env.JVTO_ECOSYSTEM_BASE_URL ||
    process.env.NEXT_PUBLIC_ECOSYSTEM_BASE_URL ||
    DEFAULT_ECOSYSTEM_BASE_URL
  ).replace(/\/+$/, "");
}

async function getEcosystemLlmsTxt() {
  try {
    const response = await fetch(`${ecosystemBaseUrl()}/llms.txt`, {
      headers: { accept: "text/plain" },
      next: { revalidate: 60, tags: ["ecosystem-llms"] },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/plain")) return null;

    const body = await response.text();
    return body.trim() ? `${body.trim()}\n` : null;
  } catch (error) {
    console.error(
      `[llms.txt] Failed to fetch ekosistem llms.txt: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

// Deliberately minimal: no claim/number/hash that could go stale, and no
// pretense of being the full entity dossier — just an honest notice plus a
// pointer to the human-facing site so a crawler hitting this during an
// ekosistem outage still gets something useful.
const DEGRADED_LLMS_TXT =
  "# Java Volcano Tour Operator (JVTO)\n" +
  "> This machine-readable entity dossier is temporarily unavailable — the " +
  "primary source (jvto-ekosistem) could not be reached. Please visit " +
  "https://javavolcano-touroperator.com/ for current information, or retry " +
  "this endpoint shortly.\n";

export async function buildLlmsTxt(): Promise<string> {
  return (await getEcosystemLlmsTxt()) ?? DEGRADED_LLMS_TXT;
}
