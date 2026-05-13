# JVTO Homepage Redesign — Design Spec

**Date:** 2026-05-13
**Status:** Approved — ready for implementation

---

## Decision Summary

| Decision | Choice |
|---|---|
| Layout direction | B — Immersive Dark + Bento Grid |
| Section rhythm | B2 — Dark / Light Alternation |
| Differentiators bento | Grid 2 — 2 Large Top + 4 Small Below |
| Content source | 100% from `llm-wiki/output/copy-2026-05-12-homepage.md` |
| Design tokens | JVTO II Design System (`website.css` DS v2) |

---

## Architecture

**Page structure:** Server Component `page.tsx` orchestrates all data fetching and JSON-LD schema injection (unchanged). Each section is a separate component in `src/components/website/Home/`. All existing data helpers (`getPublicPackageList`, `getPublicDestinationList`, `getPublicHomeReviews`) are preserved unchanged.

**Key principle:** Every section component is a Server Component unless it requires client-side interactivity (reviews carousel = Client Component, everything else = Server Component).

**Design system tokens in use:**
- Colors: `jvto-navy` `jvto-navy-mid` `jvto-orange` `jvto-orange-hover` `jvto-lime` `jvto-off` `jvto-muted` `jvto-border`
- Shadows: `var(--shadow-jvto)` `var(--shadow-jvto-hover)` `var(--shadow-jvto-orange)`
- Typography: Raleway (headings, `font-family: 'Raleway', Inter, sans-serif`), Inter (body), JetBrains Mono (NIB + legal IDs)
- Radii: `rounded-[32px]` cards, `rounded-[40px]` featured cards, `rounded-full` buttons, `rounded-2xl` icon tiles
- Buttons: always pill `rounded-full`, uppercase, `tracking-[0.2em]`, `text-[10px]`

---

## Section Rhythm

```
① Hero           dark navy    bg-jvto-navy
② Differentiators off-white   bg-jvto-off
③ Destinations   dark navy    bg-jvto-navy
④ Tour Packages  white        bg-white
⑤ Reviews        dark navy    bg-jvto-navy
⑥ Trust & Verify off-white   bg-jvto-off
⑦ Our Story      dark navy    bg-jvto-navy
⑧ CTA            dark navy-mid bg-jvto-navy-mid
```

---

## Section Specs

### ① Hero — `Hero.tsx`

**Background:** `bg-jvto-navy` with full-bleed photo at `opacity-30`, navy gradient overlay  
**Layout:** Centered content, left-aligned text block, max-width 1280px container

**Elements (top to bottom):**
1. **Eyebrow chip** — lime, animated pulse dot + "Tourist Police-Led · Licensed Operator · NIB 1102230032918"
2. **H1** — Raleway 900, `clamp(42px, 6vw, 88px)`, white. Second line `em` in orange italic: `Tourist Police-Led <em>Private Volcano Tours</em> in East Java`
3. **Body paragraph** — from wiki hero body. Light weight `font-weight: 300`, `text-white/60`
4. **CTA button row** — three buttons:
   - Primary orange pill: "Browse 16 Private Tours →"
   - Lime outline pill: "Verify Licenses & Credentials"
   - White glass pill: "WhatsApp Us"
5. **Stats bar** — `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl` pill container with 4 stats separated by dividers:
   - `4.8` / Trustpilot · 51 reviews
   - `4.90` / Google Maps · 92 reviews
   - `1102230032918` (JetBrains Mono) / NIB · checkable at oss.go.id
   - `16` / Private Itineraries

**Trustpilot badge:** Keep existing SVG badge (preserve from current Hero.tsx)

---

### ② Differentiators — `Differentiators.tsx`

**Background:** `bg-jvto-off`  
**Layout:** Container, section header + bento grid

**Section header:**
- Eyebrow: muted-on-light, "WHY JVTO"
- H2: "Six things that separate JVTO *from every other operator* in East Java." — italic orange on "from every other operator"

**Bento Grid 2 — 2 Large Top + 4 Small Below:**

Top row (`grid-cols-2 gap-4`):
- Card 1 `bg-jvto-navy rounded-[32px] p-8 min-h-[200px]`: Police-Led — full body copy from wiki
- Card 2 `bg-jvto-navy rounded-[32px] p-8 min-h-[200px]`: 100% Private — full body copy from wiki

Bottom row (`grid-cols-4 gap-4`):
- Card 3 `bg-jvto-lime/8 border border-jvto-lime/22 rounded-[32px]`: All-Inclusive (lime tint — trust accent)
- Card 4 `bg-white border border-jvto-border rounded-[32px]`: Health Screening
- Card 5 `bg-white border border-jvto-border rounded-[32px]`: Verifiable Licenses
- Card 6 `bg-white border border-jvto-border rounded-[32px]`: Plan B Ready

