const axios = require('axios');

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTcwMzcwLCJleHAiOjE3NjU2NTY3NzB9.HjmuAFFgQbDIP5UwjlK_M_pndjdIPemuaLv3Z8D_d9g';

async function testPatchRequestWithMoreDebug() {
  try {
    console.log('🧪 Testing PATCH request with detailed debugging...');
    
    // First, let's get the current booking data to see the exact structure
    console.log('📋 Getting current booking data...');
    const getResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    const bookings = getResponse.data;
    const targetBooking = bookings.find(b => b.id === '1765210107161');
    
    if (targetBooking) {
      console.log('📝 Current booking details:');
      console.log(`   ID: ${targetBooking.id}`);
      console.log(`   Date: ${targetBooking.date}`);
      console.log(`   Time: ${targetBooking.time}`);
      console.log(`   Status: ${targetBooking.status}`);
      console.log(`   Row Index: ${targetBooking.rowIndex || 'unknown'}`);
    }

    // Now test the PATCH request
    console.log('\n🔄 Testing PATCH request...');
    const patchResponse = await axios.patch('http://localhost:8081/api/admin/bookings/1765210107161', 
      {
        date: '2025-12-30',
        time: '16:45',
        status: 'confirmed'
      },
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ PATCH Response:', patchResponse.data);
    
    // Wait and check again
    setTimeout(async () => {
      console.log('\n🔍 Checking if booking was updated...');
      const checkResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });

      const updatedBookings = checkResponse.data;
      const updatedBooking = updatedBookings.find(b => b.id === '1765210107161');
      
      if (updatedBooking) {
        console.log('📋 Updated booking details:');
        console.log(`   Date: ${updatedBooking.date}`);
        console.log(`   Time: ${updatedBooking.time}`);
        console.log(`   Status: ${updatedBooking.status}`);
        
        if (updatedBooking.date === '2025-12-30') {
          console.log('✅ SUCCESS: Booking date was updated!');
        } else {
          console.log('❌ FAILED: Booking date was not updated');
        }
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPatchRequestWithMoreDebug();