# JVTO Package Logic Specification
**Repository target:** `sambuko82/Java-Volcano-Tour-Operator-I-JVTO-new`  
**Document status:** Canonical tour package logic and live data registry  
**Source:** Extracted from `lib/jvtoData.ts`, `lib/bookingPolicy.ts`, `lib/siteConfig.ts` jvto_dev (state: 2026-04-21)  
**Parent documents:**
- `JVTO_CANONICAL_SSOT_PRD.md`
- `JVTO_PACKAGE_SCHEMA_MAP.md`

---

## 1. Purpose

Dokumen ini mengkonsolidasikan logika tour paket aktual dari codebase jvto_dev ke dalam format governance SSOT.

Berbeda dari `JVTO_PACKAGE_SCHEMA_MAP.md` yang mendefinisikan *bagaimana* schema dibangun, dokumen ini mendefinisikan *apa* yang ada dalam setiap package — data live, pricing logic, itinerary structure, inclusion/exclusion pattern, dan ijen-relevant flags.

Dokumen ini adalah **sumber kebenaran untuk product team dan content ops** ketika:
- Menambah atau memodifikasi tour package
- Menulis copy untuk package pages
- Memvalidasi schema terhadap konten aktual
- Menentukan Ijen-readiness requirements per package

---

## 2. Live Package Registry

**Data per:** 2026-04-21 | **Source:** `lib/jvtoData.ts` jvto_dev  
**Total packages live:** 16 packages (canonical site) / 19 entries di jvtoData.ts (termasuk 3 deprecated)

> **Catatan:** `jvtoData.ts` memuat `@deprecated` note — production site menggunakan 16 packages aktif dari DB. Surabaya City dan Malang City sebagai destinations ada di file tapi tidak di canonical 5 destinations.

---

## 3. TypeScript Data Model

### 3.1 Tour Interface (canonical)
```typescript
interface Tour {
  slug: string;                    // Canonical route ID
  name: string;                    // Display name
  shortDesc: string;               // 1-sentence summary (SEO + card)
  longDesc: string;                // Full package description
  duration: string;                // e.g. "3 Days, 2 Nights"
  origin: 'Surabaya' | 'Bali';
  priceFrom: number;               // IDR, per person (min tier)
  image: string;                   // Hero image URL
  rating: number;                  // Per-package rating
  physicality: 'easy' | 'moderate' | 'hard';
  bestFor: string;                 // Short positioning tag
  idealTraveler: string;           // Target persona
  pricingTable: { pax: number; price: number }[];  // per-pax price matrix
  destinations: string[];          // Destination slugs
  itinerary: {
    day: string;
    title: string;
    summary: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  accommodation?: string;
  vehicleDetails?: string;
  mealsIncluded?: string;
  faq?: { question: string; answer: string }[];
  gallery?: string[];
  ijenRelevant?: boolean;          // Schema + support linkage flag
}
```

### 3.2 Destination Interface (canonical)
```typescript
interface Destination {
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Hard';
  highlights: string[];
  practicalNotes: string[];
  altitude?: number;
  region: string;
  geoCoordinates?: { latitude: number; longitude: number };
  hazardousSubstance?: string;
}
```

---

## 4. Destination Registry (5 Canonical)

| Slug | Name | Region | Altitude | Difficulty | Geo Coords | Hazardous |
|---|---|---|---|---|---|---|
| `mount-bromo` | Mount Bromo | Tengger Highlands | 2,329m | Moderate | -7.9425, 112.9531 | Volcanic ash, sulfuric gas |
| `ijen-crater` | Kawah Ijen | Bondowoso | 2,769m | Moderate | -8.0584, 114.2420 | SO₂ up to 50,000 ppm |
| `madakaripura-waterfall` | Madakaripura Waterfall | Lumbang, Probolinggo | 620m | Moderate | -7.9136, 113.0472 | — |
| `tumpak-sewu-waterfall` | Tumpak Sewu | Lumajang–Malang Border | 500m | Hard | -8.2342, 112.9158 | — |
| `papuma-beach` | Papuma Beach | Jember | 5m | Easy | -8.2780, 113.6283 | — |

