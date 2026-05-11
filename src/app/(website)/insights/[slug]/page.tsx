import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getContentPage } from '@/lib/content/getContentPage';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer';
import { Faq } from '@/components/content/Faq';
import { resolveFaqsForPage, buildResolvedFaqSchema } from '@/lib/content/resolveFaqs';
import {
  buildInsightsBlogPostingSchema,
  buildInsightsBreadcrumbSchema,
} from '@/lib/schemas/buildInsightsSchemas';

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const pages = await prisma.content_pages.findMany({
    where: { route: { startsWith: '/insights/' }, is_active: true, lang: 'en' },
    select: { route: true },
  });
  return pages
    .map((p) => p.route.replace('/insights/', ''))
    .filter((slug): slug is string => Boolean(slug) && !slug.includes('/'))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getContentPage(`/insights/${slug}`, 'en');
  if (!row) return { title: 'Article Not Found' };
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? content.h1 ?? row.route,
    description: seo.description ?? undefined,
  };
}

const RELATED_ARTICLES = [
  { slug: 'choose-legal-operator', title: 'How to Choose a Legal Bromo & Ijen Operator' },
  { slug: 'ijen-screening-explained', title: 'Why Real Ijen Health Screening Matters' },
  { slug: 'combine-destinations', title: 'Bromo + Ijen + Tumpak Sewu in 3–5 Days' },
  { slug: 'isic-student-fairness', title: 'ISIC Student Fair Pricing in East Java' },
];

export default async function InsightsArticlePage({ params }: Props) {
  const { slug } = await params;
  const route = `/insights/${slug}`;

  const [row, faqResolution] = await Promise.all([
    getContentPage(route, 'en'),
    resolveFaqsForPage(route),
  ]);

  if (!row) return notFound();

  const content = (row.content as Record<string, any>) ?? {};
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? 'Insights';
  const description = seo.description ?? content?.lede ?? '';
  const category = content?.category as string | undefined;
  const publishedDate = new Date(row.created_at ?? new Date()).toISOString();
  const modifiedDate = new Date(row.updated_at ?? row.created_at ?? new Date()).toISOString();

  const faqSchema = buildResolvedFaqSchema(faqResolution, route);
  const blogPostSchema = buildInsightsBlogPostingSchema({
    slug,
    headline: h1,
    description,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    category,
  });
  const breadcrumbSchema = buildInsightsBreadcrumbSchema(slug, h1);

  const related = RELATED_ARTICLES.filter((a) => a.slug !== slug);

  return (
    <div className="min-h-screen bg-white">
      <PageJsonLdCombined
        pageRow={{
          route: row.route,
          lang: row.lang,
          seo: row.seo,
          content: row.content,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }}
        extraSchemas={[blogPostSchema, breadcrumbSchema, faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 md:pt-36">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/insights" className="hover:text-gray-800">Insights</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">{h1}</span>
        </nav>

        {/* Article header */}
        <header className="mb-8 border-b border-gray-200 pb-8">
          {category && (
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-lime-600">
              {category}
            </p>
          )}
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-gray-900 md:text-4xl">
            {h1}
          </h1>
          {description && (
            <p className="mb-4 text-lg text-gray-500 leading-relaxed">{description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>By Agung Sambuko (Mr. Sam)</span>
            <span>·</span>
            <span>Java Volcano Tour Operator</span>
            <span>·</span>
            <time dateTime={publishedDate}>
              {new Date(publishedDate).toLocaleDateString('en-GB', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Body */}
        {content?.body_md && (
          <article className="prose prose-gray max-w-none mb-10">
            <MarkdownRenderer markdown={content.body_md} />
          </article>
        )}

        {/* FAQ */}
        {content?.faq && (
          <Faq items={content.faq} title={content?.faq_title ?? 'Frequently Asked Questions'} />
        )}

        {/* Related articles */}
        <aside className="mt-12 border-t border-gray-200 pt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            More from JVTO Insights
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/insights/${a.slug}`}
                className="rounded-xl border border-gray-200 p-4 text-sm font-semibold text-gray-900 hover:border-lime-400 hover:bg-lime-50 transition-colors"
              >
                {a.title} →
              </Link>
            ))}
          </div>
          <p className="mt-4">
            <Link href="/insights" className="text-sm text-gray-500 hover:text-gray-800 underline">
              All Insights →
            </Link>
          </p>
        </aside>
      </main>
    </div>
  );
}
