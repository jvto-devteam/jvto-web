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

/**
 * How many published reviews name this crew member.
 *
 * Derived from the review corpus rather than read from people.json, whose
 * googleReviewMentions figure is deliberately excluded by the public field
 * allowlist. This counts only what is already published, so it adds no new
 * disclosure — it just stops the site sitting on a quantified fact
 * (723 crew-name mentions across the corpus) while its crew pages remain the
 * shortest on the site (T-10, 2026-08-20 audit).
 */
export async function countReviewsNamingCrew(code: string): Promise<number> {
  return (await getReviewsNamingCrew(code)).length;
}

/**
 * Every published review naming this crew member, newest first.
 *
 * The crew pages showed only the 2-5 "featured" reviews held in
 * crew-featured-review-evidence.json, which left most of the corpus unused:
 * Yandi is named in 10 reviews and three of them were on the page. These are
 * already published verbatim at /why-jvto/reviews/{id}, so surfacing them on
 * the profile adds no new disclosure — it just stops the site's most-praised
 * asset sitting behind a page nobody reaches.
 */
export async function getReviewsNamingCrew(code: string): Promise<PublicReview[]> {
  const reviews = await getEcosystemReviews();
  return reviews
    .filter((review) => (review.crewCodes ?? []).includes(code))
    .filter((review) => (review.review ?? "").trim().length > 0)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
