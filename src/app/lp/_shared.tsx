// Shared components for /lp/* ads landing pages
import Link from 'next/link';

export const ASSETS = {
  hero: 'https://javavolcano-touroperator.com/assets/img/hero/home.webp',
  logo: 'https://javavolcano-touroperator.com/assets/img/jvto-color.png',
  founder: 'https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png',
  policeEscortDay: 'https://javavolcano-touroperator.com/ops/jvto-police-escort-arrival-hotel-bondowoso-day.jpg',
  policeVehicle: 'https://javavolcano-touroperator.com/ops/police-vehicle-support.jpg',
  barathaDepart: 'https://javavolcano-touroperator.com/ops/baratha-hotel-departure-team.jpg',
  groupOffice: 'https://javavolcano-touroperator.com/ops/group-at-jvto-office.jpg',
  ijenGeopark: 'https://javavolcano-touroperator.com/ops/ijen-geopark-briefing.png',
  screeningHotel: 'https://javavolcano-touroperator.com/screening/ijen-screening-hotel-01.jpeg',
  screeningOffice: 'https://javavolcano-touroperator.com/screening/jvto-office-screening-1.JPG',
  crew: {
    gufron: 'https://javavolcano-touroperator.com/uploads/1768225567764-405955176-gufron.png',
    boy: 'https://javavolcano-touroperator.com/uploads/1768228191022-893381041-boy.png',
    anjas: 'https://javavolcano-touroperator.com/uploads/1768270423657-690185912-anjas.png',
    kiki: 'https://javavolcano-touroperator.com/uploads/1768271545598-834784538-kiki.png',
    rendi: 'https://javavolcano-touroperator.com/uploads/1768228514527-518051332-rendi.png',
    taufik: 'https://javavolcano-touroperator.com/uploads/1768228083285-919198019-taufik_1_.png',
  },
} as const;

export const WA_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }} aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.849L.054 23.447a.5.5 0 0 0 .617.617l5.598-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.528-5.216-1.443l-.374-.221-3.878 1.023 1.023-3.878-.221-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

export function fmt(n: number) {
  return 'IDR ' + n.toLocaleString('id-ID');
}

export function BookButton({ href, label = 'Book This Tour →', size = 'md' }: {
  href: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const cls = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }[size];
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-gray-900 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-gray-700 active:scale-95 ${cls}`}
    >
      {label}
    </Link>
  );
}

export function WaInquiry({ waHref }: { waHref: string }) {
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
    >
      {WA_ICON}
      Questions? WhatsApp us
    </a>
  );
}

export function TrustBar({ items }: { items: string[] }) {
  return (
    <section className="border-b border-gray-100 bg-gray-50 px-4 py-4">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-gray-600">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-yellow-500">★</span> 4.8 / 5 · 47 reviews (Trustpilot)
        </span>
        {items.map((item) => (
          <span key={item}>
            <span className="text-lime-600 font-semibold">✓</span> {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function PricingCard({
  pkg,
  waHref,
}: {
  pkg: {
    label: string;
    slug: string;
    duration: string;
    includes: string[];
    tiers: { tier: string; price: number }[];
    from: number;
    featured?: boolean;
  };
  waHref: string;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${pkg.featured ? 'border-lime-400 bg-lime-50' : 'border-gray-200 bg-white'}`}>
      {pkg.featured && (
        <span className="mb-3 inline-block rounded-full bg-lime-500 px-3 py-0.5 text-xs font-bold text-white">
          Most Popular
        </span>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black">{pkg.label}</h3>
          <p className="text-sm text-gray-500">{pkg.duration}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">from</p>
          <p className="text-xl font-black text-gray-900">{fmt(pkg.from)}</p>
          <p className="text-xs text-gray-400">/person (IDR)</p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
              <th className="pb-1 font-medium">Group size</th>
              <th className="pb-1 text-right font-medium">Price/person</th>
            </tr>
          </thead>
          <tbody>
            {pkg.tiers.map((t) => (
              <tr key={t.tier} className="border-b border-gray-100 last:border-0">
                <td className="py-1.5 text-gray-700">{t.tier}</td>
                <td className="py-1.5 text-right font-semibold text-gray-900">{fmt(t.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {pkg.includes.map((inc) => (
          <li key={inc} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            ✓ {inc}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <BookButton href={pkg.slug} label="Book This Tour →" />
        <WaInquiry waHref={waHref} />
      </div>
    </div>
  );
}

export function LpFooter({ policyHref = '/policy/booking-payment-cancellation' }: { policyHref?: string }) {
  return (
    <footer className="border-t border-gray-100 px-4 py-6 text-center text-xs text-gray-400">
      <p>PT Java Volcano Rendezvous · NIB 1102230032918 · Bondowoso, East Java</p>
      <p className="mt-1">
        <Link href={policyHref} className="hover:text-gray-600 underline">Booking Policy</Link>
        {' · '}
        <Link href="/verify-jvto" className="hover:text-gray-600 underline">Verify Our Credentials</Link>
        {' · '}
        <Link href="/" className="hover:text-gray-600 underline">Main Website</Link>
      </p>
    </footer>
  );
}