### Destination Practical Notes by Type

**Mount Bromo:**
- Entry fee: IDR 220,000 (weekday) / IDR 320,000 (weekend) — included in JVTO
- Temperature: 5–15°C malam/sunrise, 15–25°C siang
- Required: 4WD Jeep, Kingkong Hill viewpoint, Sea of Sand crossing

**Kawah Ijen:**
- Health-certificate screening coordinated when access rules require it
- Gas masks + trekking poles provided by JVTO
- Temperature: 5–10°C malam, 15–25°C siang
- Blue Fire: natural phenomenon, not guaranteed — contextual claim only

**Madakaripura:**
- Warning: Akan basah kuyup — helmets provided
- Recommended: water shoes
- Cultural context: meditation site Gajah Mada (Majapahit)

**Tumpak Sewu:**
- Descent via steep bamboo ladders, slippery surfaces
- Mandatory: hiking sandals with grip
- High fitness requirement — physicality: Hard

**Papuma Beach:**
- Best: dry season (April–October)
- Role dalam itinerary: rest/contrast stop, not difficulty feature

---

## 5. Live Package Registry — Surabaya Origin

### 5.1 Package Matrix Overview

| Slug | Name | Duration | Price From | Destinations | Ijen | Physicality |
|---|---|---|---|---|---|---|
| `bromo-1d1n` | 1D1N Bromo Midnight Tour | 1D1N | IDR 1,850,000 | Bromo | ❌ | moderate |
| `bromo-2d1n` | 2D1N Bromo & Madakaripura | 2D1N | IDR 1,750,000 | Bromo, Madakaripura | ❌ | moderate |
| `ijen-2d1n` | 2D1N Ijen Blue Fire | 2D1N | IDR 1,550,000 | Ijen | ✅ | moderate |
| `bromo-madakaripura-ijen-3d2n` | 3D2N Bromo–Madakaripura–Ijen (→ Bali) | 3D2N | IDR 2,450,000 | Bromo, Madakaripura, Ijen | ✅ | moderate |
| `ijen-bromo-madakaripura-3d2n` | 3D2N Ijen–Bromo–Madakaripura | 3D2N | IDR 2,450,000 | Ijen, Bromo, Madakaripura | ✅ | moderate |
| `safari-bromo-madakaripura-3d2n` | 3D2N Safari–Bromo–Madakaripura (Family) | 3D2N | IDR 3,450,000 | Bromo, Madakaripura | ❌ | easy |
| `ijen-bromo-madakaripura-4d3n` | 4D3N Ijen–Bromo–Madakaripura | 4D3N | IDR 3,025,000 | Ijen, Bromo, Madakaripura | ✅ | moderate |
| `ijen-papuma-tumpak-sewu-bromo-4d3n` | 4D3N Ijen–Papuma–Tumpak Sewu–Bromo | 4D3N | IDR 3,125,000 | Ijen, Papuma, Tumpak Sewu, Bromo | ✅ | moderate |
| `tumpak-sewu-bromo-ijen-4d3n` | 4D3N Tumpak Sewu–Bromo–Ijen (→ Bali) | 4D3N | IDR 3,125,000 | Tumpak Sewu, Bromo, Ijen | ✅ | moderate |
| `ijen-bromo-madakaripura-malang-5d4n` | 5D4N Ijen–Bromo–Madakaripura–Malang | 5D4N | IDR 3,850,000 | Ijen, Bromo, Madakaripura | ✅ | moderate |
| `ijen-papuma-tumpak-sewu-bromo-5d4n` | 5D4N Ijen–Papuma–Tumpak Sewu–Bromo | 5D4N | IDR 3,650,000 | Ijen, Papuma, Tumpak Sewu, Bromo | ✅ | moderate |
| `ijen-papuma-tumpak-sewu-bromo-malang-6d5n` | 6D5N Ijen–Papuma–Tumpak Sewu–Bromo–Malang | 6D5N | IDR 4,750,000 | Ijen, Papuma, Tumpak Sewu, Bromo | ✅ | moderate |

