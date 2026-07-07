# MAPPING_MATRIX.md — Design ⇄ Repo

> Cross-references DESIGN_BASELINE.md against REPO_BASELINE.md. Two tables:
> **(A) design element → repo implementation status**, and **(B) conflict register** with the
> resolution rule applied. Status legend:
> **DONE** implemented & faithful · **PARTIAL** implemented but drifts from spec token/section ·
> **MISSING** no repo equivalent · **DRIFT** implemented but violates a fact/lock ·
> **DUP** duplicated implementation · **N/A** intentionally not ported.

**Resolution rule (from the approved plan):** *visual style → **design wins**; brand facts → **repo
`docs/CANONICAL_FACTS.md` lock wins**.* This is the grounded reading of the user's "design style =
priority" + "resolve conflicts with the most accurate/complete data."

---

## A. Design element → repo implementation

### Tokens & foundation
| Design | Repo | Status | Notes |
|---|---|---|---|
| `jvto-system.css` `:root` color tokens | `website.css` `@theme` `--color-jvto-*` | **DONE** | 1:1 values; source file byte-identical in `docs/design-reference/` |
| Fonts Inter/Raleway/JetBrains Mono | `--font-sans` / `--font-jvto-display` / `--font-jvto-mono` | **DONE** | next/font wired on layout |
| Density (`--section-py` 8rem …) | `--spacing-jvto-section` → `py-jvto-section` | **DONE** | |
| Radius/elevation | `rounded-jvto-*`, `shadow-jvto-*` | **DONE (elaborated)** | repo adds a rounded v2 layer over the spec's sharp corners — intentional |

