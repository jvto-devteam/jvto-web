import { cache } from "react";
import type { DestinationDetail } from "@/interfaces";
import destinationDetailSnapshotsJson from "./generated/destinationDetailSnapshots.json";
import { getDestinationDetailFromDatabase } from "./databaseDestinationDetail";
import {
  canUsePublishedSnapshotDatabaseFallback,
  logPublicContentOnce,
  parseOptionalDate,
} from "./runtime";
import type { PublicDestinationDetailSnapshotCollection } from "./types";

type SnapshotItem = PublicDestinationDetailSnapshotCollection["items"][number];

const destinationDetailSnapshots =
  destinationDetailSnapshotsJson as PublicDestinationDetailSnapshotCollection;

function findSnapshot(slug: string): SnapshotItem | null {
  return (
    destinationDetailSnapshots.items.find((item) => item.slug === slug) ?? null
  );
}

export function getPublicDestinationDetailSnapshotCollection() {
  return destinationDetailSnapshots;
}

export function getPublicDestinationDetailStaticParams() {
  return destinationDetailSnapshots.items.map((item) => ({ slug: item.slug }));
}

export function getPublicDestinationRoutesForSitemap() {
  return destinationDetailSnapshots.items.map((item) => ({
    slug: item.slug,
    updatedAt: parseOptionalDate(item.updatedAt),
  }));
}

export const getPublicDestinationDetail = cache(
  async (slug: string): Promise<DestinationDetail | null> => {
    const snapshot = findSnapshot(slug);

    if (snapshot) {
      return snapshot.payload;
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        `strict-missing-destination-detail:${slug}`,
        "error",
        `[publicContent] Missing destination detail snapshot for "${slug}" in strict mode.`,
      );
      return null;
    }

    try {
      const payload = await getDestinationDetailFromDatabase(slug);

      if (payload) {
        logPublicContentOnce(
          `database-fallback-destination-detail:${slug}`,
          "warn",
          `[publicContent] Using destinations database fallback for "${slug}". Generate a destination detail snapshot before production cutover.`,
        );
      }

      return payload;
    } catch (error) {
      logPublicContentOnce(
        `destination-detail-fallback-error:${slug}`,
        "error",
        `[publicContent] Failed destination detail fallback for "${slug}": ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  },
);
