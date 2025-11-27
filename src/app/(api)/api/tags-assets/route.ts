// src/app/api/tags-assets/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTag } from "../_utils/assets-serialize";

export async function GET() {
  try {
    const rows = await prisma.tags_assets.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(rows.map(serializeTag), { status: 200 });
  } catch (error) {
    console.error("GET /api/tags-assets error:", error);
    return NextResponse.json(
      { message: "Failed to fetch tags_assets" },
      { status: 500 }
    );
  }
}
