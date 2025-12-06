import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function debugServiceCreation() {
  try {
    console.log('🔍 Debug creare serviciu...');
    
    // Obținem token admin
    console.log('🔑 Obținere token admin...');
    const authResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = authResponse.data.token;
    console.log('✅ Token obținut');
    
    // Testăm doar cu un singur preț pentru a simplifica debug
    const testService = {
      name: 'Debug Service',
      description: 'Serviciu simplu pentru debug',
      category: 'Basic',
      duration_minutes: 60,
      prices: [
        {
          body_type_key: 'sedan',
          price_min: 100,
          currency: 'EUR'
        }
      ]
    };
    
    console.log('📤 Trimit date:', JSON.stringify(testService, null, 2));
    
    try {
      const response = await axios.post(`${API_URL}/admin/vehicle-services`, testService, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Răspuns succes:', response.data);
      
    } catch (error) {
      console.log('❌ Eroare detaliată:');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('Headers:', error.response?.headers);
      console.log('Mesaj:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Eroare generală:', error.message);
  }
}

debugServiceCreation();