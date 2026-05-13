# Homepage Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 8 homepage sections with Option B design (Immersive Dark + Bento Grid, Dark/Light alternation) using 100% wiki copy content from `llm-wiki/output/copy-2026-05-12-homepage.md`.

**Architecture:** Every section is a Server Component (no `"use client"`) except `ReviewsClient.tsx` which is preserved unchanged. CSS hover effects use `.card-jvto` class from `website.css` — never `onMouseEnter`/`onMouseLeave` in Server Components. Data fetching helpers and `page.tsx` schema injection are untouched.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, Lucide React, `next/image`, existing data helpers unchanged.

**Design spec:** `docs/superpowers/specs/2026-05-13-homepage-redesign-design.md`

---

## File Map

| File | Action |
|---|---|
| `src/components/website/Home/Hero.tsx` | Rewrite |
| `src/components/website/Home/Differentiators.tsx` | Rewrite |
| `src/components/website/Home/HomeDestinations.tsx` | Rewrite |
| `src/components/website/Home/FeaturedTours.tsx` | Rewrite |
| `src/app/(website)/page.tsx` | Modify reviews wrapper only |
| `src/components/website/Home/TrustVerification.tsx` | Rewrite |
| `src/components/website/Home/WhyJVTO.tsx` | Rewrite |
| `src/components/website/Home/HomeCTA.tsx` | Rewrite |

**No new files. No data layer changes. No schema/SEO changes. No changes to `ReviewsClient.tsx`.**

---

## Task 1: Hero.tsx

**Files:**
- Modify: `src/components/website/Home/Hero.tsx`

New design: full-bleed photo at 30% opacity over navy, navy gradient, eyebrow chip with lime pulse dot, H1 with orange italic `<em>`, 2 body paragraphs (both from wiki), 2 CTA pill buttons (Browse Tours + Verify JVTO), stats bar with 4 verified data points.

- [ ] **Step 1: Replace Hero.tsx**

```tsx
import Image from "next/image";
import Button from "../UI/Button";

interface HeroProps {
  title?: string;
  description?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Tourist Police-Led Private Volcano Tours in East Java",
  description = "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed operator (NIB 1102230032918), led by an active Tourist Police officer.",
}) => {
  return (
    <div className="relative min-h-[92vh] flex items-center overflow-hidden bg-jvto-navy">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/hero/home-lite.webp"
          alt="Ijen Crater at dawn"
          fill
          priority
          unoptimized
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-jvto-navy/60 via-transparent to-jvto-navy/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-16">

        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-jvto-lime/40 bg-jvto-lime/10 backdrop-blur-sm mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime animate-pulse flex-shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
            Tourist Police-Led · Licensed Operator · NIB 1102230032918
          </span>
        </div>

        {/* H1 — wiki verbatim, orange italic on "Private Volcano Tours" */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.0] mb-6 max-w-4xl"
          style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.035em" }}
        >
          Tourist Police-Led{" "}
          <em className="text-jvto-orange not-italic">Private Volcano Tours</em>{" "}
          in East Java
        </h1>

        {/* Subheadline — wiki verbatim */}
        <p className="text-base md:text-lg text-white/70 max-w-2xl mb-5 leading-relaxed">
          {description}
        </p>

        {/* Body ¶1 — wiki verbatim */}
        <p className="text-sm md:text-base text-white/50 max-w-xl mb-3 leading-relaxed font-light">
          Mr. Sam is a Tourist Police officer first, tour operator second. That order matters: every route decision, every written rule, and every safety boundary comes from someone who answers to police protocol — not a marketing brief.
        </p>

        {/* Body ¶2 — wiki verbatim */}
        <p className="text-sm md:text-base text-white/50 max-w-xl mb-10 leading-relaxed font-light">
          We operate private tours only. Your group gets a dedicated vehicle, driver, and guide. No shared transfers, no schedule compromises with strangers, no last-minute logistics surprises.
        </p>

        {/* CTA buttons — wiki verbatim labels */}
        <div className="flex gap-3 flex-wrap mb-12">
          {/* Mobile */}
          <div className="flex gap-3 md:hidden">
            <Button to="/tours" prefetch={false} variant="primary" size="md">
              Browse Tours
            </Button>
            <Button
              to="/verify-jvto"
              prefetch={false}
              variant="outline"
              size="md"
              className="border-jvto-lime/50 text-jvto-lime hover:bg-jvto-lime/10 rounded-full"
            >
              Verify JVTO
            </Button>
          </div>
          {/* Desktop */}
          <div className="hidden md:flex gap-3">
            <Button to="/tours" prefetch={false} variant="primary" size="lg">
              Browse Tours
            </Button>
            <Button
              to="/verify-jvto"
              prefetch={false}
              variant="outline"
              size="lg"
              className="border-jvto-lime/50 text-jvto-lime hover:bg-jvto-lime/10 rounded-full"
            >
              Verify JVTO
            </Button>
          </div>
        </div>

        {/* Stats bar — design addition, data from wiki */}
        <div className="inline-flex flex-wrap gap-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          {[
            { val: "4.8", lbl: "Trustpilot · 51 reviews" },
            { val: "4.90", lbl: "Google Maps · 92 reviews" },
            { val: "4.95", lbl: "TripAdvisor · 21 reviews" },
            { val: "16", lbl: "Private itineraries" },
          ].map((stat, i) => (
            <div
              key={stat.lbl}
              className={`px-5 py-3 text-center ${i > 0 ? "border-l border-white/10" : ""}`}
            >
              <span
                className="block text-lg font-black text-white leading-none"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {stat.val}
              </span>
              <span className="block text-[8px] uppercase tracking-[0.12em] text-white/40 mt-1">
                {stat.lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

Expected: `✓ Compiled successfully` and `✓ Generating static pages (138/138)`

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/Hero.tsx
git commit -m "feat(homepage): redesign Hero — immersive dark, 2-para wiki body, stats bar, lime Verify CTA"
```

---

## Task 2: Differentiators.tsx

**Files:**
- Modify: `src/components/website/Home/Differentiators.tsx`

Bento Grid 2: 2 large navy cards (top row, Police-Led + 100% Private) + 4 smaller cards (bottom row). All text verbatim from wiki. No `onMouseEnter` — use `.card-jvto` CSS class for hover shadow.

- [ ] **Step 1: Replace Differentiators.tsx**

```tsx
import {
  ShieldCheck,
  Users,
  FileCheck,
  Activity,
  BadgeCheck,
  Compass,
} from "lucide-react";

const LARGE_CARDS = [
  {
    icon: ShieldCheck,
    headline: "Police-Led",
    body: "Mr. Sam — Bripka Agung Sambuko — is an active officer of the Indonesian Tourist Police (Ditpamobvit, East Java). No other licensed tour operator in East Java is founded and led by an active Polpar officer. His police authorization documents are publicly SHA-256 anchored.",
    href: "/verify-jvto/police-safety",
  },
  {
    icon: Users,
    headline: "100% Private",
    body: "Every tour is private by default. Your booking means your vehicle, your driver, your guide — nobody else's group added to your seat. This keeps timing decisions yours, recovery time realistic, and safety coordination simple.",
    href: "/tours",
  },
];

const SMALL_CARDS = [
  {
    icon: FileCheck,
    headline: "All-Inclusive — No Surprise Local Payments",
    body: "Entrance fees, the Bromo 4WD jeep, accommodation, breakfast, gas masks, and transfers are bundled in writing. What is and isn't included is published before you pay.",
    href: "/policy/inclusions-exclusions",
    variant: "lime" as const,
  },
  {
    icon: Activity,
    headline: "Ijen Health-Screening Coordination",
    body: "JVTO coordinates the clinic workflow when current BBKSDA rules require it — before the hike, not as an afterthought. Dr. Ahmad Irwandanu holds a verified SIP license (Kemenkes RI).",
    href: "/travel-guide/ijen-health-screening",
    variant: "white" as const,
  },
  {
    icon: BadgeCheck,
    headline: "Verifiable Licenses",
    body: "NIB 1102230032918 is checkable at oss.go.id. HPWKI membership (AHU-0001072.AH.01.07.TAHUN 2024) verifies Ijen specialist guide training. SHA-256 hashes published in public/llms.txt.",
    href: "/verify-jvto/legal",
    variant: "white" as const,
  },
  {
    icon: Compass,
    headline: "Plan B When Conditions Change",
    body: "JVTO operates a written Plan-B framework: if a site closes, you get an alternative route — briefed in advance, not improvised at the gate. That is a written policy, not a verbal promise.",
    href: "/travel-guide/weather-and-closures",
    variant: "white" as const,
  },
];

const Differentiators: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Section header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-navy/5 border border-jvto-navy/10 mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
              Why JVTO
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Six things that separate JVTO{" "}
            <em className="text-jvto-orange not-italic">from every other operator</em>{" "}
            in East Java.
          </h2>
        </div>

        {/* Top row — 2 large navy cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {LARGE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.headline}
                href={card.href}
                className="group block bg-jvto-navy rounded-[32px] p-8 md:p-10 min-h-[220px]"
                style={{ boxShadow: "0 20px 40px -15px rgba(13,27,42,0.20)" }}
              >
                <div className="w-11 h-11 rounded-2xl bg-jvto-orange/15 flex items-center justify-center mb-6 group-hover:bg-jvto-orange/25 transition-colors">
                  <Icon className="w-5 h-5 text-jvto-orange" />
                </div>
                <h3
                  className="text-xl font-black text-white mb-3 leading-snug"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {card.headline}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {card.body}
                </p>
              </a>
            );
          })}
        </div>

        {/* Bottom row — 4 small cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SMALL_CARDS.map((card) => {
            const Icon = card.icon;
            const isLime = card.variant === "lime";
            return (
              <a
                key={card.headline}
                href={card.href}
                className={`group block rounded-[32px] p-7 card-jvto border ${
                  isLime
                    ? "bg-jvto-lime/7 border-jvto-lime/22"
                    : "bg-white border-jvto-border"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                    isLime
                      ? "bg-jvto-lime/15 group-hover:bg-jvto-lime/25"
                      : "bg-jvto-off group-hover:bg-jvto-navy"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isLime
                        ? "text-jvto-lime"
                        : "text-jvto-orange group-hover:text-white"
                    }`}
                  />
                </div>
                <h3
                  className={`text-sm font-black mb-2 leading-snug ${
                    isLime ? "text-jvto-lime" : "text-jvto-navy"
                  }`}
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {card.headline}
                </h3>
                <p className={`text-xs leading-relaxed ${isLime ? "text-jvto-lime/70" : "text-jvto-muted"}`}>
                  {card.body}
                </p>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Differentiators;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

Expected: `✓ Compiled successfully` and `✓ Generating static pages (138/138)`

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/Differentiators.tsx
git commit -m "feat(homepage): redesign Differentiators — Bento Grid 2 (2 large navy + 4 small)"
```

