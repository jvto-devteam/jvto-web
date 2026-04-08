# Live Implementation Step By Step

Date: `2026-04-08`  
Active source repo: [jvto-web](/f:/New%20folder/DOWNLOADS/jvto-web)

## Tujuan Dokumen

Dokumen ini adalah runbook implementasi ke versi live berdasarkan:

- [LIVE_FRONTEND_IMPLEMENTATION_MAP.md](/f:/New%20folder/DOWNLOADS/jvto-web/LIVE_FRONTEND_IMPLEMENTATION_MAP.md)
- [LIVE_FRONTEND_IMPLEMENTATION_TECHNICAL_MAP.md](/f:/New%20folder/DOWNLOADS/jvto-web/LIVE_FRONTEND_IMPLEMENTATION_TECHNICAL_MAP.md)
- [FINAL_RECONCILIATION_MATRIX.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_MATRIX.md)
- [FINAL_RECONCILIATION_AUDIT_REPORT.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_AUDIT_REPORT.md)

Tujuan akhirnya:

1. perubahan DB yang sudah matang ikut masuk ke environment live
2. perubahan frontend di `jvto-web` ikut masuk ke codebase live
3. implementasi dilakukan berurutan, tidak acak, dan punya checkpoint verifikasi

## Prinsip Eksekusi

- Jangan patch production langsung tanpa backup.
- Jangan cherry-pick file secara acak lintas area.
- Jangan deploy code baru ke production sebelum schema dan source contract yang dibutuhkan sudah siap.
- Jangan menganggap DB live sama dengan `DB mirror`; perlakukan live DB sebagai target implementasi terpisah.
- Gunakan `jvto-web` sebagai source code of truth, bukan folder lama lain.

## Gambaran Besar Urutan Kerja

Urutan yang benar:

1. freeze dan backup
2. siapkan branch integrasi live
3. siapkan schema DB live
4. sinkronkan data DB-owned ke DB live
5. verifikasi DB live
6. port codebase frontend per layer
7. verifikasi lokal/staging
8. deploy preview/live-candidate
9. smoke test production
10. cutover

## Phase 0 — Freeze Dan Persiapan

### Step 0.1 — Freeze window implementasi

Sebelum mengubah apapun:

- tentukan window deploy
- hentikan perubahan paralel ke repo live
- pastikan hanya satu branch integrasi yang dipakai

### Step 0.2 — Backup frontend live

Kerjakan ini dulu:

- backup branch/repo live saat ini
- tag commit production terakhir
- simpan snapshot env production

Output minimum:

- satu branch/tag rollback frontend

### Step 0.3 — Backup DB live

Sebelum migrasi DB:

- backup schema production
- backup data untuk tabel yang akan disentuh

Minimal backup tabel ini:

- `content_pages`
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`
- `folders`
- `assets`
- `tags_assets`
- `crew_members`
- `destinations`
- `packages`

## Phase 1 — Siapkan Branch Integrasi Live

### Step 1.1 — Buat branch integrasi dari codebase live

Jangan implementasi di branch production langsung.

Contoh:

```powershell
git checkout -b live-integration-jvto-phase2
```

### Step 1.2 — Jadikan `jvto-web` sebagai referensi tunggal implementasi

Selama porting:

- source kode = [jvto-web](/f:/New%20folder/DOWNLOADS/jvto-web)
- jangan ambil dari `JVTO-Why-JVTO-Next15`
- jangan ambil dari `jvto-web-baseline-20260401`

## Phase 2 — Siapkan DB Live Dulu

Tujuan fase ini:

- production/live DB siap menerima frontend baru
- source-owned data sudah ada
- schema tidak tertinggal dari codebase

### Step 2.1 — Audit schema live terhadap kebutuhan final

Cek apakah DB live sudah punya struktur yang dibutuhkan.

Minimal cek tabel:

- `crew_members`
- `destinations`
- `packages`
- `assets`
- `content_pages`
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`

Referensi teknis:

- [FINAL_RECONCILIATION_AUDIT_REPORT.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_AUDIT_REPORT.md)
- [prisma/schema.prisma](/f:/New%20folder/DOWNLOADS/jvto-web/prisma/schema.prisma)

### Step 2.2 — Terapkan schema delta `crew_members`

Ini schema change yang wajib kalau live DB belum punya field berikut:

- `ssot_id`
- `ssot_numeric_id`
- `role_label`
- `archetype`
- `archetype_tags`
- `knows_about`
- `evidence_review_quotes`
- `forensic_evidence`
- `social_links`
- `internal_contact`
- `profile_snapshot`
- `known_for`
- `operating_style`
- `self_quote`
- `ssot_payload`

Referensi:

- [prisma/schema.prisma](/f:/New%20folder/DOWNLOADS/jvto-web/prisma/schema.prisma)
- [LIVE_FRONTEND_IMPLEMENTATION_TECHNICAL_MAP.md](/f:/New%20folder/DOWNLOADS/jvto-web/LIVE_FRONTEND_IMPLEMENTATION_TECHNICAL_MAP.md)

### Step 2.3 — Sinkronkan data DB-owned ke DB live

Domain yang harus dipastikan ada di DB live:

- `content_pages`
- `category_faqs`
- `faqs`
- `site_identity`
- `organization_profile`
- `assets_inventory` dan proof assets
- `press_coverage`
- `partner_network`
- `crew_registry`
- `destinations`
- `package editorial doctrine`

### Step 2.4 — Gunakan executor final sebagai basis sync

Pakai file ini sebagai basis:

- [scripts/reconcile-final-matrix.js](/f:/New%20folder/DOWNLOADS/jvto-web/scripts/reconcile-final-matrix.js)

Yang harus dilakukan:

1. salin script itu ke branch integrasi live
2. arahkan `DATABASE_URL` ke DB live, bukan `jvto_dev`
3. pastikan source file [JVTO_SSOT_v4_0_CLEAN.json](/f:/New%20folder/DOWNLOADS/jvto-web/JVTO_SSOT_v4_0_CLEAN.json) ikut tersedia
4. jalankan script ke DB live

Catatan:

- kalau DB live tidak sama dengan mirror, jangan langsung asumsi semua row identik
- bila perlu, jalankan dulu ke staging copy dari DB live

### Step 2.5 — Verifikasi DB live setelah sync

Minimal yang harus diverifikasi:

- `assets_inventory` matched penuh
- route partner verification ada
- route `press-recognition` ada
- `crew_members` SSOT rows terisi
- `destinations` 9 row target ter-update
- `packages` publish rows punya editorial fields

Gunakan query/query pattern yang didokumentasikan di:

- [FINAL_RECONCILIATION_AUDIT_REPORT.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_AUDIT_REPORT.md)

Kalau DB live lolos titik ini, baru lanjut ke frontend.

## Phase 3 — Port Layer Fondasi Frontend

Tujuan fase ini:

- pindahkan dependency inti dulu
- hindari mem-port page tanpa helper/source layer yang mendukungnya

### Step 3.1 — Port root/tooling dan config dasar

Port lebih dulu:

- [scripts/deploy-preview.ps1](/f:/New%20folder/DOWNLOADS/jvto-web/scripts/deploy-preview.ps1)
- [.gitignore](/f:/New%20folder/DOWNLOADS/jvto-web/.gitignore)

Kenapa duluan:

- deploy path dan generated files behavior harus konsisten

### Step 3.2 — Port helper source/core layer

Port file ini lebih dulu:

- [src/lib/site.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/site.ts)
- [src/lib/homepage/homepageDoctrine.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/homepage/homepageDoctrine.ts)
- [src/lib/packages/packagePaths.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/packagePaths.ts)
- [src/lib/packages/tourFamily.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/tourFamily.ts)
- [src/lib/packages/priceTiers.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/priceTiers.ts)
- [src/lib/packages/paymentPolicy.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/paymentPolicy.ts)
- [src/lib/packages/checkoutPricingContract.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/checkoutPricingContract.ts)
- [src/lib/packages/packageDoctrine.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/packageDoctrine.ts)
- [src/lib/packages/bookingConfidence.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/bookingConfidence.ts)

