# GitHub + Vercel Setup Checklist

## ✅ Completed Tasks

- [x] Git repository initialized and connected to GitHub
- [x] Vercel project created and configured
- [x] GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- [x] Deployment automation documentation created
- [x] Code committed to `sam-workspace` branch
- [x] Changes pushed to GitHub

## 📋 Next Steps (Setup on Your Machine)

### 1. Add GitHub Secrets (CRITICAL)
**Why**: Required for GitHub Actions to deploy to Vercel

1. Go to: https://github.com/jvto-devteam/jvto-web/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret:

```
Name: VERCEL_TOKEN
Value: (Get from https://vercel.com/account/tokens → Create Token)

Name: VERCEL_ORG_ID
Value: team_okkrKdwIyY1WFukLnT90kPlA

Name: VERCEL_PROJECT_ID
Value: prj_ZVekSWwRNYJzd7EuskXannhrisra
```

### 2. Configure Vercel Environment Variables
1. Go to: https://vercel.com/sams-projects-jvto/jvto/settings/environment-variables
2. Add the following (get from `.env.local`):
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - Other variables as needed

### 3. Enable Branch Protection (Optional but Recommended)
1. Go to: https://github.com/jvto-devteam/jvto-web/settings/branches
2. Click "Add rule"
3. Apply to branch: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

### 4. Test the Setup
```bash
# Make a test change
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verify GitHub Actions workflow"
git push origin sam-workspace

# Watch the workflow run
# Go to: https://github.com/jvto-devteam/jvto-web/actions
# Should see: ✅ Deploy to Vercel workflow running
```

## 🎯 Current State

### GitHub
- **Repository**: https://github.com/jvto-devteam/jvto-web
- **Branches**: 
  - `main` (production)
  - `sam-workspace` (development - current)
- **Workflows**: `.github/workflows/deploy.yml` (configured)
- **Status**: Ready for automatic deployment

### Vercel
- **Production URL**: https://jvto-sams-projects-jvto.vercel.app
- **Project ID**: prj_ZVekSWwRNYJzd7EuskXannhrisra
- **Status**: Connected to GitHub, auto-deploy enabled on push
- **Environment**: Production mode

### CMS
- **Status**: ✅ Live and functional
- **Endpoints**:
  - Content Pages: `/cms/collections/content-pages`
  - Blog Manager: `/cms/collections/blog-manager`
  - FAQ Manager: `/cms/collections/faq-manager`
  - Dashboard: `/cms`

## 📊 How to Verify Everything Works

### 1. Check GitHub Actions
```bash
# In GitHub: https://github.com/jvto-devteam/jvto-web/actions
# Should show recent workflow runs with ✅ status
```

### 2. Check Vercel Deployments
```bash
# In Vercel: https://vercel.com/sams-projects-jvto/jvto/deployments
# Should show recent deployments with "Ready" status
```

### 3. Test CMS Live
Visit: https://jvto-sams-projects-jvto.vercel.app/cms
- Should load CMS dashboard
- Should display content pages, blogs, FAQs
- Database queries should work

### 4. View Logs
```bash
# GitHub Actions logs
# https://github.com/jvto-devteam/jvto-web/actions

# Vercel logs
vercel logs
```

## 🔧 Common Commands

```bash
# Clone repo (first time)
git clone https://github.com/jvto-devteam/jvto-web.git
cd jvto-web

# Set up for development
git checkout sam-workspace
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Test production build
NODE_ENV=production npm run build

# Push to trigger CI/CD
git push origin sam-workspace

# Manual Vercel deployment (if needed)
vercel deploy --prod --yes

# Check Vercel status
vercel ls
vercel logs
```

## 🚨 Important Reminders

1. **Never commit secrets**: `.env.local` is in `.gitignore` - do NOT add it to git
2. **Use GitHub Secrets**: For sensitive values needed by CI/CD
3. **Verify before merge**: Always test changes on preview before merging to main
4. **Check logs**: If deploy fails, check GitHub Actions and Vercel logs
5. **Use commit trailers**: Include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` in commits

## ✨ What This Enables

### Automatic Deployments
- Every push to `main` → Production deployment
- Every push to `sam-workspace` → Preview deployment
- Every PR → Preview deployment with automatic URL

### Code Quality
- Linting on every commit
- Build verification before deployment
- Type checking (if configured)

### Team Collaboration
- PR previews visible to all team members
- Automatic rollback possible via Vercel dashboard
- Deployment history and logs retained

### Production Safety
- Database migrations in CI/CD (future)
- Automated backups (future)
- Performance monitoring (Vercel Analytics)
- Error tracking (Sentry integration - future)

---

**Last Updated**: April 7, 2026
**Status**: ✅ Complete - Ready for production use

