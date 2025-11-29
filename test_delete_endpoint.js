const axios = require('axios');

async function testDeleteEndpoint() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDQwNjk1NywiZXhwIjoxNzY0NDkzMzU3fQ.pQgG9zMthwOX-fngBW8A7DuiLNxereVIv5x5o1KbmVM';
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('📋 Getting gallery images...');
    const galleryResponse = await axios.get('http://localhost:8080/api/admin/gallery', { headers });
    console.log(`✅ Found ${galleryResponse.data.length} images`);
    
    if (galleryResponse.data.length > 0) {
      const firstImage = galleryResponse.data[0];
      console.log(`🖼️ Testing with image: ${firstImage.id} - Active: ${firstImage.active}`);
      
      // URL-encode the image ID to handle slashes in Cloudinary public_id
      const encodedImageId = encodeURIComponent(firstImage.id);
      console.log(`🗑️ Deleting image ${firstImage.id} (encoded: ${encodedImageId})`);
      
      const deleteResponse = await axios.delete(`http://localhost:8080/api/admin/gallery/${encodedImageId}`, { headers });
      console.log('✅ Delete successful:', deleteResponse.data);
      
      // Verify deletion
      const verifyResponse = await axios.get('http://localhost:8080/api/admin/gallery', { headers });
      const deletedImage = verifyResponse.data.find(img => img.id === firstImage.id);
      if (deletedImage) {
        console.log(`⚠️ Image still exists after deletion`);
      } else {
        console.log(`✅ Image successfully deleted from gallery`);
      }
      
    } else {
      console.log('⚠️ No images found in gallery');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testDeleteEndpoint();