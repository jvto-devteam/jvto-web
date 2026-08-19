# Caveman Review — Arsitektur Data & CTA (jvto-web)

**Tanggal:** 2026-08-19
**HEAD saat audit:** `a8cec4e` (branch `claude/caveman-review-data-architecture-4u4n85`)
**Metodologi:** 3 agent eksplorasi read-only paralel (peta truth-path data/schema, peta arsitektur CTA/komponen, survei repo `jvto-itinerary-core`) + verifikasi manual langsung (grep/read) atas klaim-klaim yang berdampak besar, sebelum laporan ini ditulis.

---

## Catatan kritis sebelum membaca lebih lanjut

**`CLAUDE.md` di repo ini sudah tidak akurat untuk sebagian besar bagian "Data Layer", "Prisma Models", dan "FAQ Source Resolver".** ini bukan drift dokumentasi kecil — ini menentukan apa yang "benar" untuk seluruh rekomendasi di bagian C dan D di bawah, jadi harus dibaca duluan.

Per commit `a8cec4e` (hari ini), `jvto-web` sudah menjalani migrasi penuh dari arsitektur konten berbasis Prisma/DB ke arsitektur **ekosistem-first** (layanan konten eksternal `jvto-ekosistem`, dibaca lewat adapter `src/lib/ecosystemContent/*.ts`). Migrasi ini tidak tercatat di CLAUDE.md sama sekali. Bukti yang diverifikasi langsung (bukan cuma laporan agent):

- `src/lib/packages/getWebPackageDetail.ts`, `getWebPackagesList.ts`, `src/lib/destinations/getWebDestinationDetail.ts`, `getWebDestinationsList.ts` — helper yang didokumentasikan CLAUDE.md sebagai pola kanonis "Server Components → Direct Helpers" — **seluruh direktori `src/lib/packages/` dan `src/lib/destinations/` sudah tidak ada.** Halaman PDP tur sekarang import dari `src/lib/ecosystemContent/tourPackageDetail.ts`.
- `prisma.packages` / `prisma.destinations` sekarang praktis hanya punya **satu** call site aktif di seluruh aplikasi (`src/app/(website)/my-booking/[slug]/page.tsx:78`) — turun drastis dari perannya sebagai sumber data utama setiap halaman tur/destinasi.
- `resolveFaqsForPage()`, `CANONICAL_FAQ_REGISTRY`, `homepageFaqs.ts`, `verifyFaqs.ts`, `travelGuideBestTimeFaqs.ts`, panel admin CMS (dihapus di commit `dcd58df`), dan jalur baca Prisma `narrative_claims`/`content_pages` — semuanya sudah dihapus atau jadi orphan.
- `entityGraph.ts`'s `ORGANIZATION_SCHEMA` didokumentasikan sendiri di header filenya sebagai fallback/referensi saja, **tidak pernah** di-inject ke halaman manapun — bertentangan langsung dengan tabel registry di CLAUDE.md.
- Feed publik review REST/XML (`/api/review`, `/api/review/stats`, `/api/review/preview`, `/api/reviews-xml`) adalah satu-satunya bagian yang masih 100% berbasis Prisma — dan satu-satunya mekanisme sync-nya (`sync-google-reviews.yml` + `/api/review/sync-google`) dihapus di commit `a6275ce`, sehingga sekarang jadi basi diam-diam selamanya, tanpa jalur refresh tersisa.

Implikasi: siapapun yang mengikuti CLAUDE.md apa adanya untuk kerja berikutnya akan menyasar kode yang sudah mati. Bagian A di bawah memetakan sistem **yang sebenarnya berjalan**, bukan yang didokumentasikan.

---

## A. Peta arsitektur data saat ini

### A.1 Konten FAQ

**Sumber yang bisa menghasilkan FAQ:**
- Payload `json_ld` per-halaman dari ekosistem (`src/lib/ecosystemContent/schema.ts:35-56`, `getEcosystemPageSchema`)
- `tourFaqs.ts` — satu-satunya file `*Faqs.ts` kanonis yang **masih hidup** (`src/lib/tourFaqs.ts:34-60`)
- `narrative-claims.json` ekosistem via `pickTourRelevantClaims` (`src/lib/ecosystemContent/narrativeClaims.ts:1-89`)
- `faqs[]` level-paket dari ekosistem (`data.product.faqs`, PDP tur)
- `content_pages.content.faq` sebagai fallback CMS di dalam `PageJsonLdCombined` (`buildFaqJsonLdFromContent`, `src/lib/seo/jsonld/builders.ts:432-447`) — tapi `pageRow` sekarang **bukan** dari DB lagi (lihat A.4), jadi cabang ini membaca apapun yang diisi adapter halaman ekosistem, bukan hasil edit admin CMS

