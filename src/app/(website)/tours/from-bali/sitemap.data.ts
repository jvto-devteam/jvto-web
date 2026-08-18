import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getEcosystemTourPackageRoutes } from "@/lib/ecosystemContent/tourPackageDetail";

export async function sitemapToursFromBali(
  t: Date,
): Promise<MetadataRoute.Sitemap> {
  const packages = getEcosystemTourPackageRoutes("tours/from-bali");

  return packages.map((pkg) => ({
    url: url(`/tours/from-bali/${pkg.slug}`),
    lastModified: t,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
