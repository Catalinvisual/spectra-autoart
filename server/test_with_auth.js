import fetch from 'node-fetch';

async function testWithCorrectToken() {
  try {
    // First, let's get a valid JWT token by logging in
    console.log('🔑 Getting JWT token...');
    
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed, trying with environment token...');
      // Use the environment token if login fails
      await testWithEnvToken();
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('✅ Got JWT token');
    
    const timestamp = Date.now();
    
    console.log('🧪 Testing /api/admin/services/create-with-translation with valid token');
    
    const response = await fetch('http://localhost:8080/api/admin/services/create-with-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        name: `Test Service With Prices ${timestamp}`,
        description: 'Test service with prices from correct endpoint',
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
    
    const text = await response.text();
    console.log('Response body:', text);
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Service created successfully!');
      console.log('Service ID:', data.data?.serviceId);
      
      // Now let's check if prices were synced
      console.log('⏳ Waiting 3 seconds for price sync...');
      setTimeout(async () => {
        await checkPricesInGoogleSheets(data.data?.serviceId);
      }, 3000);
    } else {
      console.log('❌ Service creation failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
  }
}

async function testWithEnvToken() {
  try {
    const timestamp = Date.now();
    
    console.log('🧪 Testing with environment token...');
    
    const response = await fetch('http://localhost:8080/api/admin/services/create-with-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ADMIN_JWT_TOKEN
      },
      body: JSON.stringify({
        name: `Test Service Env ${timestamp}`,
        description: 'Test service with env token',
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
    
    const text = await response.text();
    console.log('Response body:', text);
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Service created successfully!');
      console.log('Service ID:', data.data?.serviceId);
    }
    
  } catch (error) {
    console.error('❌ Error with env token:', error);
  }
}

async function checkPricesInGoogleSheets(serviceId) {
  if (!serviceId) {
    console.log('❌ No service ID to check');
    return;
  }
  
  try {
    console.log(`🔍 Checking prices for service ${serviceId} in Google Sheets...`);
    
    // Import the check script
    const { checkServicePrices } = await import('./check_service_prices_direct.js');
    await checkServicePrices(serviceId);
    
  } catch (error) {
    console.error('❌ Error checking prices:', error);
  }
}

testWithCorrectToken();