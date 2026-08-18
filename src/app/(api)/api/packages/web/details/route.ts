// Migrated 2026-08-18: no internal caller found for this route (checked fetch calls,
// imports, git history) — sourced from ekosistem per owner decision, same as its
// sibling routes (/api/tours, /api/tours-feed, /api/trip/[slug], /api/product/[slug]).
import { NextRequest, NextResponse } from "next/server";
import { getEcosystemTourPackageDetail } from "@/lib/ecosystemContent/tourPackageDetail";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (slug == null) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const pkg = await getEcosystemTourPackageDetail(slug);

    if (!pkg) {
      return NextResponse.json(
        { message: `Paket tidak ditemukan atau belum dipublikasikan ${slug}` },
        { status: 404 },
      );
    }

    return NextResponse.json(pkg, {
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
