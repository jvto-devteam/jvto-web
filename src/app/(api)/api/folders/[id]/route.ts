// src/app/api/folders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId, serializeFolder } from "../../_utils/assets-serialize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const folder = await prisma.folders.findUnique({ where: { id } });
    if (!folder)
      return NextResponse.json({ message: "Folder not found" }, { status: 404 });

    return NextResponse.json(serializeFolder(folder), { status: 200 });
  } catch (error) {
    console.error("GET /api/folders/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch folder" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const data: any = {};

    if (typeof body.name === "string") data.name = body.name.trim();
    if (body.parent_id !== undefined) {
      data.parent_id =
        typeof body.parent_id === "number" && body.parent_id > 0
          ? BigInt(body.parent_id)
          : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.folders.update({
      where: { id },
      data,
    });

    return NextResponse.json(serializeFolder(updated), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/folders/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update folder" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    await prisma.folders.delete({ where: { id } });
    return NextResponse.json({ message: "Folder deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/folders/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
