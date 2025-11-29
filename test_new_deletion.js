const axios = require('axios');

async function testNewDeletion() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    console.log('\n📋 Getting public gallery data...');
    const publicResponse = await axios.get('http://localhost:8080/api/gallery');
    const images = publicResponse.data.data;
    
    console.log(`Found ${images.length} images:`);
    images.forEach((img, i) => {
      console.log(`  ${i + 1}. ID: "${img.id}"`);
      console.log(`     URL: ${img.url}`);
    });
    
    if (images.length > 0) {
      const testImage = images[0];
      console.log(`\n🗑️ Testing deletion of image: "${testImage.id}"`);
      
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
        
        // Check if image is still in gallery
        console.log('\n📋 Checking if image was removed from public gallery...');
        const afterDeleteResponse = await axios.get('http://localhost:8080/api/gallery');
        const remainingImages = afterDeleteResponse.data.data;
        
        const stillExists = remainingImages.some(img => img.id === testImage.id);
        if (stillExists) {
          console.log('❌ Image still exists in public gallery!');
          console.log('🔍 Remaining images with same ID:', remainingImages.filter(img => img.id === testImage.id).length);
        } else {
          console.log('✅ Image successfully removed from public gallery');
        }
        
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

testNewDeletion();