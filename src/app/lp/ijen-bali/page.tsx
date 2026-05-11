import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ASSETS, BookButton, WaInquiry, TrustBar, PricingCard, LpFooter } from '../_shared';

export const metadata: Metadata = {
  title: 'Private Ijen Blue Fire Tour from Bali — JVTO',
  description:
    'Police-led private Ijen Blue Fire & Bromo tour from Bali. Ferry Ketapang–Gilimanuk included. All-inclusive from IDR 2,850,000/person. Book directly on our website.',
  robots: { index: false, follow: false },
};

const WA_HREF =
  'https://wa.me/6282244788833?text=' +
  encodeURIComponent('Hi JVTO, I have a question about the Ijen Blue Fire tour from Bali.');

const PACKAGES = [
  {
    label: '3 Day Bromo & Ijen from Bali',
    slug: '/tours/from-bali/bromo-ijen-3d2n',
    duration: '3 days · 2 nights · ferry included',
    includes: ['Ferry Bali–Java included', 'Private car', 'Licensed guide', '4×4 jeep', 'Gas mask + screening', '2× hotel breakfast', 'All fees'],
    tiers: [
      { tier: '2 pax', price: 4_050_000 },
      { tier: '4–5 pax', price: 3_550_000 },
      { tier: '8–10 pax', price: 3_050_000 },
    ],
    from: 2_850_000,
    featured: true,
  },
  {
    label: '3 Day Ijen · Bromo · Madakaripura from Bali',
    slug: '/tours/from-bali/ijen-bromo-madakaripura-3d2n',
    duration: '3 days · 2 nights · ferry included',
    includes: ['Ferry Bali–Java included', 'Private car', 'Licensed guide', '4×4 jeep', 'Gas mask + screening', '2× hotel breakfast', 'All fees'],
    tiers: [
      { tier: '2 pax', price: 4_050_000 },
      { tier: '4–5 pax', price: 3_550_000 },
      { tier: '8–10 pax', price: 3_050_000 },
    ],
    from: 2_850_000,
  },
];

export default function IjenBaliLP() {
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
          <BookButton href="/tours/from-bali" label="View All Bali Tours" />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden bg-gray-950">
        <Image
          src={ASSETS.hero}
          alt="East Java volcanoes — Ijen crater and surroundings"
          fill
          className="object-cover opacity-35"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 w-full px-4 py-20 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-lime-400">
            Private Tours · Departure from Bali · Ferry Included
          </p>
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Ijen Blue Fire &amp;<br className="hidden sm:block" /> Bromo from Bali
          </h1>
          <p className="mx-auto mb-2 max-w-xl text-lg text-gray-300">
            Cross-island private tour. Ferry Ketapang–Gilimanuk included. Police-led, all-inclusive.
          </p>
          <p className="mb-8 text-xs text-gray-500">
            NIB 1102230032918 · Tourist Police Officer Founder · Operating since 2015
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <BookButton href="/tours/from-bali" label="See All Bali Tours →" size="lg" />
            <WaInquiry waHref={WA_HREF} />
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <TrustBar items={[
        'Ferry Ketapang–Gilimanuk included',
        'Ijen health screening + gas mask',
        'Drop-off Bali or Surabaya',
      ]} />

      {/* ── Ijen health screening — unique differentiator ── */}
      <section className="px-4 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-lime-600">
              Mandatory for Ijen — included in your tour
            </p>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight">
              Health Screening<br /> Before Every Ijen Trek
            </h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Per BBKSDA regulation SE.1658/KSA.9/2024, all Ijen crater visitors
              must present a clinic-issued health clearance before entering. JVTO
              arranges this at your hotel the evening before — blood pressure, SpO₂
              check, and signed surat sehat. No extra cost. No bureaucracy for you.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                Licensed nurse visits your hotel — no clinic trip required
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                Gas mask provided as standard on all Ijen routes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                Digital health clearance — Dr. Ahmad Irwandanu, Klinik Bakti Husada
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-48 overflow-hidden rounded-xl shadow-md">
              <Image
                src={ASSETS.screeningHotel}
                alt="Pre-Ijen health screening — nurse checking blood pressure at hotel"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-xl shadow-md">
              <Image
                src={ASSETS.screeningOffice}
                alt="Health screening at JVTO office before Ijen climb"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder + police escort ── */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 order-2 md:order-1">
            <div className="relative h-52 overflow-hidden rounded-xl shadow-md">
              <Image
                src={ASSETS.founder}
                alt="Agung Sambuko (Mr. Sam), Tourist Police Officer & JVTO Founder"
                fill
                className="object-cover object-top"
                sizes="50vw"
              />
            </div>
            <div className="relative h-52 overflow-hidden rounded-xl shadow-md">
              <Image
                src={ASSETS.barathaDepart}
                alt="Tourist Police support at Baratha Hotel — pre-Ijen departure"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-lime-600">
              Police-led safety — not a marketing claim
            </p>
            <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight">
              An Active Tourist Police<br /> Officer Runs These Tours
            </h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Agung Sambuko (Mr. Sam), founder of JVTO, is an active officer of the
              East Java Tourist Police Unit. Police discipline drives every safety
              decision — from PVMBG volcanic monitoring to guest evacuation drills.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                Licensed by NIB 1102230032918 (PT Java Volcano Rendezvous)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                HPWKI member + BBKSDA-compliant Ijen operations
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-lime-600 font-bold">✓</span>
                4.8★ Trustpilot (47 reviews) · 4.9★ Google Maps (92 reviews)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-2xl font-black tracking-tight">Available Packages</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Prices per person · private group · all fees + ferry included · book directly on our website
          </p>
          <div className="space-y-6">
            {PACKAGES.map((pkg) => (
              <PricingCard key={pkg.slug} pkg={pkg} waHref={WA_HREF} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-gray-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-2 text-xl font-black">What Bali Guests Say</h2>
          <p className="mb-6 text-sm text-gray-500">4.8★ on Trustpilot · 4.9★ on Google Maps</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { text: '"The ferry crossing was seamless — JVTO handled everything. Blue fire at Ijen was unforgettable."', author: 'Mark H. · UK · Trustpilot' },
              { text: '"Best decision: booking a private tour. No waiting, just us and the guide at the crater rim."', author: 'Anna P. · Netherlands · Google' },
            ].map((r) => (
              <blockquote key={r.author} className="rounded-xl bg-white/5 p-5 text-left">
                <p className="mb-3 text-sm leading-relaxed text-gray-300">{r.text}</p>
                <footer className="text-xs text-gray-500">{r.author}</footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <BookButton href="/tours/from-bali" label="Book a Bali Tour →" />
            <WaInquiry waHref={WA_HREF} />
          </div>
        </div>
      </section>

      {/* ── Sticky mobile bar ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <BookButton href="/tours/from-bali" label="Book Now →" />
          <WaInquiry waHref={WA_HREF} />
        </div>
      </div>
      <div className="h-16 md:hidden" aria-hidden />

      <LpFooter />
    </div>
  );
}
