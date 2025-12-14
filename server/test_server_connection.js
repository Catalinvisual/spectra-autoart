import axios from 'axios';

async function testServerConnection() {
  console.log('🔍 Testing server connection on port 8081...');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:8081/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test admin login
    console.log('🔑 Testing admin login...');
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    
    // Test getting bookings
    console.log('📋 Getting bookings...');
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`📊 Found ${bookingsResponse.data.bookings.length} bookings`);
    
    if (bookingsResponse.data.bookings.length > 0) {
      const firstBooking = bookingsResponse.data.bookings[0];
      console.log('🎯 First booking:', {
        id: firstBooking.id,
        name: firstBooking.name,
        date: firstBooking.date
      });
      
      // Now test the date update
      console.log('\n🔄 Testing date update...');
      const newDate = '2024-12-29';
      console.log(`Updating date from ${firstBooking.date} to ${newDate}`);
      
      const updateResponse = await axios.patch(
        `http://localhost:8081/api/admin/bookings/${firstBooking.id}`,
        {
          name: firstBooking.name,
          email: firstBooking.email,
          phone: firstBooking.phone,
          date: newDate,
          time: firstBooking.time,
          services: firstBooking.services,
          total: firstBooking.total,
          status: firstBooking.status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('✅ Update response:', updateResponse.data);
      
      // Wait and verify
      console.log('⏳ Waiting 2 seconds before verification...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('🔍 Verifying persistence...');
      const verifyResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedBookings = verifyResponse.data.bookings;
      const updatedBooking = updatedBookings.find(b => b.id === firstBooking.id);
      
      if (updatedBooking) {
        console.log('📋 Verification result:');
        console.log('  Original date:', firstBooking.date);
        console.log('  Expected date:', newDate);
        console.log('  Actual date:', updatedBooking.date);
        
        if (updatedBooking.date === newDate) {
          console.log('✅ SUCCESS: Date persistence is working correctly!');
        } else {
          console.log('❌ FAILURE: Date did not persist after refresh');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testServerConnection();