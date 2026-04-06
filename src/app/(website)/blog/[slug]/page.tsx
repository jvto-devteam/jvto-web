import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug, getBlogList } from "@/lib/content/getBlog";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
import { BASE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await getBlogList();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  return buildWebsiteMetadata({
    title: blog.title,
    description: blog.tags.slice(0, 3).join(", ") || blog.category,
    path: `/blog/${blog.slug}`,
    image: blog.cover_image ?? undefined,
    imageAlt: blog.title,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const publishedDate = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    datePublished: blog.created_at,
    author: { "@type": "Organization", name: "Java Volcano Tour Operator" },
    publisher: {
      "@type": "Organization",
      name: "Java Volcano Tour Operator",
      url: BASE_URL,
    },
    ...(blog.cover_image && { image: blog.cover_image }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
        <article className="container mx-auto px-4 max-w-3xl">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{blog.title}</span>
          </nav>

          <header className="mb-10">
            <p className="text-sm font-semibold text-primary mb-2">{blog.category}</p>
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {blog.title}
            </h1>
            {publishedDate && (
              <p className="mt-3 text-sm text-muted-foreground">{publishedDate}</p>
            )}
            {blog.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {blog.cover_image && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              href="/blog"
              className="text-sm font-semibold text-primary hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
