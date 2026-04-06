import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "next/link";
import Sidebar from "../sidebar";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
import { BASE_URL } from "@/lib/site";
import { faqData } from "@/lib/faq-data";

const siteUrl = BASE_URL;
const fallbackSeo = {
  title: "Frequently Asked Questions (FAQ) - Java Volcano Tour Operator",
  h1: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Bromo, Ijen, and Tumpak Sewu tour packages.",
};

function normalizeFaqAnswer(answer: string) {
  if (!answer) return answer;

  return answer
    .replace(/within 14 days of booking/gi, "within 7 days of booking")
    .replace(/within 14 calendar days of booking/gi, "within 7 calendar days of booking")
    .replace(/within 14 days of Day 1/gi, "within 7 days of Day 1")
    .replace(/within 14 calendar days of Day 1/gi, "within 7 calendar days of Day 1")
    .replace(/14 days/gi, "7 days")
    .replace(/14 calendar days/gi, "7 calendar days");
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/travel-guide/faq", fallbackSeo);

  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/travel-guide/faq",
    image: "/assets/img/og/travel-guide.webp",
    imageAlt: seo.h1,
  });
}

async function getFaqData() {
  try {
    // 1. Ambil kategori yang HANYA memiliki minimal 1 FAQ published
    const categories = await prisma.category_faqs.findMany({
      where: {
        is_active: true,
        faqs: {
          some: {
            is_published: true,
          },
        },
      },
      orderBy: {
        sort_order: "asc",
      },
      include: {
        faqs: {
          where: {
            is_published: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
      },
    });

    // 2. Ambil Uncategorized FAQ (jika ada)
    const uncategorizedFaqs = await prisma.faqs.findMany({
      where: {
        is_published: true,
        category_id: null,
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    if (uncategorizedFaqs.length > 0) {
      categories.push({
        id: 9999,
        name: "General / Others",
        slug: "general",
        sort_order: 9999,
        is_active: true,
        faqs: uncategorizedFaqs,
      } as any);
    }

    return categories;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[travel-guide-faq] fallback to static faq dataset: ${message}`);
    return faqData.categories.map((category, index) => ({
      id: 10000 + index,
      name: category.name,
      slug: category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      sort_order: index + 1,
      is_active: true,
      faqs: category.questions.map((item, questionIndex) => ({
        id: `${10000 + index}-${questionIndex + 1}`,
        question: item.q,
        answer: item.a,
        sort_order: questionIndex + 1,
        is_published: true,
      })),
    }));
  }
}

export default async function FaqPage() {
  const seo = await getPageSeo("/travel-guide/faq", fallbackSeo);
  const categoriesData = await getFaqData();
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
        route: "/travel-guide/faq",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };

  // 3. Safety Filter: Memastikan sekali lagi di level aplikasi (Defensive Programming)
  // Ini berguna jika suatu saat logic database berubah, UI tetap aman dari header kosong.
  const categories = categoriesData.filter((cat) => cat.faqs.length > 0);
  const normalizedCategories = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.map((faq) => ({
      ...faq,
      answer: normalizeFaqAnswer(faq.answer),
    })),
  }));

  // Flat data untuk SEO
  const allFaqsForSeo = normalizedCategories.flatMap((cat) =>
    cat.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/travel-guide/faq#faqpage`,
        mainEntity: allFaqsForSeo.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/travel-guide/faq#webpage`,
        url: `${siteUrl}/travel-guide/faq`,
        name: seo.title,
        description: seo.description,
        breadcrumb: { "@id": `${siteUrl}/travel-guide/faq#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/travel-guide/faq#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Prepare & Book",
            item: `${siteUrl}/travel-guide`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: seo.h1,
            item: `${siteUrl}/travel-guide/faq`,
          },
        ],
      },
    ].filter(Boolean),
  };

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined pageRow={pageRow as any} extraSchemas={[schema]} />
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section>
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-4  text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" className="hover:text-primary">
                Prepare &amp; Book
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">{seo.h1}</span>
            </nav>

            <div className=" mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                {seo.h1}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                {seo.description}
              </p>
            </div>

            {normalizedCategories.length === 0 ? (
              <div className=" text-muted-foreground py-10 bg-slate-50/50 rounded-lg border border-dashed">
                <p>No questions are available at the moment.</p>
              </div>
            ) : (
              normalizedCategories.map((category) => (
                <div key={category.id} className="mb-12">
                  <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6  md:text-left border-b pb-2">
                    {category.name}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {category.faqs.map((it, idx) => (
                      <details
                        key={`${idx}-${it.question}`}
                        className="rounded-lg border border-neutral-200 p-4"
                      >
                        <summary className="cursor-pointer list-none font-medium">
                          {it.question}
                        </summary>
                        <div dangerouslySetInnerHTML={{ __html: it.answer }} className="mt-3 text-neutral-800 prose prose-sm"/>
                      </details>
                    ))}
                  </div>

                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
