import axios from 'axios';
import jwt from 'jsonwebtoken';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

async function testOptimizedServiceCreation() {
  try {
    console.log('🚀 Testing optimized service creation...');
    
    // Generate test token
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign({ id: 1, email: 'admin@example.com', role: 'admin' }, secret, { expiresIn: '1h' });
    console.log('✅ Generated test token');

    // Test service data
    const serviceData = {
      name: 'Test Optimized Service ' + Date.now(),
      description: 'A test service to verify optimization improvements',
      category: 'exterior',
      duration_minutes: 60,
      is_active: true,
      prices: {
        sedan: { price_min: 75, price_max: 100, duration_minutes: 60 },
        suv: { price_min: 85, price_max: 110, duration_minutes: 70 },
        hatchback: { price_min: 65, price_max: 90, duration_minutes: 50 }
      }
    };

    console.log('📋 Service data:', JSON.stringify(serviceData, null, 2));

    const startTime = Date.now();
    
    // Make the request with increased timeout
    const response = await axios.post(
      `${API_BASE_URL}/admin/services/create-with-translation`,
      serviceData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('✅ Service creation completed!');
    console.log(`⏱️  Duration: ${duration}ms (${(duration/1000).toFixed(2)} seconds)`);
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.serviceId) {
      console.log(`🎯 Service created with ID: ${response.data.serviceId}`);
      console.log(`💰 Prices saved: ${response.data.pricesCount}`);
      
      // Verify the service was created in Google Sheets
      console.log('\n🔍 Verifying service in Google Sheets...');
      
      const { GoogleSheetsService } = await import('./src/services/googleSheetsService.js');
      await GoogleSheetsService.initialize();
      
      const services = await GoogleSheetsService.getServicesWithPrices();
      const newService = services.find(s => s.id === response.data.serviceId);
      
      if (newService) {
        console.log('✅ Service found in Google Sheets!');
        console.log(`📋 Service name: ${newService.name}`);
        console.log(`💰 Number of prices: ${newService.prices?.length || 0}`);
        
        if (newService.prices && newService.prices.length > 0) {
          console.log('💵 Prices:');
          newService.prices.forEach(price => {
            console.log(`  - ${price.body_type_key}: €${price.price_min}${price.price_max ? ` - €${price.price_max}` : ''}`);
          });
        }
      } else {
        console.log('❌ Service not found in Google Sheets');
      }
    }

    return {
      success: true,
      duration,
      serviceId: response.data.serviceId,
      pricesCount: response.data.pricesCount
    };

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
    }
    return {
      success: false,
      error: error.message,
      duration: error.duration || 0
    };
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧪 Starting optimized service creation test...\n');
  
  testOptimizedServiceCreation().then(result => {
    console.log('\n📊 Test Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`⏱️  Duration: ${result.duration}ms`);
    if (result.serviceId) {
      console.log(`🎯 Service ID: ${result.serviceId}`);
      console.log(`💰 Prices: ${result.pricesCount}`);
    }
    
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { testOptimizedServiceCreation };