---

## Task 3: HomeDestinations.tsx

**Files:**
- Modify: `src/components/website/Home/HomeDestinations.tsx`

Replaces horizontal scroll with a 4-col asymmetric grid on desktop (`2fr 1fr 1fr 1fr` — Ijen featured wider), 2-col on tablet, 1-col on mobile. Uses inline card markup with `next/image fill` directly (avoids `DestinationCard` which has `rounded-sm` and horizontal-scroll-optimized sizing). Data comes from existing `destinations` prop unchanged.

`Destination` interface used: `id`, `name`, `description`, `slug`, `banner.url`, `banner.alt`.

- [ ] **Step 1: Replace HomeDestinations.tsx**

```tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import { getHomeImageVariantSet } from "@/lib/assets/homeImageVariants";
import type { Destination } from "@/interfaces";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const DEST_META: Record<string, string> = {
  "ijen-crater": "Blue Fire Crater · 2,386m · Pre-dawn hike",
  "kawah-ijen": "Blue Fire Crater · 2,386m · Pre-dawn hike",
  "mount-bromo": "Penanjakan Sunrise · 2,329m · 4WD jeep",
  "tumpak-sewu-waterfall": "Curtain Waterfall · ~120m · Canyon descent",
  "tumpak-sewu": "Curtain Waterfall · ~120m · Canyon descent",
  "madakaripura-waterfall": "Tallest Java Waterfall · Canyon wade",
  "madakaripura": "Tallest Java Waterfall · Canyon wade",
};

const HomeDestinations: React.FC<HomeDestinationsProps> = ({ destinations }) => {
  if (!destinations.length) return null;

  return (
    <section className="bg-jvto-navy py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Section header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
              Destinations
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Four destinations.{" "}
            <em className="text-jvto-orange not-italic">One licensed operator</em>{" "}
            covering all of them.
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
            All JVTO tours start and end with full logistics covered. Every destination below is served by dedicated private transport — no public buses, no group vans shared with strangers.
          </p>
        </div>

        {/* Asymmetric destination grid
            Desktop: 2fr 1fr 1fr 1fr — first card (Ijen) is featured wider
            Tablet:  2-col
            Mobile:  1-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
          {destinations.map((dest, index) => {
            const isFirst = index === 0;
            const variantSet = getHomeImageVariantSet(dest.banner.url);
            const imgSrc = variantSet?.medium || dest.banner.url;
            const metaLine = DEST_META[dest.slug] ?? dest.description?.slice(0, 60);

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                prefetch={false}
                target="_blank"
                className="group block relative overflow-hidden rounded-[32px] lg:rounded-[40px]"
                style={{ minHeight: isFirst ? "420px" : "360px" }}
              >
                {/* Photo */}
                {variantSet ? (
                  <img
                    src={imgSrc}
                    srcSet={`${variantSet.small} 240w, ${variantSet.medium} 420w`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    alt={dest.banner.alt || dest.name}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "low"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={dest.banner.url}
                    alt={dest.banner.alt || dest.name}
                    fill
                    unoptimized
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                {/* Dark gradient overlay — bottom-heavy */}
                <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/20 to-transparent" />

                {/* Card info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Featured badge on Ijen */}
                  {isFirst && (
                    <div className="inline-flex items-center gap-1.5 bg-jvto-lime/15 border border-jvto-lime/35 rounded-full px-3 py-1 mb-3">
                      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-jvto-lime">
                        Popular
                      </span>
                    </div>
                  )}
                  <h3
                    className={`font-black text-white leading-tight mb-1 ${isFirst ? "text-2xl md:text-3xl" : "text-lg"}`}
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {dest.name}
                  </h3>
                  {metaLine && (
                    <p className="text-[10px] text-white/55 uppercase tracking-[0.1em] font-semibold">
                      {metaLine}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HomeDestinations;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

Expected: `✓ Compiled successfully` and `✓ Generating static pages (138/138)`

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeDestinations.tsx
git commit -m "feat(homepage): redesign HomeDestinations — 4-col asymmetric grid, Ijen featured, dark navy bg"
```

---

## Task 4: FeaturedTours.tsx

**Files:**
- Modify: `src/components/website/Home/FeaturedTours.tsx`

White background, centered section header with wiki copy, pill origin tabs. Internal `TourRowStatic` and data fetching logic unchanged.

- [ ] **Step 1: Replace FeaturedTours.tsx**

```tsx
import Link from "@/components/website/AppLink";
import { ArrowRight } from "lucide-react";
import { ListTourPackage } from "@/types";
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";
import TourCardStatic from "@/components/website/TourCardStatic";
import ViewportSection from "@/components/website/ViewportSection";

async function getToursByLocation(id: number): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: id, limit: 6 });
}

const FeaturedTours = async () => {
  const [surabayaTours, baliTours] = await Promise.all([
    getToursByLocation(4),
    getToursByLocation(3),
  ]);

  return (
    <section className="py-20 md:py-32 bg-white">
      {/* Centered section header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-off border border-jvto-border mb-6">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
            Tour Packages
          </span>
        </div>
        <h2
          className="text-3xl md:text-5xl font-black text-jvto-navy mb-5 leading-tight"
          style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
        >
          16 private tours.{" "}
          <em className="text-jvto-orange not-italic">From Surabaya or Bali.</em>{" "}
          1 to 6 days.
        </h2>
        <p className="text-jvto-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          All 16 packages are 100% private. Prices are per person, in IDR, and scale down with group size. Every package includes: accommodation, breakfast, entrance fees, Bromo 4WD jeep (where applicable), gas masks, transfers, and a T-shirt. No surprise local payments.
        </p>

        {/* Origin tab pills */}
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <a
            href="#featured-tours-surabaya"
            className="px-7 py-3 rounded-full bg-jvto-navy text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-jvto-navy-mid transition-colors"
          >
            From Surabaya · 12 packages
          </a>
          <a
            href="#featured-tours-bali"
            className="px-7 py-3 rounded-full border border-jvto-navy text-jvto-navy font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-jvto-navy hover:text-white transition-colors"
          >
            From Bali · 4 packages
          </a>
        </div>
      </div>

      {/* Tour rows — logic unchanged */}
      <TourRowStatic id="featured-tours-surabaya" title="Tours From Surabaya" tours={surabayaTours} />
      <TourRowStatic id="featured-tours-bali" title="Tours From Bali" tours={baliTours} />

      <div className="text-center max-w-7xl mx-auto px-6 md:px-8 pt-10">
        <Link
          href="/tours"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-jvto-navy text-white px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy-mid transition-colors"
          style={{ boxShadow: "var(--shadow-jvto-cta)" }}
        >
          View All 16 Tours
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

function TourRowStatic({
  id,
  title,
  tours,
}: {
  id: string;
  title: string;
  tours: ListTourPackage[];
}) {
  if (!tours.length) return null;

  return (
    <ViewportSection
      as="section"
      id={id}
      className="py-6 md:py-10 scroll-mt-24 border-b border-jvto-border last:border-0"
      intrinsicSize="780px"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-3">
          <div>
            <h3
              className="text-2xl md:text-3xl font-black text-jvto-navy tracking-tight"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {title}
            </h3>
            <p className="text-jvto-muted mt-1 text-sm">
              {tours.length} private itineraries available
            </p>
          </div>
        </div>
        <div className="relative -mx-6 md:mx-0">
          <div className="flex md:gap-5 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-6 md:px-0">
            {tours.map((tour, index) => (
              <div key={tour.id} className="flex-shrink-0 w-[80vw] sm:w-[350px]">
                <TourCardStatic isNewTab tour={tour} prioritizeImage={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}

export default FeaturedTours;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/FeaturedTours.tsx
git commit -m "feat(homepage): redesign FeaturedTours — white bg, centered header, pill origin tabs"
```

