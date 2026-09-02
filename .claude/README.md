# Claude Code Setup for JVTO

    .claude/
    ├── rules/
    │   ├── GLOBAL-CONSTRAINTS.md    # konstitusi — mengalahkan root CLAUDE.md
    │   └── STALE-FACTS-CHECKLIST.md # nilai hidup + nilai basi yang masih ada di kode
    ├── commands/
    │   ├── audit-schema.md          # /audit-schema
    │   ├── check-density.md         # /check-density [file]
    │   └── resolve-stale.md         # /resolve-stale
    └── README.md

## Dua repo

| Repo | Peran |
|---|---|
| `jvto-web` (di sini) | Aplikasi Next.js. `src/lib/ecosystemContent/*` = **reader**, bukan data |
| `../jvto-ekosistem` | **Sumber kebenaran tunggal** — konten, kredensial, keputusan, backlog |

**Konten diedit di `jvto-ekosistem`.** Prosa yang muncul di `jvto-web` adalah drift.
Tidak ada sync hidup antara Prisma dan file ekosistem, by design.

## Mulai sesi

1. `.claude/rules/GLOBAL-CONSTRAINTS.md`
2. `npm run status:list` — dan `../jvto-ekosistem/state/goals.json` → `backlog[]`
3. `.claude/rules/STALE-FACTS-CHECKLIST.md` sebelum mengutip angka apa pun

## Perintah

| Perintah | Guna |
|---|---|
| `/audit-schema` | Audit JSON-LD terhadap data ekosistem |
| `/check-density [file]` | Fact density terhadap baseline terukur |
| `/resolve-stale` | Sapu nilai basi di kedua repo |

## Checker

    npm run test:stale               # 11 asersi regresi (baseline: 11/11 hijau)
    npm run validate                 # 52 rute JSON-LD (baseline: 52 ok, 0 gagal)
    npm run validate:packages        # registry vs DB (baseline: 0 error, 4 warning)
    npm run validate:review-pages    # 228 halaman review (baseline: semua ok) — angka ini bergerak tiap sync ekosistem; jalankan, jangan kutip
    npm run audit:geo-visibility     # rute live (baseline: 0 gagal, 3 warning)
    npm run audit:ecosystem-visible-content
    npm run check:fact-drift
    npm run check:density -- <file>

`test:stale` berjalan di test runner bawaan Node — tanpa jest, tanpa dependency baru.
Node ≥ 23.6 melakukan type-stripping TypeScript secara native.

## Status

    npm run status:list
    npm run status:set -- ITEM_ID DONE
    npm run status:set -- ITEM_ID BLOCKED "alasan"

Perhatikan `--` sebelum argumen — npm butuh itu untuk meneruskannya.

## Aturan yang paling sering dilanggar

1. **Jangan emit `aggregateRating: 0`** — hilangkan node-nya (keputusan 2026-08-26)
2. **Tiga tahun untuk tiga hal, jangan saling menggantikan** (DEC-002, 2026-08-03):
   `marketing_founding_year` / `foundingDate` = **2015** · `legal_incorporation_year` = **2016** ·
   `tdup_issued_year` = **2023**. Baris ini dulu berbunyi *"jangan asersikan tahun inkorporasi PT"* —
   **itu salah**, keputusan semacam itu tidak ada di `goals.json`; yang tercatat DEC-002 di
   `trust-claims.json` C8, dikunci `trust-claims.test.mjs:164`. Dikoreksi 2026-09-02
3. **Rating publik = Google Maps saja**, tidak pernah rata-rata gabungan (2026-08-15)
4. **Jangan bekukan policy di dalam checker** — baca `state/goals.json`. Pola ini pernah
   menghasilkan 11 kegagalan palsu selama 8 hari
5. **Jangan hand-edit** file ekosistem yang membawa catatan "do not hand-edit"
6. **Root CLAUDE.md sebagian usang** — `GLOBAL-CONSTRAINTS.md` yang menang

## File kunci

| File | Isi |
|---|---|
| `STATUS.yaml` | Open item sisi jvto-web |
| `../jvto-ekosistem/state/goals.json` | Keputusan tercatat, backlog, baseline terukur |
| `../jvto-ekosistem/1-knowledge-and-evidence-core/` | Konten + kredensial |
| `src/lib/ecosystemContent/` | Reader layer (18 file) |
| `src/lib/schemas/entityGraph.ts` | 11 DEFINED_TERMS, `foundingDate` |
