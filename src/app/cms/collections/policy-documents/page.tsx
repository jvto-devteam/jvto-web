"use client";

import { useState, useMemo, useEffect, FormEvent, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  Shield,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

type PolicyType =
  | "booking_payment_cancellation"
  | "inclusions_exclusions"
  | "privacy"
  | "guest_responsibilities";

type PolicyDocumentClient = {
  id: string; // CHANGED: uuid string instead of number
  title: string;
  slug: string;
  policy_type: PolicyType;
  version: string | null;
  effective_date: string | null;
  content: string;
  is_binding: boolean;
  seo_meta_title?: string | null;
  seo_meta_description?: string | null;
  seo_og_image_url?: string | null;
  include_in_sitemap: boolean;
  created_at?: string | null;
  date_modified?: string | null; // CHANGED: from updated_at
};

type SeoForm = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl?: string | null;
};

type FormState = {
  title: string;
  slug: string;
  policyType: PolicyType;
  version: string;
  effectiveDate: string;
  content: string;
  isBinding: boolean;
  includeInSitemap: boolean;
  seo: SeoForm;
};

const POLICY_TYPE_OPTIONS: { value: PolicyType; label: string }[] = [
  {
    value: "booking_payment_cancellation",
    label: "Booking, Payment & Cancellation",
  },
  {
    value: "inclusions_exclusions",
    label: "Inclusions & Exclusions",
  },
  {
    value: "privacy",
    label: "Privacy Policy",
  },
  {
    value: "guest_responsibilities",
    label: "Guest Responsibilities",
  },
];

const todayString = () => new Date().toISOString().slice(0, 10);

