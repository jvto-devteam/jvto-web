# JVTO-MBA Hybrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align JVTO's tour pages, destination pages, and visual design with Much Better Adventures' structural clarity while preserving JVTO's police-led trust differentiators and AEO entity graph.

**Architecture:** 8 sequential tasks — content edits first (no deploy), then TSX additions to TourDetail.tsx via extracted components, then destination page improvements, then visual design. AEO schema (`src/lib/schemas/`, `narrative_claims` DB) is untouched throughout. TourDetail.tsx new sections are extracted as separate component files following the existing AuthorityShield/TrustBar/LegalBadge pattern.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, Prisma 6, `next/font/google` (Rubik), Lucide icons

---

## File Map

| File | Task | Change |
|---|---|---|
| DB content (`packages.description`, `packages.inclusions` strings) | 1 | Content edit — shorten inclusions, rewrite descriptions |
| `src/components/website/WhatItsLike.tsx` | 2 | NEW — experience-forward description block |
| `src/components/website/TourDetail.tsx` | 2, 3, 4, 5 | Import + render new components, replace dot-indicator |
| `src/components/website/DifficultyBadge.tsx` | 3 | NEW — 4-tier badge replacing dot-indicator |
| `src/components/website/BookWithConfidenceBlock.tsx` | 4 | NEW — 3-column cross-link block |
| `src/components/website/GroupBookingCTA.tsx` | 5 | NEW — group escort CTA |
| `src/lib/queries/toursByDestination.ts` | 6 | EXTEND — add banner, startFrom, duration to return type |
| `src/components/website/DestinationTourCard.tsx` | 6 | NEW — lightweight tour card for destination pages |
| `src/components/website/DestinationDetailView.tsx` | 6, 8 | Render DestinationTourCard grid + Why Visit bullets |
| `src/app/(website)/destinations/[slug]/page.tsx` | 6 | Pass extended tour list as prop to DestinationDetailView |
| `src/app/(website)/layout.tsx` | 7 | Add Rubik font variable |
| `src/app/(website)/website.css` | 7 | Apply --font-heading to h1, h2; section padding rhythm |

---

### Task 1: Content edits — inclusions + descriptions (DB)

No code change. Update directly via Prisma Studio, CMS admin, or direct SQL. No deployment needed.

**Files:**
- DB: `packages` table, `inclusions` (text array) and `description` (text) columns

- [ ] **Step 1: Open Prisma Studio**

```bash
cd /Users/macbook/Code/jvto-web
npx prisma studio
```

Navigate to `packages` table. Filter: `is_publish = true`.

- [ ] **Step 2: Shorten `inclusions` strings for each tour**

For each of the 16 active tours, edit the `inclusions` JSON array so each string is ≤ 8 words, credential-forward. Pattern:

```
BEFORE: "Transportation using a private air-conditioned 4WD jeep with a dedicated driver"
AFTER:  "Private 4WD jeep + driver"

BEFORE: "All necessary crater entry permits issued by BBKSDA"
AFTER:  "BBKSDA crater entry permit"

BEFORE: "Professional English-speaking local guide who holds Tourist Police credentials"
AFTER:  "Tourist Police-credentialed guide (POLPAR)"

BEFORE: "Gas mask rental for Ijen crater area"
AFTER:  "Gas mask rental — Ijen crater"

BEFORE: "Hotel pickup and drop-off from central Surabaya area"
AFTER:  "Hotel pickup & drop-off (Surabaya)"
```

Apply to all 16 tours. Save in Prisma Studio.

- [ ] **Step 3: Rewrite `description` for experience-forward copy**

For each tour, update `description` to open with 2–3 experience-forward sentences (this feeds the "What's It Like?" section in Task 2). Pattern:

```
BEFORE: "This 3-day-2-night tour covers Ijen, Bromo, and Madakaripura Waterfall from Surabaya."

AFTER:  "You leave Surabaya before dawn, arriving at Ijen's crater rim as blue fire fades and sulfuric mist thickens in the morning light. The descent into Madakaripura's canyon narrows to a single-file trail — walls of fern and waterfall on both sides. Your guide has walked this route hundreds of times; your job is to look up."
```

Keep remaining logistics content after the opening 2–3 sentences.

- [ ] **Step 4: Verify in browser (dev server)**

```bash
npm run dev
```

