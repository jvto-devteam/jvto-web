# Laporan Insiden Keamanan — Kebocoran Kredensial di Repository `jvto-web`

**Tanggal laporan:** 16 Agustus 2026
**Dilaporkan oleh:** David (dengan bantuan Claude/AI assistant)
**Untuk:** Sam

---

## 1. Temuan Audit

### Apa yang ditemukan
Dokumen `README.md` di repository `jvto-web` (branch `live`, yang aktif dipakai untuk deploy production) berisi **kredensial asli dalam bentuk plaintext** — bukan cuma satu, tapi 11 kredensial berbeda, ditulis langsung sebagai teks biasa, bisa dibaca siapa pun yang punya akses ke repository.

### Kredensial yang bocor
| # | Kredensial | Layanan |
|---|---|---|
| 1 | Login akun Hostinger (email + password) | Kontrol panel VPS |
| 2 | Password root SSH | Akses langsung ke server (`31.97.223.43`) |
| 3 | GitHub Personal Access Token | Akses ke seluruh source code |
| 4 | API key Mailgun | Pengiriman email otomatis |
| 5 | Password PostgreSQL superuser (`postgres`) | Akses penuh ke database production |
| 6 | Password PostgreSQL `metrics` | Monitoring database (khusus Grafana) |
| 7 | Password PgBouncer `app_user` | Koneksi aplikasi ke database |
| 8 | Password PgBouncer `pgbouncer` | Admin connection pooler |
| 9 | Password admin Grafana | Dashboard monitoring |
| 10 | Password admin Adminer | Web-UI akses database |

### Sudah berapa lama bocor
Kredensial ini ada di file README **sejak 3 September 2025** — hampir **1 tahun**. Bukan kejadian baru.

### Kenapa bisa terjadi 2 kali
Kredensial ini sebenarnya **sudah pernah dibersihkan sekali**, tanggal 2 Agustus 2026, tapi hanya di branch `main`. Beberapa saat setelahnya, ada operasi "restore ke versi lama" di branch `live` (untuk mengatasi masalah production yang tidak berhubungan) yang **tanpa sengaja mengembalikan versi README yang masih plaintext**. Kredensial itu sempat "hidup lagi" di branch production tanpa disadari, sampai dibersihkan ulang pagi ini (15 Agustus, 08:30) — yang jadi pemicu audit ini.

### Kondisi yang memperparah
- **Riwayat visibility repository** (menurut informasi David, belum terverifikasi independen karena GitHub tidak menyediakan riwayat perubahan visibility tanpa plan Enterprise): repository ini **awalnya private**, lalu **sempat diubah menjadi public** di suatu titik, dan **sekarang sudah private kembali**. Ini berarti ada periode waktu di mana kredensial ini berpotensi terlihat oleh **siapa saja di internet**, bukan cuma anggota tim internal — bukan cuma soal "siapa yang punya akses repo", risikonya lebih luas dari yang tercatat semula. Tanggal pasti kapan sempat public dan berapa lama tidak bisa dipastikan lewat pengecekan kami.
- Saat ini repository **private** (status terkini terverifikasi langsung lewat GitHub API), tapi organisasi GitHub kita masih di **plan Free**, yang berarti:
  - Branch `live` **tidak bisa diberi proteksi** (butuh upgrade ke plan berbayar)
  - **Tidak ada secret scanning otomatis** yang bisa mendeteksi kalau kredensial ke-commit lagi di masa depan (juga butuh upgrade plan)
- Karena `.env`/`.env.local` server production sama sekali tidak tersentuh (hanya README dokumentasi yang bocor), **aplikasi tetap jalan normal** selama ini — bukan berarti amannya sistem, tapi memang aplikasinya sendiri tidak baca kredensial dari file yang bocor itu.

### Yang TIDAK bisa kami pastikan
**Kami tidak punya cara untuk memastikan apakah kredensial ini pernah benar-benar disalahgunakan** oleh siapa pun selama hampir setahun terbuka. Kami tidak punya akses ke log akses SSH server, log koneksi database, atau audit log GitHub level-organisasi (butuh plan Enterprise) untuk mengecek riwayat pemakaian. Ini bukan "sudah dipastikan aman", tapi "tidak ada alat untuk mengecek".

Ini jadi lebih penting mengingat repo sempat berstatus **public** — kalau itu benar dan tumpang tindih dengan periode kredensial masih plaintext di README, jendela risikonya bukan cuma "4 anggota tim kami", tapi berpotensi siapa saja yang kebetulan menemukan repo publik itu selama periode tersebut (termasuk bot/scanner otomatis yang memang aktif mencari kredensial bocor di repo publik GitHub — ini praktik umum yang nyata terjadi).

---

## 2. Yang Sudah Dikerjakan

### Rotasi kredensial (semua 9 yang nyata — 2 di antara 11 daftar awal ternyata duplikat/salah identifikasi)
- ✅ Password akun Hostinger — diganti
- ✅ Password root SSH VPS — diganti
- ✅ GitHub PAT yang bocor — dihapus (dicek dulu tidak dipakai automation aktif)
- ✅ API key Mailgun — dihapus (ternyata belum pernah dipakai)
- ✅ Password PostgreSQL `postgres` (superuser) — diganti, dan file konfigurasi aplikasi (`.env`) + PgBouncer diupdate mengikuti, aplikasi dites ulang jalan normal
- ✅ Role PostgreSQL `metrics` — **dihapus total** (bukan diganti — ternyata cuma dipakai Grafana)
- ✅ Password PgBouncer `app_user` dan `pgbouncer` — diganti
- ✅ Password admin Adminer — diganti (ternyata bukan akun database, tapi proteksi web terpisah — sudah dikoreksi juga di laporan ini)
- ✅ **Grafana di-uninstall total dari server** — bukan sekadar ganti password, servicenya dihapus sepenuhnya karena memang tidak terpakai. Ini menghilangkan satu risiko permanen, bukan cuma ditambal.

### Pembersihan git history
Menghapus kredensial dari file saat ini **tidak cukup** — riwayat commit lama di git masih menyimpan versi plaintext-nya selama-lamanya kalau tidak dibersihkan terpisah. Jadi:
- ✅ Backup penuh repository dibuat dulu sebelum apa pun diubah
- ✅ Seluruh riwayat `README.md` yang pernah mengandung kredensial asli (dari commit pertama sampai commit pembersihan terakhir) — isinya diganti dengan catatan aman, bukan dihapus filenya
- ✅ File `.claude/settings.local.json` (yang ternyata juga menyimpan 1 connection string database) — dihapus total dari seluruh riwayat
- ✅ Riwayat baru ini di-push paksa ke GitHub, menggantikan riwayat lama, dan diverifikasi 3 cara berbeda bahwa perubahannya benar-benar tersimpan

### Temuan tambahan di luar rencana (ditemukan saat verifikasi, bukan bagian dari audit awal)
Selagi memastikan sistem tetap jalan normal setelah rotasi, ditemukan **2 bug produksi yang tidak berhubungan langsung dengan kebocoran ini, tapi cukup serius**:
1. **Server ekosistem gagal deploy** karena kehabisan memori saat proses build — sudah diperbaiki (batas memori dinaikkan)
2. **Satu halaman di website (`/policy/*`) punya bug lama** yang sudah ada sebelum kejadian ini — bug itu diam-diam menggagalkan *setiap* proses deploy production selama beberapa minggu terakhir tanpa disadari. Sudah ditemukan dan diperbaiki, deploy sekarang berjalan normal.

---

## 3. Hasil Sekarang, Jujur

