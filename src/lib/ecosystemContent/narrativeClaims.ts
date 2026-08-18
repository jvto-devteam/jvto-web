// src/lib/ecosystemContent/narrativeClaims.ts
//
// Fetches the full narrative-claims set from jvto-ekosistem
// (1-knowledge-and-evidence-core/narrative-claims/narrative-claims.json) — 26 canonical
// brand/policy claims (C1-C9 + POL-BPC-*/POL-IE-*), full body (core_claim, mechanism,
// evidence_hooks, nlp_variants, evidence_slugs, primary_page). Same local-first /
// HTTP-fallback pattern as ecosystemContent/destinationDetail.ts.
//
// Replaces src/lib/queries/narrativeClaims.ts (Prisma-backed) as part of the
// single-content-source (ekosistem-only) consolidation. No live sync exists between
// Prisma and this file by design: edits go directly into the ekosistem source going
// forward.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/narrative-claims/narrative-claims.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

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

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<NarrativeClaim[] | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    const parsed = JSON.parse(raw) as { claims?: NarrativeClaim[] };
    return parsed.claims ?? null;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<NarrativeClaim[] | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-narrative-claims"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    const parsed = JSON.parse(body.content) as { claims?: NarrativeClaim[] };
    return parsed.claims ?? null;
  } catch {
    return null;
  }
}

/** All 26 narrative claims, or [] when the ekosistem record is unreachable. */
export async function getEcosystemNarrativeClaims(): Promise<
  NarrativeClaim[]
> {
  return (await readLocal()) ?? (await fetchRemote()) ?? [];
}
