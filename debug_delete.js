const axios = require('axios');

async function debugDelete() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    console.log('📋 Getting gallery images...');
    const galleryResponse = await axios.get('http://localhost:8080/api/gallery');
    const images = galleryResponse.data.data;
    
    console.log(`Found ${images.length} images:`);
    images.forEach((img, i) => {
      console.log(`  ${i + 1}. ID: "${img.id}"`);
      console.log(`     Title: "${img.title}"`);
      console.log(`     URL: ${img.url}`);
    });
    
    if (images.length > 0) {
      const testImage = images[0];
      console.log(`\n🗑️ Attempting to delete: "${testImage.id}"`);
      
      try {
        const encodedId = encodeURIComponent(testImage.id);
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
        
      } catch (error) {
        console.log('❌ Delete error:', error.message);
        if (error.response) {
          console.log('Error status:', error.response.status);
          console.log('Error data:', error.response.data);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugDelete();