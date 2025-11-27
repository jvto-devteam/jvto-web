// src/app/cms/blogs/create/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Loader2, Save, X } from "lucide-react";

type BlogCategory = {
  id: number;
  name: string;
};

type FormState = {
  title: string;
  slug: string;
  cover_image: string;
  status: "draft" | "published";
  tags: string;
  category_id: number | null;
  content: string;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  cover_image: "",
  status: "draft",
  tags: "",
  category_id: null,
  content: "",
};

export default function CmsBlogCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setError(null);

      const res = await fetch("/api/blog-categories", {
        method: "GET",
        cache: "no-store",
      });
      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch blog categories";
        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          console.error("Non-JSON error (categories):", text.slice(0, 200));
        }
        throw new Error(msg);
      }

      const data: BlogCategory[] = JSON.parse(text);
      setCategories(data);
    } catch (err: any) {
      console.error("loadCategories error:", err);
      setError(err.message || "Failed to fetch blog categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const title = form.title.trim();
    const slug = form.slug.trim();
    const content = form.content.trim();

    if (!title || !slug || !content) {
      setError("Title, slug & content wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("slug", slug);
      fd.set("content", content);
      fd.set("status", form.status);
      fd.set("tags", form.tags);
      if (form.category_id) {
        fd.set("category_id", String(form.category_id));
      }

      // ambil file langsung dari form
      const fileInput =
        (e.currentTarget.elements.namedItem(
          "cover_image"
        ) as HTMLInputElement | null) || null;
      const file = fileInput?.files?.[0];
      if (file) {
        fd.set("cover_image", file);
      }

      const res = await fetch("/api/blogs", {
        method: "POST",
        body: fd,
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Gagal menyimpan blog";
        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          console.error("Non-JSON error (create blog):", text.slice(0, 200));
        }
        throw new Error(msg);
      }

      router.push("/cms/blog");
    } catch (err: any) {
      console.error("submit blog error:", err);
      setError(err.message || "Gagal menyimpan blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Tambah Blog Baru
          </h1>
          <p className="text-sm text-slate-400">
            Isi data blog lalu simpan untuk menambah artikel baru.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 text-sm"
      >
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Judul artikel..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Slug <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="judul-artikel-blog"
          />
          <p className="text-[11px] text-slate-500">
            Digunakan di URL, misal: /blog/judul-artikel-blog
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Cover Image (upload file)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // simpan filenya di FormData, bukan di state string
                setForm((prev) => ({
                  ...prev,
                  cover_image: file.name, // optional, cuma buat info
                }));
                setCoverPreview(URL.createObjectURL(file));
              } else {
                setCoverPreview(null);
              }
            }}
            className="w-full text-xs text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-blue-500 file:text-slate-950 file:text-xs file:font-medium bg-slate-900/60 border border-slate-800 rounded-md"
          />
          {coverPreview && (
            <div className="mt-2">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="max-h-40 rounded-md border border-slate-800"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Category
          </label>
          <select
            value={form.category_id ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category_id:
                  e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">
              {loadingCategories ? "Loading..." : "Tanpa category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tags: e.target.value }))
            }
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="bromo, sunrise, hiking"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as "draft" | "published",
              }))
            }
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Content <span className="text-red-400">*</span>
          </label>
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <div className="dark">
              <SimpleEditor
                initialContent={form.content}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, content: html }))
                }
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/cms/blog")}
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
            Simpan Blog
          </button>
        </div>
      </form>
    </div>
  );
}
