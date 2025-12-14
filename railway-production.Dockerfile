# Railway Production Dockerfile - Real server with proper startup
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

# Create production startup script
RUN echo '#!/bin/sh\necho "Starting Railway production server..."\n\n# Set production environment\nexport NODE_ENV=production\nexport PORT=${PORT:-8080}\n\necho "Environment: $NODE_ENV"\necho "Port: $PORT"\necho "Starting main server..."\n\n# Start the main server directly\nnode src/index.js' > start-production.sh && chmod +x start-production.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start production server
CMD ["./start-production.sh"]