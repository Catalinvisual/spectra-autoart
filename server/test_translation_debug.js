import dotenv from 'dotenv';
dotenv.config();

import { detectLanguageWithDeepL, translateMultipleWithDeepL } from './src/services/deeplTranslationService.js';

async function debugTranslation() {
  try {
    console.log('🧪 Testing DeepL translation debugging...');
    
    const testComment = 'Serviciile oferite au depășit cu mult așteptările mele. Acesta este un test pentru a verifica traducerea în engleză.';
    
    console.log('📋 Original text:', testComment);
    
    // Detect language
    const detectedLang = await detectLanguageWithDeepL(testComment);
    console.log('🔍 Detected language:', detectedLang);
    
    // Test translation to all languages
    const targetLanguages = ['NL', 'EN', 'ES', 'PL', 'RO'];
    const sourceLanguage = detectedLang;
    
    console.log(`🔄 Translating from ${sourceLanguage} to:`, targetLanguages);
    
    const translations = await translateMultipleWithDeepL(testComment, targetLanguages, sourceLanguage);
    
    console.log('📋 Translation results:');
    Object.entries(translations).forEach(([lang, translation]) => {
      console.log(`   ${lang}: "${translation}"`);
    });
    
    console.log('\n✅ Translation debug completed!');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

debugTranslation();