Navigate to any tour page. Confirm inclusions display concise bullets, description reads experience-forward in first paragraph.

- [ ] **Step 5: No commit needed** — DB change only, no git files changed.

---

### Task 2: "What's It Like?" section in TourDetail

**Files:**
- Create: `src/components/website/WhatItsLike.tsx`
- Modify: `src/components/website/TourDetail.tsx:481` (insert after AuthorityShield)

- [ ] **Step 1: Create WhatItsLike component**

```tsx
// src/components/website/WhatItsLike.tsx
import { Compass } from "lucide-react";

interface WhatItsLikeProps {
  description: string;
}

export default function WhatItsLike({ description }: WhatItsLikeProps) {
  // Extract first 2–3 sentences as the experience-forward teaser
  const sentences = description.split(/(?<=[.!?])\s+/);
  const teaser = sentences.slice(0, 3).join(" ");

  return (
    <section className="bg-white border-b border-slate-100 py-10">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-jvto-green mb-4 flex items-center gap-2">
          <Compass size={12} /> What&#39;s It Like?
        </p>
        <p className="text-slate-700 text-lg leading-relaxed italic">
          {teaser}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Import and render in TourDetail.tsx**

In `src/components/website/TourDetail.tsx`, add import at top (after existing imports):

```tsx
import WhatItsLike from "@/components/website/WhatItsLike";
```

At line 481 (after `<AuthorityShield ijenRelevant={ijenRelevant} />`), add:

```tsx
<WhatItsLike description={pkg.description ?? ""} />
```

- [ ] **Step 3: Verify in browser**

Navigate to `/tours/from-surabaya/ijen-bromo-madakaripura-3d2n`. Confirm green "WHAT'S IT LIKE?" label appears with italic description text below the trust shield and above the inclusions section.

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

Expected: no TypeScript errors, same page count.

- [ ] **Step 5: Commit**

```bash
git add src/components/website/WhatItsLike.tsx src/components/website/TourDetail.tsx
git commit -m "$(cat <<'EOF'
feat(tour): add What's It Like section to tour detail pages

New WhatItsLike component renders first 2-3 sentences of pkg.description
as an experience-forward italic teaser, positioned after AuthorityShield.
MBA-inspired section that answers emotional question before logistical ones.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Difficulty Level badge — replace dot-indicator

**Files:**
- Create: `src/components/website/DifficultyBadge.tsx`
- Modify: `src/components/website/TourDetail.tsx:456–475`

- [ ] **Step 1: Create DifficultyBadge component**

