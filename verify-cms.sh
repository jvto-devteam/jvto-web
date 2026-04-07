#!/bin/bash
# CMS Dashboard - Verification Checklist

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 CMS Dashboard Implementation Verification"
echo "==========================================="
echo ""

# Array to track results
declare -a RESULTS

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        RESULTS+=("1")
    else
        echo -e "${RED}✗${NC} $1"
        RESULTS+=("0")
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directory: $1"
        RESULTS+=("1")
    else
        echo -e "${RED}✗${NC} Directory: $1"
        RESULTS+=("0")
    fi
}

echo "📂 API Routes"
check_file "src/app/(api)/api/cms/content/route.ts"
check_file "src/app/(api)/api/cms/blogs/route.ts"
check_file "src/app/(api)/api/cms/faqs/route.ts"
echo ""

echo "🧩 Components"
check_file "src/components/cms/DataTable.tsx"
check_file "src/components/cms/CmsForm.tsx"
echo ""

echo "📄 Manager Pages"
check_file "src/app/(cms)/cms/collections/content-pages/page.tsx"
check_file "src/app/(cms)/cms/collections/blog-manager/page.tsx"
check_file "src/app/(cms)/cms/collections/faq-manager/page.tsx"
echo ""

echo "🎨 Layout Components"
check_file "src/app/(cms)/cms/page.tsx"
check_file "src/app/(cms)/cms/_components/CmsSidebar.tsx"
check_file "src/app/(cms)/cms/_components/CmsTopbar.tsx"
echo ""

echo "🔧 Utilities & Hooks"
check_file "src/utils/cms.ts"
check_file "src/hooks/useCmsData.ts"
echo ""

echo "📚 Documentation"
check_file "docs/CMS_DASHBOARD.md"
check_file "CMS_QUICKSTART.md"
check_file "CMS_IMPLEMENTATION.md"
echo ""

# Calculate total
total=${#RESULTS[@]}
success=$(IFS=+; echo "$((${RESULTS[*]}))")
fail=$((total - success))

echo "==========================================="
echo -e "${GREEN}✓ Complete${NC}: $success/$total files"
if [ $fail -gt 0 ]; then
    echo -e "${RED}✗ Missing${NC}: $fail/$total files"
fi
echo ""

# Summary
if [ $fail -eq 0 ]; then
    echo -e "${GREEN}✅ CMS Dashboard Implementation: COMPLETE${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. npm run dev"
    echo "  2. Visit http://localhost:3000/cms"
    echo "  3. Start managing content!"
else
    echo -e "${YELLOW}⚠️  Some files are missing${NC}"
fi
