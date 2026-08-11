import { cache } from "react";
import type { TourPackageDetail } from "@/interfaces";
import { routeSlugToParam } from "@/lib/routing/staticParams";
import packageDetailSnapshotsJson from "./generated/packageDetailSnapshots.json";
import { getPackageDetailFromDatabase } from "./databasePackageDetail";
import {
  canUsePublishedSnapshotDatabaseFallback,
  logPublicContentOnce,
  normalizeRouteSlug,
  parseOptionalDate,
} from "./runtime";
import type { PublicPackageDetailSnapshotCollection } from "./types";

type SnapshotItem = PublicPackageDetailSnapshotCollection["items"][number];

const packageDetailSnapshots =
  packageDetailSnapshotsJson as unknown as PublicPackageDetailSnapshotCollection;

function matchesFilters(
  item: SnapshotItem,
  options?: {
    prefix?: string;
    fromId?: number;
    categoryId?: number;
  },
) {
  if (options?.prefix) {
    const normalizedPrefix = normalizeRouteSlug(options.prefix);
    if (!normalizeRouteSlug(item.slug).startsWith(`${normalizedPrefix}/`)) {
      return false;
    }
  }

  if (
    typeof options?.fromId === "number" &&
    item.snapshotMeta?.startDestinationId !== options.fromId
  ) {
    return false;
  }

  if (
    typeof options?.categoryId === "number" &&
    item.snapshotMeta?.packageCategoryId !== options.categoryId
  ) {
    return false;
  }

  return true;
}

function findSnapshot(fullSlug: string): SnapshotItem | null {
  const normalizedSlug = normalizeRouteSlug(fullSlug);
  return (
    packageDetailSnapshots.items.find(
      (item) => normalizeRouteSlug(item.slug) === normalizedSlug,
    ) ?? null
  );
}

export function getPublicPackageDetailSnapshotCollection() {
  return packageDetailSnapshots;
}

export function getPublicPackageDetailStaticParams(
  prefix: string,
  options?: {
    fromId?: number;
    categoryId?: number;
  },
) {
  return packageDetailSnapshots.items
    .filter((item) => matchesFilters(item, { ...options, prefix }))
    .map((item) => routeSlugToParam(item.slug, prefix))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export function getPublicPackageRoutesForSitemap(options?: {
  prefix?: string;
  fromId?: number;
  categoryId?: number;
}) {
  return packageDetailSnapshots.items
    .filter((item) => matchesFilters(item, options))
    .map((item) => ({
      slug: item.slug,
      updatedAt: parseOptionalDate(item.updatedAt),
    }));
}

export const getPublicPackageDetail = cache(
  async (fullSlug: string): Promise<TourPackageDetail | null> => {
    const snapshot = findSnapshot(fullSlug);

    if (snapshot) {
      return snapshot.payload;
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        `strict-missing-package-detail:${fullSlug}`,
        "error",
        `[publicContent] Missing package detail snapshot for "${fullSlug}" in strict mode.`,
      );
      return null;
    }

    try {
      const payload = await getPackageDetailFromDatabase(fullSlug);

      if (payload) {
        logPublicContentOnce(
          `database-fallback-package-detail:${fullSlug}`,
          "warn",
          `[publicContent] Using packages database fallback for "${fullSlug}". Generate a package detail snapshot before production cutover.`,
        );
      }

      return payload;
    } catch (error) {
      logPublicContentOnce(
        `package-detail-fallback-error:${fullSlug}`,
        "error",
        `[publicContent] Failed package detail fallback for "${fullSlug}": ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  },
);
