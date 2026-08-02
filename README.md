# Runbook Operasional — jvto-web

Panduan teknis infrastruktur, deployment, dan pemeliharaan aplikasi `jvto-web`
(Next.js 16). **Dokumen ini tidak boleh memuat kredensial apa pun** — semua
rahasia disimpan di luar repo (lihat §3).

> ⚠️ **Peringatan keamanan (riwayat repo).** Versi lama dokumen ini pernah memuat
> kredensial asli (login Hostinger, password root SSH, GitHub PAT, Mailgun API key,
> password PostgreSQL/PgBouncer/Metrics, serta login Adminer & Grafana). Karena repo
> ini publik, kredensial tersebut **harus dianggap bocor dan wajib dirotasi
> semuanya**. Menghapusnya dari file ini **tidak** menghapusnya dari git history —
> history perlu di-purge terpisah (mis. `git filter-repo`) dan setiap kredensial
> harus diganti di sistemnya masing-masing.

---

## 1. Visi & Strategi Proyek

Pembangunan ulang sistem dari **Laravel** (hosting lama) ke **Next.js** di VPS modern.

Model branch (otoritatif: [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)):

- **`main`** → deploy otomatis ke **preview/develop**:
  `https://help.javavolcano-touroperator.com` (di-set `noindex`).
- **`live`** → **produksi**: `https://javavolcano-touroperator.com` (indexable),
  hanya menerima promote PR `main → live` yang diperintahkan owner + commit bot
  volcanic-status. **Jangan pernah kerja langsung di `live`.**

---

## 2. Rincian Infrastruktur

- **Penyedia VPS:** Hostinger
- **IP VPS:** `31.97.223.43`
- **OS:** Ubuntu/Debian
- **Web Server:** Nginx (reverse proxy → Next.js di `localhost:3000`)
- **Aplikasi:** Next.js 16 (Turbopack) — direktori `/var/www/jvto-help`,
  PM2 process **`jvto-help`** (box preview/develop)
- **Database:** PostgreSQL 17 + PgBouncer + pgBackRest —
  `31.97.223.43:5432` (`jvto_dev` = develop, `jvto` = produksi)
- **Process Manager:** PM2
- **DNS & Keamanan Jaringan:** Cloudflare (akun JVTO Dev Team)

---

## 3. Akses & Kredensial

**Tidak ada kredensial yang disimpan di repo.** Semua rahasia disimpan di:

- **Password manager tim** — akses manusia (login Hostinger, password root SSH,
  login Adminer & Grafana beserta URL-nya).
- **VPS-local `.env.local`** (git-ignored) — rahasia runtime aplikasi
  (`DATABASE_URL`, Mailgun API key, PgBouncer, dll.). File ini bertahan saat
  deploy karena `git reset --hard` hanya menyentuh file tracked.
- **GitHub Actions Secrets** — CI/deploy:
  - `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` — dipakai `deploy.yml`.
  - `GH_PAT` — checkout repo produsen (llm-wiki + OKF) untuk drift gate & sync.
  - `DEVELOP_SSH_HOST` / `DEVELOP_SSH_USER` / `DEVELOP_SSH_KEY` — build-develop.

Titik akses (host/URL saja — kredensial di password manager):

- **SSH:** `ssh root@31.97.223.43`
- **GitHub:** <https://github.com/jvto-devteam/jvto-web>
- Panel Hostinger, Adminer, dan Grafana: lihat entri di password manager tim
  (URL + kredensial tidak dicantumkan di repo publik).

---

## 4. Runbook Operasional

### Deployment (otomatis)

Deploy dijalankan oleh **GitHub Actions `.github/workflows/deploy.yml`**:

- **Trigger:** push ke `main` (otomatis) atau `workflow_dispatch` (re-run manual).
- **Aksi** (SSH ke VPS via `appleboy/ssh-action`), setara dengan:
  ```bash
  cd /var/www/jvto-help
  git fetch --prune origin main
  git reset --hard origin/main      # JANGAN tambahkan `git clean` — akan menghapus .env.local
  npm ci
  npm run build                     # Next.js 16 — butuh Postgres via .env.local
  pm2 restart jvto-help --update-env
  ```
