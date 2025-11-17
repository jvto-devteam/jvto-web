// src/app/api/durations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const durations = await prisma.durations.findMany({
      orderBy: [{ day: "asc" }, { id: "asc" }],
    });

    const serialized = durations.map((d) => ({
      id: Number(d.id),
      name: d.name,
      day: d.day,
      night: d.night,
    }));

    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("GET /api/durations error:", error);
    return NextResponse.json(
      { message: "Failed to fetch durations (server error)" },
      { status: 500 }
    );
  }
}
