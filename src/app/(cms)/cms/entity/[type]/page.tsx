// Generic read-only viewer for consolidated CMS entities.
// Reads the entity's synced artifact (src/data/<dataFile>, declared in the
// entityRegistry) and renders it, with the field-ownership write-policy badge.
// This is how read_only / synced entities (claims, knowledge modules, people,
// routes, activities, package profiles) surface in the CMS without a bespoke
// screen each — one component, driven by the taxonomy.
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getEntity, POLICY_BADGE, CLUSTER_META } from "@/lib/cms/entityRegistry";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ type: string }> };

function loadArtifact(dataFile: string): unknown[] {
  const p = path.join(process.cwd(), "src", "data", dataFile);
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  if (Array.isArray(raw)) return raw;
  // find the first array-valued property (bundles wrap the list)
  for (const v of Object.values(raw)) if (Array.isArray(v)) return v as unknown[];
  // object keyed by id → array of values
  const vals = Object.values(raw);
  if (vals.length && typeof vals[0] === "object") return vals as unknown[];
  return [];
}

const TITLE_KEYS = ["title", "name", "pillar", "question", "canonical_text", "id", "policy_id", "module_id", "code"];
const DESC_KEYS = ["description", "short_answer", "core_claim", "notes", "summary", "detail_summary", "canonical_text", "body"];

function pick(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

export default async function EntityViewer({ params }: Props) {
  const { type } = await params;
  const def = getEntity(type);
  if (!def || !def.dataFile) notFound();

  let items: unknown[] = [];
  let error = "";
  try {
    items = loadArtifact(def.dataFile);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const badge = POLICY_BADGE[def.writePolicy];
  const cluster = CLUSTER_META[def.cluster];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{cluster.label}</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-100">{def.label}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full border px-2.5 py-1 font-medium ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="text-slate-500">source: <span className="text-slate-300">{def.ownerSource}</span></span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">src/data/{def.dataFile}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{items.length} items</span>
        </div>
        {def.note && <p className="mt-2 text-xs text-slate-400">{def.note}</p>}
        {def.writePolicy !== "editable" && (
          <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
            This entity is <span className="text-sky-300">synced from {def.ownerSource}</span> and is read-only in the CMS.
            Edit it in the upstream repo, re-run consolidation, and it refreshes here.
          </p>
        )}
      </div>

      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">Failed to load artifact: {error}</div>}

      <div className="space-y-3">
        {items.map((it, i) => {
          const o = (it && typeof it === "object" ? it : {}) as Record<string, unknown>;
          const title = pick(o, TITLE_KEYS) || `Item ${i + 1}`;
          const desc = pick(o, DESC_KEYS);
          return (
            <details key={i} className="group rounded-xl border border-slate-800 bg-slate-900/50 open:bg-slate-900/80">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{title}</div>
                    {desc && <div className="mt-1 text-xs text-slate-400 line-clamp-2">{desc}</div>}
                  </div>
                  <span className="mt-0.5 text-[10px] text-slate-600 group-open:hidden">expand</span>
                </div>
              </summary>
              <pre className="overflow-x-auto border-t border-slate-800 px-4 py-3 text-[11px] leading-relaxed text-slate-300">
                {JSON.stringify(o, null, 2)}
              </pre>
            </details>
          );
        })}
      </div>
    </div>
  );
}