Each card has: icon tile `w-11 h-11 rounded-2xl` + H3 (Raleway 800) + body paragraph. Bottom cards use shorter body text (1-2 sentences).

**Shadow:** `var(--shadow-jvto)` on white cards. Navy cards: no shadow.

---

### ③ Destinations — `HomeDestinations.tsx`

**Background:** `bg-jvto-navy`  
**Layout:** Container, section header + 4-column asymmetric grid

**Section header:**
- Eyebrow: muted-on-dark
- H2: "Four destinations. *One licensed operator* covering all of them."
- Sub-paragraph: from wiki destinations intro

**Destination grid** (`grid-template-columns: 2fr 1fr 1fr 1fr`):
- Kawah Ijen: featured wide card (2× width), `min-height: 400px`, `rounded-[40px]`
- Mount Bromo, Tumpak Sewu, Madakaripura: equal-width cards, `min-height: 400px`, `rounded-[40px]`

Each card: full-bleed `<Image fill>` with `object-cover`, dark gradient overlay `from-jvto-navy/90 to-transparent`, overlay text at bottom (destination name + elevation/description from wiki copy).

**Data source:** existing `destinations` prop from `getPublicDestinationList()` — no change to data layer. Card layout replaces current horizontal scroll.

---

### ④ Tour Packages — `FeaturedTours.tsx`

**Background:** `bg-white`  
**Layout:** Container, centered header + origin tabs + 4-col card grid

**Section header (centered):**
- Eyebrow: muted-on-light
- H2: "16 private tours. *From Surabaya or Bali.* 1 to 6 days."
- Body: from wiki tour packages intro

**Origin tab pills** (centered):
- Active: `bg-jvto-navy text-white rounded-full`
- Inactive: `border border-jvto-border text-jvto-navy rounded-full`
- Tabs: "From Surabaya · 12 packages" and "From Bali · 4 packages"
- On tab click: scrolls to `#featured-tours-surabaya` or `#featured-tours-bali` anchor

**Tour rows** (below tabs, one per origin):
- Title row: `TourRowStatic` with H3 Raleway + count sub-label
- Cards: horizontal scroll `overflow-x-auto` with `snap-x`, each card `w-[80vw] sm:w-[350px]`
- `TourCardStatic` component: preserved as-is

**"View All 16 Tours" CTA** — navy pill button, centered, `var(--shadow-jvto-cta)`

**Data source:** `getPublicPackageList({ fromId: 4, limit: 6 })` and `fromId: 3` — unchanged.

---

### ⑤ Reviews — `Reviews.tsx` + wrapper in `page.tsx`

**Background:** `bg-jvto-navy`  
**Layout:** Container, section header + rating stats + review cards grid

**Section header:**
- Eyebrow: muted-on-dark
- H2: "51 reviews on Trustpilot. *92 on Google Maps.* 21 on TripAdvisor."
- Sub-text: from wiki reviews intro

**Rating stats row** (3 cards, `grid-cols-3`):
- Each stat card: `bg-white/5 border border-white/10 rounded-[20px] p-5`
- Shows: score (Raleway 800 large) + platform name + star rating
- Platforms: Trustpilot (green stars `#00b67a`), Google Maps (orange stars), TripAdvisor (teal)

**Review cards** (`grid-cols-3 gap-4`):
- Card: `bg-white/5 border border-white/8 rounded-[24px] backdrop-blur-sm`
- Content: 5-star row, review title (bold white), review text excerpt (white/50), author row (avatar circle + name + "Verified · Trustpilot")
- Populated from `getPublicHomeReviews()` — existing data layer unchanged
- Client component `ReviewsClient.tsx` preserved — only the wrapper section styling changes

---

### ⑥ Trust & Verification — `TrustVerification.tsx`

**Background:** `bg-jvto-off`  
**Layout:** Container, section header + 2-col (stack + sidebar)

**Section header:**
- Eyebrow: lime-on-light (trust signal)
- H2: "Credentials you can check — *not logos you have to take on faith.*"
- Body: from wiki trust section intro, with NIB in `font-mono bg-jvto-navy/8 rounded`

**Two-column layout** (`grid-cols-[1fr_380px] gap-10`):

Left — Trust stack (5 items, `space-y-3`):
- Each item: `bg-white border border-jvto-border rounded-[24px] p-6 flex gap-4 var(--shadow-jvto)`
- Navy circle num (`01`–`05` in JetBrains Mono) + h4 + bullet list with lime `✓` markers

