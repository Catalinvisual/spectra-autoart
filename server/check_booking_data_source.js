import axios from 'axios';

async function checkBookingData() {
  console.log('🔍 Checking booking data source...');
  
  try {
    // Test admin login
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    
    // Test getting bookings
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const bookings = bookingsResponse.data;
    console.log('📊 Number of bookings:', bookings.length);
    
    if (bookings.length > 0) {
      console.log('🎯 First booking details:');
      console.log('  ID:', bookings[0].id);
      console.log('  Name:', bookings[0].name);
      console.log('  Date:', bookings[0].date);
      console.log('  Time:', bookings[0].time);
      console.log('  Services:', JSON.stringify(bookings[0].services));
      
      // Check if this is demo data
      if (bookings[0].name === 'John Doe') {
        console.log('⚠️  This is DEMO data - server is in demo mode');
      } else if (bookings[0].name === 'Antonia') {
        console.log('✅ This is REAL Google Sheets data');
      } else {
        console.log('🤔 Unknown data source');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkBookingData();