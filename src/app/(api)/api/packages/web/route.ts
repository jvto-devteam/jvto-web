import { NextRequest, NextResponse } from "next/server";
import { getWebTourList } from "@/lib/packages/webTourList";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromIdParam = searchParams.get("from")?.trim() || undefined;
    const durationIdParam = searchParams.get("duration")?.trim() || undefined;
    const categoryIdParam = searchParams.get("category")?.trim() || undefined;
    const limitParam = searchParams.get("limit")?.trim() || undefined;

    const fromId =
      fromIdParam && !isNaN(Number(fromIdParam))
        ? Number(fromIdParam)
        : undefined;
    const durationId =
      durationIdParam && !isNaN(Number(durationIdParam))
        ? Number(durationIdParam)
        : undefined;
    const categoryId =
      categoryIdParam && !isNaN(Number(categoryIdParam))
        ? Number(categoryIdParam)
        : undefined;
    const limit =
      limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

    const payload = await getWebTourList({
      fromId,
      durationId,
      categoryId,
      limit,
    });

    if (!payload || payload.length === 0) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan" },
        { status: 404 },
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/packages/web error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil paket" },
      { status: 500 },
    );
  }
}
