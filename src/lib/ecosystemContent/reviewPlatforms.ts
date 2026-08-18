// src/lib/ecosystemContent/reviewPlatforms.ts
// Reads the canonical per-platform review record from jvto-ekosistem
// (1-knowledge-and-evidence-core/credentials-and-public-evidence/review-platforms.json),
// which that file declares as the SINGLE SOURCE OF TRUTH for the public
// platform totals (Trustpilot / Google Maps / TripAdvisor).
//
// Why this exists: src/lib/jvtoReviews.ts used to carry a hand-copied snapshot of
// those numbers (Trustpilot 44 / Google 138) which had drifted from the ekosistem
// record (Trustpilot 51 / Google 149). That module has been deleted; every
// per-platform figure on the site now reads through here, so the badges can never
// go stale again. The PRIMARY aggregate rating is Google-only, via
// getPublicAggregateRating() (which prefers getGoogleReviewStats() and falls back
// to the "Google Maps" profile below).
//
// Same local-first / HTTP-fallback pattern as ecosystemContent/people.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/review-platforms.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

export interface EcosystemReviewProfile {
  platform: string;
  rating: number | null;
  reviewCount: number | null;
  profileUrl: string;
  verifiedAt: string | null;
  isPrimary: boolean;
}

interface ReviewPlatformsRecord {
  profiles?: EcosystemReviewProfile[];
  average_rating?: number;
  lastReviewed?: string;
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<ReviewPlatformsRecord | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as ReviewPlatformsRecord;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<ReviewPlatformsRecord | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-review-platforms"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as ReviewPlatformsRecord;
  } catch {
    return null;
  }
}

/**
 * Per-platform public review profiles, or an empty array when the ekosistem
 * record is unreachable (callers render the strip without numbers rather than
 * showing a stale figure).
 */
export async function getEcosystemReviewProfiles(): Promise<
  EcosystemReviewProfile[]
> {
  const record = (await readLocal()) ?? (await fetchRemote());
  const profiles = record?.profiles;
  return Array.isArray(profiles) ? profiles : [];
}
