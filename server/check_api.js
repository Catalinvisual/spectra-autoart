import axios from 'axios';

async function checkAPI() {
  console.log('🔍 Checking API endpoints...');
  
  try {
    // Test admin login
    console.log('🔑 Testing admin login...');
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    console.log('✅ Token received:', token.substring(0, 20) + '...');
    
    // Test getting bookings
    console.log('📋 Getting bookings...');
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Bookings retrieved successfully');
    console.log('📊 Response structure:', Object.keys(bookingsResponse.data));
    
    if (bookingsResponse.data.bookings && bookingsResponse.data.bookings.length > 0) {
      const booking = bookingsResponse.data.bookings[0];
      console.log('🎯 First booking data:');
      console.log('  ID:', booking.id);
      console.log('  Name:', booking.name);
      console.log('  Date:', booking.date);
      console.log('  Time:', booking.time);
      console.log('  Services:', booking.services);
      
      // Check if this is demo data or real data
      if (booking.name === 'John Doe' && booking.date.includes('2024-01-15')) {
        console.log('⚠️  This appears to be DEMO data');
      } else if (booking.name === 'Antonia' && booking.date === '2026-01-05') {
        console.log('✅ This appears to be REAL Google Sheets data');
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

checkAPI();