**Precedence aktual (bukan yang diklaim CLAUDE.md):** `resolveFaqsForPage()` — fungsi yang didokumentasikan CLAUDE.md sebagai "single source of truth" FAQ — **dihapus 2026-08-18**. `src/lib/content/resolveFaqs.ts:7-16` menyatakan sendiri: 6 caller terakhirnya (homepage + 5 halaman verify-jvto) sudah lebih dulu diam-diam ditimpa oleh cabang ekosistem-first di `PageJsonLdCombined`, sehingga menghapusnya "tidak mengubah apapun yang teramati." Hanya `buildResolvedFaqSchema` yang selamat, dipakai persis di 2 halaman: `src/app/(website)/markets/malaysia/page.tsx:33-36` dan `.../singapore/page.tsx:33-36` — keduanya diberi `content.faqs` dari `getEcosystemMarket()`, dengan label `source: "canonical"` yang sekarang jadi enum tag sisa tanpa `CANONICAL_FAQ_REGISTRY` di baliknya.

Precedence nyata sekarang **per tipe halaman**, bukan satu resolver global:
- Mayoritas halaman (25 halaman, lihat A.3): `PageJsonLdCombined.tsx:132-174` — kalau `getEcosystemPageSchema(route)` mengembalikan graph, itu langsung menang, cabang DB/CMS (baris 176-218) tidak pernah dieksekusi
- PDP tur: komposisi 3-arah di dalam app — `buildTourFaqSchema({tour, fullData, narrativeClaims, reviewProfiles})` (`src/app/(website)/tours/from-bali/[slug]/page.tsx:458-471`) menggabungkan spine `tourFaqs.ts` + narrative claims ekosistem + FAQ paket ekosistem. Tidak ada DB, tidak ada CMS, tidak ada `suppressCmsFaq` — halaman ini bahkan tidak memanggil `PageJsonLdCombined` sama sekali

**Konflik/drift:**
- CLAUDE.md (baris 71, 75-101) mendokumentasikan precedence 3-tingkat DB→hardcoded→CMS yang sudah tidak punya backing kode sama sekali
- Prop `suppressCmsFaq` (`PageJsonLdCombined.tsx:125,129,181-183`) masih ada dan didokumentasikan sebagai mencegah double-emission FAQPage, tapi karena cabang ekosistem return lebih dulu, prop ini hanya relevan di jalur fallback (ekosistem tidak terjangkau) — guard mode-darurat, bukan mekanisme sehari-hari seperti yang digambarkan dokumentasi

### A.2 Review & rating

Ada **3 pipeline independen yang tidak saling sinkron:**

**(a) Aggregate rating** — `getPublicAggregateRating()` (`src/lib/publicContent/getAggregateRating.ts:43-66`): profil "Google Maps" dari `review-platforms.json` ekosistem jadi PRIMARY, `prisma.review_stats` (`getGoogleReviewStats`) jadi fallback-only. Precedence dibalik 2026-08-19 (commit `48adb4b`); 5 call site (homepage, 2 halaman PDP tur, `/verify-jvto`, `/api/product/[slug]`) sudah dialihkan lewat wrapper ini.

**(b) Konten review individual / node JSON-LD `Review`** — `getReviewsForSchema()` (`src/lib/queries/schemaReviews.ts:21-43`) → `getEcosystemReviews()` (`src/lib/ecosystemContent/reviews.ts:112-115`), 100% ekosistem, nol Prisma. `GoogleReviewsCarousel` dan `/why-jvto/reviews/[id]` juga sudah 100% ekosistem.

**(c) API REST review publik — masih 100% Prisma, dan sekarang jadi target sync yang diam-diam yatim.** `src/lib/publicContent/reviewApiSnapshot.ts` menjalankan `prisma.reviews.findMany()` langsung, memberi data ke `/api/review`, `/api/review/stats`, `/api/review/preview`, `/api/reviews-xml`. Commit `a6275ce` menghapus satu-satunya hal yang pernah mengisi data baru ke tabel `reviews`/`review_stats`/`crew_reviews` (workflow `sync-google-reviews.yml` + route `/api/review/sync-google`, 289 baris dihapus) dengan alasan "sudah tidak ada yang baca dari Prisma" — **klaim itu salah untuk 4 route ini.** Feed-feed ini akan makin menyimpang dari angka yang tampil di halaman (yang sudah bersumber dari ekosistem) setiap hari, selamanya, tanpa ada jalur kode tersisa untuk menyegarkannya. Ini adalah truth-path break yang **hidup dan sedang berjalan**, bukan hipotetis.

Model Prisma `crew_reviews`/`crew_member_reviews`: nol caller aktif ditemukan di manapun. Pencocokan review-ke-kru sekarang ada di field ekspor ekosistem (`crewCodes: string[]`, `reviews.ts:58`) — kedua tabel penghubung Prisma ini tampak sepenuhnya orphan.

