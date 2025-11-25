import axios from 'axios';

const API_URL = 'http://localhost:3001/api/public/testimonials';

async function testEndpoint() {
  console.log('🚀 Testing /public/testimonials endpoint with Romanian testimonial...\n');
  
  const testimonialData = {
    name: 'Ion Popescu',
    rating: 5,
    comment: 'Mulțumesc pentru serviciile excelente! Personalul este foarte profesionist și atent la detalii. Recomand cu încredere!'
  };
  
  try {
    console.log(`📤 Sending testimonial:`, testimonialData);
    
    const start = Date.now();
    const response = await axios.post(API_URL, testimonialData);
    const end = Date.now();
    const duration = end - start;
    
    console.log(`\n✅ Response received in: ${duration}ms`);
    console.log(`📊 Response status:`, response.status);
    console.log(`📋 Response data:`, JSON.stringify(response.data, null, 2));
    
    if (duration < 5000) {
      console.log(`\n🎉 SUCCESS: Response time (${duration}ms) is under 5 seconds!`);
    } else {
      console.log(`\n⚠️  WARNING: Response time (${duration}ms) exceeds 5 seconds!`);
    }
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error.message);
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📋 Response data:', error.response.data);
    }
  }
}

testEndpoint();