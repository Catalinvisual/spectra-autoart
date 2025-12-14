const axios = require('axios');

const API_URL = 'http://localhost:8081/api/admin';
const AUTH_HEADER = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NjE5MjU0LCJleHAiOjE3NjU3MDU2NTR9.yOMwIwbwdGx8M5ijmqqndbZxLUzH4YGjqS9Po29gCoY';

async function testDatePersistence() {
  try {
    console.log('🧪 Testing date persistence after edit...\n');
    
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
    
    console.log(`📝 Selected booking ${bookingId} with original date: ${originalDate}`);
    
    // Test date format - check if it has 'T'
    console.log(`🔍 Original date format: ${originalDate.includes('T') ? 'ISO format' : 'Simple date format'}`);
    
    // Prepare new date (simulate editing from 20 Dec to 29 Dec)
    let newDate;
    if (originalDate.includes('T')) {
      newDate = originalDate.split('T')[0].replace(/\d{4}-\d{2}-\d{2}/, '2025-12-29') + 'T' + originalDate.split('T')[1];
    } else {
      newDate = '2025-12-29';
    }
    
    console.log(`✏️  Attempting to change date to: ${newDate}`);
    
    // Update booking with new date
    console.log('💾 Saving updated booking...');
    const updateResponse = await axios.patch(`${API_URL}/bookings/${bookingId}`, {
      status: testBooking.status,
      date: newDate,
      time: testBooking.time
    }, {
      headers: { Authorization: AUTH_HEADER }
    });
    
    console.log(`✅ Update response: ${updateResponse.data.message}`);
    
    // Wait a moment and refresh to test persistence
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get bookings again to check if date persisted
    console.log('🔄 Refreshing bookings to test persistence...');
    const refreshResponse = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: AUTH_HEADER }
    });
    
    const refreshedBooking = refreshResponse.data.find(b => b.id === bookingId);
    
    console.log(`📊 After refresh - Date: ${refreshedBooking.date}`);
    console.log(`📊 Expected date: ${newDate}`);
    
    if (refreshedBooking.date === newDate) {
      console.log('🎉 SUCCESS: Date persisted correctly after refresh!');
    } else {
      console.log('❌ FAILURE: Date reverted after refresh');
      console.log(`   Expected: ${newDate}`);
      console.log(`   Got:      ${refreshedBooking.date}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testDatePersistence();