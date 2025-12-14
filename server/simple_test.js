import axios from 'axios';

async function simpleTest() {
  try {
    console.log('🔄 Simple server test...');
    
    // Test login
    const login = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    const token = login.data.token;
    
    // Get bookings
    const bookings = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📊 Bookings response structure:', Object.keys(bookings.data));
    console.log('📊 Bookings data:', bookings.data);
    
    if (bookings.data.bookings && bookings.data.bookings.length > 0) {
      const booking = bookings.data.bookings[0];
      console.log('🎯 Testing booking:', booking.name, 'Date:', booking.date);
      
      // Update date
      const newDate = '2024-12-29';
      console.log(`🔄 Updating date to ${newDate}...`);
      
      const update = await axios.patch(
        `http://localhost:8081/api/admin/bookings/${booking.id}`,
        { 
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          date: newDate,
          time: booking.time,
          services: booking.services,
          total: booking.total,
          status: booking.status
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log('✅ Update response:', update.data);
      
      // Wait and verify
      await new Promise(r => setTimeout(r, 2000));
      
      const verify = await axios.get('http://localhost:8081/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const updated = verify.data.bookings.find(b => b.id === booking.id);
      console.log('🔍 Verification - Original:', booking.date, 'Updated:', updated.date);
      
      if (updated.date === newDate) {
        console.log('✅ SUCCESS: Date persistence working!');
      } else {
        console.log('❌ FAILURE: Date not persisted');
      }
    } else {
      console.log('❌ No bookings found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', error.response.data);
    }
  }
}

simpleTest();