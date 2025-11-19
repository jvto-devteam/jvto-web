"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Folder as FolderIcon,
  FolderOpen,
  Image as ImageIcon,
  Video,
  FileText,
  X,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Search,
  Check,
  Trash2,
} from "lucide-react";

type AssetType = "image" | "video" | "document";

type Folder = {
  id: number;
  parentId: number | null;
  name: string;
  createdAt: string;
};

export type AssetsSelectorAsset = {
  id: number;
  folderId: number;
  name: string;
  caption: string | null;
  description: string | null;
  type: AssetType;
  url: string;
  fileExt: string | null;
  sizeBytes: number | null;
  sizeMegabytes: number | null;
  isActive: boolean;
  createdAt: string;
};

type AssetsSelectorFieldProps = {
  label: string;
  description?: string;
  // true = boleh pilih banyak, false = hanya satu
  multiple?: boolean;
  // kalau tidak diisi → semua tipe ("image", "video", "document")
  allowedTypes?: AssetType[];
  // nilai yang disimpan di form/page: ID assets yang dipilih
  valueIds: number[];
  // dipanggil ketika daftar ID berubah (tambah/hapus)
  onChange: (ids: number[]) => void;
  // BARU: primary support
  primaryId?: number | null;
  onPrimaryChange?: (id: number | null) => void;
};

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
 * FIELD COMPONENT
 * - punya tombol untuk buka popup
 * - menampilkan preview assets yang dipilih
 * - bisa hapus item dari pilihan
 */
export function AssetsSelectorField({
  label,
  description,
  multiple = true,
  allowedTypes,
  valueIds,
  onChange,
  primaryId,
  onPrimaryChange,
}: AssetsSelectorFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [previewAssets, setPreviewAssets] = useState<AssetsSelectorAsset[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // load detail asset kalau valueIds berubah dan belum ada di preview
  useEffect(() => {
    const loadMissingAssets = async () => {
      const existingIds = new Set(previewAssets.map((a) => a.id));
      const missingIds = valueIds.filter((id) => !existingIds.has(id));

      if (missingIds.length === 0) return;
      setLoadingPreview(true);

      try {
        const fetched: AssetsSelectorAsset[] = [];

        await Promise.all(
          missingIds.map(async (id) => {
            try {
              const res = await fetch(`/api/assets/${id}`, {
                cache: "no-store",
              });
              const text = await res.text();
              if (!res.ok) return;
              const a: any = JSON.parse(text);
              fetched.push({
                id: Number(a.id),
                folderId: Number(a.folderId ?? a.folder_id),
                name: a.name,
                caption: a.caption ?? null,
                description: a.description ?? null,
                type: a.type,
                url: a.url,
                fileExt: a.fileExt ?? a.file_ext ?? null,
                sizeBytes:
                  typeof a.sizeBytes === "number"
                    ? a.sizeBytes
                    : a.size_bytes != null
                    ? Number(a.size_bytes)
                    : null,
                sizeMegabytes:
                  typeof a.sizeMegabytes === "number"
                    ? a.sizeMegabytes
                    : a.size_megabytes != null
                    ? Number(a.size_megabytes)
                    : null,
                isActive: a.isActive ?? a.is_active ?? true,
                createdAt: a.createdAt ?? a.created_at,
              });
            } catch (e) {
              console.error("Failed to load asset detail", e);
            }
          })
        );

        if (fetched.length > 0) {
          setPreviewAssets((prev) => {
            const map = new Map<number, AssetsSelectorAsset>();
            for (const a of prev) map.set(a.id, a);
            for (const a of fetched) map.set(a.id, a);
            return Array.from(map.values()).filter((a) =>
              valueIds.includes(a.id)
            );
          });
        }
      } finally {
        setLoadingPreview(false);
      }
    };

    if (valueIds.length > 0) {
      loadMissingAssets();
    } else {
      setPreviewAssets([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(valueIds)]);

  // sinkronisasi kalau valueIds berubah (misal ada yang dihapus)
  useEffect(() => {
    setPreviewAssets((prev) => prev.filter((a) => valueIds.includes(a.id)));
  }, [valueIds]);

  function handleRemove(id: number) {
    if (multiple) {
      const nextIds = valueIds.filter((x) => x !== id);
      onChange(nextIds);
      if (primaryId != null && primaryId === id && onPrimaryChange) {
        onPrimaryChange(null); // primary di-reset kalau dihapus
      }
    } else {
      onChange([]);
      if (onPrimaryChange) {
        onPrimaryChange(null);
      }
    }
  }

  return (
    <div className="border border-slate-800 rounded-lg p-3 space-y-2 bg-slate-950/70">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{label}</h3>
          {description && (
            <p className="text-[11px] text-slate-500">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="px-2 py-1 rounded-md text-[11px] bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800"
        >
          Pilih Assets
        </button>
      </div>

      <p className="text-[11px] text-slate-500">
        {valueIds.length} asset terpilih.
      </p>

      {/* Preview cards */}
      {loadingPreview && valueIds.length > 0 && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Memuat preview...
        </div>
      )}

      {valueIds.length === 0 && !loadingPreview && (
        <p className="text-[11px] text-slate-500 italic">
          Belum ada asset yang dipilih.
        </p>
      )}

      {previewAssets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {previewAssets.map((asset) => {
            const isPrimary = primaryId != null && primaryId === asset.id;

            return (
              <div
                key={asset.id}
                className="border border-slate-800 rounded-md overflow-hidden bg-slate-950/80 flex flex-col"
              >
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  {/* image / type preview */}
                  {asset.type === "image" ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : asset.type === "video" ? (
                    <div className="text-[10px] text-slate-400 px-2 text-center">
                      VIDEO
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 px-2 text-center">
                      DOCUMENT
                    </div>
                  )}

                  {/* Tombol hapus */}
                  <button
                    type="button"
                    onClick={() => handleRemove(asset.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-slate-300 hover:text-rose-300 hover:bg-black"
                    title="Hapus dari pilihan"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>

                  {/* Tombol set primary */}
                  {onPrimaryChange && (
                    <button
                      type="button"
                      onClick={() =>
                        onPrimaryChange(isPrimary ? null : asset.id)
                      }
                      className={[
                        "absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full text-[10px] border",
                        isPrimary
                          ? "bg-amber-400 text-slate-900 border-amber-300"
                          : "bg-black/60 text-slate-200 border-slate-600 hover:bg-black",
                      ].join(" ")}
                    >
                      {isPrimary ? "Primary" : "Set Primary"}
                    </button>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-100 truncate">
                    {asset.name}
                  </div>
                  {asset.caption && (
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {asset.caption}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 flex justify-between gap-2">
                    <span>ID: #{asset.id}</span>
                    <span>{formatSize(asset.sizeBytes)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup picker internal */}
      <AssetsPickerInternal
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        multiple={multiple}
        allowedTypes={allowedTypes}
        initialSelectedIds={valueIds}
        title={label}
        onConfirm={(selectedIds, selectedAssets) => {
          onChange(selectedIds); // kirim hanya ID ke parent
          setPreviewAssets(selectedAssets); // untuk preview lokal
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}

/**
 * INTERNAL POPUP PICKER
 * (versi disederhanakan dari AssetsManager, tapi multi-folder aware)
 */

type AssetsPickerInternalProps = {
  open: boolean;
  multiple?: boolean;
  allowedTypes?: AssetType[];
  initialSelectedIds?: number[];
  onConfirm: (
    selectedIds: number[],
    selectedAssets: AssetsSelectorAsset[]
  ) => void;
  onClose: () => void;
  title?: string;
};

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

function AssetsPickerInternal({
  open,
  multiple = true,
  allowedTypes,
  initialSelectedIds,
  onConfirm,
  onClose,
  title = "Pilih Assets",
}: AssetsPickerInternalProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<AssetsSelectorAsset[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialSelectedIds ?? []
  );
  const [selectedMap, setSelectedMap] = useState<
    Record<number, AssetsSelectorAsset>
  >({});

  const effectiveAllowedTypes: AssetType[] = useMemo(() => {
    if (!allowedTypes || allowedTypes.length === 0) {
      return ["image", "video", "document"];
    }
    return allowedTypes;
  }, [allowedTypes]);

  useEffect(() => {
    if (open) {
      setError(null);
      setSearch("");
      setSelectedIds(initialSelectedIds ?? []);
      setSelectedMap({});
      loadFolders();
    } else {
      setFolders([]);
      setAssets([]);
      setCurrentFolderId(null);
      setExpandedFolders([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function loadFolders() {
    try {
      setLoadingFolders(true);
      setError(null);

      const res = await fetch("/api/folders", { cache: "no-store" });
      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch folders";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const raw: any[] = JSON.parse(text);
      const data: Folder[] = raw.map((f) => ({
        id: Number(f.id),
        parentId: f.parentId ?? f.parent_id ?? null,
        name: f.name,
        createdAt: f.createdAt ?? f.created_at,
      }));

      setFolders(data);

      const rootIds = data.filter((f) => f.parentId === null).map((f) => f.id);
      setExpandedFolders(rootIds);

      if (!currentFolderId && data.length > 0) {
        const tours = data.find(
          (f) => f.name && f.name.toLowerCase() === "tours"
        );
        const defaultId = tours ? tours.id : data[0].id;
        setCurrentFolderId(defaultId);
      }
    } catch (err: any) {
      console.error("loadFolders error:", err);
      setError(err.message || "Failed to fetch folders");
    } finally {
      setLoadingFolders(false);
    }
  }

  async function loadAssetsForFolder(folderId: number) {
    try {
      setLoadingAssets(true);
      setError(null);

      const singleType =
        effectiveAllowedTypes.length === 1 ? effectiveAllowedTypes[0] : null;

      const params = new URLSearchParams();
      params.set("folderId", String(folderId));
      if (singleType) {
        params.set("type", singleType);
      }

      const res = await fetch(`/api/assets?${params.toString()}`, {
        cache: "no-store",
      });
      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch assets";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const raw: any[] = JSON.parse(text);
      const data: AssetsSelectorAsset[] = raw.map((a) => ({
        id: Number(a.id),
        folderId: Number(a.folderId ?? a.folder_id),
        name: a.name,
        caption: a.caption ?? null,
        description: a.description ?? null,
        type: a.type,
        url: a.url,
        fileExt: a.fileExt ?? a.file_ext ?? null,
        sizeBytes:
          typeof a.sizeBytes === "number"
            ? a.sizeBytes
            : a.size_bytes != null
            ? Number(a.size_bytes)
            : null,
        sizeMegabytes:
          typeof a.sizeMegabytes === "number"
            ? a.sizeMegabytes
            : a.size_megabytes != null
            ? Number(a.size_megabytes)
            : null,
        isActive: a.isActive ?? a.is_active ?? true,
        createdAt: a.createdAt ?? a.created_at,
      }));

      setAssets(data);

      setSelectedMap((prev) => {
        const next = { ...prev };
        for (const a of data) {
          if (selectedIds.includes(a.id)) {
            next[a.id] = a;
          }
        }
        return next;
      });
    } catch (err: any) {
      console.error("loadAssetsForFolder error:", err);
      setError(err.message || "Failed to fetch assets");
    } finally {
      setLoadingAssets(false);
    }
  }

  useEffect(() => {
    if (open && currentFolderId != null) {
      loadAssetsForFolder(currentFolderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId, open]);

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
      if (!effectiveAllowedTypes.includes(a.type)) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.caption || "").toLowerCase().includes(q)
      );
    });
  }, [assets, effectiveAllowedTypes, search]);

  function toggleFolderExpand(id: number) {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSelectFolder(id: number) {
    setCurrentFolderId(id);
  }

  function handleToggleSelect(asset: AssetsSelectorAsset) {
    setSelectedIds((prev) => {
      if (multiple) {
        return prev.includes(asset.id)
          ? prev.filter((id) => id !== asset.id)
          : [...prev, asset.id];
      }
      return prev.includes(asset.id) ? [] : [asset.id];
    });

    setSelectedMap((prev) => {
      const next = { ...prev };
      const exists = !!next[asset.id];
      if (exists) {
        delete next[asset.id];
      } else {
        next[asset.id] = asset;
      }
      return next;
    });
  }

  function handleConfirm() {
    const assetsArr = Object.values(selectedMap).filter((a) =>
      selectedIds.includes(a.id)
    );
    onConfirm(selectedIds, assetsArr);
  }

  async function handleReloadAll() {
    try {
      setReloading(true);
      await loadFolders();
      if (currentFolderId != null) {
        await loadAssetsForFolder(currentFolderId);
      }
    } finally {
      setReloading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70">
      <div className="w-full max-w-5xl max-h-[90vh] rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/90">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
            <p className="text-[11px] text-slate-500">
              {multiple
                ? "Pilih satu atau beberapa assets."
                : "Pilih satu asset."}{" "}
              Tipe yang diizinkan: {effectiveAllowedTypes.join(", ")}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReloadAll}
              disabled={loadingFolders || loadingAssets || reloading}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-700 text-[11px] text-slate-300 hover:bg-slate-900 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loadingFolders || loadingAssets || reloading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Reload
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-100 hover:bg-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-2 text-[11px] text-rose-200 bg-rose-500/10 border-b border-rose-500/40">
            {error}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 grid grid-cols-[260px,minmax(0,1fr)] gap-3 px-4 py-3 overflow-hidden">
          {/* Folder Tree */}
          <div className="border border-slate-800/80 bg-slate-950/80 rounded-lg p-2 flex flex-col overflow-hidden">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Folder
            </div>

            {loadingFolders && folders.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-[11px] text-slate-500 gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading folders...
              </div>
            ) : folders.length === 0 ? (
              <div className="text-[11px] text-slate-500">
                Belum ada folder.
              </div>
            ) : (
              <div className="mt-1 overflow-y-auto max-h-[300px] text-[11px] text-slate-300">
                {folders
                  .filter((f) => f.parentId === null)
                  .map((folder) => (
                    <FolderNodeSimple
                      key={folder.id}
                      folder={folder}
                      folders={folders}
                      level={0}
                      currentFolderId={currentFolderId}
                      expandedFolders={expandedFolders}
                      onToggleExpand={toggleFolderExpand}
                      onSelectFolder={handleSelectFolder}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Assets list + search */}
          <div className="flex flex-col overflow-hidden gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                {folderPath.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentFolder) return;
                        if (currentFolder.parentId == null) return;
                        handleSelectFolder(currentFolder.parentId);
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
                            type="button"
                            onClick={() => handleSelectFolder(f.id)}
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

              <div className="relative w-56">
                <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari asset di folder ini..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-md pl-7 pr-2 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/60"
                />
              </div>
            </div>

            {/* Assets list with PREVIEW */}
            <div className="flex-1 border border-slate-800 bg-slate-950/80 rounded-lg p-2 overflow-auto min-h-[220px]">
              {currentFolderId == null ? (
                <div className="text-[11px] text-slate-500">
                  Pilih folder di kiri terlebih dahulu.
                </div>
              ) : loadingAssets && assets.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-[11px] text-slate-500 gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading assets...
                </div>
              ) : visibleAssets.length === 0 ? (
                <div className="text-[11px] text-slate-500">
                  Tidak ada asset yang cocok di folder ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {visibleAssets.map((asset) => {
                    const isSelected = selectedIds.includes(asset.id);
                    const disabled = !asset.isActive;

                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => !disabled && handleToggleSelect(asset)}
                        className={[
                          "group text-left border rounded-md px-2 py-2 flex flex-col gap-2 transition relative",
                          disabled
                            ? "border-slate-800 bg-slate-900/40 opacity-70 cursor-not-allowed"
                            : isSelected
                            ? "border-emerald-500/70 bg-emerald-500/5"
                            : "border-slate-800/80 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-slate-900/80",
                        ].join(" ")}
                      >
                        {/* Checkbox / indicator */}
                        <div className="absolute right-1.5 top-1.5">
                          <span
                            className={[
                              "inline-flex items-center justify-center h-4 w-4 rounded-full border text-[10px]",
                              isSelected
                                ? "bg-emerald-500 text-slate-950 border-emerald-400"
                                : "border-slate-700 text-slate-600 bg-slate-950/90",
                            ].join(" ")}
                          >
                            {isSelected ? <Check className="h-3 w-3" /> : ""}
                          </span>
                        </div>

                        {/* PREVIEW + TEXT */}
                        <div className="flex items-start gap-2">
                          {/* preview area */}
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-900 flex items-center justify-center flex-shrink-0">
                            {asset.type === "image" ? (
                              <img
                                src={asset.url}
                                alt={asset.name}
                                className="w-full h-full object-cover"
                              />
                            ) : asset.type === "video" ? (
                              <span className="text-[9px] text-slate-300 px-1 text-center">
                                VIDEO
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-300 px-1 text-center">
                                DOC
                              </span>
                            )}
                          </div>

                          {/* text info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-[12px] font-semibold text-slate-100 truncate">
                                {asset.name}
                              </div>
                              {!asset.isActive && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
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

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                {getTypeIcon(asset.type)}
                                <span>{asset.type}</span>
                              </span>
                              {asset.fileExt && (
                                <span className="uppercase text-slate-400">
                                  · {asset.fileExt}
                                </span>
                              )}
                              <span>· {formatSize(asset.sizeBytes)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="text-[11px] text-slate-500">
            {selectedIds.length} asset terpilih.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-[11px] text-slate-400 hover:text-slate-100 hover:bg-slate-900"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-emerald-500/90 text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              Pilih ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type FolderNodeSimpleProps = {
  folder: Folder;
  folders: Folder[];
  level: number;
  currentFolderId: number | null;
  expandedFolders: number[];
  onToggleExpand: (id: number) => void;
  onSelectFolder: (id: number) => void;
};

function FolderNodeSimple({
  folder,
  folders,
  level,
  currentFolderId,
  expandedFolders,
  onToggleExpand,
  onSelectFolder,
}: FolderNodeSimpleProps) {
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
            type="button"
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
      </div>

      {isExpanded &&
        children.length > 0 &&
        children.map((child) => (
          <FolderNodeSimple
            key={child.id}
            folder={child}
            folders={folders}
            level={level + 1}
            currentFolderId={currentFolderId}
            expandedFolders={expandedFolders}
            onToggleExpand={onToggleExpand}
            onSelectFolder={onSelectFolder}
          />
        ))}
    </div>
  );
}
