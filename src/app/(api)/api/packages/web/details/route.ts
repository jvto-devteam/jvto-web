// src/app/(api)/api/packages/web/details/route.ts
// Refactored 2026-04-29: transform logic moved to src/lib/packages/getWebPackageDetail.ts
// so Server Components can call it directly (skipping HTTP) while this route still serves
// external clients. Backward-compatible response shape preserved.
import { NextRequest, NextResponse } from "next/server";
import { getWebPackageDetail } from "@/lib/packages/getWebPackageDetail";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (slug == null) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const data = await getWebPackageDetail(slug);
    if (!data) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan " + slug },
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
