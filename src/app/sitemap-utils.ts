// Migrated 2026-08-18: dropped the Prisma `content_pages` fallback — that table was a
// leftover from the now-deleted CMS admin panel and hasn't been updatable since. Routes
// without a known "last updated" date just use the caller's build-time `fallback` date.
//
// Migrated 2026-08-20: dropped the dead `pageSnapshots.ts` local snapshot (stale,
// generatedAt 2026-05-08, no regenerator script) — `lastmod` per route now reads
// ekosistem's own `page.lastReviewed` field (`@/lib/ecosystemContent/website`'s
// `getEcosystemWebsitePage()`, the same reader every page.tsx/JSON-LD builder in
// this app already uses for SEO/content). Verified 2026-08-20: nearly every route
// in sitemap.ts's list has a matching `*.website-output.json` file in ekosistem
// with `page.lastReviewed` populated (e.g. "/" -> 2026-08-18, "/verify-jvto" ->
// 2026-08-06) — a genuine per-route editorial "last reviewed" date, not fabricated.
// Routes with no ekosistem record (or an unparsable date) still fall back to the
// caller's `fallback` date, same honest degrade-to-request-time behavior as before.
import { getEcosystemWebsitePage } from "@/lib/ecosystemContent/website";

export type LastModifiedMap = Map<string, Date>;

export async function getContentPageLastModifiedMap(
  routes: string[],
  fallback: Date,
): Promise<LastModifiedMap> {
  const entries = await Promise.all(
    routes.map(async (route) => {
      const page = await getEcosystemWebsitePage(route);
      const lastReviewed = page?.meta.lastReviewed;
      const parsed = lastReviewed ? new Date(lastReviewed) : null;
      const date = parsed && !Number.isNaN(parsed.getTime()) ? parsed : fallback;
      return [route, date] as [string, Date];
    }),
  );

  return new Map(entries);
}

export function getLastModified(
  map: LastModifiedMap,
  route: string,
  fallback: Date,
): Date {
  return map.get(route) ?? fallback;
}
