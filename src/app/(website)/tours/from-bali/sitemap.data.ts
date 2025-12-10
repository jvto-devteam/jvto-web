// app/tours/from-bali/sitemap.data.ts
import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export async function sitemapToursFromBali(t: Date): Promise<MetadataRoute.Sitemap> {
  // Grup durasi (statis)
  // const durationGroups: MetadataRoute.Sitemap = [
  //   { url: url("/tours/from-bali/2d1n"), lastModified: t, changeFrequency: "weekly", priority: 0.7 },
  //   { url: url("/tours/from-bali/3d2n"), lastModified: t, changeFrequency: "weekly", priority: 0.7 },
  //   { url: url("/tours/from-bali/4d3n"), lastModified: t, changeFrequency: "weekly", priority: 0.7 },
  //   { url: url("/tours/from-bali/5d4n"), lastModified: t, changeFrequency: "weekly", priority: 0.7 },
  // ];

  // Ambil paket publish yang start dari bali
  const packages = await prisma.packages.findMany({
    where: {
      is_publish: true,
      start_destination_id:3,
    },
    select: {
      slug: true,
      updated_at: true,       // kalau ada kolom updated_at, pakai untuk lastModified
    },
    orderBy : {
      durations : {
         day: "asc", // aman jika kolom ada; jika tidak, hapus
      }
    }
  });

  const dynamicTours: MetadataRoute.Sitemap =
    packages.map((pkg) => ({
      url: url(`/${pkg.slug}`),
      lastModified: pkg.updated_at ?? t,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // return [...durationGroups, ...dynamicTours];
  return dynamicTours;
}
