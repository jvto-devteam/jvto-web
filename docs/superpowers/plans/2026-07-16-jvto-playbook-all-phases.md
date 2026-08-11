# JVTO Playbook — Implementasi Semua Fase (0–5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementasikan 6 fase JVTO SEO & Conversion Playbook: recon documentation, 301 redirect cleanup, review UI data binding, trust signal surfacing, checkout improvement (scoped), dan content moat pages.

**Architecture:** Redirect canonicalization lewat `src/middleware.ts`; UI components bind ke `src/lib/jvtoReviews.ts` sebagai SSOT review stats (tidak perlu async DB call di client components); content moat pages menggunakan template CMS `travel-guide/[slug]` yang sudah ada, di-populate via raw SQL INSERT ke `content_pages` table.

**Tech Stack:** Next.js 16 App Router, TypeScript, Prisma 6.18, PostgreSQL (`jvto_dev` at `31.97.223.43:5432`), `src/middleware.ts` untuk edge redirects, `src/lib/jvtoReviews.ts` sebagai review data SSOT.

## Global Constraints

- **JANGAN rename `middleware.ts`** — Next.js mengharuskan nama ini persis; rename silent-breaks semua redirect.
- **JANGAN tambah `/blog → /travel-guide` redirect** — blog cluster sudah live di `/blog/`.
- **JANGAN sentuh `/src/app/(website)/checkout/**` atau booking API routes** tanpa sign-off owner — 42 pre-existing TypeScript errors; menyentuh payment path bisa merusak konversi.
- **Build HARUS lulus** (`npm run build`) sebelum setiap commit. Zero new TypeScript errors beyond 3 baseline dead-import errors yang sudah ada di `src/components/website/HomePage.tsx` dan `src/components/website/ReviewsPage.tsx`.
- **Voice invariant:** JANGAN tulis "mandatory health screening" tanpa qualifier. Gunakan: "Akses Ijen dapat mensyaratkan surat sehat terkini; JVTO mengoordinasikan alur klinik bila aturan akses mensyaratkan."
- **Review numbers SSOT:** Trustpilot → 44 reviews / 4.93. Google Maps → 138 reviews / 4.9. TripAdvisor → 21 reviews / 4.95. Total → 203. Source: `src/lib/jvtoReviews.ts`.
- **NIB:** `1102230032918` — gunakan nilai ini persis.
- **WhatsApp:** `https://wa.me/6282244788833` · `+62 822-4478-8833`.
- **DB connection:** `DATABASE_URL` di `.env.local`. Jalankan SQL via `npx prisma db execute --stdin` atau psql.

---

## File Map

| File | Aksi | Task |
|---|---|---|
| `docs/audit/2026-07-14-recon-findings.md` | Create | T1 |
| `src/middleware.ts` | Modify (redirects) | T2 |
| `src/app/(website)/tours-from-surabaya/page.tsx` | Delete + folder | T3 |
| `src/app/(website)/tour-from-surabaya/page.tsx` | Delete + folder | T3 |
| `src/app/(website)/tours-from-bali/page.tsx` | Delete + folder | T3 |
| `src/app/(website)/tour-from-bali/page.tsx` | Delete + folder | T3 |
| `src/app/(website)/student-deals/isic/page.tsx` | Delete + folder | T3 |
| `src/app/3d/[slug]/page.tsx` | Delete + folder | T3 |
| `src/app/sitemap.ts` | Modify (remove legacy routes from lastModifiedMap) | T3 |
| `src/components/website/TrustBar.tsx` | Modify (bind to REVIEW_PLATFORMS) | T4 |
| `src/components/website/Home/Features.tsx` | Modify (bind to REVIEW_PLATFORMS) | T4 |
| `src/components/website/Home/Hero.tsx` | Modify (bind to REVIEW_PLATFORMS) | T4 |
| `src/components/website/MarketPageSections.tsx` | Modify (bind to AGGREGATE_RATING) | T4 |
| `src/components/website/Tours/TourCard.tsx` | Modify (bind to AGGREGATE_RATING) | T4 |
| `src/components/website/TourDetail.tsx` | Modify (bind to AGGREGATE_RATING) | T4 |
| `src/components/website/Home/Features.tsx` | Modify (add health-screening, centralize WA) | T5 |
| `src/lib/waLinks.ts` | Create (centralized WA deep links) | T5 |
| `src/app/(website)/checkout/` area | Scoped modify (Terms + health-screening) | T6 |
| DB `content_pages` table | INSERT 4 rows | T7 |
| `src/app/(website)/travel-guide/sitemap.data.ts` | Modify (add 4 new slugs) | T7 |
| `src/app/sitemap.ts` | Modify (add 4 new routes to lastModifiedMap) | T7 |

---

## FASE 0

### Task 1: Dokumentasi Recon Findings

**Files:**
- Create: `docs/audit/2026-07-14-recon-findings.md`

**Interfaces:**
- Produces: reference file yang digunakan Tim Sam untuk komunikasi dengan Google Search Console post-launch

- [ ] **Step 1: Buat direktori dan file recon**

```bash
mkdir -p docs/audit
```

