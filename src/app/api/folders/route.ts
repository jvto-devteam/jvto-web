// src/app/api/folders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeFolder } from "../_utils/assets-serialize";

export async function GET() {
  try {
    const rows = await prisma.folders.findMany({
      orderBy: [{ parent_id: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(rows.map(serializeFolder), { status: 200 });
  } catch (error) {
    console.error("GET /api/folders error:", error);
    return NextResponse.json(
      { message: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const parent_id =
      typeof body.parent_id === "number" && body.parent_id > 0
        ? BigInt(body.parent_id)
        : null;

    if (!name) {
      return NextResponse.json(
        { message: "name wajib diisi" },
        { status: 400 }
      );
    }

    const created = await prisma.folders.create({
      data: {
        name,
        parent_id,
      },
    });

    return NextResponse.json(serializeFolder(created), { status: 201 });
  } catch (error) {
    console.error("POST /api/folders error:", error);
    return NextResponse.json(
      { message: "Failed to create folder" },
      { status: 500 }
    );
  }
}
