// app/api/destinations/web/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MOCK_DESTINATION_DETAILS } from "@/data/mockData";
import { getDestinationDetailFromDatabase } from "@/lib/publicContent/databaseDestinationDetail";
import { getPublicDestinationDetail } from "@/lib/publicContent/destinationDetailSnapshot";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const params = await context.params;
    const slug = params?.slug;

    if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
      const mockDest = MOCK_DESTINATION_DETAILS.find((d) => d.slug === slug);
      if (mockDest) {
        return NextResponse.json(mockDest, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Destinasi tidak ditemukan (Mock)" },
          { status: 404 },
        );
      }
    }

    const useSnapshots = process.env.PUBLIC_CONTENT_USE_SNAPSHOT_DETAILS !== "false";
    const dest = useSnapshots
      ? await getPublicDestinationDetail(slug)
      : await getDestinationDetailFromDatabase(slug);

    if (!dest) {
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan" },
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
      { message: "Gagal mengambil detail paket" },
      { status: 500 },
    );
  }
}
