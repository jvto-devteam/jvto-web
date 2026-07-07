# DESIGN_BASELINE.md — JVTO Design System (extracted)

> **Source artifact:** `new one.zip` (supplied 2026-07-07) — verified **byte-identical** to the
> repo's `docs/design-reference/` (jvto-system.css md5-identical; 11/12 sampled files md5-identical;
> the lone diff, `uploads/trust-signals.md`, is CRLF/LF line-endings only, same data).
> **Design SSOT = `docs/design-reference/jvto-system.css`** (1330 lines). This document extracts its
> architecture, tokens, patterns, and naming so it can be mapped against the repo.

---

## 0. What the package is

Three layers:

| Layer | Files | Role |
|---|---|---|
| **Design system** | `jvto-system.css`, `animated-testimonials.js`, `feature-carousel.js`, `image-slot.js`, `tweaks-{app,panel}.jsx` | The implemented visual language + a dev-only React "tweaks" panel (unpkg CDN React/Babel — **prototype tooling, not for production**). |
| **Static pages** | ~50 `*.html` (homepage, tours, destinations, why-jvto, verify-jvto, travel-guide, policy, contact, blog, isic) | Hand-authored HTML mirrors of the site routes, all consuming `jvto-system.css` + shared chrome. |
| **Content corpus** | `uploads/*.md`, `uploads/*.json` | SSOT v6 dossiers (facts, copy, claims, crew, reviews, schema templates). Content — not design. |

Shared chrome is centralized in `_parts/chrome.json` (ribbon / nav / footer / scripts) — the design's
own anti-drift mechanism.

---

## 1. Design tokens (`:root` in `jvto-system.css`)

### Color — "navy + orange + lime" editorial palette
| Token | Value | Role |
|---|---|---|
| `--navy` | `#0D1B2A` | Primary dark surface, headings on light, ink |
| `--navy-mid` | `#1C2E40` | Secondary dark surface / depth step |
| `--orange` | `#E8650A` | Primary accent — price, CTA, active nav hover |
| `--orange-hover` | `#C4520A` | Orange pressed/hover |
| `--gold` | `#F5A623` | Star ratings |
| `--lime` | `#8CC63F` | Verify/trust accent, ribbon dot, badges-lime |
| `--off` | `#F6F5F2` | Page background (warm off-white) |
| `--muted` | `#6B7280` | Secondary text |
| `--border` | `#E3E0DA` | Hairline rules, dividers |
| `--white` | `#FFFFFF` | White surfaces |

### Typography
| Token | Stack | Use |
|---|---|---|
| `--font-sans` | `'Inter', system-ui` | Body |
| `--font-display` | `'Raleway', serif` | All headings (`h1–h5`), `.display`, `.price`, quotes |
| `--font-mono` | `'JetBrains Mono'` | `.micro` labels, section numbers, eyebrows, meta |

Headings: weight **700**, `letter-spacing: -0.02em`, `line-height: 1.05`, `text-wrap: balance`.
`.section-title`: `clamp(36px, 5vw, 64px)`. Body `line-height: 1.6`.

### Density / layout
| Token | Value |
|---|---|
| `--section-py` | `8rem` (major section vertical padding) |
| `--section-py-sm` | `5rem` |
| `--container-px` | `2rem` |
| `--gap-card` | `2rem` |
| `.container` max-width | **1360px** |

### Radius, elevation (from usage + `DESIGN (1).md` elevation table)
Editorial system favors **sharp corners** on structural surfaces (cards/sections largely
`border-radius: 0`, hairline `--border` rules) with rounded pills (`.pill`, `.eyebrow-pill`) and
circular icon wells (`.gl-arrow`, `.social-btn` `border-radius: 50%`). Shadows are used sparingly;
depth is communicated primarily by the navy/off/white background switch and hairline rules.

---

## 2. Type & utility system

| Class | Definition |
|---|---|
| `.micro` | mono, 11px, 600, `letter-spacing:0.22em`, uppercase, `--muted` |
| `.micro-light` | `.micro` on dark (white/55) |
| `.display` | Raleway 700, `-0.03em`, `line-height:1.02` |
| `.accent-orange` / `.accent-lime` | color helpers |
| `.rule` / `.rule-dark` | 1px hairline divider (light / on-dark) |
| `.bg-navy` / `.bg-off` / `.bg-white` | section background + text-color pairing |
| `.section` / `.section-sm` | vertical rhythm (`--section-py`) |
| `.section-head` | 3-col grid: `section-num` \| `section-title` \| `section-meta` (mono numbering, editorial) |

The **mono section-numbering** (`01 / 02 …` in `.section-num`, right-aligned `.section-meta`) is a
signature of the system — it reads like a printed field guide.

---

## 3. Component vocabulary (semantic classes, BEM-ish)

