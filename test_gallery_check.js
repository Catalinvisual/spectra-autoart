const axios = require('axios');

async function testGallery() {
  try {
    console.log('📋 Testing gallery endpoint...');
    const response = await axios.get('http://localhost:8080/api/gallery');
    console.log('✅ Gallery endpoint working');
    
    if (response.data.success && response.data.data) {
      const images = response.data.data;
      console.log('📊 Total images:', images.length);
      
      // Check for duplicate IDs
      const ids = images.map(img => img.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      
      if (duplicates.length > 0) {
        console.log('⚠️  Duplicate IDs found:', duplicates);
        console.log('🔍 All IDs:', ids);
      } else {
        console.log('✅ No duplicate IDs found');
      }
      
      // Show first few images
      console.log('🖼️  Sample images:');
      images.slice(0, 5).forEach((img, index) => {
        console.log(`  ${index + 1}. ID: ${img.id}, Active: ${img.active}, Category: ${img.category}`);
      });
      
    } else {
      console.log('📝 Raw response data:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Gallery test failed:', error.message);
  }
}

testGallery();