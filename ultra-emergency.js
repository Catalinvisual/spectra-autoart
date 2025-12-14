#!/usr/bin/env node

// ULTRA-MINIMAL EMERGENCY HEALTHCHECK SERVER
// This server starts in <50ms and responds to healthchecks immediately
// It's designed to work even if the main server fails completely

const http = require('http');
const port = process.env.PORT || 8080;
const host = '0.0.0.0';

console.log('🚨 EMERGENCY SERVER v2.0 - ULTRA FAST STARTUP');
console.log('🚨 Starting at:', new Date().toISOString());
console.log('🚨 PID:', process.pid);
console.log('🚨 Port:', port);
console.log('🚨 Host:', host);
console.log('🚨 CWD:', process.cwd());

// Create the most basic HTTP server possible
const server = http.createServer((req, res) => {
  const url = req.url;
  
  // Log every request for debugging
  console.log(`🚨 ${req.method} ${url} from ${req.socket.remoteAddress}`);
  
  if (url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
    return;
  }
  
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      emergency: true,
      pid: process.pid
    }));
    return;
  }
  
  // For any other path, return 200 OK
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Emergency server running');
});

// Start server with minimal delay
server.listen(port, host, () => {
  console.log('🚨 SUCCESS! Emergency server is running!');
  console.log(`🚨 Server listening on http://${host}:${port}`);
  console.log(`🚨 Healthcheck available at: http://${host}:${port}/ping`);
  console.log(`🚨 Health endpoint: http://${host}:${port}/health`);
  
  // Immediately test our own endpoints
  setTimeout(() => {
    console.log('🚨 SELF-TEST: Testing our own endpoints...');
    
    // Test /ping
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/ping',
      method: 'GET',
      timeout: 1000
    };
    
    const req = http.request(options, (res) => {
      console.log(`🚨 SELF-TEST /ping: ${res.statusCode} ${res.statusMessage}`);
      res.on('data', (chunk) => {
        console.log(`🚨 SELF-TEST response: ${chunk.toString()}`);
      });
    });
    
    req.on('error', (err) => {
      console.log(`🚨 SELF-TEST FAILED:`, err.message);
    });
    
    req.on('timeout', () => {
      console.log(`🚨 SELF-TEST TIMEOUT`);
      req.destroy();
    });
    
    req.end();
  }, 50); // Test after 50ms
});

// Handle errors without crashing
server.on('error', (err) => {
  console.error('🚨 SERVER ERROR:', err.message);
  console.error('🚨 Error code:', err.code);
  if (err.code === 'EADDRINUSE') {
    console.error(`🚨 Port ${port} is already in use!`);
  }
  // Don't exit - try to keep running
});

// Handle process crashes
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', err.message);
  console.error('🚨 Stack:', err.stack);
  // Keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION:', reason);
  // Keep server running
});

// Log when process starts
console.log('🚨 Emergency server script loaded successfully');
console.log('🚨 About to start HTTP server...');