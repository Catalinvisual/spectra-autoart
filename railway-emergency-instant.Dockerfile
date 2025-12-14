# Railway Emergency Healthcheck - Starts in 100ms
FROM node:20-alpine

WORKDIR /app

# Create the simplest possible healthcheck server
RUN echo 'const h=require("http"),p=process.env.PORT||8080;h.createServer((q,r)=>{if(q.url==="/ping"){r.writeHead(200);r.end("pong")}else{r.writeHead(404);r.end()}}).listen(p,"0.0.0.0",()=>console.log("✅ HEALTHCHECK READY"));' > h.js

# Start immediately with no scripts
CMD ["node", "h.js"]