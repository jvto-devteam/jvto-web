# JVTO Design Atlas — Page Inventory
Generated: 2026-05-05  
Regenerate screenshots: `npm run dev` → `node scripts/generate-design-atlas.mjs`

---

## Section ID Convention
`<PAGE-SHORT>-<NUMBER-2DIGIT>`

| Prefix | Page cluster |
|--------|-------------|
| HOME | Homepage (/) |
| TOUR-LIST | Tour listing hubs (/tours, /tours/from-surabaya, /tours/from-bali) |
| TOUR-DETAIL | Tour detail page (/tours/from-*/[slug]) |
| DEST-LIST | Destinations hub (/destinations) |
| DEST-DETAIL | Destination detail (/destinations/[slug]) |
| WHY | Why JVTO cluster (/why-jvto/*) |
| VERIFY | Verify JVTO cluster (/verify-jvto/*) |
| GUIDE | Travel guide cluster (/travel-guide/*) |
| POLICY | Policy pages (/policy/*) |
| CONTACT | Contact page (/contact) |

---

## Homepage (/)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| HOME-01 | Navbar | `src/components/website/Navbar.tsx` | SITE_CONFIG + NextAuth session | Tours dropdown hover; mobile hamburger; search modal; login modal |
| HOME-02 | Hero | `src/components/website/Home/Hero.tsx` | CMS `content_pages.seo` → fallback | CTA → /tours; CTA → /verify-jvto; Trustpilot link |
| HOME-03 | Features / Trust Badges | `src/components/website/Home/Features.tsx` | static | none |
| HOME-04 | Destinations Grid | `src/components/website/Home/HomeDestinations.tsx` | DB `destinations` via `getWebDestinationsList()` | Card click → /destinations/[slug] |
| HOME-05 | Featured Tours / Route Selector | `src/components/website/Home/FeaturedTours.tsx` + `FeaturedToursClient.tsx` | DB `packages` via `getWebPackagesList()` | From Surabaya / From Bali scroll tabs; tour card click |
| HOME-06 | Why JVTO / Founder | `src/components/website/Home/WhyJVTO.tsx` | `SITE_CONFIG.founder` | Read Full Story → /why-jvto/our-story; How to Verify → /verify-jvto |
| HOME-07 | Reviews | `src/components/website/Home/Reviews.tsx` + `ReviewsClient.tsx` | DB `reviews` | Platform link clicks |
| HOME-08 | Ijen Health Screening | `src/components/website/Home/IjenHealthScreeningSection.tsx` | static + BBKSDA SE.1658 ref | CTA → /travel-guide/ijen-health-screening |
| HOME-09 | ISIC Student Section | `src/components/website/Home/IsicSection.tsx` | static | CTA → /isic/student-package |
| HOME-10 | FAQ Accordion | `src/components/website/FAQSection.tsx` | `miniFaqs` from constants + DB narrative_claims | Accordion expand/collapse |
| HOME-11 | Travel Guide Teaser | `src/components/website/Home/TravelGuideTeaser.tsx` | static | CTA → /travel-guide; card links |
| HOME-12 | Contact Form | `src/components/website/Contact.tsx` | SITE_CONFIG.contact | Form submit → Mailgun API |
| HOME-13 | Footer | `src/components/website/Footer.tsx` | SITE_CONFIG | Nav links; social icons; WhatsApp |
| HOME-14 | WhatsApp FAB | `src/components/website/WhatsAppFAB.tsx` | SITE_CONFIG.contact.whatsapp | Opens wa.me link; shown after scroll 100px |

---

## Tour Listing — Surabaya (/tours/from-surabaya)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| TOUR-LIST-01 | Navbar | `Navbar.tsx` | (same as HOME-01) | — |
| TOUR-LIST-02 | Hub Hero + Filter | `src/components/website/ToursPageClient.tsx` | DB `packages` (start_destination=Surabaya) via `getWebPackagesList()` | Filter chips; sort; search |
| TOUR-LIST-03 | Tour Cards Grid | `src/components/website/TourCard.tsx` | (from ToursPageClient) | Card click → /tours/from-surabaya/[slug] |
| TOUR-LIST-04 | Footer | `Footer.tsx` | — | — |

---

## Tour Listing — Bali (/tours/from-bali)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| TOUR-LIST-05 | Navbar | `Navbar.tsx` | — | — |
| TOUR-LIST-06 | Hub Hero + Filter | `ToursPageClient.tsx` | DB `packages` (start_destination=Bali) | Filter chips; sort |
| TOUR-LIST-07 | Tour Cards Grid | `TourCard.tsx` | (from ToursPageClient) | Card click → /tours/from-bali/[slug] |
| TOUR-LIST-08 | Footer | `Footer.tsx` | — | — |

---

## Tour Detail (/tours/from-*/[slug])

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| TOUR-DETAIL-01 | Navbar | `Navbar.tsx` | — | — |
| TOUR-DETAIL-02 | Hero + Gallery | `src/components/website/TourDetail.tsx` | DB `packages` via `getWebPackageDetail()` | Gallery lightbox; back button |
| TOUR-DETAIL-03 | Route Facts Bar | `TourDetail.tsx` (inline) | package.duration, physicality | — |
| TOUR-DETAIL-04 | Trip Description | `TourDetail.tsx` (inline) | package.longDesc | Expand/collapse |
| TOUR-DETAIL-05 | Inclusions / Exclusions | `TourDetail.tsx` (inline) | package.inclusions, exclusions | Expand list toggle |
| TOUR-DETAIL-06 | Itinerary | `TourDetail.tsx` (inline) | package.itinerary | Day accordion; modal full view |
| TOUR-DETAIL-07 | Accommodation | `TourDetail.tsx` (inline) | package.accommodation | — |
| TOUR-DETAIL-08 | Transport & Crew | `TourDetail.tsx` (inline) | package.vehicle + crew | — |
| TOUR-DETAIL-09 | Ijen Health Screening (if Ijen route) | `TourDetail.tsx` (conditional) | ijenRelevant flag | Link → /travel-guide/ijen-health-screening |
| TOUR-DETAIL-10 | Booking Widget | `TourDetail.tsx` (inline) | package.offers.tiers | Pax picker; date picker; add-on modal; submit → /checkout |
| TOUR-DETAIL-11 | Trust / Verify Rail | `AuthorityShield.tsx` | static | Links → /verify-jvto/* |
| TOUR-DETAIL-12 | FAQ | `TourDetail.tsx` (inline) | DB `package_faqs` via `getPublishedPackageFaqsBySlug()` | Accordion |
| TOUR-DETAIL-13 | Footer | `Footer.tsx` | — | — |

---

## Destinations Hub (/destinations)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| DEST-LIST-01 | Navbar | `Navbar.tsx` | — | — |
| DEST-LIST-02 | Hub Hero | `src/app/(website)/destinations/page.tsx` (inline) | static | — |
| DEST-LIST-03 | Destination Cards | `src/components/website/DestinationCard.tsx` | DB `destinations` via `getWebDestinationsList()` | Card → /destinations/[slug] |
| DEST-LIST-04 | Footer | `Footer.tsx` | — | — |

---

## Destination Detail (/destinations/[slug])

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| DEST-DETAIL-01 | Navbar | `Navbar.tsx` | — | — |
| DEST-DETAIL-02 | Hero + Stats | `src/components/website/DestinationDetailView.tsx` | DB `destinations` via `getWebDestinationDetail()` | — |
| DEST-DETAIL-03 | Highlights | `DestinationDetailView.tsx` | destination.highlights | — |
| DEST-DETAIL-04 | Route Map | `RouteMap.tsx` (dynamic import) | `public/routes/*.geojson` | Interactive Leaflet map |
| DEST-DETAIL-05 | Volcanic Status Badge | `VolcanicStatusBadge.tsx` | `public/ops/volcanic-status.json` | Source link |
| DEST-DETAIL-06 | Tours Including This Dest | `DestinationDetailView.tsx` + DB | `getToursByDestination()` | Tour link click |
| DEST-DETAIL-07 | Footer | `Footer.tsx` | — | — |

---

## Why JVTO Hub (/why-jvto)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| WHY-01 | Navbar | `Navbar.tsx` | — | — |
| WHY-02 | Hub Hero | `src/app/(website)/why-jvto/page.tsx` | CMS `content_pages` | — |
| WHY-03 | Differentiators Grid | `src/components/website/WhyJVTOPage.tsx` | DB `narrative_claims` | — |
| WHY-04 | Founder Block | `FoundersMission.tsx` | SITE_CONFIG.founder | — |
| WHY-05 | Footer | `Footer.tsx` | — | — |

---

## Verify JVTO Hub (/verify-jvto)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| VERIFY-01 | Navbar | `Navbar.tsx` | — | — |
| VERIFY-02 | Hub Hero + Category Grid | `src/components/website/VerifyJVTOPage.tsx` | static + CMS | Card → /verify-jvto/legal etc. |
| VERIFY-03 | Proof Belt | `ProofBelt.tsx` | `src/lib/imageAssets.ts` | — |
| VERIFY-04 | Footer | `Footer.tsx` | — | — |

---

## Travel Guide Hub (/travel-guide)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| GUIDE-01 | Navbar | `Navbar.tsx` | — | — |
| GUIDE-02 | Hub Hero | `src/components/website/TravelGuidePage.tsx` | CMS | — |
| GUIDE-03 | Guide Category Grid | `TravelGuidePage.tsx` | static | Card → /travel-guide/[slug] |
| GUIDE-04 | Footer | `Footer.tsx` | — | — |

---

## Contact (/contact)

| Section ID | Section Name | Component | Data Source | Interactions |
|---|---|---|---|---|
| CONTACT-01 | Navbar | `Navbar.tsx` | — | — |
| CONTACT-02 | Contact Info Cards | `src/components/website/ContactPage.tsx` | SITE_CONFIG.contact | Phone / WhatsApp / email links |
| CONTACT-03 | Contact Form | `Contact.tsx` | — | Form submit → API |
| CONTACT-04 | Footer | `Footer.tsx` | — | — |

---

## How to regenerate

```bash
# 1. Start dev server
npm run dev

# 2. In a second terminal, run atlas generator
node scripts/generate-design-atlas.mjs

# 3. Open atlas
# Double-click docs/design_atlas/index.html
# Or: open docs/design_atlas/index.html (macOS)
# Or: start docs\design_atlas\index.html (Windows)
```

Screenshots land in `docs/design_atlas/screenshots/` (gitignored).
Committed files: `page_inventory.md`, `index.html`, `scripts/generate-design-atlas.mjs`.
