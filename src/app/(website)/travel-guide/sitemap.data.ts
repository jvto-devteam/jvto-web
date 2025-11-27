import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapTravelGuide(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/travel-guide"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/faq"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/booking-payment-cancellation"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/ijen-health-screening"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/how-to-book"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
  ];
}
