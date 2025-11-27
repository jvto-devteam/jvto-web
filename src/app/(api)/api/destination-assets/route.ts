// src/app/api/destination-assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DestinationAssetType = "primary" | "secondary";

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

// GET /api/destination-assets?destination_id=3
// (fallback juga support destinationId untuk jaga2)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const destIdParam =
      searchParams.get("destination_id") ?? searchParams.get("destinationId");

    const where: any = {};

    if (destIdParam) {
      const n = Number(destIdParam);
      if (!n || Number.isNaN(n) || n <= 0) {
        return NextResponse.json(
          { message: "destination_id tidak valid" },
          { status: 400 }
        );
      }
      where.destination_id = BigInt(n);
    }

    // optional: filter type=primary / secondary
    const typeParam = searchParams.get("type");
    if (typeParam && (typeParam === "primary" || typeParam === "secondary")) {
      where.type = typeParam;
    }

    const rows = await prisma.destination_assets.findMany({
      where,
      include: {
        asset: true,
      },
      orderBy: [
        { type: "asc" },          // primary dulu, lalu secondary
        { created_at: "desc" },
      ],
    });

    return NextResponse.json(rows.map(serializeDestinationAsset), {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/destination-assets error:", error);
    return NextResponse.json(
      { message: "Failed to fetch destination assets" },
      { status: 500 }
    );
  }
}

// POST /api/destination-assets
// body: { destination_id, asset_id, type }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const destIdNum = Number(body.destination_id);
    const assetIdNum = Number(body.asset_id);

    if (!destIdNum || Number.isNaN(destIdNum) || destIdNum <= 0) {
      return NextResponse.json(
        { message: "destination_id wajib diisi & harus number > 0" },
        { status: 400 }
      );
    }

    if (!assetIdNum || Number.isNaN(assetIdNum) || assetIdNum <= 0) {
      return NextResponse.json(
        { message: "asset_id wajib diisi & harus number > 0" },
        { status: 400 }
      );
    }

    const type: DestinationAssetType =
      body.type === "primary" ? "primary" : "secondary";

    const created = await prisma.destination_assets.create({
      data: {
        destination_id: BigInt(destIdNum),
        asset_id: BigInt(assetIdNum),
        type,
      },
      include: {
        asset: true,
      },
    });

    return NextResponse.json(serializeDestinationAsset(created), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/destination-assets error:", error);
    return NextResponse.json(
      { message: "Failed to create destination asset" },
      { status: 500 }
    );
  }
}
