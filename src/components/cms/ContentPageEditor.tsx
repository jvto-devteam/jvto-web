"use client";

// src/components/cms/ContentPageEditor.tsx
// Reusable single-row editor for a content_pages record. Embedded by both the
// Content Pages collection list and the Route Content Console detail.
//
// Fields: route (lockable), lang, seo.title, seo.description, seo.schema_json
// (raw JSON textarea, JSON.parse-validated), content.h1, content.body_md
// (PLAIN markdown <textarea> — the site renders it via MarkdownRenderer;
// TipTap/HTML would break it), content.faq (repeatable {q,a}), content.faq_title,
// is_active.
//
// Save draft  → POST /api/content-pages (upsert), no gate.
// Publish     → facts-lock validate → BLOCK on violations → save → revalidate.

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, Rocket, Loader2, AlertTriangle } from "lucide-react";
import {
  validateContent,
  revalidateRoute,
  buildContentPageDraftText,
} from "./publishHelpers";

export interface ContentPageInitial {
  route?: string;
  lang?: string;
  seo?: unknown;
  content?: unknown;
  is_active?: boolean;
}

interface Props {
  initial?: ContentPageInitial | null;
  /** Lock the route field (console detail + editing an existing row). */
  lockRoute?: boolean;
  onSaved?: (row: unknown) => void;
}

interface FaqRow {
  q: string;
  a: string;
}

