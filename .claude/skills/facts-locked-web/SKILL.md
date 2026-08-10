---
name: facts-locked-web
description: Generate jvto-web public content (page copy, a FAQ Q&A, a narrative_claim, an AEO answer, or a JSON-LD schema node) AND verify it against docs/CANONICAL_FACTS.md in the SAME pass — before it is written to a file. Replaces the manual re-read every generated copy/FAQ/schema currently gets (founding 2015 not 2016, review counts 4.8/51 · 4.9/123 · 4.95/21 · 195, no stale 92/47/112/5.0, IDR-only prices, 100% Lifetime Package Credit per the facts lock, mandatory Ijen health wording, email primary) with an automatic draft-lint + JSON-LD parse + precedence check + pass/block verdict. Use when the user asks to "write/draft/answer" jvto-web copy, "add a FAQ", "add a narrative_claim", "write the schema for X", "buat copy/jawaban untuk halaman", or whenever an output asserts a JVTO fact (founding, reviews, credentials, prices, policy, health rule) that lands in src/, public/llms*.txt, or the DB. Does NOT commit or deploy — hands back verified content + the ledger.
---

# JVTO Facts-Locked Web Content

The recurring failure is not *writing* jvto-web copy — it is a canonical fact
drifting past `docs/CANONICAL_FACTS.md` after the draft looks good: `EST 2016`
instead of founding **2015**, a stale `92` / `47 reviews` count, `5.0/5`, a
`USD`/`Rp` price, `30% deposit`, cancellation wording that departs from the
locked **100% Lifetime Package Credit** term, conditional Ijen-health wording, or
`gmail` promoted to primary email.
`CANONICAL_FACTS.md` says it plainly: *"Diberlakukan manual sekarang"* — enforced
by hand today. This skill folds that hand-check into generation: **draft →
verify → report**, and **blocks** any draft carrying a forbidden fact *before* it
is written to a file (so a bad value never reaches `git`, CI, or `/live`).

It is the jvto-web analog of llm-wiki's `verified-content` skill: same
generate-then-verify contract, but the sources are TS/TSX code + JSON-LD + the DB
(`narrative_claims`, `content_pages`), and the enforcement backbone is this repo's
own `validate:content` gate (`scripts/validate-content-drift.mjs`) rather than
llm-wiki's `verify_claims.py`.

## Activation guard

Require `CLAUDE.md` mentioning jvto-web / JVTO **AND** one of:

- **Write copy / answer for the site** — "write the homepage hero", "draft a FAQ
  for the Ijen tour", "AEO answer for best-time-to-visit", "buat copy untuk
  /policy", "tulis jawaban untuk halaman verify".
- **Add structured content** — "add a `narrative_claim`", "add a Q&A to
  `HOMEPAGE_FAQS` / `LEGAL_FAQS`", "write the JSON-LD / schema node for page X".
- **Verify an existing draft** — "is this copy facts-safe?", "cek fakta di draft
  ini", "does this violate the facts lock?".

Do **not** activate for: pure layout/CSS/component work with no factual claim,
translation that adds no new fact, `(cms)` route-group plumbing, or non-JVTO text.

## When-to-trigger examples

| User says | Activate? | Format |
|---|---|---|
| "Write the hero paragraph for the Bali→Ijen tour page" | ✅ | page copy |
| "Add a FAQ: *How many reviews does JVTO have?*" | ✅ | faq |
| "Draft a `narrative_claim` about the police-led differentiator" | ✅ | narrative_claim |
| "Write the `buildPolicySchemas` cancellation announcement string" | ✅ | jsonld |
| "Buat AEO snippet: *kapan waktu terbaik ke Bromo?*" | ✅ | aeo |
| "Is this reviews blurb safe to ship?" (pastes copy) | ✅ (verify-only) | verify |
| "Rename this component's props" | ❌ no factual claim | — |
| "Translate this UI label to Bahasa" | ❌ no new fact | — |
| "Fix the flex layout on the pricing card" | ❌ presentation only | — |

## Inputs

- The content request (topic, target **route/file**, format: `page | faq | aeo |
  answer | narrative_claim | jsonld`, audience).
