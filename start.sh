#!/bin/sh
set -e

echo "🚀 Starting Spectra AutoArt application..."
echo "📍 Current directory: $(pwd)"
echo "📍 Listing files: $(ls -la)"
echo "📍 Environment PORT: ${PORT:-not set}"
echo "📍 Environment NODE_ENV: ${NODE_ENV:-not set}"
echo "📍 Environment RAILWAY_PROJECT_ID: ${RAILWAY_PROJECT_ID:-not set}"

echo "🔄 Changing to server directory..."
cd server

echo "📍 Server directory contents: $(ls -la)"
echo "📍 Checking if src/index.js exists: $(ls -la src/index.js 2>/dev/null || echo 'NOT FOUND')"

echo "🚀 Starting Node.js application..."
echo "🔥 RAILWAY STARTUP: About to execute 'npm start'"
echo "🔥 RAILWAY STARTUP: This should start the server on port ${PORT:-8080}"

# Execute npm start and capture any errors
npm start || {
    echo "❌ RAILWAY STARTUP FAILED: npm start exited with error code $?"
    echo "📍 Current directory: $(pwd)"
    echo "📍 Node version: $(node --version)"
    echo "📍 NPM version: $(npm --version)"
    echo "📍 Server files: $(ls -la)"
    exit 1
}