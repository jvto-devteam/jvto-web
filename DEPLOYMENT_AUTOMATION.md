# JVTO CMS: Full Automation Setup Guide

## ✅ Status: GitHub + Vercel Deployment Configured

### What Was Set Up

#### 1. **GitHub Repository**
- **URL**: https://github.com/jvto-devteam/jvto-web
- **Branch**: `sam-workspace` (development) and `main` (production)
- **Status**: ✅ Git initialized and connected
- **Last Push**: Committed all CMS changes and strategic documentation

#### 2. **Vercel Deployment**
- **Project Name**: jvto
- **Organization**: sams-projects-jvto
- **Production URL**: https://jvto-sams-projects-jvto.vercel.app
- **Preview URLs**: Auto-generated for PRs and branches
- **Status**: ✅ Vercel CLI configured and ready

#### 3. **GitHub Actions Workflow**
- **File**: `.github/workflows/deploy.yml`
- **Trigger**: On push to `main` or `sam-workspace`, or PRs to these branches
- **Steps**:
  1. Code checkout
  2. Node.js setup (v24)
  3. Dependency installation
  4. Linting (if available)
  5. Build verification
  6. Automatic Vercel deployment
  7. PR comments with deployment status

---

## 🚀 How Deployment Works

### Automatic Deployment Flow

```
Local Development
       ↓
Git Commit & Push
       ↓
GitHub Receives Push
       ↓
GitHub Actions Workflow Triggers
       ↓
Build & Test (npm ci, npm run build)
       ↓
Vercel Deployment via Action
       ↓
Production/Preview Live
```

### Manual Deployment (if needed)

```bash
# Deploy to production
vercel deploy --prod --yes

# Deploy to preview
vercel deploy --yes
```

---

## 📋 Required GitHub Secrets

Add these to your GitHub repository settings (`Settings > Secrets and variables > Actions`):

```
VERCEL_TOKEN        = Your Vercel API token
VERCEL_ORG_ID       = team_okkrKdwIyY1WFukLnT90kPlA
VERCEL_PROJECT_ID   = prj_ZVekSWwRNYJzd7EuskXannhrisra
```

### How to Get These Values

**VERCEL_TOKEN:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy and paste into GitHub Secrets

**VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
```bash
# Already visible in .vercel/project.json
cat .vercel/project.json
```

---

## 🔧 Current Environment Configuration

### Production (.env.local)
```
DATABASE_URL=postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev
NODE_ENV=production
NEXTAUTH_URL=https://javavolcano-touroperator.com
NEXTAUTH_SECRET=rahasia_super_aman_123_!@#
GOOGLE_CLIENT_ID=327660793026-0cne4cka9g4a39c51e54kkdrp5oqcpk6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### Vercel Environment Variables
Configure in Vercel Dashboard → Project Settings → Environment Variables:
- `DATABASE_URL` (required)
- `NEXTAUTH_SECRET` (required)
- `GOOGLE_CLIENT_ID` (required)
- `GOOGLE_CLIENT_SECRET` (required)
- Other optional variables as needed

---

## 📊 Monitoring & Verification

### Check Deployment Status

**Via Vercel CLI:**
```bash
# List recent deployments
vercel ls

# Inspect specific deployment
vercel inspect <url>

# View logs
vercel logs
```

**Via Dashboard:**
1. Go to https://vercel.com/sams-projects-jvto/jvto
2. Click on the deployment
3. View build logs and performance metrics

### Check GitHub Actions

1. Go to https://github.com/jvto-devteam/jvto-web/actions
2. View workflow runs and logs
3. See PR deployment status in pull requests

---

## 🔄 Deployment Workflow

### Development Cycle

1. **Make changes locally**
   ```bash
   git checkout sam-workspace
   # Make your changes
   npm run dev  # Test locally
   ```

2. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description

   Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
   git push origin sam-workspace
   ```

3. **GitHub Actions triggers**
   - Runs build and tests automatically
   - Deploys preview to Vercel
   - Comments on the commit with preview URL

4. **Verify in preview**
   - Visit the preview URL from Vercel
   - Test your changes
   - Review performance metrics

5. **Merge to main (production)**
   ```bash
   git checkout main
   git merge sam-workspace
   git push origin main
   ```

6. **Production deployment**
   - GitHub Actions builds and tests
   - Vercel deploys to production
   - Automatically goes live at: https://jvto-sams-projects-jvto.vercel.app

---

## 🛡️ Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to git (add to `.gitignore`)
- ✅ Keep secrets in Vercel dashboard and GitHub Secrets
- ✅ Rotate NEXTAUTH_SECRET and API keys regularly

### 2. Vercel Settings
- ✅ Enable branch protection on `main`
- ✅ Require status checks before merging
- ✅ Set up production deployment protection

### 3. GitHub Settings
```
Settings > Branches > Branch Protection Rules:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Enforce admins to follow rules
```

### 4. Credentials
The current env vars contain sensitive data:
- `DATABASE_URL` - Database password
- `GOOGLE_CLIENT_SECRET` - OAuth secret
- `NEXTAUTH_SECRET` - Session encryption key
- `EMAIL_SERVER_PASSWORD` - Email password

**Action Required**: Move these to Vercel Secrets (not in `.env.local`)

---

## 📈 Performance Monitoring

### Built-in Tools

**Vercel Analytics:**
- View Core Web Vitals
- Track deployment performance
- Monitor error rates

**Next.js Build Analysis:**
```bash
# Analyze bundle size
npm run build -- --analyze

# Check build output
npm run build
```

---

## 🔍 Troubleshooting

### Build Fails on Vercel but Works Locally

1. Check environment variables in Vercel dashboard
2. Compare Node.js versions (should be 24.x)
3. Check for uncommitted changes
4. Verify database connectivity in production

```bash
# Test build locally with production settings
NODE_ENV=production npm run build
```

### Deployment Stuck

1. Cancel and retry:
   ```bash
   vercel cancel
   vercel deploy --prod --yes
   ```

2. Check logs:
   ```bash
   vercel logs
   ```

3. Verify Vercel status: https://www.vercel-status.com/

### Environment Variables Missing

1. List configured variables:
   ```bash
   vercel env list
   ```

2. Add missing variable:
   ```bash
   vercel env add VARIABLE_NAME
   ```

3. Redeploy to apply changes:
   ```bash
   vercel deploy --prod --yes
   ```

---

## 📚 Useful Links

- **GitHub Repository**: https://github.com/jvto-devteam/jvto-web
- **Vercel Dashboard**: https://vercel.com/sams-projects-jvto/jvto
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Actions**: https://github.com/jvto-devteam/jvto-web/actions
- **CMS Documentation**: See `CMS_STRATEGIC_PIVOT.md`

---

## ✨ Next Steps

### This Week
- [ ] Add GitHub Secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [ ] Set environment variables in Vercel dashboard
- [ ] Enable branch protection on `main`
- [ ] Test workflow with a test commit

### Future
- [ ] Set up automated backups
- [ ] Configure monitoring and alerting
- [ ] Add staging environment
- [ ] Set up database migrations in CI/CD
- [ ] Add automated security scanning (Snyk, CodeQL)

---

## 📞 Support

For issues or questions:
1. Check GitHub Actions logs
2. Review Vercel dashboard
3. Check CMS documentation
4. Refer to troubleshooting section above

