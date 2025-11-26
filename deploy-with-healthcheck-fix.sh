#!/bin/bash

echo "🚀 Starting Railway deployment with healthcheck fix..."

# Check if we're in the right directory
if [ ! -f "railway.toml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Current configuration:"
echo "- Healthcheck path: /health"
echo "- Healthcheck timeout: 10s"
echo "- Healthcheck retries: 10"
echo "- Start period: 120s"
echo "- Interval: 30s"

echo ""
echo "🔧 Changes made to fix healthcheck:"
echo "1. Increased start period from 60s to 120s"
echo "2. Increased retries from 5 to 10"
echo "3. Increased timeout from 5s to 10s"
echo "4. Changed healthcheck host from 0.0.0.0 to localhost"
echo "5. Enhanced healthcheck response with uptime and environment"
echo "6. Reduced initialization delay from 100ms to 50ms"
echo "7. Aligned start commands between Dockerfile and railway.toml"

echo ""
echo "✅ Ready for deployment!"
echo "Run: railway up"
echo ""
echo "Monitor deployment logs with:"
echo "railway logs --follow"