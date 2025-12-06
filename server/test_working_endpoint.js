import fetch from 'node-fetch';

// Test the working endpoint that handles prices
async function testWorkingEndpoint() {
  try {
    console.log('🧪 Testing the working /vehicle-services endpoint...');
    
    // Create a test service with prices using the working endpoint
    const serviceData = {
      name: 'Test Service with Prices - Working Endpoint',
      description: 'Testing price sync with working endpoint',
      category: 'general',
      duration_minutes: 60,
      is_active: true,
      prices: [
        {
          body_type_key: 'sedan',
          price_min: 100,
          currency: 'EUR',
          duration_minutes: 60,
          promo_percent: 0,
          is_active: true
        },
        {
          body_type_key: 'suv',
          price_min: 150,
          currency: 'EUR',
          duration_minutes: 90,
          promo_percent: 0,
          is_active: true
        }
      ]
    };

    console.log('📤 Sending service data with prices:', JSON.stringify(serviceData, null, 2));
    
    // This would normally be a POST to /vehicle-services endpoint
    // But since we're testing locally, let's simulate what should happen
    console.log('✅ This endpoint should:');
    console.log('  1. Create the service in Vehicle_Services sheet');
    console.log('  2. Add prices to Vehicle_Service_Prices sheet');
    console.log('  3. Each price should have: ID, Service_ID, Body_Type_Key, Price_Min, Currency, Duration_Minutes, Is_Active');
    
    console.log('\n🔍 The issue is:');
    console.log('  - Client uses /create-with-translation endpoint');
    console.log('  - This endpoint does NOT handle prices');
    console.log('  - It only creates the service but skips price addition');
    
    console.log('\n✅ Solution needed:');
    console.log('  - Modify /create-with-translation endpoint to accept and process prices');
    console.log('  - Add the same price handling logic that /vehicle-services uses');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWorkingEndpoint();