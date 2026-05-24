# JVTO Homepage Redesign — Design Spec

**Date:** 2026-05-24  
**Branch:** live  
**Approach:** Narrative Arc (Option A) — photography-first, trust built progressively  
**Derived from:** Full website context analysis (/why-jvto, /verify-jvto, /destinations, /tours, /travel-guide)

---

## Goal

Replace the existing homepage with a completely new layout that:
1. Immediately communicates what JVTO is and its core differentiator (police-led, private)
2. Builds trust progressively — not all at once
3. Guides the visitor from desire → trust → action in one scroll
4. Drives dual conversion: Browse Tours + Verify Credentials

---

## Constraints (Non-Negotiable)

- **AEO schema layer is untouched.** `PageJsonLdCombined` and all `extraSchemas` in `page.tsx` remain exactly as they are. No changes to `src/lib/schemas/build*.ts` or `src/lib/*Faqs.ts`.
- **No new DB columns or migrations.**
- **No new pages** — only new components in `src/components/website/Home/`.
- **Color palette unchanged:** `jvto-green` (#B2F35F), `jvto-navy` (#0f172a), `jvto-orange` (#fb923c), `jvto-off` (#f8f8f5).
- **Rubik font already installed** via `--font-heading` CSS variable. Use on H1/H2.
- **Data helpers:** `getWebPackagesList()` and `getPublicDestinationList()` (direct, no self-fetch).
- **page.tsx stays a Server Component.** Interactivity (tabs) goes into a client component.
- **Link component:** Always use `import Link from "@/components/website/AppLink"` — never `next/link` directly.
- **Image component:** Always use `import Image from "next/image"` with explicit `sizes` attribute.

## Code Conventions

### Section padding standard
Every section uses: `py-20 md:py-28` for section padding. Container: `max-w-7xl mx-auto px-6 md:px-8`.

### Slug → href pattern
`PackageListItem.slug` already contains the full path (e.g., `tours/from-surabaya/bromo-1d1n`).  
**Always use:** `` href={`/${pkg.slug}`} `` — never `` href={`/tours/${pkg.slug}`} ``.

### Duration label formatting
```ts
`${pkg.duration.day}D · ${pkg.duration.night}N`
// e.g. "3D · 2N"
```

### Price formatting
```ts
`From IDR ${new Intl.NumberFormat('id-ID').format(pkg.startFrom)}`
// e.g. "From IDR 1.650.000"
```

### keyExperiences safe access
```ts
const highlights = pkg.keyExperiences.slice(0, 2);
// Renders 0, 1, or 2 items — never throws if array is short.
```

---

## Architecture: Components to Create

All new components replace the old ones in `src/components/website/Home/`. The old components (`Hero.tsx`, `Differentiators.tsx`, `FeaturedTours.tsx`, `Reviews.tsx`, `TrustVerification.tsx`, `WhyJVTO.tsx`, `HomeCTA.tsx`, `HomeDestinations.tsx`) are deleted and replaced entirely.

| New File | Type | Replaces |
|---|---|---|
| `src/components/website/Home/HomeHero.tsx` | Server | `Hero.tsx` |
| `src/components/website/Home/HomeTrustStrip.tsx` | Server | (new) |
| `src/components/website/Home/HomeDestinations.tsx` | Server | `HomeDestinations.tsx` |
| `src/components/website/Home/HomeTours.tsx` | Server wrapper | `FeaturedTours.tsx` |
| `src/components/website/Home/HomeToursClient.tsx` | Client | (new — tabs) |
| `src/components/website/Home/HomeHowItWorks.tsx` | Server | (new) |
| `src/components/website/Home/HomeReviews.tsx` | Server | `Reviews.tsx` |
| `src/components/website/Home/HomeTravelGuideTeaser.tsx` | Server | (new) |
| `src/components/website/Home/HomeWhyJVTO.tsx` | Server | `Differentiators.tsx` + `WhyJVTO.tsx` |
| `src/components/website/Home/HomeCTA.tsx` | Server | `HomeCTA.tsx` |

`page.tsx` is updated to import and render the new components. The AEO schema block is preserved verbatim.

---

## Section Color Rhythm

```
DARK navy  → S1 Hero
OFF-WHITE  → S2 Trust Strip
WHITE      → S3 Destinations
OFF-WHITE  → S4 Tours
WHITE      → S5 How It Works
DARK navy  → S6 Reviews
OFF-WHITE  → S7 Travel Guide
WHITE      → S8 Why JVTO
DARK navy  → S9 Final CTA
```

Alternating dark/light with warm off-white as buffer. Never two DARK sections back-to-back.

---

## Section Specs

### NAV (existing — unchanged)
The site's existing `Navbar` / `Header` component is unchanged. Sticky, dark navy background.

---

### S1 — Hero (`HomeHero.tsx`)

**Background:** Full-width, full-viewport-height photo using `<Image>` with `fill` + `priority` (LCP element).  
```tsx
<Image
  src="/assets/img/hero/home.webp"
  alt="Mount Bromo volcano at sunrise — Java Volcano Tour Operator"
  fill
  priority
  sizes="100vw"
  className="object-cover"
/>
```
**Overlay:** `absolute inset-0 bg-gradient-to-b from-jvto-navy/90 via-jvto-navy/40 to-jvto-navy/80` over the image — dark enough to read text, light enough to see the mountain. Photography-first: the photo must bleed through.  
**Wrapper:** `relative min-h-screen` (or `min-h-[100svh]` for mobile safe area).

**Content layout (vertically centered, left-aligned on desktop, centered on mobile):**

```
[eyebrow chip]
Est. 2015 · Bondowoso, East Java · Tourist Police-Led

[H1 — Rubik font, white, tight tracking]
Private Volcano Tours.
Police-Led.

[subtext — white/70, max-w-xl]
16 private packages to Bromo, Ijen, and East Java's best.
Licensed operator. No shared groups. All-inclusive.

[CTA row]
[Browse Tours ↗]  [Verify Credentials →]
 (jvto-green bg)   (white outline)

[Stats bar — below CTAs, separated by thin line or spacing]
4.8★ Trustpilot/51  ·  4.9★ Google/92  ·  16 Packages  ·  Est. 2015
```

**Typography:**
- H1: `font-black text-5xl md:text-7xl leading-tight` with `fontFamily: var(--font-heading)`
- Eyebrow: `text-xs font-bold uppercase tracking-widest text-jvto-green/90`
- Subtext: `text-base md:text-lg text-white/70 max-w-xl`
- Stats: `text-xs font-bold text-white/60 uppercase tracking-wide`

**CTAs:**
- "Browse Tours": `href="/tours"` — `bg-jvto-green text-jvto-navy font-black px-6 py-3 rounded-full`
- "Verify Credentials": `href="/verify-jvto"` — `border border-white/50 text-white font-bold px-6 py-3 rounded-full`

**Props:** `title: string` (from CMS/fallback H1), `description: string` (for screen readers / SEO, not displayed visually).

---

### S2 — Trust Strip (`HomeTrustStrip.tsx`)

**Background:** `bg-jvto-off` (#f8f8f5), `border-b border-jvto-navy/10`.  
**Layout:** Single horizontal row, `flex flex-wrap justify-center gap-x-8 gap-y-3 py-4 px-6`.

**4 credential items (icon + label):**

| Icon | Text |
|---|---|
| ShieldCheck (green) | Tourist Police (POLPAR) |
| Star (green) | Trustpilot 4.8★ · 51 Reviews |
| FileText (green) | NIB 1102230032918 |
| MapPin (green) | Physical Office · Bondowoso |

Each item: `flex items-center gap-2 text-sm font-semibold text-jvto-navy/80`.  
No links. This is credential display, not navigation.

---

### S3 — Destinations (`HomeDestinations.tsx`)

**Background:** `bg-white`.  
**Section label:** `text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2`  
**Heading:** "Explore East Java's Volcanoes" — `text-3xl md:text-4xl font-black text-jvto-navy`  

**Layout:** 5 cards in horizontal scroll on mobile (`overflow-x-auto snap-x`), CSS grid `grid-cols-2 md:grid-cols-5` on desktop.

**Each card:**
- `relative overflow-hidden rounded-2xl aspect-[2/3]` wrapper
- Photo using `<Image fill sizes="(max-width:768px) 50vw, 20vw" className="object-cover" />` with destination `banner.url` and `banner.alt`
- Dark gradient overlay: `absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`
- Text anchored to bottom: `absolute bottom-0 left-0 right-0 p-4`
- Destination name (white, font-black, text-base)
- 1-line highlight (white/70, text-sm) — use `highlight` field from `Destination`
- Arrow link: "View Tours →" (jvto-green, text-xs font-bold)
- `href="/destinations/{dest.slug}"`

**Destinations order + data (from `getPublicDestinationList()`):**
1. Mount Bromo — "Sunrise over Tengger Caldera" — `slug: mount-bromo`
2. Ijen Crater — "Blue Fire at 2am" — `slug: ijen-crater`
3. Tumpak Sewu — "Niagara of East Java" — `slug: tumpak-sewu-waterfall`
4. Papuma Beach — "Hidden beach, East Java coast" — `slug: papuma-beach`
5. Madakaripura — "Sacred waterfall, Majapahit heritage" — `slug: madakaripura-waterfall`

**Props:** `destinations: Destination[]` (passed from page.tsx server fetch).

---

### S4 — Tours (`HomeTours.tsx` + `HomeToursClient.tsx`)

**Background:** `bg-jvto-off`.  
**Heading:** "Browse Packages" — same typography as S3.  
**Subtext:** "Private departures from Surabaya and Bali — choose your starting point."

**Tab switcher (client component):**
- Two tabs: "From Surabaya" | "From Bali"
- Active tab: `bg-jvto-navy text-white`, inactive: `bg-white text-jvto-navy/60`
- `rounded-full` pill style

**Tour cards (4 cards shown per tab, "View All" link below):**

Each card:
- Card style: `bg-white rounded-2xl shadow-sm border border-jvto-navy/5 p-5 flex flex-col gap-3`
- Package name: `font-bold text-jvto-navy text-base leading-snug` (1–2 lines)
- Duration + difficulty row: `` `${pkg.duration.day}D · ${pkg.duration.night}N` `` + `<DifficultyBadge physicality={pkg.physicality} />`
- Price: `` `From IDR ${new Intl.NumberFormat('id-ID').format(pkg.startFrom)}` `` in `font-black text-jvto-navy text-lg`
- Up to 2 key highlights: `pkg.keyExperiences.slice(0, 2)` as `text-xs text-jvto-navy/60` list items with `·` bullet
- CTA: "See Details →" `` href={`/${pkg.slug}`} `` — `text-jvto-green font-bold text-sm`

**Data:**
- `HomeTours.tsx` (server) fetches `getWebPackagesList({ fromId: 4 })` (Surabaya = 4) and `getWebPackagesList({ fromId: 3 })` (Bali = 3), limits to 4 each.
- Passes both arrays as props to `HomeToursClient.tsx`.

**"View All" link:**
- Surabaya tab: `href="/tours/from-surabaya"`
- Bali tab: `href="/tours/from-bali"`

---

### S5 — How It Works (`HomeHowItWorks.tsx`)

**Background:** `bg-white`.  
**Heading:** "How It Works" — same typography.  
**Layout:** 3 steps, horizontal on desktop (`flex gap-8`), vertical on mobile (`flex flex-col`).

**3 steps:**

| # | Title | Description |
|---|---|---|
| 01 | Choose Your Route | Browse 16 private packages by departure city or destination. |
| 02 | Confirm via WhatsApp | Message us — we reply within 2 hours. Confirm dates, group size, and pickup. |
| 03 | Meet Your Guide | Your private guide meets you at your hotel. No terminals, no buses, no strangers. |

**Visual (committed design — do not improvise):**
- Step: `w-12 h-12 rounded-full bg-jvto-navy text-white font-black text-lg flex items-center justify-center flex-shrink-0`
- Step number text: "01", "02", "03"
- Connector line between circles (desktop only): `flex-1 border-t-2 border-jvto-navy/10 mx-4 mt-6` — sits between the circles at mid-height
- Step body below circle: title `font-black text-jvto-navy text-base mb-1`, description `text-jvto-navy/60 text-sm leading-relaxed`
- No icons — circles are the only visual element.

---

### S6 — Reviews (`HomeReviews.tsx`)

**Background:** `bg-jvto-navy`.  
**Heading:** "Verified Across Three Platforms" — `text-white font-black text-3xl md:text-4xl`  
**Subtext:** "Every review links to the original profile." — `text-white/60`

**Part A — Platform score cards (3 cards, horizontal):**

| Platform | Rating | Count | URL |
|---|---|---|---|
| Trustpilot | 4.8★ | 51 reviews | `https://trustpilot.com/review/javavolcano-touroperator.com` |
| Google Maps | 4.9★ | 92 reviews | `https://www.google.com/maps?cid=1266403973589689021` |
| TripAdvisor | 4.95★ | 21 reviews | `https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html` |

Card style: `bg-white/5 border border-white/10 rounded-2xl p-6 text-center`.  
Rating: `text-4xl font-black text-jvto-green`.  
Count: `text-white/60 text-sm`.  
Link: "View reviews ↗" in `text-jvto-green/80 text-xs`.

**Part B — Testimonials (3 quotes, below platform cards):**

Source: `TESTIMONIALS` array from `src/lib/jvtoReviews.ts`:
1. Sarah & Mark, UK — "The private tour was flawless..."
2. Tobias L., Germany — "The communication was excellent..."
3. Elena P., Spain — "Everything was private and personalized..."

Card style: `bg-white/5 border border-white/10 rounded-2xl p-6`.  
Quote marks: `text-jvto-green text-4xl font-black leading-none`.  
Name + location: `text-white font-bold` + `text-white/50 text-sm`.

**All data hardcoded from `jvtoReviews.ts` constants — no DB query.**

---

### S7 — Travel Guide Teaser (`HomeTravelGuideTeaser.tsx`)

**Background:** `bg-jvto-off`.  
**Eyebrow:** "Read Before You Go"  
**Heading:** "The Traveler's Rulebook" — `text-jvto-navy font-black`  
**Subtext:** "Active volcanoes. Health screenings. Early starts. Know before you go."

**4 guide cards (horizontal grid on desktop, 2-col on mobile):**

| Icon | Title | Description | href |
|---|---|---|---|
| MessageCircleQuestion | Frequently Asked Questions | Everything first-timers ask. | `/travel-guide/faq` |
| CreditCard | Booking & Payment | Deposits, cancellation, WhatsApp flow. | `/travel-guide/booking-information` |
| HeartPulse | Ijen Health Screening | SpO₂ and blood pressure before ascent. | `/travel-guide/ijen-health-screening` |
| Shield | Safety on Tours | Protocols, rescue access, risk realities. | `/travel-guide/safety-on-tours` |

Card style: `bg-white rounded-2xl p-6 border border-jvto-navy/5 hover:border-jvto-green transition-colors`.  
Icon: `text-jvto-green w-8 h-8 mb-3`.  
Title: `font-black text-jvto-navy text-base`.  
Description: `text-jvto-navy/60 text-sm`.  
Arrow: "→" appended to title on hover.

**All links hardcoded — no data fetch needed.**

---

### S8 — Why JVTO (`HomeWhyJVTO.tsx`)

**Background:** `bg-white`.  
**Eyebrow:** "Why JVTO"  
**Heading:** "Three Things No Other Operator Offers Together" — `text-jvto-navy font-black text-3xl md:text-4xl`

**3 differentiator cards:**

| Green accent title | Body |
|---|---|
| Tourist Police-Led | "Our founder is an active POLPAR officer. Not a travel agent who hired a guide — an officer who built a tour company." |
| Private. Always. | "Your group is your group. We never mix strangers into one vehicle or one tour. If you book 2 people, 2 people go." |
| All-Inclusive, No Surprises | "One price covers transport, guide, permits, meals where listed. No tipping culture. No last-minute extras at the gate." |

Card style: `border border-jvto-navy/10 rounded-2xl p-8` with `border-t-4 border-t-jvto-green` accent at the top.  
Title: `font-black text-jvto-navy text-xl mb-3`.  
Body: `text-jvto-navy/70 text-sm leading-relaxed`.

**"Learn more about JVTO →"** link at section footer: `href="/why-jvto"`.

---

### S9 — Final CTA (`HomeCTA.tsx`)

**Background:** `bg-jvto-navy`.  
**Heading:** "Ready to Book?" — `text-white font-black text-4xl md:text-5xl`  
**Subtext:** "WhatsApp us — we respond within 2 hours. Tell us your dates and we'll build your itinerary." — `text-white/60`

**CTA buttons:**
- Primary: "Book via WhatsApp" → `href="https://wa.me/6282244788833"` — `bg-jvto-green text-jvto-navy font-black px-8 py-4 rounded-full text-base`
- Secondary: "Browse All Tours →" → `href="/tours"` — `border border-white/30 text-white font-bold px-8 py-4 rounded-full text-base`

**No other content.** Clean dark section, two buttons, centered.

---

## Updated `page.tsx` Structure

```tsx
// The schema block (PageJsonLdCombined + all extraSchemas) is PRESERVED VERBATIM.
// Only the JSX return changes — new components replace old.

return (
  <div>
    {/* AEO SCHEMA — DO NOT MODIFY */}
    <PageJsonLdCombined ... />

    {/* S1 */}
    <HomeHero title={seo.h1} description={seo.description} />

    {/* S2 */}
    <HomeTrustStrip />

    {/* S3 */}
    <HomeDestinations destinations={destinations} />

    {/* S4 */}
    <HomeTours surabayaPackages={surabayaTours} baliPackages={baliTours} />

    {/* S5 */}
    <HomeHowItWorks />

    {/* S6 */}
    <HomeReviews />

    {/* S7 */}
    <HomeTravelGuideTeaser />

    {/* S8 */}
    <HomeWhyJVTO />

    {/* S9 */}
    <HomeCTA />
  </div>
);
```

Data fetched in `Home` async function:
```ts
const [seo, destinations, surabayaTours, baliTours] = await Promise.all([
  getPageSeo("/", fallbackSeo),
  getPublicDestinationList(),
  getWebPackagesList({ fromId: 4, limit: 4 }),  // Surabaya
  getWebPackagesList({ fromId: 3, limit: 4 }),  // Bali
]);
```

---

## Home Folder: Keep vs Delete

The `src/components/website/Home/` folder contains many files. Disposition:

**DELETE (replaced by new components):**
- `Hero.tsx`, `Differentiators.tsx`, `FeaturedTours.tsx`, `FeaturedToursClient.tsx`
- `Reviews.tsx`, `ReviewsClient.tsx`, `HomeReviewsStatic.tsx`
- `TrustVerification.tsx`, `WhyJVTO.tsx`, `HomeCTA.tsx`
- `HomeDestinations.tsx`, `Destinations.tsx`
- `TravelGuideTeaser.tsx` (replaced by `HomeTravelGuideTeaser.tsx`)

**KEEP (used by other parts of site, not homepage-specific):**
- `Features.tsx`, `Testimonials.tsx` — may be used elsewhere; do not delete without checking
- `TourRowClient.tsx` — scroll-track row; used in tours hub pages
- `IjenHealthScreeningSection.tsx`, `IsicSection.tsx` — campaign sections
- `LevelSelector.tsx` — tour filter UI
- `Trustpilot.css` — shared Trustpilot badge styles

Check each file for imports before deleting. If only imported in `page.tsx`, delete safely.

---

## What Is NOT Changing

- `src/lib/schemas/buildHomepageSchemas.ts` — untouched
- `src/lib/homepageFaqs.ts` — untouched
- `src/components/seo/PageJsonLdCombined.tsx` — untouched
- `src/lib/content/resolveFaqs.ts` — untouched
- `src/lib/schemas/entityGraph.ts` — untouched
- All AEO `extraSchemas` nodes in `page.tsx` — untouched
- `src/components/website/Footer.tsx` — untouched
- `src/components/website/DifficultyBadge.tsx` — imported and used in S4 tour cards

---

## Definition of Done

- [ ] All 9 sections render on `localhost:3000` with no console errors
- [ ] Mobile (375px): no horizontal overflow, all CTAs full-width or wrapping correctly
- [ ] Desktop (1440px): grid layouts display correctly, tab switcher works
- [ ] `npm run build` completes cleanly (0 TS errors introduced)
- [ ] Surabaya/Bali tab switching works in browser
- [ ] All links in all sections are valid internal routes or real external URLs
- [ ] AEO schema output in browser source is identical to pre-redesign (no regression)
- [ ] Old `Home/` components deleted — no dead imports in `page.tsx`
