import GoogleSheetsService from './server/src/services/googleSheetsService.js';

async function checkTestimonials() {
  try {
    console.log('🔍 Checking Google Sheets testimonials...');
    
    // Initialize Google Sheets service
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...');
      await GoogleSheetsService.initialize();
    }
    
    // Get raw testimonials data
    const data = await GoogleSheetsService.getData('Testimonials');
    console.log('📊 Raw testimonials data:', {
      totalRows: data.length,
      headers: data[0] || 'No headers',
      firstRow: data[1] || 'No data'
    });
    
    // Get processed testimonials
    const testimonials = await GoogleSheetsService.getTestimonialsWithDeepLTranslation('nl', true, false);
    console.log('✅ Processed testimonials:', {
      count: testimonials.length,
      firstTestimonial: testimonials[0] || 'No testimonials'
    });
    
  } catch (error) {
    console.error('❌ Error checking testimonials:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkTestimonials();