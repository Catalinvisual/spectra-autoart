import cachedTranslationService from './server/src/services/cachedTranslationService.js';

async function testCachedService() {
  try {
    console.log('Testing cached translation service...');
    
    // Clear cache first
    cachedTranslationService.clearCache();
    console.log('Cache cleared');
    
    // Get services with translations
    const services = await cachedTranslationService.getServicesWithTranslations('nl', false);
    
    console.log(`Found ${services.length} services`);
    
    if (services.length > 0) {
      const service = services[0];
      console.log('First service:', {
        id: service.id,
        name: service.name,
        pricesCount: service.prices ? service.prices.length : 0,
        prices: service.prices
      });
    }
    
    // Check cache stats
    const stats = cachedTranslationService.getCacheStats();
    console.log('Cache stats:', stats);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCachedService();