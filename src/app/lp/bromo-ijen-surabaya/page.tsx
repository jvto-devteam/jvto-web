import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ASSETS, BookButton, WaInquiry, TrustBar, PricingCard, LpFooter, fmt } from '../_shared';

export const metadata: Metadata = {
  title: 'Private Bromo & Ijen Tours from Surabaya — JVTO',
  description:
    'Police-led private volcano tours from Surabaya. Bromo sunrise, Ijen Blue Fire, all-inclusive packages from IDR 1,000,000/person. Book directly on our website.',
  robots: { index: false, follow: false },
};

const WA_HREF =
  'https://wa.me/6282244788833?text=' +
  encodeURIComponent('Hi JVTO, I have a question about the Bromo/Ijen tours from Surabaya.');

const PACKAGES = [
  {
    label: '1 Day Bromo Sunrise',
    slug: '/tours/from-surabaya/bromo-1d1n',
    duration: '1 day · 0 nights',
    includes: ['Private 4×4 jeep', 'Licensed guide', 'All park fees'],
    tiers: [
      { tier: '2 pax', price: 1_550_000 },
      { tier: '5–7 pax', price: 1_250_000 },
      { tier: '8–10 pax', price: 1_050_000 },
    ],
    from: 1_000_000,
  },
  {
    label: '2 Day Ijen Blue Fire',
    slug: '/tours/from-surabaya/ijen-2d1n',
    duration: '2 days · 1 night',
    includes: ['Private car', 'Licensed guide', 'Gas mask + screening', 'Hotel breakfast'],
    tiers: [
      { tier: '2 pax', price: 2_300_000 },
      { tier: '4–5 pax', price: 2_050_000 },
      { tier: '8–10 pax', price: 1_650_000 },
    ],
    from: 1_550_000,
  },
  {
    label: '3 Day Ijen · Bromo · Madakaripura',
    slug: '/tours/from-surabaya/ijen-bromo-madakaripura-3d2n',
    duration: '3 days · 2 nights',
    includes: ['Private car', 'Licensed guide', '2× hotel breakfast', 'Gas mask', '4×4 jeep', 'All fees'],
    tiers: [
      { tier: '2 pax', price: 3_570_000 },
      { tier: '4–5 pax', price: 3_050_000 },
      { tier: '8–10 pax', price: 2_550_000 },
    ],
    from: 2_450_000,
    featured: true,
  },
];

const GUIDES = [
  { name: 'Gufron', role: 'Senior Guide', url: ASSETS.crew.gufron },
  { name: 'Anjas', role: 'Photography & Guide', url: ASSETS.crew.anjas },
  { name: 'Boy', role: 'Guide', url: ASSETS.crew.boy },
  { name: 'Kiki', role: 'Ijen Specialist', url: ASSETS.crew.kiki },
];