---

## Task 5: Reviews Section — `page.tsx` wrapper

**Files:**
- Modify: `src/app/(website)/page.tsx` — reviews section wrapper only

`ReviewsClient.tsx` is NOT touched. Only the wrapper `<div>` in `page.tsx` changes: dark navy background, new heading/stats/intro from wiki copy, then existing `<Reviews />` carousel below.

- [ ] **Step 1: Replace the reviews section wrapper in page.tsx**

Find this block in `page.tsx`:

```tsx
      {/* 5. Reviews */}
      <div className="bg-white pt-20 pb-20 border-t border-jvto-border">
        <div className="w-full container mx-auto">
          <div className="max-w-3xl mx-auto px-4 mb-10">
```

Replace the entire reviews section (from `{/* 5. Reviews */}` to the closing `</div>` before `{/* 6. Trust & Verification */}`) with:

```tsx
      {/* 5. Reviews */}
      <section className="bg-jvto-navy py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                Guest Reviews
              </span>
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-2xl"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
            >
              51 reviews on Trustpilot.{" "}
              <em className="text-jvto-orange not-italic">92 on Google Maps.</em>{" "}
              21 on TripAdvisor.
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
              Trustpilot rating: <strong className="text-white font-semibold">4.8 / 5</strong> (51 reviews, verified 2026-05-09). Google Maps: <strong className="text-white font-semibold">4.90 / 5</strong> (92 reviews). TripAdvisor: <strong className="text-white font-semibold">4.95 / 5</strong> (21 reviews). All platforms link to the live profiles — not screenshots.
            </p>
            <p className="text-white/35 text-sm mt-3 max-w-xl leading-relaxed">
              These are not cherry-picked quotes. Browse by platform, browse by pattern. The themes that appear across guides, drivers, and logistics tell you more than any single testimonial.
            </p>
          </div>

          {/* Platform stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { score: "4.8 / 5", platform: "Trustpilot", count: "51 reviews", starColor: "#00b67a" },
              { score: "4.90 / 5", platform: "Google Maps", count: "92 reviews", starColor: "#E8650A" },
              { score: "4.95 / 5", platform: "TripAdvisor", count: "21 reviews", starColor: "#34e0a1" },
            ].map((p) => (
              <div
                key={p.platform}
                className="bg-white/5 border border-white/10 rounded-[20px] p-5"
              >
                <span
                  className="block text-2xl font-black text-white mb-1"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {p.score}
                </span>
                <span className="block text-[9px] uppercase tracking-[0.15em] text-white/40">
                  {p.platform} · {p.count}
                </span>
                <span className="block mt-2 text-sm" style={{ color: p.starColor }}>
                  ★★★★★
                </span>
              </div>
            ))}
          </div>

          {/* Existing Trustpilot carousel — unchanged */}
          <Reviews />
        </div>
      </section>
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(website)/page.tsx"
git commit -m "feat(homepage): redesign Reviews section — dark navy, platform stats, wiki intro copy"
```

---

## Task 6: TrustVerification.tsx

**Files:**
- Modify: `src/components/website/Home/TrustVerification.tsx`

New 2-column layout: left = 5-tier trust stack (unchanged content), right = sticky CTA sidebar card (navy, lime buttons). Off-white background.

- [ ] **Step 1: Replace TrustVerification.tsx**

```tsx
import Link from "@/components/website/AppLink";
import { ExternalLink } from "lucide-react";

const TRUST_STACK = [
  {
    tier: "01",
    label: "Business Registration",
    items: [
      { text: "NIB 1102230032918", link: "https://oss.go.id", linkLabel: "oss.go.id" },
      { text: "TDUP 1102230032918 — Dinas Pariwisata", link: null, linkLabel: null },
      { text: "PT Java Volcano Rendezvous — AHU registry", link: "https://ahu.go.id", linkLabel: "ahu.go.id" },
    ],
  },
  {
    tier: "02",
    label: "Founder's Police Status",
    items: [
      { text: "Bripka Agung Sambuko — active officer, Ditpamobvit (Tourist Police), East Java", link: "/verify-jvto/police-safety", linkLabel: "See police credentials" },
      { text: "SPRIN documents SHA-256 anchored. Corroborated by Detik.com (2021), Radar Jember (2021 × 2), and BBKSDA Jatim (2024)", link: "/verify-jvto/press-recognition", linkLabel: "See press coverage" },
    ],
  },
  {
    tier: "03",
    label: "Guide Association & Park Clearance",
    items: [
      { text: "HPWKI membership AHU-0001072.AH.01.07.TAHUN 2024 — Ijen specialist guide association, BBKSDA-supervised training", link: "/verify-jvto/legal", linkLabel: "See license" },
      { text: "BBKSDA operator clearance: Bromo Tengger Semeru National Park + Ijen", link: null, linkLabel: null },
    ],
  },
  {
    tier: "04",
    label: "Medical Officer",
    items: [
      { text: "Dr. Ahmad Irwandanu — SIP license issued by Kemenkes RI", link: "https://satusehat.kemkes.go.id", linkLabel: "Verify at satusehat.kemkes.go.id" },
      { text: "Also verifiable at KKI (kki.go.id)", link: "https://kki.go.id", linkLabel: "kki.go.id" },
    ],
  },
  {
    tier: "05",
    label: "Third-Party Recognition",
    items: [
      { text: "ISIC Provider 259268 (UNESCO-endorsed student identification)", link: null, linkLabel: null },
      { text: "INDECON live member (Indonesian Ecotourism Network)", link: null, linkLabel: null },
      { text: "Stefan Loose Indonesia guidebook 2016, p. 287", link: "/verify-jvto/press-recognition", linkLabel: "See press" },
      { text: "Booking.com 2015 award (Ijen Bondowoso Homestay, 9.4/10)", link: "/verify-jvto/history-artifacts", linkLabel: "See history" },
    ],
  },
];

const TrustVerification: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Section header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
              Verify JVTO
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Credentials you can check —{" "}
            <em className="text-jvto-orange not-italic">not logos you have to take on faith.</em>
          </h2>
          <p className="text-jvto-muted text-sm md:text-base max-w-xl leading-relaxed">
            Every license on this page is publicly verifiable. We publish SHA-256 hashes for all credential documents in{" "}
            <code className="font-mono text-[11px] bg-jvto-navy/8 px-1.5 py-0.5 rounded text-jvto-navy">
              public/llms.txt
            </code>{" "}
            so you can confirm authenticity before you book.
          </p>
        </div>

        {/* 2-column layout: stack + sticky sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* Left — trust stack */}
          <div className="space-y-4">
            {TRUST_STACK.map((tier) => (
              <div
                key={tier.tier}
                className="bg-white rounded-[24px] border border-jvto-border p-6 md:p-8 flex gap-4 card-jvto"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jvto-navy flex items-center justify-center mt-0.5">
                  <span className="text-[9px] font-bold text-white font-mono">{tier.tier}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-black text-jvto-navy text-sm mb-3"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {tier.label}
                  </h3>
                  <ul className="space-y-2">
                    {tier.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-jvto-muted">
                        <span className="text-jvto-lime mt-0.5 flex-shrink-0 font-bold">✓</span>
                        <span>
                          {item.text}
                          {item.link && (
                            <a
                              href={item.link}
                              target={item.link.startsWith("http") ? "_blank" : undefined}
                              rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="inline-flex items-center gap-1 ml-2 text-jvto-orange hover:underline font-semibold"
                            >
                              {item.linkLabel}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Right — sticky CTA sidebar */}
          <div className="lg:sticky lg:top-20">
            <div
              className="bg-jvto-navy rounded-[32px] p-8"
              style={{ boxShadow: "0 20px 40px -15px rgba(13,27,42,0.25)" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-4">
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-jvto-lime">
                  Open Verification Library
                </span>
              </div>
              <h3
                className="text-xl font-black text-white mb-3 leading-tight"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                Credentials you can check.
              </h3>
              <p className="text-xs text-white/55 mb-7 leading-relaxed">
                Every license on this page is publicly verifiable. We publish SHA-256 hashes for all credential documents in{" "}
                <code className="font-mono text-[10px] text-white/70">public/llms.txt</code>{" "}
                so you can confirm authenticity before you book.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/verify-jvto"
                  prefetch={false}
                  className="flex items-center justify-center gap-2 border border-jvto-lime/50 text-jvto-lime px-5 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.18em] hover:bg-jvto-lime/10 transition-colors"
                >
                  Open Full Library
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/verify-jvto/legal"
                  prefetch={false}
                  className="flex items-center justify-center gap-2 border border-white/15 text-white/60 px-5 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.18em] hover:bg-white/8 transition-colors"
                >
                  See Legal Documents
                </Link>
                <Link
                  href="/verify-jvto/police-safety"
                  prefetch={false}
                  className="flex items-center justify-center gap-2 border border-white/15 text-white/60 px-5 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.18em] hover:bg-white/8 transition-colors"
                >
                  See Police Credentials
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustVerification;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/TrustVerification.tsx
git commit -m "feat(homepage): redesign TrustVerification — 2-col layout with sticky sidebar CTA"
```

---

## Task 7: WhyJVTO.tsx

**Files:**
- Modify: `src/components/website/Home/WhyJVTO.tsx`

Add quote badge positioned outside the `overflow-hidden` founder card — a orange card `absolute -top-4 -right-4` on the relative wrapper. Quote from wiki Our Story ¶3.

- [ ] **Step 1: Replace WhyJVTO.tsx**

```tsx
import Link from "@/components/website/AppLink";
import Image from "next/image";

const WhyJVTO: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-jvto-navy text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — editorial copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-7">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
                Our Story
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-black leading-[1.05] mb-8"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
            >
              Built by someone who saw
              <br className="hidden md:block" />
              <em className="text-jvto-orange not-italic">
                {" "}what the alternatives looked like.
              </em>
            </h2>

            {/* 3 body paragraphs — wiki verbatim */}
            <div className="space-y-5 text-white/60 text-sm md:text-base leading-relaxed font-light">
              <p>
                JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the{" "}
                <strong className="text-white font-semibold">Tourist Police experience</strong>{" "}
                of our founder, Mr. Sam.
              </p>
              <p>
                We saw the gaps in safety standards first-hand — unlicensed guides, no medical screening, operators with no BBKSDA clearance, no written rules for guests. We decided to build something different: private-only routes, realistic driving days, and clear written policies.
              </p>
              <p>
                Today, we act as a bridge between wild adventure and professional safety standards. The Tourist Police experience isn't a marketing credential — it's the lens through which every route, every safety rule, and every Plan-B decision is made.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                href="/why-jvto/our-story"
                prefetch={false}
                className="font-bold border-b-2 border-jvto-lime text-white hover:text-jvto-lime transition-colors pb-1 text-sm"
              >
                Read the Full Story
              </Link>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="font-bold border-b-2 border-white/20 text-white/45 hover:text-white hover:border-white transition-colors pb-1 text-sm"
              >
                How to Verify Us
              </Link>
            </div>
          </div>

          {/* Right — founder portrait with quote badge */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Quote badge — OUTSIDE the overflow-hidden card, on the relative wrapper */}
            <div
              className="absolute -top-4 -right-4 z-10 bg-jvto-orange rounded-[18px] p-4 max-w-[200px]"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              <p className="text-[10px] text-white italic leading-relaxed">
                "The Tourist Police experience isn't a marketing credential — it's the lens through which every route, every safety rule, and every Plan-B decision is made."
              </p>
            </div>

            {/* Founder card */}
            <div
              className="relative z-0 rounded-[40px] overflow-hidden border border-white/10 w-full max-w-md aspect-[4/5]"
              style={{ boxShadow: "var(--shadow-jvto-hover)" }}
            >
              <Image
                src="/founder/agung_sambuko.webp"
                alt='Agung "Mr. Sam" Sambuko — JVTO Founder & Active Tourist Police Officer'
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-jvto-navy/95 via-jvto-navy/60 to-transparent p-8">
                <p
                  className="font-black text-white text-lg tracking-tight mb-1"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  Agung &ldquo;Mr. Sam&rdquo; Sambuko
                </p>
                <p className="text-[9px] text-jvto-lime font-bold uppercase tracking-[0.2em]">
                  Founder · Active Tourist Police Officer
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJVTO;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/WhyJVTO.tsx
git commit -m "feat(homepage): redesign WhyJVTO — quote badge with wiki Our Story ¶3, rounded-[40px] portrait"
```

---

## Task 8: HomeCTA.tsx

