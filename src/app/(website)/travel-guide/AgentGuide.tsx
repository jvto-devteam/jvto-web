import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Sidebar from "./sidebar";
import type { AgentGuide } from "@/lib/content/agentGuides";

/**
 * Shared presentational renderer for the reusable agent explainer guides under
 * /travel-guide/*. Content is sourced from the knowledge-catalog general modules
 * (single source of truth shared with the WhatsApp agent). Server-rendered; no DB
 * required (the optional content_pages row only overrides SEO title/description).
 */
export function AgentGuideBody({
  guide,
  pageRow,
}: {
  guide: AgentGuide;
  pageRow: any;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined pageRow={pageRow} extraSchemas={[]} suppressCmsFaq={false} />
      <main className="pt-24 w-full">
        <nav className="border-b border-slate-200 px-6 py-3 text-xs text-slate-500">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/travel-guide" className="hover:text-slate-700 transition-colors">Travel Guide</Link>
            <span>/</span>
            <span className="text-slate-700">{guide.title}</span>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
            {guide.h1}
          </h1>
          <p className="text-lg text-slate-600 mb-10">{guide.intro}</p>

          {guide.sections.map((s, i) => (
            <section key={i} className="mb-8 scroll-mt-28">
              <h2 className="text-xl font-black text-jvto-navy mb-3 flex items-center gap-3">
                <span className="w-6 h-1 bg-jvto-green block" />
                {s.h2}
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{s.body}</p>
            </section>
          ))}

          {guide.related.length > 0 && (
            <div className="mt-12 border-t border-slate-200 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Related</h2>
              <ul className="flex flex-wrap gap-3">
                {guide.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="text-jvto-green hover:underline text-sm font-semibold">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
