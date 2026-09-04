---
name: JVTO Design System v2
description: Trust-forward operator UI for East Java volcano tours — navy authority, lime action, orange warmth. Documented from the shipped theme (src/app/(website)/website.css), not from intent.
colors:
  jvto-navy: "#0D1B2A"
  jvto-navy-mid: "#1C2E40"
  jvto-navy-raise: "#17293B"
  jvto-navy-deep: "#071019"
  jvto-navy-forensic: "#0A1520"
  jvto-orange: "#E8650A"
  jvto-orange-hover: "#C4520A"
  jvto-orange-ink: "#B64400"
  jvto-lime: "#8CC63F"
  jvto-lime-ink: "#4E7A12"
  jvto-gold: "#F5A623"
  jvto-gold-ink: "#8A6100"
  jvto-wa-green: "#25D366"
  jvto-off: "#F6F5F2"
  jvto-muted: "#4B5563"
  jvto-ink-soft: "#5A6472"
  jvto-border: "#E3E0DA"
  jvto-rule: "#D4CFC5"
  jvto-on-navy: "#C3CBD4"
  jvto-on-navy-dim: "#9AA5B1"
  jvto-status-normal: "#2F6B3A"
  jvto-status-advisory: "#8A6100"
  jvto-status-restricted: "#B64400"
  jvto-status-closed: "#9C2B1C"
  jvto-status-unknown: "#5A6472"
typography:
  sans:
    fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif"
  display:
    fontFamily: "var(--font-raleway), 'Raleway', Georgia, serif"
  mono:
    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace"
rounded:
  chrome: "2px"
  card-md: "16px"
  card-lg: "20px"
  card-xl: "32px"
  jvto-sm: "12px"
  jvto-md: "18px"
  jvto-lg: "28px"
  jvto-xl: "40px"
  full: "9999px"
---

# Design System: JVTO v2

## 1. Overview

This is **v2** of the JVTO system. The generation before it (near-black `#1a1a1a` obsidian, a single phosphor-lime `#9fce33`, single-font Inter) was retired by decision — the tokens still existed in `globals.css` as bare, un-fetched font-family stacks, and a stale `DESIGN.md` kept documenting them long after the shipped theme moved on. This file is written from the theme that is actually loaded — `src/app/(website)/website.css`'s `@theme` block, `src/app/layout.tsx`'s font wiring, and grep counts against `src/` — not from the v1 brief. Where a declared token has zero real call sites, that is stated plainly below rather than presented as a live rule.

**Three surfaces, three jobs:**
- **Navy** (`#0D1B2A` and its raise/deep/forensic depths) is the authority ground — hero fills, the `/verify-jvto` credential surfaces, sticky nav, footer.
- **Lime** (`#8CC63F`, ink `#4E7A12`) is the primary action color — the Button component's default variant, "book" and "confirm" affordances.
- **Orange** (`#E8650A`, hover `#C4520A`, ink `#B64400`) is the secondary accent — icon chips, meta glyphs (clock, pin), circular action buttons with their own `--shadow-jvto-orange`.

Off-white (`#F6F5F2`) and a warm hairline border (`#E3E0DA`) carry the neutral field; `#4B5563` muted and `#5A6472` ink-soft carry secondary text. Typography is three families with three jobs, not one weight axis: **Inter** for body and controls, **Raleway** for editorial headings, **JetBrains Mono** for chrome — labels, badges, credential data.

## 2. Colors

### Adopted (real call sites in `src/`, verified by grep 2026-09-04)
| Token | Hex | Files | Role |
|---|---|---|---|
| `jvto-navy` | `#0D1B2A` | very high (1000+ combined with siblings) | Ink/authority — headings, dark sections, primary text on light |
| `jvto-lime` | `#8CC63F` | 53 | Primary action — Button `primary` variant, confirmation icons |
| `jvto-lime-ink` | `#4E7A12` | 17 | AA-safe lime-as-text (5.10:1 on white) |
| `jvto-orange` | `#E8650A` | 42 | Secondary accent — meta icons, circular action buttons |
| `jvto-orange-hover` | `#C4520A` | 10 | Orange hover state |
| `jvto-orange-ink` | `#B64400` | 1 | AA-safe orange-as-text (5.50:1 on white) |
| `jvto-off` | `#F6F5F2` | 16 | Alternating section background, card fill on white |
| `jvto-muted` | `#4B5563` | 16 | Secondary/caption text |
| `jvto-border` | `#E3E0DA` | 18 | Hairline card/section border |
| `jvto-navy-mid` | `#1C2E40` | 3 | Secondary dark surface |
| `jvto-navy-raise` | `#17293B` | 1 | Card-on-navy |
| `jvto-navy-deep` | `#071019` | 1 | Darkest section floor |
| `jvto-ink-soft` | `#5A6472` | 1 | Secondary text on light, sparingly used |

