"use client";

import { useMemo, useState, useRef } from "react";
import {
  Folder as FolderIcon,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Plus,
  Tag as TagIcon,
  ArrowLeft,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

/**
 * TYPES
 */

type AssetType = "image" | "video" | "document";

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
  caption?: string | null;
  description?: string | null;
  type: AssetType;
  url: string;
  fileExt?: string | null;
  sizeBytes?: number | null;
  sizeMegabytes?: number | null;
  sha256?: string | null;
  lastVerifiedISO?: string | null;
  isActive: boolean;
  createdAt: string;
  tagIds: number[];
};

/**
 * INITIAL STATE
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
    caption: "Hero untuk landing page Bromo.",
    description: "Foto utama untuk landing tour Bromo sunrise.",
    type: "image",
    url: "https://via.placeholder.com/800x400?text=Bromo+Hero",
    fileExt: "jpg",
    sizeBytes: 320000,
    sizeMegabytes: 0.32,
    sha256: "c0ffee...deadbeef001",
    lastVerifiedISO: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    tagIds: [1, 4],
  },
  {
    id: 2,
    folderId: 3,
    name: "Video Drone Bromo",
    caption: "Footage aerial drone.",
    description: "Footage drone panorama kawah dan lautan pasir.",
    type: "video",
    url: "https://youtube.com/watch?v=xxxxx",
    fileExt: null,
    sizeBytes: null,
    sizeMegabytes: null,
    sha256: null,
    lastVerifiedISO: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    tagIds: [1],
  },
  {
    id: 3,
    folderId: 5,
    name: "Scan NIB 2025",
    caption: "Dokumen legal untuk keperluan perizinan.",
    description: "Dokumen legal NIB perusahaan (PDF).",
    type: "document",
    url: "https://your-cdn.com/legal/nib-2025.pdf",
    fileExt: "pdf",
    sizeBytes: 540000,
    sizeMegabytes: 0.54,
    sha256: "abc123...9988776655",
    lastVerifiedISO: new Date().toISOString(),
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

function getDescendantFolderIds(all: Folder[], folderId: number): number[] {
  const ids: number[] = [];
  function walk(id: number) {
    const children = all.filter((f) => f.parentId === id);
    for (const child of children) {
      ids.push(child.id);
      walk(child.id);
    }
  }
  walk(folderId);
  return ids;
}

function detectAssetTypeFromFile(file: File): AssetType {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (
    mime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|avif|svg)$/.test(name)
  ) {
    return "image";
  }
  if (mime.startsWith("video/") || /\.(mp4|mov|webm|mkv)$/.test(name)) {
    return "video";
  }
  return "document";
}

/**
 * MAIN COMPONENT
 */

