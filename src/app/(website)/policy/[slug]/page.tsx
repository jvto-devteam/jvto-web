import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentPage } from "@/lib/content/getContentPage";
import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import Sidebar from "../sidebar";
import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildPolicyWebPageSchema,
  buildJvtoTravelCreditAnnouncementSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await prisma.content_pages.findMany({
    where: { route: { startsWith: '/policy/' }, is_active: true, lang: 'en' },
    select: { route: true },
  });
  return pages
    .map(p => p.route.replace('/policy/', ''))
    .filter((slug): slug is string => Boolean(slug) && !slug.includes('/'))
    .map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const row = await getContentPage(`/policy/${slug}`, "en");

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

export default async function PolicyDynamicPage({ params }: Props) {
  const { slug } = await params;

  const row = await getContentPage(`/policy/${slug}`, "en");

  if (!row) return notFound();

  const content = row.content as any;
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Policy";
  const body = content?.body_md ?? "";

  // Phase 5 (2026-04-29): per-slug brand-anchor WebPage with mentions cross-refs to
  // globally-injected custom DefinedTerms (#term-jvto-travel-credit, #term-jvto-foc-scheme).
  // FAQ via resolver (narrative_claims-first; /policy/booking-payment-cancellation has 1 wired).
  // booking-payment-cancellation also gets SpecialAnnouncement for travel credit policy.
  // Per cluster_role_contracts.md Cluster 6.
  const mentionsTermIds = POLICY_SLUG_MENTIONS[slug] ?? [];
  const route = `/policy/${slug}`;
  const faqResolution = await resolveFaqsForPage(route);
  const policyAnchorSchema = buildPolicyWebPageSchema({
    subpath: slug,
    name: seo.title ?? h1,
    description: seo.description ?? `JVTO ${h1} policy.`,
    mentionsTermIds,
  });
  const faqSchema = buildResolvedFaqSchema(faqResolution, route);
  const announcementSchema =
    slug === "booking-payment-cancellation"
      ? buildJvtoTravelCreditAnnouncementSchema()
      : null;

  const slugExtraSchemas = [
    policyAnchorSchema,
    faqSchema,
    announcementSchema,
  ].filter(Boolean);

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
            <Link href="/policy" className="hover:text-primary">
              Policy
            </Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">
              {h1}
            </span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{h1}</h1>
          </header>

          <MarkdownRenderer markdown={body} />
          {content?.faq && (
            <Faq items={content?.faq} title={content?.faq_title ?? "FAQ"} />
          )}
        </div>
      </main>
    </div>
  );
}
