# Design System ↔ Web Parity Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align all 4 clusters (Travel Guide, Why-JVTO, Verify-JVTO, Policy) so the Next.js TSX matches the HTML design system exactly in content, visual tokens, and structure.

**Architecture:** Direct Edit calls on individual TSX files — no new files needed. All fixes are search-and-replace operations on existing content. Tasks are ordered: critical fixes first, systemic/multi-file fixes last.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS (design tokens: `bg-jvto-navy`, `text-jvto-orange`, `text-jvto-lime`, `bg-[#F6F5F2]`), TypeScript, no test files (all verification via `npx tsc --noEmit`).

## Global Constraints

- Never use `"use client"` in page.tsx files — Server Components only
- Design token for lime: `text-jvto-lime` (NOT `text-[#8CC63F]` — use the Tailwind alias)
- Design token for orange: `text-jvto-orange` / `bg-jvto-orange`
- Interior article pages: always wrap main prose in `<article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">`
- H1 italic accent pattern for interior sub-pages: `<em className="italic text-jvto-orange">word.</em>`
- CTA at bottom of any cluster hub: must be a standalone `<section className="bg-jvto-navy ...">`, NOT a div inside the last section
- Baseline TypeScript errors (pre-existing, do NOT fix): 3 dead imports in HomePage.tsx and ReviewsPage.tsx
- After all tasks: run `npx tsc --noEmit` and expect 0 new errors

---

## Files Modified

| Task | File |
|------|------|
| 1, 2 | `src/app/(website)/travel-guide/page.tsx` |
| 3 | `src/app/(website)/travel-guide/police-escort-for-groups/page.tsx` |
| 4 | `src/app/(website)/travel-guide/faq/page.tsx` |
| 5, 6 | `src/app/(website)/why-jvto/page.tsx` |
| 7 | `src/app/(website)/why-jvto/our-story/page.tsx` |
| 8a | `src/app/(website)/why-jvto/our-story/page.tsx` |
| 8b | `src/app/(website)/why-jvto/reviews/page.tsx` |
| 8c | `src/app/(website)/why-jvto/the-jvto-difference/page.tsx` |
| 8d | `src/app/(website)/why-jvto/community-standards/page.tsx` |
| 8e | `src/app/(website)/why-jvto/[slug]/page.tsx` |
| 9 | `src/components/website/VerifyProofGrid.tsx` |

---

## Task 1: Travel Guide Hub — H1, lede, §01 copy & icons

**File:** `src/app/(website)/travel-guide/page.tsx`

**Gaps fixed:** #1 H1 wrong word, #2 lede text, #4 three §01 card descriptions, #5 safety icon missing checkmark, #8 group icon missing second circle.

- [ ] **Step 1: Fix H1 — wrong word emphasized**

HTML spec: `The <span class="italic">rulebook</span> before you book.`
TSX currently emphasizes "before" in orange non-italic. Fix to emphasize "rulebook" in italic orange.

```tsx
// FIND:
                The rulebook{" "}
                <em className="not-italic text-jvto-orange">before</em>{" "}
                you book.

// REPLACE WITH:
                The{" "}
                <em className="italic text-jvto-orange">rulebook</em>{" "}
                before you book.
```

- [ ] **Step 2: Fix lede paragraph text**

HTML spec: `"Operational certainty starts with being informed. Read our comprehensive guide to understand the boundaries, logistics, and safety protocols of East Java expeditions."`

```tsx
// FIND:
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                Bookings, safety, health screening, packing, weather, and police oversight —
                everything you need to know before your East Java private tour.
              </p>

// REPLACE WITH:
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[48ch]">
                Operational certainty starts with being informed. Read our comprehensive guide
                to understand the boundaries, logistics, and safety protocols of East Java expeditions.
              </p>
```

- [ ] **Step 3: Fix hero meta-block "Reading time"**

HTML spec: `~25 min` (no "total").

