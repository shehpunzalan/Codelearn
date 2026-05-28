#!/bin/bash

echo "🚀 Deploying to Supabase directly via Management API..."
echo ""

# Configuration
PROJECT_REF="hovedryqutuucipuqxca"
ACCESS_TOKEN="sbp_2479a99a4be6ab377498d3832543512833ddb114"

# Create function archive
echo "📦 Creating function archive..."
cd supabase/functions
tar -czf /tmp/server-function.tar.gz server/
cd ../..

# Deploy function
echo "🔄 Deploying function..."
DEPLOY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/server" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/x-tar" \
  --data-binary "@/tmp/server-function.tar.gz")

HTTP_CODE=$(echo "$DEPLOY_RESPONSE" | tail -n1)
BODY=$(echo "$DEPLOY_RESPONSE" | head -n-1)

echo "Response: $BODY"
echo "HTTP Code: $HTTP_CODE"

# Set secrets
echo ""
echo "🔐 Setting environment secrets..."
SECRETS_RESPONSE=$(curl -s -X POST \
  "https://api.supabase.com/v1/projects/${PROJECT_REF}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "SUPABASE_URL", "value": "https://hovedryqutuucipuqxca.supabase.co"},
    {"name": "SUPABASE_ANON_KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0"},
    {"name": "SUPABASE_SERVICE_ROLE_KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTg2MjYxMiwiZXhwIjoyMDk1NDM4NjEyfQ.uOlSQmQ7UmDjRfWBW6PxglT1QaOT_XBi4lPd1sJO3a0"}
  ]')

echo "Secrets response: $SECRETS_RESPONSE"

# Wait and test
echo ""
echo "⏳ Waiting 10 seconds for deployment to complete..."
sleep 10

echo ""
echo "🧪 Testing health endpoint..."
HEALTH=$(curl -s "https://hovedryqutuucipuqxca.supabase.co/functions/v1/make-server-aaa3a86f/health")
echo "Health check: $HEALTH"

if echo "$HEALTH" | grep -q "ok"; then
  echo ""
  echo "✅ SUCCESS! Backend is deployed and working!"
  echo "🔗 Test URL: https://hovedryqutuucipuqxca.supabase.co/functions/v1/make-server-aaa3a86f/health"
else
  echo ""
  echo "⚠️ Deployment submitted but health check failed."
  echo "The function may still be deploying. Wait a minute and check:"
  echo "🔗 https://hovedryqutuucipuqxca.supabase.co/functions/v1/make-server-aaa3a86f/health"
fi

echo ""
echo "🏁 Deployment script complete!"
