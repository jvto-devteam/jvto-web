# Visual Reference Integration Plan

Reference repo:
- `Why-JVTO` at [F:\New folder\DOWNLOADS\Why-JVTO](F:\New folder\DOWNLOADS\Why-JVTO)

Purpose:
- use the repo as a visual and art-direction reference only
- do not treat it as the final route map
- do not treat it as the final data model
- do not copy its hardcoded content or placeholder tour browser logic into production

## Working Rule

Keep this hierarchy:

1. `DB mirror`
   curated staging data
2. `jvto-web`
   final live frontend target
3. `Why-JVTO`
   visual reference for mood, hierarchy, typography, spacing, and section framing

This means:
- data stays in DB/API
- frontend stays in GitHub
- visual direction can borrow from `Why-JVTO`

## What To Borrow

These parts are high-value and compatible with the live system:

- typography pairing
  - `Public Sans`
  - `JetBrains Mono`
- color language
  - authority navy
  - safety orange
  - verified lime / bright lime
  - audit-white background
- shell grammar
  - strong uppercase headings
  - mono badges for protocol / proof / trust cues
  - fuller hero atmosphere with fewer competing devices
  - clearer section jobs
  - fewer generic cards
- visual motifs
  - grid pattern
  - proof / audit / verification cues
  - sharper contrast between commercial routes and trust routes

## What Not To Copy Directly

These parts should stay out unless reworked:

- hardcoded route lists and fake package catalog data
- placeholder prices and `picsum` imagery
- over-gimmicked "forensic" language when it weakens clarity
- app/router assumptions from the Vite reference repo
- any page structure that conflicts with real JVTO sitemap, live routes, or DB-backed content

## Current Decision

The correct approach is:

- keep `jvto-web` as the implementation base
- transplant the visual system from `Why-JVTO`
- keep route ownership and data ownership in `jvto-web`
- continue using DB mirror as the staging data source

## Integration Order

Apply the reference in this order:

1. global design system
   - fonts
   - colors
   - utility badges
   - shell rhythm
2. homepage hero and first two sections
3. tours hubs and browser shell
4. package page hero and decision/support sections
5. trust/support hubs and subpages
6. final consistency pass

## Batch Already Applied

This batch already landed from the reference:

- `Public Sans` + `JetBrains Mono` moved into root layout
- color tokens aligned toward the reference palette
- shared global utilities added:
  - `grid-pattern`
  - `status-live`
  - `tech-badge`
  - `verified-badge`
- website shell wrapper aligned to the lighter audit-style base instead of the older mixed shell

## Next Best Move

The highest-leverage next visual batch is:

- reframe the homepage hero and opening support sequence using the new reference language
- keep all live data wiring intact
- do not rebuild route logic
