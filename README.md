# Dokumentasi Lengkap & Runbook Operasional - Proyek jvto-web

Dokumen ini adalah rekapitulasi dan panduan teknis lengkap berdasarkan proses setup server dari awal hingga akhir. Tujuannya adalah sebagai pusat informasi tunggal untuk semua hal yang berkaitan dengan infrastruktur, deployment, dan pemeliharaan aplikasi `jvto-web`.

---

## 1. Visi & Strategi Proyek

Tujuan utama dari proyek ini adalah melakukan pembangunan ulang sistem dari **Laravel** di hosting lama ke **Next.js** di infrastruktur VPS yang modern dan terukur.

-   **Domain Produksi (Masa Depan):** `javavolcano-touroperator.com`
-   **Domain Staging/Development (Saat Ini):** `java-tour.com`
-   **Strategi:** Menggunakan `java-tour.com` sebagai lingkungan *staging* yang identik dengan produksi untuk membangun dan menguji sistem baru tanpa mengganggu website lama. Setelah sistem baru siap, domain utama akan diarahkan ke infrastruktur baru ini.

---

## 2. Rincian Infrastruktur

-   **Penyedia VPS:** Hostinger
-   **Alamat IP VPS:** `31.97.223.43`
-   **Sistem Operasi:** Ubuntu/Debian based
-   **Web Server:** Nginx
-   **Aplikasi:** Next.js (Project `/app/jvto-web`)
-   **Database:** PostgreSQL 17, PgBouncher, PgBackrest
-   **Process Manager:** PM2
-   **DNS & Keamanan Jaringan:** Cloudflare (akun JVTO Dev Team)

---

## 3. Akses & Kredensial

> **Semua kredensial di bawah ini TIDAK disimpan di repository.** Lihat vault/password manager tim (mis. 1Password/Bitwarden) untuk nilai aktual. Jika Anda menemukan kredensial plaintext di histori Git repo ini, anggap **bocor** dan laporkan untuk rotasi segera — jangan menambahkannya kembali di sini.

### Akses Hostinger (SSH)
Akses ke server dilakukan melalui SSH sebagai user `root`. Kredensial: lihat vault tim, entri "Hostinger VPS root".

### Akses Server (SSH)
```bash
ssh root@31.97.223.43
```
Password: lihat vault tim, entri "Hostinger VPS root".

### Akses GIT
Github Repository:
https://github.com/jvto-devteam/jvto-web.git

Personal Access Token: lihat vault tim, entri "GitHub PAT jvto-web". Jangan commit PAT ke repository — gunakan GitHub CLI login atau credential manager lokal.

### Mailgun
API Key: lihat vault tim, entri "Mailgun jvto-web".

### PostgreSQL Metrics
Password: lihat vault tim, entri "PostgreSQL metrics user".

### PostgreSQL Pgbouncer
User `app_user` dan user `pgbouncer`. Password: lihat vault tim, entri "PgBouncer".

### Akses Adminer
https://db.java-tour.com

User `admin` dan user `postgres`. Password: lihat vault tim, entri "Adminer / PostgreSQL admin".

## 4. Runbook Operasional (Panduan Teknis)
### Prosedur Deployment Versi Baru
Setiap kali ada perubahan baru yang sudah digabungkan (merge) ke branch main di GitHub, lakukan langkah-langkah berikut di terminal VPS:

```bash
cd /app/jvto-web
git pull origin main
npm install
npm run build
pm2 restart jvto-web
```

### Management Layanan
Manajemen Layanan
Gunakan perintah berikut jika perlu mengelola salah satu layanan utama:

```bash
Nginx: sudo systemctl [status|start|stop|restart] nginx
PostgreSQL: sudo systemctl [status|start|stop|restart] postgresql
Aplikasi Next.js (via PM2): pm2 [status|start|stop|restart] jvto-web
```

### Strategi Backup Database (pgBackRest)
- Jadwal Backup Penuh (Full): Setiap hari Minggu, pukul 02:00 pagi.
- Jadwal Backup Diferensial (Diff): Setiap hari Senin s/d Sabtu, pukul 02:00 pagi.
- Lokasi File Backup: `/var/lib/pgbackrest`
- Cara Cek Status Backup :
```bash
sudo -u postgres pgbackrest --stanza=jvto info
```

### Troubleshooting & Pengecekan Log
- Log Aplikasi Next.js: `pm2 logs jvto-web`
- Log Error Nginx: `sudo tail -n 100 /var/log/nginx/error.log`
- Log Sistem (untuk Cron Job): `sudo grep CRON /var/log/syslog`

### Rencana Rollback Singkat
Jika terjadi error kritis setelah deployment, lakukan langkah-langkah berikut untuk kembali ke versi stabil sebelumnya:
- Masuk ke direktori proyek: cd /app/jvto-web
- Kembali ke commit terakhir yang stabil: git checkout [commit_id_terakhir_yang_stabil]
- Bangun ulang aplikasi: npm run build
- Restart aplikasi: pm2 restart jvto-web

## 5. Konfigurasi & Arsitektur
### Alur Traffic & DNS
- Domain java-tour.com dikelola sepenuhnya oleh Cloudflare.
- Pengunjung mengakses https://java-tour.com.
- Permintaan masuk ke jaringan Cloudflare.
- Cloudflare menyaring traffic (DDoS, WAF) dan menyajikan aset dari cache (CDN).
- Permintaan yang valid diteruskan ke alamat IP VPS 31.97.223.43.
- Nginx di VPS menerima permintaan di port 443.
- Nginx berfungsi sebagai reverse proxy dan meneruskan permintaan ke aplikasi Next.js yang berjalan di localhost:3000.
- PM2 menjaga agar aplikasi Next.js tetap berjalan.

### Konfigurasi Cloudflare
- Nameservers: lee.ns.cloudflare.com & anna.ns.cloudflare.com.
- SSL/TLS Mode: Full (Strict), untuk memastikan enkripsi end-to-end (Pengunjung <-> Cloudflare <-> VPS).

### Version Control (Git) & Kolaborasi
- **Repository:** https://github.com/jvto-devteam/jvto-web.git
- **Alur Kerja:** Perubahan kode dilakukan di branch terpisah. Setelah selesai, dibuat Pull Request ke branch main. Review dan merge dilakukan melalui antarmuka GitHub. Setelah di-merge, barulah prosedur deployment di server dijalankan.
- **Manajemen Kolaborator:** Penambahan anggota tim dilakukan melalui menu Settings > Collaborators di halaman repository GitHub.

### Sumber Konten (Content Sources)
- **Trust/verification content** (claims, evidence, FAQ, org identity, credentials) mengalir melalui satu rantai: **`llm-wiki`** (authoring + compiler) → **`jvto-ekosistem`** (single read source) → **`jvto-web`** (this repo, read-only consumer).
- `jvto-web` tidak lagi melakukan sync langsung dari `llm-wiki` untuk konten ini. Direct sync sebelumnya (`src/lib/trust-bundle.ts`, `src/data/trust-bundle/`, `scripts/sync-trust-bundle.mjs`, npm script `sync:trust`) telah dihapus (Task 5.3, data-source-consolidation plan, 2026-08-15) — semua trust/verification content sekarang dibaca dari `jvto-ekosistem` via `src/lib/ecosystemContent/*.ts` (local-read pada sibling checkout `../jvto-ekosistem`, dengan HTTP fallback ke `https://ekosistem.javavolcano-touroperator.com` bila checkout lokal tidak tersedia — lihat `src/lib/ecosystemContent/trustClaims.ts` untuk contoh polanya).
- `/trust` masih memiliki sedikit logika lokal murni (JSON-LD shaping untuk FAQPage/TouristTrip, dan snapshot metadata compile-manifest) di `src/lib/trust-bundle-schema.ts` — ini bukan konten unik, jadi sengaja tidak dipindah ke `jvto-ekosistem`.
- Detail lengkap arsitektur konsumsi ekosistem ada di `docs/architecture/ecosystem-content-consumption.md`.
- Beberapa sync langsung dari `llm-wiki` lain (policy bundle via `sync:policy`/`sync:packages`, blog via `sync:blog`) masih aktif dan berada di luar cakupan migrasi ini.

### Kebijakan Keamanan
- **Secrets:** Semua informasi sensitif (password DB, API keys) disimpan sebagai Environment Variables di file .env.local di server, yang tidak termasuk dalam repository Git.
- **Akses Adminer:** Dibatasi oleh SSL dan aturan allow/deny berdasarkan alamat IP yang telah ditentukan di /etc/nginx/sites-available/adminer.conf.