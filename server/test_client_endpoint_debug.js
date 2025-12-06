import { config } from 'dotenv';
config({ path: '.env.production' });

async function testCreateServiceWithTranslation() {
  try {
    console.log('Testing endpoint...');
    
    const timestamp = Date.now();
    const response = await fetch('http://localhost:8080/api/admin/vehicle-services/create-with-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ADMIN_JWT_TOKEN
      },
      body: JSON.stringify({
        name: `Test Service Client ${timestamp}`,
        description: 'Test service from client',
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
      const result = JSON.parse(text);
      console.log('✅ Service created:', result);
      
      if (result.service && result.service.id) {
        console.log(`📝 Service ID: ${result.service.id}`);
        console.log(`💰 Prices created: ${result.prices ? result.prices.length : 0}`);
        
        // Check prices in Google Sheets
        console.log('\n🔍 Checking Google Sheets for the new service...');
        
        // Wait a moment for sync
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use our check script
        const { execSync } = await import('child_process');
        const output = execSync(`node check_service_prices_direct.js ${result.service.id}`, { encoding: 'utf8' });
        console.log(output);
      }
    } else {
      console.log('❌ Request failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCreateServiceWithTranslation();