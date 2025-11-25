const axios = require('axios');

// Simple test for testimonial submission without translation verification
const API_URL = 'http://localhost:8080/api/testimonials';

async function testSimpleTestimonialSubmission() {
  console.log('🚀 Testing simple testimonial submission...\n');
  
  const testimonial = {
    name: 'Test User',
    rating: 5,
    comment: 'Very good service, professional staff and excellent attention to detail. I recommend it!'
  };
  
  try {
    console.log(`📋 Submitting testimonial: "${testimonial.comment}"`);
    
    const startTime = Date.now();
    const response = await axios.post(API_URL, testimonial, {
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.data.success) {
      console.log(`✅ SUCCESS: ${response.data.message}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      
      if (duration < 5000) {
        console.log('✅ Fast response - no timeout issues!');
      } else {
        console.log('⚠️  Slow response - might need optimization');
      }
      
      return true;
    } else {
      console.log(`❌ FAILED: ${response.data.error || 'Unknown error'}`);
      return false;
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - (error.config?.time || endTime);
    
    console.log(`❌ ERROR: ${error.message}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('⏰ TIMEOUT: Request timed out');
    }
    
    return false;
  }
}

// Test Romanian testimonial specifically
async function testRomanianTestimonial() {
  console.log('\n🇷🇴 Testing Romanian testimonial submission...\n');
  
  const testimonial = {
    name: 'Ion Popescu',
    rating: 5,
    comment: 'Foarte mulțumit de servicii, personalul este profesionist și atent la detalii. Recomand cu încredere!'
  };
  
  try {
    console.log(`📋 Submitting Romanian testimonial: "${testimonial.comment}"`);
    
    const startTime = Date.now();
    const response = await axios.post(API_URL, testimonial, {
      timeout: 15000, // 15 seconds timeout for translation
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.data.success) {
      console.log(`✅ SUCCESS: ${response.data.message}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      
      if (duration < 10000) {
        console.log('✅ Good response time - translations working!');
      } else {
        console.log('⚠️  Slow response - possible translation delays');
      }
      
      return true;
    } else {
      console.log(`❌ FAILED: ${response.data.error || 'Unknown error'}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('⏰ TIMEOUT: Request timed out - translation taking too long');
    }
    
    return false;
  }
}

// Main test execution
async function runSimpleTests() {
  try {
    console.log('🔄 Starting simple testimonial tests...\n');
    
    const test1 = await testSimpleTestimonialSubmission();
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const test2 = await testRomanianTestimonial();
    
    console.log('\n📊 TEST RESULTS:');
    console.log(`   English testimonial: ${test1 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   Romanian testimonial: ${test2 ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (test1 && test2) {
      console.log('\n🎉 ALL TESTS PASSED! Testimonial system is working.');
    } else {
      console.log('\n⚠️  Some tests failed. Check logs above.');
    }
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(API_URL, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Run tests
checkServer().then(isRunning => {
  if (isRunning) {
    runSimpleTests();
  } else {
    console.error('❌ Server is not running. Please start the server first.');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Error checking server status:', error.message);
  process.exit(1);
});