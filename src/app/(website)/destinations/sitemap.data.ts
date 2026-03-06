import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export async function sitemapDestinations(t: Date): Promise<MetadataRoute.Sitemap> {
  const destinations = await prisma.destinations.findMany({
    where: {
      id: {
        notIn: [3, 4],
      },
      published: true,
    },
    select: {
      slug: true,
      updated_at: true, // kalau ada kolom updated_at, pakai untuk lastModified
    },
  });

  const dynamicDestinations: MetadataRoute.Sitemap = destinations.map(
    (dest) => ({
      url: url(`/destinations/${dest.slug}`),
      lastModified: dest.updated_at ?? t,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [
    {
      url: url("/destinations"),
      lastModified: t,
      changeFrequency: "weekly", 
      priority: 0.9,
    },
    ...dynamicDestinations,
  ];
}
