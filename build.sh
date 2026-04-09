#!/bin/bash
# Build script — substitutes environment variable placeholders in index.html.
# Runs automatically on Netlify via netlify.toml.
# For local builds: set SUPABASE_URL and SUPABASE_ANON_KEY, then run: bash build.sh
set -e

: "${SUPABASE_URL:?SUPABASE_URL is not set}"
: "${SUPABASE_ANON_KEY:?SUPABASE_ANON_KEY is not set}"

sed -i "s|__SUPABASE_URL__|${SUPABASE_URL}|g" index.html
sed -i "s|__SUPABASE_ANON_KEY__|${SUPABASE_ANON_KEY}|g" index.html

echo "Build complete. Supabase credentials injected into index.html."
