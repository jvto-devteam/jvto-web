// src/lib/people/crewReviews.ts
// Featured crew review reader — reads jvto-ekosistem
// (1-knowledge-and-evidence-core/people-and-crew/crew-reviews.json), filtered +
// privacy-projected from the review-evidence pipeline. Only published crew
// (per canonicalPeople.ts) appear here; unpublished/legacy crew mentions were
// dropped at extraction time, not filtered here.
//
// Migrated 2026-08-19: was a static local file (content/entities/crew-reviews.json,
// readFileSync, "lastSynced 2026-08-07") — moved into ekosistem and switched to the
// same local-first / HTTP-fallback pattern as the rest of ecosystemContent/*.ts, so
// it can no longer silently drift from the ekosistem source.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/people-and-crew/crew-reviews.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

export interface CrewReviewMedia {
  id: string;
  type: "photo" | "video";
  thumbnailUrl: string | null;
  thumbnailLabel: string | null;
  videoUrl: string | null;
}

export interface CrewFeaturedReview {
  reviewId: string;
  reviewerName: string;
  date: string;
  star: number;
  reviewExcerpt: string;
  originalReviewUrl: string | null;
  package: { name: string; slug: string } | null;
  media: CrewReviewMedia[];
}

interface CrewReviewsRecord {
  code: string;
  crewName: string;
  crewType: string;
  featuredReviews: CrewFeaturedReview[];
}

interface CrewReviewsFile {
  id: string;
  lastSynced: string;
  crew: CrewReviewsRecord[];
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<CrewReviewsFile | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as CrewReviewsFile;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<CrewReviewsFile | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-crew-reviews"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as CrewReviewsFile;
  } catch {
    return null;
  }
}

/** Featured reviews for one crew code, or [] if none recorded / ekosistem unreachable. */
export async function getCrewFeaturedReviews(
  code: string,
): Promise<CrewFeaturedReview[]> {
  const file = (await readLocal()) ?? (await fetchRemote());
  const rec = file?.crew.find((c) => c.code === code);
  return rec?.featuredReviews ?? [];
}
