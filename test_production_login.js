import axios from 'axios';

// Production API base URL
const API_BASE = 'https://spectraautoart.nl/api';

// Correct admin credentials from .env
const ADMIN_EMAIL = 'admin@spectra.com';
const ADMIN_PASSWORD = 'admin123';

async function getProductionToken() {
  console.log('🔄 Getting production admin token...\n');
  
  try {
    // Test login with correct credentials
    console.log('1️⃣ Testing login with correct credentials...');
    const loginResponse = await axios.post(`${API_BASE}/admin/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log('📋 Token:', loginResponse.data.token);
      console.log('\n🔑 Use this token in Authorization header as:');
      console.log(`Bearer ${loginResponse.data.token}`);
      return loginResponse.data.token;
    } else {
      console.log('❌ Login failed:', loginResponse.data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error during login:', error.response?.data || error.message);
    return null;
  }
}

// Get the token and test it
getProductionToken().then(token => {
  if (token) {
    console.log('\n2️⃣ Testing the token with dashboard endpoint...');
    testDashboardWithToken(token);
  }
});

async function testDashboardWithToken(token) {
  try {
    const response = await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Dashboard access successful');
      console.log('📊 Dashboard data:', response.data);
    } else if (response.status === 503) {
      console.log('⚠️  Dashboard service unavailable (Google Sheets demo mode)');
      console.log('📋 Response:', response.data);
    } else {
      console.log('❌ Dashboard access failed:', response.status);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Dashboard unauthorized (401) - Token may be invalid');
    } else if (error.response?.status === 503) {
      console.log('⚠️  Dashboard service unavailable (Google Sheets demo mode)');
      console.log('📋 Response:', error.response.data);
    } else {
      console.log('❌ Dashboard error:', error.response?.status || error.message);
    }
  }
}