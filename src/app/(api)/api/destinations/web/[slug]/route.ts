// app/api/destinations/web/[slug]/route.ts
// Migrated 2026-08-18: sourced from ekosistem instead of Prisma, same reader the
// Server Component page (destinations/[slug]/page.tsx) already uses — part of the
// single-content-source consolidation.
import { NextRequest, NextResponse } from "next/server";
import { getEcosystemDestinationDetail } from "@/lib/ecosystemContent/destinationDetail";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const params = await context.params;
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter required" },
        { status: 400 },
      );
    }

    const dest = await getEcosystemDestinationDetail(slug);

    if (!dest) {
      return NextResponse.json(
        { message: "Destinasi tidak ditemukan atau belum dipublikasikan" },
        { status: 404 },
      );
    }

    return NextResponse.json(dest, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET /api/destinations/web/[slug] error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil detail destinasi" },
      { status: 500 },
    );
  }
}
