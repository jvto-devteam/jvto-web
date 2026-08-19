# Beacon — Style Reference

> deep harbor ink with amber signal. A single warm flare on a near-black blue field, with massive blocky display type announcing every move.

**Theme:** light

> **Provenance note.** This is a structural style reference. The source brand identity it was derived from — brand name, source URL, exact brand palette, licensed display typeface, product-specific component content, and named competitor list — has been removed and replaced with an original palette, an open-licensed display face, and generic component patterns. Everything structural is unchanged: layout rules, spacing scale, type scale, radii, shadow geometry, component geometry, density, surface levels, and design principles.

Beacon speaks in a confident, slightly loud voice: a deep harbor blue (#12263f) carries most of the surface area — text, nav, dark sections, icons — while a single warm amber (#ffb43d) acts as functional punctuation on CTAs, active tabs, and key highlights. The display type is almost aggressive: Archivo at weight 900, tightly tracked, shouted across the hero in 100px+ block letters. The rest of the system stays restrained on a near-white canvas with soft gray surfaces (#eaedf1). Components are pill-shaped by default — buttons, nav segments, circular thumbnails, image masks — with gentle 10px radii reserved for cards and inputs. Color rarely gradients; instead, the amber–harbor pairing inverts cleanly when sections go dark, creating rhythm without decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Harbor Ink | `#12263f` | `--color-harbor-ink` | Dominant brand dark — nav text, dark section backgrounds, primary copy on light surfaces, icon strokes, filled navigation pills. This is the brand's gravity: wherever you need weight or authority, you reach for Harbor Ink |
| Amber Signal | `#ffb43d` | `--color-amber-signal` | Warm supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deepwater | `#1b3a5c` | `--color-deepwater` | Secondary dark blue for card surfaces, supporting iconography, and tonal depth on dark sections where Harbor Ink is too heavy |
| Sand Mist | `#ffeed2` | `--color-sand-mist` | Pale warm wash for soft highlight surfaces, tinted card backgrounds, nav hover states. A whisper of the brand accent for low-emphasis containers |
| Pine | `#2f6f4f` | `--color-pine` | Green supporting accent for decorative details and low-frequency emphasis |
| Ember | `#c0442f` | `--color-ember` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Charcoal | `#3f434a` | `--color-charcoal` | Primary text, body copy, dense UI — slightly cool black that feels softer than pure #000 against white |
| Obsidian | `#0b0e14` | `--color-obsidian` | Display headlines, high-contrast headings, pure-black moments in nav and hero. Slightly blue-tinted black, not neutral gray |
| Pebble | `#8a8e96` | `--color-pebble` | Muted secondary text, placeholder copy, icon strokes, input borders. The mid-gray that recedes |
| Slate | `#686d75` | `--color-slate` | Supporting body text, helper labels, subdued iconography. One step darker than Pebble for slightly more emphasis |
| Fog | `#eaedf1` | `--color-fog` | Card surfaces, section dividers, subtle panel backgrounds on the white canvas. Blue-tinted off-white, not pure neutral |
| Paper | `#ffffff` | `--color-paper` | Page canvas, inverted card surfaces, button text on amber fill |

## Tokens — Typography

### Inter — Body, UI, labels, and sub-headings across the entire product. The 700 weight handles mid-tier headings (36–45px), 500–600 for subheadings and labels, 400 for body and captions. Inter does the quiet work while Archivo shouts. · `--font-inter`
- **Substitute:** Inter (native Google Fonts, SIL OFL)
- **Weights:** 400,500,600,700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 22px, 25px, 36px, 45px, 61px, 300px
- **Line height:** 0.72, 1.00, 1.10, 1.25, 1.30, 1.40, 1.43, 1.44, 1.50, 1.55, 1.63, 1.71, 1.86, 2.17
- **Letter spacing:** -0.030em at 105px, -0.015em at 61px, -0.011em at 36px, -0.009em at 25px, -0.007em at 18px, -0.006em at 16px, -0.005em at 14px, -0.003em at 12px
- **OpenType features:** `"calt"`
- **Role:** Body, UI, labels, and sub-headings across the entire product. The 700 weight handles mid-tier headings (36–45px), 500–600 for subheadings and labels, 400 for body and captions. Inter does the quiet work while Archivo shouts.

### Archivo — Display headlines — the brand's signature shout. Ultra-heavy weight 900 at 89–105px with tight -0.03em tracking makes every headline a block-letter announcement. Used sparingly: hero, section openers, campaign moments. · `--font-archivo`
- **Substitute:** Inter Black (900) with -0.04em tracking
- **Weights:** 900
- **Sizes:** 40px, 52px, 59px, 89px, 105px, 300px
- **Line height:** 0.85, 1.50
- **Letter spacing:** -0.0020em
- **OpenType features:** `"calt"`
- **Role:** Display headlines — the brand's signature shout. Ultra-heavy weight 900 at 89–105px with tight -0.03em tracking makes every headline a block-letter announcement. Used sparingly: hero, section openers, campaign moments.

### monospace — monospace — detected in extracted data but not described by AI · `--font-monospace`
- **Weights:** 400
- **Sizes:** 300px
- **Line height:** 
- **OpenType features:** `"calt"`
- **Role:** monospace — detected in extracted data but not described by AI

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 300px
- **Line height:** 
- **OpenType features:** `"calt"`
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 1.63 | -0.036px | `--text-micro` |
| caption | 14px | 1.55 | -0.07px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.096px | `--text-body-sm` |
| body | 18px | 1.5 | -0.126px | `--text-body` |
| body-lg | 25px | 1.3 | -0.225px | `--text-body-lg` |
| subheading | 36px | 1.25 | -0.396px | `--text-subheading` |
| heading-sm | 45px | 1.1 | -0.495px | `--text-heading-sm` |
| heading | 61px | 1.1 | -0.915px | `--text-heading` |
| heading-lg | 89px | 0.85 | -2.67px | `--text-heading-lg` |
| display | 105px | 0.85 | -3.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 124 | 124px | `--spacing-124` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 10px |
| inputs | 10px |
| buttons | 9999px |
| imageMasks | 1000px |
| largeCards | 28px |
| navSegments | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(11, 14, 20, 0.12) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `rgb(138, 142, 150) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| xl | `rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04...` | `--shadow-xl` |
| lg | `rgba(0, 0, 0, 0.08) 0px 6px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 8-12px

## Components

### Primary CTA Pill Button
**Role:** The signature action element — filled amber pill that signals "do this next."

Fully rounded (9999px radius) button with Amber Signal (#ffb43d) fill and Charcoal (#3f434a) or Harbor Ink (#12263f) text. Padding 11px vertical, 24px horizontal. Inter weight 500 at 16px. No border, no shadow — the fill does all the work.

### Outlined Pill Button
**Role:** Secondary action in the nav and inline CTAs.

White fill, 1px Harbor Ink border, 9999px radius. Same padding as primary. Used for account-entry actions in the header and non-primary calls to action where the amber would compete with a primary action nearby.

### Text Link Button
**Role:** Inline secondary action with low visual weight.

Underlined Harbor Ink text at 16px Inter weight 500, no background, no border. Pairs with the primary CTA when two adjacent actions are needed (e.g. a "create account" primary next to a "browse first" text link).

### Top Navigation Bar
**Role:** Persistent header with brand, section switcher, and account access.

White background, 64px height. Logo left, three-segment pill nav (three top-level audience or product segments) with 9999px radius and Harbor Ink text, right cluster has a locale control, Help, Log in, and outlined Sign up pill.

### Segmented Tab Control
**Role:** In-page section switcher — single active state in amber.

Pill container (9999px radius) holding multiple text labels. Active tab: Amber Signal fill with Charcoal text. Inactive tabs: transparent with Charcoal text. ~40px height, 12px horizontal padding per segment.

### Display Headline
**Role:** The brand's voice — used in hero and major section openers.

Archivo weight 900 at 89–105px, line-height 0.85, letter-spacing -3.15px. Charcoal (#3f434a) or Obsidian (#0b0e14) on light, Amber Signal on dark sections. Set as block text, often in ALL CAPS for hero moments.

### Feature Row
**Role:** Three-column trust signal block — icon + heading + supporting line.

Single-column-on-mobile, three-column-on-desktop. Icon (24px, Charcoal stroke) at top, heading in Inter 700 at 18px, body in Inter 400 at 16px Pebble. Generous 24px vertical gap between icon and heading.

### Circular Thumbnail Grid Item
**Role:** Circular thumbnail + label link in a 5-column directory grid.

Circular thumbnail (1000px radius, ~56px diameter), 12px gap to the label in Inter 500 at 16px Harbor Ink. Label is a text link with no underline at rest, underline on hover. Items sit in a generous grid with ~32px row gap.

### Dark Section Card
**Role:** Inverted surface for emphasis — used for the closing conversion block.

Harbor Ink (#12263f) background, 28px radius, 40px padding. Amber Signal text for headline, Paper for body. Contains an inset white card (10px radius, 16px padding) for a compact inline control.

### Inline Selector Pill
**Role:** Interactive option picker with a "Change" action.

White pill inside a dark section card. Left: circular thumbnail (24px) + option label in Charcoal Inter 500. Right: outlined "Change" button in Harbor Ink. 9999px radius, 8px vertical padding.

### Input Field
**Role:** Form input — used for amounts, emails, references.

10px radius, 1px Pebble (#8a8e96) border, 12px vertical and 16px horizontal padding. Inter 400 at 16px. Focus state: Harbor Ink border, no glow ring.

### Floating App Badge
**Role:** Persistent app-download prompt.

Harbor Ink (#12263f) rounded square (16px radius), fixed bottom-right, 120px wide. QR code in Paper at top, download label in Amber Signal Inter 500 at 12px below.

### Badge / Tag
**Role:** Small status labels and category tags.

9999px radius, 8px vertical and 12px horizontal padding. Sand Mist (#ffeed2) background with Harbor Ink text, or Harbor Ink background with Amber Signal text. Inter 500 at 12px.

## Do's and Don'ts

### Do
- Set display headlines in Archivo weight 900 with letter-spacing -3.15px at 105px; the extreme heaviness is the brand's signature — don't soften it to 700.
- Use Amber Signal (#ffb43d) exclusively for primary action fills and active states; one amber element per visible viewport section is usually enough.
- Default to 9999px radius for all buttons, tags, and nav segments — pill shapes are foundational, not decorative.
- Use Harbor Ink (#12263f) for text and dark surfaces, not pure black; the blue-tinted near-black is deeper and more on-brand.
- Apply tight negative letter-spacing at large sizes (-0.030em at 100px+ down to -0.003em at 12px); headings should feel compact, not airy.
- Pair a filled primary CTA with an underlined text link as the secondary action — never two filled buttons side by side.
- Invert section backgrounds from white to Harbor Ink to create rhythm; the amber text on dark blue is the system's built-in emphasis.

### Don't
- Don't use Charcoal (#3f434a) for display headlines — reserve Obsidian (#0b0e14) or Harbor Ink for maximum contrast at large sizes.
- Don't introduce gradients, drop shadows beyond hairline borders, or decorative blurs — the system is flat by design.
- Don't use Amber Signal as text color on light backgrounds; its contrast is too low. It only works as fill or on dark blue.
- Don't use sharp corners (0–4px radius) on buttons, tags, or nav elements; pills are the default shape language.
- Don't set display headlines in Inter — Archivo 900 is the only acceptable voice for 60px+ type.
- Don't stack multiple amber elements close together; space them so the accent reads as a single punctuation mark.
- Don't use #000000 for body text; Charcoal (#3f434a) at 18px on white is the baseline that keeps the page from feeling harsh.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas — the default background for all content sections |
| 1 | Fog | `#eaedf1` | Card surfaces, soft panels, and section backgrounds on the white canvas |
| 2 | Sand Mist | `#ffeed2` | Tinted highlight surfaces — pale warm wash for accent containers and hover states |
| 3 | Amber Signal | `#ffb43d` | Active surface — selected tabs, primary CTA fill, emphasis zones |
| 4 | Harbor Ink | `#12263f` | Inverted surface — dark section backgrounds, nav, high-contrast blocks |

## Elevation

- **Cards:** `rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px`
- **Elevated panels:** `rgba(0, 0, 0, 0.08) 0px 6px 20px 0px`
- **Input/button focus:** `rgb(138, 142, 150) 0px 0px 0px 1px inset`
- **Icon containers:** `rgba(11, 14, 20, 0.12) 0px 0px 0px 1px`

## Imagery

A single recurring hero object, rendered as a painted 3D illustration, establishes the brand's visual world — tactile, slightly surreal, with soft gradients and warm light raking across it. Pick one object that stands for the product's core promise and reuse it rather than assembling a montage. Photography is minimal; when used, it's high-key and lifestyle-casual. Directory entries appear as circular thumbnails in a 5-column grid — the only "icon" system is the subject's own identity. No abstract graphics, no stock patterns. The recurring object carries the brand's optimism on its own, so the rest of the page stays typographic.

## Layout

Max-width 1200px centered container, with hero and dark sections going full-bleed. Hero pattern: centered massive display headline over white space, with a large illustration breaking the lower edge of the viewport. Section rhythm alternates white → light tinted band → dark Harbor Ink section, creating a natural color cadence. Content arrangement is predominantly centered stacks in the hero, then 2-column text+visual or 3-column feature rows in supporting sections. A 5-column thumbnail grid handles the directory. Navigation is a single sticky top bar with a segmented pill switcher. The app badge floats fixed in the bottom-right corner across all scroll positions.

## Agent Prompt Guide

Quick Color Reference
- text: #3f434a (Charcoal) for body, #0b0e14 (Obsidian) for display
- background: #ffffff (Paper) canvas, #eaedf1 (Fog) cards
- border: #8a8e96 (Pebble) for hairlines, #12263f (Harbor Ink) for emphasis
- accent: #ffb43d (Amber Signal) for active states and highlights
- primary action: no distinct CTA color
- dark surface: #12263f (Harbor Ink) for inverted sections

Example Component Prompts

No distinct primary action color was observed; use the neutral button treatments above instead of inventing a filled CTA color.

2. Feature row (3-column): icon at 24px stroke #3f434a, 24px gap to heading at 18px Inter 700 in #0b0e14, 8px gap to body at 16px Inter 400 in #8a8e96. Column gap 32px, centered max-width 1200px.

3. Circular thumbnail grid item: circular thumbnail at 56px diameter (1000px radius), 12px vertical gap to the label in Inter 500 at 16px #12263f. Arranged in a 5-column grid with 32px row gap and 24px column gap. Hover state: underline appears on the label.

4. Dark section card: Harbor Ink (#12263f) background, 28px radius, 40px padding. Headline in Amber Signal (#ffb43d) at 36px Inter 700. Body text in #ffffff at 16px Inter 400. Contains an inset white card (10px radius) for an inline selector: circular thumbnail + option label in Charcoal + outlined "Change" button.

5. Outlined nav button: white fill, 1px solid #12263f border, 9999px radius, 8px 16px padding, Inter 500 at 16px in #12263f. Used in the top-right nav cluster for secondary account actions.

## Design Lineage

Archetypes this system belongs to, described by their mechanics rather than by name:

- **Dual-tone fintech** — one deep brand color as dominant surface *and* text, a single bright accent reserved for CTAs and highlights, pill-shaped buttons, large confident headlines.
- **Single-accent neutral canvas** — one saturated accent driving all interactive emphasis on an otherwise neutral page, pill-shaped interactive elements, friendly rounded geometry, display type that speaks directly to the user.
- **Oversized-headline minimalism** — high-contrast near-black text on white, oversized bold headlines as the primary brand expression, minimal decoration.
- **Hairline flat** — flat surfaces, hairline borders instead of shadows, generous white space, no gradients anywhere.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-harbor-ink: #12263f;
  --color-amber-signal: #ffb43d;
  --color-deepwater: #1b3a5c;
  --color-sand-mist: #ffeed2;
  --color-pine: #2f6f4f;
  --color-ember: #c0442f;
  --color-charcoal: #3f434a;
  --color-obsidian: #0b0e14;
  --color-pebble: #8a8e96;
  --color-slate: #686d75;
  --color-fog: #eaedf1;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.63;
  --tracking-micro: -0.036px;
  --text-caption: 14px;
  --leading-caption: 1.55;
  --tracking-caption: -0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.096px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.126px;
  --text-body-lg: 25px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.225px;
  --text-subheading: 36px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.396px;
  --text-heading-sm: 45px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.495px;
  --text-heading: 61px;
  --leading-heading: 1.1;
  --tracking-heading: -0.915px;
  --text-heading-lg: 89px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.67px;
  --text-display: 105px;
  --leading-display: 0.85;
  --tracking-display: -3.15px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-124: 124px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 18.7693px;
  --radius-3xl: 28.1539px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 37.5385px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 10px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;
  --radius-imagemasks: 1000px;
  --radius-largecards: 28px;
  --radius-navsegments: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(11, 14, 20, 0.12) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(138, 142, 150) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 6px 20px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #eaedf1;
  --surface-sand-mist: #ffeed2;
  --surface-amber-signal: #ffb43d;
  --surface-harbor-ink: #12263f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-harbor-ink: #12263f;
  --color-amber-signal: #ffb43d;
  --color-deepwater: #1b3a5c;
  --color-sand-mist: #ffeed2;
  --color-pine: #2f6f4f;
  --color-ember: #c0442f;
  --color-charcoal: #3f434a;
  --color-obsidian: #0b0e14;
  --color-pebble: #8a8e96;
  --color-slate: #686d75;
  --color-fog: #eaedf1;
  --color-paper: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.63;
  --tracking-micro: -0.036px;
  --text-caption: 14px;
  --leading-caption: 1.55;
  --tracking-caption: -0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.096px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: -0.126px;
  --text-body-lg: 25px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.225px;
  --text-subheading: 36px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.396px;
  --text-heading-sm: 45px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.495px;
  --text-heading: 61px;
  --leading-heading: 1.1;
  --tracking-heading: -0.915px;
  --text-heading-lg: 89px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -2.67px;
  --text-display: 105px;
  --leading-display: 0.85;
  --tracking-display: -3.15px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-124: 124px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 18.7693px;
  --radius-3xl: 28.1539px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 37.5385px;
  --radius-full: 1000px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(11, 14, 20, 0.12) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(138, 142, 150) 0px 0px 0px 1px inset;
  --shadow-xl: rgba(0, 0, 0, 0.15) 0px 10px 32px 0px, rgba(0, 0, 0, 0.04) 0px 40px 40px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 6px 20px 0px;
}
```
