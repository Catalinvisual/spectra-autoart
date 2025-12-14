import axios from 'axios';

async function checkAdminCredentials() {
  try {
    console.log('🔐 Testing different admin credentials...');
    
    // Test first set of credentials
    console.log('🔄 Testing admin@example.com / admin123...');
    try {
      const response1 = await axios.post('http://localhost:8081/api/admin/auth/login', {
        email: 'admin@example.com',
        password: 'admin123'
      });
      console.log('✅ First credentials worked!');
      return response1.data.token;
    } catch (error) {
      console.log('❌ First credentials failed:', error.response?.data);
    }
    
    // Test second set of credentials
    console.log('🔄 Testing admin@spectra.com / admin123...');
    try {
      const response2 = await axios.post('http://localhost:8081/api/admin/auth/login', {
        email: 'admin@spectra.com',
        password: 'admin123'
      });
      console.log('✅ Second credentials worked!');
      return response2.data.token;
    } catch (error) {
      console.log('❌ Second credentials failed:', error.response?.data);
    }
    
    console.log('⚠️  Neither credential set worked');
    return null;
    
  } catch (error) {
    console.error('❌ Error testing credentials:', error.message);
    return null;
  }
}

checkAdminCredentials();