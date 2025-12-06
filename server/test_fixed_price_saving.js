import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function testFixedPriceSaving() {
  console.log('🧪 Testing fixed price saving with correct user prices...\n');
  
  try {
    // First, get a valid admin token
    console.log('🔑 Getting admin token...');
    const loginResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token received successfully');
    
    // Test service with specific prices
    const newService = {
      name: "Test Service Fixed Prices",
      description: "Test pentru salvare preturi corecte",
      category: "test",
      duration_minutes: 75,
      default_prices: {
        "sedan": 55.50,
        "suv": 65.75,
        "hatchback": 45.25,
        "berlina": 50.00,
        "break": 70.00,
        "coupe": 60.00,
        "cabrio": 75.50,
        "van": 80.00
      }
    };
    
    console.log('🌐 Creating service with specific prices...');
    console.log('📊 Expected prices:', JSON.stringify(newService.default_prices, null, 2));
    
    const response = await axios.post(`${API_URL}/vehicle-services/vehicle-services`, newService, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Service created successfully!');
    console.log('📋 Service ID:', response.data.data.service.id);
    
    // Wait a moment for the sync to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify the prices were saved correctly
    console.log('\n🔍 Verifying prices in database...');
    const verifyResponse = await axios.get(`${API_URL}/admin/vehicle-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const createdService = verifyResponse.data.find(s => s.name === newService.name);
    if (createdService) {
      console.log('✅ Service found in database!');
      console.log(`📊 Service ID: ${createdService.id}`);
      console.log(`📊 Total prices count: ${createdService.prices.length}`);
      
      // Check if prices match what we sent
      console.log('\n📋 Price verification:');
      let allCorrect = true;
      
      Object.entries(newService.default_prices).forEach(([bodyType, expectedPrice]) => {
        const actualPrice = createdService.prices.find(p => p.body_type_key === bodyType);
        if (actualPrice) {
          const isCorrect = actualPrice.price_min === expectedPrice;
          console.log(`  ${bodyType}: Expected €${expectedPrice}, Got €${actualPrice.price_min} ${isCorrect ? '✅' : '❌'}`);
          if (!isCorrect) allCorrect = false;
        } else {
          console.log(`  ${bodyType}: ❌ Price not found`);
          allCorrect = false;
        }
      });
      
      if (allCorrect) {
        console.log('\n🎉 SUCCESS: All prices saved correctly!');
      } else {
        console.log('\n❌ FAILURE: Some prices do not match expected values');
      }
      
    } else {
      console.log('❌ Service not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error details:');
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Data:', error.response.data);
    } else if (error.request) {
      console.error('- No response received:', error.message);
    } else {
      console.error('- Error message:', error.message);
    }
  }
}

testFixedPriceSaving();