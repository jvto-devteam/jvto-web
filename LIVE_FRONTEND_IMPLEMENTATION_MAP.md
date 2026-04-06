# LIVE FRONTEND IMPLEMENTATION MAP

## Basis Perbandingan

- Repo aktif: `jvto-web`
- Basis diff: working tree saat ini dibanding base commit workspace `2379de7604d56f81969f3b60061a34a48109a81f`
- Fokus dokumen ini:
  - perubahan frontend yang aktif
  - helper/source layer yang dipakai frontend
  - API route internal yang menopang frontend baru
- Tidak dicampur:
  - dokumen analisis lama
  - queue transfer DB sementara yang sudah dihapus
  - repo lama yang bukan workspace aktif

## Ringkasan Perubahan Besar

- Homepage diubah menjadi trust-led entry, bukan landing generik.
- Tours hub diubah menjadi discovery system berbasis origin dan route family.
- Package detail diubah menjadi conversion core dengan route doctrine, tier pricing, dan booking confidence.
- Checkout diubah dari proxy buta menjadi alur yang memvalidasi pricing contract.
- Trust/support architecture dipecah tegas menjadi `why-jvto`, `verify-jvto`, dan `travel-guide`.
- SEO/entity/source layer diperketat dengan pinned overrides, fallback normalization, dan schema cleanup.
- Banyak file duplikat lama dihapus agar codebase aktif lebih bersih.

## 1. Homepage Cluster

- `src/app/(website)/page.tsx`
  - Struktur homepage diganti menjadi urutan:
    - `Hero`
    - `HomeAuthorityReality`
    - `FeaturedTours`
    - `HomeDestinations`
    - `HomeTrustGateway`
    - `TravelGuideTeaser`
    - `HomeFinalCta`
  - Metadata homepage diarahkan lewat `getPageSeo("/", fallbackSeo)`.
  - Schema homepage diperluas dengan:
    - `Service` node untuk private volcano operations
    - extraction `TouristAttraction` dari destination schema
    - `WebApplication` node untuk Ijen health screening
  - Tujuan perubahan:
    - homepage jadi pintu masuk trust + route discovery
    - bukan tempat menumpuk semua section lama

- `src/components/website/Home/Hero.tsx`
  - Hero diganti menjadi origin-first.
  - CTA utama sekarang:
    - `/tours/from-surabaya`
    - `/tours/from-bali`
  - CTA sekunder:
    - `/tours`
    - `/verify-jvto`
  - Bagian yang ditambahkan:
    - eyebrow trust-led
    - highlight pills
    - trust strip
    - verify banner
    - Trustpilot badge
  - Tujuan perubahan:
    - menjelaskan operator type, trust difference, dan next action lebih cepat

- `src/lib/homepage/homepageDoctrine.ts`
  - Ditambahkan sebagai SSOT frontend untuk homepage.
  - Bagian yang ditentukan:
    - hero eyebrow/highlights/trust strip
    - authority section doctrine
    - trust gateway doctrine
    - support gateway doctrine
    - final CTA doctrine

- `src/components/website/Home/HomeAuthorityReality.tsx`
  - Komponen baru.
  - Fungsi:
    - menggabungkan founder/police context
    - legal proof
    - Ijen screening
    - weather/volcano seriousness
  - Ini menggantikan trust signals yang sebelumnya tersebar dan lemah.

- `src/components/website/Home/FeaturedToursClient.tsx`
  - Featured tours diganti menjadi tab-first origin selector.
  - Default aktif: `surabaya`
  - Tab lain: `bali`
  - Bagian baru:
    - tab switch tanpa reload
    - note per origin
    - carousel row per origin
  - Tujuan:
    - homepage mendorong user ke origin yang benar lebih cepat

- `src/components/website/Home/HomeTrustGateway.tsx`
  - Komponen baru.
  - Fungsi:
    - founder context
    - review route
    - proof library route
    - CTA ke `our-story` dan `verify-jvto`

- `src/components/website/Home/TravelGuideTeaser.tsx`
  - Diubah agar support layer tampil sebagai pre-booking guidance.
  - Tidak lagi terasa seperti filler section.

- `src/components/website/Home/HomeFinalCta.tsx`
  - Closing CTA dipadatkan.
  - Fokus ke:
    - `View All Tours`
    - `Prepare & Book`

- `src/components/website/Home/HomeDifferentiators.tsx`
  - Dirombak agar selaras dengan doctrine homepage baru.
  - Tidak lagi menjadi cluster utama yang berdiri sendiri.

- `src/components/website/Home/WhyJVTO.tsx`
  - Diselaraskan dengan trust architecture baru.

- `src/components/website/Navbar.tsx`
  - Label support hub diubah menjadi `Prepare & Book`.
  - Navigasi diselaraskan dengan route ownership baru.

## 2. Tours Hub, Catalog, dan Card Layer

- `src/app/(website)/tours/page.tsx`
  - Global tours hub diubah menjadi decision system.
  - Bagian baru:
    - `ToursHubIntro`
    - `ToursSupportGrid`
    - `ToursFamilyGuide`
    - `ToursCatalogShell`
  - Metadata dan JSON-LD `CollectionPage`/`ItemList` diselaraskan.

- `src/app/(website)/tours/from-surabaya/page.tsx`
  - Hub origin Surabaya dibuat lebih spesifik.
  - Isi utamanya sekarang menekankan:
    - mainland start logic
    - route family spread
    - support pages relevan sebelum booking
  - Schema `ItemList` dan breadcrumb diselaraskan.

- `src/app/(website)/tours/from-bali/page.tsx`
  - Hub origin Bali dibuat lebih spesifik.
  - Isi utamanya sekarang menekankan:
    - cross-island handoff
    - ferry/transfer continuity
    - route shape dan finish logic
  - Schema `ItemList` dan breadcrumb diselaraskan.

- `src/components/website/Tours/ToursHubIntro.tsx`
  - Diubah untuk mendukung intro per hub yang lebih strategis.

- `src/components/website/Tours/ToursSupportGrid.tsx`
  - Diubah untuk menaruh support/proof routes dekat catalog.

- `src/components/website/Tours/ToursCatalogShell.tsx`
  - Diubah menjadi shell shortlist/compare, bukan wrapper katalog generik.

- `src/components/website/Tours/ToursFamilyGuide.tsx`
  - Komponen baru.
  - Fungsi:
    - menampilkan family doctrine paket
    - bantu user memahami perbedaan family sebelum banding harga

- `src/components/website/ToursPageClient.tsx`
  - Diselaraskan agar cocok dengan shell/filtering hub baru.

- `src/components/website/TourCard.tsx`
  - Card utama dirombak.
  - Bagian baru:
    - family badge
    - route order
    - finish logic
    - route summary
    - `Proof before payment` cue
    - pricing note `2-pax reference. Larger groups pay less per person.`
  - Link sekarang dibangun lewat `getPackagePath`.

- `src/components/website/Tours/TourCard.tsx`
  - Card varian tours hub juga diselaraskan.
  - Harga diubah menjadi referensi 2-pax, bukan terlihat seperti harga tunggal tetap.

- `src/lib/packages/tourFamily.ts`
  - File baru.
  - Fungsi:
    - klasifikasi family paket:
      - `ultra-efficient-bromo`
      - `short-bromo-overnight`
      - `focused-ijen`
      - `flagship-3-day`
      - `east-java-overland`
      - `family-route`
    - route order label
    - finish logic label
    - family guide items untuk hub

- `src/lib/packages/packagePaths.ts`
  - File baru.
  - Fungsi:
    - normalisasi slug
    - bangun path package
    - bangun URL canonical package
    - hindari path logic tercecer di banyak tempat

- `src/lib/packages/webTourList.ts`
  - Serializer tour list diubah.
  - Harga `startFrom` sekarang memakai `getEntryReferencePrice`.
  - Efeknya:
    - list/card/feed tidak lagi memakai tier termurah grup besar secara menyesatkan
    - entry price jadi 2-pax reference bila tersedia

