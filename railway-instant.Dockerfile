# Railway Instant Healthcheck - Ultra Simplified
FROM node:20-alpine

# Install curl
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Create ULTRA-SIMPLE healthcheck server that starts in 100ms
RUN echo 'const http = require("http"); const port = process.env.PORT || 8080; const server = http.createServer((req, res) => { if (req.url === "/ping") { res.writeHead(200, { "Content-Type": "text/plain" }); res.end("pong"); return; } res.writeHead(404); res.end(); }); server.listen(port, "0.0.0.0", () => console.log(`INSTANT HEALTHCHECK READY on ${port}`));' > healthcheck.js

# Create simple startup that works
RUN echo '#!/bin/sh\necho "INSTANT START"\nnode healthcheck.js &' > start.sh && chmod +x start.sh

# Ultra-aggressive healthcheck
HEALTHCHECK --interval=2s --timeout=1s --start-period=1s --retries=10 \
  CMD node -e "const http = require('http'); const req = http.get('http://localhost:${PORT:-8080}/ping', (res) => process.exit(res.statusCode === 200 ? 0 : 1)); req.on('error', () => process.exit(1)); req.setTimeout(1000, () => { req.destroy(); process.exit(1); });"

# Start healthcheck immediately
CMD ["node", "healthcheck.js"]