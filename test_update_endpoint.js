const axios = require('axios');

async function testUpdateEndpoint() {
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
      
      // Toggle status
      const newStatus = !firstImage.active;
      const body = { active: newStatus };
      
      // URL-encode the image ID to handle slashes in Cloudinary public_id
      const encodedImageId = encodeURIComponent(firstImage.id);
      console.log(`🔄 Updating image ${firstImage.id} (encoded: ${encodedImageId}) to active=${newStatus}`);
      
      const updateResponse = await axios.put(`http://localhost:8080/api/admin/gallery/${encodedImageId}`, body, { headers });
      console.log('✅ Update successful:', updateResponse.data);
      
      // Verify update
      const verifyResponse = await axios.get('http://localhost:8080/api/admin/gallery', { headers });
      const updatedImage = verifyResponse.data.find(img => img.id === firstImage.id);
      console.log(`✅ Verification - Image ${updatedImage.id} now active: ${updatedImage.active}`);
      
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

testUpdateEndpoint();