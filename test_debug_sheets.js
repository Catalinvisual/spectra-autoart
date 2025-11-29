const axios = require('axios');

async function debugGoogleSheetsData() {
  try {
    console.log('📋 Checking Google Sheets Gallery data structure...');
    
    // Get public gallery data (direct from Google Sheets)
    const response = await axios.get('http://localhost:8080/api/gallery');
    
    if (response.data.success && response.data.data) {
      const images = response.data.data;
      console.log('📊 Total images from Google Sheets:', images.length);
      
      // Group images by ID to see duplicates
      const idGroups = {};
      images.forEach((img, index) => {
        if (!idGroups[img.id]) {
          idGroups[img.id] = [];
        }
        idGroups[img.id].push({
          index,
          url: img.url,
          alt_text: img.alt_text,
          category: img.category,
          active: img.active,
          created_date: img.created_date
        });
      });
      
      // Find duplicates
      const duplicates = Object.keys(idGroups).filter(id => idGroups[id].length > 1);
      
      if (duplicates.length > 0) {
        console.log('⚠️  Duplicate IDs found:', duplicates);
        
        duplicates.forEach(dupId => {
          console.log(`\n🔄 Duplicate ID: ${dupId} (${idGroups[dupId].length} occurrences)`);
          idGroups[dupId].forEach((occurrence, index) => {
            console.log(`  ${index + 1}. URL: ${occurrence.url}`);
            console.log(`     Alt text: ${occurrence.alt_text}`);
            console.log(`     Category: ${occurrence.category}`);
            console.log(`     Active: ${occurrence.active}`);
            console.log(`     Created: ${occurrence.created_date}`);
          });
        });
      } else {
        console.log('✅ No duplicate IDs found');
      }
      
      // Show all unique IDs
      console.log('\n🔍 All unique IDs:');
      Object.keys(idGroups).forEach(id => {
        console.log(`  - ${id} (${idGroups[id].length} occurrence${idGroups[id].length > 1 ? 's' : ''})`);
      });
      
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

debugGoogleSheetsData();