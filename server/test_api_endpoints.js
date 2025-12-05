// Test the cached translation API endpoint
import axios from 'axios';

async function testCachedTranslationAPI() {
  try {
    const baseURL = 'http://localhost:8080/api';
    
    console.log('🧪 Testing cached translation API endpoints...');
    
    // Test Dutch language
    console.log('\n🇳🇱 Testing Dutch (nl) endpoint...');
    const nlResponse = await axios.get(`${baseURL}/services/cached/translations/nl`);
    console.log('✅ Dutch endpoint working:', nlResponse.data.success);
    console.log(`📊 Found ${nlResponse.data.data.length} services`);
    
    if (nlResponse.data.data.length > 0) {
      console.log('First Dutch service:', {
        name: nlResponse.data.data[0].name,
        description: nlResponse.data.data[0].description?.substring(0, 50) + '...'
      });
    }
    
    // Test English language
    console.log('\n🇬🇧 Testing English (en) endpoint...');
    const enResponse = await axios.get(`${baseURL}/services/cached/translations/en`);
    console.log('✅ English endpoint working:', enResponse.data.success);
    console.log(`📊 Found ${enResponse.data.data.length} services`);
    
    if (enResponse.data.data.length > 0) {
      console.log('First English service:', {
        name: enResponse.data.data[0].name,
        description: enResponse.data.data[0].description?.substring(0, 50) + '...'
      });
    }
    
    // Test cache stats
    console.log('\n📊 Testing cache stats endpoint...');
    const statsResponse = await axios.get(`${baseURL}/services/cached/cache/stats`);
    console.log('✅ Cache stats endpoint working:', statsResponse.data.success);
    console.log('Cache stats:', statsResponse.data.data);
    
    console.log('\n🎉 All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testCachedTranslationAPI();