import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  loadStaticPage,
  listPublishedStaticPages,
  type StaticPage,
} from "@/lib/static-content";
import { buildBlogPostingSchema } from "@/lib/schemas/buildBlogSchemas";

// PACKAGE 08 (2026-08-06): blog posts are content-owned (content/pages/blog/<slug>.md),
// served through the static-content loader. sync:blog + src/data/blog + src/lib/blog.ts are
// retired; blog-specific meta (publishedDate, tags, bannerImage, readingTimeMin) rides on the
// page frontmatter and feeds the header + BlogPosting JSON-LD.

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listPublishedStaticPages({ section: "blog" })
    .filter((p) => p.meta.route !== "/blog")
    .map((p) => ({ slug: p.meta.route.replace("/blog/", "") }));
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = loadStaticPage(`/blog/${slug}`);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const page = loadStaticPage(`/blog/${slug}`);
  if (!page || page.meta.status !== "published") return notFound();

  const m = page.meta;

  return (
    <div className="bg-background min-h-screen">
      <PageJsonLdCombined
        pageRow={staticPageRow(page) as any}
        extraSchemas={[buildBlogPostingSchema(m)]}
      />

      {m.bannerImage && (
        <div className="relative w-full h-64 md:h-[480px] overflow-hidden bg-ink-primary">
          <img src={m.bannerImage} alt={m.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>
      )}

      <main className={m.bannerImage ? "pb-20" : "pt-24 md:pt-36 pb-20"}>
        <div className="container mx-auto px-4 max-w-3xl">
          <nav className={`mb-4 text-sm text-muted-foreground ${m.bannerImage ? "pt-8" : ""}`}>
            <Link href="/" prefetch={false} className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/blog" prefetch={false} className="hover:text-primary">
              Insights
            </Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{m.title}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{m.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {m.publishedDate && (
                <time dateTime={m.publishedDate}>
                  {new Date(m.publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {m.readingTimeMin && (
                <>
                  <span aria-hidden>·</span>
                  <span>{m.readingTimeMin} min read</span>
                </>
              )}
            </div>
            {m.tags && m.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <MarkdownRenderer markdown={page.body ?? ""} />

          <div className="mt-12 pt-8 border-t">
            <Link
              href="/blog"
              prefetch={false}
              className="text-sm font-semibold text-primary hover:underline"
            >
              ← Back to Insights
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
