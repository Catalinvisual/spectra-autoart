const axios = require('axios');

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTcwMzcwLCJleHAiOjE3NjU2NTY3NzB9.HjmuAFFgQbDIP5UwjlK_M_pndjdIPemuaLv3Z8D_d9g';

async function testPatchWithErrorHandling() {
  try {
    console.log('🧪 Testing PATCH request with detailed error handling...');
    
    const response = await axios.patch('http://localhost:8081/api/admin/bookings/1765210107161', 
      {
        date: '2025-12-30',
        time: '16:45',
        status: 'confirmed'
      },
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000,
        validateStatus: function (status) {
          return status >= 200 && status < 300; // default
        }
      }
    );

    console.log('✅ PATCH Response Status:', response.status);
    console.log('✅ PATCH Response Data:', response.data);
    
  } catch (error) {
    console.error('❌ PATCH Error Details:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testPatchWithErrorHandling();