- `src/app/(api)/api/tours-feed/route.ts`
  - Feed pricing juga diselaraskan dengan `getEntryReferencePrice`.
  - Tujuan:
    - feed eksternal tidak membaca harga package dengan logika lama

## 3. Package Detail dan Package Doctrine

- `src/components/website/TourDetail.tsx`
  - Ini salah satu perubahan terbesar.
  - Bagian yang diubah:
    - `decisionSnapshotCards`
    - `readinessSections`
    - `routeRealityCards`
    - support links ke trust/support/proof
    - selected pax tier pricing
    - traveler picker yang membaca tier live
    - `Active pax tier`, `Price per person`, `Grand Total`
    - `Due now` logic
    - sticky bottom bar mobile
    - checkout payload final disiapkan dengan `buildCheckoutPricingSnapshot`
  - Efek:
    - package page berubah dari sekadar detail itinerary menjadi conversion page yang benar

- `src/lib/packages/packageDoctrine.ts`
  - File baru.
  - Menyusun blok doctrine package:
    - `routeFit`
    - `routeRhythm`
    - `startEndLogic`
    - `paymentSummary`
    - `routeReality`
    - `hotelRooming`
    - `mealsReality`
    - `closestAlternative`
  - Tujuan:
    - package page punya framework komersial dan operasional yang konsisten

- `src/lib/packages/bookingConfidence.ts`
  - File baru.
  - Memberi layer narasi/CTA confidence menjelang booking.

- `src/lib/packages/priceTiers.ts`
  - File baru.
  - Fungsi:
    - cari tier yang cocok dengan pax
    - hitung harga berdasarkan pax
    - format label tier
    - cari lowest tier
    - cari entry reference price
  - Ini inti dari perbaikan pricing bertingkat.

- `src/lib/packages/paymentPolicy.ts`
  - File baru.
  - Rule yang ditanam:
    - `FULL_PAYMENT_THRESHOLD_DAYS = 7`
    - `MANUAL_VERIFICATION_THRESHOLD_DAYS = 5`
    - `STANDARD_DEPOSIT_RATIO = 0.2`
  - Menyediakan:
    - mode pembayaran awal
    - nominal down payment
    - narasi rule pembayaran
  - Tujuan:
    - aturan `7 hari` konsisten di frontend

## 4. Checkout, Payment Contract, dan API Proxy

- `src/app/(website)/checkout/page.tsx`
  - Checkout dirombak cukup besar.
  - Step 1:
    - `Trip Configuration`
    - recalc live saat pax/date berubah
    - tampilkan `Active tier`, `Current rate`, `Public starting rate`
    - resize `isicCodes` sesuai pax
  - Step 2:
    - review `Locked pax tier`
    - review `Selected pax rate`
    - `Due Now` dihitung sesuai rule payment policy
    - payment method ditentukan otomatis dari timing
  - `StickyOrderSummary`:
    - tampilkan pax tier
    - subtotal package
    - addons
    - discount
    - grand total
  - Payload ke API internal sekarang membawa `pricing_audit`.

- `src/lib/packages/checkoutPricingContract.ts`
  - File baru.
  - Fungsi:
    - hitung snapshot pricing checkout
    - hitung audit payload
    - validasi kontrak antara frontend dan API internal
    - cek mismatch untuk:
      - pax
      - price per person
      - total package
      - total addons
      - total discount
      - grand total
      - down payment
      - payment method

- `src/app/(api)/api/checkout/route.ts`
  - API internal checkout tidak lagi jadi proxy buta.
  - Bagian baru:
    - terima `pricing_audit`
    - validasi `bookingSelection` terhadap contract
    - normalisasi payload legacy sebelum diteruskan
  - Jika mismatch:
    - API return `400`
    - frontend tidak bisa kirim angka drift ke legacy

- `src/app/(api)/api/checkout/route-main.ts`
  - Diselaraskan untuk flow checkout baru.

