import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";

export function sitemapToursIndex(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): MetadataRoute.Sitemap {
  return [
    { url: url("/tours"), lastModified: getLastModified(lastModifiedMap, "/tours", t), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/tours/from-surabaya"), lastModified: getLastModified(lastModifiedMap, "/tours/from-surabaya", t), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/tours/from-bali"), lastModified: getLastModified(lastModifiedMap, "/tours/from-bali", t), changeFrequency: "weekly", priority: 0.9 },
  ];
}
