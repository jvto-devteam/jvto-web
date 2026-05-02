---
name: JVTO Design System
description: Operational clarity for East Java volcano tour booking — no decoration, only evidence.
colors:
  phosphor-green: "#9fce33"
  phosphor-green-hover: "#8cb82b"
  obsidian: "#1a1a1a"
  field-surface: "#f5f5f5"
  field-text: "#333333"
  neutral-white: "#ffffff"
  neutral-muted: "#6b7280"
typography:
  display:
    fontFamily: "'Inter', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.025em"
  headline:
    fontFamily: "'Inter', sans-serif"
    fontSize: "clamp(1.375rem, 2.5vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.01em"
  title:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  full: "9999px"
spacing:
  section-y: "80px"
  card: "24px"
  gap-md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.phosphor-green}"
    textColor: "{colors.obsidian}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.phosphor-green-hover}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.obsidian}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
  card:
    backgroundColor: "{colors.neutral-white}"
    rounded: "{rounded.sm}"
    padding: "{spacing.card}"
---

# Design System: JVTO

## 1. Overview

**Creative North Star: "The Field Operator's Clipboard"**

This system treats every screen like a pre-expedition briefing document: purposeful, structured, nothing wasted. The visual language of a trusted operator who has run 200 tours doesn't need decoration — it needs clarity. Every element earns its place the same way a line item on a safety checklist earns its place: because it's true, not because it looks good.

The palette is deliberately minimal. Near-black for authority. A single phosphor green for action and verification. White for content surfaces. Off-white for section breathing room. The green functions like a trail marker in low-visibility conditions — not decorative, immediately readable, trusted because it's functional, not because it's pretty. Typography is weighted, not scaled: hierarchy comes from Inter's 900-weight slam against 400-weight body text, not from introducing multiple typefaces.

This system rejects warmth as a design strategy. Warmth is a choice made by operators who compensate for weak trust signals with emotional appeal. JVTO's trust signals are documented and verifiable — they don't need softening. The UI should feel the way the operator feels: direct, reliable, ready.

**Key Characteristics:**
- Single-font system (Inter) with weight as the primary hierarchy tool
- Sharp edges throughout — no soft card corners, no rounded-xl on containers
- One active color (phosphor green) as the sole signal color per screen
- Flat surfaces at rest; elevation only appears on interaction
- All-caps labels for UI chrome and buttons
- Content-first layouts with zero decorative elements

## 2. Colors: The Phosphor Palette

Two anchors and a neutral field. The green is the only active color; everything else provides contrast and breathing room.

### Primary
- **Phosphor Green** (`#9fce33`): The sole action and verification color. Applied to primary CTAs, navbar accent on scroll, active states, and confirmed/verified markers. Its yellow-leaning lime creates high contrast on dark and white surfaces alike. It reads as a signal, not a brand color — earned through scarcity.
- **Phosphor Green Hover** (`#8cb82b`): The 10% darker interaction state. Present and responsive without drama.

### Neutral
- **Obsidian** (`#1a1a1a`): The authority surface. Hero backgrounds, dark section fills, secondary button fills, sticky navigation, footer. Near-black rather than true black — prevents harsh edge at screen edges while retaining maximum weight.
- **Field Surface** (`#f5f5f5`): Page canvas and alternating section backgrounds. Warm off-white that prevents pure-white glare on long reading pages.
- **Field Text** (`#333333`): Primary body copy. Softened off-black for paragraph-length text — avoids harshness of obsidian at small sizes.
- **Pure White** (`#ffffff`): Card surfaces, modals, navigation post-scroll. The clean contrast anchor against field-surface sections.
- **Neutral Muted** (`#6b7280`): Secondary labels, captions, metadata, placeholder text. Standard Tailwind gray-500.

### Named Rules
**The One Signal Rule.** Phosphor green appears on at most one interactive element per viewport. Its scarcity is the signal. Decorative use on non-interactive elements — dividers, background shapes, icon fills — is prohibited.

