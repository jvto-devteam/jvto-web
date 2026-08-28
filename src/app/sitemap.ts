// app/sitemap.ts
import type { MetadataRoute } from "next";
import { now } from "@/lib/site";
import { getContentPageLastModifiedMap } from "./sitemap-utils";
import { getEcosystemWebsiteRoutes } from "@/lib/ecosystemContent/website";

import { sitemapRoot } from "./sitemap.data";
import { sitemapWhyJvto } from "./(website)/why-jvto/sitemap.data";
import { sitemapTravelGuide } from "./(website)/travel-guide/sitemap.data";
import { sitemapDestinations } from "./(website)/destinations/sitemap.data";
import { sitemapToursIndex } from "./(website)/tours/sitemap.data";
import { sitemapToursFromSurabaya } from "./(website)/tours/from-surabaya/sitemap.data";
import { sitemapToursFromBali } from "./(website)/tours/from-bali/sitemap.data";
import { sitemapBlog } from "./(website)/blog/sitemap.data";

// Prisma butuh Node runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const t = now();
  // Every route ekosistem publishes prose for: the entries in its route index
  // that carry a `websiteOutput`. This list used to be typed out by hand, and
  // it drifted — /travel-guide/best-time-to-visit and
  // /travel-guide/rijik-monthly-closure were in the sitemap but missing from
  // the list, so their `lastmod` fell back to request time and changed on
  // every fetch, which is exactly the signal that teaches a crawler to stop
  // trusting lastmod at all.
  //
  // Routes without a `websiteOutput` (review permalinks, tour PDPs, crew and
  // destination detail pages) are deliberately excluded: they have no
  // `page.lastReviewed` to read, and getEcosystemWebsitePage() falls through
  // to an HTTP fetch on every miss — 238 of them per sitemap request.
  const routeIndex = await getEcosystemWebsiteRoutes();
  const proseRoutes = (routeIndex.routes ?? [])
    .filter((item) => item.websiteOutput)
    .map((item) => item.route);

  const lastModifiedMap = await getContentPageLastModifiedMap(proseRoutes, t);

  const [
    root,
    why,
    guide,
    dest,
    toursIdx,
    fromSub,
    fromBali,
  ] = await Promise.all([
    sitemapRoot(t, lastModifiedMap),
    sitemapWhyJvto(t, lastModifiedMap),
    sitemapTravelGuide(t, lastModifiedMap),
    sitemapDestinations(t, lastModifiedMap),
    sitemapToursIndex(t, lastModifiedMap),
    sitemapToursFromSurabaya(t),
    sitemapToursFromBali(t),
  ]);

  const blog = await sitemapBlog(t);

  return [
    ...root,
    ...why,
    ...guide,
    ...dest,
    ...toursIdx,
    ...fromSub,
    ...fromBali,
    ...blog,
  ];
}
