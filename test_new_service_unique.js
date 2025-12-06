import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAzOTkxNiwiZXhwIjoxNzY1MTI2MzE2fQ.gkuUAbdSBSvvWITyG4zWMLul4FA5lGWYpO80GD4HIBc";

const testData = {
  name: "Premium Interior Deep Cleaning Service",
  description: "Complete interior deep cleaning with steam treatment and leather conditioning. Professional stain removal and odor elimination.",
  category: "Interior Detailing",
  duration_minutes: 90,
  is_active: true,
  prices: {
    sedan: {
      price_min: 11,
      price_max: null,
      duration_minutes: 90
    },
    suv: {
      price_min: 22,
      price_max: null,
      duration_minutes: 90
    },
    hatchback: {
      price_min: 33,
      price_max: null,
      duration_minutes: 90
    },
    cabrio: {
      price_min: 44,
      price_max: null,
      duration_minutes: 90
    },
    coupe: {
      price_min: 55,
      price_max: null,
      duration_minutes: 90
    },
    wagon: {
      price_min: 66,
      price_max: null,
      duration_minutes: 90
    },
    van: {
      price_min: 77,
      price_max: null,
      duration_minutes: 90
    },
    break: {
      price_min: 88,
      price_max: null,
      duration_minutes: 90
    }
  }
};

console.log('🧪 Testing /create-with-translation endpoint with unique service name...');
console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

axios.post('http://localhost:8080/api/admin/services/create-with-translation', testData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  timeout: 60000
})
.then(response => {
  console.log('✅ SUCCESS! Service created with translation and prices');
  console.log('📡 Response status:', response.status);
  console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
  
  if (response.data.success && response.data.serviceId) {
    console.log('🎯 Service ID:', response.data.serviceId);
    console.log('💰 Prices should now be synced to Google Sheets!');
  }
})
.catch(error => {
  console.error('❌ ERROR:', error.message);
  if (error.response) {
    console.log('📡 Response status:', error.response.status);
    console.log('📄 Response data:', JSON.stringify(error.response.data, null, 2));
  }
});