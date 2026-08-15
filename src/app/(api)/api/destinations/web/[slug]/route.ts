// app/api/destinations/web/[slug]/route.ts
// Refactored 2026-08-15 (Task 4.4, data-source-consolidation): the snapshot-first path
// (destinationDetailSnapshot.ts, deleted this task) is gone — this route now reads Prisma
// directly, same DB-only reader the Server Component page uses. No snapshot fallback.
import { NextRequest, NextResponse } from "next/server";
import { getDestinationDetailFromDatabase } from "@/lib/publicContent/databaseDestinationDetail";

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

    const dest = await getDestinationDetailFromDatabase(slug);

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
