# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the JVTO homepage with new copy from `llm-wiki/output/copy-2026-05-12-homepage.md` and visual design from the JVTO II Design System, while keeping all existing coding patterns, data-fetching logic, and component architecture unchanged.

**Architecture:** Server Component `page.tsx` orchestrates data fetching and JSON-LD injection (unchanged). Each section is a separate component in `src/components/website/Home/`. Two new components are added (`Differentiators.tsx` and `TrustVerification.tsx`). All existing dynamic imports and `ViewportSection` wrappers are preserved.

**Tech Stack:** Next.js 16 App Router, Tailwind v4 (`@theme` in CSS), Lucide React, `next/image`, existing data helpers (`getPublicPackageList`, `getPublicDestinationList`, `getPublicHomeReviews`).

---

## File Map

### Modified files
| File | What changes |
|---|---|
| `src/app/(website)/website.css` | Add 8 new JVTO design system color tokens + shadow vars to `@theme` |
| `src/components/website/Home/Hero.tsx` | New copy + DS design (navy gradient, pill buttons, hero body text) |
| `src/components/website/Home/Features.tsx` | Updated trust strip credentials + DS micro-label design |
| `src/components/website/Home/HomeDestinations.tsx` | New section heading/intro + DS card design |
| `src/components/website/Home/FeaturedTours.tsx` | New section heading/intro + DS button design |
| `src/components/website/Home/WhyJVTO.tsx` | New "Our Story" copy + DS design (lime accent) |
| `src/app/(website)/page.tsx` | Add `Differentiators` + `TrustVerification` imports + Reviews section heading update |

### New files
| File | Purpose |
|---|---|
| `src/components/website/Home/Differentiators.tsx` | 6 JVTO differentiators in a 2×3 grid (new section) |
| `src/components/website/Home/TrustVerification.tsx` | 5-tier trust stack section (new section) |

---

## Task 1: Add Design System Color Tokens

**Files:**
- Modify: `src/app/(website)/website.css`

- [ ] **Step 1: Add new color tokens to `@theme` block**

Open `src/app/(website)/website.css`. The existing `@theme` block is at lines 5–12. Replace it with:

```css
@theme {
  --font-sans: "Inter", sans-serif;

  /* ── Legacy tokens (keep — other pages still reference these) ── */
  --color-jvto-green: #9fce33;
  --color-jvto-dark: #1a1a1a;
  --color-jvto-light: #f5f5f5;
  --color-jvto-text: #333333;

  /* ── Design System v2 tokens ── */
  --color-jvto-navy: #0D1B2A;
  --color-jvto-navy-mid: #1C2E40;
  --color-jvto-orange: #E8650A;
  --color-jvto-orange-hover: #C4520A;
  --color-jvto-lime: #8CC63F;
  --color-jvto-gold: #F5A623;
  --color-jvto-wa-green: #25D366;
  --color-jvto-off: #F6F5F2;
  --color-jvto-muted: #4B5563;
  --color-jvto-border: #E3E0DA;
}
```

Then append after the existing `.no-scrollbar` block:

```css
/* ── JVTO Design System shadow tokens ── */
:root {
  --shadow-jvto: 0 20px 40px -15px rgba(13, 27, 42, 0.10);
  --shadow-jvto-hover: 0 30px 60px -12px rgba(13, 27, 42, 0.15);
  --shadow-jvto-orange: 0 20px 40px -10px rgba(232, 101, 10, 0.25);
  --shadow-jvto-cta: 0 20px 40px -10px rgba(13, 27, 42, 0.20);
  --shadow-jvto-stacked:
    rgba(13, 27, 42, 0.04) 0 0 0 1px,
    rgba(13, 27, 42, 0.06) 0 2px 6px 0,
    rgba(13, 27, 42, 0.12) 0 4px 8px 0;
}
```

- [ ] **Step 2: Verify build still passes**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | tail -5
```

Expected: no CSS errors, same page count as before (138/138).

- [ ] **Step 3: Commit**

```bash
git add src/app/\(website\)/website.css
git commit -m "style: add JVTO Design System v2 color + shadow tokens to Tailwind theme"
```

---

## Task 2: Rebuild Hero.tsx

**Files:**
- Modify: `src/components/website/Home/Hero.tsx`

The new hero has: same `HeroProps` interface, same `Image` + `Button` imports, new headline/subheadline (passed as props from page.tsx via `seo.h1`/`seo.description`), a new **body paragraph** below the description, updated button labels, and the existing Trustpilot SVG badge preserved as-is. Design changes: navy gradient (not black), pill buttons styled with DS classes.

- [ ] **Step 1: Replace Hero.tsx entirely**

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
    <div className="relative min-h-[87vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/hero/home-lite.webp"
          alt="Ijen Crater"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-jvto-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy via-transparent to-jvto-navy/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white mt-16">
        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-jvto-lime/40 bg-jvto-lime/10 backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
            Tourist Police-Led · Licensed Operator
          </span>
        </div>

        <h1 className="text-3xl md:text-6xl font-black leading-tight mb-6 tracking-tight max-w-5xl mx-auto" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
          {title}
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto font-light">
          {description}
        </p>

        {/* Hero body paragraph (new from copy) */}
        <p className="text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          Mr. Sam is a Tourist Police officer first, tour operator second. Every route decision, every written rule, and every safety boundary comes from someone who answers to police protocol — not a marketing brief.
        </p>

        {/* CTAs — mobile */}
        <div className="flex gap-3 justify-center md:hidden">
          <Button
            to="/tours"
            prefetch={false}
            variant="primary"
            size="md"
          >
            Browse Tours
          </Button>
          <Button
            to="/verify-jvto"
            prefetch={false}
            variant="outline"
            size="md"
            className="border-white/50 text-white hover:bg-white hover:!text-jvto-navy rounded-full"
          >
            Verify JVTO
          </Button>
        </div>

        {/* CTAs — desktop */}
        <div className="md:flex gap-4 justify-center hidden">
          <Button
            to="/tours"
            prefetch={false}
            variant="primary"
            size="lg"
          >
            Browse 16 Private Tours
          </Button>
          <Button
            to="/verify-jvto"
            prefetch={false}
            variant="outline"
            size="lg"
            className="border-white/50 text-white hover:bg-white hover:!text-jvto-navy rounded-full"
          >
            Verify Licenses &amp; Credentials
          </Button>
        </div>

        {/* Trustpilot badge — keep existing SVG unchanged */}
        <div className="mt-10">
          <a
            href="https://www.trustpilot.com/review/javavolcano-touroperator.com"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-1.5 outline-none focus:outline-offset-[-1px] focus:outline-2 focus:outline-blue-600"
            aria-label="Excellent — view Trustpilot reviews"
          >
            <div className="text-white underline font-medium whitespace-nowrap">Excellent</div>
            <div className="w-24 flex-shrink-0">
              <svg viewBox="0 0 251 46" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <title>4.8 out of 5 star rating on Trustpilot</title>
                {[0,1,2,3].map(i => (
                  <g key={i} className="tp-star">
                    <path fill="#00B67A" d={`M${51.248*i} 46.330002h46.375586V0H${51.248*i}z`} />
                    <path d={`M${39.534+51.248*i} 19.711433L${13.23+51.248*i} 38.80065l3.838216-11.797827L${7.021+51.248*i} 19.711433h12.418975l3.837417-11.798624 3.837418 11.798624h12.418975zM${23.279+51.248*i} 31.510075l7.183595-1.509576 2.862114 8.800152L${23.279+51.248*i} 31.510075z`} fill="#FFF" />
                  </g>
                ))}
                <g className="tp-star">
                  <path fill="#00B67A" d="M205.064416 46.330002h46.375587V0h-46.375587z" />
                  <path fill="#00B67A" d="M205.064416 46.330002h23.187793V0h-23.187793z" />
                  <path d="M244.597022 19.711433l-26.3029 19.089218 3.837419-11.797827-10.047304-7.291391h12.418974l3.837418-11.798624 3.837418 11.798624h12.418975zm-16.255436 11.798642l7.183595-1.509576 2.862114 8.800152-10.045709-7.290576z" fill="#FFF" />
                </g>
              </svg>
            </div>
            <div className="w-20 flex-shrink-0">
              <svg viewBox="0 0 126 31" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <title>Trustpilot</title>
                <path fill="#FFFFFF" d="M33.074774 11.07005H45.81806v2.364196h-5.010656v13.290316h-2.755306V13.434246h-4.988435V11.07005h.01111zm12.198892 4.319629h2.355341v2.187433h.04444c.077771-.309334.222203-.60762.433295-.894859.211092-.287239.466624-.56343.766597-.79543.299972-.243048.633276-.430858.999909-.585525.366633-.14362.744377-.220953 1.12212-.220953.288863 0 .499955.011047.611056.022095.1111.011048.222202.033143.344413.04419v2.408387c-.177762-.033143-.355523-.055238-.544395-.077333-.188872-.022096-.366633-.033143-.544395-.033143-.422184 0-.822148.08838-1.199891.254096-.377744.165714-.699936.41981-.977689.740192-.277753.331429-.499955.729144-.666606 1.21524-.166652.486097-.244422 1.03848-.244422 1.668195v5.39125h-2.510883V15.38968h.01111z" />
                <path fill="#00B67A" d="M30.141707 11.07005H18.63164L15.076408.177071l-3.566342 10.892977L0 11.059002l9.321376 6.739063-3.566343 10.88193 9.321375-6.728016 9.310266 6.728016-3.555233-10.88193 9.310266-6.728016z" />
                <path fill="#005128" d="M21.631369 20.26169l-.799928-2.463625-5.755033 4.153914z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓|✗" | tail -10
```

