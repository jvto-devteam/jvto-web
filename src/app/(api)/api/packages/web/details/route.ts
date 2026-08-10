import { NextRequest, NextResponse } from "next/server";
import { MOCK_PACKAGE_DETAILS } from "@/data/mockData";
import { getPackageDetailFromDatabase } from "@/lib/publicContent/databasePackageDetail";
import { getPublicPackageDetail } from "@/lib/publicContent/packageDetailSnapshot";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (slug == null) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
      const mockPkg = (MOCK_PACKAGE_DETAILS as any[]).find(
        (pkg) => pkg.product?.slug === slug || pkg.slug === slug,
      );

      if (mockPkg) {
        return NextResponse.json(mockPkg, { status: 200 });
      }

      return NextResponse.json(
        { message: "Paket tidak ditemukan (Mock)" },
        { status: 404 },
      );
    }

    const useSnapshots =
      process.env.PUBLIC_CONTENT_USE_SNAPSHOT_DETAILS !== "false";
    const pkg = useSnapshots
      ? await getPublicPackageDetail(slug)
      : await getPackageDetailFromDatabase(slug);

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
