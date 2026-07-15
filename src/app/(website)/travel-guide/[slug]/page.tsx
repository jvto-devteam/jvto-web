import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildResolvedFaqSchema,
  resolveFaqsForPage,
} from "@/lib/content/resolveFaqs";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";
import {
  buildIjenHealthHowToSchema,
  buildIjenHealthMedicalWebPageSchema,
} from "@/lib/schemas/buildTravelGuideSchemas";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

const TRAVEL_GUIDE_DEST_LINKS: Record<
  string,
  Array<{ slug: string; name: string }>
> = {
  "ijen-health-screening": [{ slug: "ijen-crater", name: "Ijen Crater" }],
  "mount-bromo-logistics": [{ slug: "mount-bromo", name: "Mount Bromo" }],
  "tumpak-sewu-logistics": [
    { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" },
  ],
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

type HeroMeta = {
  eyebrow: string;
  lede: string;
  metaRows: Array<{ label: string; value: string }>;
};

const SLUG_HERO: Record<string, HeroMeta> = {
  "ijen-health-screening": {
    eyebrow: "Conditional · BBKSDA SE.1658",
    lede: "Ijen crater access requires a health certificate under BBKSDA rules. JVTO coordinates the clinic workflow with a named, SIP-licensed physician — and the certificate is QR-verified at the gate.",
    metaRows: [
      { label: "Regulatory basis", value: "BBKSDA SE.1658/KSA.9/2024" },
      { label: "Physician", value: "Dr. Ahmad Irwandanu · SIP" },
      { label: "Where", value: "Your hotel, the evening before" },
      { label: "Gate check", value: "QR-verified" },
    ],
  },
  "mount-bromo-logistics": {
    eyebrow: "Logistics · Bromo",
    lede: "Private jeep, sunrise timing, and altitude preparation — what you need to know before arriving at the Tengger caldera.",
    metaRows: [
      { label: "Elevation", value: "2,329 m above sea level" },
      { label: "Sunrise", value: "Penanjakan viewpoint · 04:00" },
      { label: "Vehicle", value: "Dedicated 4WD jeep" },
      { label: "Access", value: "BBKSDA clearance in hand" },
    ],
  },
  "tumpak-sewu-logistics": {
    eyebrow: "Logistics · Waterfall",
    lede: "Canyon descent, river crossings, and fitness expectations for Java's most dramatic waterfall trail.",
    metaRows: [
      { label: "Trail type", value: "Canyon descent · 1–2 km" },
      { label: "Difficulty", value: "Moderate" },
      { label: "Footwear", value: "Hiking shoes required" },
      { label: "From Surabaya", value: "~4 hours by private car" },
    ],
  },
  "packing-list": {
    eyebrow: "Prep · Gear",
    lede: "What to bring for Bromo, Ijen, and Tumpak Sewu — layered clothing, headlamps, and the items most guests forget.",
    metaRows: [
      { label: "Covers", value: "Bromo, Ijen, Tumpak Sewu" },
      { label: "Category", value: "Clothing, gear, medication" },
    ],
  },
  "packing-and-fitness": {
    eyebrow: "Prep · Fitness",
    lede: "Fitness expectations and clothing recommendations for East Java's volcano treks and waterfall descents.",
    metaRows: [
      { label: "Fitness level", value: "Easy to Moderate" },
      { label: "Key concern", value: "Cold mornings, uneven terrain" },
    ],
  },
  "weather-and-closures": {
    eyebrow: "Conditions · PVMBG",
    lede: "PVMBG alerts, seasonal access, and what happens to your booking when conditions change.",
    metaRows: [
      { label: "Source", value: "PVMBG / MAGMA Indonesia" },
      { label: "Monsoon risk", value: "Nov – Mar" },
      { label: "Policy", value: "Weather & Closures guide" },
    ],
  },
  "safety-on-tours": {
    eyebrow: "Safety · Protocol",
    lede: "Police-led protocols, medical coverage, and the decision boundaries that govern JVTO's private tours.",
    metaRows: [
      { label: "Medical", value: "Licensed physician on-call" },
      { label: "Safety lead", value: "Tourist Police coordination" },
      { label: "Vehicle", value: "Inspected · maintained" },
    ],
  },
  "booking-information": {
    eyebrow: "Process · Booking",
    lede: "Deposits, confirmation, reschedule mechanics, and the JVTO Travel Credit scheme explained in plain language.",
    metaRows: [
      { label: "Deposit", value: "30% at booking" },
      { label: "Balance", value: "Before departure" },
      { label: "Credit scheme", value: "JVTO Travel Credit" },
    ],
  },
  "police-escort-for-groups": {
    eyebrow: "Authority · Police",
    lede: "When and how official traffic police escort is arranged for larger groups — always through formal channels.",
    metaRows: [
      { label: "Threshold", value: "Multiple vehicles" },
      { label: "Arranged by", value: "JVTO via formal request" },
      { label: "Authority", value: "Kepolisian RI" },
    ],
  },
};

const DEFAULT_HERO: HeroMeta = {
  eyebrow: "Travel Guide",
  lede: "Essential information for your private East Java tour.",
  metaRows: [],
};

export function generateStaticParams() {
  return listPublicPageRoutesByPrefix("/travel-guide")
    .filter((route) => route !== "/travel-guide/faq")
    .map((route) => ({
      slug: route.replace("/travel-guide/", ""),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageSnapshot(`/travel-guide/${slug}`, {
    allowDatabaseFallback: false,
    requiredContentFields: ["body_md"],
  });
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const content = (page.pageRow.content as Record<string, any> | null) ?? {};

  if (typeof content.body_md !== "string" || content.body_md.trim().length === 0) {
    return { title: "Page Not Found" };
  }

  return {
    title: seo.title ?? content.h1 ?? page.pageRow.route,
    description: seo.description ?? undefined,
  };
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/travel-guide/${slug}`;
  const destLinks = TRAVEL_GUIDE_DEST_LINKS[slug] ?? [];
  const heroMeta = SLUG_HERO[slug] ?? DEFAULT_HERO;
  const currentHref = route;

  const [page, faqResolution] = await Promise.all([
    getPublicPageSnapshot(route, {
      allowDatabaseFallback: false,
      requiredContentFields: ["body_md"],
    }),
    resolveFaqsForPage(route),
  ]);
  const content = page.pageRow.content as any;
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Travel Guide";
  const body = content?.body_md ?? "";
  const faqSchema = buildResolvedFaqSchema(faqResolution, route);

  const ijenHealthSchemas =
    slug === "ijen-health-screening"
      ? [buildIjenHealthMedicalWebPageSchema(), buildIjenHealthHowToSchema()]
      : [];

  const slugExtraSchemas = [faqSchema, ...ijenHealthSchemas].filter(Boolean);

  if (!body.trim().length) return notFound();

  return (
    <>
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      {/* ── Interior hero — navy ───────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/travel-guide" prefetch={false} className="hover:text-white/70 transition-colors">Travel Guide</Link>
            <span>›</span>
            <span className="text-white/70">{h1}</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              {heroMeta.eyebrow && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    {heroMeta.eyebrow}
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    FILE 005 / GUIDE
                  </span>
                </div>
              )}
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {h1}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {heroMeta.lede}
              </p>
            </div>
            {heroMeta.metaRows.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
                {heroMeta.metaRows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">{label}</span>
                    <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Article section — off-white, stacked ──────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">

            {/* Sidebar nav */}
            <aside className="md:sticky md:top-24 self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Travel Guide
              </p>
              <nav className="space-y-0.5">
                {GUIDE_NAV.map(({ href, label }) => {
                  const isActive = href === currentHref;
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
              <MarkdownRendererTravelGuide markdown={body} />
              {content?.faq && (
                <Faq items={content?.faq} title={content?.faq_title ?? "FAQ"} />
              )}
              {destLinks.length > 0 && (
                <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-3">
                    Related Destinations
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {destLinks.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/destinations/${d.slug}`}
                        prefetch={false}
                        className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors"
                      >
                        {d.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
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
