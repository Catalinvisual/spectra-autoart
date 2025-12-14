# Railway Production Dockerfile - Full application with proper setup
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

# Create service account file from environment
RUN echo '${GOOGLE_SERVICE_ACCOUNT_KEY}' > config/service-account.json || echo 'Service account key not provided, will use environment variables'

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "run", "start"]