import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentPage } from "@/lib/content/getContentPage";
import { prisma } from "@/lib/prisma";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Sidebar from "../sidebar";
import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildIjenHealthMedicalWebPageSchema,
  buildIjenHealthHowToSchema,
} from "@/lib/schemas/buildTravelGuideSchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

const TRAVEL_GUIDE_DEST_LINKS: Record<string, Array<{ slug: string; name: string }>> = {
  "ijen-health-screening": [{ slug: "ijen-crater", name: "Ijen Crater" }],
  "packing-and-fitness": [
    { slug: "ijen-crater", name: "Ijen Crater" },
    { slug: "mount-bromo", name: "Mount Bromo" },
    { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" },
  ],
  "weather-and-closures": [
    { slug: "mount-bromo", name: "Mount Bromo" },
    { slug: "ijen-crater", name: "Ijen Crater" },
  ],
  "safety-on-tours": [
    { slug: "mount-bromo", name: "Mount Bromo" },
    { slug: "ijen-crater", name: "Ijen Crater" },
    { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" },
  ],
};

export const revalidate = 86400;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { safeBuildQuery } = await import("@/lib/build-safe");
  const pages = await safeBuildQuery(
    () =>
      prisma.content_pages.findMany({
        where: { route: { startsWith: '/travel-guide/' }, is_active: true, lang: 'en' },
        select: { route: true },
      }),
    [] as { route: string }[],
    "travel-guide:generateStaticParams",
  );
  return pages
    .map(p => p.route.replace('/travel-guide/', ''))
    .filter((slug): slug is string => Boolean(slug) && !slug.includes('/'))
    .map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const row = await getContentPage(`/travel-guide/${slug}`, "en");

  if (!row) {
    return {
      title: "Page Not Found",
    };
  }

  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};

  return {
    title: seo.title ?? content.h1 ?? row.route,
    description: seo.description ?? undefined,
  };
}

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;
  const destLinks = TRAVEL_GUIDE_DEST_LINKS[slug] ?? [];

  const route = `/travel-guide/${slug}`;
  const [row, faqResolution] = await Promise.all([
    getContentPage(route, "en"),
    resolveFaqsForPage(route),
  ]);

  if (!row) return notFound();

  const content = row.content as any;
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Travel Guide";
  const body = content?.body_md ?? "";
  const faqSchema = buildResolvedFaqSchema(faqResolution, route);

  const ijenHealthSchemas =
    slug === "ijen-health-screening"
      ? [buildIjenHealthMedicalWebPageSchema(), buildIjenHealthHowToSchema()]
      : [];

  const slugExtraSchemas = [faqSchema, ...ijenHealthSchemas].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={{
          route: row.route,
          lang: row.lang,
          seo: row.seo,
          content: row.content,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/travel-guide" className="hover:text-primary">
              Travel Guide
            </Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{h1}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{h1}</h1>
          </header>

          <MarkdownRendererTravelGuide markdown={body} />
          {content?.faq && (
            <Faq items={content?.faq} title={content?.faq_title ?? "FAQ"} />
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