### A.3 Mekanisme emisi JSON-LD

`PageJsonLdCombined.tsx` **bukan** satu titik injeksi tunggal seperti digambarkan CLAUDE.md. Ada 3 jalur emisi yang ditulis independen, hidup berdampingan di 52 file `page.tsx` bawah `(website)/*`:

1. **`PageJsonLdCombined`** — 25 halaman (blog×3, contact, isic, markets×2, homepage, policy hub+3 sub, travel-guide hub+11 sub, trust, verify-jvto×4, why-jvto×7). Cabang ekosistem-first: `getEcosystemPageSchema(route)` (HTTP-only, **tidak** ada fallback local-first — beda dengan pola reader ekosistem lain yang selalu local-file→HTTP) → kalau ada, digabung lewat `mergeGraphNodes` (dedup per `@id`) dan guard singleton `shouldAppendRuntimeSchema` yang di-gate pada `SINGLETON_TYPES = {FAQPage, WebSite, BreadcrumbList, ProfilePage}` (`PageJsonLdCombined.tsx:57`) — **tidak termasuk `CollectionPage`**, padahal validator CI di bawah justru mengecek itu.
2. **`<JsonLd>` mentah** dengan array `@graph` yang dirakit tangan, tanpa guard dedup sama sekali — `destinations/[slug]/page.tsx`, `destinations/page.tsx`, `tours/from-bali/[slug]/page.tsx`, `tours/from-surabaya/[slug]/page.tsx`.
3. **`<StructuredData>`** (`src/components/website/StructuredData.tsx:8-18`) yang mengemisi *beberapa tag `<script>` terpisah per halaman*, bukan satu graph gabungan — `tours/page.tsx`, `tours/from-bali/page.tsx`, `tours/from-surabaya/page.tsx`, `why-jvto/reviews/[id]/page.tsx`.

Pesan commit `a8cec4e` sendiri (commit yang menambahkan validator) sudah mengonfirmasi diagnosis ini secara verbatim: "3 independently-authored emission paths with no automated check that they don't collide," dan menyebut 2 collision nyata yang sudah ditemukan manual (duplikat `@id` `TouristTrip`; guard yang salah baca `@type` dari `@graph` yang belum di-flatten — fix `ef7e848`).

**Validator** (`scripts/validate-jsonld-schema.mjs`, ditambahkan di `a8cec4e`): fetch `sitemap.xml` **live**, fetch HTML tiap route, ekstrak/flatten semua blok `<script type="application/ld+json">`, tandai `@id` duplikat (kecuali keluarga Organization) dan `@type` singleton duplikat dari `{FAQPage, WebSite, BreadcrumbList, ProfilePage, CollectionPage}`. **Ini bukan build step atau test** — dipasang di `.github/workflows/deploy.yml:47`, berjalan terhadap **URL produksi live**, *setelah* restart pm2 dan healthcheck HTTP-200 sukses. Artinya validator hanya menggagalkan *deploy job*-nya setelah graph yang salah sudah sempat disajikan ke publik selama jendela healthcheck itu — tidak ada bukti rollback otomatis saat validator gagal.

### A.4 Identitas organisasi & metadata SEO halaman

`ORGANIZATION_SCHEMA` di `entityGraph.ts` (baris 101-201) secara eksplisit didokumentasikan di header file itu sendiri sebagai **bukan** yang di-inject ("kept as fallback/reference... DO NOT re-export") — bertentangan dengan tabel registry CLAUDE.md yang bilang ini di-inject "Per-page via PageJsonLdCombined". Node Organization yang benar-benar hidup berasal dari `getPublicOrganizationProfile()`: node org ekosistem dulu, lalu snapshot statis TS (`organizationSnapshot.ts:3-38`) sebagai fallback — fallback DB Prisma `organization_profile` sudah dihapus 2026-08-19.

`pageRow` tiap halaman (yang memberi data ke cabang CMS `PageJsonLdCombined`) sekarang dibangun dari `getEcosystemPageSeo()` → `loadEcosystemPage()`, **bukan** `prisma.content_pages`. Tabel `content_pages` (`prisma/schema.prisma:989-1003`) nol reader aktif — panel admin CMS yang dulu menulis ke situ sudah dihapus total (commit `dcd58df`, "fully superseded by ekosistem content"). Peringatan CLAUDE.md soal `content_pages.content.faq` "admin-editable... communicate this when training admins" menggambarkan alur kerja yang sudah tidak ada.

Field `reviewedBy` (E-E-A-T signal, `PageJsonLdCombined.tsx:184-196`) adalah field mati yang didokumentasikan sendiri di komentarnya: tidak ada satupun `page.tsx` yang mengalirkan nilai asli ke sana, jadi setiap halaman mengemisi fallback hardcode `"JVTO Editorial"`.

### A.5 Narrative claims (pilar copy brand C1–C9)

Model Prisma `narrative_claims` (`prisma/schema.prisma:1916-1929`, field `primary_page` untuk pengait FAQ) masih ada tapi nol reader aplikasi aktif. Digantikan `getEcosystemNarrativeClaims()` (`src/lib/ecosystemContent/narrativeClaims.ts:84-88`), membaca `narrative-claims.json` ekosistem (26 claim: C1–C9 + `POL-BPC-*`/`POL-IE-*`). Header file itu menyatakan eksplisit: "No live sync exists between Prisma and this file by design." Tabel DB ini orphan murni — edit lewat tooling admin manapun tidak akan berefek ke situs live.

### A.6 Lintas-repo: `jvto-itinerary-core`

Repo sibling (`sambuko82/jvto-itinerary-core`, saat ini juga di branch `claude/caveman-review-data-architecture-4u4n85`) adalah tool kompilasi data Node/TS standalone — bukan aplikasi web. Membaca snapshot dari 3 repo lain (`llm-wiki`, `jvto-web`, `new-backoffice`) yang di-commit di `input/`, digabung dengan override manual YAML, lalu mengompilasi 28+ dataset JSON di `generated/itinerary-intelligence/` plus payload turunan (`whatsapp-payload`, `pdf-payload`, `page-payload`, `ai-context-pack`, `internal-ops-payload`).

**Overlap entitas signifikan dan langsung:**
- `22-destinations-master.json` — fakta destinasi (elevasi, tingkat kesulitan, cuaca) yang menduplikasi model `destinations` jvto-web
- `16-package-pricing.json` — harga per tingkat-pax IDR per paket, menduplikasi `packages`/`package_prices`/`price_tiers`
- `11-package-route-map.json`, `06-destination-activity-profiles.json`, `07-operational-events.json` — logika rute/itinerary harian yang overlap dengan `package_itinerary_days`, `routes`, `route_details`

**Tidak ada integrasi live yang ditemukan:** `package.json` jvto-web tidak punya dependency ke `jvto-itinerary-core`; grep seluruh `src/`/`content/` jvto-web untuk `itinerary-core`, `itinerary-intelligence`, `sambuko82`, dll — nol match. Aliran datanya satu-arah dan basi: `jvto-itinerary-core` menyimpan salinan manual dari schema jvto-web di `input/jvto-web/schema.prisma` (snapshot tanggal `2026-06-15`), plus 3 file snapshot public-content yang **sudah tidak ada** di jvto-web live saat ini (jvto-web sudah restrukturisasi jadi `dbPageSnapshots.json`/`faqSnapshots.json`/`reviewApiSnapshots.json`). `docs/_audit/route-truth-audit.md` di repo itu sendiri sudah mencatat gap ini.

README repo itu (baris 99-129) mendeskripsikan jalur konsumsi yang **dimaksudkan** (jvto-web pin ke GitHub Release, verifikasi checksum) — tapi ini aspirasional/proses terdokumentasi, tidak ada kodenya di jvto-web manapun.

**Kesimpulan:** dua sumber kebenaran paralel yang tidak terhubung untuk fakta yang sama (destinasi, harga paket, itinerary), dengan data mengalir satu-arah dan tidak teratur dari jvto-web ke itinerary-core, tidak pernah balik. Repo ini aktif dikembangkan (commit terakhir `2173792`, 2026-08-01, 38+ PR merged) — bukan proyek mati, risiko justru akan muncul kalau/ketika ada yang menyambungkannya.

---

## B. Temuan berprioritas (P0/P1/P2)

### P0 — dampak langsung ke kebenaran data atau ke pekerjaan berikutnya

