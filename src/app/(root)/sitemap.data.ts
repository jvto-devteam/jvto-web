import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapRoot(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/"), lastModified: t, changeFrequency: "yearly", priority: 1 },
    { url: url("/contact"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/ijen-crater-blue-fire-tour"), lastModified: t, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/mount-bromo-private-tour"),   lastModified: t, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/isic/student-package"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
  ];
}