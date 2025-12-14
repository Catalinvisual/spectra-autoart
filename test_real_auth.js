import axios from 'axios';

const BASE_URL = 'https://spectraautoart.nl/api';

async function testRealAuthentication() {
  console.log('🧪 Testing real authentication with valid credentials...\n');
  
  try {
    // Test login with real credentials from .env.local
    console.log('📡 Testing /admin/auth/login...');
    const loginResponse = await axios.post(`${BASE_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123' // This should be the password from ADMIN_DEFAULT_PASSWORD
    }, {
      timeout: 10000,
      validateStatus: function (status) {
        return status >= 200 && status < 600;
      }
    });
    
    console.log(`Login Status: ${loginResponse.status}`);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful!');
      console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
      
      const token = loginResponse.data.token;
      
      // Test admin endpoints with real token
      const endpoints = ['/admin/dashboard', '/admin/bookings', '/admin/body-types'];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`\n📡 Testing ${endpoint} with real token...`);
          const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000,
            validateStatus: function (status) {
              return status >= 200 && status < 600;
            }
          });
          
          console.log(`   Status: ${response.status}`);
          
          if (response.status === 200) {
            console.log('   ✅ Success - data loaded!');
            console.log(`   Data preview: ${JSON.stringify(response.data).substring(0, 100)}...`);
          } else if (response.status === 503) {
            console.log(`   Demo mode: ${response.data.demoMode}`);
            console.log(`   Error: ${response.data.error}`);
            if (response.data.demoMode === true) {
              console.log('   ✅ Demo mode working!');
            } else {
              console.log('   ❌ Demo mode issue');
            }
          } else if (response.status === 500) {
            console.log('   ❌ Internal Server Error');
            console.log(`   Response: ${JSON.stringify(response.data)}`);
          } else {
            console.log(`   ⚠️  Unexpected status: ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data)}`);
          }
          
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
      
    } else {
      console.log('❌ Login failed');
      console.log('Response:', loginResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    }
  }
}

testRealAuthentication();