| # | Temuan | Bukti | Dampak | Tindakan |
|---|---|---|---|---|
| P0-1 | `CLAUDE.md` bagian Data Layer/Prisma Models/FAQ Source Resolver sudah fiksi | Lihat "Catatan kritis" + A.1, A.4, A.5 | Siapapun (manusia atau AI agent) yang mengikuti dokumen ini akan menulis kode/DB yang tidak pernah dibaca aplikasi | Tulis ulang `CLAUDE.md` sesuai arsitektur ekosistem-first yang nyata sebelum kerja lain dimulai |
| P0-2 | Feed publik `/api/review`, `/api/review/stats`, `/api/review/preview`, `/api/reviews-xml` basi diam-diam selamanya | `reviewApiSnapshot.ts` masih 100% Prisma; sync workflow dihapus di `a6275ce` | Data yang disajikan lewat feed publik/XML (kemungkinan dikonsumsi crawler/agregator/AEO) makin menyimpang dari angka yang tampil di halaman setiap hari, tanpa ada yang sadar | Putuskan: hidupkan kembali sync, atau deprecate/hapus feed — jangan biarkan "hidup tapi basi" |
| P0-3 | Validator JSON-LD berjalan *setelah* deploy, terhadap produksi live | `.github/workflows/deploy.yml:47`, jalan setelah healthcheck 200 | Graph JSON-LD yang salah sudah sempat disajikan ke crawler AI/mesin pencari sebelum pipeline menangkapnya — bertentangan langsung dengan tujuan investasi AEO/GEO itu sendiri | Pindahkan validasi ke pra-deploy (build/staging render) atau jadikan gate yang memblokir promosi |
| P0-4 | Header situs tidak punya CTA konversi sama sekali | `Navbar.tsx` (lihat D) — nav bar utama hanya berisi navigasi + search + login, nol WhatsApp/booking action | Halaman header adalah elemen paling konsisten dilihat user di semua halaman; nol CTA di sana = kehilangan permintaan konversi tercepat | Tambahkan 1 CTA (WhatsApp atau "Book Now") ke Navbar, pakai komponen CTA kanonis yang diusulkan di D |

### P1 — utang arsitektur nyata, belum darurat tapi harus direncanakan

| # | Temuan | Bukti | Dampak |
|---|---|---|---|
| P1-1 | 3 mekanisme emisi JSON-LD tak terkoordinasi, drift `SINGLETON_TYPES` runtime vs validator, 2 collision `@id` yang sudah pernah terjadi | A.3 | Risiko collision baru tetap ada di 9 halaman yang belum dimigrasi ke `PageJsonLdCombined` |
| P1-2 | Arsitektur CTA/WhatsApp tidak konsisten — ~8 konstruksi `wa.me` independen vs 1 modul `waLinks.ts` yang jarang dipakai; hanya Footer yang pakai link ber-tracking; jalur WhatsApp per-paket yang mati/di-comment di `TourDetail.tsx` bersumber dari mekanisme nomor telepon **berbeda** yang bisa menyimpang diam-diam kalau diaktifkan lagi; header mobile menampilkan nomor sebagai teks polos tanpa link | Lihat D | Analytics konversi tidak lengkap (cuma Footer ter-track); risiko nomor salah kalau jalur dead code diaktifkan tanpa sadar |
| P1-3 | `jvto-itinerary-core` — sumber kebenaran kedua yang nyata untuk destinasi/harga/itinerary, terputus dari produksi | A.6 | Risiko drift baru muncul begitu ada yang menyambungkannya atau copy-paste manual angkanya tanpa refresh snapshot |
| P1-4 | Field `reviewedBy` (sinyal E-E-A-T) adalah fallback hardcode mati `"JVTO Editorial"` di setiap halaman | `PageJsonLdCombined.tsx:184-196` | Melemahkan sinyal E-E-A-T yang justru jadi dasar strategi AEO situs ini |

### P2 — kebersihan/konsistensi, tidak mendesak

| # | Temuan | Bukti |
|---|---|---|
| P2-1 | CTA di FeaturedTours/HomeCTA/hub tur/Contact.tsx/MarketPageSections menduplikasi styling manual alih-alih pakai `UI/Button.tsx` (dipakai di cuma 2 file se-situs) | Lihat D |
| P2-2 | `getEcosystemPageSchema` HTTP-only, tidak konsisten dengan pola reader ekosistem lain (local-file→HTTP→fallback) | A.3 |
| P2-3 | Model Prisma orphan: `crew_reviews`, `crew_member_reviews`, `narrative_claims`, `content_pages` — **catatan presisi**: `packages`/`destinations` **tidak** sepenuhnya orphan (masih 1 call site aktif di `my-booking/[slug]/page.tsx:78`), jangan diklaim "tabel tak terpakai" secara blanket | A.4, A.5, verifikasi manual |

---

## C. Rekomendasi AEO/GEO → perubahan konkret

