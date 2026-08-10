# Risk Register (repo-grounded, with risk owners)

> **Milestone 0 baseline artifact** grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](JVTO_TECHNICAL_PROJECT_HANDOFF.md) §27 (risk register), §25
> (owner decision gates), §26 (known unknowns). Every §27 row is preserved and adapted to this repo,
> plus repo-specific risks found during the Milestone 0 audit. A **Risk owner** column is added per
> §27's instruction ("risk owners must be assigned during Milestone 0"). Branch
> `claude/reconcile-live-into-main`. Every path grep-confirmed; no facts invented; no named
> individuals — **Owner** vs **Engineering** only.

**Owner** = a §25 owner-gated decision owns the mitigation/stop call: merges, production promotion,
destructive DB migration, legacy deletion, AI/customer-traffic enablement, high-stakes fact/policy
conflicts. **Engineering** = implementation mitigation / CI gate / code.

**§27 rule:** "monitor without an observable signal is not accepted" — every row below carries a
concrete leading signal.

## §27 risks (preserved) + repo grounding

| Risk | Impact | Leading signal | Mitigation | Stop / rollback trigger | Risk owner |
|---|---|---|---|---|---|
| `main` overwrites valid live-only behavior | Production regression | Unclassified live-only commits/files (124 live-only, "diverged" §3.4) | Reconcile on `claude/reconcile-live-into-main` before cutover; classify preserve/duplicate/obsolete/unknown; owner review | Any unknown high-impact live delta | **Owner** |
| Old producer restores stale public facts | Factual drift | Sync PR (`sync-artifacts.yml`) changes migrated/public paths | Freeze public writers; ownership CI `scripts/validate-static-route-ownership.mjs` + `validate-content-drift.mjs` in `verify` | Migrated route regains an old source | **Engineering** |
| Product/policy updates rewrite old bookings | Commercial dispute | Booking reads current mutable policy | Immutable `BookingAgreementSnapshot` (P-04, Milestone 4) — not yet built | Snapshot missing / checksum mismatch | **Engineering** |
| Cached price/availability treated as final | Incorrect customer charge | Checkout uses page cache/ISR value | Fresh quote validation at checkout (P-06); no static price authority (AD-02) | Price/version mismatch | **Engineering** |
| Duplicate provider/channel webhook | Duplicate payment/booking | Repeated external event ID | Signature + idempotency + receipt table (Xendit; §26 discovery — impl unverified) | Duplicate financial mutation | **Engineering** |
| DB migration loses/changes records | Financial/operational loss | Count/checksum variance | Expand–migrate–contract (§14.2); backup/restore drill **before** destructive change (§13.2) | Any unexplained reconciliation variance | **Owner** |
| Health/PII leaks to public/search/AI | Privacy harm | Restricted field in logs/feed/schema | Data classes (§13.1), medical boundary (§13.3), serializers, security tests | Any restricted-data exposure | **Engineering** |
| AI invents status/policy/price/safety answer | Customer/safety risk | Answer lacks source/tool result | Decision envelopes + deterministic tools (§12.2); traffic stays disabled until eval gates pass | High-stakes answer without authority | **Owner** |
| Partner amendment overwrites manual work | Operational error | External update after local amendment | Version/conflict check + exception queue (§11) — not yet built | Unresolved concurrent amendment | **Engineering** |
| Outbox backlog delays customer communication | Service failure | Growing oldest-unprocessed age | Alert + retry + dead-letter/exception (§7.7, Milestone 1) — outbox not yet built | Critical message exceeds approved window | **Engineering** |
| Web vNext changes canonical routes | Search/conversion loss | Route/sitemap/redirect diff | Route contract + redirect tests (§18.6); preserve route families (§8.3) | Critical route 404 / canonical mismatch | **Engineering** |
| Production artifact differs from approved SHA | Governance failure | `/api/build-info` `commitSha` ≠ pushed SHA | Immutable artifact + SHA gate (`deploy.yml` verify step + `src/app/(api)/api/build-info/route.ts`) | Immediate rollback to previous SHA | **Owner** |
| Legacy deleted before zero consumers | Runtime failure | Import/DB query remains (grep/CI) | Reference report + `validate-static-route-ownership.mjs` + rollback window (§15 ladder) | Any runtime legacy access | **Owner** |
| One giant PR becomes unreviewable | Hidden regression | Cross-domain unrelated diff | Capability-scoped PRs (§17.1); one milestone active | Scope exceeds milestone contract | **Engineering** |

