"use client";
import { Suspense } from "react";
import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

/**
 * TYPES (CLIENT DTO)
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
  caption: string | null;
  description: string | null;
  type: AssetType;
  url: string;
  fileExt: string | null;
  sizeBytes: number | null;
  sizeMegabytes: number | null;
  sha256: string | null;
  lastVerified: string | null;
  isActive: boolean;
  createdAt: string;
  tagIds: number[];
};

/**
 * UTILS
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
 * MAIN PAGE
 */

function AssetsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function setFolderInUrl(id: number | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (id) {
      params.set("folderId", String(id));
    } else {
      params.delete("folderId");
    }

    // ⬇️ penting: kalau ganti folder, assetId dibersihkan
    params.delete("assetId");

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(href, { scroll: false });
  }

  function setAssetInUrl(assetId: number | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (assetId) {
      params.set("assetId", String(assetId));
    } else {
      params.delete("assetId");
    }

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(href, { scroll: false });
  }
  function openDetailAsset(assetId: number) {
    setDetailAssetId(assetId);
    setAssetInUrl(assetId);
  }
  function closeDetailAsset() {
    setDetailAssetId(null);
    setAssetInUrl(null);
  }

  function handleSelectFolder(id: number) {
    setCurrentFolderId(id);
    setFolderInUrl(id);
  }

  /**
   * DATA LOADERS
   */

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

      // ⛔ TIDAK ADA lagi setCurrentFolderId di sini
    } catch (err: any) {
      console.error("loadFolders error:", err);
      setError(err.message || "Failed to fetch folders");
    } finally {
      setLoadingFolders(false);
    }
  }

  async function loadTags() {
    try {
      setLoadingTags(true);
      setError(null);

      const res = await fetch("/api/tags-assets", { cache: "no-store" });
      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch tags";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const raw: any[] = JSON.parse(text);
      const data: Tag[] = raw.map((t) => ({
        id: Number(t.id),
        name: t.name,
      }));

      setTags(data);
    } catch (err: any) {
      console.error("loadTags error:", err);
      setError(err.message || "Failed to fetch tags");
    } finally {
      setLoadingTags(false);
    }
  }

  async function loadAssets(folderId: number) {
    try {
      setLoadingAssets(true);
      setError(null);

      const res = await fetch(`/api/assets?folderId=${folderId}`, {
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
      const data: Asset[] = raw.map((a) => ({
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
        sha256: a.sha256 ?? null,
        lastVerified:
          a.lastVerified ??
          (a.last_verified ? new Date(a.last_verified).toISOString() : null),
        isActive: a.isActive ?? a.is_active ?? true,
        createdAt: a.createdAt ?? a.created_at,
        tagIds: Array.isArray(a.tagIds)
          ? a.tagIds.map((id: any) => Number(id))
          : [], // ⬅️ cukup ini, karena API sekarang pasti kirim tagIds
      }));

      setAssets(data);
    } catch (err: any) {
      console.error("loadAssets error:", err);
      setError(err.message || "Failed to fetch assets");
    } finally {
      setLoadingAssets(false);
    }
  }

  async function reloadAll() {
    await Promise.all([loadFolders(), loadTags()]);
    if (currentFolderId != null) {
      await loadAssets(currentFolderId);
    }
  }

  useEffect(() => {
    // initial load
    loadFolders();
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // 1. Coba baca folderId dari URL
    const folderIdParam = searchParams.get("folderId");

    if (folderIdParam) {
      const id = Number(folderIdParam);
      if (!Number.isNaN(id) && id > 0) {
        if (currentFolderId !== id) {
          setCurrentFolderId(id);
        }
        return; // sudah sinkron dari URL, tidak perlu set default
      }
    }

    // 2. Kalau URL belum punya folderId → pakai default pertama
    if (!currentFolderId && folders.length > 0) {
      const tours = folders.find((f) => f.name.toLowerCase() === "tours");
      const fallbackId = tours ? tours.id : folders[0].id;

      if (currentFolderId !== fallbackId) {
        setCurrentFolderId(fallbackId);
        setFolderInUrl(fallbackId); // sekalian tulis ke URL
      }
    }
  }, [searchParams, folders, currentFolderId]);

  useEffect(() => {
    if (currentFolderId != null) {
      loadAssets(currentFolderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId]);

  useEffect(() => {
    const assetIdParam = searchParams.get("assetId");

    if (assetIdParam) {
      const id = Number(assetIdParam);
      if (!Number.isNaN(id) && id > 0) {
        const exists = assets.some((a) => a.id === id);
        if (exists && detailAssetId !== id) {
          setDetailAssetId(id);
        }
        return;
      }
    }

    // kalau assetId di URL dihapus (back / ganti URL), tutup popup
    if (!assetIdParam && detailAssetId != null) {
      setDetailAssetId(null);
    }
  }, [searchParams, assets, detailAssetId]);

  /**
   * DERIVED
   */

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
      if (currentFolderId != null && a.folderId !== currentFolderId)
        return false;
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
      detailAssetId != null
        ? assets.find((a) => a.id === detailAssetId) ?? null
        : null,
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
   * FOLDER HANDLERS (API)
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

  async function handleSaveFolderName(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { mode, targetFolderId } = folderFormState;
    setSaving(true);
    setError(null);

    try {
      if (mode === "create-root" || mode === "create-sub") {
        const payload: any = { name: trimmed };
        if (mode === "create-sub" && targetFolderId) {
          payload.parent_id = targetFolderId;
        }

        const res = await fetch("/api/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        if (!res.ok) {
          let msg = "Failed to create folder";
          try {
            const err = JSON.parse(text);
            if (err?.message) msg = err.message;
          } catch {}
          throw new Error(msg);
        }

        const created: any = JSON.parse(text);
        const folder: Folder = {
          id: Number(created.id),
          parentId: created.parentId ?? created.parent_id ?? null,
          name: created.name,
          createdAt: created.createdAt ?? created.created_at,
        };

        setFolders((prev) => [...prev, folder]);
        if (folder.parentId && !expandedFolders.includes(folder.parentId)) {
          setExpandedFolders((prev) => [...prev, folder.parentId!]);
        }
        setCurrentFolderId(folder.id);
      } else if (mode === "rename" && targetFolderId != null) {
        const res = await fetch(`/api/folders/${targetFolderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed }),
        });

        const text = await res.text();
        if (!res.ok) {
          let msg = "Failed to rename folder";
          try {
            const err = JSON.parse(text);
            if (err?.message) msg = err.message;
          } catch {}
          throw new Error(msg);
        }

        const updated: any = JSON.parse(text);
        setFolders((prev) =>
          prev.map((f) =>
            f.id === targetFolderId
              ? {
                  ...f,
                  name: updated.name,
                }
              : f
          )
        );
      }
      setFolderFormState((prev) => ({ ...prev, open: false }));
    } catch (err: any) {
      console.error("handleSaveFolderName error:", err);
      setError(err.message || "Failed to save folder");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFolder(folderId: number) {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;
    if (!confirm(`Hapus folder "${folder.name}" beserta isinya?`)) return;

    setDeletingId(folderId);
    setError(null);

    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to delete folder";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      // simplifikasi: reload semua folder & assets
      await loadFolders();
      if (currentFolderId === folderId) {
        setCurrentFolderId(null);
        setAssets([]);
      } else if (currentFolderId != null) {
        await loadAssets(currentFolderId);
      }
    } catch (err: any) {
      console.error("handleDeleteFolder error:", err);
      setError(err.message || "Failed to delete folder");
    } finally {
      setDeletingId(null);
    }
  }

  /**
   * ASSET HANDLERS (API)
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
    closeDetailAsset();
    setAssetFormState({
      open: true,
      mode: "edit",
      folderId: asset?.folderId ?? currentFolderId,
      assetId,
    });
  }

  async function handleSaveAssetForm(data: {
    name: string;
    caption: string;
    description: string;
    file: File | null;
  }) {
    const { mode, assetId, folderId } = assetFormState;
    if (folderId == null) return;

    const name = data.name.trim();
    const caption = data.caption.trim();
    const description = data.description.trim();

    if (!name) {
      setError("Nama asset wajib diisi.");
      return;
    }
    if (mode === "create" && !data.file) {
      setError("File wajib diupload.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (mode === "create") {
        const file = data.file!;
        const formData = new FormData();
        formData.append("folder_id", String(folderId));
        formData.append("name", name);
        formData.append("caption", caption);
        formData.append("description", description);
        formData.append("file", file);

        const res = await fetch("/api/assets/upload", {
          method: "POST",
          body: formData,
        });

        const text = await res.text();
        if (!res.ok) {
          let msg = "Failed to create asset";
          try {
            const err = JSON.parse(text);
            if (err?.message) msg = err.message;
          } catch {}
          throw new Error(msg);
        }

        const created: any = JSON.parse(text);
        const newAsset: Asset = {
          id: Number(created.id),
          folderId: Number(created.folderId ?? created.folder_id),
          name: created.name,
          caption: created.caption ?? null,
          description: created.description ?? null,
          type: created.type,
          url: created.url,
          fileExt: created.fileExt ?? created.file_ext ?? null,
          sizeBytes:
            typeof created.sizeBytes === "number"
              ? created.sizeBytes
              : created.size_bytes != null
              ? Number(created.size_bytes)
              : null,
          sizeMegabytes:
            typeof created.sizeMegabytes === "number"
              ? created.sizeMegabytes
              : created.size_megabytes != null
              ? Number(created.size_megabytes)
              : null,
          sha256: created.sha256 ?? null,
          lastVerified:
            created.lastVerified ??
            (created.last_verified
              ? new Date(created.last_verified).toISOString()
              : null),
          isActive: created.isActive ?? created.is_active ?? true,
          createdAt: created.createdAt ?? created.created_at,
          tagIds: Array.isArray(created.tagIds)
            ? created.tagIds.map((id: any) => Number(id))
            : [],
        };

        if (newAsset.folderId === folderId) {
          setAssets((prev) => [newAsset, ...prev]);
        }
      } else if (mode === "edit" && assetId != null) {
        const file = data.file;

        if (file) {
          // EDIT + GANTI FILE → pakai endpoint upload dengan asset_id
          const formData = new FormData();
          formData.append("asset_id", String(assetId));
          formData.append("folder_id", String(folderId));
          formData.append("name", name);
          formData.append("caption", caption);
          formData.append("description", description);
          formData.append("file", file);

          const res = await fetch("/api/assets/upload", {
            method: "POST",
            body: formData,
          });

          const text = await res.text();
          if (!res.ok) {
            let msg = "Failed to update asset";
            try {
              const err = JSON.parse(text);
              if (err?.message) msg = err.message;
            } catch {}
            throw new Error(msg);
          }

          const updated: any = JSON.parse(text);
          const updatedAsset: Asset = {
            id: Number(updated.id),
            folderId: Number(updated.folderId ?? updated.folder_id),
            name: updated.name,
            caption: updated.caption ?? null,
            description: updated.description ?? null,
            type: updated.type,
            url: updated.url,
            fileExt: updated.fileExt ?? updated.file_ext ?? null,
            sizeBytes:
              typeof updated.sizeBytes === "number"
                ? updated.sizeBytes
                : updated.size_bytes != null
                ? Number(updated.size_bytes)
                : null,
            sizeMegabytes:
              typeof updated.sizeMegabytes === "number"
                ? updated.sizeMegabytes
                : updated.size_megabytes != null
                ? Number(updated.size_megabytes)
                : null,
            sha256: updated.sha256 ?? null,
            lastVerified:
              updated.lastVerified ??
              (updated.last_verified
                ? new Date(updated.last_verified).toISOString()
                : null),
            isActive: updated.isActive ?? updated.is_active ?? true,
            createdAt: updated.createdAt ?? updated.created_at,
            tagIds: Array.isArray(updated.tagIds)
              ? updated.tagIds.map((id: any) => Number(id))
              : [],
          };

          setAssets((prev) =>
            prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
          );
        } else {
          // EDIT TANPA GANTI FILE → PATCH JSON metadata saja
          const basePayload: any = {
            name,
            caption,
            description,
          };

          const res = await fetch(`/api/assets/${assetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(basePayload),
          });

          const text = await res.text();
          if (!res.ok) {
            let msg = "Failed to update asset";
            try {
              const err = JSON.parse(text);
              if (err?.message) msg = err.message;
            } catch {}
            throw new Error(msg);
          }

          const updated: any = JSON.parse(text);
          const updatedAsset: Asset = {
            id: Number(updated.id),
            folderId: Number(updated.folderId ?? updated.folder_id),
            name: updated.name,
            caption: updated.caption ?? null,
            description: updated.description ?? null,
            type: updated.type,
            url: updated.url,
            fileExt: updated.fileExt ?? updated.file_ext ?? null,
            sizeBytes:
              typeof updated.sizeBytes === "number"
                ? updated.sizeBytes
                : updated.size_bytes != null
                ? Number(updated.size_bytes)
                : null,
            sizeMegabytes:
              typeof updated.sizeMegabytes === "number"
                ? updated.sizeMegabytes
                : updated.size_megabytes != null
                ? Number(updated.size_megabytes)
                : null,
            sha256: updated.sha256 ?? null,
            lastVerified:
              updated.lastVerified ??
              (updated.last_verified
                ? new Date(updated.last_verified).toISOString()
                : null),
            isActive: updated.isActive ?? updated.is_active ?? true,
            createdAt: updated.createdAt ?? updated.created_at,
            tagIds: Array.isArray(updated.tagIds)
              ? updated.tagIds.map((id: any) => Number(id))
              : [],
          };

          setAssets((prev) =>
            prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
          );
        }
      }

      setAssetFormState((prev) => ({ ...prev, open: false }));
    } catch (err: any) {
      console.error("handleSaveAssetForm error:", err);
      setError(err.message || "Failed to save asset");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAsset(assetId: number) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    if (!confirm(`Hapus asset "${asset.name}"?`)) return;

    setDeletingId(assetId);
    setError(null);

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to delete asset";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      if (detailAssetId === assetId) closeDetailAsset();
    } catch (err: any) {
      console.error("handleDeleteAsset error:", err);
      setError(err.message || "Failed to delete asset");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleAssetActive(assetId: number) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    const optimistic = !asset.isActive;
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, isActive: optimistic } : a))
    );

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: optimistic }),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to update active status";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const updated: any = JSON.parse(text);
      setAssets((prev) =>
        prev.map((a) =>
          a.id === assetId
            ? {
                ...a,
                isActive: updated.isActive ?? updated.is_active ?? optimistic,
              }
            : a
        )
      );
    } catch (err: any) {
      console.error("handleToggleAssetActive error:", err);
      setError(err.message || "Failed to update active status");
      // rollback
      setAssets((prev) =>
        prev.map((a) =>
          a.id === assetId ? { ...a, isActive: asset.isActive } : a
        )
      );
    }
  }

  /**
   * TAG HANDLERS via API (PATCH /api/assets/[id])
   */

  async function handleAddTagsToAsset(assetId: number, rawInput: string) {
    const rawNames = rawInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (rawNames.length === 0) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addTagNames: rawNames }),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to add tags";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const updated: any = JSON.parse(text);
      const updatedAsset: Asset = {
        id: Number(updated.id),
        folderId: Number(updated.folderId ?? updated.folder_id),
        name: updated.name,
        caption: updated.caption ?? null,
        description: updated.description ?? null,
        type: updated.type,
        url: updated.url,
        fileExt: updated.fileExt ?? updated.file_ext ?? null,
        sizeBytes:
          typeof updated.sizeBytes === "number"
            ? updated.sizeBytes
            : updated.size_bytes != null
            ? Number(updated.size_bytes)
            : null,
        sizeMegabytes:
          typeof updated.sizeMegabytes === "number"
            ? updated.sizeMegabytes
            : updated.size_megabytes != null
            ? Number(updated.size_megabytes)
            : null,
        sha256: updated.sha256 ?? null,
        lastVerified:
          updated.lastVerified ??
          (updated.last_verified
            ? new Date(updated.last_verified).toISOString()
            : null),
        isActive: updated.isActive ?? updated.is_active ?? true,
        createdAt: updated.createdAt ?? updated.created_at,
        tagIds: Array.isArray(updated.tagIds)
          ? updated.tagIds.map((id: any) => Number(id))
          : [],
      };

      setAssets((prev) =>
        prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
      );

      // reload tags master (karena bisa muncul tag baru)
      await loadTags();
    } catch (err: any) {
      console.error("handleAddTagsToAsset error:", err);
      setError(err.message || "Failed to add tags");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveTagFromAsset(assetId: number, tagId: number) {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeTagIds: [tagId] }),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to remove tag";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const updated: any = JSON.parse(text);
      const updatedAsset: Asset = {
        id: Number(updated.id),
        folderId: Number(updated.folderId ?? updated.folder_id),
        name: updated.name,
        caption: updated.caption ?? null,
        description: updated.description ?? null,
        type: updated.type,
        url: updated.url,
        fileExt: updated.fileExt ?? updated.file_ext ?? null,
        sizeBytes:
          typeof updated.sizeBytes === "number"
            ? updated.sizeBytes
            : updated.size_bytes != null
            ? Number(updated.size_bytes)
            : null,
        sizeMegabytes:
          typeof updated.sizeMegabytes === "number"
            ? updated.sizeMegabytes
            : updated.size_megabytes != null
            ? Number(updated.size_megabytes)
            : null,
        sha256: updated.sha256 ?? null,
        lastVerified:
          updated.lastVerified ??
          (updated.last_verified
            ? new Date(updated.last_verified).toISOString()
            : null),
        isActive: updated.isActive ?? updated.is_active ?? true,
        createdAt: updated.createdAt ?? updated.created_at,
        tagIds: Array.isArray(updated.tagIds)
          ? updated.tagIds.map((id: any) => Number(id))
          : [],
      };

      setAssets((prev) =>
        prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
      );
    } catch (err: any) {
      console.error("handleRemoveTagFromAsset error:", err);
      setError(err.message || "Failed to remove tag");
    } finally {
      setSaving(false);
    }
  }

  /**
   * RENDER
   */

  return (
    <div className="space-y-3">
      {/* Header + reload */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-slate-50">
            Assets Manager
          </h1>
          <p className="text-xs text-slate-500">
            Kelola assets (image, video, dokumen) per folder & tags.
          </p>
        </div>
        <button
          type="button"
          onClick={reloadAll}
          disabled={loadingFolders || loadingAssets || loadingTags}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[11px] text-slate-300 hover:bg-slate-900/80 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              loadingFolders || loadingAssets || loadingTags
                ? "animate-spin"
                : ""
            }`}
          />
          Reload
        </button>
      </div>

      {error && (
        <div className="text-[11px] text-rose-200 bg-rose-500/10 border border-rose-500/40 rounded-md px-3 py-2">
          {error}
        </div>
      )}

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

          {loadingFolders ? (
            <div className="flex items-center justify-center py-4 text-[11px] text-slate-500 gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading folders...
            </div>
          ) : folders.length === 0 ? (
            <div className="text-[11px] text-slate-500">
              Belum ada folder. Tambahkan folder root terlebih dahulu.
            </div>
          ) : (
            <FolderTree
              folders={folders}
              currentFolderId={currentFolderId}
              expandedFolders={expandedFolders}
              onToggleExpand={toggleFolderExpand}
              onSelectFolder={handleSelectFolder}
              onCreateSubFolder={openCreateSubFolderForm}
              onRenameFolder={openRenameFolderForm}
              onDeleteFolder={handleDeleteFolder}
              deletingId={deletingId}
            />
          )}
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
            ) : loadingAssets ? (
              <div className="flex items-center justify-center py-6 text-xs text-slate-500 gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading assets...
              </div>
            ) : visibleAssets.length === 0 ? (
              <div className="text-xs text-slate-500">
                Belum ada aset di folder ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visibleAssets.map((asset) => {
                  const assetTags: Tag[] = asset.tagIds
                    .map((tid) => tags.find((t) => t.id === tid))
                    .filter(Boolean) as Tag[];

                  return (
                    <div
                      key={asset.id}
                      onClick={() => openDetailAsset(asset.id)}
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
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[11px] text-slate-400">
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

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (navigator?.clipboard) {
                                  navigator.clipboard
                                    .writeText(asset.url)
                                    .catch((err) => {
                                      console.error("Failed to copy URL:", err);
                                    });
                                }
                              }}
                              className="text-emerald-400 hover:text-emerald-300 text-[11px] underline decoration-dotted"
                            >
                              Copy URL
                            </button>
                          </div>

                          {assetTags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {assetTags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400"
                                >
                                  <TagIcon className="h-2 w-2" />
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {(asset.sha256 || asset.lastVerified) && (
                            <div className="mt-1 text-[11px] text-slate-600 space-y-0.5">
                              {asset.sha256 && (
                                <div className="truncate">
                                  hash: {asset.sha256}
                                </div>
                              )}
                              {asset.lastVerified && (
                                <div>last verified: {asset.lastVerified}</div>
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
                            className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition inline-flex items-center gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAssetActive(asset.id);
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition"
                          >
                            {asset.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAsset(asset.id);
                            }}
                            disabled={deletingId === asset.id}
                            className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition disabled:opacity-50"
                            title="Hapus asset"
                          >
                            {deletingId === asset.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}

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
        saving={saving}
      />

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
        saving={saving}
      />

      <AssetDetailModal
        key={detailAsset?.id ?? "none"}
        open={!!detailAsset}
        asset={detailAsset}
        folder={detailAssetFolder}
        tags={tags}
        onClose={() => closeDetailAsset()}
        onToggleActive={handleToggleAssetActive}
        onDelete={handleDeleteAsset}
        onEdit={(id) => openEditAssetForm(id)}
        onAddTags={handleAddTagsToAsset}
        onRemoveTag={handleRemoveTagFromAsset}
      />
    </div>
  );
}
export default function AssetsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <AssetsPageContent />
    </Suspense>
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
  deletingId: number | null;
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
  deletingId,
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
          deletingId={deletingId}
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
  deletingId: number | null;
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
  deletingId,
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
            className="px-1 py-0.5 rounded-md text-[12px] text-slate-500 hover:text-emerald-400 hover:bg-slate-900 transition"
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
            disabled={deletingId === folder.id}
            className="p-0.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition disabled:opacity-50"
            title="Delete folder"
          >
            {deletingId === folder.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
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
            deletingId={deletingId}
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
  saving: boolean;
};

function FolderFormModal({
  open,
  mode,
  folder,
  onClose,
  onSave,
  saving,
}: FolderFormModalProps) {
  const [name, setName] = useState(folder?.name ?? "");

  if (!open) return null;

  const title =
    mode === "rename"
      ? "Rename Folder"
      : mode === "create-sub"
      ? "Create Subfolder"
      : "Create Root Folder";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(name);
  }

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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Folder name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-[11px] text-slate-400 hover:text-slate-100 hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-emerald-500/90 text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
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
  saving: boolean;
};

function AssetFormModal({
  open,
  mode,
  folderPathLabel,
  asset,
  onClose,
  onSave,
  saving,
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

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      // data: URL → aman dengan img-src 'self' data: https:
      setPreviewUrl(reader.result);
    }
  };
  reader.readAsDataURL(f);

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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
              disabled={saving}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-emerald-500/90 text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
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

  const isImage = asset.type === "image";
  const isVideo = asset.type === "video";

  function handleAddTags() {
    if (!asset) return;
    if (!tagInput.trim()) return;
    onAddTags(asset.id, tagInput);
    setTagInput("");
  }

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
              <div>Created: {asset.createdAt}</div>
              <div>Status: {asset.isActive ? "Active" : "Inactive"}</div>
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  if (navigator?.clipboard) {
                    navigator.clipboard.writeText(asset.url).catch((err) => {
                      console.error("Failed to copy URL:", err);
                    });
                  }
                }}
                className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md border border-slate-700 text-[10px] text-slate-200 hover:bg-slate-900"
              >
                Copy URL
              </button>

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
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-1 text-slate-400">
          <div className="text-[11px]">hash: {asset.sha256 ?? "-"}</div>
          <div className="text-[11px]">
            last verified: {asset.lastVerified ?? "-"}
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
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[12px] text-slate-300 hover:border-rose-500/70 hover:text-rose-300"
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
