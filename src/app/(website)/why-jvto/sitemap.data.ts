import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";
import { getPublicCrewCodes } from "@/lib/people/canonicalPeople";
import { getEcosystemReviews } from "@/lib/ecosystemContent/reviews";

export async function sitemapWhyJvto(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): Promise<MetadataRoute.Sitemap> {
  const [crewCodes, reviews] = await Promise.all([
    getPublicCrewCodes(),
    getEcosystemReviews(),
  ]);
  return [
    { url: url("/why-jvto"), lastModified: getLastModified(lastModifiedMap, "/why-jvto", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/the-jvto-difference"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/the-jvto-difference", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/reviews"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/reviews", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/our-story"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/our-story", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/why-jvto/our-team"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/our-team", t), changeFrequency: "monthly", priority: 0.8 },
    ...crewCodes.map((code) => ({
      url: url(`/why-jvto/our-team/${code}`),
      lastModified: getLastModified(lastModifiedMap, "/why-jvto/our-team", t),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: url("/why-jvto/community-standards"), lastModified: getLastModified(lastModifiedMap, "/why-jvto/community-standards", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/legal"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/legal", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/press-recognition"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/press-recognition", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/history-artifacts"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/history-artifacts", t), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/verify-jvto/police-safety"), lastModified: getLastModified(lastModifiedMap, "/verify-jvto/police-safety", t), changeFrequency: "monthly", priority: 0.8 },
    // Review permalinks. These pages were already live, self-canonical and
    // "index, follow", but appeared in no sitemap and carried no inbound link
    // — indexable with no way in, which is the worst of the two options.
    // Owner chose to embrace them (2026-08-21): each title is
    // "{reviewer} Review | {package}" and crew names run through the corpus,
    // so they are a real long-tail surface. Enumerated from ekosistem's
    // reviews.json, the same source the pages themselves read.
    ...reviews.map((review) => ({
      url: url(`/why-jvto/reviews/${review.id}`),
      lastModified: review.date ? new Date(review.date) : t,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
