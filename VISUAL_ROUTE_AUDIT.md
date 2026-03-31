# Visual Route Audit

Date: 2026-04-01
Branch: `sam-workspace`

## Scope

Reviewed route clusters in the live shell after the latest hardening pass:

- `/`
- `/tours`
- `/tours/from-surabaya`
- `/tours/from-surabaya/ijen-bromo-madakaripura-4d3n`
- `/why-jvto`
- `/verify-jvto`
- `/travel-guide`

## Overall Status

The live shell is now structurally aligned with the redesign direction:

- homepage is trust-led instead of generic
- tours hub is decision-oriented instead of list-first
- package detail pages surface route context and support links earlier
- trust/support hubs now feel like distinct systems rather than leftover static pages

All reviewed routes returned `200` locally.

## Route Findings

### Homepage

Strengths:

- trust-led hero is live
- proof and medical seriousness now appear early
- route discovery sits inside a clearer decision flow
- closing CTA teaches the intended site journey

Remaining gaps:

- homepage is still content-heavy and could benefit from one more pass on visual rhythm
- some sections still inherit older shell spacing and card density
- review/proof areas are improved but not yet visually as confident as the local blueprint

### Tours Hub

Strengths:

- title and framing now match the redesign intent
- support/proof links are placed near the catalog
- cards no longer rely on fake social proof
- route comparison is clearer

Remaining gaps:

- filter/sidebar area still looks more legacy than the surrounding narrative shell
- visual hierarchy between hub intro and product browser can be tightened further

### Origin Hub

Strengths:

- Surabaya route hub now reads as a guided decision page
- copy is more route-serious and less generic
- support framing remains visible near catalog browsing

Remaining gaps:

- the legacy filter/catalog shell is still the most visually dated part of the page
- origin-specific trust cues could be stronger above the fold

### Package Detail

Strengths:

- hero image and package shell render correctly
- route decision framing is live
- support and verification CTAs are visible inside the package flow
- page now feels more like a decision page than a brochure page

Remaining gaps:

- the page is still visually long and inherits some old-shell density
- some downstream sections remain legacy in spacing and grouping
- there is still room to make proof/support modules feel more intentionally designed

### Why JVTO

Strengths:

- now behaves like a trust hub instead of a plain about page
- proof path is clearer
- narrative direction is closer to the local blueprint

Remaining gaps:

- the shell is still visually sparse compared to the stronger homepage/tours improvements
- this cluster can still use a later pass for richer visual pacing

### Verify JVTO

Strengths:

- now reads as a verification hub
- categories are clearer and more actionable
- title and route purpose are aligned with the trust system

Remaining gaps:

- page still feels lighter than its importance suggests
- proof categories can later be made more visually authoritative

### Travel Guide

Strengths:

- page framing is now support-led and closer to "Prepare & Book"
- route purpose is clearer
- support cluster identity is now distinct from general content

Remaining gaps:

- support cards and layout still carry some legacy shell styling
- visual connection to booking readiness could be stronger

## Technical Notes

- local dev server now runs cleanly on `Next 16.2.1`
- `turbopack.root` is pinned in `next.config.ts`
- `proxy.ts` matcher no longer intercepts Next internals
- route rendering is healthy

Known dev-only noise:

- Playwright still reports HMR WebSocket console noise in dev
- this did not block route rendering or local HTML verification

## Conclusion

This phase confirms that the live shell is no longer blocked by runtime or route instability.
The redesign direction is visible in production-facing route clusters.

The next pass should focus on:

1. visual rhythm and density cleanup in legacy shells
2. stronger trust/proof presentation in `why-jvto` and `verify-jvto`
3. tighter product-browser styling in tours hubs

