// app/api/packages/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializePackage(pkg: any) {
  // Ambil semua asset gambar
  const imageAssets = (pkg.package_assets ?? [])
    .filter((pa: any) => pa.asset?.type === "image")
    .map((pa: any) => ({
      url: pa.asset?.url || "",
      alt: pa.asset?.description || "",
      isPrimary: pa.is_primary === true,
    }));

  // Banner = gambar primary, atau gambar pertama, atau fallback
  const primaryImage =
    imageAssets.find((img) => img.isPrimary) || imageAssets[0];

  // Harga termurah
  const validPrices = (pkg.package_prices ?? [])
    .map((p: any) => p.price)
    .filter(
      (price: any): price is number => typeof price === "number" && price > 0
    );

  const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const EXCLUDED_DESTINATION_IDS = new Set([3, 4]);
  return {
    id: Number(pkg.id),
    name: pkg.name,
    startDestination: pkg.start_destination?.name,
    endDestination: pkg.end_destination?.name,
    duration: {
      day: Number(pkg.durations?.day) || 0,
      night: Number(pkg.durations?.night) || 0,
    },
    banner: {
      url: primaryImage?.url || "", // fallback image!
      alt: primaryImage?.alt || "",
    },
    keyExperiences: (pkg.package_destinations ?? [])
      .filter((pd) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id)))
      .map((dest) => dest.destinations?.activities?.[0]?.activity_name ?? ""),
    images: imageAssets.map((img) => ({ url: img.url, alt: img.alt })),
    startFrom,
    slug: pkg.slug || "",
    physicality: pkg.physicality || "",
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const fromId = searchParams.get("from")?.trim() || undefined;
    const durationId = searchParams.get("duration")?.trim() || undefined;
    const pkg = await prisma.packages.findMany({
      where: {
        is_publish: true,
        ...(fromId && { start_destination_id: fromId }),
        ...(durationId && { duration_id: durationId }),
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
    });

    if (!pkg) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan" },
        { status: 404 }
      );
    }
    const payload = pkg.map(serializePackage);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/packages/details error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil paket" },
      { status: 500 }
    );
  }
}