| Rekomendasi | Schema/field | Halaman/file | Validator terkait |
|---|---|---|---|
| Perbarui `CLAUDE.md` agar mencerminkan arsitektur ekosistem-first nyata (prasyarat semua rekomendasi lain) | — | `CLAUDE.md` | — |
| Pindahkan `scripts/validate-jsonld-schema.mjs` ke pra-deploy (build/staging render) alih-alih pasca-deploy-terhadap-produksi | — | `.github/workflows/deploy.yml:47` | `validate-jsonld-schema.mjs` itu sendiri |
| Tambahkan `CollectionPage` ke `SINGLETON_TYPES` di `PageJsonLdCombined` agar selaras dengan yang sudah dicek validator | `SINGLETON_TYPES` const | `src/components/seo/PageJsonLdCombined.tsx:57` | `validate-jsonld-schema.mjs` (sudah cek `CollectionPage`) |
| Putuskan nasib `/api/review*`/`/api/reviews-xml`: hidupkan kembali sync, atau deprecate | `reviews`, `review_stats` (Prisma) | `src/lib/publicContent/reviewApiSnapshot.ts`, `/api/review*` routes | — |
| Isi `reviewedBy` dengan nilai nyata (mis. penulis editorial ekosistem) atau hapus field-nya daripada fallback permanen | `reviewedBy` | `PageJsonLdCombined.tsx:184-196` | — |
| Rencanakan (bukan eksekusi sekarang) migrasi 4 halaman `<JsonLd>` mentah (destinasi×2, PDP tur×2) dan 4 halaman `<StructuredData>` (hub tur×3, detail review) ke `PageJsonLdCombined` — **diblokir** sampai ekosistem mengemisi tipe `TouristTrip`/`Offer`/`Review` | `TouristTrip`, `Offer`, `Review` | `destinations/[slug]`, `destinations/`, `tours/from-bali/[slug]`, `tours/from-surabaya/[slug]`, `tours/`, `tours/from-bali`, `tours/from-surabaya`, `why-jvto/reviews/[id]` | `validate-jsonld-schema.mjs` (jalankan ulang setelah tiap migrasi) |
| Tambahkan CTA ke Header (lihat D untuk kontrak komponen) | — | `src/components/website/Navbar.tsx` | — |

---

## D. Wireframe + struktur logika per halaman + arsitektur CTA

### D.1 Peta CTA saat ini (bukti, sebelum rekomendasi)

| Permukaan | Komponen | Tujuan | Tersentralisasi? | Catatan |
|---|---|---|---|---|
| **Header desktop** | `Navbar.tsx` | Mega-menu "All Tours" → `/tours`; search; login | Navigasi murni, **nol CTA konversi** | Bar utama tidak punya aksi konversi sama sekali |
| **Header mobile** | `Navbar.tsx:513-519,526` | Link `/contact`; nomor WhatsApp `+62 822-4478-8833` sebagai **teks polos**, bukan link | Tidak di-link, tidak di-track | Tidak konsisten dengan Footer yang linknya bisa diklik & ter-track |
| **Sticky WhatsApp global** | `StickyWhatsApp.tsx`, mount di `(website)/layout.tsx:92` | `wa.me/6282244788833` dengan teks per-halaman | Sebagian tersentralisasi — import `WA_LINKS` dari `waLinks.ts` tapi deklarasi ulang `WA_NUMBER`/`WA_BASE` sendiri | Tampil di semua halaman `(website)` kecuali `/my-booking` |
| **Footer** | `Footer.tsx` | WhatsApp + Email via `<TrackedContactLink>`; tombol "Contact Us" → `/contact` | **Permukaan paling rapi**: sumber nomor/email dari `contactInfo` di `constants.ts`, satu-satunya pemakai `TrackedContactLink` | |
| **Homepage Hero** | `Home/Hero.tsx:75-100` | "Browse Tours" → `/tours`, "Verify JVTO" → `/verify-jvto` | Pakai `UI/Button.tsx` — satu dari cuma 2 pemakaian se-situs | |
| **Homepage FeaturedTours** | `Home/FeaturedTours.tsx:61-69` | "View All Tours" → `/tours` | `<Link>` manual, styling duplikat | |
| **Homepage bottom CTA** | `Home/HomeCTA.tsx:63-79` | "Browse Tours", "Verify JVTO" | `<Link>` manual | **Tidak ada CTA WhatsApp** di section yang judulnya "Ready to book?" |
| **PDP — booking card** | `TourDetail.tsx:1631-1661+` | Submit form → `finalizeBooking()` → `/checkout?pid=...` | Jalur self-serve checkout | Jalur konversi utama di PDP, bukan chat |
| **PDP — sticky bar mobile** | `TourDetail.tsx:2064-2090` | "Instant Book" → scroll ke `#booking-card` | Khusus halaman ini, tidak reusable | Sticky bar kedua, terpisah dari bubble WhatsApp global |
| **PDP — WhatsApp (dead code)** | `TourDetail.tsx:1608-1627` | `wa.me/${pkg.provider.official.whatsapp...}` | **Di-comment**, sumber nomor beda (`editorial.provider` dari ekosistem) | Kalau diaktifkan lagi, bisa menyimpang dari nomor global |
| **Hub tur (from-bali/from-surabaya)** | Inline `<a href="https://wa.me/6282244788833">` | Hardcode literal, duplikat di 2 file nyaris identik | | |
| **/contact** | `Contact.tsx:9-32` | Array `contactInfo` lokal (nama bentrok dengan `contactInfo` global di `constants.ts`) | Duplikat, tanpa tracking | |
| **Market pages (Malaysia/Singapore)** | `MarketPageSections.tsx:16` | Konstanta module-level `WHATSAPP_URL` | Duplikat | |
| **/my-booking mobile nav** | `MobileBookingNav.tsx:45` | Entry "Help" → wa.me inline | Duplikat; satu-satunya halaman yang menonaktifkan bubble global | |

