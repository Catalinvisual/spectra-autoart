// Script to troubleshoot Railway deployment issues
import axios from 'axios';

const BASE_URL = 'https://spectraautoart.nl/api';

async function troubleshootDeployment() {
  console.log('🔍 Troubleshooting Railway deployment issues...\n');
  
  // Test basic connectivity
  console.log('1️⃣ Testing basic connectivity...');
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`, { timeout: 10000 });
    console.log('✅ Health endpoint responded:', healthResponse.status);
  } catch (error) {
    console.log('❌ Health endpoint failed:', error.response?.status || 'TIMEOUT');
    if (error.response?.status === 502) {
      console.log('💡 502 Bad Gateway suggests Railway deployment issue or app startup failure');
    }
  }
  
  // Test main website
  console.log('\n2️⃣ Testing main website...');
  try {
    const mainResponse = await axios.get('https://spectraautoart.nl', { timeout: 10000 });
    console.log('✅ Main website responded:', mainResponse.status);
  } catch (error) {
    console.log('❌ Main website failed:', error.response?.status || 'TIMEOUT');
  }
  
  // Test admin login (if server is up)
  console.log('\n3️⃣ Testing admin authentication...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    }, { timeout: 10000 });
    console.log('✅ Admin login responded:', loginResponse.status);
    if (loginResponse.data.token) {
      console.log('✅ Got authentication token');
      
      // Test admin dashboard
      console.log('\n4️⃣ Testing admin dashboard...');
      try {
        const dashboardResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
          headers: { 'Authorization': `Bearer ${loginResponse.data.token}` },
          timeout: 10000
        });
        console.log('✅ Dashboard responded:', dashboardResponse.status);
        if (dashboardResponse.data.demoMode !== undefined) {
          console.log('📊 Demo mode status:', dashboardResponse.data.demoMode);
        }
      } catch (dashboardError) {
        console.log('❌ Dashboard failed:', dashboardError.response?.status, dashboardError.response?.data?.message);
      }
    }
  } catch (loginError) {
    console.log('❌ Admin login failed:', loginError.response?.status, loginError.response?.data?.message);
  }
  
  console.log('\n📋 Summary:');
  console.log('- If health endpoint returns 502: Railway deployment likely failed or app crashed');
  console.log('- If health endpoint works but admin endpoints return 503: Google Sheets Service issue');
  console.log('- If everything works but demoMode=false: Environment variables may be missing');
  console.log('- Check Railway dashboard for build/deployment logs');
}

troubleshootDeployment().catch(console.error);