import axios from 'axios';

async function testNewTestimonial() {
  try {
    console.log('🧪 Testing new testimonial submission with DeepL translation...');
    
    const testimonialData = {
      name: 'Test User DeepL',
      rating: 5,
      comment: 'Serviciile oferite au depășit cu mult așteptările mele. Profesionalismul, atenția la detalii și comunicarea impecabilă m-au făcut să simt că sunt pe mâini bune. Recomand cu încredere oricui caută calitate fără compromisuri.'
    };
    
    console.log('📤 Submitting testimonial:', {
      name: testimonialData.name,
      rating: testimonialData.rating,
      comment: testimonialData.comment.substring(0, 50) + '...'
    });
    
    const response = await axios.post('http://localhost:8080/api/public/testimonials', testimonialData);
    
    console.log('✅ Testimonial submitted successfully:', response.data);
    
    if (response.data.success) {
      console.log('🎯 Test completed! Check Google Sheets to verify translations.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testNewTestimonial();