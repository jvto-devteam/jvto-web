import React from "react";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import type { BlogSummary } from "@/lib/content/getBlog";

type ArticleItem = {
  title: string;
  description: string;
  link: string;
  category: string;
};

const ArticleCard: React.FC<ArticleItem> = ({
  title,
  description,
  link,
  category,
}) => (
  <Link
    href={link}
    className="group block p-6 bg-white dark:bg-background-dark rounded-2xl shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 hover:border-primary dark:hover:border-primary transition-all transform hover:-translate-y-1"
  >
    <p className="text-sm font-semibold text-primary">{category}</p>
    <h3 className="mt-2 text-lg font-bold text-ink-primary dark:text-white">
      {title}
    </h3>
    <p className="mt-2 text-sm text-ink-neutral-700 dark:text-ink-neutral-200">
      {description}
    </p>
    <div className="mt-4 text-sm font-semibold text-primary">
      Read Article{" "}
      <span className="transform transition-transform group-hover:translate-x-1 inline-block">
        →
      </span>
    </div>
  </Link>
);

interface InsightsPageProps {
  title?: string;
  description?: string;
  blogs?: BlogSummary[];
}

const InsightsPage = ({
  title = "Insights & Explainers",
  description = "Long-form articles explaining how we operate, why safety standards matter, and how to plan your trip effectively.",
  blogs = [],
}: InsightsPageProps) => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ];

  const articles: ArticleItem[] = blogs.map((b) => ({
    title: b.title,
    description: b.tags.slice(0, 3).join(", ") || b.category,
    link: `/blog/${b.slug}`,
    category: b.category,
  }));

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark">
        <header className="relative  py-28 md:py-48 bg-ink-primary text-white text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto-format=fit=crop')`,
            }}
          ></div>
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              {title}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Breadcrumbs crumbs={breadcrumbCrumbs} />
            </div>

            {articles.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">No articles published yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.link} {...article} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default InsightsPage;
