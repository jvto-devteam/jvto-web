import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapToursIndex(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/tours"), lastModified: t, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/tours/from-surabaya"), lastModified: t, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/tours/from-bali"), lastModified: t, changeFrequency: "weekly", priority: 0.9 },
  ];
}
