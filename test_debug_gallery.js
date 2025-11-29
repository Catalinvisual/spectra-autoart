const axios = require('axios');

async function debugGalleryData() {
  try {
    console.log('🔑 Generating admin token...');
    const tokenResponse = await axios.post('http://localhost:8080/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = tokenResponse.data.token;
    console.log('✅ Admin token generated');
    
    console.log('📋 Testing admin gallery endpoint...');
    const response = await axios.get('http://localhost:8080/api/admin/gallery', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Admin gallery endpoint working');
    console.log('📊 Response structure:', Object.keys(response.data));
    
    if (response.data.success && response.data.data) {
      const images = response.data.data;
      console.log('📊 Total admin images:', images.length);
      
      if (images.length === 0) {
        console.log('🤔 Admin gallery is empty, checking public gallery...');
        const publicResponse = await axios.get('http://localhost:8080/api/gallery');
        console.log('📊 Public gallery response structure:', Object.keys(publicResponse.data));
        
        if (publicResponse.data.success && publicResponse.data.data) {
          const publicImages = publicResponse.data.data;
          console.log('📊 Total public images:', publicImages.length);
          
          // Check for duplicate IDs in public gallery
          const ids = publicImages.map(img => img.id);
          const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
          
          if (duplicates.length > 0) {
            console.log('⚠️  Duplicate IDs found in public gallery:', duplicates);
            console.log('🔍 All public IDs:', ids);
            
            // Show duplicate details
            duplicates.forEach(dupId => {
              const dupImages = publicImages.filter(img => img.id === dupId);
              console.log(`\n🔄 Duplicate ID: ${dupId}`);
              dupImages.forEach((img, index) => {
                console.log(`  ${index + 1}. URL: ${img.url}, Active: ${img.active}`);
                console.log(`     Created: ${img.created_date}, Updated: ${img.updated_date}`);
              });
            });
          } else {
            console.log('✅ No duplicate IDs found in public gallery');
          }
        }
      } else {
        // Check for duplicate IDs in admin gallery
        const ids = images.map(img => img.id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        
        if (duplicates.length > 0) {
          console.log('⚠️  Duplicate IDs found in admin gallery:', duplicates);
          console.log('🔍 All admin IDs:', ids);
        } else {
          console.log('✅ No duplicate IDs found in admin gallery');
        }
      }
      
    } else {
      console.log('📝 Raw response data:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    if (error.response) {
      console.error('📊 Error response:', error.response.data);
    }
  }
}

debugGalleryData();