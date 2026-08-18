// Migrated 2026-08-18: dropped the Prisma `content_pages` fallback — that table was a
// leftover from the now-deleted CMS admin panel and hasn't been updatable since. Routes
// without a snapshot entry just use the caller's build-time `fallback` date.
import { getPublicPageSnapshotUpdatedAt } from "@/lib/publicContent/pageSnapshots";

export type LastModifiedMap = Map<string, Date>;

export async function getContentPageLastModifiedMap(
  routes: string[],
  fallback: Date,
): Promise<LastModifiedMap> {
  const entries = routes.map((route) => {
    const updatedAt = getPublicPageSnapshotUpdatedAt(route);
    return [route, updatedAt ? new Date(updatedAt) : fallback] as [string, Date];
  });

  return new Map(entries);
}

export function getLastModified(
  map: LastModifiedMap,
  route: string,
  fallback: Date,
): Date {
  return map.get(route) ?? fallback;
}
