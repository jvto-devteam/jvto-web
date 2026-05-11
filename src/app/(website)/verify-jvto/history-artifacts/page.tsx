import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import Image from "next/image";
import { ExternalLink, CheckCircle2 } from "lucide-react";

export const revalidate = 86400;

const BASE_URL = "https://javavolcano-touroperator.com";

const fallbackSeo = {
  title: "Verify: History Artifacts",
  h1: "History Artifacts: Documented Origins Since 2015",
  description:
    "Historical records and artifacts documenting JVTO's operational continuity from the 2015 guesthouse era through PT incorporation.",
};

// ── Timeline ItemList schema — 5 anchors ──────────────────────────────────────
// Per cluster_role_contracts.md Cluster 4 /history-artifacts MH:
// Timeline ItemList with Event per anchor — entity age + longevity signal for AEO.
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
        image: `${BASE_URL}/history/booking-2015-plaque.jpg`,
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
        image: `${BASE_URL}/history/stefan-loose-ijen-bondowoso-page.png`,
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

// ── Timeline display data (HTML only — not schema) ────────────────────────────

const TIMELINE_ENTRIES = [
  {
    year: "2015",
    event: "Booking.com Guest Review Award",
    detail:
      "Score 9.4/10 — independently calculated by Booking.com. Issued to the guesthouse at Jl. Khairil Anwar 102A, Bondowoso. Physical plaque and award letter retained on-site.",
    imageSrc: `${BASE_URL}/history/booking-2015-plaque.jpg`,
    imageAlt: "Booking.com Guest Review Award 2015 plaque",
    verifyHref: null,
    verifyLabel: null,
  },
  {
    year: "2016",
    event: "Stefan Loose Travel Guide — First Mention",
    detail:
      "Earliest European travel guide editorial citation naming the founder as operator for Ijen crater tours. Pre-digital corroboration from an independent editorial source.",
    imageSrc: `${BASE_URL}/history/stefan-loose-ijen-bondowoso-page.png`,
    imageAlt: "Stefan Loose travel guide page mentioning Ijen, Bondowoso",
    verifyHref: null,
    verifyLabel: null,
  },
  {
    year: "2021",
    event: "Detik.com Press Article",
    detail:
      '"Suka Duka Polisi Pariwisata Bondowoso" — national-reach press coverage identifying the founder (Bripka Agung Sambuko) in his Tourist Police role, independently confirming the police-led model.',
    imageSrc: null,
    imageAlt: null,
    verifyHref:
      "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin",
    verifyLabel: "Read article on Detik.com",
  },
  {
    year: "2023",
    event: "PT Java Volcano Rendezvous Incorporated",
    detail:
      "Formal business incorporation: NIB 1102230032918 registered via OSS Indonesia (February 2023). TDUP tourism license issued by Ministry of Tourism. All registrations publicly verifiable.",
    imageSrc: null,
    imageAlt: null,
    verifyHref:
      "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==",
    verifyLabel: "Verify PT on AHU registry",
  },
  {
    year: "Today",
    event: "Active Licensed Operator",
    detail:
      "PT Java Volcano Rendezvous operates under NIB + TDUP No. 1102230032918, HPWKI-certified guides, ISIC Provider ID 259268, and INDECON Spotlight membership. Led by an active Tourist Police officer.",
    imageSrc: null,
    imageAlt: null,
    verifyHref: "/verify-jvto/legal",
    verifyLabel: "See full credential verification",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function HistoryArtifactsPage() {
  const seo = await getPageSeo("/verify-jvto/history-artifacts", fallbackSeo);
  const docs = getDocsByGroup("historyArtifacts");

  // FAQ resolver: no narrative_claims + no canonical registered for this route
  // → falls through to CMS content.faq (3 items) → suppressCmsFaq stays false.
  const faqResolution = await resolveFaqsForPage("/verify-jvto/history-artifacts");
  const faqResolvedNode = buildResolvedFaqSchema(
    faqResolution,
    "/verify-jvto/history-artifacts"
  );

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
          // Timeline ItemList — 5 Event anchors (MH per cluster_role_contracts.md Cluster 4)
          HISTORY_TIMELINE_SCHEMA,
          // CMS FAQ resolver (3 items from content_pages.content.faq)
          faqResolvedNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <VerifyJvtoClient
        initialDocs={docs}
        groupTitle={seo.h1}
        heroTitle={seo.h1}
        heroDescription={seo.description}
      />

      {/* ── Documented History Timeline ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-14">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-10">
            Operational Continuity — Artifact-Anchored Timeline
          </p>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[72px] top-0 bottom-0 w-px bg-slate-800 hidden md:block"
              aria-hidden
            />

            <div className="space-y-10">
              {TIMELINE_ENTRIES.map((entry, i) => (
                <div key={entry.year} className="flex gap-6 md:gap-10 items-start">
                  {/* Year badge */}
                  <div className="shrink-0 w-[72px] flex flex-col items-center md:items-end">
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-sm leading-none ${
                        entry.year === "Today"
                          ? "text-white bg-jvto-green text-black"
                          : "text-jvto-green bg-jvto-green/10"
                      }`}
                    >
                      {entry.year}
                    </span>
                    {/* Connector dot */}
                    <div className="hidden md:block w-2 h-2 rounded-full bg-slate-700 mt-3 mr-[-5px] self-end border border-slate-600" />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden">
                    {/* Image (if available) */}
                    {entry.imageSrc && (
                      <div className="relative h-40 w-full bg-slate-950">
                        <Image
                          src={entry.imageSrc}
                          alt={entry.imageAlt ?? entry.event}
                          fill
                          className="object-cover object-center opacity-80"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="text-white font-bold text-sm mb-2">
                        {entry.event}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        {entry.detail}
                      </p>
                      {entry.verifyHref && entry.verifyLabel && (
                        <a
                          href={entry.verifyHref}
                          target={entry.verifyHref.startsWith("http") ? "_blank" : undefined}
                          rel={
                            entry.verifyHref.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
                        >
                          {entry.verifyLabel}
                          {entry.verifyHref.startsWith("http") && (
                            <ExternalLink size={10} />
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Continuity Note ── */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-10">
          <div className="flex items-start gap-4 max-w-2xl">
            <CheckCircle2 size={18} className="text-jvto-green shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 text-sm font-semibold mb-1">
                Same address. Same founder. Same operation.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                The Booking.com award (2015), the travel guide mention (2016), the press
                article (2021), and the PT registration (2023) all reference the same
                location — Jl. Khairil Anwar 102A, Bondowoso — and the same person,
                Agung Sambuko. Continuity is observable, not just claimed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