**The Lime Drift Rule.** Some legacy components use `bg-lime-400` (`#a3e635`) or `bg-lime-600` (`#65a30d`) instead of the canonical `#9fce33`. These are audit targets. The canonical green is always `bg-jvto-green`. Never mix Tailwind lime-scale utilities with the custom token on the same surface.

## 3. Typography: Single Weight Stack

**Body Font:** Inter (with fallback `sans-serif`)

All roles use Inter. No display serif, no mono (unless rendering verified code-style data or credential IDs on the `/verify-jvto` cluster, where monospace carries documentary weight).

**Character:** Utilitarian precision. Inter is chosen for legibility across its full weight axis, not for expressiveness. The 900-to-400 weight contrast creates strong hierarchy through mass, not through variety. All-caps treatment on labels and buttons is structural — it creates a clean visual boundary between UI chrome and content.

### Hierarchy
- **Display** (weight 900, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.1, tracking 0.025em, uppercase): Hero headings and primary section titles. Maximum weight combined with uppercase creates authority without requiring extreme scale.
- **Headline** (weight 800, `clamp(1.375rem, 2.5vw, 2rem)`, line-height 1.2, tracking 0.01em): Section headings, feature card titles.
- **Title** (weight 700, `1.125rem`, line-height 1.3): Card headings, sub-section labels, sidebar content titles.
- **Body** (weight 400, `1rem`, line-height 1.65): Narrative text, tour descriptions, FAQ answers, policy copy. Cap at 65–75ch to prevent fatigue on reading-heavy pages.
- **Label** (weight 700, `0.6875rem` / 11px, line-height 1, tracking 0.1em, uppercase): UI chrome — nav items at small scale, badges, category tags, meta information, button text. Wide tracking at 11px remains legible.

### Named Rules
**The Weight-as-Hierarchy Rule.** Hierarchy is expressed through Inter's weight axis — not by introducing a second typeface. If a design requires a third weight step to create sufficient distinction, the layout has too many hierarchy levels. Reduce levels; don't add fonts.

**The All-Caps Constraint.** All-caps is reserved for UI chrome: buttons, labels, badges, nav items. Never apply to body copy or any text block longer than six words. All-caps at paragraph length reads as shouting.

## 4. Elevation

This system is flat by default. Surfaces carry no shadow at rest. The visual plane is clean and document-like, consistent with the clipboard metaphor.

Depth appears only as a response to interaction: hover states on cards lift with `translateY(-4px)` combined with an enhanced shadow. This makes interactivity visible without decorating static layouts. Modals and dropdowns — which float above the document plane by necessity — use a multi-layer shadow to communicate z-position.

### Shadow Vocabulary
- **Hover lift** (`transform: translateY(-4px)` + `box-shadow: 0 20px 60px rgba(0,0,0,0.12)`): Interactive cards and tour listing items on hover. Shadow and translate appear simultaneously — the combination reads as a single "rise" gesture.
- **Floating surface** (`box-shadow: 0 25px 50px rgba(0,0,0,0.25)`): Mega menu dropdowns, modals, any surface communicating z-plane separation. Never on static cards.
- **Grounding tint** (`box-shadow: 0 2px 8px rgba(0,0,0,0.06)`): Optional ambient anchor for cards in dense grid layouts where hover-only elevation might feel unanchored. Use conservatively.

### Named Rules
**The Flat-By-Default Rule.** A surface with no interactive function has no shadow. Decorative box-shadows on static cards, dividers, or hero sections are prohibited. If you're adding a shadow to make something "look nice," remove it.

## 5. Components

### Buttons

Sharp, weighted, uppercase. Buttons signal action through weight and contrast, not through rounded softness.

- **Shape:** 4px radius (`rounded-sm`). No `rounded-lg` or above on any button variant.
- **Primary:** Phosphor green background (`#9fce33`), obsidian text (`#1a1a1a`), `font-bold uppercase tracking-wider`, `px-6 py-3 text-sm`. Hover: `#8cb82b`.
- **Secondary:** Obsidian fill (`#1a1a1a`), white text. Hover: `#333333`.
- **Outline:** 2px obsidian border, transparent background, obsidian text. Hover fills to obsidian with white text.
- **White:** White background, obsidian text. For use on dark hero sections to invert the default authority relationship.
- **Sizing:** `sm` (px-4 py-2 text-xs), `md` (px-6 py-3 text-sm — default), `lg` (px-8 py-4 text-base).

