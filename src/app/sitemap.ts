// app/sitemap.ts
import type { MetadataRoute } from "next";
import { now } from "@/lib/site";
import { getSitemapLastModifiedMap } from "./sitemap-utils";

import { sitemapRoot } from "./sitemap.data";
import { sitemapWhyJvto } from "./(website)/why-jvto/sitemap.data";
import { sitemapTravelGuide } from "./(website)/travel-guide/sitemap.data";
import { sitemapDestinations } from "./(website)/destinations/sitemap.data";
import { sitemapToursIndex } from "./(website)/tours/sitemap.data";
import { sitemapToursFromSurabaya } from "./(website)/tours/from-surabaya/sitemap.data";
import { sitemapToursFromBali } from "./(website)/tours/from-bali/sitemap.data";
import { sitemapBlog } from "./(website)/blog/sitemap.data";

// Node runtime: the lastmod sources read the filesystem (content/ SSOT + committed
// snapshots). Prisma is no longer used here — PACKAGE 07 removed the content_pages
// lastmod fallback, so the sitemap performs no database read at all.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const t = now();
  // Same route enumeration as before; the list now lives in sitemap-utils so the
  // parity gate can assert every entry resolves to a stable (non-request-time) date.
  const lastModifiedMap = getSitemapLastModifiedMap();

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

  const blog = sitemapBlog(t);

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