Expected: no TypeScript or build errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/Hero.tsx
git commit -m "feat(homepage): rebuild Hero with DS design + new copy from wiki"
```

---

## Task 3: Rebuild Features.tsx (Trust Strip)

**Files:**
- Modify: `src/components/website/Home/Features.tsx`

Updated trust strip with correct Trustpilot count (51 reviews per copy), DS micro-label styling, and orange hover accent.

- [ ] **Step 1: Replace Features.tsx**

```tsx
const CREDENTIALS = [
  {
    label: "NIB License",
    value: "1102230032918",
    sub: "Verifiable at oss.go.id",
    href: "https://oss.go.id",
    external: true,
  },
  {
    label: "Tourist Police",
    value: "Bripka Agung Sambuko",
    sub: "Active Polpar · Ditpamobvit",
    href: "/verify-jvto/police-safety",
    external: false,
  },
  {
    label: "Trustpilot",
    value: "4.8 · 51 Reviews",
    sub: "Excellent — verified platform",
    href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    external: true,
  },
  {
    label: "Physical Office",
    value: "Bondowoso, East Java",
    sub: "Walk-in welcome · since 2015",
    href: "https://www.google.com/maps?cid=1266403973589689021",
    external: true,
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-white border-b border-jvto-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-jvto-border">
          {CREDENTIALS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-0.5 px-6 py-5 hover:bg-jvto-off transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                {item.label}
              </span>
              <span className="font-black text-sm text-jvto-navy leading-snug group-hover:text-jvto-orange transition-colors" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
                {item.value}
              </span>
              <span className="text-[11px] text-jvto-muted mt-0.5">
                {item.sub}
                {item.external && <span className="ml-1 text-jvto-muted/50">↗</span>}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓" | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/Features.tsx
git commit -m "feat(homepage): rebuild trust strip with DS design + updated review count"
```

---

## Task 4: Create Differentiators.tsx (new section)

**Files:**
- Create: `src/components/website/Home/Differentiators.tsx`

Six differentiator cards in a 2×3 grid (desktop) / 1-col stack (mobile). Each card: Lucide icon tile + headline + body. Data is static (hardcoded from copy). No client interactivity needed — pure Server Component.

- [ ] **Step 1: Create Differentiators.tsx**

```tsx
import { ShieldCheck, Users, FileCheck, Activity, BadgeCheck, Compass } from "lucide-react";

const DIFFERENTIATORS = [
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
  {
    icon: FileCheck,
    headline: "All-Inclusive — No Surprise Local Payments",
    body: 'Entrance fees, the Bromo 4WD jeep, accommodation, breakfast, gas masks, and transfers are bundled in writing. What is and isn\'t included is published in the booking reference before you pay. "Read the Rulebook Before You Book" is a policy, not a tagline.',
    href: "/policy/inclusions-exclusions",
  },
  {
    icon: Activity,
    headline: "Ijen Health-Screening Coordination",
    body: "Ijen access rules can require a recent local health certificate. JVTO coordinates the clinic workflow when current BBKSDA rules require it — before the hike, not as an afterthought. Dr. Ahmad Irwandanu holds a verified SIP license (Kemenkes RI, checkable at satusehat.kemkes.go.id).",
    href: "/travel-guide/ijen-health-screening",
  },
  {
    icon: BadgeCheck,
    headline: "Verifiable Licenses",
    body: "NIB 1102230032918 is checkable at oss.go.id. HPWKI membership (AHU-0001072.AH.01.07.TAHUN 2024) verifies Ijen specialist guide training. BBKSDA clearance covers both Bromo Tengger Semeru National Park and Ijen. SHA-256 hashes for every credential document are published in public/llms.txt.",
    href: "/verify-jvto/legal",
  },
  {
    icon: Compass,
    headline: "Plan B When Conditions Change",
    body: "Bromo and Ijen both close without warning. JVTO operates a written Plan-B framework: if a site closes, you get an alternative route — briefed in advance, not improvised at the gate. You don't lose a day, and that is a written policy, not a verbal promise.",
    href: "/travel-guide/weather-and-closures",
  },
];

const Differentiators: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-jvto-off">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-navy/8 border border-jvto-navy/12 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy">
              Why JVTO
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight mb-4" style={{ fontFamily: 'Raleway, Inter, sans-serif', letterSpacing: '-0.025em' }}>
            Six things that separate JVTO{" "}
            <span className="text-jvto-orange italic">from every other operator</span>{" "}
            in East Java.
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIATORS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.headline}
                href={item.href}
                className="group block bg-white rounded-[32px] border border-jvto-border p-8 transition-all duration-500 hover:-translate-y-1"
                style={{ boxShadow: 'var(--shadow-jvto)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-jvto-hover)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-jvto)')}
              >
                {/* Icon tile */}
                <div className="w-12 h-12 rounded-2xl bg-jvto-off flex items-center justify-center mb-6 group-hover:bg-jvto-navy transition-colors duration-300">
                  <Icon className="w-6 h-6 text-jvto-orange group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-black text-jvto-navy mb-3 leading-snug" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
                  {item.headline}
                </h3>
                <p className="text-sm text-jvto-muted leading-relaxed">
                  {item.body}
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
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓" | tail -5
```

Expected: no errors. Note: this component is not yet imported by page.tsx, so it won't appear on the page yet — that happens in Task 9.

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/Differentiators.tsx
git commit -m "feat(homepage): create Differentiators section with 6 JVTO differentiators from wiki copy"
```

---

## Task 5: Rebuild HomeDestinations.tsx

**Files:**
- Modify: `src/components/website/Home/HomeDestinations.tsx`

Add new section heading + intro paragraph from copy. The existing scrollable card layout is preserved (still uses `<DestinationCard>`). Design: navy background, DS section header pattern.

- [ ] **Step 1: Replace HomeDestinations.tsx**

```tsx
import DestinationCard from "@/components/website/DestinationCard";
import type { Destination } from "@/interfaces";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const HomeDestinations: React.FC<HomeDestinationsProps> = ({ destinations }) => {
  if (!destinations.length) return null;

  return (
    <section className="bg-jvto-navy py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-10 px-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
              Destinations
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: 'Raleway, Inter, sans-serif', letterSpacing: '-0.025em' }}>
            Four destinations.{" "}
            <span className="text-jvto-orange italic">One licensed operator</span>{" "}
            covering all of them.
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl text-sm md:text-base">
            All JVTO tours start and end with full logistics covered. Every destination below is served by dedicated private transport — no public buses, no group vans shared with strangers.
          </p>
        </div>

        {/* Scrollable destination cards — layout unchanged */}
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {destinations.map((dest, index) => (
            <div key={dest.id} className="flex-shrink-0 w-56">
              <DestinationCard
                isHome={true}
                destination={dest}
                prioritizeImage={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDestinations;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓" | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/HomeDestinations.tsx
git commit -m "feat(homepage): update HomeDestinations with new copy + DS navy design"
```

---

## Task 6: Rebuild FeaturedTours.tsx

**Files:**
- Modify: `src/components/website/Home/FeaturedTours.tsx`

New section heading ("16 private tours. From Surabaya or Bali. 1 to 6 days."), new intro text, and DS-styled navigation buttons. All data fetching logic (`getPublicPackageList`, `TourCardStatic`, `TourRowStatic`, `ViewportSection`) is preserved unchanged.

- [ ] **Step 1: Replace only the section header markup in FeaturedTours.tsx**

The `getToursByLocation`, `TourRowStatic`, and the two `TourRowStatic` calls remain identical. Only the header block changes.

Replace the entire file with:

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
    <section className="py-16 md:py-24 bg-white">
      {/* Section header */}
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-off border border-jvto-border mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
            Tour Packages
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-jvto-navy mb-4 leading-tight" style={{ fontFamily: 'Raleway, Inter, sans-serif', letterSpacing: '-0.025em' }}>
          16 private tours.{" "}
          <span className="text-jvto-orange italic">From Surabaya or Bali.</span>{" "}
          1 to 6 days.
        </h2>
        <p className="text-jvto-muted max-w-2xl mx-auto text-base md:text-lg">
          All 16 packages are 100% private. Prices are per person, in IDR, and scale down with group size. Every package includes: accommodation, breakfast, entrance fees, Bromo 4WD jeep (where applicable), gas masks, transfers, and a T-shirt. No surprise local payments.
        </p>

        {/* Origin selector pills */}
        <div className="flex mt-8 items-center justify-center gap-3 relative z-10">
          <a
            href="#featured-tours-surabaya"
            className="px-8 py-3 rounded-full bg-jvto-navy text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-navy-mid transition-colors"
          >
            From Surabaya
          </a>
          <a
            href="#featured-tours-bali"
            className="px-8 py-3 rounded-full border border-jvto-navy text-jvto-navy font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-navy hover:text-white transition-colors"
          >
            From Bali
          </a>
        </div>
      </div>

      {/* Tour rows — logic unchanged */}
      <TourRowStatic
        id="featured-tours-surabaya"
        title="Tours From Surabaya"
        tours={surabayaTours}
      />
      <TourRowStatic
        id="featured-tours-bali"
        title="Tours From Bali"
        tours={baliTours}
      />

      <div className="text-center container mx-auto px-6 pt-8">
        <Link
          target="_blank"
          href="/tours"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-jvto-navy text-white px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy-mid transition-colors"
          style={{ boxShadow: 'var(--shadow-jvto-cta)' }}
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
      className="py-6 md:py-12 scroll-mt-24 border-b border-jvto-border last:border-0"
      intrinsicSize="780px"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-jvto-navy tracking-tight" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
              {title}
            </h3>
            <p className="text-jvto-muted mt-1 text-sm md:text-base">
              {tours.length} private itineraries available
            </p>
          </div>
        </div>

        <div className="relative -mx-6 md:mx-0 md:px-0">
          <div className="flex md:gap-6 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-6 md:px-0">
            {tours.map((tour, index) => (
              <div key={tour.id} className="flex-shrink-0 w-[80vw] sm:w-[350px]">
                <TourCardStatic
                  isNewTab
                  tour={tour}
                  prioritizeImage={index === 0}
                />
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
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓" | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/FeaturedTours.tsx
git commit -m "feat(homepage): update FeaturedTours with new copy + DS pill buttons"
```

---

## Task 7: Rebuild WhyJVTO.tsx (Our Story)

**Files:**
- Modify: `src/components/website/Home/WhyJVTO.tsx`

New section heading from copy ("Built by someone who saw what the alternatives looked like."), new body paragraphs from copy, DS design with lime accent. Founder image path, `Link` component, and Image component all preserved unchanged.

- [ ] **Step 1: Replace WhyJVTO.tsx**

```tsx
import Link from "@/components/website/AppLink";
import Image from "next/image";

const WhyJVTO: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-jvto-navy text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
                Our Story
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black leading-none mb-8" style={{ fontFamily: 'Raleway, Inter, sans-serif', letterSpacing: '-0.025em' }}>
              Built by someone who saw{" "}
              <br className="hidden md:block" />
              <span className="text-jvto-orange italic">what the alternatives looked like.</span>
            </h2>

            <div className="space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
              <p>
                JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the <strong className="text-white font-semibold">Tourist Police experience</strong> of our founder, Mr. Sam.
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
                target="_blank"
                href="/why-jvto/our-story"
                prefetch={false}
                className="font-bold border-b-2 border-jvto-lime text-white hover:text-jvto-lime transition-colors pb-1 text-base"
              >
                Read the Full Story
              </Link>
              <Link
                target="_blank"
                href="/verify-jvto"
                prefetch={false}
                className="font-bold border-b-2 border-white/20 text-white/50 hover:text-white hover:border-white transition-colors pb-1 text-base"
              >
                How to Verify Us
              </Link>
            </div>
          </div>

          {/* Right — Founder portrait (unchanged) */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative z-10 rounded-[32px] overflow-hidden border border-white/10 w-full max-w-md aspect-[4/5]" style={{ boxShadow: 'var(--shadow-jvto-hover)' }}>
              <Image
                src="/founder/agung_sambuko.webp"
                alt='Agung "Mr. Sam" Sambuko - JVTO Founder & Tourist Police Officer'
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/60 to-transparent p-8">
                <p className="font-black text-white text-xl tracking-tight mb-1" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
                  Agung "Mr. Sam" Sambuko
                </p>
                <p className="text-[10px] text-jvto-lime font-bold uppercase tracking-[0.2em]">
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
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓" | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/WhyJVTO.tsx
git commit -m "feat(homepage): update WhyJVTO with new Our Story copy + DS design"
```

---

## Task 8: Create TrustVerification.tsx (new section)

**Files:**
- Create: `src/components/website/Home/TrustVerification.tsx`

Five-tier trust stack from the copy's "Trust & Verification Section". Uses lime trust chips for each tier. Static data — pure Server Component. Design: off-white background, structured document style, subtle entry-level DS design (Trust Mode per visual modes).

- [ ] **Step 1: Create TrustVerification.tsx**

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
      { text: "HPWKI membership AHU-0001072.AH.01.07.TAHUN 2024 — Ijen specialist guide association, state-recognized, BBKSDA-supervised training", link: "/verify-jvto/legal", linkLabel: "See license" },
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
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
              Verify JVTO
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight mb-4" style={{ fontFamily: 'Raleway, Inter, sans-serif', letterSpacing: '-0.025em' }}>
            Credentials you can check —{" "}
            <span className="text-jvto-orange italic">not logos you have to take on faith.</span>
          </h2>
          <p className="text-jvto-muted text-base md:text-lg">
            Every license on this page is publicly verifiable. We publish SHA-256 hashes for all credential documents in{" "}
            <code className="font-mono text-sm bg-jvto-navy/8 px-1.5 py-0.5 rounded text-jvto-navy">public/llms.txt</code>{" "}
            so you can confirm authenticity before you book.
          </p>
        </div>

        {/* Trust stack */}
        <div className="space-y-4 max-w-3xl">
          {TRUST_STACK.map((tier) => (
            <div
              key={tier.tier}
              className="bg-white rounded-[24px] border border-jvto-border p-6 md:p-8"
              style={{ boxShadow: 'var(--shadow-jvto)' }}
            >
              <div className="flex items-start gap-4">
                {/* Tier number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jvto-navy flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white font-mono">{tier.tier}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-jvto-navy text-base mb-3" style={{ fontFamily: 'Raleway, Inter, sans-serif' }}>
                    {tier.label}
                  </h3>
                  <ul className="space-y-2">
                    {tier.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-jvto-muted">
                        <span className="text-jvto-lime mt-0.5 flex-shrink-0">✓</span>
                        <span>
                          {item.text}
                          {item.link && (
                            <a
                              href={item.link}
                              target={item.link.startsWith("http") ? "_blank" : undefined}
                              rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="inline-flex items-center gap-1 ml-2 text-jvto-orange hover:underline font-medium"
                            >
                              {item.linkLabel}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to full verify page */}
        <div className="mt-12">
          <Link
            href="/verify-jvto"
            prefetch={false}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-jvto-lime/50 text-jvto-lime font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-lime/10 transition-colors"
          >
            Open Full Verification Library
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrustVerification;
```

- [ ] **Step 2: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | grep -E "error|Error|✓" | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/website/Home/TrustVerification.tsx
git commit -m "feat(homepage): create TrustVerification section with 5-tier trust stack"
```

---

## Task 9: Update page.tsx — Integrate New Sections + Reviews Wrapper

**Files:**
- Modify: `src/app/(website)/page.tsx`

Add imports for `Differentiators` and `TrustVerification`. Insert them into the page at the correct positions. Update the Reviews section wrapper copy (heading + intro). All existing JSON-LD logic, FAQ resolver, and dynamic imports remain unchanged.

- [ ] **Step 1: Add new imports**

After the existing imports block (after line `import TravelGuideTeaser from...`), add:

```tsx
import Differentiators from "@/components/website/Home/Differentiators";
import TrustVerification from "@/components/website/Home/TrustVerification";
```

- [ ] **Step 2: Update the return JSX**

The current return block looks like:
```tsx
return (
  <div>
    <PageJsonLdCombined ... />
    <Hero ... />
    <Features />
    <HomeDestinations destinations={destinations} />
    <FeaturedTours />
    <WhyJVTO />
    <div className="bg-jvto-green/5 pt-20 pb-20"> ← Reviews wrapper
      ...
    </div>
    <ViewportSection ...><IjenHealthScreeningSection /></ViewportSection>
    ...
  </div>
);
```

Replace the return block with:

```tsx
return (
  <div>
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
    <Hero title={seo.h1} description={seo.description} />
    <Features />
    <Differentiators />
    <HomeDestinations destinations={destinations} />
    <FeaturedTours />
    <WhyJVTO />
    <TrustVerification />

    {/* Reviews section */}
    <div className="bg-white pt-20 pb-20 border-t border-jvto-border">
      <div className="w-full container mx-auto">
        <div className="max-w-3xl mx-auto px-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-off border border-jvto-border mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
              Guest Reviews
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-jvto-navy leading-tight mb-3" style={{ fontFamily: 'Raleway, Inter, sans-serif', letterSpacing: '-0.025em' }}>
            51 reviews on Trustpilot.{" "}
            <span className="text-jvto-orange italic">92 on Google Maps.</span>{" "}
            21 on TripAdvisor.
          </h2>
          <p className="text-jvto-muted text-base">
            Trustpilot rating: <strong className="text-jvto-navy">4.8 / 5</strong> (51 reviews). Google Maps: <strong className="text-jvto-navy">4.90 / 5</strong> (92 reviews). TripAdvisor: <strong className="text-jvto-navy">4.95 / 5</strong> (21 reviews). All platforms link to live profiles — not screenshots.
          </p>
        </div>
        <Reviews />
      </div>
    </div>

    <ViewportSection intrinsicSize="680px">
      <IjenHealthScreeningSection />
    </ViewportSection>
    <ViewportSection intrinsicSize="560px">
      <IsicSection />
    </ViewportSection>
    <ViewportSection intrinsicSize="520px">
      <FAQSection copy={faqsCopy} faqs={miniFaqs} />
    </ViewportSection>
    <ViewportSection intrinsicSize="520px">
      <TravelGuideTeaser />
    </ViewportSection>
    <ViewportSection intrinsicSize="760px">
      <Contact deferMap />
    </ViewportSection>
  </div>
);
```

- [ ] **Step 3: Build check**

```bash
cd /Users/macbook/Code/jvto-web && npm run build 2>&1 | tail -10
```

Expected: all 138 static pages compile successfully.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(website\)/page.tsx
git commit -m "feat(homepage): integrate Differentiators + TrustVerification + update Reviews section heading"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full production build**

```bash
cd /Users/macbook/Code/jvto-web && npm run build
```

Expected: ✓ Compiled successfully. Same or higher static page count (138+/138).

- [ ] **Step 2: Dev server smoke test**

```bash
cd /Users/macbook/Code/jvto-web && npm run dev
```

Open `http://localhost:3000` and verify in order:
- [ ] Hero: dark navy overlay (not black), lime eyebrow chip, hero body paragraph visible, pill-shaped buttons
- [ ] Trust strip: updated to "4.8 · 51 Reviews", orange hover on items
- [ ] Differentiators: 6-card grid visible in off-white section with DS card styling
- [ ] Destinations: navy background with new heading
- [ ] FeaturedTours: new heading "16 private tours", pill origin selector buttons
- [ ] WhyJVTO: new Our Story heading with orange italic span, lime eyebrow chip
- [ ] TrustVerification: 5-tier trust stack visible with lime checkmarks
- [ ] Reviews: updated heading "51 reviews on Trustpilot. 92 on Google Maps. 21 on TripAdvisor."
- [ ] All existing sections (Ijen, ISIC, FAQ, TravelGuideTeaser, Contact) still render

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/macbook/Code/jvto-web && npm run lint
```

Expected: no new errors (pre-existing 42 errors in checkout flow are out of scope).

---

## Self-Review Checklist

**Spec coverage:**
- [x] Hero — new copy + DS design ✓ (Task 2)
- [x] 6 Differentiators section — new section from copy ✓ (Task 4)
- [x] Destinations section — new heading/intro ✓ (Task 5)
- [x] Tour Packages section — new heading/intro + DS buttons ✓ (Task 6)
- [x] Reviews section — updated heading with exact review counts ✓ (Task 9)
- [x] Trust & Verification section — new section from copy ✓ (Task 8)
- [x] Our Story section — new copy from copy ✓ (Task 7)
- [x] Design tokens — all DS colors + shadows added ✓ (Task 1)
- [x] Footer copy — footer is NOT part of `page.tsx` (lives in `Footer.tsx` in the layout) — out of scope for this plan per task scope (layout component, not homepage)
- [x] CTA section copy — covered by Hero buttons + TrustVerification CTA + FeaturedTours "View All" button

**Placeholder scan:** No TBD or TODO markers in any task. All code blocks are complete.

**Type consistency:**
- `Destination` type in `HomeDestinations` props — unchanged, still from `@/interfaces`
- `ListTourPackage` type in `FeaturedTours` — unchanged, still from `@/types`
- New components (`Differentiators`, `TrustVerification`) take no props — no type mismatch risk
- `TRUST_STACK` and `DIFFERENTIATORS` arrays are inline const — no external type dependencies
