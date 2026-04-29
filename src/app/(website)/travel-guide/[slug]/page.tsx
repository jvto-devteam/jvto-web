import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentPage } from "@/lib/content/getContentPage";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Sidebar from "../sidebar";
import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildTgFaqSchema,
  buildIjenHealthMedicalWebPageSchema,
  buildIjenHealthHowToSchema,
} from "@/lib/schemas/buildTravelGuideSchemas";
import { getNarrativeClaimsByPage } from "@/lib/queries/narrativeClaims";

type Props = {
  params: Promise<{ slug: string }>;
};

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

  const row = await getContentPage(`/travel-guide/${slug}`, "en");

  if (!row) return notFound();

  const content = row.content as any;
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Travel Guide";
  const body = content?.body_md ?? "";

  // AEO/GEO port (2026-04-29): per-slug schema injection.
  // Per cluster_role_contracts.md Cluster 5:
  //   - Any slug: FAQPage from narrative_claims (primary_page='/travel-guide/{slug}') if wired.
  //   - 'ijen-health-screening': MedicalWebPage + HowTo cross-ref to globally-injected DOCTOR/BBKSDA/SE1658.
  const claims = await getNarrativeClaimsByPage(`/travel-guide/${slug}`);
  const faqSchema = buildTgFaqSchema(claims, slug);

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
        </div>
      </main>
    </div>
  );
}