### 5.2 Surabaya Package Pricing Tables (IDR per pax)

| Package | 1 pax | 2 pax | 3 pax | 4 pax | 5 pax |
|---|---|---|---|---|---|
| bromo-1d1n | 1,850,000 | 1,250,000 | 950,000 | — | — |
| bromo-2d1n | — | 1,750,000 | 1,450,000 | 1,250,000 | 1,100,000 |
| ijen-2d1n | — | 1,550,000 | 1,250,000 | 1,050,000 | 950,000 |
| bromo-madakaripura-ijen-3d2n | — | 2,450,000 | 2,150,000 | 1,950,000 | 1,750,000 |
| ijen-bromo-madakaripura-3d2n | — | 2,450,000 | 2,150,000 | 1,950,000 | 1,750,000 |
| safari-bromo-madakaripura-3d2n | — | 3,450,000 | 3,150,000 | 2,950,000 | 2,750,000 |
| ijen-bromo-madakaripura-4d3n | — | 3,025,000 | 2,725,000 | 2,525,000 | 2,325,000 |
| ijen-papuma-tumpak-sewu-bromo-4d3n | — | 3,125,000 | 2,825,000 | 2,625,000 | 2,425,000 |
| tumpak-sewu-bromo-ijen-4d3n | — | 3,125,000 | 2,825,000 | 2,625,000 | 2,425,000 |
| ijen-bromo-madakaripura-malang-5d4n | — | 3,850,000 | 3,550,000 | 3,350,000 | 3,150,000 |
| ijen-papuma-tumpak-sewu-bromo-5d4n | — | 3,650,000 | 3,350,000 | 3,150,000 | 2,950,000 |
| ijen-papuma-tumpak-sewu-bromo-malang-6d5n | — | 4,750,000 | 4,450,000 | 4,250,000 | 4,050,000 |

---

## 6. Live Package Registry — Bali Origin

### 6.1 Package Matrix Overview

| Slug | Name | Duration | Price From | Destinations | Ijen | End Point |
|---|---|---|---|---|---|---|
| `bromo-ijen-3d2n-bali` | 3D2N Bromo & Ijen (round-trip Bali) | 3D2N | IDR 2,850,000 | Bromo, Ijen | ✅ | Bali |
| `ijen-papuma-tumpak-sewu-bromo-4d3n-bali` | 4D3N Ijen–Papuma–Tumpak Sewu–Bromo (Bali→Surabaya) | 4D3N | IDR 3,475,000 | Ijen, Papuma, Tumpak Sewu, Bromo | ✅ | Surabaya |
| `ijen-papuma-tumpak-sewu-bromo-5d4n-bali` | 5D4N Ijen–Papuma–Tumpak Sewu–Bromo (Bali→Surabaya) | 5D4N | IDR 4,050,000 | Ijen, Papuma, Tumpak Sewu, Bromo | ✅ | Surabaya |

### 6.2 Bali Package Pricing Tables (IDR per pax)

| Package | 2 pax | 3 pax | 4 pax | 5 pax |
|---|---|---|---|---|
| bromo-ijen-3d2n-bali | 2,850,000 | 2,550,000 | 2,350,000 | 2,150,000 |
| ijen-papuma-tumpak-sewu-bromo-4d3n-bali | 3,475,000 | 3,175,000 | 2,975,000 | 2,775,000 |
| ijen-papuma-tumpak-sewu-bromo-5d4n-bali | 4,050,000 | 3,750,000 | 3,550,000 | 3,350,000 |

> **Note:** Semua Bali-origin packages include Ferry Tickets dalam inclusions.

