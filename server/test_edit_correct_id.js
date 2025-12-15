import axios from 'axios';

async function testEditWithCorrectId() {
  try {
    // Mai întâi obține token admin
    console.log('🔑 Obțin token admin...');
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin token obținut:', token.substring(0, 20) + '...');
    
    // Acum editează programarea cu ID-ul corect
    const bookingId = '1765830082463';
    console.log(`\n✏️ Editez programarea ${bookingId}...`);
    
    const editData = {
      date: '2025-12-21',
      time: '11:00',
      make: 'BMW',
      model: 'X5',
      body: 'suv',
      services: ['Premium Wash', 'Interior Detail'],
      user: {
        name: 'Test User SUV Editat',
        email: 'test@example.com',
        phone: '1234567890'
      }
    };
    
    console.log('📤 Date trimise:', JSON.stringify(editData, null, 2));
    
    const editResponse = await axios.patch(
      `http://localhost:8081/api/admin/bookings/${bookingId}`,
      editData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Programare editată:', editResponse.status);
    console.log('📋 Date programare editată:', JSON.stringify(editResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Eroare:', error.response?.status, error.response?.data || error.message);
    if (error.response?.data) {
      console.error('📋 Detalii eroare:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testEditWithCorrectId();