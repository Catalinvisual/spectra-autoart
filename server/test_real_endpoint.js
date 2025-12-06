import fetch from 'node-fetch';

// Generate a test token (you'll need to replace this with a real admin token)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAzMTU3MywiZXhwIjoxNzY1MTE3OTczfQ.65HqDUQtZWomhwbcrb0rIyYexB1whYcF5oBg9zVmicM';

async function testRealEndpoint() {
  try {
    console.log('🧪 Testing the REAL /create-with-translation endpoint with prices...');
    
    // Create a test service with prices
    const serviceData = {
      name: 'Test Service Real - Fixed Endpoint',
      description: 'Testing real price sync with fixed endpoint',
      category: 'general',
      duration_minutes: 60,
      is_active: true,
      prices: {
        sedan: {
          price_min: 130,
          price_max: 190,
          currency: 'EUR',
          duration_minutes: 60,
          promo_percent: 0,
          is_active: true
        },
        suv: {
          price_min: 160,
          price_max: 230,
          currency: 'EUR',
          duration_minutes: 90,
          promo_percent: 0,
          is_active: true
        },
        hatchback: {
          price_min: 110,
          price_max: 160,
          currency: 'EUR',
          duration_minutes: 60,
          promo_percent: 0,
          is_active: true
        },
        coupe: {
          price_min: 140,
          price_max: 200,
          currency: 'EUR',
          duration_minutes: 75,
          promo_percent: 0,
          is_active: true
        }
      }
    };

    console.log('📤 Making API call to create service with prices...');
    
    // Make actual API call to the server
    const response = await fetch('http://localhost:8080/api/admin/services/create-with-translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: JSON.stringify(serviceData)
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Service created successfully!');
      console.log('🆔 Service ID:', result.data.serviceId);
      console.log('💰 Prices should be saved to Google Sheets');
      
      // Wait a moment for Google Sheets sync
      console.log('⏳ Waiting 3 seconds for Google Sheets sync...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if prices were saved
      console.log('🔍 Checking Google Sheets for prices...');
      await checkPricesInSheets(result.data.serviceId);
      
    } else {
      console.log('❌ Service creation failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    console.log('💡 Make sure the server is running on port 8080');
    console.log('💡 You may need to generate a real admin token');
  }
}

async function checkPricesInSheets(serviceId) {
  try {
    // Import GoogleSheetsService to check the data
    const { GoogleSheetsService } = await import('./src/services/googleSheetsService.js');
    
    await GoogleSheetsService.initialize();
    
    // Check Vehicle_Service_Prices for this service
    const prices = await GoogleSheetsService.getData('Vehicle_Service_Prices');
    const servicePrices = prices.filter(row => row[1] === serviceId.toString());
    
    console.log(`📊 Found ${servicePrices.length} prices for service ${serviceId}:`);
    if (servicePrices.length > 0) {
      servicePrices.forEach((price, index) => {
        console.log(`  ${index + 1}. ${price[2]}: ${price[3]} ${price[4]} (${price[5]} min)`);
      });
      console.log('✅ Prices successfully saved to Google Sheets!');
    } else {
      console.log('❌ No prices found in Google Sheets for this service');
    }
    
  } catch (error) {
    console.error('❌ Failed to check Google Sheets:', error.message);
  }
}

// Run the test
testRealEndpoint();