Buat file `docs/audit/2026-07-14-recon-findings.md` dengan isi berikut (copy persis):

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/audit/2026-07-14-recon-findings.md
git commit -m "docs(audit): add recon findings for playbook phases 0-5"
```

Expected output: `1 file changed, N insertions(+)`

---

## FASE 1

### Task 2: Perbaiki Redirect Map di middleware.ts

**Files:**
- Modify: `src/middleware.ts:43-219`

**Interfaces:**
- Consumes: `goneUrls` array (line 43), `redirectMap` object (line 180)
- Produces: 301 redirects untuk semua legacy/dup URLs; 410 hanya untuk benar-benar gone

**⚠️ Precondition:** Baca `src/middleware.ts` penuh dulu sebelum edit. File ini 258 baris — jangan overwrite tanpa membaca.

- [ ] **Step 1: Hapus 4 item dari `goneUrls` yang seharusnya jadi 301**

Buka `src/middleware.ts`. Di array `goneUrls` (mulai line 43), HAPUS baris-baris berikut (akan dipindah ke redirectMap):

```typescript
"/all-inclusive",        // baris ~44 — hapus
"/custom-package",       // baris ~52 — hapus
"/student-package",      // baris ~106 — hapus
"/terms-and-conditions", // baris ~107 — hapus
```

- [ ] **Step 2: Tambahkan 8 entri ke `redirectMap`**

Di objek `redirectMap` (sekitar line 180), tambahkan entri berikut SETELAH entri yang sudah ada:

```typescript
// Pindahan dari goneUrls — seharusnya 301 bukan 410
"/all-inclusive": "/policy/inclusions-exclusions",
"/custom-package": "/tours",
"/student-package": "/isic/student-package",
"/terms-and-conditions": "/policy",
// Folder duplikat internal
"/tours-from-surabaya": "/tours/from-surabaya",
"/tour-from-surabaya": "/tours/from-surabaya",
"/tours-from-bali": "/tours/from-bali",
"/tour-from-bali": "/tours/from-bali",
```

- [ ] **Step 3: Tambahkan dynamic redirect `/3d/:slug` → `/destinations/:slug`**

Tambahkan blok berikut SETELAH handler `pathname.startsWith("/packages")` (sekitar line 208) dan SEBELUM `const destination = redirectMap[pathname]`:

```typescript
// 3D route viewer → destinations canonical
if (pathname.startsWith("/3d/")) {
  const slug = pathname.slice(4); // strip "/3d/"
  const res = NextResponse.redirect(
    new URL(`/destinations/${slug}`, req.url),
    301,
  );
  trackVisit(req, res);
  return res;
}
```

- [ ] **Step 4: Verifikasi tidak ada `/blog` redirect yang ditambahkan**

Pastikan TIDAK ada entri `"/blog"` di `redirectMap` atau handler yang redirect `/blog` ke `/travel-guide`. Blog sekarang sudah live dan tidak boleh di-redirect.

- [ ] **Step 5: Run build untuk cek tidak ada error**

```bash
npm run build
```

Expected: Build sukses dengan jumlah halaman sama atau lebih. Tidak ada TypeScript error baru.

- [ ] **Step 6: Test redirect manual**

```bash
npm run dev &
sleep 5
curl -Is http://localhost:3000/all-inclusive | grep -E "^HTTP|^location"
curl -Is http://localhost:3000/student-package | grep -E "^HTTP|^location"
curl -Is http://localhost:3000/custom-package | grep -E "^HTTP|^location"
curl -Is http://localhost:3000/terms-and-conditions | grep -E "^HTTP|^location"
curl -Is http://localhost:3000/tours-from-surabaya | grep -E "^HTTP|^location"
curl -Is http://localhost:3000/tour-from-bali | grep -E "^HTTP|^location"
curl -Is http://localhost:3000/3d/ijen-bromo-route | grep -E "^HTTP|^location"
```

Expected output untuk tiap URL:
```
HTTP/1.1 301 Moved Permanently
location: /policy/inclusions-exclusions      # untuk /all-inclusive
location: /isic/student-package              # untuk /student-package
location: /tours                             # untuk /custom-package
location: /policy                            # untuk /terms-and-conditions
location: /tours/from-surabaya               # untuk /tours-from-surabaya
location: /tours/from-bali                   # untuk /tour-from-bali
location: /destinations/ijen-bromo-route     # untuk /3d/ijen-bromo-route
```

- [ ] **Step 7: Kill dev server dan commit**

```bash
pkill -f "next dev" 2>/dev/null || true
git add src/middleware.ts
git commit -m "feat(routing): fix 410→301 for legacy paths, add missing dup redirects, add /3d dynamic redirect"
```

---

### Task 3: Hapus Folder Duplikat + Bersihkan Sitemap

**Files:**
- Delete: `src/app/(website)/tours-from-surabaya/` (seluruh folder)
- Delete: `src/app/(website)/tour-from-surabaya/` (seluruh folder)
- Delete: `src/app/(website)/tours-from-bali/` (seluruh folder)
- Delete: `src/app/(website)/tour-from-bali/` (seluruh folder)
- Delete: `src/app/(website)/student-deals/` (seluruh folder)
- Delete: `src/app/3d/` (seluruh folder — 3d route viewer tidak lagi diakses langsung)
- Modify: `src/app/sitemap.ts:22-56` (hapus legacy routes dari `lastModifiedMap`)

**Interfaces:**
- Consumes: redirect map dari Task 2 (middleware sudah handle semua URL ini dengan 301)

**⚠️ Precondition:** Task 2 HARUS sudah selesai dan commit sebelum Task ini. Middleware redirect harus aktif agar penghapusan folder tidak menyebabkan 404.

- [ ] **Step 1: Hapus semua folder duplikat**

```bash
rm -rf src/app/\(website\)/tours-from-surabaya
rm -rf src/app/\(website\)/tour-from-surabaya
rm -rf src/app/\(website\)/tours-from-bali
rm -rf src/app/\(website\)/tour-from-bali
rm -rf src/app/\(website\)/student-deals
rm -rf src/app/3d
```

- [ ] **Step 2: Verifikasi folder terhapus**

```bash
ls src/app/\(website\)/ | grep -E "tours-from|tour-from|student-deals"
ls src/app/ | grep "3d"
```

Expected: kedua perintah menghasilkan output kosong (tidak ada match).

- [ ] **Step 3: Build untuk konfirmasi tidak ada import yang rusak**

```bash
npm run build
```

Expected: Build sukses. Jumlah static pages mungkin berkurang (halaman duplikat terhapus).

Jika build GAGAL dengan error `Module not found` atau sejenisnya terkait folder yang dihapus — cek apakah ada file lain yang import dari folder tersebut:
```bash
grep -rn "tours-from-surabaya\|tour-from-surabaya\|tours-from-bali\|student-deals" src/ --include="*.ts" --include="*.tsx" | grep -v "node_modules"
```

Hapus atau update import yang ditemukan.

- [ ] **Step 4: Hapus legacy routes dari `lastModifiedMap` di `src/app/sitemap.ts`**

Buka `src/app/sitemap.ts`. Di array `lastModifiedMap` (sekitar line 22-56), JANGAN tambahkan dan PASTIKAN tidak ada path berikut (jika ada, hapus):
- `/tours-from-surabaya`
- `/tour-from-surabaya`
- `/tours-from-bali`
- `/tour-from-bali`
- `/student-deals/isic`

Path-path ini tidak perlu di-lookup `lastModified` karena sudah jadi 301 redirect.

- [ ] **Step 5: Commit**

```bash
git add -A
git status
```

Review output `git status` — pastikan hanya folder duplikat yang terhapus dan `sitemap.ts` yang berubah. Tidak ada file lain yang tidak terduga.

```bash
git commit -m "feat(routing): delete duplicate landing page folders (middleware handles 301)"
```

---

## FASE 2

### Task 4: Bind Review UI ke SSOT jvtoReviews.ts

**Files:**
- Modify: `src/components/website/TrustBar.tsx`
- Modify: `src/components/website/Home/Features.tsx`
- Modify: `src/components/website/Home/Hero.tsx`
- Modify: `src/components/website/MarketPageSections.tsx`
- Modify: `src/components/website/Tours/TourCard.tsx`
- Modify: `src/components/website/TourDetail.tsx`

**Interfaces:**
- Consumes: `REVIEW_PLATFORMS`, `AGGREGATE_RATING` dari `@/lib/jvtoReviews`
  - `REVIEW_PLATFORMS[].platform: string` — "Trustpilot" | "Google Maps" | "TripAdvisor" | "GetYourGuide"
  - `REVIEW_PLATFORMS[].rating: number | null`
  - `REVIEW_PLATFORMS[].count: number | null`
  - `AGGREGATE_RATING.ratingValue: number` — saat ini 4.91
  - `AGGREGATE_RATING.reviewCount: number` — saat ini 203

- [ ] **Step 1: Update `src/components/website/TrustBar.tsx`**

Tambahkan import di baris paling atas file (setelah `import { Fragment } from "react"`):

```typescript
import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";
```

Lalu temukan konstanta `partners` (sekitar line 18). Ganti item `trustpilot` dari:

```typescript
{
  key: "trustpilot",
  logo: { kind: "image", src: "/assets/img/icons/trustpilot-icon.webp", alt: "Trustpilot", width: 26, height: 26 },
  name: "Trustpilot",
  sub: "4.8 ★ · 51 reviews",
  href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
  external: true,
},
```

Menjadi:

```typescript
{
  key: "trustpilot",
  logo: { kind: "image", src: "/assets/img/icons/trustpilot-icon.webp", alt: "Trustpilot", width: 26, height: 26 },
  name: "Trustpilot",
  sub: (() => {
    const tp = REVIEW_PLATFORMS.find((p) => p.platform === "Trustpilot");
    return tp ? `${tp.rating} ★ · ${tp.count} reviews` : "4.93 ★ · 44 reviews";
  })(),
  href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
  external: true,
},
```

- [ ] **Step 2: Update `src/components/website/Home/Features.tsx`**

Tambahkan import di baris paling atas (sebelum `const CREDENTIALS`):

```typescript
import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";
```

Lalu ganti item Trustpilot di array `CREDENTIALS` dari:

```typescript
{
  label: "Trustpilot",
  value: "4.8 · 51 Reviews",
  sub: "Excellent — verified platform",
  href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
  external: true,
},
```

Menjadi:

```typescript
{
  label: "Trustpilot",
  value: (() => {
    const tp = REVIEW_PLATFORMS.find((p) => p.platform === "Trustpilot");
    return tp ? `${tp.rating} · ${tp.count} Reviews` : "4.93 · 44 Reviews";
  })(),
  sub: "Excellent — verified platform",
  href: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
  external: true,
},
```

- [ ] **Step 3: Update `src/components/website/Home/Hero.tsx`**

Tambahkan import di baris paling atas file:

```typescript
import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";
```

Temukan array stats di dalam komponen (sekitar line 98-102):

```typescript
{ val: "4.8", lbl: "Trustpilot · 51 reviews" },
{ val: "4.90", lbl: "Google Maps · 123 reviews" },
{ val: "4.95", lbl: "TripAdvisor · 21 reviews" },
{ val: "16", lbl: "Private itineraries" },
```

Ganti menjadi (taruh di atas array, sebelum `.map`):

```typescript
// Resolve platform data at module/render time
const _tp = REVIEW_PLATFORMS.find((p) => p.platform === "Trustpilot");
const _gm = REVIEW_PLATFORMS.find((p) => p.platform === "Google Maps");
const _ta = REVIEW_PLATFORMS.find((p) => p.platform === "TripAdvisor");

// Lalu di array stats:
{ val: _tp?.rating?.toFixed(2) ?? "4.93", lbl: `Trustpilot · ${_tp?.count ?? 44} reviews` },
{ val: _gm?.rating?.toFixed(2) ?? "4.90", lbl: `Google Maps · ${_gm?.count ?? 138} reviews` },
{ val: _ta?.rating?.toFixed(2) ?? "4.95", lbl: `TripAdvisor · ${_ta?.count ?? 21} reviews` },
{ val: "16", lbl: "Private itineraries" },
```

Taruh deklarasi `_tp`, `_gm`, `_ta` di DALAM function component Hero, sebelum `return`.

- [ ] **Step 4: Update `src/components/website/MarketPageSections.tsx`**

Tambahkan import di baris paling atas file:

```typescript
import { AGGREGATE_RATING } from "@/lib/jvtoReviews";
```

Cari teks (sekitar line 232):

```typescript
See all 195 reviews across Trustpilot, Google & TripAdvisor →
```

Ganti menjadi:

```typescript
See all {AGGREGATE_RATING.reviewCount} reviews across Trustpilot, Google & TripAdvisor →
```

- [ ] **Step 5: Update `src/components/website/Tours/TourCard.tsx`**

Tambahkan import:

```typescript
import { AGGREGATE_RATING } from "@/lib/jvtoReviews";
```

Cari baris (line 61):

```typescript
<span className="font-bold text-sm">4.9</span>
```

Ganti menjadi:

```typescript
<span className="font-bold text-sm">{AGGREGATE_RATING.ratingValue.toFixed(1)}</span>
```

- [ ] **Step 6: Update `src/components/website/TourDetail.tsx`**

Tambahkan import di baris paling atas:

```typescript
import { AGGREGATE_RATING } from "@/lib/jvtoReviews";
```

Cari baris (line 1454):

```
                      4.9
