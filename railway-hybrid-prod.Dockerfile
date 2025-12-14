# Railway Hybrid Production - Aplicație reală + healthcheck rapid
FROM node:20-alpine

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

# Creează healthcheck server separat pentru startup rapid
RUN echo 'require("http").createServer((q,r)=>{if(q.url==="/ping"){r.writeHead(200).end("pong")}else{r.writeHead(404).end()}}).listen(process.env.PORT||8080,"0.0.0.0",()=>console.log("✅ APP & HEALTHCHECK READY"));' > healthcheck.js

# Script de start hibrid - pornește aplicația reală
RUN echo '#!/bin/sh\n\
echo "🚀 Starting Spectra AutoArt production server..."\n\
cd /app/server && \n\
if [ -n "$PORT" ]; then\n\
  echo "📡 PORT set to: $PORT"\n\
else\n\
  echo "📡 PORT not set, defaulting to 8080"\n\
  export PORT=8080\n\
fi\n\
echo "🔧 Starting Node.js server..."\n\
node src/index.js &' > start-prod.sh && chmod +x start-prod.sh

# Pornește aplicația reală
CMD ["sh", "-c", "cd /app/server && npm start"]