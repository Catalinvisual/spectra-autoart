import axios from 'axios';

async function testDatePersistence() {
  console.log('🔄 Testing booking date persistence...');
  
  try {
    // Step 1: Login as admin
    console.log('🔑 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:8081/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained');
    
    // Step 2: Get current bookings
    console.log('📋 Getting current bookings...');
    const bookingsResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const bookings = bookingsResponse.data;
    console.log(`Found ${bookings.length} bookings`);
    
    if (bookings.length === 0) {
      console.log('❌ No bookings found to test');
      return;
    }
    
    // Step 3: Select first booking and note current date
    const firstBooking = bookings[0];
    console.log('🎯 Testing with booking:', {
      id: firstBooking.id,
      name: firstBooking.name,
      date: firstBooking.date,
      time: firstBooking.time
    });
    
    const originalDate = firstBooking.date;
    const newDate = '2025-12-29'; // New date to test
    
    // Step 4: Update the booking date
    console.log(`📝 Updating date from ${originalDate} to ${newDate}...`);
    const updateResponse = await axios.patch(`http://localhost:8081/api/admin/bookings/${firstBooking.id}`, {
      date: newDate
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Update response:', updateResponse.data);
    
    // Step 5: Wait a moment and then get bookings again to verify persistence
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Getting bookings again to verify persistence...');
    const verifyResponse = await axios.get('http://localhost:8081/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const updatedBooking = verifyResponse.data.find(b => b.id === firstBooking.id);
    console.log('📊 After refresh:', {
      id: updatedBooking.id,
      name: updatedBooking.name,
      date: updatedBooking.date,
      time: updatedBooking.time
    });
    
    // Step 6: Check if date persisted
    if (updatedBooking.date === newDate) {
      console.log('✅ SUCCESS: Date change persisted after refresh!');
    } else {
      console.log('❌ FAILURE: Date reverted to original:', updatedBooking.date);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testDatePersistence();