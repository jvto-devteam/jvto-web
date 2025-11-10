"use client";

import { useEffect, useState } from "react";
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

export default function CmsFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    question: "",
    answer: "",
    tags: "",
    is_published: true,
    sort_order: "",
  });

  const sortFaqs = (a: Faq, b: Faq) => {
    const sa = a.sort_order ?? 0;
    const sb = b.sort_order ?? 0;
    if (sa !== sb) return sa - sb;
    return (b.id || 0) - (a.id || 0);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      question: "",
      answer: "",
      tags: "",
      is_published: true,
      sort_order: "",
    });
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

      // Always try to get the response text first
      const text = await res.text();
      
      if (!res.ok) {
        let msg = "Failed to fetch FAQs";
        
        // Try to parse as JSON to get error message
        try {
          const errorData = JSON.parse(text);
          if (errorData?.message) msg = errorData.message;
        } catch {
          // Not JSON, use default message
          console.error("Non-JSON error response:", text.substring(0, 200));
        }
        
        throw new Error(msg);
      }

      // Parse the successful response
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

  const startCreate = () => {
    resetForm();
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      tags: faq.tags.join(", "),
      is_published: faq.is_published,
      sort_order: faq.sort_order ?? 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Always get text first
      const text = await res.text();

      if (!res.ok) {
        let msg = editingId ? "Gagal menyimpan perubahan FAQ" : "Gagal menambahkan FAQ";
        
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

      resetForm();
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
      if (editingId === id) resetForm();
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

      // Always get text first
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
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            FAQ Management
          </h2>
          <p className="text-sm text-slate-400">
            Kelola pertanyaan, jawaban & tags untuk halaman FAQ publik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadFaqs}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 transition"
            disabled={loading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-500 text-slate-950 text-xs font-semibold hover:bg-emerald-400 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New FAQ
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-100">
            {editingId ? `Edit FAQ #${editingId}` : "Tambah FAQ Baru"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-2 py-1 rounded-md text-[9px] border border-slate-700 text-slate-300 hover:bg-slate-900/80"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-wide text-slate-500">
              Question
            </label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/70"
              value={form.question}
              onChange={(e) =>
                setForm((f) => ({ ...f, question: e.target.value }))
              }
              placeholder="Contoh: Jam keberangkatan trip Bromo?"
              required
            />
          </div>

          <div className="grid gap-3 grid-cols-[1.3fr_1fr]">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wide text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3 text-slate-500" />
                Sort Order
              </label>
              <input
                type="number"
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/70"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sort_order:
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value),
                  }))
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wide text-slate-500">
                Status
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    is_published: !f.is_published,
                  }))
                }
                className={[
                  "w-full h-[34px] inline-flex items-center justify-center gap-1.5 rounded-md border text-[10px] font-medium transition",
                  form.is_published
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-900 border-slate-700 text-slate-400",
                ].join(" ")}
              >
                {form.is_published ? (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-wide text-slate-500">
            Answer
          </label>
          <textarea
            rows={3}
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/70 resize-none"
            value={form.answer}
            onChange={(e) =>
              setForm((f) => ({ ...f, answer: e.target.value }))
            }
            placeholder="Jawaban lengkap yang akan tampil di halaman FAQ."
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-wide text-slate-500 flex items-center gap-1">
            <Tag className="h-3 w-3 text-slate-500" />
            Tags (comma separated)
          </label>
          <input
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/70"
            value={form.tags}
            onChange={(e) =>
              setForm((f) => ({ ...f, tags: e.target.value }))
            }
            placeholder="bromo, sunrise, private-trip"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {editingId ? "Save Changes" : "Add FAQ"}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900/80">
          <div className="text-[10px] uppercase text-slate-500">
            Existing FAQs
          </div>
          <div className="text-[10px] text-slate-500">
            {loading
              ? "Loading..."
              : `${faqs.length} item${faqs.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading data...
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            Belum ada FAQ. Tambahkan dari form di atas.
          </div>
        ) : (
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-900/90 text-slate-500 uppercase text-[9px]">
              <tr>
                <th className="px-4 py-2 w-10">ID</th>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Tags</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Preview Answer</th>
                <th className="px-4 py-2 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {faqs.sort(sortFaqs).map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-900/80 hover:bg-slate-900/70 align-top"
                >
                  <td className="px-4 py-2 text-[10px] text-slate-500">
                    {item.id}
                  </td>
                  <td className="px-4 py-2 text-slate-100">
                    <div className="text-[11px] font-medium">
                      {item.question}
                    </div>
                    {item.sort_order !== 0 && (
                      <div className="text-[9px] text-slate-500">
                        Order: {item.sort_order}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-1">
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
                  </td>
                  <td className="px-4 py-2">
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
                  <td className="px-4 py-2 text-slate-400">
                    {item.answer.length > 90
                      ? item.answer.slice(0, 90) + "..."
                      : item.answer}
                  </td>
                  <td className="px-4 py-2 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1 text-[9px] text-sky-400 hover:text-sky-300"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1 text-[9px] text-rose-400 hover:text-rose-300 disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}