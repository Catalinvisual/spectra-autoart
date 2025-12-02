const axios = require('axios');

const API_URL = 'http://localhost:8080/api';

async function testRequestDetails() {
  console.log('🧪 Testing exact request data sent to server...\n');
  
  try {
    // Test data that mimics the frontend exactly
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
        email: 'test.newsletter@example.com',
        phone: '+1234567890'
      },
      locale: 'en',
      newsletter: true  // This should be included
    };
    
    console.log('📤 Request data that will be sent:');
    console.log(JSON.stringify(bookingData, null, 2));
    console.log('\n📝 Checking if newsletter field exists:', bookingData.hasOwnProperty('newsletter'));
    console.log('📝 Newsletter value:', bookingData.newsletter);
    console.log('📝 Type of newsletter:', typeof bookingData.newsletter);
    
    // Create axios instance with request interceptor to log exact request
    const instance = axios.create();
    
    instance.interceptors.request.use((config) => {
      console.log('\n🔍 Actual request being sent:');
      console.log('URL:', config.url);
      console.log('Method:', config.method);
      console.log('Headers:', config.headers);
      console.log('Data:', JSON.stringify(config.data, null, 2));
      return config;
    });
    
    console.log('\n📡 Sending request...');
    const response = await instance.post(`${API_URL}/public/bookings`, bookingData);
    
    console.log('\n✅ Response received:', response.data);
    
  } catch (error) {
    console.error('\n❌ Error details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.data) {
      console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRequestDetails();