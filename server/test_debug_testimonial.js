import axios from 'axios';

async function testNewTestimonialDebug() {
  try {
    console.log('🧪 Testing new testimonial submission with detailed debugging...');
    
    const testimonialData = {
      name: 'Debug Test DeepL',
      rating: 5,
      comment: 'Serviciile oferite au depășit cu mult așteptările mele. Acesta este un test pentru a verifica traducerea în engleză.'
    };
    
    console.log('📤 Submitting testimonial:', {
      name: testimonialData.name,
      rating: testimonialData.rating,
      comment: testimonialData.comment.substring(0, 50) + '...'
    });
    
    const response = await axios.post('http://localhost:8080/api/public/testimonials', testimonialData);
    
    console.log('✅ Testimonial submitted successfully:', response.data);
    
    if (response.data.success) {
      console.log('🎯 Test completed! Check server logs for translation details.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testNewTestimonialDebug();