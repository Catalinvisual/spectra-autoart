import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/public/testimonials?lang=nl',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'TestScript/1.0'
  }
};

console.log('🧪 Testing testimonials endpoint...');
console.log(`📡 Request: GET ${options.path}`);

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('📋 Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response body:');
    console.log(data);
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ JSON parsed successfully:');
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('⚠️  Response is not JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.end();