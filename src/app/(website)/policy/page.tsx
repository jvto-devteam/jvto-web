import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { loadEcosystemPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import { buildPolicyHubItemListSchema } from "@/lib/schemas/buildPolicySchemas";

const POLICY_ICONS: Record<string, React.ReactNode> = {
  "booking-payment-cancellation": (
    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </svg>
  ),
  "inclusions-exclusions": (
    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  privacy: (
    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

// FALLBACK — exact copy of the content that used to be hardcoded here.
// Used only if ekosistem doesn't return a `pageContent` section for this route.
const FALLBACK = {
  heroStats: [
    { label: "Issued by", value: "PT Java Volcano Rendezvous" },
    { label: "Version", value: "2026-01-17 (v5)" },
    { label: "Binding document", value: "E-Voucher PDF" },
    { label: "Policies", value: "3 published" },
  ],
  policyTiles: [
    {
      slug: "booking-payment-cancellation",
      name: "Booking, Payment & Cancellation",
      desc: "How to book, deposit and balance requirements, deadlines, approved payment methods, the 48-hour cancellation cut-off, Lifetime Package Credit terms, and force-majeure handling.",
    },
    {
      slug: "inclusions-exclusions",
      name: "Inclusions & Exclusions",
      desc: "Exactly what is and is not included in a confirmed private package — transport, accommodation, crew, tickets, safety gear, meals — and the write-it-to-bind-it rule.",
    },
    {
      slug: "privacy",
      name: "Privacy & Data Protection",
      desc: "What personal data JVTO collects during booking, how it is used for logistics and legal compliance, who it may be shared with, and how to request access or deletion.",
    },
  ],
  precedence: [
    { title: "Your Official E-Voucher / Invoice (PDF)", sub: "For the confirmed booking — takes precedence over all else." },
    { title: "Booking, Payment & Cancellation Policy" },
    { title: "Inclusions & Exclusions Policy" },
    { title: "Privacy & Data Protection Policy" },
    { title: "Travel Guide — Booking Information" },
  ],
  docPrecedenceHeading: "If documents disagree, this order applies.",
  docPrecedenceIntro:
    "Your confirmed booking is always governed first by the binding voucher, then by these published policies in sequence.",
  docPrecedenceIssuedBy: "PT Java Volcano Rendezvous",
  officialChannelsLines: [
    "javavolcano-touroperator.com",
    "WhatsApp +62 822-4478-8833",
    "hello@javavolcano-touroperator.com",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadEcosystemPage("/policy");
  if (page && page.meta.status !== "published") return { title: "Page Not Found" };
  const title =
    page?.meta.browserTitle ?? page?.meta.title ?? "JVTO Policies | Booking, Privacy & Inclusions";
  const description =
    page?.meta.description ??
    "Navigation hub for JVTO policy documents covering privacy, booking, payment, cancellation, and inclusions/exclusions.";
  return buildStaticRouteMetadata("/policy", { title, description });
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function PolicyHubPage() {
  const page = await loadEcosystemPage("/policy");
  if (page && page.meta.status !== "published") return notFound();
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as Partial<typeof FALLBACK>;
  const heroStats = pc.heroStats ?? FALLBACK.heroStats;
  const policyTiles = pc.policyTiles ?? FALLBACK.policyTiles;
  const precedence = pc.precedence ?? FALLBACK.precedence;
  const docPrecedenceHeading = pc.docPrecedenceHeading ?? FALLBACK.docPrecedenceHeading;
  const docPrecedenceIntro = pc.docPrecedenceIntro ?? FALLBACK.docPrecedenceIntro;
  const docPrecedenceIssuedBy = pc.docPrecedenceIssuedBy ?? FALLBACK.docPrecedenceIssuedBy;
  const officialChannelsLines = pc.officialChannelsLines ?? FALLBACK.officialChannelsLines;
  const title =
    page?.meta.browserTitle ?? page?.meta.title ?? "JVTO Policies | Booking, Privacy & Inclusions";
  const description =
    page?.meta.description ??
    "Navigation hub for JVTO policy documents covering privacy, booking, payment, cancellation, and inclusions/exclusions.";
  const h1 = page?.meta.title ?? "JVTO Policies";
  const officialBody = page?.body?.trim();
  const answerFirst =
    page?.raw.page.answerFirst ??
    "JVTO publishes its booking, payment, cancellation, inclusions, and privacy terms in full, so you know exactly what you are buying before you confirm anything.";

  const policyHubExtraSchemas = [buildPolicyHubItemListSchema()].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={{
          route: "/policy",
          lang: "en",
          seo: {
            title,
            description,
            schema_type:
              page?.meta.schemaTypes?.find((t) => t !== "WebPage") ?? null,
          },
          content: { h1 },
        }}
        extraSchemas={policyHubExtraSchemas}
        suppressCmsFaq
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Policy Hub
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 006 / POLICY
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Read the rulebook{" "}
                <em className="not-italic text-jvto-orange">before</em>{" "}
                you book.
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                {answerFirst}
              </p>
              {page?.meta.lastReviewed ? (
                <p className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Last reviewed {page.meta.lastReviewed}
                </p>
              ) : null}
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {heroStats.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className="text-white font-semibold text-sm text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Policy tiles — off-white ──────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 01</span>
            <div>
              <h2
                className="font-black text-jvto-navy leading-[1.0]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
              >
                The <span className="text-jvto-orange">policies.</span>
              </h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Published in full</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policyTiles.filter((tile) => POLICY_ICONS[tile.slug]).map(({ slug, name, desc }) => (
              <Link
                key={slug}
                href={`/policy/${slug}`}
                prefetch={false}
                className="group bg-white rounded-[20px] p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)] transition-all block"
              >
                <div className="mb-4">{POLICY_ICONS[slug]}</div>
                <h3
                  className="font-black text-jvto-navy text-xl mb-3 leading-snug"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {name}
                </h3>
                <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                  Read policy <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {officialBody ? (
        <section
          className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="mb-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Official policy source
              </p>
              <h2
                className="font-black text-jvto-navy leading-[1.05]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(26px, 3.2vw, 42px)" }}
              >
                Rendered from ecosystem content.
              </h2>
            </div>
            <div className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA]">
              <MarkdownRenderer markdown={officialBody} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Document precedence — white ───────────────────────────────── */}
      <section
        className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-16 items-start">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Document precedence
              </p>
              <h2
                className="font-black text-jvto-navy leading-[1.05] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(26px, 3.2vw, 42px)" }}
              >
                {docPrecedenceHeading}
              </h2>
              <p className="text-[16px] text-[#6b7280] font-light leading-relaxed mb-8">
                {docPrecedenceIntro}
              </p>
              <div className="bg-[#F6F5F2] rounded-[16px] p-6 border border-[#E3E0DA]">
                <div className="space-y-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] mb-1">Issued by</div>
                    <div className="font-semibold text-jvto-navy text-sm">{docPrecedenceIssuedBy}</div>
                  </div>
                  <div className="pt-3 border-t border-[#E3E0DA]">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] mb-1">Official channels</div>
                    <div className="text-[14px] text-jvto-navy leading-relaxed">
                      {officialChannelsLines.map((line, i) => (
                        <span key={line}>
                          {line}
                          {i < officialChannelsLines.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ol className="space-y-3 mt-2">
              {precedence.map(({ title, sub }, i) => (
                <li key={title} className="flex items-start gap-4 bg-white border border-[#E3E0DA] rounded-[14px] p-5 shadow-[0_2px_8px_rgba(13,27,42,0.04)]">
                  <span className="font-mono text-[12px] font-bold text-jvto-orange border border-[#E3E0DA] rounded-full w-8 h-8 inline-flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <strong className="font-semibold text-jvto-navy text-[15px]">{title}</strong>
                    {sub && <div className="text-[13px] text-[#6b7280] font-light mt-0.5">{sub}</div>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 48px)" }}
          >
            Clear terms. <span className="text-jvto-orange">No surprises.</span>
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
              href="/contact"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Contact the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
