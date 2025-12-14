# Railway production Dockerfile - With emergency fallback
FROM node:20-alpine

# Install curl for healthcheck testing
RUN apk add --no-cache curl

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
RUN echo '#!/bin/sh\nset -e\necho "Starting Railway production server..."\nnode src/index.js &\nMAIN_PID=$!\necho "Main server started with PID: $MAIN_PID"\nsleep 15\necho "Testing healthcheck endpoint..."\nif curl -f http://localhost:8080/ping > /dev/null 2>&1; then\n  echo "✅ Main server responding to healthcheck"\n  wait $MAIN_PID\nelse\n  echo "❌ Main server failed healthcheck, starting emergency server"\n  kill $MAIN_PID 2>/dev/null || true\n  echo "Starting emergency server..."\n  node emergency-server.js\nfi' > start.sh && chmod +x start.sh

# Start with our fallback script
CMD ["./start.sh"]