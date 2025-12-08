import axios from 'axios';

async function testTestimonials() {
  try {
    console.log('🧪 Testing testimonials endpoint...');
    
    // Test the testimonials endpoint
    const response = await axios.get('http://localhost:5000/public/testimonials?lang=nl');
    
    console.log('✅ Testimonials response:', {
      status: response.status,
      dataLength: response.data.data.length,
      firstTestimonial: response.data.data[0]
    });
    
    if (response.data.data.length === 0) {
      console.log('⚠️  No testimonials found in Google Sheets');
    } else {
      console.log('✅ Found', response.data.data.length, 'testimonials');
    }
    
  } catch (error) {
    console.error('❌ Error testing testimonials:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTestimonials();