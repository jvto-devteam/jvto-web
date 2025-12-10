// app/api/packages/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tambahkan interface untuk tipe data yang lebih aman (opsional tapi sangat disarankan)
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
  try {
    const { searchParams } = new URL(request.url);
    const fromIdParam = searchParams.get("from")?.trim() || undefined;
    const durationIdParam = searchParams.get("duration")?.trim() || undefined;
    const limitParam = searchParams.get("limit")?.trim() || undefined;

    const fromId =
      fromIdParam && !isNaN(Number(fromIdParam))
        ? Number(fromIdParam)
        : undefined;
    const durationId =
      durationIdParam && !isNaN(Number(durationIdParam))
        ? Number(durationIdParam)
        : undefined;
    const limit =
      limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    const pkgs = await prisma.packages.findMany({
      where: {
        is_publish: true,
        ...(fromId !== undefined && { start_destination_id: fromId }),
        ...(durationId !== undefined && { duration_id: durationId }),
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
