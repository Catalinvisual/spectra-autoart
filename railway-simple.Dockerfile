# Simple Railway Dockerfile for emergency startup
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy server package files first
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server code
COPY server/ ./

# Expose port
EXPOSE 8080

# Create a simple healthcheck server first
RUN echo 'const express = require("express"); const app = express(); app.get("/ping", (req, res) => res.send("pong")); app.listen(8080, () => console.log("Emergency server on 8080"));' > emergency.js

# Start with the main server, but have emergency backup
CMD ["sh", "-c", "node src/index.js || node emergency.js"]