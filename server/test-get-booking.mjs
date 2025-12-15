import fetch from 'node-fetch';

async function testGetBooking() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1Nzk5MjQyLCJleHAiOjE3NjU4ODU2NDJ9.BvOkwI5r7ng7slWp9CFH-mO_X6lrs9nMnsOm-twxHGY';
    
    console.log('🧪 Testing GET booking endpoint...');
    const response = await fetch('http://localhost:8081/api/admin/bookings/1765476764436', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('📊 GET Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.booking) {
      console.log('✅ Booking found:');
      console.log('  - Name:', data.booking.name);
      console.log('  - Status:', data.booking.status);
      console.log('  - Date:', data.booking.date);
      console.log('  - Time:', data.booking.time);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGetBooking();