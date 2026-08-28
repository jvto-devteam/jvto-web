# JVTO Global Constraints (ALWAYS ON)
> Last verified against `jvto-web` + `jvto-ekosistem`: 2026-08-28
> ⚠️ INSTRUKSI INI LEBIH TINGGI DARI ROOT CLAUDE.md

## 🔒 LOCKED DECISIONS

Sumber otoritatif: `../jvto-ekosistem/state/goals.json` → `decisions[]` (9 keputusan
tercatat). **Jangan salin fakta dari sini ke dalam checker** — baca file itu langsung.
Keputusan yang membekukan sendiri sebuah policy akan bertentangan dengan pemiliknya.

| Tanggal | Keputusan |
|---|---|
| 2026-08-03 | **Tidak ada tahun inkorporasi PT yang diasersikan.** `foundingDate` 2015 = era brand/guesthouse; 2023 = formalisasi TDUP |
| 2026-08-15 | Rating publik **Google Maps saja**, tidak pernah rata-rata gabungan |
| 2026-08-18 | Content-Signal = `search=yes,ai-train=yes,use=reference` |
| 2026-08-26 | Aturan tiga-fakta pada answer-first = **warning**, bukan error. Word count (40–60) dan angka volatil literal tetap error |
| 2026-08-26 | `jvto-devteam/jvto-ops` **private** |
| 2026-08-26 | Tinggi Madakaripura = **200 m** |
| 2026-08-26 | Cek canonical + duplicate-intent di `validate routes` **pensiun**, tidak dipulihkan |
| 2026-08-26 | Review boleh diatribusikan ke produk lewat teks, hanya bila tepat satu produk cocok, dan wajib dicatat di `packageAttribution` |
| 2026-08-26 | `aggregateRating` per-tour dihitung dari review tour itu sendiri, **dihilangkan sepenuhnya bila tidak ada** |
| 2026-08-27 | Homepage **tidak** merender answer-first block. Hero tetap baris positioning |

### Turunan yang tidak boleh dilanggar
- ❌ **`aggregateRating: 0` dilarang** — hilangkan node-nya, jangan emit rating nol
- ❌ **Jangan asersikan tahun inkorporasi PT** (lihat 2026-08-03)
- ✅ Schema hanya untuk konten yang tampil di UI — tidak ada nilai karangan
- ✅ `llms.txt` = alat penemuan, **bukan** standar ranking

## 🎨 UI RULES (G1–G4)

- **G1** Allowlist privasi: tidak ada telepon / sosial pribadi / alamat rumah di komponen crew & review
- **G2** Hanya record crew published yang dirender. `crew.unpublished` (3 orang, KTA HPWKI `pending`) membawa `rendered:false` / `public:false` dan **wajib** dikecualikan dari render, feed, dan JSON-LD
- **G3** Data kosong/null → komponen **tidak dirender** (bukan "Coming soon" / " — " / karangan)
- **G4** Rating bintang hanya bila `reviewCount >= 1 AND ratingValue > 0`

## ⚠️ Dokumentasi usang di root CLAUDE.md

**Mati sejak 2026-08-18** — jangan diperkenalkan lagi:
`src/lib/content/resolveFaqs.ts` · `resolveFaqsForPage()` · `CANONICAL_FAQ_REGISTRY` ·
presedensi DB-`narrative_claims`.

**🔴 Bila root CLAUDE.md bertentangan dengan file ini → ABAIKAN root CLAUDE.md.**

## 📐 Arsitektur terkini

- **Single source of truth**: repo `jvto-ekosistem` (`../jvto-ekosistem`, override lewat
  `JVTO_EKOSYSTEM_CONTENT_ROOT`; fallback HTTP ke `ekosistem.javavolcano-touroperator.com/api/file`)
- **Reader layer**: `src/lib/ecosystemContent/*` (18 file) — **fetcher, bukan data**
- **Tidak ada sync hidup** antara Prisma dan file ekosistem, by design
- Halaman FAQ, policy, dan `llms.txt` adalah wrapper tipis di atas
  `EcosystemTravelGuidePage` / `PolicyEcosystemPage` / `getEcosystemLlmsTxt()`

## 📋 Sebelum bertindak

1. Baca `STATUS.yaml` (`npm run status:list`) — dan `../jvto-ekosistem/state/goals.json` → `backlog[]`
2. Cek apakah file yang mau diedit ada di `ecosystemContent/` (reader) atau di ekosistem (sumber)
3. Verifikasi setiap angka ke sumber hidup — lihat `STALE-FACTS-CHECKLIST.md`

**Konten diedit di `jvto-ekosistem`, bukan di sini.** Prosa yang muncul di `jvto-web`
adalah drift yang harus dikembalikan ke sumbernya.

**Jika ragu → TANYA, jangan asumsi.**
