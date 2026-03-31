// app/api/destinations/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWebDestinations } from "@/lib/destinations/webDestinations";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLimit(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw.trim());
  return isNaN(n) || n <= 0 ? undefined : n;
}

// ─── GET Handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get("limit"));
    const featured = searchParams.get("featured") === "true";
    const payload = await getWebDestinations({ featured, limit });
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    // Detail error di log agar mudah debug
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
