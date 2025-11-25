import GoogleSheetsService from './src/services/googleSheetsService.js';

async function testTestimonialsSaving() {
  console.log('🔍 Testing testimonials saving to Google Sheets...\n');
  
  try {
    // Ensure service is initialized
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...');
      await GoogleSheetsService.initialize();
    }
    
    // Get recent testimonials
    console.log('📊 Fetching testimonials from Google Sheets...');
    const testimonials = await GoogleSheetsService.getTestimonialsWithDeepLTranslation('ro', true, true);
    
    console.log(`✅ Found ${testimonials.length} testimonials`);
    
    // Show the most recent testimonials
    const recentTestimonials = testimonials.slice(-3);
    recentTestimonials.forEach((testimonial, index) => {
      console.log(`\n📝 Testimonial ${index + 1}:`);
      console.log(`   Name: ${testimonial.name}`);
      console.log(`   Rating: ${testimonial.rating}`);
      console.log(`   Comment RO: ${testimonial.comment}`);
      console.log(`   Comment NL: ${testimonial.comment_NL || 'N/A'}`);
      console.log(`   Comment EN: ${testimonial.comment_EN || 'N/A'}`);
      console.log(`   Comment ES: ${testimonial.comment_ES || 'N/A'}`);
      console.log(`   Comment PL: ${testimonial.comment_PL || 'N/A'}`);
    });
    
    // Test saving a new testimonial directly
    console.log('\n🔄 Testing direct save to Google Sheets...');
    const newTestimonial = [
      `test-${Date.now()}`,
      'Direct Test User',
      '5',
      'Deze service was uitstekend! Mijn auto ziet eruit als nieuw.',
      'This service was excellent! My car looks like new.',
      '¡Este servicio fue excelente! Mi auto parece nuevo.',
      'Ta usługa była doskonała! Mój samochód wygląda jak nowy.',
      'Acest serviciu a fost excelent! Mașina mea arată ca nouă.',
      'true',
      new Date().toISOString().split('T')[0]
    ];
    
    await GoogleSheetsService.appendData('Testimonials', newTestimonial);
    console.log('✅ Direct testimonial saved successfully!');
    
  } catch (error) {
    console.error('❌ Error testing testimonials saving:', error.message);
    console.error('Stack:', error.stack);
  }
}

testTestimonialsSaving();