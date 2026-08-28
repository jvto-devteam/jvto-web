---
description: Audit JSON-LD schema markup against jvto-ekosistem data
---

# 🔍 /audit-schema

Baca `.claude/rules/GLOBAL-CONSTRAINTS.md` lebih dulu.

## Jalankan checker yang sudah ada — jangan tulis ulang

    npm run validate                 # 52 rute, JSON-LD terkomposisi (baseline: 52 ok, 0 gagal)
    npm run validate:jsonld-schema
    npm run validate:packages        # registry vs DB (baseline: 0 error, 4 warning)
    npm run validate:review-pages    # 221 halaman review-detail (baseline: semua ok)
    npm run audit:geo-visibility     # rute live, contentSignal, lastReviewed
    npm run check:fact-drift         # NIB / founder / legal name lintas repo
    npm run test:stale

Laporkan **selisih terhadap baseline**, bukan angka mentahnya saja.

## Yang diperiksa manual

### 1. `entityGraph.ts` — DEFINED_TERMS
Harus **11**: NIB, TDUP, HPWKI, KTA, POLPAR, BBKSDA, SE1658, ISIC, INDECON,
JVTO_TRAVEL_CREDIT, JVTO_FOC_SCHEME. Cocokkan entity eksternal dengan
`organization-identity/external-entities.json` (**16 record**).

### 2. `aggregateRating`
- Per-tour dihitung dari review tour itu sendiri, **dihilangkan sepenuhnya bila tidak ada**
  (keputusan 2026-08-26)
- Rating organisasi = **Google Maps saja**, tidak pernah rata-rata gabungan
  (keputusan 2026-08-15). Live: 4.9 / 156
- `ratingValue: 0` **tidak boleh** ter-emit. Di `ecosystemContent/tourPackageDetail.ts`
  nilai itu adalah default normalizer yang sah — yang dilarang adalah mengirimkannya

### 3. Tahun inkorporasi PT
**Tidak ada tahun inkorporasi PT yang boleh diasersikan** (keputusan 2026-08-03).
`foundingDate` = 2015 (era brand). Saat ini masih ada 12 asersi `2016-01-01` di kedua
repo — laporkan, jangan perbaiki tanpa instruksi.

### 4. `TouristTrip` + `Offer`
- `Offer.url` menunjuk `/checkout`, bukan WhatsApp
- Emit hanya untuk `source_trace.confidence === "verified"`, bukan `"inferred"`
- Registry saat ini: manifest 16 kanonik vs DB 17 aktif — satu paket belum terdaftar

### 5. `SpecialAnnouncement`
Penutupan bulanan Rijik dan penutupan akibat cuaca.

### 6. Sitemap
`lastmod` memakai `updated_at` record, bukan `now()`.

### 7. `lastReviewed`
Terakhir diukur: **7 dari 11 rute** yang diaudit tidak mengeksposnya — `/`, `/why-jvto`,
`/verify-jvto`, `/tours/from-surabaya`, `/tours/from-bali`, `/markets/malaysia`,
`/markets/singapore`.

## Output

    { "checkers": { "validate": "52/52 ok",
                    "packages": "0 error, N warning",
                    "review-pages": "221 ok" },
      "defined_terms": { "expected": 11, "actual": 0 },
      "external_entities": { "expected": 16, "actual": 0 },
      "aggregate_rating_violations": [],
      "pt_incorporation_assertions": [],
      "missing_lastReviewed": [],
      "regressions_vs_baseline": [] }

## Aturan
- ❌ Tanpa nilai placeholder karangan
- ❌ `aggregateRating: 0` dilarang
- ❌ Jangan bekukan policy di dalam checker — baca `state/goals.json`
- ✅ Schema hanya untuk konten yang tampil
- ✅ Verifikasi ulang setiap angka dari sumber hidup
