#!/usr/bin/env node

// EMERGENCY HEALTHCHECK SERVER - RAILWAY COMPATIBLE
// This file is required by railway.toml and railway.json configuration
// It provides the /ping endpoint that Railway healthcheck expects

const http = require('http');
const port = process.env.PORT || 8080;
const host = '0.0.0.0';

console.log('🚨 RAILWAY EMERGENCY HEALTHCHECK SERVER');
console.log('🚨 Starting at:', new Date().toISOString());
console.log('🚨 PID:', process.pid);
console.log('🚨 Port:', port);
console.log('🚨 Host:', host);

// Create ultra-minimal HTTP server for Railway healthcheck
const server = http.createServer((req, res) => {
  const url = req.url;
  
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
      railway: true,
      pid: process.pid
    }));
    return;
  }
  
  // Return 404 for unknown paths
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Start server immediately
server.listen(port, host, () => {
  console.log('🚨 SUCCESS! Railway healthcheck server is running!');
  console.log(`🚨 Server listening on http://${host}:${port}`);
  console.log(`🚨 Healthcheck available at: http://${host}:${port}/ping`);
  console.log(`🚨 Health endpoint: http://${host}:${port}/health`);
});

// Handle errors gracefully
server.on('error', (err) => {
  console.error('🚨 SERVER ERROR:', err.message);
  console.error('🚨 Error code:', err.code);
  if (err.code === 'EADDRINUSE') {
    console.error(`🚨 Port ${port} is already in use!`);
  }
  // Keep process alive for Railway
  process.exit(1);
});

// Handle process crashes
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', err.message);
  console.error('🚨 Stack:', err.stack);
  // Keep process alive for Railway
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION:', reason);
  // Keep process alive for Railway
});