// app/(website)/why-jvto/our-story/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { loadEcosystemPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import { whyLede } from "@/lib/ecosystemContent/whyJvto";

export const revalidate = 86400;

const ROUTE = "/why-jvto/our-story";

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

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadEcosystemPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? "Our Story — JVTO";
  const description =
    page?.meta.description ??
    "JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the Tourist Police experience of our founder, Mr. Sam.";
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://javavolcano-touroperator.com/why-jvto/our-story",
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  });
}

export default async function OurStoryPage() {
  const page = await loadEcosystemPage(ROUTE);
  const sections = page?.sections ?? [];
  const bio = sections.find((s) => s.id === "company-bio-0");
  const howWeGotHere = sections.find((s) => s.id === "how-we-got-here-1");
  const whyPrivate = sections.find((s) => s.id === "why-private-only-2");
  const evidenceChain = sections.find((s) => s.id === "the-evidence-chain-3");
  const trustAnchor = sections.find((s) => s.id === "trust-anchor-4");
  const heroRows = [
    { label: "Owner", value: page?.meta.owner ?? "company" },
    { label: "Last reviewed", value: page?.meta.lastReviewed ?? "2026-08-04" },
    { label: "Status", value: page?.meta.status ?? "published" },
    { label: "Evidence span", value: evidenceChain?.title ?? "The Evidence Chain" },
  ];
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

  const sectionBody = (section: typeof bio) =>
    (section?.blocks ?? [])
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
            <span className="text-white/70">Our Story</span>
          </nav>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · Our Story
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 004C
                </span>
              </div>
              <h1
                className="text-4xl md:text-[3.75rem] font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {page?.meta.title ?? "Our Story"}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {whyLede(page) ||
                  page?.meta.description ||
                  "JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the Tourist Police experience of our founder, Mr. Sam."}
              </p>
              {(page?.lede?.length ?? 0) > 1 ? (
                <div className="mt-5 space-y-2 max-w-[58ch]">
                  {page!.lede!.slice(1).map((line) => (
                    <p key={line} className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-white/45">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
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

      {/* ── Article section — off-white ───────────────────────────────── */}
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

            {/* Article body — driven from jvto-ekosistem's why-jvto/our-story.source.json */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0 jvto-prose">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-4 block">
                {bio?.title ?? "Company Bio"}
              </span>
              {bio && <MarkdownRenderer markdown={sectionBody(bio)} />}

              {howWeGotHere && (
                <>
                  <h2
                    className="text-2xl md:text-[1.875rem] font-bold text-jvto-navy mt-10 mb-5"
                    style={{ letterSpacing: "-0.015em" }}
                  >
                    {howWeGotHere.title ?? "How We Got Here"}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(howWeGotHere)} />
                </>
              )}

              {whyPrivate && (
                <>
                  <h2
                    className="text-2xl md:text-[1.875rem] font-bold text-jvto-navy mt-10 mb-5"
                    style={{ letterSpacing: "-0.015em" }}
                  >
                    {whyPrivate.title ?? "Why Private-Only"}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(whyPrivate)} />
                </>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* ── Evidence chain — navy ─────────────────────────────────────── */}
      {evidenceChain && (
        <section
          className="bg-jvto-navy py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="mb-10">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] block mb-3">
                § —
              </span>
              <h2
                className="font-black text-white leading-tight mb-2"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 48px)" }}
              >
                {evidenceChain.title ?? "The Evidence Chain"}
              </h2>
              <span className="font-mono text-[11px] text-white/55">Third-party records</span>
            </div>
            <div
              className="jvto-prose max-w-[72ch]"
              style={{ "--color-jvto-navy": "rgba(255,255,255,0.82)" } as React.CSSProperties}
            >
              <MarkdownRenderer markdown={sectionBody(evidenceChain)} />
            </div>
            <div className="mt-10">
              <Link
                href="/verify-jvto/history-artifacts"
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                See the artifacts <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Trust anchor — from ecosystem content ─────────────────────── */}
      {trustAnchor && (
        <section
          className="bg-[#F6F5F2] py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E3E0DA] jvto-prose">
              <h2
                className="text-2xl md:text-[1.875rem] font-bold text-jvto-navy mb-5"
                style={{ letterSpacing: "-0.015em" }}
              >
                {trustAnchor.title ?? "Trust Anchor"}
              </h2>
              <MarkdownRenderer markdown={sectionBody(trustAnchor)} />
            </div>
          </div>
        </section>
      )}

      {faqItems.length ? (
        <section
          className="bg-white py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <Faq
              items={faqItems.map((item) => ({
                q: item.question,
                a: item.answer,
              }))}
              title="Our Story: Common Questions"
              eyebrow="FAQ"
            />
          </div>
        </section>
      ) : null}

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            The same operation, <span className="text-jvto-orange">documented.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/why-jvto/our-team"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Meet the team <ArrowRight />
            </Link>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
