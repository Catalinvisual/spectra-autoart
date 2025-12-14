# Ultra-simple Railway Dockerfile - Emergency server only
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Create ultra-simple emergency server
RUN echo 'const express = require("express"); const app = express(); const port = process.env.PORT || 8080; app.get("/ping", (req, res) => { console.log("PING received"); res.send("pong"); }); app.head("/ping", (req, res) => { res.sendStatus(200); }); app.get("/health", (req, res) => { res.json({ status: "emergency", timestamp: new Date().toISOString() }); }); app.listen(port, "0.0.0.0", () => { console.log(`Emergency server running on 0.0.0.0:${port}`); });' > emergency.js

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start emergency server immediately
CMD ["node", "emergency.js"]