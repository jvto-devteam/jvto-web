// src/lib/ecosystemContent/externalEntities.ts
//
// Reads the third-party organization registry from jvto-ekosistem's
// 1-knowledge-and-evidence-core/organization-identity/external-entities.json,
// the SSOT for every non-JVTO organisation the schema graph references
// (press outlets, ministries, associations, the conservation authority).
//
// Why this exists: the graph refers to these entities by @id from many pages
// — memberOf, recognizedBy, publisher — but until 2026-08-21 nothing on the
// site actually *defined* them at those @ids, and /entity returned 404. A
// reference to an @id that resolves to nothing is a dangling node: it tells a
// crawler an entity exists without ever saying what it is. This reader backs
// the /entity hub page, which publishes one full definition per entity.
//
// Same local-read + HTTP-fallback two-tier pattern as trustClaims.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/organization-identity/external-entities.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

export type ExternalEntityRecord = {
  key: string;
  canonicalName: string;
  aliases?: string[];
  schemaType?: string;
  id: string;
  sameAs?: string[];
  role?: string[];
  definedOn?: string;
  /** "verified" | "candidate" — candidate means no URL could be confirmed. */
  evidenceStatus?: string;
  sourceNote?: string;
  description?: string;
};

type ExternalEntitiesRoot = {
  idBase?: string;
  lastReviewed?: string;
  note?: string;
  records?: ExternalEntityRecord[];
};

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<ExternalEntitiesRoot | null> {
  try {
    const raw = await readFile(path.join(ecosystemContentRoot(), SOURCE_PATH), "utf8");
    return JSON.parse(raw) as ExternalEntitiesRoot;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<ExternalEntitiesRoot | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-external-entities"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as ExternalEntitiesRoot;
  } catch {
    return null;
  }
}

/**
 * Every registered third-party organization, sorted by canonical name.
 *
 * Returns [] when ekosistem is unreachable — the /entity page then renders
 * its heading and nothing else, rather than inventing entity definitions.
 */
export async function getEcosystemExternalEntities(): Promise<ExternalEntityRecord[]> {
  const root = (await readLocal()) ?? (await fetchRemote());
  const records = root?.records ?? [];
  return [...records].sort((a, b) => a.canonicalName.localeCompare(b.canonicalName));
}
