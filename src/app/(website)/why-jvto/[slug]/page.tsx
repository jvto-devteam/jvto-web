// app/(website)/why-jvto/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContentPage } from "@/lib/content/getContentPage";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { EvidenceBox } from "@/components/content/EvidenceBox";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import Sidebar from "../sidebar";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const row = await getContentPage(`/why-jvto/${slug}`, "en");
  if (!row) return { title: "Page Not Found" };

  const seo = row.seo ?? {};
  return { title: seo.title, description: seo.description };
}

function SectionNav({
  items,
}: {
  items?: Array<{ id: string; label: string; href: string }>;
}) {
  if (!items?.length) return null;
  return (
    <nav className="mt-6 mb-10 rounded-lg border border-neutral-200 p-4">
      <div className="text-sm font-semibold mb-2">On this page</div>
      <ul className="grid gap-2 md:grid-cols-2 text-sm">
        {items.map((it) => (
          <li key={it.id}>
            <a className="text-blue-600 hover:underline" href={it.href}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;

  const row = await getContentPage(`/why-jvto/${slug}`, "en");
  if (!row) return notFound();

  const content = row.content as any;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
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

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/why-jvto" className="hover:text-primary">
              Why JVTO
            </Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{content?.h1}</span>
          </nav>

          <header className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              {content?.h1}
            </h1>
            {content?.hero_subhead && (
              <p className="mt-3 text-neutral-700">{content.hero_subhead}</p>
            )}
            {Array.isArray(content?.lede) && content.lede.length > 0 && (
              <div className="mt-4 space-y-2 text-neutral-700">
                {content.lede.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </header>

          <SectionNav items={content?.section_nav} />

          {/* Sections[] render */}
          {Array.isArray(content?.sections) &&
            content.sections.map((sec: any) => (
              <section key={sec.id} id={sec.id} className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {sec.title}
                </h2>
                {sec.summary && (
                  <p className="mt-3 text-neutral-700">{sec.summary}</p>
                )}
                <div className="mt-4">
                  {sec.blocks ? (
                    <BlocksRenderer blocks={sec.blocks} />
                  ) : sec.body_md ? (
                    <MarkdownRenderer markdown={sec.body_md} />
                  ) : null}{" "}
                </div>
                <EvidenceBox
                  evidence={sec.evidence}
                  title="Evidence"
                  description="Open the Proof Library for documents and verification links related to this claim."
                />
              </section>
            ))}

          {/* Optional fallback longform */}
          {content?.body_md && (
            <section className="mt-12">
              <MarkdownRenderer markdown={content.body_md} />
            </section>
          )}

          {content?.faq && (
            <Faq items={content.faq} title={content?.faq_title ?? "FAQ"} />
          )}
        </div>
      </main>
    </div>
  );
}
