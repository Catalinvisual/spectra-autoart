const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/admin/test-sheets-structure',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Current state:');
      console.log('Services count:', response.data.servicesCount);
      console.log('Prices count:', response.data.pricesCount);
      console.log('Services with prices count:', response.data.servicesWithPricesCount);
      
      if (response.data.debugInfo) {
        console.log('\nDebug info:');
        console.log(response.data.debugInfo);
      }
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();