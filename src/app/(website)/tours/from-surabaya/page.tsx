import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
import Link from "@/components/website/AppLink";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import {
  buildToursHubFaqSchema,
  buildToursHubAggregateRatingSchema,
} from "@/lib/schemas/buildToursHubSchemas";
import { formatIDR } from "@/utils/formatting";
import { ArrowRight, Shield, Users, FileText, Award, Check } from "lucide-react";

export const revalidate = 3600;

const DISPLAY_FONT = { fontFamily: "Raleway, Inter, sans-serif" };

const fallbackSeo = {
  title: "Bromo Ijen Tour from Surabaya — 12 Private Packages | JVTO",
  h1: "Private Volcano Tours from Surabaya",
  description:
    "Private 2D–6D Bromo, Ijen & Tumpak Sewu tours from Surabaya. Tourist Police-led, all-inclusive. 4.8★ Trustpilot. From IDR 1.55M/pax.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours/from-surabaya", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getToursFromSurabaya(): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: 4, categoryId: 1 });
}

const INCLUSIONS = [
  { label: "Private transport", detail: "AC MPV (1–3 guests) or Toyota Hiace (4–9 guests). Fuel, tolls, and parking included." },
  { label: "Dedicated crew", detail: "English-speaking driver-guide (1–3 guests), or professional driver + escort guide (4+). Licensed local site guides at key locations." },
  { label: "Entrance fees & permits", detail: "All attractions on the itinerary — no surprise gate payments." },
  { label: "Accommodation + breakfast", detail: "All overnight packages, per itinerary." },
  { label: "Private 4WD jeep", detail: "Bromo crater area. One jeep per ≤4 guests; additional jeeps arranged for larger groups." },
  { label: "Gas masks & trekking poles", detail: "On Ijen-inclusive packages, plus mandatory health-certificate screening coordination for every guest before crater entry." },
  { label: "Daily mineral water & pick-up", detail: "Full pick-up to drop-off assistance from your Surabaya hotel or address." },
  { label: "JVTO travel T-shirt", detail: "One per participant." },
];

const WHY_ITEMS = [
  {
    Icon: Shield,
    title: "Police-Led Operations",
    body: "Mr. Sam holds the rank of Bripka and serves as an active officer of Ditpamobvit East Java (Tourist Police). Independent national press — Detik.com, 2021-03-14 — confirms active-duty status. No other tour operator in East Java is led by a serving Tourist Police officer.",
  },
  {
    Icon: Users,
    title: "100% Private — No Shared Groups",
    body: "Your booking receives a dedicated vehicle and crew. No join-in option exists. Group size determines vehicle type (MPV or Hiace); timing and route decisions apply to your group only.",
  },
  {
    Icon: FileText,
    title: "All-Inclusive — Written Before You Book",
    body: "Inclusions and exclusions are published on every package page and confirmed in your voucher. The voucher is the booking reference. Mid-trip negotiations over ticket costs, fuel, or meals do not occur on JVTO routes.",
  },
  {
    Icon: Award,
    title: "Verifiable Credentials",
    body: "NIB 1102230032918 is verifiable via the Indonesian OSS system. HPWKI membership is registered under AHU-0001072.AH.01.07.TAHUN 2024. BBKSDA clearance and POLPAR authorisation are on file, and Dr. Ahmad Irwandanu holds a valid SIP license (Kemenkes/KKI verifiable).",
  },
];

const BOOKING_STEPS = [
  { step: "01", title: "Message us", text: "WhatsApp +62 822 4478 8833 with your dates, group size, and preferred package." },
  { step: "02", title: "Get a price confirmation", text: "You receive a per-person price per the table for your group size — no hidden local payments." },
  { step: "03", title: "Pay a 20% deposit", text: "Confirm the booking with a 20% deposit via secure JVTO checkout (card only)." },
  { step: "04", title: "Receive your e-voucher", text: "Full trip details plus a pre-trip guide. The voucher is your binding booking reference." },
];

const DATA_BOX = [
  { k: "Deposit", v: "20% of total · card only" },
  { k: "Balance deadline", v: "Card 5 days before · wire/Wise 3 days before Day 1" },
  { k: "Cancel ≥ 48h before", v: "100% → Lifetime Package Credit (no expiry, transferable)" },
  { k: "Cancel < 48h before", v: "Forfeited · no Package Credit" },
];

const CHECK_US_SIGNALS = [
  { signal: "Trustpilot 4.8 / 5 · 51 reviews", source: "Independent — verified 2026-05-09" },
  { signal: "Google Maps 4.90 / 5 · 123 reviews", source: "Independent" },
  { signal: "TripAdvisor 4.95 / 5 · 21 reviews", source: "Independent" },
  { signal: "NIB 1102230032918", source: "OSS-verifiable at oss.go.id" },
  { signal: "Founder: active Tourist Police officer", source: "Detik.com press record, 2021" },
  { signal: "ISIC Student Tours", source: "Provider ID 259268 — isic.org verifiable" },
  { signal: "Founded 2015", source: "Booking.com 2015 award · Stefan Loose 2018, p. 287" },
];

export default async function ToursPageSurabaya() {
  const [seo, initialTours, org] = await Promise.all([
    getPageSeo("/tours/from-surabaya", fallbackSeo),
    getToursFromSurabaya(),
    getOrganizationProfile(),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pageUrl = `${siteUrl}/tours/from-surabaya`;
  const orgNode = buildOrganizationJsonLd(org as any, siteUrl);
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#collection` },
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
          { "@type": "ListItem", position: 2, name: "Tours From Surabaya", item: pageUrl },
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
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: "from-surabaya" });

  const days = initialTours.map((t) => t.duration.day);
  const durationRange = days.length > 0
    ? (Math.min(...days) === Math.max(...days) ? `${Math.min(...days)} days` : `${Math.min(...days)}–${Math.max(...days)} days`)
    : "—";
  const startingFrom = initialTours.length > 0 ? Math.min(...initialTours.map((t) => t.startFrom)) : 0;

  return (
    <>
      <StructuredData data={schema} />
      <StructuredData data={hubFaqSchema} />
      <StructuredData data={hubAggregateRatingSchema} />

      {/* ── 1. HERO ───────────────────────────────────── */}
      <section className="bg-jvto-navy text-white pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--color-jvto-lime) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime">
                  Departure hub · Surabaya
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 max-w-3xl"
                style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
              >
                Tours from <em className="text-jvto-orange not-italic italic">Surabaya.</em>
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-2xl mb-8 leading-relaxed font-light">
                {initialTours.length} private packages to Kawah Ijen, Mount Bromo, Tumpak Sewu &amp; Madakaripura.
                Your own vehicle, your own crew — led by an active Tourist Police officer.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {["NIB 1102230032918", "Trustpilot 4.8/5 · 51 reviews", "Founded 2015"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60 uppercase tracking-[0.1em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#packages"
                  prefetch={false}
                  className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
                  style={{ boxShadow: "var(--shadow-jvto-orange)" }}
                >
                  Browse {initialTours.length} Packages
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify-jvto"
                  prefetch={false}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
                >
                  Verify JVTO
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-1">
              {[
                ["Hub", "Surabaya"],
                ["Private packages", String(initialTours.length)],
                ["Duration range", durationRange],
                ["From / person", formatIDR(startingFrom)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3.5 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65"
                >
                  <span>{label}</span>
                  <strong className="text-white font-semibold normal-case tracking-normal text-sm">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHY START FROM SURABAYA ─────────────────── */}
      <section className="bg-jvto-off py-20 md:py-24 rounded-t-[48px] -mt-8 relative z-10 shadow-[0_-32px_80px_-36px_rgba(13,27,42,0.10)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 01</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Why start from <em className="text-jvto-orange not-italic">Surabaya?</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Hub overview</span>
          </div>
          <div className="max-w-[70ch] space-y-5">
            <p className="text-jvto-muted text-base md:text-lg leading-relaxed font-light">
              Every JVTO tour from Surabaya is 100% private — your group, your vehicle, your schedule. Mr.
              Sam, the founder, is an active officer of the Indonesian Tourist Police (Ditpamobvit East
              Java): every route, safety decision, and written rule traces back to someone who answers to
              police protocol.
            </p>
            <p className="text-jvto-muted text-base md:text-lg leading-relaxed font-light">
              What&apos;s included is written before you book. What it costs is confirmed before you pay.
              Surabaya&apos;s Juanda Airport is the natural entry point for East Java — Bromo is reachable in
              around 4 hours via Probolinggo, and Ijen via the Surabaya–Banyuwangi corridor.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. PACKAGES ───────────────────────────────── */}
      <section id="packages" className="bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 02</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              {initialTours.length} private tours <em className="text-jvto-orange not-italic">from Surabaya.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">{durationRange}</span>
          </div>
          <p className="text-jvto-muted text-sm md:text-base max-w-2xl leading-relaxed">
            All packages include a dedicated vehicle, English-speaking crew, entrance fees, accommodation +
            breakfast, mineral water, and a JVTO T-shirt. Price is per person and scales down with group size
            — no hidden local payments.
          </p>
        </div>

        <ToursPageClient
          initialTours={initialTours}
          destinationName="Surabaya"
          title={seo.h1}
          description={seo.description}
          hideHeader
        />
      </section>

      {/* ── 4. WHAT'S INCLUDED ────────────────────────── */}
      <section className="bg-jvto-off py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 03</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Every package <em className="text-jvto-orange not-italic">includes — in writing.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">No surprise local payments</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ul className="space-y-4">
              {INCLUSIONS.map((item) => (
                <li key={item.label} className="grid grid-cols-[22px_1fr] gap-4 items-start">
                  <Check className="w-5 h-5 text-jvto-lime mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm text-jvto-navy leading-relaxed">
                    <strong className="font-semibold">{item.label}.</strong>{" "}
                    <span className="text-jvto-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <div className="bg-white border border-jvto-border rounded-[24px] p-8">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-jvto-muted mb-4">Not included</span>
                <ul className="flex flex-wrap gap-2.5">
                  {["Flights", "Tips", "Personal expenses", "Travel insurance", "Indonesian visa (if applicable)"].map((x) => (
                    <li key={x} className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-jvto-muted border border-jvto-border rounded-full px-3.5 py-2 bg-jvto-off">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 border border-jvto-lime/50 rounded-[16px] p-5 bg-jvto-lime/[0.07] text-sm text-jvto-navy leading-relaxed">
                <strong className="font-bold">Written before you book.</strong> Inclusions and exclusions are
                published on every package page and confirmed in your voucher. The voucher is the booking
                reference — mid-trip negotiations over ticket costs, fuel, or meals do not occur on JVTO routes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WHY JVTO ───────────────────────────────── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-jvto-muted/70">§ 04</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              The facts behind <em className="text-jvto-orange not-italic">the booking.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Why JVTO</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHY_ITEMS.map(({ Icon, title, body }) => (
              <div key={title} className="bg-jvto-off border border-jvto-border rounded-[24px] p-8 card-jvto">
                <Icon className="w-6 h-6 text-jvto-orange mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-black text-jvto-navy mb-3" style={DISPLAY_FONT}>{title}</h3>
                <p className="text-sm text-jvto-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CHECK US BEFORE YOU BOOK ───────────────── */}
      <section className="bg-jvto-navy text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">§ 05</span>
            <h2
              className="text-3xl md:text-5xl font-black leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Check us <em className="text-jvto-orange not-italic">before you book.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Independent signals</span>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 bg-white/[0.04]">Signal</th>
                  <th className="text-left p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 bg-white/[0.04]">Source</th>
                </tr>
              </thead>
              <tbody>
                {CHECK_US_SIGNALS.map((row) => (
                  <tr key={row.signal} className="border-t border-white/10">
                    <td className="p-5 font-mono text-[10px] uppercase tracking-[0.16em] font-bold text-white">{row.signal}</td>
                    <td className="p-5 text-white/60">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/50 text-[13px] max-w-[70ch] mt-6 leading-relaxed font-light">
            JVTO does not ask for CVV codes, OTP codes, or online banking passwords via chat or email. Pay
            only via the official JVTO website, listed bank accounts, or confirmed WhatsApp +62 822 4478 8833.
          </p>
        </div>
      </section>

      {/* ── 7. BOOKING CTA ────────────────────────────── */}
      <section className="py-20 md:py-24 bg-jvto-off">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 06</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Book direct — <em className="text-jvto-orange not-italic">no agency fees.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Four steps</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ol className="space-y-0">
              {BOOKING_STEPS.map(({ step, title, text }) => (
                <li key={step} className="grid grid-cols-[auto_1fr] gap-6 items-start py-6 border-b border-jvto-border last:border-0">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-jvto-orange pt-1">{step}</span>
                  <div>
                    <h4 className="text-xl font-black text-jvto-navy mb-1" style={DISPLAY_FONT}>{title}</h4>
                    <p className="text-jvto-muted text-sm font-light leading-relaxed">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white border border-jvto-border rounded-[24px] p-9">
                {DATA_BOX.map(({ k, v }) => (
                  <div key={k}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-jvto-muted mb-1">{k}</div>
                    <div className="text-jvto-navy font-semibold text-sm leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 border border-jvto-border rounded-[16px] p-5 bg-white text-sm text-jvto-navy leading-relaxed">
                <strong className="font-bold">Student pricing</strong> is available for verified ISIC
                cardholders (Provider ID 259268). Ask at booking, or see{" "}
                <Link href="/isic/student-package" prefetch={false} className="text-jvto-orange font-semibold hover:underline">
                  student packages →
                </Link>
              </div>
              <div className="mt-4 border border-jvto-border rounded-[16px] p-5 bg-white text-sm text-jvto-navy leading-relaxed">
                <strong className="font-bold">Group incentive</strong> (direct bookings only): 18 paying
                guests → 1 free place · 35 paying → 2 free places · 50 paying → 3 free places + 5% group discount.
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/6282244788833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
                  style={{ boxShadow: "var(--shadow-jvto-orange)" }}
                >
                  WhatsApp Us
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/tours"
                  prefetch={false}
                  className="inline-flex items-center gap-2 border border-jvto-navy/30 text-jvto-navy px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy hover:text-white transition-colors"
                >
                  Browse All Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. CTA ─────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-24 text-center rounded-t-[48px] -mt-8 relative z-10 shadow-[0_-40px_90px_-40px_rgba(0,0,0,0.45)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2
            className="text-4xl md:text-6xl font-black leading-tight mb-10"
            style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
          >
            Plan your <em className="text-jvto-orange not-italic">trip from Surabaya.</em>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/6282244788833"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jvto-orange text-white px-9 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              Contact the team
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center gap-2 border border-white/20 text-white px-9 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
            >
              View all routes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