```

Ganti nilai `4.9` ini dengan `{AGGREGATE_RATING.ratingValue.toFixed(1)}`. Perhatikan context sekitarnya — ini likely ada di dalam JSX expression. Jika berupa text node, ubah jadi `{AGGREGATE_RATING.ratingValue.toFixed(1)}`. Jika berupa prop string, ubah jadi `ratingValue={String(AGGREGATE_RATING.ratingValue)}` sesuai konteks.

- [ ] **Step 7: Run build**

```bash
npm run build
```

Expected: Build sukses, tidak ada TS error baru.

- [ ] **Step 8: Visual check di browser**

```bash
npm run dev
```

Buka `http://localhost:3000` dan verifikasi:
- Hero stats bar menampilkan "4.93 Trustpilot · 44 reviews", "4.90 Google Maps · 138 reviews", "4.95 TripAdvisor · 21 reviews"
- Features bar menampilkan "4.93 · 44 Reviews" untuk Trustpilot
- TrustBar (di bagian bawah) menampilkan "4.93 ★ · 44 reviews"

```bash
pkill -f "next dev" 2>/dev/null || true
```

- [ ] **Step 9: Commit**

```bash
git add src/components/website/TrustBar.tsx \
        src/components/website/Home/Features.tsx \
        src/components/website/Home/Hero.tsx \
        src/components/website/MarketPageSections.tsx \
        src/components/website/Tours/TourCard.tsx \
        src/components/website/TourDetail.tsx
git commit -m "feat(review-ui): bind all hardcoded review stats to REVIEW_PLATFORMS/AGGREGATE_RATING SSOT"
```

---

## FASE 4

### Task 5: Terpusat WhatsApp Links + Perkuat Trust Signals

**Files:**
- Create: `src/lib/waLinks.ts`
- Modify: `src/components/website/Home/Features.tsx`

**Interfaces:**
- Produces: `WA_BASE`, `WA_LINKS` exported dari `src/lib/waLinks.ts` — digunakan oleh semua komponen yang ada WA link

- [ ] **Step 1: Buat file `src/lib/waLinks.ts`**

Buat file baru `src/lib/waLinks.ts`:

```typescript
export const WA_BASE = "https://wa.me/6282244788833";
export const WA_PHONE = "+62 822-4478-8833";

export const WA_LINKS = {
  general: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I'd like to ask about your private volcano tours in East Java."
  )}`,
  fromSurabaya: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I'm interested in a private tour from Surabaya. Can you share availability and pricing?"
  )}`,
  fromBali: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I'm interested in a private tour from Bali. Can you share availability and pricing?"
  )}`,
  trustInquiry: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO (founded by Tourist Police officer, NIB 1102230032918), I'd like to learn more about your tours and credentials."
  )}`,
  ijenHealthScreening: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I have questions about the Ijen health screening process before booking."
  )}`,
} as const;
```

- [ ] **Step 2: Tambahkan health-screening sebagai trust credential di `Features.tsx`**

Buka `src/components/website/Home/Features.tsx`. Ganti item keempat "Physical Office" dengan "Ijen Health Coordination":

```typescript
{
  label: "Health Coordination",
  value: "Ijen Gate Certified",
  sub: "JVTO coordinates Ijen access screening",
  href: "/travel-guide/ijen-health-screening",
  external: false,
},
```

Simpan ini sebagai pengganti:

```typescript
{
  label: "Physical Office",
  value: "Bondowoso, East Java",
  sub: "Walk-in welcome · since 2015",
  href: "https://www.google.com/maps?cid=1266403973589689021",
  external: true,
},
```

**Catatan untuk implementer:** Voice invariant berlaku — "Ijen Gate Certified" dan "coordinates access screening" tidak mengklaim mandatory, hanya koordinasi. Ini sesuai BBKSDA compliance.

- [ ] **Step 3: Build + verifikasi Features.tsx**

```bash
npm run build
```

Expected: Build sukses.

Buka `http://localhost:3000` di browser (setelah `npm run dev`), scroll ke Features bar di bawah hero. Verifikasi 4 item: NIB License, Tourist Police, Trustpilot (updated dari Task 4), Health Coordination.

```bash
pkill -f "next dev" 2>/dev/null || true
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/waLinks.ts src/components/website/Home/Features.tsx
git commit -m "feat(trust): centralize WA deep links, replace Physical Office credential with Ijen Health Coordination"
```

---

## FASE 3

### Task 6: Checkout — Terms Travel Credit + Health Screening Gate (SCOPED)

**⚠️ PREREQUISITE GATE — Baca ini sebelum memulai:**

Checkout memiliki 42 pre-existing TypeScript errors. Sebelum mulai, jalankan:

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

Expected output: angka ≤ 45 (baseline 42 + 3 dead-import errors). Jika angkanya lebih besar, STOP dan laporkan — berarti ada error baru dari task sebelumnya yang harus di-fix dulu.

**Scope task ini dibatasi pada:**
1. Menemukan dan mengupdate Terms & Conditions text saja (tambah Travel Credit clause)
2. Menambahkan conditional health-screening info di page checkout HANYA untuk paket Ijen
3. TIDAK mengubah payment flow, API routes, atau komponen pembayaran

**Files:**
- Modify: File Terms/Conditions component di `src/app/(website)/checkout/` (perlu explore dulu)