| Cluster | Key classes |
|---|---|
| **Ribbon** | `.ribbon`, `.ribbon-row`, `.ribbon-marquee`, `.ribbon-dot`, `.ribbon-right` |
| **Nav** | `nav.topnav` (absolute, transparent over hero), `.nav-inner`, `.brand` (`.brand small`), `.nav-links`, `.nav-cta`, `.pill`, `.pill-verify`, `.pill-wa` |
| **Hero** | `.hero`, `.hero-bg`, `.hero-overlay`, `.hero-grid` (1.4fr/1fr), `.eyebrow-row`, `.eyebrow-pill`, `.hero-lede`, `.hero-right`, `.start-block`, `.start-btns`, `.start-btn`, `.hero-stats`, `.hero-stat` |
| **Verify bar** | `.verify-bar` (lime band under hero) |
| **Trust strip** | `.trust-strip`, `.trust-grid` (5-col), `.trust-cell` |
| **Tours** | `.tours-grid` (3-col), `.tour-card`, `.tour-img`, `.tour-badges`, `.badge`, `.badge-dark`, `.badge-lime`, `.tour-num`, `.tour-body`, `.tour-meta-row`, `.stars`, `.tour-name`, `.tour-desc`, `.tour-foot`, `.tour-divider`, `.price`, `.btn-block` |
| **Pillars** | `.pillars`, `.pillar` (operational-certainty grid) |
| **Landscapes** | `.landscapes` (4-col), `.landscape`, `.landscape-grad`, `.landscape-meta`, `.landscape-num/name/tag` |
| **Health rail** | `.health-rail`, `.health-row`, `.health-icon-wrap`, `.health-checks`, `.check-chip` |
| **Reviews** | `.reviews-grid` (3-col), `.review`, `.review-quote` (Raleway italic), `.review-foot`, `.review-name`, `.review-source` |
| **Founder** | `.founder`, `.founder-img`, `.founder-quote`, `.founder-attr`, `.founder-name`, `.founder-role` |
| **Guide CTA** | `.guide`, `.guide-img`, `.guide-links`, `.guide-link`, `.gl-arrow`, `.inline-link` |
| **Footer** | `footer`, `.footer-grid` (2fr/1fr/1fr/1fr), `.footer-brand`, `.footer-socials`, `.social-btn`, `.footer-bottom`, `.footer-legal` |
| **Floating** | `.fab` (WhatsApp) |
| **Placeholders** | `.ph-wrap`, `.ph-stripes`, `.ph-label` (image-slot dev placeholders) |

**Naming convention:** semantic, hyphenated, cluster-prefixed (`tour-*`, `hero-*`, `footer-*`).
Layout via CSS grid with explicit responsive `@media` collapse (`980px`, `1000px`, `880px`, `720px`,
`640px`, `560px`, `540px`). Mobile-down single column.

---

## 4. Chrome (`_parts/chrome.json`) — verbatim content baseline

- **Ribbon:** `PT Java Volcano Rendezvous` · `NIB · 1102230032918` · `Tourist Police-Led` · lang/currency `EN · IDR · USD · EUR` · `✓ Verify Us`.
- **Nav brand:** `JVTO · EST 2016` ⚠️ **[FACTS DRIFT — see §6]** · links: Tours / Destinations / Why JVTO / Travel Guide · CTAs: `✓ Verify Us`, `WhatsApp`.
- **Footer:** brand blurb; Quick Links; Contact `+62 822 4478 8833` / `hello@javavolcano-touroperator.com` / `Jl. Khairil Anwar No.102A, Bondowoso, East Java 68214`; Verified block `PT Java Volcano Rendezvous` / `NIB 1102230032918` / `Trustpilot 4.8 · TripAdvisor 4.95`; legal `© 2026 PT Java Volcano Rendezvous`.
- **Scripts:** WhatsApp `.fab`; `#tweaks-root` dev panel (React/Babel via unpkg) — **prototype only.**

---

## 5. Page inventory (~50 HTML)

`homepage` · `index` · `tours` · `tours-from-bali` · `tours-from-surabaya` · `tour-bromo-ijen-3d2n`
· `tour-bromo-ijen-combo-bali` · `tour-bromo-sunrise-day` · `tour-ijen-blue-fire` ·
`tour-madakaripura-bromo` · `tour-tumpak-bromo-4d` · `destinations` + 5 `destination-*` ·
`why-jvto` + `why-jvto-{our-story,our-team,reviews,the-jvto-difference,community-standards}` ·
`verify-jvto` + `verify-jvto-{legal,police-safety,press-recognition,history-artifacts}` ·
`travel-guide` + 11 `travel-guide-*` · `policy` + 3 `policy-*` · `contact` · `blog` +
`blog-why-not-unlicensed-ijen-operator` · `isic-student-package`.

Homepage section order (from `homepage.html`, `data-screen-label` markers): hero → verify-bar →
trust-strip → `#tours` → `#why` → `#trust-rotator` → `#founder` → `#destinations` → health-rail →
`#volcano-status` → `#reviews` → `#partners` → `#faq` → `#guide` → `#our-story` → cta-block.

---

## 6. Two divergences worth locking

### 6a. `uploads/DESIGN (1).md` is a **red herring** (not the shipped system)
It documents a "Much Better Adventures"-inspired system: accent **lime `#A0CC3D`**, **Rubik** font,
warm background **`#FAFBF4`**, **4px** radius, 8px spacing scale. **None of this matches the shipped
`jvto-system.css`** (navy+orange+lime, Inter/Raleway/JetBrains Mono, `#F6F5F2`, sharp corners). Treat
`DESIGN (1).md` as an **earlier exploratory brief that was abandoned**; the authoritative baseline is
`jvto-system.css`.

### 6b. Facts embedded in the design are **drift** (superseded by the repo lock)
The design package's `CLAUDE.md` + chrome encode several facts that conflict with the repo's
adjudicated `docs/CANONICAL_FACTS.md`. **The repo lock wins** (see MAPPING_MATRIX.md §Conflict
register). Design-embedded drift to NOT carry forward:
- `EST 2016` / `Incorporated 2016` → **correct = foundingDate 2015** (Booking.com 2015 award).
- Ijen health "conditional" wording → **correct = MANDATORY** (re-adjudicated 2026-07-06).
- Stefan Loose `2018 / ISBN 978-3-7701-7881-0` published as fact → repo flags **do-not-publish until physical scan verified**.

Reviews (4.8/51, 4.9/123, 4.95/21, 195), HQ (Bondowoso), NIB/TDUP (1102230032918) — design and repo **agree**.
