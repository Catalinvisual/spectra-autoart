const axios = require('axios');

async function debugGoogleSheetsDirectly() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    console.log('\n📋 Getting Google Sheets data directly from admin endpoint...');
    
    // Try to get the Google Sheets data directly from the admin endpoint
    try {
      const response = await axios.get('http://localhost:8080/api/admin/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Admin gallery response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('Admin gallery error:', error.message);
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugGoogleSheetsDirectly();