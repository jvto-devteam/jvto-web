// src/lib/ecosystemContent/ijenCraterRequirements.ts
//
// Reads the mandatory-requirements table + FAQ shown by the shared
// TourRequirements component (rendered inline on tour package detail pages
// whenever pkg.route includes "Ijen Crater") from jvto-ekosistem's
// 1-knowledge-and-evidence-core/credentials-and-public-evidence/ijen-crater-tour-requirements.json.
// Same local-first / HTTP-fallback pattern as ecosystemContent/trustClaims.ts
// and ecosystemContent/reviewPlatforms.ts.
//
// TourRequirements.tsx has no props of its own and is rendered inside
// TourDetail.tsx, a Client Component — so this content is fetched server-side
// in the tour detail page.tsx files and drilled down through TourDetail into
// TourRequirements, the same way reviewProfiles is drilled into TrustBar.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;

const SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/ijen-crater-tour-requirements.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS,
);

export interface IjenRequirementRow {
  category: string;
  valueStrong: string;
  note: string;
}

export interface IjenRequirementFaqSegment {
  text: string;
  strong?: boolean;
}

export interface IjenRequirementFaqItem {
  question: string;
  answerSegments: IjenRequirementFaqSegment[];
}

export interface IjenCraterRequirementsContent {
  heading: string;
  intro: string;
  tableHeaders: { attribute: string; value: string };
  requirementsTable: IjenRequirementRow[];
  faqHeading: string;
  faqItems: IjenRequirementFaqItem[];
}

interface IjenCraterRequirementsRecord {
  pageContent?: Partial<IjenCraterRequirementsContent>;
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<IjenCraterRequirementsRecord | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as IjenCraterRequirementsRecord;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<IjenCraterRequirementsRecord | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-ijen-crater-tour-requirements"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as IjenCraterRequirementsRecord;
  } catch {
    return null;
  }
}

/**
 * The Ijen Crater mandatory-requirements table + FAQ pageContent, or null when
 * the ekosistem record is unreachable (caller falls back to its own FALLBACK
 * constant, matching the rest of this migration's pattern).
 */
export async function getEcosystemIjenCraterRequirements(): Promise<Partial<IjenCraterRequirementsContent> | null> {
  const record = (await readLocal()) ?? (await fetchRemote());
  return record?.pageContent ?? null;
}
