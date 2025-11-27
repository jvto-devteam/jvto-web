import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item_includes.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: [
        { id: "asc" },
      ],
    });

    const payload = items.map((it) => ({
      id: Number(it.id),
      item: it.item,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/item-includes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch item_includes (server error)" },
      { status: 500 }
    );
  }
}
