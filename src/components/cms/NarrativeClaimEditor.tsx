"use client";

// src/components/cms/NarrativeClaimEditor.tsx
// Reusable list + form widget for narrative_claims (highest-precedence FAQ
// source). Self-contained: fetches GET /api/narrative-claims, lets an admin
// pick / create / edit / delete a claim. Optional `primaryPage` filter scopes
// the list to one route (the Route Content Console passes the console route so
// only that route's claims show + new claims default to it).
//
// A narrative_claim IS a FAQ pair: pillar = question, core_claim = answer.
// Save draft → POST/PATCH, no gate. Publish → facts-lock validate → BLOCK on
// violations → save → revalidate the primary_page.

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Rocket,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import {
  validateContent,
  revalidateRoute,
  buildNarrativeClaimDraftText,
} from "./publishHelpers";

interface ClaimRow {
  id: string;
  pillar: string | null;
  core_claim: string | null;
  primary_page: string | null;
  nlp_variants?: unknown;
  evidence_slugs?: unknown;
}

interface Props {
  /** Scope the list + default new-claim route to this primary_page. */
  primaryPage?: string;
  /** Lock the primary_page field (console embed). */
  lockPrimaryPage?: boolean;
  onChanged?: () => void;
}

interface FormState {
  id: string;
  pillar: string;
  core_claim: string;
  primary_page: string;
  nlp_variants: string; // newline-separated OR raw JSON array
  evidence_slugs: string; // comma-separated
}

const inputCls =
  "w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelCls = "block text-xs font-medium text-slate-300 mb-1";

function emptyForm(primaryPage?: string): FormState {
  return {
    id: "",
    pillar: "",
    core_claim: "",
    primary_page: primaryPage ?? "",
    nlp_variants: "",
    evidence_slugs: "",
  };
}

function variantsToText(v: unknown): string {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string").join("\n");
  if (v == null) return "";
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return "";
  }
}

function slugsToText(v: unknown): string {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string").join(", ");
  return "";
}

