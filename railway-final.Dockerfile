# Railway production Dockerfile - With emergency fallback
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci

# Copy server code
COPY server/ ./

# Set environment variables
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:8080/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Create startup script that tries main server first, then emergency
RUN echo '#!/bin/sh\nnode src/index.js &\nMAIN_PID=$!\nsleep 10\nif ! curl -f http://localhost:8080/ping > /dev/null 2>&1; then\n  echo "Main server failed to start, starting emergency server"\n  kill $MAIN_PID 2>/dev/null || true\n  node emergency-server.js\nelse\n  echo "Main server started successfully"\n  wait $MAIN_PID\nfi' > start.sh && chmod +x start.sh

# Start with our fallback script
CMD ["./start.sh"]