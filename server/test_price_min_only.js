import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function testPriceMinOnly() {
  console.log('🧪 Testing service creation with only Min_Price (no Price_Max)...\n');
  
  try {
    // First, get a valid admin token
    console.log('🔑 Getting admin token...');
    const loginResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token received successfully');
    
    // Test service with simple numeric prices (only min_price)
    const newService = {
      name: "Test Service Only Min Price",
      description: "Acesta este un test pentru salvare doar cu Min_Price",
      category: "test",
      duration_minutes: 60,
      default_prices: {
        "sedan": 75.00,
        "suv": 85.00,
        "hatchback": 65.00,
        "berlina": 70.00,
        "break": 90.00,
        "coupe": 80.00,
        "cabrio": 95.00,
        "van": 100.00
      }
    };
    
    console.log('🌐 Creating service with only Min_Price values...');
    console.log('📊 Service data:', JSON.stringify(newService, null, 2));
    
    const response = await axios.post(`${API_URL}/vehicle-services/vehicle-services`, newService, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Service created successfully!');
    console.log('📋 Response data:', JSON.stringify(response.data, null, 2));
    
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
      
      // Check that prices only have min_price and no price_max
      const samplePrices = createdService.prices.slice(0, 3);
      console.log('\n📋 Sample prices (checking for Min_Price only):');
      samplePrices.forEach((price, index) => {
        console.log(`  Price ${index + 1}:`);
        console.log(`    Body Type: ${price.body_type_key}`);
        console.log(`    Price_Min: ${price.price_min}`);
        console.log(`    Has Price_Max: ${price.price_max !== undefined ? 'YES (❌ Problem!)' : 'NO (✅ Correct)'}`);
        console.log(`    Duration: ${price.duration_minutes} minutes`);
      });
      
      // Check if all prices are correctly structured
      const allCorrect = createdService.prices.every(price => 
        price.price_min !== undefined && 
        (price.price_max === undefined || price.price_max === null)
      );
      
      if (allCorrect) {
        console.log('\n✅ All prices are correctly saved with only Min_Price!');
      } else {
        console.log('\n❌ Some prices have Price_Max field - this needs to be fixed!');
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

testPriceMinOnly();