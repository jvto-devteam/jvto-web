# QUICK REFERENCE CARD - OPSI 1

## Copy These Values

```
VERCEL_ORG_ID = team_okkrKdwIyY1WFukLnT90kPlA
VERCEL_PROJECT_ID = prj_ZVekSWwRNYJzd7EuskXannhrisra
```

## 3 Steps to Go Live

### Step 1: Get Token (2 min)
```
https://vercel.com/account/tokens
→ Create Token
→ Name: github-actions-jvto
→ Copy value
```

### Step 2: Add Secrets (5 min)
```
https://github.com/jvto-devteam/jvto-web/settings/secrets/actions
→ New repository secret (3x)

SECRET 1: VERCEL_TOKEN = (from step 1)
SECRET 2: VERCEL_ORG_ID = team_okkrKdwIyY1WFukLnT90kPlA
SECRET 3: VERCEL_PROJECT_ID = prj_ZVekSWwRNYJzd7EuskXannhrisra
```

### Step 3: Deploy (3 min)
```powershell
cd "f:\New folder\DOWNLOADS\jvto-web"
git push origin sam-workspace
```

## Monitor

```
GitHub Actions: https://github.com/jvto-devteam/jvto-web/actions
Vercel:         https://vercel.com/sams-projects-jvto/jvto
CMS Live:       https://jvto.vercel.app/cms
```

## Local Dev

```
CMS: http://localhost:3000/cms
```

## All Done! 🚀

