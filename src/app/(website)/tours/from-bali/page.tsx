import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
import Link from "@/components/website/AppLink";
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";
import {
  buildOrganizationJsonLd,
  toOrganizationReferenceOnly,
  buildWebSiteJsonLd,
  buildJavaIslandPlaceNode,
  JAVA_ISLAND_PLACE_ID,
} from "@/lib/seo/jsonld/builders";
import {
  buildToursHubFaqSchema,
  buildToursHubAggregateRatingSchema,
} from "@/lib/schemas/buildToursHubSchemas";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";
import { ArrowRight, Shield, Users, FileText, Award, Check, Ship } from "lucide-react";

export const revalidate = 3600;

const fallbackSeo = {
  title: "Bromo Ijen Tour from Bali — 4 Private Packages | JVTO",
  h1: "Private East Java Volcano Tours from Bali",
  description:
    "Private 3D–5D Bromo & Ijen tours from Bali, ferry crossing included. Tourist Police-led, all-inclusive. 4.8★ Trustpilot. From IDR 2.85M/pax.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/tours/from-bali", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getToursFromBali(): Promise<ListTourPackage[]> {
  return getEcosystemPackagesList({ fromPrefix: "tours/from-bali", categoryId: 1 });
}

const INCLUSIONS_BALI = [
  { label: "Bali–Java ferry crossing", detail: "Gilimanuk–Ketapang, one-way (3 packages) or both directions (3D2N Bali-return package)." },
  { label: "Private transport", detail: "AC MPV (1–3 guests) or Toyota Hiace (4–9 guests). Fuel, tolls, and parking included." },
  { label: "Dedicated crew", detail: "English-speaking driver-guide (1–3 guests), or professional driver + escort guide (4+ guests)." },
  { label: "Entrance fees & permits", detail: "All attractions on the itinerary — no surprise gate payments." },
  { label: "Accommodation + breakfast", detail: "All nights, per itinerary." },
  { label: "Private 4WD Jeep", detail: "Bromo crater area. One jeep per ≤4 guests; additional jeeps for larger groups." },
  { label: "Gas masks & trekking poles", detail: "Ijen crater hike." },
  { label: "Health-certificate coordination", detail: "For Ijen routes when current access rules require it." },
  { label: "Daily mineral water", detail: "Supplied throughout the trip." },
  { label: "Pick-up to drop-off", detail: "Full assistance from your Bali hotel or address." },
  { label: "JVTO travel T-shirt", detail: "One per participant." },
];

const WHY_ITEMS = [
  {
    Icon: Shield,
    title: "Police-Led Operations",
    body: "Mr. Sam holds the rank of Bripka — active officer of Ditpamobvit East Java (Tourist Police). Confirmed by Detik.com, 2021. No other East Java operator is led by a serving Tourist Police officer.",
  },
  {
    Icon: Users,
    title: "100% Private — No Shared Groups",
    body: "Your booking receives a dedicated vehicle and crew. No join-in option exists. Group size determines vehicle type; timing and route decisions apply to your group only.",
  },
  {
    Icon: FileText,
    title: "All-Inclusive — Written Before You Book",
    body: "Ferry crossing, entrance fees, accommodation, gas masks, and all transport costs are bundled. Inclusions confirmed in your voucher — mid-trip negotiations do not occur on JVTO routes.",
  },
  {
    Icon: Award,
    title: "Verifiable Credentials",
    body: "NIB 1102230032918 verifiable via OSS. HPWKI AHU-0001072.AH.01.07.TAHUN 2024. BBKSDA clearance and POLPAR authorisation on file. All guides hold KTA 2024.",
  },
];

const BOOKING_STEPS = [
  { step: "01", text: "WhatsApp +62 822 4478 8833 with your dates, group size, preferred package, and Bali pick-up location." },
  { step: "02", text: "Receive a price confirmation per the pricing table for your group size." },
  { step: "03", text: "Pay 20% deposit via secure JVTO checkout to confirm the booking." },
  { step: "04", text: "Receive your e-voucher with full trip details and a pre-trip guide." },
];

function buildTrustSignals(
  reviewProfiles: Awaited<ReturnType<typeof getEcosystemReviewProfiles>>,
) {
  const platformSignals = ["Trustpilot", "Google Maps", "TripAdvisor"]
    .map((platform) => {
      const p = reviewProfiles.find((r) => r.platform === platform);
      if (!p || p.rating == null || p.reviewCount == null) return null;
      return { label: platform, value: `${p.rating} / 5 · ${p.reviewCount} reviews` };
    })
    .filter((s): s is { label: string; value: string } => s !== null);

  return [
    ...platformSignals,
    { label: "Founded", value: "2015" },
    { label: "ISIC Provider", value: "ID 259268 (isic.org verifiable)" },
  ];
}

export default async function ToursPageBali() {
  const [seo, initialTours, org, reviewProfiles] = await Promise.all([
    getEcosystemPageSeo("/tours/from-bali", fallbackSeo),
    getToursFromBali(),
    getOrganizationProfile(),
    getEcosystemReviewProfiles(),
  ]);
  const trustSignals = buildTrustSignals(reviewProfiles);
  const trustpilot = reviewProfiles.find((p) => p.platform === "Trustpilot");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pageUrl = `${siteUrl}/tours/from-bali`;
  const orgNode = toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, siteUrl));
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      buildJavaIslandPlaceNode(),
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#collection` },
        about: { "@id": JAVA_ISLAND_PLACE_ID },
        // GEO audit Priority 3 (2026-08-15): explicit regional-market signal —
        // JVTO already serves these markets via dedicated pages (ecosystemContent/markets.ts),
        // this just cross-references them from the tours hub. Hong Kong/Taiwan
        // have no dedicated market page yet (no packaging/pricing decision made),
        // so they're intentionally not referenced here.
        mentions: [
          { "@id": `${siteUrl}/markets/singapore#webpage` },
          { "@id": `${siteUrl}/markets/malaysia#webpage` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: seo.h1,
        description: seo.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Tours From Bali", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: seo.h1,
        numberOfItems: initialTours.length,
        itemListElement: initialTours.map((tour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/${tour.slug}`,
          name: tour.name,
        })),
      },
    ],
  };

  const hubFaqSchema = buildToursHubFaqSchema();
  // Google Maps only — the single figure allowed to be presented as THE rating.
  // Null (both sources unreachable) => the node is omitted, never guessed.
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: "from-bali", liveStats: await getPublicAggregateRating() });

  return (
    <>
      <StructuredData data={schema} />
      <StructuredData data={hubFaqSchema} />
      {hubAggregateRatingSchema && <StructuredData data={hubAggregateRatingSchema} />}

      {/* ── 1. HERO ───────────────────────────────────── */}
      <section className="bg-jvto-navy text-white pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--color-jvto-lime) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 mb-6">
            <span className="text-micro font-semibold uppercase tracking-[0.2em] text-white/60">
              From Bali
            </span>
          </div>

          <h1 className="font-display text-heading-sm md:text-heading font-black mb-6 max-w-3xl">
            Private East Java Volcano Tours from Bali —{" "}
            <em className="text-jvto-orange not-italic">Police-Led, Ferry Included.</em>
          </h1>

          <p className="text-white/60 text-body-sm md:text-body max-w-2xl mb-8 font-light">
            {initialTours.length} private packages: Kawah Ijen, Mount Bromo, Tumpak Sewu &amp; Papuma Beach.
            Cross from Bali to East Java with your own vehicle, your own crew, and no hidden costs.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {[
              "NIB 1102230032918",
              trustpilot
                ? `Trustpilot ${trustpilot.rating}/5 · ${trustpilot.reviewCount} reviews`
                : "Trustpilot",
              "Founded 2015",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-micro font-semibold text-white/60 uppercase tracking-[0.1em]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#packages"
              prefetch={false}
              className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-micro uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              Browse {initialTours.length} Packages
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 font-bold text-micro uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. PACKAGES ───────────────────────────────── */}
      <section id="packages" className="bg-jvto-off py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-lime-ink">
              {initialTours.length} Packages
            </span>
          </div>
          <h2 className="font-display text-subheading md:text-heading-sm font-black text-jvto-navy mb-4 max-w-2xl">
            {initialTours.length} Private Tours from Bali.{" "}
            <em className="text-jvto-orange-ink not-italic">Ferry crossing included.</em>
          </h2>
          <p className="text-jvto-muted text-caption md:text-body-sm max-w-xl mb-8">
            Dedicated vehicle, English-speaking crew, ferry crossing (Gilimanuk–Ketapang), entrance fees,
            accommodation + breakfast, gas masks, mineral water, JVTO T-shirt.
            Price per person — no hidden local payments.
          </p>

          {/* Route overview highlight */}
          <div className="flex gap-4 p-5 bg-white rounded-jvto-md border border-jvto-border card-jvto">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-jvto-navy/10 flex items-center justify-center mt-0.5">
              <Ship className="w-5 h-5 text-jvto-navy" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display font-black text-jvto-navy text-caption mb-1">
                Bali to East Java — what the route looks like
              </p>
              <p className="text-micro text-jvto-muted">
                All {initialTours.length} Bali packages cross from Bali to East Java by ferry on Day 1.
                Three packages finish in Surabaya (one-way overland); one package returns you to Bali on Day 3.
                Pick-up is from your Bali hotel or address.
              </p>
            </div>
          </div>
        </div>

        <ToursPageClient
          initialTours={initialTours}
          destinationName="Bali"
          title={seo.h1}
          description={seo.description}
          hideHeader
        />
      </section>

      {/* ── 3. WHAT'S INCLUDED ────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-lime-ink">
              What&apos;s Included
            </span>
          </div>
          <h2 className="font-display text-subheading md:text-heading-sm font-black text-jvto-navy mb-4 max-w-2xl">
            Every Bali package includes —{" "}
            <em className="text-jvto-orange-ink not-italic">in writing.</em>
          </h2>
          <p className="text-jvto-muted text-caption md:text-body-sm max-w-xl mb-12">
            All {initialTours.length} packages include the following. No surprise local payments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {INCLUSIONS_BALI.map((item) => (
              <div
                key={item.label}
                className="flex gap-4 p-5 bg-jvto-off rounded-jvto-md border border-jvto-border card-jvto"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-jvto-lime/20 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-jvto-lime-ink" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-display font-black text-jvto-navy text-caption mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-micro text-jvto-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-jvto-border pt-6">
            <p className="text-micro text-jvto-muted">
              <strong className="text-jvto-navy font-semibold">Not included:</strong>{" "}
              flights, tips, personal expenses, travel insurance, Indonesian VISA (if applicable).
            </p>
            <p className="text-micro text-jvto-muted">
              <strong className="text-jvto-navy font-semibold">End point note:</strong>{" "}
              Three of four Bali packages finish in Surabaya — plan onward transport from Surabaya (flights, train, or bus) in advance.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. WHY JVTO ───────────────────────────────── */}
      <section className="py-20 md:py-28 bg-jvto-navy text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, var(--color-jvto-lime) 0%, transparent 50%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-lime">
              Why JVTO
            </span>
          </div>
          <h2 className="font-display text-subheading md:text-heading-sm font-black mb-4 max-w-2xl">
            The facts{" "}
            <em className="text-jvto-orange not-italic">behind the booking.</em>
          </h2>
          <p className="text-white/50 text-caption md:text-body-sm max-w-xl mb-12">
            Every claim below is documented and verifiable. No marketing language — just the record.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_ITEMS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-largecards p-6 hover:bg-white/8 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-jvto-orange/15 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-jvto-orange" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-black text-white text-caption mb-3">
                  {title}
                </h3>
                <p className="text-micro text-white/50">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. BOOKING CTA ────────────────────────────── */}
      <section className="py-20 md:py-28 bg-jvto-off">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — steps */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
                <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-lime-ink">
                  Book Direct
                </span>
              </div>
              <h2 className="font-display text-subheading md:text-heading-sm font-black text-jvto-navy mb-4">
                Book direct —{" "}
                <em className="text-jvto-orange-ink not-italic">no agency fees.</em>
              </h2>
              <p className="text-jvto-muted text-caption md:text-body-sm mb-10">
                Deposit 20%. Balance by card (5 days before) or bank wire / Wise (3 days before).
                Cancellation ≥ 48h before Day 1 → 100% converted to Lifetime Travel Credit.
              </p>

              <div className="space-y-4 mb-10">
                {BOOKING_STEPS.map(({ step, text }) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-jvto-navy flex items-center justify-center">
                      <span className="text-micro font-semibold text-white font-mono">{step}</span>
                    </div>
                    <p className="text-caption text-jvto-muted pt-2">{text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/6282244788833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-micro uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
                  style={{ boxShadow: "var(--shadow-jvto-orange)" }}
                >
                  WhatsApp Us
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/tours"
                  prefetch={false}
                  className="inline-flex items-center gap-2 border border-jvto-navy/30 text-jvto-navy px-8 py-4 font-bold text-micro uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy hover:text-white transition-colors"
                >
                  Browse All Tours
                </Link>
              </div>
            </div>

            {/* Right — trust signals */}
            <div className="bg-white rounded-largecards border border-jvto-border p-8 card-jvto">
              <h3 className="font-display font-black text-jvto-navy text-caption mb-6 uppercase tracking-[0.15em]">
                Check us before you book
              </h3>
              <div className="space-y-4 mb-8">
                {trustSignals.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-jvto-border last:border-0">
                    <span className="text-micro text-jvto-muted font-semibold uppercase tracking-[0.1em]">{label}</span>
                    <span className="text-micro text-jvto-navy font-bold text-right">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-micro text-jvto-muted border-t border-jvto-border pt-5">
                JVTO does not ask for CVV codes, OTP codes, or online banking passwords via chat or email.
                Pay only via the official JVTO website or confirmed WhatsApp{" "}
                <strong className="text-jvto-navy">+62 822 4478 8833</strong>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
