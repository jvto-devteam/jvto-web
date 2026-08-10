# ADR-0002 — Immutable Booking Agreement Snapshots

- Status: Accepted (Milestone 1)
- Date: 2026-08-05
- Context: Product marketing copy, prices, and policies are versioned and change over
  time, but a confirmed booking is a commercial agreement whose terms were fixed at the
  moment of acceptance. If a booking reads the current mutable product/price/policy, a
  later public edit silently rewrites a historical agreement, producing a commercial
  dispute (handoff §27 risk "product and policy updates rewrite old bookings"; leading
  signal: "booking reads current mutable policy"). Principle P-04 (§4) and the booking
  contract §7.4 require that historical agreements are immutable snapshots. The current
  schema has no snapshot/ledger table — the Milestone 0 DB inventory confirms "no
  immutable snapshot/ledger table" exists today (`db-integration-inventory.md` §6), so
  this decision must be recorded now (Milestone 1) even though the physical table lands
  in Milestone 4 (§16, §14.3 `booking_agreement_snapshots`).

- Decision: At booking confirmation, capture a `BookingAgreementSnapshot` (§7.4) that
  stores the exact terms accepted: `productId` + `productVersion`, the itinerary release
  reference, the full `PriceQuote` (line items, subtotal, discount, total, deposit,
  `priceVersion`, `generatedAt`, `expiresAt`), the ordered `policyVersions` (each with
  its `version` and optional `sourceCommit`), the `publicKnowledgeCommit` accepted,
  `acceptedAt`, `acceptedByCustomerId`, and a `checksum`. Later public content, price,
  or policy changes must never mutate an existing agreement. Any amendment (pax, room,
  add-on, dates, price) creates a new version and is recorded in amendment history — it
  is never a destructive overwrite (§7.4 rules; §16 Milestone 4 "retain amendment
  history"; §22 "amendments are historical, not destructive overwrites").

- Consequences:
  - Positive: historical booking terms are provable and reconstructable from stored
    inputs; the checksum makes snapshot tampering/absence detectable (§27 stop trigger
    "snapshot missing / mismatched checksum"); public content can evolve freely without
    commercial risk (§18.5 E2E test 8: content update changes public output but not the
    historical agreement).
  - Negative: writes and storage grow (a snapshot per confirmation plus a version per
    amendment); confirmation flow must atomically resolve product version, price version,
    policy versions, and the knowledge commit before it can accept.
  - Forbids: mutating a confirmed agreement in place; deriving historical terms from
    current mutable rows; representing an amendment as an edit rather than a new version.

- Alternatives considered:
  1. Read current product/price/policy at display time for historical bookings —
     rejected: exactly the §27 rewrite risk; violates P-04.
  2. Store only foreign-key references to versioned rows (no self-contained snapshot) —
     rejected: still depends on those rows and their policy prose surviving unchanged;
     the snapshot must be self-contained and checksummed to be immutable.
  3. Overwrite-with-audit-log on amendment — rejected: §7.4 and §22 require versioned,
     non-destructive amendment history, not a mutated record with a side log.

- Handoff references: §4 (P-04), §7.4 (booking + agreement snapshot contract), §7.3
  (`PriceQuote`), §14.3 (`booking_agreement_snapshots`, `booking_status_history`), §16
  Milestone 4, §18.5 (E2E 7–8), §22 (Commercial and booking), §27 (rewrite-old-bookings
  risk). Milestone 0 grounding: `db-integration-inventory.md` §6, `risk-register.md`.