```tsx
// src/components/website/DifficultyBadge.tsx
interface DifficultyBadgeProps {
  physicality: string;
}

const DIFFICULTY_MAP: Record<string, { label: string; classes: string }> = {
  "easy":                    { label: "Easy",        classes: "bg-green-100 text-green-800 border-green-300" },
  "easy to moderate":        { label: "Easy",        classes: "bg-green-100 text-green-800 border-green-300" },
  "moderate":                { label: "Moderate",    classes: "bg-amber-100 text-amber-800 border-amber-300" },
  "moderate to challenging": { label: "Challenging", classes: "bg-orange-100 text-orange-800 border-orange-300" },
  "challenging":             { label: "Challenging", classes: "bg-orange-100 text-orange-800 border-orange-300" },
  "strenuous":               { label: "Strenuous",   classes: "bg-red-100 text-red-800 border-red-300" },
  "hard":                    { label: "Strenuous",   classes: "bg-red-100 text-red-800 border-red-300" },
};

export default function DifficultyBadge({ physicality }: DifficultyBadgeProps) {
  const key = physicality.toLowerCase();
  const { label, classes } = DIFFICULTY_MAP[key] ?? {
    label: physicality,
    classes: "bg-slate-100 text-slate-700 border-slate-300",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border ${classes}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Replace dot-indicator block in TourDetail.tsx**

In `src/components/website/TourDetail.tsx`, find and replace lines 456–476 (the Mountain icon + physicalDifficulty text + 3-dot div):

Before (lines 456–476):
```tsx
              <div className="flex items-center gap-2">
                <Mountain size={18} className="text-jvto-green" />
                <span>{pkg.physicalDifficulty}</span>
                <div className="flex gap-1 md:ml-2">
                  <div className="w-2 h-2 rounded-full bg-jvto-green"></div>
                  <div
                    className={`w-2 h-2 rounded-full ${["moderate", "hard"].includes(
                      pkg.physicalDifficulty.toLowerCase(),
                    )
                      ? "bg-jvto-green"
                      : "bg-slate-600"
                      }`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${["hard"].includes(pkg.physicalDifficulty.toLowerCase())
                      ? "bg-jvto-green"
                      : "bg-slate-600"
                      }`}
                  ></div>
                </div>
              </div>
```

After:
```tsx
              <div className="flex items-center gap-2">
                <Mountain size={18} className="text-jvto-green" />
                <DifficultyBadge physicality={pkg.physicalDifficulty} />
              </div>
```

Add import at top of TourDetail.tsx:
```tsx
import DifficultyBadge from "@/components/website/DifficultyBadge";
```

- [ ] **Step 3: Verify in browser**

Navigate to a tour page. Confirm difficulty shows as a colored text badge ("Moderate", "Challenging", etc.) instead of 3 dots. Check multiple tours for compound values like "Moderate to Challenging" → shows "Challenging".

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/website/DifficultyBadge.tsx src/components/website/TourDetail.tsx
git commit -m "$(cat <<'EOF'
feat(tour): replace difficulty dot-indicator with DifficultyBadge

DifficultyBadge maps all live DB physicality values (including compound
'Moderate to Challenging') to Easy/Moderate/Challenging/Strenuous with
color-coded styling. Replaces 3-dot visual in hero meta row.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: BookWithConfidenceBlock component

**Files:**
- Create: `src/components/website/BookWithConfidenceBlock.tsx`
- Modify: `src/components/website/TourDetail.tsx` (insert before closing of main content column)

- [ ] **Step 1: Create BookWithConfidenceBlock**

```tsx
// src/components/website/BookWithConfidenceBlock.tsx
import Link from "@/components/website/AppLink";
import { ShieldCheck, HeartHandshake, FileText } from "lucide-react";

const CONFIDENCE_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Safe by Design",
    description: "Police-coordinated tour operations",
    href: "/travel-guide/safety-on-tours",
  },
  {
    icon: HeartHandshake,
    title: "What's Covered",
    description: "Cancellation & refund conditions",
    href: "/policy/booking-payment-cancellation",
  },
  {
    icon: FileText,
    title: "Why JVTO?",
    description: "Credentials, team & track record",
    href: "/why-jvto/the-jvto-difference",
  },
] as const;

export default function BookWithConfidenceBlock() {
  return (
    <section className="border-t border-slate-100 pt-10 mt-10">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
        Book with Confidence
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CONFIDENCE_ITEMS.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-jvto-green/40 hover:bg-jvto-green/5 transition-all group"
          >
            <Icon size={20} className="text-jvto-green shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-jvto-green transition-colors">
                {title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Import and render in TourDetail.tsx**

Add import:
```tsx
import BookWithConfidenceBlock from "@/components/website/BookWithConfidenceBlock";
```

Find the main left-column content area in TourDetail.tsx. Locate the section that ends the main content (around line 1608 — after the review Swiper and safety commitment section, before `{/* RIGHT COLUMN: STICKY SIDEBAR */}`). Insert before the closing `</div>` of the left column:

```tsx
<BookWithConfidenceBlock />
```

- [ ] **Step 3: Verify in browser**

Navigate to any tour page. Scroll to bottom of main content (left column). Confirm 3-column grid of "Safe by Design", "What's Covered", "Why JVTO?" appears with icons and links.

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/website/BookWithConfidenceBlock.tsx src/components/website/TourDetail.tsx
git commit -m "$(cat <<'EOF'
feat(tour): add BookWithConfidenceBlock to tour detail pages

3-column cross-link block surfacing existing content from safety-on-tours,
booking-payment-cancellation, and why-jvto/the-jvto-difference.
MBA-equivalent 'Book with Confidence' pattern — no new pages created.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Group Booking CTA

**Files:**
- Create: `src/components/website/GroupBookingCTA.tsx`
- Modify: `src/components/website/TourDetail.tsx` (insert after BookWithConfidenceBlock)

- [ ] **Step 1: Create GroupBookingCTA**

```tsx
// src/components/website/GroupBookingCTA.tsx
import Link from "@/components/website/AppLink";
import { Users } from "lucide-react";

export default function GroupBookingCTA() {
  return (
    <div className="mt-6 rounded-xl bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-jvto-green/20 flex items-center justify-center">
          <Users size={18} className="text-jvto-green" />
        </div>
        <p className="font-black text-sm uppercase tracking-wide">
          Group of 6+?
        </p>
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-300 leading-snug">
          Police escort coordination available — no extra charge.
        </p>
      </div>
      <Link
        href="/travel-guide/police-escort-for-groups"
        className="shrink-0 text-xs font-black uppercase tracking-widest text-jvto-green hover:text-white transition-colors whitespace-nowrap"
      >
        Learn more →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Import and render in TourDetail.tsx**

Add import:
```tsx
import GroupBookingCTA from "@/components/website/GroupBookingCTA";
```

Directly after `<BookWithConfidenceBlock />`, add:
```tsx
<GroupBookingCTA />
```

- [ ] **Step 3: Verify in browser**

Navigate to any tour page. Confirm dark "Group of 6+?" banner appears below Book with Confidence, with "Learn more →" linking to police-escort page.

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/website/GroupBookingCTA.tsx src/components/website/TourDetail.tsx
git commit -m "$(cat <<'EOF'
feat(tour): add GroupBookingCTA to all tour detail pages

Dark CTA block surfacing police escort coordination for groups of 6+.
Links to existing travel-guide/police-escort-for-groups. Shown unconditionally
on all 16 tours — police escort is a universal JVTO capability.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: DestinationTourCard + destination page tour grid

**Files:**
- Modify: `src/lib/queries/toursByDestination.ts` (extend return type)
- Create: `src/components/website/DestinationTourCard.tsx`
- Modify: `src/components/website/DestinationDetailView.tsx` (add prop + render grid)
- Modify: `src/app/(website)/destinations/[slug]/page.tsx` (pass extended tours)

- [ ] **Step 1: Extend toursByDestination query**

In `src/lib/queries/toursByDestination.ts`, update the interface and query:

```ts
// src/lib/queries/toursByDestination.ts
import { prisma } from '@/lib/prisma';

export interface ToursByDestinationItem {
  id: number;
  name: string | null;
  slug: string | null;
  start_destination_id: number | null;
  // NEW fields for visual rendering
  banner_url: string | null;
  start_from: number | null;
  duration_day: number | null;
  duration_night: number | null;
  physicality: string | null;
}

export async function getToursByDestination(
  destinationSlug: string,
): Promise<ToursByDestinationItem[]> {
  const tours = await prisma.packages.findMany({
    where: {
      is_publish: true,
      deleted_at: null,
      package_destinations: {
        some: { destinations: { slug: destinationSlug } },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      start_destination_id: true,
      banner: true,           // JSON field containing { url, alt }
      start_from: true,
      duration_day: true,
      duration_night: true,
      physicality: true,
    },
    orderBy: { id: 'asc' },
  });

  return tours.map((t) => {
    const banner = t.banner as { url?: string } | null;
    return {
      id: Number(t.id),
      name: t.name,
      slug: t.slug,
      start_destination_id:
        t.start_destination_id != null ? Number(t.start_destination_id) : null,
      banner_url: banner?.url ?? null,
      start_from: t.start_from != null ? Number(t.start_from) : null,
      duration_day: t.duration_day != null ? Number(t.duration_day) : null,
      duration_night: t.duration_night != null ? Number(t.duration_night) : null,
      physicality: t.physicality,
    };
  });
}
```

- [ ] **Step 2: Verify query compiles**

```bash
npx tsc --noEmit 2>&1 | grep toursByDestination
```

Expected: no errors for this file.

- [ ] **Step 3: Create DestinationTourCard component**

```tsx
// src/components/website/DestinationTourCard.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import { Clock, MapPin } from "lucide-react";
import type { ToursByDestinationItem } from "@/lib/queries/toursByDestination";
import { formatIDR } from "@/utils/formatting";

interface DestinationTourCardProps {
  tour: ToursByDestinationItem;
}

export default function DestinationTourCard({ tour }: DestinationTourCardProps) {
  if (!tour.slug || !tour.name) return null;
  const href = `/${tour.slug}`;
  const durationLabel = tour.duration_day != null && tour.duration_night != null
    ? `${tour.duration_day}D/${tour.duration_night}N`
    : null;

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[24px] border border-jvto-border bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {tour.banner_url ? (
          <Image
            src={tour.banner_url}
            alt={tour.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
            <MapPin size={24} className="text-slate-400" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
          {tour.name}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          {durationLabel && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {durationLabel}
            </span>
          )}
          {tour.start_from != null && (
            <span className="font-bold text-jvto-green">
              {formatIDR(tour.start_from)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Add tours prop to DestinationDetailView**

In `src/components/website/DestinationDetailView.tsx`:

Add import at top:
```tsx
import DestinationTourCard from "@/components/website/DestinationTourCard";
import type { ToursByDestinationItem } from "@/lib/queries/toursByDestination";
```

Update the component signature (around line 140):
```tsx
export default function DestinationDetailView({
  data,
  routeStats,
  volcanicStatus,
  relatedTours,  // NEW
}: {
  data: DestinationDetail;
  routeStats?: RouteStats | null;
  volcanicStatus?: VolcanicStatusData | null;
  relatedTours?: ToursByDestinationItem[];  // NEW
}) {
```

Add tour grid section just before the closing `</div>` of the main content (before the right column `</aside>` or before the closing `</main>`). Insert after the Culture section (`id="culture"`), before the closing `</div>` of the `lg:col-span-2` left column:

```tsx
{/* Tours Including This Destination */}
{relatedTours && relatedTours.length > 0 && (
  <section className="scroll-mt-10">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
      Tours to This Destination
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {relatedTours.slice(0, 3).map((tour) => (
        <DestinationTourCard key={tour.id} tour={tour} />
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 5: Pass relatedTours from destination page.tsx**

In `src/app/(website)/destinations/[slug]/page.tsx`, the `tours` variable from `getToursByDestination` already exists at line 258. Update the `<DestinationDetailView>` render call to pass it:

```tsx
<DestinationDetailView
  data={data}
  routeStats={routeStats}
  volcanicStatus={volcanicStatus}
  relatedTours={tours}  {/* ADD THIS */}
/>
```

- [ ] **Step 6: Verify in browser**

Navigate to `/destinations/ijen-crater`. Confirm 2–3 tour cards appear at bottom of main content column with tour name, duration, and price. Click one — confirm navigation to correct tour page.

- [ ] **Step 7: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/queries/toursByDestination.ts src/components/website/DestinationTourCard.tsx src/components/website/DestinationDetailView.tsx src/app/\(website\)/destinations/\[slug\]/page.tsx
git commit -m "$(cat <<'EOF'
feat(destination): render tours grid on all 5 destination pages

Extended getToursByDestination to return banner_url, start_from, duration.
New DestinationTourCard component (lightweight — name, banner, price, duration).
Tours visible in main content column — replaces schema-only data.
Max 3 cards shown; data already fetched in page.tsx for schema.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Visual design — Rubik font + whitespace rhythm

**Files:**
- Modify: `src/app/(website)/layout.tsx`
- Modify: `src/app/(website)/website.css`

- [ ] **Step 1: Add Rubik font to layout**

In `src/app/(website)/layout.tsx`, add import after existing imports:

```tsx
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
```

In `WebsiteLayout`, apply the variable to the root element. Find line 70:
```tsx
<div className="bg-background-light dark:bg-background-dark font-display text-ink-neutral-700 dark:text-ink-neutral-300">
```

Change to:
```tsx
<div className={`bg-background-light dark:bg-background-dark font-display text-ink-neutral-700 dark:text-ink-neutral-300 ${rubik.variable}`}>
```

- [ ] **Step 2: Apply font variable in website.css**

In `src/app/(website)/website.css`, add at the end of the file:

```css
/* MBA Hybrid — Rubik heading font (Task 7, 2026-05-22) */
h1, h2 {
  font-family: var(--font-heading, var(--font-sans, system-ui, sans-serif));
}

/* Section whitespace rhythm */
.section-major {
  padding-top: 4rem;
  padding-bottom: 5rem;
}
.section-secondary {
  padding-top: 2.5rem;
  padding-bottom: 3rem;
}

@media (min-width: 768px) {
  .section-major {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
}
```

Note: The `section-major` / `section-secondary` classes are available for gradual adoption — apply to new sections going forward. Existing sections don't need immediate migration (no visual regression risk).

- [ ] **Step 3: Verify Rubik loads in browser**

```bash
npm run dev
```

Navigate to homepage. Open DevTools → Elements → select `<h1>`. Confirm computed font-family shows `Rubik` (or `__Rubik_...`). Navigation and body text should remain unchanged (system-sans).

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

Expected: no errors. Build count unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(website\)/layout.tsx src/app/\(website\)/website.css
git commit -m "$(cat <<'EOF'
feat(design): add Rubik heading font + section whitespace rhythm

Rubik loaded via next/font/google with variable --font-heading.
Applied to h1 and h2 via website.css. Body text unchanged (system-sans).
Added .section-major/.section-secondary utility classes for new content.
Owner review after 2 weeks — revert if visual feel not improved.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Destination page — Quick Stats + Why Visit bullets

**Files:**
- Modify: `src/components/website/DestinationDetailView.tsx`

- [ ] **Step 1: Enhance Quick Stats row in DestinationDetailView**

In `src/components/website/DestinationDetailView.tsx`, find the StatCard grid (around line 242). Add two new StatCards after the existing 4:

```tsx
{/* Existing 4 StatCards remain unchanged */}
<StatCard icon={Mountain} label="Altitude" value={`${data.altitude} masl`} />
<StatCard icon={Thermometer} label="Temp" value={data.temperature_range.split(",")[0]} />
<StatCard icon={HardHat} label="Difficulty" value={data.difficulty_level} />
<StatCard icon={Clock} label="Duration" value={data.duration} />
{/* NEW */}
<StatCard
  icon={Ticket}
  label="Permit"
  value={data.permit_required ? "Required" : "Not required"}
/>
<StatCard
  icon={UserCheck}
  label="Guide"
  value={data.guide_required ? "Mandatory" : "Optional"}
/>
```

Add `Ticket` and `UserCheck` to existing Lucide imports at top of file.

- [ ] **Step 2: Add "Why Visit" bullet block**

After the StatCard grid (around line 259), before `data.summary` paragraph, insert:

```tsx
{data.main_attractions && data.main_attractions.length > 0 && (
  <div className="mb-6">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
      Why Visit
    </p>
    <ul className="space-y-2">
      {data.main_attractions.slice(0, 3).map((attr, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <span className="text-jvto-green font-black mt-0.5">✓</span>
          <span>{attr.title}</span>
        </li>
      ))}
    </ul>
  </div>
)}
```

- [ ] **Step 3: Verify in browser**

Navigate to `/destinations/ijen-crater`. Confirm:
- "Permit: Required" and "Guide: Mandatory" stat cards appear in the row
- "Why Visit" section shows 3 bullet points from main_attractions

Navigate to `/destinations/papuma-beach`. Confirm appropriate permit/guide values.

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/components/website/DestinationDetailView.tsx
git commit -m "$(cat <<'EOF'
feat(destination): add Permit/Guide stats + Why Visit bullets

Quick Stats row extended with Permit Required and Guide Mandatory cards
from existing DB fields (permit_required, guide_required).
Why Visit bullets render first 3 items from main_attractions with checkmarks.
MBA-inspired clarity additions — no new data fetching needed.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**Spec coverage:**
- ✅ Task 1: Writing style + inclusions DB content edits
- ✅ Task 2: "What's It Like?" section — WhatItsLike.tsx
- ✅ Task 3: Difficulty Level badge — DifficultyBadge.tsx with full enum mapping
- ✅ Task 4: BookWithConfidenceBlock.tsx + integration
- ✅ Task 5: GroupBookingCTA.tsx — unconditional, links to police-escort
- ✅ Task 6: getToursByDestination extended + DestinationTourCard + page.tsx integration
- ✅ Task 7: Rubik via next/font/google + --font-heading variable + website.css
- ✅ Task 8: Quick Stats enhanced (Permit + Guide) + Why Visit bullets
- ✅ Deferred: Per-page review block (data architecture decision pending)
- ✅ AEO schema files untouched throughout

**Placeholder scan:** No TBD, TODO, or vague steps. All code is complete.

**Type consistency:**
- `ToursByDestinationItem` defined in Task 6 Step 1 and reused in Steps 3-5 ✅
- `DifficultyBadge` props match usage in TourDetail replacement ✅
- `relatedTours` prop name consistent between DestinationDetailView signature and page.tsx call ✅
