// src/app/(cms)/cms/pages/page.tsx
// Route Content Console — index. Lists every route the CMS can inspect:
//   - Static: the 44 PAGE_REGISTRY entries.
//   - Dynamic: representative examples of each [slug] route family.
// Each row links to the console detail (/cms/pages/<route>) which renders the
// full atom-ownership breakdown + embedded editors. Server Component.
import Link from "@/components/website/AppLink";
import { Layers, FileStack, GitBranch, Blocks } from "lucide-react";
import { PAGE_REGISTRY } from "@/lib/registry/pages";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";
import { listPublishedStaticPages } from "@/lib/static-content";

/** Blog post slugs from the content/ SSOT (PACKAGE 08 — src/lib/blog retired). */
function getAllBlogSlugs(): string[] {
  return listPublishedStaticPages({ section: "blog" })
    .filter((p) => p.meta.route !== "/blog")
    .map((p) => p.meta.route.replace("/blog/", ""));
}

// Home ('/') can't be a catch-all segment, so it uses the ~root sentinel that
// the detail page maps back to '/'.
const ROOT_SENTINEL = "~root";

function toConsoleHref(route: string): string {
  if (route === "/") return `/cms/pages/${ROOT_SENTINEL}`;
  return `/cms/pages${route}`;
}

// Section-based page families — every real slug enumerated from the page
// snapshots, so an admin can open ANY of them in the console to edit + preview
// its blocks/body (not just one representative example).
const SECTION_FAMILIES: { prefix: string; label: string; shape: string }[] = [
  { prefix: "/why-jvto", label: "why-jvto/[slug]", shape: "sections + blocks" },
  { prefix: "/travel-guide", label: "travel-guide/[slug]", shape: "body_md" },
  { prefix: "/policy", label: "policy/[slug]", shape: "body_md" },
];

// Remaining dynamic families are DB/Prisma-helper-driven (not the block/body
// content model) — one representative live example each.
const DYNAMIC_FAMILIES: { family: string; example: string; note: string }[] = [
  {
    family: "destinations/[slug]",
    example: "/destinations/ijen-crater",
    note: "Destination detail (DB schema_json)",
  },
  {
    family: "tours/from-bali/[slug]",
    example: "/tours/from-bali/ijen-bromo-madakaripura-3d2n",
    note: "Bali departure tour detail",
  },
  {
    family: "tours/from-surabaya/[slug]",
    example: "/tours/from-surabaya/bromo-1d1n",
    note: "Surabaya departure tour detail",
  },
  {
    family: "team/[slug]",
    example: "/team/yandi",
    note: "Team member detail",
  },
];

const statusBadge: Record<string, string> = {
  live: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  redirect: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  dead: "border-slate-600/40 bg-slate-700/10 text-slate-400",
};

export default function RouteConsoleIndexPage() {
  const staticRows = [...PAGE_REGISTRY].sort((a, b) =>
    a.route.localeCompare(b.route),
  );

  const sectionRows = SECTION_FAMILIES.map((f) => ({
    ...f,
    routes: listPublicPageRoutesByPrefix(f.prefix),
  }));

  // blog/[slug] posts come from the blog manifest (getAllBlogSlugs), not the page
  // snapshots — keep the family in the catalog with a LIVE example so admins can
  // still reach an individual post (PAGE_REGISTRY only lists the /blog hub).
  const blogSlugs = getAllBlogSlugs();
  const dynamicFamilies = [
    ...DYNAMIC_FAMILIES,
    {
      family: "blog/[slug]",
      example: blogSlugs.length ? `/blog/${blogSlugs[0]}` : "/blog",
      note: `Blog / insight posts (${blogSlugs.length})`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
          <Layers className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Pages (SSOT) — Route Content Console
          </h1>
          <p className="text-sm text-slate-400">
            Every route the CMS can inspect. Open a route to see its content
            atoms, who owns each one, and which are editable from the CMS.
          </p>
        </div>
      </div>

      {/* Static routes */}
      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <FileStack className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-100">
            Static routes
          </h2>
          <span className="text-[10px] text-slate-500">
            {staticRows.length} from PAGE_REGISTRY
          </span>
        </div>
        <div className="border border-slate-800 rounded-lg overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead className="bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  Route
                </th>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  Status
                </th>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  emitVia
                </th>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  FAQ source
                </th>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  Schema types
                </th>
              </tr>
            </thead>
            <tbody>
              {staticRows.map((r) => (
                <tr
                  key={r.key}
                  className="border-t border-slate-800/80 hover:bg-slate-900/60"
                >
                  <td className="px-3 py-2 align-top">
                    <Link
                      href={toConsoleHref(r.route)}
                      className="font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
                    >
                      {r.route}
                    </Link>
                    {r.canonical !== r.route && (
                      <div className="text-[10px] text-slate-500">
                        canonical: {r.canonical}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${
                        statusBadge[r.status] ?? statusBadge.dead
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top text-slate-300">
                    {r.emitVia}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-300">
                    {r.faqSource}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-400">
                    {r.schemaType.length ? r.schemaType.join(", ") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section-based pages — every real slug, editable + previewable */}
      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Blocks className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-100">
            Section-based pages
          </h2>
          <span className="text-[10px] text-slate-500">
            open to edit blocks / body + Preview draft
          </span>
        </div>
        <div className="space-y-3">
          {sectionRows.map((f) => (
            <div key={f.prefix}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] text-slate-300">
                  {f.label}
                </span>
                <span className="text-[10px] text-slate-500">
                  {f.shape} · {f.routes.length} page
                  {f.routes.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {f.routes.length === 0 && (
                  <span className="text-[11px] text-slate-500">
                    none in snapshots
                  </span>
                )}
                {f.routes.map((route) => (
                  <Link
                    key={route}
                    href={toConsoleHref(route)}
                    className="inline-flex rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] text-emerald-300 hover:border-slate-700 hover:text-emerald-200"
                  >
                    {route}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic families */}
      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-100">
            Dynamic route families
          </h2>
          <span className="text-[10px] text-slate-500">
            representative example each
          </span>
        </div>
        <div className="border border-slate-800 rounded-lg overflow-x-auto">
          <table className="w-full text-xs min-w-[560px]">
            <thead className="bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  Family
                </th>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  Example route
                </th>
                <th className="text-left px-3 py-2 text-slate-400 font-medium">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {dynamicFamilies.map((f) => (
                <tr
                  key={f.family}
                  className="border-t border-slate-800/80 hover:bg-slate-900/60"
                >
                  <td className="px-3 py-2 align-top font-mono text-slate-300">
                    {f.family}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <Link
                      href={toConsoleHref(f.example)}
                      className="font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
                    >
                      {f.example}
                    </Link>
                  </td>
                  <td className="px-3 py-2 align-top text-slate-400">
                    {f.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
