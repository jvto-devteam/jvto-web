import type { Metadata } from 'next';
import Link from 'next/link';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import Sidebar from '../sidebar';
import { loadStaticPage, buildStaticRouteMetadata } from '@/lib/static-content';
import { Faq } from '@/components/content/Faq';
import { MarkdownRendererTravelGuide } from '@/components/content/MarkdownRendererTravelGuide';

const ROUTE = '/travel-guide/best-time-to-visit';
const SITE_URL = 'https://javavolcano-touroperator.com';

// Fallback copy — only used if content/pages/travel-guide/best-time-to-visit.json
// is ever unavailable at build/runtime (should not happen; kept for safety).
const PAGE_META = {
  title: 'Best Time to Visit Bromo, Ijen & Tumpak Sewu | JVTO',
  description:
    'Dry season (May–Oct) is optimal for Bromo, Ijen blue fire, and Tumpak Sewu. JVTO private tours run year-round — monthly conditions guide for each destination.',
  h1: 'Best Time to Visit East Java: Bromo, Ijen & Tumpak Sewu',
};

// Shapes of the two `blocks[0].items` grid roles this page consumes
// (content/pages/travel-guide/best-time-to-visit.json — `season-cards` / `month-table`).
type SeasonCardItem = {
  kind: string;
  label: string;
  range: string;
  points: { positive: boolean; text: string }[];
};

type MonthRow = {
  month: string;
  bromo: string;
  ijen: string;
  tumpak: string;
  crowd: string;
  sweet: boolean;
};

function ratingClass(rating: string): string {
  if (rating === 'Excellent' || rating === 'Peak') return 'text-green-700 font-semibold';
  if (rating === 'Good' || rating === 'Improving') return 'text-lime-700 font-medium';
  if (rating === 'Building' || rating === 'Accessible') return 'text-gray-500';
  return 'text-orange-500';
}

function seasonCardClasses(kind: string) {
  if (kind === 'wet') {
    return {
      card: 'rounded-lg border-2 border-blue-100 bg-blue-50 p-5',
      label: 'text-xs font-bold uppercase tracking-wider text-blue-700 mb-1',
    };
  }
  return {
    card: 'rounded-lg border-2 border-lime-200 bg-lime-50 p-5',
    label: 'text-xs font-bold uppercase tracking-wider text-lime-700 mb-1',
  };
}

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? PAGE_META.title;
  const description = page?.meta.description ?? PAGE_META.description;
  return buildStaticRouteMetadata(ROUTE, { title, description });
}

export default async function BestTimeToVisitPage() {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? PAGE_META.title;
  const description = page?.meta.description ?? PAGE_META.description;
  const h1 = page?.meta.title ?? PAGE_META.h1;
  const sections = page?.sections ?? [];

  const introSection = sections.find((s) => s.id === 'intro');
  const seasonSection = sections.find((s) => s.id === 'season-verdict');
  const monthSection = sections.find((s) => s.id === 'month-reference');
  const destSection = sections.find((s) => s.id === 'per-destination');
  const notesSection = sections.find((s) => s.id === 'operating-notes');

  const seasonItems = ((seasonSection?.blocks?.[0] as any)?.items ?? []) as SeasonCardItem[];
  const monthItems = ((monthSection?.blocks?.[0] as any)?.items ?? []) as MonthRow[];

  const pageRow = {
    route: ROUTE,
    lang: 'en',
    seo: { title, description },
    content: { h1 },
  };

  const faqItems = (page?.faq ?? []).map((f) => ({ q: f.question, a: f.answer }));
  const faqSchema = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${ROUTE}#faq`,
        mainEntity: faqItems.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      }
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq={true}
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

          {/* Intro — content/pages/travel-guide/best-time-to-visit.json § intro */}
          {introSection?.body_md && (
            <div className="mb-8">
              <MarkdownRendererTravelGuide markdown={introSection.body_md} />
            </div>
          )}

          {/* Season verdict cards — § season-verdict (blocks[0].items, role: season-cards) */}
          {seasonItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {seasonItems.map((item) => {
                const cls = seasonCardClasses(item.kind);
                return (
                  <div key={item.kind} className={cls.card}>
                    <p className={cls.label}>{item.label}</p>
                    <p className="font-black text-lg text-gray-900">{item.range}</p>
                    <ul className="mt-3 text-sm space-y-1.5 text-gray-700">
                      {item.points.map((pt, i) => (
                        <li key={i} className="flex gap-2">
                          <span className={`font-bold ${pt.positive ? 'text-lime-600' : 'text-orange-500'}`}>
                            {pt.positive ? '✓' : '✗'}
                          </span>
                          {pt.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* Month-by-month table — § month-reference (blocks[0].items, role: month-table) */}
          {monthItems.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">
                {monthSection?.title ?? 'Month-by-Month Quick Reference'}
              </h2>
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
                    {monthItems.map((row) => (
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
          )}

          {/* Per-destination breakdown — § per-destination */}
          {destSection?.body_md && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">
                {destSection.title ?? 'Per-Destination Breakdown'}
              </h2>
              <MarkdownRendererTravelGuide markdown={destSection.body_md} />
            </section>
          )}

          {/* JVTO operating notes — § operating-notes */}
          {notesSection?.body_md && (
            <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-base font-bold mb-3 text-gray-900">
                {notesSection.title ?? 'JVTO Operating Notes'}
              </h2>
              <MarkdownRendererTravelGuide markdown={notesSection.body_md} />
            </section>
          )}

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
          <Faq items={faqItems} title="Seasonal Planning: Common Questions" />

        </div>
      </main>
    </div>
  );
}