export default function AssetsPage() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(1);
  const [expandedFolders, setExpandedFolders] = useState<number[]>([1, 2, 3]);
  const [search, setSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // MODAL STATE
  type FolderFormMode = "create-root" | "create-sub" | "rename";
  type AssetFormMode = "create" | "edit";

  const [folderFormState, setFolderFormState] = useState<{
    open: boolean;
    mode: FolderFormMode;
    targetFolderId: number | null;
  }>({
    open: false,
    mode: "create-root",
    targetFolderId: null,
  });

  const [assetFormState, setAssetFormState] = useState<{
    open: boolean;
    mode: AssetFormMode;
    folderId: number | null;
    assetId: number | null;
  }>({
    open: false,
    mode: "create",
    folderId: null,
    assetId: null,
  });

  const [detailAssetId, setDetailAssetId] = useState<number | null>(null);

  // derived
  const currentFolder = useMemo(
    () => folders.find((f) => f.id === currentFolderId) ?? null,
    [folders, currentFolderId]
  );

  const folderPath = useMemo(() => {
    if (!currentFolder) return [];
    const path: Folder[] = [];
    let cursor: Folder | null | undefined = currentFolder;
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
        (a.description || "").toLowerCase().includes(q) ||
        (a.caption || "").toLowerCase().includes(q)
      );
    });
  }, [assets, currentFolderId, search, selectedTagId]);

  const detailAsset = useMemo(
    () =>
      detailAssetId ? assets.find((a) => a.id === detailAssetId) ?? null : null,
    [assets, detailAssetId]
  );

  const detailAssetFolder = useMemo(
    () =>
      detailAsset
        ? folders.find((f) => f.id === detailAsset.folderId) ?? null
        : null,
    [detailAsset, folders]
  );

  const editingAsset = useMemo(
    () =>
      assetFormState.assetId != null
        ? assets.find((a) => a.id === assetFormState.assetId) ?? null
        : null,
    [assets, assetFormState.assetId]
  );

  function buildFolderPathLabel(folderId: number | null): string {
    if (folderId == null) return "-";
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return "-";
    const path: Folder[] = [];
    let cursor: Folder | null | undefined = folder;
    while (cursor) {
      path.unshift(cursor);
      cursor = folders.find((f) => f.id === cursor!.parentId) ?? null;
    }
    return path.map((f) => f.name).join(" / ");
  }

  /**
   * FOLDER HANDLERS
   */

  function toggleFolderExpand(id: number) {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function openCreateRootFolderForm() {
    setFolderFormState({
      open: true,
      mode: "create-root",
      targetFolderId: null,
    });
  }

  function openCreateSubFolderForm(parentId: number) {
    setFolderFormState({
      open: true,
      mode: "create-sub",
      targetFolderId: parentId,
    });
  }

  function openRenameFolderForm(folderId: number) {
    setFolderFormState({
      open: true,
      mode: "rename",
      targetFolderId: folderId,
    });
  }

  function handleSaveFolderName(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const { mode, targetFolderId } = folderFormState;

    if (mode === "create-root" || mode === "create-sub") {
      const parentId = mode === "create-root" ? null : targetFolderId;
      const id = Date.now();
      const newFolder: Folder = {
        id,
        parentId,
        name: trimmed,
        createdAt: new Date().toISOString(),
      };
      setFolders((prev) => [...prev, newFolder]);
      if (parentId && !expandedFolders.includes(parentId)) {
        setExpandedFolders((prev) => [...prev, parentId]);
      }
      setCurrentFolderId(id);
    } else if (mode === "rename" && targetFolderId != null) {
      setFolders((prev) =>
        prev.map((f) => (f.id === targetFolderId ? { ...f, name: trimmed } : f))
      );
    }

    setFolderFormState((prev) => ({ ...prev, open: false }));
  }

  function handleDeleteFolder(folderId: number) {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    const descendants = getDescendantFolderIds(folders, folderId);
    const allToDelete = [folderId, ...descendants];

    const ok = window.confirm(
      `Hapus folder "${folder.name}" dan semua subfolder + aset di dalamnya?`
    );
    if (!ok) return;

    setFolders((prev) => prev.filter((f) => !allToDelete.includes(f.id)));
    setAssets((prev) => prev.filter((a) => !allToDelete.includes(a.folderId)));

    if (currentFolderId && allToDelete.includes(currentFolderId)) {
      setCurrentFolderId(null);
    }
  }

  /**
   * ASSET HANDLERS
   */

  function openCreateAssetForm(folderId: number) {
    setAssetFormState({
      open: true,
      mode: "create",
      folderId,
      assetId: null,
    });
  }

  function openEditAssetForm(assetId: number) {
    const asset = assets.find((a) => a.id === assetId);
    setAssetFormState({
      open: true,
      mode: "edit",
      folderId: asset?.folderId ?? currentFolderId,
      assetId,
    });
  }

  function handleSaveAssetForm(data: {
    name: string;
    caption: string;
    description: string;
    file: File | null;
  }) {
    const { mode, assetId, folderId } = assetFormState;
    if (folderId == null) return;

    if (mode === "create") {
      if (!data.file) return;
      const file = data.file;
      const ext = file.name.includes(".")
        ? file.name.split(".").pop()!.toLowerCase()
        : null;
      const type = detectAssetTypeFromFile(file);
      const sizeBytes = file.size;
      const sizeMegabytes = sizeBytes / (1024 * 1024);
      const url = URL.createObjectURL(file);

      const id = Date.now();
      const newAsset: Asset = {
        id,
        folderId,
        name: data.name.trim(),
        caption: data.caption.trim() || null,
        description: data.description.trim() || "",
        type,
        url,
        fileExt: ext,
        sizeBytes,
        sizeMegabytes,
        sha256: null,
        lastVerifiedISO: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        tagIds: [],
      };
      setAssets((prev) => [...prev, newAsset]);
    } else if (mode === "edit" && assetId != null) {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id !== assetId) return a;
          let updated: Asset = {
            ...a,
            name: data.name.trim() || a.name,
            caption: data.caption.trim() || null,
            description: data.description.trim() || "",
          };

          if (data.file) {
            const file = data.file;
            const ext = file.name.includes(".")
              ? file.name.split(".").pop()!.toLowerCase()
              : null;
            const type = detectAssetTypeFromFile(file);
            const sizeBytes = file.size;
            const sizeMegabytes = sizeBytes / (1024 * 1024);
            const url = URL.createObjectURL(file);

            updated = {
              ...updated,
              type,
              url,
              fileExt: ext,
              sizeBytes,
              sizeMegabytes,
            };
          }

          return updated;
        })
      );
    }

    setAssetFormState((prev) => ({ ...prev, open: false }));
  }

  function handleDeleteAsset(assetId: number) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    const ok = window.confirm(`Hapus asset "${asset.name}"?`);
    if (!ok) return;
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    if (detailAssetId === assetId) setDetailAssetId(null);
  }

  function handleToggleAssetActive(assetId: number) {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, isActive: !a.isActive } : a))
    );
  }

  /**
   * TAG HANDLERS
   */

  function handleAddTagsToAsset(assetId: number, rawInput: string) {
    const rawNames = rawInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (rawNames.length === 0) return;

    let nextTags = [...tags];

    for (const name of rawNames) {
      if (!nextTags.some((t) => t.name === name)) {
        nextTags.push({ id: Date.now() + Math.random(), name });
      }
    }

    setTags(nextTags);

    setAssets((prevAssets) =>
      prevAssets.map((a) => {
        if (a.id !== assetId) return a;
        const newTagIds = new Set(a.tagIds);
        rawNames.forEach((name) => {
          const tag = nextTags.find((t) => t.name === name);
          if (tag) newTagIds.add(tag.id);
        });
        return { ...a, tagIds: Array.from(newTagIds) };
      })
    );
  }

  function handleRemoveTagFromAsset(assetId: number, tagId: number) {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? { ...a, tagIds: a.tagIds.filter((id) => id !== tagId) }
          : a
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
            onClick={openCreateRootFolderForm}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-800 transition"
          >
            <Plus className="h-3 w-3" />
            Root
          </button>
        </div>

        <div className="text-[10px] text-slate-500 mb-1">
          Klik folder untuk melihat aset. Tours &amp; Legal cukup jadi folder.
        </div>

        <FolderTree
          folders={folders}
          currentFolderId={currentFolderId}
          expandedFolders={expandedFolders}
          onToggleExpand={toggleFolderExpand}
          onSelectFolder={setCurrentFolderId}
          onCreateSubFolder={openCreateSubFolderForm}
          onRenameFolder={openRenameFolderForm}
          onDeleteFolder={handleDeleteFolder}
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
                    if (currentFolder.parentId === null) return;
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
                setSelectedTagId(e.target.value ? Number(e.target.value) : null)
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
                onClick={() => openCreateAssetForm(currentFolderId)}
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
                    onClick={() => setDetailAssetId(asset.id)}
                    className="group border border-slate-800/80 bg-slate-950/80 rounded-lg px-3 py-2 flex flex-col gap-1 hover:border-emerald-500/50 hover:bg-slate-900/80 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">{getTypeIcon(asset.type)}</div>
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

                        {asset.caption && (
                          <div className="text-[10px] text-slate-400 line-clamp-1">
                            {asset.caption}
                          </div>
                        )}

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
                          {typeof asset.sizeMegabytes === "number" && (
                            <span>· {asset.sizeMegabytes.toFixed(2)} MB</span>
                          )}
                          <Link
                            href={asset.url}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
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

                        {(asset.sha256 || asset.lastVerifiedISO) && (
                          <div className="mt-1 text-[8px] text-slate-600 space-y-0.5">
                            {asset.sha256 && (
                              <div className="truncate">
                                hash: {asset.sha256}
                              </div>
                            )}
                            {asset.lastVerifiedISO && (
                              <div>last verified: {asset.lastVerifiedISO}</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditAssetForm(asset.id);
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[8px] text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition inline-flex items-center gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAssetActive(asset.id);
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[8px] text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition"
                        >
                          {asset.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAsset(asset.id);
                          }}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
                          title="Hapus asset"
                        >
                          <Trash2 className="h-3 w-3" />
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
          Ini full client-side pakai state. Tinggal nanti disambungkan ke API
          yang simpan ke PostgreSQL.
        </div>
      </div>

      {/* MODALS */}

      {/* Folder Form Modal */}
      <FolderFormModal
        key={
          folderFormState.mode +
          "-" +
          (folderFormState.targetFolderId ?? "root")
        }
        open={folderFormState.open}
        mode={folderFormState.mode}
        folder={
          folderFormState.mode === "rename" && folderFormState.targetFolderId
            ? folders.find((f) => f.id === folderFormState.targetFolderId) ??
              null
            : null
        }
        onClose={() => setFolderFormState((prev) => ({ ...prev, open: false }))}
        onSave={handleSaveFolderName}
      />

      {/* Asset Form Modal */}
      <AssetFormModal
        key={
          assetFormState.mode +
          "-" +
          (assetFormState.assetId ?? "new") +
          "-" +
          (assetFormState.folderId ?? "none")
        }
        open={assetFormState.open}
        mode={assetFormState.mode}
        folderPathLabel={buildFolderPathLabel(assetFormState.folderId)}
        asset={editingAsset}
        onClose={() => setAssetFormState((prev) => ({ ...prev, open: false }))}
        onSave={handleSaveAssetForm}
      />

      {/* Asset Detail Modal */}
      <AssetDetailModal
        key={detailAsset?.id ?? "none"}
        open={!!detailAsset}
        asset={detailAsset}
        folder={detailAssetFolder}
        tags={tags}
        onClose={() => setDetailAssetId(null)}
        onToggleActive={handleToggleAssetActive}
        onDelete={handleDeleteAsset}
        onEdit={(id) => openEditAssetForm(id)}
        onAddTags={handleAddTagsToAsset}
        onRemoveTag={handleRemoveTagFromAsset}
      />
    </div>
  );
}

/**
 * FOLDER TREE
 */

type FolderTreeProps = {
  folders: Folder[];
  currentFolderId: number | null;
  expandedFolders: number[];
  onToggleExpand: (id: number) => void;
  onSelectFolder: (id: number) => void;
  onCreateSubFolder: (parentId: number) => void;
  onRenameFolder: (id: number) => void;
  onDeleteFolder: (id: number) => void;
};

function FolderTree({
  folders,
  currentFolderId,
  expandedFolders,
  onToggleExpand,
  onSelectFolder,
  onCreateSubFolder,
  onRenameFolder,
  onDeleteFolder,
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
          onRenameFolder={onRenameFolder}
          onDeleteFolder={onDeleteFolder}
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
  onCreateSubFolder: (parentId: number) => void;
  onRenameFolder: (id: number) => void;
  onDeleteFolder: (id: number) => void;
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
  onRenameFolder,
  onDeleteFolder,
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

        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateSubFolder(folder.id);
            }}
            className="px-1 py-0.5 rounded-md text-[9px] text-slate-500 hover:text-emerald-400 hover:bg-slate-900 transition"
            title="Subfolder"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRenameFolder(folder.id);
            }}
            className="p-0.5 rounded-md text-slate-500 hover:text-emerald-400 hover:bg-slate-900 transition"
            title="Rename folder"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFolder(folder.id);
            }}
            className="p-0.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
            title="Delete folder"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
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
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
          />
        ))}
    </div>
  );
}

/**
 * MODALS
 */

type FolderFormModalProps = {
  open: boolean;
  mode: "create-root" | "create-sub" | "rename";
  folder: Folder | null;
  onClose: () => void;
  onSave: (name: string) => void;
};

function FolderFormModal({
  open,
  mode,
  folder,
  onClose,
  onSave,
}: FolderFormModalProps) {
  const [name, setName] = useState(folder?.name ?? "");

  if (!open) return null;

  const title =
    mode === "rename"
      ? "Rename Folder"
      : mode === "create-sub"
      ? "Create Subfolder"
      : "Create Root Folder";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950/95 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Folder name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-[11px] text-slate-400 hover:text-slate-100 hover:bg-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name)}
            className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-emerald-500/90 text-slate-950 hover:bg-emerald-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

type AssetFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  folderPathLabel: string;
  asset: Asset | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    caption: string;
    description: string;
    file: File | null;
  }) => void;
};

function AssetFormModal({
  open,
  mode,
  folderPathLabel,
  asset,
  onClose,
  onSave,
}: AssetFormModalProps) {
  const [name, setName] = useState(asset?.name ?? "");
  const [caption, setCaption] = useState(asset?.caption ?? "");
  const [description, setDescription] = useState(asset?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<AssetType | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const title = mode === "create" ? "Create Asset" : "Edit Asset";

  function handleSelectFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    const detected = detectAssetTypeFromFile(f);
    setPreviewType(detected);
    if (!name) {
      setName(f.name);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    handleSelectFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    handleSelectFile(f);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "create" && !file) return;
    onSave({
      name,
      caption,
      description,
      file,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-950/95 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Info folder path */}
        <div className="mb-3 text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Upload to:</span>{" "}
          <span className="text-slate-200">{folderPathLabel}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Caption</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/70 min-h-[60px]"
            />
          </div>

          {/* File upload area */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">File</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border border-dashed border-slate-700 rounded-md px-3 py-4 text-center text-[11px] text-slate-400 bg-slate-950/80 flex flex-col items-center gap-2"
            >
              <div>Drag &amp; drop file ke sini, atau</div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] text-slate-100 hover:bg-slate-800"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              {file ? (
                <div className="mt-2 text-[10px] text-slate-400">
                  <div>{file.name}</div>
                  <div>{formatSize(file.size)}</div>
                  <div>
                    Detected type:{" "}
                    <span className="text-emerald-400">
                      {previewType ?? "-"}
                    </span>
                  </div>
                </div>
              ) : mode === "edit" && asset ? (
                <div className="mt-2 text-[10px] text-slate-400">
                  <div>Current file: {asset.url}</div>
                  <div>Type: {asset.type}</div>
                  {asset.sizeBytes && (
                    <div>Size: {formatSize(asset.sizeBytes)}</div>
                  )}
                  <div>Upload baru untuk mengganti file (opsional).</div>
                </div>
              ) : null}

              {/* Preview */}
              {previewUrl && previewType === "image" && (
                <div className="mt-3">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-40 rounded-md border border-slate-700 mx-auto"
                  />
                </div>
              )}
              {previewUrl && previewType === "video" && (
                <div className="mt-3">
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-40 rounded-md border border-slate-700 mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-[11px] text-slate-400 hover:text-slate-100 hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-emerald-500/90 text-slate-950 hover:bg-emerald-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type AssetDetailModalProps = {
  open: boolean;
  asset: Asset | null;
  folder: Folder | null;
  tags: Tag[];
  onClose: () => void;
  onToggleActive: (assetId: number) => void;
  onDelete: (assetId: number) => void;
  onEdit: (assetId: number) => void;
  onAddTags: (assetId: number, raw: string) => void;
  onRemoveTag: (assetId: number, tagId: number) => void;
};

function AssetDetailModal({
  open,
  asset,
  folder,
  tags,
  onClose,
  onToggleActive,
  onDelete,
  onEdit,
  onAddTags,
  onRemoveTag,
}: AssetDetailModalProps) {
  const [tagInput, setTagInput] = useState("");

  if (!open || !asset) return null;

  const assetTags = asset.tagIds
    .map((tid) => tags.find((t) => t.id === tid))
    .filter(Boolean) as Tag[];

  function handleAddTags() {
    if (!tagInput.trim()) return;
    onAddTags(asset.id, tagInput);
    setTagInput("");
  }

  const isImage = asset.type === "image";
  const isVideo = asset.type === "video";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-xl rounded-lg border border-slate-800 bg-slate-950/95 p-4 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              {asset.name}
            </h2>
            <p className="text-[11px] text-slate-500">
              {folder ? folder.name : "No folder"} · {asset.type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(asset.id)}
              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:bg-slate-800 hover:text-emerald-400 inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
            <button
              onClick={() => onToggleActive(asset.id)}
              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
            >
              {asset.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => onDelete(asset.id)}
              className="px-2 py-1 rounded-md bg-slate-900 border border-rose-800/70 text-[10px] text-rose-300 hover:bg-slate-900/80"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview di detail */}
        {(isImage || isVideo) && (
          <div className="mb-3">
            {isImage && (
              <img
                src={asset.url}
                alt={asset.name}
                className="max-h-64 rounded-md border border-slate-700 mx-auto"
              />
            )}
            {isVideo && (
              <video
                src={asset.url}
                controls
                className="max-h-64 rounded-md border border-slate-700 mx-auto"
              />
            )}
          </div>
        )}

        {/* Basic info */}
        <div className="space-y-2 text-[11px] text-slate-300">
          {asset.caption && <p className="text-slate-400">{asset.caption}</p>}
          {asset.description && (
            <p className="text-slate-400 whitespace-pre-line">
              {asset.description}
            </p>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="space-y-1">
              <div>Type: {asset.type}</div>
              <div>
                Size bytes: {asset.sizeBytes ?? "-"} (
                {formatSize(asset.sizeBytes)})
              </div>
              <div>
                Size MB:{" "}
                {typeof asset.sizeMegabytes === "number"
                  ? asset.sizeMegabytes.toFixed(2)
                  : "-"}
              </div>
              <div>Created: {asset.createdAt}</div>
              <div>Status: {asset.isActive ? "Active" : "Inactive"}</div>
            </div>
            <div className="space-y-1">
              <div className="truncate">
                URL:{" "}
                <Link
                  href={asset.url}
                  target="_blank"
                  className="text-emerald-400 hover:text-emerald-300 break-all"
                >
                  {asset.url}
                </Link>
              </div>
              <div>Extension: {asset.fileExt ?? "-"}</div>
              <div className="truncate">hash: {asset.sha256 ?? "-"}</div>
              <div>last verified: {asset.lastVerifiedISO ?? "-"}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Tags</span>
          </div>

          {assetTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {assetTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onRemoveTag(asset.id, tag.id)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[9px] text-slate-300 hover:border-rose-500/70 hover:text-rose-300"
                  title="Klik untuk hapus tag dari asset"
                >
                  <TagIcon className="h-2 w-2" />
                  {tag.name}
                  <span className="text-[10px] leading-none">×</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-500">Belum ada tag.</p>
          )}

          <div className="flex items-center gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Tambah tag (pisahkan dengan koma)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-[10px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
            />
            <button
              onClick={handleAddTags}
              className="px-3 py-1.5 rounded-md bg-emerald-500/90 text-[10px] font-medium text-slate-950 hover:bg-emerald-400"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
