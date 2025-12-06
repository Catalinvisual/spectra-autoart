// Test simplificat cu credențiale default
const axios = require('axios');

const LOGIN_URL = 'http://localhost:8080/api/admin/auth/login';
const API_URL = 'http://localhost:8080/api/admin/services/create-with-translation';

// Credențiale default (știu că funcționează din alte teste)
const loginData = {
  email: 'admin@example.com',
  password: 'admin123'
};

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

async function getFreshToken() {
  try {
    console.log('🔑 Getting fresh token...');
    console.log('📧 Using email:', loginData.email);
    const response = await axios.post(LOGIN_URL, loginData);
    console.log('✅ Token obtained successfully');
    return response.data.token;
  } catch (error) {
    console.error('❌ Error getting token:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('💡 Suggestion: Check if ADMIN_DEFAULT_EMAIL and ADMIN_DEFAULT_PASSWORD are set in environment variables');
      console.log('💡 Current server might be using different credentials than admin@example.com/admin123');
    }
    throw error;
  }
}

async function testCreateService() {
  try {
    const token = await getFreshToken();
    
    console.log('🧪 Testing /create-with-translation endpoint...');
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(API_URL, testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
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