const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTY5MDcxLCJleHAiOjE3NjU2NTU0NzF9.ifYBKCBYTkBZskjwJY7VqPotXBRCmCraI_wLHettf8Y';

async function checkBookingData() {
  try {
    console.log('🔍 Checking current booking data...');
    console.log('⏰ Current time:', new Date().toISOString());
    
    // Add a cache-busting parameter to force fresh data
    const cacheBuster = Date.now();
    console.log(`🔄 Using cache buster: ${cacheBuster}`);
    
    // Get all bookings
    const response = await axios.get(`${API_BASE}/admin/bookings?t=${cacheBuster}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    
    const bookings = response.data;
    console.log(`Found ${bookings.length} bookings`);
    
    // Debug: Show raw booking data for our test booking
    const rawTestBooking = bookings.find(b => b.id === '1765210107161');
    if (rawTestBooking) {
      console.log('\n🔍 Raw test booking data from server:');
      console.log(`ID: ${rawTestBooking.id}`);
      console.log(`Date: ${rawTestBooking.date}`);
      console.log(`Time: ${rawTestBooking.time}`);
      console.log(`Status: ${rawTestBooking.status}`);
      console.log(`User: ${rawTestBooking.user.name} (${rawTestBooking.user.email})`);
    }
    
    // Find the specific booking we updated
    const testBooking = bookings.find(b => b.id === '1765210107161');
    if (testBooking) {
      console.log('\n📝 Test booking details:');
      console.log(`ID: ${testBooking.id}`);
      console.log(`Date: ${testBooking.date}`);
      console.log(`Time: ${testBooking.time}`);
      console.log(`Status: ${testBooking.status}`);
      console.log(`User: ${testBooking.user.name} (${testBooking.user.email})`);
    } else {
      console.log('❌ Test booking not found!');
    }
    
    // Check availability
    const availabilityResponse = await axios.get(`${API_BASE}/public/bookings/availability`);
    const bookedDates = availabilityResponse.data.bookedDates || [];
    
    console.log('\n📅 Current booked dates:');
    bookedDates.forEach(date => {
      console.log(`- ${date}`);
    });
    
    // Check specific dates
    const oldDate = '2025-12-23';
    const newDate = '2025-12-30';
    
    console.log(`\n🔍 Checking specific dates:`);
    console.log(`Old date (${oldDate}) is booked: ${bookedDates.includes(oldDate)}`);
    console.log(`New date (${newDate}) is booked: ${bookedDates.includes(newDate)}`);
    
  } catch (error) {
    console.error('❌ Error checking data:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error:', error);
  }
}

checkBookingData();