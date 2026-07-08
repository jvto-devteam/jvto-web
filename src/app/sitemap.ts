// app/sitemap.ts
import type { MetadataRoute } from "next";
import { now } from "@/lib/site";
import { getContentPageLastModifiedMap } from "./sitemap-utils";

import { sitemapRoot } from "./sitemap.data";
import { sitemapWhyJvto } from "./(website)/why-jvto/sitemap.data";
import { sitemapTravelGuide } from "./(website)/travel-guide/sitemap.data";
import { sitemapDestinations } from "./(website)/destinations/sitemap.data";
import { sitemapToursIndex } from "./(website)/tours/sitemap.data";
import { sitemapToursFromSurabaya } from "./(website)/tours/from-surabaya/sitemap.data";
import { sitemapToursFromBali } from "./(website)/tours/from-bali/sitemap.data";
import { sitemapBlog } from "./(website)/blog/sitemap.data";

// Prisma butuh Node runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const t = now();
  const lastModifiedMap = await getContentPageLastModifiedMap(
    [
      "/",
      "/contact",
      "/destinations",
      "/isic/student-package",
      "/tours",
      "/tours/from-surabaya",
      "/tours/from-bali",
      "/travel-guide",
      "/travel-guide/faq",
      "/travel-guide/safety-on-tours",
      "/travel-guide/weather-and-closures",
      "/travel-guide/packing-and-fitness",
      "/travel-guide/booking-information",
      "/travel-guide/police-escort-for-groups",
      "/travel-guide/ijen-health-screening",
      "/policy",
      "/policy/privacy",
      "/policy/inclusions-exclusions",
      "/policy/booking-payment-cancellation",
      "/why-jvto",
      "/why-jvto/the-jvto-difference",
      "/why-jvto/reviews",
      "/why-jvto/our-story",
      "/why-jvto/our-team",
      "/why-jvto/community-standards",
      "/verify-jvto",
      "/verify-jvto/legal",
      "/verify-jvto/press-recognition",
      "/verify-jvto/history-artifacts",
      "/verify-jvto/police-safety",
      "/markets/singapore",
      "/markets/malaysia",
    ],
    t,
  );

  const [
    root,
    why,
    guide,
    dest,
    toursIdx,
    fromSub,
    fromBali,
  ] = await Promise.all([
    sitemapRoot(t, lastModifiedMap),
    sitemapWhyJvto(t, lastModifiedMap),
    sitemapTravelGuide(t, lastModifiedMap),
    sitemapDestinations(t, lastModifiedMap),
    sitemapToursIndex(t, lastModifiedMap),
    sitemapToursFromSurabaya(t),
    sitemapToursFromBali(t),
  ]);

  const blog = sitemapBlog(t);

  return [
    ...root,
    ...why,
    ...guide,
    ...dest,
    ...toursIdx,
    ...fromSub,
    ...fromBali,
    ...blog,
  ];
}
