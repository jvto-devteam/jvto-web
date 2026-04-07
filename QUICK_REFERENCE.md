# 🚀 JVTO CMS Automation: Quick Reference Card

## ⚡ 5-Minute Setup

### Copy these values to GitHub:
https://github.com/jvto-devteam/jvto-web/settings/secrets/actions

```
VERCEL_TOKEN              = (Get from https://vercel.com/account/tokens)
VERCEL_ORG_ID             = team_okkrKdwIyY1WFukLnT90kPlA
VERCEL_PROJECT_ID         = prj_ZVekSWwRNYJzd7EuskXannhrisra
```

### Copy to Vercel Dashboard:
https://vercel.com/sams-projects-jvto/jvto/settings/environment-variables

```
DATABASE_URL              = postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev
NEXTAUTH_SECRET           = rahasia_super_aman_123_!@#
NEXTAUTH_URL              = https://javavolcano-touroperator.com
GOOGLE_CLIENT_ID          = 327660793026-0cne4cka9g4a39c51e54kkdrp5oqcpk6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET      = 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
```

---

## 📍 Links

| Purpose | Link |
|---------|------|
| GitHub Repo | https://github.com/jvto-devteam/jvto-web |
| GitHub Actions | https://github.com/jvto-devteam/jvto-web/actions |
| GitHub Secrets | https://github.com/jvto-devteam/jvto-web/settings/secrets/actions |
| Vercel Dashboard | https://vercel.com/sams-projects-jvto/jvto |
| Vercel Env Vars | https://vercel.com/sams-projects-jvto/jvto/settings/environment-variables |
| Production CMS | https://jvto-sams-projects-jvto.vercel.app/cms |
| Vercel Token | https://vercel.com/account/tokens |

---

## 🔄 Git Workflow

```bash
# Development
git checkout sam-workspace
git pull origin sam-workspace
# Make changes...
git add .
git commit -m "feat: description"
git push origin sam-workspace
# ↓ Auto-deploys to preview ↓

# Production
git checkout main
git merge sam-workspace
git push origin main
# ↓ Auto-deploys to production ↓
```

---

## 📊 What Auto-Deploys Where

| Branch | Environment | URL | Trigger |
|--------|-------------|-----|---------|
| `sam-workspace` | Preview | `https://jvto-sam-workspace-*.vercel.app` | Push to branch |
| `main` | Production | `https://jvto-sams-projects-jvto.vercel.app` | Push to branch |
| PR → main | Preview | Auto-generated | Create PR |

---

## 🔍 Check Status

```bash
# GitHub Actions
open https://github.com/jvto-devteam/jvto-web/actions

# Vercel Dashboard
open https://vercel.com/sams-projects-jvto/jvto

# Recent Commits
git log --oneline -5

# Deployment List
vercel ls

# Build Logs
vercel logs

# Verify Env Vars
vercel env list
```

---

## ✅ Setup Checklist

- [ ] Read AUTOMATION_SUMMARY.md
- [ ] Add 3 GitHub Secrets
- [ ] Add environment variables to Vercel
- [ ] Test with a small commit
- [ ] Verify preview/production URLs work
- [ ] Check CMS is accessible: `/cms`
- [ ] Document team access

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| "Build fails" | Check Vercel logs: `vercel logs` |
| "Env vars missing" | Add to Vercel dashboard, not `.env.local` |
| "Workflow won't run" | Verify GitHub Secrets are set |
| "Deploy is slow" | Normal first time (5-10 min), cache speeds up subsequent |
| "Need to rollback" | Use Vercel dashboard to redeploy previous version |

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **AUTOMATION_SUMMARY.md** | Complete overview (8.9 KB) |
| **DEPLOYMENT_AUTOMATION.md** | Detailed guide (7.5 KB) |
| **GITHUB_VERCEL_SETUP.md** | Setup checklist (5 KB) |
| **.github/workflows/deploy.yml** | GitHub Actions config |

---

## 💡 Quick Commands

```bash
# Deploy manually (if needed)
vercel deploy --prod --yes

# View environment variables
vercel env list

# Add new secret
vercel env add VARIABLE_NAME

# Cancel deployment
vercel cancel

# Remove old files
rm TEST.md  # If you created test file
git add .
git commit -m "cleanup"
git push
```

---

## 🎯 After Setup

**Test it works:**
```bash
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verify workflow"
git push origin sam-workspace
# Watch: https://github.com/jvto-devteam/jvto-web/actions
```

**Visit live CMS:**
- https://jvto-sams-projects-jvto.vercel.app/cms

**Create Pull Request (optional):**
```bash
git push origin sam-workspace
# Go to: https://github.com/jvto-devteam/jvto-web/pull/new/sam-workspace
```

---

**Status**: ✅ **Ready for Production**
**Time to Setup**: ~5 minutes
**Last Updated**: April 7, 2026

