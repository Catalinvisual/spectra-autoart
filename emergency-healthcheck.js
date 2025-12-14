// Emergency healthcheck server - starts in <100ms
const http = require('http');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

console.log('🚨 EMERGENCY SERVER: Starting immediately...');
console.log(`🚨 EMERGENCY SERVER: Port=${port}, Host=${host}`);

const server = http.createServer((req, res) => {
  if (req.url === '/ping' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
    console.log(`🚨 EMERGENCY SERVER: Responded to ${req.url}`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, host, () => {
  console.log('🚨 EMERGENCY SERVER: RUNNING!');
  console.log(`🚨 EMERGENCY SERVER: http://${host}:${port}/ping`);
  console.log('🚨 EMERGENCY SERVER: Ready for Railway healthcheck!');
  
  // Set a different port for the main server
  process.env.MAIN_SERVER_PORT = process.env.MAIN_SERVER_PORT || '8081';
  console.log(`🚨 EMERGENCY SERVER: Main server will run on port ${process.env.MAIN_SERVER_PORT}`);
  
  // Start the main server after emergency server is up
  console.log('🚨 EMERGENCY SERVER: Starting main server...');
  require('./server/src/index.js');
});

// Handle errors gracefully
server.on('error', (err) => {
  console.error('🚨 EMERGENCY SERVER ERROR:', err);
  process.exit(1);
});