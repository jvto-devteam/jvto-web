import type { Metadata } from 'next';
import Link from 'next/link';
import { PageJsonLdCombined } from '@/components/seo/PageJsonLdCombined';
import Sidebar from '../sidebar';
import { resolveFaqsForPage, buildResolvedFaqSchema } from '@/lib/content/resolveFaqs';
import { Faq } from '@/components/content/Faq';

const ROUTE = '/travel-guide/best-time-to-visit';

const PAGE_META = {
  title: 'Best Time to Visit Bromo, Ijen & Tumpak Sewu | JVTO',
  description:
    'Dry season (May–Oct) is optimal for Bromo, Ijen blue fire, and Tumpak Sewu. JVTO private tours run year-round — monthly conditions guide for each destination.',
  h1: 'Best Time to Visit East Java: Bromo, Ijen & Tumpak Sewu',
};

const MONTHLY_DATA = [
  { month: 'January',   bromo: 'Variable',  ijen: 'Accessible', tumpak: 'Peak',      crowd: 'Low',    sweet: false },
  { month: 'February',  bromo: 'Variable',  ijen: 'Accessible', tumpak: 'Peak',      crowd: 'Low',    sweet: false },
  { month: 'March',     bromo: 'Improving', ijen: 'Good',       tumpak: 'Excellent', crowd: 'Low',    sweet: false },
  { month: 'April',     bromo: 'Good',      ijen: 'Good',       tumpak: 'Excellent', crowd: 'Low',    sweet: false },
  { month: 'May',       bromo: 'Excellent', ijen: 'Excellent',  tumpak: 'Good',      crowd: 'Medium', sweet: true  },
  { month: 'June',      bromo: 'Excellent', ijen: 'Excellent',  tumpak: 'Good',      crowd: 'Medium', sweet: false },
  { month: 'July',      bromo: 'Excellent', ijen: 'Excellent',  tumpak: 'Good',      crowd: 'High',   sweet: false },
  { month: 'August',    bromo: 'Excellent', ijen: 'Excellent',  tumpak: 'Good',      crowd: 'High',   sweet: false },
  { month: 'September', bromo: 'Excellent', ijen: 'Excellent',  tumpak: 'Good',      crowd: 'Medium', sweet: true  },
  { month: 'October',   bromo: 'Good',      ijen: 'Good',       tumpak: 'Good',      crowd: 'Low',    sweet: false },
  { month: 'November',  bromo: 'Variable',  ijen: 'Variable',   tumpak: 'Building',  crowd: 'Low',    sweet: false },
  { month: 'December',  bromo: 'Variable',  ijen: 'Accessible', tumpak: 'Building',  crowd: 'Low',    sweet: false },
];

function ratingClass(rating: string): string {
  if (rating === 'Excellent' || rating === 'Peak') return 'text-green-700 font-semibold';
  if (rating === 'Good' || rating === 'Improving') return 'text-lime-700 font-medium';
  if (rating === 'Building' || rating === 'Accessible') return 'text-gray-500';
  return 'text-orange-500';
}

export const revalidate = 86400;

export const metadata: Metadata = {
  title: PAGE_META.title,
  description: PAGE_META.description,
};

