// app/api/destinations/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeDestination(dest: any) {
  const primaryBanner =
    (dest.destination_assets ?? []).find(
      (da: any) => da.asset?.type === "image" && da.type === "primary"
    )?.asset ?? null;

  return {
    id: Number(dest.id),
    name: dest.name,
    slug: dest.slug,
    banner: {
      url: (dest.destination_assets ?? []).find(
      (da: any) => da.asset?.type === "image" && da.type === "primary"
    )?.asset.url ?? "",
      alt: (dest.destination_assets ?? []).find(
      (da: any) => da.asset?.type === "image" && da.type === "primary"
    )?.asset.description ?? "",
    },
    description: dest.description,
    keyInfo:{
      difficulty_level: dest.difficulty_level,
      temperature_range: dest.temperature_range,
      best_time_to_visit: dest.best_time_to_visit,
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const destinations = await prisma.destinations.findMany({
      where: {
        id: {
          notIn: [3, 4],
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        difficulty_level: true,
        temperature_range: true,
        best_time_to_visit: true,
        destination_assets: {
          where: { asset: { type: "image" } },
          include: { asset: true },
        },
      },
      orderBy: { id: "asc" },
    });

    const payload = destinations.map(serializeDestination);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/destinations/web error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data destinasi" },
      { status: 500 }
    );
  }
}
