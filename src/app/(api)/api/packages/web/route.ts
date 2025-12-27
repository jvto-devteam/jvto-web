import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_PACKAGES } from "@/data/mockData";

interface ImageAsset {
  url: string;
  alt: string;
  isPrimary: boolean;
}

function serializePackage(pkg: any) {
  // Ambil semua asset gambar
  const imageAssets: ImageAsset[] = (pkg.package_assets ?? [])
    .filter((pa: any) => pa.asset?.type === "image")
    .map((pa: any) => ({
      url: pa.asset?.url || "",
      alt: pa.asset?.description || "",
      isPrimary: pa.is_primary === true,
    }));

  // Banner = gambar primary, atau gambar pertama, atau fallback
  const primaryImage =
    imageAssets.find((img: ImageAsset) => img.isPrimary) || imageAssets[0];

  // Harga termurah
  const validPrices: number[] = (pkg.package_prices ?? [])
    .map((p: any) => p.price)
    .filter(
      (price: any): price is number => typeof price === "number" && price > 0
    );

  const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;

  const EXCLUDED_DESTINATION_IDS = new Set([3, 4]);

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
      url: primaryImage?.url || "/fallback-banner.jpg", // saran: beri fallback nyata
      alt: primaryImage?.alt || pkg.name || "Package banner",
    },
    keyExperiences: (pkg.package_destinations ?? [])
      .filter(
        (pd: any) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id))
      )
      .map(
        (dest: any) => dest.destinations?.activities?.[0]?.activity_name ?? ""
      )
      .filter(Boolean), // hilangkan string kosong

    images: imageAssets.map((img: ImageAsset) => ({
      url: img.url,
      alt: img.alt,
    })),
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

export async function GET(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
    let filteredPackages = [...MOCK_PACKAGES];
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit")?.trim() || undefined;
    const fromIdParam = searchParams.get("from")?.trim() || undefined;
    const durationIdParam = searchParams.get("duration")?.trim() || undefined;
    const categoryIdParam = searchParams.get("category")?.trim() || undefined;

    const fromId = fromIdParam && !isNaN(Number(fromIdParam)) ? Number(fromIdParam) : undefined;
    const durationId = durationIdParam && !isNaN(Number(durationIdParam)) ? Number(durationIdParam) : undefined;
    const categoryId = categoryIdParam && !isNaN(Number(categoryIdParam)) ? Number(categoryIdParam) : undefined;
    const limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    // Filter by Start Destination (From)
    if (fromId !== undefined) {
      if (fromId === 4) {
        filteredPackages = filteredPackages.filter(p => p.startDestination === "Surabaya");
      } else if (fromId === 3) {
        filteredPackages = filteredPackages.filter(p => p.startDestination === "Bali");
      }
    }

    // Filter by Duration
    if (durationId !== undefined) {
      // NOTE: Adjust this mapping if your database duration_ids differ from day counts
      // Currently assuming duration_id roughly corresponds to day count for mock purposes
      // or specific IDs: 1=1 Day, 2=2 Days, 3=3 Days, 4=4 Days, 5=5 Days, 6=6 Days
      const durationMap: Record<number, number> = {
        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6
      };
      const expectedDays = durationMap[durationId];
      if (expectedDays) {
        filteredPackages = filteredPackages.filter(p => p.duration.day === expectedDays);
      }
    }

    // Filter by Limit
    if (limit !== undefined) {
      filteredPackages = filteredPackages.slice(0, limit);
    }

    return NextResponse.json(filteredPackages, { status: 200 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fromIdParam = searchParams.get("from")?.trim() || undefined;
    const durationIdParam = searchParams.get("duration")?.trim() || undefined;
    const categoryIdParam = searchParams.get("category")?.trim() || undefined;
    const limitParam = searchParams.get("limit")?.trim() || undefined;

    const fromId =
      fromIdParam && !isNaN(Number(fromIdParam))
        ? Number(fromIdParam)
        : undefined;
    const durationId =
      durationIdParam && !isNaN(Number(durationIdParam))
        ? Number(durationIdParam)
        : undefined;
    const categoryId =
      categoryIdParam && !isNaN(Number(categoryIdParam)) ? Number(categoryIdParam) : undefined;
    const limit =
      limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    const pkgs = await prisma.packages.findMany({
      where: {
        is_publish: true,
        ...(fromId !== undefined && { start_destination_id: fromId }),
        ...(durationId !== undefined && { duration_id: durationId }),
        ...(categoryId !== undefined && { package_category_id: categoryId })
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

    // Jika tidak ada paket
    if (!pkgs || pkgs.length === 0) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan" },
        { status: 404 }
      );
    }

    const payload = pkgs.map(serializePackage);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/packages/web error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil paket" },
      { status: 500 }
    );
  }
}
