import axios from 'axios';

async function loginAndTest() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login first
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Now get bookings
    console.log('🔍 Getting bookings...');
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📋 Bookings found:', bookingsResponse.data.length);
    bookingsResponse.data.forEach((booking, index) => {
      console.log(`  ${index + 1}. ID: ${booking.id}, Date: ${booking.date}, Customer: ${booking.customerName}`);
    });
    
    // Test updating a booking
    if (bookingsResponse.data.length > 0) {
      const firstBooking = bookingsResponse.data[0];
      console.log(`\n✏️  Testing update for booking ID ${firstBooking.id}...`);
      
      const updateResponse = await axios.patch(`http://localhost:8081/api/admin/bookings/${firstBooking.id}`, {
        date: '2025-12-29',
        time: firstBooking.time,
        customerName: firstBooking.customerName,
        email: firstBooking.email,
        phone: firstBooking.phone,
        vehicleMake: firstBooking.vehicleMake,
        vehicleModel: firstBooking.vehicleModel,
        vehicleYear: firstBooking.vehicleYear,
        serviceType: firstBooking.serviceType,
        price: firstBooking.price,
        status: firstBooking.status,
        notes: firstBooking.notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Update successful:', updateResponse.data);
      
      // Verify the update
      console.log('\n🔍 Verifying update...');
      const verifyResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedBooking = verifyResponse.data.find(b => b.id === firstBooking.id);
      console.log('📅 Updated booking date:', updatedBooking.date);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

loginAndTest();