**Files:**
- Modify: `src/components/website/Home/HomeCTA.tsx`

Wiki-correct button sub-labels ("16 private itineraries from Surabaya and Bali" / "Check licenses, press coverage, and founder credentials"), wiki policy reminder verbatim, dark navy-mid background.

- [ ] **Step 1: Replace HomeCTA.tsx**

```tsx
import Link from "@/components/website/AppLink";
import { ArrowRight, ExternalLink } from "lucide-react";

const HomeCTA: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-jvto-navy-mid border-t border-white/6 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
            Ready to book?
          </span>
        </div>

        {/* Heading */}
        <h2
          className="text-3xl md:text-5xl font-black leading-tight mb-6 max-w-3xl mx-auto"
          style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
        >
          Private tours,{" "}
          <em className="text-jvto-orange not-italic">documented legitimacy,</em>{" "}
          written policies.
        </h2>

        {/* Policy reminder — wiki verbatim */}
        <p className="text-white/45 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed">
          Read the Rulebook Before You Book — cancellation rules, inclusions, and screening protocols are published in full before payment.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            href="/tours"
            prefetch={false}
            className="inline-flex items-center gap-2 bg-jvto-orange text-white px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
            style={{ boxShadow: "var(--shadow-jvto-orange)" }}
          >
            Browse Tours
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/verify-jvto"
            prefetch={false}
            className="inline-flex items-center gap-2 border border-jvto-lime/50 text-jvto-lime px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-lime/10 transition-colors"
          >
            Verify JVTO
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Sub-labels — wiki CTA section verbatim */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[10px] text-white/25">
          <span>16 private itineraries from Surabaya and Bali</span>
          <span className="hidden sm:inline">·</span>
          <span>Check licenses, press coverage, and founder credentials</span>
        </div>

      </div>
    </section>
  );
};

export default HomeCTA;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "✓ Compiled|✓ Generating|Error" | tail -4
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeCTA.tsx
git commit -m "feat(homepage): redesign HomeCTA — wiki-correct CTA sub-labels, navy-mid bg"
```

---

## Task 9: Final Build Verification

**Files:** None changed — verification only.

- [ ] **Step 1: Full production build**

```bash
cd /Users/macbook/Code/jvto-web && npm run build
```

Expected output:
```
✓ Compiled successfully in X.Xs
✓ Generating static pages using 7 workers (138/138) in X.Xs
```

- [ ] **Step 2: Verify no pre-existing errors introduced**

```bash
npm run build 2>&1 | grep -E "error TS|Type error|Route" | grep -v "^\s*/" | head -20
```

Expected: only pre-existing checkout flow TS errors (if any) — no new errors.

- [ ] **Step 3: Lint check**

```bash
npm run lint 2>&1 | tail -10
```

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore(homepage): verify redesign v2 build — 138/138 static pages"
```

---

## Self-Review

**Spec coverage:**
- ① Hero: eyebrow chip, H1 italic orange em, subheadline, 2 body paragraphs, 2 CTAs (wiki labels), stats bar ✓ Task 1
- ② Differentiators: Bento Grid 2 (2 large navy + 4 small), wiki copy ✓ Task 2
- ③ Destinations: 4-col asymmetric `2fr 1fr 1fr 1fr`, Ijen featured, inline markup ✓ Task 3
- ④ Tour Packages: white bg, centered header, pill tabs, wiki copy ✓ Task 4
- ⑤ Reviews: dark navy, platform stats, wiki intro (2 paragraphs) ✓ Task 5
- ⑥ Trust: 2-col + sticky sidebar, 5 tiers wiki verbatim ✓ Task 6
- ⑦ Our Story: quote badge with wiki ¶3, 3 body paragraphs wiki verbatim ✓ Task 7
- ⑧ CTA: wiki policy reminder, wiki sub-labels on buttons ✓ Task 8

**Placeholder scan:** No TBD/TODO/placeholder text in any task. All code blocks are complete.

**Type consistency:**
- `Destination` interface used in Task 3: `id`, `name`, `slug`, `banner.url`, `banner.alt`, `description` — all confirmed from `src/interfaces.ts:84`
- `getHomeImageVariantSet` imported in Task 3 — same import used in existing `DestinationCard.tsx`
- `ListTourPackage` type in Task 4 — same as current `FeaturedTours.tsx`
- No new interfaces introduced

**Server Component constraint:** No `onMouseEnter`/`onMouseLeave` in any task. All hover effects use CSS class `.card-jvto` (Task 2, 6) or Tailwind `group-hover:` classes (Tasks 3, 7).
