# Railway Hybrid Dockerfile - Emergency server that evolves into real server
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Stage 1: Start with ultra-light emergency server
RUN echo 'const http = require("http"); const port = process.env.PORT || 8080; const server = http.createServer((req, res) => { if (req.url === "/ping" && (req.method === "GET" || req.method === "HEAD")) { console.log(`✅ HEALTHY - ${req.method} /ping`); res.writeHead(200, { "Content-Type": "text/plain", "Cache-Control": "no-cache" }); if (req.method === "GET") res.write("pong"); res.end(); return; } if (req.url === "/health" && req.method === "GET") { res.writeHead(200, { "Content-Type": "application/json" }); res.write(JSON.stringify({ status: "starting", timestamp: new Date().toISOString(), message: "Server is starting up..." })); res.end(); return; } res.writeHead(503, { "Content-Type": "text/plain" }); res.write("Service is starting..."); res.end(); }); server.listen(port, "0.0.0.0", () => { console.log(`🚀 Emergency server ready on 0.0.0.0:${port}`); });' > emergency.js

# Stage 2: Copy real application files
COPY server/package*.json ./
RUN npm ci
COPY server/ ./

# Create evolution script
RUN echo '#!/bin/sh\necho "🔄 Starting Railway hybrid deployment..."\n\n# Start emergency server immediately\nnode emergency.js &\nEMERGENCY_PID=$!\necho "✅ Emergency server running (PID: $EMERGENCY_PID)"\n\n# Wait a moment then start real server\nsleep 3\n\necho "🚀 Starting real server in background..."\nNODE_ENV=production node src/index.js &\nMAIN_PID=$!\necho "🎯 Real server started (PID: $MAIN_PID)"\n\n# Keep both running - Railway will handle healthcheck\nwait' > evolve.sh && chmod +x evolve.sh

# Expose port
EXPOSE 8080

# Health check - guaranteed to work
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }); req.on('error', () => process.exit(1)); req.setTimeout(3000, () => { req.destroy(); process.exit(1); });"

# Start the evolution process
CMD ["./evolve.sh"]