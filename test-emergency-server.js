// Test emergency server locally
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/ping',
  method: 'GET',
  timeout: 5000
};

console.log('🏥 Testing emergency server healthcheck...');
console.log('🎯 Target: http://localhost:8080/ping');

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
      console.log('✅ Emergency server healthcheck PASSED!');
      process.exit(0);
    } else {
      console.log('❌ Emergency server healthcheck FAILED!');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request failed:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Request timed out');
  req.destroy();
  process.exit(1);
});

req.end();