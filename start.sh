#!/bin/sh
set -e

echo "🚀 Starting Spectra AutoArt application..."
echo "📍 Current directory: $(pwd)"
echo "📍 Listing files: $(ls -la)"

echo "🔄 Changing to server directory..."
cd server

echo "📍 Server directory contents: $(ls -la)"

echo "🚀 Starting Node.js application..."
exec npm start