```tsx
// FIND:
                { label: "Reading time", value: "~25 min total" },

// REPLACE WITH:
                { label: "Reading time", value: "~25 min" },
```

- [ ] **Step 4: Fix §01 Safety Boundaries — description text + add shield checkmark**

HTML spec desc: `"We follow official PVMBG (Volcanology) alerts without exception. If a site is closed, we do not enter. Safety is the non-negotiable."`
HTML spec icon: shield + checkmark (`d="M9 12l2 2 4-4"`).

```tsx
// FIND:
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  label: "PVMBG-aligned",
                  title: "Safety boundaries",
                  desc: "We follow PVMBG volcanic alert levels and BBKSDA conservation rules. No crater access when it is unsafe to do so.",
                },

// REPLACE WITH:
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ),
                  label: "PVMBG-aligned",
                  title: "Safety boundaries",
                  desc: "We follow official PVMBG (Volcanology) alerts without exception. If a site is closed, we do not enter. Safety is the non-negotiable.",
                },
```

- [ ] **Step 5: Fix §01 Health Requirements — description text**

HTML spec: `"Mandatory certified clinic checks for Ijen. You must be medically cleared for altitude and sulfur exposure. No fake letters."`

```tsx
// FIND:
                  label: "Real screening",
                  title: "Health requirements",
                  desc: "Ijen requires a QR-verified health certificate from a named, SIP-licensed physician — not an in-house printout.",

// REPLACE WITH:
                  label: "Real screening",
                  title: "Health requirements",
                  desc: "Mandatory certified clinic checks for Ijen. You must be medically cleared for altitude and sulfur exposure. No fake letters.",
```

- [ ] **Step 6: Fix §01 Operational Control — description text + add second person circle**

HTML spec desc: `"We are the operator, not a broker. We control the vehicles, the guides, and the safety decisions from start to finish."`
HTML spec icon: person group with two circles.

```tsx
// FIND:
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    </svg>
                  ),
                  label: "Not a broker",
                  title: "Operational control",
                  desc: "JVTO owns its guides, vehicles, and logistics. When conditions change, we make the call — not a reseller.",
                },

// REPLACE WITH:
                {
                  icon: (
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                      <circle cx="17" cy="7" r="3" />
                    </svg>
                  ),
                  label: "Not a broker",
                  title: "Operational control",
                  desc: "We are the operator, not a broker. We control the vehicles, the guides, and the safety decisions from start to finish.",
                },
```

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: 0 new errors (3 pre-existing dead-import errors are OK).

- [ ] **Step 8: Commit**

```bash
git add src/app/\(website\)/travel-guide/page.tsx
git commit -m "fix(tg-hub): restore H1 word, lede text, §01 card copy and icons from HTML design system"
```

---

## Task 2: Travel Guide Hub — §02 destination cards + CTA section

**File:** `src/app/(website)/travel-guide/page.tsx`

**Gaps fixed:** #7 §02 destination cards missing location pin icons, #3 CTA not in separate navy section.

- [ ] **Step 1: Add location pin icon to each §02 destination card**

HTML spec: each destination tile has a `<svg class="ix">` location pin icon before the h3.
Find the §02 card map function and add icon above `<h3>`:

```tsx
// FIND:
              {[
                { href: "/travel-guide/ijen-health-screening", name: "Ijen Health Screening", desc: "Mandatory medical clearance · gas mask · clinic protocol." },
                { href: "/travel-guide/mount-bromo-logistics", name: "Mount Bromo Logistics", desc: "Jeep timings · sunrise viewpoints · altitude prep." },
                { href: "/travel-guide/tumpak-sewu-logistics", name: "Tumpak Sewu Logistics", desc: "Trekking · footwear · river crossing safety." },
              ].map(({ href, name, desc }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className="group bg-white rounded-[20px] p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)] transition-all block"
                >
                  <h3

// REPLACE WITH:
              {[
                { href: "/travel-guide/ijen-health-screening", name: "Ijen Health Screening", desc: "Mandatory medical clearance · gas mask · clinic protocol." },
                { href: "/travel-guide/mount-bromo-logistics", name: "Mount Bromo Logistics", desc: "Jeep timings · sunrise viewpoints · altitude prep." },
                { href: "/travel-guide/tumpak-sewu-logistics", name: "Tumpak Sewu Logistics", desc: "Trekking · footwear · river crossing safety." },
              ].map(({ href, name, desc }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className="group bg-white rounded-[20px] p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)] transition-all block"
                >
                  <div className="mb-4">
                    <svg className="w-7 h-7 text-jvto-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3
```

