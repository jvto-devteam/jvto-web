// app/api/destinations/web/route.ts
// Refactored 2026-04-29 (AEO/GEO port Phase 4.8): list transform + filter logic moved to
// src/lib/destinations/getWebDestinationsList.ts. Server Components (destinations hub + homepage)
// call the helper directly; this route still serves external clients.
import { NextRequest, NextResponse } from "next/server";
import { getWebDestinationsList } from "@/lib/destinations/getWebDestinationsList";

function parseLimit(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw.trim());
  return isNaN(n) || n <= 0 ? undefined : n;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get("limit"));
    const featured = searchParams.get("featured") === "true";

    const payload = await getWebDestinationsList({ limit, featured });

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
