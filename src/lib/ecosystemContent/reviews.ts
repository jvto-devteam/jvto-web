// src/lib/ecosystemContent/reviews.ts
// Reads the canonical historical review export from jvto-ekosistem
// (1-knowledge-and-evidence-core/credentials-and-public-evidence/reviews.json) —
// the single source of truth for review CONTENT (Google, Trustpilot, TripAdvisor)
// across all three platforms. The aggregate rating figure is a SEPARATE file
// (review-platforms.json, read via ecosystemContent/reviewPlatforms.ts) — do not
// conflate the two.
//
// IMPORTANT: `id` here is the Prisma `reviews.id` this record was exported from,
// preserved verbatim. It is baked into the public /why-jvto/reviews/{id} URL and
// into JSON-LD `#review-{id}` @id values elsewhere in the app — never renumber or
// regenerate it.
//
// Same local-first / HTTP-fallback pattern as ecosystemContent/reviewPlatforms.ts
// and people/crewReviews.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/reviews.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

export interface PublicReviewPhotoItem {
  id: string;
  type: "photo" | "video";
  thumbnailUrl: string | null;
  thumbnailLabel: string | null;
  videoUrl: string | null;
  source?: string | null;
}

export interface PublicReviewPhotos {
  source: string;
  syncedAt: string;
  count: number;
  items: PublicReviewPhotoItem[];
}

export interface PublicReview {
  id: number;
  platform: string;
  customerName: string;
  date: string;
  star: number;
  review: string;
  photos: PublicReviewPhotos | null;
  url: string | null;
  urlReference: string | null;
  packageSlug: string | null;
  packageName: string | null;
  crewCodes: string[];
}

interface ReviewsFile {
  nextId?: number;
  lastSynced?: string;
  googleSync?: string;
  reviews?: PublicReview[];
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<ReviewsFile | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    return JSON.parse(raw) as ReviewsFile;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<ReviewsFile | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-reviews"],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as ReviewsFile;
  } catch {
    return null;
  }
}

/** All historical reviews (Google, Trustpilot, TripAdvisor), or [] if ekosistem is unreachable. */
export async function getEcosystemReviews(): Promise<PublicReview[]> {
  const file = (await readLocal()) ?? (await fetchRemote());
  return Array.isArray(file?.reviews) ? file.reviews : [];
}

/** Single review by its (Prisma-origin, permanent) numeric id, or null if not found / unreachable. */
export async function getEcosystemReviewById(
  id: number,
): Promise<PublicReview | null> {
  const reviews = await getEcosystemReviews();
  return reviews.find((r) => r.id === id) ?? null;
}
