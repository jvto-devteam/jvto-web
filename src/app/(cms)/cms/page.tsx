// app/cms/page.tsx — CMS dashboard. Real Prisma counts (no more mock stats).
import Link from "@/components/website/AppLink";
import { prisma } from "@/lib/prisma";

// Counts must reflect live data, so opt out of static caching.
export const dynamic = "force-dynamic";

async function safeCount(fn: () => Promise<number>): Promise<number | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function CmsDashboardPage() {
  const [pages, claims, faqs, packages, blogs, destinations, policies] =
    await Promise.all([
      safeCount(() => prisma.content_pages.count()),
      safeCount(() => prisma.narrative_claims.count()),
      safeCount(() => prisma.faqs.count()),
      safeCount(() => prisma.packages.count()),
      safeCount(() => prisma.blogs.count()),
      safeCount(() => prisma.destinations.count()),
      safeCount(() => prisma.policy_documents.count()),
    ]);

  const fmt = (n: number | null) => (n == null ? "—" : String(n));

  const stats: { label: string; value: string; href: string }[] = [
    { label: "Content Pages", value: fmt(pages), href: "/cms/collections/content-pages" },
    { label: "Narrative Claims", value: fmt(claims), href: "/cms/collections/narrative-claims" },
    { label: "FAQ Items", value: fmt(faqs), href: "/cms/faq" },
    { label: "Tour Packages", value: fmt(packages), href: "/cms/tour-packages" },
    { label: "Blog Posts", value: fmt(blogs), href: "/cms/blog" },
    { label: "Destinations", value: fmt(destinations), href: "/cms/destinations" },
    { label: "Policy Documents", value: fmt(policies), href: "/cms/collections/policy-documents" },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Overview</h2>
        <p className="text-sm text-slate-400">
          Live counts of the content you manage from this CMS. Start with{" "}
          <Link href="/cms/pages" className="text-emerald-400 hover:underline">
            Pages (SSOT)
          </Link>{" "}
          to edit any route&rsquo;s content and schema.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 transition-colors hover:border-slate-700 hover:bg-slate-900/60"
          >
            <div className="text-[10px] uppercase tracking-wide text-slate-500">
              {s.label}
            </div>
            <div className="mt-1 text-2xl font-semibold text-slate-50">
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        A dash (—) means that table could not be read (DB unavailable). Counts are
        live, not cached.
      </p>
    </section>
  );
}
