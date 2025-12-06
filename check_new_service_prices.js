import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAzOTkxNiwiZXhwIjoxNzY1MTI2MzE2fQ.gkuUAbdSBSvvWITyG4zWMLul4FA5lGWYpO80GD4HIBc";

const serviceId = 176504996;

console.log(`🔍 Checking prices for service ID: ${serviceId}...`);

axios.get(`http://localhost:8080/api/admin/services/${serviceId}/prices`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ SUCCESS! Retrieved service prices');
  console.log('📡 Response status:', response.status);
  console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
  
  if (response.data.success && response.data.prices) {
    const prices = response.data.prices;
    console.log(`\n💰 Found ${prices.length} prices for service ${serviceId}:`);
    prices.forEach(price => {
      console.log(`  - ${price.body_type_key}: €${price.price_min} (${price.duration_minutes} min)`);
    });
  }
})
.catch(error => {
  console.error('❌ ERROR:', error.message);
  if (error.response) {
    console.log('📡 Response status:', error.response.status);
    console.log('📄 Response data:', JSON.stringify(error.response.data, null, 2));
  }
});