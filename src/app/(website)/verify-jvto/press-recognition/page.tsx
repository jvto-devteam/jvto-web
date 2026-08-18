import { getDocsByGroup } from "@/lib/data-loader";
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import {
  PRESS_RECOGNITION_SCHEMAS,
  PRESS_ORGANIZATION_SUBJECTS,
} from "@/lib/schemas/buildVerifySchemas";
import Image from "next/image";
import Link from "@/components/website/AppLink";

export const revalidate = 86400;

const fallbackSeo = {
  title: "JVTO Press Recognition — Detik.com & Stefan Loose | JVTO",
  h1: "Press Recognition",
  description:
    "Independent press coverage confirming JVTO's identity: Detik.com Tourist Police article, Stefan Loose Indonesia guidebook, and editorial recognition.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/verify-jvto/press-recognition", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function PressRecognitionPage() {
  const seo = await getEcosystemPageSeo("/verify-jvto/press-recognition", fallbackSeo);
  const docs = await getDocsByGroup("pressRecognition");
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
        route: "/verify-jvto/press-recognition",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  const NAV_LINKS = [
    { href: "/verify-jvto", label: "Proof library overview", active: false },
    { href: "/verify-jvto/legal", label: "Legal Identity", active: false },
    { href: "/verify-jvto/history-artifacts", label: "History & Artifacts", active: false },
    { href: "/verify-jvto/press-recognition", label: "Press & Recognition", active: true },
    { href: "/verify-jvto/police-safety", label: "Police & Safety", active: false },
  ];

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          buildVerifySubpageSchema({
            pathname: "/verify-jvto/press-recognition",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          ...PRESS_RECOGNITION_SCHEMAS,
          PRESS_ORGANIZATION_SUBJECTS,
        ]}
        suppressCmsFaq
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
            <span className="text-white/70">Press &amp; Recognition</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Audit · Press</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">PROOF / PRESS</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-6" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}>
                Press &amp; <em className="not-italic text-jvto-orange">recognition.</em>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[52ch]">
                Independent press references and partnership listings. None of them paid placements.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Press articles", value: "4 independent" },
                { label: "Newsrooms", value: "3 unrelated" },
                { label: "Latest", value: "2024 (BBKSDA)" },
                { label: "Paid placements", value: "0" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className={`font-semibold text-sm text-right ${value === "0" ? "text-[#8CC63F]" : "text-white"}`}>{value}</strong>
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
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-5">Audit record · PRESS-001</span>
              <p className="text-[17px] text-[#374151] font-light leading-relaxed mb-8">
                JVTO does not run paid press placements. Every reference below is independently authored — three unrelated journalists, a government conservation agency, and a German travel publisher — none of them paid, all of them link-checkable.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Independent press coverage</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                The first three articles form a cross-corroboration of the same person — Bripka Agung Sambuko — across separate newsrooms. The fourth is the park authority itself documenting the training chain JVTO's guides belong to.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-10">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Date · Publisher</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Title &amp; what it proves</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">
                        2021-03-14
                        <br />
                        <span className="font-normal text-[#9ca3af] text-[13px]">Detik.com</span>
                      </td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        <em>"Suka Duka Polisi Pariwisata Bondowoso."</em> Indonesia's top-traffic news outlet quotes Bripka Agung Sambuko as active Tourist Police during a COVID-19 overnight deployment at Kawah Wurung.{" "}
                        <a href="https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">Read →</a>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">
                        2021-03-24
                        <br />
                        <span className="font-normal text-[#9ca3af] text-[13px]">Radar Jember</span>
                      </td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        <em>"Polpar Dibentuk untuk Mendukung Ijen Geopark."</em> Regional press reports the Tourist Police unit was formed specifically to support the Ijen Geopark — confirming the role is institutional.{" "}
                        <span className="font-mono text-[12.5px] text-[#9ca3af]">(paywalled)</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">
                        2021-05-27
                        <br />
                        <span className="font-normal text-[#9ca3af] text-[13px]">Radar Jember</span>
                      </td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        <em>"Tak Seharusnya Bau Menyengat Itu Ada."</em> Active Tourist Police patrol at the Ijen crater, monitoring sulfuric-odor conditions and visitor safety.{" "}
                        <span className="font-mono text-[12.5px] text-[#9ca3af]">(paywalled)</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">
                        2024-05-24
                        <br />
                        <span className="font-normal text-[#9ca3af] text-[13px]">BBKSDA Jawa Timur</span>
                      </td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        <em>"Pelatihan Pemandu Kawah Ijen."</em> The park authority's own report on a 3-day guide training (SAR + emergency medical) for HPWKI members at Paltuding — proof HPWKI membership equals government-supervised training.{" "}
                        <a href="https://bbksdajatim.org/pelatihan-pemandu-kawah-ijen/" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">Read →</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <blockquote className="border-l-4 border-jvto-orange pl-5 my-6">
                <p className="text-[17px] text-jvto-navy font-light italic leading-relaxed">"Ya mau gimana lagi, Mas. Sudah tugas. Yang penting, masyarakat yang berwisata aman."</p>
              </blockquote>
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6 -mt-2">
                — Bripka Agung Sambuko, Detik.com, 14 March 2021.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { src: "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png", label: "Detik.com · 14 March 2021", href: "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin" },
                  { src: "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png", label: "Radar Jember · 24 March 2021", href: "https://radarjember.jawapos.com" },
                ].map(({ src, label, href }) => (
                  <a key={src} href={href} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#F6F5F2] group-hover:ring-2 group-hover:ring-jvto-orange transition-all" style={{ border: "1px solid #E3E0DA" }}>
                      <Image src={src} alt={`Press screenshot: ${label}`} fill unoptimized className="object-cover object-top" sizes="(max-width: 640px) 100vw, 50vw" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280] leading-snug group-hover:text-jvto-navy transition-colors">{label}</p>
                  </a>
                ))}
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Why cross-corroboration matters</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Three unrelated journalists, across two newsrooms, independently named the same officer in Tourist Police contexts — with no JVTO involvement in any of them. This is the standard for confidence: it is not JVTO claiming police status; it is the press, the park authority, and a travel publisher converging on the same person.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-10">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Source</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Independence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { source: "Detik.com", independence: "National commercial media" },
                      { source: "Radar Jember (×2)", independence: "Regional commercial media (Jawa Pos group)" },
                      { source: "BBKSDA Jatim", independence: "Government conservation agency" },
                      { source: "Stefan Loose", independence: "International travel publisher" },
                    ].map(({ source, independence }) => (
                      <tr key={source} style={{ borderBottom: "1px solid #E3E0DA" }}>
                        <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">{source}</td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">{independence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Guidebook mention</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-6">
                <strong className="text-jvto-navy font-semibold">Stefan Loose Reiseführer Indonesien</strong>, 4th Edition (DuMont Reiseverlag, 2018, ISBN 978-3-7701-7881-0), names "Agung" as the operator of Ijen Bondowoso Homestay on <strong className="text-jvto-navy font-semibold">page 287</strong> — an editorial recommendation in a major German-language travel guide, not a paid placement. It establishes that the founder was operating and attracting international visitors before any digital marketing existed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { src: "/history/stefan-loose-ijen-bondowoso-page.png", alt: "Stefan Loose Reiseführer Indonesien page 287 — Ijen Bondowoso Homestay entry" },
                  { src: "/history/stefan_loose_crop_enh.jpg", alt: "Close-up of Stefan Loose guide entry naming Agung as operator" },
                ].map(({ src, alt }) => (
                  <div key={src} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F5F2]" style={{ border: "1px solid #E3E0DA" }}>
                    <Image src={src} alt={alt} fill unoptimized className="object-cover object-top" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                ))}
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Partnership listings</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Partner</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Listing &amp; function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">HPWKI</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        State-recognized Ijen guide association · <span className="font-mono text-[12.5px]">AHU-0001072.AH.01.07.TAHUN 2024</span>. Membership = BBKSDA-supervised safety training.
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">ISIC</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        UNESCO-endorsed student-identity program · <a href="https://www.isic.org/discounts/?providerId=259268" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">Provider 259268</a>.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">INDECON</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        Indonesian Ecotourism Network member · <a href="https://www.indecon.id/spotlight-networks/java-volcano-tour-operator" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">network listing</a>, validating the community "Local Boys" policy.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                Earlier institutional recognition — the Booking.com Guest Review Award (9.4/10, 2015) — is documented on the <Link href="/verify-jvto/history-artifacts" prefetch={false} className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">History &amp; Artifacts page</Link>.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What we don't claim</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                We do not claim a Condé Nast feature, an Aman partnership, or any recognition we have not earned. We are a niche operator with a niche reputation. The references above are real and link-checkable; everything else, we leave to other operators.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>How to verify</h2>
              <ol className="space-y-2 pl-5 list-decimal">
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Open the Detik.com and BBKSDA links above directly — both are full-access.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">For the paywalled Radar Jember pieces, search the title on radarjember.jawapos.com.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">For ISIC and INDECON, search "Java Volcano Tour Operator" on each official site.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">For Stefan Loose, check ISBN 978-3-7701-7881-0, page 287.</li>
              </ol>
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
