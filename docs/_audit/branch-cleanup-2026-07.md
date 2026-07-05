# Branch Cleanup Audit — 2026-07-05/06 (W5 part 1)

**Status: AUDIT / CLASSIFICATION ONLY. No branch was deleted or modified as part of this
work.** This document records evidence and produces ready-to-run `gh api` delete commands
for branches that were verified safe. Execution is a separate, explicit, owner-approved
step.

Audited from a fresh `git fetch origin --prune '+refs/heads/*:refs/remotes/origin/*'`
followed by `git fetch --unshallow` (this worktree's clone was shallow; ancestor/merge-base
checks require full history) run 2026-07-05/06, after PR #66 (design-reference spec,
merged at `71041d92`) landed on `main`. `origin/main` HEAD at audit time: `71041d92`. `origin/live`
HEAD at audit time: `8a289338`.

## 0. Reconciliation with the plan's "33 branches"

The plan text (drafted earlier on 2026-07-05) listed 33 real branches. By the time this
audit ran, 5 of those had already been merged and their branches deleted by same-day PRs
(#62–#66), and today's `--prune` fetch confirms all 5 refs are gone from `origin`:

| Branch (from original 33) | Resolution |
|---|---|
| `claude/governance-lock-bengkel-tunggal-emeid9` | RESOLVED — merged PR #62, branch deleted |
| `claude/volcanic-status-sync-live` | RESOLVED — merged PR #63, branch deleted |
| `claude/w05-quick-wins` | RESOLVED — merged PR #64 (W0.5), branch deleted |
| `claude/tsc-baseline-refresh` | RESOLVED — merged PR #65 (baseline docs), branch deleted |
| `claude/w3-design-reference` | RESOLVED — merged PR #66 (design-reference spec), branch deleted |

That leaves **32 branches on `origin` right now** (confirmed by `git branch -r` post-prune,
including `main` and `live` themselves). Of those 32:

- **31** map onto the plan's Kelompok A/B/C/D lists (10 + 11 + 8 + 2 — see below).
- **1** (`claude/w1-sanitize`) is a parallel sibling's in-flight work (PR #67, W1-sanitize),
  explicitly out of scope for this audit per the coordinator's addendum.

Other parallel-sibling branches named in the addendum (`stitch/live-to-main`,
`claude/w25-content-drift-validator`, `claude/w4-itinerary-pipeline`, `claude/w3a-chrome`,
`claude/w3c-tours-hubs`, `claude/w3e-why-jvto`, `claude/w3f-destinations`,
`claude/w3g-guides-policy-verify`) had **not yet been pushed to `origin`** at audit time —
they simply don't appear in `git branch -r` yet, so there is nothing to classify or exclude
beyond noting they are active/reserved names.

**W2 note:** `stitch/live-to-main` has not merged, so `main` is not yet a superset of
`live`. This audit found direct, branch-specific evidence (merged PR commit subjects
reachable in `origin/main` or `origin/live` history, plus byte-identical tip-vs-tip file
diffs) for every Kelompok B branch, so **no Kelompok B verdict below actually needed to
wait on W2** — each is resolved independently against the base the plan specified
(`origin/main` for non-`-live` branches, `origin/live` for `-live` branches). W2 remains
relevant to future audits (once it merges, `main` will absorb additional `live`-only
history), but it does not block any verdict recorded here.

## 1. Method

For every branch: `git log -1` for last commit (hash/date/author/subject);
`git merge-base --is-ancestor origin/<branch> origin/<base>` for the literal-ancestor
check; `git rev-list --left-right --count origin/<base>...origin/<branch>` for ahead/behind
commit counts; `git diff origin/<base>...origin/<branch> --stat` (three-dot, merge-base
diff) to see nominal unique files; and, wherever the three-dot diff showed non-trivial
content, a **tip-vs-tip two-dot diff per file** (`git diff origin/<base> origin/<branch> --
<file>`) to determine whether the apparent "unique" content is real unmerged work or
already byte-identically present in the base (i.e. squash-merged under a different commit,
so it fails the literal ancestor check but is fully superseded).

This second step is why two branches the plan pre-classified into "verify and likely
delete" groups (Kelompok A / B) turned out **not** to be safe — see §2 item 8 and §3 item
8 below. Flagging deviations from the plan's working assumption is the point of doing the
per-file check rather than trusting the ancestor bit alone.

## 2. Kelompok A — delete candidates (base: `origin/main`)

| # | Branch | Last commit | Author | Ancestor of main? | Ahead / Behind vs main | Verdict |
|---|---|---|---|---|---|---|
| 1 | `codex/improve-home-page-for-travel-website` | `b01af9a6` 2025-09-02 | sambuko82 | yes | 0 / 812 | **SAFE — delete** |
| 2 | `develop` | `042c3ed5` 2026-03-23 | davidsetyaahr | yes | 0 / 374 | **SAFE — delete** |
| 3 | `feat/policy-sync-p0-p2` | `7fdfb389` 2026-06-13 | davidsetyaahr | yes | 0 / 53 | **SAFE — delete** |
| 4 | `jvto-mba` | `b5e5ac07` 2026-05-25 | davidsetyaahr | yes | 0 / 135 | **SAFE — delete** |
| 5 | `play-firebase-studio` | `4adc6c0b` 2025-12-30 | davidsetyaahr | yes | 0 / 607 | **SAFE — delete** |
| 6 | `why` | `5f84ff20` 2026-02-25 | davidsetyaahr | yes | 0 / 459 | **SAFE — delete** |
| 7 | `claude/package-activity-snapshots-clean` | `63e4ff58` 2026-06-15 | sambuko82 | yes | 0 / 48 | **SAFE — delete** |
| 8 | `fix/ijen-screening-conditional-wording` | `16a81cec` 2026-06-25 | sambuko82 | **no** | 1 / 37 | **NOT SAFE — do not delete, see below** |
| 9 | `fix/prisma-vercel-binary` | `97372f6d` 2026-05-24 | sambuko82 | no (rebase/dup, not squash) | 1 / 174 | **SAFE — delete (superseded)** |
| 10 | `claude/whatsapp-agent-analysis-f4dwka` | `ebabf97e` 2026-06-29 | Claude | no (squash-merged) | 6 / 31 | **SAFE — delete (superseded)** |

**Items 1–7**: literal `git merge-base --is-ancestor` passes and 0 commits ahead of main —
textbook merged/superseded branches. No further evidence needed.

**Item 8 — `fix/ijen-screening-conditional-wording` — PLAN DEVIATION, do not delete.**
This branch is *not* an ancestor of main and its one unique commit is a genuine, small,
unmerged content fix — not a rebase artifact. The diff (`git diff origin/main...origin/fix/ijen-screening-conditional-wording`)
touches exactly two files:

```
src/components/website/IjenHealthCertFAQ.tsx  | 2 +-
src/components/website/SafetyOnToursPage.tsx  | 2 +-
```

changing "This is a non-negotiable government regulation..." /
"Mandatory Health Screening: As a non-negotiable rule..." to conditional wording citing
BBKSDA SE.1658/KSA.9/2024 (the same SE.1658 term already in `DEFINED_TERMS` per
`entityGraph.ts`). **Current `main` still has the old "non-negotiable"/"mandatory" wording**
in both files — confirmed directly:

```
$ grep -n "non-negotiable\|Mandatory Health Screening" src/components/website/IjenHealthCertFAQ.tsx src/components/website/SafetyOnToursPage.tsx
IjenHealthCertFAQ.tsx:22:   ...This is a non-negotiable government regulation...
SafetyOnToursPage.tsx:51:   <strong>Mandatory Health Screening:</strong> As a non-negotiable rule...
```

A related fix, `feat/policy-sync-p0-p2` (commit `7fdfb389`, already merged, item 3 above),
made the *same kind* of "mandatory → conditional" change but only in
`src/lib/publicContent/generated/dbPageSnapshots.json` (the CMS/DB-driven policy page
content) — it does not touch these two hardcoded components. So this branch's fix is not
redundant with the already-merged policy-sync work; it is a separate, still-needed
correction to hardcoded copy. **Recommendation: do not delete; route to the branch owner
(sambuko82) or open a small PR carrying just this 2-line diff, then delete after merge.**

**Item 9 — `fix/prisma-vercel-binary` — superseded, evidence.** Three-dot diff shows 7
files including generated Prisma client binaries. The substantive change (adding
`binaryTargets = ["native", "rhel-openssl-3.0.x"]` to `prisma/schema.prisma`) is already
present in `main`, added independently via a different, earlier-numbered commit
(`46c78553` — "fix: add rhel-openssl-3.0.x binary target for Vercel deployment (#9)",
reachable in `main`'s history). Tip-vs-tip diff of `prisma/schema.prisma` between
`origin/main` and this branch is **empty**. Safe to delete.

**Item 10 — `claude/whatsapp-agent-analysis-f4dwka` — superseded, evidence.** Three-dot
diff (against the old merge-base) shows 18 files / 1015 insertions of agent-guide feature
work, which looks alarming in isolation. But `main` already contains
`src/app/(website)/travel-guide/AgentGuide.tsx` and `src/lib/content/agentGuides.ts`
(the feature landed via a squash merge under a different commit). Tip-vs-tip diff for
every touched file (`AgentGuide.tsx`, `agentGuides.ts`, `TourDetail.tsx`,
`public/customer-link-registry.json`, `src/lib/registry/pages.ts`) is **empty** — main is
byte-identical on these files and a strict superset overall (two-dot diff: 42 insertions /
33,706 deletions, i.e. main has moved on but lost nothing this branch uniquely had). Safe
to delete.

## 3. Kelompok B — per-file diff verdicts (base: `origin/main` for non-`-live`, `origin/live` for `-live`)

| # | Branch | Base | Last commit | Author | Ahead / Behind | Verdict |
|---|---|---|---|---|---|---|
| 1 | `feat/schema-spine` | main | `9422b658` 2026-06-12 | davidsetyaahr | 1 / 59 | **SAFE — delete (merged PR #44)** |
| 2 | `feat/schema-spine-live` | live | `d5b48b8c` 2026-06-12 | davidsetyaahr | 2 / 17 | **SAFE — delete (merged PR #46)** |
| 3 | `feat/schema-builders` | main | `68323185` 2026-06-13 | davidsetyaahr | 1 / 56 | **SAFE — delete (merged PR #47/#48)** |
| 4 | `feat/schema-builders-live` | live | `4d740d7e` 2026-06-13 | davidsetyaahr | 1 / 16 | **SAFE — delete (merged PR #48)** |
| 5 | `feat/schema-conversions` | main | `803e7f97` 2026-06-12 | davidsetyaahr | 1 / 57 | **SAFE — delete (merged PR #45)** |
| 6 | `claude/epic-brahmagupta-SzDui-banner` | main | `8ccc64b2` 2026-06-11 | Claude | 1 / 62 | **SAFE — delete (merged PR #40)** |
| 7 | `claude/epic-brahmagupta-SzDui-banner-live` | live | `93e1e591` 2026-06-11 | Claude | 1 / 19 | **SAFE — delete (merged PR #41)** |
| 8 | `claude/epic-brahmagupta-SzDui` | main | `ebec5989` 2026-06-15 | sambuko82 | 9 / 65 | **NOT SAFE — real unmerged feature, see below** |
| 9 | `claude/epic-brahmagupta-SzDui-live` | live | `c2340817` 2026-06-11 | Claude | 2 / 26 | **SAFE — delete (stale/superseded)** |
| 10 | `feat/policy-sync-p0-p2-live` | live | `a76029fe` 2026-06-13 | davidsetyaahr | 0 / 14 | **SAFE — delete (merged PR #50, empty diff)** |
| 11 | `codex/locate-application-information` | main | `8835fc36` 2025-09-02 | sambuko82 | 1 / 815 | **SAFE — delete (page.tsx gone; layout.tsx diff checked = scaffold regression, no loss)** |

(`claude/volcanic-status-sync-live`, listed in the plan's original Kelompok B, is confirmed
absent from `origin` — RESOLVED, see §0.)

**Items 1, 3, 5, 6** (main-targeting): each three-dot diff nominally shows a handful of
unique files, but `git log origin/main --grep <matching subject>` finds the same commit
subject already merged into `main` (PR #44, #47/#48, #45, #40 respectively), and per-file
tip-vs-tip diffs are empty except for files `main` has since evolved further (e.g.
`src/lib/registry/pages.ts` and `.github/workflows/ci.yml` — both cases of main moving
*forward*, not the branch holding something main lacks).

**Items 2, 4, 7, 10** (live-targeting): identical pattern verified against `origin/live` —
PR #46, #48, #41, #50 respectively are reachable in `live`'s history, and per-file diffs
are empty or reflect live's own later evolution.

**Item 8 — `claude/epic-brahmagupta-SzDui` — PLAN DEVIATION, do not delete.** This is the
non-`-live` sibling of item 6/9 above and shares its blog/banner_image and
package-activity-snapshot history (both already merged into main independently — see items
6 and Kelompok A #7). But its three-dot diff also carries a **`policy-bundle` feature that
does not exist in `main` at all**:

```
src/lib/policy-bundle.ts                          (absent from main)
scripts/sync-policy-bundle.mjs                    (absent from main)
src/data/policy-bundle/_manifest.json             (absent from main)
src/data/policy-bundle/consumer-bundles.json      (absent from main)
src/data/policy-bundle/deprecated-wording-report.json (absent from main)
src/data/policy-bundle/gap-report.json            (absent from main)
src/data/policy-bundle/policy-bundle.json         (absent from main)
```

plus real, non-trivial integration diffs (tip-vs-tip, not stale) wiring that module into:

- `src/app/(website)/checkout/page.tsx` (77 diff lines — adds a "Policy source" note block
  driven by `getPolicyDomain(...)` and repoints Terms/Cancellation links from
  `/travel-guide/booking-information` to `/policy/booking-payment-cancellation`)
- `src/app/(website)/my-booking/[slug]/bank-transfer/page.tsx` (31 diff lines — same
  `getPolicyDomain` note pattern)
- `src/app/(website)/travel-guide/page.tsx` (716 diff lines — larger restructure, adds
  `fs`/`path` reads and new UI elements)
- `.github/workflows/ci.yml` and `package.json` (minor, likely a validate-gate hook for the
  new bundle)

This is a real, apparently-still-relevant unmerged feature (policy content deduplication /
single-source-of-truth wiring across checkout, invoice, and travel-guide surfaces) — not a
stale duplicate. **Recommendation: do not delete; flag for owner/dev triage on whether the
policy-bundle feature should still land, then re-run this same per-file check after any
merge before considering deletion.**

**Item 9 — `claude/epic-brahmagupta-SzDui-live` — superseded, evidence (opposite
direction).** Unlike item 8, this `-live` branch's tip-vs-tip diff against `origin/live`
shows **`live` is ahead**, not the branch: e.g. `src/lib/blog.ts` diff shows the branch
*lacks* `banner_image` fields that `live` now has (from the already-merged PR #41), and
`.github/workflows/ci.yml` / `package.json` diffs show the branch lacks the `validate`
script/gate that `live` now has. This branch is an earlier snapshot fully absorbed and then
surpassed. Safe to delete.

**Item 11 — `codex/locate-application-information` — structurally obsolete, layout.tsx
diff independently checked.** Single commit from 2025-09-02 ("Create interactive travel
homepage"), touching `src/app/layout.tsx` and `src/app/page.tsx`. **`src/app/page.tsx`
no longer exists** — the codebase has since moved to route groups (`(website)/page.tsx`,
etc., per `CLAUDE.md`'s "Routing" section), so this branch's target file was
restructured out of existence.

Codex review flagged that `layout.tsx` still exists on `main` today and asked for direct
evidence its diff is empty/obsolete before deleting — correct to demand, since a
"page.tsx is gone" argument alone doesn't cover `layout.tsx`. Checked directly
(`git diff origin/main origin/codex/locate-application-information -- src/app/layout.tsx`):
this branch's version is a **regression to Next.js scaffold defaults** — it strips
`main`'s GTM (Google Tag Manager) `<Script>` injection, the `Inter` font import, and
`suppressHydrationWarning` handling, replacing them with the boilerplate
`"Create Next App"` metadata and a bare `<body className="antialiased font-sans">`.
Confirmed nothing to merge; deleting loses no functionality — the opposite would be true.
Safe to delete.

## 4. Kelompok C — owner input required before any action (default: SKIP)

None of these were deleted, diffed exhaustively, or otherwise acted on beyond a stat-level
characterization — per the plan, these need an owner call on provenance/intent first.

| Branch | Last commit | Author | Ahead / Behind vs main | Note / owner question |
|---|---|---|---|---|
| `dev-inant` | `d4f52174` 2026-05-09 | Inant Kharisma | 20 / 367 | Personal dev branch, last touches `src/lib/seo/getOrganizationProfile.ts` and `src/lib/seo/jsonld/builders.ts`. Owner question: is Inant Kharisma an active contributor whose branch should be reviewed for landing, or an abandoned experiment? |
| `sam-workspace` | `01bdaab6` 2026-04-10 | davidsetyaahr | 26 / 374 | Adds `src/utils/cms.ts` + `verify-cms.sh` (254-file diff overall) — looks like a CMS admin-tooling experiment. Owner question: whose workspace is this in practice (name says "sam", committer is davidsetyaahr) and is the CMS tooling still wanted? |
| `design/sam` | `581a582e` 2026-05-24 | sambuko82 | 17 / 312 | 3D fly-through camera work (`vercel.json`, `src/lib/tourFaqs.ts`, 229-file diff). Owner question: does this relate to `feat/3d-route-embedded` below (same 3D-route theme, different branch) — should they be reconciled into one branch before either lands or is dropped? |
| `backup-before-rollback-20260511-417` | `5f45d6b8` 2026-05-11 | davidsetyaahr | 6 / 260 | Name signals an explicit rollback safety snapshot. Per plan instruction: **keep until owner is willing to release it** ("simpan sampai owner rela") — do not treat as a normal cleanup candidate. |
| `copilot/audit-repository-structure-and-code-quality` | `fb7cbd47` 2026-04-08 | copilot-swe-agent[bot] | 26 / 374 | GitHub Copilot agent-authored audit branch; also touches `src/utils/cms.ts` / `verify-cms.sh` (overlaps with `sam-workspace`'s file set). Owner question: was this audit ever reviewed, and are any of its findings still open? |
| `codex-update` | `a30fd0dc` 2026-03-18 | davidsetyaahr | 2 / 385 | Only 2 commits ahead but a large `Navbar.tsx` diff (900 lines, mostly deletions — an old Navbar refactor attempt). Owner question: superseded by current Navbar, or still wanted? |
| `vercel` | `6d8b2fd9` 2026-04-09 | davidsetyaahr | 2 / 374 | 3-dot diff is dominated by generated Prisma client files (`src/generated/prisma/*`, ~74.6k insertions) — looks like an accidental commit of generated/binary artifacts alongside whatever the intended Vercel-config change was. Owner question: is there real intended content here besides the accidental generated-file commit? |
| `feat/3d-route-embedded` | `26c141aa` 2026-05-24 | sambuko82 | 1 / 175 | New `Route3DEmbedded.tsx` component + `DestinationDetailView.tsx` integration (3755 insertions). Directly relevant to the "Current Sprint" open item in `CLAUDE.md` about `NEXT_PUBLIC_MAPBOX_TOKEN` / mapbox-gl audit findings (12 high, 2 critical npm audit). Owner question: land this, or is `design/sam`'s 3D work the intended path instead? |

## 5. Kelompok D — never touch

| Branch | Last commit | Note |
|---|---|---|
| `main` | `71041d92` 2026-07-06, sambuko82 (merge PR #66) | Bengkel tunggal — all work lands here via PR. |
| `live` | `8a289338` 2026-07-04, davidsetyaahr | Production release pointer — owner-commanded promote PRs only. |

## 6. Excluded — active parallel work (not audited)

Per the coordinator's addendum, these branch names are reserved/in-flight for sibling
agents running concurrently with this audit and are explicitly out of scope:

- `claude/w1-sanitize` — **present on `origin`** (PR #67, W1-sanitize; 3 commits ahead / 6
  behind `main` as of this audit's fetch). Active — do not classify or touch.
- `stitch/live-to-main`, `claude/w25-content-drift-validator`,
  `claude/w4-itinerary-pipeline`, `claude/w3a-chrome`, `claude/w3c-tours-hubs`,
  `claude/w3e-why-jvto`, `claude/w3f-destinations`, `claude/w3g-guides-policy-verify` — not
  yet present on `origin` at audit time; nothing to classify.

## 7. Ready-to-run deletion commands

**JANGAN MENGEKSEKUSI — for owner/maintainer use after reviewing this document.** Each
command targets exactly one verified-safe branch (Kelompok A items 1–7, 9, 10; Kelompok B
items 1–7, 9, 10, 11). None of these have been run as part of this audit.

```bash
# Kelompok A — verified ancestor-of-main or byte-identical-superseded
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/codex/improve-home-page-for-travel-website
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/develop
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/policy-sync-p0-p2
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/jvto-mba
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/play-firebase-studio
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/why
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/claude/package-activity-snapshots-clean
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/fix/prisma-vercel-binary
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/claude/whatsapp-agent-analysis-f4dwka

# NOT included: fix/ijen-screening-conditional-wording (real unmerged fix — see §2 item 8)

# Kelompok B — verified merged (PR-reachable) or structurally obsolete
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/schema-spine
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/schema-spine-live
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/schema-builders
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/schema-builders-live
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/schema-conversions
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/claude/epic-brahmagupta-SzDui-banner
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/claude/epic-brahmagupta-SzDui-banner-live
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/claude/epic-brahmagupta-SzDui-live
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/feat/policy-sync-p0-p2-live
gh api -X DELETE repos/jvto-devteam/jvto-web/git/refs/heads/codex/locate-application-information

# NOT included: claude/epic-brahmagupta-SzDui (real unmerged policy-bundle feature — see §3 item 8)

# Kelompok C, D: no commands — owner input required (C) or never (D)
```

## 8. Summary

- **32 branches on `origin`** at audit time (post-`--prune`), of which **31** map to the
  plan's Kelompok A (10) / B (11) / C (8) / D (2), and **1** (`claude/w1-sanitize`) is
  active parallel work excluded from scope.
- **5 branches** from the plan's original 33 are **RESOLVED-TODAY** (merged + deleted via
  PRs #62–#66) and no longer exist on `origin` — nothing further to do.
- **Ready-to-delete (verified safe, command provided in §7): 19 branches** — 9 from
  Kelompok A, 10 from Kelompok B.
- **Conditional-on-W2: 0 branches.** Every Kelompok B verdict was resolved with direct,
  branch-specific evidence (reachable merged-PR commits + empty tip-vs-tip file diffs)
  against the base the plan specified, independent of whether `stitch/live-to-main` has
  merged yet.
- **Flagged as real unmerged work — do not delete, needs dev/owner re-review before any
  branch action: 2 branches** — `fix/ijen-screening-conditional-wording` (Kelompok A, §2
  item 8) and `claude/epic-brahmagupta-SzDui` (Kelompok B, §3 item 8). Both are deviations
  from the plan's working assumption that these groups were pre-verified as safe; the
  per-file diff step in this audit is what surfaced them.
- **Owner input required, default SKIP: 8 branches** (all of Kelompok C, §4) — no deletions
  proposed; each row above states the specific question the owner needs to answer.
- **Never touch: 2 branches** (`main`, `live`, Kelompok D).
