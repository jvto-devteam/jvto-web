# REPO_BASELINE.md — jvto-web architecture & conventions

> Extracted 2026-07-07 from the live tree on branch `claude/google-drive-zip-download-anvtq8`.
> Purpose: capture the repo's design/architecture/naming so it can be mapped against
> DESIGN_BASELINE.md. **Headline:** the design system in DESIGN_BASELINE.md is **already ported**
> here (color tokens + chrome + full homepage component suite) and is **facts-correct**.
> **Updated 2026-07-07 (post-PR-review):** one exception — the Raleway/JetBrains-Mono typography
> layer is declared but never loaded, and investigating that surfaced a **third, undocumented (until
> now) design source at repo root, `DESIGN.md`**, which conflicts with it. See §2 and §9, and
> `MAPPING_MATRIX.md` §B-S3.
>
> **Repo also contains its own design brief — root `DESIGN.md`** (not part of the supplied ZIP):
> "The Field Operator's Clipboard" — phosphor-green `#9fce33` / obsidian `#1a1a1a`, **Inter-only**
> ("no display serif, no mono"), sharp 4px radius. Older than the `jvto-system.css` V2 tokens
> (commit `50471f9`, 2026-06-12, vs. V2's `ec7108c`); its palette survives as `website.css`'s
> "legacy" `jvto-green/dark/light/text` tokens and an un-cleaned-up `h1,h2{font-family:Inter}` rule.

---

## 1. Stack

- **Next.js 16** App Router (Turbopack `dev` + `build`), **React 19**, **TypeScript 5**.
- **Styling:** **Tailwind CSS v4** (`@tailwindcss/postcss`, `@tailwindcss/typography`) + Sass.
  Tailwind v4 configures the theme **in CSS via `@theme`**, not a `tailwind.config.js`.
- **Data:** Prisma 6.18 → PostgreSQL. **Auth:** NextAuth (Google). **Editor:** TipTap.
  **UI libs:** Radix (accordion/dropdown/popover), Framer Motion, Embla + Swiper, lucide-react,
  zustand, clsx + tailwind-merge.
- **Route groups:** `(website)`, `(api)`, `(cms)`, `(customer)`.

---

## 2. Design-token SSOT — `src/app/(website)/website.css` (`@theme`)

The design system is centralized here. Its own comment: *"SSOT for JVTO design tokens — extracted
from `docs/design-reference/jvto-system.css` (W3 design-reference spec). All clusters … consume
these; define new tokens HERE, never per-component."*

| Design token (`jvto-system.css`) | Repo `@theme` token | Tailwind utility |
|---|---|---|
| `--navy #0D1B2A` | `--color-jvto-navy` | `bg-jvto-navy`, `text-jvto-navy` |
| `--navy-mid #1C2E40` | `--color-jvto-navy-mid` | `bg-jvto-navy-mid` |
| `--orange #E8650A` | `--color-jvto-orange` | `text-jvto-orange` |
| `--orange-hover #C4520A` | `--color-jvto-orange-hover` | — |
| `--gold #F5A623` | `--color-jvto-gold` | `text-jvto-gold` |
| `--lime #8CC63F` | `--color-jvto-lime` | `bg-jvto-lime` |
| `--off #F6F5F2` | `--color-jvto-off` | `bg-jvto-off` |
| `--muted #6B7280` | `--color-jvto-muted` | `text-jvto-muted` |
| `--border #E3E0DA` | `--color-jvto-border` | `border-jvto-border` |
| Raleway display | `--font-jvto-display` | `font-jvto-display` ⚠️ token exists, font never loaded — see correction below |
| JetBrains Mono | `--font-jvto-mono` | `font-jvto-mono` ⚠️ token exists, font never loaded — see correction below |
| Inter | `--font-sans` | `font-sans` — the only display/body font actually fetched (`next/font/google` in `src/app/layout.tsx`) |

**Additions over the raw spec (repo elaboration):**
- **Radius scale** `--radius-jvto-{xs,sm,md,lg,xl}` = 8/12/18/28/40px → `rounded-jvto-*` (repo softens
  the design's largely sharp corners into a rounded v2 aesthetic — a deliberate implementation choice).
- **Elevation** `--shadow-jvto-soft`, `--shadow-jvto-card-hover`, plus `:root` `--shadow-jvto*`
  (navy-tinted) → `shadow-jvto-*`.
- **Density** `--spacing-jvto-section` 8rem / `-section-sm` 5rem / `-card-gap` 2rem → `py-jvto-section` etc.
- Plain-CSS aliases (`:root --jvto-navy …`) for non-Tailwind parity with the spec file.

**Legacy tokens (intentionally retained** — comment: *"keep — other pages still reference these"*):
`--color-jvto-green #9fce33`, `--color-jvto-dark #1a1a1a`, `--color-jvto-light #f5f5f5`,
`--color-jvto-text #333333`.

> **Correction (2026-07-07, post-PR-review):** these are **not** generic legacy neutrals as this
> document originally stated. They are the exact palette of a **third, separate design source: root
> `DESIGN.md`** (repo root, commit `50471f9`, 2026-06-12) — "The Field Operator's Clipboard," an
> Inter-only, phosphor-green system with its own component spec (buttons, cards, trust badges). See
> `docs/_design-port/MAPPING_MATRIX.md` §B-S3 for the full conflict this creates with the newer
> `jvto-system.css` V2 tokens (added later, commit `ec7108c`) — including an un-cleaned-up
> `h1,h2{font-family:Inter}` override in `website.css` that still cites `DESIGN.md` by name, and the
> Raleway/JetBrains-Mono fonts that V2 introduced but never actually loads (§7 below, and confirmed
> independently of the PR review by a repo-wide grep: `--font-jvto-display-loaded` /
> `--font-jvto-mono-loaded` are declared but never assigned anywhere).

`src/app/globals.css` is the outer app shell (Tailwind import + typography plugin, **light-mode
locked**, `.faq-content` list styling). `(website)/website.css` is the website-scoped theme layer.

---

## 3. Chrome components (map to `_parts/chrome.json`)

| Design chrome | Repo component | Facts status |
|---|---|---|
| `.ribbon` (NIB, Tourist-Police, Verify) | `src/components/website/Navbar.tsx` (ribbon region) | ✅ `NIB · 1102230032918`, `✓ Verify Us` |
| `.topnav` + brand + `.pill-*` | `Navbar.tsx` | ✅ brand uses **`{BRAND_EST_TAG}`** (derived) → **"EST 2015"**, not the design's hardcoded "EST 2016" |
| `footer` block | `src/components/website/Footer.tsx` | ✅ `Bondowoso HQ`, `Jl. Khairil Anwar No.102 A, Badean, Bondowoso 68214`, `NIB 1102230032918`, `Trustpilot 4.8 · TripAdvisor 4.95` |
| `.fab` WhatsApp | `src/components/website/LandingPage/StickyWhatsApp.tsx` | ✅ |
| `#tweaks-root` dev panel | *(not ported — prototype tooling)* | ✅ correctly omitted |

`(website)/layout.tsx` wires `Navbar` + `main` + `Footer` + `StickyWhatsApp` inside `Providers`,
loads Rubik via `next/font` as `--font-heading`, and sets global Metadata/OG/robots.

---

## 4. Homepage composition — 1:1 with the design

`src/app/(website)/page.tsx` composes the `Home/*` suite in the **exact design section order** and
even cites the spec inline (*"Spec 'Iconic landscapes' order (docs/design-reference/homepage.html §05)"*):

| Design section (`homepage.html`) | Repo component |
|---|---|
| hero | `Home/HomeHero.tsx` |
| verify-bar | `Home/HomeVerifyBar.tsx` |
| trust-strip | `Home/HomeTrustStrip.tsx` |
| `#tours` | `Home/HomeTours.tsx` |
| `#why` (pillars) | `Home/HomeConfidence.tsx` |
| `#trust-rotator` | `Home/HomeFeatureCarousel.tsx` |
| `#founder` | `Home/HomeFounder.tsx` |
| `#destinations` (landscapes) | `Home/HomeDestinations.tsx` |
| health-rail | `Home/HomeHealthRail.tsx` |
| `#volcano-status` | `Home/HomeVolcanoStatus.tsx` |
| `#reviews` | inline `<section>` (Elfsight live Google Reviews) — copy: **"51 reviews on Trustpilot. 123 on Google Maps. 21 on TripAdvisor."** (canonical lock, verbatim) |
| `#partners` | `Home/HomePartners.tsx` |
| `#faq` | `Home/HomeFAQ.tsx` |
| `#guide` | `Home/HomeTravelGuideTeaser.tsx` |
| `#our-story` | `Home/HomeOurStory.tsx` |
| cta-block | `Home/HomeCTA.tsx` |

Adoption metric: **`jvto-*` v2 tokens appear in 56 files / 722 occurrences.**

---

## 5. Server + Client split

Every `page.tsx` is a **Server Component**: exports `metadata`/`generateMetadata`, fetches DB data via
**direct helpers** (never self-`fetch(/api/...)` — that breaks SSG), injects JSON-LD via
`<PageJsonLdCombined>`, and passes props to client components (`*Client.tsx`, PascalCase) that own
Framer Motion / state.

Data helpers (per CLAUDE.md): `src/lib/packages/getWebPackagesList.ts`, `getWebPackageDetail.ts`;
`src/lib/destinations/getWebDestinationsList.ts`, `getWebDestinationDetail.ts`.

---

## 6. Schema (AEO/GEO) layer

- `src/lib/schemas/entityGraph.ts` — master entity graph with stable `@id`s (Organization, Founder,
  Doctor, BBKSDA, DefinedTerms…).
- `src/components/seo/PageJsonLdCombined.tsx` — standard injector (Org + WebSite + WebPage +
  Breadcrumb + optional CMS-FAQ + `extraSchemas`), with `suppressCmsFaq`.
- `src/lib/content/resolveFaqs.ts` — FAQ source precedence (`narrative_claims` > canonical hardcoded >
  CMS). Per-cluster `build*Schemas.ts` + `*Faqs.ts`.

---

## 7. Facts SSOT (governs all content, wins over design)

- **`src/lib/site-config.ts`** — runtime brand facts. `foundingDate: "2015-01-01"`;
  `FOUNDING_YEAR = 2015` (derived); **`BRAND_EST_TAG = "EST 2015"` (derived, never hardcoded)**;
  founder Agung "Mr. Sam" Sambuko. Comment explicitly warns against static "EST 2016"/"EST 2015".
- **`src/lib/jvtoReviews.ts`** — review counts (audited correct 5 Jul 2026): 4.8/51, 4.9/123, 4.95/21, 195.
- **`docs/CANONICAL_FACTS.md`** — the adjudicated lock. Rule: *facts lock wins over design spec, old
  copy, CMS draft.* Enforced by `npm run validate:content` (content-drift validator).
- **Rule:** never create new brand-config files (root `*-config.json` pattern with brand facts = delete candidate).

---

## 8. Route map under `(website)` (selected)

`/` · `/tours` (+ `tours/from-bali[/slug]`, `tours/from-surabaya[/slug]`) · `/destinations[/slug]` ·
`/why-jvto[/slug]` (+ reviews) · `/verify-jvto/{legal,police-safety,press-recognition,history-artifacts}`
· `/travel-guide[/slug]` (+ many static guide routes) · `/policy[/slug]` · `/contact` · `/isic` ·
`/checkout` · `/my-booking[/slug]` · `/team[/slug]` · `/blog[/slug]`.

⚠️ **Route duplication (flagged for MAPPING_MATRIX):** flat folders `tour-from-bali`,
`tours-from-bali`, `tour-from-surabaya`, `tours-from-surabaya` **all render full pages (no
`redirect()`)** alongside the canonical nested `tours/from-bali` / `tours/from-surabaya`. Up to three
variants of one route → duplicate-content / maintenance risk.

---

## 9. Naming conventions

- Components PascalCase (`HomeHero.tsx`); client leaf `*Client.tsx`; page files `page.tsx` (server).
- Home sections namespaced `Home*`; landing helpers under `LandingPage/`.
- Design utilities are **Tailwind tokens** (`bg-jvto-navy`, `rounded-jvto-lg`, `shadow-jvto-soft`,
  `py-jvto-section`), not the design's raw CSS classes — the semantic CSS vocabulary
  (`.tour-card`, `.hero`, …) was **translated into Tailwind**, not imported wholesale.