**Kontrak komponen saat ini: tidak ada.** `UI/Button.tsx` adalah wrapper generik tanpa kesadaran WhatsApp/booking, dipakai di 2 file. `TrackedContactLink` (satu-satunya yang punya analytics) dipakai di 1 tempat (Footer). Nomor `6282244788833` konsisten di semua tempat yang hardcode — tidak ada mismatch nomor yang hidup — tapi jalur dead-code di `TourDetail.tsx` memakai mekanisme sumber nomor yang berbeda sama sekali (editorial per-paket, bukan `constants.ts`).

### D.2 Kontrak komponen CTA yang diusulkan

Satu komponen `<WhatsAppButton>` / `<CTAButton>` dengan kontrak:

```
props: {
  variant: "primary" | "secondary" | "ghost" | "sticky",
  href?: string,          // override manual, opsional
  packageId?: string,     // untuk CTA yang perlu bawa konteks paket
  source: string,         // wajib — label analytics: "header" | "footer" | "pdp-sticky" | ...
  label?: string,         // default per-variant, override opsional
}
```

Dibangun di atas `waLinks.ts` (sebagai satu-satunya tempat konstruksi URL wa.me) + `TrackedContactLink` (sebagai satu-satunya tempat tracking klik). Dipakai ulang di: Header (baru), Footer (ganti implementasi lama tanpa ubah perilaku), homepage (Hero, FeaturedTours, HomeCTA), PDP (booking card + sticky bar + WhatsApp CTA yang direaktivasi lewat kontrak ini, bukan jalur `editorial.provider` yang terpisah), hub tur (from-bali/from-surabaya), `/contact`, market pages, `/my-booking` nav — menggantikan ~8 konstruksi `wa.me` manual yang ada sekarang.

### D.3 Struktur logika per tipe halaman (header/footer/section/CTA → sumber data nyata)

| Tipe halaman | Header | Section utama | CTA | Footer | Sumber data nyata |
|---|---|---|---|---|---|
| **Homepage** | `Navbar` (usul: +CTA) | Hero → FeaturedTours → Reviews → HomeCTA | Hero (2 tombol), HomeCTA (2 tombol, **kurang WA**) | `Footer` | `getPublicOrganizationProfile()`, `getEcosystemPageSchema('/')`, `getPublicAggregateRating()`, `getEcosystemReviews()` |
| **Tours hub (from-bali/from-surabaya)** | `Navbar` | Grid paket + inline WA CTA hardcode | WA inline (usul: `<WhatsAppButton source="tours-hub">`) | `Footer` | `<StructuredData>` multi-script (usul migrasi ke `PageJsonLdCombined` setelah ekosistem emit `TouristTrip`/`Offer`) |
| **PDP tur** | `Navbar` | `TourDetail.tsx`: itinerary, harga, booking card, sticky bar mobile | Booking card (checkout self-serve) + sticky bar "Instant Book" + WA (dead code, usul reaktivasi via kontrak D.2) | `Footer` | `src/lib/ecosystemContent/tourPackageDetail.ts`, `buildTourFaqSchema`, `getPublicAggregateRating()`, `<JsonLd>` mentah (usul migrasi) |
| **Destinasi** | `Navbar` | Profil destinasi, aktivitas | Tidak ada CTA eksplisit ditemukan — usul tambahkan link ke PDP tur terkait | `Footer` | `src/lib/ecosystemContent/destinationDetail.ts`, `<JsonLd>` mentah (usul migrasi) |
| **Verify-JVTO / Why-JVTO / Travel-guide / Policy** | `Navbar` | Konten trust/edukasi | Umumnya tidak ada CTA konversi langsung — sesuai peran halaman (edukasi/trust, bukan jual) | `Footer` | `PageJsonLdCombined` + `getEcosystemPageSchema(route)`, narrative claims ekosistem |
| **Global (semua halaman `(website)`)** | — | — | `StickyWhatsApp` bubble (kecuali `/my-booking`) | — | `waLinks.ts` (sebagian), `WA_NUMBER` lokal |

**Korelasi antar halaman:** homepage → tours hub → PDP tur adalah funnel utama (navigasi via `Navbar` + link internal); destinasi berperan sebagai konten pendukung/inspirasi yang idealnya cross-link ke PDP tur terkait tapi saat ini tidak terbukti ada link eksplisit — perlu diverifikasi terpisah saat implementasi. `verify-jvto`/`why-jvto`/`policy` berperan membangun trust yang di-cross-reference lewat entity graph (`@id`), bukan lewat CTA — ini sudah sesuai peran halaman per `working_rule_canonical.md` di memory proyek (homepage jual, verify membuktikan klaim).