---

## 7. Standard Inclusions / Exclusions Pattern

### 7.1 Universal Inclusions (semua package)
- Private AC transport untuk semua itinerary sectors
- English-speaking guide
- All entrance fees, tickets, permits
- Daily breakfast
- Local logistics (fuel, tolls, standard parking)

### 7.2 Conditional Inclusions (berdasarkan route)

| Kondisi | Inclusion Tambahan |
|---|---|
| Bromo included | 4WD Jeep (Land Cruiser private) |
| Ijen included | Gas masks + trekking poles |
| Ijen included | Health-certificate screening coordination |
| Bali origin/endpoint | Ferry tickets |
| safari-bromo package | Taman Safari Prigen tickets |

### 7.3 Universal Exclusions (semua package)
- Flights dan domestic air transfers
- VISA, passport costs
- Travel insurance dan personal medical expenses
- Lunches, dinners, snacks (kecuali tertulis di voucher)
- Laundry, phone, souvenirs, porterage
- Tips untuk guides dan drivers
- Optional upgrades tidak tertulis di voucher

### 7.4 Inclusions & Exclusions Governance Rule

**Rule:** Copy inclusions/exclusions harus konsisten dengan `lib/bookingPolicy.ts` `standardInclusions[]` dan `standardExclusions[]`.

**Konflik precedence:** Voucher > Booking Policy > Inclusions/Exclusions Policy > Website text.

---

## 8. Ijen-Relevant Package Logic

### 8.1 Flag Definition
`ijenRelevant: true` diset pada package yang melewati Kawah Ijen.

### 8.2 Packages dengan ijenRelevant: true (11 dari 15)

| Package Slug | Origin |
|---|---|
| `ijen-2d1n` | Surabaya |
| `bromo-madakaripura-ijen-3d2n` | Surabaya |
| `ijen-bromo-madakaripura-3d2n` | Surabaya |
| `ijen-bromo-madakaripura-4d3n` | Surabaya |
| `ijen-papuma-tumpak-sewu-bromo-4d3n` | Surabaya |
| `tumpak-sewu-bromo-ijen-4d3n` | Surabaya |
| `ijen-bromo-madakaripura-malang-5d4n` | Surabaya |
| `ijen-papuma-tumpak-sewu-bromo-5d4n` | Surabaya |
| `ijen-papuma-tumpak-sewu-bromo-malang-6d5n` | Surabaya |
| `bromo-ijen-3d2n-bali` | Bali |
| `ijen-papuma-tumpak-sewu-bromo-4d3n-bali` | Bali |
| `ijen-papuma-tumpak-sewu-bromo-5d4n-bali` | Bali |

### 8.3 Required Support Links (ijenRelevant packages)

Setiap package `ijenRelevant: true` HARUS memiliki explicit support paths ke:
- `/travel-guide/ijen-health-screening`
- `/travel-guide/weather-and-closures`
- `/verify-jvto/police-safety`

### 8.4 Ijen Wording Guardrail

**DILARANG dalam schema atau copy:**
- "Blue Fire guaranteed"
- "mandatory health screening for all"
- "100% Blue Fire visible"

**DIIZINKAN:**
- "Ijen access rules can require a recent local health certificate"
- "Blue Fire is a natural phenomenon subject to weather and gas activity"
- "JVTO coordinates clinic workflow when access rules require it"
- "Gas masks provided"

---

## 9. Vehicle Logic

### 9.1 Canonical Vehicle per Route Context

| Konteks | Vehicle Type |
|---|---|
| Overland semua rute | Private Toyota Avanza/Innova (AC) |
| Bromo crater access | Private Toyota Land Cruiser 4WD |
| Bali–Java crossing | Ketapang–Gilimanuk Ferry |

### 9.2 Vehicle Copy Template
```
"Private Toyota Avanza/Innova for overland. 
Private Toyota Land Cruiser 4WD for Bromo crater."
```

