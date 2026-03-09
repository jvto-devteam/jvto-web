// app/api/destinations/details/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_DESTINATION_DETAILS } from "@/data/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }, // Tidak pakai Promise
) {
  try {
    const slug = params?.slug;

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
