import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

async function testFixedTestimonial() {
  try {
    console.log('🧪 Testing FIXED testimonial submission...');
    
    const testimonialData = {
      name: 'Test Fix EN Translation',
      rating: 5,
      comment: 'Serviciile oferite au depășit cu mult așteptările mele. Acesta este un test pentru a verifica dacă traducerea în engleză funcționează corect acum.'
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
      console.log('🔍 Expected: Comment_EN should contain English translation, not Romanian text');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testFixedTestimonial();