---

## 10. Accommodation Logic

### 10.1 Per-Destination Stay
| Destination | Hotel Standard |
|---|---|
| Bromo area | Hutan Bromo or similar (crater rim proximity) |
| Bondowoso / Ijen area | Grand Padis Hotel Bondowoso or similar |
| Surabaya (departure night) | Guest's own hotel atau JVTO recommendation |

### 10.2 Accommodation Governance Rule
Copy accommodation harus menggunakan "or similar" qualifier — hotel spesifik adalah contoh, bukan jaminan absolut.

---

## 11. Meals Logic

### 11.1 Standard Meal Pattern

| Timing | Included |
|---|---|
| Hotel breakfasts | ✅ Semua paket overnight |
| Coffee/tea before Bromo sunrise | ✅ |
| Coffee/tea before Ijen hike | ✅ |
| Lunch | ❌ (excluded) |
| Dinner | ❌ (kecuali tertulis di voucher) |

### 11.2 Meals Copy Template
```
"Breakfast everyday. Coffee/tea at sunrise. 
Local dinner options available on Day 1 (at guest's own cost)."
```

---

## 12. Pricing Logic & Policy

### 12.1 Pricing Structure
- Semua harga: **IDR per person per pax tier**
- Private group = satu vehicle untuk group yang sama
- Semakin besar group = harga per orang semakin turun
- Tidak ada shared/join-tour — semua paket private

### 12.2 Booking & Payment Rules (dari bookingPolicy.ts)

| Parameter | Value |
|---|---|
| Standard deposit | 20% dari total booking value |
| Close departure rule | Jika Day 1 dalam 14 hari → bisa 100% full payment |
| Balance deadline (card) | Max 5 hari sebelum Day 1 |
| Balance deadline (bank transfer) | Max 3 hari sebelum Day 1 |
| Cancellation cutoff | 48 jam sebelum Day 1 |
| Cancellation ≥48h | 100% → Lifetime Travel Credit (no cash refund) |
| Cancellation <48h | Fully forfeited |
| Travel Credit | Tidak expired, transferable, bisa dijual/dijadikan gift |

### 12.3 Bank Account Canonical Data
| Bank | Nama Rekening | Nomor | SWIFT |
|---|---|---|---|
| BRI | PT Java Volcano Rendezvous | 001301001779564 | BRINIDJAXXX |
| BCA | PT Java Volcano Rendezvous | 1200944352 | CENAIDJAXXX |

### 12.4 Document Precedence Rule
```
1. Official E-Voucher / Invoice PDF (per booking)
2. Booking, Payment & Cancellation Policy
3. Inclusions & Exclusions Policy
4. Privacy & Data Protection Policy
5. Travel Guide — Booking Information
6. Website content / informal messages
```

---

## 13. Itinerary Pattern Library

### 13.1 Recurring Day Patterns

**Pattern: Surabaya → Bromo (overnight start)**
```
Pickup dari Surabaya.
Drive overland ke Cemoro Lawang (pinggir kaldera Bromo).
Check-in lodge, istirahat.
```

**Pattern: Bromo sunrise day**
```
Early morning (03:30): 4WD Jeep ke Penanjakan viewpoint.
Sunrise observation.
Sea of Sand crossing.
Bromo crater rim trek.
Kembali ke hotel untuk sarapan.
```

**Pattern: Bromo → Madakaripura (same day)**
```
Post-Bromo drive ke Probolinggo arah barat.
Trek Madakaripura canyon (basah, pakai helm).
Kembali / lanjut ke tujuan berikutnya.
```

**Pattern: Bondowoso health check (Ijen prep)**
```
Tiba di Bondowoso area sore/malam.
Mandatory health check di hotel/klinik mitra.
Dinner.
Tidur awal untuk midnight hike.
```

