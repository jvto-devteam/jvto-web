import type { Metadata } from "next";
import Link from "@/components/website/AppLink";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { getEcosystemBlogPosts } from "@/lib/ecosystemContent/blog";

export const revalidate = 3600;

const fallbackSeo = {
  title: "Insights | JVTO's Blog on Safety, Planning & Community",
  h1: "Insights & Explainers",
  description:
    "Explore our articles on choosing a legal operator, understanding Ijen health screening, and maximizing your East Java trip. Expert advice from a police-led team.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/blog", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function Insights() {
  const seo = await getEcosystemPageSeo("/blog", fallbackSeo);
  const posts = await getEcosystemBlogPosts();

  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/blog",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} />

      <div className="bg-background-light dark:bg-background-dark">
        <header className="relative py-28 md:py-48 bg-ink-primary text-white text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop')`,
            }}
          />
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black">{seo.h1}</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
              {seo.description}
            </p>
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
                  Our team is preparing in-depth guides on Bromo, Ijen, and safe
                  East Java travel. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    prefetch={false}
                    className="group block bg-white dark:bg-background-dark rounded-sm shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 hover:border-primary dark:hover:border-primary transition-all transform hover:-translate-y-1 overflow-hidden"
                  >
                    {post.banner_image && (
                      <div className="relative w-full h-44 overflow-hidden">
                        <img
                          src={post.banner_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-neutral-700 dark:text-ink-neutral-200">
                        {post.date && (
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        )}
                        {post.estimated_read_min && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{post.estimated_read_min} min read</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-bold text-ink-primary dark:text-white">
                        {post.title}
                      </h2>
                      {post.seo_description && (
                        <p className="mt-2 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
                          {post.seo_description}
                        </p>
                      )}
                      <div className="mt-4 text-sm font-semibold text-primary">
                        Read Article{" "}
                        <span className="transform transition-transform group-hover:translate-x-1 inline-block">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
