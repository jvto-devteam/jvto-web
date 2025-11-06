import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapBlog(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/blog"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
  ];
}