- `src/app/(api)/api/checkout/bank-transfer/route.ts`
  - Diselaraskan dengan payment flow baru.

- `src/app/(api)/api/booking/pay-balance/route.ts`
  - Diselaraskan untuk payment continuation flow.

## 5. Why JVTO, Verify JVTO, dan Travel Guide Architecture

- `src/lib/trust/trustSupportDoctrine.ts`
  - File baru.
  - Doctrine dibagi untuk:
    - `whyJvtoHubDoctrine`
    - `verifyJvtoHubDoctrine`
    - `travelGuideHubDoctrine`
  - Juga menyediakan `extractHubIntro`.
  - Tujuan:
    - tiga hub trust/support punya peran yang tegas dan tidak saling tumpang tindih

- `src/app/(website)/why-jvto/page.tsx`
  - Halaman hub trust dirombak.
  - Bagian baru:
    - intro doctrine-led
    - trust stack cards
    - principles panel
    - read-next panel
    - fallback FAQ
  - Fungsi:
    - menjelaskan trust architecture, bukan sekadar about page

- `src/app/(website)/why-jvto/[...slug]/page.tsx`
  - Route diubah dari single slug menjadi catch-all.
  - Ini memungkinkan route bertingkat seperti:
    - `/why-jvto/partners-verification/isic`
    - `/why-jvto/partners-verification/hpwki`
    - `/why-jvto/partners-verification/indecon`
  - Bagian yang dirender:
    - hero/header
    - helper text per slug
    - `SectionNav`
    - `BlocksRenderer`
    - `EvidenceBox`
    - FAQ bila ada
  - Tujuan:
    - hasil diskusi lokal `why-jvto` benar-benar menjadi route aktif

- `src/lib/content/whyJvtoSsotFallback.ts`
  - File baru.
  - Fungsi:
    - membaca `src/content/why-jvto-ssot.json`
    - membentuk fallback page row bila `content_pages` belum punya row
  - Ini menutup gap trust content yang dulu hanya hidup di SSOT lokal.

- `src/app/(website)/verify-jvto/page.tsx`
  - Verify hub dirombak jadi proof index.
  - Bagian baru:
    - category cards
    - how-to-use-this-page block
    - after-verification handoff
  - Tujuan:
    - proof layer bisa dibaca sebagai audit path

- `src/app/(website)/verify-jvto/legal/page.tsx`
  - Metadata fallback diselaraskan.
  - `PageJsonLdCombined` dipakai bersama `buildVerifySubpageSchema`.
  - Halaman proof category sekarang punya SEO/schema yang lebih stabil.

- `src/app/(website)/verify-jvto/police-safety/page.tsx`
  - Metadata fallback diselaraskan dengan semantics baru.

- `src/app/(website)/verify-jvto/press-recognition/page.tsx`
  - Metadata fallback diselaraskan dengan semantics baru.

- `src/app/(website)/verify-jvto/history-artifacts/page.tsx`
  - Metadata fallback diselaraskan dengan semantics baru.

- `src/app/(website)/verify-jvto/VerifyJvtoClient.tsx`
  - Dirapikan agar sesuai cluster verify yang baru.

- `src/app/(website)/travel-guide/page.tsx`
  - Travel guide diubah menjadi support hub pre-booking.
  - Isi utama:
    - intro doctrine-led
    - support principles
    - guide cards untuk route support penting

- `src/app/(website)/travel-guide/sidebar.tsx`
  - Label navigasi diselaraskan dengan `Prepare & Book`.

- `src/app/(website)/travel-guide/faq/page.tsx`
  - FAQ sekarang:
    - ambil kategori published dari DB
    - fallback ke `faqData` bila DB gagal
    - normalize legacy `14 days` menjadi `7 days`
    - breadcrumb diganti menjadi `Prepare & Book`
    - JSON-LD FAQ ikut dibersihkan dari phrasing lama

- `src/app/(website)/travel-guide/document-priority-note.tsx`
  - Dirapikan untuk cluster support baru.

## 6. ISIC / Student Package

- `src/app/(website)/isic/student-package/page.tsx`
  - Halaman ISIC tidak lagi bergantung pada inventory `category=2` yang kosong.
  - Sekarang memakai eligible public routes.
  - Bagian baru:
    - heading `Verified Student Access on Selected Private Routes`
    - explanation bahwa student pricing diverifikasi sebelum payment
    - `ItemList` schema untuk eligible routes

- `src/lib/packages/isicEligibleRoutes.ts`
  - File baru.
  - Fungsi:
    - memfilter route publik yang eligible untuk ISIC

## 7. Source, Content, SEO, Entity, dan Schema Layer

- `src/lib/content/pinnedContentOverrides.ts`
  - File baru.
  - Menetapkan pinned override untuk route penting:
    - `/contact`
    - `/destinations`
    - `/policy/*`
    - `/travel-guide/*`
    - `/why-jvto/*`
    - `/verify-jvto/*`
  - Field yang dipaksa:
    - `title`
    - `description`
    - `h1`
  - Tujuan:
    - SEO/H1 route penting tidak bergantung pada content row yang lemah

- `src/lib/content/getContentPage.ts`
  - Sekarang membaca `content_pages` lalu menerapkan `applyPinnedContentOverrideToRow`.
  - Efek:
    - frontend tetap membaca DB, tetapi route penting punya override stabil

- `src/lib/content/getPageSeo.ts`
  - Diselaraskan agar semua page metadata lewat satu resolver.

- `src/lib/content/organizationProfileDefaults.ts`
  - File baru.
  - Menyediakan fallback/default normalization untuk `organization_profile`.
  - Tujuan:
    - organization schema dan public entity tidak rusak saat data kurang lengkap

- `src/lib/content/getOrganizationProfile.ts`
  - Sekarang normalize hasil query lewat `normalizeOrganizationProfile`.
  - Jika DB gagal, frontend tetap dapat profile yang aman.

- `src/lib/content/siteIdentityDefaults.ts`
  - File baru.
  - Menangani:
    - founder normalization
    - brand positioning normalization
    - schema founder normalization
  - Tujuan:
    - founder tidak lagi jatuh menjadi brand placeholder

- `src/app/(api)/api/site-identity/route.ts`
  - API singleton ini diubah untuk serialize:
    - founder
    - brand_positioning
    - org schema normalized
  - PATCH juga diperluas untuk update field tersebut.

- `src/lib/seo/jsonld/builders.ts`
  - Breadcrumb `travel-guide` diganti labelnya menjadi `Prepare & Book`.
  - FAQ schema normalization:
    - phrasing `14 days` dibersihkan menjadi `7 days`
  - Organization/WebPage/destination schema juga diselaraskan.

- `src/lib/seo/jsonld/normalize.ts`
  - Dirapikan untuk schema normalization yang baru.

## 8. Data/Type/Mock Alignment

- `src/types.ts`
  - Tipe diperluas untuk kebutuhan pricing, route family, dan content/source baru.

- `src/data.ts`
  - Diselaraskan dengan knowledge/content cluster yang baru.

- `src/data/knowledge.ts`
  - Diubah untuk menyesuaikan trust/support knowledge surface yang aktif.

- `src/services/mockData.ts`
  - Diselaraskan agar fallback mock tetap cocok dengan pricing/source model baru.

## 9. Deployment / Preview Support

- `scripts/deploy-preview.ps1`
  - Diselaraskan dengan kebutuhan preview baru.
  - Salah satu perubahan penting:
    - env whitelist dibersihkan/ditambah agar preview tidak kehilangan flag penting frontend

- `.gitignore`
  - Dirapikan untuk artefak kerja baru yang memang perlu di-ignore.

## 10. File Lama yang Dihapus

