# Railway production Dockerfile - Production safe
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install cross-env globally for production use
RUN npm install -g cross-env

# Copy server package files
COPY server/package*.json ./

# Install all dependencies (including dev dependencies for cross-env)
RUN npm ci

# Copy server code
COPY server/ ./

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start command
CMD ["cross-env", "NODE_OPTIONS=--openssl-legacy-provider", "node", "src/index.js"]