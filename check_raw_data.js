import axios from 'axios';

async function checkRawGoogleSheetsData() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login with correct credentials
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Get bookings to see the raw data
    console.log('🔍 Getting bookings to see raw data...');
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📋 Raw booking data:');
    bookingsResponse.data.forEach((booking, index) => {
      console.log(`  ${index + 1}. ID: ${booking.id}`);
      console.log(`     Date: "${booking.date}"`);
      console.log(`     Customer: "${booking.customerName}"`);
      console.log(`     Email: "${booking.email}"`);
      console.log(`     Services: "${booking.services}"`);
      console.log('');
    });
    
    // Let's also check what the server logs show when we try to update
    console.log('📝 Attempting update to trigger debug logs...');
    const firstBooking = bookingsResponse.data[0];
    
    try {
      await axios.patch(`http://localhost:8081/api/admin/bookings/${firstBooking.id}`, {
        ...firstBooking,
        date: '2025-12-29'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.log('❌ Update failed as expected:', error.response?.data?.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRawGoogleSheetsData();