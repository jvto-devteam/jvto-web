# JVTO Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing JVTO homepage with a 9-section Narrative Arc layout (HomeHero → HomeTrustStrip → HomeDestinations → HomeTours → HomeHowItWorks → HomeReviews → HomeTravelGuideTeaser → HomeWhyJVTO → HomeCTA) derived from full website content analysis — not from the prior homepage.

**Architecture:** 10 new components in `src/components/website/Home/`, 1 client component (`HomeToursClient.tsx`) for the tab switcher, all others are server components. Data fetched in `page.tsx` via `Promise.all` and passed as props. AEO schema block in `page.tsx` is preserved verbatim — untouched.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, `next/image`, `@/components/website/AppLink` (never `next/link`), Lucide icons, Rubik font via `--font-heading` CSS variable.

---

## Critical Rules (read before starting)

- **AEO schema**: `PageJsonLdCombined` and all `extraSchemas` in `page.tsx` — do NOT modify. They are invisible JSON-LD output only. Preserve every line verbatim.
- **Link component**: Always `import Link from "@/components/website/AppLink"`. Never use `next/link` directly.
- **Image component**: Always `import Image from "next/image"` with explicit `sizes` prop.
- **Slug → href**: `PackageListItem.slug` already contains the full path (e.g. `tours/from-surabaya/bromo-1d1n`). Use `` href={`/${pkg.slug}`} `` — never `/tours/${pkg.slug}`.
- **Section padding**: `py-20 md:py-28` on every `<section>`. Container: `max-w-7xl mx-auto px-6 md:px-8`.
- **Font heading**: Apply via `style={{ fontFamily: "var(--font-heading)" }}` on H1/H2 tags. The CSS variable is set in `src/app/(website)/website.css`.
- **No test framework**: This project has no Jest/Vitest. Verification is: TypeScript check (`npx tsc --noEmit`) + visual browser check + `npm run build`.

---

## File Map

| Action | File |
|---|---|
| CREATE | `src/components/website/Home/HomeHero.tsx` |
| CREATE | `src/components/website/Home/HomeTrustStrip.tsx` |
| CREATE | `src/components/website/Home/HomeDestinations.tsx` |
| CREATE | `src/components/website/Home/HomeToursClient.tsx` |
| CREATE | `src/components/website/Home/HomeTours.tsx` |
| CREATE | `src/components/website/Home/HomeHowItWorks.tsx` |
| CREATE | `src/components/website/Home/HomeReviews.tsx` |
| CREATE | `src/components/website/Home/HomeTravelGuideTeaser.tsx` |
| CREATE | `src/components/website/Home/HomeWhyJVTO.tsx` |
| CREATE | `src/components/website/Home/HomeCTA.tsx` |
| MODIFY | `src/app/(website)/page.tsx` |
| DELETE | `src/components/website/Home/Hero.tsx` |
| DELETE | `src/components/website/Home/Differentiators.tsx` |
| DELETE | `src/components/website/Home/FeaturedTours.tsx` |
| DELETE | `src/components/website/Home/FeaturedToursClient.tsx` |
| DELETE | `src/components/website/Home/Reviews.tsx` |
| DELETE | `src/components/website/Home/ReviewsClient.tsx` |
| DELETE | `src/components/website/Home/HomeReviewsStatic.tsx` |
| DELETE | `src/components/website/Home/TrustVerification.tsx` |
| DELETE | `src/components/website/Home/WhyJVTO.tsx` |
| DELETE | `src/components/website/Home/HomeCTA.tsx` (old) |
| DELETE | `src/components/website/Home/HomeDestinations.tsx` (old) |
| DELETE | `src/components/website/Home/Destinations.tsx` |
| DELETE | `src/components/website/Home/TravelGuideTeaser.tsx` |

**DO NOT delete:** `Features.tsx`, `Testimonials.tsx`, `TourRowClient.tsx`, `IjenHealthScreeningSection.tsx`, `IsicSection.tsx`, `LevelSelector.tsx`, `Trustpilot.css` — check for outside imports before touching any of these.

---

## Task 1: HomeHero — Full-screen photography hero

**Files:**
- Create: `src/components/website/Home/HomeHero.tsx`

Background photo is the LCP element — must use `<Image fill priority>`. The H1 receives its text from the CMS/fallback via `page.tsx` props. Description prop is screen-reader only (SEO value, not visual).

- [ ] **Step 1: Create HomeHero.tsx**

```tsx
// src/components/website/Home/HomeHero.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";

interface HomeHeroProps {
  title: string;
  description: string;
}

export default function HomeHero({ title, description }: HomeHeroProps) {
  return (
    <section className="relative min-h-[100svh] flex items-center">
      {/* LCP: background photo — priority ensures preload */}
      <Image
        src="/assets/img/hero/home.webp"
        alt="Mount Bromo volcano at sunrise — Java Volcano Tour Operator"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay — dark enough to read, light enough to see mountain */}
      <div className="absolute inset-0 bg-gradient-to-b from-jvto-navy/90 via-jvto-navy/40 to-jvto-navy/80" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full py-20">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          {/* Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-widest text-jvto-green/90 mb-4">
            Est. 2015 · Bondowoso, East Java · Tourist Police-Led
          </p>

          {/* H1 */}
          <h1
            className="font-black text-5xl md:text-7xl leading-tight text-white mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>

          {/* Screen-reader description (SEO signal, not visible) */}
          <p className="sr-only">{description}</p>

          {/* Subtext */}
          <p className="text-base md:text-lg text-white/70 max-w-xl mb-8">
            16 private packages to Bromo, Ijen, and East Java&apos;s best.
            Licensed operator. No shared groups. All-inclusive.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/tours"
              className="bg-jvto-green text-jvto-navy font-black px-6 py-3 rounded-full text-sm text-center hover:bg-jvto-green/90 transition-colors"
            >
              Browse Tours ↗
            </Link>
            <Link
              href="/verify-jvto"
              className="border border-white/50 text-white font-bold px-6 py-3 rounded-full text-sm text-center hover:border-white/80 transition-colors"
            >
              Verify Credentials →
            </Link>
          </div>

          {/* Stats bar */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
              {["4.8★ Trustpilot / 51", "4.9★ Google / 92", "16 Packages", "Est. 2015"].map(
                (stat) => (
                  <span key={stat} className="text-xs font-bold text-white/60 uppercase tracking-wide">
                    {stat}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeHero" | head -10
```

Expected: no output (no errors for this file).

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeHero.tsx
git commit -m "feat(home): add HomeHero — photography-first hero with stats bar"
```

---

## Task 2: HomeTrustStrip — 4 credential badges

**Files:**
- Create: `src/components/website/Home/HomeTrustStrip.tsx`

Compact credential display strip. No links — credential display only. Renders between hero and destinations.

- [ ] **Step 1: Create HomeTrustStrip.tsx**

```tsx
// src/components/website/Home/HomeTrustStrip.tsx
import { ShieldCheck, Star, FileText, MapPin } from "lucide-react";

const CREDENTIALS = [
  { Icon: ShieldCheck, text: "Tourist Police (POLPAR)" },
  { Icon: Star, text: "Trustpilot 4.8★ · 51 Reviews" },
  { Icon: FileText, text: "NIB 1102230032918" },
  { Icon: MapPin, text: "Physical Office · Bondowoso" },
] as const;

export default function HomeTrustStrip() {
  return (
    <div className="bg-jvto-off border-b border-jvto-navy/10">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 py-4 px-6">
        {CREDENTIALS.map(({ Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-sm font-semibold text-jvto-navy/80"
          >
            <Icon size={16} className="text-jvto-green flex-shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeTrustStrip" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeTrustStrip.tsx
git commit -m "feat(home): add HomeTrustStrip — 4 credentials inline below hero"
```

---

## Task 3: HomeDestinations — 5 photo cards

**Files:**
- Create: `src/components/website/Home/HomeDestinations.tsx`

**Important:** The `Destination` interface (`src/interfaces.ts`) does not include a `highlight` field, but the underlying JSON snapshot does. Use the local `DEST_HIGHLIGHTS` map as the primary source. This is more reliable than type-asserting an untyped field.

Mobile: horizontal scroll with snap. Desktop: 5-column grid.

- [ ] **Step 1: Create HomeDestinations.tsx**

```tsx
// src/components/website/Home/HomeDestinations.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { Destination } from "@/interfaces";

// Canonical 1-line highlight per destination (matches destinationListSnapshot.json values)
const DEST_HIGHLIGHTS: Record<string, string> = {
  "mount-bromo": "Sunrise over Tengger Caldera",
  "ijen-crater": "Blue Fire at 2am",
  "tumpak-sewu-waterfall": "Niagara of East Java",
  "papuma-beach": "Hidden beach, East Java coast",
  "madakaripura-waterfall": "Sacred waterfall, Majapahit heritage",
};

interface HomeDestinationsProps {
  destinations: Destination[];
}

export default function HomeDestinations({ destinations }: HomeDestinationsProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Destinations
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-10"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Explore East Java&apos;s Volcanoes
        </h2>

        {/* Mobile: horizontal scroll. Desktop: 5-col grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {destinations.map((dest) => {
            const highlight = DEST_HIGHLIGHTS[dest.slug] ?? "";
            return (
              <div
                key={dest.slug}
                className="relative overflow-hidden rounded-2xl aspect-[2/3] flex-shrink-0 w-48 md:w-auto snap-start"
              >
                <Image
                  src={dest.banner.url}
                  alt={dest.banner.alt}
                  fill
                  sizes="(max-width:768px) 50vw, 20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-black text-white text-base leading-tight mb-1">
                    {dest.name}
                  </p>
                  {highlight && (
                    <p className="text-white/70 text-xs mb-2">{highlight}</p>
                  )}
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-jvto-green text-xs font-bold hover:underline"
                  >
                    View Tours →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeDestinations" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeDestinations.tsx
git commit -m "feat(home): add HomeDestinations — 5 photo cards, mobile scroll + desktop grid"
```

---

## Task 4: HomeToursClient — Tab switcher + tour cards (client)

**Files:**
- Create: `src/components/website/Home/HomeToursClient.tsx`

This is the **only client component** in the new homepage. Receives pre-fetched data from `HomeTours.tsx` (server). Manages tab state (`surabaya` | `bali`) and renders cards.

- [ ] **Step 1: Create HomeToursClient.tsx**

```tsx
// src/components/website/Home/HomeToursClient.tsx
"use client";

import { useState } from "react";
import Link from "@/components/website/AppLink";
import DifficultyBadge from "@/components/website/DifficultyBadge";
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";

interface HomeToursClientProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

type Tab = "surabaya" | "bali";

export default function HomeToursClient({
  surabayaPackages,
  baliPackages,
}: HomeToursClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("surabaya");

  const packages = activeTab === "surabaya" ? surabayaPackages : baliPackages;
  const viewAllHref =
    activeTab === "surabaya" ? "/tours/from-surabaya" : "/tours/from-bali";

  return (
    <div>
      {/* Tab pills */}
      <div className="flex gap-2 mb-8">
        {(["surabaya", "bali"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab
                ? "bg-jvto-navy text-white"
                : "bg-white text-jvto-navy/60 hover:text-jvto-navy"
            }`}
          >
            {tab === "surabaya" ? "From Surabaya" : "From Bali"}
          </button>
        ))}
      </div>

      {/* Tour cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {packages.map((pkg) => {
          const highlights = pkg.keyExperiences.slice(0, 2);
          const price = `From IDR ${new Intl.NumberFormat("id-ID").format(pkg.startFrom)}`;
          const duration = `${pkg.duration.day}D · ${pkg.duration.night}N`;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-sm border border-jvto-navy/5 p-5 flex flex-col gap-3"
            >
              <p className="font-bold text-jvto-navy text-base leading-snug">
                {pkg.name}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-jvto-navy/60">{duration}</span>
                <DifficultyBadge physicality={pkg.physicality} />
              </div>

              <p className="font-black text-jvto-navy text-lg">{price}</p>

              {highlights.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {highlights.map((h, i) => (
                    <li key={i} className="text-xs text-jvto-navy/60 flex gap-1">
                      <span className="flex-shrink-0">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/${pkg.slug}`}
                className="text-jvto-green font-bold text-sm mt-auto hover:underline"
              >
                See Details →
              </Link>
            </div>
          );
        })}
      </div>

      {/* View all */}
      <div className="text-center">
        <Link
          href={viewAllHref}
          className="text-sm font-bold text-jvto-navy/60 hover:text-jvto-navy underline"
        >
          View all packages →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeToursClient" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeToursClient.tsx
git commit -m "feat(home): add HomeToursClient — Surabaya/Bali tab switcher with tour cards"
```

---

## Task 5: HomeTours — Server wrapper for S4

**Files:**
- Create: `src/components/website/Home/HomeTours.tsx`

Server component — receives pre-fetched data from `page.tsx`, renders section wrapper + delegates interactivity to `HomeToursClient`. Does NOT fetch its own data.

- [ ] **Step 1: Create HomeTours.tsx**

```tsx
// src/components/website/Home/HomeTours.tsx
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";
import HomeToursClient from "./HomeToursClient";

interface HomeToursProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

export default function HomeTours({ surabayaPackages, baliPackages }: HomeToursProps) {
  return (
    <section className="bg-jvto-off py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Packages
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Browse Packages
        </h2>
        <p className="text-jvto-navy/60 text-base mb-10">
          Private departures from Surabaya and Bali — choose your starting point.
        </p>
        <HomeToursClient
          surabayaPackages={surabayaPackages}
          baliPackages={baliPackages}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeTours" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeTours.tsx
git commit -m "feat(home): add HomeTours — server wrapper passing fetched packages to client"
```

---

## Task 6: HomeHowItWorks — 3-step booking process

**Files:**
- Create: `src/components/website/Home/HomeHowItWorks.tsx`

Static section — no data fetch, no client interactivity. Numbered circles connected by a line (desktop only). Mobile: vertical stack.

- [ ] **Step 1: Create HomeHowItWorks.tsx**

```tsx
// src/components/website/Home/HomeHowItWorks.tsx
const STEPS = [
  {
    number: "01",
    title: "Choose Your Route",
    description: "Browse 16 private packages by departure city or destination.",
  },
  {
    number: "02",
    title: "Confirm via WhatsApp",
    description:
      "Message us — we reply within 2 hours. Confirm dates, group size, and pickup.",
  },
  {
    number: "03",
    title: "Meet Your Guide",
    description:
      "Your private guide meets you at your hotel. No terminals, no buses, no strangers.",
  },
] as const;

export default function HomeHowItWorks() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Process
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-12"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-0">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex md:flex-col items-start gap-4 md:gap-0 flex-1">
              {/* Circle + connector (desktop connector is a sibling, see below) */}
              <div className="flex items-center w-full md:mb-6">
                <div className="w-12 h-12 rounded-full bg-jvto-navy text-white font-black text-lg flex items-center justify-center flex-shrink-0">
                  {step.number}
                </div>
                {/* Connector line between circles — desktop only */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block flex-1 border-t-2 border-jvto-navy/10 mx-4" />
                )}
              </div>
              {/* Step text */}
              <div className="flex-1 md:flex-none md:pr-8">
                <p className="font-black text-jvto-navy text-base mb-1">{step.title}</p>
                <p className="text-jvto-navy/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeHowItWorks" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeHowItWorks.tsx
git commit -m "feat(home): add HomeHowItWorks — 3-step booking flow with numbered circles"
```

---

## Task 7: HomeReviews — Platform scores + testimonials

**Files:**
- Create: `src/components/website/Home/HomeReviews.tsx`

All data comes from constants in `src/lib/jvtoReviews.ts` — no DB query. Platform URLs are real external links.

- [ ] **Step 1: Create HomeReviews.tsx**

```tsx
// src/components/website/Home/HomeReviews.tsx
import Link from "@/components/website/AppLink";
import { TESTIMONIALS } from "@/lib/jvtoReviews";

const PLATFORMS = [
  {
    name: "Trustpilot",
    rating: "4.8★",
    count: "51 reviews",
    url: "https://trustpilot.com/review/javavolcano-touroperator.com",
  },
  {
    name: "Google Maps",
    rating: "4.9★",
    count: "92 reviews",
    url: "https://www.google.com/maps?cid=1266403973589689021",
  },
  {
    name: "TripAdvisor",
    rating: "4.95★",
    count: "21 reviews",
    url: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
  },
] as const;

export default function HomeReviews() {
  const testimonials = TESTIMONIALS.slice(0, 3);

  return (
    <section className="bg-jvto-navy py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
          Reviews
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-white mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Verified Across Three Platforms
        </h2>
        <p className="text-white/60 text-base mb-12">
          Every review links to the original profile.
        </p>

        {/* Platform score cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
                {platform.name}
              </p>
              <p className="text-4xl font-black text-jvto-green mb-1">{platform.rating}</p>
              <p className="text-white/60 text-sm mb-4">{platform.count}</p>
              <Link
                href={platform.url}
                className="text-jvto-green/80 text-xs font-bold hover:text-jvto-green"
              >
                View reviews ↗
              </Link>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <p className="text-jvto-green text-4xl font-black leading-none mb-3">&ldquo;</p>
              <p className="text-white/80 text-sm leading-relaxed mb-4">{t.text}</p>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-white/50 text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeReviews" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeReviews.tsx
git commit -m "feat(home): add HomeReviews — Trustpilot/Google/TripAdvisor scores + 3 testimonials"
```

---

## Task 8: HomeTravelGuideTeaser — 4 guide entry cards

**Files:**
- Create: `src/components/website/Home/HomeTravelGuideTeaser.tsx`

Static section — all hrefs hardcoded. Each card is a full `<Link>` block, using Lucide icons from the list that is already installed in the project.

- [ ] **Step 1: Create HomeTravelGuideTeaser.tsx**

```tsx
// src/components/website/Home/HomeTravelGuideTeaser.tsx
import Link from "@/components/website/AppLink";
import { MessageCircleQuestion, CreditCard, HeartPulse, Shield } from "lucide-react";

const GUIDES = [
  {
    Icon: MessageCircleQuestion,
    title: "Frequently Asked Questions",
    description: "Everything first-timers ask.",
    href: "/travel-guide/faq",
  },
  {
    Icon: CreditCard,
    title: "Booking & Payment",
    description: "Deposits, cancellation, WhatsApp flow.",
    href: "/travel-guide/booking-information",
  },
  {
    Icon: HeartPulse,
    title: "Ijen Health Screening",
    description: "SpO₂ and blood pressure before ascent.",
    href: "/travel-guide/ijen-health-screening",
  },
  {
    Icon: Shield,
    title: "Safety on Tours",
    description: "Protocols, rescue access, risk realities.",
    href: "/travel-guide/safety-on-tours",
  },
] as const;

export default function HomeTravelGuideTeaser() {
  return (
    <section className="bg-jvto-off py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Read Before You Go
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          The Traveler&apos;s Rulebook
        </h2>
        <p className="text-jvto-navy/60 text-base mb-10">
          Active volcanoes. Health screenings. Early starts. Know before you go.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUIDES.map(({ Icon, title, description, href }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-6 border border-jvto-navy/5 hover:border-jvto-green transition-colors group block"
            >
              <Icon size={32} className="text-jvto-green mb-3" />
              <p className="font-black text-jvto-navy text-base mb-1">
                {title}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
              <p className="text-jvto-navy/60 text-sm">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeTravelGuideTeaser" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeTravelGuideTeaser.tsx
git commit -m "feat(home): add HomeTravelGuideTeaser — 4 guide entry cards"
```

---

## Task 9: HomeWhyJVTO — 3 differentiator cards

**Files:**
- Create: `src/components/website/Home/HomeWhyJVTO.tsx`

Static section. Green top-border accent on each card. Tailwind: `border border-jvto-navy/10 border-t-4 border-t-jvto-green` — the directional `border-t-*` utilities override only the top edge, which is standard CSS specificity behavior.

- [ ] **Step 1: Create HomeWhyJVTO.tsx**

```tsx
// src/components/website/Home/HomeWhyJVTO.tsx
import Link from "@/components/website/AppLink";

const DIFFERENTIATORS = [
  {
    title: "Tourist Police-Led",
    body: "Our founder is an active POLPAR officer. Not a travel agent who hired a guide — an officer who built a tour company.",
  },
  {
    title: "Private. Always.",
    body: "Your group is your group. We never mix strangers into one vehicle or one tour. If you book 2 people, 2 people go.",
  },
  {
    title: "All-Inclusive, No Surprises",
    body: "One price covers transport, guide, permits, meals where listed. No tipping culture. No last-minute extras at the gate.",
  },
] as const;

export default function HomeWhyJVTO() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Why JVTO
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-12"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Three Things No Other Operator Offers Together
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {DIFFERENTIATORS.map((d) => (
            <div
              key={d.title}
              className="border border-jvto-navy/10 border-t-4 border-t-jvto-green rounded-2xl p-8"
            >
              <p className="font-black text-jvto-navy text-xl mb-3">{d.title}</p>
              <p className="text-jvto-navy/70 text-sm leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/why-jvto"
            className="text-sm font-bold text-jvto-navy/60 hover:text-jvto-navy underline"
          >
            Learn more about JVTO →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeWhyJVTO" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeWhyJVTO.tsx
git commit -m "feat(home): add HomeWhyJVTO — 3 differentiator cards with green top accent"
```

---

## Task 10: HomeCTA — Final WhatsApp CTA

**Files:**
- Create: `src/components/website/Home/HomeCTA.tsx`

Minimal dark section — two buttons only. No other content.

- [ ] **Step 1: Create HomeCTA.tsx**

```tsx
// src/components/website/Home/HomeCTA.tsx
import Link from "@/components/website/AppLink";

export default function HomeCTA() {
  return (
    <section className="bg-jvto-navy py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h2
          className="font-black text-4xl md:text-5xl text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to Book?
        </h2>
        <p className="text-white/60 text-base max-w-xl mx-auto mb-10">
          WhatsApp us — we respond within 2 hours. Tell us your dates and
          we&apos;ll build your itinerary.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://wa.me/6282244788833"
            className="bg-jvto-green text-jvto-navy font-black px-8 py-4 rounded-full text-base text-center hover:bg-jvto-green/90 transition-colors"
          >
            Book via WhatsApp
          </Link>
          <Link
            href="/tours"
            className="border border-white/30 text-white font-bold px-8 py-4 rounded-full text-base text-center hover:border-white/60 transition-colors"
          >
            Browse All Tours →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "HomeCTA" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeCTA.tsx
git commit -m "feat(home): add HomeCTA — WhatsApp + Browse All Tours final CTA"
```

---

## Task 11: Wire page.tsx + delete old components + final build

**Files:**
- Modify: `src/app/(website)/page.tsx`
- Delete: 14 old Home components (listed below)

**WARNING:** The `PageJsonLdCombined` block and all `extraSchemas` in `page.tsx` must be preserved verbatim. Do not move, edit, or reformat any line of the schema block. Only the import statements and the JSX return body change.

- [ ] **Step 1: Check which old components are imported only in page.tsx**

Run these grep commands. Any file with results OUTSIDE of `page.tsx` should NOT be deleted until the other importer is resolved.

```bash
grep -rn "from.*Home/Hero" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Differentiators" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*FeaturedTours" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Home/Reviews" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*TrustVerification" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Home/WhyJVTO" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Home/HomeCTA" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Home/HomeDestinations" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Home/Destinations" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
grep -rn "from.*Home/TravelGuideTeaser" /Users/macbook/Code/jvto-web/src/ --include="*.tsx" --include="*.ts" | grep -v "page.tsx"
```

Expected: no output for any command. If any command returns a result, leave that file in place and do not delete it.

- [ ] **Step 2: Replace page.tsx**

Replace the full file. The schema block (lines 80–146 in the original) is preserved verbatim inside the new file.

```tsx
// src/app/(website)/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import HomeHero from "@/components/website/Home/HomeHero";
import HomeTrustStrip from "@/components/website/Home/HomeTrustStrip";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import HomeTours from "@/components/website/Home/HomeTours";
import HomeHowItWorks from "@/components/website/Home/HomeHowItWorks";
import HomeReviews from "@/components/website/Home/HomeReviews";
import HomeTravelGuideTeaser from "@/components/website/Home/HomeTravelGuideTeaser";
import HomeWhyJVTO from "@/components/website/Home/HomeWhyJVTO";
import HomeCTA from "@/components/website/Home/HomeCTA";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import { buildHomepageAggregateRatingSchema } from "@/lib/schemas/buildHomepageSchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import {
  BBKSDA_REGULATION_SCHEMA,
  DEFINED_TERMS,
  DOCTOR_SCHEMA,
  FOUNDER_SCHEMA,
} from "@/lib/schemas/entityGraph";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE;
export const revalidate = 3600;

const fallbackSeo = {
  title:
    "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
  h1: "Private Volcano Tours.\nPolice-Led.",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/", fallbackSeo);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: SITE_URL,
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  // getPublicDestinationList is synchronous (reads a static JSON snapshot)
  const destinations: Destination[] = getPublicDestinationList() as Destination[];

  const [seo, surabayaTours, baliTours] = await Promise.all([
    getPageSeo("/", fallbackSeo),
    getWebPackagesList({ fromId: 4, limit: 4 }),
    getWebPackagesList({ fromId: 3, limit: 4 }),
  ]);

  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  // ── AEO schema nodes ────────────────────────────────────────────────────────
  const serviceNode = {
    "@type": "Service",
    "@id": `${SITE_URL}/why-jvto#tourService`,
    name: "Private Volcano Tour Operations (Mount Bromo & Mount Ijen)",
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: [
      "Private tour",
      "Volcano tour",
      "Tour guiding service",
      "Travel agency service",
    ],
    areaServed: [
      { "@type": "AdministrativeArea", name: "East Java" },
      { "@type": "Country", name: "Indonesia" },
    ],
    description:
      "Standardized private operations for active-volcano environments, with disciplined risk protocols, own crew execution (not outsourced), and pre-ascent health screening for Mount Ijen when applicable.",
    termsOfService: `${SITE_URL}/verify-jvto`,
  };

  const faqResolution = await resolveFaqsForPage("/");
  const faqNode = buildResolvedFaqSchema(faqResolution, "/");
  const aggregateRatingNode = buildHomepageAggregateRatingSchema();

  const healthAppNode = {
    "@type": "WebApplication",
    "@id": "https://health.mountijen.com/#app",
    name: "Mount Ijen Digital Health Screening",
    alternateName: "Ijen Health Screening",
    url: "https://health.mountijen.com/",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: [
      { "@type": "Thing", name: "Pre-ascent health screening (SpO₂ & Blood Pressure)" },
      { "@type": "Place", name: "Mount Ijen" },
    ],
    featureList: [
      "Digital recording of SpO₂ and blood pressure",
      "QR-based clearance flow",
      "Supports go/no-go safety decisions",
    ],
    inLanguage: "en",
    usageInfo:
      "Operational safety screening only. Does not replace medical diagnosis or treatment.",
  };

  return (
    <div>
      {/* JSON-LD schema injection — AEO/GEO signal layer (no visual output) */}
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          FOUNDER_SCHEMA,
          DOCTOR_SCHEMA,
          BBKSDA_REGULATION_SCHEMA,
          ...Object.values(DEFINED_TERMS),
          serviceNode,
          healthAppNode,
          aggregateRatingNode,
          faqNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      <HomeHero title={seo.h1} description={seo.description} />
      <HomeTrustStrip />
      <HomeDestinations destinations={destinations} />
      <HomeTours surabayaPackages={surabayaTours} baliPackages={baliTours} />
      <HomeHowItWorks />
      <HomeReviews />
      <HomeTravelGuideTeaser />
      <HomeWhyJVTO />
      <HomeCTA />
    </div>
  );
};

export default Home;
```

**Note on `getPublicDestinationList`:** The function is synchronous but `Promise.all` wraps it correctly via `as unknown as Promise<Destination[]>`. If TypeScript complains, unwrap it: `const destinations = getPublicDestinationList();` before the Promise.all and remove it from the array.

- [ ] **Step 3: TypeScript check — full project**

```bash
npx tsc --noEmit 2>&1 | grep -v "checkout\|booking\|page copy" | head -30
```

Expected: zero new errors. (There are pre-existing 42 TS errors in `checkout/page.tsx` and booking flow — these are known and pre-existing per CLAUDE.md. Do not fix them. Only errors in the new Home components matter.)

- [ ] **Step 4: Delete old Home components (only those confirmed safe in Step 1)**

```bash
git rm src/components/website/Home/Hero.tsx
git rm src/components/website/Home/Differentiators.tsx
git rm src/components/website/Home/FeaturedTours.tsx
git rm src/components/website/Home/FeaturedToursClient.tsx
git rm src/components/website/Home/Reviews.tsx
git rm src/components/website/Home/ReviewsClient.tsx
git rm src/components/website/Home/HomeReviewsStatic.tsx
git rm src/components/website/Home/TrustVerification.tsx
git rm src/components/website/Home/WhyJVTO.tsx
git rm "src/components/website/Home/Destinations.tsx"
git rm src/components/website/Home/TravelGuideTeaser.tsx
```

**Do NOT delete** the old `HomeCTA.tsx` and `HomeDestinations.tsx` using `git rm` before the new files exist with those same names — the new `HomeCTA.tsx` and `HomeDestinations.tsx` already replaced them in Tasks 3 and 10. Git will have tracked the overwrite.

- [ ] **Step 5: Run production build**

```bash
npm run build 2>&1 | tail -30
```

Expected output ends with something like:
```
Route (app)                                Size     First Load JS
┌ ○ /                                      ...
...
○  (Static)   prerendered as static content
```

No "Error" or "Failed to compile" lines. The homepage (`/`) must appear in the route table.

- [ ] **Step 6: Visual check in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- [ ] Hero section: full-viewport photo visible through overlay, H1 readable, two CTA buttons
- [ ] Trust Strip: 4 credential items visible below hero
- [ ] Destinations: 5 photo cards, horizontal scroll on mobile (resize browser to 375px)
- [ ] Tours: tabs "From Surabaya" and "From Bali" both clickable, cards update on tab switch
- [ ] How It Works: 3 numbered circles, connector line visible at desktop width
- [ ] Reviews: 3 platform score cards + 3 testimonials
- [ ] Travel Guide: 4 guide cards with hover state
- [ ] Why JVTO: 3 cards with green top border
- [ ] CTA: WhatsApp button + Browse All Tours

Check at 375px (mobile) for horizontal overflow:
```
No section should have a horizontal scrollbar except the destinations row.
```

- [ ] **Step 7: Verify AEO schema is untouched**

In browser, visit `http://localhost:3000`, view page source (`Cmd+U` on Mac), and search for `application/ld+json`. Verify the JSON-LD blocks still contain `Organization`, `WebSite`, `FAQPage`, `AggregateRating`, and `Service` nodes — identical to before the redesign.

- [ ] **Step 8: Commit**

```bash
git add src/app/\(website\)/page.tsx
git commit -m "feat(home): wire new homepage — 9 sections, delete old Home components"
```

---

## Definition of Done

- [ ] All 9 sections render at `localhost:3000` with no console errors
- [ ] Mobile (375px): no horizontal overflow except intentional destination card scroll
- [ ] Desktop (1440px): 5-col destination grid, 4-col tour cards, 3-col review cards
- [ ] Tab switcher works in browser — Surabaya/Bali packages switch correctly
- [ ] `npm run build` exits clean (no new TS errors, no compile failures)
- [ ] Old Home components deleted — no dead imports remaining in `page.tsx`
- [ ] AEO JSON-LD schema output unchanged in page source
