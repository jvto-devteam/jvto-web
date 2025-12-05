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

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) - Java Wolcano",
  description: "Temukan jawaban atas pertanyaan umum seputar paket wisata Bromo, Ijen, dan Tumpak Sewu.",
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
  if (uncategorizedFaqs.length > 0) {
    categories.push({
      id: 9999,
      name: "Umum / Lainnya",
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
    }))
  );

  return (
    <div className="flex flex-col min-h-screen bg-background py-20">
      <StructuredData data={generateFaqSchema(allFaqsForSeo)} />
      <main className="flex-grow">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Punya pertanyaan? Kami punya jawabannya. Berikut adalah hal-hal yang sering ditanyakan oleh wisatawan kami.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 bg-slate-50/50 rounded-lg border border-dashed">
                <p>Belum ada pertanyaan yang tersedia saat ini.</p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="mb-12">
                  <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6 text-center md:text-left border-b pb-2">
                    {category.name}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
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
                  </Accordion>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}