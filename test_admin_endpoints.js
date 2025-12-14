import axios from 'axios';

const BASE_URL = 'https://spectraautoart.nl/api';

async function testAdminEndpoints() {
  console.log('🧪 Testing admin endpoints after demo mode fix...\n');
  
  const endpoints = [
    '/admin/dashboard',
    '/admin/bookings', 
    '/admin/body-types'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing ${endpoint}...`);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': 'Bearer demo-token', // This will fail auth but we want to see the 503 response
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 600; // Accept all status codes
        }
      });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.status === 503) {
        console.log(`   Demo mode: ${response.data.demoMode}`);
        console.log(`   Error: ${response.data.error}`);
        console.log(`   Message: ${response.data.message}`);
        
        if (response.data.demoMode === true) {
          console.log('   ✅ Demo mode working correctly!');
        } else if (response.data.demoMode === undefined) {
          console.log('   ❌ Demo mode is undefined - fix not working!');
        } else {
          console.log(`   ⚠️  Unexpected demo mode value: ${response.data.demoMode}`);
        }
      } else if (response.status === 401) {
        console.log('   ✅ Authentication working (401 expected for invalid token)');
      } else if (response.status === 404) {
        console.log('   ❌ Endpoint not found - server may still be starting');
      } else {
        console.log(`   ⚠️  Unexpected status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('   ❌ Connection refused - server may be down');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('   ⏰ Request timed out - server may be slow');
      } else if (error.response && error.response.status === 502) {
        console.log('   ❌ 502 Bad Gateway - server may be restarting');
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🏁 Test completed!');
  console.log('📝 Summary:');
  console.log('   - All endpoints should return 503 with demoMode: true');
  console.log('   - If demoMode is undefined, the fix needs more work');
  console.log('   - If you get 502 errors, wait a few minutes and try again');
}

// Run the test
testAdminEndpoints().catch(console.error);