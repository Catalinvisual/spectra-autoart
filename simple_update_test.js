const axios = require('axios');

const API_BASE = 'http://localhost:8081/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1NTY5MDcxLCJleHAiOjE3NjU2NTU0NzF9.ifYBKCBYTkBZskjwJY7VqPotXBRCmCraI_wLHettf8Y';

async function simpleUpdateTest() {
  try {
    console.log('🔄 Testing simple booking update...');
    
    // Get bookings
    const bookingsResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    
    const bookings = bookingsResponse.data;
    const testBooking = bookings.find(b => b.id === '1765210107161');
    
    if (!testBooking) {
      console.log('❌ Test booking not found');
      return;
    }
    
    console.log(`📋 Current booking: ${testBooking.date} at ${testBooking.time}`);
    
    // Try to update just the date
    const newDate = new Date('2025-12-30T09:10:00');
    const newDateString = newDate.toISOString().split('T')[0]; // Doar partea de dată YYYY-MM-DD
    console.log(`📝 Updating to: ${newDateString}`);
    
    const updateResponse = await axios.patch(
      `${API_BASE}/admin/bookings/1765210107161`,
      { date: newDateString },
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    );
    
    console.log('✅ Update response:', updateResponse.data);
    
    // Check if it was actually updated
    const checkResponse = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    
    const updatedBooking = checkResponse.data.find(b => b.id === '1765210107161');
    console.log(`🔍 After update: ${updatedBooking.date} at ${updatedBooking.time}`);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

simpleUpdateTest();