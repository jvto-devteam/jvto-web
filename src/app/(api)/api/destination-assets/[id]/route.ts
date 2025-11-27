// src/app/api/destination-assets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DestinationAssetType = "primary" | "secondary";

function parseId(idParam: string): bigint | null {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n);
}

function serializeDestinationAsset(row: any) {
  return {
    id: Number(row.id),
    destination_id: Number(row.destination_id),
    asset_id: Number(row.asset_id),
    type: row.type as DestinationAssetType,
    asset: row.asset
      ? {
          id: Number(row.asset.id),
          name: row.asset.name,
          url: row.asset.url,
          caption: row.asset.caption ?? null,
          type: row.asset.type as "image" | "video" | "document",
        }
      : null,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

// GET /api/destination-assets/[id]  (optional, tapi sekalian saja)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const row = await prisma.destination_assets.findUnique({
      where: { id },
      include: { asset: true },
    });

    if (!row) {
      return NextResponse.json(
        { message: "Destination asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeDestinationAsset(row), {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/destination-assets/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch destination asset" },
      { status: 500 }
    );
  }
}

// PATCH /api/destination-assets/[id]
// body utama yang dipakai CMS: { type: "primary" | "secondary" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (
      typeof body.type === "string" &&
      (body.type === "primary" || body.type === "secondary")
    ) {
      data.type = body.type as DestinationAssetType;
    }

    // optional: pindah relasi ke destination/asset lain
    if (
      typeof body.destination_id === "number" &&
      Number.isInteger(body.destination_id) &&
      body.destination_id > 0
    ) {
      data.destination_id = BigInt(body.destination_id);
    }

    if (
      typeof body.asset_id === "number" &&
      Number.isInteger(body.asset_id) &&
      body.asset_id > 0
    ) {
      data.asset_id = BigInt(body.asset_id);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.destination_assets.update({
      where: { id },
      data,
      include: { asset: true },
    });

    return NextResponse.json(serializeDestinationAsset(updated), {
      status: 200,
    });
  } catch (error: any) {
    console.error("PATCH /api/destination-assets/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update destination asset" },
      { status: 500 }
    );
  }
}

// DELETE /api/destination-assets/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.destination_assets.delete({ where: { id } });
    return NextResponse.json({ message: "Destination asset deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/destination-assets/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Destination asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete destination asset" },
      { status: 500 }
    );
  }
}