### Cards

- **Corner Style:** Sharp (4px). Matches button and badge language throughout.
- **Background:** Pure white (`#ffffff`) on field-surface section backgrounds. The tonal contrast creates card lift without shadow.
- **Shadow Strategy:** None at rest. Hover: translate-y + shadow (see Elevation).
- **Border:** `border border-gray-100` in white-on-white contexts where the tonal contrast is insufficient.
- **Internal Padding:** 24px (`p-6`) standard; dense grid cards may compress to 16px (`p-4`).

### Inputs / Fields

- **Style:** `border border-gray-200`, white background, 4px radius.
- **Focus:** Border shifts to `border-gray-400`. No glow ring — state change through weight, not color.
- **Error:** `border-red-500`, error message in field-text color below the field.
- **Disabled:** `bg-gray-100`, muted text, `cursor-not-allowed`.

### Navigation

- **Default state:** Transparent background, white text, over hero imagery.
- **Scrolled state:** White background, obsidian text. Transition triggered by scroll position.
- **Active link:** Phosphor green text or underline marker.
- **Mega menu:** White panel with a phosphor green right-column accent.
- **Mobile:** Full-width white drawer.

### Trust Badge (Signature Component)

The compact verification chip used throughout the site to render legal credentials, police association, and review scores. These are not decorative — they link to source documents.

- **Style:** `bg-field-surface` or white background, 4px radius, phosphor green checkmark icon, label-scale text.
- **Rule:** Every badge making a legal or factual claim must have a destination URL. A badge with no link is decoration, not evidence.

## 6. Do's and Don'ts

### Do:
- **Do** use phosphor green (`#9fce33`) exclusively for interactive elements and verification markers — CTAs, active nav states, confirmation icons. One green signal per viewport.
- **Do** use Inter font-black (weight 900) + uppercase + `tracking-wider` for section headings and hero copy.
- **Do** default to `rounded-sm` (4px) for all interactive and container elements. Reserve `rounded-full` for icon containers and avatar circles only.
- **Do** keep surfaces flat at rest. Add elevation only on hover (`-translate-y-1` + shadow) to signal interactivity.
- **Do** cap body text line-length at 65–75ch on content-heavy pages (travel guide, policy, verify).
- **Do** use `bg-jvto-green` (`#9fce33`) — not Tailwind's `bg-lime-400` or `bg-lime-600`. Audit and replace any `bg-lime-*` utilities found in existing components.
- **Do** link every trust badge and credential chip to its source document.

### Don't:
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe accent on cards, callouts, or list items. Rewrite with full borders, background tints, or leading icons.
- **Don't** round cards or panels beyond `rounded-sm`. `rounded-xl`, `rounded-2xl`, `rounded-3xl` on containers signals "consumer app" — the opposite of this system's register.
- **Don't** style like a backpacker listing. Viator-style photo tiles with overlay price badges, star-rating carousels, and orange CTAs are exactly what this system rejects.
- **Don't** use gradient text (`background-clip: text`). Use a single solid color. Emphasis through weight or size, never through gradient decoration.
- **Don't** apply the TipTap purple (`--tt-brand-color-*`) to public-facing surfaces. That scale is scoped to the `(cms)` route segment. It must never appear on the public site.
- **Don't** add shadows to non-interactive static elements. A shadow on a testimonial card or hero section is a signal violation — it implies interactivity that isn't there.
- **Don't** use identical icon-card grids (icon + heading + text, same size, repeated 4-8 times). If sections like Features use this pattern, vary card sizes, weights, or add structural hierarchy to break the repetition.
- **Don't** animate layout properties (height, width, padding, margin). Animate color, opacity, transform, and box-shadow only.
