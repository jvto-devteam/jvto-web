// src/lib/ecosystemContent/tourSchemaOutput.ts
//
// Reads a tour-package PDP's pre-rendered TouristTrip + AggregateOffer (+
// per-day TouristTrip) nodes from jvto-ekosistem
// (5-experience-engine/json-ld/pages/<route>.schema-output.json).
//
// Same local-first / HTTP-fallback pattern as ecosystemContent/tourPackageDetail.ts
// and ecosystemContent/website.ts. New as of the schema-rendering consolidation
// (design spec 2026-08-20-ekosistem-schema-rendering-consolidation-design.md,
// Bagian 3): these 17 PDP routes had no pre-rendered ekosistem json-ld before —
// TouristTrip/Offer were previously built inline in this repo's page.tsx files.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_DIR = "5-experience-engine/json-ld/pages";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

function slugToFilename(slug: string): string {
  return `${slug.replace(/\//g, "__")}.schema-output.json`;
}

type EcosystemSchemaOutput = {
  schema_version: string;
  route: string;
  domain: string;
  slug: string;
  json_ld: { "@context": string; "@graph": Record<string, unknown>[] };
};

async function readLocal(slug: string): Promise<EcosystemSchemaOutput | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_DIR, slugToFilename(slug)),
      "utf8",
    );
    return JSON.parse(raw) as EcosystemSchemaOutput;
  } catch {
    return null;
  }
}

async function fetchRemote(slug: string): Promise<EcosystemSchemaOutput | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", `${SOURCE_DIR}/${slugToFilename(slug)}`);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", `jvto-ekosistem-tour-schema-${slug}`],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as EcosystemSchemaOutput;
  } catch {
    return null;
  }
}

/**
 * Pre-rendered Organization + TouristTrip (+ per-day TouristTrip) +
 * AggregateOffer nodes for one tour-package PDP.
 *
 * Returns null (not []) on any read failure so callers can render the page
 * without these nodes rather than fail the whole build — see design spec
 * Error handling: for this page, that means Product.offers (built locally,
 * unaffected by this reader) becomes a dangling @id reference in that
 * request's HTML rather than the page failing outright. Accepted tradeoff,
 * not additionally engineered around here.
 *
 * The Organization node in the returned array is a full definition (same
 * shared buildOrganizationNode() every other ekosistem page uses) and will
 * duplicate-by-@id against this page's own toOrganizationReferenceOnly()
 * stub already in `globalNodes` — normalizeJsonLd() (src/lib/seo/jsonld/normalize.ts)
 * dedupes by @id keeping the FIRST occurrence, and globalNodes is always
 * spread before this array's nodes in <JsonLd data={[...]}>, so the existing
 * page-local reference wins and the ekosistem duplicate is silently dropped.
 * No special-casing needed here — this is by design, not a bug to fix later.
 */
export async function getEcosystemTourSchemaNodes(
  slug: string,
): Promise<Record<string, unknown>[] | null> {
  const output = (await readLocal(slug)) ?? (await fetchRemote(slug));
  if (!output?.json_ld?.["@graph"]) return null;
  return output.json_ld["@graph"];
}
