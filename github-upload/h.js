// HEALTHCHECK SERVER - Railway deployment
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/ping' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`✅ Healthcheck server running on port ${PORT}`);
});

// Start Express server after healthcheck is running
setTimeout(() => {
  console.log('🚀 Starting Express server...');
  require('./server/src/index.js');
}, 2000);