import { getDocsByGroup } from "@/lib/data-loader";
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import Image from "next/image";
import Link from "@/components/website/AppLink";

export const revalidate = 86400;

const BASE_URL = "https://javavolcano-touroperator.com";

const fallbackSeo = {
  title: "JVTO History Artifacts — Documented Origins Since 2015",
  h1: "History Artifacts: Documented Origins Since 2015",
  description:
    "Historical records and artifacts documenting JVTO's operational continuity from the 2015 guesthouse era through PT incorporation.",
};

const HISTORY_TIMELINE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${BASE_URL}/verify-jvto/history-artifacts#timeline`,
  name: "JVTO Operational History Timeline",
  description:
    "Documented history of Java Volcano Tour Operator from 2015 guesthouse era through PT incorporation and current operations.",
  itemListOrder: "ItemListOrderAscending",
  numberOfItems: 5,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2015-booking`,
        name: "Booking.com Guest Review Award 2015",
        startDate: "2015",
        description:
          "Independent guest review award (score 9.4/10) issued by Booking.com to the guesthouse operated at Jl. Khairil Anwar 102A, Bondowoso — earliest independently-verified signal of JVTO operations.",
        organizer: {
          "@type": "Organization",
          name: "Booking.com",
          url: "https://www.booking.com",
        },
        about: { "@id": `${BASE_URL}/#organization` },
        image: [
          `${BASE_URL}/history/booking-2015-plaque.jpg`,
          `${BASE_URL}/history/booking-2015-shipping-label.jpg`,
        ],
        location: {
          "@type": "Place",
          name: "Jl. Khairil Anwar 102A, Bondowoso",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. Khairil Anwar No. 102A",
            addressLocality: "Bondowoso",
            addressRegion: "East Java",
            addressCountry: "ID",
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2016-stefan-loose`,
        name: "Stefan Loose European Travel Guide — First Editorial Mention",
        startDate: "2016",
        description:
          "Earliest independent editorial citation of the founder as operator for Ijen tours, appearing in a European travel guide — pre-digital third-party corroboration that predates social media review platforms.",
        about: { "@id": `${BASE_URL}/#organization` },
        image: [
          `${BASE_URL}/history/stefan-loose-ijen-bondowoso-page.png`,
          `${BASE_URL}/history/stefan_loose_crop_enh.jpg`,
          `${BASE_URL}/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg`,
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2021-detik`,
        name: "Detik.com National Press Coverage — Tourist Police Context",
        startDate: "2021-03-14",
        description:
          "National-reach Indonesian press article identifying the founder by rank (Bripka Agung Sambuko) in his Tourist Police capacity — independently confirming the police-led model JVTO is built on.",
        about: { "@id": `${BASE_URL}/#organization` },
        mentions: [{ "@id": `${BASE_URL}/#agung-sambuko` }],
        url: "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-2023-pt`,
        name: "PT Java Volcano Rendezvous Incorporated",
        startDate: "2023-02",
        description:
          "Formal PT incorporation: NIB 1102230032918 registered via OSS Indonesia and TDUP (tourism business license) issued by Kementerian Pariwisata dan Ekonomi Kreatif.",
        about: { "@id": `${BASE_URL}/#organization` },
        url: "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Event",
        "@id": `${BASE_URL}/verify-jvto/history-artifacts#event-today-active`,
        name: "Active Licensed Operator — Police-Led",
        description:
          "PT Java Volcano Rendezvous operates today under NIB + TDUP (No. 1102230032918), HPWKI certified guides, ISIC Provider 259268, and INDECON Spotlight membership — all verifiable via public registries.",
        about: { "@id": `${BASE_URL}/#organization` },
        mentions: [{ "@id": `${BASE_URL}/#agung-sambuko` }],
      },
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function HistoryArtifactsPage() {
  const seo = await getEcosystemPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  const docs = await getDocsByGroup("historyArtifacts");
  const faqResolution = await resolveFaqsForPage("/verify-jvto/history-artifacts");
  const faqResolvedNode = buildResolvedFaqSchema(faqResolution, "/verify-jvto/history-artifacts");

  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/verify-jvto/history-artifacts",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  const NAV_LINKS = [
    { href: "/verify-jvto", label: "Proof library overview", active: false },
    { href: "/verify-jvto/legal", label: "Legal Identity", active: false },
    { href: "/verify-jvto/history-artifacts", label: "History & Artifacts", active: true },
    { href: "/verify-jvto/press-recognition", label: "Press & Recognition", active: false },
    { href: "/verify-jvto/police-safety", label: "Police & Safety", active: false },
  ];

  const TIMELINE = [
    { year: "'15", h4: "2015", p: "Ijen Bondowoso Homestay opens on Jl. Khairil Anwar No.102. Booking.com guest score 9.4/10; award shipped to the Bondowoso address." },
    { year: "'16", h4: "2016", p: "PT Java Volcano Rendezvous incorporated 2016-01-01 at the same address." },
    { year: "'18", h4: "2018", p: "Stefan Loose Reiseführer Indonesien (4th ed., ISBN 978-3-7701-7881-0, p. 287) names \"Agung\" as operator." },
    { year: "'21", h4: "2021", p: "Independent press: Detik.com (2021-03-14) and Radar Jember (2021-03-24) name Bripka Agung Sambuko in Tourist Police duties." },
    { year: "'23", h4: "2023", p: "TDUP formalized 2023-02-11. NIB 1102230032918 OSS-verifiable." },
    { year: "'26", h4: "2026", p: "16 private itineraries; a 14-person named crew (11 KTA-confirmed); coordinated Ijen health screening with a licensed physician." },
  ] as const;

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          buildVerifySubpageSchema({
            pathname: "/verify-jvto/history-artifacts",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          HISTORY_TIMELINE_SCHEMA,
          faqResolvedNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jvto-navy via-jvto-navy/95 to-[#1a2f45] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/verify-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Verify JVTO</Link>
            <span>›</span>
            <span className="text-white/70">History &amp; Artifacts</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Audit · History</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">PROOF / HISTORY</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-6" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}>
                History &amp; <em className="not-italic text-jvto-orange">artifacts.</em>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[52ch]">
                Operational continuity since 2015, documented through archived web snapshots and dated press references.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Earliest record", value: "2015" },
                { label: "Web snapshots", value: "27+" },
                { label: "Press references", value: "8" },
                { label: "Audit trail", value: "Wayback Machine" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className="font-semibold text-sm text-right text-white">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Article section ───────────────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            {/* Sidebar */}
            <aside className="flex flex-col">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-4">Verify JVTO</span>
              <ul style={{ borderTop: "1px solid #E3E0DA" }}>
                {NAV_LINKS.map(({ href, label, active }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      prefetch={false}
                      className={`block py-2.5 text-[14px] transition-colors ${
                        active ? "text-jvto-navy font-semibold" : "text-[#6b7280] hover:text-jvto-navy"
                      }`}
                      style={{ borderBottom: "1px solid #E3E0DA" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/tours" prefetch={false} className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors">
                Browse tours →
              </Link>
            </aside>

            {/* Article */}
            <article className="bg-white rounded-2xl p-8 md:p-10">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-5">Audit record · HIST-001</span>
              <p className="text-[17px] text-[#374151] font-light leading-relaxed mb-8">
                JVTO is not a new operator. We have a documented operational history dating to 2015, with public web archives that anyone can audit.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-6 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Operational timeline</h2>
              <ol className="mb-10" style={{ maxWidth: "none" }}>
                {TIMELINE.map(({ year, h4, p }) => (
                  <li key={year} className="flex gap-6" style={{ borderTop: "1px solid #E3E0DA", padding: "1.25rem 0" }}>
                    <div className="font-mono text-[12px] font-black text-jvto-orange flex-shrink-0 w-8 mt-0.5">{year}</div>
                    <div>
                      <h4 className="font-semibold text-jvto-navy text-[15px] mb-1">{h4}</h4>
                      <p className="text-[14px] text-[#6b7280] font-light leading-relaxed">{p}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Recognition artifacts</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Two pieces of dated, third-party recognition bracket the guesthouse-to-PT transition — both tied to the same Bondowoso address.
              </p>
              <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid #E3E0DA" }}>
                {[
                  { k: "Booking.com Guest Review Award", v: "9.4 / 10 · 2015" },
                  { k: "Awarded to", v: "Ijen Bondowoso Homestay" },
                  { k: "Stefan Loose Reiseführer", v: "4th ed. · 2018 · p. 287" },
                  { k: "ISBN", v: "978-3-7701-7881-0" },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center px-4 py-3" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9ca3af]">{k}</span>
                    <span className="text-[14px] font-medium text-jvto-navy text-right">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-6">
                The 2015 Booking.com award was shipped to <strong className="text-jvto-navy font-semibold">"Agung, Jl. Khairil Anwar No.102, Bondowoso"</strong> — the same address line as today's PT office. That shipping label is the continuity anchor: it places the founder, the name, and the address together a full year before PT Java Volcano Rendezvous was incorporated. The Stefan Loose guidebook then names "Agung" as the operator of Ijen Bondowoso Homestay, confirming an international reputation in print well before any social media existed. Both artifacts are catalogued on the <Link href="/verify-jvto/press-recognition" prefetch={false} className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">Press &amp; Recognition page</Link>.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { src: "/history/booking-2015-plaque.jpg", alt: "Booking.com Guest Review Award 2015 plaque — Ijen Bondowoso Homestay" },
                  { src: "/history/booking-2015-shipping-label.jpg", alt: "Booking.com award shipping label addressed to Agung, Jl. Khairil Anwar No.102, Bondowoso" },
                  { src: "/history/stefan_loose_crop_enh.jpg", alt: "Stefan Loose Reiseführer Indonesien — Agung / Ijen Bondowoso Homestay entry" },
                  { src: "/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg", alt: "Mr. Sam with guests at Ijen Bondowoso Homestay" },
                ].map(({ src, alt }) => (
                  <div key={src} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F5F2]" style={{ border: "1px solid #E3E0DA" }}>
                    <Image src={src} alt={alt} fill unoptimized className="object-cover object-top" sizes="(max-width: 640px) 50vw, 33vw" />
                  </div>
                ))}
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Independent web archive</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                The Wayback Machine (web.archive.org) holds 27+ snapshots of <strong className="text-jvto-navy font-semibold">javavolcano-touroperator.com</strong> dating from 2016 forward. Anyone can audit:
              </p>
              <ul className="space-y-2 mb-8 pl-5 list-disc marker:text-jvto-orange">
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Domain age and continuity</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Founder name consistency</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Address consistency</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">NIB displayed after 2016 incorporation</li>
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What this rules out</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed">
                The Wayback footprint rules out the "scammer registered a domain last month" pattern. Anyone running a years-long operation under one name, at one address, with one founder, is publicly auditable. Anyone who isn't, isn't.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.25)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="font-black text-white leading-[1.02] mb-8" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            Ready for operational <span className="text-jvto-orange">certainty?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours" prefetch={false} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors">
              Explore tours
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/verify-jvto" prefetch={false} className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors">
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
