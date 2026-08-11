import type { ListTourPackage } from "@/types";
import packageListSnapshotJson from "./generated/packageListSnapshot.json";
import type { PublicPackageListSnapshot } from "./types";

type SnapshotTour = PublicPackageListSnapshot["items"][number];

const packageListSnapshot =
  packageListSnapshotJson as PublicPackageListSnapshot;

function stripSnapshotMeta(item: SnapshotTour): ListTourPackage {
  const { snapshotMeta: _snapshotMeta, ...tour } = item;
  return tour;
}

export function getPublicPackageListSnapshot() {
  return packageListSnapshot;
}

export function getPublicPackageList(options?: {
  fromId?: number;
  durationId?: number;
  categoryId?: number;
  limit?: number;
}): ListTourPackage[] {
  let items = packageListSnapshot.items;

  if (typeof options?.fromId === "number") {
    items = items.filter(
      (item) => item.snapshotMeta?.startDestinationId === options.fromId,
    );
  }

  if (typeof options?.durationId === "number") {
    items = items.filter(
      (item) => item.snapshotMeta?.durationId === options.durationId,
    );
  }

  if (typeof options?.categoryId === "number") {
    items = items.filter(
      (item) => item.snapshotMeta?.packageCategoryId === options.categoryId,
    );
  }

  if (typeof options?.limit === "number") {
    items = items.slice(0, options.limit);
  }

  return items.map(stripSnapshotMeta);
}