interface FormState {
  route: string;
  lang: string;
  seoTitle: string;
  seoDescription: string;
  schemaJsonText: string;
  h1: string;
  bodyMd: string;
  faq: FaqRow[];
  faqTitle: string;
  isActive: boolean;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function fromInitial(initial?: ContentPageInitial | null): FormState {
  const seo = isRecord(initial?.seo) ? (initial!.seo as Record<string, unknown>) : {};
  const content = isRecord(initial?.content)
    ? (initial!.content as Record<string, unknown>)
    : {};

  const schemaJsonRaw =
    seo.schema_json !== undefined ? seo.schema_json : seo.schema_jsonld;

  const faqRaw = Array.isArray(content.faq) ? content.faq : [];
  const faq: FaqRow[] = faqRaw.map((item) => {
    const r = isRecord(item) ? item : {};
    return {
      q: asStr(r.q ?? r.question),
      a: asStr(r.a ?? r.answer),
    };
  });

  return {
    route: asStr(initial?.route),
    lang: asStr(initial?.lang) || "en",
    seoTitle: asStr(seo.title),
    seoDescription: asStr(seo.description),
    schemaJsonText:
      schemaJsonRaw !== undefined && schemaJsonRaw !== null
        ? JSON.stringify(schemaJsonRaw, null, 2)
        : "",
    h1: asStr(content.h1),
    bodyMd: asStr(content.body_md),
    faq,
    faqTitle: asStr(content.faq_title),
    isActive: initial?.is_active !== false,
  };
}

const inputCls =
  "w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelCls = "block text-xs font-medium text-slate-300 mb-1";

export default function ContentPageEditor({
  initial,
  lockRoute,
  onSaved,
}: Props) {
  const [form, setForm] = useState<FormState>(() => fromInitial(initial));
  const [busy, setBusy] = useState<null | "draft" | "publish">(null);
  const [error, setError] = useState<string | null>(null);
  const [violations, setViolations] = useState<string[] | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // Re-seed when the parent swaps the initial payload (row pick / console route).
  const initialKey = useMemo(
    () => `${initial?.route ?? ""}|${initial?.lang ?? ""}`,
    [initial?.route, initial?.lang],
  );
  useEffect(() => {
    setForm(fromInitial(initial));
    setError(null);
    setViolations(null);
    setOkMsg(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  function patch(p: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...p }));
  }

  function setFaq(idx: number, key: keyof FaqRow, value: string) {
    setForm((prev) => {
      const faq = prev.faq.slice();
      faq[idx] = { ...faq[idx], [key]: value };
      return { ...prev, faq };
    });
  }

  function addFaq() {
    setForm((prev) => ({ ...prev, faq: [...prev.faq, { q: "", a: "" }] }));
  }

  function removeFaq(idx: number) {
    setForm((prev) => ({ ...prev, faq: prev.faq.filter((_, i) => i !== idx) }));
  }

  /** Build the POST payload; throws on invalid schema JSON. */
  function buildPayload() {
    const route = form.route.trim();
    if (!route || !route.startsWith("/")) {
      throw new Error("route wajib diisi dan harus diawali '/'");
    }

    const seo: Record<string, unknown> = {
      title: form.seoTitle || undefined,
      description: form.seoDescription || undefined,
    };
    if (form.schemaJsonText.trim()) {
      try {
        seo.schema_json = JSON.parse(form.schemaJsonText);
      } catch {
        throw new Error("seo.schema_json is not valid JSON — fix before saving.");
      }
    }

    const cleanFaq = form.faq
      .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
      .filter((f) => f.q || f.a);

    const content: Record<string, unknown> = {
      h1: form.h1 || undefined,
      body_md: form.bodyMd || undefined,
      faq: cleanFaq,
      faq_title: form.faqTitle || undefined,
    };

    return {
      route,
      lang: form.lang.trim() || "en",
      seo,
      content,
      is_active: form.isActive,
    };
  }

  async function save(payload: ReturnType<typeof buildPayload>) {
    const res = await fetch("/api/content-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || `Save failed (${res.status})`);
    }
    return data;
  }

  async function onSaveDraft() {
    setError(null);
    setViolations(null);
    setOkMsg(null);
    setBusy("draft");
    try {
      const payload = buildPayload();
      const row = await save(payload);
      setOkMsg("Draft saved (no facts-lock gate, no revalidation).");
      onSaved?.(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function onPublish() {
    setError(null);
    setViolations(null);
    setOkMsg(null);
    setBusy("publish");
    try {
      const payload = buildPayload();

      // 1. Facts-lock gate on the editable text blob.
      const draftText = buildContentPageDraftText({
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        h1: form.h1,
        bodyMd: form.bodyMd,
        faq: form.faq,
      });
      const check = await validateContent(draftText);
      if (!check.ok) {
        setViolations(check.violations ?? []);
        setError(
          check.error ||
            "Publish blocked — content violates docs/CANONICAL_FACTS.md.",
        );
        return; // BLOCK: do not save.
      }

      // 2. Save via write API.
      const row = await save(payload);

      // 3. On-demand revalidate the public route.
      const rev = await revalidateRoute(payload.route);
      setOkMsg(
        rev.revalidated
          ? `Published + revalidated ${payload.route}.`
          : `Saved. Revalidation warning: ${rev.error ?? "unknown"}.`,
      );
      onSaved?.(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}
      {violations && violations.length > 0 && (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            Canonical-facts violations (publish blocked):
          </div>
          <ul className="list-disc pl-5 space-y-0.5 font-mono">
            {violations.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}
      {okMsg && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
          {okMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className={labelCls}>
            Route <span className="text-rose-400">*</span>
          </label>
          <input
            className={inputCls}
            value={form.route}
            readOnly={!!lockRoute}
            onChange={(e) => patch({ route: e.target.value })}
            placeholder="/travel-guide/best-time-to-visit"
          />
          {lockRoute && (
            <p className="mt-1 text-[10px] text-slate-500">
              Route is locked for this record.
            </p>
          )}
        </div>
        <div>
          <label className={labelCls}>Lang</label>
          <input
            className={inputCls}
            value={form.lang}
            onChange={(e) => patch({ lang: e.target.value })}
            placeholder="en"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>SEO Title</label>
          <input
            className={inputCls}
            value={form.seoTitle}
            onChange={(e) => patch({ seoTitle: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>SEO Description</label>
          <input
            className={inputCls}
            value={form.seoDescription}
            onChange={(e) => patch({ seoDescription: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>SEO Schema JSON-LD (raw JSON)</label>
        <textarea
          className={`${inputCls} font-mono min-h-[120px] nice-scrollbar`}
          value={form.schemaJsonText}
          onChange={(e) => patch({ schemaJsonText: e.target.value })}
          placeholder='{"@context":"https://schema.org","@type":"WebPage"}'
        />
        <p className="mt-1 text-[10px] text-slate-500">
          Validated with JSON.parse before save. Leave empty to emit no
          page-authored schema.
        </p>
      </div>

      <div>
        <label className={labelCls}>Content H1</label>
        <input
          className={inputCls}
          value={form.h1}
          onChange={(e) => patch({ h1: e.target.value })}
        />
      </div>

      <div>
        <label className={labelCls}>Body (Markdown)</label>
        <textarea
          className={`${inputCls} font-mono min-h-[200px] nice-scrollbar`}
          value={form.bodyMd}
          onChange={(e) => patch({ bodyMd: e.target.value })}
          placeholder="## Heading&#10;&#10;Plain markdown — rendered by MarkdownRenderer. Do NOT paste HTML."
        />
        <p className="mt-1 text-[10px] text-slate-500">
          Plain markdown only. The site renders this as markdown — HTML would
          break it.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelCls}>FAQ (CMS fallback)</label>
          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
          >
            <Plus className="h-3 w-3" /> Add Q&amp;A
          </button>
        </div>
        <input
          className={inputCls}
          value={form.faqTitle}
          onChange={(e) => patch({ faqTitle: e.target.value })}
          placeholder="FAQ section title (optional)"
        />
        {form.faq.length === 0 && (
          <p className="text-[11px] text-slate-500">
            No CMS FAQ rows. Note: CMS FAQ is the lowest-precedence source and is
            suppressed when a canonical / narrative_claims source exists for this
            route.
          </p>
        )}
        {form.faq.map((row, idx) => (
          <div
            key={idx}
            className="rounded-md border border-slate-800 bg-slate-950/40 p-2 space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                className={inputCls}
                value={row.q}
                onChange={(e) => setFaq(idx, "q", e.target.value)}
                placeholder="Question"
              />
              <button
                type="button"
                onClick={() => removeFaq(idx)}
                className="p-1.5 rounded-md border border-rose-900 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea
              className={`${inputCls} min-h-[60px] nice-scrollbar`}
              value={row.a}
              onChange={(e) => setFaq(idx, "a", e.target.value)}
              placeholder="Answer"
            />
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-200">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => patch({ isActive: e.target.checked })}
          className="h-4 w-4 rounded border-slate-700 bg-slate-900"
        />
        <span>is_active (page live)</span>
      </label>

      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-medium px-3 py-2 transition disabled:opacity-60"
        >
          {busy === "draft" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-medium px-3 py-2 transition disabled:opacity-60"
        >
          {busy === "publish" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          Publish (gate + revalidate)
        </button>
        <span className="text-[10px] text-slate-500">
          Publish runs the facts-lock gate, then saves, then revalidates the
          route. Save draft skips both.
        </span>
      </div>
    </div>
  );
}
