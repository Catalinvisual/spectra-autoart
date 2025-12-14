import axios from 'axios';

async function testBookingUpdate() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login with correct credentials
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Get bookings
    console.log('🔍 Getting bookings...');
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📋 Bookings found:', bookingsResponse.data.length);
    if (bookingsResponse.data.length > 0) {
      bookingsResponse.data.forEach((booking, index) => {
        console.log(`  ${index + 1}. ID: ${booking.id}, Date: ${booking.date}, Customer: ${booking.customerName}`);
      });
      
      // Test updating the first booking
      const firstBooking = bookingsResponse.data[0];
      console.log(`\n✏️  Testing update for booking ID ${firstBooking.id}...`);
      console.log(`📅 Current date: ${firstBooking.date}`);
      console.log(`📅 New date: 2025-12-29`);
      
      const updateData = {
        ...firstBooking,
        date: '2025-12-29'
      };
      
      console.log('📤 Sending update request...');
      const updateResponse = await axios.patch(`http://localhost:8081/api/admin/bookings/${firstBooking.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Update response:', updateResponse.data);
      
      // Verify the update by fetching bookings again
      console.log('\n🔍 Verifying update...');
      const verifyResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedBooking = verifyResponse.data.find(b => b.id === firstBooking.id);
      console.log('📅 Updated booking date:', updatedBooking.date);
      
      if (updatedBooking.date === '2025-12-29') {
        console.log('✅ SUCCESS: Date persistence is working!');
      } else {
        console.log('❌ FAILURE: Date did not persist after refresh');
      }
      
    } else {
      console.log('⚠️  No bookings found to test with');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
    }
  }
}

testBookingUpdate();