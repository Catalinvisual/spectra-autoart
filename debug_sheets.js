const axios = require('axios');

async function debugGoogleSheets() {
  try {
    console.log('🔑 Getting admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Token obtained');
    
    console.log('\n📋 Getting admin gallery data...');
    const adminResponse = await axios.get('http://localhost:8080/api/admin/gallery', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Admin response structure:', typeof adminResponse.data, Array.isArray(adminResponse.data));
    const adminImages = Array.isArray(adminResponse.data) ? adminResponse.data : adminResponse.data.data || [];
    
    console.log('Admin gallery images:');
    adminImages.forEach((img, i) => {
      console.log(`  ${i + 1}. ID: "${img.id}"`);
      console.log(`     Title: "${img.title}"`);
      console.log(`     URL: ${img.url}`);
      if (img.url) {
        console.log(`     Public ID (from URL): ${img.url.split('/').pop()}`);
      }
    });
    
    console.log('\n📋 Getting public gallery data...');
    const publicResponse = await axios.get('http://localhost:8080/api/gallery');
    
    console.log('Public gallery images:');
    publicResponse.data.data.forEach((img, i) => {
      console.log(`  ${i + 1}. ID: "${img.id}"`);
      console.log(`     Title: "${img.title}"`);
      console.log(`     URL: ${img.url}`);
    });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugGoogleSheets();