import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentPage } from "@/lib/content/getContentPage";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Sidebar from "../sidebar";
import Link from "next/link";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";

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

  const seo = row.seo ?? {};

  return {
    title: seo?.title,
    description: seo?.description,
  };
}

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;

  const row = await getContentPage(`/travel-guide/${slug}`, "en");

  if (!row) return notFound();

  const content = row.content as any;
  const h1 = content?.h1;
  const body = content?.body_md ?? "";

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
