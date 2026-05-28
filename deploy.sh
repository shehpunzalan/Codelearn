#!/bin/bash

# CodeLearn AI - Supabase Deployment Script
# Project ID: hovedryqutuucipuqxca

echo "🚀 CodeLearn AI - Supabase Deployment"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found!${NC}"
    echo ""
    echo "Please install it first:"
    echo "  Mac/Linux: brew install supabase/tap/supabase"
    echo "  Windows:   scoop install supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI found${NC}"
echo ""

# Login to Supabase
echo -e "${BLUE}📝 Step 1: Login to Supabase${NC}"
supabase login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Login failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logged in successfully${NC}"
echo ""

# Link to project
echo -e "${BLUE}🔗 Step 2: Linking to project hovedryqutuucipuqxca${NC}"
supabase link --project-ref hovedryqutuucipuqxca

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to link project${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project linked successfully${NC}"
echo ""

# Deploy Edge Function
echo -e "${BLUE}🚀 Step 3: Deploying Edge Function${NC}"
supabase functions deploy server --no-verify-jwt

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Edge Function deployed successfully${NC}"
echo ""

# Set environment variables
echo -e "${BLUE}🔐 Step 4: Setting environment secrets${NC}"
echo ""

# Set Supabase URL
echo "Setting SUPABASE_URL..."
supabase secrets set SUPABASE_URL=https://hovedryqutuucipuqxca.supabase.co

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: You need to set your API keys manually!${NC}"
echo ""
echo "Run these commands with your actual keys:"
echo ""
echo -e "${BLUE}supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here${NC}"
echo -e "${BLUE}supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here${NC}"
echo ""
echo "Get your keys from:"
echo "https://supabase.com/dashboard/project/hovedryqutuucipuqxca/settings/api"
echo ""

# Test deployment
echo -e "${BLUE}🧪 Step 5: Testing deployment${NC}"
echo ""
echo "Testing health endpoint..."
HEALTH_URL="https://hovedryqutuucipuqxca.supabase.co/functions/v1/make-server-aaa3a86f/health"

response=$(curl -s "$HEALTH_URL")

if echo "$response" | grep -q "ok"; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
    echo "Response: $response"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Response: $response"
    echo ""
    echo "This might be because environment secrets are not set yet."
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Set your API keys (see commands above)"
echo "2. Test the health endpoint in your browser:"
echo "   ${HEALTH_URL}"
echo "3. Open your CodeLearn AI app and test"
echo ""
echo "Need help? Check DEPLOYMENT_GUIDE.md"
echo ""
