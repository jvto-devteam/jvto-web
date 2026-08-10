import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getPublicPackageRoutesForSitemap } from "@/lib/publicContent/packageDetailSnapshot";

export async function sitemapToursFromSurabaya(
  t: Date,
): Promise<MetadataRoute.Sitemap> {
  const packages = getPublicPackageRoutesForSitemap({
    prefix: "tours/from-surabaya",
    categoryId: 1,
    fromId: 4,
  });

  return packages.map((pkg) => ({
    url: url(`/${pkg.slug}`),
    lastModified: pkg.updatedAt ?? t,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