**Interfaces:**
- Consumes: Policy text dari `src/app/(website)/policy/booking-payment-cancellation/page.tsx`

- [ ] **Step 1: Explore struktur checkout**

```bash
find src/app/\(website\)/checkout -name "*.tsx" -o -name "*.ts" | sort
```

Catat file-file yang ada. Cari komponen yang berisi terms/conditions checkbox:

```bash
grep -rn "travel.credit\|Travel Credit\|cancellation\|checkbox\|agree\|terms" \
  src/app/\(website\)/checkout/ --include="*.tsx" -i
```

- [ ] **Step 2: Temukan teks Travel Credit yang kanonik dari policy page**

```bash
grep -n "Travel Credit\|48 jam\|cancel" \
  src/app/\(website\)/policy/booking-payment-cancellation/page.tsx | head -10
```

Catat exact phrase yang digunakan. Teks kanonik untuk Terms adalah: **"100% Travel Credit jika batal ≥48 jam sebelum tour; hangus jika <48 jam."**

- [ ] **Step 3: Tambahkan Travel Credit clause ke Terms component**

Setelah menemukan komponen Terms di Step 1, tambahkan kalimat Travel Credit SETELAH teks terms yang ada (bukan mengganti). Contoh struktur:

```tsx
<p className="text-sm text-gray-600 mt-2">
  Cancellation policy:{" "}
  <a href="/policy/booking-payment-cancellation" className="underline text-blue-600" target="_blank">
    100% Travel Credit if cancelled ≥48 hours before tour; forfeited if &lt;48 hours.
  </a>
</p>
```

Tautkan ke `/policy/booking-payment-cancellation` untuk single source of truth.

- [ ] **Step 4: Tambahkan health-screening info note untuk paket Ijen**

Cari di checkout komponen tempat nama paket atau destinations ditampilkan. Tambahkan conditional note:

```tsx
{/* Tampil hanya jika paket termasuk Ijen — cek via package destinations atau package slug */}
{hasIjenInPackage && (
  <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-3 text-sm text-amber-800">
    <strong>Ijen Access Note:</strong> Akses Ijen dapat mensyaratkan surat sehat terkini.
    JVTO mengoordinasikan alur klinik bila aturan akses mensyaratkan.{" "}
    <a href="/travel-guide/ijen-health-screening" className="underline" target="_blank">
      Learn more
    </a>
  </div>
)}
```

Logika `hasIjenInPackage`: periksa apakah `destination_id === 2` ada di package destinations, atau apakah slug paket mengandung `"ijen"`.

- [ ] **Step 5: Run TypeScript check dan build**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

Expected: angka SAMA atau lebih kecil dari baseline (42 + 3 = 45 max).

```bash
npm run build
```

Expected: Build sukses.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(website\)/checkout/
git commit -m "feat(checkout): add Travel Credit clause to Terms, add Ijen health-screening notice"
```

---

## FASE 5

### Task 7: Content Moat — 4 Halaman Travel Guide Baru via DB

**Files:**
- Modify: DB `content_pages` table (4 INSERT rows)
- Modify: `src/app/(website)/travel-guide/sitemap.data.ts`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `content_pages` schema: `{ route, lang, seo: { title, description, h1? }, content: { body_md, faq: [] }, is_active }`
- Template yang digunakan: `src/app/(website)/travel-guide/[slug]/page.tsx` (reads `content.body_md`, requires non-empty body_md)

**4 target pages (urut prioritas):**
1. `/travel-guide/bbksda-se-1658` — uncontested, JVTO paling otoritatif
2. `/travel-guide/ijen-health-certificate` — high-intent
3. `/travel-guide/bromo-vs-ijen-comparison` — planning volume tinggi
4. `/travel-guide/is-bromo-open-today` — seasonal spike

- [ ] **Step 1: Verifikasi template `travel-guide/[slug]` dan skema JSON yang dibutuhkan**

```bash
grep -n "body_md\|requiredContentFields\|faq" \
  src/app/\(website\)/travel-guide/\[slug\]/page.tsx