Kenapa duluan:

- page dan component setelah ini bergantung pada helper tersebut

### Step 3.3 — Port content/SEO/entity layer

Port file ini sebelum route pages:

- [src/lib/content/pinnedContentOverrides.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content/pinnedContentOverrides.ts)
- [src/lib/content/getContentPage.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content/getContentPage.ts)
- [src/lib/content/getPageSeo.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content/getPageSeo.ts)
- [src/lib/content/siteIdentityDefaults.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content/siteIdentityDefaults.ts)
- [src/lib/content/organizationProfileDefaults.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content/organizationProfileDefaults.ts)
- [src/lib/content/whyJvtoSsotFallback.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/content/whyJvtoSsotFallback.ts)
- [src/lib/seo/jsonld/builders.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/seo/jsonld/builders.ts)
- [src/lib/seo/jsonld/normalize.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/seo/jsonld/normalize.ts)

Kenapa duluan:

- homepage, trust pages, tours hubs, dan package pages memakai layer ini

### Step 3.4 — Port Prisma contract

Port:

- [prisma/schema.prisma](/f:/New%20folder/DOWNLOADS/jvto-web/prisma/schema.prisma)

Lalu generate ulang Prisma client di repo live:

```powershell
npx prisma generate
```

Kalau live repo memang commit generated client:

- bawa juga [src/generated/prisma](/f:/New%20folder/DOWNLOADS/jvto-web/src/generated/prisma)

## Phase 4 — Port Cluster Frontend Per Area

### Step 4.1 — Homepage cluster

Port satu cluster sekaligus:

- [src/app/(website)/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/page.tsx)
- [src/components/website/Home/Hero.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/Hero.tsx)
- [src/components/website/Home/FeaturedToursClient.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/FeaturedToursClient.tsx)
- [src/components/website/Home/HomeAuthorityReality.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/HomeAuthorityReality.tsx)
- [src/components/website/Home/HomeTrustGateway.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/HomeTrustGateway.tsx)
- [src/components/website/Home/TravelGuideTeaser.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/TravelGuideTeaser.tsx)
- [src/components/website/Home/HomeFinalCta.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/HomeFinalCta.tsx)
- [src/components/website/Home/HomeDifferentiators.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/HomeDifferentiators.tsx)
- [src/components/website/Home/WhyJVTO.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Home/WhyJVTO.tsx)

Kenapa satu cluster:

- homepage sekarang bergantung pada doktrin baru dan urutan module baru

### Step 4.2 — Tours hubs dan card layer

Port:

- [src/app/(website)/tours/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/tours/page.tsx)
- [src/app/(website)/tours/from-surabaya/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/tours/from-surabaya/page.tsx)
- [src/app/(website)/tours/from-bali/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/tours/from-bali/page.tsx)
- [src/components/website/Tours/ToursHubIntro.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Tours/ToursHubIntro.tsx)
- [src/components/website/Tours/ToursSupportGrid.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Tours/ToursSupportGrid.tsx)
- [src/components/website/Tours/ToursCatalogShell.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Tours/ToursCatalogShell.tsx)
- [src/components/website/Tours/ToursFamilyGuide.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Tours/ToursFamilyGuide.tsx)
- [src/components/website/ToursPageClient.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/ToursPageClient.tsx)
- [src/components/website/TourCard.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/TourCard.tsx)
- [src/components/website/Tours/TourCard.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Tours/TourCard.tsx)

### Step 4.3 — Package detail + pricing cluster

Port:

