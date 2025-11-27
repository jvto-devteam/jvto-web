import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapDestinations(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/destinations"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/ijen-crater"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/mount-bromo"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/tumpak-sewu-waterfall"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/papuma-beach"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/madakaripura-waterfall"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/malang"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/destinations/surabaya"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
  ];
}
