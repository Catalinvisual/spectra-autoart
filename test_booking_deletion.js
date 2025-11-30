// Test pentru ștergerea booking-urilor
const axios = require('axios');

const API_URL = 'http://localhost:8080/api';

async function testBookingDeletion() {
  try {
    console.log('🔄 Testing booking deletion...');
    
    // 1. Login admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@spectra.com',
      password: 'admin123'
    });
    
    const { token } = loginResponse.data;
    console.log('✅ Admin login successful');
    
    // 2. Get all bookings
    console.log('📋 Fetching all bookings...');
    const bookingsResponse = await axios.get(`${API_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const bookings = bookingsResponse.data;
    console.log(`📊 Found ${bookings.length} bookings`);
    
    if (bookings.length === 0) {
      console.log('⚠️  No bookings found to test deletion');
      return;
    }
    
    // Show first few bookings with detailed info
    console.log('🔍 First 3 bookings:');
    bookings.slice(0, 3).forEach((booking, index) => {
      console.log(`${index + 1}. ID: "${booking.id}" (type: ${typeof booking.id})`);
      console.log(`   Name: ${booking.user.name}`);
      console.log(`   Date: ${booking.date} ${booking.time}`);
      console.log('');
    });
    
    // 3. Test deletion with the first booking
    const testBooking = bookings[0];
    const testId = testBooking.id;
    
    console.log(`🗑️ Testing deletion of booking with ID: "${testId}"`);
    console.log(`📍 ID type: ${typeof testId}`);
    console.log(`📍 ID JSON: ${JSON.stringify(testId)}`);
    
    // 4. Delete the booking
    const deleteResponse = await axios.delete(`${API_URL}/admin/bookings/${testId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Deletion response:', deleteResponse.data);
    
    // 5. Verify deletion
    console.log('🔍 Verifying deletion...');
    const verifyResponse = await axios.get(`${API_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const remainingBookings = verifyResponse.data;
    console.log(`📊 Remaining bookings: ${remainingBookings.length}`);
    
    const bookingStillExists = remainingBookings.some(b => b.id === testId);
    if (bookingStillExists) {
      console.log('❌ Booking still exists after deletion');
    } else {
      console.log('✅ Booking successfully deleted');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('🔍 404 Error Details:');
      console.log('URL:', error.config?.url);
      console.log('Method:', error.config?.method);
      console.log('Headers:', error.config?.headers);
    }
  }
}

// Rulează testul
testBookingDeletion();