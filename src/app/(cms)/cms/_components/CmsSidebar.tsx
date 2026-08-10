"use client";

import Link from "@/components/website/AppLink";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import {
  CLUSTER_ORDER,
  CLUSTER_META,
  entitiesByCluster,
  POLICY_BADGE,
  type EntityDef,
} from "@/lib/cms/entityRegistry";

// Sidebar grouped by the 4 visual-mode clusters from jvto-unified-cms-bootstrap
// (visual-modes.yaml), each entity carrying its field-ownership write-policy dot.
// Nav is generated from src/lib/cms/entityRegistry.ts — the single taxonomy source —
// so the CMS is organised by logic and every link resolves (existing editor screen,
// or the generic /cms/entity/<type> read-only viewer for synced entities).
function hrefFor(e: EntityDef): string {
  return e.screen ?? `/cms/entity/${e.type}`;
}

export default function CmsSidebar() {
  const pathname = usePathname();
  const grouped = entitiesByCluster();

  return (
    <aside
      className="hidden md:flex md:flex-col w-64 h-full overflow-y-auto flex-shrink-0 border-r border-slate-800 bg-slate-950/95 backdrop-blur nice-scrollbar"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Internal CMS
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-100">Volcano Admin</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4">
        {/* Dashboard */}
        <Link
          href="/cms"
          className={[
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
            pathname === "/cms"
              ? "bg-slate-800/80 text-slate-50"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80",
          ].join(" ")}
        >
          <LayoutDashboard className="h-4 w-4 text-emerald-400" />
          <span>Dashboard</span>
        </Link>

        {/* Clusters */}
        {CLUSTER_ORDER.map((cluster) => {
          const items = grouped[cluster];
          if (!items.length) return null;
          return (
            <div key={cluster} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {CLUSTER_META[cluster].label}
              </div>
              {items.map((e) => {
                const href = hrefFor(e);
                const active = pathname === href || pathname.startsWith(href + "/");
                const badge = POLICY_BADGE[e.writePolicy];
                return (
                  <Link
                    key={e.type}
                    href={href}
                    title={`${e.label} · ${badge.label} · source: ${e.ownerSource}`}
                    className={[
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all",
                      active
                        ? "bg-slate-800/70 text-slate-50"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60",
                    ].join(" ")}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${badge.dot}`} />
                    <span className="truncate">{e.label}</span>
                    {e.writePolicy !== "editable" && (
                      <span className="ml-auto text-[9px] text-slate-600">sync</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
        <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> editable</div>
        <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> synced (read-only)</div>
        <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> facts-locked</div>
      </div>
    </aside>
  );
}
