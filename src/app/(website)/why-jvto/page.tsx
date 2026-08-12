import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/static-content";
import { getCrewCounts } from "@/lib/people/canonicalPeople";
import { DiffChipsPanel, QuoteRotator, StoryTabsPanel, StandardsAccordion } from "@/components/website/WhyJvtoInteractive";

const siteUrl = "https://javavolcano-touroperator.com";
const ROUTE = "/why-jvto";

const defaultWhyTitle = "Why Choose Java Volcano Tour Operator";
const defaultWhyDescription =
  "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.";

export function generateMetadata(): Metadata {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? defaultWhyTitle;
  const description = page?.meta.description ?? defaultWhyDescription;
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  });
}

const CREW = [
  { name: "Anjas", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768270423657-690185912-anjas.png" },
  { name: "Taufik", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768228083285-919198019-taufik_1_.png" },
  { name: "Rendi", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768228514527-518051332-rendi.png" },
  { name: "Kiki", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768271545598-834784538-kiki.png" },
  { name: "Gufron", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768225567764-405955176-gufron.png" },
  { name: "Fauzi", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768226003889-338819579-fauzi.png" },
  { name: "Boy", role: "Guide", img: "https://javavolcano-touroperator.com/uploads/1768228191022-893381041-boy.png" },
  { name: "Yandi", role: "Driver", img: "https://javavolcano-touroperator.com/uploads/1768270364125-144711646-yandi.png" },
  { name: "Fredi", role: "Driver", img: "https://javavolcano-touroperator.com/uploads/1768276791622-262250680-freddy.png" },
  { name: "Holili", role: "Driver", img: "https://javavolcano-touroperator.com/uploads/1768277053384-470130286-holili.jpg" },
  { name: "Joyo", role: "Driver", img: "https://javavolcano-touroperator.com/uploads/1768277336049-911840775-joyo.png" },
] as const;

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function WhyJvtoPage() {
  const page = loadStaticPage(ROUTE);
  const counts = getCrewCounts();

  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title: page?.meta.title, description: page?.meta.description },
    content: { h1: page?.meta.title ?? "Why JVTO" },
  };

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} suppressCmsFaq />

      {/* ── Hero — navy ────────────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${siteUrl}/assets/img/hero/home.webp)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-jvto-navy/60" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO &#8212; Hub
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 004 / WHY JVTO
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Six things that <em className="italic text-jvto-orange">separate</em> us.
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                A licensed private tour operator led by an active Tourist Police officer — Bripka Agung Sambuko of Ditpamobvit, East Java. Every claim below is verifiable.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Legal entity", value: "PT Java Volcano Rendezvous" },
                { label: "NIB", value: "1102230032918" },
                { label: "Founder", value: "Active Tourist Police" },
                { label: "Tour format", value: "100% private" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className="text-white font-semibold text-sm text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── §01 The JVTO Difference — bg-white, feat-reverse ─────────── */}
      <section
        className="bg-white py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="md:order-1 order-2">
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] mb-4">
                <span className="text-jvto-orange font-bold">§ 01</span> · The JVTO Difference
              </span>
              <h2
                className="font-black text-jvto-navy leading-[1.04] mb-4"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                Six differentiators, <span className="text-jvto-orange">each verifiable.</span>
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6">
                Not marketing language — every one is backed by a credential you can check.{" "}
                <strong className="font-semibold text-jvto-navy">Tap a pillar to see what proves it.</strong>
              </p>
              <DiffChipsPanel />
              <Link
                href="/why-jvto/the-jvto-difference"
                prefetch={false}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Read the difference <ArrowRight />
              </Link>
            </div>
            <div className="md:order-2 order-1">
              <figure className="relative rounded-[40px] overflow-hidden aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${siteUrl}/founder/agung_sambuko.webp`} alt="Police-led safety authority at Ijen Crater" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Ditpamobvit · operational authority
                </span>
                <div className="absolute top-4 left-4 bg-white rounded-[14px] px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg max-w-[220px]">
                  <svg className="w-5 h-5 text-jvto-navy flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <div className="font-semibold text-jvto-navy text-[11px] leading-tight">Official Safety Authority</div>
                    <div className="text-[10px] text-[#6b7280]">Active Tourist Police officer</div>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── §02 Reviews — bg-off, feat ───────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <figure className="relative rounded-[40px] overflow-hidden aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${siteUrl}/assets/img/hero/home.webp`} alt="Verified reviews across 3 platforms" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Verified across 3 platforms
                </span>
                <div className="absolute top-4 left-4 bg-white rounded-[14px] px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg max-w-[200px]">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5" />
                  </svg>
                  <div>
                    <div className="font-semibold text-jvto-navy text-[11px] leading-tight">4.8 ★ Trustpilot</div>
                    <div className="text-[10px] text-[#6b7280]">51 verified reviews</div>
                  </div>
                </div>
              </figure>
            </div>
            <div>
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] mb-4">
                <span className="text-jvto-orange font-bold">§ 02</span> · Reviews
              </span>
              <h2
                className="font-black text-jvto-navy leading-[1.04] mb-4"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                Patterns, not a <span className="text-jvto-orange">quote wall.</span>
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6">
                Feedback grouped by what it proves, across three independent platforms — verified, not cherry-picked.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { num: "4.8", platform: "Trustpilot", count: "51 reviews" },
                  { num: "4.90", platform: "Google Maps", count: "123 reviews" },
                  { num: "4.95", platform: "TripAdvisor", count: "21 reviews" },
                ].map(({ num, platform, count }) => (
                  <div key={platform} className="bg-white rounded-[16px] p-4 border border-[#E3E0DA]">
                    <div className="font-black text-jvto-navy leading-none mb-1" style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.04em" }}>
                      {num}
                    </div>
                    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#9ca3af] mb-0.5">{platform}</div>
                    <div className="text-[11px] text-jvto-orange">{count}</div>
                  </div>
                ))}
              </div>
              <QuoteRotator />
              <Link
                href="/why-jvto/reviews"
                prefetch={false}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Read all reviews <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── §03 Our Story — bg-white, feat-reverse + dark panel ──────── */}
      <section
        className="bg-white py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="md:order-1 order-2 bg-jvto-navy rounded-[32px] p-8 md:p-10">
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-4">
                <span className="text-white/50 font-bold">§ 03</span> · Our Story
              </span>
              <h2
                className="font-black text-white leading-[1.04] mb-4"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(26px, 3.2vw, 40px)" }}
              >
                From a homestay to a <span className="text-jvto-orange">licensed operator.</span>
              </h2>
              <p className="text-white/60 text-[14px] font-light leading-relaxed mb-6">
                Eleven years of operational continuity at one Bondowoso address — documented by third parties.{" "}
                <strong className="font-semibold text-white/80">Tap a year.</strong>
              </p>
              <StoryTabsPanel />
              <Link
                href="/why-jvto/our-story"
                prefetch={false}
                className="inline-flex items-center gap-2 mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Read our story <ArrowRight />
              </Link>
            </div>
            <div className="md:order-2 order-1">
              <figure className="relative rounded-[40px] overflow-hidden aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${siteUrl}/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired-optimized.webp`}
                  alt="Ijen Bondowoso Homestay — since 2015"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Bondowoso · since 2015
                </span>
                <div className="absolute top-4 left-4 bg-white rounded-[14px] px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg max-w-[200px]">
                  <svg className="w-5 h-5 text-jvto-navy flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
                  </svg>
                  <div>
                    <div className="font-semibold text-jvto-navy text-[11px] leading-tight">Est. 2015</div>
                    <div className="text-[10px] text-[#6b7280]">Ijen Bondowoso Homestay</div>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── §04 Our Team — bg-jvto-navy ──────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">
            <div>
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-jvto-lime mb-4">
                <span className="text-jvto-lime">§ 04</span> · Our Team
              </span>
              <h2
                className="font-black text-white leading-[1.04]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.6vw, 48px)", maxWidth: "18ch" }}
              >
                {counts.total} named crew. <span className="text-jvto-orange">No freelancers.</span>
              </h2>
            </div>
            <div className="flex gap-6">
              {[
                { n: String(counts.guides), l: "Guides" },
                { n: String(counts.drivers), l: "Drivers" },
                { n: String(counts.total), l: "HPWKI KTA" },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <div
                    className="font-black text-jvto-lime leading-none"
                    style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.05em" }}
                  >
                    {n}
                  </div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/50 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes jvto-marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .jvto-marquee-wrap:hover .jvto-marquee-track {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .jvto-marquee-track { animation: none !important; }
            }
          `}</style>
          <div
            className="jvto-marquee-wrap relative overflow-hidden"
            style={{
              maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
            }}
          >
            <div className="jvto-marquee-track flex gap-5 w-max" style={{ animation: "jvto-marquee 46s linear infinite" }}>
              {[...CREW, ...CREW].map((p, idx) => (
                <Link key={idx} href={`/why-jvto/our-team/${p.name.toLowerCase()}`} className="flex-shrink-0 w-[190px] block">
                  <div className="relative rounded-[20px] overflow-hidden aspect-[3/4] mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <div className="font-black text-white text-[13px]" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>{p.name}</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-jvto-lime">{p.role}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 mt-5">
            Hover to pause · individually photographed &amp; license-linked · recruited from Bondowoso &amp; Banyuwangi
          </p>
          <Link
            href="/why-jvto/our-team"
            prefetch={false}
            className="inline-flex items-center gap-2 mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
          >
            Meet the full team <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── §05 Community Standards — bg-off, feat-reverse + accordion ── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="md:order-1 order-2">
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] mb-4">
                <span className="text-jvto-orange font-bold">§ 05</span> · Community Standards
              </span>
              <h2
                className="font-black text-jvto-navy leading-[1.04] mb-4"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                Read the rulebook <span className="text-jvto-orange">before you book.</span>
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6">
                We publish what we don&apos;t do as plainly as what we do. Every policy is online before you pay.
              </p>
              <StandardsAccordion />
              <Link
                href="/why-jvto/community-standards"
                prefetch={false}
                className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                See the standards <ArrowRight />
              </Link>
            </div>
            <div className="md:order-2 order-1">
              <figure className="relative rounded-[40px] overflow-hidden aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${siteUrl}/assets/img/hero/home.webp`} alt="Kawah Ijen — shared working path" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Kawah Ijen · shared working path
                </span>
                <div className="absolute top-4 left-4 bg-white rounded-[14px] px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg max-w-[210px]">
                  <svg className="w-5 h-5 text-jvto-navy flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  <div>
                    <div className="font-semibold text-jvto-navy text-[11px] leading-tight">Ecotourism-aligned</div>
                    <div className="text-[10px] text-[#6b7280]">Local Boys policy</div>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
          >
            Don&apos;t guess. <span className="text-jvto-orange">Verify.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
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
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
            PT Java Volcano Rendezvous · NIB 1102230032918 · Trustpilot 4.8 / 5 (51 reviews, verified 2026-05-09)
          </p>
        </div>
      </section>
    </>
  );
}
