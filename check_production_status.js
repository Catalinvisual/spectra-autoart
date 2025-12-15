import axios from 'axios';

const BASE_URL = 'https://spectraautoart.nl/api';

async function checkProductionStatus() {
  console.log('🔍 Checking production server status...\n');
  
  try {
    // Test login to get a valid token
    console.log('📡 Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    }, {
      timeout: 10000,
      validateStatus: function (status) {
        return status >= 200 && status < 600;
      }
    });
    
    console.log(`Login Status: ${loginResponse.status}`);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful!');
      const token = loginResponse.data.token;
      
      // Test a simple endpoint to see current server state
      console.log('\n📡 Testing server health...');
      const healthResponse = await axios.get(`${BASE_URL}/health`, {
        timeout: 5000,
        validateStatus: function (status) {
          return status >= 200 && status < 600;
        }
      });
      
      console.log(`Health Check Status: ${healthResponse.status}`);
      
      // Test admin endpoints
      const endpoints = ['/admin/dashboard', '/admin/bookings', '/admin/body-types'];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`\n📡 Testing ${endpoint}...`);
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
          
          if (response.status === 503) {
            console.log(`   Demo mode: ${response.data.demoMode}`);
            console.log(`   Error: ${response.data.error}`);
            if (response.data.demoMode === true) {
              console.log('   ✅ Demo mode working correctly!');
            } else {
              console.log('   ❌ Still showing demoMode: false - fix not deployed');
            }
          } else if (response.status === 500) {
            console.log('   ❌ Still getting 500 error');
            console.log(`   Response: ${JSON.stringify(response.data)}`);
          } else if (response.status === 200) {
            console.log('   ✅ Endpoint working!');
          } else {
            console.log(`   ⚠️  Unexpected status: ${response.status}`);
          }
          
        } catch (error) {
          console.log(`   ❌ Request error: ${error.message}`);
        }
      }
      
    } else {
      console.log('❌ Login failed');
      console.log('Response:', loginResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Error checking production status:', error.message);
  }
}

checkProductionStatus();