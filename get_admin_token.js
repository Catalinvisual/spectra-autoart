const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';

async function getAdminToken() {
  try {
    console.log('🔄 Generating new admin token...');
    
    const response = await axios.post(`${API_BASE}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    if (response.data.success) {
      console.log('✅ Token generated successfully!');
      console.log('Token:', response.data.token);
      console.log('\n📝 Copy this token to your test script:');
      console.log(`const AUTH_TOKEN = '${response.data.token}';`);
    } else {
      console.log('❌ Login failed:', response.data.error);
    }
  } catch (error) {
    console.log('❌ Error generating token:', error.response?.data || error.message);
  }
}

getAdminToken();