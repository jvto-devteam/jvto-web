import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  loadStaticPage,
  listPublishedStaticPages,
  staticRouteCanonical,
  type StaticPage,
} from "@/lib/static-content";

// PACKAGE 08 (2026-08-06): the /blog hub is content-owned (content/pages/blog/index.md); the
// post listing is composed from the published blog content pages (content/pages/blog/*.md),
// newest first. The content/ loader is the sole source — no DB SEO lookup, no legacy blog module.
const ROUTE = "/blog";
export const revalidate = 3600;

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

function listBlogPosts() {
  return listPublishedStaticPages({ section: "blog" })
    .filter((p) => p.meta.route !== ROUTE)
    .sort((a, b) => (b.meta.publishedDate ?? "").localeCompare(a.meta.publishedDate ?? ""));
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

export default async function Insights() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return notFound();
  const posts = listBlogPosts();

  return (
    <>
      <PageJsonLdCombined pageRow={staticPageRow(page) as any} />

      <div className="bg-background-light dark:bg-background-dark">
        <header className="relative py-28 md:py-48 bg-ink-primary text-white text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black">{page.meta.title}</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">{page.meta.description}</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Breadcrumbs
                crumbs={[
                  { name: "Home", path: "/" },
                  { name: "Insights", path: "/blog" },
                ]}
              />
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 text-ink-neutral-700 dark:text-ink-neutral-200">
                <p className="text-lg font-semibold">New articles are on the way.</p>
                <p className="mt-2 text-sm">
                  Our team is preparing in-depth guides on Bromo, Ijen, and safe East Java travel.
                  Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => {
                  const slug = post.meta.route.replace("/blog/", "");
                  return (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      prefetch={false}
                      className="group block bg-white dark:bg-background-dark rounded-sm shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 hover:border-primary dark:hover:border-primary transition-all transform hover:-translate-y-1 overflow-hidden"
                    >
                      {post.meta.bannerImage && (
                        <div className="relative w-full h-44 overflow-hidden">
                          <img
                            src={post.meta.bannerImage}
                            alt={post.meta.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-neutral-700 dark:text-ink-neutral-200">
                          {post.meta.publishedDate && (
                            <time dateTime={post.meta.publishedDate}>
                              {new Date(post.meta.publishedDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          )}
                          {post.meta.readingTimeMin && (
                            <>
                              <span aria-hidden>·</span>
                              <span>{post.meta.readingTimeMin} min read</span>
                            </>
                          )}
                        </div>
                        <h2 className="mt-2 text-lg font-bold text-ink-primary dark:text-white">
                          {post.meta.title}
                        </h2>
                        <p className="mt-2 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
                          {post.meta.description}
                        </p>
                        <div className="mt-4 text-sm font-semibold text-primary">
                          Read Article{" "}
                          <span className="transform transition-transform group-hover:translate-x-1 inline-block">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