export default async function BestTimeToVisitPage() {
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqSchema = buildResolvedFaqSchema(faqResolution, ROUTE);

  const pageRow = {
    route: ROUTE,
    lang: 'en',
    seo: { title: PAGE_META.title, description: PAGE_META.description },
    content: { h1: PAGE_META.h1 },
  };

  const faqItems = faqResolution.faqs.map((p) => ({ q: p.question, a: p.answer }));

  return (
    <div className="flex min-h-screen bg-background">
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
            <h1 className="text-3xl font-semibold tracking-tight">{PAGE_META.h1}</h1>
          </header>

          {/* Intro */}
          <div className="prose max-w-none mb-8 text-gray-700">
            <p>JVTO operates year-round private tours to Bromo, Ijen, and Tumpak Sewu. The best month depends on which destination is your priority — there is no single perfect season for all three at once.</p>
            <p>The short answer: <strong>dry season (May–October)</strong> gives the clearest Bromo sunrises and safest Ijen night hikes. <strong>Wet season (November–April)</strong> peaks Tumpak Sewu waterfall volume. <strong>May and September</strong> hit the sweet spot — dry conditions with fewer crowds than July–August peak.</p>
          </div>

          {/* Season verdict cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="rounded-lg border-2 border-lime-200 bg-lime-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-lime-700 mb-1">Dry Season</p>
              <p className="font-black text-lg text-gray-900">May – October</p>
              <ul className="mt-3 text-sm space-y-1.5 text-gray-700">
                <li className="flex gap-2"><span className="text-lime-600 font-bold">✓</span> Clearest Bromo sunrises</li>
                <li className="flex gap-2"><span className="text-lime-600 font-bold">✓</span> Best Ijen blue fire visibility</li>
                <li className="flex gap-2"><span className="text-lime-600 font-bold">✓</span> Drier, safer Tumpak Sewu trail</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">✗</span> July–Aug peak crowds — book 3–4 weeks ahead</li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Wet Season</p>
              <p className="font-black text-lg text-gray-900">November – April</p>
              <ul className="mt-3 text-sm space-y-1.5 text-gray-700">
                <li className="flex gap-2"><span className="text-lime-600 font-bold">✓</span> Tumpak Sewu at maximum volume</li>
                <li className="flex gap-2"><span className="text-lime-600 font-bold">✓</span> Lowest crowds and best accommodation rates</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">✗</span> Cloudier Bromo dawns (still possible)</li>
                <li className="flex gap-2"><span className="text-orange-500 font-bold">✗</span> Slippery trail descent at Tumpak Sewu</li>
              </ul>
            </div>
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
                  {MONTHLY_DATA.map((row) => (
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
          <section className="mb-10 space-y-8">
            <h2 className="text-xl font-bold">Per-Destination Breakdown</h2>

            <div>
              <h3 className="text-lg font-bold mb-2">Mount Bromo</h3>
              <p className="text-sm text-gray-700 leading-relaxed">The classic Bromo sunrise requires cloud-free skies at Penanjakan viewpoint (2,770 m) at around 05:00 AM. This is most reliable <strong>May through September</strong>, when dry south-east trade winds clear the caldera overnight. July and August have the best weather reliability but also the highest visitor numbers — expect 50+ jeeps at the viewpoint in peak months.</p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">The <strong>April and October shoulder months</strong> offer nearly identical conditions with noticeably fewer tourists and lower jeep rates. In the wet season (November–March), clear mornings still occur — roughly 50–60% of departures based on JVTO operational records. We monitor BMKG forecasts the evening before each tour.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Ijen Crater &amp; Blue Fire</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Ijen blue fire — burning sulfur gases at the active crater lake — is visible <strong>year-round</strong> on JVTO night hikes. The seasonal difference is visibility inside the crater: <strong>May to October</strong> provides the lowest humidity and clearest conditions for photographing blue flames. Pre-dawn temperatures at the crater rim drop to <strong>5–8°C in July–August</strong> — bring a warm jacket regardless of departure month.</p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">JVTO includes a gas mask for all Ijen guests as standard. Sulfur gas is a daily operational reality regardless of season — our guides monitor PVMBG volcanic activity levels before each tour. See: <Link href="/travel-guide/ijen-health-screening" className="text-primary hover:underline font-medium">Ijen Health Screening (SE.1658 protocol)</Link>.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Tumpak Sewu Waterfall</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Tumpak Sewu is genuinely more spectacular in the wet season. <strong>January through April</strong> brings peak water volume — the curtain of 120+ individual falls is at its widest and most powerful. If maximum waterfall impact is your goal, plan for this window. The trade-off is that the 1.5 km descent trail through Glidih Canyon becomes slippery, with rope-assisted sections requiring care.</p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">From <strong>May to October</strong>, the trail is drier and safer. The waterfall flow remains impressive (rivers are fed by mountain springs, not only rain). JVTO guides carry the necessary ropes and assess trail safety on arrival before starting the descent.</p>
            </div>
          </section>

          {/* JVTO operating notes */}
          <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-base font-bold mb-3 text-gray-900">JVTO Operating Notes</h2>
            <ul className="text-sm space-y-2.5 text-gray-700">
              <li><strong>We operate year-round.</strong> Rainy season is not an automatic cancellation trigger. We make go/no-go decisions based on real-time BMKG (weather) and PVMBG (volcanic activity) data the evening before each tour.</li>
              <li><strong>Weather risk is covered by Travel Credit.</strong> If a tour must be modified or cut short due to weather or volcanic closure, guests receive JVTO Travel Credit (non-expiring) for the affected portion. Read: <Link href="/travel-guide/weather-and-closures" className="text-primary hover:underline">Weather &amp; Closures policy</Link>.</li>
              <li><strong>Peak season booking advice.</strong> For July and August departures, book at least 3–4 weeks in advance. Accommodation in the Tengger Caldera area and Banyuwangi fills quickly during European summer holidays and Indonesian National Day week.</li>
            </ul>
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
          <Faq items={faqItems} title="Seasonal Planning: Common Questions" />

        </div>
      </main>
    </div>
  );
}
