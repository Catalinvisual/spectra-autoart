import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

async function testFinalWorkingFix() {
  try {
    console.log('🧪 Testing FINAL WORKING FIX for Comment_EN translation...');
    
    const testimonialData = {
      name: 'Final Working EN Fix',
      rating: 5,
      comment: 'Serviciile oferite au depășit cu mult așteptările mele. Acesta este testul final care ar trebui să demonstreze că traducerea în engleză funcționează perfect acum.'
    };
    
    console.log('📤 Submitting testimonial:', {
      name: testimonialData.name,
      rating: testimonialData.rating,
      comment: testimonialData.comment.substring(0, 50) + '...'
    });
    
    const response = await axios.post('http://localhost:8080/api/public/testimonials', testimonialData);
    
    console.log('✅ Testimonial submitted successfully:', response.data);
    
    if (response.data.success) {
      console.log('🎯 FINAL WORKING TEST completed!');
      console.log('🔍 Expected: Comment_EN should now contain proper English translation');
      console.log('🔍 Check Google Sheets to verify the English translation is saved correctly');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testFinalWorkingFix();