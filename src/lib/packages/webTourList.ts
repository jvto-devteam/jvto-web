import { prisma } from "@/lib/prisma";
import { MOCK_PACKAGES } from "@/data/mockData";

interface ImageAsset {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface GetWebTourListOptions {
  fromId?: number;
  durationId?: number;
  categoryId?: number;
  limit?: number;
}

function serializePackage(pkg: any) {
  const imageAssets: ImageAsset[] = (pkg.package_assets ?? [])
    .filter((pa: any) => pa.asset?.type === "image")
    .map((pa: any) => ({
      url: pa.asset?.url || "",
      alt: pa.asset?.description || "",
      isPrimary: pa.is_primary === true,
    }));

  const primaryImage =
    imageAssets.find((img: ImageAsset) => img.isPrimary) || imageAssets[0];

  const validPrices: number[] = (pkg.package_prices ?? [])
    .map((p: any) => p.price)
    .filter(
      (price: any): price is number => typeof price === "number" && price > 0,
    );

  const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const excludedDestinationIds = new Set([3, 4]);

  return {
    id: Number(pkg.id),
    name: pkg.name,
    startDestination: pkg.start_destination?.name ?? null,
    endDestination: pkg.end_destination?.name ?? null,
    duration: {
      day: Number(pkg.durations?.day) || 0,
      night: Number(pkg.durations?.night) || 0,
    },
    banner: {
      url: primaryImage?.url || "/fallback-banner.jpg",
      alt: primaryImage?.alt || pkg.name || "Package banner",
    },
    keyExperiences: (pkg.package_destinations ?? [])
      .filter(
        (pd: any) => !excludedDestinationIds.has(Number(pd.destination_id)),
      )
      .map(
        (dest: any) => dest.destinations?.activities?.[0]?.activity_name ?? "",
      )
      .filter(Boolean),
    images: primaryImage
      ? [{ url: primaryImage.url, alt: primaryImage.alt }]
      : [{ url: "/fallback-banner.jpg", alt: pkg.name || "Package banner" }],
    startFrom,
    slug: pkg.slug || "",
    physicality: pkg.physicality || "",
    tags: Array.isArray(pkg.tags)
      ? pkg.tags
          .map((s: any) => s?.trim())
          .filter((s: any) => s && s.length > 0)
      : [],
    highlights: Array.isArray(pkg.highlights_bullets)
      ? pkg.highlights_bullets
          .map((s: any) => s?.trim())
          .filter((s: any) => s && s.length > 0)
      : [],
  };
}

export async function getWebTourList({
  fromId,
  durationId,
  categoryId,
  limit,
}: GetWebTourListOptions = {}) {
  if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
    let filteredPackages = [...MOCK_PACKAGES];

    if (fromId !== undefined) {
      if (fromId === 4) {
        filteredPackages = filteredPackages.filter(
          (p) => p.startDestination === "Surabaya",
        );
      } else if (fromId === 3) {
        filteredPackages = filteredPackages.filter(
          (p) => p.startDestination === "Bali",
        );
      }
    }

    if (durationId !== undefined) {
      const durationMap: Record<number, number> = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
      };
      const expectedDays = durationMap[durationId];
      if (expectedDays) {
        filteredPackages = filteredPackages.filter(
          (p) => p.duration.day === expectedDays,
        );
      }
    }

    if (limit !== undefined) {
      filteredPackages = filteredPackages.slice(0, limit);
    }

    return filteredPackages;
  }

  try {
    const packages = await prisma.packages.findMany({
      where: {
        is_publish: true,
        ...(fromId !== undefined && { start_destination_id: fromId }),
        ...(durationId !== undefined && { duration_id: durationId }),
        ...(categoryId !== undefined && { package_category_id: categoryId }),
      },
      include: {
        start_destination: true,
        end_destination: true,
        durations: true,
        package_prices: {
          include: { price_tiers: true },
          orderBy: { price: "asc" },
        },
        package_destinations: {
          include: {
            destinations: {
              include: { activities: true, destination_gears: true },
            },
          },
          orderBy: { sort_order: "asc" },
        },
        package_assets: { include: { asset: true } },
      },
      orderBy: { id: "asc" },
      ...(limit !== undefined && { take: limit }),
    });

    return packages.map(serializePackage);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[packages] falling back to mock tour list: ${message}`);

    let filteredPackages = [...MOCK_PACKAGES];

    if (fromId !== undefined) {
      if (fromId === 4) {
        filteredPackages = filteredPackages.filter(
          (p) => p.startDestination === "Surabaya",
        );
      } else if (fromId === 3) {
        filteredPackages = filteredPackages.filter((p) => p.startDestination === "Bali");
      }
    }

    if (durationId !== undefined) {
      const durationMap: Record<number, number> = {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
      };
      const expectedDays = durationMap[durationId];
      if (expectedDays) {
        filteredPackages = filteredPackages.filter((p) => p.duration.day === expectedDays);
      }
    }

    if (limit !== undefined) {
      filteredPackages = filteredPackages.slice(0, limit);
    }

    return filteredPackages;
  }
}
