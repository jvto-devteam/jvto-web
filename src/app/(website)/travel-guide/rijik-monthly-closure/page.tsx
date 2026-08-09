import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/website/AppLink';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import Sidebar from '../sidebar';
import { Faq } from '@/components/content/Faq';
import { MarkdownRendererTravelGuide } from '@/components/content/MarkdownRendererTravelGuide';
import {
  loadStaticPage,
  staticRouteCanonical,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from '@/lib/static-content';

// PACKAGE 04b (2026-08-06): the evergreen narrative + SEO + FAQ come from the static-content
// SSOT (content/pages/travel-guide/rijik-monthly-closure.json + content/faqs/…). The only
// dynamic element — the "Upcoming Rijik Closure Dates" table — is computed from the calendar
// here, so this route keeps its folder page (excluded from the [slug] loader's params). No
// getPageSeo / resolveFaqsForPage: the route is content-owned.

const ROUTE = '/travel-guide/rijik-monthly-closure';

export const revalidate = 86400;

type Sec = NonNullable<StaticPage['sections']>[number] & Record<string, unknown>;
function findSection(page: StaticPage, id: string): Sec | undefined {
  return page.sections?.find((s) => s.id === id) as Sec | undefined;
}
function sectionBody(sec: Sec | undefined): string {
  return typeof sec?.body_md === 'string' ? sec.body_md : '';
}
function sectionTitle(sec: Sec | undefined): string {
  return typeof sec?.title === 'string' ? sec.title : '';
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

/** First Friday of the given (UTC) year/month (month is 0-indexed). */
function getFirstFridayOfMonth(year: number, month: number): Date {
  const d = new Date(Date.UTC(year, month, 1));
  const FRIDAY = 5;
  const offset = (FRIDAY - d.getUTCDay() + 7) % 7;
  d.setUTCDate(1 + offset);
  return d;
}

/**
 * Upcoming Rijik closure dates (first Friday of each month), starting from the
 * current month if its first Friday has not yet passed, otherwise next month.
 * Purely computed from the calendar — no external data dependency.
 */
function getUpcomingRijikClosures(count: number, from: Date = new Date()): Date[] {
  let year = from.getUTCFullYear();
  let month = from.getUTCMonth();
  let candidate = getFirstFridayOfMonth(year, month);
  if (candidate.getTime() < from.getTime()) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    candidate = getFirstFridayOfMonth(year, month);
  }

  const results: Date[] = [];
  for (let i = 0; i < count; i++) {
    results.push(candidate);
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    candidate = getFirstFridayOfMonth(year, month);
  }
  return results;
}

function formatClosureDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== 'published') return { title: 'Page Not Found' };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

export default async function RijikMonthlyClosurePage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== 'published') return notFound();

  const h1 = page.meta.title;
  const faqItems = page.faq ?? [];
  const faqSchema = faqItems.length ? buildStaticFaqSchema(ROUTE, faqItems) : null;

  const intro = sectionBody(findSection(page, 'intro'));
  const whatIsRijik = findSection(page, 'what-is-rijik');
  const whyItMatters = findSection(page, 'why-it-matters');
  const howJvtoHandles = findSection(page, 'how-jvto-handles');

  const upcomingClosures = getUpcomingRijikClosures(6);

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={staticPageRow(page) as any}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq
      />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section className="bg-jvto-navy text-white pb-10 pt-8 md:pt-12">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/travel-guide" prefetch={false} className="hover:text-white transition-colors">
                Travel Guide
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">Ijen Rijik Monthly Closure</span>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              Since March 2019 · First Friday of every month
            </span>
            <h1
              className="font-black text-3xl md:text-5xl text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {h1}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pt-12">
          {/* Intro / lede */}
          <div className="mb-8">
            <MarkdownRendererTravelGuide markdown={intro} />
          </div>

          {/* What is Rijik */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">{sectionTitle(whatIsRijik)}</h2>
            <MarkdownRendererTravelGuide markdown={sectionBody(whatIsRijik)} />
          </section>

          {/* Why it matters */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">{sectionTitle(whyItMatters)}</h2>
            <MarkdownRendererTravelGuide markdown={sectionBody(whyItMatters)} />
          </section>

          {/* How JVTO handles it */}
          <section className="mb-10 rounded-lg border border-jvto-lime/30 bg-jvto-lime/5 p-5">
            <h2 className="text-base font-bold mb-3 text-gray-900">{sectionTitle(howJvtoHandles)}</h2>
            <MarkdownRendererTravelGuide markdown={sectionBody(howJvtoHandles)} />
          </section>

          {/* Upcoming closure dates — computed from the calendar (dynamic) */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Upcoming Rijik Closure Dates</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Computed from the fixed &ldquo;first Friday of the month&rdquo; schedule — not a
              guarantee against ad-hoc changes by park management, which JVTO also monitors.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Month</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">TWA Ijen Closed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcomingClosures.map((d) => (
                    <tr key={d.toISOString()}>
                      <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">
                        {d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700">{formatClosureDate(d)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            title="Ijen Rijik Closure: Common Questions"
          />
        </div>
      </main>
    </div>
  );
}
