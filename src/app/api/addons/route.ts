// src/app/api/addons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const addons = await prisma.addons.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: [
        { id: "asc" },
      ],
    });

    const payload = addons.map((a) => ({
      id: Number(a.id),
      name: a.name,
      is_transport: a.is_transport ?? false,
      transport_type: a.transport_type ?? null,
      image: a.image ?? null,
      price:
        typeof a.price === "number"
          ? a.price
          : a.price == null
          ? null
          : Number(a.price),
      is_per_person: a.is_per_person ?? false,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/addons error:", error);
    return NextResponse.json(
      { message: "Failed to fetch addons (server error)" },
      { status: 500 }
    );
  }
}