- [src/components/website/TourDetail.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/TourDetail.tsx)
- [src/lib/packages/webTourList.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/webTourList.ts)
- [src/lib/packages/webTourDetail.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/packages/webTourDetail.ts)
- [src/app/(website)/tours/from-surabaya/[slug]/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/tours/from-surabaya/%5Bslug%5D/page.tsx)
- [src/app/(website)/tours/from-bali/[slug]/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/tours/from-bali/%5Bslug%5D/page.tsx)
- [src/app/(website)/tours/student-package/[slug]/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/tours/student-package/%5Bslug%5D/page.tsx)
- [src/app/(api)/api/tours-feed/route.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28api%29/api/tours-feed/route.ts)

### Step 4.4 — Checkout/payment cluster

Port satu paket:

- [src/app/(website)/checkout/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/checkout/page.tsx)
- [src/app/(website)/my-booking/[slug]/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/my-booking/%5Bslug%5D/page.tsx)
- [src/app/(api)/api/checkout/route.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28api%29/api/checkout/route.ts)
- [src/app/(api)/api/checkout/route-main.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28api%29/api/checkout/route-main.ts)
- [src/app/(api)/api/checkout/bank-transfer/route.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28api%29/api/checkout/bank-transfer/route.ts)
- [src/app/(api)/api/booking/pay-balance/route.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28api%29/api/booking/pay-balance/route.ts)

### Step 4.5 — Trust/support/proof cluster

Port:

- [src/lib/trust/trustSupportDoctrine.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/trust/trustSupportDoctrine.ts)
- [src/app/(website)/why-jvto/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/why-jvto/page.tsx)
- [src/app/(website)/why-jvto/[...slug]/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/why-jvto/%5B...slug%5D/page.tsx)
- [src/app/(website)/verify-jvto/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/verify-jvto/page.tsx)
- [src/app/(website)/verify-jvto/legal/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/verify-jvto/legal/page.tsx)
- [src/app/(website)/verify-jvto/police-safety/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/verify-jvto/police-safety/page.tsx)
- [src/app/(website)/verify-jvto/press-recognition/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/verify-jvto/press-recognition/page.tsx)
- [src/app/(website)/verify-jvto/history-artifacts/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/verify-jvto/history-artifacts/page.tsx)
- [src/app/(website)/travel-guide/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/travel-guide/page.tsx)
- [src/app/(website)/travel-guide/[slug]/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/travel-guide/%5Bslug%5D/page.tsx)
- [src/app/(website)/travel-guide/faq/page.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/app/%28website%29/travel-guide/faq/page.tsx)
- [src/lib/faq-data.ts](/f:/New%20folder/DOWNLOADS/jvto-web/src/lib/faq-data.ts)

### Step 4.6 — Navigation and shared UI

Port:

- [src/components/website/Navbar.tsx](/f:/New%20folder/DOWNLOADS/jvto-web/src/components/website/Navbar.tsx)

Kenapa di akhir:

- label dan links harus mengikuti route cluster yang sudah selesai diport

## Phase 5 — Cleanup File Lama Di Repo Live

Setelah cluster baru masuk, baru bersihkan file lama yang bertentangan.

Hapus file duplicate/legacy bila memang masih ada di repo live:

- `page copy.tsx`
- `page_old.tsx`
- `page_ssot.tsx`

Cluster yang harus dicek:

- `why-jvto`
- `travel-guide`

Kalau masih ada komponen legacy tak dipakai, cocokkan dengan map teknis sebelum dihapus.

## Phase 6 — Verifikasi Lokal/Staging

### Step 6.1 — Generate Prisma client

```powershell
npx prisma generate
```

### Step 6.2 — Jalankan build

```powershell
npm run build
```

Harus lolos sebelum deploy.

### Step 6.3 — Verifikasi route kritikal

Minimal cek:

- `/`
- `/tours`
- `/tours/from-surabaya`
- `/tours/from-bali`
- satu detail package Surabaya
- satu detail package Bali
- `/why-jvto`
- satu route nested `why-jvto`
- `/verify-jvto`
- `/verify-jvto/legal`
- `/verify-jvto/press-recognition`
- `/travel-guide`
- `/travel-guide/faq`
- `/checkout`

### Step 6.4 — Verifikasi data kritikal

Cek secara visual dan data:

- card/tour detail pakai pricing tier yang benar
- checkout tidak menerima drift payload
- partner/press proof routes hidup
- FAQ tidak kosong
- founder/site identity benar
- destination pages yang published punya SEO/summary yang benar

## Phase 7 — Preview / Live Candidate Deploy

### Step 7.1 — Siapkan env

Minimal yang harus benar:

- `DATABASE_URL`
- site URL / public URL vars
- auth vars yang sudah dipakai live
- legacy URL vars yang masih dipakai flow checkout lama, jika masih relevan

### Step 7.2 — Deploy preview candidate

Jangan deploy production dulu.

Deploy preview/live-candidate dengan env production-like.

### Step 7.3 — Smoke test preview

Cek ulang route kritikal yang sama seperti phase lokal/staging.

Tambahkan cek ini:

- metadata/canonical
- proof routes
- package pricing by pax
- checkout API flow
- my-booking summary

## Phase 8 — Production Cutover

### Step 8.1 — Go / no-go checklist

Production hanya boleh jalan jika:

- DB live schema sudah benar
- DB live data domains sudah tersinkron
- build lolos
- preview lolos
- smoke test route kritikal lolos

### Step 8.2 — Deploy production

Deploy branch integrasi ke production.

### Step 8.3 — Production smoke test

Ulangi cek cepat di production:

- homepage
- tours hubs
- two package details
- verify pages
- travel guide faq
- checkout basic flow
- structured data / canonical route kritikal

### Step 8.4 — Rollback rule

Rollback jika salah satu ini gagal:

- package detail tidak render
- pricing salah atau kembali ke single-price misleading state
- checkout drift / gagal
- trust/proof/support routes rusak
- DB contract baru menimbulkan error runtime

## Phase 9 — Setelah Production Stabil

Baru setelah stabil:

- hapus script temporary yang tidak ingin disimpan di repo live, jika memang kebijakan tim begitu
- rapikan docs internal
- dokumentasikan env/DB steps final tim live

Namun:

- jangan hapus [FINAL_RECONCILIATION_AUDIT_REPORT.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_AUDIT_REPORT.md) sebelum tim live selesai verifikasi

## Ringkasan Urutan Paling Aman

Kalau disederhanakan, urutan implementasi live yang paling aman adalah:

1. backup frontend live
2. backup DB live
3. port `prisma/schema.prisma`
4. siapkan dan jalankan `scripts/reconcile-final-matrix.js` ke DB live
5. verifikasi DB live
6. port helper/source/SEO layer
7. port homepage cluster
8. port tours/package/pricing cluster
9. port checkout/payment cluster
10. port trust/support/proof cluster
11. generate Prisma client
12. build lokal/staging
13. deploy preview candidate
14. smoke test
15. deploy production

## Referensi Pendukung

- [LIVE_FRONTEND_IMPLEMENTATION_MAP.md](/f:/New%20folder/DOWNLOADS/jvto-web/LIVE_FRONTEND_IMPLEMENTATION_MAP.md)
- [LIVE_FRONTEND_IMPLEMENTATION_TECHNICAL_MAP.md](/f:/New%20folder/DOWNLOADS/jvto-web/LIVE_FRONTEND_IMPLEMENTATION_TECHNICAL_MAP.md)
- [FINAL_RECONCILIATION_MATRIX.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_MATRIX.md)
- [FINAL_RECONCILIATION_AUDIT_REPORT.md](/f:/New%20folder/DOWNLOADS/jvto-web/FINAL_RECONCILIATION_AUDIT_REPORT.md)
- [TEAM_MASTER_HANDOFF_SESSION.md](/f:/New%20folder/DOWNLOADS/jvto-web/TEAM_MASTER_HANDOFF_SESSION.md)
