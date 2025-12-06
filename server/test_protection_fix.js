import axios from 'axios';

async function testProtectionFix() {
  console.log('🧪 Testing Google Sheets protection fix...');
  
  const testData = {
    name: 'Test Protection Fix',
    name_en: 'Test Protection Fix',
    name_nl: 'Test Bescherming Fix',
    name_es: 'Prueba Protección Fix',
    name_pl: 'Test Ochrony Fix',
    name_ro: 'Test Protecție Fix',
    description: 'Testing protection fix in Google Sheets',
    description_en: 'Testing protection fix in Google Sheets',
    description_nl: 'Test bescherming fix in Google Sheets',
    description_es: 'Prueba protección fix en Google Sheets',
    description_pl: 'Test ochrony fix w Google Sheets',
    description_ro: 'Test protecție fix în Google Sheets',
    category: 'general',
    duration_minutes: 90,
    is_active: true,
    prices: {
      suv: { price_min: 250, price_max: 350, duration_minutes: 90 },
      berlina: { price_min: 200, price_max: 280, duration_minutes: 90 },
      break: { price_min: 180, price_max: 250, duration_minutes: 90 },
      hatchback: { price_min: 150, price_max: 220, duration_minutes: 90 },
      coupe: { price_min: 160, price_max: 230, duration_minutes: 90 },
      cabrio: { price_min: 170, price_max: 240, duration_minutes: 90 },
      van: { price_min: 190, price_max: 260, duration_minutes: 90 }
    }
  };

  try {
    const response = await axios.post('http://localhost:8080/api/vehicle-services', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTAyNzk4OSwiZXhwIjoxNzY1MTE0Mzg5fQ.dwtebhIMCFx9hKx0aWJzan1e3ahrJ7dF_6jHtv1bVdM'
      }
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Success: Service and prices saved successfully!');
      console.log('🆔 Service ID:', response.data.data.service.id);
      console.log('💰 Number of prices saved:', response.data.data.prices.length);
      
      // Verificăm dacă prețurile au service_id corect
      const prices = response.data.data.prices;
      const serviceId = response.data.data.service.id;
      const allPricesHaveCorrectServiceId = prices.every(price => price.service_id === serviceId);
      
      if (allPricesHaveCorrectServiceId) {
        console.log('✅ All prices have correct service_id!');
      } else {
        console.log('❌ Some prices have incorrect service_id');
      }
    } else {
      console.log('❌ Failed to save service and prices');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testProtectionFix();