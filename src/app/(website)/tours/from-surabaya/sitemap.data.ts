// app/tours/from-surabaya/sitemap.data.ts
import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { safeBuildQuery } from "@/lib/build-safe";

export async function sitemapToursFromSurabaya(
  t: Date
): Promise<MetadataRoute.Sitemap> {

  // Ambil paket publish yang start dari Surabaya
  const packages = await safeBuildQuery(
    () =>
      prisma.packages.findMany({
        where: {
          is_publish: true,
          start_destination_id: 4,
        },
        select: {
          slug: true,
          updated_at: true, // kalau ada kolom updated_at, pakai untuk lastModified
        },
        orderBy: {
          durations: {
            day: "asc", // aman jika kolom ada; jika tidak, hapus
          },
        },
      }),
    [] as { slug: string | null; updated_at: Date | null }[],
    "sitemap:tours/from-surabaya",
  );

  const dynamicTours: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: url(`/${pkg.slug}`),
    lastModified: pkg.updated_at ?? t,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return dynamicTours;
}
