"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUpDown,
  MessageSquare,
  X,
  Save,
  Search,
} from "lucide-react";

type Faq = {
  id: number;
  question: string;
  answer: string;
  tags: string[];
  is_published: boolean;
  sort_order: number;
  created_at?: string | null;
  updated_at?: string | null;
};

type FormState = {
  question: string;
  answer: string;
  tags: string;
  is_published: boolean;
  sort_order: number | "";
};

const emptyForm: FormState = {
  question: "",
  answer: "",
  tags: "",
  is_published: true,
  sort_order: "",
};

export default function CmsFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<FormState>(emptyForm);

  const sortFaqs = (a: Faq, b: Faq) => {
    const sa = a.sort_order ?? 0;
    const sb = b.sort_order ?? 0;
    if (sa !== sb) return sa - sb;
    return (b.id || 0) - (a.id || 0);
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      tags: faq.tags.join(", "),
      is_published: faq.is_published,
      sort_order: faq.sort_order ?? 0,
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

  const loadFaqs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/faqs", {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch FAQs";

        try {
          const errorData = JSON.parse(text);
          if (errorData?.message) msg = errorData.message;
        } catch {
          console.error("Non-JSON error response:", text.substring(0, 200));
        }

        throw new Error(msg);
      }

      const data: Faq[] = JSON.parse(text);

      setFaqs(
        data
          .map((f) => ({
            ...f,
            tags: Array.isArray(f.tags) ? f.tags : [],
          }))
          .sort(sortFaqs)
      );
    } catch (err: any) {
      console.error("loadFaqs error:", err);
      setError(err.message || "Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const question = form.question.trim();
    const answer = form.answer.trim();
    const sortOrder =
      form.sort_order === "" ? 0 : Number(form.sort_order) || 0;

    if (!question || !answer) {
      setError("Question dan Answer wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        question,
        answer,
        tags: form.tags,
        is_published: form.is_published,
        sort_order: sortOrder,
      };

      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = editingId
          ? "Gagal menyimpan perubahan FAQ"
          : "Gagal menambahkan FAQ";

        try {
          const errorData = JSON.parse(text);
          if (errorData?.message) msg = errorData.message;
        } catch {
          console.error("Non-JSON error response:", text.substring(0, 200));
        }

        throw new Error(msg);
      }

      const data = JSON.parse(text);

      if (editingId) {
        setFaqs((prev) =>
          prev
            .map((f) => (f.id === editingId ? { ...f, ...data } : f))
            .sort(sortFaqs)
        );
      } else {
        setFaqs((prev) => [data, ...prev].sort(sortFaqs));
      }

      closeModal();
    } catch (err: any) {
      console.error("submit FAQ error:", err);
      setError(err.message || "Gagal menyimpan FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus FAQ ini?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let msg = "Gagal menghapus FAQ";

        if (contentType?.includes("application/json")) {
          try {
            const data = await res.json();
            if (data?.message) msg = data.message;
          } catch {
            // JSON parse failed, use default message
          }
        }

        throw new Error(msg);
      }

      setFaqs((prev) => prev.filter((f) => f.id !== id));
      if (editingId === id) closeModal();
    } catch (err: any) {
      console.error("delete FAQ error:", err);
      setError(err.message || "Gagal menghapus FAQ");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (faq: Faq) => {
    setError(null);

    const optimisticValue = !faq.is_published;

    // Optimistic update
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === faq.id ? { ...f, is_published: optimisticValue } : f
      )
    );

    try {
      const res = await fetch(`/api/faqs/${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: optimisticValue }),
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Gagal update status publish";

        try {
          const errorData = JSON.parse(text);
          if (errorData?.message) msg = errorData.message;
        } catch {
          console.error("Non-JSON error response:", text.substring(0, 200));
        }

        throw new Error(msg);
      }

      const data = JSON.parse(text);

      setFaqs((prev) =>
        prev
          .map((f) => (f.id === faq.id ? { ...f, ...data } : f))
          .sort(sortFaqs)
      );
    } catch (err: any) {
      console.error("toggle publish error:", err);
      setError(err.message || "Gagal update status publish");

      // Rollback on error
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === faq.id ? { ...f, is_published: faq.is_published } : f
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/40 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              FAQ Management
            </h1>
            <p className="text-sm text-slate-400">
              Kelola pertanyaan, jawaban & tags untuk halaman FAQ publik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadFaqs}
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
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 text-sm font-medium px-3 py-2 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah FAQ Baru
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
              Daftar FAQ
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Klik <span className="font-semibold">Edit</span> untuk mengubah,
              atau <span className="font-semibold">Hapus</span> jika sudah
              tidak diperlukan.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari question, answer, atau tag..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading FAQ data...
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              {search.trim()
                ? "Tidak ada FAQ yang cocok dengan pencarian."
                : "Belum ada FAQ. Tambahkan dengan tombol Tambah FAQ Baru."}
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Question
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Tags
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Order
                  </th>
                  <th className="text-right px-3 py-2 text-slate-400 font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.sort(sortFaqs).map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-slate-100 max-w-md">
                        {item.question}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 max-w-md line-clamp-2">
                        {item.answer.length > 100
                          ? item.answer.slice(0, 100) + "..."
                          : item.answer}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.length ? (
                          item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] text-slate-300"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <button
                        type="button"
                        onClick={() => togglePublish(item)}
                        className={[
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] border transition",
                          item.is_published
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15"
                            : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-900/70",
                        ].join(" ")}
                      >
                        {item.is_published ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2 align-top text-slate-300">
                      {item.sort_order || 0}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1 disabled:opacity-50"
                        >
                          {deletingId === item.id ? (
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  {editingId ? "Edit FAQ" : "Tambah FAQ Baru"}
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
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Question <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, question: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Contoh: Jam keberangkatan trip Bromo?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Answer <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, answer: e.target.value }))
                  }
                  rows={5}
                  className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 nice-scrollbar"
                  placeholder="Jawaban lengkap yang akan tampil di halaman FAQ."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="bromo, sunrise, private-trip"
                  />
                  <p className="text-[11px] text-slate-500">
                    Pisahkan dengan koma untuk multiple tags
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3" />
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sort_order:
                          e.target.value === ""
                            ? ""
                            : Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <p className="text-[11px] text-slate-500">
                    Angka lebih kecil akan tampil lebih dulu
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      is_published: !prev.is_published,
                    }))
                  }
                  className={[
                    "w-full inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition",
                    form.is_published
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400",
                  ].join(" ")}
                >
                  {form.is_published ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Draft
                    </>
                  )}
                </button>
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
                  className="inline-flex items-center gap-2 rounded-md bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-medium px-3 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-4 h-4" />
                  {editingId ? "Simpan Perubahan" : "Simpan FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}