### Chrome
| Design | Repo | Status | Notes |
|---|---|---|---|
| `.ribbon` | `Navbar.tsx` ribbon | **DONE** | NIB + Verify present |
| `.topnav` + brand + pills | `Navbar.tsx` | **DONE** | brand tag derived → **EST 2015** (design's "EST 2016" corrected) |
| `footer` | `Footer.tsx` | **DONE** | Bondowoso HQ, NIB, Trustpilot 4.8 · TripAdvisor 4.95 |
| `.fab` | `LandingPage/StickyWhatsApp.tsx` | **DONE** | |
| `#tweaks-root` React dev panel | — | **N/A** | prototype tooling, correctly omitted |

### Homepage sections (all 1:1)
| Design section | Repo component | Status |
|---|---|---|
| hero | `Home/HomeHero.tsx` | **DONE** |
| verify-bar | `Home/HomeVerifyBar.tsx` | **DONE** |
| trust-strip | `Home/HomeTrustStrip.tsx` | **DONE** |
| `#tours` | `Home/HomeTours.tsx` | **DONE** |
| `#why` pillars | `Home/HomeConfidence.tsx` | **DONE** |
| `#trust-rotator` | `Home/HomeFeatureCarousel.tsx` | **DONE** |
| `#founder` | `Home/HomeFounder.tsx` | **DONE** |
| `#destinations` | `Home/HomeDestinations.tsx` | **DONE** |
| health-rail | `Home/HomeHealthRail.tsx` | **DONE** |
| `#volcano-status` | `Home/HomeVolcanoStatus.tsx` | **DONE** |
| `#reviews` | inline Elfsight section | **DONE** | copy = canonical lock verbatim |
| `#partners` | `Home/HomePartners.tsx` | **DONE** |
| `#faq` | `Home/HomeFAQ.tsx` | **DONE** |
| `#guide` | `Home/HomeTravelGuideTeaser.tsx` | **DONE** |
| `#our-story` | `Home/HomeOurStory.tsx` | **DONE** |
| cta-block | `Home/HomeCTA.tsx` | **DONE** |

### Cluster pages
| Design page(s) | Repo route | Status | Notes |
|---|---|---|---|
| `tours.html` | `/tours` | **DONE** | |
| `tours-from-bali/-surabaya.html` | `/tours/from-bali`, `/tours/from-surabaya` | **DONE + DUP** | see B-D1: also flat `tour(s)-from-*` variants render |
| 6 `tour-*.html` | `/tours/from-{bali,surabaya}/[slug]` | **DONE** | shared `TourDetail.tsx` |
| `destinations` + 5 `destination-*` | `/destinations[/slug]` | **DONE** | |
| `why-jvto` + 5 subpages | `/why-jvto[/slug]` (+ team, reviews) | **DONE** | |
| `verify-jvto` + 4 subpages | `/verify-jvto/{legal,police-safety,press-recognition,history-artifacts}` | **PARTIAL** | see B-D2: dark sections use `bg-slate-9xx` + gradients, not `jvto-navy` token |
| `travel-guide` + 11 | `/travel-guide[/slug]` + static routes | **DONE** | |
| `policy` + 3 | `/policy[/slug]` | **DONE** | |
| `contact`, `blog*`, `isic-student-package` | `/contact`, `/blog[/slug]`, `/isic` | **DONE** | |

### JS components
| Design | Repo | Status |
|---|---|---|
| `feature-carousel.js` | `Home/HomeFeatureCarousel.tsx` (Embla/Swiper) | **DONE** |
| `animated-testimonials.js` | `Home/HomeReviews`/inline Elfsight + `Home/Testimonials.tsx` (legacy) | **DONE** — see B-D3 |
| `image-slot.js` (`.ph-*` placeholders) | real assets/`next/image` | **N/A** (placeholder tooling) |

---

## B. Conflict register

| # | Conflict | Design says | Repo says | Resolution rule | Outcome |
|---|---|---|---|---|---|
| B-F1 | **Founding year** | `EST 2016` / `Incorporated 2016` (chrome + design `CLAUDE.md`) | `foundingDate 2015`, `BRAND_EST_TAG` derived | **facts → lock wins** (Booking.com 2015 award artifact; catalog gives design's 2016 zero support) | ✅ **Repo already correct.** Design value is drift; do NOT port. |
| B-F2 | **Ijen health wording** | "conditional" (health cert can be required) | **MANDATORY** for every guest (re-adjudicated 2026-07-06) | **facts → lock wins** | ✅ Repo governs. Design wording superseded. |
| B-F3 | **Stefan Loose citation** | publishes `2018 / ISBN 978-3-7701-7881-0 / p.287` | flags **do-not-publish** until physical scan verified | **facts → lock wins** (unverified) | ⚠️ **Owner adjudication** — keep unpublished; do not import the design's citation as fact. |
| B-F4 | **Review counts** | 4.8/51 · 4.9/123 · 4.95/21 · 195 | identical | (agree) | ✅ No conflict. |
| B-F5 | **HQ address** | Bondowoso 68214 | Bondowoso 68214 | (agree) | ✅ No conflict. (`Banyuwangi` in `src` = Kawah Ijen geography, not HQ.) |
| B-S1 | **Two design palettes** | `DESIGN (1).md`: lime `#A0CC3D`, Rubik, `#FAFBF4`, 4px | `jvto-system.css`: navy+orange+lime, Inter/Raleway/mono | **style → design wins**; among design sources, the **shipped** `jvto-system.css` is authoritative | ✅ Repo matches shipped system. `DESIGN (1).md` = abandoned brief. |
| B-S2 | **Corner radius** | largely sharp (0px) | rounded v2 (`rounded-jvto-*` 8–40px) | **style → design wins**, but repo's rounded layer is a **deliberate documented elaboration** ("V2 aesthetic") | ✅ Accept repo v2 (owner-sanctioned in `website.css`); not treated as drift. |
| B-D1 | **Route duplication** | one page per route | `tour-from-*` + `tours-from-*` + `tours/from-*` all live | most-accurate/complete data | ⚠️ **Backlog (P1)** — pick canonical, redirect the rest. Not auto-fixed (deleting live routes is hard-to-reverse). |
| B-D2 | **verify-jvto palette** | navy/orange system | `bg-slate-950/900/800` + gradients (48 occ.) | **style → design wins** | ⚠️ **Backlog (P2)** — align slate→`jvto-navy`/`jvto-navy-mid`; needs visual QA (gradient stops), so not blind-swapped. |
| B-D3 | **Superseded components** | single testimonials/level components | `Home/Testimonials.tsx`, `Home/LevelSelector.tsx` (legacy-token only) may be dead | most-complete data | ⚠️ **Backlog (P2)** — confirm usage; remove if orphaned. |
| B-C1 | `uploads/trust-signals.md` diff | CRLF version | LF version | most-accurate data | ✅ **Cosmetic (line-endings)** — same review data. No action. |

---

## C. Summary

- **Design system port: substantially COMPLETE and FACTS-CORRECT.** Tokens, chrome, and the entire
  homepage section suite map 1:1; every fact conflict is already resolved the right way in the repo.
- **No P0 (drift) items in live `src`** — verified: no `EST 2016`, `47 reviews`, `4.9/112`,
  `30% deposit`, `groups of 6`, `Trip.com`, or Banyuwangi-HQ in application code.
- **Genuine remaining work is minor and judgment-driven** (route dedup B-D1, verify-jvto palette
  B-D2, dead-component sweep B-D3) → tracked in IMPLEMENTATION_PLAN.md, not speculatively auto-applied.
