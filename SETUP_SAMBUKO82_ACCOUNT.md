# Setup GitHub & Vercel Account untuk Sambuko82

## ⚠️ PENTING: Yang Tidak Bisa Otomatis

Saya **tidak bisa** membuat akun di GitHub/Vercel secara otomatis karena:
- ✗ Memerlukan verifikasi email manusia
- ✗ Memerlukan akun email pribadi
- ✗ Memerlukan CAPTCHA verification
- ✗ Memerlukan terms & conditions approval

## ✅ Yang Bisa Saya Bantu

Saya bisa memberi:
- ✅ Panduan step-by-step lengkap
- ✅ Script otomatis setelah akun dibuat
- ✅ Setup GitHub SSH keys
- ✅ Konfigurasi Vercel
- ✅ Transfer existing project
- ✅ Setup CI/CD pipeline

---

## 📋 PANDUAN STEP-BY-STEP

### BAGIAN 1: Buat GitHub Account untuk Sambuko82

**Step 1: Buka GitHub**
```
Buka: https://github.com/signup
```

**Step 2: Isi Form**
- **Username**: sambuko82
- **Email**: gunakan email Anda (penting untuk verifikasi!)
- **Password**: buat password yang kuat
- Pilih "I prefer to keep my email private"

**Step 3: Verifikasi Email**
- GitHub akan mengirim email ke address Anda
- Klik link verification
- Done! ✅

**Step 4: Setup Profile**
- Foto profil (optional)
- Bio: "Java Volcano Tour Operator Admin"
- Location: Indonesia

---

### BAGIAN 2: Transfer Existing Repository

Setelah akun GitHub dibuat, jalankan commands ini:

```bash
# Clone existing repo
git clone https://github.com/jvto-devteam/jvto-web.git
cd jvto-web

# Add new remote dengan akun Sambuko82
git remote rename origin old-origin
git remote add origin https://github.com/sambuko82/jvto-web.git

# Push ke akun baru
git push -u origin main
git push -u origin sam-workspace

# Hapus remote lama
git remote remove old-origin
```

---

### BAGIAN 3: Setup SSH Key untuk Keamanan

```bash
# Generate SSH key baru
ssh-keygen -t ed25519 -C "sambuko82@github.com"

# Tekan Enter 3x untuk default

# Copy SSH key
cat ~/.ssh/id_ed25519.pub

# Paste ke GitHub: https://github.com/settings/keys
# Click "New SSH key"
# Paste public key
# Save
```

---

### BAGIAN 4: Buat Vercel Account

**Step 1: Buka Vercel**
```
Buka: https://vercel.com/signup
```

**Step 2: Pilih Login dengan GitHub**
- Klik "Continue with GitHub"
- Authorize Vercel untuk akses GitHub

**Step 3: Setup Vercel**
- Pilih personal account
- Set name: "JVTO Operations"
- Done! ✅

---

### BAGIAN 5: Connect Existing Vercel Project

Pilih SALAH SATU opsi:

**Option A: Transfer Project ke Akun Baru**
```
1. Go to Vercel Dashboard
2. Project Settings → General
3. Transfer Project
4. Select new team/account
5. Confirm transfer
```

**Option B: Create New Vercel Project dari Repo Baru**
```
1. Go to Vercel: https://vercel.com/new
2. Import GitHub project
3. Select sambuko82/jvto-web
4. Follow setup wizard
5. Done! ✅
```

---

### BAGIAN 6: Setup Environment Variables di Vercel

Setelah project di Vercel, tambahkan env vars:

**Go to:** Vercel Dashboard → Project Settings → Environment Variables

Tambahkan:
```
DATABASE_URL = postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev
NEXTAUTH_SECRET = rahasia_super_aman_123_!@#
NEXTAUTH_URL = https://javavolcano-touroperator.com
GOOGLE_CLIENT_ID = 327660793026-0cne4cka9g4a39c51e54kkdrp5oqcpk6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
```

---

### BAGIAN 7: Setup GitHub Actions dengan Sambuko82

File `.github/workflows/deploy.yml` sudah siap di repo.

Anda hanya perlu add secrets di GitHub:

**Go to:** https://github.com/sambuko82/jvto-web/settings/secrets/actions