- [ ] **Step 2: Extract CTA from §05 off-white section into separate navy section**

Find and remove the `{/* CTA */}` div inside §05, then add a new navy CTA section after `</section>` closes §05.

```tsx
// FIND (the CTA div embedded inside §05 section):
          {/* CTA */}
          <div className="mt-24 text-center">
            <h2
              className="font-black text-jvto-navy leading-[1.02] mb-8"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 48px)" }}
            >
              Ready for operational <span className="text-jvto-orange">certainty?</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tours"
                prefetch={false}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
              >

// NOTE: You need to read the full CTA block to find its closing </div></div>
// Then DELETE the entire {/* CTA */}...closing </div> block from inside the §05 section
// AND add the following AFTER the §05 closing </section> tag:
```

After the §05 section `</section>` closing tag, add:

```tsx
      {/* ── CTA — navy, stacked ─────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 48px)" }}
          >
            Ready for operational <span className="text-jvto-orange">certainty?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Explore tours <ArrowRight />
            </Link>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
```

> **Note for implementer:** To find the exact old CTA block to remove — search for `{/* CTA */}` in the file. The block spans from that comment to the `</div>` that closes `<div className="mt-24 text-center">`. Read the file around line 417 to see the full extent before deleting.

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: 0 new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(website\)/travel-guide/page.tsx
git commit -m "fix(tg-hub): add location pin icons to §02 cards, extract CTA to separate navy section"
```

---

## Task 3: Police Escort — white card wrapper + H1 italic

**File:** `src/app/(website)/travel-guide/police-escort-for-groups/page.tsx`

**Gaps fixed:** #9 article body not wrapped in white card (inconsistent with all other 9 interior pages), #10 H1 "for groups." should be italic.

- [ ] **Step 1: Fix H1 italic treatment**

HTML spec: `Police escort <span class="italic">for groups.</span>` — "for groups." is italic, no color change.
Current TSX: `<em className="not-italic text-jvto-orange">for groups.</em>`
Fix: keep orange (as design upgrade) but restore italic.

```tsx
// FIND:
                <em className="not-italic text-jvto-orange">for groups.</em>

// REPLACE WITH:
                <em className="italic text-jvto-orange">for groups.</em>
```

- [ ] **Step 2: Wrap article prose div in white card**

All other 9 interior travel guide pages use `<article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">`. Police Escort uses a plain `<div className="min-w-0">`. Replace the opening and closing tags.

```tsx
// FIND (opening tag at "Article prose" comment):
            {/* Article prose */}
            <div className="min-w-0">

// REPLACE WITH:
            {/* Article prose */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
```

Then find the closing `</div>` that matches this container. It will be just before `</div>` that closes the grid and just before `</section>` that closes the off-white article section. Read the file to find the exact closing tag context, then replace:

```tsx
// FIND (closing tag — will be the last </div> before the </div> that closes the grid):
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA

// REPLACE WITH:
            </article>

          </div>
        </div>
      </section>

      {/* ── CTA
```

