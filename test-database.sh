#!/bin/bash

# Quick script to test Supabase database connection
# Run with: bash test-database.sh

echo "🧪 Testing Supabase Database Connection..."
echo ""

# Test 1: Database connection
echo "1️⃣ Testing database connection..."
response=$(curl -s https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/test)
echo "$response" | jq . 2>/dev/null || echo "$response"
echo ""

# Test 2: Get all students
echo "2️⃣ Fetching all students..."
response=$(curl -s https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/students)
echo "$response" | jq . 2>/dev/null || echo "$response"
echo ""

# Test 3: Health check
echo "3️⃣ Testing Edge Function health..."
response=$(curl -s https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/health)
echo "$response" | jq . 2>/dev/null || echo "$response"
echo ""

echo "✅ Test complete!"
echo ""
echo "If all tests show 'success: true', your database is working!"
echo "If you see errors, the table might not exist yet."
echo ""
echo "To create the table, see: CREATE_TABLE_MANUAL.md"
