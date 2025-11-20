"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  MapPin,
  Globe,
  Mountain,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";

/* =========================================================
   TYPES
   ========================================================= */
type FormTab =
  | "basic"
  | "geo"
  | "safety"
  | "attractions"
  | "timing"
  | "media"
  | "meta";
type Destination = {
  id: number;
  code: string | null;
  name: string;

  category: string | null;
  region: string | null;
  province: string | null;
  country: string | null;

  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  area_hectares: number | null;

  terrain: string | null;
  best_time_to_visit: string | null;
  difficulty_level: string | null;
  duration: string | null;
  physical_demand: number | null;
  cultural_depth: number | null;
  photo_potential: number | null;
  weather_by_season: string | null;
  rainfall_intensity: string | null;
  temperature_range: string | null;
  trail_details: string | null;

  required_gear: string | null; // UI pakai text → backend parse JSON kalau mau
  summary: string | null;
  description: string | null;
  highlight: string | null;
  main_attractions: string | null; // sama: text → JSON
  key_highlights: string[];

  permit_required: boolean | null;
  permit_details: string | null;
  guide_required: boolean | null;

  facilities: string | null;
  safety_notes: string | null;
  risk_factors: string | null;
  environmental_factors: string | null;
  emergency_contacts: string | null;

  physical_requirements: string | null;
  cultural_context: string | null;

  local_tribes: string[];
  rituals_festivals: string | null;
  tips_for_visitors: string | null;

  thumbnail_url: string | null;
  featured_image: string | null;
  published: boolean | null;
  featured: boolean | null;
  seo_title: string | null;
  seo_description: string | null;

  tags: string[];
  types: string[];
  slug: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

type FormState = {
  code: string;
  name: string;

  category: string;
  region: string;
  province: string;
  country: string;

  latitude: string;
  longitude: string;
  altitude: string;
  area_hectares: string;

  terrain: string;
  best_time_to_visit: string;
  difficulty_level: string;
  duration: string;
  physical_demand: string;
  cultural_depth: string;
  photo_potential: string;
  weather_by_season: string;
  rainfall_intensity: string;
  temperature_range: string;
  trail_details: string;

  required_gear: string;
  summary: string;
  description: string;
  highlight: string;
  main_attractions: string;
  key_highlights: string; // comma separated

  permit_required: boolean;
  permit_details: string;
  guide_required: boolean;

  facilities: string;
  safety_notes: string;
  risk_factors: string;
  environmental_factors: string;
  emergency_contacts: string;

  physical_requirements: string;
  cultural_context: string;

  local_tribes: string; // comma separated
  rituals_festivals: string;
  tips_for_visitors: string;

  thumbnail_url: string;
  featured_image: string;
  published: boolean;
  featured: boolean;
  seo_title: string;
  seo_description: string;

  tags: string; // comma separated
  types: string; // comma separated
  slug: string;
};

const emptyForm: FormState = {
  code: "",
  name: "",

  category: "",
  region: "",
  province: "",
  country: "",

  latitude: "",
  longitude: "",
  altitude: "",
  area_hectares: "",

  terrain: "",
  best_time_to_visit: "",
  difficulty_level: "",
  duration: "",
  physical_demand: "",
  cultural_depth: "",
  photo_potential: "",
  weather_by_season: "",
  rainfall_intensity: "",
  temperature_range: "",
  trail_details: "",

  required_gear: "",
  summary: "",
  description: "",
  highlight: "",
  main_attractions: "",
  key_highlights: "",

  permit_required: false,
  permit_details: "",
  guide_required: false,

  facilities: "",
  safety_notes: "",
  risk_factors: "",
  environmental_factors: "",
  emergency_contacts: "",

  physical_requirements: "",
  cultural_context: "",

  local_tribes: "",
  rituals_festivals: "",
  tips_for_visitors: "",

  thumbnail_url: "",
  featured_image: "",
  published: false,
  featured: false,
  seo_title: "",
  seo_description: "",

  tags: "",
  types: "",
  slug: "",
};

type DestinationAssetType = "primary" | "secondary";

type DestinationAsset = {
  id: number;
  destination_id: number;
  asset_id: number;
  type: DestinationAssetType;
  asset?: {
    id: number;
    name: string;
    url: string;
    caption: string | null;
    type: "image" | "video" | "document";
  } | null;
};

type PickerAsset = {
  id: number;
  name: string;
  url: string;
  caption: string | null;
  type: "image" | "video" | "document";
};

type PendingDestAsset = {
  asset: PickerAsset;
  type: DestinationAssetType;
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function CmsDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  // destination_assets (edit mode)
  const [destinationAssets, setDestinationAssets] = useState<
    DestinationAsset[]
  >([]);
  const [loadingDestAssets, setLoadingDestAssets] = useState(false);
  const [savingDestAsset, setSavingDestAsset] = useState(false);
  const [deletingDestAssetId, setDeletingDestAssetId] = useState<number | null>(
    null
  );
  const [assetIdInput, setAssetIdInput] = useState("");

  // pending assets (add mode)
  const [pendingAssets, setPendingAssets] = useState<PendingDestAsset[]>([]);

  // asset picker popup
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [assetPickerTargetType, setAssetPickerTargetType] =
    useState<DestinationAssetType | null>(null);
  const [activeTab, setActiveTab] = useState<FormTab>("basic");

  /* ------------------------- Helpers ------------------------- */
  const parseNumberOrNull = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  };

  const parseArrayFromCommaString = (value: string): string[] =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const joinArrayToCommaString = (arr?: string[] | null): string =>
    Array.isArray(arr) ? arr.join(", ") : "";

  /* ------------------------- Load Destinations ------------------------- */

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/destinations", {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to fetch destinations";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data: any[] = JSON.parse(text);
      const normalized: Destination[] = data.map((d) => ({
        id: Number(d.id),
        code: d.code ?? null,
        name: d.name,
        slug: d.slug ?? null,
        thumbnail_url: d.thumbnail_url ?? null,
        description: d.description ?? null,
        weather_by_season: d.weather_by_season ?? null,
        rainfall_intensity: d.rainfall_intensity ?? null,
        trail_details: d.trail_details ?? null,
        required_gear: d.required_gear ?? null,
        difficulty_level: d.difficulty_level ?? null,
        environmental_factors: d.environmental_factors ?? null,
        physical_requirements: d.physical_requirements ?? null,
        main_attractions: d.main_attractions ?? null,
        best_time_to_visit: d.best_time_to_visit ?? null,
        tips_for_visitors: d.tips_for_visitors ?? null,
        highlight: d.highlight ?? null,

        types: Array.isArray(d.types) ? d.types : [],
        lat:
          typeof d.lat === "number"
            ? d.lat
            : d.lat != null
            ? Number(d.lat)
            : null,
        long:
          typeof d.long === "number"
            ? d.long
            : d.long != null
            ? Number(d.long)
            : null,
        elevation_m:
          typeof d.elevation_m === "number"
            ? d.elevation_m
            : d.elevation_m != null
            ? Number(d.elevation_m)
            : null,
        key_highlights: Array.isArray(d.key_highlights) ? d.key_highlights : [],
        temperature_range: d.temperature_range ?? null,
        terrain: d.terrain ?? null,
        safety_advisory: Array.isArray(d.safety_advisory)
          ? d.safety_advisory
          : [],

        created_at: d.created_at ?? null,
        updated_at: d.updated_at ?? null,
      }));

      setDestinations(normalized);
    } catch (err: any) {
      console.error("loadDestinations error:", err);
      setError(err.message || "Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  /* ------------------------- Destination Assets ------------------------- */

  const loadDestinationAssets = async (destinationId: number) => {
    try {
      setLoadingDestAssets(true);
      setError(null);

      const res = await fetch(
        `/api/destination-assets?destination_id=${destinationId}`,
        { cache: "no-store" }
      );
      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch destination assets";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data: any[] = JSON.parse(text);
      const normalized: DestinationAsset[] = data.map((row) => ({
        id: Number(row.id),
        destination_id: Number(row.destination_id ?? row.destinationId),
        asset_id: Number(row.asset_id ?? row.assetId),
        type: row.type as DestinationAssetType,
        asset: row.asset
          ? {
              id: Number(row.asset.id),
              name: row.asset.name,
              url: row.asset.url,
              caption: row.asset.caption ?? null,
              type: row.asset.type,
            }
          : null,
      }));

      setDestinationAssets(normalized);
    } catch (err: any) {
      console.error("loadDestinationAssets error:", err);
      setError(err.message || "Failed to fetch destination assets");
    } finally {
      setLoadingDestAssets(false);
    }
  };

  const handleAddDestinationAsset = async (
    type: DestinationAssetType,
    assetIdOverride?: number
  ) => {
    if (!editingId) return;

    const assetId = assetIdOverride ?? Number(assetIdInput);
    if (!assetId || Number.isNaN(assetId) || assetId <= 0) {
      setError("asset_id tidak valid");
      return;
    }

    setSavingDestAsset(true);
    setError(null);

    try {
      const res = await fetch("/api/destination-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_id: editingId,
          asset_id: assetId,
          type,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to add destination asset";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const row: any = JSON.parse(text);
      const da: DestinationAsset = {
        id: Number(row.id),
        destination_id: Number(row.destination_id ?? row.destinationId),
        asset_id: Number(row.asset_id ?? row.assetId),
        type: row.type as DestinationAssetType,
        asset: row.asset
          ? {
              id: Number(row.asset.id),
              name: row.asset.name,
              url: row.asset.url,
              caption: row.asset.caption ?? null,
              type: row.asset.type,
            }
          : null,
      };

      setDestinationAssets((prev) => [da, ...prev]);
      setAssetIdInput("");
    } catch (err: any) {
      console.error("handleAddDestinationAsset error:", err);
      setError(err.message || "Failed to add destination asset");
    } finally {
      setSavingDestAsset(false);
    }
  };

  const handleUpdateDestinationAssetType = async (
    id: number,
    type: DestinationAssetType
  ) => {
    setSavingDestAsset(true);
    setError(null);

    try {
      const res = await fetch(`/api/destination-assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to update image type";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const row: any = JSON.parse(text);
      const updated: DestinationAsset = {
        id: Number(row.id),
        destination_id: Number(row.destination_id ?? row.destinationId),
        asset_id: Number(row.asset_id ?? row.assetId),
        type: row.type as DestinationAssetType,
        asset: row.asset
          ? {
              id: Number(row.asset.id),
              name: row.asset.name,
              url: row.asset.url,
              caption: row.asset.caption ?? null,
              type: row.asset.type,
            }
          : null,
      };

      setDestinationAssets((prev) =>
        prev.map((da) => (da.id === updated.id ? updated : da))
      );
    } catch (err: any) {
      console.error("handleUpdateDestinationAssetType error:", err);
      setError(err.message || "Failed to update image type");
    } finally {
      setSavingDestAsset(false);
    }
  };

  const handleDeleteDestinationAsset = async (id: number) => {
    if (!confirm("Yakin hapus image ini dari destination?")) return;

    setDeletingDestAssetId(id);
    setError(null);

    try {
      const res = await fetch(`/api/destination-assets/${id}`, {
        method: "DELETE",
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = "Failed to delete destination asset";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      setDestinationAssets((prev) => prev.filter((da) => da.id !== id));
    } catch (err: any) {
      console.error("handleDeleteDestinationAsset error:", err);
      setError(err.message || "Failed to delete destination asset");
    } finally {
      setDeletingDestAssetId(null);
    }
  };

  /* ------------------------- Pending Assets (ADD) ------------------------- */

  const handleRemovePendingAsset = (index: number) => {
    setPendingAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangePendingType = (
    index: number,
    type: DestinationAssetType
  ) => {
    setPendingAssets((prev) =>
      prev.map((item, i) => (i === index ? { ...item, type } : item))
    );
  };

  /* ------------------------- Modal Open / Close ------------------------- */

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDestinationAssets([]);
    setPendingAssets([]);
    setAssetIdInput("");
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (d: Destination) => {
    setEditingId(d.id);
    setForm({
      code: d.code ?? "",
      name: d.name,

      category: d.category ?? "",
      region: d.region ?? "",
      province: d.province ?? "",
      country: d.country ?? "",

      latitude: d.latitude != null ? String(d.latitude) : "",
      longitude: d.longitude != null ? String(d.longitude) : "",
      altitude: d.altitude != null ? String(d.altitude) : "",
      area_hectares: d.area_hectares != null ? String(d.area_hectares) : "",

      terrain: d.terrain ?? "",
      best_time_to_visit: d.best_time_to_visit ?? "",
      difficulty_level: d.difficulty_level ?? "",
      duration: d.duration ?? "",
      physical_demand:
        d.physical_demand != null ? String(d.physical_demand) : "",
      cultural_depth: d.cultural_depth != null ? String(d.cultural_depth) : "",
      photo_potential:
        d.photo_potential != null ? String(d.photo_potential) : "",
      weather_by_season: d.weather_by_season ?? "",
      rainfall_intensity: d.rainfall_intensity ?? "",
      temperature_range: d.temperature_range ?? "",
      trail_details: d.trail_details ?? "",

      required_gear: d.required_gear ?? "",
      summary: d.summary ?? "",
      description: d.description ?? "",
      highlight: d.highlight ?? "",
      main_attractions: d.main_attractions ?? "",
      key_highlights: joinArrayToCommaString(d.key_highlights),

      permit_required: Boolean(d.permit_required),
      permit_details: d.permit_details ?? "",
      guide_required: Boolean(d.guide_required),

      facilities: d.facilities ?? "",
      safety_notes: d.safety_notes ?? "",
      risk_factors: d.risk_factors ?? "",
      environmental_factors: d.environmental_factors ?? "",
      emergency_contacts: d.emergency_contacts ?? "",

      physical_requirements: d.physical_requirements ?? "",
      cultural_context: d.cultural_context ?? "",

      local_tribes: joinArrayToCommaString(d.local_tribes),
      rituals_festivals: d.rituals_festivals ?? "",
      tips_for_visitors: d.tips_for_visitors ?? "",

      thumbnail_url: d.thumbnail_url ?? "",
      featured_image: d.featured_image ?? "",
      published: Boolean(d.published),
      featured: Boolean(d.featured),
      seo_title: d.seo_title ?? "",
      seo_description: d.seo_description ?? "",

      tags: joinArrayToCommaString(d.tags),
      types: joinArrayToCommaString(d.types),
      slug: d.slug ?? "",
    });

    setIsModalOpen(true);
    setError(null);
    setAssetIdInput("");
    setPendingAssets([]);
    loadDestinationAssets(d.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setDestinationAssets([]);
    setPendingAssets([]);
    setAssetIdInput("");
    setIsAssetPickerOpen(false);
    setAssetPickerTargetType(null);
    setActiveTab("basic"); // reset tab
  };

  /* ------------------------- Submit Destination ------------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = form.name.trim();
    if (!name) {
      setError("Name wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        code: form.code.trim() || null,
        name,

        category: form.category.trim() || null,
        region: form.region.trim() || null,
        province: form.province.trim() || null,
        country: form.country.trim() || null,

        latitude: parseNumberOrNull(form.latitude),
        longitude: parseNumberOrNull(form.longitude),
        altitude: parseNumberOrNull(form.altitude),
        area_hectares: parseNumberOrNull(form.area_hectares),

        terrain: form.terrain.trim() || null,
        best_time_to_visit: form.best_time_to_visit.trim() || null,
        difficulty_level: form.difficulty_level.trim() || null,
        duration: form.duration.trim() || null,
        physical_demand: parseNumberOrNull(form.physical_demand),
        cultural_depth: parseNumberOrNull(form.cultural_depth),
        photo_potential: parseNumberOrNull(form.photo_potential),
        weather_by_season: form.weather_by_season.trim() || null,
        rainfall_intensity: form.rainfall_intensity.trim() || null,
        temperature_range: form.temperature_range.trim() || null,
        trail_details: form.trail_details.trim() || null,

        required_gear: form.required_gear.trim() || null,
        summary: form.summary.trim() || null,
        description: form.description.trim() || null,
        highlight: form.highlight.trim() || null,
        main_attractions: form.main_attractions.trim() || null,

        key_highlights: parseArrayFromCommaString(form.key_highlights),

        permit_required: form.permit_required,
        permit_details: form.permit_details.trim() || null,
        guide_required: form.guide_required,

        facilities: form.facilities.trim() || null,
        safety_notes: form.safety_notes.trim() || null,
        risk_factors: form.risk_factors.trim() || null,
        environmental_factors: form.environmental_factors.trim() || null,
        emergency_contacts: form.emergency_contacts.trim() || null,

        physical_requirements: form.physical_requirements.trim() || null,
        cultural_context: form.cultural_context.trim() || null,

        local_tribes: parseArrayFromCommaString(form.local_tribes),
        rituals_festivals: form.rituals_festivals.trim() || null,
        tips_for_visitors: form.tips_for_visitors.trim() || null,

        thumbnail_url: form.thumbnail_url.trim() || null,
        featured_image: form.featured_image.trim() || null,
        published: form.published,
        featured: form.featured,
        seo_title: form.seo_title.trim() || null,
        seo_description: form.seo_description.trim() || null,

        tags: parseArrayFromCommaString(form.tags),
        types: parseArrayFromCommaString(form.types),
        slug: form.slug.trim() || null,
      };

      const url = editingId
        ? `/api/destinations/${editingId}`
        : "/api/destinations";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) {
        let msg = editingId
          ? "Gagal menyimpan perubahan destination"
          : "Gagal menambahkan destination";

        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {
          // ignore
        }

        throw new Error(msg);
      }

      const data: any = JSON.parse(text);
      const savedDest: Destination = {
        id: Number(data.id),
        code: data.code ?? null,
        name: data.name,
        slug: data.slug ?? null,
        thumbnail_url: data.thumbnail_url ?? null,
        description: data.description ?? null,
        weather_by_season: data.weather_by_season ?? null,
        rainfall_intensity: data.rainfall_intensity ?? null,
        trail_details: data.trail_details ?? null,
        required_gear: data.required_gear ?? null,
        difficulty_level: data.difficulty_level ?? null,
        environmental_factors: data.environmental_factors ?? null,
        physical_requirements: data.physical_requirements ?? null,
        main_attractions: data.main_attractions ?? null,
        best_time_to_visit: data.best_time_to_visit ?? null,
        tips_for_visitors: data.tips_for_visitors ?? null,
        highlight: data.highlight ?? null,

        types: Array.isArray(data.types) ? data.types : [],
        lat:
          typeof data.lat === "number"
            ? data.lat
            : data.lat != null
            ? Number(data.lat)
            : null,
        long:
          typeof data.long === "number"
            ? data.long
            : data.long != null
            ? Number(data.long)
            : null,
        elevation_m:
          typeof data.elevation_m === "number"
            ? data.elevation_m
            : data.elevation_m != null
            ? Number(data.elevation_m)
            : null,
        key_highlights: Array.isArray(data.key_highlights)
          ? data.key_highlights
          : [],
        temperature_range: data.temperature_range ?? null,
        terrain: data.terrain ?? null,
        safety_advisory: Array.isArray(data.safety_advisory)
          ? data.safety_advisory
          : [],

        created_at: data.created_at ?? null,
        updated_at: data.updated_at ?? null,
      };

      // kalau CREATE baru → kirim pendingAssets ke destination-assets
      if (!editingId && pendingAssets.length > 0) {
        try {
          await Promise.all(
            pendingAssets.map((pa) =>
              fetch("/api/destination-assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  destination_id: savedDest.id,
                  asset_id: pa.asset.id,
                  type: pa.type,
                }),
              })
            )
          );
        } catch (e) {
          console.error(
            "Failed to create destination-assets from pendingAssets:",
            e
          );
          // bisa setError kalau mau, tapi jangan blokir success utama
        }
      }

      if (editingId) {
        setDestinations((prev) =>
          prev.map((d) => (d.id === savedDest.id ? savedDest : d))
        );
      } else {
        setDestinations((prev) => [savedDest, ...prev]);
      }

      closeModal();
    } catch (err: any) {
      console.error("submit destination error:", err);
      setError(err.message || "Gagal menyimpan destination");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------- Delete Destination ------------------------- */

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus destination ini?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      const text = await res.text();
      if (!res.ok) {
        let msg = "Gagal menghapus destination";
        try {
          const err = JSON.parse(text);
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      setDestinations((prev) => prev.filter((d) => d.id !== id));
      if (editingId === id) closeModal();
    } catch (err: any) {
      console.error("delete destination error:", err);
      setError(err.message || "Gagal menghapus destination");
    } finally {
      setDeletingId(null);
    }
  };

  /* ------------------------- Asset Picker Handler ------------------------- */

  const handleAssetPicked = (asset: PickerAsset) => {
    if (!assetPickerTargetType) {
      setIsAssetPickerOpen(false);
      return;
    }

    if (editingId) {
      // EDIT → langsung simpan ke DB
      handleAddDestinationAsset(assetPickerTargetType, asset.id);
    } else {
      // ADD → simpan di pendingAssets dulu
      setPendingAssets((prev) => [
        ...prev,
        { asset, type: assetPickerTargetType },
      ]);
    }

    setIsAssetPickerOpen(false);
    setAssetPickerTargetType(null);
  };

  /* ------------------------- Derived ------------------------- */

  const filteredDestinations = destinations.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.code ?? "").toLowerCase().includes(q) ||
      (d.slug ?? "").toLowerCase().includes(q) ||
      (d.highlight ?? "").toLowerCase().includes(q)
    );
  });

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Destinations Management
            </h1>
            <p className="text-sm text-slate-400">
              Kelola data destinasi (gunung, kota, basecamp) untuk paket tur.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadDestinations}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 transition disabled:opacity-60"
            disabled={loading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium px-3 py-2 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Destination
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      {/* List Section */}
      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Daftar Destinations
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Mountain className="w-3 h-3" />
              Gunakan <span className="font-semibold">Edit</span> untuk mengubah
              detail & gallery image.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, code, slug, atau highlight..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading destinations...
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              {search.trim()
                ? "Tidak ada destination yang cocok dengan pencarian."
                : "Belum ada destination. Tambahkan dengan tombol Tambah Destination."}
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Code / Slug
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Types
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Elevation
                  </th>
                  <th className="text-right px-3 py-2 text-slate-400 font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-slate-100">{d.name}</div>
                      {d.highlight && (
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 max-w-md">
                          {d.highlight}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top text-slate-300">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px]">
                          Code:{" "}
                          <span className="text-slate-100">
                            {d.code || "-"}
                          </span>
                        </span>
                        <span className="text-[11px]">
                          Slug:{" "}
                          <span className="text-slate-100">
                            {d.slug || "-"}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-wrap gap-1">
                        {d.types?.length ? (
                          d.types.map((t) => (
                            <span
                              key={t}
                              className="inline-flex px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] text-slate-300"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-slate-300">
                      <div className="text-[11px]">
                        {d.elevation_m != null ? `${d.elevation_m} m` : "-"}
                      </div>
                      {(d.lat != null || d.long != null) && (
                        <div className="text-[10px] text-slate-500">
                          {d.lat != null && d.long != null
                            ? `${d.lat}, ${d.long}`
                            : d.lat != null
                            ? d.lat
                            : d.long}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(d)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(d.id)}
                          disabled={deletingId === d.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1 disabled:opacity-50"
                        >
                          {deletingId === d.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* MODAL CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  {editingId ? "Edit Destination" : "Tambah Destination Baru"}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Lengkapi data destinasi, koordinat & safety notes.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 nice-scrollbar text-sm"
            >
              <div className="border-b border-slate-800 pb-2 mb-3">
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {(
                    [
                      ["basic", "Basic & Summary"],
                      ["geo", "Geo & Terrain"],
                      ["safety", "Gear & Safety"],
                      ["attractions", "Highlights"],
                      ["timing", "Timing & Tips"],
                      ["media", "Images"],
                      ["meta", "Meta & Tags"],
                    ] as [FormTab, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={[
                        "px-3 py-1.5 rounded-md border text-xs transition",
                        activeTab === key
                          ? "bg-emerald-500 text-slate-950 border-emerald-500"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BASIC INFO */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-100">
                        Basic Info
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Contoh: Kawah Ijen"
                          required
                        />
                      </div>

                      {/* Code & Slug */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Code
                          </label>
                          <input
                            value={form.code}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                code: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="IJEN"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Slug
                          </label>
                          <input
                            value={form.slug}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                slug: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="kawah-ijen"
                          />
                        </div>
                      </div>

                      {/* Category / Region / Province / Country */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Category
                          </label>
                          <input
                            value={form.category}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="volcano / city / waterfall..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Region
                          </label>
                          <input
                            value={form.region}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                region: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="East Java, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Province
                          </label>
                          <input
                            value={form.province}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                province: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Jawa Timur"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Country
                          </label>
                          <input
                            value={form.country}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                country: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Indonesia"
                          />
                        </div>
                      </div>

                      {/* Types */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Types (comma separated)
                        </label>
                        <input
                          value={form.types}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              types: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="volcano, trekking, basecamp"
                        />
                        <p className="text-[10px] text-slate-500">
                          Contoh: <code>volcano, trekking, basecamp</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION / SUMMARY */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-100">
                        Description & Summary
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Summary
                        </label>
                        <textarea
                          value={form.summary}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              summary: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Ringkasan singkat destinasi..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Description
                        </label>
                        <textarea
                          value={form.description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={5}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Deskripsi naratif destinasi..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Highlight (short marketing summary)
                        </label>
                        <textarea
                          value={form.highlight}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              highlight: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Blue fire, sunrise view, sulphur miners..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "geo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-100">
                        Geo & Elevation
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Latitude */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Latitude
                        </label>
                        <input
                          value={form.latitude}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              latitude: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="-7.933"
                        />
                      </div>

                      {/* Longitude */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Longitude
                        </label>
                        <input
                          value={form.longitude}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              longitude: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="113.008"
                        />
                      </div>

                      {/* Altitude */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Altitude (m)
                        </label>
                        <input
                          value={form.altitude}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              altitude: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="620"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">
                        Area (hectares)
                      </label>
                      <input
                        value={form.area_hectares}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            area_hectares: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="contoh: 120.5"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">
                        Temperature Range
                      </label>
                      <input
                        value={form.temperature_range}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            temperature_range: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="5–18°C (malam), 15–25°C (siang)"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">
                        Terrain
                      </label>
                      <textarea
                        value={form.terrain}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            terrain: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                        placeholder="volcanic ash, rocky, forest trail..."
                      />
                    </div>
                  </div>

                  {/* Weather & Season */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      Weather & Seasonality
                    </h3>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">
                        Weather by Season
                      </label>
                      <textarea
                        value={form.weather_by_season}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            weather_by_season: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-slate-300">
                        Rainfall Intensity
                      </label>
                      <textarea
                        value={form.rainfall_intensity}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            rainfall_intensity: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Physical Demand (1–5)
                        </label>
                        <input
                          value={form.physical_demand}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              physical_demand: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Cultural Depth (1–5)
                        </label>
                        <input
                          value={form.cultural_depth}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              cultural_depth: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Photo Potential (1–5)
                        </label>
                        <input
                          value={form.photo_potential}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              photo_potential: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "safety" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gear & Difficulty */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-100">
                        Gear & Difficulty
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Required Gear
                        </label>
                        <textarea
                          value={form.required_gear}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              required_gear: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Masker gas, headlamp, jaket tebal..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Difficulty Level
                          </label>
                          <input
                            value={form.difficulty_level}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                difficulty_level: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="easy / moderate / hard"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-medium text-slate-300">
                            Physical Demand (1–5)
                          </label>
                          <input
                            value={form.physical_demand}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                physical_demand: e.target.value,
                              }))
                            }
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="3"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Physical Requirements
                        </label>
                        <textarea
                          value={form.physical_requirements}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              physical_requirements: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Contoh: tidak direkomendasikan untuk penderita jantung, asma berat, kehamilan..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Trail Details
                        </label>
                        <textarea
                          value={form.trail_details}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              trail_details: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Panjang trek, durasi naik turun, elevasi gain..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Safety Notes & Permits */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-100">
                        Safety Notes & Permits
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Safety Notes
                        </label>
                        <textarea
                          value={form.safety_notes}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              safety_notes: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Catatan safety umum untuk tamu..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Risk Factors
                        </label>
                        <textarea
                          value={form.risk_factors}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              risk_factors: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Gas sulfur, jalur licin, cuaca ekstrem..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Environmental Factors
                        </label>
                        <textarea
                          value={form.environmental_factors}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              environmental_factors: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Contoh: kawasan konservasi, zona rawan longsor..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Emergency Contacts
                        </label>
                        <textarea
                          value={form.emergency_contacts}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              emergency_contacts: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Basecamp, HP ranger, HP kantor JVTO..."
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-300">
                          <input
                            type="checkbox"
                            checked={form.permit_required}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                permit_required: e.target.checked,
                              }))
                            }
                            className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                          />
                          Permit required
                        </label>

                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-300">
                          <input
                            type="checkbox"
                            checked={form.guide_required}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                guide_required: e.target.checked,
                              }))
                            }
                            className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                          />
                          Guide required
                        </label>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Permit Details
                        </label>
                        <textarea
                          value={form.permit_details}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              permit_details: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Kapan perlu izin, siapa yang mengurus, dokumen apa saja..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "attractions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Highlights */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-semibold text-slate-100">
                        Key Highlights & Attractions
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Key Highlights (comma separated)
                        </label>
                        <input
                          value={form.key_highlights}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              key_highlights: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="blue fire, sunrise, crater lake"
                        />
                        <p className="text-[10px] text-slate-500">
                          Contoh:{" "}
                          <code>
                            blue fire, sunrise viewpoint, sulphur miners
                          </code>
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Main Attractions
                        </label>
                        <textarea
                          value={form.main_attractions}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              main_attractions: e.target.value,
                            }))
                          }
                          rows={4}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Deskripsi lebih panjang tentang spot utama di destinasi ini..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Culture & Local Context */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      Culture & Local Context
                    </h3>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Cultural Context
                        </label>
                        <textarea
                          value={form.cultural_context}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              cultural_context: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Cerita budaya, sejarah, kearifan lokal..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Local Tribes (comma separated)
                        </label>
                        <input
                          value={form.local_tribes}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              local_tribes: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Osing, Tengger, dll."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Rituals & Festivals
                        </label>
                        <textarea
                          value={form.rituals_festivals}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              rituals_festivals: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Upacara adat, hari besar lokal, dsb."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "timing" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      Duration & Best Time
                    </h3>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Duration (string)
                        </label>
                        <input
                          value={form.duration}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Contoh: 2–3 hours hike, 30–40 min drive"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Best Time to Visit
                        </label>
                        <textarea
                          value={form.best_time_to_visit}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              best_time_to_visit: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Musim kemarau, bulan-bulan dengan cuaca lebih stabil, jam berangkat ideal..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      Tips for Visitors
                    </h3>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Tips for Visitors
                        </label>
                        <textarea
                          value={form.tips_for_visitors}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              tips_for_visitors: e.target.value,
                            }))
                          }
                          rows={5}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Apa yang perlu dibawa, jam tidur ideal sebelum trip, kebiasaan lokal yang perlu dihormati, dsb."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-4">
                  {/* Thumbnail & Featured image URLs */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      Thumbnail & Featured Image
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Thumbnail URL
                        </label>
                        <input
                          value={form.thumbnail_url}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              thumbnail_url: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Opsional, biasanya 1:1 atau 4:3 image"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Featured Image URL
                        </label>
                        <input
                          value={form.featured_image}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              featured_image: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Opsional, hero image untuk halaman destinasi"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DESTINATION IMAGES (Gallery & Assets) */}
                  <div className="border border-slate-800 rounded-lg p-3 space-y-3 bg-slate-950/60">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                          <h3 className="text-sm font-semibold text-slate-100">
                            Destination Images
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Pilih gambar dari <b>Assets Manager</b> sebagai
                          gallery destinasi (primary / secondary).
                        </p>
                      </div>
                      <Link
                        href="/cms/assets"
                        className="text-[11px] text-emerald-400 underline hover:text-emerald-300"
                        target="_blank"
                      >
                        Buka Assets Manager
                      </Link>
                    </div>

                    {!editingId && (
                      <div className="text-[11px] text-slate-400 bg-slate-900/70 border border-slate-800 rounded-md px-3 py-2">
                        Kamu sudah bisa memilih gambar sekarang. Relasi ke
                        destination akan otomatis dibuat setelah kamu klik{" "}
                        <span className="font-semibold">
                          Simpan Destination
                        </span>
                        .
                      </div>
                    )}

                    {/* Tombol pick dari Assets */}
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setAssetPickerTargetType("primary");
                          setIsAssetPickerOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      >
                        Pick Primary from Assets
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAssetPickerTargetType("secondary");
                          setIsAssetPickerOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-900"
                      >
                        Pick Secondary from Assets
                      </button>
                      <span className="text-slate-500">
                        Gallery popup hanya menampilkan asset bertipe image.
                      </span>
                    </div>

                    {/* Input manual asset_id hanya saat EDIT */}
                    {editingId && (
                      <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <input
                          type="number"
                          value={assetIdInput}
                          onChange={(e) => setAssetIdInput(e.target.value)}
                          className="flex-1 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Opsional: masukkan asset_id manual"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddDestinationAsset("primary")}
                            disabled={savingDestAsset}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[11px] font-medium text-slate-950 disabled:opacity-60"
                          >
                            Add as Primary
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddDestinationAsset("secondary")
                            }
                            disabled={savingDestAsset}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-100 disabled:opacity-60"
                          >
                            Add as Secondary
                          </button>
                        </div>
                      </div>
                    )}

                    {/* GALLERY */}
                    <div className="border border-slate-800 rounded-md p-2 min-h-[60px] bg-slate-950/60">
                      {editingId ? (
                        // MODE EDIT → data dari DB
                        loadingDestAssets ? (
                          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 py-4">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Loading destination images...
                          </div>
                        ) : destinationAssets.length === 0 ? (
                          <div className="text-[11px] text-slate-500 py-2">
                            Belum ada gambar terhubung ke destination ini.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {destinationAssets.map((da) => (
                              <div
                                key={da.id}
                                className="flex gap-2 border border-slate-800 rounded-md p-2 bg-slate-950/80"
                              >
                                <div className="w-16 h-16 rounded-md bg-slate-900 overflow-hidden flex items-center justify-center text-slate-500 text-[11px]">
                                  {da.asset && da.asset.type === "image" ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={da.asset.url}
                                      alt={da.asset.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : da.asset && da.asset.type === "video" ? (
                                    <span>Video</span>
                                  ) : (
                                    <span>No preview</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-[11px] text-slate-100 truncate">
                                      {da.asset?.name ||
                                        `Asset #${da.asset_id}`}
                                    </div>
                                    <span
                                      className={[
                                        "px-1.5 py-0.5 rounded-full text-[10px] border",
                                        da.type === "primary"
                                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                          : "bg-slate-900 border-slate-700 text-slate-300",
                                      ].join(" ")}
                                    >
                                      {da.type}
                                    </span>
                                  </div>
                                  {da.asset?.caption && (
                                    <div className="text-[10px] text-slate-400 line-clamp-2">
                                      {da.asset.caption}
                                    </div>
                                  )}
                                  {da.asset?.url && (
                                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                      <Link
                                        href={da.asset.url}
                                        target="_blank"
                                        className="text-emerald-400 hover:text-emerald-300"
                                      >
                                        Open image
                                      </Link>
                                    </div>
                                  )}
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateDestinationAssetType(
                                          da.id,
                                          "primary"
                                        )
                                      }
                                      disabled={savingDestAsset}
                                      className="px-1.5 py-0.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-300 hover:bg-emerald-500/20"
                                    >
                                      Set Primary
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateDestinationAssetType(
                                          da.id,
                                          "secondary"
                                        )
                                      }
                                      disabled={savingDestAsset}
                                      className="px-1.5 py-0.5 rounded-md border border-slate-700 bg-slate-900/80 text-[10px] text-slate-200 hover:bg-slate-900"
                                    >
                                      Set Secondary
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteDestinationAsset(da.id)
                                      }
                                      disabled={deletingDestAssetId === da.id}
                                      className="px-1.5 py-0.5 rounded-md border border-rose-700 bg-rose-950/40 text-[10px] text-rose-200 hover:bg-rose-900/60 disabled:opacity-60"
                                    >
                                      {deletingDestAssetId === da.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        "Remove"
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        // MODE ADD → pakai pendingAssets
                        <>
                          {pendingAssets.length === 0 ? (
                            <div className="text-[11px] text-slate-500 py-2">
                              Belum ada gambar dipilih. Klik tombol{" "}
                              <b>Pick Primary</b> atau <b>Pick Secondary</b> di
                              atas.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {pendingAssets.map((pa, idx) => (
                                <div
                                  key={`${pa.asset.id}-${idx}`}
                                  className="flex gap-2 border border-slate-800 rounded-md p-2 bg-slate-950/80"
                                >
                                  <div className="w-16 h-16 rounded-md bg-slate-900 overflow-hidden flex items-center justify-center text-slate-500 text-[11px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={pa.asset.url}
                                      alt={pa.asset.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="text-[11px] text-slate-100 truncate">
                                        #{pa.asset.id} · {pa.asset.name}
                                      </div>
                                      <span
                                        className={[
                                          "px-1.5 py-0.5 rounded-full text-[10px] border",
                                          pa.type === "primary"
                                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                            : "bg-slate-900 border-slate-700 text-slate-300",
                                        ].join(" ")}
                                      >
                                        {pa.type}
                                      </span>
                                    </div>
                                    {pa.asset.caption && (
                                      <div className="text-[10px] text-slate-400 line-clamp-2">
                                        {pa.asset.caption}
                                      </div>
                                    )}

                                    <div className="mt-1 flex flex-wrap gap-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleChangePendingType(
                                            idx,
                                            "primary"
                                          )
                                        }
                                        className="px-1.5 py-0.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-300 hover:bg-emerald-500/20"
                                      >
                                        Set Primary
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleChangePendingType(
                                            idx,
                                            "secondary"
                                          )
                                        }
                                        className="px-1.5 py-0.5 rounded-md border border-slate-700 bg-slate-900/80 text-[10px] text-slate-200 hover:bg-slate-900"
                                      >
                                        Set Secondary
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemovePendingAsset(idx)
                                        }
                                        className="px-1.5 py-0.5 rounded-md border border-rose-700 bg-rose-950/40 text-[10px] text-rose-200 hover:bg-rose-900/60"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "meta" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Publish & Flags */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      Publish & Flags
                    </h3>

                    <div className="space-y-2">
                      <div className="flex flex-col gap-2 text-[11px] text-slate-300">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={form.published}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                published: e.target.checked,
                              }))
                            }
                            className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                          />
                          Published (visible on site)
                        </label>

                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                featured: e.target.checked,
                              }))
                            }
                            className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                          />
                          Featured (highlight on homepage / listing)
                        </label>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          Tags (comma separated)
                        </label>
                        <input
                          value={form.tags}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              tags: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="ijen, bromo, kawah, sunrise..."
                        />
                        <p className="text-[10px] text-slate-500">
                          Dipakai untuk pencarian, filter, dan SEO internal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SEO Meta */}
                  <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/60 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                      SEO Meta
                    </h3>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          SEO Title
                        </label>
                        <input
                          value={form.seo_title}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              seo_title: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Contoh: Kawah Ijen Night Trek – Blue Fire & Sunrise View"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-300">
                          SEO Description
                        </label>
                        <textarea
                          value={form.seo_description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              seo_description: e.target.value,
                            }))
                          }
                          rows={4}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                          placeholder="Meta description untuk search engine (max ~155–160 karakter efektif)."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-medium px-3 py-2 transition"
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-medium px-3 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? "Simpan Perubahan" : "Simpan Destination"}
                </button>
              </div>
            </form>
          </div>

          {/* Asset Picker Modal */}
          <AssetPickerModal
            open={isAssetPickerOpen}
            onClose={() => {
              setIsAssetPickerOpen(false);
              setAssetPickerTargetType(null);
            }}
            onSelect={handleAssetPicked}
          />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ASSET PICKER MODAL (IMAGE GALLERY POPUP)
   ========================================================= */

type AssetPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: PickerAsset) => void;
};

function AssetPickerModal({ open, onClose, onSelect }: AssetPickerModalProps) {
  const [assets, setAssets] = useState<PickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("type", "image");
      if (search.trim()) {
        params.set("q", search.trim());
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

      const data: any[] = JSON.parse(text);
      const normalized: PickerAsset[] = data
        .filter((a) => a.type === "image")
        .map((a) => ({
          id: Number(a.id),
          name: a.name,
          url: a.url,
          caption: a.caption ?? null,
          type: a.type,
        }));

      setAssets(normalized);
    } catch (err: any) {
      console.error("AssetPicker loadAssets error:", err);
      setError(err.message || "Failed to fetch assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadAssets();
    } else {
      setAssets([]);
      setSearch("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-3xl max-h-[80vh] rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/90">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Pilih Image dari Assets
            </h2>
            <p className="text-[11px] text-slate-500">
              Hanya menampilkan assets bertipe{" "}
              <span className="font-mono">image</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs flex-1">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  loadAssets();
                }
              }}
              placeholder="Cari nama / caption asset..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
          <button
            type="button"
            onClick={loadAssets}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[11px] text-slate-300 hover:bg-slate-900/80 transition disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload
          </button>
        </div>

        {error && (
          <div className="px-4 pt-2 text-[11px] text-rose-200 bg-rose-500/10 border-b border-rose-500/40">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 nice-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-xs text-slate-500 gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading assets...
            </div>
          ) : assets.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6">
              Tidak ada image assets yang cocok.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset)}
                  className="group border border-slate-800 rounded-lg overflow-hidden bg-slate-950/80 hover:border-emerald-500/50 hover:bg-slate-900/80 transition flex flex-col text-left"
                >
                  <div className="aspect-[4/3] bg-slate-900 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                    />
                  </div>
                  <div className="px-2 py-2 space-y-1">
                    <div className="text-[11px] text-slate-100 truncate">
                      #{asset.id} · {asset.name}
                    </div>
                    {asset.caption && (
                      <div className="text-[10px] text-slate-400 line-clamp-2">
                        {asset.caption}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <span>
            Klik salah satu image untuk memilih. Pastikan asset sudah diupload
            dan bertipe <code>image</code> di Assets Manager.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 text-[11px] text-slate-200 hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
