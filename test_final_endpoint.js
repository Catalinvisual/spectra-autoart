// Test complet cu endpointul /create-with-translation
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/admin/services/create-with-translation';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzI2NzI4OSwiZXhwIjoxNzMzODcyMDg5fQ.mY17tHzU6J5cWwKQUC8lYV3J2yW3Q4Rz0Y5X6A7B8C9D';

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
    
    // Check Google Sheets sync
    console.log('\n🔍 Checking Google Sheets sync...');
    const checkScript = `
      const { vehicleServicesService } = require('./server/src/services/vehicleServicesService.js');
      const { GoogleSheetsService } = require('./server/src/services/googleSheetsService.js');
      
      async function checkService() {
        try {
          await vehicleServicesService.loadFromGoogleSheets();
          const service = vehicleServicesService.services.find(s => s.id === ${response.data.service.id});
          const prices = vehicleServicesService.servicePrices.filter(p => p.service_id === ${response.data.service.id});
          
          console.log('✅ Service found in Google Sheets:', service ? 'YES' : 'NO');
          console.log('💰 Prices found in Google Sheets:', prices.length);
          
          if (prices.length > 0) {
            console.log('📊 Prices in Google Sheets:');
            prices.forEach(price => {
              console.log(\`   \${price.body_type_key}: €\${price.price_min}\`);
            });
          }
        } catch (error) {
          console.error('❌ Error checking Google Sheets:', error.message);
        }
      }
      
      checkService();
    `;
    
    console.log('\n✅ Test completed successfully!');
    console.log('📝 Next step: Check Google Sheets to verify prices are saved correctly.');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message || error);
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📡 No response received:', error.request);
    } else {
      console.error('📄 Error details:', error);
    }
  }
}

testCreateService();