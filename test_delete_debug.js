const axios = require('axios');

async function testDeleteWithDebug() {
  try {
    console.log('🔑 Generating admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Admin token generated');
    
    console.log('📋 Getting current gallery images...');
    const galleryResponse = await axios.get('http://localhost:8080/api/gallery');
    const images = galleryResponse.data.data;
    
    console.log('📊 Total images:', images.length);
    console.log('🖼️ Available images:');
    images.forEach((img, index) => {
      console.log(`  ${index + 1}. ID: ${img.id} | Category: ${img.category} | Active: ${img.active}`);
      console.log(`     URL: ${img.url}`);
    });
    
    if (images.length > 0) {
      const testImage = images[images.length - 1]; // Take the last image
      console.log(`\n🗑️ Testing deletion of image: ${testImage.id}`);
      
      // Delete the image
      const encodedId = encodeURIComponent(testImage.id);
      const deleteResponse = await axios.delete(
        `http://localhost:8080/api/admin/gallery/${encodedId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Delete response:', deleteResponse.data);
      
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
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📊 Error response:', error.response.data);
    }
  }
}

testDeleteWithDebug();