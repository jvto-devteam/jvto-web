import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { composeGraph } from "@/lib/schema/contract";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import Link from "@/components/website/AppLink";
import Sidebar from "../sidebar";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getPublicFaqCategories } from "@/lib/publicContent/faqSnapshot";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const fallbackSeo = {
  title: "Bromo, Ijen & Tumpak Sewu Tour FAQ | JVTO",
  h1: "Frequently Asked Questions",
  description:
    "Common questions about JVTO private tours: booking steps, pricing, safety protocols, health screening, and what to expect on Bromo, Ijen, and Tumpak Sewu.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/travel-guide/faq", fallbackSeo);

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/travel-guide/faq`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/travel-guide.webp",
          width: 1200,
          height: 630,
          alt: seo.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [siteUrl + "/assets/img/og/travel-guide.webp"],
    },
  };
}

async function getFaqData() {
  return getPublicFaqCategories();
}

export default async function FaqPage() {
  const [seo, categoriesData] = await Promise.all([
    getPageSeo("/travel-guide/faq", fallbackSeo),
    getFaqData(),
  ]);
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

  // Flat data untuk SEO
  const allFaqsForSeo = categories.flatMap((cat) =>
    cat.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );
  // Organization, WebSite, WebPage, and BreadcrumbList come from PageJsonLdCombined
  // (Organization keyed @id {SITE}/#organization). Only the page-specific FAQPage —
  // sourced from the FAQ-manager snapshot, not CMS content.faq — is page-owned;
  // suppressCmsFaq below prevents the CMS FAQPage from doubling it.
  const { "@graph": extraNodes } = composeGraph([
    {
      "@type": "FAQPage",
      // DEFAULT_SITE (not env) so the @id host always matches the sibling nodes
      // PageJsonLdCombined emits via builders.ts.
      "@id": `${DEFAULT_SITE}/travel-guide/faq#faqpage`,
      mainEntity: allFaqsForSeo.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ]);

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={extraNodes}
        suppressCmsFaq={true}
      />
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section>
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-4  text-sm text-muted-foreground">
              <Link href="/" prefetch={false} className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" prefetch={false} className="hover:text-primary">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">{seo.h1}</span>
            </nav>

            <div className=" mb-12">
              <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tight">
                {seo.h1}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                {seo.description}
              </p>
            </div>

            {categories.length === 0 ? (
              <div className=" text-muted-foreground py-10 bg-slate-50/50 rounded-sm border border-dashed">
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
                        className="rounded-sm border border-neutral-200 p-4"
                      >
                        <summary className="cursor-pointer list-none font-medium">
                          {it.question}
                        </summary>
                        <div dangerouslySetInnerHTML={{ __html: it.answer }} className="mt-3 text-neutral-800 prose prose-sm"/>
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
