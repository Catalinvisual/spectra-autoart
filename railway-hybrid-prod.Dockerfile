# Railway Hybrid Production - Aplicație reală + healthcheck rapid
FROM node:20-alpine

# Instalează curl pentru healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copiază fișierele esențiale pentru build și start
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Instalează dependențele root și server
RUN npm ci --omit=dev && \
    npm --prefix server ci --omit=dev

# Copiază restul codului
COPY . .

# Build clientul
RUN npm --prefix client ci --include=dev && \
    npm --prefix client run build

# Expune portul pentru Railway
EXPOSE 8080

# Healthcheck explicit pentru Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/ping || exit 1

# Start with full Express server
CMD cd server && npm start