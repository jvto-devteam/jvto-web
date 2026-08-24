import type { Metadata } from "next";
import AnswerBlock from "@/components/website/AnswerBlock";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { applyLiveNumbers, getLiveNumbers } from "@/lib/publicContent/liveNumbers";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  buildBlogPostingSchema,
  getEcosystemBlogSlugs,
  getEcosystemBlogPost,
} from "@/lib/ecosystemContent/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

// dynamicParams = true (2026-08-21). See why-jvto/our-team/[slug] for the full
// account: with false, any path evicted from the cache 404s instead of
// re-rendering, because Next no longer holds the build-time param list at
// runtime. These routes are all in ekosistem's revalidation set, so every
// ekosistem deploy could evict them and turn live pages into 404s. Unknown
// slugs still 404 through the notFound() guard below, which checks the real
// content source rather than the build list.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getEcosystemBlogSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getEcosystemBlogPost(slug);
  if (!post) return { title: "Page Not Found" };

  const { frontmatter: fm } = post;
  return {
    title: fm.seo_title ?? `${fm.title} | JVTO`,
    description: fm.seo_description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getEcosystemBlogPost(slug);
  if (!post) return notFound();
  const page = await loadEcosystemPage(`/blog/${slug}`);

  const { frontmatter: fm, body: rawBody } = post;
  // Review counts and the package count are written as {TOKEN} placeholders in
  // ekosistem prose and resolved here, so the article can never drift from the
  // figures the schema publishes (it read "123 reviews" while JSON-LD said 152).
  const liveNumbers = await getLiveNumbers();
  const body = applyLiveNumbers(rawBody, liveNumbers);
  const route = `/blog/${slug}`;

  const pageRow = {
    route,
    lang: "en",
    seo: {
      title: fm.seo_title ?? `${fm.title} | JVTO`,
      description: fm.seo_description,
    },
    content: { h1: fm.title },
  };

  return (
    <div className="bg-background min-h-screen">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[buildBlogPostingSchema(fm)]}
      />

      {fm.banner_image && (
        <div className="relative w-full h-64 md:h-[480px] overflow-hidden bg-ink-primary">
          <img
            src={fm.banner_image}
            alt={fm.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>
      )}

      <main className={fm.banner_image ? "pb-20" : "pt-24 md:pt-36 pb-20"}>
        <div className="container mx-auto px-4 max-w-3xl">
          <nav className={`mb-4 text-sm text-muted-foreground ${fm.banner_image ? "pt-8" : ""}`}>
            <Link href="/" prefetch={false} className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/blog" prefetch={false} className="hover:text-primary">
              Insights
            </Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{fm.title}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {fm.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {fm.date && (
                <time dateTime={fm.date}>
                  {new Date(fm.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {fm.estimated_read_min && (
                <>
                  <span aria-hidden>·</span>
                  <span>{fm.estimated_read_min} min read</span>
                </>
              )}
            </div>
            {fm.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {fm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {/* The article's own answer, before the article. Tokens run through
                the same applyLiveNumbers pass the body already uses. */}
            <AnswerBlock tone="light">
              {typeof (page?.raw as any)?.page?.answerFirst === "string"
                ? applyLiveNumbers(
                    ((page!.raw as any).page.answerFirst as string).trim(),
                    liveNumbers,
                  )
                : null}
            </AnswerBlock>
          </header>

          <MarkdownRenderer markdown={body} />

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
