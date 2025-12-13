const axios = require('axios');

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTcyODcwLCJleHAiOjE3NjU2NTkyNzB9.1wnckfmTNsFOwCZi48qq_I5GTqrK1RxbS9mgLtvIXAo';

async function simplePatchTest() {
  try {
    console.log('🧪 Testing simple PATCH request...');
    
    const response = await axios.patch('http://localhost:8081/api/admin/bookings/1765210107161', 
      {
        date: '2025-12-30',
        time: '14:30',
        status: 'confirmed'
      },
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ PATCH Response:', response.data);
    
  } catch (error) {
    console.error('❌ PATCH Error details:');
    console.error('Error message:', error.message);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Request URL:', error.config?.url);
    console.error('Request method:', error.config?.method);
  }
}

simplePatchTest();