## Repo-specific risks (found during Milestone 0 audit)

| Risk | Impact | Leading signal | Mitigation | Stop / rollback trigger | Risk owner |
|---|---|---|---|---|---|
| Volcanic-status bot re-diverges `main`↔`live` | Reconciliation regression; stale/rolled-back canon on `live` | `public/ops/volcanic-status.json` differs between `main` and `live` beyond the bot's mirrored commit | Bot copies the exact `main` JSON to `live` via artifact (never a 2nd fetch), `update-volcanic-status.yml`; reconciliation must fold in bot commits (the one data-only `live` exception, `docs/CONTRIBUTING.md` §2.2) | Non-bot content diff appears on `live` under reconciliation | **Engineering** (reconciliation *merge* timing is **Owner**-gated) |
| Public health policy vs checkout/operational template conflict | Safety/commercial dispute; canon contradiction | Checkout/booking copy contradicts mandatory-Ijen-health canon | Ijen checkout-notice conflict **RESOLVED** (mandatory-screening wording aligned); general class = owner adjudication before Milestone 4 activation (§26, Milestone 4); guarded by `validate-content-drift.mjs` (`src/components/website/BookingInformationPage.tsx`) | New checkout copy re-contradicts the facts lock | **Owner** (high-stakes fact conflict, §25.1) |
| Producer recompile regenerates a retracted canonical fact | Factual drift re-injected on every upstream recompile | Trust/OKF recompile re-emits 2016 incorporation or conditional Ijen-health wording | Regression guards in all three repos: llm-wiki `claim_boundaries.yml` (`INCORPORATION-2016`, PKG-07 mandatory), OKF `publication-rules.yaml`, jvto-web `wrong-founding-year` in `scripts/lib/contentDriftRules.mjs` | A guarded value reappears in a synced bundle | **Engineering** |
| `content/` file escapes the canonical-facts lock | Facts-lock bypass on the new SSOT plane | Drift hit inside `content/**` | `scripts/validate-content-drift.mjs` extended to scan `content/` (Package 01); entity JSON copies approved values only | Drift scan flags a `content/` file | **Engineering** |
| Cross-repo drift gate stale / deadlock | `verify` (required) red; `main` blocked | `verify` fails "Synced bundles drifted from source." | Consolidated `sync-artifacts.yml` re-syncs all five bundles from both producer heads in one PR (deadlock-proof); manual `export … && npm run sync:*` fallback | `verify` stays red after resync | **Engineering** |
| Committed secrets remain in public git history | Credential compromise (public repo) | Secret-scanning hit; `README.md` history | Live secrets removed from `README.md` (#130) → secure-storage pointers | Owner **must still rotate all + purge git history** (session cannot) | **Owner** |
| Help deploy sequence run against the production box | Production reset to preview code / wrong PM2 process | Manual on-box command targets `live` dir/process | `deploy.yml` hard-codes `origin/main` + `/var/www/jvto-help` + `jvto-help`; `live` on-box specifics (dir/ref/PM2) **not assumed identical** — owner-verified on the `live` branch's own `deploy.yml` | Any manual prod command not mirrored on the `live` branch | **Owner** |
| `mapbox-gl` critical/high npm audit findings pre-deploy | Vulnerable dependency shipped | `npm audit` (44 findings: 12 high, 2 critical) | Review/upgrade before deploy; `NEXT_PUBLIC_MAPBOX_TOKEN` must be in preview/prod env first | Critical finding unresolved at deploy | **Engineering** |

## Notes

- Risks whose target mechanism is not yet built (agreement snapshot, outbox, decision envelope,
  exception queue, availability freshness) are **Milestone 1+ targets**; their leading signal exists
  today (or is a build-info/CI check), but the mitigation control ships with its milestone. Do not
  treat "will build later" as an active mitigation — per §27, an unobservable "monitor" is not accepted.
- Several mitigations depend on §26 discovery outputs (Xendit signature/retry/refund, WhatsApp
  gateway semantics, availability authority, production DB schema/backup proof). Until discovered,
  those rows carry a **bounded-risk** status, not a verified control.