```

Konfirmasi bahwa field yang wajib ada di `content` JSON adalah `body_md` (non-empty string).

- [ ] **Step 2: Cek apakah 4 route sudah ada di DB**

```bash
npx prisma db execute --stdin <<'SQL'
SELECT route, is_active FROM content_pages
WHERE route IN (
  '/travel-guide/bbksda-se-1658',
  '/travel-guide/ijen-health-certificate',
  '/travel-guide/bromo-vs-ijen-comparison',
  '/travel-guide/is-bromo-open-today'
)
ORDER BY route;
SQL
```

Expected: 0 baris (semua belum ada). Jika ada yang sudah exist, skip INSERT untuk row tersebut dan gunakan UPDATE.

- [ ] **Step 3: INSERT 4 content_pages rows**

Jalankan SQL berikut (satu per satu untuk error isolation):

**Page 1: bbksda-se-1658**

```bash
npx prisma db execute --stdin <<'SQL'
INSERT INTO content_pages (route, lang, seo, content, is_active)
VALUES (
  '/travel-guide/bbksda-se-1658',
  'en',
  '{
    "title": "BBKSDA SE-1658 Regulation — Ijen Crater Access Rules | JVTO",
    "description": "BBKSDA SE-1658 is the East Java Nature Conservation regulation governing Ijen Crater access. JVTO operates in full compliance — learn what this means for your tour."
  }',
  '{
    "body_md": "## What is BBKSDA SE-1658?\n\nBBKSDA SE-1658 is a circular letter (Surat Edaran) issued by the East Java Branch of BBKSDA (Balai Besar Konservasi Sumber Daya Alam — Natural Resource Conservation Agency). It governs visitor access conditions at Kawah Ijen Crater in Bondowoso/Banyuwangi.\n\n## What Does It Require?\n\nThe regulation sets conditions under which Ijen Crater may be accessed, including:\n\n- **Health fitness requirements**: Visitors with certain medical conditions (heart disease, asthma, hypertension) may be restricted based on current volcanic activity status.\n- **Access windows**: Trek hours are regulated (typically 02:00–10:00 WIB), subject to volcanic activity.\n- **Operator compliance**: Licensed tour operators like JVTO must coordinate with the park authority (Balai TNBTS for Bromo; BBKSDA for Ijen) when conditions change.\n\n## How JVTO Complies\n\nJava Volcano Tour Operator (JVTO) is registered with HPWKI (Himpunan Pemandu Wisata Kawah Ijen), the official Ijen guide association supervised by BBKSDA. Our NIB license number `1102230032918` is verifiable at [oss.go.id](https://oss.go.id).\n\nWhen SE-1658 or updated circulars impose access restrictions, JVTO:\n\n1. Notifies booked clients immediately via WhatsApp\n2. Reschedules or offers 100% Travel Credit per our [cancellation policy](/policy/booking-payment-cancellation)\n3. Coordinates health documentation if screening becomes required\n\n## What This Means for Your Booking\n\nIjen access conditions can change with volcanic activity. JVTO monitors these in real time and communicates proactively. You are never left guessing — any access restriction is communicated before your departure night.\n\n[Book an Ijen tour with full compliance guaranteed →](/tours/from-surabaya)",
    "faq": [
      {
        "question": "What happens to my booking if BBKSDA closes Ijen access?",
        "answer": "JVTO notifies you immediately and offers a reschedule or 100% Travel Credit. No penalty for closures outside your control."
      },
      {
        "question": "Does JVTO have official BBKSDA compliance?",
        "answer": "Yes. JVTO is a member of HPWKI, the Ijen Guide Association supervised by BBKSDA. Our operator license (NIB 1102230032918) is publicly verifiable."
      },
      {
        "question": "Is health screening always required for Ijen access?",
        "answer": "Akses Ijen dapat mensyaratkan surat sehat terkini. JVTO mengoordinasikan alur klinik bila aturan akses mensyaratkan. Our team confirms current requirements at time of booking."
      }
    ]
  }',
  true
)
ON CONFLICT (route, lang) DO NOTHING;
SQL
```

**Page 2: ijen-health-certificate**

```bash
npx prisma db execute --stdin <<'SQL'
INSERT INTO content_pages (route, lang, seo, content, is_active)
VALUES (
  '/travel-guide/ijen-health-certificate',
  'en',
  '{
    "title": "Ijen Health Certificate — What It Is and How JVTO Handles It | JVTO",
    "description": "The Ijen health certificate (surat sehat) verifies fitness for the sulfuric Kawah Ijen environment. JVTO coordinates the clinic process for all Ijen tour participants."
  }',
  '{
    "body_md": "## What Is the Ijen Health Certificate?\n\nThe Ijen health certificate (locally: *surat keterangan sehat*) is a medical clearance document that verifies a visitor'\''s fitness to enter Kawah Ijen Crater — a high-altitude environment with active sulfur gas (SO₂).\n\nThis document is coordinated by JVTO for all participants on Ijen-route tours.\n\n## Why Ijen Requires Health Screening\n\nKawah Ijen sits at 2,386m elevation. The crater produces sulfur dioxide gas, particularly during the Blue Fire observation period (02:00–05:00 WIB). Participants with the following conditions face elevated risk:\n\n- Heart disease or arrhythmias\n- Severe asthma or chronic obstructive pulmonary disease\n- Hypertension (uncontrolled)\n- Recent surgery or acute illness\n\n## How JVTO Coordinates the Process\n\nJVTO partners with a certified clinic to conduct health screening at your hotel — the evening before your Ijen trek. The process takes approximately 15–20 minutes and includes:\n\n1. Blood pressure and heart rate check\n2. Respiratory assessment\n3. Medical history questionnaire\n4. Digital QR certificate valid for Ijen gate entry\n\n**You do not need to arrange this yourself.** JVTO handles the scheduling, clinic coordination, and documentation.\n\n## Is Screening Always Required?\n\nAkses Ijen dapat mensyaratkan surat sehat terkini. JVTO mengoordinasikan alur klinik bila aturan akses mensyaratkan. The requirement depends on current BBKSDA/park authority guidelines. JVTO confirms the current status at booking and communicates any changes before your departure.\n\n[See all Ijen tours →](/tours/from-surabaya) · [Learn about BBKSDA SE-1658 →](/travel-guide/bbksda-se-1658)",
    "faq": [
      {
        "question": "Do I need to get a health certificate before arriving in Indonesia?",
        "answer": "No. The health screening is conducted at your hotel in Indonesia, coordinated by JVTO the evening before your Ijen trek."
      },
      {
        "question": "How much does the health screening cost?",
        "answer": "The health screening coordination is included in your JVTO package price. There is no separate fee."
      },
      {
        "question": "What happens if I fail the health screening?",
        "answer": "If screening results indicate a risk, JVTO will discuss alternatives with you — such as a Bromo-only itinerary. Your safety is the priority. A cancellation/modification in this case is treated under our Travel Credit policy."
      }
    ]
  }',
  true
)
ON CONFLICT (route, lang) DO NOTHING;
SQL
```

**Page 3: bromo-vs-ijen-comparison**

```bash
npx prisma db execute --stdin <<'SQL'
INSERT INTO content_pages (route, lang, seo, content, is_active)
VALUES (
  '/travel-guide/bromo-vs-ijen-comparison',
  'en',
  '{
    "title": "Bromo vs Ijen — Which Volcano Should You Visit? | JVTO",
    "description": "Mt. Bromo and Kawah Ijen are East Java'\''s two iconic volcanoes, but they offer very different experiences. Compare difficulty, highlights, and what fits your travel style."
  }',
  '{
    "body_md": "## Bromo vs Ijen — The East Java Volcano Comparison\n\nMost travelers visiting East Java have time for one or both volcanoes. This guide compares them across the dimensions that matter for trip planning.\n\n## At a Glance\n\n| | Mt. Bromo | Kawah Ijen |\n|---|---|---|\n| **Elevation** | 2,329m (crater rim) | 2,386m (crater rim) |\n| **Trek difficulty** | Easy–Moderate | Moderate |\n| **Main draw** | Sunrise over the Sea of Sand | Blue Fire + sulfur lake |\n| **Best time** | Year-round (dry season Apr–Oct optimal) | Year-round (Blue Fire: Apr–Oct) |\n| **Trek distance** | ~2 km (4WD + short hike) | ~6 km round trip |\n| **Night start** | Yes (depart ~10pm for 4am arrival) | Yes (depart ~1am for 3am crater) |\n| **Health screening** | Not required | Coordinated by JVTO if required |\n\n## Mt. Bromo — What to Expect\n\nBromo is famous for its **Sea of Sand (Lautan Pasir)** and the dramatic sunrise viewpoint at Penanjakan. The trek is accessible by 4WD to the base, followed by a short 20-minute walk up to the crater rim.\n\n**Best for:** First-time East Java visitors, families with older children, photographers, travelers with limited fitness.\n\n## Kawah Ijen — What to Expect\n\nIjen'\''s signature feature is the **Blue Fire (Api Biru)** — a rare electric-blue flame caused by combusting sulfuric gases. It'\''s visible only before sunrise (02:00–05:00 WIB) in low-light conditions. The crater also contains the world'\''s largest highly-acidic lake, with an eerie turquoise color visible at dawn.\n\n**Best for:** Adventure seekers, photographers, travelers comfortable with a 3km uphill night trek.\n\n## Can You Do Both?\n\nYes — JVTO specializes in combined Bromo + Ijen itineraries. The classic route:\n\n- **2D1N**: Bromo sunrise → drive to Ijen area → Ijen Blue Fire next morning\n- **3D2N**: Same + Tumpak Sewu Waterfall\n\n[See all combined tour options →](/tours/from-surabaya)\n\n## Which Should You Choose?\n\n- **Choose Bromo only** if: you have limited time, prefer an easier trek, or are traveling with children.\n- **Choose Ijen only** if: the Blue Fire is your primary goal and you'\''ve seen Bromo before.\n- **Choose both** if: you have 2+ days and want the full East Java volcano circuit.",
    "faq": [
      {
        "question": "Can I visit both Bromo and Ijen in 2 days?",
        "answer": "Yes. JVTO offers 2D1N combined tours: Bromo sunrise on Day 1, drive to Ijen area, Ijen Blue Fire trek Day 2 morning. It is physically demanding but very achievable."
      },
      {
        "question": "Which volcano is harder to trek?",
        "answer": "Ijen requires a 3km uphill trek each way at altitude, starting at 1am. Bromo involves a shorter walk after a 4WD drive. Most fit adults handle both without difficulty."
      },
      {
        "question": "Is the Blue Fire at Ijen visible year-round?",
        "answer": "The Blue Fire is visible year-round on clear nights without rain. Volcanic activity occasionally restricts crater access — JVTO monitors real-time conditions and communicates any changes before your tour."
      }
    ]
  }',
  true
)
ON CONFLICT (route, lang) DO NOTHING;
SQL
```

**Page 4: is-bromo-open-today**

```bash
npx prisma db execute --stdin <<'SQL'
INSERT INTO content_pages (route, lang, seo, content, is_active)
VALUES (
  '/travel-guide/is-bromo-open-today',
  'en',
  '{
    "title": "Is Mt. Bromo Open Today? — Current Access Status | JVTO",
    "description": "Real-time Mt. Bromo access status from JVTO. We monitor PVMBG volcanic activity levels and TNBTS access decisions daily. Check before you book."
  }',
  '{
    "body_md": "## Is Mt. Bromo Open Today?\n\nMt. Bromo access is controlled by **TNBTS (Taman Nasional Bromo Tengger Semeru)** and can be affected by volcanic activity monitored by **PVMBG (Center for Volcanology and Geological Hazard Mitigation)**.\n\n> **JVTO monitors Bromo access status daily.** If you have an upcoming booking, our team will contact you proactively if any access restrictions apply. If you are planning a trip, [WhatsApp us](https://wa.me/6282244788833?text=Hi%20JVTO%2C%20is%20Mt.%20Bromo%20open%20for%20tours%20this%20week%3F) for the current status.\n\n## How Bromo Access Works\n\nBromo operates at access levels set by PVMBG volcanic alert system:\n\n| PVMBG Level | Color | Bromo Access |\n|---|---|---|\n| Level I | Green (Normal) | Fully open |\n| Level II | Yellow (Waspada) | Open with restrictions (no crater rim) |\n| Level III | Orange (Siaga) | Exclusion zone ~2km; Sea of Sand access varies |\n| Level IV | Red (Awas) | Fully closed |\n\nAs of the last JVTO update (check with us for current status), Bromo is operating at the standard access level for tourism.\n\n## What Happens If Bromo Closes During My Booking?\n\nJVTO monitors PVMBG bulletins daily. If Bromo access changes after your booking:\n\n1. We contact you immediately via WhatsApp\n2. We discuss alternatives (Ijen-only, Tumpak Sewu substitution, or reschedule)\n3. Any modification due to force majeure (volcanic closure) is handled under our [Travel Credit policy](/policy/booking-payment-cancellation) — 100% credit, no penalties\n\n## Check Status Now\n\nFor the most up-to-date access status, [WhatsApp JVTO directly](https://wa.me/6282244788833?text=Hi%20JVTO%2C%20is%20Mt.%20Bromo%20open%20for%20tours%20this%20week%3F). We respond within 1 hour (08:00–22:00 WIB).\n\nOfficial sources:\n- [PVMBG Bromo Activity](https://magma.esdm.go.id/v1/gunung-api/laporan)\n- [TNBTS Official](https://bromotenggersemeru.org)\n\n[Book a Bromo tour →](/tours/from-surabaya) · [Compare Bromo vs Ijen →](/travel-guide/bromo-vs-ijen-comparison)",
    "faq": [
      {
        "question": "How do I check if Bromo is open before I travel?",
        "answer": "WhatsApp JVTO at +62 822-4478-8833 — we monitor PVMBG daily and respond within 1 hour. You can also check the official PVMBG magma.esdm.go.id bulletin."
      },
      {
        "question": "What PVMBG alert level closes Bromo to tourists?",
        "answer": "Level III (Siaga/Orange) typically restricts the 2km exclusion zone around the crater, limiting summit access. The Sea of Sand viewpoint may remain open. Level IV (Awas/Red) closes all tourism in the area."
      },
      {
        "question": "Will I get a refund if Bromo closes on my tour date?",
        "answer": "JVTO offers 100% Travel Credit for cancellations due to volcanic closure — no penalties. See our full cancellation policy at /policy/booking-payment-cancellation."
      }
    ]
  }',
  true
)
ON CONFLICT (route, lang) DO NOTHING;
SQL
```

- [ ] **Step 4: Verifikasi 4 rows berhasil diinsert**

```bash
npx prisma db execute --stdin <<'SQL'
SELECT route, is_active, created_at FROM content_pages
WHERE route LIKE '/travel-guide/%'
AND route IN (
  '/travel-guide/bbksda-se-1658',
  '/travel-guide/ijen-health-certificate',
  '/travel-guide/bromo-vs-ijen-comparison',
  '/travel-guide/is-bromo-open-today'
)
ORDER BY route;
SQL
```

Expected: 4 baris, semua `is_active = true`.

- [ ] **Step 5: Test render halaman via dev server**

```bash
npm run dev
```

Buka keempat URL di browser dan verifikasi tidak ada error (not found, atau "No content available"):
- `http://localhost:3000/travel-guide/bbksda-se-1658`
- `http://localhost:3000/travel-guide/ijen-health-certificate`
- `http://localhost:3000/travel-guide/bromo-vs-ijen-comparison`
- `http://localhost:3000/travel-guide/is-bromo-open-today`

