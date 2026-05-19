# Wiki Sync Log — llm-wiki → jvto-web

Tracking implementasi perubahan dari repo `llm-wiki` ke `jvto-web`.
Dimulai dari commit `2da3cc1` (2026-05-18).

---

## Format Entry

```
### [N/30] `SHA` — pesan commit
**Tanggal wiki:** YYYY-MM-DD
**Status:** ✅ Implemented | ⏭️ Skipped (no action needed) | ❌ Partial
**Website commit:** SHA jvto-web (jika ada perubahan)

**File berubah di wiki:** ...
**Implementasi di website:** ...
**Cara verifikasi:** ...
```

---

## Log

### [1/30] `2da3cc1` — feat(schema): add homepage Organization+TravelAgency JSON-LD schema
**Tanggal wiki:** 2026-05-18
**Status:** ✅ Implemented
**Website commit:** `001b29e` (fix(schema): sync Organization schema with wiki canonical)

**File berubah di wiki:**
- ➕ `output/schema/homepage-organization-schema.json` — schema Organization lengkap
- ➕ `output/schema/homepage-organization-schema.receipt.md`
- 📝 `wiki/credentials/trust-signals.md` — tambah logo_url ke §Schema Canonical Values

**Implementasi di website:**
- `src/lib/schemas/entityGraph.ts` — `foundingDate: '2015'` → `'2016'`
- `src/lib/publicContent/organizationSnapshot.ts` — `price_range` dikoreksi ke `"IDR 1,000,000 – IDR 6,050,000 per person"`
- `src/lib/seo/jsonld/builders.ts` — `@type` → `TravelAgency`; tambah `hasMap` (Google Maps CID); tambah `areaServed` (Surabaya, Bondowoso, East Java)

**Cara verifikasi:** Console browser di homepage → cek `foundingDate`, `priceRange`, `hasMap` di Organization schema

---

### [2/30] `e1ca5c6` — chore: ignore playwright artifacts + untrack graph.json; live-verify reviews
**Tanggal wiki:** 2026-05-18
**Status:** ⏭️ Skipped (no action needed)

**File berubah di wiki:** `.gitignore`, `wiki/credentials/trust-signals.md`, `output/schema/homepage-organization-schema.receipt.md`, `.obsidian/graph.json`, `.claude/settings.local.json`

**Alasan skip:** Maintenance wiki internal — bersihkan noise git history, konfirmasi review counts tidak berubah (TP 4.8/51, Google 4.90/92, TA 4.95/21 = 164). Tidak ada perubahan konten atau schema yang perlu diimplementasikan.

---

### [3/30] `c8437c9` — chore(settings): add session-close to Playwright allowlist
**Tanggal wiki:** 2026-05-18
**Status:** ⏭️ Skipped (no action needed)

**File berubah di wiki:** `.claude/settings.local.json`

**Alasan skip:** Konfigurasi Claude Code untuk repo wiki — bukan perubahan konten atau schema.

---

### [4/30] `49ceb2e` — chore(claude): add Current Sprint section after session 2026-05-18
**Tanggal wiki:** 2026-05-18
**Status:** ⏭️ Skipped (no action needed)

**File berubah di wiki:** `CLAUDE.md`

**Alasan skip:** Sprint tracker internal wiki. Open items yang disebutkan (foundingDate, priceRange) sudah di-fix di commit [1/30].

---

### [5/30] `0b4bc47` — chore: confirm magma-feed permanent removal
**Tanggal wiki:** 2026-05-18
**Status:** ⏭️ Skipped (no action needed)

**File berubah di wiki:** `CLAUDE.md`

**Alasan skip:** Resolusi internal wiki — konfirmasi magma-feed sudah dihapus permanent.

---

### [6/30] `75f0d75` — fix: resolve foundingDate contradiction — use 2016 (PT/AHU) in schema
**Tanggal wiki:** 2026-05-18
**Status:** ✅ Implemented
**Website commit:** `41ea523` (implementasi 75f0d75)

**File berubah di wiki:**
- 📝 `CLAUDE.md` — koreksi "PT formal 2023" → 3 era yang benar (2015/2016/2023)
- 📝 `output/schema/homepage-organization-schema.json` — tambah `foundingDate: "2016"`
- 📝 `wiki/credentials/trust-signals.md` — tambah `foundingDate: 2016` ke §Schema Canonical Values
- 📝 `output/schema/homepage-organization-schema.receipt.md`

**Cek keseluruhan file `homepage-organization-schema.json` vs website:**
| Field | Wiki | Status |
|---|---|---|
| `@type TravelAgency` | ✅ | ✅ Fixed commit 1 |
| `foundingDate: 2016` | ✅ | ✅ Fixed commit 1 |
| `hasMap` | ✅ | ✅ Fixed commit 1 |
| `areaServed` | ✅ | ✅ Fixed commit 1 |
| `priceRange` | ✅ | ✅ Fixed commit 1 |
| `sameAs` 8 URL | ✅ | ✅ Website punya 10 URL |
| `identifier` PropertyValue (NIB, HPWKI, ISIC) | ✅ | ✅ Fixed commit 6 |
| `aggregateRating.reviewCount: 164` (cross-platform) | ✅ | ✅ Fixed commit 6 |

