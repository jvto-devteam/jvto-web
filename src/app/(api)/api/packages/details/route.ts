// app/api/packages/details/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializePackage(pkg: any) {
  const EXCLUDED_DESTINATION_IDS = new Set([3, 4]);
  const route = (pkg.package_destinations ?? [])
    .filter((pd) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id)))
    .map((dest) => dest.destinations?.short_slug ?? "").join("-");
  return {
    id: Number(pkg.id),
    name: pkg.name,
    slug: `${pkg.durations.day}d${pkg.durations.night}n-${route}-${pkg.start_destination?.name.toLowerCase()}-${pkg.end_destination?.name.toLowerCase()}`,
  };
}

export async function GET(_req: NextRequest) {
  try {
    const pkg = await prisma.packages.findMany({
      include: {
        start_destination: true,
        end_destination: true,
        durations: true,
        package_destinations: {
          include: {
            destinations: {
              include: { activities: true, destination_gears: true },
            },
          },
          orderBy: { sort_order: "asc" },
        },
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
