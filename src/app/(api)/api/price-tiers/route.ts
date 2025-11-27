// src/app/api/price-tiers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tiers = await prisma.price_tiers.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: [
        { min_pax: "asc" },
        { id: "asc" },
      ],
    });

    const payload = tiers.map((t) => ({
      id: Number(t.id),
      name: t.name,
      min_pax: t.min_pax,
      max_pax: t.max_pax,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/price-tiers error:", error);
    return NextResponse.json(
      { message: "Failed to fetch price tiers (server error)" },
      { status: 500 }
    );
  }
}
