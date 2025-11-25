const axios = require('axios');

// Test configuration
const API_URL = 'http://localhost:8080/api/testimonials';
const TEST_TIMEOUT = 25000; // 25 seconds timeout for the entire test

// Test testimonials in different languages
const testTestimonials = [
  {
    name: 'Ion Popescu',
    rating: 5,
    comment: 'Foarte mulțumit de servicii, personalul este profesionist și atent la detalii. Recomand cu încredere!',
    expectedLang: 'RO'
  },
  {
    name: 'Jan Kowalski',
    rating: 4,
    comment: 'Bardzo dobre usługi, profesjonalny personel i świetna obsługa. Polecam!',
    expectedLang: 'PL'
  },
  {
    name: 'Maria Garcia',
    rating: 5,
    comment: 'Muy buen servicio, el personal es profesional y atento. ¡Lo recomiendo!',
    expectedLang: 'ES'
  },
  {
    name: 'John Smith',
    rating: 4,
    comment: 'Very good service, professional staff and excellent attention to detail. I recommend it!',
    expectedLang: 'EN'
  }
];

async function testTestimonialSubmission() {
  console.log('🚀 Starting optimized testimonial submission test...\n');
  
  let successCount = 0;
  let totalTime = 0;
  
  for (let i = 0; i < testTestimonials.length; i++) {
    const testimonial = testTestimonials[i];
    const startTime = Date.now();
    
    console.log(`\n📋 Test ${i + 1}: ${testimonial.name} (${testimonial.expectedLang})`);
    console.log(`   Comment: "${testimonial.comment}"`);
    
    try {
      const response = await axios.post(API_URL, testimonial, {
        timeout: TEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      totalTime += duration;
      
      if (response.data.success) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${response.data.message}`);
        console.log(`   ⏱️  Duration: ${duration}ms`);
        
        if (duration > 20000) {
          console.log(`   ⚠️  WARNING: Translation took longer than expected`);
        }
      } else {
        console.log(`   ❌ FAILED: ${response.data.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      totalTime += duration;
      
      console.log(`   ❌ ERROR: ${error.message}`);
      console.log(`   ⏱️  Duration: ${duration}ms`);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.log(`   ⏰ TIMEOUT: Request timed out after ${TEST_TIMEOUT}ms`);
      }
    }
    
    // Wait between tests to avoid overwhelming the server
    if (i < testTestimonials.length - 1) {
      console.log(`   💤 Waiting 2 seconds before next test...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log(`   ✅ Successful: ${successCount}/${testTestimonials.length}`);
  console.log(`   ❌ Failed: ${testTestimonials.length - successCount}/${testTestimonials.length}`);
  console.log(`   ⏱️  Average time: ${Math.round(totalTime / testTestimonials.length)}ms`);
  console.log(`   📈 Success rate: ${Math.round((successCount / testTestimonials.length) * 100)}%`);
  
  if (successCount === testTestimonials.length) {
    console.log('\n🎉 ALL TESTS PASSED! The testimonial system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
  }
}

async function verifyTranslations() {
  console.log('\n🔍 Verifying translations in Google Sheets...');
  
  try {
    // Wait a bit for data to be processed
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const response = await axios.get(API_URL, {
      params: { lang: 'en' },
      timeout: 10000
    });
    
    if (response.data.success && response.data.data.length > 0) {
      const latestTestimonials = response.data.data.slice(-4); // Get last 4 testimonials
      
      console.log('\n📋 Latest testimonials from Google Sheets:');
      latestTestimonials.forEach((testimonial, index) => {
        console.log(`\n${index + 1}. ${testimonial.name} (${testimonial.rating}/5)`);
        console.log(`   NL: ${testimonial.comment}`);
        console.log(`   EN: ${testimonial.commentEN || testimonial.comment}`);
        console.log(`   ES: ${testimonial.commentES || testimonial.comment}`);
        console.log(`   PL: ${testimonial.commentPL || testimonial.comment}`);
        console.log(`   RO: ${testimonial.commentRO || testimonial.comment}`);
      });
      
      // Check if translations are different from originals
      const hasGoodTranslations = latestTestimonials.some(testimonial => {
        return testimonial.commentEN !== testimonial.comment || 
               testimonial.commentES !== testimonial.comment ||
               testimonial.commentPL !== testimonial.comment ||
               testimonial.commentRO !== testimonial.comment;
      });
      
      if (hasGoodTranslations) {
        console.log('\n✅ Translations look good - different languages detected!');
      } else {
        console.log('\n⚠️  Warning: All translations appear to be identical to original');
      }
      
    } else {
      console.log('❌ Could not fetch testimonials for verification');
    }
    
  } catch (error) {
    console.log(`❌ Error verifying translations: ${error.message}`);
  }
}

// Main test execution
async function runTests() {
  try {
    console.log('🔄 Testing optimized testimonial submission system...\n');
    
    await testTestimonialSubmission();
    await verifyTranslations();
    
    console.log('\n🏁 Test suite completed!');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Check if server is running before starting tests
async function checkServer() {
  try {
    await axios.get(API_URL, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Run tests if server is available
checkServer().then(isRunning => {
  if (isRunning) {
    runTests();
  } else {
    console.error('❌ Server is not running. Please start the server first with: npm run dev');
    console.log('   Make sure the server is running on http://localhost:8080');
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Error checking server status:', error.message);
  process.exit(1);
});