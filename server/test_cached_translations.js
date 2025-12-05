import cachedTranslationService from './src/services/cachedTranslationService.js';
import GoogleSheetsService from './src/services/googleSheetsService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testCachedTranslations() {
  try {
    console.log('🧪 Testing cached translation service...');
    
    // Initialize Google Sheets service
    await GoogleSheetsService.initialize();
    console.log('✅ Google Sheets service initialized');
    
    // Test each language
    const languages = ['nl', 'en', 'es', 'pl', 'ro'];
    
    for (const lang of languages) {
      console.log(`\n📋 Testing language: ${lang}`);
      const services = await cachedTranslationService.getServicesWithTranslations(lang);
      console.log(`✅ Found ${services.length} services for ${lang}`);
      
      if (services.length > 0) {
        console.log('First service:', {
          id: services[0].id,
          name: services[0].name,
          description: services[0].description.substring(0, 50) + '...',
          category: services[0].category,
          is_active: services[0].is_active
        });
      }
    }
    
    // Test cache stats
    const stats = cachedTranslationService.getCacheStats();
    console.log('\n📊 Cache stats:', stats);
    
  } catch (error) {
    console.error('❌ Error testing cached translations:', error);
  }
}

testCachedTranslations();