# Stale Facts Checklist
> Angka di kolom "live" diverifikasi dari `jvto-web` + `jvto-ekosistem` pada **2026-08-28**.
> Kolom itu pun akan basi. **Selalu jalankan perintah verifikasinya**, jangan kutip tabel ini.

## Nilai hidup per 2026-08-28

| Fakta | Live | Sumber |
|---|---|---|
| Narrative claims | **26** (C1–C9, POL-BPC-01..11, POL-IE-01..06) | `narrative-claims/narrative-claims.json` |
| Trust claims | **9** (C1–C9) | `credentials-and-public-evidence/trust-claims.json` |
| Credentials | **10** (1 `media_sourced`, tanpa hash) | `credentials-and-public-evidence/credentials.json` |
| External entities | **16** | `organization-identity/external-entities.json` |
| Crew | **11 published** (7 guide + 4 driver) + **3 unpublished** | `people-and-crew/people.json` |
| Destinations | **10** | `destination-knowledge/destinations-master.json` |
| Reviews | **221** record; 169 ber-`packageSlug`; 52 tak teratribusi | `credentials-and-public-evidence/reviews.json` |
| Google Maps | **4.9 / 156** (verified 2026-08-25) — satu-satunya sumber rating publik | `review-platforms.json` |
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
| `"PT incorporated 2016-01-01"` | 12 tempat: `verify-jvto/page.tsx:22`, `verify-jvto/legal/page.tsx:72,87`, `history-artifacts/page.tsx:166,201`, `WhyJvtoInteractive.tsx:198`, + 6 file ekosistem | Keputusan 2026-08-03: **tidak ada tahun inkorporasi PT yang diasersikan**. Dekrit yang dipegang berbunyi TAHUN **2023** |
| `founding_date: "2016-01-01"` | `verify-jvto-assets-inventory.json:14` | idem |
| `legal_incorporation_year: 2016` | `trust-claims.json:452` | idem |
| `"195+ verified reviews"`, `152` | `why-jvto/reviews/page.tsx:35,108` | 221 review; Google 156 |
| `4.9/112`, `4.91/203`, `56 reviews/251 media`, Trustpilot 44, Google 138/149 | arsip lama | tabel di atas |
| `"2016-01-01"` sebagai founding date | mana pun | 2015 |
| `aggregateRating: { ratingValue: 0 }` | mana pun yang di-emit | hilangkan node-nya |
| `"... | JVTO"` di title | — | `"... | Java Volcano Tour Operator"` |
| `"8% coverage"`, `"118/1418 nodes"`, `"431→~51 Organization nodes"` | arsip | jalankan audit ulang |
| commit `0e36a9b`, `d3fd6d9`, `205172f0` | arsip | `git log -1` |
| "Fable 5 gratis sampai 2026-06-22" | arsip | buang, sudah kedaluwarsa |

## Cara verifikasi

    npm run test:stale                       # semua asersi di atas sekaligus
    npm run validate                         # 52 rute, JSON-LD
    npm run check:fact-drift                 # NIB / founder / legal name lintas repo
    npm run validate:packages                # registry vs DB
    npm run audit:geo-visibility             # rute live, contentSignal, lastReviewed
    npm run validate:review-pages            # 221 halaman review

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
