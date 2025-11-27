// app/api/hotels/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/hotels
// Query params (opsional):
// - destination_id: filter by destinasi
// - q: keyword search name / code
// - publish_only: "true" | "false" (default: true)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationIdParam = searchParams.get("destination_id");
    const q = searchParams.get("q");
    const publishOnlyParam = searchParams.get("publish_only");

    let destinationFilter: bigint | undefined = undefined;
    if (destinationIdParam) {
      const num = Number(destinationIdParam);
      if (Number.isFinite(num) && num > 0) {
        destinationFilter = BigInt(num);
      }
    }

    const publishOnly =
      publishOnlyParam === null ? true : publishOnlyParam === "true";

    const where: any = {
      deleted_at: null,
    };

    if (destinationFilter) {
      where.destination_id = destinationFilter;
    }

    if (publishOnly) {
      // is_publish bisa nullable di model → treat null sebagai false
      where.is_publish = true;
    }

    if (q && q.trim()) {
      const keyword = q.trim();
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { code: { contains: keyword, mode: "insensitive" } },
        { address: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const rows = await prisma.hotels.findMany({
      where,
      orderBy: [
        { name: "asc" },
        { id: "asc" },
      ],
    });

    const payload = rows.map((h) => ({
      id: Number(h.id),
      code: h.code ?? null,
      name: h.name,
      destination_id: h.destination_id ? Number(h.destination_id) : null,
      description: h.description ?? null,
      address: h.address ?? null,
      phone: h.phone ?? null,
      map_url: h.map_url ?? null,
      website_url: h.website_url ?? null,
      is_publish: h.is_publish ?? false,
      created_at: h.created_at,
      updated_at: h.updated_at,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/hotels error:", error);
    return NextResponse.json(
      { message: "Failed to fetch hotels (server error)" },
      { status: 500 }
    );
  }
}
