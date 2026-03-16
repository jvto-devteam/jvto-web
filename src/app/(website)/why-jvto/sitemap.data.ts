import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";

export function sitemapWhyJvto(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): MetadataRoute.Sitemap {
  return [
    { url: url("/why-jvto"), lastModified: getLastModified(lastModifiedMap, "/why-jvto", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/the-jvto-difference"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/the-jvto-difference", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/reviews"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/reviews", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/our-story"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/our-story", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/our-team"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/our-team", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/community-standards"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/community-standards", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/legal"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/legal", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/press-recognition"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/press-recognition", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/history-artifacts"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/history-artifacts", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/police-safety"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/police-safety", t), changeFrequency: "monthly", priority: 0.8 },

  ];
}
