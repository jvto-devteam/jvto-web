import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { getPublishedPackageSlugs } from "@/lib/packages/getWebPackagesList";

export async function sitemapToursFromBali(
  t: Date,
): Promise<MetadataRoute.Sitemap> {
  const packages = await getPublishedPackageSlugs({
    categoryId: 1,
    fromId: 3,
  });

  return packages.map((pkg) => ({
    url: url(`/${pkg.slug}`),
    lastModified: pkg.updatedAt ?? t,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
