const axios = require('axios');

async function testTestimonialFlow() {
  try {
    console.log('🧪 Testing testimonial submission flow...');
    
    // Test 1: Get existing testimonials
    console.log('\n📋 Test 1: Getting existing testimonials...');
    try {
      const getResponse = await axios.get('http://localhost:8081/api/public/testimonials');
      console.log('✅ GET testimonials successful:', getResponse.data);
    } catch (error) {
      console.log('❌ GET testimonials failed:', error.message);
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    }
    
    // Test 2: Submit a new testimonial
    console.log('\n📝 Test 2: Submitting new testimonial...');
    const newTestimonial = {
      name: 'Test User',
      rating: 5,
      comment: 'This is a test testimonial from the automated test script.'
    };
    
    try {
      const postResponse = await axios.post('http://localhost:8081/api/public/testimonials', newTestimonial);
      console.log('✅ POST testimonial successful:', postResponse.data);
    } catch (error) {
      console.log('❌ POST testimonial failed:', error.message);
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
    }
    
    // Test 3: Get testimonials again to see if new one was added
    console.log('\n📋 Test 3: Getting testimonials after submission...');
    try {
      const getResponse2 = await axios.get('http://localhost:8081/api/public/testimonials');
      console.log('✅ GET testimonials after POST:', getResponse2.data);
    } catch (error) {
      console.log('❌ GET testimonials after POST failed:', error.message);
    }
    
  } catch (error) {
    console.error('💥 Test script error:', error);
  }
}

testTestimonialFlow();