import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import Sidebar from "../sidebar";
import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listPublicPageRoutesByPrefix("/policy").map((route) => ({
    slug: route.replace("/policy/", ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageSnapshot(`/policy/${slug}`, {
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

export default async function PolicyDynamicPage({ params }: Props) {
  const { slug } = await params;

  const page = await getPublicPageSnapshot(`/policy/${slug}`, {
    allowDatabaseFallback: false,
    requiredContentFields: ["body_md"],
  });
  const content = page.pageRow.content as any;
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Policy";
  const body = content?.body_md ?? "";

  if (!body.trim().length) return notFound();

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined pageRow={page.pageRow} />
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
