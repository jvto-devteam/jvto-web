// src/lib/ecosystemContent/people.ts
// Fetches the canonical people/crew record from jvto-ekosistem — the same
// file (1-knowledge-and-evidence-core/people-and-crew/people.json) used to
// build the Person schema nodes in json-ld/pages output. Replaces the local
// copy that used to live at content/entities/people.json in this repo, so
// there is exactly one place crew/leadership data is edited.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const PEOPLE_SOURCE_PATH = "1-knowledge-and-evidence-core/people-and-crew/people.json";

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
      path.join(ecosystemContentRoot(), PEOPLE_SOURCE_PATH),
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
    url.searchParams.set("path", PEOPLE_SOURCE_PATH);

    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["jvto-ekosistem-content", "jvto-ekosistem-people"] },
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
 * Raw canonical people record from ekosistem. Local sibling-directory read
 * first (dev, same-server deploys), HTTP fetch to the ekosistem origin as
 * fallback. Returns null if neither source is reachable — callers decide
 * how to handle that (canonicalPeople.ts throws, matching its previous
 * readFileSync-or-throw behavior).
 */
export async function getEcosystemPeopleRecord<T>(): Promise<T | null> {
  const local = await readLocal<T>();
  if (local) return local;
  return fetchRemote<T>();
}
