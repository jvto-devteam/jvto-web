// app/api/activities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/activities
// Query params (opsional):
// - destination_id: filter by destinasi
// - q: keyword search activity_name / code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationIdParam = searchParams.get("destination_id");
    const q = searchParams.get("q");

    let destinationFilter: bigint | undefined = undefined;
    if (destinationIdParam) {
      const num = Number(destinationIdParam);
      if (Number.isFinite(num) && num > 0) {
        destinationFilter = BigInt(num);
      }
    }

    const where: any = {
      deleted_at: null,
    };

    if (destinationFilter) {
      where.destination_id = destinationFilter;
    }

    if (q && q.trim()) {
      const keyword = q.trim();
      where.OR = [
        { activity_name: { contains: keyword, mode: "insensitive" } },
        { code: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const rows = await prisma.activities.findMany({
      where,
      orderBy: [
        { activity_name: "asc" },
        { id: "asc" },
      ],
    });

    const payload = rows.map((a) => ({
      id: Number(a.id),
      code: a.code ?? null,
      activity_name: a.activity_name,
      destination_id: a.destination_id ? Number(a.destination_id) : null,
      estimated_time: a.estimated_time ?? null,
      slug: a.slug ?? null,
      created_at: a.created_at,
      updated_at: a.updated_at,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return NextResponse.json(
      { message: "Failed to fetch activities (server error)" },
      { status: 500 }
    );
  }
}
