import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Sidebar from "../sidebar";
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
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: seo.title ?? content.h1 ?? page.pageRow.route,
    description: seo.description ?? undefined,
  };
}

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/travel-guide/${slug}`;
  const destLinks = TRAVEL_GUIDE_DEST_LINKS[slug] ?? [];

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
  // Prefer the resolved FAQ source (narrative_claims / canonical) for the visible
  // block too, so on-page content matches the FAQPage JSON-LD (AEO parity). Falls
  // back to CMS content.faq only when no higher-precedence source is registered
  // for this slug (unaffected routes keep their existing CMS-FAQ behaviour).
  const visibleFaqItems = faqResolution.faqs.length
    ? faqResolution.faqs.map((p) => ({ q: p.question, a: p.answer }))
    : ((content?.faq as Array<{ q: string; a: string }> | undefined) ?? []);
  const visibleFaqTitle = faqResolution.faqs.length
    ? "Frequently Asked Questions"
    : (content?.faq_title ?? "FAQ");

  const ijenHealthSchemas =
    slug === "ijen-health-screening"
      ? [buildIjenHealthMedicalWebPageSchema(), buildIjenHealthHowToSchema()]
      : [];

  const slugExtraSchemas = [faqSchema, ...ijenHealthSchemas].filter(Boolean);

  if (!body.trim().length) return notFound();

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
          <MarkdownRendererTravelGuide markdown={body} />
          {visibleFaqItems.length > 0 && (
            <Faq items={visibleFaqItems} title={visibleFaqTitle} />
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
