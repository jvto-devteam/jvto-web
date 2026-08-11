// app/(website)/why-jvto/our-story/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const seo = (page.pageRow.seo as Record<string, string> | null) ?? {};
  const title = seo.title ?? "Our Story — JVTO";
  const description =
    seo.description ??
    "JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the Tourist Police experience of our founder, Mr. Sam.";
  return {
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
  };
}

export default async function OurStoryPage() {
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
                From a homestay to a{" "}
                <span className="text-jvto-orange italic">licensed operator.</span>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator
                shaped by the Tourist Police experience of our founder, Mr. Sam.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "2015", value: "Ijen Bondowoso Homestay" },
                { label: "2016", value: "PT incorporated" },
                { label: "2023", value: "TDUP formalized" },
                { label: "Evidence span", value: "11 years" },
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

            {/* Article body */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-4 block">
                Company bio
              </span>
              <p className="text-[17px] text-jvto-navy font-light leading-relaxed mb-8 max-w-[62ch]">
                We saw the gaps in safety standards first-hand and decided to build something
                different: private-only routes, realistic driving days, and clear written rules.
                Today, we act as a bridge between wild adventure and professional safety standards.
              </p>

              <h2
                className="text-2xl md:text-[1.875rem] font-bold text-jvto-navy mt-10 mb-5"
                style={{ letterSpacing: "-0.015em" }}
              >
                How we got here
              </h2>

              <h3 className="text-[1.0625rem] font-bold text-jvto-navy mt-8 mb-3">
                2015 — The Guesthouse
              </h3>
              <p className="text-[16px] text-[#374151] leading-relaxed mb-4">
                Agung Sambuko — Mr. Sam — grew up in Bondowoso, the town closest to Kawah Ijen. In
                2015 he opened the Ijen Bondowoso Homestay on Jl. Khairil Anwar No.102 (the current
                office address is No.102A — the &lsquo;A&rsquo; suffix was added after the PT
                registration in 2016), the same address where JVTO operates today. Booking.com
                guests rated the property 9.4&nbsp;/&nbsp;10 — an award that was shipped to the
                Bondowoso address that year.
              </p>
              <p className="text-[16px] text-[#374151] leading-relaxed mb-4">
                He was already an active officer in the Indonesian National Police, assigned to
                Ditpamobvit — the directorate responsible for security at vital tourist objects
                including the Ijen Crater area. Managing the guesthouse meant he saw both sides of
                East Java volcano tourism: the visitor experience and the operational safety gaps.
              </p>

              <h3 className="text-[1.0625rem] font-bold text-jvto-navy mt-8 mb-3">
                2016 — PT Java Volcano Rendezvous
              </h3>
              <p className="text-[16px] text-[#374151] leading-relaxed mb-4">
                Mr. Sam incorporated PT Java Volcano Rendezvous on 2016-01-01. Stefan Loose
                Reiseführer Indonesien (4th Edition, 2018, ISBN 978-3-7701-7881-0, p.&nbsp;287)
                later named &ldquo;Agung&rdquo; as the operator of the Ijen Bondowoso Homestay with
                tour arrangements. An independent German travel publisher — not a JVTO-authored
                reference — listing the same name at the same address.
              </p>

              <h3 className="text-[1.0625rem] font-bold text-jvto-navy mt-8 mb-3">
                2023 — TDUP Formalization
              </h3>
              <p className="text-[16px] text-[#374151] leading-relaxed mb-4">
                The Tourism Business Permit (TDUP) was formalized in 2023, completing the regulatory
                paperwork chain. NIB 1102230032918 is the government-issued national business
                registration number, verifiable through Indonesia&apos;s OSS system.
              </p>

              <blockquote className="border-l-[3px] border-jvto-orange pl-6 my-8 italic text-[17px] text-[#374151] leading-relaxed font-light">
                One command authority, clear responsibility, documented route — the same operational
                logic that applies to police convoy coordination.
              </blockquote>

              <h2
                className="text-2xl md:text-[1.875rem] font-bold text-jvto-navy mt-10 mb-5"
                style={{ letterSpacing: "-0.015em" }}
              >
                Why private-only
              </h2>
              <p className="text-[16px] text-[#374151] leading-relaxed mb-4">
                The decision to operate private tours exclusively came from what Mr. Sam observed in
                the field: unlicensed operators running shared groups without consistent guides, no
                medical screening before Ijen hikes, casual attitudes toward BBKSDA permit
                requirements, drivers working routes they did not know.
              </p>
              <p className="text-[16px] text-[#374151] leading-relaxed">
                Private structure removes the coordination failures that come with mixed groups. Your
                vehicle and crew are assigned to your booking. Safety decisions are made for your
                group, not averaged across strangers with different fitness levels and objectives.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Evidence chain — navy ─────────────────────────────────────── */}
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
              style={{
                fontFamily: "Raleway, Inter, sans-serif",
                letterSpacing: "-0.03em",
                fontSize: "clamp(28px, 4vw, 48px)",
              }}
            >
              The evidence <span className="text-jvto-orange">chain.</span>
            </h2>
            <span className="font-mono text-[11px] text-white/55">Third-party records</span>
          </div>
          <p className="text-white/70 text-[17px] font-light leading-relaxed max-w-[64ch] mb-12">
            These are third-party records that establish operational continuity at the same Bondowoso
            address from 2015 to today — the same person, the same location, the same operation.
          </p>

          <div className="grid md:grid-cols-[1fr_1fr] gap-16 items-start">
            {/* Timeline */}
            <ul className="m-0 p-0 list-none space-y-0">
              {[
                {
                  year: "'15",
                  title: "Booking.com Guest Review Award",
                  desc: 'Shipped to "Agung, Jl. Khairil Anwar No.102, Bondowoso." Property rated 9.4 / 10. Plaque and shipping label on file.',
                },
                {
                  year: "'16",
                  title: "PT incorporation",
                  desc: "PT Java Volcano Rendezvous incorporated 2016-01-01. NIB 1102230032918.",
                },
                {
                  year: "'18",
                  title: "Stefan Loose Reiseführer, 4th Ed.",
                  desc: "p. 287, ISBN 978-3-7701-7881-0 (DuMont Reiseverlag, 2018). “Agung” named as operator — an independent German-language guidebook, not a JVTO-authored reference.",
                },
                {
                  year: "'21",
                  title: "Independent press coverage",
                  desc: "Detik.com (2021-03-14) and Radar Jember (2021-03-24) name “Bripka Agung Sambuko” in Tourist Police duties at Ijen Geopark.",
                },
                {
                  year: "'23",
                  title: "TDUP formalization",
                  desc: "Tourism Business Permit formalized. Verifiable at /verify-jvto/legal.",
                },
              ].map(({ year, title, desc }) => (
                <li key={year} className="flex gap-5 pb-8 last:pb-0">
                  <div className="flex-shrink-0 w-16">
                    <span
                      className="font-black text-white/20 leading-none block"
                      style={{
                        fontFamily: "Raleway, Inter, sans-serif",
                        fontSize: "clamp(36px, 5vw, 60px)",
                        letterSpacing: "-0.05em",
                      }}
                    >
                      {year}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h4 className="text-white font-bold text-[15px] mb-1.5">{title}</h4>
                    <p className="text-white/65 text-[14px] font-light leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Data box */}
            <div className="bg-white/[0.05] border border-white/10 rounded-[20px] p-6 self-start flex flex-col gap-0">
              <div className="pb-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-2">
                  The record set
                </div>
                <div className="text-white/85 text-[15px] leading-relaxed font-light">
                  Commercial platforms · independent press · government registration · a European
                  travel publisher — documented across an eleven-year span.
                </div>
              </div>
              <div className="border-t border-white/10 pt-5 pb-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1">
                  Same person
                </div>
                <div className="text-white font-semibold text-[14px]">
                  Agung &ldquo;Mr. Sam&rdquo; Sambuko
                </div>
              </div>
              <div className="border-t border-white/10 pt-5 pb-5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1">
                  Same location
                </div>
                <div className="text-white font-semibold text-[14px]">
                  Jl. Khairil Anwar No.102A, Bondowoso
                </div>
              </div>
              <div className="border-t border-white/10 pt-5">
                <Link
                  href="/verify-jvto/history-artifacts"
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
                >
                  See the artifacts <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
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
