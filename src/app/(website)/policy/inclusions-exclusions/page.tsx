// app/(website)/policy/inclusions-exclusions/page.tsx
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import {
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";

export const revalidate = 86400;

const SLUG = "inclusions-exclusions";
const ROUTE = `/policy/${SLUG}`;

const POLICY_NAV = [
  { href: "/policy", label: "Policy Hub" },
  { href: "/policy/booking-payment-cancellation", label: "Booking, Payment & Cancellation" },
  { href: "/policy/inclusions-exclusions", label: "Inclusions & Exclusions" },
  { href: "/policy/privacy", label: "Privacy & Data Protection" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadStaticPage(ROUTE);
  if (page && page.meta.status !== "published") return { title: "Page Not Found" };
  const title =
    page?.meta.browserTitle ?? page?.meta.title ?? "Inclusions & Exclusions Policy · JVTO";
  const description =
    page?.meta.description ??
    "What is — and is not — included in a confirmed JVTO private tour. Only what is written on your Official E-Voucher is contractually binding.";
  return buildStaticRouteMetadata(ROUTE, { title, description });
}

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function InclusionsExclusionsPage() {
  const page = await loadStaticPage(ROUTE);

  if (!page?.body?.trim().length || page.meta.status !== "published") return notFound();

  const h1 = page.meta.title ?? "Inclusions & Exclusions";
  const seoTitle =
    page.meta.browserTitle ?? page.meta.title ?? "Inclusions & Exclusions Policy · JVTO";
  const seoDescription =
    page.meta.description ??
    "What is — and is not — included in a confirmed JVTO private tour. Only what is written on your Official E-Voucher is contractually binding.";
  const body: string = page.body ?? "";

  const mentionsTermIds = POLICY_SLUG_MENTIONS[SLUG] ?? [];
  const policyAnchorSchema = buildPolicyWebPageSchema({
    subpath: SLUG,
    name: seoTitle,
    description:
      page.meta.summary ??
      "What is and is not included in a confirmed JVTO private tour.",
    mentionsTermIds,
  });

  const extraSchemas = [policyAnchorSchema].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={{
          route: ROUTE,
          lang: "en",
          seo: { title: seoTitle, description: seoDescription },
          content: { h1 },
        }}
        extraSchemas={extraSchemas}
        suppressCmsFaq
      />

      {/* ── Interior hero — navy ───────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/policy" prefetch={false} className="hover:text-white/70 transition-colors">Policy</Link>
            <span>›</span>
            <span className="text-white/70">{h1}</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Policy · Inclusions
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  VERSION 2026-01-17 (v5)
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {h1}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                What is — and is not — included in a confirmed JVTO private tour. Only what is
                written on your Official E-Voucher is contractually binding.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Binding rule", value: "Write-it-to-bind-it" },
                { label: "Tour type", value: "Private, all-inclusive" },
                { label: "Vehicle", value: "By group size" },
                { label: "Binding document", value: "E-Voucher PDF" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">
                    {label}
                  </span>
                  <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Article section — off-white, stacked ──────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">

            {/* Sidebar nav */}
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Policy
              </p>
              <nav className="space-y-0.5">
                {POLICY_NAV.map(({ href, label }) => {
                  const isActive = href === ROUTE;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-jvto-navy text-white"
                          : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/tours"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Browse tours <ArrowRight />
              </Link>
            </aside>

            {/* Article body */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <MarkdownRenderer markdown={body} />
            </article>

          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ───────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px, 4vw, 44px)",
            }}
          >
            Know exactly what{" "}
            <span className="text-jvto-orange">you&apos;re buying.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Explore tours <ArrowRight />
            </Link>
            <Link
              href="/policy/booking-payment-cancellation"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Booking policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
