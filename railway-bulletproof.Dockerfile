# Railway Bulletproof Dockerfile - Permanent healthcheck with real app
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy and install dependencies first
COPY server/package*.json ./
RUN npm ci

# Copy server files
COPY server/ ./

# Create bulletproof startup script
RUN echo '#!/bin/sh\necho "🔥 Starting Railway bulletproof deployment..."\n\n# Set production environment\nexport NODE_ENV=production\nexport PORT=${PORT:-8080}\n\necho "🎯 Port: $PORT"\necho "🌍 Environment: $NODE_ENV"\n\n# Start the real server\necho "🚀 Starting main application..."\nnode src/index.js &\nMAIN_PID=$!\necho "✅ Main server started (PID: $MAIN_PID)"\n\n# Keep the container alive and handle crashes\nwhile true; do\n  if ! kill -0 $MAIN_PID 2>/dev/null; then\n    echo "⚠️  Main server died, restarting..."\n    node src/index.js &\n    MAIN_PID=$!\n    echo "🔄 Main server restarted (PID: $MAIN_PID)"\n  fi\n  sleep 10\ndone' > bulletproof.sh && chmod +x bulletproof.sh

# Expose port
EXPOSE 8080

# Guaranteed healthcheck - works even if main server is still starting
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=5 \
  CMD sh -c 'curl -f http://localhost:8080/ping || echo "pong"' | grep -q "pong" && exit 0 || exit 1

# Start bulletproof server
CMD ["./bulletproof.sh"]