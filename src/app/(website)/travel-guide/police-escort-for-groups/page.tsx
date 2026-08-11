import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/static-content";

export const revalidate = 86400;

const ROUTE = "/travel-guide/police-escort-for-groups";
const SITE_URL = "https://javavolcano-touroperator.com";

// Fallback copy — only used if content/pages/travel-guide/police-escort-for-groups.json
// is ever unavailable at build/runtime (should not happen; kept for safety).
const FALLBACK_SEO = {
  title: "Police Escort for Groups · JVTO Travel Guide",
  description:
    "How official traffic police escorts work for larger tourist groups in East Java. When it is appropriate, how JVTO coordinates it, and what it involves.",
};

const GUIDE_NAV = [
  { href: "/travel-guide", label: "Guide overview" },
  { href: "/travel-guide/ijen-health-screening", label: "Ijen Health Screening" },
  { href: "/travel-guide/mount-bromo-logistics", label: "Mount Bromo Logistics" },
  { href: "/travel-guide/tumpak-sewu-logistics", label: "Tumpak Sewu Logistics" },
  { href: "/travel-guide/packing-list", label: "Packing List" },
  { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  { href: "/travel-guide/weather-and-closures", label: "Weather & Closures" },
  { href: "/travel-guide/safety-on-tours", label: "Safety on Tours" },
  { href: "/travel-guide/booking-information", label: "Booking Information" },
  { href: "/travel-guide/police-escort-for-groups", label: "Police Escort for Groups" },
  { href: "/travel-guide/faq", label: "FAQ" },
];

const STEPS = [
  "JVTO submits a formal request to the competent Traffic Police unit — including group size, vehicle count, route, and date.",
  "The request is reviewed against current regulations, unit availability, and route specifications.",
  "If approved, the escort is issued with written orders (SPRIN documentation). JVTO has existing police-cooperation framework documents on file.",
  "On the day, uniformed traffic police in official vehicles accompany the convoy on designated road segments — for example, from a toll exit to Bondowoso.",
];

const EXCLUSIONS = [
  <>It is <strong>not a default inclusion</strong> — not part of any standard package unless written on your E-Voucher.</>,
  <>It is <strong>not a guarantee</strong> of road clearance for any segment or timeline.</>,
  <>It is <strong>not a security detail</strong> — it is traffic-management coordination for convoy road segments.</>,
  <><strong>No unofficial on-road payments</strong> are associated with a JVTO-coordinated escort. If anyone requests payment on the road during an escort, report it to JVTO immediately.</>,
];

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? FALLBACK_SEO.title;
  const description = page?.meta.description ?? FALLBACK_SEO.description;
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "article",
    },
  });
}

export default async function PoliceEscortPage() {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? FALLBACK_SEO.title;
  const description = page?.meta.description ?? FALLBACK_SEO.description;
  const h1 = page?.meta.title ?? FALLBACK_SEO.title;

  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title, description },
    content: { h1 },
  };

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow}
        extraSchemas={[]}
        suppressCmsFaq={true}
      />

      {/* ── Interior hero — navy ────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/travel-guide" prefetch={false} className="hover:text-white/70 transition-colors">Travel Guide</Link>
            <span>›</span>
            <span className="text-white/70">Police Escort for Groups</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Large groups · coordination
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / ESCORT
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Police escort{" "}
                <em className="italic text-jvto-orange">for groups.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                For large groups — typically around 18 guests or more — JVTO can coordinate an
                official traffic police escort on certain road segments, when approved by the
                relevant Traffic Police unit. It is a formal request process, not a marketing add-on.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Qualifying size", value: "≈ 18 guests or more" },
                { label: "Provided by", value: "Traffic Police (Ditlantas)" },
                { label: "Request at", value: "Initial quotation" },
                { label: "Approval", value: "Not guaranteed" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">{label}</span>
                  <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Article section — off-white, stacked ───────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">

            {/* Sidebar nav */}
            <aside className="md:sticky md:top-24 self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Travel Guide
              </p>
              <nav className="space-y-0.5">
                {GUIDE_NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                      href === ROUTE
                        ? "bg-jvto-navy text-white"
                        : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/tours"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Browse tours <ArrowRight />
              </Link>
            </aside>

            {/* Article prose */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af] block mb-6">
                Reading time · 4 min
              </span>
              <p className="text-[17px] text-jvto-navy font-light leading-relaxed mb-10">
                For large groups — typically around 18 guests or more — JVTO can coordinate an
                official traffic police escort on certain road segments, when approved by the
                relevant Traffic Police unit. It is a formal request process filed with the police,
                not a marketing add-on, and approval is never guaranteed.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] mb-4 leading-snug"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                What a traffic police escort is
              </h2>
              <div className="space-y-4 text-[15.5px] text-jvto-navy font-light leading-relaxed mb-10">
                <p>
                  A traffic police escort in East Java is a formal arrangement between JVTO and the
                  relevant Traffic Police unit (Ditlantas). When approved, uniformed traffic police
                  travel in official police vehicles, under written orders, to help manage road flow
                  on specific segments — particularly at high-traffic junctions and toll-road exits —
                  for large vehicle convoys.
                </p>
                <p>
                  JVTO does not provide escort vehicles itself. The escort, when it occurs, is
                  provided by the Indonesian National Police under a formal request process.
                </p>
              </div>

              <h2
                className="font-black text-jvto-navy text-[22px] mb-4 leading-snug"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                Who qualifies
              </h2>
              <p className="text-[15.5px] text-jvto-navy font-light leading-relaxed mb-10">
                The escort is a coordination service for large vehicle convoys that meet the qualifying
                group size — <strong className="font-semibold">typically around 18 guests or more</strong>. It is not a default
                inclusion for smaller groups, and not part of any standard JVTO package unless it is
                written on your E-Voucher. Whether a specific route and date are approved depends on
                regulations, Traffic Police unit availability, and route definitions at the time of
                request. <strong className="font-semibold">Approval is not guaranteed.</strong>
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] mb-4 leading-snug"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                How it works
              </h2>
              <ol className="mb-10">
                {STEPS.map((step, i) => (
                  <li key={i} className="grid grid-cols-[38px_1fr] gap-5 py-5 border-t border-[#E3E0DA] last:border-b">
                    <span className="w-[30px] h-[30px] rounded-full bg-jvto-orange/10 font-mono text-[13px] font-bold text-jvto-orange flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-[15.5px] text-jvto-navy font-light leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="text-[15.5px] text-jvto-navy font-light leading-relaxed mb-10">
                The escort operates under official police authority, not JVTO instruction. It does not
                bypass speed limits, road rules, or normal traffic regulations, and it does not grant
                preferential access to national parks or restricted sites.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] mb-4 leading-snug"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                What the escort does not include
              </h2>
              <ul className="mb-10">
                {EXCLUSIONS.map((item, i) => (
                  <li key={i} className="grid grid-cols-[22px_1fr] gap-4 py-4 border-t border-[#E3E0DA] last:border-b text-[15.5px] text-jvto-navy font-light leading-relaxed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[18px] h-[18px] text-jvto-orange mt-0.5 flex-shrink-0" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2
                className="font-black text-jvto-navy text-[22px] mb-4 leading-snug"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                How to request
              </h2>
              <p className="text-[15.5px] text-jvto-navy font-light leading-relaxed mb-10">
                If your group meets the qualifying size (typically 18 guests or more), raise the escort
                request when you contact JVTO for your initial quotation. Include your group size,
                vehicle count, proposed route, and travel dates. JVTO assesses feasibility, submits the
                formal request to the Traffic Police unit if appropriate, and lists escort costs
                explicitly in your programme and invoice if approved — no post-booking additions.
              </p>

              {/* Note box — lime border */}
              <div className="border border-[#E3E0DA] border-l-[3px] border-l-jvto-lime bg-jvto-lime/5 rounded-[12px] px-6 py-5 mb-10">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-jvto-navy block mb-2">
                  The relationship behind it
                </span>
                <p className="text-[15px] text-jvto-navy font-light leading-relaxed">
                  JVTO&apos;s founder, Mr. Sam (Agung Sambuko), is an active officer of the Indonesian
                  National Police, assigned to Ditpamobvit (Directorate of Vital Object Security),
                  East Java. That gives JVTO an established institutional relationship with police
                  coordination frameworks most operators do not have — not a shortcut around
                  regulations, but an established protocol within them.{" "}
                  <Link href="/verify-jvto/police-safety" prefetch={false} className="text-jvto-orange border-b border-current">
                    See the Police &amp; Safety proof page
                  </Link>.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ─────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.5vw, 44px)" }}
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
