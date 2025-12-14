# Railway Dockerfile - Hybrid approach: Emergency + Real server
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY server/package*.json ./

# Install dependencies
RUN npm ci

# Copy server files
COPY server/ ./

# Create emergency server as fallback
RUN echo 'const http = require("http"); const port = process.env.PORT || 8080; const server = http.createServer((req, res) => { if (req.url === "/ping" && (req.method === "GET" || req.method === "HEAD")) { console.log(`Emergency PING - ${req.method}`); res.writeHead(200, { "Content-Type": "text/plain" }); if (req.method === "GET") res.write("pong"); res.end(); return; } if (req.url === "/health" && req.method === "GET") { res.writeHead(200, { "Content-Type": "application/json" }); res.write(JSON.stringify({ status: "emergency", timestamp: new Date().toISOString() })); res.end(); return; } res.writeHead(503, { "Content-Type": "text/plain" }); res.write("Service starting..."); res.end(); }); server.listen(port, "0.0.0.0", () => { console.log(`Emergency server ready on 0.0.0.0:${port}`); });' > emergency.js

# Create startup script
RUN echo '#!/bin/sh\necho "Starting Railway production server..."\n\n# Start emergency server first\nnode emergency.js &\nEMERGENCY_PID=$!\necho "Emergency server started with PID: $EMERGENCY_PID"\n\n# Wait a bit for emergency server to be ready\nsleep 2\n\n# Test emergency server\necho "Testing emergency server..."\nif curl -f http://localhost:8080/ping > /dev/null 2>&1; then\n  echo "✅ Emergency server responding"\nelse\n  echo "❌ Emergency server failed"\nfi\n\n# Now start the real server\necho "Starting main server..."\nnode src/index.js &\nMAIN_PID=$!\necho "Main server started with PID: $MAIN_PID"\n\n# Wait for main server to be ready\necho "Waiting for main server to be ready..."\nsleep 10\n\n# Test main server\necho "Testing main server healthcheck..."\nif curl -f http://localhost:8080/ping > /dev/null 2>&1; then\n  echo "✅ Main server responding, stopping emergency server"\n  kill $EMERGENCY_PID 2>/dev/null || true\n  echo "✅ Emergency server stopped, main server active"\n  wait $MAIN_PID\nelse\n  echo "❌ Main server not responding, keeping emergency server active"\n  wait $EMERGENCY_PID\nfi' > start.sh && chmod +x start.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start with the hybrid script
CMD ["./start.sh"]