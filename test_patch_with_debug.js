const axios = require('axios');

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTcwMzcwLCJleHAiOjE3NjU2NTY3NzB9.HjmuAFFgQbDIP5UwjlK_M_pndjdIPemuaLv3Z8D_d9g';

async function testPatchRequest() {
  try {
    console.log('🧪 Testing PATCH request with corrected row index...');
    
    // Test updating booking ID 1765210107161 from 2025-12-23 to 2025-12-30
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
        }
      }
    );

    console.log('✅ PATCH Response:', response.data);
    
    // Wait a bit then check if the update was applied
    setTimeout(async () => {
      console.log('\n🔍 Checking if booking was updated in Google Sheets...');
      await checkBookingData();
    }, 3000);
    
  } catch (error) {
    console.error('❌ PATCH Error:', error.response?.data || error.message);
  }
}

async function checkBookingData() {
  try {
    const response = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    const bookings = response.data;
    const updatedBooking = bookings.find(b => b.id === '1765210107161');
    
    if (updatedBooking) {
      console.log('📋 Updated booking details:');
      console.log(`   Date: ${updatedBooking.date}`);
      console.log(`   Time: ${updatedBooking.time}`);
      console.log(`   Status: ${updatedBooking.status}`);
      
      if (updatedBooking.date === '2025-12-30') {
        console.log('✅ SUCCESS: Booking date was updated to 2025-12-30!');
      } else {
        console.log('❌ FAILED: Booking date was not updated correctly');
      }
    } else {
      console.log('❌ Booking not found');
    }
    
  } catch (error) {
    console.error('❌ Error checking booking data:', error.message);
  }
}

testPatchRequest();