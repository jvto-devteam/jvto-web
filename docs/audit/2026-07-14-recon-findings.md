# JVTO Repo Recon Findings — 2026-07-14

Status per-item: [CONFIRMED] = ada sesuai dugaan | [DIFFERENT] = ada tapi berbeda | [NOT FOUND] = tidak ada

---

## A. ROUTING & REDIRECTS

**middleware.ts**
[CONFIRMED] Ada di `src/middleware.ts` (258 baris). Export: `export function middleware(req: NextRequest)`. Sudah punya 301 redirect map dan 410 Gone list. Matcher: semua path kecuali `/api`, `/_next`, favicon, sitemap, robots.

**next.config.mjs redirects()**
[NOT FOUND] Tidak ada `redirects()` array di `next.config.mjs`. Semua redirect via middleware.

**Folder route duplikat:**
- `src/app/(website)/tours-from-surabaya/page.tsx` [CONFIRMED — ada]
- `src/app/(website)/tour-from-surabaya/page.tsx` [CONFIRMED — ada]
- `src/app/(website)/tours-from-bali/page.tsx` [CONFIRMED — ada]
- `src/app/(website)/tour-from-bali/page.tsx` [CONFIRMED — ada]
- `src/app/(website)/student-deals/isic/page.tsx` [CONFIRMED — ada]
- `src/app/3d/[slug]/page.tsx` [DIFFERENT — ada, tapi di root app bukan (website); serves 3D route viewer]

**Sitemap & robots:**
- `src/app/sitemap.ts` [CONFIRMED]
- `public/robots.txt` [perlu konfirmasi apakah ada atau di `src/app/robots.ts`]

---

## B. REVIEW & SCHEMA

**Komponen yang menampilkan rating:**
- `src/components/website/Home/Hero.tsx:99-101` — stats bar: "4.8 Trustpilot · 51 reviews", "4.90 Google Maps · 123 reviews" (STALE)
- `src/components/website/TrustBar.tsx:23` — "4.8 ★ · 51 reviews" (STALE — Trustpilot)
- `src/components/website/Home/Features.tsx:18` — "4.8 · 51 Reviews" (STALE)
- `src/components/website/MarketPageSections.tsx:232` — "195 reviews" (STALE, sekarang 203)
- `src/components/website/Tours/TourCard.tsx:61` — "4.9" (hardcoded)
- `src/components/website/TourDetail.tsx:1454` — "4.9" (hardcoded)

**Aktual data (2026-07-16 dari DB):**
- Trustpilot: 44 reviews / 4.93 rating
- Google Maps: 138 reviews / 4.9 rating (synced via review_stats table)
- TripAdvisor: 21 reviews / 4.95 rating
- Total: 203 reviews

**Endpoint review:**
- `/api/review/sync-google` [CONFIRMED — POST endpoint untuk sync GBP API]
- `review_stats` table di DB [CONFIRMED — ada, row source='google']

**JSON-LD AggregateRating:**
[CONFIRMED] Sudah bind ke live DB via `getGoogleReviewStats()` di 10+ pages. Source: `src/lib/publicContent/getReviewStats.ts`

---

## C. CHECKOUT

**Path checkout:** `src/app/(website)/checkout/` [CONFIRMED — ada, 42 pre-existing TS errors]
**Price source:** Mengambil dari Prisma `package_prices` via `getWebPackageDetail()` helper [CONFIRMED — refactored dari legacy self-fetch]
**Legacy Laravel proxy:** Tidak ditemukan aktif di data path harga.
**Travel Credit di Terms:** [PERLU KONFIRMASI — belum dicek isi checkbox]
**Health-screening step Ijen:** [PERLU KONFIRMASI — diduga TIDAK ada conditional step]

---

## D. TRUST SIGNALS

**Homepage hero:** `src/components/website/Home/Hero.tsx` — ada stats bar (review numbers), H1 mention Tourist Police + NIB.
**Features.tsx:** `src/components/website/Home/Features.tsx` — 4 credential tiles: NIB, Tourist Police, Trustpilot, Physical Office. Linked ke verify-jvto.
**TrustBar.tsx:** `src/components/website/TrustBar.tsx` — 4 partner bar: Trustpilot, HPWKI, ISIC, INDECON. Posisi di bawah halaman.
**Verify pages:** `/verify-jvto/{legal,police-safety,press-recognition,history-artifacts}` [CONFIRMED — ada]
**NIB 1102230032918:** [CONFIRMED — ada di Features.tsx dan Hero.tsx description]
**Tourist Police / Sambuko:** [CONFIRMED — ada di Features.tsx]
**WhatsApp link:** `wa.me/6282244788833` [CONFIRMED — tersebar di banyak file, belum terpusat]

---

## E. CONTENT SYSTEM

**CMS model:** `content_pages` table — route, lang, seo (Json), content (Json), is_active.
**Content JSON structure:** `{ body_md: string, faq: [...] }` — body_md di-render via MarkdownRenderer.
**Travel-guide template:** `src/app/(website)/travel-guide/[slug]/page.tsx` — fetch DB content_pages WHERE route = '/travel-guide/' + slug. Required field: `body_md`.

**Content moat pages BELUM ADA:**
- `/travel-guide/bbksda-se-1658` — NOT FOUND di DB
- `/travel-guide/ijen-health-certificate` — NOT FOUND di DB
- `/travel-guide/bromo-vs-ijen-comparison` — NOT FOUND di DB
- `/travel-guide/is-bromo-open-today` — NOT FOUND di DB

---

## F. VOICE INVARIANTS

**Source:** `src/lib/jvtoReviews.ts` + `CLAUDE.md` voice invariants section.
**Frasa terlarang:** "Blue Fire guaranteed", "mandatory health screening" tanpa qualifier.
**Template WA first-contact:** Tersebar di multiple files, belum terpusat dalam satu constant.
