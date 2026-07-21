"use client";

// src/components/cms/SectionsBlockEditor.tsx
// Block-model pilot editor for the EXISTING content.sections[].blocks[] vocabulary
// (the same shape rendered by src/components/content/BlocksRenderer.tsx on the live
// why-jvto / travel-guide pages). Style lives in code (BlocksRenderer); content lives
// in the DB (content_pages.content.sections). This editor makes that structure
// editable from the CMS with a real draft -> publish flow:
//
//   Save draft  -> writes content._draft (live keys untouched; the public page is
//                  unaffected until you Publish). No facts-lock gate.
//   Publish     -> facts-lock validate the draft text -> BLOCK on violations ->
//                  promote _draft into the live content.sections, snapshot the prior
//                  published content into content._history[] (bounded), clear _draft
//                  -> revalidatePath so the live route reflects it.
//
// Supported block types (mirrors BlocksRenderer): markdown, image, grid (card grid).
// crew_grid blocks are DATA-driven (crew_members) and render-only here: preserved
// verbatim, shown locked. Any other/unknown block is preserved verbatim too, so the
// editor never drops content it does not understand.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Rocket,
  Loader2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Lock,
} from "lucide-react";
import { validateContent, revalidateRoute } from "./publishHelpers";

// ── Block model (aligned with BlocksRenderer) ──────────────────────────────
interface MarkdownBlock {
  type: "markdown";
  body_md: string;
}
interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string | null;
  orientation?: "portrait" | "landscape" | null;
}
interface CardItem {
  type: "card";
  title: string;
  summary?: string;
  href?: string;
  icon?: string;
}
interface GridBlock {
  type: "grid";
  columns?: 2 | 3;
  items: CardItem[];
}
// Blocks the editor renders forms for.
type EditableBlock = MarkdownBlock | ImageBlock | GridBlock;
// Blocks preserved verbatim (crew_grid + any unknown shape).
interface OpaqueBlock {
  type: string;
  [key: string]: unknown;
}
type AnyBlock = EditableBlock | OpaqueBlock;

interface Section {
  id: string;
  title?: string;
  summary?: string;
  blocks?: AnyBlock[];
  // Preserve any other section keys (body_md, evidence, …) verbatim.
  [key: string]: unknown;
}

const EDITABLE_TYPES = new Set(["markdown", "image", "grid"]);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function asStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Read the working sections: prefer an in-progress _draft, else live sections. */
function readInitialSections(content: unknown): {
  sections: Section[];
  fromDraft: boolean;
} {
  const c = isRecord(content) ? content : {};
  const draft = isRecord(c._draft) ? c._draft : null;
  const draftSections =
    draft && Array.isArray(draft.sections) ? (draft.sections as Section[]) : null;
  if (draftSections) return { sections: clone(draftSections), fromDraft: true };
  const live = Array.isArray(c.sections) ? (c.sections as Section[]) : [];
  return { sections: clone(live), fromDraft: false };
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}

/** Flatten all editable text so the facts-lock gate can scan it. */
function buildDraftText(sections: Section[]): string {
  const parts: string[] = [];
  for (const sec of sections) {
    if (sec.title) parts.push(sec.title);
    if (sec.summary) parts.push(sec.summary);
    if (typeof sec.body_md === "string") parts.push(sec.body_md);
    for (const b of sec.blocks ?? []) {
      if (b.type === "markdown") parts.push(asStr((b as MarkdownBlock).body_md));
      else if (b.type === "image") {
        const img = b as ImageBlock;
        parts.push(asStr(img.alt), asStr(img.caption));
      } else if (b.type === "grid") {
        for (const it of (b as GridBlock).items ?? []) {
          parts.push(asStr(it.title), asStr(it.summary), asStr(it.href));
        }
      }
    }
  }
  return parts.filter(Boolean).join("\n");
}

const inputCls =
  "w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelCls = "block text-[11px] font-medium text-slate-300 mb-1";
const miniBtn =
  "inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1 disabled:opacity-40";

export interface SectionsEditorInitial {
  route?: string;
  lang?: string;
  seo?: unknown;
  content?: unknown;
  is_active?: boolean;
}

interface Props {
  initial: SectionsEditorInitial;
  onSaved?: (row: unknown) => void;
}