Right — Sticky sidebar CTA card:
- `bg-jvto-navy rounded-[32px] p-8 sticky top-20`
- H3 "Audit us before you book." + body text
- 3 buttons stacked: lime outline "Open Full Library →", white glass "See Legal Documents", white glass "See Police Credentials"

**Content:** exact 5 tiers from wiki trust stack section.

---

### ⑦ Our Story — `WhyJVTO.tsx`

**Background:** `bg-jvto-navy`  
**Layout:** Container, 2-col grid (`grid-cols-2 gap-16 items-center`)

**Left column:**
- Eyebrow: lime-on-dark
- H2: "Built by someone who saw *what the alternatives looked like.*"
- 3 body paragraphs from wiki Our Story section — light weight `text-white/60`, `space-y-5`
- 2 links at bottom: "Read the Full Story" (lime underline) + "How to Verify Us" (muted underline)

**Right column — Founder portrait:**
- `rounded-[40px] overflow-hidden aspect-[4/5] border border-white/10`
- `<Image src="/founder/agung_sambuko.webp" fill object-cover>`
- Gradient overlay: `from-jvto-navy/95 via-jvto-navy/60 to-transparent`
- Name overlay: "Agung 'Mr. Sam' Sambuko" (Raleway 800) + lime role label
- **Quote badge** — positioned `absolute -top-4 -right-4 bg-jvto-orange rounded-[20px] p-4 max-w-[180px]`:
  - Italic quote: *"In a landscape of freelancers and brokers, JVTO provides documented legitimacy."*
  - Attribution: "— Bripka Agung Sambuko"
  - `var(--shadow-jvto-orange)`

---

### ⑧ CTA — `HomeCTA.tsx`

**Background:** `bg-jvto-navy-mid border-t border-white/6`  
**Layout:** Container, fully centered

**Elements:**
- Eyebrow: muted-on-dark, "Ready to book?"
- H2: "Private tours, *documented legitimacy,* written policies."
- Policy reminder (from wiki): "Read the Rulebook Before You Book — cancellation rules, inclusions, and screening protocols are published in full before payment." (`text-white/40`)
- Button row (centered, `flex gap-3`):
  - Orange pill: "Browse Tours · 16 Itineraries →" `var(--shadow-jvto-orange)`
  - Lime outline pill: "Verify JVTO ↗"
- Sub-labels (tiny, `text-white/25`): "From Surabaya & Bali" · "NIB 1102230032918 · Checkable at oss.go.id"

---

## Files to Create / Modify

| File | Action | Notes |
|---|---|---|
| `src/components/website/Home/Hero.tsx` | Modify | New layout: eyebrow chip, left-aligned H1 with italic orange em, hero body, 3-button row, stats bar |
| `src/components/website/Home/Differentiators.tsx` | Modify | Bento Grid 2: 2 large navy + 4 small |
| `src/components/website/Home/HomeDestinations.tsx` | Modify | Asymmetric 4-col grid with `grid-template-columns: 2fr 1fr 1fr 1fr` replacing horizontal scroll |
| `src/components/website/Home/FeaturedTours.tsx` | Modify | White bg, centered header, updated origin tab pills |
| `src/components/website/Home/Reviews.tsx` / wrapper in `page.tsx` | Modify | Dark bg, stats panels + glassmorphism card grid |
| `src/components/website/Home/TrustVerification.tsx` | Modify | 2-col: stack + sticky sidebar CTA card |
| `src/components/website/Home/WhyJVTO.tsx` | Modify | Add quote badge, same 2-col layout |
| `src/components/website/Home/HomeCTA.tsx` | Modify | Add NIB sub-label, tighten copy |
| `src/app/(website)/page.tsx` | Modify | Reviews wrapper: new dark section styling |

**No new files.** No data layer changes. No schema/SEO changes.

---

## Constraints

- All content verbatim from `llm-wiki/output/copy-2026-05-12-homepage.md`
- All design tokens from JVTO II Design System (`website.css` DS v2)
- No `onMouseEnter`/`onMouseLeave` in Server Components — use CSS `.card-jvto` hover class from `website.css`
- Destination grid changes layout from horizontal scroll to 4-col grid — this requires verifying `DestinationCard` can handle full-height fill mode, or inlining the card markup in `HomeDestinations.tsx`
- Pre-existing 42 TypeScript errors in checkout flow are out of scope — do not touch
- Build must pass `npm run build` with 138/138 static pages after each task

---

## What Does NOT Change

- `page.tsx` JSON-LD schema injection (all AEO schemas preserved)
- All data fetching helpers and their call signatures
- `ReviewsClient.tsx` internal logic (carousel behavior)
- `TourCardStatic` component
- Navbar and Footer (already DS-compliant from previous session)
- `src/app/(website)/website.css` (tokens already added)
