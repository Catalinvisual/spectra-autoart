import { GoogleSheetsService } from './server/src/services/googleSheetsService.js';

console.log('🧪 Testing Google Sheets testimonial translation...');

const sheetsService = new GoogleSheetsService();

async function testTestimonialTranslation() {
  try {
    console.log('📋 Fetching testimonials with Argos translation...');
    const testimonials = await sheetsService.getTestimonialsWithArgosTranslation('en');
    
    console.log(`✅ Found ${testimonials.length} testimonials`);
    
    const latestTestimonial = testimonials[testimonials.length - 1];
    if (latestTestimonial) {
      console.log('Latest testimonial:');
      console.log('- Name:', latestTestimonial.name);
      console.log('- Rating:', latestTestimonial.rating);
      console.log('- Comment:', latestTestimonial.comment);
      console.log('- Comment type:', typeof latestTestimonial.comment);
      console.log('- Comment is object:', typeof latestTestimonial.comment === 'object');
      
      if (typeof latestTestimonial.comment === 'object') {
        console.log('- Comment object:', JSON.stringify(latestTestimonial.comment, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing testimonial translation:', error.message);
  }
}

testTestimonialTranslation();