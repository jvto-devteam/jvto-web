import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import Sidebar from "../sidebar";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import { loadStaticPage, PRODUCTION_ORIGIN, type StaticPage } from "@/lib/static-content";
import { FaqListItemSchema, parseGrid, type FaqListItem } from "@/lib/content/travelGuideGrids";

// PACKAGE 04b (2026-08-06): the FAQ content comes from the static-content SSOT
// (content/pages/travel-guide/faq.json), frozen from the FAQ-manager snapshot that was
// being served (owner decision: use that snapshot as the migration baseline; do not wait
// for DB access). Categories + Q&A live in the content sections; the visible accordions
// and the single FAQPage JSON-LD are both built from that one array (AD-08). No getPageSeo
// / faqSnapshot / DB read.

const ROUTE = "/travel-guide/faq";

export const revalidate = 86400;

type Sec = NonNullable<StaticPage["sections"]>[number] & Record<string, unknown>;

function sectionGrid(sec: Sec, role: string): Record<string, unknown>[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as { role?: string }).role === role,
  );
  return block ? ((block as { items?: Record<string, unknown>[] }).items ?? []) : [];
}
function parseFaqList(sec: Sec): FaqListItem[] {
  return parseGrid(FaqListItemSchema, sectionGrid(sec, "faq-list"), `faq-list:${sec.id}`);
}
function sectionTitle(sec: Sec): string {
  return typeof sec.title === "string" ? sec.title : "";
}

function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

/** Single FAQPage node built from the union of every category's Q&A (visible == JSON-LD, AD-08). */
function buildFaqPageSchema(all: FaqListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PRODUCTION_ORIGIN}${ROUTE}#faqpage`,
    mainEntity: all.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [{ url: `${siteUrl}/assets/img/og/travel-guide.webp`, width: 1200, height: 630, alt: page.meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/assets/img/og/travel-guide.webp`],
    },
  };
}

export default async function FaqPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return notFound();

  const categories = (page.sections ?? []).map((sec) => ({
    id: (sec as Sec).id,
    title: sectionTitle(sec as Sec),
    faqs: parseFaqList(sec as Sec),
  }));
  const allFaqs = categories.flatMap((c) => c.faqs);
  const faqSchema = allFaqs.length ? buildFaqPageSchema(allFaqs) : null;

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={staticPageRow(page) as any}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq
      />
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-jvto-navy text-white pb-10 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" prefetch={false} className="hover:text-white transition-colors">Travel Guide</Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">{page.meta.title}</span>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              Reference
            </span>
            <h1
              className="font-headline text-3xl md:text-5xl font-black tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {page.meta.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-white/70">{page.meta.description}</p>
          </div>
        </section>
        <section>
          <div className="container mx-auto px-4 max-w-4xl pt-12">
            {categories.map((category) => (
              <div key={category.id} className="mb-12">
                <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6 md:text-left border-b pb-2">
                  {category.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {category.faqs.map((it, idx) => (
                    <details key={`${idx}-${it.question}`} className="rounded-sm border border-neutral-200 p-4">
                      <summary className="cursor-pointer list-none font-medium">{it.question}</summary>
                      <div className="mt-3 text-neutral-800">
                        <MarkdownRendererTravelGuide markdown={it.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
