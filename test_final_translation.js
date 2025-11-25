/**
 * Test final pentru verificarea traducerii testimonialelor în toate limbile
 * Acest test verifică calitatea traducerii și acoperirea tuturor limbilor
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/testimonials';
const TEST_TIMEOUT = 30000; // 30 seconds timeout

// Test testimonials în diferite limbi
const testTestimonials = [
  {
    name: "Test Română",
    rating: 5,
    comment: "Sunt foarte mulțumit de serviciile oferite. Personalul este profesionist și atent la detalii. Recomand cu încredere!",
    expectedLang: "RO"
  },
  {
    name: "Test Nederlands", 
    rating: 5,
    comment: "Ik ben zeer tevreden over de diensten. Het personeel is professioneel en attent voor details. Ik beveel aan met vertrouwen!",
    expectedLang: "NL"
  },
  {
    name: "Test English",
    rating: 5,
    comment: "I am very satisfied with the services provided. The staff is professional and attentive to details. I recommend with confidence!",
    expectedLang: "EN"
  },
  {
    name: "Test Español",
    rating: 5,
    comment: "Estoy muy satisfecho con los servicios proporcionados. El personal es profesional y atento a los detalles. ¡Recomiendo con confianza!",
    expectedLang: "ES"
  },
  {
    name: "Test Polski",
    rating: 5,
    comment: "Jestem bardzo zadowolony z usług. Personel jest profesjonalny i uważny na szczegóły. Polecam z ufnością!",
    expectedLang: "PL"
  }
];

async function verifyTranslation(originalText, translatedText, targetLanguage, sourceLanguage) {
  // Verificăm că textul nu este identic cu originalul (cu excepția cazului în care este aceeași limbă)
  if (sourceLanguage.toUpperCase() === targetLanguage.toUpperCase()) {
    return {
      success: originalText === translatedText,
      message: sourceLanguage === targetLanguage ? "Original preserved correctly" : "Translation not needed"
    };
  }
  
  // Verificăm că textul tradus este diferit de cel original
  if (originalText === translatedText) {
    return {
      success: false,
      message: "Translation failed - text unchanged"
    };
  }
  
  // Verificăm că textul tradus nu conține caractere neobișnuite sau [object Object]
  if (translatedText.includes('[object') || translatedText.includes('undefined') || translatedText.length < originalText.length * 0.3) {
    return {
      success: false,
      message: "Translation quality poor or corrupted"
    };
  }
  
  return {
    success: true,
    message: "Translation appears valid"
  };
}

async function testEnhancedTranslation() {
  console.log('🚀 Starting enhanced testimonial translation test...\n');
  
  let successCount = 0;
  let totalTime = 0;
  const translationResults = [];
  
  for (let i = 0; i < testTestimonials.length; i++) {
    const testimonial = testTestimonials[i];
    const startTime = Date.now();
    
    console.log(`\n📋 Test ${i + 1}: ${testimonial.name} (${testimonial.expectedLang})`);
    console.log(`   Original: "${testimonial.comment}"`);
    
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
        console.log(`   ✅ SUCCESS: ${response.data.message}`);
        console.log(`   ⏱️  Duration: ${duration}ms`);
        successCount++;
        
        // Now let's check the actual translations in Google Sheets
        console.log(`   🔍 Checking translations in Google Sheets...`);
        
        // Wait a bit for Google Sheets to be updated
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get testimonials to verify translations
        const getResponse = await axios.get(`${API_URL}?lang=${testimonial.expectedLang.toLowerCase()}`);
        
        if (getResponse.data.success && getResponse.data.data.length > 0) {
          const latestTestimonial = getResponse.data.data[0];
          console.log(`   📊 Retrieved testimonial: "${latestTestimonial.comment}"`);
          
          // Verify other language translations
          for (const lang of ['NL', 'EN', 'ES', 'PL', 'RO']) {
            if (lang !== testimonial.expectedLang) {
              try {
                const langResponse = await axios.get(`${API_URL}?lang=${lang.toLowerCase()}`);
                if (langResponse.data.success && langResponse.data.data.length > 0) {
                  const translatedComment = langResponse.data.data[0].comment;
                  const verification = await verifyTranslation(testimonial.comment, translatedComment, lang, testimonial.expectedLang);
                  
                  console.log(`   🌍 ${lang}: "${translatedComment.substring(0, 60)}..." - ${verification.message}`);
                  
                  translationResults.push({
                    sourceLang: testimonial.expectedLang,
                    targetLang: lang,
                    original: testimonial.comment,
                    translated: translatedComment,
                    verification: verification
                  });
                }
              } catch (langError) {
                console.log(`   ❌ Failed to get ${lang} translation: ${langError.message}`);
              }
            }
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
        console.log(`   ⏰ TIMEOUT: Request timed out after ${TEST_TIMEOUT}ms`);
      }
    }
    
    // Wait between tests to avoid overwhelming the server
    if (i < testTestimonials.length - 1) {
      console.log(`   💤 Waiting 3 seconds before next test...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log(`   ✅ Successful submissions: ${successCount}/${testTestimonials.length}`);
  console.log(`   ❌ Failed submissions: ${testTestimonials.length - successCount}/${testTestimonials.length}`);
  console.log(`   ⏱️  Average time: ${Math.round(totalTime / testTestimonials.length)}ms`);
  console.log(`   📈 Submission success rate: ${Math.round((successCount / testTestimonials.length) * 100)}%`);
  
  // Translation quality analysis
  console.log('\n🔍 TRANSLATION QUALITY ANALYSIS:');
  const successfulTranslations = translationResults.filter(r => r.verification.success);
  const failedTranslations = translationResults.filter(r => !r.verification.success);
  
  console.log(`   ✅ Quality translations: ${successfulTranslations.length}`);
  console.log(`   ❌ Poor translations: ${failedTranslations.length}`);
  console.log(`   📊 Translation quality rate: ${Math.round((successfulTranslations.length / translationResults.length) * 100)}%`);
  
  if (failedTranslations.length > 0) {
    console.log('\n⚠️  FAILED TRANSLATIONS DETAILS:');
    failedTranslations.forEach(t => {
      console.log(`   ${t.sourceLang} → ${t.targetLang}: ${t.verification.message}`);
      console.log(`   Original: "${t.original.substring(0, 50)}..."`);
      console.log(`   Result: "${t.translated.substring(0, 50)}..."`);
    });
  }
  
  if (successCount === testTestimonials.length && failedTranslations.length === 0) {
    console.log('\n🎉 ALL TESTS PASSED! The enhanced translation system is working perfectly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
  }
}

// Run the test
testEnhancedTranslation().catch(console.error);