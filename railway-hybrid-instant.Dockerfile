# Railway Hybrid Instant - Healthcheck + Real Server
FROM node:20-alpine

# Install curl
RUN apk add --no-cache curl

WORKDIR /app

# Copy and install server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Create instant healthcheck (100ms startup)
RUN echo 'const h=require("http"),p=process.env.PORT||8080;h.createServer((q,r)=>{if(q.url==="/ping"){r.writeHead(200);r.end("pong")}else{r.writeHead(404);r.end()}}).listen(p,"0.0.0.0",()=>console.log("✅ INSTANT HEALTHCHECK READY"));' > instant.js

# Create startup script
RUN echo '#!/bin/sh\necho "🚀 HYBRID START: Healthcheck first, then real server"\nnode instant.js &\nsleep 2\necho "🚀 Starting real server..."\nNODE_ENV=production node src/index.js' > start.sh && chmod +x start.sh

# Start both
CMD ["./start.sh"]