- Cluster `travel-guide`:
  - `src/app/(website)/travel-guide/booking-information/page copy.tsx`
  - `src/app/(website)/travel-guide/ijen-health-screening/page copy.tsx`
  - `src/app/(website)/travel-guide/packing-and-fitness/page copy.tsx`
  - `src/app/(website)/travel-guide/police-escort-for-groups/page copy.tsx`
  - `src/app/(website)/travel-guide/safety-on-tours/page copy.tsx`
  - `src/app/(website)/travel-guide/weather-and-closures/page copy.tsx`
  - Alasan:
    - itu file duplikat yang membuat cluster support kotor dan membingungkan

- Cluster `why-jvto`:
  - `src/app/(website)/why-jvto/page copy.tsx`
  - `src/app/(website)/why-jvto/page_old.tsx`
  - `src/app/(website)/why-jvto/page_ssot.tsx`
  - `src/app/(website)/why-jvto/community-standards/page copy.tsx`
  - `src/app/(website)/why-jvto/our-story/page copy.tsx`
  - `src/app/(website)/why-jvto/our-team/page copy.tsx`
  - `src/app/(website)/why-jvto/press-recognition/page copy.tsx`
  - `src/app/(website)/why-jvto/proof-transparency/history-artifacts/page copy.tsx`
  - `src/app/(website)/why-jvto/proof-transparency/legal/page copy.tsx`
  - `src/app/(website)/why-jvto/proof-transparency/police-safety/page copy.tsx`
  - `src/app/(website)/why-jvto/proof-transparency/press-recognition/page copy.tsx`
  - `src/app/(website)/why-jvto/reviews/page copy.tsx`
  - `src/app/(website)/why-jvto/the-jvto-difference/page copy.tsx`
  - Alasan:
    - menghilangkan artefak lama/duplikat agar cluster trust aktif hanya punya satu jalur implementasi

## 11. Urutan Implementasi ke Live yang Paling Masuk Akal

- Gelombang 1:
  - `src/lib/packages/*`
  - `src/components/website/TourDetail.tsx`
  - `src/app/(website)/checkout/page.tsx`
  - `src/app/(api)/api/checkout/*`
  - Alasan:
    - ini menyentuh pricing, booking, dan payment logic

- Gelombang 2:
  - `src/lib/trust/trustSupportDoctrine.ts`
  - `src/app/(website)/why-jvto/*`
  - `src/app/(website)/verify-jvto/*`
  - `src/app/(website)/travel-guide/*`
  - `src/lib/content/whyJvtoSsotFallback.ts`
  - Alasan:
    - ini menyentuh trust/support architecture

- Gelombang 3:
  - `src/app/(website)/page.tsx`
  - `src/components/website/Home/*`
  - `src/app/(website)/tours/*`
  - `src/components/website/Tours/*`
  - `src/components/website/TourCard.tsx`
  - Alasan:
    - ini menyentuh discovery + homepage orchestration

- Gelombang 4:
  - `src/lib/content/*`
  - `src/lib/seo/jsonld/*`
  - `src/app/(api)/api/site-identity/route.ts`
  - Alasan:
    - ini menyentuh SEO/entity/schema/fallback normalization

## 12. Catatan Praktis untuk Implementasi Live

- Jika target live ingin benar-benar mengikuti workspace ini, jangan hanya ambil UI homepage.
- Prioritas nyata yang tidak boleh dipisah:
  - `priceTiers.ts`
  - `paymentPolicy.ts`
  - `checkoutPricingContract.ts`
  - `TourDetail.tsx`
  - `checkout/page.tsx`
  - `api/checkout/route.ts`
  - `trustSupportDoctrine.ts`
  - `whyJvtoSsotFallback.ts`
  - `pinnedContentOverrides.ts`
  - `getContentPage.ts`
  - `getOrganizationProfile.ts`
  - `siteIdentityDefaults.ts`

- Kalau live hanya mengambil sebagian, risiko terbesar ada di:
  - harga tampil tidak konsisten antar card/detail/checkout
  - trust routes hidup tapi tidak lengkap
  - metadata/H1 balik ke source lama yang lemah
  - founder/schema jatuh lagi ke placeholder lama