/** Parse nlp_variants field: raw JSON array if it parses to one, else newline list. */
function parseVariants(text: string): unknown {
  const t = text.trim();
  if (!t) return [];
  if (t.startsWith("[")) {
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* fall through to line split */
    }
  }
  return t
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSlugs(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function NarrativeClaimEditor({
  primaryPage,
  lockPrimaryPage,
  onChanged,
}: Props) {
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(() => emptyForm(primaryPage));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "draft" | "publish" | "delete">(null);
  const [error, setError] = useState<string | null>(null);
  const [violations, setViolations] = useState<string[] | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/narrative-claims", { cache: "no-store" });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        throw new Error(data?.message || `Load failed (${res.status})`);
      }
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load claims");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    if (!primaryPage) return claims;
    return claims.filter((c) => c.primary_page === primaryPage);
  }, [claims, primaryPage]);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm(primaryPage));
    setError(null);
    setViolations(null);
    setOkMsg(null);
  }

  function startEdit(c: ClaimRow) {
    setEditingId(c.id);
    setForm({
      id: c.id,
      pillar: c.pillar ?? "",
      core_claim: c.core_claim ?? "",
      primary_page: c.primary_page ?? primaryPage ?? "",
      nlp_variants: variantsToText(c.nlp_variants),
      evidence_slugs: slugsToText(c.evidence_slugs),
    });
    setError(null);
    setViolations(null);
    setOkMsg(null);
  }

  function patch(p: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...p }));
  }

  function buildPayload() {
    const pillar = form.pillar.trim();
    const core_claim = form.core_claim.trim();
    if (!pillar || !core_claim) {
      throw new Error("pillar (question) and core_claim (answer) are required.");
    }
    return {
      id: form.id.trim() || undefined,
      pillar,
      core_claim,
      primary_page: form.primary_page.trim() || null,
      nlp_variants: parseVariants(form.nlp_variants),
      evidence_slugs: parseSlugs(form.evidence_slugs),
    };
  }

  async function save(payload: ReturnType<typeof buildPayload>) {
    const url = editingId
      ? `/api/narrative-claims/${encodeURIComponent(editingId)}`
      : "/api/narrative-claims";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || `Save failed (${res.status})`);
    }
    return data as ClaimRow;
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
      setEditingId(row.id);
      setForm((prev) => ({ ...prev, id: row.id }));
      await load();
      onChanged?.();
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

      const draftText = buildNarrativeClaimDraftText({
        pillar: payload.pillar,
        core_claim: payload.core_claim,
        nlp_variants: payload.nlp_variants,
      });
      const check = await validateContent(draftText);
      if (!check.ok) {
        setViolations(check.violations ?? []);
        setError(
          check.error ||
            "Publish blocked — claim violates docs/CANONICAL_FACTS.md.",
        );
        return; // BLOCK.
      }

      const row = await save(payload);

      let revNote = "";
      if (payload.primary_page) {
        const rev = await revalidateRoute(payload.primary_page);
        revNote = rev.revalidated
          ? ` + revalidated ${payload.primary_page}`
          : ` (revalidation warning: ${rev.error ?? "unknown"})`;
      }
      setOkMsg(`Published claim${revNote}.`);
      setEditingId(row.id);
      setForm((prev) => ({ ...prev, id: row.id }));
      await load();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(null);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this narrative claim?")) return;
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(
        `/api/narrative-claims/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Delete failed (${res.status})`);
      }
      if (editingId === id) startCreate();
      await load();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            Claims{primaryPage ? ` for ${primaryPage}` : ""}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Reload
            </button>
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-medium px-2.5 py-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> New claim
            </button>
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading claims...
            </div>
          ) : visible.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              No narrative claims{primaryPage ? " for this route" : ""}.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/80">
              {visible.map((c) => (
                <li
                  key={c.id}
                  className={`px-3 py-2 hover:bg-slate-900/60 ${
                    editingId === c.id ? "bg-slate-900/70" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="text-left flex-1 min-w-0"
                    >
                      <div className="text-[12px] font-medium text-slate-100 truncate">
                        {c.pillar || "(no pillar)"}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {c.id} · {c.primary_page || "no route"}
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="p-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(c.id)}
                        disabled={busy === "delete"}
                        className="p-1 rounded-md border border-rose-900 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-100">
          {editingId ? "Edit claim" : "New claim"}
        </h3>

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

        <div>
          <label className={labelCls}>id (optional on create)</label>
          <input
            className={inputCls}
            value={form.id}
            readOnly={!!editingId}
            onChange={(e) => patch({ id: e.target.value })}
            placeholder="auto: nc-<timestamp>"
          />
        </div>
        <div>
          <label className={labelCls}>
            pillar (FAQ question) <span className="text-rose-400">*</span>
          </label>
          <input
            className={inputCls}
            value={form.pillar}
            onChange={(e) => patch({ pillar: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>
            core_claim (FAQ answer) <span className="text-rose-400">*</span>
          </label>
          <textarea
            className={`${inputCls} min-h-[100px] nice-scrollbar`}
            value={form.core_claim}
            onChange={(e) => patch({ core_claim: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>primary_page (route)</label>
          <input
            className={inputCls}
            value={form.primary_page}
            readOnly={!!lockPrimaryPage}
            onChange={(e) => patch({ primary_page: e.target.value })}
            placeholder="/travel-guide/best-time-to-visit"
          />
        </div>
        <div>
          <label className={labelCls}>
            nlp_variants (one per line, or a raw JSON array)
          </label>
          <textarea
            className={`${inputCls} font-mono min-h-[80px] nice-scrollbar`}
            value={form.nlp_variants}
            onChange={(e) => patch({ nlp_variants: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>evidence_slugs (comma-separated)</label>
          <input
            className={inputCls}
            value={form.evidence_slugs}
            onChange={(e) => patch({ evidence_slugs: e.target.value })}
            placeholder="nib-1102230032918, polpar-license"
          />
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-medium px-3 py-2 disabled:opacity-60"
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
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-medium px-3 py-2 disabled:opacity-60"
          >
            {busy === "publish" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            Publish (gate + revalidate)
          </button>
        </div>
      </div>
    </div>
  );
}
