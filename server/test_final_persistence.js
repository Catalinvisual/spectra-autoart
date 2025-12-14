import axios from 'axios';

async function getFreshToken() {
  try {
    console.log('🔑 Getting fresh admin token...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/admin/auth/login', {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    return loginResponse.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

async function testBookingDatePersistence() {
  console.log('🔄 Testing booking date persistence...');
  
  try {
    // Get fresh token first
    const token = await getFreshToken();
    if (!token) {
      console.log('❌ Cannot proceed without valid token');
      return;
    }
    
    // Step 1: Get current bookings
    console.log('📋 Step 1: Getting current bookings...');
    const bookingsResponse = await axios.get('http://localhost:3001/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const bookings = bookingsResponse.data.bookings;
    console.log(`📊 Found ${bookings.length} bookings`);
    
    if (bookings.length === 0) {
      console.log('❌ No bookings found to test');
      return;
    }
    
    // Use the first booking for testing
    const testBooking = bookings[0];
    console.log('🎯 Testing with booking:', {
      id: testBooking.id,
      name: testBooking.name,
      currentDate: testBooking.date
    });
    
    // Step 2: Update the booking date
    const newDate = '2024-12-29';
    console.log(`📅 Step 2: Updating date from ${testBooking.date} to ${newDate}...`);
    
    const updateResponse = await axios.patch(
      `http://localhost:3001/api/admin/bookings/${testBooking.id}`,
      {
        name: testBooking.name,
        email: testBooking.email,
        phone: testBooking.phone,
        date: newDate,
        time: testBooking.time,
        services: testBooking.services,
        total: testBooking.total,
        status: testBooking.status
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Update response:', updateResponse.data);
    
    // Step 3: Wait a moment and then refresh to verify persistence
    console.log('⏳ Step 3: Waiting 2 seconds before verification...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 4: Get bookings again to verify persistence
    console.log('🔍 Step 4: Getting bookings again to verify persistence...');
    const verifyResponse = await axios.get('http://localhost:3001/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const updatedBookings = verifyResponse.data.bookings;
    const updatedBooking = updatedBookings.find(b => b.id === testBooking.id);
    
    if (updatedBooking) {
      console.log('📋 Verification result:');
      console.log('  Original date:', testBooking.date);
      console.log('  Expected date:', newDate);
      console.log('  Actual date:', updatedBooking.date);
      
      if (updatedBooking.date === newDate) {
        console.log('✅ SUCCESS: Date persistence is working correctly!');
      } else {
        console.log('❌ FAILURE: Date did not persist after refresh');
        console.log('  This indicates the booking data is still being reset');
      }
    } else {
      console.log('❌ FAILURE: Booking not found after refresh');
    }
    
  } catch (error) {
    console.error('❌ Error testing booking date persistence:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testBookingDatePersistence();