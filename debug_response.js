const axios = require('axios');

async function debugResponse() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    console.log('\n📋 Getting admin gallery data...');
    const adminResponse = await axios.get('http://localhost:8080/api/admin/gallery', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Full admin response:');
    console.log('Status:', adminResponse.status);
    console.log('Headers:', adminResponse.headers);
    console.log('Data type:', typeof adminResponse.data);
    console.log('Data:', JSON.stringify(adminResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
  }
}

debugResponse();