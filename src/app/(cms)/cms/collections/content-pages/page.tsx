"use client";

// src/app/(cms)/cms/collections/content-pages/page.tsx
// Content Pages collection — real client CRUD list (replaces the redirect stub).
// Lists content_pages rows (GET /api/content-pages), pick a row to edit, or
// create a new one. The row editor is the shared <ContentPageEditor> (also
// embedded by the Route Content Console).
import { useEffect, useMemo, useState } from "react";
import {
  LayoutTemplate,
  Plus,
  RefreshCw,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import ContentPageEditor, {
  ContentPageInitial,
} from "@/components/cms/ContentPageEditor";

interface Row {
  id: number | null;
  route: string;
  lang: string;
  seo: unknown;
  content: unknown;
  is_active: boolean;
}

export default function ContentPagesCollectionPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContentPageInitial | null>(null);
  const [mode, setMode] = useState<"none" | "edit" | "create">("none");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content-pages", { cache: "no-store" });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.message || `Load failed (${res.status})`);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.route.toLowerCase().includes(q) || r.lang.toLowerCase().includes(q),
    );
  }, [rows, search]);

  function pickRow(r: Row) {
    setSelected({
      route: r.route,
      lang: r.lang,
      seo: r.seo,
      content: r.content,
      is_active: r.is_active,
    });
    setMode("edit");
  }

  function startCreate() {
    setSelected({ route: "", lang: "en", seo: {}, content: {}, is_active: true });
    setMode("create");
  }

  async function onDelete(r: Row) {
    if (r.id == null) return;
    if (!confirm(`Delete content page ${r.route}?`)) return;
    try {
      const res = await fetch(`/api/content-pages/${r.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Delete failed (${res.status})`);
      }
      if (selected?.route === r.route) {
        setSelected(null);
        setMode("none");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Content Pages
            </h1>
            <p className="text-sm text-slate-400">
              Per-route CMS SEO + content (lowest FAQ precedence). See{" "}
              <span className="text-slate-300">Pages (SSOT)</span> for the full
              ownership breakdown.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Reload
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium px-3 py-2"
          >
            <Plus className="w-4 h-4" /> New content page
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <section className="lg:col-span-2 bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter route / lang..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No content_pages rows.
              </div>
            ) : (
              <ul className="divide-y divide-slate-800/80">
                {filtered.map((r) => (
                  <li
                    key={`${r.route}|${r.lang}`}
                    className={`px-3 py-2 hover:bg-slate-900/60 ${
                      selected?.route === r.route && mode === "edit"
                        ? "bg-slate-900/70"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => pickRow(r)}
                        className="text-left flex-1 min-w-0"
                      >
                        <div className="text-[12px] font-medium text-slate-100 truncate">
                          {r.route}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {r.lang} ·{" "}
                          {r.is_active ? (
                            <span className="text-emerald-400">active</span>
                          ) : (
                            <span className="text-slate-500">inactive</span>
                          )}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="p-1 rounded-md border border-rose-900 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Editor */}
        <section className="lg:col-span-3 bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          {mode === "none" ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              Pick a row to edit, or create a new content page.
            </div>
          ) : (
            <ContentPageEditor
              key={`${selected?.route ?? ""}|${mode}`}
              initial={selected}
              lockRoute={mode === "edit"}
              onSaved={() => load()}
            />
          )}
        </section>
      </div>
    </div>
  );
}
