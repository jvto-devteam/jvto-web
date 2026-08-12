# AEO/GEO Pilar 3 Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close 6 concrete gaps found during a same-session audit of the JVTO codebase against the owner's "Pilar 3" AEO/GEO architecture recommendation document, without touching visual design, DB schema, pricing/booking, or pushing/deploying anything.

**Architecture:** Each task is an independent, mechanical fix to a specific already-identified gap: (1) a CI-safe drift-detector script comparing three existing parallel fact sources, (2) unhiding client-component text from initial SSR HTML, (3) a new optional content-schema field + backfill script + schema/JSON-LD surfacing, (4) two additions to existing crawler-policy files, (5) one new best-effort step in an existing GitHub Actions workflow, (6) compile-time schema.org type-checking for the hand-authored JSON-LD builder files, using the `schema-dts` package (types only, zero runtime/bundle cost). No new page, no new visual component, no new database table.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Zod (`src/lib/static-content/schemas.ts`), `schema-dts` (new dev-time type-only dependency, Task 6), plain Node.js scripts, GitHub Actions YAML.

## Global Constraints

- Work directly on the `live` branch in the main checkout `/Users/macbook/Code/jvto-web` — do **not** create a new git worktree for this plan. Every other phase of related work this session (travel-guide, policy, why-jvto, this repo's crew-review feature) was done directly on this same checkout/branch.
- Nothing gets pushed to `origin/live` or deployed as part of this plan. Every task ends in a **local commit only**. Do not run `git push`, do not trigger `.github/workflows/deploy.yml`, do not SSH into the production VPS. If a task's own verification needs a live example (e.g. curling the IndexNow endpoint), curl the **local dev server** (`npm run dev`, `http://localhost:3000`), never the production domain.
- No changes to Prisma schema, pricing, booking flow, or any DB table.
- No new npm dependencies except `schema-dts` in Task 6 (a `devDependencies`-only, types-only package — it contributes zero runtime code and zero production bundle size; verify this by checking its `package.json` has no `main`/`exports` pointing at runtime JS, only `.d.ts` files, before installing). No other new dependencies — prefer built-in `fetch`/`fs`/`node:*`.
- No visual/design changes. Task 2 (WhyJvtoInteractive) must preserve the exact current look-and-feel and click interaction; it only changes what is present in the initial server-rendered HTML.
- Every "current state" fact below was verified directly against the real files earlier this session. Files can move — re-read each file before editing it — but you should not need to re-derive the overall architecture from scratch.
- Run `npx tsc --noEmit` after every task and confirm no **new** errors versus this repo's known baseline: as of this plan, that baseline is 2 pre-existing errors in `src/components/website/Home/GoogleReviewsCarousel.tsx` (a `PublicReviewMediaItem` type mismatch, unrelated to this plan) plus a handful of stale `.next/types/validator.ts` entries referencing routes deleted earlier this session (`team/[slug]`, `team/page`, etc. — these are build-cache artifacts, not real errors, and clear on the next `npm run dev`/`npm run build`).

---

### Task 1: Crawler policy — add OAI-SearchBot + preview/staging noindex header

**Background (verified this session):**

`src/app/robots.ts` already allows a long, comprehensive list of AI/search crawlers (GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web, Claude-User, Claude-SearchBot, PerplexityBot, YouBot, Google-Extended, Google-CloudVertexBot, Googlebot, Bingbot, Slurp, DuckDuckBot, Diffbot, Bytespider, Omgilibot, FacebookBot, cohere-ai, MistralAI-User, xAI-Bot, Applebot, Applebot-Extended) but is **missing `OAI-SearchBot`** — OpenAI's real-time ChatGPT-search crawler, distinct from the training-only `GPTBot`/`ChatGPT-User` entries already present.

Separately, `src/app/(website)/layout.tsx` hardcodes:
```ts
robots: {
  index: true,
  follow: true,
  "max-video-preview": -1,
  "max-image-preview": "large",
  "max-snippet": -1,
```
with **no conditional logic** — every deployment of this app (including any preview/staging box) is told to index. `src/lib/static-content/staticRouteMetadata.ts`'s own comment history (from earlier porting work this session) references a "help.javavolcano-touroperator.com" preview box existing in production's real DNS setup, distinct from the canonical `javavolcano-touroperator.com` domain — confirmed this is the actual preview-vs-production signal available in this deployment (this app runs on a self-managed VPS via PM2, not Vercel, so `process.env.VERCEL_ENV` is **not** a usable signal here — do not use it). There is **no existing `isIndexableDeployment()` function or equivalent** anywhere in the codebase (verified via repo-wide grep) — you are building this from scratch, not extending something that already exists.

`src/middleware.ts` already has a working `NextResponse`-based pattern for setting response headers/redirects (see its existing `redirectMap` handling and `trackVisit()` calls near the end of the `middleware()` function) — follow that same style.

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/middleware.ts`

**Interfaces:**
- Produces: no new exports; this task only adds a rule entry and a response-header side effect.

- [ ] **Step 1: Add the missing crawler rule**

In `src/app/robots.ts`, inside the `rules` array, add a new entry. Find the existing OpenAI-related entries:
```ts
      // OpenAI
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
```
Change it to:
```ts
      // OpenAI
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
```

- [ ] **Step 2: Verify the robots route still compiles and serves the new rule**

Run: `npx tsc --noEmit 2>&1 | grep -i "robots.ts"`
Expected: no output (no errors).

Start the dev server (`npm run dev` in the background, wait for it to report ready on port 3000) and run:
```bash
curl -s http://localhost:3000/robots.txt | grep -A1 "OAI-SearchBot"
```
Expected output includes:
```
User-Agent: OAI-SearchBot
Allow: /
```
Stop the dev server after confirming (`pkill -f "next dev"`).

- [ ] **Step 3: Add a noindex header for any non-production hostname**

Read `src/middleware.ts` in full first — note where the `redirectMap` lookup and final `NextResponse.next()` happen (near the bottom of the `middleware()` function, right before `return res` on the fallthrough path), and note the exact shape of the `trackVisit(req, res)` calls used throughout so your new code matches that pattern.

Add a constant near the top of the file (after existing imports/constants, before the `middleware` function):
```ts
const PRODUCTION_HOSTNAMES = new Set([
  "javavolcano-touroperator.com",
  "www.javavolcano-touroperator.com",
]);

function isProductionHostname(hostname: string): boolean {
  return PRODUCTION_HOSTNAMES.has(hostname.toLowerCase());
}
```

Then, as the **first** check inside the `middleware()` function (before any redirect-map logic runs, so it applies to every response including 404s and redirects), add:
```ts
  const hostname = req.nextUrl.hostname;
  const isNonProduction = !isProductionHostname(hostname);
```

Then, at the fallthrough path where the existing code does:
```ts
  const res = NextResponse.next();
  trackVisit(req, res);
  return res;
```
change it to:
```ts
  const res = NextResponse.next();
  if (isNonProduction) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  trackVisit(req, res);
  return res;
```

Also apply the same header-set to the two other `NextResponse.redirect(...)` return paths already in the file (the `redirectMap` 301 path and the `/faq`, `/packages`/`/tours/style` prefix-redirect paths) — a non-production redirect response should also carry the noindex header, since redirects are still crawlable responses. For each of those three existing blocks, insert the same `if (isNonProduction) { res.headers.set(...) }` line right after `const res = NextResponse.redirect(...)` and before `trackVisit(req, res)`.

- [ ] **Step 4: Verify the header is absent on localhost (expected: localhost is non-production, so header SHOULD be present) and confirm the logic**

Run: `npx tsc --noEmit 2>&1 | grep -i "middleware.ts"`
Expected: no output.

Start the dev server and run:
```bash
curl -s -D - -o /dev/null http://localhost:3000/ | grep -i "x-robots-tag"
```
Expected: `x-robots-tag: noindex, nofollow` (localhost's hostname is `localhost`, which is correctly NOT in `PRODUCTION_HOSTNAMES`, so this proves the non-production path fires — this is the expected/correct behavior for local dev, not a bug). Stop the dev server after confirming.

Do **not** attempt to verify the production-domain (no-header) branch by hitting the live site — that is out of scope and the site's current infrastructure state is unrelated to this task. The `isProductionHostname()` string-equality check is simple enough that code review is sufficient for that branch.

- [ ] **Step 5: Commit**

```bash
git add src/app/robots.ts src/middleware.ts
git commit -m "feat(seo): allow OAI-SearchBot, noindex non-production hostnames"
```

---

### Task 2: Unhide WhyJvtoInteractive content from initial HTML

**Background (verified this session):**

`src/components/website/WhyJvtoInteractive.tsx` is a `"use client"` file exporting 4 components used only on the `/why-jvto` hub page (`src/app/(website)/why-jvto/page.tsx`, rebuilt earlier this session to restore the pre-port live visual design):

1. `DiffChipsPanel` — `DIFF_DATA` is a 6-item array (`num`, `label`, `title`, `text`, `proof`). Renders 6 filter-chip buttons plus ONE content card showing only `DIFF_DATA[active]` (`useState(0)`). The other 5 items' `title`/`text`/`proof` are never in the DOM until clicked.
2. `QuoteRotator` — `QUOTES` is a 5-item array of `[quoteText, attribution]` tuples. Renders ONE quote at a time (auto-rotates via `setInterval` + fades), the other 4 quotes' text is never in the DOM.
3. `StandardsAccordion` — `STANDARDS_DATA` is a 4-item array (`q`, `a`). Renders 4 question buttons; each answer `<div>` only renders (`{open === i && (...)}`) when that item is the currently-open one (`useState<number | null>(null)`, starts closed). All 4 answers are absent from the DOM until their question is clicked.
4. `StoryTabsPanel` — `STORY_TABS_DATA` is a 3-item array (`year`, `label`, `title`, `text`). Renders 3 tab buttons plus ONE content panel for `STORY_TABS_DATA[active]` (`useState(0)`). The other 2 tabs' `title`/`text` are never in the DOM until clicked.

This means an AI/search crawler reading the raw server-rendered HTML of `/why-jvto` only ever sees 1 of 6 diff items, 1 of 5 quotes, 0 of 4 standards answers, and 1 of 3 story tabs — the rest requires JavaScript execution + a click, which most crawlers do not do. The full text for the diff items exists, fully server-rendered, on `/why-jvto/the-jvto-difference` (rebuilt this session from `content/pages/why-jvto/the-jvto-difference.json`); the story tabs' facts exist on `/why-jvto/our-story` (from `content/pages/why-jvto/our-story.json`); the standards answers map to `/why-jvto/community-standards` (from `content/pages/why-jvto/community-standards.json`); the reviews quotes map to `/why-jvto/reviews`. So this is a hub-page-only surfacing gap, not a content-loss gap — but the hub page itself should not rely on a subpage to carry facts a crawler landing directly on `/why-jvto` cannot see.

**The fix:** render every item's full text unconditionally into the DOM. The click interaction still changes which item is *visually emphasized* — do this with CSS (`hidden` utility class toggled by a data attribute, or absolute-positioning all panels and toggling `opacity`/`z-index`, or simplest: render every panel every time but only unhide the active one via inline `style={{ display: i === active ? 'block' : 'none' }}` — **`display: none` content is still parsed into the DOM and is standard/accepted practice for crawlers that render HTML/CSS** (unlike content that's never rendered until a click handler runs), which is the distinction this task must achieve. Do not use `visibility: hidden` combined with zero height/overflow tricks that some crawlers' heuristics penalize — plain `display: none` on an element that already contains the real text is the standard, safe pattern here.

**Files:**
- Modify: `src/components/website/WhyJvtoInteractive.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: same 4 export names (`DiffChipsPanel`, `QuoteRotator`, `StandardsAccordion`, `StoryTabsPanel`), same call signature (all four are called with no props from `src/app/(website)/why-jvto/page.tsx` — do not change their prop signatures, since that file is out of this task's scope to modify).

- [ ] **Step 1: Rewrite `DiffChipsPanel` to render all 6 panels, showing only the active one**

Replace the current single-card render:
```tsx
      <div className="bg-[#F6F5F2] rounded-[16px] p-5 mb-5">
        <h4
          className="font-black text-jvto-navy text-[16px] mb-2 leading-snug"
          style={{ fontFamily: "Raleway, Inter, sans-serif" }}
        >
          {d.title}
        </h4>
        <p className="text-[13px] text-[#6b7280] font-light leading-relaxed mb-3">{d.text}</p>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-jvto-orange">
          Proof · {d.proof}
        </span>
      </div>
```
with one card per item, all rendered, only the active one visible:
```tsx
      {DIFF_DATA.map((item, i) => (
        <div
          key={item.num}
          className="bg-[#F6F5F2] rounded-[16px] p-5 mb-5"
          style={{ display: i === active ? "block" : "none" }}
        >
          <h4
            className="font-black text-jvto-navy text-[16px] mb-2 leading-snug"
            style={{ fontFamily: "Raleway, Inter, sans-serif" }}
          >
            {item.title}
          </h4>
          <p className="text-[13px] text-[#6b7280] font-light leading-relaxed mb-3">{item.text}</p>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-jvto-orange">
            Proof · {item.proof}
          </span>
        </div>
      ))}
```
Remove the now-unused `const d = DIFF_DATA[active];` line (replaced by the `.map` above).

- [ ] **Step 2: Rewrite `QuoteRotator` to render all 5 quotes, showing only the active one**

Replace:
```tsx
  const [text, who] = QUOTES[active];

  return (
    <div className="bg-jvto-navy rounded-[16px] p-5 mb-5 relative overflow-hidden">
      <div className="text-white/20 text-[48px] font-black leading-none mb-1 select-none" aria-hidden="true">&ldquo;</div>
      <p
        className="text-white text-[14px] font-light leading-relaxed italic mb-3 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {text}
      </p>
      <footer
        className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-orange transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {who}
      </footer>
```
with:
```tsx
  return (
    <div className="bg-jvto-navy rounded-[16px] p-5 mb-5 relative overflow-hidden">
      <div className="text-white/20 text-[48px] font-black leading-none mb-1 select-none" aria-hidden="true">&ldquo;</div>
      {QUOTES.map(([text, who], i) => (
        <div
          key={who}
          style={{
            display: i === active ? "block" : "none",
            opacity: i === active && visible ? 1 : i === active ? 0 : undefined,
          }}
        >
          <p className="text-white text-[14px] font-light leading-relaxed italic mb-3 transition-opacity duration-300">
            {text}
          </p>
          <footer className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-orange transition-opacity duration-300">
            {who}
          </footer>
        </div>
      ))}
```
Note the fade-on-rotate behavior (`visible` state) is preserved only for the currently-active quote's opacity transition; inactive quotes are just `display: none` (no fade needed since they're not shown).

- [ ] **Step 3: Rewrite `StandardsAccordion` to render all 4 answers, collapsing height instead of removing from DOM**

Replace:
```tsx
          {open === i && (
            <div className="px-5 pb-5 pl-[52px]">
              <p className="text-[13px] text-[#6b7280] font-light leading-relaxed">{a}</p>
            </div>
          )}
```
with:
```tsx
          <div
            className="px-5 pl-[52px]"
            style={{
              maxHeight: open === i ? "200px" : "0px",
              paddingBottom: open === i ? "1.25rem" : "0px",
              overflow: "hidden",
              transition: "max-height 0.2s ease, padding-bottom 0.2s ease",
            }}
          >
            <p className="text-[13px] text-[#6b7280] font-light leading-relaxed">{a}</p>
          </div>
```
This keeps every answer's `<p>{a}</p>` text permanently in the DOM (crawlable) while still visually collapsing/expanding on click via `max-height`, matching the existing accordion's chevron-rotate animation style already in the file (`transition-transform duration-200` on the chevron icon).

- [ ] **Step 4: Rewrite `StoryTabsPanel` to render all 3 tab panels, showing only the active one**

Replace:
```tsx
  const tab = STORY_TABS_DATA[active];

  return (
    <>
      <div className="flex gap-2 mb-5">
        {STORY_TABS_DATA.map((t, i) => (
          <button
            key={t.year}
            onClick={() => setActive(i)}
            className={`px-3.5 py-2 rounded-full text-center min-w-[72px] transition-colors cursor-pointer ${
              i === active ? "bg-jvto-orange text-white" : "bg-white/10 text-white/50 hover:text-white/70"
            }`}
          >
            <div className="font-black text-[13px] leading-tight">{t.year}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] opacity-80">{t.label}</div>
          </button>
        ))}
      </div>
      <div className="bg-white/[0.06] rounded-[14px] p-5">
        <h4
          className="font-black text-white text-[15px] mb-2"
          style={{ fontFamily: "Raleway, Inter, sans-serif" }}
        >
          {tab.title}
        </h4>
        <p className="text-white/65 text-[13px] leading-relaxed">{tab.text}</p>
      </div>
    </>
  );
```
with:
```tsx
  return (
    <>
      <div className="flex gap-2 mb-5">
        {STORY_TABS_DATA.map((t, i) => (
          <button
            key={t.year}
            onClick={() => setActive(i)}
            className={`px-3.5 py-2 rounded-full text-center min-w-[72px] transition-colors cursor-pointer ${
              i === active ? "bg-jvto-orange text-white" : "bg-white/10 text-white/50 hover:text-white/70"
            }`}
          >
            <div className="font-black text-[13px] leading-tight">{t.year}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] opacity-80">{t.label}</div>
          </button>
        ))}
      </div>
      {STORY_TABS_DATA.map((t, i) => (
        <div
          key={t.year}
          className="bg-white/[0.06] rounded-[14px] p-5"
          style={{ display: i === active ? "block" : "none" }}
        >
          <h4
            className="font-black text-white text-[15px] mb-2"
            style={{ fontFamily: "Raleway, Inter, sans-serif" }}
          >
            {t.title}
          </h4>
          <p className="text-white/65 text-[13px] leading-relaxed">{t.text}</p>
        </div>
      ))}
    </>
  );
```

- [ ] **Step 5: Verify types**

Run: `npx tsc --noEmit 2>&1 | grep -i "WhyJvtoInteractive"`
Expected: no output.

- [ ] **Step 6: Verify all 4 panels' full text is now in the server-rendered HTML**

Start the dev server, then:
```bash
curl -s http://localhost:3000/why-jvto -o /tmp/hub-check.html
# DiffChipsPanel: all 6 titles present (not just item 01's)
grep -c "Police-Led Safety Authority\|100% Private Tours\|All-Inclusive Clarity\|Ijen Health-Screening\|Verifiable Licenses\|Plan B Framework" /tmp/hub-check.html
# expect: 6 (one match per title, each appearing once)

# QuoteRotator: all 5 attributions present
grep -c "John Joyce\|Karthika TS\|Wing Shan Lui\|Jiang Tianjian\|Divya_Stri" /tmp/hub-check.html
# expect: 5

# StandardsAccordion: all 4 answers present
grep -c "dedicated vehicle, driver, and guide for your group alone\|E-Voucher is the binding document\|Blue Fire depends on weather\|named, registered team member recruited" /tmp/hub-check.html
# expect: 4

# StoryTabsPanel: all 3 story titles present
grep -c "The Guesthouse\|PT Java Volcano Rendezvous\|TDUP Formalization" /tmp/hub-check.html
# expect: 3
```
If any count is lower than expected, the corresponding component still has content that's not unconditionally rendered — re-check that step. Stop the dev server after confirming (`pkill -f "next dev"`).

- [ ] **Step 7: Commit**

```bash
git add src/components/website/WhyJvtoInteractive.tsx
git commit -m "fix(why-jvto): render full interactive-panel text into initial HTML"
```

---

### Task 3: E-E-A-T provenance — add `reviewedBy` to content schema + backfill + surface it

**Background (verified this session):**

`src/lib/static-content/schemas.ts`'s `PageMetaSchema` (lines 81-100) currently has: `route`, `title`, `browserTitle` (optional), `description`, `section`, `status`, `owner`, `lastReviewed`, `schemaTypes`, `faqKey` (optional), `summary`, plus blog-only optional fields (`publishedDate`, `tags`, `bannerImage`, `readingTimeMin`). There is **no field naming who reviewed/verified the content** — only `lastReviewed` (a date) and `owner` (a role string like `"operations"`/`"editorial"`/`"company"`, not a person's name).