Add 3 secrets:
```
VERCEL_TOKEN          → Get dari https://vercel.com/account/tokens
VERCEL_ORG_ID         → Lihat di Vercel Dashboard
VERCEL_PROJECT_ID     → Lihat di Vercel Dashboard
```

---

## 🔄 WORKFLOW SETELAH SETUP

### Untuk Development

```bash
# Clone dari repo Sambuko82
git clone https://github.com/sambuko82/jvto-web.git
cd jvto-web

# Setup local
npm install
npm run dev

# Buat feature branch
git checkout -b feature/nama-fitur

# Commit dan push
git add .
git commit -m "feat: deskripsi"
git push origin feature/nama-fitur

# Buat Pull Request di GitHub

# Auto-deploy ke preview 🚀
```

### Untuk Production

```bash
# Merge PR ke main
git checkout main
git merge feature/nama-fitur

# Push ke main
git push origin main

# Auto-deploy ke production 🚀
# Vercel mendeploy ke: https://jvto-sambuko82-vercel.app
```

---

## 🔑 IMPORTANT CREDENTIALS

**Simpan credentials berikut dengan aman:**

```
GitHub Username:    sambuko82
GitHub Email:       [email Anda]
GitHub SSH Key:     ~/.ssh/id_ed25519

Vercel Org ID:      [akan dapat setelah buat]
Vercel Project ID:  [akan dapat setelah buat]
Vercel Token:       [akan dapat setelah generate]

Database URL:       postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev
NEXTAUTH Secret:    rahasia_super_aman_123_!@#
```

---

## ✅ VERIFICATION CHECKLIST

Setelah selesai semua setup, verify:

- [ ] GitHub account sambuko82 created
- [ ] Email verified
- [ ] SSH key setup done
- [ ] Repository transferred/created
- [ ] Vercel account created
- [ ] Vercel project connected to GitHub
- [ ] Environment variables added to Vercel
- [ ] GitHub Actions secrets added
- [ ] First deployment successful
- [ ] CMS accessible at live URL

---

## 🚀 SETELAH SETUP SELESAI

Saya bisa langsung:

1. ✅ **Verify setup** - Test semua connections
2. ✅ **Fix issues** - Troubleshoot masalah apa pun
3. ✅ **Deploy** - Trigger deployment awal
4. ✅ **Configure** - Setup domain custom jika ada
5. ✅ **Monitor** - Setup monitoring dan alerts

---

## ⚠️ PENTING: SECURITY NOTES

**Password GitHub:**
- Gunakan password yang KUAT (minimal 16 karakter)
- Jangan share ke siapa pun
- Gunakan password manager (1Password, LastPass, dll)

**SSH Key:**
- JANGAN share public key
- Jangan commit private key (`id_ed25519`)
- Add ke `.gitignore` jika ada di local

**Vercel Token:**
- Generate hanya saat dibutuhkan
- Jangan commit ke git
- Simpan di GitHub Secrets saja

**Database Credentials:**
- Sudah ada di environment
- Jangan hardcode di code
- Hanya di Vercel dan local env

---

## 📞 NEXT STEPS

### Untuk Lanjut, Berikan Saya:

1. **Email untuk GitHub** 
   - Email yang akan digunakan untuk akun GitHub
   - Harus email yang bisa Anda akses

2. **Nama Domain (Optional)**
   - Kalau ada domain custom untuk production
   - e.g., cms.javavolcano-touroperator.com

3. **Team Members**
   - Siapa saja yang butuh access?
   - Apa role mereka?

Setelah Anda buat akun dan kasih info ini, saya bisa:
- ✅ Configure semua settings otomatis
- ✅ Test deployment
- ✅ Setup team access
- ✅ Deploy ke production

---

## 🎯 HASIL AKHIR

Setelah semua selesai:

```
GitHub:   https://github.com/sambuko82/jvto-web
Vercel:   https://vercel.com/sambuko82/jvto-web
Live CMS: https://jvto-sambuko82.vercel.app/cms

Deployment: ✅ Automatic on push
CI/CD:      ✅ GitHub Actions ready
Monitoring: ✅ Vercel Analytics active
```

---

**Status**: ⏳ Menunggu email Anda
**Next Action**: Buat GitHub account di https://github.com/signup

Jika ada pertanyaan, tanyakan! 🚀

