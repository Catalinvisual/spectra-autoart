const axios = require('axios');

const API_URL = 'http://localhost:8080/api';

async function simpleTest() {
  console.log('🧪 Simple connection test...\n');
  
  try {
    // Test basic connection
    const response = await axios.get(`${API_URL}/public/services`);
    console.log('✅ Connection successful - services endpoint works');
    console.log('Services count:', response.data.data?.length || 0);
    
    // Test booking creation with minimal data
    const bookingData = {
      date: '2025-12-01',
      time: '14:30',
      make: 'BMW',
      model: 'Seria 3',
      type: 'Sedan',
      body: 'Sedan',
      services: ['service-1'],
      user: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890'
      },
      locale: 'en',
      newsletter: true
    };
    
    console.log('\n📤 Testing booking creation...');
    const bookingResponse = await axios.post(`${API_URL}/public/bookings`, bookingData);
    
    console.log('✅ Booking response:', bookingResponse.data);
    
  } catch (error) {
    console.error('❌ Error details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

simpleTest();