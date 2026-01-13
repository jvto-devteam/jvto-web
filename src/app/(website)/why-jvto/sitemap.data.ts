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
  ];
}
