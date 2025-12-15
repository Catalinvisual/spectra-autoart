#!/usr/bin/env node

// Railway Production Start Script
// Acest script pornește serverul direct fără healthcheck complex

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚂 Railway Production Startup Script');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('📍 Current directory:', process.cwd());
console.log('🔧 NODE_ENV:', process.env.NODE_ENV || 'production');
console.log('🔧 PORT:', process.env.PORT || '8080');

// Set Railway environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.RAILWAY_PROJECT_ID = process.env.RAILWAY_PROJECT_ID || 'railway-production';

// Start the Express server directly
console.log('🚀 Starting Express server directly...');

const serverPath = join(__dirname, 'server', 'src', 'index.js');
console.log('📂 Server path:', serverPath);

const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit', // Show all output directly
  env: process.env
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`📊 Server process exited with code ${code}`);
  if (code !== 0) {
    console.error('❌ Server crashed, restarting in 5 seconds...');
    setTimeout(() => {
      console.log('🔄 Restarting server...');
      // Restart logic could be added here if needed
    }, 5000);
  }
});

// Health check function
function healthCheck() {
  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 8080,
    path: '/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Health check passed');
    } else {
      console.log(`⚠️ Health check failed with status: ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    console.log(`❌ Health check failed: ${err.message}`);
  });

  req.on('timeout', () => {
    console.log('❌ Health check timeout');
    req.destroy();
  });

  req.end();
}

// Start health checks after 30 seconds
setTimeout(() => {
  console.log('🔍 Starting health checks...');
  healthCheck();
  // Continue health checks every 30 seconds
  setInterval(healthCheck, 30000);
}, 30000);

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  if (serverProcess) {
    serverProcess.kill('SIGINT');
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('✅ Railway startup script initialized');
console.log('⏳ Waiting for server to start...');