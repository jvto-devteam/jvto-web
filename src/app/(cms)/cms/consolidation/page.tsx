// /cms/consolidation — the consolidation status board.
// Shows every repo source that feeds the CMS (per jvto-unified-cms-bootstrap's
// consolidation-map), which artifacts are synced under src/data/, their item
// counts and freshness (from each bundle's _manifest.json). This is the
// "where does the CMS data come from and is it fresh?" view.
import fs from "node:fs";
import path from "node:path";
import Link from "@/components/website/AppLink";
import { getEntity } from "@/lib/cms/entityRegistry";

export const dynamic = "force-dynamic";

// Resolve an artifact card to a target that actually renders.
// Screen-backed entities (faq, policy_document) → their existing CMS screen;
// dataFile-backed entities → the generic /cms/entity viewer (which notFound()s
// without a dataFile); unregistered entities (e.g. package.readiness) → no link.
function hrefForEntity(type: string): string | null {
  const e = getEntity(type);
  if (!e) return null;
  if (e.screen) return e.screen;
  if (e.dataFile) return `/cms/entity/${e.type}`;
  return null;
}

const DATA = path.join(process.cwd(), "src", "data");

function readJson(rel: string): unknown | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA, rel), "utf8"));
  } catch {
    return null;
  }
}
function count(rel: string): number | null {
  const j = readJson(rel);
  if (j == null) return null;
  if (Array.isArray(j)) return j.length;
  for (const v of Object.values(j as Record<string, unknown>)) if (Array.isArray(v)) return v.length;
  return Object.keys(j as Record<string, unknown>).length;
}
function manifest(rel: string): { generated_at?: string; schema_version?: string; clean?: boolean } {
  const j = readJson(rel) as Record<string, unknown> | null;
  if (!j) return {};
  return {
    generated_at: (j.generated_at ?? j.generatedAt ?? j.produced_at) as string | undefined,
    schema_version: (j.schema_version ?? j.schemaVersion) as string | undefined,
    clean: j.clean as boolean | undefined,
  };
}

type Row = { source: string; artifact: string; entity: string; file: string; manifestFile?: string };

// From jvto-unified-cms-bootstrap config/consolidation-map.yaml — the artifacts
// actually synced into this repo.
const ROWS: Row[] = [
  { source: "llm-wiki-trust", artifact: "claims.json", entity: "claim", file: "trust-bundle/claims.json", manifestFile: "trust-bundle/_manifest.json" },
  { source: "llm-wiki-trust", artifact: "faq.json", entity: "faq", file: "trust-bundle/faq.json", manifestFile: "trust-bundle/_manifest.json" },
  { source: "llm-wiki-trust", artifact: "people.json", entity: "public_person_profile", file: "trust-bundle/people.json", manifestFile: "trust-bundle/_manifest.json" },
  { source: "llm-wiki-policy", artifact: "policy-bundle", entity: "policy_document", file: "policy-bundle/customer-copy.json", manifestFile: "policy-bundle/_manifest.json" },
  { source: "knowledge-catalog-okf", artifact: "general-modules.json", entity: "general_module", file: "okf/general-modules.json" },
  { source: "knowledge-catalog-okf", artifact: "package-profiles.json", entity: "package_profile", file: "okf/package-profiles.json" },
  { source: "knowledge-catalog-okf", artifact: "policy-cards.json", entity: "policy_card", file: "okf/policy-cards.json" },
  { source: "itinerary-core", artifact: "package-route-map.json", entity: "route", file: "itinerary-core/package-route-map.json" },
  { source: "itinerary-core", artifact: "destinations-master.json", entity: "destination_operational", file: "itinerary-core/destinations-master.json" },
  { source: "itinerary-core", artifact: "activities-master.json", entity: "activity", file: "itinerary-core/activities-master.json" },
  { source: "llm-wiki-package-readiness", artifact: "package-readiness", entity: "package.readiness", file: "package-readiness/package-registry.json", manifestFile: "package-readiness/_manifest.json" },
];

export default function ConsolidationBoard() {
  const bySource = new Map<string, Row[]>();
  for (const r of ROWS) {
    if (!bySource.has(r.source)) bySource.set(r.source, []);
    bySource.get(r.source)!.push(r);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Consolidation board</h2>
        <p className="mt-1 text-sm text-slate-400">
          Every repo source that feeds the CMS, the artifacts synced under <code>src/data/</code>,
          their item counts and freshness. Read-only — edit upstream and re-run the sync/consolidation.
        </p>
      </div>

      {[...bySource.entries()].map(([source, rows]) => {
        const man = rows.find((r) => r.manifestFile)?.manifestFile;
        const m = man ? manifest(man) : {};
        return (
          <div key={source} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-100">{source}</h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                {m.schema_version && <span>schema {m.schema_version}</span>}
                {m.generated_at && <span>generated {String(m.generated_at).slice(0, 10)}</span>}
                {m.clean === true && <span className="text-emerald-400">clean</span>}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((r) => {
                const n = count(r.file);
                const href = hrefForEntity(r.entity);
                const body = (
                  <>
                    <div className="min-w-0">
                      <div className="truncate text-slate-200">{r.artifact}</div>
                      <div className="truncate text-[10px] text-slate-500">→ {r.entity}</div>
                    </div>
                    <span className={`ml-2 flex-shrink-0 font-semibold ${n == null ? "text-slate-600" : "text-slate-100"}`}>
                      {n == null ? "—" : n}
                    </span>
                  </>
                );
                return href ? (
                  <Link
                    key={r.artifact}
                    href={href}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs hover:border-slate-700"
                  >
                    {body}
                  </Link>
                ) : (
                  <div
                    key={r.artifact}
                    title="No CMS screen registered for this entity yet"
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs opacity-70"
                  >
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="text-[11px] text-slate-500">
        A dash means the artifact isn&rsquo;t synced into <code>src/data/</code> yet. Tie-breaker over all
        sources is <code>docs/CANONICAL_FACTS.md</code> (facts-lock).
      </p>
    </section>
  );
}
