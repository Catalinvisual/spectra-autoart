import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function testServiceWithPrices() {
  try {
    console.log('🧪 Testare salvare serviciu cu prețuri...');
    
    // Obținem token admin
    console.log('🔑 Obținere token admin...');
    const authResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = authResponse.data.token;
    console.log('✅ Token obținut');
    
    // Creăm un serviciu de test cu prețuri
    const testService = {
      name: 'Test Service With Prices',
      description: 'Acesta este un serviciu de test pentru a verifica salvarea prețurilor',
      category: 'Premium',
      duration_minutes: 120,
      prices: [
        {
          body_type_key: 'sedan',
          price_min: 150,
          currency: 'EUR',
          duration_minutes: 120,
          promo_percent: 0,
          is_active: true
        },
        {
          body_type_key: 'hatchback',
          price_min: 130,
          currency: 'EUR',
          duration_minutes: 100,
          promo_percent: 5,
          is_active: true
        },
        {
          body_type_key: 'suv',
          price_min: 200,
          currency: 'EUR',
          duration_minutes: 150,
          promo_percent: 0,
          is_active: true
        }
      ]
    };
    
    console.log('➕ Adăugare serviciu cu prețuri...');
    const response = await axios.post(`${API_URL}/admin/vehicle-services`, testService, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Serviciu creat:', response.data);
    const createdServiceId = response.data.service?.id;
    
    if (!createdServiceId) {
      console.log('❌ Eroare: ID serviciu nu a fost returnat');
      return;
    }
    
    // Așteptăm puțin pentru procesare
    console.log('⏳ Aștept 3 secunde pentru procesare...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificăm dacă prețurile au fost salvate
    console.log('🔍 Verificare prețuri salvate...');
    const verifyResponse = await axios.get(`${API_URL}/vehicle-services/${createdServiceId}?include=prices`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const serviceWithPrices = verifyResponse.data;
    console.log('✅ Serviciu găsit cu prețuri:', {
      id: serviceWithPrices.id,
      name: serviceWithPrices.name,
      pricesCount: serviceWithPrices.prices?.length || 0,
      prices: serviceWithPrices.prices
    });
    
    // Verificăm direct în Google Sheets
    console.log('🔍 Verificare directă în Google Sheets...');
    const sheetsResponse = await axios.get(`${API_URL}/admin/test-sheets-structure`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const { pricesData } = sheetsResponse.data.data;
    const ourServicePrices = pricesData.filter(price => price.service_id === createdServiceId || price.Service_ID === createdServiceId);
    
    console.log('✅ Prețuri găsite în Google Sheets:', ourServicePrices.length);
    ourServicePrices.forEach(price => {
      console.log(`  - ${price.body_type_key || price.Body_Type_Key}: €${price.price_min || price.Price_Min}`);
    });
    
    if (ourServicePrices.length === testService.prices.length) {
      console.log('🎉 SUCCESS: Toate prețurile au fost salvate corect!');
    } else {
      console.log(`❌ PROBLEMĂ: Așteptat ${testService.prices.length} prețuri, găsit ${ourServicePrices.length}`);
    }
    
  } catch (error) {
    console.error('❌ Eroare:', error.response?.data || error.message);
  }
}

testServiceWithPrices();