> **Note for implementer:** Read the file around lines 175–360 to see the exact closing structure. The pattern is: article div → closes with `</div>` → then grid `</div>` → then container `</div>` → then `</section>`. Replace only the innermost closing `</div>` with `</article>`.

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: 0 new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(website\)/travel-guide/police-escort-for-groups/page.tsx
git commit -m "fix(police-escort): wrap article in white card, restore H1 italic treatment"
```

---

## Task 4: Travel Guide FAQ — H1 italic

**File:** `src/app/(website)/travel-guide/faq/page.tsx`

**Gap fixed:** #12 H1 "FAQ." should be italic (like the HTML spec), not `not-italic`.

- [ ] **Step 1: Fix H1 italic**

```tsx
// FIND (in the hero h1):
                <em className="not-italic text-jvto-orange">FAQ.</em>

// REPLACE WITH:
                <em className="italic text-jvto-orange">FAQ.</em>
```

- [ ] **Step 2: TypeScript check + commit**

```bash
npx tsc --noEmit
git add src/app/\(website\)/travel-guide/faq/page.tsx
git commit -m "fix(tg-faq): restore italic treatment on H1 accent span"
```

---

## Task 5: Why-JVTO Hub — §02 Reviews color tokens

**File:** `src/app/(website)/why-jvto/page.tsx`

**Gaps fixed:** #14 score count color wrong (gray → orange), #15 platform label color wrong (navy → muted gray).

- [ ] **Step 1: Fix platform label color and score count color**

The score-row renders a 3-column grid. Each card has:
- Platform name: currently `text-jvto-navy` — should be `text-[#9ca3af]` (muted)
- Count: currently `text-[#9ca3af]` — should be `text-jvto-orange`

```tsx
// FIND:
                    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-jvto-navy mb-0.5">{platform}</div>
                    <div className="text-[11px] text-[#9ca3af]">{count}</div>

// REPLACE WITH:
                    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#9ca3af] mb-0.5">{platform}</div>
                    <div className="text-[11px] text-jvto-orange">{count}</div>
```

- [ ] **Step 2: TypeScript check + commit**

```bash
npx tsc --noEmit
git add src/app/\(website\)/why-jvto/page.tsx
git commit -m "fix(why-hub): restore §02 review score color tokens (count→orange, platform→muted)"
```

---

## Task 6: Why-JVTO Hub — §04 Team colors + §01/§03 lede + H1

**File:** `src/app/(website)/why-jvto/page.tsx`

**Gaps fixed:** #16 §04 team role color missing lime, #17 portrait width too narrow, #18 §04 eyebrow not lime, #19 "Tap a pillar..." and "Tap a year." sentences dropped, #20 H1 accent not-italic.

- [ ] **Step 1: Fix H1 accent — restore italic**

```tsx
// FIND:
                <em className="not-italic text-jvto-orange">separate</em>

// REPLACE WITH:
                <em className="italic text-jvto-orange">separate</em>
```

- [ ] **Step 2: Add missing "Tap a pillar to see what proves it." to §01 lede**

```tsx
// FIND:
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6">
                Not marketing language — every one is backed by a credential you can check.
              </p>

// REPLACE WITH:
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6">
                Not marketing language — every one is backed by a credential you can check.{" "}
                <strong className="font-semibold text-jvto-navy">Tap a pillar to see what proves it.</strong>
              </p>
```

- [ ] **Step 3: Add missing "Tap a year." to §03 lede**

```tsx
// FIND:
              <p className="text-white/60 text-[14px] font-light leading-relaxed mb-6">
                Eleven years of operational continuity at one Bondowoso address — documented by third parties.
              </p>

// REPLACE WITH:
              <p className="text-white/60 text-[14px] font-light leading-relaxed mb-6">
                Eleven years of operational continuity at one Bondowoso address — documented by third parties.{" "}
                <strong className="font-semibold text-white/80">Tap a year.</strong>
              </p>
```

- [ ] **Step 4: Fix §04 eyebrow color — both label parts to lime**

```tsx
// FIND:
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-4">
                <span className="text-white/50">§ 04</span> · Our Team

// REPLACE WITH:
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-jvto-lime mb-4">
                <span className="text-jvto-lime">§ 04</span> · Our Team
```

- [ ] **Step 5: Fix crew portrait width — 144px → 190px**

```tsx
// FIND:
              {[...CREW, ...CREW].map((p, idx) => (
                <div key={idx} className="flex-shrink-0 w-36">

// REPLACE WITH:
              {[...CREW, ...CREW].map((p, idx) => (
                <div key={idx} className="flex-shrink-0 w-[190px]">
```

- [ ] **Step 6: Fix crew role color — white/60 → lime**

```tsx
// FIND:
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">{p.role}</div>

// REPLACE WITH:
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-jvto-lime">{p.role}</div>
```

- [ ] **Step 7: TypeScript check + commit**

```bash
npx tsc --noEmit
git add src/app/\(website\)/why-jvto/page.tsx
git commit -m "fix(why-hub): §04 lime colors, portrait width, §01/03 lede sentences, H1 italic"
```

---

## Task 7: Why-JVTO Our Story — typo + lede font weight

**File:** `src/app/(website)/why-jvto/our-story/page.tsx`

**Gaps fixed:** #22 typo "Reisefüher" → "Reiseführer", #23 lede font-semibold → font-light.

- [ ] **Step 1: Fix lede font weight**

```tsx
// FIND:
              <p className="text-[17px] text-jvto-navy font-semibold leading-relaxed mb-8 max-w-[62ch]">

// REPLACE WITH:
              <p className="text-[17px] text-jvto-navy font-light leading-relaxed mb-8 max-w-[62ch]">
```

- [ ] **Step 2: Fix typo in Stefan Loose reference**

```tsx
// FIND:
                Stefan Loose
                Reisefüher Indonesien

// REPLACE WITH:
                Stefan Loose
                Reiseführer Indonesien
```

> **Note:** The word may be on two lines or one line in the JSX. Search for `Reisefüher` (missing 'r') in the file — it will only appear once.

- [ ] **Step 3: TypeScript check + commit**

```bash
npx tsc --noEmit
git add src/app/\(website\)/why-jvto/our-story/page.tsx
git commit -m "fix(our-story): correct Reiseführer typo, lighten lede font weight to match design system"
```

---

## Task 8: Why-JVTO Systemic — sidebar nav label corrections (5 files)

**Gaps fixed:** #27 sidebar nav labels "Why JVTO" → "Why JVTO overview", "Guest Reviews" → "Reviews" across all 5 sub-page files.

The `WHY_JVTO_NAV` const is duplicated in each file (not shared). Each file needs the same 2-label fix.

**Files:**
- `src/app/(website)/why-jvto/our-story/page.tsx`
- `src/app/(website)/why-jvto/reviews/page.tsx`
- `src/app/(website)/why-jvto/the-jvto-difference/page.tsx`
- `src/app/(website)/why-jvto/community-standards/page.tsx`
- `src/app/(website)/why-jvto/[slug]/page.tsx`

Current NAV structure in all 5 files:
```tsx
const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Guest Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
];
```

- [ ] **Step 1: Fix our-story/page.tsx NAV labels**

```tsx
// FIND:
const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Guest Reviews" },

// REPLACE WITH:
const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
```

- [ ] **Step 2: Fix reviews/page.tsx NAV labels** (same pattern, same find/replace)

- [ ] **Step 3: Fix the-jvto-difference/page.tsx NAV labels** (same pattern)

- [ ] **Step 4: Fix community-standards/page.tsx NAV labels** (same pattern)

- [ ] **Step 5: Fix [slug]/page.tsx NAV labels** (same pattern)

- [ ] **Step 6: TypeScript check + commit**

```bash
npx tsc --noEmit
git add src/app/\(website\)/why-jvto/our-story/page.tsx \
        src/app/\(website\)/why-jvto/reviews/page.tsx \
        src/app/\(website\)/why-jvto/the-jvto-difference/page.tsx \
        src/app/\(website\)/why-jvto/community-standards/page.tsx \
        "src/app/(website)/why-jvto/[slug]/page.tsx"
git commit -m "fix(why-jvto): correct sidebar nav labels to match HTML design system"
```

---

## Task 9: Verify-JVTO — filter chip order

**File:** `src/components/website/VerifyProofGrid.tsx`

**Gap fixed:** #31 filter chip order different from HTML design system. HTML order: Legal, Press, History, Safety. "Reviews" category is a TSX addition (has DB entries, keep it). New order: Legal, Press, History, Safety, Reviews.

- [ ] **Step 1: Fix CATEGORIES order**

```tsx
// FIND:
const CATEGORIES = ["All", "Legal", "Safety", "Press", "History", "Reviews"] as const;

// REPLACE WITH:
const CATEGORIES = ["All", "Legal", "Press", "History", "Safety", "Reviews"] as const;
```

- [ ] **Step 2: TypeScript check + commit**

```bash
npx tsc --noEmit
git add src/components/website/VerifyProofGrid.tsx
git commit -m "fix(verify-hub): reorder filter chips to match HTML design system (Legal→Press→History→Safety→Reviews)"
```

---

## Self-Review Checklist

| Gap # | Description | Task |
|-------|-------------|------|
| #1 | TG Hub H1 wrong word | Task 1 Step 1 |
| #2 | TG Hub lede text different | Task 1 Step 2 |
| #3 | TG Hub CTA embedded not separate | Task 2 Step 2 |
| #4 | TG Hub §01 three card descriptions | Task 1 Steps 4–6 |
| #5 | TG Hub safety icon missing checkmark | Task 1 Step 4 |
| #8 | TG Hub group icon missing circle | Task 1 Step 6 |
| #7 | TG Hub §02 cards missing pin icons | Task 2 Step 1 |
| #9 | Police Escort no white card | Task 3 Step 2 |
| #10 | Police Escort H1 not italic | Task 3 Step 1 |
| #12 | FAQ H1 not italic | Task 4 Step 1 |
| #14 | Why Hub §02 score count gray→orange | Task 5 Step 1 |
| #15 | Why Hub §02 platform navy→muted | Task 5 Step 1 |
| #16 | Why Hub §04 role not lime | Task 6 Step 6 |
| #17 | Why Hub §04 portrait too narrow | Task 6 Step 5 |
| #18 | Why Hub §04 eyebrow not lime | Task 6 Step 4 |
| #19 | Why Hub §01/03 lede sentences dropped | Task 6 Steps 2–3 |
| #20 | Why Hub H1 not-italic | Task 6 Step 1 |
| #22 | Our Story typo Reisefüher | Task 7 Step 2 |
| #23 | Our Story lede font-semibold | Task 7 Step 1 |
| #27 | Why-JVTO sidebar nav labels × 5 files | Task 8 |
| #31 | Verify filter chip order | Task 9 |

**Deferred (MEDIUM, no HTML spec conflict, or structural complexity):**
- #6 TG Hub floating badge position (requires figure restructure — `overflow-hidden` conflict)
- #11 TG Hub reading time hero meta (minor)
- #13 Interior pages ul/ol → arrow markers (intentional UX upgrade, low priority)
- #21 Why Hub floating badge position (same overflow-hidden issue as #6)
- #24 Our Story evidence chain column ratio (visual minor)
- #25 Our Team H1 "not-italic" treatment
- #26 Our Team crew photo aspect ratio 4/3
- #28 H1 italic+orange inconsistency across TSX (systemic — risk of regression on deferred)
- #29 Max-width inconsistency (reviews max-w-6xl vs 7xl)
- #32 Policy "On this page" anchor nav (requires per-page structural work)
- #33 Policy H1 italic from CMS (requires CMS-side or render-side fix)
- #34 Policy version badge
- #36 Verify SHA-256 count mismatch (intentional: TSX has more press hashes)
