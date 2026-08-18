import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getLastModified, type LastModifiedMap } from "@/app/sitemap-utils";
import { getEcosystemDestinationRoutes } from "@/lib/ecosystemContent/destinationDetail";

export async function sitemapDestinations(
  t: Date,
  lastModifiedMap: LastModifiedMap,
): Promise<MetadataRoute.Sitemap> {
  const destinations = await getEcosystemDestinationRoutes();
  const dynamicDestinations: MetadataRoute.Sitemap = destinations.map(
    (dest) => ({
      url: url(`/destinations/${dest.slug}`),
      lastModified: t,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [
    {
      url: url("/destinations"),
      lastModified: getLastModified(lastModifiedMap, "/destinations", t),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...dynamicDestinations,
  ];
}
