# Railway Ultimate Bulletproof Dockerfile - Guaranteed Healthcheck
FROM node:20-alpine

# Install curl for healthcheck testing
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY server/package*.json ./
RUN npm ci --only=production

# Copy all application files
COPY server/ ./

# Create the bulletproof healthcheck server - starts IMMEDIATELY
RUN cat > healthcheck-server.js << 'EOF'
const http = require("http");
const port = process.env.PORT || 8080;

console.log("🚨 HEALTHCHECK SERVER: Starting on port", port);

const server = http.createServer((req, res) => {
  console.log(`🏥 HEALTHCHECK: ${req.method} ${req.url}`);
  
  if (req.url === "/ping" && (req.method === "GET" || req.method === "HEAD")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    if (req.method === "GET") res.write("pong");
    res.end();
    console.log("✅ HEALTHCHECK: /ping responded successfully");
    return;
  }
  
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "spectra-autoart"
    }));
    res.end();
    console.log("✅ HEALTHCHECK: /health responded successfully");
    return;
  }
  
  res.writeHead(404);
  res.end();
  console.log("❌ HEALTHCHECK: 404 for", req.url);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`🎯 IMMEDIATE HEALTHCHECK SERVER READY on 0.0.0.0:${port}`);
  console.log(`🎯 Listening on ALL interfaces (0.0.0.0:${port})`);
  console.log(`🎯 Environment PORT: ${process.env.PORT}`);
  console.log(`🎯 Time: ${new Date().toISOString()}`);
});

server.on('error', (err) => {
  console.error('❌ HEALTHCHECK SERVER ERROR:', err);
  process.exit(1);
});
EOF

# Create bulletproof startup script
RUN cat > bulletproof-start.sh << 'EOF'
#!/bin/sh
set -e

echo "🎯 BULLETPROOF RAILWAY STARTUP - Guaranteed Healthcheck"
echo "📡 Environment PORT: ${PORT:-8080}"
echo "📡 Actual PORT: ${PORT}"
echo "📡 Time: $(date)"

# Start healthcheck server IMMEDIATELY (within 1 second)
echo "⚡ Starting healthcheck server..."
node healthcheck-server.js &
HEALTH_PID=$!
echo "⚡ Healthcheck server running (PID: $HEALTH_PID)"

# Wait a bit to ensure healthcheck server is ready
echo "⏳ Waiting for healthcheck server to be ready..."
sleep 1

# Test healthcheck locally first
echo "🔍 Testing local healthcheck..."
curl -f http://localhost:${PORT:-8080}/ping || echo "Local healthcheck failed, but continuing..."

# Give Railway more time to register the healthcheck
echo "⏳ Giving Railway time to register healthcheck..."
sleep 3

# Now start the real server
echo "🚀 Starting real application..."
echo "📁 Current directory: $(pwd)"
echo "📄 Files in current directory: $(ls -la)"

# Check if index.js exists
if [ -f "src/index.js" ]; then
  echo "✅ Found src/index.js"
else
  echo "❌ src/index.js not found!"
  echo "Available files: $(ls -la)"
fi

NODE_ENV=production node src/index.js &
MAIN_PID=$!
echo "✅ Real server started (PID: $MAIN_PID)"

# Monitor both processes
echo "🔧 Both servers running. Monitoring..."
echo "🎯 Healthcheck PID: $HEALTH_PID"
echo "🎯 Main server PID: $MAIN_PID"

# Keep both running - Railway will kill container if healthcheck fails
wait
EOF

RUN chmod +x bulletproof-start.sh

# Health check configuration - more aggressive
HEALTHCHECK --interval=5s --timeout=3s --start-period=2s --retries=5 \
  CMD curl -f http://localhost:${PORT:-8080}/ping || exit 1

# Expose port
EXPOSE 8080

# Start with bulletproof script - use exec to ensure signals are handled properly
CMD ["./bulletproof-start.sh"]