**Pattern: Ijen night hike**
```
Midnight (00:00-01:00): Berangkat ke Paltuding basecamp.
Trek naik ke crater rim (1.5-2 jam).
Blue Fire observation (jika kondisi memungkinkan).
Sunrise di crater rim.
Descent dan kembali ke basecamp.
```

**Pattern: Bali crossing (Java→Bali)**
```
Post-Ijen drive ke Ketapang (Banyuwangi).
Ferry ke Gilimanuk (Bali) ±30 menit.
Drive ke hotel tujuan di Bali.
```

**Pattern: Bali crossing (Bali→Java)**
```
Pickup dari hotel Bali.
Drive ke Gilimanuk.
Ferry ke Ketapang ±30 menit.
Lanjut overland ke destinasi pertama.
```

**Pattern: Tumpak Sewu day**
```
Drive ke Lumajang (area Tumpak Sewu).
Descent via steep bamboo ladder (fitness required).
Canyon trail menuju dasar air terjun.
Ascent kembali.
```

**Pattern: Papuma Beach stop**
```
Drive ke Jember coast.
Papuma Beach — kontras setelah hike volcanic.
Sunset observation.
Biasanya stay 1 malam di area Jember.
```

---

## 14. Package Persona & Positioning

### 14.1 `bestFor` Tags Registry

| Tag | Package(s) | Target |
|---|---|---|
| "Time-critical travelers" | bromo-1d1n | Business travelers, short layover |
| "Short escapes" | bromo-2d1n | Weekend couples |
| "Ijen specialists" | ijen-2d1n | Blue Fire seekers, solo adventurers |
| "The Classic Circuit" | bromo-madakaripura-ijen-3d2n | First-time East Java |
| "Full Volcanic Experience" | ijen-bromo-madakaripura-3d2n | Surabaya round-trip |
| "Families with kids" | safari-bromo-madakaripura-3d2n | Family segments |
| "Relaxed pace" | ijen-bromo-madakaripura-4d3n | Comfort travelers |
| "Diverse landscapes" | ijen-papuma-tumpak-sewu-bromo-4d3n | Photography enthusiasts |
| "Surabaya to Bali overland" | tumpak-sewu-bromo-ijen-4d3n | Backpackers/adventurers |
| "Culture & Nature" | ijen-bromo-madakaripura-malang-5d4n | Cultural explorers |
| "The Ultimate Nature Trip" | ijen-papuma-tumpak-sewu-bromo-5d4n | Nature photographers |
| "The Complete Circuit" | ijen-papuma-tumpak-sewu-bromo-malang-6d5n | Slow travelers |
| "Bali round-trip" | bromo-ijen-3d2n-bali | Bali-based travelers |
| "Bali to Surabaya overland" | ijen-papuma-*-bali packages | Cross-island travelers |

### 14.2 `physicaliy` Classification

| Level | Description | Packages |
|---|---|---|
| `easy` | No significant hiking required | safari-bromo-madakaripura |
| `moderate` | Some hiking (volcano crater/waterfall), manageable for average fitness | Semua kecuali easy/hard |
| `hard` | Steep terrain, significant physical demand | Tumpak Sewu variants |

---

## 15. Closest Alternative Logic

Setiap package page harus menampilkan "closest alternative" untuk mencegah dead ends.

| Package | Recommended Alternative |
|---|---|
| bromo-1d1n | bromo-2d1n (tambah Madakaripura) |
| bromo-2d1n | ijen-bromo-madakaripura-3d2n (tambah Ijen) |
| ijen-2d1n | ijen-bromo-madakaripura-3d2n (tambah Bromo) |
| bromo-madakaripura-ijen-3d2n | ijen-bromo-madakaripura-3d2n (versi Surabaya round-trip) |
| ijen-bromo-madakaripura-3d2n | ijen-bromo-madakaripura-4d3n (lebih santai) |
| safari-bromo-madakaripura-3d2n | bromo-2d1n (fewer days, no safari) |
| ijen-bromo-madakaripura-4d3n | ijen-papuma-tumpak-sewu-bromo-4d3n (lebih diverse) |
| ijen-papuma-tumpak-sewu-bromo-4d3n | ijen-papuma-tumpak-sewu-bromo-5d4n (extra day) |
| tumpak-sewu-bromo-ijen-4d3n | bromo-madakaripura-ijen-3d2n (lebih singkat, ke Bali) |
| bromo-ijen-3d2n-bali | ijen-papuma-tumpak-sewu-bromo-4d3n-bali (lebih diverse) |

---

## 16. FAQ Pattern Library (per package type)

### FAQ yang valid untuk semua packages dengan Bromo:
```
Q: What is the best time for Bromo?
A: The dry season (April–October) offers the clearest sunrise views.

Q: Is this tour suitable for children?
A: Yes, Bromo is very accessible for families, though it is cold in the morning (5–15°C).
```

### FAQ valid untuk semua packages dengan Ijen:
```
Q: Is the Blue Fire guaranteed?
A: Blue Fire is a natural phenomenon subject to weather and gas activity. 
   It is not guaranteed on any specific night.

Q: What if I am not physically fit?
A: JVTO coordinates clinic checks before the Ijen trek to ensure guest safety 
   when current access rules require a health certificate. 
   The trek is rated moderate but involves a 1.5–2 hour ascent.

Q: Do I need a gas mask?
A: Yes. JVTO provides gas masks for all Ijen tours.
```

### FAQ valid untuk Tumpak Sewu packages:
```
Q: Is Tumpak Sewu dangerous?
A: The descent involves steep bamboo ladders and slippery surfaces. 
   Proper hiking footwear is mandatory. JVTO provides guides throughout.
```

---

## 17. Section Render Order (dari SSOT §8 — confirmed in AGENTS.md)

Setiap package page tetap mengikuti urutan ini:
1. Hero package (nama, gambar, from-price, CTA)
2. Structured route data (duration, origin, physicality)
3. Gallery / visual route
4. Route fit (siapa ini untuk)
5. Route rhythm (day-by-day)
6. Hotel / rooming
7. Vehicle & crew
8. Meals
9. Ijen readiness block (jika ijenRelevant: true)
10. Compact policy summary
11. Payment summary
12. Add-ons
13. Closest alternative
14. Ijen proof rail (jika ijenRelevant: true)
15. Verify-before-book
16. FAQ
17. Final CTA

---

## 18. Anti-Patterns (Hal yang Tidak Boleh)

### Copy anti-patterns:
- ❌ "Blue Fire guaranteed"
- ❌ "mandatory health screening" (tanpa qualifier kondisional)
- ❌ Pricing tanpa konteks per-pax atau private group
- ❌ Police wording yang mengklaim JVTO sebagai pemerintah/polisi
- ❌ Menyebut "sharing tour" — semua JVTO tours adalah private

### Schema anti-patterns:
- ❌ Itinerary yang tidak dari data sumber aktual
- ❌ Inclusions yang tidak ada di `standardInclusions` atau package-specific list
- ❌ Price yang tidak dari `pricingTable` aktual

### Structure anti-patterns:
- ❌ Trust content sebagai section pertama (sebelum product clarity)
- ❌ Dead-end package page tanpa "closest alternative"
- ❌ Ijen packages tanpa support path ke health screening page

---

## 19. Change Control

Setiap perubahan pada dokumen ini yang memengaruhi salah satu dari berikut wajib direview:

- pricing table (perubahan harga)
- package slug (canonical URL)
- itinerary day count
- inclusions/exclusions
- ijenRelevant flag per package
- destination set

Perubahan data di `lib/jvtoData.ts` harus disinkronkan ke dokumen ini dalam sprint yang sama.

---

*Dokumen ini di-generate dari audit jvto_dev codebase state 2026-04-21*  
*Next review: setelah Phase B (Core Commercial Upgrade) selesai*
