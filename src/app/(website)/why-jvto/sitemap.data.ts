import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapWhyJvto(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/why-jvto"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/the-jvto-difference"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/reviews"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/our-story"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/our-team"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/community-standards"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/legal"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/press-recognition"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/history-artifacts"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/police-safety"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },

  ];
}
