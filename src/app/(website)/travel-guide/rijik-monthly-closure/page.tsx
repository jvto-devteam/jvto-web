import type { Metadata } from 'next';
import Link from '@/components/website/AppLink';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import Sidebar from '../sidebar';
import { resolveFaqsForPage, buildResolvedFaqSchema } from '@/lib/content/resolveFaqs';
import { Faq } from '@/components/content/Faq';

const ROUTE = '/travel-guide/rijik-monthly-closure';

const PAGE_META = {
  title: "Ijen Rijik: The Monthly Closure Day at Kawah Ijen | JVTO",
  description:
    'TWA Ijen closes to all visitors on the first Friday of every month, since March 2019, for "Rijik" — a volunteer cleanup that removes an estimated 100–150 kg of trash from the crater. JVTO schedules every Ijen-inclusive itinerary around it.',
  h1: 'Ijen Rijik: The Monthly Closure Day at Kawah Ijen',
};

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

export const revalidate = 86400;

export const metadata: Metadata = {
  title: PAGE_META.title,
  description: PAGE_META.description,
};

export default async function RijikMonthlyClosurePage() {
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqSchema = buildResolvedFaqSchema(faqResolution, ROUTE);

  const pageRow = {
    route: ROUTE,
    lang: 'en',
    seo: { title: PAGE_META.title, description: PAGE_META.description },
    content: { h1: PAGE_META.h1 },
  };

  const faqItems = faqResolution.faqs.map((p) => ({ q: p.question, a: p.answer }));
  const upcomingClosures = getUpcomingRijikClosures(6);

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
              {PAGE_META.h1}
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pt-12">
          {/* Intro / lede */}
          <div className="prose max-w-none mb-8 text-gray-700">
            <p className="text-lg text-muted-foreground">
              Kawah Ijen closes to <strong>all</strong> visitors — not just JVTO guests — on the
              first Friday of every month. It has run this way since{' '}
              <strong>March 2019</strong>, for a volunteer conservation program called{' '}
              <strong>&ldquo;Rijik&rdquo;</strong> (Javanese for &ldquo;tidy&rdquo; / &ldquo;clean&rdquo;), during which
              park staff and volunteers descend into the crater area to remove an estimated{' '}
              <strong>100–150 kg of trash</strong> accumulated from tourism and mining traffic.
            </p>
            <p>
              It is a small, easily-missed fact — most independent travelers and even some
              tour operators don&rsquo;t track it — but arriving on a Rijik day means being turned
              away at the gate after a 01:00 AM wake-up call and a night trek to the crater rim.
              JVTO checks this calendar before confirming any Ijen-inclusive itinerary, so it
              never becomes a guest&rsquo;s problem.
            </p>
          </div>

          {/* What is Rijik */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">What Is the Rijik Cleanup Program?</h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                Rijik is a scheduled ecosystem-cleaning day at TWA Ijen (the Ijen Nature Tourism
                Park). On the first Friday of every month, the park closes to tourism and mining
                traffic so park staff and community volunteers can clear trash from the crater
                rim, the descent trail, and the shoreline of the sulfur lake — waste that
                accumulates from the steady flow of tourists and traditional sulfur miners
                between cleanups.
              </p>
              <p>
                Each session typically collects an estimated <strong>100–150 kg of trash</strong>.
                The program has run on this fixed monthly cadence since{' '}
                <strong>March 2019</strong>, making it a predictable, recurring closure rather
                than an emergency or unplanned event.
              </p>
            </div>
          </section>

          {/* Why it matters */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Why It Matters for Travelers</h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                Ijen night hikes are logistically unforgiving: guests are typically picked up
                from Bondowoso-area hotels around midnight to reach the crater rim in time for
                the blue-fire window before dawn. If a self-planned or unlicensed itinerary lands
                on a Rijik closure day, the outcome is a wasted pre-dawn wake-up and a turned-away
                group at the gate — with no advance warning, because the closure is a park
                operations detail, not something advertised on ticket-booking pages.
              </p>
              <p>
                No competitor operator publishes this fact in a dedicated guide. It is exactly
                the kind of operational detail that separates a licensed operator who tracks park
                administration from an itinerary assembled purely from generic travel-blog
                research.
              </p>
            </div>
          </section>

          {/* How JVTO handles it */}
          <section className="mb-10 rounded-lg border border-jvto-lime/30 bg-jvto-lime/5 p-5">
            <h2 className="text-base font-bold mb-3 text-gray-900">How JVTO Handles It</h2>
            <ul className="text-sm space-y-2.5 text-gray-700">
              <li>
                <strong>Checked before confirmation.</strong> JVTO checks the TWA Ijen closure
                calendar before confirming any Ijen-inclusive itinerary against a guest&rsquo;s
                requested travel dates.
              </li>
              <li>
                <strong>Rerouted, not cancelled.</strong> If a preferred travel window falls on
                the first Friday of the month, JVTO reorders the itinerary — for example,
                visiting Bromo or Madakaripura first — so the Rijik closure day never disrupts a
                confirmed booking. This follows the same alternative-route approach used for
                PVMBG-driven closures; see{' '}
                <Link href="/travel-guide/weather-and-closures" className="text-primary hover:underline font-medium">
                  Weather &amp; Closures
                </Link>.
              </li>
              <li>
                <strong>Not the same as a safety closure.</strong> Rijik is a fixed conservation
                closure, unrelated to PVMBG (volcanology) alert-status closures, which are
                unscheduled and driven by real-time gas and seismic monitoring.
              </li>
              <li>
                <strong>Covered by the same cancellation terms.</strong> In the rare case a
                closure makes a program genuinely unworkable, the standard 100% JVTO Travel
                Credit terms apply — see{' '}
                <Link href="/policy/booking-payment-cancellation" className="text-primary hover:underline font-medium">
                  Booking, Payment &amp; Cancellation Policy
                </Link>.
              </li>
            </ul>
          </section>

          {/* Upcoming closure dates */}
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
          <Faq items={faqItems} title="Ijen Rijik Closure: Common Questions" />
        </div>
      </main>
    </div>
  );
}
