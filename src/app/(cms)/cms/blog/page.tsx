// src/app/cms/blogs/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

type BlogCategory = {
  id: number;
  name: string;
};

type Blog = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published" | string;
  tags: string[];
  created_at?: string | null;
  category_id?: number | null;
  category?: BlogCategory | null;
};

export default function CmsBlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      blog.title.toLowerCase().includes(q) ||
      blog.slug.toLowerCase().includes(q) ||
      blog.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/blogs", {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch blogs";
        try {
          const errorData = JSON.parse(text);
          if (errorData?.message) msg = errorData.message;
        } catch {
          console.error("Non-JSON error response (blogs):", text.slice(0, 200));
        }
        throw new Error(msg);
      }

      const data: Blog[] = JSON.parse(text);
      setBlogs(data);
    } catch (err: any) {
      console.error("loadBlogs error:", err);
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus blog ini?")) return;
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const text = await res.text();

      if (!res.ok) {
        let msg = "Gagal menghapus blog";
        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          console.error("Non-JSON error response (delete):", text.slice(0, 200));
        }
        throw new Error(msg);
      }

      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error("delete blog error:", err);
      setError(err.message || "Gagal menghapus blog");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (blog: Blog) => {
    const nextStatus = blog.status === "published" ? "draft" : "published";

    // optimistic
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blog.id ? { ...b, status: nextStatus } : b
      )
    );

    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Gagal update status blog";
        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          console.error("Non-JSON error (toggle status):", text.slice(0, 200));
        }
        throw new Error(msg);
      }
    } catch (err: any) {
      console.error("toggle status error:", err);
      setError(err.message || "Gagal update status blog");
      // rollback
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, status: blog.status } : b
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Blog Management
          </h1>
          <p className="text-sm text-slate-400">
            Kelola artikel blog (judul, konten, kategori, status).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBlogs}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 transition disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload
          </button>
          <Link
            href="/cms/blog/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 text-sm font-medium px-3 py-2 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Blog
          </Link>
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
              Daftar Blog
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, slug, tag..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading blog data...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              {search.trim()
                ? "Tidak ada blog yang cocok dengan pencarian."
                : "Belum ada blog. Tambahkan dengan tombol Tambah Blog."}
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Title
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Category
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Tags
                  </th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">
                    Status
                  </th>
                  <th className="text-right px-3 py-2 text-slate-400 font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-slate-100 max-w-md">
                        {blog.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        /blog/{blog.slug}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-[11px] text-slate-200">
                      {blog.category?.name || "-"}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.length ? (
                          blog.tags.map((tag) => (
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
                        onClick={() => toggleStatus(blog)}
                        className={[
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] border transition",
                          blog.status === "published"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15"
                            : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-900/70",
                        ].join(" ")}
                      >
                        {blog.status === "published" ? (
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
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/cms/blog/${blog.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog.id)}
                          disabled={deletingId === blog.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1 disabled:opacity-50"
                        >
                          {deletingId === blog.id ? (
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
    </div>
  );
}