---

## E. Urutan eksekusi realistis dengan prasyarat tiap tahap

1. **Perbaiki `CLAUDE.md`** (P0-1) — tidak ada prasyarat. Harus duluan karena semua tahap berikut butuh dokumentasi yang benar sebagai referensi.
2. **Putuskan nasib feed review publik** (P0-2) — tidak ada prasyarat teknis, tapi butuh keputusan produk (hidupkan sync vs deprecate). Bisa paralel dengan #1.
3. **Pindahkan validator JSON-LD ke pra-deploy** (P0-3) — prasyarat: butuh target render staging/build yang bisa di-fetch validator (saat ini validator fetch sitemap.xml live). Perlu tentukan dulu target itu apa sebelum ubah workflow.
4. **Tambah `CollectionPage` ke `SINGLETON_TYPES`** (P1-1, bagian) + **tambah CTA ke Header** (P0-4) — tidak ada prasyarat, bisa langsung, paralel dengan #1-3.
5. **Bangun kontrak komponen CTA** (D.2) dan migrasi satu-per-satu permukaan CTA ke situ (P1-2) — prasyarat: kontrak props disepakati dulu (D.2 sudah mengusulkan bentuknya); setelah itu migrasi bisa bertahap per halaman tanpa saling blocking.
6. **Migrasi 8 halaman non-`PageJsonLdCombined` yang tersisa** (P1-1, sisa) — **diblokir** sampai ekosistem mengemisi tipe `TouristTrip`/`Offer`/`Review` — prasyarat eksternal, di luar kendali repo ini. Tidak bisa dieksekusi sekarang.
7. **Keputusan integrasi `jvto-itinerary-core`** (P1-3) — prasyarat: keputusan produk apakah mau dikonsumsi sama sekali; kalau ya, itinerary-core perlu menyegarkan snapshot-nya dulu (sudah diketahui basi) sebelum jvto-web mulai membaca darinya.
8. **`reviewedBy` diisi nilai nyata** (P1-4) — prasyarat: sumber data penulis/editor yang bisa dipercaya dari ekosistem (perlu dicek apakah field itu sudah ada di payload ekosistem atau perlu ditambahkan di sisi sana).
9. **Bersih-bersih P2** (styling CTA duplikat, local-first fallback `getEcosystemPageSchema`, review model Prisma orphan) — tidak mendesak, kerjakan setelah P0/P1 selesai, bisa jadi "sambil lewat" saat menyentuh file terkait.

---

## F. Hal yang TIDAK direkomendasikan (beserta alasan)

- **Menghidupkan kembali Prisma sebagai sumber utama konten.** Migrasi ke ekosistem-first tampak disengaja dan sudah mayoritas selesai (FAQ, review individual, organization identity, narrative claims semua sudah pindah). Membalikkan arah ini akan melawan keputusan arsitektur yang sudah diambil tim, dan tidak menyelesaikan masalah sebenarnya (dokumentasi yang basi).
- **Menyambungkan `jvto-itinerary-core` ke produksi sekarang.** Mirror schema jvto-web di repo itu sendiri sudah diketahui basi (referensi ke file yang sudah tidak ada). Menyambungkan sekarang berarti mengimpor data yang berpotensi salah. Integrasikan hanya setelah snapshot disegarkan **dan** ada kontrak konsumsi eksplisit (bukan cuma README aspirasional).
- **Migrasi big-bang semua halaman `<JsonLd>`/`<StructuredData>` yang tersisa ke `PageJsonLdCombined` sekarang juga.** Diblokir oleh ekosistem yang belum mengemisi tipe `TouristTrip`/`Offer`/`Review` — memaksakan migrasi sekarang berarti mengarang data placeholder yang secara AEO/GEO justru kontraproduktif (structured data yang tidak akurat lebih buruk daripada tidak konsisten formatnya).
- **Menghapus validator JSON-LD pasca-deploy yang ada sekarang.** Walau timing-nya salah (lihat P0-3), validator ini lebih baik daripada tidak ada validator sama sekali — sudah terbukti menangkap 2 collision nyata. Perbaiki urutannya (pindah ke pra-deploy), jangan dihapus.
- **Mengubah nomor WhatsApp / kontak jadi konfigurasi CMS-editable oleh admin dalam scope ini.** Panel admin CMS sudah dihapus total (`dcd58df`) sebagai bagian dari migrasi ekosistem-first; membangun kembali jalur admin-editable untuk satu field kontak saja tidak sepadan dengan scope audit ini — cukup satu sumber (`constants.ts`/`waLinks.ts`) yang benar-benar dipakai konsisten di semua tempat, sesuai D.2.