**Implementasi di website:**
- `src/lib/seo/jsonld/builders.ts` — tambah `identifier` array (NIB, HPWKI, ISIC sbg PropertyValue); tambah `aggregateRating` dengan `reviewCount: 164`

**Cara verifikasi:**
```javascript
// Console browser di javavolcano-touroperator.com
(() => {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const data = scripts.flatMap(s => { try { const d = JSON.parse(s.textContent); return d['@graph'] || [d]; } catch(e) { return []; } });
  const org = data.find(n => [].concat(n['@type']).includes('TravelAgency'));
  console.log({ identifier: org.identifier?.map(i => `${i.name}: ${i.value}`), aggregateRating: org.aggregateRating });
})();
// Expected: identifier ["NIB: 1102230032918", "HPWKI: AHU-...", "ISIC: 259268"], reviewCount "164"
```

---

## Status Summary

| # | SHA | Pesan | Status | Website commit |
|---|---|---|---|---|
| 1 | `2da3cc1` | feat(schema): add homepage Organization schema | ✅ | `001b29e` |
| 2 | `e1ca5c6` | chore: ignore playwright artifacts | ⏭️ | — |
| 3 | `c8437c9` | chore(settings): Playwright allowlist | ⏭️ | — |
| 4 | `49ceb2e` | chore(claude): Current Sprint | ⏭️ | — |
| 5 | `0b4bc47` | chore: magma-feed removal | ⏭️ | — |
| 6 | `75f0d75` | fix: foundingDate 2016 + identifier + aggregateRating 164 | ✅ | `41ea523` |
| 7 | `0484d8f` | feat(schema): TouristTrip ijen-bromo-madakaripura-3d2n | ✅ | `7ed34f7` |
| 8 | `906e5a7` | feat(schema): TouristTrip bromo-madakaripura-ijen-3d2n | ✅ | handled by commit 7 |
| 9 | `409e9d7` | feat(schema): bulk TouristTrip 14 tours | ✅ | handled by commit 7 |
| 10 | `fdc37ec` | chore(settings): dispatching-parallel-agents | ⏭️ | — |
| 11 | `19379c8` | chore(claude): Current Sprint bulk schema | ⏭️ | — |
| 12 | `7369a43` | output: Bromo refresh + social batch | ⏭️ | DB-driven, website sudah punya MAGMA data |
| 13 | `da414f7` | output: aeo per-destination Q&A | ⏭️ | Destination pages tidak punya FAQ rendering — skip |
| 14 | `cc76f61` | output: faq Papuma + Bromo refresh | ✅ | DB update: insert 3 Level II FAQ (ID 119-121) ke 15 Bromo packages; insert 8 Papuma FAQ (ID 122-129) ke 5 Papuma packages |
| 15 | `1ab7896` | chore(wiki): update INDEX + log | ⏭️ | — |
| 16 | `5614ee6` | chore(claude): Current Sprint bulk compilation | ⏭️ | — |
| 17 | `2e1c1c4` | chore: commit dirty files | ⏭️ | — |
| 18 | `0e68aa1` | cleanup: remove magma-report profile | ⏭️ | — |
| 19 | `6da26fe` | cleanup: flag stale Level II Waspada | ⏭️ | — |
| 20 | `c1a833c` | chore(wiki): update index + log + sprint | ⏭️ | — |
| 21 | `58e2642` | feat(schema): TouristAttraction 5 destinations | ✅ | `eb957ee` |
| 22 | `c14b152` | fix(output): Papuma SUB 4D3N pricing | ⏳ | Perlu verifikasi harga di DB |
| 23 | `46f786e` | chore(claude): resolve Papuma pricing | ⏭️ | — |
| 24 | `f0811af` | ingest: taman-safari itinerary + schema | ⏳ | Perlu verifikasi harga 3/4-5/6-7 pax di DB |
| 25 | `15db2fc` | ingest: route-data-csv | ⏭️ | — |
| 26 | `4f43207` | fix(schema): priceRange Organization | ✅ | handled by commit 1 |
| 27 | `82c1270` | feat(schema): image field 16 TouristTrip | ✅ | `eb957ee` |
| 28 | `7014b7a` | health-check monthly | ⏭️ | — |
| 29 | `c5056d8` | verify: Trustpilot 4.8/51 confirmed | ⏭️ | — |
| 30 | `db9fc73` | ingest: Trustpilot catalog 49 reviews | ⏭️ | — |
| 31 | `9b307b8` | chore: Current Sprint Trustpilot complete | ⏭️ | — |
