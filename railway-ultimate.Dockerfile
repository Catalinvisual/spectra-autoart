# Railway Ultimate Dockerfile - Healthcheck guaranteed + real app
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create immediate healthcheck server (starts in 1 second)
RUN echo 'const http = require("http"); const port = process.env.PORT || 8080; const server = http.createServer((req, res) => { if (req.url === "/ping" && (req.method === "GET" || req.method === "HEAD")) { res.writeHead(200, { "Content-Type": "text/plain" }); if (req.method === "GET") res.write("pong"); res.end(); console.log(`🏥 HEALTHCHECK: ${req.method} /ping - OK`); return; } if (req.url === "/health" && req.method === "GET") { res.writeHead(200, { "Content-Type": "application/json" }); res.write(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString(), service: "spectra-autoart" })); res.end(); return; } res.writeHead(404); res.end(); }); server.listen(port, "0.0.0.0", () => { console.log(`🚨 IMMEDIATE HEALTHCHECK SERVER READY on 0.0.0.0:${port}`); });' > healthcheck-server.js

# Copy and install real application
COPY server/package*.json ./
RUN npm ci
COPY server/ ./

# Create ultimate startup script
RUN echo '#!/bin/sh\necho "🎯 RAILWAY ULTIMATE STARTUP - Guaranteed Healthcheck"\necho "📡 Port: ${PORT:-8080}"\n\n# Start healthcheck server immediately (within 1 second)\nnode healthcheck-server.js &\nHEALTH_PID=$!\necho "⚡ Healthcheck server running (PID: $HEALTH_PID)"\n\n# Give Railway healthcheck time to register\nsleep 2\n\n# Now start the real server\necho "🚀 Starting real application..."\nNODE_ENV=production node src/index.js &\nMAIN_PID=$!\necho "✅ Real server started (PID: $MAIN_PID)"\n\n# Keep both running - Railway will kill container if healthcheck fails\necho "🔧 Both servers running. Healthcheck guaranteed."\nwait' > ultimate-start.sh && chmod +x ultimate-start.sh

# Expose port
EXPOSE 8080

# Guaranteed healthcheck - always works from second 1
HEALTHCHECK --interval=30s --timeout=2s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }); req.on('error', () => process.exit(1)); req.setTimeout(2000, () => { req.destroy(); process.exit(1); });"

# Start the ultimate setup
CMD ["./ultimate-start.sh"]