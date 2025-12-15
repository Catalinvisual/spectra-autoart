import axios from 'axios';

const BASE_URL = 'https://spectraautoart.nl/api';

async function monitorDeployment() {
  console.log('🔍 Monitoring deployment status...\n');
  
  let attempts = 0;
  const maxAttempts = 20; // Monitor for about 10 minutes
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n🔄 Attempt ${attempts}/${maxAttempts} - ${new Date().toLocaleTimeString()}`);
    
    try {
      // Test login to get a valid token
      const loginResponse = await axios.post(`${BASE_URL}/admin/auth/login`, {
        email: 'admin@spectra.com',
        password: 'admin123'
      }, {
        timeout: 10000,
        validateStatus: function (status) {
          return status >= 200 && status < 600;
        }
      });
      
      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;
        
        // Test dashboard endpoint
        const dashboardResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000,
          validateStatus: function (status) {
            return status >= 200 && status < 600;
          }
        });
        
        console.log(`   Dashboard Status: ${dashboardResponse.status}`);
        
        if (dashboardResponse.status === 503) {
          console.log(`   Demo mode: ${dashboardResponse.data.demoMode}`);
          if (dashboardResponse.data.demoMode === true) {
            console.log('   ✅ SUCCESS: Demo mode is working correctly!');
            console.log('   🎉 The fix has been deployed successfully!');
            return;
          } else {
            console.log('   ⏳ Still showing demoMode: false - waiting for deployment...');
          }
        } else if (dashboardResponse.status === 500) {
          console.log('   ❌ Still getting 500 error - deployment may have failed');
        } else if (dashboardResponse.status === 200) {
          console.log('   ✅ SUCCESS: Endpoint is working!');
          return;
        }
        
      } else {
        console.log('   ❌ Login failed - server may be restarting');
      }
      
    } catch (error) {
      console.log(`   ❌ Request error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('   🔄 Server may be restarting...');
      }
    }
    
    // Wait 30 seconds before next attempt
    console.log(`   ⏳ Waiting 30 seconds before next check...`);
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
  
  console.log('\n⏰ Monitoring completed after maximum attempts.');
  console.log('📝 If the issue persists, the deployment may need manual intervention.');
}

monitorDeployment().catch(console.error);