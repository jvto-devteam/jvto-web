// src/app/(cms)/cms/pages/[...route]/page.tsx
// Route Content Console — detail. Reconstructs the route from the catch-all
// param, resolves the full composition (resolvePageContent), and renders the
// BREAKDOWN: every content atom with its source badge, owner, editable flag,
// and note. Below the breakdown it embeds the two editors seeded from
// composition.editable. Read-only atoms (synced/canonical/facts-lock/hardcoded)
// render as visibly NON-editable so an admin can see WHY a CMS FAQ edit may not
// render (precedence made visible). Server Component.
import Link from "@/components/website/AppLink";
import { ArrowLeft, Lock, Pencil } from "lucide-react";
import {
  resolvePageContent,
  type AtomSource,
  type ContentAtom,
} from "@/lib/content/resolvePageContent";
import ContentPageEditor from "@/components/cms/ContentPageEditor";
import NarrativeClaimEditor from "@/components/cms/NarrativeClaimEditor";

const ROOT_SENTINEL = "~root";

const SOURCE_BADGE: Record<AtomSource, string> = {
  narrative_claims: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  canonical: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  cms: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  synced: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  "facts-lock": "border-rose-500/40 bg-rose-500/10 text-rose-300",
  hardcoded: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  none: "border-slate-600/40 bg-slate-700/10 text-slate-400",
};

function previewValue(value: unknown): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "string") {
    return value.length > 160 ? `${value.slice(0, 160)}…` : value || "(empty)";
  }
  let s: string;
  try {
    s = JSON.stringify(value);
  } catch {
    s = String(value);
  }
  return s.length > 160 ? `${s.slice(0, 160)}…` : s;
}

export default async function RouteConsoleDetailPage({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route: segments } = await params;

  const route =
    segments.length === 1 && segments[0] === ROOT_SENTINEL
      ? "/"
      : "/" + segments.map((s) => decodeURIComponent(s)).join("/");

  let composition;
  let resolveError: string | null = null;
  try {
    composition = await resolvePageContent(route);
  } catch (err) {
    resolveError = err instanceof Error ? err.message : "Failed to resolve route";
  }

  const editorInitial = composition?.editable.contentPage ?? {
    route,
    lang: "en",
    seo: {},
    content: {},
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/cms/pages"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All routes
          </Link>
          <h1 className="mt-1 text-lg font-semibold text-slate-50 truncate">
            {route}
          </h1>
          <p className="text-xs text-slate-500">
            Content ownership breakdown — resolved via resolvePageContent().
          </p>
        </div>
      </div>

      {resolveError && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          Could not resolve this route: {resolveError}
        </div>
      )}

      {composition && (
        <>
          {/* Summary chips */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                emitVia
              </div>
              <div className="text-sm text-slate-100">{composition.emitVia}</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                FAQ source
              </div>
              <div className="text-sm text-slate-100">
                {composition.faq.source}
              </div>
              <div className="text-[10px] text-slate-500">
                origin: {composition.faq.origin} · suppressCmsFaq:{" "}
                {String(composition.faq.suppressCmsFaq)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                FAQ items
              </div>
              <div className="text-sm text-slate-100">
                {composition.faq.items.length}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Schema types
              </div>
              <div className="text-sm text-slate-100">
                {composition.schemaTypes.length
                  ? composition.schemaTypes.join(", ")
                  : "—"}
              </div>
            </div>
          </section>

          {/* Atom breakdown */}
          <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Content atoms ({composition.atoms.length})
            </h2>
            <p className="text-xs text-slate-500">
              Each atom shows where its value is sourced from and whether the CMS
              can edit it. Read-only atoms are owned elsewhere — editing the CMS
              value will NOT change what renders.
            </p>
            <div className="space-y-2">
              {composition.atoms.map((atom: ContentAtom) => (
                <div
                  key={atom.key}
                  className={`rounded-lg border p-3 ${
                    atom.editable
                      ? "border-slate-800 bg-slate-950/60"
                      : "border-slate-800/70 bg-slate-900/30"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-medium text-slate-100">
                      {atom.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {atom.key}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${
                        SOURCE_BADGE[atom.source] ?? SOURCE_BADGE.none
                      }`}
                    >
                      {atom.source}
                    </span>
                    {atom.editable ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300">
                        <Pencil className="h-3 w-3" /> Editable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <Lock className="h-3 w-3" /> Read-only
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-slate-500">
                      owner: {atom.owner}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-300 font-mono break-words">
                    {previewValue(atom.value)}
                  </div>
                  {atom.note && (
                    <div className="mt-1 text-[10px] text-slate-500">
                      {atom.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Editors */}
          <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              content_pages editor (CMS-owned atoms)
            </h2>
            <p className="text-xs text-slate-500">
              Edits seo + content + CMS FAQ for this route. Publish runs the
              facts-lock gate, then revalidates.
            </p>
            <ContentPageEditor initial={editorInitial} lockRoute />
          </section>

          <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              narrative_claims editor (highest FAQ precedence)
            </h2>
            <p className="text-xs text-slate-500">
              Claims wired to primary_page = {route}. These override canonical
              hardcoded and CMS FAQ for this route.
            </p>
            <NarrativeClaimEditor primaryPage={route} lockPrimaryPage />
          </section>
        </>
      )}
    </div>
  );
}
