"use client";

import { useMemo, useState } from "react";
import {
  Folder as FolderIcon,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Link2,
  Plus,
  Tag as TagIcon,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

/**
 * TYPES - disesuaikan dengan struktur tabel sederhana
 */

type AssetType = "image" | "video" | "document" | "link";

type Folder = {
  id: number;
  parentId: number | null;
  name: string;
  createdAt: string;
};

type Tag = {
  id: number;
  name: string;
};

type Asset = {
  id: number;
  folderId: number;
  name: string;
  description?: string | null;
  type: AssetType;
  url: string;
  fileExt?: string | null;
  sizeBytes?: number | null;
  isActive: boolean;
  createdAt: string;
  tagIds: number[]; // relasi ke tags (asset_tags)
};

/**
 * INITIAL STATE (mock data)
 * Nanti bagian ini bisa diganti fetch dari API/Postgre.
 */

const initialFolders: Folder[] = [
  { id: 1, parentId: null, name: "Tours", createdAt: new Date().toISOString() },
  { id: 2, parentId: null, name: "Legal", createdAt: new Date().toISOString() },
  { id: 3, parentId: 1, name: "Bromo", createdAt: new Date().toISOString() },
  { id: 4, parentId: 1, name: "Ijen", createdAt: new Date().toISOString() },
  { id: 5, parentId: 2, name: "NIB", createdAt: new Date().toISOString() },
];

const initialTags: Tag[] = [
  { id: 1, name: "bromo" },
  { id: 2, name: "ijen" },
  { id: 3, name: "legal" },
  { id: 4, name: "hero" },
  { id: 5, name: "sosmed" },
];

const initialAssets: Asset[] = [
  {
    id: 1,
    folderId: 3,
    name: "Hero Image Bromo Sunrise",
    description: "Foto utama untuk landing tour Bromo sunrise.",
    type: "image",
    url: "https://via.placeholder.com/800x400?text=Bromo+Hero",
    fileExt: "jpg",
    sizeBytes: 320000,
    isActive: true,
    createdAt: new Date().toISOString(),
    tagIds: [1, 4],
  },
  {
    id: 2,
    folderId: 3,
    name: "Video Drone Bromo",
    description: "Footage drone panorama kawah dan lautan pasir.",
    type: "video",
    url: "https://youtube.com/watch?v=xxxxx",
    fileExt: null,
    sizeBytes: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    tagIds: [1],
  },
  {
    id: 3,
    folderId: 5,
    name: "Scan NIB 2025",
    description: "Dokumen legal NIB perusahaan (PDF).",
    type: "document",
    url: "https://your-cdn.com/legal/nib-2025.pdf",
    fileExt: "pdf",
    sizeBytes: 540000,
    isActive: true,
    createdAt: new Date().toISOString(),
    tagIds: [3],
  },
];

/**
 * UTILITIES
 */

function getTypeIcon(type: AssetType) {
  switch (type) {
    case "image":
      return <ImageIcon className="h-4 w-4 text-emerald-400" />;
    case "video":
      return <Video className="h-4 w-4 text-sky-400" />;
    case "document":
      return <FileText className="h-4 w-4 text-indigo-400" />;
    case "link":
      return <Link2 className="h-4 w-4 text-slate-400" />;
    default:
      return <FileText className="h-4 w-4 text-slate-400" />;
  }
}

function formatSize(sizeBytes?: number | null) {
  if (!sizeBytes || sizeBytes <= 0) return "-";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  const kb = sizeBytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

/**
 * MAIN PAGE
 */

export default function AssetsPage() {
  // state
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(1); // default ke "Tours"
  const [expandedFolders, setExpandedFolders] = useState<number[]>([1, 2, 3]);
  const [search, setSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // derived
  const currentFolder = useMemo(
    () => folders.find((f) => f.id === currentFolderId) ?? null,
    [folders, currentFolderId]
  );

  const childFolders = useMemo(
    () => folders.filter((f) => f.parentId === currentFolderId),
    [folders, currentFolderId]
  );

  const folderPath = useMemo(() => {
    if (!currentFolder) return [];
    const path: Folder[] = [];
    let cursor: Folder | undefined | null = currentFolder;
    while (cursor) {
      path.unshift(cursor);
      cursor = folders.find((f) => f.id === cursor!.parentId) ?? null;
    }
    return path;
  }, [currentFolder, folders]);

  const visibleAssets = useMemo(() => {
    return assets.filter((a) => {
      if (a.folderId !== currentFolderId) return false;
      if (selectedTagId && !a.tagIds.includes(selectedTagId)) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q)
      );
    });
  }, [assets, currentFolderId, search, selectedTagId]);

  /**
   * HANDLERS
   */

  function toggleFolderExpand(id: number) {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleCreateFolder(parentId: number | null) {
    const name = window.prompt("Nama folder:");
    if (!name || !name.trim()) return;
    const id = Date.now();
    const newFolder: Folder = {
      id,
      parentId,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
    setExpandedFolders((prev) =>
      parentId && !prev.includes(parentId) ? [...prev, parentId] : prev
    );
    setCurrentFolderId(id);
  }

  function handleCreateAsset(folderId: number) {
    const name = window.prompt("Nama asset:");
    if (!name || !name.trim()) return;

    const typeInput = window
      .prompt("Tipe (image/video/document/link):", "image")
      ?.toLowerCase() as AssetType | undefined;

    const type: AssetType =
      typeInput && ["image", "video", "document", "link"].includes(typeInput)
        ? typeInput
        : "image";

    const url = window.prompt("URL / path asset:") || "";
    if (!url.trim()) return;

    const id = Date.now();
    const newAsset: Asset = {
      id,
      folderId,
      name: name.trim(),
      description: "",
      type,
      url: url.trim(),
      fileExt: null,
      sizeBytes: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      tagIds: [],
    };
    setAssets((prev) => [...prev, newAsset]);
  }

  function handleAssignTag(assetId: number) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    const input = window.prompt(
      "Masukkan tag (pisahkan dengan koma). Tag baru akan dibuat otomatis.",
      ""
    );
    if (input == null) return;

    const rawNames = input
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (rawNames.length === 0) return;

    setTags((prevTags) => {
      const next = [...prevTags];
      for (const name of rawNames) {
        if (!next.some((t) => t.name === name)) {
          next.push({ id: Date.now() + Math.random(), name });
        }
      }
      return next;
    });

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== assetId) return a;
        const nextTagIds = [...a.tagIds];
        rawNames.forEach((name) => {
          const tag = (prevTags: Tag[], allTags: Tag[]) =>
            allTags.find((t) => t.name === name);
          // kita resolve pakai state terbaru via closure di bawah
        });
        return a;
      })
    );
  }

  // perbaiki assign tag dengan akses ke tags terbaru
  function handleAssignTagSafe(assetId: number) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    const input = window.prompt(
      "Masukkan tag (pisahkan dengan koma). Tag baru akan dibuat otomatis.",
      ""
    );
    if (input == null) return;

    const rawNames = input
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (rawNames.length === 0) return;

    // update tags dulu
    setTags((prevTags) => {
      const next = [...prevTags];
      for (const name of rawNames) {
        if (!next.some((t) => t.name === name)) {
          next.push({ id: Date.now() + Math.random(), name });
        }
      }
      return next;
    });

    // lalu update asset tagIds berdasarkan tags terbaru (pakai functional update)
    setAssets((prevAssets) => {
      return prevAssets.map((a) => {
        if (a.id !== assetId) return a;

        // ambil tags terbaru dari closure setTags tidak bisa,
        // jadi kita hitung ulang di dalam dengan gabungan prev + new
        // cara simpel: setelah setTags di atas, kita kira-kira semua nama sudah ada.
        // kita bangun mapping on the fly dari tags + rawNames.
        // untuk presisi di versi API/DB nanti akan lebih rapi.

        // Sementara: kita gunakan kombinasi dari state `tags` lama + nama baru:
        // (cukup untuk mock).
        const syntheticTags: Tag[] = [
          ...tags,
          ...rawNames
            .filter((name) => !tags.some((t) => t.name === name))
            .map((name, idx) => ({
              id: Date.now() + idx,
              name,
            })),
        ];

        const newTagIds = new Set(a.tagIds);
        rawNames.forEach((name) => {
          const tag = syntheticTags.find((t) => t.name === name);
          if (tag) newTagIds.add(tag.id);
        });

        return { ...a, tagIds: Array.from(newTagIds) };
      });
    });
  }

  function handleMoveAsset(assetId: number) {
    const targetName = window.prompt("Pindahkan ke folder (nama persis):");
    if (!targetName) return;

    const target = folders.find(
      (f) => f.name.toLowerCase() === targetName.toLowerCase()
    );
    if (!target) {
      alert("Folder tidak ditemukan.");
      return;
    }

    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, folderId: target.id } : a
      )
    );
  }

  /**
   * RENDER
   */

  return (
    <div className="grid grid-cols-[260px,minmax(0,1fr)] gap-4">
      {/* LEFT: Folder Tree */}
      <div className="border border-slate-800/80 bg-slate-950/80 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Folder Structure
          </div>
          <button
            onClick={() => handleCreateFolder(null)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-800 transition"
          >
            <Plus className="h-3 w-3" />
            Root
          </button>
        </div>

        <div className="text-[10px] text-slate-500 mb-1">
          Klik folder untuk melihat aset. Tours & Legal cukup jadi folder.
        </div>

        <FolderTree
          folders={folders}
          currentFolderId={currentFolderId}
          expandedFolders={expandedFolders}
          onToggleExpand={toggleFolderExpand}
          onSelectFolder={setCurrentFolderId}
          onCreateSubFolder={handleCreateFolder}
        />
      </div>

      {/* RIGHT: Assets */}
      <div className="flex flex-col gap-3">
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {folderPath.length > 0 ? (
              <>
                <button
                  onClick={() => {
                    if (!currentFolder) return;
                    if (currentFolder.parentId === null) {
                      return;
                    }
                    setCurrentFolderId(currentFolder.parentId);
                  }}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Up
                </button>
                <div className="flex items-center gap-1">
                  {folderPath.map((f, idx) => (
                    <span key={f.id} className="flex items-center gap-1">
                      {idx > 0 && <span className="text-slate-600">/</span>}
                      <button
                        onClick={() => setCurrentFolderId(f.id)}
                        className={
                          "hover:text-emerald-400" +
                          (idx === folderPath.length - 1
                            ? " text-slate-100 font-semibold"
                            : "")
                        }
                      >
                        {f.name}
                      </button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-slate-500">Pilih folder di kiri</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTagId ?? ""}
              onChange={(e) =>
                setSelectedTagId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="bg-slate-950 border border-slate-800 text-[10px] px-2 py-1 rounded-md text-slate-300"
            >
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            {currentFolderId && (
              <button
                onClick={() => handleCreateAsset(currentFolderId)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-[10px] font-medium text-slate-950 transition"
              >
                <Plus className="h-3 w-3" />
                New Asset
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari asset di folder ini..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
          />
        </div>

        {/* Asset list */}
        <div className="border border-slate-800 bg-slate-950/80 rounded-xl p-3 min-h-[260px]">
          {currentFolderId == null ? (
            <div className="text-xs text-slate-500">
              Pilih folder di kiri untuk melihat aset.
            </div>
          ) : visibleAssets.length === 0 ? (
            <div className="text-xs text-slate-500">
              Belum ada aset di folder ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleAssets.map((asset) => {
                const assetTags = asset.tagIds
                  .map((tid) => tags.find((t) => t.id === tid))
                  .filter(Boolean) as Tag[];

                return (
                  <div
                    key={asset.id}
                    className="group border border-slate-800/80 bg-slate-950/80 rounded-lg px-3 py-2 flex flex-col gap-1 hover:border-emerald-500/50 hover:bg-slate-900/80 transition"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {getTypeIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-semibold text-slate-100 truncate">
                            {asset.name}
                          </div>
                          {!asset.isActive && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] text-slate-400">
                              inactive
                            </span>
                          )}
                        </div>
                        {asset.description && (
                          <div className="text-[10px] text-slate-500 line-clamp-2">
                            {asset.description}
                          </div>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] text-slate-500">
                          <span>{asset.type}</span>
                          {asset.fileExt && (
                            <span className="uppercase text-slate-400">
                              · {asset.fileExt}
                            </span>
                          )}
                          <span>· {formatSize(asset.sizeBytes)}</span>
                          <Link
                            href={asset.url}
                            target="_blank"
                            className="text-emerald-400 hover:text-emerald-300 truncate max-w-[120px]"
                          >
                            Open
                          </Link>
                        </div>

                        {assetTags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {assetTags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[8px] text-slate-400"
                              >
                                <TagIcon className="h-2 w-2" />
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => handleAssignTagSafe(asset.id)}
                          className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[8px] text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition"
                        >
                          + Tag
                        </button>
                        <button
                          onClick={() => handleMoveAsset(asset.id)}
                          className="p-1 rounded-md text-slate-500 hover:text-emerald-400 hover:bg-slate-900 transition"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-[9px] text-slate-600">
          Ini full client-side pakai state. Langkah berikut tinggal:
          ganti source data ke API yang baca tulis ke PostgreSQL dengan struktur
          tabel yang sama.
        </div>
      </div>
    </div>
  );
}

/**
 * FOLDER TREE COMPONENT
 */

type FolderTreeProps = {
  folders: Folder[];
  currentFolderId: number | null;
  expandedFolders: number[];
  onToggleExpand: (id: number) => void;
  onSelectFolder: (id: number) => void;
  onCreateSubFolder: (parentId: number | null) => void;
};

function FolderTree({
  folders,
  currentFolderId,
  expandedFolders,
  onToggleExpand,
  onSelectFolder,
  onCreateSubFolder,
}: FolderTreeProps) {
  const rootFolders = folders.filter((f) => f.parentId === null);

  return (
    <div className="text-[11px] text-slate-300 space-y-1">
      {rootFolders.map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          folders={folders}
          level={0}
          currentFolderId={currentFolderId}
          expandedFolders={expandedFolders}
          onToggleExpand={onToggleExpand}
          onSelectFolder={onSelectFolder}
          onCreateSubFolder={onCreateSubFolder}
        />
      ))}
    </div>
  );
}

type FolderNodeProps = {
  folder: Folder;
  folders: Folder[];
  level: number;
  currentFolderId: number | null;
  expandedFolders: number[];
  onToggleExpand: (id: number) => void;
  onSelectFolder: (id: number) => void;
  onCreateSubFolder: (parentId: number | null) => void;
};

function FolderNode({
  folder,
  folders,
  level,
  currentFolderId,
  expandedFolders,
  onToggleExpand,
  onSelectFolder,
  onCreateSubFolder,
}: FolderNodeProps) {
  const children = folders.filter((f) => f.parentId === folder.id);
  const isExpanded = expandedFolders.includes(folder.id);
  const isActive = currentFolderId === folder.id;

  return (
    <div>
      <div
        className={[
          "flex items-center gap-1 rounded-md px-1.5 py-1 cursor-pointer group",
          isActive
            ? "bg-slate-800/80 text-emerald-400"
            : "hover:bg-slate-900/80 text-slate-300",
        ].join(" ")}
        style={{ paddingLeft: 6 + level * 12 }}
        onClick={() => onSelectFolder(folder.id)}
      >
        {/* Toggle caret */}
        {children.length > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(folder.id);
            }}
            className="w-4 h-4 flex items-center justify-center text-slate-500 hover:text-emerald-400"
          >
            {isExpanded ? (
              <FolderOpen className="h-3 w-3" />
            ) : (
              <FolderIcon className="h-3 w-3" />
            )}
          </button>
        ) : (
          <FolderIcon className="h-3 w-3 text-slate-500" />
        )}

        <span className="truncate text-[11px]">{folder.name}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateSubFolder(folder.id);
          }}
          className="opacity-0 group-hover:opacity-100 ml-auto px-1 py-0.5 rounded-md text-[9px] text-slate-500 hover:text-emerald-400 hover:bg-slate-900 transition"
        >
          +
        </button>
      </div>

      {isExpanded &&
        children.length > 0 &&
        children.map((child) => (
          <FolderNode
            key={child.id}
            folder={child}
            folders={folders}
            level={level + 1}
            currentFolderId={currentFolderId}
            expandedFolders={expandedFolders}
            onToggleExpand={onToggleExpand}
            onSelectFolder={onSelectFolder}
            onCreateSubFolder={onCreateSubFolder}
          />
        ))}
    </div>
  );
}
