// app/api/destinations/web/[slug]/route.ts
// Refactored 2026-04-29 (AEO/GEO port Phase 4.8): detail transform logic moved to
// src/lib/destinations/getWebDestinationDetail.ts. Server Components (destinations/[slug]/page.tsx)
// call the helper directly; this route still serves external clients.
import { NextRequest, NextResponse } from "next/server";
import { getDestinationDetailFromDatabase } from "@/lib/publicContent/databaseDestinationDetail";
import { getPublicDestinationDetail } from "@/lib/publicContent/destinationDetailSnapshot";

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

    const useSnapshots = process.env.PUBLIC_CONTENT_USE_SNAPSHOT_DETAILS !== "false";
    const dest = useSnapshots
      ? await getPublicDestinationDetail(slug)
      : await getDestinationDetailFromDatabase(slug);

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
