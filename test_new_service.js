const axios = require('axios');

const API_URL = 'http://localhost:8080/api/admin/services/create-with-translation';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1MDM5MDMxLCJleHAiOjE3NjUxMjU0MzF9.GMOezuJVOwCwNejplVTQs7Jqbjt6SMvh0Vn7clBCkCE';

const testData = {
  "name": "Test Service Nou Interiour Cleaning",
  "description": "Grondige stofzuigbeurt van stoelen, tapijten en kofferbak Dieptereiniging van bekleding en leerbehandeling Verwijderen van vlekken en onaangename geuren",
  "category": "Interiour Detailing",
  "duration_minutes": 60,
  "is_active": true,
  "prices": {
    "sedan": {
      "price_min": 11,
      "price_max": null,
      "duration_minutes": 60
    },
    "suv": {
      "price_min": 22,
      "price_max": null,
      "duration_minutes": 60
    },
    "hatchback": {
      "price_min": 33,
      "price_max": null,
      "duration_minutes": 60
    },
    "cabrio": {
      "price_min": 44,
      "price_max": null,
      "duration_minutes": 60
    },
    "coupe": {
      "price_min": 55,
      "price_max": null,
      "duration_minutes": 60
    },
    "wagon": {
      "price_min": 66,
      "price_max": null,
      "duration_minutes": 60
    },
    "van": {
      "price_min": 77,
      "price_max": null,
      "duration_minutes": 60
    },
    "break": {
      "price_min": 88,
      "price_max": null,
      "duration_minutes": 60
    }
  }
};

async function testCreateService() {
  try {
    console.log('🧪 Testing /create-with-translation endpoint with new service name...');
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(API_URL, testData, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 seconds timeout
    });
    
    console.log('✅ SUCCESS! Full response data:');
    console.log('📄 Complete response:', JSON.stringify(response.data, null, 2));
    
    // Check if we have the service ID
    if (response.data.success && response.data.service) {
      console.log(`🎉 Service created with ID: ${response.data.service.id}`);
      console.log(`📝 Service slug: ${response.data.service.slug}`);
      
      // Now check Google Sheets for the prices
      console.log('\n🔍 Checking Google Sheets for prices...');
      const { execSync } = require('child_process');
      const checkCommand = `node server/check_service_prices_direct_fixed.js "${response.data.service.slug}"`;
      console.log(`Running: ${checkCommand}`);
      execSync(checkCommand, { stdio: 'inherit' });
    }
    
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