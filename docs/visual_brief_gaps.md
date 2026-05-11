# JVTO Visual Brief Gap Analysis

> Compared: `E:\test-2-2026\docs\JVTO_Visual_Brief_v1.md` vs `F:\jvto-web` actual state  
> Analysis date: 2026-05-05  
> Note: Brief was written for the archived rewrite (E:). F:\jvto-web uses `travel-guide/[slug]` dynamic routing — all sub-pages exist via DB `content_pages`, not dedicated `page.tsx` files.

---

## Executive Summary

- **Brief is largely met.** 27 of 28 specified routes exist in F:\jvto-web.
- **One real gap:** `/insights/[slug]` (Insights/Blog Hub) — brief specifies it, F: has `/blog/page.tsx` with a different URL pattern, no CMS-driven [slug] yet.
- **Visual mode compliance:** cannot be verified programmatically, but color tokens and component patterns from the brief are present in `src/app/(website)/website.css` and component library.
- **Off-brief additions (intentional):** `/team`, `/team/[slug]`, `/why-jvto/reviews/[id]`, `/lp/*` ads landing pages — all justified and added after brief was frozen.
- **Agent error corrected:** earlier audit incorrectly marked `travel-guide/ijen-health-screening`, `packing-and-fitness`, `weather-and-closures` as missing — they exist via `[slug]` dynamic route with DB content (`is_active=true`, 4+ sections each).

---

## Per-Route Status Table

| Route | Brief Visual Mode | Exists in F: | Handler | Status |
|---|---|---|---|---|
| `/` | Homepage | ✅ | `page.tsx` | Met |
| `/tours` | Travel | ✅ | `page.tsx` | Met |
| `/tours/from-surabaya` | Travel | ✅ | `page.tsx` | Met |
| `/tours/from-bali` | Travel | ✅ | `page.tsx` | Met |
| `/tours/from-{city}/[slug]` | Travel | ✅ | `[slug]/page.tsx` | Met |
| `/destinations` | Travel | ✅ | `page.tsx` | Met |
| `/destinations/[slug]` | Travel | ✅ | `[slug]/page.tsx` | Met |
| `/verify-jvto` | Trust | ✅ | `page.tsx` | Met |
| `/verify-jvto/legal` | Trust | ✅ | `page.tsx` | Met |
| `/verify-jvto/police-safety` | Trust | ✅ | `page.tsx` | Met |
| `/verify-jvto/press-recognition` | Trust | ✅ | `page.tsx` | Met |
| `/verify-jvto/history-artifacts` | Trust | ✅ | `page.tsx` | Met |
| `/travel-guide` | Hybrid | ✅ | `page.tsx` | Met |
| `/travel-guide/booking-information` | Hybrid | ✅ | `[slug]` + DB row | Met |
| `/travel-guide/ijen-health-screening` | Hybrid/Medical | ✅ | `[slug]` + DB row | Met |
| `/travel-guide/weather-and-closures` | Hybrid | ✅ | `[slug]` + DB row | Met |
| `/travel-guide/packing-and-fitness` | Hybrid | ✅ | `[slug]` + DB row | Met |
| `/travel-guide/police-escort-for-groups` | Hybrid | ✅ | `page.tsx` | Met |
| `/why-jvto` | Hybrid | ✅ | `page.tsx` | Met |
| `/why-jvto/the-jvto-difference` | Hybrid | ✅ | `page.tsx` | Met |
| `/why-jvto/our-story` | Hybrid | ✅ | `page.tsx` | Met |
| `/why-jvto/our-team` | Hybrid | ✅ | `page.tsx` | Met |
| `/why-jvto/reviews` | Hybrid | ✅ | `[slug]` + DB row | Met (bonus: also `/[id]` per-review) |
| `/policy/booking-payment-cancellation` | Trust | ✅ | `[slug]` + DB row | Met |
| `/policy/inclusions-exclusions` | Trust | ✅ | `[slug]` + DB row | Met |
| `/contact` | Trust | ✅ | `page.tsx` | Met |
| `/insights/[slug]` | Travel/Article | ⚠️ | `/blog/page.tsx` (different URL) | **URL mismatch** |

---

## Gaps by Priority

### P1 — URL Architecture Mismatch (Medium)

**`/insights/[slug]`** vs **`/blog`**

Brief specifies `/insights/[slug]` as the CMS-driven long-tail AEO content hub (BlogPosting + Article schema). F:\jvto-web has `/blog/page.tsx` at a different URL with a static/non-slug pattern. No `[slug]` dynamic routing exists for individual articles.

**Impact:** Inbound links or ads pointing to `/insights/...` will 404. Long-tail AEO content (`BlogPosting` schema) cannot be injected per-article.

**Fix:** Either redirect `/blog` → `/insights` and build `/insights/[slug]`, or rename the existing blog route. Estimated effort: medium (new CMS content cluster).

### P2 — Off-Brief Additions (No Action Required)

These exist in F: but not in the brief — all intentional post-brief additions:

| Route | Reason Added |
|---|---|
| `/team`, `/team/[slug]` | GAP 4 from GEO doc: individual crew pages for entity signal |
| `/why-jvto/reviews/[id]` | Individual review pages for `Review` schema per-URL |
| `/why-jvto/community-standards` | Merged from `partners-verification` (audit 2026-05-04) |
| `/lp/bromo-ijen-surabaya`, `/lp/ijen-bali` | Ads landing pages (not indexed, Disallow in robots.ts) |
| `/travel-guide/best-time-to-visit` | Static seasonal guide (hardcoded, no DB row needed) |
| `/travel-guide/mount-bromo-logistics` | AEO logistics content (via [slug], populated 2026-05-05) |
| `/travel-guide/tumpak-sewu-logistics` | AEO logistics content (via [slug], populated 2026-05-05) |

### P3 — Brief Items Marked Soft-Deleted (No Action)

Brief explicitly rejected `/isic/student-package` and `/student-deals/isic` (2026-04-27 note). These exist as active pages in F: — the rejection was for the archived rewrite only. Current live implementation is intentional.

---

## Visual Mode Compliance Notes

Brief defines 4 modes: **Homepage** (navy/coral hero), **Travel** (image-led, lime accent), **Trust** (dark forensic bg, lime verification), **Hybrid** (white, navy rail, lime signals).

Cannot programmatically verify full compliance without rendering. Key indicators:
- `website.css` has CSS custom properties for each mode
- `visual_modes_canonical.md` memory file locks the per-cluster mode assignment
- Brief's "50ms Protocol" (≤2 render passes for critical path) — verifiable via Lighthouse/CWV, not in scope here

---

*Gap document is a point-in-time snapshot. Re-run comparison after major route additions.*
