// src/components/design/HubHero.tsx
//
// PKG-11b shared hero primitive for the three tours-discovery routes
// (/tours, /tours/from-bali, /tours/from-surabaya). Before this the three
// heroes were three near-identical copies of the same 80 lines, which is why
// the routes were visually indistinguishable.
//
// CONTRACT
//   • Renders the ONE <h1> of its page inside the one hero landmark; `id` is
//     both the heading id and the landmark's accessible name.
//   • It carries NO copy. `eyebrow`, `title`, `lede`, `credentials`, the two
//     action labels and every `ledger` row are supplied by the route, which
//     owns them (content record or its own local constants). Differentiation
//     between the three routes is therefore purely a matter of what each route
//     passes in — the chrome stays one system.
//   • The ground is the same material <Section surface="navy"> paints — deep
//     floor gradient + contour texture — so the hero and the dark sections
//     below it read as one product.
//   • Reading order IS hierarchy order: eyebrow → h1 → deck → actions →
//     credential ledger. The primary action sits directly under the deck
//     instead of being pushed down by the credential row, and the right-hand
//     ledger is a <dl> so its label/value pairs are programmatically paired.
//   • Colour: the primary action is a lime fill with navy text (8.1:1). White
//     text on --color-jvto-orange measures 3.34:1, so orange is never used as
//     a fill behind small text here — it stays a large-display accent and an
//     ornament colour.
import type { ReactNode } from "react";
import Link from "@/components/website/AppLink";

export interface HubHeroAction {
  href: string;
  label: ReactNode;
}

export interface HubHeroProps {
  /** id of the <h1>; also the landmark's aria-labelledby target. */
  id: string;
  /** Short structural label above the headline. */
  eyebrow: string;
  /** Headline content — ReactNode so a route can accent one clause. */
  title: ReactNode;
  /** Deck paragraph. */
  lede: string;
  /** Credential strip, rendered as a hairline-separated mono row. */
  credentials: readonly string[];
  /** Primary then secondary action. */
  actions: readonly [HubHeroAction, HubHeroAction];
  /** Right-hand spec ledger: [label, value] pairs. */
  ledger: readonly (readonly [string, string])[];
}

export default function HubHero({
  id,
  eyebrow,
  title,
  lede,
  credentials,
  actions,
  ledger,
}: HubHeroProps) {
  const [primary, secondary] = actions;

  return (
    <section
      aria-labelledby={id}
      className="relative isolate overflow-hidden bg-jvto-navy pt-32 pb-14 text-white md:pt-40 md:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-jvto-navy-deep"
      />
      <div
        aria-hidden="true"
        className="jvto-topo pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-sm border border-jvto-lime/45 bg-jvto-lime/10 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-white uppercase">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-jvto-lime"
              />
              {eyebrow}
            </p>

            <h1
              id={id}
              className="font-jvto-heading text-[2.25rem] leading-[1.02] font-black tracking-[-0.03em] text-white sm:text-5xl md:text-[3.5rem] lg:text-[3.75rem]"
            >
              {title}
            </h1>

            {/* Survey mark tying the headline to the deck. */}
            <span
              aria-hidden="true"
              className="mt-6 mb-6 block h-0.5 w-16 bg-jvto-orange"
            />

            <p className="mb-9 max-w-2xl text-base leading-relaxed text-jvto-on-navy md:text-lg">
              {lede}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={primary.href}
                className="jvto-focus-dark inline-flex items-center justify-center gap-2 rounded-sm bg-jvto-lime px-7 py-3.5 text-center text-sm font-bold tracking-wider text-jvto-navy uppercase shadow-[0_12px_34px_-16px_rgba(140,198,63,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
              >
                {primary.label}
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href={secondary.href}
                className="jvto-focus-dark inline-flex items-center justify-center gap-2 rounded-sm border-2 border-white/40 bg-white/[0.04] px-7 py-3.5 text-center text-sm font-bold tracking-wider text-white uppercase transition-colors duration-200 hover:border-white/75 hover:bg-white/10"
              >
                {secondary.label}
              </Link>
            </div>

            <ul className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-5">
              {credentials.map((credential) => (
                <li
                  key={credential}
                  className="font-mono text-[10px] font-semibold tracking-[0.16em] text-jvto-on-navy-dim uppercase"
                >
                  {credential}
                </li>
              ))}
            </ul>
          </div>

          {/* Spec ledger — hairline-ruled label/value cells, the operational
              read that tells the three routes apart at a glance. */}
          <dl className="border-t border-white/15">
            {ledger.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white/10 py-3.5"
              >
                <dt className="font-mono text-[10px] font-semibold tracking-[0.2em] text-jvto-on-navy-dim uppercase">
                  {label}
                </dt>
                <dd className="font-jvto-heading text-base font-black text-white md:text-lg">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
