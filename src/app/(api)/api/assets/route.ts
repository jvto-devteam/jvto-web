// src/app/api/assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeAsset } from "../_utils/assets-serialize";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const folderIdParam = searchParams.get("folderId");

    // dukung q dan search
    const search = (
      searchParams.get("q") ||
      searchParams.get("search") ||
      ""
    ).trim();

    const tagIdParam = searchParams.get("tagId");

    // NEW: filter type (image | video | document)
    const typeParam = (searchParams.get("type") || "").trim().toLowerCase();

    const where: any = {};

    if (folderIdParam) {
      const folderIdNum = Number(folderIdParam);
      if (!Number.isNaN(folderIdNum) && folderIdNum > 0) {
        where.folder_id = BigInt(folderIdNum);
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tagIdParam) {
      const tagIdNum = Number(tagIdParam);
      if (!Number.isNaN(tagIdNum) && tagIdNum > 0) {
        where.tags = {
          some: {
            tag_id: BigInt(tagIdNum),
          },
        };
      }
    }

    // NEW: apply type filter kalau valid
    if (["image", "video", "document"].includes(typeParam)) {
      where.type = typeParam;
    }

    const rows = await prisma.assets.findMany({
      where,
      include: {
        tags: {
          include: { tag: true },
        },
      },
      orderBy: [{ created_at: "desc" }],
    });

    return NextResponse.json(rows.map(serializeAsset), { status: 200 });
  } catch (error) {
    console.error("GET /api/assets error:", error);
    return NextResponse.json(
      { message: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const folderIdNum = Number(body.folder_id);
    if (!folderIdNum || Number.isNaN(folderIdNum) || folderIdNum <= 0) {
      return NextResponse.json(
        { message: "folder_id wajib diisi" },
        { status: 400 }
      );
    }

    const name = (body.name || "").trim();
    if (!name) {
      return NextResponse.json(
        { message: "name wajib diisi" },
        { status: 400 }
      );
    }

    // NOTE:
    // Untuk sekarang, asumsinya file sudah di-upload ke storage terpisah
    // dan di sini kita hanya simpan metadata (url, ext, size, type).
    const caption =
      typeof body.caption === "string" ? body.caption.trim() : null;
    const description =
      typeof body.description === "string" ? body.description.trim() : null;

    const type = body.type as "image" | "video" | "document";
    if (!type || !["image", "video", "document"].includes(type)) {
      return NextResponse.json(
        { message: "type tidak valid" },
        { status: 400 }
      );
    }

    const url = (body.url || "").trim();
    if (!url) {
      return NextResponse.json(
        { message: "url/path file wajib diisi (hasil upload)" },
        { status: 400 }
      );
    }

    const file_ext =
      typeof body.file_ext === "string" && body.file_ext.trim()
        ? body.file_ext.trim().toLowerCase()
        : null;

    const size_bytes =
      typeof body.size_bytes === "number" && body.size_bytes > 0
        ? BigInt(body.size_bytes)
        : null;

    const size_megabytes =
      typeof body.size_megabytes === "number" && body.size_megabytes > 0
        ? body.size_megabytes
        : null;

    const created = await prisma.assets.create({
      data: {
        folder_id: BigInt(folderIdNum),
        name,
        caption,
        description,
        type,
        url,
        file_ext,
        size_bytes,
        size_megabytes,
        sha256: body.sha256 ?? null,
        last_verified: body.last_verified ? new Date(body.last_verified) : null,
        is_active: typeof body.is_active === "boolean" ? body.is_active : true,
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json(serializeAsset(created), { status: 201 });
  } catch (error) {
    console.error("POST /api/assets error:", error);
    return NextResponse.json(
      { message: "Failed to create asset" },
      { status: 500 }
    );
  }
}
