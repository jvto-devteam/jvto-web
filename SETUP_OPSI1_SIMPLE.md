# SETUP PRODUCTION: 3 LANGKAH MUDAH

Status: **SIAP UNTUK PRODUCTION** ✅

---

## LANGKAH 1: Dapatkan VERCEL_TOKEN (2 menit)

### URL Buka:
```
https://vercel.com/account/tokens
```

### Yang Dilakukan:
1. Klik tombol "Create Token"
2. Nama: `github-actions-jvto`
3. Klik "Create"
4. **COPY token yang muncul** (simpan, kita perlu 1 menit lagi)
5. Token bentuk: `abcd1234_efgh5678_ijkl9012_mnop3456`

### Jangan Lupa: Simpan token, kita butuh untuk step 2!

---

## LANGKAH 2: Add 3 GitHub Secrets (5 menit)

### URL Buka:
```
https://github.com/jvto-devteam/jvto-web/settings/secrets/actions
```

### Button Dicari: "New repository secret" (di kanan atas)

---

### SECRET #1: VERCEL_TOKEN

**Klik: "New repository secret"**

**Di form yang muncul:**

| Field | Isi |
|-------|-----|
| Name | `VERCEL_TOKEN` |
| Value | **(paste dari langkah 1)** |

**Klik: "Add secret"**

✅ Secret 1 selesai

---

### SECRET #2: VERCEL_ORG_ID

**Klik: "New repository secret"** (lagi)

**Di form yang muncul:**

| Field | Isi |
|-------|-----|
| Name | `VERCEL_ORG_ID` |
| Value | `team_okkrKdwIyY1WFukLnT90kPlA` |

**Klik: "Add secret"**

✅ Secret 2 selesai

---

### SECRET #3: VERCEL_PROJECT_ID

**Klik: "New repository secret"** (lagi)

**Di form yang muncul:**

| Field | Isi |
|-------|-----|
| Name | `VERCEL_PROJECT_ID` |
| Value | `prj_ZVekSWwRNYJzd7EuskXannhrisra` |

**Klik: "Add secret"**

✅ Secret 3 selesai

---

## Hasil Akhir

Setelah langkah 2, di halaman GitHub Secrets akan terlihat:

```
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
```

**Jika semua 3 ada = Anda BERHASIL!**

---

## LANGKAH 3: Deploy! (3 menit)

Di terminal/PowerShell local Anda:

```powershell
cd "f:\New folder\DOWNLOADS\jvto-web"
git push origin sam-workspace
```

**Setelah push, buka:**
```
https://github.com/jvto-devteam/jvto-web/actions
```

**Lihat:**
- Workflow running
- Semua step selesai
- Status: ✅ SUCCESS

**Kalau sudah success, CMS Anda LIVE!**

---

## Cek Production

Setelah deployment selesai:

### 1. GitHub Actions Status
```
https://github.com/jvto-devteam/jvto-web/actions
```
- Cari workflow terbaru
- Status harus: ✅ SUCCESS

### 2. Vercel Deployment
```
https://vercel.com/sams-projects-jvto/jvto
```
- Cari deployment terbaru
- Status harus: ✅ READY

### 3. CMS Live
```
https://jvto.vercel.app/cms
```
- Atau custom domain jika sudah ada
- Dashboard harus muncul
- All modules aktif ✅

---

## Troubleshoot

### "Build failed"
1. Buka GitHub Actions log
2. Cari error message
3. Fix locally: `npm run build`
4. Push lagi

### "Deployment failed"
1. Buka Vercel logs
2. Check env vars sudah ada semua
3. Fix, push lagi

### "Can't connect to database"
1. Check DATABASE_URL di Vercel
2. Database server UP?
3. Restart Vercel deployment

---

## Done!

Setelah semua 3 langkah:

✅ GitHub Secrets added (3 secrets)
✅ Code pushed to GitHub
✅ Deployment triggered
✅ CMS LIVE in production
✅ Auto-deploy ready (next push = auto deploy)

**Status: PRODUCTION READY** 🚀

---

## Summary Cepat

| Step | Action | Time |
|------|--------|------|
| 1 | Get VERCEL_TOKEN | 2 min |
| 2 | Add 3 GitHub Secrets | 5 min |
| 3 | Push code & deploy | 3 min |
| **TOTAL** | **GO-LIVE** | **10 min** |

**That's it! Your CMS is PRODUCTION-READY** 🎉

