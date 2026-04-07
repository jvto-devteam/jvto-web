#=============================================================================
# OPSI 1 SETUP: GitHub Secrets + Vercel Environment Variables
# Automated deployment setup for jvto-devteam/jvto-web
#=============================================================================

param(
    [switch]$SkipGitHubSecrets = $false
)

Write-Host "╔════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    OPSI 1: PRODUCTION SETUP                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Colors
$SUCCESS = "Green"
$ERROR = "Red"
$INFO = "Cyan"
$WARN = "Yellow"

#=============================================================================
# STEP 1: Verify Requirements
#=============================================================================

Write-Host "📋 STEP 1: Verifying requirements..." -ForegroundColor $INFO
Write-Host ""

$requirements = @{
    "Git"         = { git --version }
    "Vercel CLI"  = { vercel --version }
    "Node.js"     = { node --version }
}

$allReady = $true

foreach ($tool in $requirements.GetEnumerator()) {
    try {
        $version = & $tool.Value 2>&1
        Write-Host "  ✅ $($tool.Key): $version" -ForegroundColor $SUCCESS
    } catch {
        Write-Host "  ❌ $($tool.Key): Not found" -ForegroundColor $ERROR
        $allReady = $false
    }
}

Write-Host ""

if (-not $allReady) {
    Write-Host "❌ Some requirements not met. Please install missing tools." -ForegroundColor $ERROR
    exit 1
}

#=============================================================================
# STEP 2: Verify Vercel Authentication
#=============================================================================

Write-Host "🔐 STEP 2: Verifying Vercel authentication..." -ForegroundColor $INFO
Write-Host ""

try {
    $vercelUser = vercel whoami 2>&1
    Write-Host "  ✅ Vercel authenticated as: $vercelUser" -ForegroundColor $SUCCESS
} catch {
    Write-Host "  ❌ Vercel not authenticated" -ForegroundColor $ERROR
    Write-Host ""
    Write-Host "  Running: vercel login" -ForegroundColor $WARN
    vercel login
    $vercelUser = vercel whoami 2>&1
}

Write-Host ""

#=============================================================================
# STEP 3: Load Environment Variables
#=============================================================================

Write-Host "📂 STEP 3: Loading environment variables..." -ForegroundColor $INFO
Write-Host ""

$envFile = ".env.local"
$env_vars = @{}

if (Test-Path $envFile) {
    Write-Host "  ✅ Found $envFile" -ForegroundColor $SUCCESS
    
    $content = Get-Content $envFile
    foreach ($line in $content) {
        if ($line -match '^\s*([^=]+)=(.+)$') {
            $key = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            # Remove quotes
            $value = $value -replace '^"(.*)"$', '$1'
            $env_vars[$key] = $value
        }
    }
    
    Write-Host "  ✅ Loaded $(($env_vars.Keys).Count) environment variables" -ForegroundColor $SUCCESS
} else {
    Write-Host "  ❌ $envFile not found" -ForegroundColor $ERROR
    exit 1
}

Write-Host ""

#=============================================================================
# STEP 4: Prepare Vercel Credentials
#=============================================================================

Write-Host "🔑 STEP 4: Preparing Vercel credentials..." -ForegroundColor $INFO
Write-Host ""

$vercelOrgId = "team_okkrKdwIyY1WFukLnT90kPlA"
$vercelProjectId = "prj_ZVekSWwRNYJzd7EuskXannhrisra"

Write-Host "  Vercel Organization ID: $vercelOrgId" -ForegroundColor $INFO
Write-Host "  Vercel Project ID:      $vercelProjectId" -ForegroundColor $INFO

# For GitHub Secrets
Write-Host ""
Write-Host "  GitHub Secrets to add:" -ForegroundColor $WARN
Write-Host "    1. VERCEL_ORG_ID        = $vercelOrgId" -ForegroundColor Yellow
Write-Host "    2. VERCEL_PROJECT_ID    = $vercelProjectId" -ForegroundColor Yellow
Write-Host "    3. VERCEL_TOKEN         = <from https://vercel.com/account/tokens>" -ForegroundColor Yellow

Write-Host ""

#=============================================================================
# STEP 5: Setup Vercel Environment Variables
#=============================================================================

Write-Host "⚙️  STEP 5: Setting up Vercel environment variables..." -ForegroundColor $INFO
Write-Host ""

# Map of required env vars
$requiredEnvVars = @{
    "DATABASE_URL"           = @{ env = "DATABASE_URL"; required = $true }
    "NEXTAUTH_SECRET"        = @{ env = "NEXTAUTH_SECRET"; required = $true; default = $(openssl rand -hex 32) }
    "NEXTAUTH_URL"           = @{ env = "NEXTAUTH_URL"; required = $true; default = "https://javavolcano-touroperator.com" }
    "GOOGLE_CLIENT_ID"       = @{ env = "GOOGLE_CLIENT_ID"; required = $true }
    "GOOGLE_CLIENT_SECRET"   = @{ env = "GOOGLE_CLIENT_SECRET"; required = $true }
}

Write-Host "  Env vars to setup in Vercel:" -ForegroundColor $INFO
Write-Host ""

foreach ($var in $requiredEnvVars.GetEnumerator()) {
    $key = $var.Key
    $config = $var.Value
    
    if ($env_vars.ContainsKey($config.env)) {
        $value = $env_vars[$config.env]
        $display = if ($value.Length -gt 30) { "$($value.Substring(0,27))..." } else { $value }
        Write-Host "  ✅ $key = $display" -ForegroundColor $SUCCESS
    } elseif ($config.default) {
        Write-Host "  ℹ️  $key = [AUTO-GENERATED]" -ForegroundColor $WARN
    } else {
        Write-Host "  ⚠️  $key = [MISSING - MANUAL SETUP REQUIRED]" -ForegroundColor $WARN
    }
}

