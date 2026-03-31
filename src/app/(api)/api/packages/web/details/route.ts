import { NextRequest, NextResponse } from "next/server";
import { getWebPackageDetailBySlug } from "@/lib/packages/webTourDetail";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const data = await getWebPackageDetailBySlug(slug);

    if (!data) {
      return NextResponse.json(
        { message: `Paket tidak ditemukan atau belum dipublikasikan ${slug}` },
        { status: 404 },
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET /api/packages/details error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil detail paket" },
      { status: 500 },
    );
  }
}
