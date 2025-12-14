#!/usr/bin/env node

// RAILWAY STARTUP - EMERGENCY + MAIN SERVER
// This starts the emergency server immediately, then the main server

const { spawn } = require('child_process');
const http = require('http');

console.log('🚨 RAILWAY STARTUP: Starting dual server setup...');
console.log('🚨 Time:', new Date().toISOString());
console.log('🚨 PORT:', process.env.PORT || 8080);
console.log('🚨 NODE_ENV:', process.env.NODE_ENV);
console.log('🚨 RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);

// Start emergency server immediately
console.log('🚨 Starting emergency server...');
const emergencyServer = require('./emergency-server.js');

// Wait a bit for emergency server to start
setTimeout(() => {
  console.log('🚀 Starting main server...');
  
  // Change to server directory
  process.chdir('/app/server');
  console.log('🚀 Changed directory to:', process.cwd());
  
  // Start main server
  const mainServer = spawn('node', ['src/index.js'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  mainServer.on('error', (err) => {
    console.error('🚀 MAIN SERVER ERROR:', err.message);
  });
  
  mainServer.on('exit', (code, signal) => {
    console.log(`🚀 MAIN SERVER EXITED: code=${code}, signal=${signal}`);
    console.log('🚨 Emergency server will continue running...');
  });
  
  console.log('🚀 Main server spawned with PID:', mainServer.pid);
  
}, 2000);

console.log('🚨 Startup script completed - both servers should be running...');

// Keep this process alive
process.on('SIGTERM', () => {
  console.log('🚨 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🚨 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});