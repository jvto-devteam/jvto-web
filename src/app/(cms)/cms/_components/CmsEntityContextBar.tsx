"use client";

// Taxonomy context bar shown on every CMS screen (mounted in the (cms) layout).
// Matches the current route to an entity in src/lib/cms/entityRegistry.ts and
// surfaces its visual-mode cluster, owning repo source, and field-ownership
// write-policy — so every screen states, in one place, where its data comes from
// and whether it's editable / synced / facts-locked. No per-screen edits needed.
import { usePathname } from "next/navigation";
import {
  ENTITIES,
  CLUSTER_META,
  POLICY_BADGE,
  type EntityDef,
} from "@/lib/cms/entityRegistry";

function matchEntity(pathname: string): EntityDef | undefined {
  // /cms/entity/<type> viewer
  const viewer = pathname.match(/^\/cms\/entity\/([^/]+)/);
  if (viewer) return ENTITIES.find((e) => e.type === viewer[1]);
  // editor screens — longest matching `screen` prefix wins
  return ENTITIES.filter((e) => e.screen && pathname.startsWith(e.screen))
    .sort((a, b) => (b.screen!.length - a.screen!.length))[0];
}

export default function CmsEntityContextBar() {
  const pathname = usePathname();
  const e = matchEntity(pathname);
  if (!e) return null;
  const badge = POLICY_BADGE[e.writePolicy];
  const cluster = CLUSTER_META[e.cluster];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-800 bg-slate-950/60 px-4 md:px-6 py-2 text-[11px]">
      <span className="font-semibold uppercase tracking-[0.14em] text-slate-500">
        {cluster.label}
      </span>
      <span className="text-slate-600">/</span>
      <span className="font-medium text-slate-200">{e.label}</span>
      <span className={`rounded-full border px-2 py-0.5 font-medium ${badge.cls}`}>
        {badge.label}
      </span>
      <span className="text-slate-500">
        source: <span className="text-slate-300">{e.ownerSource}</span>
      </span>
      {e.writePolicy !== "editable" && (
        <span className="text-slate-500">
          — edit upstream &amp; re-consolidate; changes here won&rsquo;t stick
        </span>
      )}
    </div>
  );
}