export default function SectionsBlockEditor({ initial, onSaved }: Props) {
  const route = asStr(initial.route);
  const lang = asStr(initial.lang) || "en";

  const init = useMemo(() => readInitialSections(initial.content), [initial.content]);
  const [sections, setSections] = useState<Section[]>(init.sections);
  const [editingDraft, setEditingDraft] = useState(init.fromDraft);

  // Preserve the full original content/seo so non-section keys survive a save.
  const contentRef = useRef<Record<string, unknown>>(
    isRecord(initial.content) ? clone(initial.content) : {},
  );
  const seoRef = useRef<unknown>(initial.seo ?? {});

  const [busy, setBusy] = useState<null | "draft" | "publish">(null);
  const [error, setError] = useState<string | null>(null);
  const [violations, setViolations] = useState<string[] | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const initialKey = useMemo(
    () => `${initial.route ?? ""}|${initial.lang ?? ""}`,
    [initial.route, initial.lang],
  );
  useEffect(() => {
    const re = readInitialSections(initial.content);
    contentRef.current = isRecord(initial.content) ? clone(initial.content) : {};
    seoRef.current = initial.seo ?? {};
    setSections(re.sections);
    setEditingDraft(re.fromDraft);
    setError(null);
    setViolations(null);
    setOkMsg(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  // ── Section ops ──
  function patchSection(idx: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((prev) => [
      ...prev,
      { id: `section-${prev.length + 1}`, title: "New section", blocks: [] },
    ]);
  }
  function removeSection(idx: number) {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveSection(idx: number, dir: -1 | 1) {
    setSections((prev) => moveItem(prev, idx, idx + dir));
  }

  // ── Block ops ──
  function patchBlock(si: number, bi: number, patch: Record<string, unknown>) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== si) return s;
        const blocks = (s.blocks ?? []).map((b, j) =>
          j === bi ? ({ ...b, ...patch } as AnyBlock) : b,
        );
        return { ...s, blocks };
      }),
    );
  }
  function addBlock(si: number, type: "markdown" | "image" | "grid") {
    const fresh: EditableBlock =
      type === "markdown"
        ? { type: "markdown", body_md: "" }
        : type === "image"
          ? { type: "image", src: "", alt: "" }
          : { type: "grid", columns: 2, items: [] };
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, blocks: [...(s.blocks ?? []), fresh] } : s,
      ),
    );
  }
  function removeBlock(si: number, bi: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, blocks: (s.blocks ?? []).filter((_, j) => j !== bi) } : s,
      ),
    );
  }
  function moveBlock(si: number, bi: number, dir: -1 | 1) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, blocks: moveItem(s.blocks ?? [], bi, bi + dir) } : s,
      ),
    );
  }

  // ── Card (grid) ops ──
  function patchCard(si: number, bi: number, ci: number, patch: Partial<CardItem>) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== si) return s;
        const blocks = (s.blocks ?? []).map((b, j) => {
          if (j !== bi || b.type !== "grid") return b;
          const grid = b as GridBlock;
          const items = grid.items.map((c, k) => (k === ci ? { ...c, ...patch } : c));
          return { ...grid, items };
        });
        return { ...s, blocks };
      }),
    );
  }
  function addCard(si: number, bi: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== si) return s;
        const blocks = (s.blocks ?? []).map((b, j) => {
          if (j !== bi || b.type !== "grid") return b;
          const grid = b as GridBlock;
          return { ...grid, items: [...grid.items, { type: "card", title: "" }] };
        });
        return { ...s, blocks };
      }),
    );
  }
  function removeCard(si: number, bi: number, ci: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== si) return s;
        const blocks = (s.blocks ?? []).map((b, j) => {
          if (j !== bi || b.type !== "grid") return b;
          const grid = b as GridBlock;
          return { ...grid, items: grid.items.filter((_, k) => k !== ci) };
        });
        return { ...s, blocks };
      }),
    );
  }

  // ── Persistence ──
  // Refetch the current row so we merge onto the LATEST seo/content rather than
  // the stale mount-time refs — otherwise a Save/Publish here could clobber edits
  // just made by the adjacent ContentPageEditor or another admin session (FAQ,
  // SEO, or other content keys). We only ever override sections/_draft/_history;
  // every other seo/content field is taken from the fresh row.
  async function fetchFreshRow(): Promise<{
    seo: unknown;
    content: Record<string, unknown>;
  }> {
    try {
      const res = await fetch("/api/content-pages", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const rows = await res.json().catch(() => []);
        if (Array.isArray(rows)) {
          const match = rows.find(
            (r) => isRecord(r) && r.route === route && (r.lang ?? "en") === lang,
          );
          if (isRecord(match)) {
            return {
              seo: match.seo ?? seoRef.current,
              content: isRecord(match.content)
                ? (clone(match.content) as Record<string, unknown>)
                : {},
            };
          }
        }
      }
    } catch {
      /* fall through to the mount-time refs below */
    }
    return { seo: seoRef.current, content: clone(contentRef.current) };
  }

  async function post(seo: unknown, content: Record<string, unknown>) {
    const res = await fetch("/api/content-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route,
        lang,
        seo,
        content,
        is_active: initial.is_active !== false,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || `Save failed (${res.status})`);
    return data;
  }

  async function onSaveDraft() {
    setError(null);
    setViolations(null);
    setOkMsg(null);
    setBusy("draft");
    try {
      // Draft isolation: write sections under content._draft; leave the live
      // content.sections untouched so the public page does not change. Merge onto
      // the freshly-refetched row so sibling-editor changes are preserved.
      const fresh = await fetchFreshRow();
      const base = fresh.content;
      base._draft = { sections, saved_at_note: "cms-draft" };
      await post(fresh.seo, base);
      contentRef.current = base;
      seoRef.current = fresh.seo;
      setEditingDraft(true);
      setOkMsg("Draft saved. The live page is unchanged until you Publish.");
      onSaved?.(base);
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
      // 1. Facts-lock gate on the draft's editable text.
      const check = await validateContent(buildDraftText(sections));
      if (!check.ok) {
        setViolations(check.violations ?? []);
        setError(
          check.error ||
            "Publish blocked — content violates docs/CANONICAL_FACTS.md.",
        );
        return;
      }

      // 2. Promote: live sections := draft. Merge onto the freshly-refetched row
      //    (preserve sibling-editor seo/content), snapshot the prior published
      //    content into content._history[] (bounded to 5), clear _draft.
      const fresh = await fetchFreshRow();
      const base = fresh.content;
      const prior = clone(base);
      delete (prior as Record<string, unknown>)._draft;
      delete (prior as Record<string, unknown>)._history;

      const historyRaw = Array.isArray(base._history) ? base._history : [];
      const history = [prior, ...historyRaw].slice(0, 5);

      base.sections = sections;
      base._history = history;
      delete base._draft;

      const row = await post(fresh.seo, base);
      contentRef.current = base;
      seoRef.current = fresh.seo;
      setEditingDraft(false);

      // 3. Revalidate the live route.
      const rev = await revalidateRoute(route);
      setOkMsg(
        rev.revalidated
          ? `Published + revalidated ${route}. Prior version saved to history (${history.length}).`
          : `Published. Revalidation warning: ${rev.error ?? "unknown"}.`,
      );
      onSaved?.(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(null);
    }
  }

  const historyCount = Array.isArray(contentRef.current._history)
    ? (contentRef.current._history as unknown[]).length
    : 0;

  return (
    <div className="space-y-4">
      {editingDraft && (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
          Editing an unpublished <strong>draft</strong>. The live page still shows the
          last published version until you Publish.
        </div>
      )}
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

      {sections.length === 0 && (
        <p className="text-[11px] text-slate-500">
          No sections yet. Add one to start composing this page from blocks.
        </p>
      )}

      <div className="space-y-4">
        {sections.map((sec, si) => (
          <div
            key={si}
            className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500">
                section #{si + 1}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  className={miniBtn}
                  disabled={si === 0}
                  onClick={() => moveSection(si, -1)}
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className={miniBtn}
                  disabled={si === sections.length - 1}
                  onClick={() => moveSection(si, 1)}
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md border border-rose-900 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200"
                  onClick={() => removeSection(si)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className={labelCls}>id (anchor)</label>
                <input
                  className={inputCls}
                  value={asStr(sec.id)}
                  onChange={(e) => patchSection(si, { id: e.target.value })}
                  placeholder="section-slug"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>title</label>
                <input
                  className={inputCls}
                  value={asStr(sec.title)}
                  onChange={(e) => patchSection(si, { title: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>summary (optional)</label>
              <input
                className={inputCls}
                value={asStr(sec.summary)}
                onChange={(e) => patchSection(si, { summary: e.target.value })}
              />
            </div>

            {/* Blocks */}
            <div className="space-y-2 pl-3 border-l border-slate-800">
              {(sec.blocks ?? []).map((b, bi) => {
                const isEditable = EDITABLE_TYPES.has(b.type);
                return (
                  <div
                    key={bi}
                    className="rounded-md border border-slate-800 bg-slate-900/40 p-2 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                        {b.type}
                      </span>
                      {!isEditable && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                          <Lock className="h-3 w-3" /> preserved (edit in code/data)
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          className={miniBtn}
                          disabled={bi === 0}
                          onClick={() => moveBlock(si, bi, -1)}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className={miniBtn}
                          disabled={bi === (sec.blocks?.length ?? 0) - 1}
                          onClick={() => moveBlock(si, bi, 1)}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        {isEditable ? (
                          <button
                            type="button"
                            className="p-1.5 rounded-md border border-rose-900 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200"
                            onClick={() => removeBlock(si, bi)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span
                            className="p-1.5 rounded-md border border-slate-800 text-slate-600"
                            title="Preserved block — delete disabled so verbatim content (e.g. crew_grid) is never dropped."
                          >
                            <Lock className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {b.type === "markdown" && (
                      <textarea
                        className={`${inputCls} font-mono min-h-[110px] nice-scrollbar`}
                        value={asStr((b as MarkdownBlock).body_md)}
                        onChange={(e) =>
                          patchBlock(si, bi, { body_md: e.target.value })
                        }
                        placeholder="Plain markdown — rendered by MarkdownRenderer."
                      />
                    )}

                    {b.type === "image" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="md:col-span-2">
                          <label className={labelCls}>src</label>
                          <input
                            className={inputCls}
                            value={asStr((b as ImageBlock).src)}
                            onChange={(e) =>
                              patchBlock(si, bi, { src: e.target.value })
                            }
                            placeholder="/images/... or https://..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelCls}>alt</label>
                          <input
                            className={inputCls}
                            value={asStr((b as ImageBlock).alt)}
                            onChange={(e) =>
                              patchBlock(si, bi, { alt: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className={labelCls}>caption (optional)</label>
                          <input
                            className={inputCls}
                            value={asStr((b as ImageBlock).caption)}
                            onChange={(e) =>
                              patchBlock(si, bi, { caption: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className={labelCls}>orientation</label>
                          <select
                            className={inputCls}
                            value={asStr((b as ImageBlock).orientation) || "landscape"}
                            onChange={(e) =>
                              patchBlock(si, bi, { orientation: e.target.value })
                            }
                          >
                            <option value="landscape">landscape</option>
                            <option value="portrait">portrait</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {b.type === "grid" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className={labelCls}>columns</label>
                          <select
                            className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-50"
                            value={String((b as GridBlock).columns ?? 2)}
                            onChange={(e) =>
                              patchBlock(si, bi, {
                                columns: Number(e.target.value) as 2 | 3,
                              })
                            }
                          >
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                          <button
                            type="button"
                            className={`${miniBtn} ml-auto`}
                            onClick={() => addCard(si, bi)}
                          >
                            <Plus className="h-3 w-3" /> Add card
                          </button>
                        </div>
                        {((b as GridBlock).items ?? []).map((card, ci) => (
                          <div
                            key={ci}
                            className="rounded-md border border-slate-800 bg-slate-950/40 p-2 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                className={inputCls}
                                value={asStr(card.title)}
                                onChange={(e) =>
                                  patchCard(si, bi, ci, { title: e.target.value })
                                }
                                placeholder="Card title"
                              />
                              <button
                                type="button"
                                className="p-1.5 rounded-md border border-rose-900 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200"
                                onClick={() => removeCard(si, bi, ci)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <input
                              className={inputCls}
                              value={asStr(card.summary)}
                              onChange={(e) =>
                                patchCard(si, bi, ci, { summary: e.target.value })
                              }
                              placeholder="Summary (optional)"
                            />
                            <input
                              className={inputCls}
                              value={asStr(card.href)}
                              onChange={(e) =>
                                patchCard(si, bi, ci, { href: e.target.value })
                              }
                              placeholder="Link href (optional)"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500">add block:</span>
                <button
                  type="button"
                  className={miniBtn}
                  onClick={() => addBlock(si, "markdown")}
                >
                  <Plus className="h-3 w-3" /> markdown
                </button>
                <button
                  type="button"
                  className={miniBtn}
                  onClick={() => addBlock(si, "image")}
                >
                  <Plus className="h-3 w-3" /> image
                </button>
                <button
                  type="button"
                  className={miniBtn}
                  onClick={() => addBlock(si, "grid")}
                >
                  <Plus className="h-3 w-3" /> card grid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={miniBtn} onClick={addSection}>
        <Plus className="h-3 w-3" /> Add section
      </button>

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
          Draft is isolated (live page unchanged). Publish runs the facts-lock gate,
          promotes the draft, snapshots the prior version to history ({historyCount}),
          then revalidates.
        </span>
      </div>
    </div>
  );
}
