import React from "react";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";

const articles = [
  {
    title: "How to Choose a Legal Bromo & Ijen Operator",
    description:
      "A practical guide to verifying licenses, safety records, and avoiding common scams in East Java.",
    link: "/insights/choose-legal-operator",
    category: "Safety & Planning",
  },
  {
    title: "Why Real Ijen Health Screening Matters",
    description:
      "An inside look at the risks of falsified medical letters and how our digital system raises the bar for safety.",
    link: "/insights/ijen-screening-explained",
    category: "Safety & Planning",
  },
  {
    title: "Bromo vs Ijen vs Tumpak Sewu — How to Combine Them in 3–5 Days",
    description:
      "Expert advice on structuring your itinerary to maximize experience and minimize travel time.",
    link: "/insights/combine-destinations",
    category: "Itinerary Planning",
  },
  {
    title: "A Practical Guide for ISIC Students Traveling in East Java",
    description:
      "Understanding park fees, how to get fair pricing, and making the most of your student status with JVTO.",
    link: "/insights/isic-student-fairness",
    category: "Community & Fairness",
  },
  {
    title:
      "How Official Police Escort Works for Large Tourist Groups (Plain English)",
    description:
      "Demystifying the legal process, purpose, and requirements for arranging a 'Patwal' in East Java.",
    link: "/travel-guide/police-escort-for-groups",
    category: "Safety & Planning",
  },
];

const ArticleCard: React.FC<(typeof articles)[0]> = ({
  title,
  description,
  link,
  category,
}) => (
  <Link
    href={link}
    className="group block p-6 bg-white dark:bg-background-dark rounded-sm shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 hover:border-primary dark:hover:border-primary transition-all transform hover:-translate-y-1"
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
}

const InsightsPage = ({
  title = "Insights & Explainers",
  description = "Long-form articles explaining how we operate, why safety standards matter, and how to plan your trip effectively.",
}: InsightsPageProps) => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
  ];

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.title} {...article} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default InsightsPage;
