// src/lib/ecosystemContent/entityGraphFacts.ts
// Fetches the editorial fact values consumed by src/lib/schemas/entityGraph.ts's
// build*() functions — organization/founder/doctor/BBKSDA-regulation/DefinedTerm
// prose, dates, and credential names. Source of truth:
// jvto-ekosistem 1-knowledge-and-evidence-core/organization-identity/entity-graph-schema-facts.json
// Same local-sibling-directory-first / HTTP-fallback shape as
// @/lib/ecosystemContent/people (getEcosystemPeopleRecord) — kept as a
// separate module (not reusing people.ts's private helpers) since the two
// source files live in different ekosistem directories.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const ENTITY_GRAPH_FACTS_SOURCE_PATH =
  "1-knowledge-and-evidence-core/organization-identity/entity-graph-schema-facts.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal<T>(): Promise<T | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), ENTITY_GRAPH_FACTS_SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fetchRemote<T>(): Promise<T | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", ENTITY_GRAPH_FACTS_SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-entity-graph-facts"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as T;
  } catch {
    return null;
  }
}

/**
 * Raw entity-graph-schema-facts.json record from ekosistem. Local sibling-directory
 * read first (dev, same-server deploys), HTTP fetch to the ekosistem origin as
 * fallback. Returns null if neither source is reachable — callers merge over their
 * own FALLBACK_* constant in that case (see entityGraph.ts), so a page never breaks
 * if ekosistem is unreachable.
 */
export async function getEcosystemEntityGraphFacts<T>(): Promise<T | null> {
  const local = await readLocal<T>();
  if (local) return local;
  return fetchRemote<T>();
}
