# OPSI 1 GO-LIVE GUIDE

## Status Sekarang: ✅ READY

- Repository: jvto-devteam/jvto-web
- Git User: sambuko82
- CMS: Live at http://localhost:3000/cms
- Database: Connected
- Automation: GitHub Actions + Vercel ready

---

## Yang Diperlukan: 3 GitHub Secrets

### Langkah 1: Generate VERCEL_TOKEN

1. Buka: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `github-actions-jvto`
4. Copy token (save untuk langkah berikutnya)

### Langkah 2: Add GitHub Secrets

1. Buka: https://github.com/jvto-devteam/jvto-web/settings/secrets/actions
2. Click "New repository secret"

**Secret 1: VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Value: `<paste token dari langkah 1>`
- Click "Add secret"

**Secret 2: VERCEL_ORG_ID**
- Name: `VERCEL_ORG_ID`
- Value: `team_okkrKdwIyY1WFukLnT90kPlA`
- Click "Add secret"

**Secret 3: VERCEL_PROJECT_ID**
- Name: `VERCEL_PROJECT_ID`
- Value: `prj_ZVekSWwRNYJzd7EuskXannhrisra`
- Click "Add secret"

### Langkah 3: Verify Vercel Environment Variables

Buka: https://vercel.com/sams-projects-jvto/jvto/settings/environment-variables

Pastikan ada:
- DATABASE_URL ✅
- NEXTAUTH_URL ✅
- NEXTAUTH_SECRET ✅
- GOOGLE_CLIENT_ID ✅
- GOOGLE_CLIENT_SECRET ✅

---

## Langkah 4: Test Deployment

### Local Build Test
```powershell
npm run build
```

Should complete without errors.

### Push to GitHub
```powershell
git push origin sam-workspace
```

### Monitor Deployment
1. Buka: https://github.com/jvto-devteam/jvto-web/actions
2. Lihat workflow runs
3. Check untuk "deploy" step

### Production URL
- Akan ada di Vercel dashboard
- Format: `jvto.vercel.app` atau custom domain

---

## Timeline

**Hari Ini:**
- ✅ 3 GitHub Secrets ditambahkan (5 min)
- ✅ Vercel env vars verified (2 min)
- ✅ Local build test (3 min)
- ✅ Deploy to production (3 min)
- **Total: 13 menit**

---

## Verifikasi Go-Live

Setelah deployment, cek:

1. GitHub Actions: https://github.com/jvto-devteam/jvto-web/actions
   - Status: ✅ Success

2. Vercel Deployment: https://vercel.com/sams-projects-jvto/jvto
   - Status: ✅ Production

3. Browser: 
   - CMS: https://jvto.vercel.app/cms (atau custom domain)
   - Public: https://jvto.vercel.app

---

## Troubleshooting

### Build fails
- Check GitHub Actions logs
- Run locally: `npm run build`
- Fix errors, push again

### Deployment fails
- Check Vercel logs
- Verify all env vars set
- Check database connectivity

### Connection timeout
- Check DATABASE_URL format
- Test local connection: `npx prisma db push`

---

## Selesai!

After verification, your CMS is LIVE in production:
- Deployed to Vercel ✅
- Auto-deploy on push ✅
- Database connected ✅
- All 13 modules active ✅

**Status: PRODUCTION READY** 🚀

