import fetch from 'node-fetch';

async function testCorrectEndpoint() {
  try {
    const timestamp = Date.now();
    
    console.log('🧪 Testing correct endpoint: /api/admin/services/create-with-translation');
    
    const response = await fetch('http://localhost:8080/api/admin/services/create-with-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ADMIN_JWT_TOKEN
      },
      body: JSON.stringify({
        name: `Test Service Correct ${timestamp}`,
        description: 'Test service from correct endpoint',
        category: 'testing',
        duration_minutes: 90,
        is_active: true,
        prices: {
          'sedan': { price_min: 95, price_max: 190, duration_minutes: 95 },
          'suv': { price_min: 105, price_max: 210, duration_minutes: 105 },
          'hatchback': { price_min: 85, price_max: 170, duration_minutes: 85 }
        }
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text);
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Service created successfully!');
      console.log('Service ID:', data.data?.serviceId);
      
      // Check if prices were synced
      console.log('⏳ Waiting 5 seconds for price sync...');
      setTimeout(async () => {
        console.log('🔍 Checking if prices were synced to Google Sheets...');
        // We'll check this in a moment
      }, 5000);
    }
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
  }
}

testCorrectEndpoint();