// app/api/destinations/web/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWebDestinationBySlug } from "@/lib/destinations/webDestinations";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const params = await context.params;
    const slug = params?.slug;
    const dest = await getWebDestinationBySlug(slug);

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
