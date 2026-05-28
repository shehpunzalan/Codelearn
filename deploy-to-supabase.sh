#!/bin/bash

# ============================================
# CodeLearn AI - Supabase Deployment Script
# Project: hovedryqutuucipuqxca
# ============================================

echo "🚀 CodeLearn AI - Supabase Deployment"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project details
PROJECT_ID="hovedryqutuucipuqxca"
PROJECT_URL="https://hovedryqutuucipuqxca.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg2MjYxMiwiZXhwIjoyMDk1NDM4NjEyfQ.rEXLu2Pr0I6tljFm5kuUD_94LdtK7ozPm42BVgZjHyY"

# Check if Supabase CLI is installed
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

# Step 1: Login
echo -e "${BLUE}📝 Step 1: Login to Supabase${NC}"
supabase login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Login failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logged in successfully${NC}"
echo ""

# Step 2: Link project
echo -e "${BLUE}🔗 Step 2: Linking to project ${PROJECT_ID}${NC}"
supabase link --project-ref $PROJECT_ID

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to link project${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project linked successfully${NC}"
echo ""

# Step 3: Deploy Edge Function
echo -e "${BLUE}🚀 Step 3: Deploying Edge Function${NC}"
supabase functions deploy server --no-verify-jwt

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Edge Function deployed successfully${NC}"
echo ""

# Step 4: Set environment secrets
echo -e "${BLUE}🔐 Step 4: Setting environment secrets${NC}"

echo "Setting SUPABASE_URL..."
supabase secrets set SUPABASE_URL=$PROJECT_URL

echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

echo "Setting SUPABASE_ANON_KEY..."
supabase secrets set SUPABASE_ANON_KEY=$ANON_KEY

echo -e "${GREEN}✅ All secrets set successfully${NC}"
echo ""

# Step 5: Test deployment
echo -e "${BLUE}🧪 Step 5: Testing deployment${NC}"
echo ""
echo "Testing health endpoint..."
HEALTH_URL="${PROJECT_URL}/functions/v1/make-server-aaa3a86f/health"

response=$(curl -s "$HEALTH_URL")

if echo "$response" | grep -q "ok"; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
    echo "Response: $response"
else
    echo -e "${YELLOW}⚠️  Health check response:${NC}"
    echo "$response"
    echo ""
    echo "Note: Function may still be deploying. Try again in 30 seconds."
fi

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Test the health endpoint in your browser:"
echo "   ${HEALTH_URL}"
echo "2. Open your CodeLearn AI app and test"
echo "3. Check browser console for 'Backend submission successful'"
echo ""
echo "📊 Monitor your function:"
echo "   Dashboard: https://supabase.com/dashboard/project/${PROJECT_ID}/functions"
echo "   Logs: supabase functions logs server"
echo ""
