---
description: Check fact density of content files against the measured live baseline
---

# 📊 /check-density [file-path]

## Baseline, bukan target karangan

Ambang di bawah ini berasal dari **pengukuran nyata** atas 295 rute live
(`../jvto-ekosistem/state/goals.json` → `baseline`, diukur 2026-08-27 dengan
`scripts/audit-answer-structure.py`, agregasi MEDIAN).

| Tipe | Baseline | Ambang (baseline − 0.05) | ≥3 angka di 120 kata pertama |
|---|---|---|---|
| trust | 0.88 | 0.83 | 4/5 |
| pdp | 0.59 | 0.54 | 17/17 |
| why-jvto | 0.54 | 0.49 | 2/6 |
| destination | 0.48 | 0.43 | 6/6 |
| blog | 0.43 | 0.38 | 2/4 |
| homepage | 0.42 | 0.37 | 0/1 |
| policy | 0.40 | 0.35 | 1/4 |
| travel-guide | 0.27 | 0.22 | 5/12 |
| crew | 0.10 | — | 11/11 |

**Aturannya: jangan turun di bawah baseline.** Halaman baru dinilai terhadap median
tipenya, bukan terhadap angka aspiratif. Target 1.0–1.2 yang beredar di arsip lama akan
memvonis FAIL hampir seluruh situs — persis pola yang sudah ditolak pada 2026-08-26
(*checker yang menyalak di 40% korpus akan dibungkam orang*).

Dua pengecualian yang **bukan** cacat:
- **homepage** rendah by design — keputusan 2026-08-27, hero tetap baris positioning, tanpa answer-first block
- **crew** 0.10 — halaman itu dibangun dari kutipan verbatim tamu

## Definisi fakta

Dihitung:
- Angka bersatuan: `2.386 m`, `3 km`, `90 min`, `20%`
- Tanggal/periode: `sejak Maret 2019`, `2023-02-11`
- Nama entitas resmi: `BBKSDA Jawa Timur`, `Ditlantas`, `Kementerian Hukum dan HAM RI`
- Nomor regulasi/kredensial: `SE.1658/K2/BIDTEK.1/KSA/9/2024`, `NIB 1102230032918`, `AHU-0010187.AH.01.01.TAHUN 2023`
- Nama tempat spesifik: `Paltuding`, `Tengger`, `Bondowoso`
- Nama orang yang diatribusikan

Tidak dihitung: adjektiva tak terukur (`amazing`, `terbaik`), superlatif tanpa dasar, janji generik.

## Fluff blacklist

Tidak boleh berdiri tanpa fakta pendamping:
`menakjubkan, tak terlupakan, magis, surga tersembunyi, pengalaman seumur hidup, terbaik,
paling terpercaya, nomor satu, pelayanan prima, kepuasan Anda prioritas kami, tim
profesional, harga bersaing`

## Checklist pra-publish

1. Answer block 40–60 kata di posisi pertama — **error** kalau meleset
2. Angka volatil ditulis sebagai token, bukan literal — **error**
3. ≥3 angka bersatuan di 120 kata pertama — **warning** (keputusan 2026-08-26; aturan ini menyala di 25 dari 56 blok live)
4. Density tidak turun di bawah baseline tipenya
5. Setiap klaim regulatif menyebut nomor atau otoritasnya
6. Tidak ada kata fluff tanpa fakta
7. Paragraf 40–60 kata / satu gagasan
8. Heading berbentuk pertanyaan
9. ≥1 kutipan verbatim (halaman paket/crew)
10. Stempel `lastReviewed` ada

## Alat

    npm run check:density -- <file>          # heuristik cepat, file prosa
    node scripts/tools/fact-density.js <file> --json
    python3 scripts/audit-answer-structure.py # pengukur yang menghasilkan baseline

### Batas alat cepat (divalidasi 2026-08-28)

- **Hanya untuk prosa** (markdown/JSON ekosistem). Diarahkan ke `.tsx`, "kalimat"-nya
  adalah JSX dan hasilnya artefak, bukan temuan.
- **Density cenderung understated** — pemisah kalimat pecah di setiap titik, jadi desimal
  (`2.386 m.`) dan nomor regulasi (`SE.1658/K2/...`) menggelembungkan penyebut.
- **Fluff dideteksi substring**, ditandai walau ada fakta di sebelahnya. Konfirmasi manual.
- Untuk angka yang mengikat, pakai `audit-answer-structure.py` — itu yang menghasilkan baseline.

## Terkait
Skill `jvto-ops:answer-first` untuk menulis blok 40–60 katanya.
Konten diedit di `jvto-ekosistem`, bukan di `jvto-web`.