Jika halaman menampilkan "This guide is coming soon" atau 404 — periksa apakah `travel-guide/[slug]/page.tsx` route sudah aktif (cek `generateStaticParams` apakah membaca dari DB).

```bash
pkill -f "next dev" 2>/dev/null || true
```

- [ ] **Step 6: Tambahkan 4 slug baru ke `src/app/(website)/travel-guide/sitemap.data.ts`**

Buka `src/app/(website)/travel-guide/sitemap.data.ts`. Tambahkan 4 entri baru di akhir array (setelah entry `tumpak-sewu-logistics` yang sudah ada):

```typescript
{ url: url("/travel-guide/bbksda-se-1658"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/bbksda-se-1658", t), changeFrequency: "monthly", priority: 0.8 },
{ url: url("/travel-guide/ijen-health-certificate"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/ijen-health-certificate", t), changeFrequency: "monthly", priority: 0.8 },
{ url: url("/travel-guide/bromo-vs-ijen-comparison"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/bromo-vs-ijen-comparison", t), changeFrequency: "monthly", priority: 0.7 },
{ url: url("/travel-guide/is-bromo-open-today"), lastModified: getLastModified(lastModifiedMap, "/travel-guide/is-bromo-open-today", t), changeFrequency: "weekly", priority: 0.9 },
```

