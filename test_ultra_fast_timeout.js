/**
 * Test ultra-rapid pentru verificarea eliminării timeout-urilor
 * Testează performanța maximă și calitatea traducerilor românești
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/public/testimonials';
const TEST_TIMEOUT = 10000; // 10 seconds timeout (reduced from 30s)

// Test testimonials în limba română cu diferite complexități
const romanianTestimonials = [
  {
    name: "Ion Popescu",
    rating: 5,
    comment: "Sunt foarte mulțumit de serviciile oferite. Personalul este profesionist și atent la detalii. Recomand cu încredere!"
  },
  {
    name: "Maria Ionescu", 
    rating: 4,
    comment: "Superb! Calitate excelentă, personal amabil și prețuri rezonabile. Voi reveni cu siguranță!"
  },
  {
    name: "Andrei Georgescu",
    rating: 5, 
    comment: "Cel mai bun service auto din oraș. Rapid, eficient și foarte profesionist. Mulțumesc pentru tot!"
  }
];

async function testUltraFastTranslation() {
  console.log('🚀 Starting ultra-fast Romanian testimonial test...\n');
  
  let successCount = 0;
  let totalTime = 0;
  let timeoutCount = 0;
  
  for (let i = 0; i < romanianTestimonials.length; i++) {
    const testimonial = romanianTestimonials[i];
    const startTime = Date.now();
    
    console.log(`\n📋 Test ${i + 1}: ${testimonial.name}`);
    console.log(`   Original RO: "${testimonial.comment}"`);
    
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
        
        if (duration > 8000) {
          console.log(`   ⚠️  WARNING: Translation took longer than expected (>8s)`);
        }
        
        // Verify translations were created
        console.log(`   🔍 Verifying translations...`);
        
        // Wait a moment for processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check each language translation
        for (const lang of ['NL', 'EN', 'ES', 'PL']) {
          try {
            const checkResponse = await axios.get(`${API_URL}?lang=${lang.toLowerCase()}`);
            if (checkResponse.data.success && checkResponse.data.data.length > 0) {
              const latest = checkResponse.data.data[0];
              const translatedComment = latest.comment;
              
              // Basic quality check
              const isDifferent = translatedComment !== testimonial.comment;
              const isValid = translatedComment.length > 20 && !translatedComment.includes('[object');
              
              console.log(`   🌍 ${lang}: "${translatedComment.substring(0, 60)}..." ${isDifferent && isValid ? '✅' : '❌'}`);
            }
          } catch (langError) {
            console.log(`   ❌ Failed to check ${lang}: ${langError.message}`);
          }
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
        timeoutCount++;
        console.log(`   ⏰ TIMEOUT: Request timed out after ${TEST_TIMEOUT}ms`);
      }
    }
    
    // Minimal wait between tests
    if (i < romanianTestimonials.length - 1) {
      console.log(`   💤 Waiting 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log('\n📊 ULTRA-FAST TEST SUMMARY:');
  console.log(`   ✅ Successful: ${successCount}/${romanianTestimonials.length}`);
  console.log(`   ❌ Failed: ${romanianTestimonials.length - successCount}/${romanianTestimonials.length}`);
  console.log(`   ⏰ Timeouts: ${timeoutCount}`);
  console.log(`   ⏱️  Average time: ${Math.round(totalTime / romanianTestimonials.length)}ms`);
  console.log(`   📈 Success rate: ${Math.round((successCount / romanianTestimonials.length) * 100)}%`);
  
  if (timeoutCount === 0 && successCount === romanianTestimonials.length) {
    console.log('\n🎉 ULTRA-FAST SUCCESS! No timeouts and all Romanian testimonials processed correctly!');
  } else if (timeoutCount > 0) {
    console.log('\n⚠️  TIMEOUT ISSUES DETECTED - Further optimization needed');
  } else {
    console.log('\n✅ GOOD PROGRESS - Timeouts eliminated, continue monitoring quality');
  }
}

// Test rapid pentru timeout
async function quickTimeoutTest() {
  console.log('\n⚡ QUICK TIMEOUT TEST (5 second limit)...');
  
  const startTime = Date.now();
  try {
    const response = await axios.post(API_URL, {
      name: "Quick Test",
      rating: 5,
      comment: "Test rapid pentru timeout! Sper să funcționeze bine."
    }, {
      timeout: 5000 // 5 seconds strict limit
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Quick test completed in ${duration}ms`);
    return duration < 5000;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ Quick test failed after ${duration}ms: ${error.message}`);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('⏱️  Starting with quick timeout test...');
  const quickSuccess = await quickTimeoutTest();
  
  if (quickSuccess) {
    console.log('\n✅ Quick test passed, proceeding with full test...\n');
    await testUltraFastTranslation();
  } else {
    console.log('\n❌ Quick test failed, server needs immediate attention');
  }
}

runTests().catch(console.error);