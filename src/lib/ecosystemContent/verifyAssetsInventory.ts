// src/lib/ecosystemContent/verifyAssetsInventory.ts
//
// Fetches the verify-jvto evidence-locker dataset from jvto-ekosistem
// (1-knowledge-and-evidence-core/credentials-and-public-evidence/verify-jvto-assets-inventory.json)
// — organization_profile, verification_credentials, and assets_inventory used to
// build the JSON-LD asset/credential graph on /verify-jvto. Same local-first /
// HTTP-fallback pattern as ecosystemContent/destinationDetail.ts.
//
// Replaces src/lib/Master_Dataset_JVTO.SSOT.v3.0.json (a pre-migration Prisma-era
// static import) as part of the single-content-source (ekosistem-only)
// consolidation. No live sync exists between the two by design: edits go
// directly into the ekosistem source going forward.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/verify-jvto-assets-inventory.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

export interface VerifyAssetsInventory {
  organization_profile: Record<string, any>;
  verification_credentials: Array<Record<string, any>>;
  assets_inventory: Array<Record<string, any>>;
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<VerifyAssetsInventory | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as VerifyAssetsInventory;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<VerifyAssetsInventory | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-verify-assets"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as VerifyAssetsInventory;
  } catch {
    return null;
  }
}

/** Full verify-jvto evidence dataset, or null when the ekosistem record is unreachable. */
export async function getEcosystemVerifyAssetsInventory(): Promise<VerifyAssetsInventory | null> {
  return (await readLocal()) ?? (await fetchRemote());
}
