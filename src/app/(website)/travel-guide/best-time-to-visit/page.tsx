import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import Sidebar from '../sidebar';
import { Faq } from '@/components/content/Faq';
import { MarkdownRendererTravelGuide } from '@/components/content/MarkdownRendererTravelGuide';
import {
  loadStaticPage,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from '@/lib/static-content';

// PACKAGE 04b (2026-08-06): evergreen narrative + SEO + FAQ come from the static-content
// SSOT (content/pages/travel-guide/best-time-to-visit.json + content/faqs/…). The bespoke
// layout — the two season-verdict cards and the colour-coded month-by-month table — stays
// here as TSX chrome that renders the structured content; the prose sections render through
// the standard travel-guide markdown renderer. No getPageSeo / resolveFaqsForPage: this route
// keeps its own folder page (excluded from the [slug] loader's params) but is content-owned.

const ROUTE = '/travel-guide/best-time-to-visit';

export const revalidate = 86400;

type Sec = NonNullable<StaticPage['sections']>[number] & Record<string, unknown>;
type SeasonPoint = { positive: boolean; text: string };
type SeasonCard = { kind: string; label: string; range: string; points: SeasonPoint[] };
type MonthRow = {
  month: string;
  bromo: string;
  ijen: string;
  tumpak: string;
  crowd: string;
  sweet: boolean;
};

function findSection(page: StaticPage, id: string): Sec | undefined {
  return page.sections?.find((s) => s.id === id) as Sec | undefined;
}
function sectionGrid(sec: Sec | undefined, role: string): Record<string, unknown>[] {
  const block = (sec?.blocks ?? []).find(
    (b) => b.type === 'grid' && (b as { role?: string }).role === role,
  );
  return block ? ((block as { items?: Record<string, unknown>[] }).items ?? []) : [];
}
function sectionBody(sec: Sec | undefined): string {
  return typeof sec?.body_md === 'string' ? sec.body_md : '';
}

function ratingClass(rating: string): string {
  if (rating === 'Excellent' || rating === 'Peak') return 'text-green-700 font-semibold';
  if (rating === 'Good' || rating === 'Improving') return 'text-lime-700 font-medium';
  if (rating === 'Building' || rating === 'Accessible') return 'text-gray-500';
  return 'text-orange-500';
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: 'en',
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== 'WebPage') ?? null,
    },
    content: { h1: page.meta.title },
  };
}

/** Visible FAQ HTML and FAQPage JSON-LD share this one array (AD-08). */
function buildStaticFaqSchema(route: string, faq: NonNullable<StaticPage['faq']>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${PRODUCTION_ORIGIN}${route}#faq`,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== 'published') return { title: 'Page Not Found' };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}

export default async function BestTimeToVisitPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== 'published') return notFound();

  const h1 = page.meta.title;
  const faqItems = page.faq ?? [];
  const faqSchema = faqItems.length ? buildStaticFaqSchema(ROUTE, faqItems) : null;

  const intro = sectionBody(findSection(page, 'intro'));
  const seasonCards = sectionGrid(
    findSection(page, 'season-verdict'),
    'season-cards',
  ) as unknown as SeasonCard[];
  const monthRows = sectionGrid(
    findSection(page, 'month-reference'),
    'month-table',
  ) as unknown as MonthRow[];
  const perDestination = sectionBody(findSection(page, 'per-destination'));
  const operatingNotes = sectionBody(findSection(page, 'operating-notes'));

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={staticPageRow(page) as any}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq
      />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/travel-guide" className="hover:text-primary">Travel Guide</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Best Time to Visit</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{h1}</h1>
          </header>

          {/* Intro */}
          <div className="mb-8">
            <MarkdownRendererTravelGuide markdown={intro} />
          </div>

          {/* Season verdict cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {seasonCards.map((card) => {
              const isDry = card.kind === 'dry';
              return (
                <div
                  key={card.kind}
                  className={`rounded-lg border-2 p-5 ${isDry ? 'border-lime-200 bg-lime-50' : 'border-blue-100 bg-blue-50'}`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDry ? 'text-lime-700' : 'text-blue-700'}`}
                  >
                    {card.label}
                  </p>
                  <p className="font-black text-lg text-gray-900">{card.range}</p>
                  <ul className="mt-3 text-sm space-y-1.5 text-gray-700">
                    {card.points.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className={`font-bold ${p.positive ? 'text-lime-600' : 'text-orange-500'}`}>
                          {p.positive ? '✓' : '✗'}
                        </span>{' '}
                        {p.text}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Month-by-month table */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Month-by-Month Quick Reference</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Month</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Bromo Sunrise</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ijen Blue Fire</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tumpak Sewu</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Crowds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthRows.map((row) => (
                    <tr key={row.month} className={row.sweet ? 'bg-lime-50' : ''}>
                      <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                        {row.month}
                        {row.sweet && <span className="ml-1.5 text-xs text-lime-700 font-bold">★</span>}
                      </td>
                      <td className={`px-3 py-2.5 ${ratingClass(row.bromo)}`}>{row.bromo}</td>
                      <td className={`px-3 py-2.5 ${ratingClass(row.ijen)}`}>{row.ijen}</td>
                      <td className={`px-3 py-2.5 ${ratingClass(row.tumpak)}`}>{row.tumpak}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.crowd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">★ sweet-spot months — best dry-season conditions with below-peak crowds</p>
          </section>

          {/* Per-destination breakdown */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Per-Destination Breakdown</h2>
            <MarkdownRendererTravelGuide markdown={perDestination} />
          </section>

          {/* JVTO operating notes */}
          <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-base font-bold mb-3 text-gray-900">JVTO Operating Notes</h2>
            <MarkdownRendererTravelGuide markdown={operatingNotes} />
          </section>

          {/* CTA */}
          <div className="mb-10">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Browse private tour packages →
            </Link>
          </div>

          {/* FAQ */}
          <Faq
            items={faqItems.map((f) => ({ q: f.question, a: f.answer }))}
            title="Seasonal Planning: Common Questions"
          />

        </div>
      </main>
    </div>
  );
}
