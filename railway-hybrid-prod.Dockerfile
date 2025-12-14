FROM node:20-alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --omit=dev && \
    npm --prefix server ci --omit=dev && \
    npm --prefix client ci --omit=dev

# Copy source code
COPY . .

# Build client
RUN npm --prefix client ci --include=dev && \
    npm --prefix client run build

# Expose port
EXPOSE 8080

# Set working directory to root (where h.js is located)
WORKDIR /app

# Start the healthcheck server which will then start Express
CMD ["node", "h.js"]