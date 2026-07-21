// app/cms/page.tsx — CMS dashboard, grouped by the visual-mode clusters.
// Each entity card shows a live count (Prisma for DB-backed entities, artifact
// item-count for synced consolidated entities), its field-ownership write-policy
// badge, and its owning repo source — so the dashboard mirrors the taxonomy in
// src/lib/cms/entityRegistry.ts, driven by the consolidated repo estate.
import fs from "node:fs";
import path from "node:path";
import Link from "@/components/website/AppLink";
import { prisma } from "@/lib/prisma";
import {
  CLUSTER_ORDER,
  CLUSTER_META,
  entitiesByCluster,
  POLICY_BADGE,
  type EntityDef,
} from "@/lib/cms/entityRegistry";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

// Prisma table backing a DB entity (for the live count).
const PRISMA_COUNT: Record<string, () => Promise<number>> = {
  page: () => prisma.content_pages.count(),
  narrative_claim: () => prisma.narrative_claims.count(),
  faq: () => prisma.faqs.count(),
  package: () => prisma.packages.count(),
  blog: () => prisma.blogs.count(),
  destination: () => prisma.destinations.count(),
  policy_document: () => prisma.policy_documents.count(),
  review: () => prisma.reviews.count(),
  site_identity: () => prisma.site_identity.count(),
};

function artifactCount(dataFile: string): number | null {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", dataFile), "utf8"));
    if (Array.isArray(raw)) return raw.length;
    for (const v of Object.values(raw)) if (Array.isArray(v)) return (v as unknown[]).length;
    return Object.keys(raw).length;
  } catch {
    return null;
  }
}

async function countFor(e: EntityDef): Promise<number | null> {
  if (e.dataFile) return artifactCount(e.dataFile);
  const fn = PRISMA_COUNT[e.type];
  return fn ? await safe(fn) : null;
}

function hrefFor(e: EntityDef): string {
  return e.screen ?? `/cms/entity/${e.type}`;
}

export default async function CmsDashboardPage() {
  const grouped = entitiesByCluster();
  const counts = new Map<string, number | null>();
  await Promise.all(
    CLUSTER_ORDER.flatMap((c) => grouped[c]).map(async (e) => counts.set(e.type, await countFor(e))),
  );
  const fmt = (n: number | null | undefined) => (n == null ? "—" : String(n));

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Consolidated estate</h2>
        <p className="mt-1 text-sm text-slate-400">
          Every content entity, grouped by its visual-mode cluster and backed by its owning repo source.
          Blue = synced read-only (edit upstream, re-consolidate); green = editable here; rose = facts-locked.
          Start at{" "}
          <Link href="/cms/pages" className="text-emerald-400 hover:underline">Pages (SSOT)</Link>.
        </p>
      </div>

      {CLUSTER_ORDER.map((cluster) => {
        const items = grouped[cluster];
        if (!items.length) return null;
        return (
          <div key={cluster}>
            <div className="mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                {CLUSTER_META[cluster].label}
              </h3>
              <p className="text-[11px] text-slate-500">{CLUSTER_META[cluster].purpose}</p>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((e) => {
                const badge = POLICY_BADGE[e.writePolicy];
                return (
                  <Link
                    key={e.type}
                    href={hrefFor(e)}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-500 truncate">{e.label}</div>
                      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${badge.dot}`} />
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-50">{fmt(counts.get(e.type))}</div>
                    <div className="mt-1.5 text-[10px] text-slate-500 truncate" title={e.ownerSource}>
                      {e.ownerSource}
                    </div>
                    <div className={`mt-2 inline-block rounded border px-1.5 py-0.5 text-[9px] font-medium ${badge.cls}`}>
                      {badge.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="text-[11px] text-slate-500">
        A dash (—) means that source could not be read. DB counts are live; synced counts are the item count in the consolidated artifact under <code>src/data/</code>.
      </p>
    </section>
  );
}
