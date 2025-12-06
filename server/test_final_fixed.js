import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from production file
dotenv.config({ path: '.env.production' });

async function testWithProperAuth() {
  try {
    console.log('🔑 Logging in with admin credentials...');
    
    const loginResponse = await fetch('http://localhost:8080/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: process.env.ADMIN_DEFAULT_EMAIL,
        password: process.env.ADMIN_DEFAULT_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      const errorText = await loginResponse.text();
      console.log('Error response:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('✅ Login successful!');
    console.log('🔐 Got JWT token');
    
    const timestamp = Date.now();
    
    console.log('🧪 Testing /api/admin/services/create-with-translation with valid token');
    
    const response = await fetch('http://localhost:8080/api/admin/services/create-with-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        name: `Test Service Final ${timestamp}`,
        description: 'Test service with prices - final test',
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
      const serviceId = data.data?.serviceId;
      console.log('Service ID:', serviceId);
      
      // Now let's check if prices were synced
      console.log('⏳ Waiting 3 seconds for price sync...');
      setTimeout(async () => {
        await checkPricesInGoogleSheets(serviceId);
      }, 3000);
    } else {
      console.log('❌ Service creation failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
  }
}

async function checkPricesInGoogleSheets(serviceId) {
  if (!serviceId) {
    console.log('❌ No service ID to check');
    return;
  }
  
  try {
    console.log(`🔍 Checking prices for service ${serviceId} in Google Sheets...`);
    
    // Run the check script directly
    const { spawn } = await import('child_process');
    
    const child = spawn('node', ['check_service_prices_direct.js', serviceId], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      console.log(`✅ Price check completed with exit code ${code}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking prices:', error);
  }
}

testWithProperAuth();