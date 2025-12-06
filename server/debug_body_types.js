import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function debugBodyTypes() {
  console.log('🔍 Debugging body types and price structure...\n');
  
  try {
    // First, get a valid admin token
    console.log('🔑 Getting admin token...');
    const loginResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token received successfully');
    
    // Get the latest service to debug
    console.log('\n📋 Fetching latest service...');
    const response = await axios.get(`${API_URL}/admin/vehicle-services`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const latestService = response.data[response.data.length - 1];
    if (latestService) {
      console.log(`✅ Found service: ${latestService.name}`);
      console.log(`📊 Service ID: ${latestService.id}`);
      console.log(`📊 Total prices: ${latestService.prices.length}`);
      
      console.log('\n🔍 First few prices structure:');
      latestService.prices.slice(0, 5).forEach((price, index) => {
        console.log(`  Price ${index + 1}:`);
        console.log(`    ID: ${price.id}`);
        console.log(`    Service ID: ${price.service_id}`);
        console.log(`    Body Type Key: ${price.body_type_key}`);
        console.log(`    Body Type ID: ${price.body_type_id}`);
        console.log(`    Price Min: ${price.price_min}`);
        console.log(`    Duration: ${price.duration_minutes}`);
        console.log(`    ---`);
      });
      
      // Check what body type keys are available
      console.log('\n📋 All body type keys in this service:');
      const bodyTypeKeys = [...new Set(latestService.prices.map(p => p.body_type_key))];
      console.log('Available keys:', bodyTypeKeys);
      
      // Check if our expected keys exist
      const expectedKeys = ['sedan', 'suv', 'hatchback', 'berlina', 'break', 'coupe', 'cabrio', 'van'];
      console.log('\n🔍 Checking expected vs actual keys:');
      expectedKeys.forEach(key => {
        const exists = bodyTypeKeys.includes(key);
        console.log(`  ${key}: ${exists ? '✅ Found' : '❌ Missing'}`);
      });
      
    } else {
      console.log('❌ No services found');
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

debugBodyTypes();