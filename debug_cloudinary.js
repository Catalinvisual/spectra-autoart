const axios = require('axios');

async function debugCloudinary() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    console.log('\n📋 Getting Cloudinary images directly...');
    
    // Test Cloudinary service directly
    const { default: CloudinaryService } = await import('./server/src/services/cloudinaryService.js');
    
    console.log('Getting images from Cloudinary folder...');
    const result = await CloudinaryService.getImagesFromFolder('spectra-autoart/gallery');
    
    console.log('Cloudinary result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack:', error.stack);
  }
}

debugCloudinary();