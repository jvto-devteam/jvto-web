# Setup script untuk migrasi ke akun Sambuko82 (Windows)
# Run ini SETELAH GitHub dan Vercel account sudah dibuat

Write-Host "`n🚀 SETUP SCRIPT UNTUK SAMBUKO82 ACCOUNT`n" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git tidak terinstall" -ForegroundColor Red
    exit 1
}

# Step 1: Configure Git
Write-Host "`nStep 1: Configure Git User" -ForegroundColor Yellow
$github_user = Read-Host "Enter GitHub username (sambuko82)"
if (-not $github_user) { $github_user = "sambuko82" }

$github_email = Read-Host "Enter GitHub email"

git config --global user.name $github_user
git config --global user.email $github_email
Write-Host "✅ Git config updated" -ForegroundColor Green

# Step 2: Setup SSH Key
Write-Host "`nStep 2: Setup SSH Key" -ForegroundColor Yellow

$ssh_key_path = "$env:USERPROFILE\.ssh\id_ed25519"
if (Test-Path $ssh_key_path) {
    Write-Host "SSH key already exists" -ForegroundColor Yellow
    $use_existing = Read-Host "Use existing key? (y/n)"
    if ($use_existing -ne "y") {
        ssh-keygen -t ed25519 -C $github_email -f $ssh_key_path -N ""
        Write-Host "✅ New SSH key generated" -ForegroundColor Green
    }
} else {
    ssh-keygen -t ed25519 -C $github_email -f $ssh_key_path -N ""
    Write-Host "✅ SSH key generated" -ForegroundColor Green
}

# Display SSH public key
Write-Host "`nPublic SSH Key:" -ForegroundColor Yellow
$public_key = Get-Content "$ssh_key_path.pub"
Write-Host $public_key
Write-Host "`n👉 Add this to: https://github.com/settings/keys" -ForegroundColor Yellow

$confirm = Read-Host "`nPress Enter after adding SSH key..."

# Step 3: Test SSH Connection
Write-Host "`nStep 3: Test SSH Connection" -ForegroundColor Yellow
ssh -T git@github.com
Write-Host "✅ SSH connected" -ForegroundColor Green

# Step 4: Clone Repository
Write-Host "`nStep 4: Clone Repository" -ForegroundColor Yellow
$repo_name = Read-Host "Enter repo name to clone (jvto-web)"
if (-not $repo_name) { $repo_name = "jvto-web" }

git clone git@github.com:$github_user/$repo_name.git
Set-Location $repo_name
Write-Host "✅ Repository cloned" -ForegroundColor Green

# Step 5: Install Dependencies
Write-Host "`nStep 5: Install Dependencies" -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 6: Setup Environment Variables
Write-Host "`nStep 6: Setup Environment Variables" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host ".env.local already exists" -ForegroundColor Yellow
    $keep_env = Read-Host "Keep existing? (y/n)"
    if ($keep_env -ne "y") {
        Copy-Item ".env.local" ".env.local.backup"
        Write-Host "✅ Backup created as .env.local.backup" -ForegroundColor Green
    }
} else {
    Write-Host ".env.local not found!" -ForegroundColor Red
    Write-Host "Copy .env variables from Vercel dashboard"
    $confirm = Read-Host "Press Enter when done..."
}

# Step 7: Verify Setup
Write-Host "`nStep 7: Verify Setup" -ForegroundColor Yellow

Write-Host "Checking git config..." -ForegroundColor Yellow
git config user.name
git config user.email
Write-Host "✅ Git configured" -ForegroundColor Green

# Test database connection
if (Test-Path ".env.local") {
    Write-Host "Testing environment..." -ForegroundColor Yellow
    npm run build 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Add Vercel environment variables"
Write-Host "2. Add GitHub Actions secrets:"
Write-Host "   - VERCEL_TOKEN"
Write-Host "   - VERCEL_ORG_ID"
Write-Host "   - VERCEL_PROJECT_ID"
Write-Host ""
Write-Host "3. Start development:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "4. Deploy:"
Write-Host "   git push origin sam-workspace"
Write-Host ""

Write-Host "Resources:" -ForegroundColor Yellow
Write-Host "- GitHub: https://github.com/$github_user/$repo_name"
Write-Host "- Vercel: https://vercel.com/$github_user/$repo_name"
Write-Host "- Local: http://localhost:3000/cms"
Write-Host ""