- Canonical sources — **read, never invent**:
  - `docs/CANONICAL_FACTS.md` — the facts lock (the authority; facts-lock wins
    over design spec, old copy, CMS draft).
  - `src/lib/site-config.ts` — the runtime single-source-of-truth for brand facts.
  - `src/lib/schemas/entityGraph.ts` — the `@id` registry for schema cross-refs.
  - `src/lib/content/resolveFaqs.ts` — the FAQ precedence order, if the output is a Q&A.
  - `src/lib/policy-bundle.ts` → `getCustomerCopy()` / `getDecisionMatrix()` — for
    any policy/cancellation copy (draw numbers from the compiled bundle, don't retype).

## Step 1 — Generate (fact-tagged)

Draft from the canonical sources only. As you write, tag every **material fact**
(founding/date, review count, credential/ID, price, policy term, health/safety
rule, email/address) with where it came from, e.g. `[CANONICAL_FACTS: reviews]`
or `[site-config.ts: contact_email]`. A fact with no canonical source is not
allowed to ship — source it or cut it. Match the AEO/GEO voice (direct,
evidence-led; "Tourist Police officer" not "safety-focused guide"; "100% Private"
not "private tours").

For a `jsonld` output: cross-reference existing entities by `@id`
(`{"@id":"/#organization"}`, `/#agung-sambuko`, `/#dr-ahmad-irwandanu`,
`/#term-...`) instead of re-inlining — never mint a new `foundingDate` /
`reviewCount` inline when the graph already owns it.

## Step 2 — Verify (the step that replaces the manual re-read)

Run all checks that apply to the format. **Do not return polished content until
this step has run and produced a verdict.**

**2a. Draft denylist (automatic, on the generated text — no file write needed).**
Pipe the draft through the repo's own gate in draft mode:

```bash
printf '%s' "$DRAFT" | node scripts/validate-content-drift.mjs --stdin --label <route>
```

Exit `0` + `DRAFT CLEAN` → no forbidden pattern. Exit `1` + `DRAFT BLOCKED` →
each hit prints `label:line — rule — matched text`. The rules mirror
`CANONICAL_FACTS.md`: `wrong-founding-year`, `stale-review-counts`,
`blue-fire-guarantee`, `non-idr-currency`, `stale-deposit-terms`,
`stale-conditional-health-wording`, `stale-group-threshold`,
`unverified-press-names`, `brand-config-json-pattern`. **This is the key
enabler** — it verifies the draft *before* it touches disk, so a bad fact never
enters a commit. (If a line must quote a forbidden example deliberately, append
`drift-ok: <reason>` to that line — same convention the facts lock uses.)

**2b. Positive canonical-value assertion (on the draft).** The denylist catches
*wrong* values; also confirm the draft's facts *match* the lock where it makes a
claim — read `CANONICAL_FACTS.md` and check: founding **2015**; Trustpilot
**4.8/51**, Google **4.9/123**, TripAdvisor **4.95/21**, cross-platform **195**;
price format `IDR n,nnn,nnn/person`; deposit **20%**, cancellation = **100%
Lifetime Package Credit** (never cash) — assert the term **exactly as
`CANONICAL_FACTS.md` line 29 states it**, do not silently substitute another
term; Ijen health = **mandatory** (BBKSDA SE.1658/KSA.9/2024); email primary
**hello@javavolcano-touroperator.com**; office **No.102A**; NIB
**1102230032918**. A mismatch (or an invented statistic) fails the draft even if
the denylist did not name it.

> **Credit-term naming (resolved 2026-07-19 — owner-adjudicated).** The brand
> cancellation credit is **"Lifetime Package Credit"** across the whole estate,
> including jvto-web's own facts lock (`CANONICAL_FACTS.md` line 29) and all
> display copy. The old name **"Travel Credit" is retired** — a draft that uses
> it is a facts-lock mismatch and must be corrected to "Package Credit". Two
> non-display anchors are **deliberately kept stable** to avoid dead URLs /
> schema-graph churn, and are NOT drift: the route
> `/travel-guide/cancellation-travel-credit` and the `@id`
> `DEFINED_TERMS.JVTO_TRAVEL_CREDIT` (`/#term-jvto-travel-credit`). Only the
> DefinedTerm's `name`/`description` and every user-facing string say "Package
> Credit"; the opaque slug/`@id` tokens may retain the old spelling until a
> separate redirect-backed URL migration is scheduled.

**2c. JSON-LD parse + `@id` integrity (format = `jsonld`).** `JSON.parse` every
`<script type="application/ld+json">` / schema node — a parse error fails.
Confirm cross-refs use an `@id` that exists in `entityGraph.ts`; a dangling
`@id` fails. A new credential/term must be added to `DEFINED_TERMS`, not inlined.

**2d. FAQ precedence + single-FAQPage (format = `faq` / `narrative_claim`).** Per
`resolveFaqs.ts`, precedence is `narrative_claims` > canonical hardcoded > CMS.
Confirm the new Q&A lands at the intended tier and does **not** duplicate a
question already owned by a higher tier for that route (a collision = two
FAQPage entries = a bug). If it's a `narrative_claim`, confirm `primary_page` is
set so it wires to the right route.

**2e. Build-safety (format touches `src/`).** State that the change must keep
`npm run build` (SSG-safe) green with **no new tsc errors beyond the known
3-dead-import baseline**, and that server/client split holds (schema injected
server-side, never inside a client component). Run `npm run validate:content`
(the committed file-gate) once the draft is written, to confirm no bucket grew
beyond baseline.

## Step 3 — Verdict + ledger

Emit a compact ledger and a decision; **never hand over polished content without it**:

```
# Verification — <route / title>  ·  format: <page|faq|aeo|narrative_claim|jsonld>
Decision: approved | approved_with_qualifiers | blocked

| # | Fact / claim        | Canonical source            | Denylist | Canonical match | Status |
|---|---------------------|-----------------------------|----------|-----------------|--------|
| 1 | founding 2015       | CANONICAL_FACTS §Facts      | clean    | match           | ok     |
| 2 | Google 4.9/123      | CANONICAL_FACTS §Reviews    | clean    | match           | ok     |
| … |                     |                             |          |                 |        |

Draft-lint: DRAFT CLEAN | DRAFT BLOCKED (N hits: <rule@line …>)
JSON-LD:    parsed ok | parse error <msg> | n/a
Precedence: lands at <tier>, no collision | collides with <route/question> | n/a
Blocking issues: <none | exact offending string + the corrected value>
Qualifiers:      <e.g. health wording made mandatory; price reformatted to IDR>
```

- `blocked` → show the offending string(s) + the corrected value; do **not**
  present the copy as final.
- `approved_with_qualifiers` → ship with the corrected wording; list what changed.
- `approved` → denylist clean, canonical-matched, JSON-LD parses, precedence
  clean.

## Output contract

1. The generated content. 2. The verification ledger. 3. The block/qualify
decision with exact strings + corrected values. No commit, no deploy — hand off
to the normal PR flow (feature branch → green CI → PR into `main`) only after
`approved`. Promotion to `/live` is owner-commanded and out of this skill's scope.

## Tools

1. **`scripts/validate-content-drift.mjs --stdin` (BUILT — the key enabler).**
   The repo's canonical-facts gate, extended with a draft mode: pipe generated
   text in via `--stdin [--label <route>]` and get the denylist verdict with zero
   file writes (fresh drafts get no baseline grace — any hit exits non-zero). The
   existing file-gate (`npm run validate:content`) and `--update` baseline flow
   are unchanged. Rules + canonical values are data in the `RULES` array,
   mirroring `docs/CANONICAL_FACTS.md`.
2. **Existing, reuse as-is:** `npm run validate:content` (committed file-gate,
   baseline-gated), `npm run validate` (full: itinerary + schema + routes +
   content-drift), `npm run build` (SSG-safe regression check), `npm run lint`.
   `docs/CANONICAL_FACTS.md` + `src/lib/site-config.ts` are the canonical SSOT.
3. **`Read`:** the canonical sources for 2b/2c/2d (facts lock, entityGraph `@id`
   registry, resolveFaqs precedence, policy-bundle `getCustomerCopy`). `Grep`
   only as a quick manual cross-check — the `--stdin` gate is the source of truth
   for the denylist.

### Tools that would make this skill better (identified, not yet built)

- **Machine-readable facts lock — `docs/canonical-facts.json`.** Today 2b
  (positive canonical assertion) is a human read of the Markdown facts lock. A
  small structured mirror (`{ foundingDate: "2015", reviews: { google:
  {rating:4.9, count:123}, … }, email_primary: "…", deposit_pct: 20, … }`) would
  let the `--stdin` gate assert *presence of the correct value*, not only absence
  of wrong ones — turning 2b from manual into automatic. Generate it from
  `CANONICAL_FACTS.md` in a validator test so the two can't diverge.
- **JSON-LD extract-and-parse helper — `scripts/lint-jsonld.mjs --stdin`.**
  Pull every `application/ld+json` block from a draft, `JSON.parse` each, and
  cross-check every `@id` against a dumped `entityGraph.ts` registry. Makes 2c
  runnable instead of eyeballed.
- **FAQ-collision checker — `scripts/faq-precedence-check.mjs <route>`.** Given a
  route + a candidate question, resolve via `resolveFaqs.ts` and report which
  tier currently owns that question, so 2d (single-FAQPage rule) is mechanical.
  Needs a `DATABASE_URL` for the `narrative_claims` tier (read-only); degrade to
  the hardcoded + CMS tiers when the DB is unreachable, and say so.
- **DB round-trip check (optional).** For `narrative_claim` outputs, a read-only
  query confirming `primary_page` matches an existing `content_pages.route`,
  so a claim can't be wired to a non-existent page.
