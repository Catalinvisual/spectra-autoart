const axios = require('axios');

const API_URL = 'http://localhost:8081/api/admin';
const AUTH_HEADER = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NjE5MjU0LCJleHAiOjE3NjU3MDU2NTR9.yOMwIwbwdGx8M5ijmqqndbZxLUzH4YGjqS9Po29gCoY';

async function debugDatePersistence() {
  try {
    console.log('🔍 Debugging date persistence issue...\n');
    
    // Get current bookings
    console.log('📋 Getting current bookings...');
    const getResponse = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: AUTH_HEADER }
    });
    
    if (getResponse.data.length === 0) {
      console.log('❌ No bookings found to test');
      return;
    }
    
    // Use first booking for testing
    const testBooking = getResponse.data[0];
    const originalDate = testBooking.date;
    const bookingId = testBooking.id;
    
    console.log(`📝 Selected booking ${bookingId}`);
    console.log(`📅 Original date: "${originalDate}"`);
    console.log(`📅 Original date type: ${typeof originalDate}`);
    console.log(`📅 Original date includes 'T': ${originalDate.includes('T')}`);
    
    // Extract date part for comparison
    const originalDatePart = originalDate.includes('T') ? originalDate.split('T')[0] : originalDate;
    console.log(`📅 Original date part: "${originalDatePart}"`);
    
    // Prepare new date (simulate editing from 20 Dec to 29 Dec)
    let newDate;
    if (originalDate.includes('T')) {
      newDate = originalDate.split('T')[0].replace(/\d{4}-\d{2}-\d{2}/, '2025-12-29') + 'T' + originalDate.split('T')[1];
    } else {
      newDate = '2025-12-29';
    }
    
    console.log(`✏️  New date to save: "${newDate}"`);
    
    // Test the comparison logic that would happen on the server
    const serverOriginalDate = originalDate.includes('T') ? originalDate.split('T')[0] : originalDate;
    const serverNewDate = newDate.includes('T') ? newDate.split('T')[0] : newDate;
    
    console.log(`🔍 Server comparison:`);
    console.log(`   Original date (server): "${serverOriginalDate}"`);
    console.log(`   New date (server): "${serverNewDate}"`);
    console.log(`   Are they equal? ${serverOriginalDate === serverNewDate}`);
    console.log(`   Has changes? ${serverOriginalDate !== serverNewDate}`);
    
    if (serverOriginalDate === serverNewDate) {
      console.log('⚠️  Server would think there are no changes!');
      return;
    }
    
    // Update booking with new date
    console.log('\n💾 Saving updated booking...');
    const updateResponse = await axios.patch(`${API_URL}/bookings/${bookingId}`, {
      status: testBooking.status,
      date: newDate,
      time: testBooking.time
    }, {
      headers: { Authorization: AUTH_HEADER }
    });
    
    console.log(`✅ Update response: ${updateResponse.data.message}`);
    
    // Wait a moment and refresh to test persistence
    console.log('\n⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get bookings again to check if date persisted
    console.log('🔄 Refreshing bookings to test persistence...');
    const refreshResponse = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: AUTH_HEADER }
    });
    
    const refreshedBooking = refreshResponse.data.find(b => b.id === bookingId);
    
    console.log(`📊 After refresh - Date: "${refreshedBooking.date}"`);
    console.log(`📊 Expected date: "${newDate}"`);
    
    if (refreshedBooking.date === newDate) {
      console.log('🎉 SUCCESS: Date persisted correctly after refresh!');
    } else {
      console.log('❌ FAILURE: Date reverted after refresh');
      console.log(`   Expected: "${newDate}"`);
      console.log(`   Got:      "${refreshedBooking.date}"`);
      
      // Check if the date was saved in a different format
      const refreshedDatePart = refreshedBooking.date.includes('T') ? refreshedBooking.date.split('T')[0] : refreshedBooking.date;
      const expectedDatePart = newDate.includes('T') ? newDate.split('T')[0] : newDate;
      
      if (refreshedDatePart === expectedDatePart) {
        console.log('💡 The date part matches, but format is different');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

debugDatePersistence();