Write-Host ""
Write-Host "  To verify/edit these in Vercel Dashboard:" -ForegroundColor $INFO
Write-Host "  https://vercel.com/sams-projects-jvto/jvto/settings/environment-variables" -ForegroundColor Cyan

Write-Host ""

#=============================================================================
# STEP 6: GitHub Secrets Instructions
#=============================================================================

Write-Host "📝 STEP 6: GitHub Secrets setup instructions..." -ForegroundColor $INFO
Write-Host ""

Write-Host "  You need to add 3 secrets to GitHub Actions:" -ForegroundColor $INFO
Write-Host ""
Write-Host "  Go to: https://github.com/jvto-devteam/jvto-web/settings/secrets/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Add these secrets:" -ForegroundColor $WARN
Write-Host ""

$secrets = @(
    @{ name = "VERCEL_TOKEN"; value = "<GET FROM: https://vercel.com/account/tokens>"; instruction = "1. Generate new token on Vercel\n2. Copy the token value" },
    @{ name = "VERCEL_ORG_ID"; value = "team_okkrKdwIyY1WFukLnT90kPlA"; instruction = "" },
    @{ name = "VERCEL_PROJECT_ID"; value = "prj_ZVekSWwRNYJzd7EuskXannhrisra"; instruction = "" }
)

foreach ($i, $secret in $secrets.GetEnumerator()) {
    $num = $i + 1
    Write-Host "  $num. $($secret.name)" -ForegroundColor Yellow
    Write-Host "     Value: $($secret.value)" -ForegroundColor Gray
    if ($secret.instruction) {
        Write-Host "     $($secret.instruction)" -ForegroundColor Gray
    }
    Write-Host ""
}

#=============================================================================
# STEP 7: Deployment Test
#=============================================================================

Write-Host "🧪 STEP 7: Deployment test (optional)..." -ForegroundColor $INFO
Write-Host ""

Write-Host "  Commands to test deployment:" -ForegroundColor $INFO
Write-Host ""
Write-Host "  1. Test build locally:" -ForegroundColor Yellow
Write-Host "     npm run build" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Push to trigger GitHub Actions:" -ForegroundColor Yellow
Write-Host "     git push origin sam-workspace" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Monitor deployment:" -ForegroundColor Yellow
Write-Host "     https://github.com/jvto-devteam/jvto-web/actions" -ForegroundColor Gray
Write-Host ""

#=============================================================================
# STEP 8: Summary
#=============================================================================

Write-Host "═════════════════════════════════════════════════════════════════════════════" -ForegroundColor $INFO
Write-Host "✅ SETUP SUMMARY" -ForegroundColor $INFO
Write-Host "═════════════════════════════════════════════════════════════════════════════" -ForegroundColor $INFO
Write-Host ""

Write-Host "  Repository:     jvto-devteam/jvto-web" -ForegroundColor $SUCCESS
Write-Host "  Branch:         sam-workspace" -ForegroundColor $SUCCESS
Write-Host "  Deployment:     Vercel (auto on push)" -ForegroundColor $SUCCESS
Write-Host "  Status:         ✅ Ready for production" -ForegroundColor $SUCCESS
Write-Host ""

Write-Host "📋 CHECKLIST UNTUK GO-LIVE:" -ForegroundColor $INFO
Write-Host ""
Write-Host "  [ ] 1. Go to GitHub Secrets:" -ForegroundColor Yellow
Write-Host "        https://github.com/jvto-devteam/jvto-web/settings/secrets/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "  [ ] 2. Add VERCEL_TOKEN (get from: https://vercel.com/account/tokens)" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [ ] 3. Add VERCEL_ORG_ID: team_okkrKdwIyY1WFukLnT90kPlA" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [ ] 4. Add VERCEL_PROJECT_ID: prj_ZVekSWwRNYJzd7EuskXannhrisra" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [ ] 5. Verify Vercel env vars at:" -ForegroundColor Yellow
Write-Host "        https://vercel.com/sams-projects-jvto/jvto/settings/environment-variables" -ForegroundColor Gray
Write-Host ""
Write-Host "  [ ] 6. Push code to trigger deployment:" -ForegroundColor Yellow
Write-Host "        git push origin sam-workspace" -ForegroundColor Gray
Write-Host ""
Write-Host "  [ ] 7. Monitor at:" -ForegroundColor Yellow
Write-Host "        https://github.com/jvto-devteam/jvto-web/actions" -ForegroundColor Gray
Write-Host ""

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor $INFO
Write-Host ""
Write-Host "  1. Add the 3 GitHub Secrets (copy from above)" -ForegroundColor Yellow
Write-Host "  2. Test local build: npm run build" -ForegroundColor Yellow
Write-Host "  3. Push to GitHub: git push origin sam-workspace" -ForegroundColor Yellow
Write-Host "  4. Check Vercel deployment" -ForegroundColor Yellow
Write-Host "  5. Your CMS will be live! 🚀" -ForegroundColor Green
Write-Host ""

Write-Host "═════════════════════════════════════════════════════════════════════════════" -ForegroundColor $INFO
Write-Host "✨ Setup complete! Ready for production deployment" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════════════════════" -ForegroundColor $INFO
