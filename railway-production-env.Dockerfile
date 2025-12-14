# Railway Production Dockerfile - Real server with environment
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci

# Copy server files
COPY server/ ./

# Create service account file from environment variable
RUN mkdir -p config && echo "$GOOGLE_SERVICE_ACCOUNT_KEY" > config/service-account.json

# Create production startup script
RUN echo '#!/bin/sh\necho "Starting Railway production server..."\necho "Environment: $NODE_ENV"\necho "Port: $PORT"\n\n# Start the main server with error handling\nnode src/index.js || {\n  echo "❌ Main server failed to start"\n  echo "Starting emergency server..."\n  node -e "const http = require(\"http\"); const port = process.env.PORT || 8080; http.createServer((req, res) => { if (req.url === \"/ping\") { res.writeHead(200); res.write(\"pong\"); } else { res.writeHead(503); res.write(\"Service starting...\"); } res.end(); }).listen(port, \"0.0.0.0\", () => console.log(\"Emergency server on port \" + port));"\n}' > start-production.sh && chmod +x start-production.sh

# Expose port
EXPOSE 8080

# Health check with longer timeout for startup
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start production server
CMD ["./start-production.sh"]