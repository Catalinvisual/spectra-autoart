const axios = require('axios');

async function testDeletionDirectly() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    // Test the deletion endpoint directly with a known ID
    const testId = '1764346171493'; // This is the ID we saw in the public gallery
    console.log(`\n🗑️ Testing deletion of image ID: "${testId}"`);
    
    try {
      const encodedId = encodeURIComponent(testId);
      console.log(`Encoded ID: "${encodedId}"`);
      
      const deleteResponse = await axios.delete(
        `http://localhost:8080/api/admin/gallery/${encodedId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          validateStatus: function (status) {
            return status < 500; // Don't throw on 4xx errors
          }
        }
      );
      
      console.log('Delete response status:', deleteResponse.status);
      console.log('Delete response data:', deleteResponse.data);
      
      // Check the server logs for more details
      if (deleteResponse.status === 500) {
        console.log('❌ Server error occurred - check server logs for details');
      }
      
    } catch (error) {
      console.log('❌ Delete error:', error.message);
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testDeletionDirectly();