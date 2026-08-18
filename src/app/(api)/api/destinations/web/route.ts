// app/api/destinations/web/route.ts
// Migrated 2026-08-18: sourced from ekosistem instead of Prisma, as part of the
// single-content-source consolidation — extends the homepage/hub migration to this
// public list endpoint too.
import { NextRequest, NextResponse } from "next/server";
import { getEcosystemDestinationsList } from "@/lib/ecosystemContent/destinationDetail";

function parseLimit(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw.trim());
  return isNaN(n) || n <= 0 ? undefined : n;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseLimit(searchParams.get("limit"));
  const featured = searchParams.get("featured") === "true";

  try {
    const payload = await getEcosystemDestinationsList({
      featured: featured || undefined,
      limit,
    });
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("[/api/destinations/web] error:", error);
    return NextResponse.json(
      {
        message: "Gagal mengambil data destinasi",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
