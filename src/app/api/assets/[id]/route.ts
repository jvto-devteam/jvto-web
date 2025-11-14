// src/app/api/assets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseId,
  serializeAsset,
} from "../../_utils/assets-serialize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const asset = await prisma.assets.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!asset)
      return NextResponse.json({ message: "Asset not found" }, { status: 404 });

    return NextResponse.json(serializeAsset(asset), { status: 200 });
  } catch (error) {
    console.error("GET /api/assets/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch asset" },
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
    if (typeof body.caption === "string") data.caption = body.caption.trim();
    if (typeof body.description === "string")
      data.description = body.description.trim();
    if (typeof body.url === "string") data.url = body.url.trim();
    if (typeof body.file_ext === "string")
      data.file_ext = body.file_ext.trim().toLowerCase();
    if (
      typeof body.size_bytes === "number" &&
      Number.isFinite(body.size_bytes)
    ) {
      data.size_bytes = BigInt(body.size_bytes);
    }
    if (
      typeof body.size_megabytes === "number" &&
      Number.isFinite(body.size_megabytes)
    ) {
      data.size_megabytes = body.size_megabytes;
    }
    if (typeof body.sha256 === "string") data.sha256 = body.sha256.trim();
    if (body.last_verified)
      data.last_verified = new Date(body.last_verified);
    if (typeof body.is_active === "boolean")
      data.is_active = body.is_active;

    // update tipe jika dikirim (opsional)
    if (
      typeof body.type === "string" &&
      ["image", "video", "document"].includes(body.type)
    ) {
      data.type = body.type;
    }

    // update folder jika dikirim
    if (
      typeof body.folder_id === "number" &&
      Number.isInteger(body.folder_id) &&
      body.folder_id > 0
    ) {
      data.folder_id = BigInt(body.folder_id);
    }

    // proses biasa dulu
    if (Object.keys(data).length > 0) {
      await prisma.assets.update({
        where: { id },
        data,
      });
    }

    // HANDLE TAG: addTagNames & removeTagIds (opsional)
    const addTagNames: string[] = Array.isArray(body.addTagNames)
      ? body.addTagNames
          .map((t: any) =>
            typeof t === "string" ? t.trim().toLowerCase() : ""
          )
          .filter(Boolean)
      : [];

    const removeTagIds: bigint[] = Array.isArray(body.removeTagIds)
      ? body.removeTagIds
          .map((n: any) => Number(n))
          .filter((n: number) => Number.isInteger(n) && n > 0)
          .map((n: number) => BigInt(n))
      : [];

    if (addTagNames.length > 0) {
      const existing = await prisma.tags_assets.findMany({
        where: { name: { in: addTagNames } },
      });

      const existingNames = new Set(existing.map((t) => t.name));
      const toCreateNames = addTagNames.filter(
        (n) => !existingNames.has(n)
      );

      const created =
        toCreateNames.length > 0
          ? await prisma.$transaction(
              toCreateNames.map((name) =>
                prisma.tags_assets.create({ data: { name } })
              )
            )
          : [];

      const allTags = [...existing, ...created];

      // upsert ke asset_tags
      await prisma.$transaction(
        allTags.map((tag) =>
          prisma.asset_tags.upsert({
            where: {
              asset_id_tag_id: {
                asset_id: id,
                tag_id: tag.id,
              },
            },
            update: {},
            create: {
              asset_id: id,
              tag_id: tag.id,
            },
          })
        )
      );
    }

    if (removeTagIds.length > 0) {
      await prisma.asset_tags.deleteMany({
        where: {
          asset_id: id,
          tag_id: { in: removeTagIds },
        },
      });
    }

    const updated = await prisma.assets.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Asset not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeAsset(updated), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/assets/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update asset" },
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
    await prisma.assets.delete({ where: { id } });
    return NextResponse.json({ message: "Asset deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/assets/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Asset not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
