import fetch from 'node-fetch';

async function testGoogleSheetsSync() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNwZWN0cmEuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY1Nzk5MjQyLCJleHAiOjE3NjU4ODU2NDJ9.BvOkwI5r7ng7slWp9CFH-mO_X6lrs9nMnsOm-twxHGY';
    
    console.log('🧪 Testing Google Sheets sync...');
    
    // Get all bookings to verify the data
    const response = await fetch('http://localhost:8081/api/admin/bookings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('📊 Total bookings:', data.bookings?.length || 0);
    
    // Find the specific booking we updated
    const booking = data.bookings?.find(b => b.id === '1765476764436');
    if (booking) {
      console.log('✅ Found updated booking:');
      console.log('  - ID:', booking.id);
      console.log('  - Name:', booking.name);
      console.log('  - Status:', booking.status);
      console.log('  - Date:', booking.date);
      console.log('  - Time:', booking.time);
    } else {
      console.log('❌ Booking not found in list');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGoogleSheetsSync();