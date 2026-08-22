// app/(website)/why-jvto/community-standards/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { loadEcosystemPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import { whyLede } from "@/lib/ecosystemContent/whyJvto";

export const revalidate = 86400;

const ROUTE = "/why-jvto/community-standards";

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
  const title = page?.meta.browserTitle ?? page?.meta.title ?? "Community Standards — JVTO";
  const description =
    page?.meta.description ??
    "JVTO publishes its rules, policies, and commitments before you pay anything. Guests who understand the terms before booking have better trips.";
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://javavolcano-touroperator.com/why-jvto/community-standards",
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  });
}

export default async function CommunityStandardsPage() {
  const page = await loadEcosystemPage(ROUTE);
  const sections = page?.sections ?? [];
  const intro = sections.find((s) => s.id === "read-the-rulebook-before-you-book-0");
  const writtenRules = sections.find((s) => s.id === "written-rules-before-booking-1");
  const sulfurEtiquette = sections.find((s) => s.id === "sulfur-miner-etiquette-ijen-routes-2");
  const localBoys = sections.find((s) => s.id === "local-boys-policy-community-employment-3");
  const dontDo = sections.find((s) => s.id === "what-we-don-t-do-4");
  const trustAnchor = sections.find((s) => s.id === "trust-anchor-5");
  const policyPages = await Promise.all([
    loadEcosystemPage("/policy/booking-payment-cancellation"),
    loadEcosystemPage("/policy/inclusions-exclusions"),
    loadEcosystemPage("/policy/privacy"),
  ]);
  const heroRows = [
    { label: "Owner", value: page?.meta.owner ?? "company" },
    { label: "Last reviewed", value: page?.meta.lastReviewed ?? "2026-08-04" },
    { label: "Status", value: page?.meta.status ?? "published" },
    { label: "Trust anchor", value: sections.find((s) => s.id === "trust-anchor-5")?.title ?? "Trust Anchor" },
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

  const sectionBody = (section: (typeof sections)[number] | undefined) =>
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
            <span className="text-white/70">Community Standards</span>
          </nav>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · Community Standards
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 004E
                </span>
              </div>
              <h1
                className="text-4xl md:text-[3.75rem] font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {page?.meta.title ?? "Community Standards"}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {whyLede(page) ||
                  page?.meta.description ||
                  "JVTO publishes its rules, policies, and commitments before you pay anything. Guests who understand the terms before booking have better trips."}
              </p>
              {(page?.lede?.length ?? 0) > 1 ? (
                <div className="mt-6 rounded-xl border border-jvto-lime/25 bg-white/10 px-5 py-4 max-w-[58ch] space-y-2">
                  {page!.lede!.slice(1).map((line) => (
                    <p key={line} className="text-sm leading-relaxed text-white/80">
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

      {/* ── Policy docs — off-white, driven from jvto-ekosistem's why-jvto/community-standards.source.json ── */}
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

            {/* Main content */}
            <div className="min-w-0 jvto-prose">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
                {intro?.title ?? "Written Rules Before Booking"}
              </span>
              <MarkdownRenderer markdown={sectionBody(intro)} />

              {writtenRules && (
                <div className="bg-white border border-[#E3E0DA] rounded-[16px] p-6 mt-8 mb-8">
                  <h2
                    className="font-black text-jvto-navy mb-4"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(22px, 2.5vw, 32px)", letterSpacing: "-0.02em" }}
                  >
                    {writtenRules.title}
                  </h2>
                  <MarkdownRenderer markdown={sectionBody(writtenRules)} />
                </div>
              )}

              {/* Policy tiles — stable cross-links, not content-file-driven */}
              <div className="flex flex-col gap-4 mt-8 mb-8">
                {[
                  {
                    href: "/policy/booking-payment-cancellation",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 flex-shrink-0 mt-0.5 text-jvto-orange" aria-hidden="true">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                      </svg>
                    ),
                    title: policyPages[0]?.meta.title ?? "Booking, Payment & Cancellation",
                    desc: policyPages[0]?.meta.description ?? "How bookings are confirmed, deposit and balance timelines, cancellation, force majeure, and package credit terms.",
                    meta: "/policy/booking-payment-cancellation →",
                  },
                  {
                    href: "/policy/inclusions-exclusions",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 flex-shrink-0 mt-0.5 text-jvto-orange" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6M9 15l2 2 4-4" />
                      </svg>
                    ),
                    title: policyPages[1]?.meta.title ?? "Inclusions & Exclusions",
                    desc: policyPages[1]?.meta.description ?? "A written list of what is covered in the price and what is not.",
                    meta: "/policy/inclusions-exclusions →",
                  },
                  {
                    href: "/policy/privacy",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 flex-shrink-0 mt-0.5 text-jvto-orange" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    title: policyPages[2]?.meta.title ?? "Privacy & Data Protection",
                    desc: policyPages[2]?.meta.description ?? "What data we collect, how it is used, and who it is shared with.",
                    meta: "/policy/privacy →",
                  },
                ].map((tile) => (
                  <Link
                    key={tile.href}
                    href={tile.href}
                    prefetch={false}
                    className="bg-white border border-[#E3E0DA] rounded-[16px] p-6 flex items-start gap-5 hover:border-jvto-orange/40 hover:shadow-sm transition-all group"
                  >
                    {tile.icon}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-jvto-navy mb-2 group-hover:text-jvto-orange transition-colors">{tile.title}</h3>
                      <p className="text-[15px] text-[#6b7280] leading-relaxed mb-3">{tile.desc}</p>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">{tile.meta}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Policy hierarchy */}
              <div className="bg-white border border-[#E3E0DA] rounded-[16px] p-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-1">The policy hierarchy</div>
                <div className="text-[15px] text-[#6b7280] font-light mb-4">Written documents, in order — not verbal agreements.</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {[
                    { label: "E-Voucher", lead: true },
                    { label: "→", arrow: true },
                    { label: "Booking Policy", lead: false },
                    { label: "→", arrow: true },
                    { label: "Inclusions Policy", lead: false },
                    { label: "→", arrow: true },
                    { label: "Privacy Policy", lead: false },
                    { label: "→", arrow: true },
                    { label: "Travel Guide", lead: false },
                  ].map((item, i) =>
                    item.arrow ? (
                      <span key={i} className="text-jvto-orange font-bold">→</span>
                    ) : (
                      <span
                        key={i}
                        className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-3.5 py-2 rounded-full border ${
                          item.lead ? "bg-jvto-navy text-white border-jvto-navy" : "bg-[#F6F5F2] text-jvto-navy border-[#E3E0DA]"
                        }`}
                      >
                        {item.label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sulfur miner etiquette — navy ─────────────────────────────── */}
      {sulfurEtiquette && (
        <section
          className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] block mb-4">
              {sulfurEtiquette.title ?? "Sulfur Miner Etiquette — Ijen Routes"}
            </span>
            <h2
              className="font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.6vw, 46px)", lineHeight: 1.05 }}
            >
              A shared working <span className="text-jvto-orange">path.</span>
            </h2>
            <div className="jvto-prose max-w-[70ch]" style={{ "--color-jvto-navy": "rgba(255,255,255,0.82)" } as React.CSSProperties}>
              <MarkdownRenderer markdown={sectionBody(sulfurEtiquette)} />
            </div>
          </div>
        </section>
      )}

      {/* ── Local Boys + What we don't do — off-white ────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-16 items-start">
            {/* Local Boys */}
            <div className="jvto-prose">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-4">
                {localBoys?.title ?? "Local Boys Policy"}
              </span>
              <h2
                className="font-black text-jvto-navy mb-5 leading-tight"
                style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(22px, 2.8vw, 36px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                Community employment.
              </h2>
              <MarkdownRenderer markdown={sectionBody(localBoys)} />
              <Link
                href="/why-jvto/our-team"
                prefetch={false}
                className="inline-flex items-center gap-2 mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                See the full roster <ArrowRight />
              </Link>
            </div>

            {/* What we don't do */}
            <div className="jvto-prose">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-4">
                {dontDo?.title ?? "What We Don't Do"}
              </span>
              <h2
                className="font-black text-jvto-navy mb-6 leading-tight"
                style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(22px, 2.8vw, 36px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                We publish what we <span className="text-jvto-orange">won&apos;t</span> do.
              </h2>
              <MarkdownRenderer markdown={sectionBody(dontDo)} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust anchor — from ecosystem content ─────────────────────── */}
      {trustAnchor && (
        <section
          className="bg-[#F6F5F2] py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E3E0DA] jvto-prose">
              <h2
                className="text-2xl md:text-[1.875rem] font-bold text-jvto-navy mb-5"
                style={{ letterSpacing: "-0.015em" }}
              >
                {trustAnchor.title}
              </h2>
              <MarkdownRenderer markdown={sectionBody(trustAnchor)} />
            </div>
          </div>
        </section>
      )}

      {faqItems.length ? (
        <section
          className="bg-white py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <Faq
              items={faqItems.map((item) => ({
                q: item.question,
                a: item.answer,
              }))}
              title="Community Standards: Common Questions"
              eyebrow="FAQ"
            />
          </div>
        </section>
      ) : null}

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Clear rules. <span className="text-jvto-orange">Better trips.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/policy"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Read the full policies <ArrowRight />
            </Link>
            <Link
              href="/why-jvto/our-team"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
