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

async function testAPIEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test 1: Create a service with translation via API simulation
    console.log('1️⃣ Testing service creation with translation...');
    
    const testService = {
      name: 'Detailing Interior',
      description: 'Curățare profundă a interiorului mașinii cu extracție și deodorizare',
      category: 'interior',
      duration_minutes: 120,
      is_active: true
    };

    console.log('📋 Test service data:', testService);
    
    const translationResult = await serviceTranslationService.translateAndSaveService(testService);
    
    console.log('✅ Translation completed successfully!');
    console.log('🆔 Service ID:', translationResult.serviceId);
    
    // Test 2: Get services for different languages
    console.log('\n2️⃣ Testing cached translation retrieval...');
    
    // Simulate API calls for different languages
    const languages = ['nl', 'en', 'es', 'pl', 'ro'];
    
    for (const lang of languages) {
      console.log(`\n📋 Testing language: ${lang}`);
      
      // This simulates what the API endpoint would return
      const services = await cachedTranslationService.getServicesWithTranslations(lang);
      console.log(`✅ Found ${services.length} services for ${lang}`);
      
      if (services.length > 0) {
        const firstService = services[0];
        console.log(`📝 First service in ${lang}:`, {
          name: firstService.name,
          description: firstService.description.substring(0, 50) + '...',
          category: firstService.category
        });
      }
    }
    
    console.log('\n🎉 API endpoint simulation completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
  }
}

// Import the cached service here
import cachedTranslationService from '../src/services/cachedTranslationService.js';

// Run the test
testAPIEndpoints();