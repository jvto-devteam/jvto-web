# Stale Facts Checklist
> Angka di kolom "live" diverifikasi dari `jvto-web` + `jvto-ekosistem` pada **2026-09-02**.
> Kolom itu pun akan basi. **Selalu jalankan perintah verifikasinya**, jangan kutip tabel ini.
>
> Bukan teori: pada 2026-09-02 tabel ini sendiri kedapatan basi (Google 156→161,
> reviews 221→226) dan dua barisnya salah sasaran. Satu baris yang keliru — yang
> menyuruh memperlakukan `legal_incorporation_year: 2016` sebagai nilai basi —
> sempat menyebabkan satu commit mengisi slot inkorporasi dengan tahun TDUP.

## Nilai hidup per 2026-08-28

| Fakta | Live | Sumber |
|---|---|---|
| Narrative claims | **26** (C1–C9, POL-BPC-01..11, POL-IE-01..06) | `narrative-claims/narrative-claims.json` |
| Trust claims | **9** (C1–C9) | `credentials-and-public-evidence/trust-claims.json` |
| Credentials | **10** (1 `media_sourced`, tanpa hash) | `credentials-and-public-evidence/credentials.json` |
| External entities | **16** | `organization-identity/external-entities.json` |
| Crew | **11 published** (7 guide + 4 driver) + **3 unpublished** | `people-and-crew/people.json` |
| Destinations | **10** | `destination-knowledge/destinations-master.json` |
| Reviews | **226** record; 169 ber-`packageSlug`; 57 tak teratribusi | `credentials-and-public-evidence/reviews.json` |
| Google Maps | **4.9 / 161** (verified 2026-09-01) — satu-satunya sumber rating publik | `review-platforms.json` |
| Trustpilot | 4.8 / 51 (verified 2026-05-09) | `review-platforms.json` |
| TripAdvisor | 4.95 / 21 | `review-platforms.json` |
| `DEFINED_TERMS` | **11** | `src/lib/schemas/entityGraph.ts` |
| Rute schema-checked | **52**, 0 gagal | `npm run validate` |
| `foundingDate` | **2015** (era brand/guesthouse) | `organization-identity/organization.json` |
| NIB | `1102230032918` | `credentials.json` |
| TDUP | `1102230032918`, terbit 2023-02-11 — **sama dengan NIB by design** (rezim OSS) | `organization.json` |
| AHU | `AHU-0010187.AH.01.01.TAHUN 2023`, terbit **2023-02-08** | `credentials.json` |
| Content-Signal | `search=yes,ai-train=yes,use=reference` | `state/goals.json` → `policies` |

## 🔴 Nilai basi yang MASIH ada di kode — jangan tiru, jangan perbaiki diam-diam

| Nilai basi | Di mana | Yang benar |
|---|---|---|
| `"Incorporated: 2023"` di slot inkorporasi | `verify-jvto/legal/page.tsx`, `verify-jvto/page.tsx`, `history-artifacts/page.tsx`, `WhyJvtoInteractive.tsx` (konstanta `FALLBACK`) | **2016.** DEC-002 menetapkan `legal_incorporation_year` = 2016; 2023 adalah `tdup_issued_year` (terbit AHU/TDUP). Ketiga tahun tidak boleh saling menggantikan |
| `"195+ verified reviews"` | `why-jvto/reviews/page.tsx:35` | 226 review; Google 161. Catatan: literal ini ada di sisi kanan `??` yang tidak pernah menyala selama ekosistem memasok deskripsi |
| `4.9/112`, `4.91/203`, `56 reviews/251 media`, Trustpilot 44, Google 138/149 | arsip lama | tabel di atas |
| `founding_date: "2016-01-01"` | ekosistem `verify-jvto-assets-inventory.json:14` | **2015.** `foundingDate` (era brand) ≠ `legal_incorporation_year` (2016). Field ini bernama *founding*, jadi 2015 — jangan disamakan dengan baris inkorporasi di atas |
| `"... \| JVTO"` sebagai sufiks title | **14 kemunculan di 8 file** (diverifikasi 2026-09-02): `destinations/[slug]/page.tsx:58-62` (5), `travel-guide/page.tsx:395,439`, `blog/[slug]/page.tsx:39,62`, `tours/from-bali/page.tsx:26`, `tours/from-surabaya/page.tsx:26`, `isic/student-package/page.tsx:23`, `verify-jvto/legal/page.tsx:19`, `verify-jvto/press-recognition/page.tsx:18` | `"... \| Java Volcano Tour Operator"`. **Tes hanya menjaga homepage** (`validate-stale-facts.test.ts:97-107`), jadi sisanya menyimpang tanpa terdeteksi. ⚠️ BUKAN pelanggaran, jangan diubah: `blog/page.tsx:13` (`"Insights \| JVTO's Blog…"`, posesif di tengah) dan `blog/why-not-unlicensed-ijen-operator/page.tsx:12` (`"… \| JVTO Field Notes"`) |
| `"8% coverage"`, `"118/1418 nodes"`, `"431→~51 Organization nodes"` | arsip | jalankan audit ulang |
| commit `0e36a9b`, `d3fd6d9`, `205172f0` | arsip | `git log -1` |
| "Fable 5 gratis sampai 2026-06-22" | arsip | buang, sudah kedaluwarsa |

## Cara verifikasi

    npm run test:stale                       # semua asersi di atas sekaligus
    npm run validate                         # 52 rute, JSON-LD
    npm run check:fact-drift                 # NIB / founder / legal name lintas repo
    npm run validate:packages                # registry vs DB
    npm run audit:geo-visibility             # rute live, contentSignal, lastReviewed
    npm run validate:review-pages            # 226 halaman review

Angka mentah dari ekosistem:

    node -e "console.log(require('../jvto-ekosistem/1-knowledge-and-evidence-core/narrative-claims/narrative-claims.json').claims.length)"
    node -e "console.log(require('../jvto-ekosistem/1-knowledge-and-evidence-core/credentials-and-public-evidence/review-platforms.json').profiles)"
    node -e "console.log(require('../jvto-ekosistem/state/goals.json').baseline.byPageType)"

> **`narrativeClaims.ts`, `people.ts`, `externalEntities.ts`, `reviewPlatforms.ts` adalah
> fetcher, bukan data.** Meng-grep isinya untuk menghitung record selalu salah — datanya
> ada di `../jvto-ekosistem`.

## Baseline fact-density terukur (2026-08-27, 295 rute live, MEDIAN)

Alat: `jvto-web/scripts/audit-answer-structure.py`. Agregasi **median**, bukan mean —
baseline yang diambil dengan mean tidak sebanding.

| Tipe | Density | ≥3 angka di 120 kata pertama |
|---|---|---|
| trust | 0.88 | 4/5 |
| pdp | 0.59 | 17/17 |
| why-jvto | 0.54 | 2/6 |
| destination | 0.48 | 6/6 |
| blog | 0.43 | 2/4 |
| homepage | 0.42 | 0/1 |
| policy | 0.40 | 1/4 |
| travel-guide | 0.27 | 5/12 |
| crew | 0.10 | 11/11 |

Homepage rendah **by design** (keputusan 2026-08-27), dan density rendah di halaman crew
**bukan cacat** — halaman itu dibangun dari kutipan verbatim tamu.
