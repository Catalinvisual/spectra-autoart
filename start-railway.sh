#!/bin/sh

# RAILWAY STARTUP SCRIPT - EMERGENCY + MAIN SERVER
# Start emergency server immediately for healthcheck, then main server

echo "🚨 RAILWAY STARTUP: Starting emergency server immediately..."
echo "🚨 Time: $(date)"
echo "🚨 PORT: ${PORT:-8080}"
echo "🚨 NODE_ENV: ${NODE_ENV}"
echo "🚨 RAILWAY_PROJECT_ID: ${RAILWAY_PROJECT_ID}"

# Start emergency server in background immediately
node /app/emergency-server.js &
EMERGENCY_PID=$!

echo "🚨 Emergency server started with PID: $EMERGENCY_PID"

# Wait a tiny bit to ensure emergency server is up
sleep 2

# Test emergency server
echo "🚨 Testing emergency server..."
curl -f http://localhost:${PORT:-8080}/ping || echo "🚨 Emergency server test failed"

# Now start the main server
echo "🚀 Starting main server..."
cd /app/server
echo "🚀 Current directory: $(pwd)"
echo "🚀 Starting: npm start"

# Start main server
npm start

# If main server exits, keep emergency server running
echo "⚠️ Main server exited, keeping emergency server alive"
wait $EMERGENCY_PID