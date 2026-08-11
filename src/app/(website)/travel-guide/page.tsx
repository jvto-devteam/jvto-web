import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/static-content";
import { buildTgHubItemListSchema } from "@/lib/schemas/buildTravelGuideSchemas";

// Matches the hardcoded-production-origin convention used by the other
// travel-guide FAQPage @id builders (safety-on-tours, booking-information, etc.).
const FAQ_SITE_URL = "https://javavolcano-touroperator.com";

const ARTICLES = [
  { slug: "ijen-health-screening", label: "Required", name: "Ijen Health Screening", desc: "Mandatory medical clearance · gas mask · clinic protocol." },
  { slug: "packing-and-fitness", label: "Prep", name: "Packing & Fitness", desc: "Layered clothing and fitness expectations." },
  { slug: "weather-and-closures", label: "Conditions", name: "Weather & Closures", desc: "PVMBG alerts · seasonal access · monsoon notes." },
  { slug: "safety-on-tours", label: "Safety", name: "Safety on Tours", desc: "Police-led protocols · medical · vehicle standards." },
  { slug: "booking-information", label: "Process", name: "Booking Information", desc: "Deposits · confirmation · reschedule mechanics." },
  { slug: "police-escort-for-groups", label: "Authority", name: "Police Escort for Groups", desc: "When and how police escort is arranged." },
  { slug: "rijik-monthly-closure", label: "Conditions", name: "Ijen Rijik Monthly Closure", desc: "The first-Friday-of-the-month TWA Ijen conservation closure." },
  { slug: "faq", label: "Reference", name: "FAQ", desc: "Common questions answered in plain language." },
] as const;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage("/travel-guide");
  const title = page?.meta.browserTitle ?? page?.meta.title ?? "Travel Guide";
  const description =
    page?.meta.description ??
    "Your practical handbook for traveling with JVTO — bookings, safety, health screening, packing, and more.";
  const h1 = page?.meta.title ?? "Travel Guide";

  return buildStaticRouteMetadata("/travel-guide", {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/travel-guide`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/travel-guide.webp",
          width: 1200,
          height: 630,
          alt: h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/travel-guide.webp"],
    },
  });
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function TravelGuideHubPage() {
  const page = loadStaticPage("/travel-guide");
  const title = page?.meta.browserTitle ?? page?.meta.title ?? "Travel Guide";
  const description =
    page?.meta.description ??
    "Your practical handbook for traveling with JVTO — bookings, safety, health screening, packing, and more.";
  const h1 = page?.meta.title ?? "Travel Guide";

  const faqItems = (page?.faq ?? []).map((f) => ({ q: f.question, a: f.answer }));

  const faqSchema = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${FAQ_SITE_URL}/travel-guide#faq`,
        mainEntity: faqItems.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      }
    : null;

  const tgHubExtraSchemas = [buildTgHubItemListSchema(), faqSchema].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={{
          route: "/travel-guide",
          lang: "en",
          seo: { title, description },
          content: { h1 },
        }}
        extraSchemas={tgHubExtraSchemas}
        suppressCmsFaq={true}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Essential Knowledge
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 005 / GUIDE
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                The{" "}
                <em className="italic text-jvto-orange">rulebook</em>{" "}
                before you book.
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                Operational certainty starts with being informed. Read our comprehensive guide
                to understand the boundaries, logistics, and safety protocols of East Java expeditions.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Guide articles", value: "10" },
                { label: "Last updated", value: "May 2026" },
                { label: "Reading time", value: "~25 min" },
                { label: "Author", value: "JVTO ops team" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className="text-white font-semibold text-sm">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pre-trip essentials — off-white ───────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {/* §01 The rulebook before you book */}
          <div>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 01</span>
              <div>
                <h2
                  className="font-black text-jvto-navy leading-[1.0]"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
                >
                  The rulebook <span className="text-jvto-orange">before you book.</span>
                </h2>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Three boundaries</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ),
                  label: "PVMBG-aligned",
                  title: "Safety boundaries",
                  desc: "We follow official PVMBG (Volcanology) alerts without exception. If a site is closed, we do not enter. Safety is the non-negotiable.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  ),
                  label: "Real screening",
                  title: "Health requirements",
                  desc: "Mandatory certified clinic checks for Ijen. You must be medically cleared for altitude and sulfur exposure. No fake letters.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                      <circle cx="17" cy="7" r="3" />
                    </svg>
                  ),
                  label: "Not a broker",
                  title: "Operational control",
                  desc: "We are the operator, not a broker. We control the vehicles, the guides, and the safety decisions from start to finish.",
                },
              ].map(({ icon, label, title, desc }) => (
                <div key={title} className="bg-white rounded-[20px] p-7 border border-[#E3E0DA]">
                  <div className="mb-4">{icon}</div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-jvto-orange mb-1.5">{label}</p>
                  <h3
                    className="font-black text-jvto-navy text-xl mb-3"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[15px] text-[#6b7280] font-light leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Destination guides §02 — white ─────────────────────────── */}
      <section
        className="bg-white py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {/* §02 Destination guides */}
          <div>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 02</span>
              <div>
                <h2
                  className="font-black text-jvto-navy leading-[1.0]"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
                >
                  Destination <span className="text-jvto-orange">guides.</span>
                </h2>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Practical logistics</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { href: "/travel-guide/ijen-health-screening", name: "Ijen Health Screening", desc: "Mandatory medical clearance · gas mask · clinic protocol." },
              ].map(({ href, name, desc }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className="group bg-white rounded-[20px] p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)] transition-all block"
                >
                  <div className="mb-4">
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3
                    className="font-black text-jvto-navy text-xl mb-3"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {name}
                  </h3>
                  <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-5">{desc}</p>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                    Read guide <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Practical preparation §03 — off-white ─────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {/* §03 Practical preparation */}
          <div>
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 03</span>
              <div>
                <h2
                  className="font-black text-jvto-navy leading-[1.0]"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
                >
                  Practical <span className="text-jvto-orange">preparation.</span>
                </h2>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Climate · gear · connectivity</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/travel-guide/packing-and-fitness"
                prefetch={false}
                className="group bg-white rounded-[20px] p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)] transition-all block"
              >
                <div className="mb-4">
                  <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M8 7V4a2 2 0 012-2h4a2 2 0 012 2v3" />
                  </svg>
                </div>
                <h3 className="font-black text-jvto-navy text-xl mb-3" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What to pack</h3>
                <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-5">Layered clothing, hiking shoes, headlamps, and personal medication. See our full list.</p>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">Read packing list <ArrowRight /></span>
              </Link>
              <div className="bg-white rounded-[20px] p-7 border border-[#E3E0DA]">
                <div className="mb-4">
                  <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M14 4v10a4 4 0 11-4 0V4a2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-black text-jvto-navy text-xl mb-3" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Altitude &amp; temperature</h3>
                <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-4">Bromo can drop to 0°C. Ijen is at 2,386m. Prepare for cold mornings and thin air.</p>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Critical info</span>
              </div>
              <div className="bg-white rounded-[20px] p-7 border border-[#E3E0DA]">
                <div className="mb-4">
                  <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15 15 0 010 20" />
                  </svg>
                </div>
                <h3 className="font-black text-jvto-navy text-xl mb-3" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Money &amp; connectivity</h3>
                <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-4">Cash is king in remote areas. SIM cards and Wi-Fi availability vary by location.</p>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">Logistics</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Operational certainty checklist — navy ─────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-12">
            <span className="font-mono text-[11px] font-bold text-white/50">§ 04</span>
            <div>
              <h2
                className="font-black text-white leading-[1.0]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
              >
                Operational certainty <span className="text-jvto-orange">checklist.</span>
              </h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Three steps</span>
            </div>
          </div>
          <ol className="max-w-[64ch]">
            {[
              {
                title: "Verify your operator",
                desc: "Check for a real NIB license and police-led safety oversight. Don't book with unlicensed brokers.",
              },
              {
                title: "Verify your health",
                desc: "Ensure you have a real medical check at a certified clinic for Ijen. Your safety depends on it.",
              },
              {
                title: "Verify your route",
                desc: "Confirm your private logistics and safety decision boundaries. Know who makes the call if things change.",
              },
            ].map(({ title, desc }, i) => (
              <li key={title} className="grid grid-cols-[44px_1fr] gap-4 py-6 border-b border-white/15 first:border-t first:border-t-white/15">
                <span className="font-mono text-sm font-bold text-jvto-orange bg-jvto-orange/10 rounded-full w-8 h-8 inline-flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h4
                    className="font-bold text-white text-lg mb-1"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {title}
                  </h4>
                  <p className="text-white/65 text-[15px] font-light leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── All articles + CTA — off-white ────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 05</span>
            <div>
              <h2
                className="font-black text-jvto-navy leading-[1.0]"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
              >
                All <span className="text-jvto-orange">articles.</span>
              </h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">{ARTICLES.length} guides</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARTICLES.map(({ slug, label, name, desc }) => (
              <Link
                key={slug}
                href={`/travel-guide/${slug}`}
                prefetch={false}
                className="group bg-white rounded-[16px] p-6 border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)] transition-all block"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-jvto-orange mb-2">{label}</p>
                <h3
                  className="font-bold text-jvto-navy text-[17px] mb-2 leading-snug"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {name}
                </h3>
                <p className="text-[14px] text-[#6b7280] font-light leading-relaxed mb-4">{desc}</p>
                <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                  Open <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ §06 — white ────────────────────────────────────────────── */}
      {faqItems.length > 0 && (
        <section
          className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.05)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="font-mono text-[11px] font-bold text-jvto-orange">§ 06</span>
              <div>
                <h2
                  className="font-black text-jvto-navy leading-[1.0]"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}
                >
                  Frequently <span className="text-jvto-orange">asked.</span>
                </h2>
              </div>
            </div>
            <Faq items={faqItems} title="Travel Guide: Common Questions" />
          </div>
        </section>
      )}

      {/* ── CTA — navy, stacked ─────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[8]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 48px)" }}
          >
            Ready for operational <span className="text-jvto-orange">certainty?</span>
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
