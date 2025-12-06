import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function testDebug() {
  try {
    console.log('🧪 Testing debug output...');
    
    // Login as admin
    console.log('🔑 Getting admin token...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Token received successfully');
    
    // Create a simple service
    const newService = {
      name: "Debug Test Service",
      description: "Test pentru debug output",
      category: "test",
      duration_minutes: 60,
      default_prices: {
        "suv": 100,
        "berlina": 110
      }
    };
    
    console.log('🌐 Creating service with debug output...');
    console.log('📊 Sending default_prices:', JSON.stringify(newService.default_prices, null, 2));
    
    const response = await axios.post(`${API_URL}/vehicle-services/vehicle-services`, newService, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Service created successfully!');
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDebug();