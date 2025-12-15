import axios from 'axios';

async function testAdminEdit() {
  try {
    // Mai întâi obține token admin
    console.log('🔑 Obțin token admin...');
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin token obținut:', token.substring(0, 20) + '...');
    
    // Acum testează editarea unei programări
    const bookingData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      date: '2025-12-20',
      time: '10:00',
      make: 'BMW',
      model: 'X5',
      body: 'suv',
      services: ['Premium Wash']
    };
    
    console.log('\n📤 Trimit date:', JSON.stringify(bookingData, null, 2));
    
    const response = await axios.patch(
      'http://localhost:8081/api/admin/bookings/176505237',
      bookingData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ Răspuns:', response.status);
    console.log('📋 Date primite:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Eroare:', error.response?.status, error.response?.data || error.message);
    if (error.response?.data) {
      console.error('📋 Detalii eroare:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAdminEdit();