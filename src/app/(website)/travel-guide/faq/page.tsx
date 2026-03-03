import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
import { generateFaqSchema } from "@/lib/generateFaqSchema";
import Link from "next/link";
import Sidebar from "../sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) - Java Volcano Tour Operator",
  description:
    "Find answers to common questions about Bromo, Ijen, and Tumpak Sewu tour packages.",
  images: [
    {
      url: siteUrl + "/assets/img/og/travel-guide.webp",
      width: 1200,
      height: 630,
      alt: "Travel Guide",
    },
  ],
};

async function getFaqData() {
  // 1. Ambil kategori yang HANYA memiliki minimal 1 FAQ published
  const categories = await prisma.category_faqs.findMany({
    where: {
      is_active: true,
      // LOGIKA UTAMA: Filter ini memastikan kategori kosong tidak akan terambil
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
          is_published: true, // Pastikan isinya pun hanya yang published
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

  // Gabungkan Uncategorized hanya jika ada isinya
  // If there are uncategorized FAQs
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
}

export default async function FaqPage() {
  const categoriesData = await getFaqData();

  // 3. Safety Filter: Memastikan sekali lagi di level aplikasi (Defensive Programming)
  // Ini berguna jika suatu saat logic database berubah, UI tetap aman dari header kosong.
  const categories = categoriesData.filter((cat) => cat.faqs.length > 0);

  // Flat data untuk SEO
  const allFaqsForSeo = categories.flatMap((cat) =>
    cat.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );

  return (
    <div className="flex min-h-screen bg-background">
      <StructuredData data={generateFaqSchema(allFaqsForSeo)} />
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
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">FAQ</span>
            </nav>

            <div className=" mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                Have questions? We have the answers. Here are some of the most
                frequently asked questions from our travelers.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className=" text-muted-foreground py-10 bg-slate-50/50 rounded-lg border border-dashed">
                <p>No questions are available at the moment.</p>
              </div>
            ) : (
              categories.map((category) => (
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
                        <div className="mt-3 whitespace-pre-wrap text-neutral-800">
                          {it.answer}
                        </div>
                      </details>
                    ))}
                  </div>

                  {/* <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((item) => (
                      <AccordionItem
                        value={`item-${category.id}-${item.id}`}
                        key={item.id}
                      >
                        <AccordionTrigger className="text-lg text-left font-medium">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className="faq-content prose prose-slate prose-sm md:prose-base max-w-none text-muted-foreground dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion> */}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