export default function BromoIjenSurabayaLP() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Header ── */}
      <header className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" aria-label="Java Volcano Tour Operator homepage">
            <Image
              src={ASSETS.logo}
              alt="Java Volcano Tour Operator"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <BookButton href="/tours/from-surabaya" label="View All Tours" />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden bg-gray-950">
        <Image
          src={ASSETS.hero}
          alt="East Java volcanoes at sunrise"
          fill
          className="object-cover opacity-35"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 w-full px-4 py-20 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-lime-400">
            Private Tours · Departure from Surabaya
          </p>
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Bromo Sunrise &amp;<br className="hidden sm:block" /> Ijen Blue Fire
          </h1>
          <p className="mx-auto mb-2 max-w-xl text-lg text-gray-300">
            Police-led. Licensed. All-inclusive. Your private vehicle, your schedule.
          </p>
          <p className="mb-8 text-xs text-gray-500">
            NIB 1102230032918 · Tourist Police Officer Founder · Operating since 2015
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <BookButton href="/tours/from-surabaya" label="See All Surabaya Tours →" size="lg" />
            <WaInquiry waHref={WA_HREF} />
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <TrustBar items={[
        'KTA-licensed local guides',
        'Ijen health screening included',
        '20% deposit · non-expiring travel credit',
      ]} />

      {/* ── Founder / Police section ── */}
      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="relative mx-auto h-72 w-56 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl md:mx-0">
            <Image
              src={ASSETS.founder}
              alt="Agung Sambuko (Mr. Sam), Tourist Police Officer & JVTO Founder"
              fill
              className="object-cover object-top"
              sizes="224px"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-lime-600">
              Behind every tour
            </p>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight">
              Led by an Active<br /> Tourist Police Officer
            </h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Agung Sambuko (Mr. Sam) is the founder of JVTO and an active officer of
              the East Java Tourist Police Unit (Ditpamobvit, POLRI). Police discipline
              shapes every safety decision on our tours — from volcanic alert monitoring
              to guest evacuation protocols.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                NIB-licensed operator (PT Java Volcano Rendezvous, NIB 1102230032918)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                HPWKI member — East Java volcanic tourism industry body
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                Featured: Detik.com 2021 + Stefan Loose Reiseführer 2018
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Operational proof photo ── */}
      <section className="bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Real operations — not stock photos
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="relative col-span-2 h-52 overflow-hidden rounded-xl md:col-span-2">
              <Image
                src={ASSETS.policeEscortDay}
                alt="JVTO group with Tourist Police escort at hotel — Bondowoso"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
            <div className="relative h-52 overflow-hidden rounded-xl">
              <Image
                src={ASSETS.groupOffice}
                alt="International travelers at JVTO Bondowoso operations office"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            Tourist Police support · JVTO Bondowoso office · Real guest photos
          </p>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-2xl font-black tracking-tight">Available Packages</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Prices per person · private group · all fees included · book directly on our website
          </p>
          <div className="space-y-6">
            {PACKAGES.map((pkg) => (
              <PricingCard key={pkg.slug} pkg={pkg} waHref={WA_HREF} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Your guides ── */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-xl font-black">Your Guides — Local, Licensed, Real</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            KTA-licensed guides from East Java. Names you can verify.
          </p>
          <div className="grid grid-cols-4 gap-4">
            {GUIDES.map((g) => (
              <div key={g.name} className="text-center">
                <div className="relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <Image
                    src={g.url}
                    alt={`${g.name}, ${g.role} at JVTO`}
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </div>
                <p className="text-xs font-bold text-gray-900">{g.name}</p>
                <p className="text-xs text-gray-500">{g.role}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            See full team →{' '}
            <Link href="/why-jvto/our-team" className="underline hover:text-gray-600">
              why-jvto/our-team
            </Link>
          </p>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-gray-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-xl font-black">Trusted by Travelers Worldwide</h2>
          <p className="mb-6 text-sm text-gray-500">4.8★ on Trustpilot · 4.9★ on Google Maps</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { text: '"Police-led safety is real — not just marketing. Every detail was arranged."', author: 'Stefan L. · Germany · Trustpilot' },
              { text: '"Private jeep, no strangers, no waiting. Bromo sunrise was exactly as promised."', author: 'Rachel T. · Australia · Google' },
            ].map((r) => (
              <blockquote key={r.author} className="rounded-xl bg-white/5 p-5 text-left">
                <p className="mb-3 text-sm leading-relaxed text-gray-300">{r.text}</p>
                <footer className="text-xs text-gray-500">{r.author}</footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <BookButton href="/tours/from-surabaya" label="Book a Surabaya Tour →" />
            <WaInquiry waHref={WA_HREF} />
          </div>
        </div>
      </section>

      {/* ── Sticky mobile bar ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <BookButton href="/tours/from-surabaya" label="Book Now →" />
          <WaInquiry waHref={WA_HREF} />
        </div>
      </div>
      <div className="h-16 md:hidden" aria-hidden />

      <LpFooter />
    </div>
  );
}