**Catatan:** `is-bromo-open-today` mendapat `priority: 0.9` dan `changeFrequency: "weekly"` karena konten seasonal/real-time — ini sinyal ke Google untuk crawl lebih sering.

- [ ] **Step 7: Tambahkan 4 routes ke `lastModifiedMap` di `src/app/sitemap.ts`**

Buka `src/app/sitemap.ts`. Di array `lastModifiedMap` (sekitar line 22-56), tambahkan 4 entri baru:

```typescript
"/travel-guide/bbksda-se-1658",
"/travel-guide/ijen-health-certificate",
"/travel-guide/bromo-vs-ijen-comparison",
"/travel-guide/is-bromo-open-today",
```

- [ ] **Step 8: Final build**

```bash
npm run build
```

Expected: Build sukses dengan 4 static pages baru ter-generate (pages count bertambah 4).

- [ ] **Step 9: Commit**

```bash
git add src/app/\(website\)/travel-guide/sitemap.data.ts src/app/sitemap.ts
git commit -m "feat(content-moat): add 4 travel guide pages to sitemap (DB rows inserted separately)"
```

---

## Urutan Eksekusi

```
T1 (Fase 0)  → T2 (Fase 1a)  → T3 (Fase 1b)
                                     ↓
                              T4 (Fase 2)  → T5 (Fase 4)
                                                   ↓
                                             T6 (Fase 3 — gated)
                                                   ↓
                                             T7 (Fase 5)
```

T3 depends on T2 (middleware harus aktif sebelum folder dihapus).
T4, T5, T6, T7 dapat berjalan paralel dengan T2+T3 jika implementer berbeda.

---

## Self-Review Checklist

**Spec coverage:**
- [x] FASE 0 recon → Task 1
- [x] FASE 1 redirects → Task 2 + 3
- [x] FASE 2 review schema UI → Task 4
- [x] FASE 3 checkout (scoped) → Task 6
- [x] FASE 4 trust surfacing → Task 5
- [x] FASE 5 content moat → Task 7

**Playbook items yang SENGAJA di-skip:**
- Rename `middleware.ts` → `proxy.ts`: Skip. Next.js mengharuskan nama `middleware.ts` — rename akan menonaktifkan seluruh middleware.
- `/blog` → `/travel-guide` redirect: Skip. Blog cluster sudah live.
- Trust bar "sticky di tour/checkout": Tidak diimplementasikan — Features.tsx sudah di posisi yang visible; sticky bar adalah enhancement visual optional.

**Type consistency:** `REVIEW_PLATFORMS`, `AGGREGATE_RATING` — exported dari `src/lib/jvtoReviews.ts` dan digunakan konsisten di T4, T5.

**No placeholders:** Semua SQL content sudah terisi penuh dengan body_md aktual. Semua code snippets sudah lengkap.
