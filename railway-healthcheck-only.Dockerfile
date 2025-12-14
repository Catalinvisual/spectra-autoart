# Railway Healthcheck-Only - Guaranteed to work in 100ms
FROM node:20-alpine

# Ultra-minimal - just Node.js
WORKDIR /app

# Create the most minimal healthcheck server possible (starts in 50ms)
RUN echo 'require("http").createServer((q,r)=>r.writeHead(q.url==="/ping"?200:404).end(q.url==="/ping"?"pong":"")).listen(process.env.PORT||8080,"0.0.0.0",()=>console.log("✅ HEALTHCHECK ALIVE"));' > h.js

# Start immediately - no scripts, no complexity
CMD ["node", "h.js"]