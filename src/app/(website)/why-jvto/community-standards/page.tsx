// app/(website)/why-jvto/community-standards/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

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

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    width="15"
    height="15"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const DONT_LIST = [
  "We do not collect full card numbers, CVV codes, or online banking passwords via chat or email. Payment is through a secure, compliant gateway.",
  "We do not make verbal promises that override the written voucher. If it is not on the E-Voucher, it is not included.",
  "We do not source crew from freelance marketplaces. Every guide and driver is a named, registered team member.",
  "We do not guarantee natural phenomena. Blue Fire is subject to weather and gas activity. We plan around the viewing window — we do not promise outcomes that depend on volcanic gas conditions.",
  "We do not operate shared groups. Every tour is private to your booking.",
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const seo = (page.pageRow.seo as Record<string, string> | null) ?? {};
  const title = seo.title ?? "Community Standards — JVTO";
  const description =
    seo.description ??
    "JVTO publishes its rules, policies, and commitments before you pay anything. Guests who understand the terms before booking have better trips.";
  return {
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
  };
}

export default async function CommunityStandardsPage() {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqNode = buildResolvedFaqSchema(faqResolution, ROUTE);

  return (
    <>
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={[faqNode].filter(Boolean) as Record<string, unknown>[]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">
              Why JVTO
            </Link>
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
                Read the rulebook{" "}
                <span className="text-jvto-orange italic">before you book.</span>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                JVTO publishes its rules, policies, and commitments before you pay anything. Guests
                who understand the terms before booking have better trips.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Policies", value: "Published pre-booking" },
                { label: "Binding document", value: "E-Voucher PDF" },
                { label: "Ijen briefing", value: "Miner etiquette" },
                { label: "Employment", value: "Local Boys · ecotourism-aligned" },
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
      </header>

      {/* ── Policy docs — off-white ───────────────────────────────────── */}
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
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Open proof library <ArrowRight />
              </Link>
            </aside>

            {/* Main content */}
            <div className="min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">
                Written rules before booking
              </span>
              <h2
                className="font-black text-jvto-navy mb-4 leading-tight"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  fontSize: "clamp(22px, 3vw, 38px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Three policy documents, published openly.
              </h2>
              <p className="text-[#6b7280] text-[17px] font-light leading-relaxed max-w-[62ch] mb-8">
                Guests who discover cancellation policies at checkout do not have better trips. Ours
                are at /policy, before you pay.
              </p>

              {/* Policy tiles */}
              <div className="flex flex-col gap-4 mb-8">
                {[
                  {
                    href: "/policy/booking-payment-cancellation",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-6 h-6 flex-shrink-0 mt-0.5 text-jvto-orange"
                        aria-hidden="true"
                      >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                      </svg>
                    ),
                    title: "Booking, Payment & Cancellation",
                    desc: "How bookings are confirmed, deposit and balance timelines, the 48-hour cancellation cut-off, force-majeure procedures, and the Travel Credit system. The Official E-Voucher / Invoice PDF is the binding document.",
                    meta: "/policy/booking-payment-cancellation →",
                  },
                  {
                    href: "/policy/inclusions-exclusions",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-6 h-6 flex-shrink-0 mt-0.5 text-jvto-orange"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6M9 15l2 2 4-4" />
                      </svg>
                    ),
                    title: "Inclusions & Exclusions",
                    desc: "A written list of what is covered in the price and what is not. The write-it-to-bind-it rule: if it is not on the voucher, it is not included. This is what makes the \"no surprise costs\" claim verifiable.",
                    meta: "/policy/inclusions-exclusions →",
                  },
                  {
                    href: "/policy/privacy",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="w-6 h-6 flex-shrink-0 mt-0.5 text-jvto-orange"
                        aria-hidden="true"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    title: "Privacy & Data Protection",
                    desc: "What data we collect, how it is used, and who it is shared with. Payment cards are processed through a PCI DSS-compliant gateway. JVTO does not store full card numbers, CVVs, or banking credentials.",
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
                      <h3 className="text-[17px] font-bold text-jvto-navy mb-2 group-hover:text-jvto-orange transition-colors">
                        {tile.title}
                      </h3>
                      <p className="text-[15px] text-[#6b7280] leading-relaxed mb-3">{tile.desc}</p>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                        {tile.meta}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Policy hierarchy */}
              <div
                className="bg-white border border-[#E3E0DA] rounded-[16px] p-6"
              >
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-1">
                  The policy hierarchy
                </div>
                <div className="text-[15px] text-[#6b7280] font-light mb-4">
                  Written documents, in order — not verbal agreements.
                </div>
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
                      <span key={i} className="text-jvto-orange font-bold">
                        →
                      </span>
                    ) : (
                      <span
                        key={i}
                        className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-3.5 py-2 rounded-full border ${
                          item.lead
                            ? "bg-jvto-navy text-white border-jvto-navy"
                            : "bg-[#F6F5F2] text-jvto-navy border-[#E3E0DA]"
                        }`}
                      >
                        {item.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sulfur miner etiquette — navy ─────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] block mb-4">
                Sulfur Miner Etiquette · Ijen Routes
              </span>
              <h2
                className="font-black text-white mb-6 leading-tight"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(28px, 3.6vw, 46px)",
                  lineHeight: 1.05,
                }}
              >
                A shared working <span className="text-jvto-orange">path.</span>
              </h2>
              <p className="text-white/72 text-[16px] font-light leading-relaxed">
                At Kawah Ijen, the trail from Paltuding to the crater rim is a shared working path.
                Local miners carry 70–90&nbsp;kg loads of sulfur blocks from the crater floor —
                daily, at the same hours tourists are climbing. JVTO guides brief every Ijen-route
                group before departure. This briefing is standard, not optional.
              </p>
            </div>

            {/* Right — etiquette cards */}
            <div className="flex flex-col gap-4">
              <div className="bg-white/[0.04] border border-white/10 rounded-[16px] p-7">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] mb-2">
                  Do not block the path
                </div>
                <p className="text-white/80 text-[15px] font-light leading-relaxed">
                  Miners are working, not trekking. Move to the side when a load-carrier approaches.
                </p>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-[16px] p-7">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] mb-2">
                  Ask before photographing
                </div>
                <p className="text-white/80 text-[15px] font-light leading-relaxed">
                  Do not photograph a miner without their consent. If they say no, respect that. The
                  mining operation is a human reality of the site — not a photographic attraction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Local Boys + What we don't do — off-white ────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-16 items-start">
            {/* Local Boys */}
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-4">
                Local Boys Policy
              </span>
              <h2
                className="font-black text-jvto-navy mb-5 leading-tight"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  fontSize: "clamp(22px, 2.8vw, 36px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Community employment.
              </h2>
              <p className="text-[#6b7280] text-[16px] font-light leading-relaxed mb-4">
                JVTO recruits guides and drivers from local Bondowoso and Banyuwangi communities.
                The roster is not sourced from freelance marketplaces or external agencies.
              </p>
              <p className="text-[#6b7280] text-[16px] font-light leading-relaxed mb-6">
                This commitment is aligned with national ecotourism principles (INDECON — the
                Indonesian Ecotourism Network) and community-based tourism practices. 14 field crew
                members appear in the current roster, all named, photographed, and language-listed.
              </p>
              <Link
                href="/why-jvto/our-team"
                prefetch={false}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                See the full roster <ArrowRight />
              </Link>
            </div>

            {/* What we don't do */}
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-4">
                What we don&apos;t do
              </span>
              <h2
                className="font-black text-jvto-navy mb-6 leading-tight"
                style={{
                  fontFamily: "Raleway, Inter, sans-serif",
                  fontSize: "clamp(22px, 2.8vw, 36px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                We publish what we <span className="text-jvto-orange">won&apos;t</span> do.
              </h2>
              <ul className="m-0 p-0 list-none">
                {DONT_LIST.map((text, i) => (
                  <li
                    key={i}
                    className={`grid grid-cols-[auto_1fr] gap-5 items-start py-5 ${
                      i === 0 ? "" : "border-t border-[#E3E0DA]"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full bg-jvto-orange/10 text-jvto-orange grid place-items-center flex-shrink-0 mt-0.5">
                      <XIcon />
                    </span>
                    <p className="text-[16px] text-jvto-navy leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px, 4vw, 44px)",
            }}
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
