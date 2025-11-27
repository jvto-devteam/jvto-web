// src/app/api/_utils/assets-serialize.ts
import type { Prisma } from "@prisma/client";

/**
 * DTO yang dikirim ke frontend
 */

export type FolderDTO = {
  id: number;
  parent_id: number | null;
  name: string;
  created_at: string;
};

export type TagDTO = {
  id: number;
  name: string;
};

export type AssetDTO = {
  id: number;
  folder_id: number;
  name: string;
  caption: string | null;
  description: string | null;
  type: "image" | "video" | "document";
  url: string;
  file_ext: string | null;
  size_bytes: number | null;
  size_megabytes: number | null;
  sha256: string | null;
  last_verified: string | null;
  is_active: boolean;
  created_at: string;
  tags: TagDTO[];
  tagIds: number[];
};

/**
 * ROW TYPES dari Prisma (server only)
 * Untuk menghindari error jenis `XGetPayload` yang tidak tersedia,
 * kita longgarkan menjadi `any`. Struktur field tetap kita kontrol
 * lewat serializer di bawah.
 */

type FolderRow = any;
type TagRow = any;
type AssetWithTagsRow = any;

/**
 * SERIALIZERS
 */

export function serializeFolder(row: FolderRow): FolderDTO {
  return {
    id: Number(row.id),
    parent_id: row.parent_id ? Number(row.parent_id) : null,
    name: row.name,
    created_at: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
  };
}

export function serializeTag(row: TagRow): TagDTO {
  return {
    id: Number(row.id),
    name: row.name,
  };
}

export function serializeAsset(row: AssetWithTagsRow): AssetDTO {
  const tagObjs: TagDTO[] = Array.isArray(row.tags)
    ? row.tags.map((t: any) => serializeTag(t.tag ?? t))
    : [];

  const sizeBytes =
    row.size_bytes != null ? Number(row.size_bytes) : null;

  const sizeMb =
    row.size_megabytes != null
      ? Number(row.size_megabytes as unknown as number)
      : null;

  return {
    id: Number(row.id),
    folder_id: Number(row.folder_id),
    name: row.name,
    caption: row.caption ?? null,
    description: row.description ?? null,
    type: row.type as "image" | "video" | "document",
    url: row.url,
    file_ext: row.file_ext ?? null,
    size_bytes: sizeBytes,
    size_megabytes: sizeMb,
    sha256: row.sha256 ?? null,
    last_verified: row.last_verified
      ? (row.last_verified instanceof Date
          ? row.last_verified.toISOString()
          : String(row.last_verified))
      : null,
    is_active: row.is_active,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    tags: tagObjs,
    tagIds: tagObjs.map((t) => t.id),
  };
}

/**
 * Parser ID (dipakai di route [id])
 */
export function parseId(idParam: string): bigint | null {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n);
}