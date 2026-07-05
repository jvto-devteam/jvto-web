# CANONICAL FACTS LOCK — jvto-web

> **Provenance:** Adjudicated 2026-07-05 dari `sambuko82/knowledge-catalog-jvto-bootstrap`
> (bundle OKF) + llm-wiki policy pack v6. `foundingDate=2015` didukung artifact
> **Booking.com Guest Review Award 2015** (`references/booking-com-guest-review-award-2015.md`,
> `reference_kind: historical-award-artifact`); klaim "EST 2016" tidak memiliki dukungan
> di katalog terverifikasi dan **dilarang**. <!-- drift-ok: contoh terlarang dikutip sengaja -->

Setiap pelanggaran fakta di bawah ini = **bug**, bukan preferensi gaya. Facts lock ini
menang atas semua sumber lain (design spec, copy lama, CMS draft). Diberlakukan manual
sekarang; diberlakukan mesin via `npm run validate:content` (content-drift validator, W2.5).

Baris dalam dokumen ini yang mengutip contoh SALAH secara sengaja diberi marker
`drift-ok:` agar dilewati validator.

## Facts

- **foundingDate/since = 2015** (era guesthouse). JANGAN PERNAH menulis "EST 2016",
  "Incorporated 2016", atau foundingDate 2016/2020/2023. <!-- drift-ok: contoh terlarang dikutip sengaja -->
  Formalisasi legal = PT Java Volcano Rendezvous, NIB/TDUP era 2023 — disebut hanya
  dalam konteks legal, tanpa mengarang tanggal inkorporasi.
- **Blue fire**: hanya wording "natural phenomenon subject to weather and gas activity /
  cannot be guaranteed". Kata "guaranteed" berdekatan dgn "blue fire" = bug. <!-- drift-ok: contoh terlarang dikutip sengaja -->
- **Ijen health screening**: wording KONDISIONAL + sitasi BBKSDA SE.1658/KSA.9/2024.
- **Police escort**: threshold ≈18 guests, "approval not guaranteed", unit Ditlantas.
- **Deposit 20%**; cancellation = **100% Lifetime Travel Credit** (bukan cash refund).
- **Harga IDR-only** format `IDR 1,550,000/person`.
- **Review counts**: Trustpilot **4.8/51**, Google **4.9/123**, TripAdvisor **4.95/21**,
  cross-platform **4.8/195**.
  Nilai basi terlarang: 112, 4.9/112, 47 reviews, 92, 5.0/5. <!-- drift-ok: contoh terlarang dikutip sengaja -->
- **Email** hello@javavolcano-touroperator.com; **HQ** Jl. Khairil Anwar No.102A
  Bondowoso 68214.
- **NIB/TDUP** 1102230032918 · **AHU**-0023020 · **Kawah Ijen** 2.386m · **Bromo** 2.329m.

## Sumber & adjudikasi foundingDate

| Sumber | Klaim tahun | Bukti di katalog |
|---|---|---|
| Katalog OKF (source of truth) | Tidak ada klaim tahun pendirian eksplisit | Disiplin verified-facts: katalog hanya memuat yang berbukti |
| Jangkar era berdiri | **Booking.com Guest Review Award 2015** — "Ijen Bondowoso Home Stay", 9.4/10 | `references/booking-com-guest-review-award-2015.md` |
| Legal | NIB 1102230032918 + AHU-0023020 + KBLI 79121/79911/62019 — tanpa tanggal inkorporasi | `trust/credentials/legal-registration.md` |
| Design zip "Incorporated 2016 / EST 2016" | **NOL dukungan di katalog** → DRIFT, dikoreksi saat implementasi | — <!-- drift-ok: contoh terlarang dikutip sengaja -->
