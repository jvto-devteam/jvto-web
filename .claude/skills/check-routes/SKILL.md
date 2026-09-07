---
name: check-routes
description: Rutin — jalankan npm run reconcile:routes dan laporkan hanya tabel exit code + pass/warn/fail + nama rute bermasalah. Untuk pengecekan berkala setelah data ekosistem baru masuk. BUKAN pengganti review task besar, dan bukan cek lokal: tiap run mem-fetch sitemap produksi.
---

# check-routes — pengecekan rute rutin

Untuk pengecekan **berkala** ketika data baru masuk dari ekosistem (review baru,
paket baru, destinasi baru). **Bukan** pengganti review adversarial pada task
besar — untuk itu ada skill `adversarial-review`.

## 🔴 Ini command jaringan

`npm run reconcile:routes` mem-fetch `https://javavolcano-touroperator.com/sitemap.xml`
**setiap kali dijalankan**. Bukan cek lokal.

- **Jangan panggil di dalam loop.**
- **Jangan ulang berturut-turut tanpa jeda.** Satu run per pemeriksaan.
- Pengecualian tunggal: satu run ulang saat exit 2, untuk membedakan kedipan
  origin dari kegagalan sungguhan. Itu pun tetap dieskalasi (lihat di bawah).

## Jalankan

```bash
cd /d/jvto-web && npm run reconcile:routes
```

Jangan tambahkan flag pembatas apa pun. Alat ini membandingkan himpunan; selisih
himpunan atas sebagian data bukan selisih himpunan.

## Aturan pelaporan — HANYA tabel ini

| Exit | pass | warn | fail | Rute bermasalah |
|---:|---:|---:|---:|---|
| `<kode>` | `<n>` | `<n>` | `<n>` | `<nama rute + klasifikasi, atau "—">` |

Tanpa narasi proses. Tanpa "saya curiga lalu ternyata aman". Tabel, lalu satu
baris tindakan.

## Aturan eskalasi — tidak bisa ditawar

| Exit | Arti | Tindakan |
|---:|---|---|
| **0** | rekonsiliasi selesai, nol FAIL | **"tidak ada tindakan"** |
| **1** | pengukuran terjadi, kontrak dilanggar | **eskalasi — sebut nama tiap rute FAIL** beserta klasifikasinya |
| **2** | **pengukuran TIDAK terjadi** | **SELALU eskalasi**, label: **"PENGUKURAN GAGAL — bukan status situs, tapi alat tidak bisa mengukur"** |

**Exit 2 tidak boleh pernah ditulis sebagai "aman", "hijau", "bersih", atau
"tidak ada tindakan" — dalam kondisi apa pun.**

Sebabnya bukan kehati-hatian berlebih. Run exit 2 menghasilkan **nol baris
FAIL**, jadi aturan yang hanya melihat FAIL akan mencetak "tidak ada tindakan"
pada run yang tidak mengukur apa pun: sitemap tak terjangkau, manifest
terpotong, floor jebol, repo ekosistem tak terbaca. Laporannya akan terlihat
identik dengan hari yang sehat. Itu kelas cacat yang seluruh T01/T02 dibangun
untuk mencegah.

Pada exit 2: jalankan **satu** kali ulang, lalu eskalasi apa pun hasilnya —
sebutkan apakah run kedua mereproduksinya. Run kedua membedakan kedipan origin
dari kegagalan nyata; ia **tidak** membatalkan eskalasi.

## WARN — aturan 7 hari

WARN tidak dieskalasi saat pertama muncul, tapi harus **dicatat dengan tanggal**,
karena skill tidak punya memori antar-sesi. Tempat yang bertahan adalah
`STATUS.yaml`.

1. `npm run status:list` — cari apakah WARN ini sudah tercatat.
2. **Belum tercatat** → catat, jangan eskalasi:
   ```bash
   npm run status:set -- ROUTE_WARN_<slug> TODO "<klasifikasi> pada <rute>. Terdeteksi <YYYY-MM-DD>."
   ```
   Tanggal wajib ditulis. Tanpa tanggal, aturan 7 hari tidak bisa dievaluasi dan
   akan diam-diam tidak pernah menyala.
3. **Sudah tercatat, tanggalnya >7 hari dari hari ini** → **eskalasi**, sebut
   sudah berapa hari bertahan.

WARN yang bertahan lebih dari seminggu bukan lagi lag deployment — itu sesuatu
yang tidak ada yang perbaiki.

## Yang TIDAK dilakukan skill ini

- Tidak mengubah kode, kontrak, atau `publicRouteContract.ts`.
- Tidak menurunkan floor di `reconcile-route-outputs.mjs` atau `SOURCE_FLOORS`
  agar sebuah run lolos. Menurunkan floor tanpa alasan terukur = mematikan
  penjaga, bukan merawatnya.
- Tidak menyimpulkan status situs. Rute 200 atau tidak adalah urusan
  `npm run verify:live -- --sitemap`.
