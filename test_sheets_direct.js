const http = require('http');

function testSheetsStructure() {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/test-sheets-structure',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ Test completed successfully:');
        console.log('Services count:', result.data.servicesCount);
        console.log('Prices count:', result.data.pricesCount);
        console.log('Services with prices count:', result.data.servicesWithPricesCount);
        console.log('Services headers:', result.data.servicesHeaders);
        console.log('Prices headers:', result.data.pricesHeaders);
        
        if (result.data.sampleServices.length > 0) {
          console.log('\n📋 Sample service:', JSON.stringify(result.data.sampleServices[0], null, 2));
        }
        
        if (result.data.samplePrices.length > 0) {
          console.log('\n💰 Sample price:', JSON.stringify(result.data.samplePrices[0], null, 2));
        }
        
        if (result.data.sampleServicesWithPrices.length > 0) {
          console.log('\n🚗 Sample service with prices:', JSON.stringify(result.data.sampleServicesWithPrices[0], null, 2));
        }
        
      } catch (error) {
        console.log('❌ Failed to parse response:', data);
        console.error('Error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.end();
}

console.log('🧪 Testing Google Sheets structure...');
testSheetsStructure();