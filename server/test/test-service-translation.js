import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

// Import services
import serviceTranslationService from '../src/services/serviceTranslationService.js';
import cachedTranslationService from '../src/services/cachedTranslationService.js';

async function testServiceTranslation() {
  console.log('🧪 Testing service translation functionality...\n');

  try {
    // Test 1: Create a service with translation
    console.log('1️⃣ Testing service creation with translation...');
    
    const testService = {
      name: 'Spălare Premium',
      description: 'Spălare completă exterioară cu produse de calitate superioară',
      category: 'exterior',
      duration_minutes: 45,
      is_active: true
    };

    console.log('📋 Test service data:', testService);
    
    const translationResult = await serviceTranslationService.translateAndSaveService(testService);
    
    console.log('✅ Translation completed successfully!');
    console.log('🆔 Service ID:', translationResult.serviceId);
    console.log('🔍 Source language:', translationResult.sourceLanguage);
    console.log('🌍 Translations:', JSON.stringify(translationResult.translations, null, 2));
    
    // Test 2: Retrieve cached translations
    console.log('\n2️⃣ Testing cached translation retrieval...');
    
    const languages = ['nl', 'en', 'es', 'pl', 'ro'];
    
    for (const lang of languages) {
      console.log(`\n📋 Testing language: ${lang}`);
      const cachedServices = await cachedTranslationService.getServicesWithTranslations(lang);
      console.log(`✅ Found ${cachedServices.length} services for ${lang}`);
      
      if (cachedServices.length > 0) {
        const firstService = cachedServices[0];
        console.log(`📝 First service in ${lang}:`, {
          name: firstService.name,
          description: firstService.description.substring(0, 50) + '...',
          category: firstService.category
        });
      }
    }
    
    // Test 3: Cache statistics
    console.log('\n3️⃣ Testing cache statistics...');
    const cacheStats = cachedTranslationService.getCacheStats();
    console.log('📊 Cache stats:', cacheStats);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testServiceTranslation();