| Item | Status | Catatan |
|---|---|---|
| Semua kredensial dirotasi | ✅ **Selesai** | 9/9, terverifikasi aplikasi tetap jalan normal |
| Kredensial dihapus dari file saat ini | ✅ **Selesai** | Sejak versi commit pagi ini |
| Kredensial dihapus dari **riwayat git** | ✅ **Selesai** | Diverifikasi langsung di GitHub, bukan cuma lokal |
| Audit log akses (siapa pernah pakai kredensial lama) | ❌ **Belum, dan sulit dilakukan** | Butuh akses log server + GitHub Enterprise yang tidak tersedia saat ini |
| Secret scanning otomatis diaktifkan | ❌ **Belum bisa** | Terblokir plan GitHub Free — butuh upgrade berbayar (GitHub Team, ~$4/user/bulan minimal) |
| Branch `live` diberi proteksi | ❌ **Belum bisa** | Sama, terblokir plan Free |
| Riwayat PR lama di GitHub (`refs/pull/*`) | ⚠️ **Residual, risiko rendah** | GitHub menyimpan riwayat PR lama terpisah, tidak ikut terhapus otomatis — secara teknis versi lama masih ada di sana, tapi kredensialnya sudah mati (tidak berguna lagi kalau ditemukan) |

### Kesimpulan jujur
Risiko **langsung** dari insiden ini sudah ditutup — semua kredensial yang bocor sudah tidak valid lagi, dan riwayat git yang jadi sumber kebocoran sudah dibersihkan di tempat yang paling penting (branch `main` dan `live`). Yang **belum** bisa diselesaikan murni karena keterbatasan plan GitHub (Free tier) — kalau mau proteksi otomatis jangka panjang (branch protection + secret scanning supaya kejadian ini tidak terulang tanpa disadari), itu perlu keputusan upgrade plan, bukan sesuatu yang bisa dikerjakan lewat kode.

Tidak ada bukti kuat kejadian ini pernah dieksploitasi — tapi juga tidak ada bukti kuat sebaliknya, karena alatnya memang tidak tersedia untuk mengecek. Yang paling bertanggung jawab untuk dilakukan ke depan: anggap ini pelajaran untuk selalu pakai vault/password manager, jangan pernah tulis kredensial di file yang ikut ter-commit, apa pun alasannya.

---

## Apakah Sekarang Sudah Aman?

Jawaban jujurnya bukan "ya" atau "tidak" mutlak — ada yang sudah benar-benar tertutup, ada yang belum.

**Sudah aman (untuk insiden spesifik ini):**
- Semua 9 kredensial yang bocor **sudah tidak valid lagi** — nilai lama yang sempat terbuka selama hampir setahun (atau lebih lama, kalau menghitung periode repo sempat public) **tidak bisa dipakai apa pun lagi**, sekalipun seseorang masih menyimpan salinannya
- Nilai lama itu juga **sudah tidak bisa ditemukan lagi** di riwayat git yang jadi sumber kebocoran (branch `main` dan `live`)
- Sistem tetap berjalan normal setelah semua rotasi — sudah diverifikasi langsung, bukan asumsi

**Belum bisa dibilang aman (risiko struktural, bukan soal kredensial spesifik ini lagi):**
- **Tidak ada yang mencegah kejadian yang sama terulang tanpa disadari** — branch `live` masih belum diproteksi, dan tidak ada secret scanning otomatis. Kalau ada yang tidak sengaja commit kredensial lagi besok, tidak akan ada yang memberi peringatan otomatis, sama seperti kejadian ini yang baru ketahuan setelah hampir setahun
- **Tidak ada cara memastikan apakah kebocoran kemarin sudah pernah dimanfaatkan** sebelum hari ini — kalau memang pernah (misalnya database sempat diakses/disalin orang lain), rotasi password hari ini tidak membatalkan apa yang sudah terlanjur terjadi di masa lalu
- Riwayat Pull Request lama di GitHub (`refs/pull/*`) masih menyimpan versi lama — risikonya rendah (kredensialnya sudah mati), tapi belum benar-benar hilang 100%

**Kesimpulan:** ancaman langsung dari kredensial yang bocor kemarin — **sudah ditutup**. Tapi supaya kejadian serupa tidak terjadi lagi tanpa disadari di masa depan, masih perlu keputusan upgrade plan GitHub (untuk branch protection + secret scanning). Itu bukan sesuatu yang bisa saya selesaikan lewat kode — itu keputusan bisnis yang perlu Sam/tim ambil.
