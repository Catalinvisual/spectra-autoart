#!/usr/bin/env node

/**
 * Healthcheck test script for Railway deployment
 * Tests the /ping endpoint to ensure it's working
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 8080,
  path: '/ping',
  method: 'GET',
  timeout: 5000
};

console.log('🏥 Testing healthcheck endpoint...');
console.log(`🎯 Target: http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📄 Response Body: ${data}`);
    
    if (res.statusCode === 200 && data === 'pong') {
      console.log('✅ Healthcheck PASSED!');
      process.exit(0);
    } else {
      console.log('❌ Healthcheck FAILED!');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
  process.exit(1);
});

req.end();