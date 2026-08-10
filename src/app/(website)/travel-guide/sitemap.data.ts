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
    { url: url("/travel-guide/best-time-to-visit"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/best-time-to-visit", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/police-escort-for-groups"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/police-escort-for-groups", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/ijen-health-screening"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/ijen-health-screening", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/rijik-monthly-closure"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/rijik-monthly-closure", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/blue-fire-and-sunrise"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/blue-fire-and-sunrise", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/booking-safety"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/booking-safety", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/bromo-sunrise"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/bromo-sunrise", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/cancellation-travel-credit"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/cancellation-travel-credit", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/finish-in-bali"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/finish-in-bali", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/how-booking-works"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/how-booking-works", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/malang-batu"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/malang-batu", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/payment-and-deposit"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/payment-and-deposit", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/private-tour"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/private-tour", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/rooming-and-accommodation"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/rooming-and-accommodation", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/vehicle-and-luggage"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/vehicle-and-luggage", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/what-is-included"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/what-is-included", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/travel-guide/why-stay-near-ijen"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/why-stay-near-ijen", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/booking-payment-cancellation"), lastModified: getLastModified(lastModifiedMap, "/policy/booking-payment-cancellation", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy"), lastModified: getLastModified(lastModifiedMap, "/policy", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/inclusions-exclusions"), lastModified: getLastModified(lastModifiedMap, "/policy/inclusions-exclusions", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/policy/privacy"), lastModified: getLastModified(lastModifiedMap, "/policy/privacy", t), changeFrequency: "monthly", priority: 0.8 },
  ];
}
