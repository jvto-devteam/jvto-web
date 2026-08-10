# JVTO UX Audit — Modul 9 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Modul 9 (`ux`) to `~/.claude/skills/jvto-audit/SKILL.md` so `/jvto-audit ux` triggers a UI/UX audit covering design consistency, CTA/conversion, and visual hierarchy with a confirmation-before-fix workflow.

**Architecture:** Single file edit to an existing skill markdown file. No production code, no tests. Three edits: (1) frontmatter metadata update, (2) usage section update, (3) full Modul 9 section appended at end of file before Notes Penting. Spec at `docs/superpowers/specs/2026-05-22-jvto-ux-audit-design.md`.

**Tech Stack:** Markdown skill file (`SKILL.md`), Playwright browser tools (already in allowed-tools), Claude Code Edit tool

---

## File Map

| File | Change |
|---|---|
| `~/.claude/skills/jvto-audit/SKILL.md` | Update frontmatter + usage + append Modul 9 |

---

### Task 1: Update frontmatter and usage section

**Files:**
- Modify: `~/.claude/skills/jvto-audit/SKILL.md:1–52`

- [ ] **Step 1: Update version and description in frontmatter**

In `~/.claude/skills/jvto-audit/SKILL.md`, change lines 3–8:

Before:
```yaml
version: 1.2.0
description: |
  Comprehensive audit skill for the JVTO website (javavolcano-touroperator.com).
  Covers 8 modules: SEO, Schema/JSON-LD, Performance, WCAG/Accessibility,
  Mobile/Responsive, Content Quality, Component Functionality, and Images.
  Full audit covers all 52 pages from sitemap.xml.
  Use when asked to "audit", "check", "cek website", or before any deploy.
```

After:
```yaml
version: 1.3.0
description: |
  Comprehensive audit skill for the JVTO website (javavolcano-touroperator.com).
  Covers 9 modules: SEO, Schema/JSON-LD, Performance, WCAG/Accessibility,
  Mobile/Responsive, Content Quality, Component Functionality, Images, and UX.
  Full audit covers all 52 pages from sitemap.xml.
  Use when asked to "audit", "check", "cek website", "ux audit", or before any deploy.
```

- [ ] **Step 2: Add UX triggers to frontmatter**

In the `triggers:` block (lines 23–27), add two new triggers:

Before:
```yaml
triggers:
  - /jvto-audit
  - audit website
  - cek website
  - audit halaman
```

After:
```yaml
triggers:
  - /jvto-audit
  - audit website
  - cek website
  - audit halaman
  - ux audit
  - cek ux
```

- [ ] **Step 3: Add ux to usage block**

After line 49 (`/jvto-audit images   → Image health audit semua halaman`), add:

```
/jvto-audit ux                           → UX audit sampel 6 halaman (1 per cluster)
/jvto-audit ux [url]                     → UX audit satu halaman spesifik
```

- [ ] **Step 4: Update Modul tersedia line**

Line 52 currently reads:
```
**Modul tersedia:** `seo` `schema` `performance` `wcag` `mobile` `content` `component` `images`
```

Change to:
```
**Modul tersedia:** `seo` `schema` `performance` `wcag` `mobile` `content` `component` `images` `ux`
```

- [ ] **Step 5: Verify frontmatter changes**

Run:
```bash
head -55 ~/.claude/skills/jvto-audit/SKILL.md
```

Expected: version shows 1.3.0, triggers includes `ux audit` and `cek ux`, usage block has ux line, Modul tersedia ends with `ux`.

---

### Task 2: Append Modul 9 — UX Audit section

**Files:**
- Modify: `~/.claude/skills/jvto-audit/SKILL.md:760` (insert before `## Notes Penting`)

- [ ] **Step 1: Insert Modul 9 section before Notes Penting**

Find the line `## Notes Penting` (currently line 762). Insert the full Modul 9 block immediately before it:

```markdown

---

## Modul 9 — UX Audit

Audit UI/UX quality JVTO per halaman: design consistency, CTA & conversion effectiveness, dan visual hierarchy. Beda dari modul 1–8: menghasilkan recommendations dan menanya konfirmasi sebelum eksekusi fix.

### Cara Penggunaan

```
/jvto-audit ux                            → sample 6 halaman (1 per cluster)
/jvto-audit ux /tours/from-surabaya/slug  → satu halaman spesifik
/jvto-audit ux homepage                   → hanya homepage
/jvto-audit ux tour                       → sample tour detail saja
```

### Halaman yang Disampling (default)

| Cluster | URL | Alasan |
|---|---|---|
| Homepage | `https://javavolcano-touroperator.com` | Flagship |
| Tour hub | `/tours/from-surabaya` | Listing + CTA |
| Tour detail | `/tours/from-surabaya/ijen-bromo-madakaripura-3d2n` | Template semua tour |
| Destination | `/destinations/ijen-crater` | Most important destination |
| Why JVTO | `/why-jvto/the-jvto-difference` | Trust-building |
| Verify JVTO | `/verify-jvto/legal` | Trust signal |

Ambil screenshot di **375px mobile viewport** (`browser_resize`) sebelum DOM inspect.

---

### 9A — Design Consistency

