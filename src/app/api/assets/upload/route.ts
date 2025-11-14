// src/app/api/assets/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeAsset } from "../../_utils/assets-serialize";
import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function detectAssetTypeFromName(
  name: string,
  mime: string | null
): "image" | "video" | "document" {
  const lowerName = name.toLowerCase();
  const lowerMime = (mime || "").toLowerCase();

  if (
    lowerMime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|avif|svg)$/.test(lowerName)
  ) {
    return "image";
  }
  if (
    lowerMime.startsWith("video/") ||
    /\.(mp4|mov|webm|mkv)$/.test(lowerName)
  ) {
    return "video";
  }
  return "document";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const folderIdRaw = formData.get("folder_id")?.toString() ?? "";
    const assetIdRaw = formData.get("asset_id")?.toString() ?? "";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "file wajib diupload" },
        { status: 400 }
      );
    }

    const folderIdNum = Number(folderIdRaw);
    if (!folderIdNum || Number.isNaN(folderIdNum) || folderIdNum <= 0) {
      return NextResponse.json(
        { message: "folder_id tidak valid" },
        { status: 400 }
      );
    }

    const nameInput = (formData.get("name")?.toString() ?? "").trim();
    const caption =
      (formData.get("caption")?.toString() ?? "").trim() || null;
    const description =
      (formData.get("description")?.toString() ?? "").trim() || null;

    const assetIdNum = assetIdRaw ? Number(assetIdRaw) : null;
    const assetId =
      assetIdNum && !Number.isNaN(assetIdNum) && assetIdNum > 0
        ? BigInt(assetIdNum)
        : null;

    // Baca file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sizeBytes = buffer.byteLength;
    const sizeMegabytes = sizeBytes / (1024 * 1024);

    // Hitung hash SHA256
    const sha256 = createHash("sha256").update(buffer).digest("hex");

    // Siapkan folder upload di public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const originalName = file.name || "uploaded-file";
    const extMatch = originalName.includes(".")
      ? originalName.split(".").pop()
      : null;
    const fileExt = extMatch ? extMatch.toLowerCase() : null;

    const safeBaseName = originalName
      .replace(/[^\w.\-]+/g, "_")
      .toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const finalFileName = `${uniqueSuffix}-${safeBaseName}`;
    const filePath = path.join(uploadDir, finalFileName);

    // Tulis ke disk (public/uploads/...)
    await fs.writeFile(filePath, buffer);

    // URL publik (Next.js akan serve dari /public)
    const publicUrl = `/uploads/${finalFileName}`;

    // Deteksi tipe asset
    const detectedType = detectAssetTypeFromName(
      originalName,
      file.type || null
    );

    const baseData = {
      folder_id: BigInt(folderIdNum),
      name: nameInput || originalName,
      caption,
      description,
      type: detectedType,
      url: publicUrl,
      file_ext: fileExt,
      size_bytes: BigInt(sizeBytes),
      size_megabytes: sizeMegabytes,
      sha256,
      last_verified: new Date(),
      // is_active: true, // kalau mau force true di create; untuk update bisa dibiarkan tidak di-set
    } as const;

    let saved;

    if (assetId) {
      // UPDATE existing asset (ganti file + metadata dasar)
      saved = await prisma.assets.update({
        where: { id: assetId },
        data: baseData,
        include: {
          tags: { include: { tag: true } },
        },
      });
    } else {
      // CREATE baru
      saved = await prisma.assets.create({
        data: {
          ...baseData,
          is_active: true,
        },
        include: {
          tags: { include: { tag: true } },
        },
      });
    }

    const dto = serializeAsset(saved);
    return NextResponse.json(dto, { status: assetId ? 200 : 201 });
  } catch (error) {
    console.error("POST /api/assets/upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload asset (server error)" },
      { status: 500 }
    );
  }
}
