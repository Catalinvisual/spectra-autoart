const http = require('http');

// Test exact bulletproof healthcheck server
const port = process.env.PORT || 8080;

console.log("🚨 BULLETPROOF HEALTHCHECK SERVER: Starting on port", port);

const server = http.createServer((req, res) => {
  console.log(`🏥 BULLETPROOF HEALTHCHECK: ${req.method} ${req.url}`);
  
  if (req.url === "/ping" && (req.method === "GET" || req.method === "HEAD")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    if (req.method === "GET") res.write("pong");
    res.end();
    console.log("✅ BULLETPROOF HEALTHCHECK: /ping responded successfully");
    return;
  }
  
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "spectra-autoart"
    }));
    res.end();
    console.log("✅ BULLETPROOF HEALTHCHECK: /health responded successfully");
    return;
  }
  
  res.writeHead(404);
  res.end();
  console.log("❌ BULLETPROOF HEALTHCHECK: 404 for", req.url);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`🎯 BULLETPROOF HEALTHCHECK SERVER READY on 0.0.0.0:${port}`);
  console.log(`🎯 Listening on ALL interfaces (0.0.0.0:${port})`);
  console.log(`🎯 Environment PORT: ${process.env.PORT}`);
  console.log(`🎯 Time: ${new Date().toISOString()}`);
  
  // Test ourselves immediately
  setTimeout(() => {
    console.log("🧪 Testing local healthcheck...");
    http.get(`http://localhost:${port}/ping`, (res) => {
      console.log(`🧪 Local test result: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log("🎉 BULLETPROOF HEALTHCHECK VERIFIED!");
      }
    }).on('error', (err) => {
      console.error('🧪 Local test failed:', err.message);
    });
  }, 100);
});

server.on('error', (err) => {
  console.error('❌ BULLETPROOF HEALTHCHECK SERVER ERROR:', err);
  process.exit(1);
});