### Declared, not adopted (present in `website.css`, zero call sites outside it)
`jvto-navy-forensic` (`#0A1520`, meant for `/verify-jvto`), `jvto-gold` + `jvto-gold-ink` (`#F5A623` / `#8A6100`), `jvto-wa-green` (`#25D366`, presumably for a WhatsApp CTA that isn't wired to this token), `jvto-rule` (`#D4CFC5`), `jvto-on-navy` + `jvto-on-navy-dim` (`#C3CBD4` / `#9AA5B1`), and the entire **five-state status ladder** (`jvto-status-normal/advisory/restricted/closed/unknown`). These are legitimate theme tokens — a dev reaching for them is not introducing an undocumented color — but nothing in the shipped UI exercises them yet. Treat this table as the backlog, not as dead weight to delete.

### Named finding — the status ladder isn't wired to its own component
[VolcanicStatusBadge.tsx](src/components/website/VolcanicStatusBadge.tsx) is the component the five-state ladder exists for — volcanic access status is JVTO's actual business domain — but it renders with raw Tailwind `emerald-950/amber-950/red-950` instead of `jvto-status-*`. Only three of the five declared states have a home in the component's `STATUS_CONFIG` at all (`operational`/`restricted`/`closed` — `advisory` and `unknown` are declared in the theme with no matching state in the type). Not fixed here — out of this task's scope — but worth an owner decision: converge the component onto the token ladder, or retire the unused theme entries.

### Named finding — a v1 hex leaked into v2's primary button
[UI/Button.tsx:39](src/components/website/UI/Button.tsx:39) — the `primary` variant hovers to a hardcoded `hover:bg-[#8Cb82b]`. That hex is not `jvto-lime-ink` (`#4E7A12`) or any declared v2 token — it is the **v1** `phosphor-green-hover` value, left over from before the retirement. It happens to still read as a plausible lime-family hover, which is exactly why it survived. Flagged, not fixed, here.

## 3. Typography

Three families, three jobs — not a single weight axis:
- **Inter** (`--font-sans`, `var(--font-inter)`): body copy, form controls, default UI text.
- **Raleway** (`--font-display`, `var(--font-raleway)`): editorial headings, prices, stat numbers, review quotes.
- **JetBrains Mono** (`--font-mono`, `var(--font-jetbrains-mono)`): chrome — labels, keys, section numbers, badges, footers, credential/verification data.

All three load as variable fonts (no fixed weight array) specifically so the full weight range (`font-medium` 500 through `font-black` 900) resolves to real cuts instead of snapping to the nearest loaded weight — see the rationale comment at [layout.tsx:16-22](src/app/layout.tsx:16). Font sizing uses Tailwind's stock scale (`text-xs` … `text-7xl`, all eleven steps present in `src/`) rather than a project-defined clamp() ramp — v1's fluid type scale did not carry forward, and no custom scale should be invented in its place.

### Named rule — three fonts, three jobs, not three choices
Do not reach for Raleway on body copy or Inter on section headings. The split is by job (editorial display vs. narrative body vs. UI chrome), not by taste. JetBrains Mono is reserved for chrome and verification/credential data — never narrative prose.

## 4. Elevation

Shadows are literal CSS custom properties, not Tailwind's default `shadow-*` scale. All seven live in `src/app/(website)/website.css`:

| Token | Value | Use |
|---|---|---|
| `--shadow-jvto` | `0 20px 40px -15px rgba(13,27,42,.10)` | Card at rest (`.card-jvto`) |
| `--shadow-jvto-hover` | `0 30px 60px -12px rgba(13,27,42,.15)` | Card on hover (`.card-jvto:hover`) |
| `--shadow-jvto-orange` | `0 20px 40px -10px rgba(232,101,10,.25)` | Orange circular action buttons |
| `--shadow-jvto-cta` | `0 20px 40px -10px rgba(13,27,42,.20)` | Primary CTA emphasis |
| `--shadow-jvto-stacked` | 3-layer `rgba(13,27,42,…)` | Stacked/layered card treatment |
| `--shadow-jvto-soft` | `0 12px 32px -16px rgba(13,27,42,.12), 0 2px 6px -2px rgba(13,27,42,.04)` | Softer ambient card shadow (v2 elevation variant) |
| `--shadow-jvto-card-hover` | `0 30px 60px -25px rgba(13,27,42,.22), 0 4px 12px -4px rgba(13,27,42,.06)` | Newer hover variant, deliberately named apart from `--shadow-jvto-hover` to avoid collision |

`.card-jvto` transitions `box-shadow` and `transform` over `500ms ease`; everything else (color/background/border/opacity/shadow) transitions over Tailwind's default `150ms cubic-bezier(0.4,0,0.2,1)` — redeclared in `website.css` as unlayered utilities specifically to out-cascade a TipTap CMS stylesheet that injects `:root * { transition: none }` (see the fix comment at `website.css:98-102`).

### Named rule — the TipTap purple stays out of the public site
`(cms)` route-scoped TipTap editor styling (`--tt-brand-color-*`, purple) must never appear on public-facing surfaces. This carries forward unchanged from v1.

## 5. Radius

Two conventions coexist and neither is wrong — they're just not the same scale:

- **Real, adopted, everywhere:** Tailwind's stock `rounded-sm` (2px — buttons, badges, inputs, status chips) and `rounded-full` (pills, avatars, status dots). Cards use **literal arbitrary values**, not a named scale: `rounded-[16px]`, `rounded-[20px]`, and `rounded-[32px]` all appear repeatedly across tour and destination pages.
- **Declared, not adopted:** `--radius-jvto-sm/md/lg/xl` (12/18/28/40px) exist in `website.css` with a `tokens/radii-shadows.css` source comment but zero `rounded-jvto-*` call sites in `src/`. None of the three real card radii (16/20/32) line up with the declared scale closely enough to be the same convention by accident.

Both sets are listed in this file's frontmatter so the design-system checker treats either as legitimate — but do not introduce a *fifth* radius value without a reason; pick the nearest of the seven already in use.

## 6. Components

### Buttons ([UI/Button.tsx](src/components/website/UI/Button.tsx))
Base: `inline-flex items-center justify-center font-bold transition-colors duration-200 rounded-sm uppercase tracking-wide`.
- **primary:** `bg-jvto-lime text-jvto-navy`, hover `#8Cb82b` (flagged above — should be `jvto-lime-ink` or a proper hover token)
- **secondary:** `bg-jvto-navy text-white`, hover `bg-gray-800`
- **outline:** `border-2 border-jvto-navy text-jvto-navy`, hover fills navy with white text
- **white:** `bg-white text-jvto-navy`, hover `bg-gray-100`
- Sizes: `sm` (px-4 py-2 text-xs), `md` (px-6 py-3 text-sm, default), `lg` (px-8 py-4 text-base), `icon` (h-10 w-10)

A second variant group (`default`, `ghost`, `link`, `destructive`) exists on the same component using shadcn-style semantic classes (`bg-primary`, `text-accent-foreground`, `bg-destructive`, `shadow-soft`). These reference Tailwind CSS variables outside the `jvto-*` namespace and were not traced further in this pass — they read as generic UI-kit scaffolding rather than JVTO brand variants; confirm with whoever owns `/my-booking` and `/checkout` before treating them as canonical.

### Cards (`.card-jvto`, [website.css:136](src/app/(website)/website.css:136))
Flat at rest, `box-shadow` + `transform` transition to `--shadow-jvto-hover` on hover over 500ms. Fill is `jvto-off` or white; border is `jvto-border`; radius is one of the three real card values (16/20/32px) chosen per context, not a fixed default.

### Destination cards (`.dest-card`, [website.css:145](src/app/(website)/website.css:145))
A row of cards where hovering one grows it to `flex: 2` and shrinks its siblings to `flex: 0.5`, animated over `flex-grow`/`border-radius` at 500ms ease. This is the one place in the system that intentionally animates a layout property — an exception to the general "never animate layout properties" posture, scoped to this single interaction.

### Volcanic status badge ([VolcanicStatusBadge.tsx](src/components/website/VolcanicStatusBadge.tsx))
Renders `operational` / `restricted` / `closed` with raw Tailwind `emerald-950` / `amber-950` / `red-950` families, `rounded-sm` container, `rounded-full` status dot. Does not currently consume the `jvto-status-*` token ladder — see the named finding in §2.

## 7. Do's and Don'ts

### Do
- **Do** use `jvto-lime` only for primary action affordances (Button `primary`, confirmation icons) — it is the one color the theme reserves for "go."
- **Do** use `jvto-orange` for secondary accents and meta glyphs, with its own `--shadow-jvto-orange` on circular action buttons.
- **Do** keep the three-typeface split by job: Inter body, Raleway display, JetBrains Mono chrome/credential data.
- **Do** use one of the seven radii already in the frontmatter (2 / 16 / 20 / 32 / 12 / 18 / 28 / 40 / full) rather than a new arbitrary value.
- **Do** keep `(cms)` TipTap purple scoped to the `(cms)` route segment only.

### Don't
- **Don't** hardcode a lime-family hex as a hover state — use `jvto-lime-ink` (or fix the one that already leaked, at `UI/Button.tsx:39`, when that work is in scope).
- **Don't** treat `jvto-gold`, `jvto-wa-green`, `jvto-rule`, `jvto-on-navy*`, or the status ladder as "the palette" in new work without confirming intent first — they are declared, not adopted, per §2.
- **Don't** invent a custom font-size ramp. The real system is Tailwind's stock `text-xs`…`text-7xl` scale — a project-specific clamp() ramp was v1 and did not carry forward.
- **Don't** apply TipTap's `--tt-brand-color-*` purple outside `(cms)`.
- **Don't** animate layout properties except the one deliberate exception: `.dest-card`'s flex-grow hover expansion.
