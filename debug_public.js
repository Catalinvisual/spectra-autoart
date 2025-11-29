const axios = require('axios');

async function debugPublicGallery() {
  try {
    console.log('📋 Getting public gallery data...');
    const response = await axios.get('http://localhost:8080/api/gallery');
    
    console.log('Response status:', response.status);
    console.log('Response structure:', typeof response.data);
    console.log('Response keys:', Object.keys(response.data));
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\nFirst image structure:');
      const firstImage = response.data.data[0];
      console.log('Keys:', Object.keys(firstImage));
      console.log('Full image data:', JSON.stringify(firstImage, null, 2));
    } else {
      console.log('No images found or unexpected structure');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
  }
}

debugPublicGallery();