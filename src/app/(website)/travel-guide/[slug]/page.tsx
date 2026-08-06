import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Sidebar from "../sidebar";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildIjenHealthHowToSchema,
  buildIjenHealthMedicalWebPageSchema,
} from "@/lib/schemas/buildTravelGuideSchemas";
import { DOCTOR_SCHEMA } from "@/lib/schemas/entityGraph";
import {
  listPublishedStaticPages,
  loadStaticPage,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from "@/lib/static-content";

// PACKAGE 04 (2026-08-04): the seed-owned Travel Guide slug routes are served from
// content/pages/travel-guide/ (static-content SSOT). Routes still owned by folder
// pages (faq, police-escort-for-groups, rijik-monthly-closure, best-time-to-visit)
// and the 13 OKF-backed agent-guide pages are NOT in this loader's param set — they
// keep their current behavior until their migration lands (see the ledger).

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

// Travel-guide routes that are content-owned (in content/pages/travel-guide/) but keep
// their own folder page.tsx because they render a bespoke layout the markdown renderer
// can't reproduce — e.g. best-time-to-visit's colour-coded month table + season cards
// (PACKAGE 04b). They are served from their folder page, so they must be excluded here or
// Next.js would try to statically generate the same path from both routes.
const FOLDER_OWNED_ROUTES = new Set<string>(["/travel-guide/best-time-to-visit"]);

export function generateStaticParams() {
  return listPublishedStaticPages({ section: "travel-guide" })
    .filter((p) => p.meta.route !== "/travel-guide")
    .filter((p) => !FOLDER_OWNED_ROUTES.has(p.meta.route))
    .map((p) => ({ slug: p.meta.route.replace("/travel-guide/", "") }));
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      // Non-default schema classification from the content file (null = WebPage only).
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

/** Visible FAQ HTML and FAQPage JSON-LD share this one array (AD-08). */
function buildStaticFaqSchema(route: string, faq: NonNullable<StaticPage["faq"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PRODUCTION_ORIGIN}${route}#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = loadStaticPage(`/travel-guide/${slug}`);
  if (!page || page.meta.status !== "published") {
    return { title: "Page Not Found" };
  }
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/travel-guide/${slug}`;
  const destLinks = TRAVEL_GUIDE_DEST_LINKS[slug] ?? [];

  const page = loadStaticPage(route);
  if (!page || page.meta.status !== "published") return notFound();

  const h1 = page.meta.title;
  const faqItems = page.faq ?? [];
  const faqSchema = faqItems.length ? buildStaticFaqSchema(route, faqItems) : null;

  // Ijen health screening keeps its MedicalWebPage + HowTo schema, and now also
  // injects DOCTOR_SCHEMA so the MedicalWebPage's reviewedBy @id
  // (/#dr-ahmad-irwandanu) resolves on this page (it was dangling pre-migration).
  const ijenHealthSchemas =
    slug === "ijen-health-screening"
      ? [buildIjenHealthMedicalWebPageSchema(), buildIjenHealthHowToSchema(), DOCTOR_SCHEMA]
      : [];

  const slugExtraSchemas = [faqSchema, ...ijenHealthSchemas].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={staticPageRow(page)}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq
      />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-jvto-navy text-white pb-10 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" prefetch={false} className="hover:text-white transition-colors">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">{h1}</span>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              Travel Guide
            </span>
            <h1
              className="font-black text-3xl md:text-5xl text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {h1}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pt-12">
          <MarkdownRendererTravelGuide markdown={page.body ?? ""} />
          {faqItems.length > 0 && (
            <Faq
              items={faqItems.map((f) => ({ q: f.question, a: f.answer }))}
              title="Frequently Asked Questions"
            />
          )}
          {destLinks.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Related Destinations</p>
              <div className="flex flex-wrap gap-6">
                {destLinks.map((d) => (
                  <Link key={d.slug} href={`/destinations/${d.slug}`} className="text-sm font-semibold text-gray-900 hover:text-green-700 transition-colors">
                    {d.name} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
