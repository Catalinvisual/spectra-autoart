// Simple test script to check testimonials API
const axios = require('axios');

async function testTestimonialsAPI() {
  try {
    console.log('🧪 Testing testimonials API...');
    
    // Test Dutch language (should return original data)
    const responseNL = await axios.get('http://localhost:8081/api/testimonials?lang=nl');
    console.log('🇳🇱 Dutch response:', JSON.stringify(responseNL.data, null, 2));
    
    // Test English language (should trigger translation)
    const responseEN = await axios.get('http://localhost:8081/api/testimonials?lang=en');
    console.log('🇬🇧 English response:', JSON.stringify(responseEN.data, null, 2));
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testTestimonialsAPI();