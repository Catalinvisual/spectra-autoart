import axios from 'axios';

async function testSimpleLogin() {
  try {
    console.log('🔐 Testing simple login...');
    
    // Login first
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received:', token.substring(0, 20) + '...');
    
    // Now get bookings
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
      
      // Try a simple date update on the first booking
      const firstBooking = bookingsResponse.data[0];
      console.log(`\n✏️  Testing simple date update for booking ID ${firstBooking.id}...`);
      console.log(`📅 Current date: ${firstBooking.date}`);
      console.log(`📅 New date: 2025-12-29`);
      
      // Only update the date, keep everything else the same
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

testSimpleLogin();