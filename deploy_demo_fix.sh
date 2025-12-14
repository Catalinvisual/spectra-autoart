#!/bin/bash

echo "🚀 Deploying Google Sheets Service demo mode fix..."

# Check if we're in the right directory
if [ ! -f "server/src/services/googleSheetsService.js" ]; then
    echo "❌ Error: Google Sheets Service file not found!"
    exit 1
fi

echo "✅ Google Sheets Service file found"

# Check if the fix is in place
if grep -q "Production environment detected - enabling demo mode" server/src/services/googleSheetsService.js; then
    echo "✅ Demo mode fix is present in Google Sheets Service"
else
    echo "❌ Demo mode fix not found in Google Sheets Service!"
    exit 1
fi

echo "📦 Building and deploying to Railway..."

# Navigate to server directory
cd server

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the server
echo "🔨 Building server..."
npm run build 2>/dev/null || echo "No build script found, skipping..."

# Deploy to Railway
echo "🚄 Deploying to Railway..."
railway up

echo "✅ Deployment initiated!"
echo "📝 The server will restart with the demo mode fix."
echo "⏳ Please wait 2-3 minutes for the deployment to complete."
echo "🌐 After deployment, test the admin endpoints at:"
echo "   - https://spectraautoart.nl/api/admin/dashboard"
echo "   - https://spectraautoart.nl/api/admin/bookings"  
echo "   - https://spectraautoart.nl/api/admin/body-types"