# Lifetime Package Guarantee — backend handoff contract

**Status:** contract only (not implemented in this repo)
**Owner of the transaction:** the Laravel "legacy" backend + shared PostgreSQL DB
**Date:** 2026-07-15

## Why this doc exists

The JVTO Lifetime Package Guarantee was implemented across three repos in this session:

| Repo | Delivered |
|---|---|
| `llm-wiki` | Canonical policy SSOT (`wiki/policies/cancellation-package-credit.yml`) + Policy Bundle Compiler **v2.0** → `decision-matrix.json`, `customer-copy.json`, `consumer-bundles.json` |
| `jvto-itinerary-core` | Pure, unit-tested `evaluateCancellation()` engine + transfer/redemption guards, consuming the decision matrix |
| `jvto-web` (this repo) | Sync-to-v2, policy copy routed through the compiled bundle, website-only booking wording |

The **transactional half** of the plan cannot be built in these three repos: booking, payment
(Xendit), refunds, and credit issuance all live in the **Laravel legacy backend**, and this repo's
Prisma schema is introspected (`db pull`, no in-repo migrations) against a **shared production DB
owned by that backend**. The items below are therefore specified here as a contract for whoever
implements them in the backend — not built.

## The core contract

The backend and the website MUST NOT recompute cancellation outcomes. There is one source of truth:

- **Rules / outcomes:** `output/website/policy-bundle/decision-matrix.json` (schema
  `cancellation-policy/v2.0`), or the `evaluateCancellation()` engine in `jvto-itinerary-core`
  (exposed at `POST /evaluate-cancellation` on the scenario service).
- **Customer copy:** `customer-copy.json` (already consumed by this repo's `/policy`, schema
  builder, and tour FAQs via `src/lib/policy-bundle.ts`).

Every booking must record the `policy_version` + `policy_hash` it accepted (from `_manifest.json`)
so historical bookings keep their historical policy.

## Out-of-scope work (implement in the Laravel backend / shared DB)

### Phase 4 — data model (7 tables)
`policy_versions`, `booking_policy_acceptances`, `cancellation_requests`, `package_credits`,
`package_credit_transfers`, `booking_refunds`, `force_majeure_events`. Field lists in the uploaded
plan §6. Note the DB already has a single-row `policies` config (48h window, 50% no-show fee) and
`policy_documents`; the new tables are per-booking records, not config.

### Phase 6 — customer booking portal (writes)
Booking detail eligibility view, request options (cancel full / cancel travellers / report flight /
report destination disruption / transfer / use credit), and an **outcome preview before submit**.
The preview MUST come from the decision matrix / engine, not a re-implementation. This repo's
`/my-booking` today is read-only over the legacy API — the write flows belong to the backend.

### Phase 7 — refund / credit / transfer / redemption execution
Xendit refund API wiring; Package Credit issuance on full ≥48h cancellation; one-transfer mechanics
(close old code, issue new, block second transfer); redemption (same package, original pax
entitlement, incremental charge for more pax, no refund for fewer); flight Recovery Fee (50%, once).
No `completed` refund without a provider/bank reference. Idempotency guards mirror the engine's
`priorState` checks.

### Phase 8 — force-majeure administration
Ops dashboard to create a **verified** destination/transport event, attach official source, and
apply it to affected bookings. The engine already blocks unverified force-majeure and returns the
options set for verified events.

### Phase 10 — migration & versioning
Bookings before the effective date keep `legacy-policy/v1`; do not apply the new policy
retroactively. Existing monetary Travel Credits convert to Package Credit only with owner approval
and sufficient data to determine package + pax entitlement.

### Phase 12 — rollout
Internal simulation → staff shadow mode (engine computes, does not execute) → controlled production
→ full production. Refunds stay finance-gated until reconciliation is clean.

## Integration checklist for the backend team

- [ ] Consume `decision-matrix.json` (or the engine endpoint) — never hard-code refund %/fees.
- [ ] Persist `policy_version` + `policy_hash` on every booking acceptance.
- [ ] Enforce website-only booking source at the guard (the engine blocks non-website + missing source).
- [ ] Surface the engine's `outcome`/`refundAmount`/`recoveryFee`/`ruleId` verbatim in the portal preview.
- [ ] Keep customer-facing copy sourced from `customer-copy.json` (as this repo now does).
