---
description: Scan both repos for stale facts and contradicted claims
---

# 🕵️ /resolve-stale

Baca `.claude/rules/STALE-FACTS-CHECKLIST.md` untuk nilai hidupnya.
Pindai **dua repo**: `jvto-web` dan `../jvto-ekosistem`.

## Otomatis dulu

    npm run test:stale        # lima regresi keras
    npm run check:fact-drift  # NIB / founder / legal name lintas repo

Perintah ini adalah sapuan manual untuk yang tidak tercakup keduanya.

## Pola yang dicari

1. Asersi inkorporasi PT — dilarang sejak keputusan 2026-08-03, saat ini masih ada 12:

       grep -rn '2016-01-01' src/ --exclude-dir=generated
       grep -rn 'incorporat' src/ --exclude-dir=generated
       grep -rn '2016' ../jvto-ekosistem/1-knowledge-and-evidence-core/
       grep -rn 'legal_incorporation_year' ../jvto-ekosistem/

2. Angka review yang di-hardcode (live: 221 review; Google 4.9/156; Trustpilot 4.8/51; TripAdvisor 4.95/21):

       grep -rnE '(195|203|152|149|138|112|44)\b' src/app src/components
       grep -rn 'reviewCount\|ratingValue' src/ --exclude-dir=generated

3. `aggregateRating` nol yang ter-emit:

       grep -rn 'aggregateRating' src/lib/schemas src/lib/seo

4. Singkatan di title:

       grep -rn 'JVTO' 'src/app/(website)/page.tsx'

5. Founding date:

       grep -rn 'foundingDate\|founding_date' src/ --exclude-dir=generated

6. Prosa yang bocor ke `jvto-web` padahal sumbernya ekosistem:

       npm run audit:ecosystem-visible-content

7. Policy yang dibekukan di dalam checker (pola yang sudah pernah menyebabkan 11 kegagalan palsu selama 8 hari):

       grep -rn 'ai-train\|contentSignal' scripts/

## Format laporan

    ## 🚨 Stale Facts

    ### src/app/(website)/verify-jvto/page.tsx:22
    - Ditemukan : "PT Java Volcano Rendezvous incorporated 2016-01-01"
    - Seharusnya: tidak ada asersi tahun inkorporasi PT (keputusan 2026-08-03);
                  dekrit yang dipegang berbunyi AHU-...TAHUN 2023, terbit 2023-02-08
    - Perbaikan : hapus entri timeline, atau ganti dengan 2023 bila pemilik mengonfirmasi

    ### Ringkasan
    - Total: X   | Bertentangan dengan keputusan tercatat: X | Kosmetik: X

## Aturan
- ❌ **Jangan perbaiki otomatis** — laporkan saja
- ❌ Jangan hand-edit file ekosistem yang membawa catatan "do not hand-edit"
- ✅ Bedakan tiga hal: (a) nilai basi, (b) klaim yang **bertentangan dengan keputusan
  tercatat**, (c) komentar yang justru mendokumentasikan penghapusan nilai basi —
  yang ketiga bukan temuan
- ✅ Konten diperbaiki di `jvto-ekosistem`, bukan di `jvto-web`
