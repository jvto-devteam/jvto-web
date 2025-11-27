// app/sitemap.ts
import type { MetadataRoute } from "next";
import { now } from "@/lib/site";

import { sitemapRoot } from "./sitemap.data";
import { sitemapBlog } from "./(website)/blog/sitemap.data";
import { sitemapWhyJvto } from "./(website)/why-jvto/sitemap.data";
import { sitemapTravelGuide } from "./(website)/travel-guide/sitemap.data";
import { sitemapDestinations } from "./(website)/destinations/sitemap.data";
import { sitemapToursIndex } from "./(website)/tours/sitemap.data";
import { sitemapToursFromSurabaya } from "./(website)/tours/from-surabaya/sitemap.data";
import { sitemapToursFromBali } from "./(website)/tours/from-bali/sitemap.data";

// Prisma butuh Node runtime
export const runtime = "nodejs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const t = now();

  const [
    root,
    why,
    guide,
    dest,
    toursIdx,
    fromSub,
    fromBali,
    blog,
  ] = await Promise.all([
    sitemapRoot(t),
    sitemapWhyJvto(t),
    sitemapTravelGuide(t),
    sitemapDestinations(t),
    sitemapToursIndex(t),
    sitemapToursFromSurabaya(t),
    sitemapToursFromBali(t),
    sitemapBlog(t),
  ]);


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
