#!/usr/bin/env bash
# Run this script to fix "Remote migration versions not found in local migrations directory"
#
# You need a Supabase Personal Access Token:
#   1. Go to https://supabase.com/dashboard/account/tokens
#   2. Create a new token and paste it below (or export it before running)

set -e

PROJECT_REF="hoofdryqutuucipuqxca"
BIN="./node_modules/.bin/supabase"

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "ERROR: SUPABASE_ACCESS_TOKEN is not set."
  echo "Get your token at: https://supabase.com/dashboard/account/tokens"
  echo "Then run: SUPABASE_ACCESS_TOKEN=<your_token> bash fix-migrations.sh"
  exit 1
fi

echo "Linking to project $PROJECT_REF..."
$BIN link --project-ref "$PROJECT_REF"

echo ""
echo "Fetching remote migration list..."
$BIN migration list --linked

echo ""
echo "If you see remote versions missing locally, run:"
echo "  $BIN migration repair --status applied <version>"
echo "for each version listed under 'Remote' that is missing locally."
echo ""
echo "Or run this to capture current remote state as a single local migration:"
echo "  $BIN db remote commit"
