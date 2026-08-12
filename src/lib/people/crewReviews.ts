/**
 * Featured crew review reader — the single DB-free accessor for
 * content/entities/crew-reviews.json (filtered + privacy-projected from the
 * jvto-ekosistem review-evidence pipeline; see the file's own sourceNote).
 * Only published crew (per canonicalPeople.ts) appear here; unpublished/legacy
 * crew mentions were dropped at extraction time, not filtered here.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

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

let cached: CrewReviewsFile | null = null;

function filePath(): string {
  return path.join(process.cwd(), "content", "entities", "crew-reviews.json");
}

function load(): CrewReviewsFile {
  if (cached) return cached;
  cached = JSON.parse(readFileSync(filePath(), "utf8"));
  return cached as CrewReviewsFile;
}

/** Featured reviews for one crew code, or [] if none recorded. */
export function getCrewFeaturedReviews(code: string): CrewFeaturedReview[] {
  const rec = load().crew.find((c) => c.code === code);
  return rec?.featuredReviews ?? [];
}
