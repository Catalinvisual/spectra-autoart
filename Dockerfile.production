# Railway Production Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci
RUN cd server && npm ci
RUN cd client && npm ci

# Copy source code
COPY . .

# Build client with proper permissions
RUN chmod +x ./client/node_modules/.bin/* || true
RUN cd client && npm run build

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=120s --retries=5 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start command
CMD ["node", "railway-start.js"]