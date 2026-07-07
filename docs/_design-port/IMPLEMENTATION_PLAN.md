# IMPLEMENTATION_PLAN.md — genuine remaining work

> Derived from MAPPING_MATRIX.md. **Context that shapes this plan:** the supplied design (`new one.zip`)
> is a duplicate of `docs/design-reference/`, and its design system is **already ported and
> facts-correct** in the repo. Therefore this is **not** a re-skin backlog — it is a short, honest
> list of the *genuine* gaps the audit surfaced. Per the approved plan, work the audit shows is
> already done is **not re-invented**.
>
> **Priority:** P0 = drift/bug (must fix) · P1 = tech-debt with SEO/maintenance impact ·
> P2 = polish/consistency · P3 = docs/hygiene. **Effort:** S ≤1h · M ≤half-day · L multi-session.
> **Resolution rule in force:** style → design wins; facts → repo lock wins.

---

## P0 — Drift / correctness  → **NONE**
Audit found **no** canonical-facts drift in live `src` (grep + `validate:content` clean) and no
broken design mappings. The chrome, tokens, and homepage suite are faithful and facts-correct.
Nothing to fix at P0. *(This is the honest audit result, not an omission.)*

---

## P1 — Tech debt (SEO / maintenance)

### T1 · Resolve tour-route duplication  — Effort **M** · (MAPPING B-D1)
`tour-from-bali`, `tours-from-bali`, `tour-from-surabaya`, `tours-from-surabaya` are **full pages
with no `redirect()`**, coexisting with canonical `tours/from-bali` / `tours/from-surabaya`.
- **Risk:** duplicate-content dilution; triple maintenance surface.
- **Action (owner decision needed):** confirm the canonical route (per CLAUDE.md = nested
  `tours/from-{city}`), then convert the flat variants to `permanentRedirect()` stubs (or remove +
  add `next.config` redirects). **Not auto-done** — removing live routes is hard-to-reverse and needs
  the owner's call on inbound links/analytics.
- **Verify:** `npm run validate` (routes), check `sitemap`, crawl for internal links to old paths.

---

## P2 — Design consistency / polish

### T2 · Align verify-jvto dark sections to `jvto-navy` token — Effort **M** · (MAPPING B-D2)
`verify-jvto/{legal,police-safety,press-recognition,history-artifacts}` + `VerifyJvtoClient` paint
dark sections with `bg-slate-950/900/800` and slate gradients (48 occ.) instead of the brand
`jvto-navy` (#0D1B2A) / `jvto-navy-mid` (#1C2E40). Per "design = priority" they should use the token.
- **Mapping:** `slate-950/900 → jvto-navy`, `slate-800 → jvto-navy-mid`, stray `bg-jvto-green → bg-jvto-lime`.
- **Why not auto-applied:** gradient stops (`from-/to-/via-slate`) make a blind swap risky; the visual
  delta (#0f172a→#0D1B2A) is subtle and warrants a `npm run dev` eyeball before shipping to trust pages.
- **Verify:** `npm run build` + visual QA of all four verify pages (light + section contrast).

### T3 · Dead-component sweep — Effort **S** · (MAPPING B-D3)
Confirm whether `Home/Testimonials.tsx` and `Home/LevelSelector.tsx` (legacy-token-only, not imported
by `page.tsx`) are still referenced anywhere. If orphaned, remove. **Verify** with a repo-wide import
grep before deletion; `npx tsc --noEmit` after.

### T6 · Resolve typography direction: load Raleway/JetBrains Mono, or retire the tokens — Effort **M** · (MAPPING B-S3)
**Added 2026-07-07**, credit: automated Codex review on PR #90, deepened by follow-up investigation.
Confirmed: `--font-jvto-display` / `--font-jvto-mono` (Raleway / JetBrains Mono) are declared in
`website.css` but their `-loaded` fallback variables are never assigned anywhere in the repo, so
**only Inter actually renders** sitewide (loaded via `next/font/google` in `src/app/layout.tsx`).
This is entangled with a real, previously-undocumented conflict: repo root `DESIGN.md` (older,
commit `50471f9`) mandates **Inter-only, "no display serif, no mono"**; the newer `jvto-system.css`
V2 tokens (commit `ec7108c`) introduced Raleway/JetBrains Mono without removing `DESIGN.md`'s
`h1,h2{font-family:Inter}` override or actually loading the new fonts.
- **Owner decision needed between:**
  (a) **Load the fonts** — add `Raleway` + `JetBrains_Mono` via `next/font/google` in
      `src/app/(website)/layout.tsx` (mirrors the existing Rubik `--font-heading` pattern exactly),
      assign to `--font-jvto-display-loaded` / `--font-jvto-mono-loaded`, remove the stale
      `h1,h2{font-family:Inter}` override. Realizes the `jvto-system.css` spec as designed; visually
      changes headings/labels **sitewide**.
  (b) **Retire the tokens** — remove `--font-jvto-display`/`-mono` and the ~20 inline
      `style={{fontFamily:"Raleway, Inter, sans-serif"}}` occurrences, formally ratify Inter-only per
      root `DESIGN.md`, update `jvto-system.css`'s spec doc status to "superseded on this point."
- **Why not auto-applied:** genuinely ambiguous — two committed design docs disagree, and either
  resolution is a **sitewide, highly visible typography change**, not a bounded/reversible detail.
- **Verify (once decided):** `npm run build`, visual QA of headings/labels/`.micro` mono labels across
  homepage + verify-jvto + a tour detail page, `npx tsc --noEmit`.

---

## P3 — Hygiene / documentation

### T4 · Prevent `DESIGN (1).md` confusion — Effort **S**
Add a one-line note at the top of `docs/design-reference/uploads/DESIGN (1).md` (or a README in
`docs/design-reference/`) marking it an **abandoned brief** superseded by `jvto-system.css`, so a
future contributor doesn't accidentally implement the lime-`#A0CC3D`/Rubik system. *(Documentation
only — does not touch the design-reference source fidelity.)*

### T5 · Stefan Loose citation gate — Effort **S** · (MAPPING B-F3)
Keep the design's `2018 / ISBN 978-3-7701-7881-0` citation **unpublished** until the physical scan is
verified (existing open item). No code change; a note here so the design package's inclusion of it
does not get mistaken for authorization to publish.

---

## Execution order & what Phase 2 actually did

1. ✅ Authored the five docs (this file + DESIGN_BASELINE, REPO_BASELINE, MAPPING_MATRIX, LOG).
2. ✅ Ran the adoption + drift audit → **P0 empty**, backlog above recorded.
3. **Deferred (owner decision / visual QA):** T1, T2, T3 are documented, not auto-applied, because
   each is either hard-to-reverse (live routes) or needs visual sign-off (trust-page palette) — this
   is the approved-plan boundary ("bounded, reversible; don't overwrite correct work; don't invent work").
4. ✅ **2026-07-07, post-PR-review round:** an automated Codex review on PR #90 caught that the
   typography row was marked DONE incorrectly. Investigating it surfaced the deeper root-`DESIGN.md`
   conflict (§T6, MAPPING_MATRIX.md §B-S3) — all four docs corrected same-day; see
   IMPLEMENTATION_LOG.md for the full account. T6 added to this backlog as a result; not auto-applied
   for the same reason T1–T3 weren't (ambiguous, sitewide-visible, owner call).

See IMPLEMENTATION_LOG.md for the verification evidence.