There are exactly 32 content files under `content/pages/` today: 22 in `content/pages/travel-guide/`, 4 in `content/pages/policy/`, 6 in `content/pages/why-jvto/`. Both `.md` (YAML frontmatter between `---` fences) and `.json` (a top-level `meta` object) formats exist — both must be backfilled.

`src/components/seo/PageJsonLdCombined.tsx` is the shared schema-injection component used by every `(website)/*` page (per this repo's own CLAUDE.md: "the standard schema injection component for all (website)/* pages... auto-injects: Organization + WebSite + WebPage + BreadcrumbList"). The WebPage node it builds is the natural place to add `reviewedBy`.

**The fix, in order:**
1. Add optional `reviewedBy: z.string().min(1).optional()` to `PageMetaSchema`.
2. Write and run a one-off backfill script that adds `"reviewedBy": "JVTO Editorial"` to every content file's meta block (`.json` files) or frontmatter (`.md` files) that doesn't already have one. Use the uniform value `"JVTO Editorial"` for every file — do **not** invent per-page claims like "reviewed by Agung Sambuko" for safety/legal pages unless you find explicit prior evidence that a specific named person reviews that specific page (you won't; there is none in this codebase). Flag this exact wording choice in your task report as an item for the owner to confirm/override later — it is a deliberately conservative, defensible default, not a claim to treat as final.
3. Surface `reviewedBy` in `PageJsonLdCombined.tsx`'s WebPage schema node as `reviewedBy: { "@type": "Organization", name: pageRow.content?.reviewedBy ?? ... }` — read the file first to find the exact WebPage node construction and match its existing style (it likely reads other fields off `pageRow`/`content` similarly; do not invent a new prop-passing pattern if `pageRow.content` already carries meta-derived fields into this component).

**Files:**
- Modify: `src/lib/static-content/schemas.ts`
- Create: `scripts/backfill-reviewed-by.mjs` (temporary one-off script; keep it in the repo after running it — do not delete it, in case it needs re-running for future new content files)
- Modify: all 32 files under `content/pages/**/*.{md,json}` (via the script, not by hand)
- Modify: `src/components/seo/PageJsonLdCombined.tsx`

**Interfaces:**
- Produces: `PageMeta.reviewedBy?: string` (consumed by any future task rendering content metadata; not consumed by Task 1/2/4/5).

- [ ] **Step 1: Add the schema field**

In `src/lib/static-content/schemas.ts`, in `PageMetaSchema`, add the new field right after `lastReviewed`:
```ts
  lastReviewed: IsoDateSchema,
  /** Who/what reviewed this content for accuracy — E-E-A-T provenance signal.
   *  A person's name + role, or an editorial-team label. Optional so
   *  pre-existing content isn't invalidated; new content should set it. */
  reviewedBy: z.string().min(1).optional(),
  schemaTypes: z.array(SchemaTypeSchema).min(1).default(["WebPage"]),
```

- [ ] **Step 2: Verify the schema change compiles**

Run: `npx tsc --noEmit 2>&1 | grep -i "static-content/schemas.ts"`
Expected: no output.

- [ ] **Step 3: Write the backfill script**

Create `scripts/backfill-reviewed-by.mjs`:
```js
#!/usr/bin/env node
// One-off (re-runnable) backfill: adds `reviewedBy: "JVTO Editorial"` to every
// content/pages/**/*.{md,json} file's meta block that doesn't already have one.
// Safe to re-run — it's a no-op for files that already carry the field.
import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import path from "node:path";

// Simple recursive glob (no new dependency): walk content/pages for .md/.json files.
import { readdirSync, statSync } from "node:fs";

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out = out.concat(walk(full));
    else if (entry.endsWith(".md") || entry.endsWith(".json")) out.push(full);
  }
  return out;
}

const files = walk(path.join(process.cwd(), "content", "pages"));
let changed = 0;

for (const file of files) {
  const raw = readFileSync(file, "utf8");

  if (file.endsWith(".json")) {
    const data = JSON.parse(raw);
    if (!data.meta) {
      console.warn(`SKIP (no meta object): ${file}`);
      continue;
    }
    if (data.meta.reviewedBy) continue; // already set
    data.meta.reviewedBy = "JVTO Editorial";
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
    changed++;
    console.log(`updated: ${file}`);
  } else {
    // .md frontmatter — insert reviewedBy right after the lastReviewed line.
    if (/^reviewedBy:/m.test(raw)) continue; // already set
    if (!/^lastReviewed:.*$/m.test(raw)) {
      console.warn(`SKIP (no lastReviewed line found): ${file}`);
      continue;
    }
    const updated = raw.replace(
      /^(lastReviewed:.*)$/m,
      `$1\nreviewedBy: 'JVTO Editorial'`,
    );
    writeFileSync(file, updated);
    changed++;
    console.log(`updated: ${file}`);
  }
}

console.log(`\nDone. ${changed} file(s) updated, ${files.length} scanned.`);
```

- [ ] **Step 4: Run the backfill script**

Run: `node scripts/backfill-reviewed-by.mjs`

Expected: a line per updated file, ending with `Done. N file(s) updated, 32 scanned.` where N should be 32 (assuming none of the 32 files already had `reviewedBy` — verify this assumption is true by checking the count in the output; if N is less than 32, some files already had the field or were skipped with a SKIP warning — read those warnings and resolve them before proceeding, e.g. a `.json` file with a differently-shaped meta object needs its own look).

- [ ] **Step 5: Spot-check 3 files across the 3 clusters**

```bash
grep -A1 "lastReviewed" content/pages/why-jvto/our-story.json | head -3
grep "reviewedBy" content/pages/policy/privacy.md
grep -A1 "lastReviewed" content/pages/travel-guide/booking-safety.md
```
Expected: each shows `"reviewedBy": "JVTO Editorial"` (json) or `reviewedBy: 'JVTO Editorial'` (frontmatter) present.

- [ ] **Step 6: Confirm the static-content loader still validates all files against the updated schema**

Run this Node script (proves every content file still round-trips through `loadStaticPage`/`listPublishedStaticPages` without a Zod validation error, now that a new optional field is present in every file):
```bash
node -e "
const { listPublishedStaticPages } = require('./src/lib/static-content');
" 2>&1 | head -20
```
If this fails because the module is ESM/TS and can't be required directly, instead verify via the dev server:
```bash
npm run dev &
sleep 8
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/why-jvto/our-story
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/travel-guide/booking-safety
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/policy/privacy
pkill -f "next dev"
```
Expected: `200` for all three (or `200`/`404` matching each route's actual `status: draft|published` — `booking-safety.md` is `status: draft` so it should legitimately 404; if so this is correct behavior, not a regression — just confirm the OTHER two are 200 and the build/dev server didn't crash on a Zod validation error from the new field).

- [ ] **Step 7: Surface `reviewedBy` in PageJsonLdCombined's WebPage schema**

Read `src/components/seo/PageJsonLdCombined.tsx` in full first. Find where it builds the `WebPage` JSON-LD node (look for `'@type': 'WebPage'`). Add a `reviewedBy` field to that node, sourced from wherever the component already reads page metadata (likely `pageRow.content?.h1` or similar patterns nearby will show you the exact field-access style already used — match it). The value should be:
```ts
reviewedBy: { '@type': 'Organization', name: 'JVTO Editorial' },
```
if the component does not already have a live per-page `reviewedBy` value threaded through as a prop (it likely doesn't yet, since this is a new field) — in that case, hardcoding the organization-level default here is correct and matches the backfill default from Step 3. If, on reading the file, you find `PageJsonLdCombined` already accepts `pageRow.content` as an object that could carry a `reviewedBy` string per-page (check what shape `content` objects passed into this component actually have across a few call sites, e.g. `src/app/(website)/why-jvto/our-story/page.tsx`'s `pageRow.content` object), prefer wiring the real per-page value through instead of hardcoding — but do not invent a new prop if the existing `content` bag doesn't already flow through; hardcoding the default is an acceptable, simple correct outcome for this task if per-page wiring would require touching many page files (out of scope — this task modifies only `PageJsonLdCombined.tsx`, not every page that calls it).

- [ ] **Step 8: Verify the JSON-LD change**

Run: `npx tsc --noEmit 2>&1 | grep -i "PageJsonLdCombined"`
Expected: no output.

Start the dev server and confirm the new field appears in a real page's JSON-LD:
```bash
curl -s http://localhost:3000/why-jvto/our-story | grep -o '"reviewedBy":{[^}]*}' | head -1
```
Expected: `"reviewedBy":{"@type":"Organization","name":"JVTO Editorial"}` (or your chosen equivalent value — must be present, not absent). Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add src/lib/static-content/schemas.ts scripts/backfill-reviewed-by.mjs content/pages src/components/seo/PageJsonLdCombined.tsx
git commit -m "feat(seo): add reviewedBy provenance field to content schema, backfill, surface in JSON-LD"
```

In your task report, explicitly flag: **"reviewedBy" was backfilled uniformly as "JVTO Editorial" across all 32 content files — this is a deliberately conservative default (not an invented per-page claim); the owner may want specific safety/legal pages (e.g. ijen-health-screening, booking-payment-cancellation) attributed to a named reviewer (e.g. the founder or a specific credentialed person) instead — flagging for their decision, not auto-applied.**

---

### Task 4: Zero-Discrepancy Fact Graph — drift-check script across `content/`, `trust-bundle/`, and the DB-driven organization profile

**Background (verified this session):**

**Three** independent, parallel "fact" sources exist in this repo with **no cross-check between any of them today** (a same-session follow-up investigation found the third source after this task was originally scoped as only two — see the discovery notes below):

1. `content/` (git-owned, ported into this branch earlier this session) — feeds travel-guide/policy/why-jvto page bodies via `src/lib/static-content/loadStaticPage()`.
2. `src/data/trust-bundle/` — synced from an **external** `llm-wiki` source via `npm run sync:trust` (per the header comment in `src/lib/llms-txt.ts`: `"Source of truth: src/data/trust-bundle/ ... synced from llm-wiki via \`npm run sync:trust\`. Do NOT hand-edit /llms.txt"`). This feeds **only** `/llms.txt` via `src/app/llms.txt/route.ts` → `buildLlmsTxt()` in `src/lib/llms-txt.ts`, which reads `trustClaims`, `trustAeoSnippets`, `trustManifest`, `organizationSchema` from `@/lib/trust-bundle` (`src/lib/trust-bundle.ts`, which in turn reads raw JSON from `src/data/trust-bundle/_manifest.json`, `claims.json`, `aeo-snippets.json`, `faq.json`, and `schema/organization.json`/`schema/tourist-trip.json`/`schema/faq-page.json`).
3. **A DB-driven organization profile** — discovered while comparing `entityGraph.ts`'s own header comment against what's actually wired up today. `entityGraph.ts` says: `"Live's Organization schema is DB-driven via getOrganizationProfile() + buildOrganizationJsonLd(); we DO NOT re-export ORGANIZATION_SCHEMA here... ORGANIZATION_SCHEMA in this file is the rewrite's hardcoded version, kept as fallback / reference."` Verified this is still true: `src/components/seo/PageJsonLdCombined.tsx` (the shared schema-injection component used across nearly every `(website)/*` page) imports `getOrganizationProfile` from `src/lib/content/getOrganizationProfile.ts` (a `unstable_cache`-wrapped call to `getPublicOrganizationProfile()` in `src/lib/publicContent/getPublicOrganizationProfile.ts`, which does `prisma.organization_profile.findFirst(...)` — a **real DB table**), and `buildOrganizationJsonLd` from `src/lib/seo/jsonld/builders.ts`. So the org facts (NIB, legal name, founder) that most pages actually emit in their JSON-LD come from this DB table, **not** from `entityGraph.ts`'s `ORGANIZATION_SCHEMA` constant — that constant is confirmed used **only** by `src/lib/schemas/buildHomepageSchemas.ts` (verified via repo-wide grep — it is the only importer). So there are, today, potentially three different "NIB"/"founder name"/"legal name" values in play depending on which page you look at: the homepage (entityGraph.ts), `/llms.txt` (trust-bundle), and every other page (the DB table).

Confirmed facts that exist in **content/ and trust-bundle** today, verified directly:
- **NIB number**: `trust-bundle/schema/organization.json` → `identifier[0].value` = `"1102230032918"`. `src/lib/schemas/entityGraph.ts`'s `ORGANIZATION_SCHEMA.taxID` = `'1102230032918'` (same value, different field name — `taxID` vs `identifier[].value` with `propertyID: "NIB"` — this is fine, they agree on the actual number, just represented differently, which this task's check must account for by comparing normalized VALUES, not exact JSON shape).
- **Founder name**: `trust-bundle/schema/organization.json` → `founder.name` = `"Agung Sambuko"`. `entityGraph.ts`'s `FOUNDER_SCHEMA.name` = `'Agung Sambuko'` (also matches).
- **A likely pre-existing data quality issue you will find and must NOT silently "fix":** `trust-bundle/schema/organization.json` has BOTH `identifier[0]` (NIB) and `identifier[1]` (TDUP) set to the **same value** `"1102230032918"` — NIB and TDUP are documented elsewhere in this repo's own ported content (e.g. `content/pages/why-jvto/our-story.json`'s evidence-chain section, and this session's own why-jvto work) as two **different** credentials (NIB = national business registration; TDUP = Tourism Business Permit, separately dated "issued 2023-02-11" in prior content). This looks like a copy-paste error in the external trust-bundle sync, not a real fact. **Do not edit `src/data/trust-bundle/` to fix this** (it's synced from an external system per its own header comment — hand-editing it would be overwritten by the next `npm run sync:trust` and violates its own "Do NOT hand-edit" convention, which extends to its raw JSON sources by the same logic). Instead, your drift-check script (below) should flag this exact TDUP/NIB collision as a warning in its output, and you should mention it explicitly in your task report as an item for the owner to raise with whoever owns the `llm-wiki`/`jvto-ekosistem` sync pipeline.
- **9 canonical claim IDs**: `trust-bundle/claims.json` → `.claims[]` array, 9 entries, `id` field values `"C1"` through `"C9"` (verified: `C1` = "Safety-Led Operations", `C2` = "Private Tours (Execution Control)", `C3` = "All-Inclusive Clarity", and 6 more). These correspond conceptually to the `narrative_claims` DB table's C1-C9 rows referenced throughout this repo's own `CLAUDE.md` ("narrative_claims — added Phase 3 of port. 9 canonical brand claims (C1–C9)") — but that DB table is a **third**, separate system again (DB-owned, not git-owned) and is explicitly **out of scope** for this task (this task only reconciles the two **git-owned/synced file-based** sources, `content/` and `trust-bundle/`; cross-checking against the live database is a different, larger effort not requested here).

**Full unification of all three sources into one compiler is explicitly out of scope** for this plan — it would require changing the external `llm-wiki` sync pipeline (owned in the sibling `jvto-ekosistem` project, outside this repo) and/or a larger migration of the DB-driven org profile onto the content/ SSOT (a bigger architectural change than this plan covers). **In scope: a drift-detector script** that fails loudly (non-zero exit code + clear stdout message) if a small, explicit, named list of overlapping facts differs across the sources beyond normalized whitespace/case, so future drift is caught rather than silently shipped.

**The DB check must degrade gracefully, not hard-fail, when no database is reachable.** This plan is executed directly in the main checkout `/Users/macbook/Code/jvto-web` (per Global Constraints), which — per this session's own established environment notes — has a working `.env`/`.env.local` with `DATABASE_URL` and an already-generated Prisma client, so the DB check should normally run for real here. But the script must still handle the case where it doesn't (connection refused, env var missing) by printing a `WARN` and skipping that one check, exiting 0 for the rest — never let a DB-connectivity problem make this whole script unusable. Do **not** invent a fake `DATABASE_URL` and do **not** ask for production credentials if one isn't already present — this matches the standing practice used throughout this session for DB-less contexts.

**Files:**
- Create: `scripts/check-fact-drift.mjs`
- Modify: `package.json` (add an npm script entry, e.g. `"check:fact-drift": "node scripts/check-fact-drift.mjs"` — do **not** wire it into `npm run build` or any existing script chain; it's a standalone check the owner can run manually or later decide to add to CI themselves)

**Interfaces:**
- Produces: a CLI script exiting 0 (all checked facts match) or 1 (at least one mismatch), printing a human-readable report either way.

- [ ] **Step 1: Write the drift-check script**

Create `scripts/check-fact-drift.mjs`:
```js
#!/usr/bin/env node
// Detects drift between content/ (git-owned SSOT for page bodies) and
// src/data/trust-bundle/ (synced from the external llm-wiki, feeds only
// /llms.txt) for a small, named set of facts that exist in both places.
//
// This does NOT unify the two pipelines (that requires changes to the
// external llm-wiki sync, out of scope here) -- it only fails loudly when
// they disagree, so drift is caught instead of silently shipped.
import { readFileSync } from "node:fs";
import path from "node:path";

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(process.cwd(), relPath), "utf8"));
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

const org = readJson("src/data/trust-bundle/schema/organization.json");
const claims = readJson("src/data/trust-bundle/claims.json").claims;

// entityGraph.ts is TypeScript with computed values (template literals,
// constants) -- rather than executing/transpiling it here, read it as text
// and extract the specific literal values this check cares about. This is
// intentionally narrow: it only extracts values that are plain string
// literals in the current file, and will need updating if entityGraph.ts's
// literal formatting changes materially.
const entityGraphSrc = readFileSync(
  path.join(process.cwd(), "src/lib/schemas/entityGraph.ts"),
  "utf8",
);

function extractLiteral(source, fieldPattern) {
  const match = source.match(fieldPattern);
  return match ? match[1] : null;
}

const entityGraphTaxId = extractLiteral(entityGraphSrc, /taxID:\s*'([^']+)'/);
const entityGraphFounderName = (() => {
  const founderBlockMatch = entityGraphSrc.match(
    /export const FOUNDER_SCHEMA[\s\S]*?name:\s*'([^']+)'/,
  );
  return founderBlockMatch ? founderBlockMatch[1] : null;
})();

let failures = 0;
const warnings = [];

function checkFact(label, sourceAValue, sourceALabel, sourceBValue, sourceBLabel) {
  if (sourceAValue == null || sourceBValue == null) {
    warnings.push(
      `WARN  ${label}: could not extract from one or both sources (${sourceALabel}=${sourceAValue}, ${sourceBLabel}=${sourceBValue}) -- check extraction pattern, not a confirmed drift.`,
    );
    return;
  }
  if (normalize(sourceAValue) !== normalize(sourceBValue)) {
    failures++;
    console.error(
      `FAIL  ${label}: "${sourceAValue}" (${sourceALabel}) != "${sourceBValue}" (${sourceBLabel})`,
    );
  } else {
    console.log(`OK    ${label}: "${sourceAValue}" matches across both sources.`);
  }
}

const nibIdentifier = (org.identifier ?? []).find((i) => i.propertyID === "NIB");
const tdupIdentifier = (org.identifier ?? []).find((i) => i.propertyID === "TDUP");

checkFact(
  "NIB number",
  nibIdentifier?.value,
  "trust-bundle/schema/organization.json",
  entityGraphTaxId,
  "entityGraph.ts ORGANIZATION_SCHEMA.taxID",
);

checkFact(
  "Founder name",
  org.founder?.name,
  "trust-bundle/schema/organization.json",
  entityGraphFounderName,
  "entityGraph.ts FOUNDER_SCHEMA.name",
);

checkFact(
  "Organization legal name",
  org.legalName,
  "trust-bundle/schema/organization.json",
  extractLiteral(entityGraphSrc, /legalName:\s*'([^']+)'/),
  "entityGraph.ts ORGANIZATION_SCHEMA.legalName",
);

// Known pre-existing data-quality issue: NIB and TDUP should NOT share a
// value (they are different credentials). Flag it as a warning, not a
// failure -- fixing it means editing the externally-synced trust-bundle,
// which is out of scope here; this just makes sure nobody misses it.
if (nibIdentifier?.value && tdupIdentifier?.value && nibIdentifier.value === tdupIdentifier.value) {
  warnings.push(
    `WARN  trust-bundle/schema/organization.json: NIB and TDUP identifiers share the same value ("${nibIdentifier.value}") -- these are documented elsewhere in this repo as different credentials. Likely a data error in the external llm-wiki sync. Raise with the trust-bundle/llm-wiki owner; do not hand-edit this file to fix it.`,
  );
}

console.log(`\n${claims.length} canonical claims found in trust-bundle/claims.json (C1-C${claims.length}).`);

// ---- Third source: the DB-driven organization profile (Prisma) ----
// Gracefully skipped (WARN, not FAIL) if no DB connection is available --
// see the task's own note on why this must never hard-fail the whole script.
async function checkDbSource() {
  let getPublicOrganizationProfile;
  try {
    ({ getPublicOrganizationProfile } = await import(
      "../src/lib/publicContent/getPublicOrganizationProfile.ts"
    ));
  } catch (e) {
    warnings.push(
      `WARN  DB source: could not import getPublicOrganizationProfile.ts (${e.message}). Skipping DB-vs-file comparison. This file is TypeScript -- if this import fails specifically because Node can't load .ts directly, re-run this script with a TS loader (e.g. \`node --import tsx scripts/check-fact-drift.mjs\`, if the tsx package used elsewhere in this repo's scripts is available) instead of treating this as a real drift-check failure.`,
    );
    return;
  }

  try {
    const dbOrg = await getPublicOrganizationProfile();
    if (!dbOrg) {
      warnings.push("WARN  DB source: getPublicOrganizationProfile() returned null/empty -- skipping DB comparison.");
      return;
    }
    // Field names on the DB row may differ from trust-bundle/entityGraph's --
    // read the actual returned shape first (console.log(dbOrg) once during
    // development) and adjust the property access below to match reality
    // rather than guessing; this plan cannot know the exact Prisma model
    // shape without a live DB connection at plan-writing time.
    checkFact(
      "NIB number (DB source)",
      dbOrg.nib ?? dbOrg.taxId ?? dbOrg.registrationNumber,
      "DB organization_profile",
      nibIdentifier?.value,
      "trust-bundle/schema/organization.json",
    );
    checkFact(
      "Founder name (DB source)",
      dbOrg.founderName ?? dbOrg.founder?.name,
      "DB organization_profile",
      org.founder?.name,
      "trust-bundle/schema/organization.json",
    );
  } catch (e) {
    warnings.push(
      `WARN  DB source: query failed (${e.message}) -- likely no DATABASE_URL / no DB reachable from this environment. Skipping DB comparison; this is expected and acceptable in a DB-less context, do not invent credentials to force it to connect.`,
    );
  }
}

await checkDbSource();

if (warnings.length) {
  console.log("\n--- Warnings (not failures) ---");
  for (const w of warnings) console.log(w);
}

if (failures > 0) {
  console.error(`\n${failures} fact-drift failure(s) found. Fix the disagreement before shipping.`);
  process.exit(1);
}

console.log("\nNo fact drift detected in the checked fields.");
process.exit(0);
```

- [ ] **Step 2: Run it and confirm today's actual state**

Run: `node scripts/check-fact-drift.mjs`

Expected: 3 `OK` lines (NIB, founder name, legal name all match between content-derived sources today, per the facts already verified above), one `WARN` about the NIB/TDUP collision, and **either** 2 more `OK`/`FAIL` lines for the DB comparison (if `DATABASE_URL` is available in this environment, which it should be per Global Constraints) **or** a `WARN` explaining why the DB check was skipped. Exit code 0 as long as there are zero `FAIL`s (warnings don't affect exit code). Confirm with: `echo $?` immediately after — expect `0`.

If the DB comparison step fails to even import `getPublicOrganizationProfile.ts` because Node can't load a `.ts` file directly (`ERR_UNKNOWN_FILE_EXTENSION` or similar), check whether this repo already has a TS-executing tool available for scripts (grep `package.json`'s `scripts` for any existing script that runs a `.ts` file directly and see what runner it uses, e.g. `tsx` or `ts-node`) and use the same one, rather than introducing a new one. If none exists and none is trivially available, it is acceptable to leave this as a documented `WARN`-only limitation for this task rather than adding a new dependency just for this — flag this exact tradeoff in your task report.

If any of the file-based checks unexpectedly shows `FAIL`, that means the source files changed since this plan was written — re-read both files, confirm the real current values, and decide whether this plan's assumptions need a note in your task report (do not just make the check pass by loosening it — a real disagreement should stay a failure).

- [ ] **Step 3: Add the npm script entry**

In `package.json`, find the `"scripts"` object and add (alphabetically near other `check`/lint-style scripts if any exist, otherwise anywhere in the object):
```json
    "check:fact-drift": "node scripts/check-fact-drift.mjs",
```

- [ ] **Step 4: Verify the npm script works**

Run: `npm run check:fact-drift`
Expected: same output as Step 2, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-fact-drift.mjs package.json
git commit -m "feat(seo): add content/trust-bundle fact-drift detector script"
```

In your task report, flag: **the NIB/TDUP identifier collision in `src/data/trust-bundle/schema/organization.json` is a likely pre-existing data error in the external llm-wiki sync — surfaced as a warning by the new script, not fixed (fixing it means hand-editing a file this repo's own convention says not to hand-edit). This task also confirmed a third parallel org-fact source exists (the DB-driven `organization_profile` table, used by `PageJsonLdCombined.tsx` across nearly every page) beyond the two originally scoped — report whatever the actual DB values turned out to be (or that the DB was unreachable and the check was skipped) so the owner has a concrete, current picture of whether all three sources agree today. Also note: this script is not wired into `npm run build` or CI — it's available to run manually (`npm run check:fact-drift`) or the owner can decide separately whether/how to add it to CI.**

---

### Task 5: Wire IndexNow into the post-deploy pipeline (best-effort, non-blocking)

**Background (verified this session):**

`src/lib/seo/indexnow.ts` exports `submitIndexNow(urls)` and `getSitemapUrls()`; `src/app/(api)/api/indexnow/route.ts` exposes `POST /api/indexnow` accepting `{ "scope": "sitemap" }` (submits every URL in the live sitemap) or `{ "urls": [...] }` (submits a specific list). Both already work today as a manual/on-demand API — this task does not change either file.

`.github/workflows/deploy.yml` (read in full this session) is the GitHub Actions workflow that runs on every push to the `live` branch, SSHs into the production VPS, and runs:
```yaml
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm use 20
            cd /var/www/jvto-web
            git fetch origin
            git checkout live
            git reset --hard origin/live
            rm -rf .next
            npm ci
            npm run build
            pm2 restart jvto-web
```
There is currently **no step after `pm2 restart jvto-web`** that calls the IndexNow endpoint. This task adds one.

**Constraint restated:** this must be retryable/best-effort and must **never** fail the deploy job — a transient IndexNow API hiccup (or the production domain being briefly unreachable right after a `pm2 restart`, as was observed during this session's own production-outage investigation) must not mark the whole deploy as failed.

**This task only edits `.github/workflows/deploy.yml` locally and commits the change. It does not push to `origin/live` and does not trigger a real deployment.** The workflow file change will only take effect the next time someone (with explicit separate authorization) pushes this commit to `origin/live`.

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: the already-existing `/api/indexnow` endpoint (no code changes to it).

- [ ] **Step 1: Read the current file in full**

Read `.github/workflows/deploy.yml` end to end before editing (it may have changed since this plan was written) — confirm the exact final lines of the SSH `script:` block still end with `pm2 restart jvto-web`.

- [ ] **Step 2: Add the IndexNow step**

Add a new step to the `deploy` job, after the existing `- name: Deploy jvto-web (production)` step (which contains the whole SSH script), as a **separate** step:
```yaml
      - name: Ping IndexNow (best-effort, non-blocking)
        continue-on-error: true
        run: |
          echo "Waiting 10s for the app to finish restarting..."
          sleep 10
          curl -sS -X POST "https://javavolcano-touroperator.com/api/indexnow" \
            -H "Content-Type: application/json" \
            -d '{"scope":"sitemap"}' \
            --max-time 30 \
            || echo "IndexNow ping failed or timed out -- non-blocking, deploy already succeeded."
```
`continue-on-error: true` at the step level ensures a non-zero exit from this step does not fail the job. The `|| echo ...` inside the shell script is a second, redundant safety net (the `curl` itself won't halt the script even without `continue-on-error`, since the `||` catches its failure) — both are intentional belt-and-suspenders, matching the "retryable best-effort" requirement precisely: even if GitHub Actions' `continue-on-error` behavior is ever changed/misconfigured, the shell-level `||` still prevents this step's exit code from being non-zero in the first place.

- [ ] **Step 3: Validate the YAML is well-formed**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "YAML valid"`
Expected: `YAML valid`. (If `python3`/`yaml` isn't available, use `npx js-yaml .github/workflows/deploy.yml > /dev/null && echo "YAML valid"` instead — either confirms the file parses.)

- [ ] **Step 4: Confirm via GitHub CLI that the workflow file, if it were to run, references the right job structure (dry read, no trigger)**

Run: `gh workflow view deploy.yml 2>&1 | head -20`
Expected: shows the workflow's current name/trigger info from GitHub's last-known copy (this reads GitHub's cached understanding of the file, it does **not** run anything). This is a sanity check that the file is still recognized as a valid workflow definition, not a functional test of your new step (that would require an actual push, which is explicitly out of scope).

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat(deploy): ping IndexNow after successful production deploy (best-effort)"
```

In your task report, state explicitly: **this commit is local only. The new IndexNow step will not run until this commit reaches `origin/live` via an explicit, separately-authorized push — do not push it as part of this task.**

---

### Task 6: Compile-time schema.org type-checking with `schema-dts` (+ HPWKI credential refinement)

**Background (verified this session):**

Every JSON-LD object in this repo's schema builders (`src/lib/schemas/entityGraph.ts`, `src/lib/schemas/buildTeamSchemas.ts`, `src/lib/schemas/buildTravelGuideSchemas.ts`, `src/lib/schemas/buildPolicySchemas.ts`, `src/lib/schemas/buildWhyJvtoSchemas.ts`, `src/lib/schemas/buildTourSchemas.ts`, `src/lib/schemas/buildToursHubSchemas.ts`, `src/lib/schemas/buildDestinationsSchemas.ts`, `src/lib/seo/jsonld/builders.ts`, and others) is a **plain, untyped TypeScript object literal** — e.g. `export const ORGANIZATION_SCHEMA = { '@context': 'https://schema.org', '@type': 'TravelAgency', ... }` has no type annotation at all. Confirmed via repo-wide search: there is no `schema-dts` (or any other schema.org type-checking) package in `package.json`, and no code-generation script produces these files — they are 100% hand-authored. This means a typo in a `'@type'` value, or using a property that schema.org doesn't actually define for that type, compiles cleanly and is only ever caught (if at all) by manually running Google's Rich Results Test after deploying.

`schema-dts` (published by Google, `npm install --save-dev schema-dts`) is the standard, officially-maintained solution: it ships **only** `.d.ts` type declaration files (zero runtime JS, so it contributes nothing to the production bundle — verify this yourself after installing by confirming its `package.json` has no non-types `main`/`exports` entry pointing at a `.js` file). It exports a type per schema.org type (`Person`, `TravelAgency`, `Organization`, `EducationalOccupationalCredential`, `TouristTrip`, etc.) plus a `WithContext<T>` wrapper type for the top-level `@context` + type combination. The exact export names and the `WithContext` wrapper's exact shape should be confirmed by reading `node_modules/schema-dts/dist/index.d.ts` (or its README) once it's installed in Step 1 below — do not guess property names from memory; verify against the actual installed package.

**Also in scope for this task (small, related fix found during the same-session audit):** `entityGraph.ts`'s `FOUNDER_SCHEMA` currently represents the HPWKI (Himpunan Pelaku Wisata Khusus Ijen) volcano-guide association membership as a `memberOf` property:
```ts
  memberOf: {
    '@type': 'Organization',
    name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
    description: 'Ijen volcano guide association supervised by BBKSDA Jawa Timur (Ministry of Environment). HPWKI members receive annual training on volcanic gas protocols and evacuation procedures.',
    sameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
  },
```
The owner has indicated HPWKI is better modeled as a **credential** (`hasCredential`, alongside the two existing police `hasCredential` entries: `SPRIN POLPAR` and `SPRIN WAL-TRAVEL`) rather than mere organizational membership, since it represents a specific certified-guide qualification, not just membership in a club. Add a third `hasCredential` entry for it — **do not remove the existing `memberOf` block**, since it's also factually true (HPWKI membership) and other code/content may reference it; this is additive, not a replacement.

**Files:**
- Modify: `package.json` (new devDependency)
- Modify: `src/lib/schemas/entityGraph.ts` (add type annotations to every exported schema constant; add the HPWKI `hasCredential` entry)
- Modify: `src/lib/schemas/buildTeamSchemas.ts`, `src/lib/schemas/buildTravelGuideSchemas.ts`, `src/lib/schemas/buildPolicySchemas.ts`, `src/lib/schemas/buildWhyJvtoSchemas.ts`, `src/lib/schemas/buildTourSchemas.ts`, `src/lib/schemas/buildToursHubSchemas.ts`, `src/lib/schemas/buildDestinationsSchemas.ts` (add return-type annotations to each exported `build*Schema()` function)

**Interfaces:**
- Produces: no new exports; every existing export keeps its name and runtime value, only gaining a compile-time type annotation.

- [ ] **Step 1: Install schema-dts**

Run: `npm install --save-dev schema-dts`

Verify it's types-only (no runtime cost): `cat node_modules/schema-dts/package.json | grep -E '"main"|"types"|"exports"'` — confirm any `"main"`/`"exports"` entries point only at `.d.ts` files (or are absent), never at a `.js` file containing real logic.

- [ ] **Step 2: Read the package's actual type exports before using them**

Run: `head -100 node_modules/schema-dts/dist/index.d.ts` (or open the file) and confirm the exact names for `WithContext`, `Person`, `TravelAgency`, `Organization`, `EducationalOccupationalCredential`, `PropertyValue`, `ImageObject`, `GovernmentOrganization`, `NewsArticle`, `Book`, `Physician`, `MedicalBusiness`, `PostalAddress`, `GeoCoordinates` — these are the types this task needs to apply across the files listed above. If any expected type name differs from what's listed here, use the real name from the package and note the correction in your task report.

- [ ] **Step 3: Add the HPWKI credential to `FOUNDER_SCHEMA`**

In `src/lib/schemas/entityGraph.ts`, find `FOUNDER_SCHEMA`'s `hasCredential` array (it currently has 2 entries: SPRIN POLPAR and SPRIN WAL-TRAVEL). Add a third entry, keeping the existing `memberOf` block untouched elsewhere in the same object:
```ts
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'HPWKI Certified Volcano Guide (Himpunan Pelaku Wisata Khusus Ijen)',
      credentialCategory: 'Professional Mountain Guiding Certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'HPWKI (Himpunan Pelaku Wisata Khusus Ijen)',
        sameAs: 'https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0',
      },
    },
```
Add this as the third item in the existing `hasCredential: [ ... ]` array (after the two SPRIN entries), matching the array's existing comma/formatting style.

- [ ] **Step 4: Type-annotate `entityGraph.ts`'s exported constants**

For each `export const X_SCHEMA = { ... }` in this file (`ORGANIZATION_SCHEMA`, `FOUNDER_SCHEMA`, `DOCTOR_SCHEMA`, and any others present — read the file to find the complete list), add an explicit type annotation using `WithContext<T>` from `schema-dts`, matching each object's actual `'@type'` value. For example:
```ts
import type { WithContext, TravelAgency, Person, Physician } from 'schema-dts';

export const ORGANIZATION_SCHEMA: WithContext<TravelAgency> = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  // ... unchanged
};

export const FOUNDER_SCHEMA: WithContext<Person> = {
  // ... unchanged
};

export const DOCTOR_SCHEMA: WithContext<Physician> = {
  // ... unchanged
};
```
Do this for every top-level exported schema constant in the file. If `tsc` reports an error on a specific existing property (meaning `schema-dts` says that property isn't valid for that type, or expects a different shape), **do not delete the property to make the error go away** — this is exactly the kind of real structural issue this task exists to surface. Instead, read what `schema-dts` actually expects for that property/type, and either (a) fix the property to match the correct schema.org shape if the current code is genuinely wrong, or (b) if you believe the existing code is correct and `schema-dts`'s types are stricter than necessary for a valid use case, use a targeted `as const` or a narrow inline type assertion **only on that one property**, and note exactly which property and why in your task report — do not add a blanket `as any` anywhere, since that defeats this entire task's purpose.

- [ ] **Step 5: Type-annotate the `build*Schema()` functions' return types across the other 7 files**

For each file in `src/lib/schemas/buildTeamSchemas.ts`, `buildTravelGuideSchemas.ts`, `buildPolicySchemas.ts`, `buildWhyJvtoSchemas.ts`, `buildTourSchemas.ts`, `buildToursHubSchemas.ts`, `buildDestinationsSchemas.ts`: read the file, find every exported function that returns a JSON-LD object (e.g. `export function buildTeamProfileSchema(member: PublicCrewMember) { return { '@context': ..., '@type': 'ProfilePage', ... }; }`), and add an explicit return type matching the schema-dts type for that object's `'@type'`:
```ts
export function buildTeamProfileSchema(member: PublicCrewMember): WithContext<ProfilePage> {
  return {
    // ... unchanged
  };
}
```
Import whatever additional `schema-dts` types each file's functions need (`ProfilePage`, `ItemList`, `AboutPage`, `FAQPage`, `HowTo`, `BreadcrumbList`, `TouristTrip`, `TouristAttraction`, `AggregateRating`, etc. — check each function's actual `'@type'` value and import the matching type). Some schema.org types used in this codebase may not have a dedicated top-level export in `schema-dts` (e.g. some page-type unions) — if `schema-dts` doesn't export an exact match for a `'@type'` value you find, check its documentation/index for the closest generic equivalent (e.g. `WebPage` variants are usually all under one union type) rather than skipping the annotation entirely; if truly nothing fits, note that specific case in your task report rather than silently leaving it untyped.

- [ ] **Step 6: Verify — this is the step that proves the task worked**

Run: `npx tsc --noEmit 2>&1 | grep -v "GoogleReviewsCarousel\|.next/types/validator"`

Expected: either zero output (everything type-checks cleanly against real schema.org types), or a list of **genuine** structural issues this task just surfaced for the first time — read each one, and resolve per Step 4's guidance (fix the data if wrong, narrowly justify if the type is being overly strict, never blanket-suppress). Do not consider this task done while any such error remains unresolved or unexplained in your task report.

- [ ] **Step 7: Confirm no visible-page regression**

Run a quick smoke check that pages using the now-annotated schemas still render (this task should never change runtime output, only add compile-time types):
```bash
npm run dev &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/why-jvto/our-team
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/why-jvto/our-team/gufron
pkill -f "next dev"
```
Expected: `200` for all three. Also confirm the new HPWKI credential renders in the actual JSON-LD (any page injecting `FOUNDER_SCHEMA` — check which pages via `grep -rl "FOUNDER_SCHEMA" src/app`):
```bash
npm run dev &
sleep 8
curl -s http://localhost:3000/ | grep -o "HPWKI Certified Volcano Guide"
pkill -f "next dev"
```
Expected: `HPWKI Certified Volcano Guide` printed (confirms Step 3's addition is live), assuming the homepage is one of the pages injecting `FOUNDER_SCHEMA` — if it isn't, curl whichever page(s) the grep above actually shows.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/lib/schemas/entityGraph.ts src/lib/schemas/buildTeamSchemas.ts src/lib/schemas/buildTravelGuideSchemas.ts src/lib/schemas/buildPolicySchemas.ts src/lib/schemas/buildWhyJvtoSchemas.ts src/lib/schemas/buildTourSchemas.ts src/lib/schemas/buildToursHubSchemas.ts src/lib/schemas/buildDestinationsSchemas.ts
git commit -m "feat(seo): type-check JSON-LD builders against schema-dts, add HPWKI as a credential"
```

In your task report, list every property/type mismatch `schema-dts` surfaced (even ones you resolved) — this is valuable signal for the owner about how much the hand-authored schema code had actually drifted from the real schema.org spec, which is the whole reason this task exists.

---

## Self-Review Checklist (already applied while writing this plan)

- **Spec coverage:** Gap 1 → Task 4. Gap 2 → Task 2. Gap 3 → Task 3. Gap 4 → Task 1. Gap 5 → Task 5. Compile-time schema.org type safety (raised by the owner mid-audit, not one of the original 5 written-up gaps but folded in at the owner's explicit request) → Task 6. All 6 tasks map to a concrete, owner-confirmed need. The originally-audited 6th area (Schema Graph & Stable `@id` structure/linking) was found already well-implemented and correctly has no task — Task 6 instead addresses a different concern (type-safety of the *authoring process*, not the graph's structure, which was already sound).
- **No placeholders:** every task has literal file paths, literal code blocks, and literal verification commands with literal expected output — no "TODO"/"add appropriate handling" left in any step. Task 6's Steps 2 and 5 explicitly instruct verifying exact type names against the installed package rather than guessing, because this plan was written without `schema-dts` installed to check against directly — this is a deliberate, flagged exception to "no placeholders," not an oversight.
- **Type consistency:** `PageMeta.reviewedBy` (Task 3) is not consumed by any other task's code, so no cross-task signature risk. Task 1's `isProductionHostname()` and `PRODUCTION_HOSTNAMES` are local to `middleware.ts`, not exported/reused elsewhere. Task 6 touches many of the same files Task 3 (PageJsonLdCombined.tsx via reviewedBy) and Tasks elsewhere reference by name only, never by shared runtime import — no task depends on another task's output, all 6 are independent and can be executed in any order. Task 4's drift-check script and Task 6's type annotations both touch `entityGraph.ts`, but Task 4 only *reads* it (via text-regex extraction, not import) so it is unaffected by Task 6's added type annotations — if both tasks run in the same session, order between them does not matter.