const emptyForm: FormState = {
  title: "",
  slug: "",
  policyType: "booking_payment_cancellation",
  version: "",
  effectiveDate: todayString(),
  content: "",
  isBinding: true,
  includeInSitemap: true,
  seo: {
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: null,
  },
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function PolicyDocumentsPage() {
  const [policies, setPolicies] = useState<PolicyDocumentClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");

  const ogInputRef = useRef<HTMLInputElement | null>(null);

  const filteredPolicies = useMemo(() => {
    const list = [...policies].sort((a, b) => {
      const ea = a.effective_date || "";
      const eb = b.effective_date || "";
      if (ea !== eb) return eb.localeCompare(ea);
      return typeof b.id === "number" && typeof a.id === "number"
        ? b.id - a.id
        : (String(b.id) || "").localeCompare(String(a.id) || "");
    });

    if (!search.trim()) return list;
    const q = search.toLowerCase();

    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.policy_type.toLowerCase().includes(q)
    );
  }, [policies, search]);

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleTitleChange = (value: string) => {
    setForm((prev) => {
      const next: FormState = { ...prev, title: value };
      if (!prev.slug.trim()) {
        next.slug = slugify(value);
      }
      if (!prev.seo.metaTitle.trim()) {
        next.seo = { ...next.seo, metaTitle: value };
      }
      return next;
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (policy: PolicyDocumentClient) => {
    setEditingId(policy.id);

    const effectiveDate = policy.effective_date?.slice(0, 10) || todayString();

    setForm({
      title: policy.title,
      slug: policy.slug,
      policyType: policy.policy_type,
      version: policy.version ?? "",
      effectiveDate,
      content: policy.content,
      isBinding: policy.is_binding,
      includeInSitemap: policy.include_in_sitemap,
      seo: {
        metaTitle: policy.seo_meta_title ?? "",
        metaDescription: policy.seo_meta_description ?? "",
        ogImageUrl: policy.seo_og_image_url ?? null,
      },
    });

    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  // FIXED: Better error handling with detailed logging
  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/policy-documents", {
        method: "GET",
        cache: "no-store",
      });

      console.log("Response status:", res.status, res.statusText);

      if (!res.ok) {
        let msg = "Failed to fetch policy documents";
        let errorDetails = null;

        try {
          errorDetails = await res.json();
          console.error("API Error Response:", errorDetails);
          if (errorDetails?.message) msg = errorDetails.message;
        } catch (parseErr) {
          // If JSON parsing fails, get raw text
          try {
            const text = await res.text();
            console.error("Raw error response:", text);
            msg = `Server error (${res.status}): ${text.substring(0, 100)}`;
          } catch {
            msg = `Failed to fetch policy documents: ${res.status} ${res.statusText}`;
          }
        }

        throw new Error(msg);
      }

      const data: PolicyDocumentClient[] = await res.json();
      console.log("Loaded policies:", data.length);

      setPolicies(
        data.sort((a, b) => {
          const ea = a.effective_date || "";
          const eb = b.effective_date || "";
          if (ea !== eb) return eb.localeCompare(ea);
          // UUID comparison - just use string compare
          return eb.localeCompare(ea) || b.id.localeCompare(a.id);
        })
      );
    } catch (err: any) {
      console.error("loadPolicies error:", err);
      setError(err.message || "Failed to fetch policy documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const title = form.title.trim();
    const slug = form.slug.trim();
    const content = form.content.trim();

    if (!title || !slug || !content) {
      setError("Title, Slug, dan Content wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        slug,
        policy_type: form.policyType,
        version: form.version || null,
        effective_date: form.effectiveDate || null,
        content: form.content,
        is_binding: form.isBinding,
        include_in_sitemap: form.includeInSitemap,
        seo_meta_title: form.seo.metaTitle || null,
        seo_meta_description: form.seo.metaDescription || null,
        seo_og_image_url: form.seo.ogImageUrl || null,
      };

      console.log("Submitting payload:", payload);

      const url = editingId
        ? `/api/policy-documents/${editingId}`
        : "/api/policy-documents";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = editingId
          ? "Gagal menyimpan perubahan policy"
          : "Gagal menambahkan policy";

        try {
          const errorData = await res.json();
          console.error("API Error Response:", errorData);
          if (errorData?.message) msg = errorData.message;
          if (errorData?.details) msg += `: ${errorData.details}`;
          if (errorData?.code) msg += ` (${errorData.code})`;
        } catch {
          msg = `${msg}: ${res.status} ${res.statusText}`;
        }

        throw new Error(msg);
      }

      const data: PolicyDocumentClient = await res.json();
      console.log("Successfully saved policy:", data);

      if (editingId) {
        setPolicies((prev) =>
          prev
            .map((p) => (p.id === editingId ? { ...p, ...data } : p))
            .sort((a, b) => {
              const ea = a.effective_date || "";
              const eb = b.effective_date || "";
              if (ea !== eb) return eb.localeCompare(ea);
              return eb.localeCompare(ea) || b.id.localeCompare(a.id);
            })
        );
      } else {
        setPolicies((prev) =>
          [data, ...prev].sort((a, b) => {
            const ea = a.effective_date || "";
            const eb = b.effective_date || "";
            if (ea !== eb) return eb.localeCompare(ea);
            return eb.localeCompare(ea) || b.id.localeCompare(a.id);
          })
        );
      }

      closeModal();
    } catch (err: any) {
      console.error("submit policy error:", err);
      setError(err.message || "Gagal menyimpan policy document");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus policy ini?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/policy-documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let msg = "Gagal menghapus policy";

        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          msg = `${msg}: ${res.status} ${res.statusText}`;
        }

        throw new Error(msg);
      }

      setPolicies((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) {
        closeModal();
      }
    } catch (err: any) {
      console.error("delete policy error:", err);
      setError(err.message || "Gagal menghapus policy document");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectOgFile = (file: File | null | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        ogImageUrl: url,
      },
    }));
  };

  const handleOgInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    handleSelectOgFile(file);
  };

  const handleDropOgImage: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleSelectOgFile(file);
  };

  const handleDragOverOg: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearOgImage = () => {
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo, ogImageUrl: null },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Policy Documents
            </h1>
            <p className="text-sm text-slate-400">
              Kelola kebijakan resmi (pembayaran, pembatalan, privacy, dll).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPolicies}
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
            Tambah Policy Baru
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Daftar Policy
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Klik <span className="font-semibold">Edit</span> untuk mengubah,
              atau <span className="font-semibold">Hapus</span> jika sudah tidak
              berlaku.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari title, slug, atau type..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading policy documents...
            </div>
          ) : filteredPolicies.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              Belum ada policy. Tambahkan dengan tombol{" "}
              <span className="font-semibold">Tambah Policy Baru</span>.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Title
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Type
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Version
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Effective
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Updated
                  </th>
                  <th className="text-right px-3 py-2 text-slate-400 font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((p) => {
                  const typeLabel =
                    POLICY_TYPE_OPTIONS.find(
                      (opt) => opt.value === p.policy_type
                    )?.label || p.policy_type;

                  return (
                    <tr
                      key={p.id}
                      className="border-t border-slate-800/80 hover:bg-slate-900/60"
                    >
                      <td className="px-3 py-2 align-top">
                        <div className="font-medium text-slate-100 truncate max-w-xs">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          /policy/{p.slug}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-200">
                          {typeLabel}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {p.version || "-"}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {p.effective_date ? p.effective_date.slice(0, 10) : "-"}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {p.date_modified ? p.date_modified.slice(0, 10) : "-"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1 disabled:opacity-50"
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative z-50 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  {editingId ? "Edit Policy" : "Tambah Policy Baru"}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Lengkapi data di bawah ini, lalu klik Simpan.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Contoh: Kebijakan Pembayaran & Pembatalan"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Slug (URL) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="kebijakan-pembayaran-pembatalan"
                  />
                  <p className="text-[11px] text-slate-500">
                    URL final contoh:{" "}
                    <span className="text-slate-300">
                      /policy/{form.slug || "slug-otomatis"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Policy Type
                  </label>
                  <select
                    value={form.policyType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        policyType: e.target.value as PolicyType,
                      }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {POLICY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Version
                  </label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        version: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="misal: v1.0, 2025-01, dst."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={form.effectiveDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        effectiveDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Content (rich text, master text resmi)
                </label>
                <div className="border border-slate-800 rounded-md bg-slate-900/60">
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, content: value }))
                    }
                    modules={quillModules}
                    className="policy-quill-editor"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Formatkan teks kebijakan (heading, list, bold, dsb). Nilai
                  yang disimpan berupa HTML.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.isBinding}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isBinding: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900"
                  />
                  <span>Is Binding (mengikat secara resmi)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={form.includeInSitemap}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        includeInSitemap: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900"
                  />
                  <span>Include in sitemap.xml</span>
                </label>
              </div>

              <div className="mt-2 border-t border-slate-800 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    SEO Settings
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Opsional, tapi disarankan
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.seo.metaTitle}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value },
                      }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Judul untuk SEO (kalau kosong bisa pakai Title)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Meta Description
                  </label>
                  <textarea
                    value={form.seo.metaDescription}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          metaDescription: e.target.value,
                        },
                      }))
                    }
                    rows={3}
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 nice-scrollbar"
                    placeholder="Ringkasan singkat kebijakan untuk tampil di Google / social share."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    OG Image (Open Graph)
                  </label>

                  <div
                    onDrop={handleDropOgImage}
                    onDragOver={handleDragOverOg}
                    onClick={() => ogInputRef.current?.click()}
                    className={[
                      "border border-dashed rounded-md px-3 py-3 cursor-pointer transition",
                      form.seo.ogImageUrl
                        ? "border-emerald-600/60 bg-slate-900/70 hover:bg-slate-900"
                        : "border-slate-700 bg-slate-900/40 hover:bg-slate-900/60",
                    ].join(" ")}
                  >
                    {form.seo.ogImageUrl ? (
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-28 rounded-md overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center">
                          <img
                            src={form.seo.ogImageUrl}
                            alt="OG preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-200 font-medium">
                            Gambar OG sudah dipilih
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Klik area ini untuk mengganti, atau gunakan tombol
                            Hapus.
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                ogInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/80 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                            >
                              <ImageIcon className="w-3 h-3" />
                              Ganti gambar
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearOgImage();
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-200 font-medium">
                            Upload atau drag & drop OG image di sini
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Rekomendasi ukuran 1200 x 630px. Gambar ini akan
                            dipakai saat halaman di-share ke sosial media.
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              ogInputRef.current?.click();
                            }}
                            className="mt-2 inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/80 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                          >
                            <ImageIcon className="w-3 h-3" />
                            Pilih file…
                          </button>
                        </div>
                      </div>
                    )}

                    <input
                      ref={ogInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleOgInputChange}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Saat ini file hanya disimpan sebagai URL lokal / string.
                    Nanti bisa disambungkan ke media library / storage agar
                    benar-benar ter-upload dan punya URL permanen.
                  </p>
                </div>
              </div>

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
                  <Save className="w-4 h-4" />
                  {editingId ? "Simpan Perubahan" : "Simpan Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
