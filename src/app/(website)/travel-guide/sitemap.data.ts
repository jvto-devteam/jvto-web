import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

export function sitemapTravelGuide(t: Date): MetadataRoute.Sitemap {
  return [
    { url: url("/travel-guide"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/faq"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/safety-on-tours"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/weather-and-closures"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/packing-and-fitness"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/booking-information"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/police-escort-for-groups"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/booking-payment-cancellation"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/ijen-health-screening"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/booking-payment-cancellation"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/inclusions-exclusions"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/privacy"), lastModified: t, changeFrequency: "monthly", priority: 0.8 },
  ];
}
