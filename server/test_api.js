import axios from 'axios';

async function testVehicleServices() {
  try {
    console.log('🚀 Testing API endpoints...');
    
    // First, let's get the admin token
    console.log('📡 Attempting login on port 8080...');
    const loginResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Now test the vehicle services endpoint
    console.log('📡 Fetching vehicle services...');
    const servicesResponse = await axios.get('http://localhost:8080/api/admin/vehicle-services', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Vehicle services received:', servicesResponse.data.length, 'services');
    
    // Check specifically for the first service
    if (servicesResponse.data.length > 0) {
      const firstService = servicesResponse.data[0];
      console.log('\n🔍 First service details:');
      console.log('- ID:', firstService.id);
      console.log('- Name:', firstService.name);
      console.log('- IsActive:', firstService.isActive);
      console.log('- Prices count:', firstService.prices.length);
      if (firstService.prices.length > 0) {
        console.log('- First 3 prices:', firstService.prices.slice(0, 3));
      } else {
        console.log('- No prices found!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error details:');
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Data:', error.response.data);
      console.error('- Headers:', error.response.headers);
    } else if (error.request) {
      console.error('- No response received:', error.message);
    } else {
      console.error('- Error message:', error.message);
    }
  }
}

testVehicleServices();