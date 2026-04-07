#!/bin/bash

# Setup script untuk migrasi ke akun Sambuko82
# Run ini SETELAH GitHub dan Vercel account sudah dibuat

echo "🚀 SETUP SCRIPT UNTUK SAMBUKO82 ACCOUNT"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git tidak terinstall${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Configure Git User${NC}"
read -p "Enter GitHub username (sambuko82): " github_user
github_user=${github_user:-sambuko82}

read -p "Enter GitHub email: " github_email

git config --global user.name "$github_user"
git config --global user.email "$github_email"
echo -e "${GREEN}✅ Git config updated${NC}"

echo ""
echo -e "${YELLOW}Step 2: Setup SSH Key${NC}"

if [ -f ~/.ssh/id_ed25519 ]; then
    echo -e "${YELLOW}SSH key already exists${NC}"
    read -p "Use existing key? (y/n): " use_existing
    if [ "$use_existing" != "y" ]; then
        ssh-keygen -t ed25519 -C "$github_email" -f ~/.ssh/id_ed25519 -N ""
        echo -e "${GREEN}✅ New SSH key generated${NC}"
    fi
else
    ssh-keygen -t ed25519 -C "$github_email" -f ~/.ssh/id_ed25519 -N ""
    echo -e "${GREEN}✅ SSH key generated${NC}"
fi

echo ""
echo -e "${YELLOW}Public SSH Key:${NC}"
cat ~/.ssh/id_ed25519.pub
echo ""
echo -e "${YELLOW}👉 Add this to: https://github.com/settings/keys${NC}"
read -p "Press Enter after adding SSH key..."

echo ""
echo -e "${YELLOW}Step 3: Test SSH Connection${NC}"
ssh -T git@github.com
echo -e "${GREEN}✅ SSH connected${NC}"

echo ""
echo -e "${YELLOW}Step 4: Clone Repository${NC}"
read -p "Enter repo name to clone (jvto-web): " repo_name
repo_name=${repo_name:-jvto-web}

git clone git@github.com:$github_user/$repo_name.git
cd $repo_name

echo -e "${GREEN}✅ Repository cloned${NC}"

echo ""
echo -e "${YELLOW}Step 5: Install Dependencies${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo -e "${YELLOW}Step 6: Setup Environment Variables${NC}"
if [ -f .env.local ]; then
    echo -e "${YELLOW}.env.local already exists${NC}"
    read -p "Keep existing? (y/n): " keep_env
    if [ "$keep_env" != "y" ]; then
        cp .env.local .env.local.backup
        echo -e "${GREEN}✅ Backup created as .env.local.backup${NC}"
    fi
else
    echo -e "${RED}.env.local not found!${NC}"
    echo "Copy .env variables from Vercel dashboard"
    read -p "Press Enter when done..."
fi

echo ""
echo -e "${YELLOW}Step 7: Verify Setup${NC}"

# Test git configuration
echo -e "${YELLOW}Checking git config...${NC}"
git config user.name
git config user.email
echo -e "${GREEN}✅ Git configured${NC}"

# Test database connection (if .env exists)
if [ -f .env.local ]; then
    echo -e "${YELLOW}Testing environment...${NC}"
    npm run build > /dev/null 2>&1 && echo -e "${GREEN}✅ Build successful${NC}" || echo -e "${RED}❌ Build failed${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ SETUP COMPLETE!"
echo "==========================================${NC}"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Add Vercel environment variables"
echo "2. Add GitHub Actions secrets:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo ""
echo "3. Start development:"
echo "   npm run dev"
echo ""
echo "4. Deploy:"
echo "   git push origin sam-workspace"
echo ""

echo -e "${YELLOW}Resources:${NC}"
echo "- GitHub: https://github.com/$github_user/$repo_name"
echo "- Vercel: https://vercel.com/$github_user/$repo_name"
echo "- Local: http://localhost:3000/cms"
echo ""
