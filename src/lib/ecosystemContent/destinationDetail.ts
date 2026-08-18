// src/lib/ecosystemContent/destinationDetail.ts
//
// Fetches a destination-detail record from jvto-ekosistem
// (1-knowledge-and-evidence-core/destination-knowledge/<slug>.content.json) — full field
// parity with the DestinationDetail interface, a 1:1 copy from the live Prisma
// `destinations` row as of 2026-08-18. Same local-first / HTTP-fallback pattern
// as ecosystemContent/reviewPlatforms.ts and ecosystemContent/people.ts.
//
// Replaces src/lib/publicContent/databaseDestinationDetail.ts (Prisma-backed) as
// part of the single-content-source (ekosistem-only) consolidation — destination
// editorial content now has exactly one canonical home. No live sync exists
// between Prisma and this file by design (owner decision 2026-08-18): edits go
// directly into the ekosistem source going forward.
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DestinationDetail } from "@/interfaces";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_DIR = "1-knowledge-and-evidence-core/destination-knowledge";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(slug: string): Promise<DestinationDetail | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_DIR, `${slug}.content.json`),
      "utf8",
    );
    return JSON.parse(raw) as DestinationDetail;
  } catch {
    return null;
  }
}

async function fetchRemote(slug: string): Promise<DestinationDetail | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", `${SOURCE_DIR}/${slug}.content.json`);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", `jvto-ekosistem-destination-${slug}`],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as DestinationDetail;
  } catch {
    return null;
  }
}

/**
 * Full destination-detail record, or null when the ekosistem record is
 * unreachable (caller renders notFound() rather than a stale/fabricated page).
 */
export async function getEcosystemDestinationDetail(
  slug: string,
): Promise<DestinationDetail | null> {
  return (await readLocal(slug)) ?? (await fetchRemote(slug));
}

const KNOWN_SLUGS = [
  "mount-bromo",
  "ijen-crater",
  "madakaripura-waterfall",
  "tumpak-sewu-waterfall",
  "papuma-beach",
] as const;

/** Published destination-detail routes for generateStaticParams/sitemap. */
export async function getEcosystemDestinationRoutes(): Promise<
  Array<{ slug: string }>
> {
  return KNOWN_SLUGS.map((slug) => ({ slug }));
}
