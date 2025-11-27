import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.activity_ends.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: "asc",
      },
    });

    const payload = rows.map((r) => ({
      id: Number(r.id),
      name: r.name,
      description: r.description,
      destination_id: r.destination_id ? Number(r.destination_id) : null,
      dinner: !!r.dinner,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("GET /api/activity-ends error:", error);
    return NextResponse.json(
      { message: "Failed to fetch activity ends (server error)" },
      { status: 500 }
    );
  }
}
