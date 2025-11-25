import GoogleSheetsService from './src/services/googleSheetsService.js';

async function checkLatestTestimonials() {
  try {
    console.log('🔍 Checking latest testimonials from Google Sheets...');
    
    const data = await GoogleSheetsService.getData('Testimonials');
    console.log(`📊 Total testimonials: ${data.length - 1}`); // Subtract header row
    
    if (data.length <= 1) {
      console.log('⚠️  No testimonials found');
      return;
    }
    
    // Get the last 3 testimonials (most recent)
    const headers = data[0];
    const recentTestimonials = data.slice(-3);
    
    console.log('\n📋 Headers:', headers);
    console.log('\n🎯 Last 3 testimonials:');
    
    recentTestimonials.forEach((row, index) => {
      console.log(`\n${index + 1}. ID: ${row[0] || 'N/A'}`);
      console.log(`   Name: ${row[1] || 'N/A'}`);
      console.log(`   Rating: ${row[2] || 'N/A'}`);
      console.log(`   Date: ${row[3] || 'N/A'}`);
      console.log(`   Comment (RO): ${(row[4] || '').substring(0, 50)}...`);
      console.log(`   Comment (NL): ${(row[5] || '').substring(0, 50)}...`);
      console.log(`   Comment (EN): ${(row[6] || '').substring(0, 50)}...`);
      console.log(`   Comment (ES): ${(row[7] || '').substring(0, 50)}...`);
      console.log(`   Comment (PL): ${(row[8] || '').substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error checking testimonials:', error.message);
  }
}

checkLatestTestimonials();