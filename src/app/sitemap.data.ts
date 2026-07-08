import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "./sitemap-utils";

export function sitemapRoot(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): MetadataRoute.Sitemap {
  return [
    { url: url("/"), lastModified: getLastModified(lastModifiedMap, "/", t), changeFrequency: "yearly", priority: 1 },
    { url: url("/contact"), lastModified: getLastModified(lastModifiedMap, "/contact", t), changeFrequency: "monthly", priority: 0.8 },
    // { url: url("/ijen-crater-blue-fire-tour"), lastModified: t, changeFrequency: "weekly", priority: 0.7 },
    // { url: url("/mount-bromo-private-tour"),   lastModified: t, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/isic/student-package"), lastModified: getLastModified(lastModifiedMap, "/isic/student-package", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/trust"), lastModified: getLastModified(lastModifiedMap, "/trust", t), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/markets/singapore"), lastModified: getLastModified(lastModifiedMap, "/markets/singapore", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/markets/malaysia"), lastModified: getLastModified(lastModifiedMap, "/markets/malaysia", t), changeFrequency: "monthly", priority: 0.8 },
  ];
}
