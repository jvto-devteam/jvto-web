import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";

export function sitemapTravelGuide(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): MetadataRoute.Sitemap {
  return [
    { url: url("/travel-guide"), lastModified: getLastModified(lastModifiedMap, "/travel-guide", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/faq"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/faq", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/safety-on-tours"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/safety-on-tours", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/weather-and-closures"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/weather-and-closures", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/packing-and-fitness"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/packing-and-fitness", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/booking-information"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/booking-information", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/police-escort-for-groups"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/police-escort-for-groups", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/ijen-health-screening"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/ijen-health-screening", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/booking-payment-cancellation"), lastModified: getLastModified(lastModifiedMap, "/policy/booking-payment-cancellation", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy"), lastModified: getLastModified(lastModifiedMap, "/policy", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/inclusions-exclusions"), lastModified: getLastModified(lastModifiedMap, "/policy/inclusions-exclusions", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/privacy"), lastModified: getLastModified(lastModifiedMap, "/policy/privacy", t), changeFrequency: "monthly", priority: 0.8 },
  ];
}
