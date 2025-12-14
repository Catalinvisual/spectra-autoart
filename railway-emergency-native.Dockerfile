# Ultra-simple Railway Dockerfile - No dependencies
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create ultra-simple emergency server using only Node.js built-ins
RUN echo 'const http = require("http"); const port = process.env.PORT || 8080; const server = http.createServer((req, res) => { if (req.url === "/ping" && (req.method === "GET" || req.method === "HEAD")) { console.log(`PING received - ${req.method}`); res.writeHead(200, { "Content-Type": "text/plain" }); if (req.method === "GET") res.write("pong"); res.end(); return; } if (req.url === "/health" && req.method === "GET") { res.writeHead(200, { "Content-Type": "application/json" }); res.write(JSON.stringify({ status: "emergency", timestamp: new Date().toISOString() })); res.end(); return; } res.writeHead(404); res.end(); }); server.listen(port, "0.0.0.0", () => { console.log(`Emergency server running on 0.0.0.0:${port}`); });' > emergency.js

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start emergency server immediately
CMD ["node", "emergency.js"]