// app/(website)/why-jvto/the-jvto-difference/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { loadEcosystemPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import { whyLede } from "@/lib/ecosystemContent/whyJvto";

export const revalidate = 86400;

const ROUTE = "/why-jvto/the-jvto-difference";

const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
];

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

// Icons matched to the 6 differentiator sections, in content-file order.
const DIFF_ICONS: Record<string, React.ReactNode> = {
  "1-police-led-safety-authority-1": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  "2-100-private-tours-2": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <circle cx="17" cy="7" r="3" />
    </svg>
  ),
  "3-all-inclusive-clarity-written-inclusions-no-surp-3": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  "4-ijen-health-screening-coordination-4": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  "5-verifiable-licenses-a-proof-library-not-a-logo-w-5": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 4v16" />
    </svg>
  ),
  "6-plan-b-framework-written-closure-sop-6": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
      <path d="M9 11H3v10h6V11zM21 3h-6v18h6V3zM15 7H9v14h6V7z" />
    </svg>
  ),
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadEcosystemPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? "The JVTO Difference — JVTO";
  const description =
    page?.meta.description ??
    "Six verifiable things that make JVTO operationally different from other East Java volcano tour operators — police-led safety, private-only format, written credentials.";
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  });
}

export default async function TheJvtoDifferencePage() {
  const page = await loadEcosystemPage(ROUTE);
  const sections = page?.sections ?? [];
  const overviewSection = sections.find((s) => s.id === "overview-0");
  const trustAnchor = sections.find((s) => s.id === "trust-anchor-7");
  const diffSections = sections.filter((s) => /^\d-/.test(s.id));
  const heroRows = diffSections.slice(0, 4).map((section) => {
    const [label, ...rest] = (section.title ?? "").split(".");
    return {
      label: label.trim().padStart(2, "0"),
      value: rest.join(".").trim() || section.title || "",
    };
  });
  const faqItems = page?.faq ?? [];
  const faqSchema = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${page?.canonicalUrl ?? ROUTE}#faq`,
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title: page?.meta.title, description: page?.meta.description },
    content: { h1: page?.meta.title },
  };

  const sectionBody = (section: (typeof sections)[number]) =>
    (section.blocks ?? [])
      .filter((b: any) => b.type === "markdown")
      .map((b: any) => b.body_md)
      .join("\n\n");

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[faqSchema].filter(Boolean) as Record<string, unknown>[]}
        suppressCmsFaq
      />

      {/* ── Hero — navy ───────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url(https://javavolcano-touroperator.com/assets/img/hero/home.webp)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-jvto-navy/70" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Why JVTO</Link>
            <span>›</span>
            <span className="text-white/70">The JVTO Difference</span>
          </nav>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · The Difference
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 004A
                </span>
              </div>
              <h1
                className="text-4xl md:text-[3.75rem] font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {page?.meta.title ?? "The JVTO Difference"}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {whyLede(page) ||
                  page?.meta.description ||
                  "Six things that make JVTO operationally different from other East Java volcano tour operators. Each one is backed by a verifiable credential — not marketing language."}
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {heroRows.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">{label}</span>
                  <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Diff items — off-white, driven from jvto-ekosistem's why-jvto/the-jvto-difference.source.json ── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            {/* Sidebar */}
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Why JVTO
              </p>
              <nav className="space-y-0.5">
                {WHY_JVTO_NAV.map(({ href, label }) => {
                  const isActive = href === ROUTE;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive ? "bg-jvto-navy text-white" : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Open proof library <ArrowRight />
              </Link>
            </aside>

            {/* Diff items list */}
            <div className="min-w-0">
              {overviewSection && (
                <article className="bg-white border border-[#E3E0DA] rounded-[20px] p-8 mb-10 jvto-prose">
                  <h2
                    className="font-black text-jvto-navy mb-5"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.02em" }}
                  >
                    {overviewSection.title}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(overviewSection)} />
                </article>
              )}

              {diffSections.map((section, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={section.id}
                    className={`grid md:grid-cols-[120px_1fr] gap-8 md:gap-10 py-14 ${i === 0 ? "pt-4" : "border-t border-[#E3E0DA]"}`}
                  >
                    {/* Number */}
                    <div
                      className="font-black leading-none text-[#F6F5F2] select-none"
                      style={{
                        fontFamily: "Raleway, Inter, sans-serif",
                        fontSize: "clamp(56px, 7vw, 96px)",
                        letterSpacing: "-0.05em",
                        WebkitTextStroke: "1px #E3E0DA",
                      }}
                    >
                      {num}
                    </div>

                    {/* Body */}
                    <div className="max-w-[64ch] jvto-prose">
                      <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                        {DIFF_ICONS[section.id]}
                        {section.title}
                      </div>
                      <MarkdownRenderer markdown={sectionBody(section)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust anchor — navy ───────────────────────────────────────── */}
      {trustAnchor && (
      <section
        className="bg-jvto-navy py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8 mb-0">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] block mb-4">
                {trustAnchor.title}
              </span>
              <div
                className="jvto-prose max-w-[70ch]"
                style={{ "--color-jvto-navy": "rgba(255,255,255,0.78)" } as React.CSSProperties}
              >
                <MarkdownRenderer markdown={sectionBody(trustAnchor)} />
              </div>
            </div>
            <div className="flex gap-5 flex-wrap">
              <Link href="/why-jvto/reviews" prefetch={false} className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors">
                Reviews <ArrowRight />
              </Link>
              <Link href="/why-jvto/our-team" prefetch={false} className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors">
                Our Team <ArrowRight />
              </Link>
              <Link href="/verify-jvto" prefetch={false} className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors">
                Verify JVTO <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {faqItems.length ? (
        <section
          className="bg-white py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <Faq
              items={faqItems.map((item) => ({
                q: item.question,
                a: item.answer,
              }))}
              title="The JVTO Difference: Common Questions"
              eyebrow="FAQ"
            />
          </div>
        </section>
      ) : null}

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Don&apos;t guess. <span className="text-jvto-orange">Verify.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Open the proof library <ArrowRight />
            </Link>
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Explore private tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
