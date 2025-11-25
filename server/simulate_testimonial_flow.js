import { translateMultipleWithDeepL, detectLanguageWithDeepL } from './src/services/deeplTranslationService.js';
import GoogleSheetsService from './src/services/googleSheetsService.js';

async function simulateTestimonialSubmission() {
  console.log('🧪 Simulating testimonial submission process...\n');
  
  try {
    // Ensure Google Sheets service is initialized
    if (!GoogleSheetsService.isInitialized) {
      console.log('🔄 Initializing Google Sheets service...');
      await GoogleSheetsService.initialize();
    }
    
    // Simulate the testimonial data from the user
    const testimonialData = {
      name: 'Test User',
      rating: 5,
      comment: 'Servicii excelente! Recomand cu căldură această companie pentru profesionalismul și atenția la detalii.'
    };
    
    console.log('📝 Original testimonial:');
    console.log(`   Name: ${testimonialData.name}`);
    console.log(`   Rating: ${testimonialData.rating}`);
    console.log(`   Comment: ${testimonialData.comment}`);
    
    // Step 1: Detect language
    console.log('\n🔍 Step 1: Detecting language...');
    const detectedLanguage = await detectLanguageWithDeepL(testimonialData.comment);
    console.log(`   Detected language: ${detectedLanguage}`);
    
    // Step 2: Translate to all languages
    console.log('\n🔄 Step 2: Translating to all languages...');
    const translations = {};
    const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
    
    // Initialize with original text
    for (const lang of targetLanguages) {
      translations[lang] = testimonialData.comment;
    }
    
    // Translate to other languages (excluding detected language)
    const languagesToTranslate = targetLanguages.filter(lang => lang !== detectedLanguage);
    console.log(`   Languages to translate: ${languagesToTranslate.join(', ')}`);
    
    if (languagesToTranslate.length > 0) {
      const deeplTranslations = await translateMultipleWithDeepL(testimonialData.comment, languagesToTranslate, detectedLanguage);
      
      Object.entries(deeplTranslations).forEach(([lang, translation]) => {
        translations[lang] = translation;
        console.log(`   ✅ Translated to ${lang}: ${translation.substring(0, 50)}...`);
      });
    }
    
    // Step 3: Prepare data for Google Sheets
    console.log('\n📊 Step 3: Preparing data for Google Sheets...');
    const currentDate = new Date().toISOString().split('T')[0];
    const newTestimonial = [
      `test-${Date.now()}`,
      testimonialData.name,
      testimonialData.rating.toString(),
      translations['NL'],
      translations['EN'],
      translations['ES'],
      translations['PL'],
      translations['RO'],
      'true',
      currentDate
    ];
    
    console.log('   Prepared testimonial data:');
    console.log(`   - ID: ${newTestimonial[0]}`);
    console.log(`   - Name: ${newTestimonial[1]}`);
    console.log(`   - Rating: ${newTestimonial[2]}`);
    console.log(`   - NL: ${newTestimonial[3].substring(0, 50)}...`);
    console.log(`   - EN: ${newTestimonial[4].substring(0, 50)}...`);
    console.log(`   - ES: ${newTestimonial[5].substring(0, 50)}...`);
    console.log(`   - PL: ${newTestimonial[6].substring(0, 50)}...`);
    console.log(`   - RO: ${newTestimonial[7].substring(0, 50)}...`);
    
    // Step 4: Save to Google Sheets
    console.log('\n💾 Step 4: Saving to Google Sheets...');
    await GoogleSheetsService.appendData('Testimonials', newTestimonial);
    console.log('   ✅ Successfully saved to Google Sheets!');
    
    console.log('\n🎉 Testimonial submission simulation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in testimonial submission simulation:', error.message);
    console.error('Stack:', error.stack);
  }
}

simulateTestimonialSubmission();