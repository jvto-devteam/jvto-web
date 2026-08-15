// src/lib/ecosystemContent/verifyEvidence.ts
//
// Merges the verify-jvto document-gallery presentation metadata
// (1-knowledge-and-evidence-core/credentials-and-public-evidence/verify-jvto-ssot.json —
// slug/filename/caption/preview/category/is_show only) with the hash/fact fields that
// live in organization.json's hasCredential[] (NIB, TDUP, HPWKI) and people.json's
// leadership[0].hasCredential[] (SPRIN POLPAR, SPRIN WAL-TRAVEL) into the same Doc[]
// shape data-loader.ts previously produced from the retired
// src/lib/Master_Dataset_JVTO.SSOT.v3.0.json. Same local-read + HTTP-fallback two-tier
// pattern as ecosystemContent/people.ts (getEcosystemPeopleRecord) and
// ecosystemContent/blog.ts.
//
// MERGE KEY: filenames are matched case-insensitively after stripping a known
// image/document extension and a trailing "-preview" suffix — e.g.
// "NIB-1102230032918-preview.webp" and "NIB-1102230032918.pdf" both normalize to
// "nib-1102230032918". This is necessary because organization.json's/people.json's
// hasCredential[].documentUrl always points at the *source* document (the raw PDF, or —
// for SPRIN WAL-TRAVEL specifically — a .webp scan with no "-preview" in its own
// filename), while the visible (is_show: true) gallery entry is a separate "-preview"
// asset for NIB/TDUP/HPWKI but shares the SPRIN documents' exact basename otherwise.
// Verified against verify-jvto-ssot.json's own reconciliation_summary — all 5
// cross-referenced hashes (fa20dde3… NIB, 27252d51… TDUP, ca1fb1a4… HPWKI, 03c8578d…
// SPRIN POLPAR, 179b061e… SPRIN WAL-TRAVEL) resolve to exactly one hasCredential match
// each under this normalization, no ambiguity.
//
// FIELDS NOT RECONSTRUCTABLE FROM THESE THREE SOURCES (documented, not fabricated —
// see task-3.2 report for the full writeup):
//   - size_mb: no size data exists in any of the three sources for any of the 44
//     documents (the old Master_Dataset carried size_mb/size_bytes; the new sources do
//     not). Falls back to 0, matching data-loader.ts's own prior "unknown size" fallback.
//   - official_title / narrative_context: the old "GEO" narrative prose
//     (geo_narrative/narrative, keyed by evidence_asset_slugs) lived only in the retired
//     Master_Dataset's verification_credentials[] array, which has no equivalent in any
//     of the three current sources — verify-jvto-ssot.json's documents[] carry only
//     `caption`. official_title falls back to the matched hasCredential[].name (a real
//     fact) when a hash match exists, else the presentation caption; narrative_context
//     always uses the presentation caption. Every consumer (schema.ts's ItemList,
//     verify-jvto/page.tsx's PROOF_CARDS via VerifyProofGrid) already had a
//     `|| doc.caption` fallback for both fields, so this is a content simplification on
//     the live hub page's visible card copy, not a functional break.
//   - external_validation_url: no per-document registry URL exists in the new sources
//     (organization.json's identifiers[] carry no URLs; sameAs[] is org-level, not
//     matchable to a specific document). Left undefined — Doc.external_validation_url is
//     optional and, per a repo-wide grep, currently has no reader.
//   - sha256 / url / last_verified: only populated for the 5 documents with a matched
//     hasCredential fact (url = that credential's real documentUrl; last_verified = the
//     source file's own `lastReviewed` date). All other 39 documents get
//     sha256: undefined (Doc.sha256 is optional) and url = the absolute production URL of
//     that same preview asset — matching the pattern observed in the retired
//     Master_Dataset, where `file_url` for every photo/press/history asset was always
//     exactly the absolute-URL form of that asset's own `preview` path (for non-document
//     image assets, the preview image *is* the file). last_verified for these falls back
//     to "2025-01-01", the exact same literal fallback data-loader.ts used previously.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getVerifyJvtoOptimizedImageSrc } from "../assets/verifyJvtoImageVariants";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SITE_BASE_URL = "https://javavolcano-touroperator.com";

const PRESENTATION_SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/verify-jvto-ssot.json";
const ORGANIZATION_SOURCE_PATH =
  "1-knowledge-and-evidence-core/organization-identity/organization.json";
const PEOPLE_SOURCE_PATH = "1-knowledge-and-evidence-core/people-and-crew/people.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

/** Same shape data-loader.ts previously exported — unchanged so downstream consumers
 *  (schema.ts, the 5 verify-jvto page files) require no type changes. */
export type Doc = {
  filename: string;
  caption: string;
  alt_text?: string;
  url: string; // file asli
  size_mb: number;
  last_verified: string;
  sha256?: string;
  category: string;
  preview?: { url: string; format: string }; // thumbnail
  external_validation_url?: string;

  // Field Khusus GEO
  official_title: string;
  narrative_context: string;
  slug?: string;
};

type PresentationDocument = {
  slug: string;
  filename: string;
  caption: string;
  preview: string;
  category: string;
  is_show: boolean;
};

type PresentationRoot = {
  documents?: PresentationDocument[];
};

type OrganizationCredential = {
  name: string;
  dateIssued?: string;
  sha256?: string;
  documentUrl?: string;
  credentialCategory?: string;
  recognizedBy?: string;
};

type OrganizationRoot = {
  hasCredential?: OrganizationCredential[];
  lastReviewed?: string;
};

type PeopleCredential = {
  name: string;
  dateIssued?: string;
  sha256?: string;
  documentUrl?: string;
  credentialCategory?: string;
  recognizedBy?: string;
};

type PeopleRoot = {
  leadership?: Array<{ hasCredential?: PeopleCredential[] }>;
  lastReviewed?: string;
};

type HashFact = {
  name: string;
  sha256: string;
  documentUrl: string;
  dateIssued?: string;
  lastReviewed?: string;
};

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal<T>(sourcePath: string): Promise<T | null> {
  try {
    const raw = await readFile(path.join(ecosystemContentRoot(), sourcePath), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fetchRemote<T>(sourcePath: string, tag: string): Promise<T | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", sourcePath);

    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["jvto-ekosistem-content", tag] },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as T;
  } catch {
    return null;
  }
}

async function readSource<T>(sourcePath: string, tag: string): Promise<T | null> {
  const local = await readLocal<T>(sourcePath);
  if (local) return local;
  return fetchRemote<T>(sourcePath, tag);
}

/** Strips a known image/document extension and a trailing "-preview" suffix so that
 *  e.g. "NIB-1102230032918-preview.webp" and "NIB-1102230032918.pdf" both normalize to
 *  "nib-1102230032918" for cross-file matching (see module doc comment). */
function normalizeFilenameKey(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\.(pdf|webp|png|jpe?g)$/i, "")
    .replace(/-preview$/i, "");
}

function basename(urlOrPath: string): string {
  const clean = urlOrPath.split("?")[0]?.split("#")[0] ?? urlOrPath;
  const segments = clean.split("/");
  return segments[segments.length - 1] || clean;
}

async function buildHashFactsByKey(): Promise<Map<string, HashFact>> {
  const [organization, people] = await Promise.all([
    readSource<OrganizationRoot>(ORGANIZATION_SOURCE_PATH, "jvto-ekosistem-organization"),
    readSource<PeopleRoot>(PEOPLE_SOURCE_PATH, "jvto-ekosistem-people"),
  ]);

  const map = new Map<string, HashFact>();

  for (const cred of organization?.hasCredential ?? []) {
    if (!cred.documentUrl || !cred.sha256) continue;
    map.set(normalizeFilenameKey(basename(cred.documentUrl)), {
      name: cred.name,
      sha256: cred.sha256,
      documentUrl: cred.documentUrl,
      dateIssued: cred.dateIssued,
      lastReviewed: organization?.lastReviewed,
    });
  }

  for (const leader of people?.leadership ?? []) {
    for (const cred of leader.hasCredential ?? []) {
      if (!cred.documentUrl || !cred.sha256) continue;
      map.set(normalizeFilenameKey(basename(cred.documentUrl)), {
        name: cred.name,
        sha256: cred.sha256,
        documentUrl: cred.documentUrl,
        dateIssued: cred.dateIssued,
        lastReviewed: people?.lastReviewed,
      });
    }
  }

  return map;
}

function toAbsoluteUrl(relativeOrAbsolute: string): string {
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute;
  return `${SITE_BASE_URL}${relativeOrAbsolute.startsWith("/") ? "" : "/"}${relativeOrAbsolute}`;
}

function toDoc(entry: PresentationDocument, hashFact: HashFact | undefined): Doc {
  let preview: Doc["preview"];
  if (entry.preview) {
    const formatMatch = entry.preview.match(/\.(webp|png|jpe?g)$/i);
    const format = formatMatch ? formatMatch[1].toUpperCase() : "IMAGE";
    preview = { url: getVerifyJvtoOptimizedImageSrc(entry.preview), format };
  }

  return {
    filename: entry.filename,
    caption: entry.caption,
    alt_text: entry.caption,
    url: hashFact ? hashFact.documentUrl : toAbsoluteUrl(entry.preview),
    size_mb: 0,
    last_verified: hashFact?.lastReviewed ?? hashFact?.dateIssued ?? "2025-01-01",
    sha256: hashFact?.sha256,
    category: entry.category,
    preview,
    external_validation_url: undefined,
    official_title: hashFact?.name ?? entry.caption,
    narrative_context: entry.caption,
    slug: entry.slug,
  };
}

/**
 * Merged Doc[] for the /verify-jvto document gallery: presentation metadata from
 * verify-jvto-ssot.json (caption/preview/category/is_show) plus hash facts (sha256/
 * documentUrl) from organization.json's hasCredential[] and people.json's
 * leadership[0].hasCredential[] where a matching document exists. Only is_show: true
 * entries are returned, matching data-loader.ts's prior filtering behavior. Returns []
 * if the presentation source is unreachable (local read and HTTP fallback both fail) —
 * callers (data-loader.ts) propagate that as an empty Doc[], same as an empty
 * assets_inventory did previously.
 */
export async function getEcosystemVerifyEvidenceDocs(): Promise<Doc[]> {
  const [presentation, hashFactsByKey] = await Promise.all([
    readSource<PresentationRoot>(
      PRESENTATION_SOURCE_PATH,
      "jvto-ekosistem-verify-evidence",
    ),
    buildHashFactsByKey(),
  ]);

  const documents = presentation?.documents ?? [];

  return documents
    .filter((entry) => entry.is_show === true)
    .map((entry) =>
      toDoc(entry, hashFactsByKey.get(normalizeFilenameKey(entry.filename))),
    );
}
