import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";

export function sitemapBlog(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): MetadataRoute.Sitemap {
  return [
    { url: url("/blog"), lastModified: getLastModified(lastModifiedMap, "/blog", t), changeFrequency: "monthly", priority: 0.8 },
  ];
}
