# publicContent/generated

Generated public-content artifacts. Do not hand-edit — regenerate via the scripts below.

## packageActivitySnapshots.json

A small, **PII-free** projection of public **itinerary activity + movement structure**, one
record per package day. Built for downstream **jvto-itinerary-core** (Phase 6) so it can
assemble `operational-events.json` without parsing the full `packageDetailSnapshots.json`.

- **Schema:** `jvto-web-package-activity-snapshots/v1`
- **Source:** derived purely from `packageDetailSnapshots.json` (no DB). `generated_at` is
  inherited from the source so output is byte-identical when the source is unchanged.
- **Regenerate:** `npm run export:activity-snapshots`
- **Each item** = one package day: `package_id`, `slug`, `day`, `day_title`, `activities[]`.
- **Each activity:** `activity_order`, `activity_type`, `activity_name`, `time_window`,
  `duration_minutes`, `from_label`, `to_label`, `destination_label`, `source_basis`.
- Missing source values (absent key or empty string) are normalized to `null`.

### Ownership boundaries — what is intentionally NOT here

| Concern | Owner |
|---|---|
| `meal_codes`, `hotel_label`, `overnight_status` | **llm-wiki** `package-operational-days.json` |
| cost / price / hotel rate / room type / meal cost | **new-backoffice** (later) |
| customer / booking / payment / contact (WhatsApp, email, phone) | never exported |

This artifact deliberately omits routing IDs (`route_node_id`), operational buffers, and exact
times beyond the source `time_window`/label — downstream must not infer them from here.

## reviewApiSnapshots.json

Public review API snapshot: `feed` (on-site displayable reviews), `preview`, `stats`, `xmlItems`.

- **Regenerate:** `node scripts/export-public-review-api-snapshots.mjs` (needs `DATABASE_URL`).
- **`stats` is NOT `COUNT(*) FROM reviews`.** It is the authoritative platform total from the
  facts lock (`src/lib/jvtoReviews.ts` → `getCanonicalReviewStats`): Google 123 · Trustpilot 51 ·
  TripAdvisor 21 · total 195 · rating 4.8. The DB only holds the ingested subset (currently
  92/44/21), so counting rows would publish the forbidden stale value `92`
  (`docs/CANONICAL_FACTS.md`).
- **`feed`/`preview`/`xmlItems` come from the DB** and are legitimately **smaller** than
  `stats.total` by design — the feed is the reviews we have on-record to display, not the full
  platform totals. `feed` never "sums to" `stats.total`; that is expected, not a bug.

## Other artifacts

- `packageDetailSnapshots.json`, `destinationDetailSnapshots.json` — full public detail snapshots
  (`scripts/export-public-detail-snapshots.mjs`).
