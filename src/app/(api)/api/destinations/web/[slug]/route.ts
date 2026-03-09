import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_DESTINATION_DETAILS } from "@/data/mockData";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }, // Gunakan context
) {
  try {
    // 1. Await params dari context
    const resolvedParams = await context.params;

    // 2. CEK APAKAH resolvedParams ADA (Ini penentu agar tidak error lagi)
    if (!resolvedParams || !resolvedParams.slug) {
      console.error("API Error: Slug tidak ditemukan di URL");
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
    }

    const { slug } = resolvedParams;
    
    if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
      const mockDest = MOCK_DESTINATION_DETAILS.find((d) => d.slug === slug);
      if (mockDest) {
        return NextResponse.json(mockDest, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Destinasi tidak ditemukan (Mock)" },
          { status: 404 },
        );
      }
    }

    const dest = await prisma.destinations.findUnique({
      where: { slug: slug },
      include: {
        destination_assets: {
          include: { asset: true },
        },
      },
    });

    if (!dest) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      JSON.parse(
        JSON.stringify(dest, (_, v) => (typeof v === "bigint" ? Number(v) : v)),
      ),
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/destinations/details/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil detail paket" },
      { status: 500 },
    );
  }
}
