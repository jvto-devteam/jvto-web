import type { PublicPageSnapshot } from "./types";
// Editorial content-plane swap (jvto_cms seed): the retired jvto_dev editorial
// export (generated/dbPageSnapshots.json) is no longer merged here — the seed
// supersedes it for every SEED_COVERED_ROUTES route. manualPageSnapshots is now EMPTY:
// its last routes (/, /contact, /isic/*, /tours*) became content/-owned in Milestone 2.
// (/blog moved to the content/ Git-SSOT — content/pages/blog/ — 2026-08-06.)
// The JSON file remains on disk but unreferenced for editorial pages.
import { seedPageSnapshots } from "@/lib/cms/seedResolver";

/**
 * MILESTONE 2 (2026-08-09) — EMPTY BY DESIGN.
 *
 * Every route this map used to serve (`/`, `/contact`, `/isic/student-package`,
 * `/student-deals/isic`, `/tours`, `/tours/from-bali`, `/tours/from-surabaya`) is now
 * content/-owned, so keeping their snapshots would be a legacy source for a migrated
 * route — rejected by scripts/validate-static-route-ownership.mjs.
 *
 * The map itself is retained (not deleted) because `publicPageSnapshots` still merges
 * `seedPageSnapshots` for the routes the CMS seed legitimately covers, and
 * `getPublicPageSnapshotRecord` / `listPublicPageRoutesByPrefix` still have consumers
 * (the CMS console). Add an entry here ONLY for a route that is not content/-owned.
 */
const manualPageSnapshots: Record<string, PublicPageSnapshot> = {};

// Seed WINS for its covered routes; manualPageSnapshots is the fallback for the
// rest. (Was previously merging generated/dbPageSnapshots.json — retired.)
export const publicPageSnapshots: Record<string, PublicPageSnapshot> = {
  ...manualPageSnapshots,
  ...seedPageSnapshots,
};

export function getPublicPageSnapshotRecord(route: string) {
  return publicPageSnapshots[route] ?? null;
}

export function getPublicPageSnapshotUpdatedAt(route: string) {
  const snapshot = getPublicPageSnapshotRecord(route);
  if (!snapshot) return null;

  return snapshot.meta.updatedAt ?? snapshot.meta.generatedAt;
}

export function listPublicPageRoutesByPrefix(prefix: string) {
  const withSlash = prefix.endsWith("/") ? prefix : `${prefix}/`;

  return Object.keys(publicPageSnapshots)
    .filter((route) => route.startsWith(withSlash))
    .sort();
}
