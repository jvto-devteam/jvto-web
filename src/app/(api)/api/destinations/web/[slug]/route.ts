// app/api/destinations/web/[slug]/route.ts
// Refactored 2026-04-29 (AEO/GEO port Phase 4.8): detail transform logic moved to
// src/lib/destinations/getWebDestinationDetail.ts. Server Components (destinations/[slug]/page.tsx)
// call the helper directly; this route still serves external clients.
import { NextRequest, NextResponse } from "next/server";
import { getWebDestinationDetail } from "@/lib/destinations/getWebDestinationDetail";

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

    const dest = await getWebDestinationDetail(slug);

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
