# ADR-0004 — Caching and Freshness for Transactional Decisions

- Status: Accepted (Milestone 1)
- Date: 2026-08-05
- Context: Caching (ISR, page cache, CDN) improves display performance, but if a
  transaction-critical decision trusts a stale cached value the customer can be quoted
  or charged an incorrect price, or told something is available when it is not (handoff
  §27 risk "cached price/availability is treated as final"; leading signal "checkout uses
  page cache/ISR value"; §2.2 "do not build an hourly cached checkout price or
  availability decision"). Principle P-06 (§4) and decision-register row "Whether cached
  price/availability can confirm a transaction → No" (§3.6) require that quote, checkout,
  availability, and payment decisions use a fresh authoritative read with a visible
  timestamp/expiry. This ADR records the per-data-class caching policy so the freshness
  boundary is explicit before conversion surfaces are built (Milestone 3/7).

- Decision: Apply caching by data class, not uniformly. Critical decisions —
  `CreateQuote`/checkout price, availability, payment state, and booking confirmation —
  must read fresh from the authoritative store and must not trust ISR or page cache as
  authority (P-06). Any publicly displayed price carries an `asOf` timestamp and a quote
  expiry (`PriceQuote.expiresAt`, §7.3); availability that cannot be freshly read is
  rendered as `request`/`unknown`, never a stale "available" (§8.1). Checkout revalidates
  the quote against fresh rules and rejects a stale or version-mismatched quote
  deterministically (§7.3, §22 "checkout rejects stale/invalid quotes"). The governing
  policy is the §8.2 caching matrix, reproduced here:

  | Data | Strategy |
  |---|---|
  | Public narrative/entities | build-time/static, commit-addressable |
  | Public knowledge feed | generated per successful production artifact |
  | Product structure | versioned read, cache/tag invalidation allowed |
  | Display price | short-lived/request-time read with `asOf` |
  | Checkout price | no stale authority; fresh validation |
  | Availability | fresh read or explicitly `unknown/request` |
  | Operational public status | event/tag revalidation, visible timestamp |
  | Booking/payment | authenticated no-store transactional reads |
  | Guest journey | authenticated, role-scoped, no shared cache |

- Consequences:
  - Positive: customers are never charged from stale data; price/availability are always
    fresh or explicitly unknown (§22 Experience); operational status and prices carry
    visible timestamps; authenticated booking/journey reads never leak into shared caches.
  - Negative: transactional surfaces cannot ride cheap static/ISR caching, so they pay
    request-time read latency and require careful `Cache-Control` per API route (§7.9).
  - Forbids: time-based ISR as authority for a transactional decision; confirming a
    booking on a cached price; caching availability as a plain "available"; sharing an
    authenticated guest-journey or booking/payment response in a public cache.

- Alternatives considered:
  1. Uniform short-TTL cache across all data including price/availability — rejected:
     any nonzero TTL on a transactional decision is the §27 "cached price treated as
     final" hazard; violates P-06.
  2. No caching anywhere (always fresh) — rejected: needlessly slow for commit-addressable
     public narrative and versioned product structure, which §8.2 explicitly allows to
     cache.
  3. Cache checkout price but re-validate only at payment — rejected: §7.3 requires
     checkout itself to recalculate/validate against fresh rules; a late-only check still
     shows and can accept a stale price.

- Handoff references: §3.6 (cached-price decision = No), §4 (P-06), §7.3 (`PriceQuote`,
  checkout revalidation), §7.9 (`Cache-Control` by data class, freshness timestamps),
  §8.1 (display price/availability `asOf`), §8.2 (caching matrix), §16 Milestone 3/7,
  §22 (Experience acceptance), §27 (cached-price/availability risk). Milestone 0
  grounding: `domain-ownership-matrix.md` (Pricing/Availability rows, AD-02).
