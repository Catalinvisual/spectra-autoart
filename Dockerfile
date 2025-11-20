# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package.json first
COPY package.json ./

# Copy server files and install dependencies
COPY server/package.json ./server/
COPY server/package-lock.json ./server/
RUN cd server && npm ci --only=production

# Copy client files and install dependencies
COPY client/package.json ./client/
COPY client/package-lock.json ./client/
RUN cd client && npm ci

# Copy server source code
COPY server/ ./server/

# Copy client source code
COPY client/ ./client/

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start server
CMD ["node", "server/src/index.js"]