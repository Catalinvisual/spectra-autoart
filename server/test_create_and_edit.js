import axios from 'axios';

async function testCreateAndEdit() {
  try {
    // Mai întâi obține token admin
    console.log('🔑 Obțin token admin...');
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin token obținut:', token.substring(0, 20) + '...');
    
    // Creează o programare nouă
    console.log('\n➕ Creez o programare nouă...');
    const newBooking = {
      date: '2025-12-20',
      time: '10:00',
      make: 'BMW',
      model: 'X5',
      body: 'suv',
      services: ['Premium Wash'],
      user: {
        name: 'Test User SUV',
        email: 'test@example.com',
        phone: '1234567890'
      }
    };
    
    const createResponse = await axios.post(
      'http://localhost:8081/api/public/bookings',
      newBooking
    );
    
    console.log('✅ Programare creată:', createResponse.status);
    console.log('📋 ID programare:', createResponse.data.id);
    console.log('📋 Date programare:', JSON.stringify(createResponse.data, null, 2));
    
    const bookingId = createResponse.data.id;
    
    // Acum editează programarea
    console.log('\n✏️ Editez programarea...');
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

testCreateAndEdit();