import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import {
  buildWhyJvtoBreadcrumbSchema,
  buildWhyJvtoWebPageSchema,
} from "@/lib/schemas/buildWhyJvtoSchemas";
import {
  HISTORY_HERITAGE,
  FOUNDER_LEADERSHIP,
  FOUNDER_WITH_GUESTS_STEFAN_LOOSE,
} from "@/lib/imageAssets";
import Sidebar from "../sidebar";

export const revalidate = 3600;

const defaultTitle = "Our Story – JVTO History & Roots Since 2015";
const defaultDescription =
  "Documented JVTO history: Booking.com award 2015, Stefan Loose guidebook 2016, and physical artifacts tracing the operator's roots in Bondowoso, East Java.";
const defaultH1 = "Our Story: Roots & Continuity Since 2015";

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage("/why-jvto/our-story", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? defaultTitle,
    description: seo.description ?? defaultDescription,
    openGraph: {
      title: seo.title ?? defaultTitle,
      description: seo.description ?? defaultDescription,
      url: "https://javavolcano-touroperator.com/why-jvto/our-story",
      images: [{ url: HISTORY_HERITAGE[0].url, alt: HISTORY_HERITAGE[0].alt }],
    },
  };
}

const TIMELINE = [
  {
    year: "2015",
    label: "Booking.com Guest Review Award",
    body: "Ijen Bondowoso Homestay (the operation JVTO grew from) received a Booking.com Guest Review Award with a score of 9.4/10 — third-party recognition of the guest experience standard before PT incorporation.",
    images: [HISTORY_HERITAGE[0], HISTORY_HERITAGE[1]],
  },
  {
    year: "2018",
    label: "Stefan Loose Reiseführer Indonesien — Editorial Citation",
    body: 'The 4th edition of the Stefan Loose German-language travel guide (DuMont Reiseverlag, ISBN 978-3-7701-7881-0) independently names the founder on page 287 in the Ijen Massif section. Non-paid editorial listing predating PT registration.',
    images: [HISTORY_HERITAGE[3], HISTORY_HERITAGE[4]],
    extra: FOUNDER_WITH_GUESTS_STEFAN_LOOSE,
  },
  {
    year: "2021",
    label: "National Press — Detik.com & Radar Jember",
    body: 'Two national-reach press articles independently identify Agung Sambuko by rank (Bripka) in the Tourist Police operational context. Third-party editorial confirmation, separate from any JVTO marketing.',
    links: [
      { label: "Detik.com article", href: "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin" },
      { label: "Radar Jember article", href: "https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark" },
    ],
  },
  {
    year: "2023",
    label: "PT Incorporation — NIB 1102230032918",
    body: "JVTO formally incorporated as PT Java Volcano Rendezvous with a valid NIB and TDUP (Tourism Business License), both verifiable via Indonesia's OSS system and AHU corporate registry.",
    links: [
      { label: "Verify NIB & TDUP", href: "/verify-jvto/legal" },
    ],
  },
];

export default async function OurStoryPage() {
  const [row, faqResolution] = await Promise.all([
    getContentPage("/why-jvto/our-story", "en"),
    resolveFaqsForPage("/why-jvto/our-story"),
  ]);

  const seo = (row?.seo as Record<string, any> | null) ?? {};
  const content = (row?.content as Record<string, any> | null) ?? {};
  const h1 = content.h1 ?? defaultH1;

  const faqNode = buildResolvedFaqSchema(faqResolution, "/why-jvto/our-story");

  const extraSchemas = [
    buildWhyJvtoWebPageSchema({ subpath: "our-story", pageName: h1, description: seo.description ?? defaultDescription }),
    buildWhyJvtoBreadcrumbSchema({ subpath: "our-story", pageName: h1, description: defaultDescription }),
    faqNode,
  ].filter(Boolean);

  const pageRow = row
    ? { route: row.route, lang: row.lang, seo: row.seo, content: row.content, created_at: row.created_at, updated_at: row.updated_at }
    : { route: "/why-jvto/our-story", lang: "en", seo: { title: defaultTitle, description: defaultDescription }, content: { h1 } };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={extraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <main className="pt-24 w-full">
        {/* Breadcrumb */}
        <nav className="border-b border-slate-200 px-6 py-3 text-xs text-slate-500">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link href="/why-jvto" className="hover:text-slate-700">Why JVTO</Link>
            <span>/</span>
            <span className="text-slate-700">Our Story</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-14">
          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2.5 py-1 rounded-full mb-5">
              Artifact-backed — not marketing
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
              {h1}
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-2xl mb-6">
              Every claim on this page is backed by a physical artifact or third-party document.
              Booking.com sent us an award in 2015. A German travel publisher wrote about us in 2018.
              National press named our founder in 2021. Then we incorporated the PT.
            </p>
            {/* Founder portrait */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 max-w-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-jvto-green/30 flex-shrink-0">
                <Image
                  src={FOUNDER_LEADERSHIP[0].url}
                  alt={FOUNDER_LEADERSHIP[0].alt}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Agung Sambuko (Mr. Sam)</div>
                <div className="text-xs text-slate-500">Founder — Bondowoso, East Java · Since 2015</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <section className="relative">
            {/* Vertical line */}
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-slate-200 hidden md:block" aria-hidden />

            <div className="space-y-14">
              {TIMELINE.map((item) => (
                <article key={item.year} className="relative md:pl-20">
                  {/* Year marker */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="hidden md:flex absolute left-0 w-[4.5rem] justify-end">
                      <div className="w-10 h-10 rounded-full bg-jvto-green flex items-center justify-center text-[10px] font-black text-slate-900">
                        {item.year}
                      </div>
                    </div>
                    <div className="md:hidden inline-flex items-center gap-1.5 text-[10px] font-black text-jvto-green bg-jvto-green/10 px-2 py-0.5 rounded-sm">
                      {item.year}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{item.label}</h2>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.body}</p>

                  {/* Artifact images */}
                  {item.images && item.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {item.images.map((img, i) => (
                        <figure key={i} className="rounded-lg overflow-hidden border border-slate-200">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={img.url}
                              alt={img.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="px-3 py-2 bg-slate-50 text-[10px] text-slate-500 leading-snug border-t border-slate-100">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}

                  {/* Founder-with-guests extra image (Stefan Loose section) */}
                  {item.extra && (
                    <figure className="rounded-lg overflow-hidden border border-slate-200 mb-4 max-w-lg">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={item.extra.url}
                          alt={item.extra.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      </div>
                      <figcaption className="px-3 py-2 bg-slate-50 text-[10px] text-slate-500 leading-snug border-t border-slate-100">
                        {item.extra.caption}
                      </figcaption>
                    </figure>
                  )}

                  {/* External links */}
                  {item.links && (
                    <div className="flex flex-wrap gap-3">
                      {item.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-jvto-green hover:underline"
                        >
                          {l.label}
                          {l.href.startsWith("http") ? <ExternalLink size={10} /> : <ArrowRight size={10} />}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Cross-cluster footer */}
          <div className="mt-16 border-t border-slate-100 pt-8 flex flex-wrap gap-5 text-sm">
            <Link href="/verify-jvto/history-artifacts" className="inline-flex items-center gap-1.5 text-jvto-green font-bold hover:underline">
              Full artifact archive <ArrowRight size={13} />
            </Link>
            <Link href="/verify-jvto/press-recognition" className="text-slate-500 hover:text-slate-800 transition-colors">
              Press coverage →
            </Link>
            <Link href="/verify-jvto/legal" className="text-slate-500 hover:text-slate-800 transition-colors">
              Legal documents →
            </Link>
            <Link href="/why-jvto" className="text-slate-500 hover:text-slate-800 transition-colors">
              ← Why JVTO
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