**JVTO Design Tokens (canonical):**
- Warna: `jvto-green` (#B2F35F), `jvto-navy` (#0F172A), `jvto-orange` (#FB923C), `jvto-dark` (#191919)
- Font: system-sans, heading `font-black` (900) / `font-bold` (700)
- Card radius: `rounded-[24px]` — harus konsisten satu varian
- Shadow card: `shadow-sm`

**Script:**
```javascript
() => {
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const bodySize = parseFloat(getComputedStyle(document.body).fontSize);
  const cards = Array.from(document.querySelectorAll('[class*="card"],[class*="Card"]')).slice(0, 5);
  const cardRadii = [...new Set(cards.map(c => getComputedStyle(c).borderRadius))];
  const ctaBtns = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
  const ctaBgColors = [...new Set(ctaBtns.map(b => getComputedStyle(b).backgroundColor))];
  return {
    h1Size: h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0,
    h2Size: h2 ? parseFloat(getComputedStyle(h2).fontSize) : 0,
    bodySize,
    h1Ratio: h1 ? (parseFloat(getComputedStyle(h1).fontSize) / bodySize).toFixed(1) : 0,
    cardRadiiVariants: cardRadii,
    ctaBgVariants: ctaBgColors,
    bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 50)
  };
}
```

**Pass criteria:**

| Check | ✅ Pass | ⚠️ Warning | ❌ Fail |
|---|---|---|---|
| H1/body ratio | ≥ 2.0× | 1.5–2.0× | < 1.5× |
| Card border-radius variants | 1 | — | > 1 |
| CTA background variants | 1 warna | — | > 1 warna |

---

### 9B — CTA & Conversion

**Script:**
```javascript
() => {
  const waLinks = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
  const firstWa = waLinks[0];
  const waRect = firstWa?.getBoundingClientRect();
  const text = document.body.innerText;
  const priceEl = document.querySelector('[class*="price"],[class*="Price"]');
  return {
    wa: {
      count: waLinks.length,
      present: !!firstWa,
      aboveFold: waRect ? waRect.top < window.innerHeight : false,
      text: firstWa?.textContent.trim().slice(0, 50) || null,
      positions: waLinks.map(l => Math.round(l.getBoundingClientRect().top + window.scrollY))
    },
    trustSignals: {
      trustpilot: /4\.8|trustpilot/i.test(text),
      touristPolice: /tourist police|polpar/i.test(text),
      reviewCount51: /\b51\b/i.test(text),
      nib: /NIB|1102230032918/i.test(text)
    },
    price: {
      present: !!priceEl,
      aboveFold: priceEl ? priceEl.getBoundingClientRect().top < window.innerHeight * 2 : false
    }
  };
}
```

**Pass criteria per cluster:**

| Cluster | WA Present | WA Above Fold | Trust Signal | Price |
|---|---|---|---|---|
| Homepage | ✅ required | ✅ required | ≥2 (Trustpilot + Police) | — |
| Tour detail | ✅ required (≥2) | ✅ required | ≥1 rating | ✅ visible |
| Tour hub | ✅ required | ⚠️ preferred | ≥1 | — |
| Destination | ✅ required | ⚠️ preferred | — | — |
| Why JVTO | ⚠️ preferred | — | ≥1 | — |
| Travel Guide | ⚠️ preferred | — | — | — |
| Verify JVTO | — | — | NIB/POLPAR ✅ | — |
| Policy | — | — | — | — |

**Mobile check (jalankan setelah `browser_resize(375, 812)`):**
```javascript
() => {
  const wa = document.querySelector('a[href*="wa.me"]');
  const rect = wa?.getBoundingClientRect();
  return {
    waAboveFold: rect ? rect.top < window.innerHeight : false,
    waFullWidth: rect ? rect.width >= window.innerWidth * 0.8 : false,
    waWidth: rect ? Math.round(rect.width) : 0,
    viewportWidth: window.innerWidth
  };
}
```

---

### 9C — Visual Hierarchy

**Script:**
```javascript
() => {
  const sz = el => el ? parseFloat(getComputedStyle(el).fontSize) : 0;
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const h3 = document.querySelector('h3');
  const aboveFold = Array.from(document.querySelectorAll('h1,h2,p,[class*="badge"],[class*="hero"],[class*="trust"]'))
    .filter(el => el.getBoundingClientRect().top < window.innerHeight && el.textContent.trim().length > 0)
    .slice(0, 8)
    .map(el => ({ tag: el.tagName, text: el.textContent.trim().slice(0, 50) }));
  const h1s = sz(h1), h2s = sz(h2), h3s = sz(h3);
  const hierarchyOk = h1s > h2s && (h3s === 0 || h2s >= h3s);
  const waAboveFold = (() => {
    const el = document.querySelector('a[href*="wa.me"],a[href*="/tours"]');
    return el ? el.getBoundingClientRect().top < window.innerHeight : false;
  })();
  return {
    sizes: { h1: h1s, h2: h2s, h3: h3s, body: sz(document.body) },
    hierarchyOk,
    aboveFold,
    hasH1AboveFold: aboveFold.some(el => el.tag === 'H1'),
    hasCtaAboveFold: waAboveFold,
    sectionCount: document.querySelectorAll('section,[class*="section"]').length
  };
}
```

**Pass criteria:**

| Check | ✅ Pass | ⚠️ Warning | ❌ Fail |
|---|---|---|---|
| H1 > H2 ≥ H3 | ✅ descending | H1 = H2 | H2 > H1 |
| H1 above fold | ✅ present | — | ❌ not visible |
| CTA above fold (commercial) | ✅ present | — | ❌ missing |
| Section count | ≤ 10 | 11–15 | > 15 |

---

### Format Output

Per halaman (tampilkan setelah screenshot):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UX AUDIT — /tours/from-surabaya/ijen-bromo-3d2n  [375px mobile]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9A CONSISTENCY   ✅  H1 ratio 2.3× · card radii 1 varian · CTA color 1 varian
9B CTA           ❌  WA count 1 (need ≥2) · not above fold · price ✅ · police ✅
9C HIERARCHY     ✅  H1>H2>H3 ✅ · H1 above fold ✅ · 8 sections ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Summary setelah semua halaman:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UX AUDIT SUMMARY — 6 halaman — YYYY-MM-DD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9A CONSISTENCY   ✅/⚠️/❌  [ringkasan temuan]
9B CTA           ✅/⚠️/❌  [ringkasan temuan]
9C HIERARCHY     ✅/⚠️/❌  [ringkasan temuan]

RECOMMENDATIONS:
  ❌ CRITICAL:   [issue — halaman — file]
  ⚠️ HIGH:       [issue — halaman — file]
  💡 MEDIUM:    [issue — halaman — file]

Ada X issue ditemukan. Fix semua sekarang, atau pilih satu per satu?
Jawab: all / one-by-one / skip
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Confirmation + Fix Workflow

1. Tampilkan summary lengkap semua issues
2. Tanya: "Fix semua sekarang, atau pilih satu per satu?"
3. Jika `all`: jalankan semua fix berurutan, commit atomik per issue
4. Jika `one-by-one`: per issue → tampilkan proposed code change → tanya konfirmasi → fix → commit → next
5. Jika `skip`: selesai tanpa perubahan

**Fix reference per issue type:**

| Issue | File | Fix |
|---|---|---|
| WA CTA count < 2 di tour detail | `src/components/website/TourDetail.tsx` | Tambah sticky WA button di top area header |
| WA not above fold mobile | komponen yang render WA | Pindah ke atas hero atau tambah fixed bottom bar |
| Card radius inconsistency | komponen yang inconsistent | Unifikasi ke `rounded-[24px]` |
| H1 ratio < 2.0× | komponen atau `globals.css` | Naikkan `font-size` H1 |
| Trust signal missing di commercial page | page.tsx yang bersangkutan | Tambah badge/trust block dengan Trustpilot + Police |
| WA CTA text tidak action-oriented | komponen WA | Ubah copy ke "Book via WhatsApp →" |

```
```

- [ ] **Step 2: Verify section was inserted correctly**

Run:
```bash
grep -n "Modul 9\|UX Audit\|9A\|9B\|9C\|Confirmation" ~/.claude/skills/jvto-audit/SKILL.md | head -20
```

Expected: lines showing `## Modul 9 — UX Audit`, `### 9A`, `### 9B`, `### 9C`, `### Confirmation` — all present.

- [ ] **Step 3: Verify total line count increased**

Run:
```bash
wc -l ~/.claude/skills/jvto-audit/SKILL.md
```

Expected: ≥ 950 lines (was 771, Modul 9 adds ~200 lines).

- [ ] **Step 4: Commit**

```bash
cd /Users/macbook/Code/jvto-web
git add ~/.claude/skills/jvto-audit/SKILL.md
git commit -m "$(cat <<'EOF'
feat(skill): add Modul 9 UX Audit to jvto-audit v1.3.0

Adds /jvto-audit ux command with 3 sub-modules:
- 9A: Design consistency (H1 ratio, card radius, CTA color)
- 9B: CTA & conversion (WhatsApp above fold, trust signals, price)
- 9C: Visual hierarchy (H1>H2>H3, above fold content, section density)

Workflow: screenshot at 375px → DOM inspect → report all findings
→ confirm before fix → atomic commits per issue.

JVTO design tokens documented inline (canonical colors, radius, font weight).
Cluster-specific CTA requirements (tour vs. verify vs. policy differ).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**Spec coverage:**
- ✅ `ux` added to Modul tersedia
- ✅ triggers `ux audit` and `cek ux` added
- ✅ usage lines for `/jvto-audit ux` and `/jvto-audit ux [url]`
- ✅ 9A consistency: script + pass criteria + tokens
- ✅ 9B CTA/conversion: script + cluster table + mobile check
- ✅ 9C hierarchy: script + pass criteria
- ✅ Output format (per page + summary)
- ✅ Confirmation workflow (all/one-by-one/skip)
- ✅ Fix reference table
- ✅ Version bumped 1.2.0 → 1.3.0
- ✅ description updated to mention 9 modules

**Placeholder scan:** No TBD, TODO, or vague steps.

**Consistency:** Script variable names, cluster names, and pass thresholds consistent throughout.