- Box produksi memakai `deploy.yml` yang sama pada branch `live`.

### Deploy manual (fallback, dijalankan di VPS)

Cara yang disarankan untuk re-deploy tanpa perubahan kode: jalankan ulang
workflow **Deploy to VPS** via `workflow_dispatch` (Actions UI / `gh workflow run
deploy.yml --ref main`). Blok di bawah hanya untuk kondisi GitHub Actions tak
tersedia — urutannya mengikuti `deploy.yml` (termasuk `nvm use 20`) supaya
`npm run build` tidak gagal di Node 18 default box:

```bash
cd /var/www/jvto-help
# Next.js 16 butuh Node >= 20.9 — default box = Node 18, jadi pilih Node 20 dulu
# (persis seperti deploy.yml); tanpa ini `npm run build` gagal:
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
PM2_BIN="$(command -v pm2 || echo pm2)"   # tangkap sebelum `nvm use 20` (pm2 di Node 18 global)
nvm use 20
git fetch --prune origin main && git reset --hard origin/main
npm ci && npm run build
"$PM2_BIN" restart jvto-help --update-env
```

### Management Layanan

```bash
Nginx:      sudo systemctl [status|start|stop|restart] nginx
PostgreSQL: sudo systemctl [status|start|stop|restart] postgresql
Next.js:    pm2 [status|start|stop|restart] jvto-help
```

### Strategi Backup Database (pgBackRest)

- Full: setiap Minggu 02:00. Diferensial: Senin–Sabtu 02:00.
- Lokasi backup: `/var/lib/pgbackrest`
- Cek status: `sudo -u postgres pgbackrest --stanza=jvto info`

### Troubleshooting & Pengecekan Log

- Log aplikasi Next.js: `pm2 logs jvto-help`
- Log error Nginx: `sudo tail -n 100 /var/log/nginx/error.log`
- Log sistem (cron job): `sudo grep CRON /var/log/syslog`

### Rencana Rollback Singkat

```bash
cd /var/www/jvto-help
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
PM2_BIN="$(command -v pm2 || echo pm2)"   # Node 20 + pm2 handling sama seperti deploy.yml
nvm use 20
git checkout <commit_stabil_terakhir>
npm ci && npm run build
"$PM2_BIN" restart jvto-help --update-env
```

Alternatif yang lebih aman: revert di `main` lewat PR — `deploy.yml` akan
men-deploy ulang otomatis setelah merge.

---

## 5. Konfigurasi & Arsitektur

### Alur Traffic & DNS

Pengunjung → **Cloudflare** (DDoS/WAF/CDN) → VPS `31.97.223.43:443` →
**Nginx** (reverse proxy) → **Next.js** di `localhost:3000` (dijaga PM2).

- Preview/develop: `help.javavolcano-touroperator.com`
- Produksi: `javavolcano-touroperator.com`
- **Indexability** diatur oleh `NEXT_PUBLIC_SITE_URL` per box (lihat `.env.example`
  + `next.config.ts` + `src/lib/site.ts`): hanya origin produksi yang indexable;
  selain itu header `X-Robots-Tag: noindex, nofollow` di-inject otomatis.

### Cloudflare

- SSL/TLS Mode: **Full (Strict)** — enkripsi end-to-end (Pengunjung ↔ Cloudflare ↔ VPS).

### Version Control (Git) & Kolaborasi

- **Repository:** <https://github.com/jvto-devteam/jvto-web>
- **Alur kerja:** feature branch → Pull Request ke `main` → CI `verify` hijau →
  merge → `deploy.yml`. Governance lengkap: [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).
- **Kolaborator:** dikelola di Settings → Collaborators pada repo GitHub.

### Kebijakan Keamanan

- **Rahasia tidak pernah masuk repo.** Runtime: `.env.local` (git-ignored) di VPS;
  CI/deploy: GitHub Actions Secrets; akses manusia: password manager tim.
- **Rotasi:** rotasi kredensial secara berkala, dan **segera** bila ada indikasi
  kebocoran (mis. pernah ter-commit — lihat peringatan di atas).
- **Akses Adminer:** dibatasi SSL + aturan allow/deny berbasis IP di
  `/etc/nginx/sites-available/adminer.conf`.
