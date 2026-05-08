import type { Destination } from "@/interfaces";
import destinationListSnapshotJson from "./generated/destinationListSnapshot.json";
import type { PublicDestinationListSnapshot } from "./types";

const destinationListSnapshot =
  destinationListSnapshotJson as PublicDestinationListSnapshot;

export function getPublicDestinationListSnapshot() {
  return destinationListSnapshot;
}

export function getPublicDestinationList(options?: {
  featured?: boolean;
  limit?: number;
}): Destination[] {
  let items = destinationListSnapshot.items;

  if (options?.featured) {
    items = items.filter((item) => item.featured === true);
  }

  if (typeof options?.limit === "number") {
    items = items.slice(0, options.limit);
  }

  return items as Destination[];
}
