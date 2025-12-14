#!/usr/bin/env node

// EMERGENCY SERVER - STARTS IMMEDIATELY FOR RAILWAY HEALTHCHECK
// This is a minimal server that starts in <100ms to respond to healthchecks

const http = require('http');
const port = process.env.PORT || 8080;
const host = '0.0.0.0';

console.log('🚨 EMERGENCY SERVER: Starting immediately...');
console.log('🚨 Time:', new Date().toISOString());
console.log('🚨 PID:', process.pid);
console.log('🚨 Port:', port);
console.log('🚨 Host:', host);
console.log('🚨 CWD:', process.cwd());
console.log('🚨 Node version:', process.version);
console.log('🚨 Platform:', process.platform);
console.log('🚨 RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);

// Create ultra-minimal HTTP server
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  console.log(`🚨 EMERGENCY: ${method} ${url}`);
  
  if (url === '/ping' || url === '/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    const response = {
      status: 'ok',
      endpoint: url,
      timestamp: new Date().toISOString(),
      pid: process.pid,
      emergency: true
    };
    
    if (url === '/ping') {
      response.pong = true;
    }
    
    res.end(JSON.stringify(response));
    return;
  }
  
  // Default response for other paths
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Emergency server running - Railway healthcheck should pass');
});

server.listen(port, host, () => {
  console.log('🚨 EMERGENCY SERVER: SUCCESSFULLY STARTED!');
  console.log(`🚨 Listening on http://${host}:${port}`);
  console.log(`🚨 Healthcheck: http://${host}:${port}/ping`);
  console.log(`🚨 Health: http://${host}:${port}/health`);
  
  // Self-test immediately
  setTimeout(() => {
    console.log('🚨 SELF-TEST: Testing endpoints...');
    
    // Test /ping
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/ping',
      method: 'GET',
      timeout: 2000
    };
    
    const req = http.request(options, (res) => {
      console.log(`🚨 SELF-TEST /ping: ${res.statusCode}`);
      res.on('data', () => {});
    });
    
    req.on('error', (err) => {
      console.log(`🚨 SELF-TEST FAILED:`, err.message);
    });
    
    req.on('timeout', () => {
      console.log(`🚨 SELF-TEST TIMEOUT`);
      req.destroy();
    });
    
    req.end();
  }, 100);
});

server.on('error', (err) => {
  console.error('🚨 EMERGENCY SERVER ERROR:', err.message);
  console.error('🚨 Code:', err.code);
  if (err.code === 'EADDRINUSE') {
    console.error(`🚨 Port ${port} is already in use`);
  }
  process.exit(1);
});

// Keep server alive and handle crashes
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', err.message);
  console.error('🚨 Stack:', err.stack);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION:', reason);
  // Don't exit - keep server running
});

console.log('🚨 EMERGENCY SERVER: Script loaded, about to start server...');