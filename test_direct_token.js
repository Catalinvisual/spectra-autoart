// Test direct cu token JWT generat
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/admin/services/create-with-translation';

// Token generat
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1MDM3OTc3LCJleHAiOjE3NjUwNDE1Nzd9.bBBqz1dpVa2I6CF-PKf9R26eFFGq0Nsl-_wH2WOgNBc';

// Datele tale exacte
const testData = {
  name: 'Basis Informatie Naam Interieurreiniging Premium',
  description: 'Grondige stofzuigbeurt van stoelen, tapijten en kofferbak Dieptereiniging van bekleding en leerbehandeling Verwijderen van vlekken en onaangename geuren Reiniging en verzorging van dashboard, ventilatieopeningen en ramen',
  category: 'Interiour Detailing',
  duration_minutes: 60,
  is_active: true,
  prices: {
    sedan: { price_min: 11, price_max: null, duration_minutes: 60 },
    suv: { price_min: 22, price_max: null, duration_minutes: 60 },
    hatchback: { price_min: 33, price_max: null, duration_minutes: 60 },
    cabrio: { price_min: 44, price_max: null, duration_minutes: 60 },
    coupe: { price_min: 55, price_max: null, duration_minutes: 60 },
    wagon: { price_min: 66, price_max: null, duration_minutes: 60 },
    van: { price_min: 77, price_max: null, duration_minutes: 60 },
    break: { price_min: 88, price_max: null, duration_minutes: 60 }
  }
};

async function testCreateService() {
  try {
    console.log('🧪 Testing /create-with-translation endpoint...');
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(API_URL, testData, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 seconds timeout
    });
    
    console.log('✅ SUCCESS! Service created with translation:');
    console.log('🆔 Service ID:', response.data.service.id);
    console.log('📝 Service name:', response.data.service.name);
    console.log('💰 Prices created:', response.data.prices.length);
    
    console.log('\n📊 Final prices in response:');
    response.data.prices.forEach(price => {
      console.log(`   ${price.body_type_key}: €${price.price_min} (Body Type ID: ${price.body_type_id})`);
    });
    
    console.log('\n✅ Test completed successfully!');
    console.log('📝 All 8 body types should now have their correct prices in Google Sheets.');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message || error);
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📡 No response received');
    } else {
      console.error('📄 Error details:', error);
    }
  }
}

testCreateService();